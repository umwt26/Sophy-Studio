//! Optional local language model for the Suno Style Prompter ("AI mode").
//!
//! The model never writes the final prompt or any lyrics. It only rewrites the user's
//! free-form request (any language) into a short English music brief, which the
//! rule engine in the frontend turns into the Suno JSON. That keeps the output format,
//! character limits and the "no ghostwriting" rule guaranteed even with a tiny model.
//!
//! Safety on old PCs: llama.cpp is compiled with AVX2/FMA/F16C/BMI2 (ggml defaults).
//! First-gen Core i3/i5 and old Pentiums lack these, so AI mode is reported as
//! unsupported there and the model is never loaded (no illegal-instruction crash).

use serde::Serialize;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};

const MODEL_FILE: &str = "qwen2.5-0.5b-instruct-q4_k_m.gguf";
const MODEL_URL: &str =
    "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf";
/// Inference threads, kept low so the rest of the app stays responsive on old CPUs.
const THREADS: i32 = 2;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AiStatus {
    /// CPU has the instruction sets the bundled llama.cpp needs.
    pub cpu_supported: bool,
    pub missing_cpu_features: Vec<String>,
    pub model_downloaded: bool,
    pub model_size_bytes: Option<u64>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DownloadProgress {
    pub downloaded: u64,
    pub total: Option<u64>,
}

fn models_dir() -> Option<PathBuf> {
    dirs_local().map(|d| d.join("SophyStudio").join("models"))
}

fn dirs_local() -> Option<PathBuf> {
    std::env::var_os("LOCALAPPDATA")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("HOME").map(|h| PathBuf::from(h).join(".local").join("share")))
}

fn model_path() -> Option<PathBuf> {
    models_dir().map(|d| d.join(MODEL_FILE))
}

fn missing_cpu_features() -> Vec<String> {
    #[allow(unused_mut)]
    let mut missing = Vec::new();
    #[cfg(target_arch = "x86_64")]
    {
        let checks: [(&str, bool); 6] = [
            ("SSE4.2", std::arch::is_x86_feature_detected!("sse4.2")),
            ("AVX", std::arch::is_x86_feature_detected!("avx")),
            ("AVX2", std::arch::is_x86_feature_detected!("avx2")),
            ("FMA", std::arch::is_x86_feature_detected!("fma")),
            ("F16C", std::arch::is_x86_feature_detected!("f16c")),
            ("BMI2", std::arch::is_x86_feature_detected!("bmi2")),
        ];
        for (name, ok) in checks {
            if !ok {
                missing.push(name.to_string());
            }
        }
    }
    missing
}

fn is_valid_model_file(p: &std::path::Path) -> bool {
    use std::io::Read;
    let Ok(meta) = std::fs::metadata(p) else { return false };
    if meta.len() < 100_000_000 {
        return false;
    }
    let mut magic = [0u8; 4];
    std::fs::File::open(p)
        .and_then(|mut f| f.read_exact(&mut magic))
        .map(|_| &magic == b"GGUF")
        .unwrap_or(false)
}

pub fn status() -> AiStatus {
    let missing = missing_cpu_features();
    let path = model_path();
    let downloaded = path.as_deref().map(is_valid_model_file).unwrap_or(false);
    AiStatus {
        cpu_supported: missing.is_empty(),
        missing_cpu_features: missing,
        model_downloaded: downloaded,
        model_size_bytes: path.and_then(|p| std::fs::metadata(p).ok()).map(|m| m.len()),
    }
}

/// Downloads the model once, verifying it against the SHA-256 Hugging Face publishes
/// for the file (X-Linked-ETag on the resolve URL) and the GGUF magic.
pub async fn download(on_progress: impl Fn(DownloadProgress)) -> Result<(), String> {
    use sha2::{Digest, Sha256};
    use std::io::Write;

    if !missing_cpu_features().is_empty() {
        return Err("AI_CPU_UNSUPPORTED".into());
    }
    let dir = models_dir().ok_or("AI_DOWNLOAD_FAILED: no app data folder")?;
    std::fs::create_dir_all(&dir).map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
    let final_path = dir.join(MODEL_FILE);
    let part_path = dir.join(format!("{MODEL_FILE}.part"));

    let ua = format!("Sophy-Studio/{}", env!("CARGO_PKG_VERSION"));
    // 1) Ask the resolve URL without following the redirect to read the published hash.
    let probe = reqwest::Client::builder()
        .user_agent(&ua)
        .redirect(reqwest::redirect::Policy::none())
        .connect_timeout(std::time::Duration::from_secs(20))
        .build()
        .map_err(|e| e.to_string())?;
    let head = probe
        .get(MODEL_URL)
        .send()
        .await
        .map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
    let expected_sha = head
        .headers()
        .get("x-linked-etag")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.trim_matches('"').to_lowercase())
        .filter(|s| s.len() == 64);
    let location = head
        .headers()
        .get("location")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string());
    let url = match location {
        Some(l) if l.starts_with("http") => l,
        Some(l) => format!("https://huggingface.co{l}"),
        None => MODEL_URL.to_string(),
    };

    // 2) Stream the file with progress events.
    let client = reqwest::Client::builder()
        .user_agent(&ua)
        .connect_timeout(std::time::Duration::from_secs(20))
        .build()
        .map_err(|e| e.to_string())?;
    let mut resp = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
    if !resp.status().is_success() {
        return Err(format!("AI_DOWNLOAD_FAILED: HTTP {}", resp.status()));
    }
    let total = resp.content_length();
    let mut file = std::fs::File::create(&part_path).map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
    let mut hasher = Sha256::new();
    let mut downloaded: u64 = 0;
    let mut last_emit = std::time::Instant::now();
    loop {
        let chunk = resp
            .chunk()
            .await
            .map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
        let Some(chunk) = chunk else { break };
        file.write_all(&chunk).map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
        hasher.update(&chunk);
        downloaded += chunk.len() as u64;
        if last_emit.elapsed().as_millis() > 200 {
            on_progress(DownloadProgress { downloaded, total });
            last_emit = std::time::Instant::now();
        }
    }
    file.flush().map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
    drop(file);
    on_progress(DownloadProgress { downloaded, total });

    if let Some(t) = total {
        if t != downloaded {
            let _ = std::fs::remove_file(&part_path);
            return Err("AI_DOWNLOAD_CORRUPT: incomplete download".into());
        }
    }
    let actual: String = hasher.finalize().iter().map(|b| format!("{b:02x}")).collect();
    if let Some(exp) = expected_sha {
        if exp != actual {
            let _ = std::fs::remove_file(&part_path);
            return Err("AI_DOWNLOAD_CORRUPT: checksum mismatch".into());
        }
    }
    if !is_valid_model_file(&part_path) {
        let _ = std::fs::remove_file(&part_path);
        return Err("AI_DOWNLOAD_CORRUPT: not a GGUF model".into());
    }
    let _ = std::fs::remove_file(&final_path);
    std::fs::rename(&part_path, &final_path).map_err(|e| format!("AI_DOWNLOAD_FAILED: {e}"))?;
    Ok(())
}

pub fn delete_model() -> Result<(), String> {
    unload();
    if let Some(p) = model_path() {
        let _ = std::fs::remove_file(p);
    }
    Ok(())
}

// ------------------------------------------------------------------ inference

/// llama.cpp's backend may only be initialised once per process, so it lives forever;
/// the model itself can be loaded/unloaded.
fn backend() -> Result<&'static llama_cpp_2::llama_backend::LlamaBackend, String> {
    static BACKEND: OnceLock<Result<llama_cpp_2::llama_backend::LlamaBackend, String>> = OnceLock::new();
    BACKEND
        .get_or_init(|| {
            let mut b = llama_cpp_2::llama_backend::LlamaBackend::init().map_err(|e| format!("AI_FAILED: {e}"))?;
            b.void_logs();
            Ok(b)
        })
        .as_ref()
        .map_err(|e| e.clone())
}

fn engine_slot() -> &'static Mutex<Option<llama_cpp_2::model::LlamaModel>> {
    static SLOT: OnceLock<Mutex<Option<llama_cpp_2::model::LlamaModel>>> = OnceLock::new();
    SLOT.get_or_init(|| Mutex::new(None))
}

fn unload() {
    if let Ok(mut g) = engine_slot().lock() {
        *g = None;
    }
}

const SYSTEM_PROMPT: &str = "You rewrite a music request written in any language into one short English request for a song prompt builder. \
Use standard English music terms: genre, instruments, mood, vocals (male/female/instrumental), BPM, musical key and song sections \
(intro, verse, pre-chorus, chorus, hook, bridge, drop, beat switch, solo, outro). \
If the request changes an existing song, keep the edit verbs: add, remove, more, less, set. \
Never write lyrics. Output only the English request, nothing else.";

const FEW_SHOT: [(&str, &str); 3] = [
    (
        "أريد أغنية راب حزينة مع بيانو وصوت نسائي، ١٤٠ نبضة",
        "A sad rap song with piano and female vocals, 140 BPM",
    ),
    (
        "Basları biraz kıs ve girişe saksafon ekle",
        "less bass, add saxophone to the intro",
    ),
    (
        "Ein ruhiger Song zum Lernen ohne Gesang, mit Regengeräuschen",
        "A chill lo-fi instrumental song with ambient rain texture, no vocals",
    ),
];

fn chatml(user: &str) -> String {
    let mut s = format!("<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n");
    for (q, a) in FEW_SHOT {
        s.push_str(&format!("<|im_start|>user\n{q}<|im_end|>\n<|im_start|>assistant\n{a}<|im_end|>\n"));
    }
    s.push_str(&format!("<|im_start|>user\n{user}<|im_end|>\n<|im_start|>assistant\n"));
    s
}

/// Blocking: call from a worker thread.
pub fn understand(user: &str) -> Result<String, String> {
    use llama_cpp_2::context::params::LlamaContextParams;
    use llama_cpp_2::llama_batch::LlamaBatch;
    use llama_cpp_2::model::params::LlamaModelParams;
    use llama_cpp_2::model::LlamaModel;
    use llama_cpp_2::sampling::LlamaSampler;
    use std::num::NonZeroU32;

    if !missing_cpu_features().is_empty() {
        return Err("AI_CPU_UNSUPPORTED".into());
    }
    let path = model_path().ok_or("AI_MODEL_MISSING")?;
    if !is_valid_model_file(&path) {
        return Err("AI_MODEL_MISSING".into());
    }

    let backend = backend()?;
    let mut guard = engine_slot().lock().map_err(|_| "AI_FAILED: lock poisoned".to_string())?;
    if guard.is_none() {
        let model = LlamaModel::load_from_file(backend, &path, &LlamaModelParams::default())
            .map_err(|e| format!("AI_FAILED: {e}"))?;
        *guard = Some(model);
    }
    let model = guard.as_ref().unwrap();

    let ctx_params = LlamaContextParams::default()
        .with_n_ctx(NonZeroU32::new(2048))
        .with_n_batch(512)
        .with_n_threads(THREADS)
        .with_n_threads_batch(THREADS);
    let mut ctx = model
        .new_context(backend, ctx_params)
        .map_err(|e| format!("AI_FAILED: {e}"))?;

    let user: String = user.chars().take(1200).collect();
    let vocab = model.vocab();
    let tokens = vocab.tokenize(chatml(&user).as_bytes(), false, true);
    if tokens.is_empty() || tokens.len() > 1800 {
        return Err("AI_FAILED: prompt too long".into());
    }

    let mut batch = LlamaBatch::new(512.max(tokens.len()), 1);
    let last = tokens.len() - 1;
    for (i, t) in tokens.iter().enumerate() {
        batch
            .add(*t, i as i32, &[0], i == last)
            .map_err(|e| format!("AI_FAILED: {e}"))?;
    }
    ctx.decode(&mut batch).map_err(|e| format!("AI_FAILED: {e}"))?;

    let mut sampler = LlamaSampler::greedy();
    let mut out: Vec<u8> = Vec::new();
    let mut n_cur = tokens.len() as i32;
    for _ in 0..160 {
        let token = sampler.sample(&ctx, batch.n_tokens() - 1);
        sampler.accept(token);
        if vocab.is_eog(token) {
            break;
        }
        out.extend_from_slice(&vocab.token_to_piece(token, false, None));
        if out.contains(&b'\n') && out.len() > 8 {
            break;
        }
        batch.clear();
        batch
            .add(token, n_cur, &[0], true)
            .map_err(|e| format!("AI_FAILED: {e}"))?;
        n_cur += 1;
        ctx.decode(&mut batch).map_err(|e| format!("AI_FAILED: {e}"))?;
    }

    let text = String::from_utf8_lossy(&out)
        .lines()
        .next()
        .unwrap_or("")
        .trim()
        .trim_matches('"')
        .to_string();
    if text.is_empty() {
        return Err("AI_FAILED: empty answer".into());
    }
    Ok(text)
}
