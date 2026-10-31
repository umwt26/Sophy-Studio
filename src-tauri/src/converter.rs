//! File Converter: the in-app page, the small window opened from Explorer's right-click menu
//! (`sophy.exe --convert <preset> <file>`), and that menu's registration.
//!
//! Explorer starts one process per selected file. The first one becomes the "host" (it holds
//! an exclusive lock file) and shows the window; the others drop their job into a queue folder
//! and exit, so a multi-file selection ends up in one window.

use serde::{Deserialize, Serialize};
use sophy_core::file_converter::{self, CancelHandle};
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Serialize, Deserialize)]
pub struct Job {
    pub id: String,
    pub path: String,
    pub preset: String,
}

#[derive(Clone, Serialize)]
struct Progress {
    id: String,
    progress: f32,
    /// running | done | error | cancelled
    state: &'static str,
    output: Option<String>,
    error: Option<String>,
    /// Compressor: sizes in bytes
    before: Option<u64>,
    after: Option<u64>,
}

fn running() -> &'static Mutex<HashMap<String, CancelHandle>> {
    static R: OnceLock<Mutex<HashMap<String, CancelHandle>>> = OnceLock::new();
    R.get_or_init(Default::default)
}

/// Jobs of the right-click window (host process only).
fn session() -> &'static Mutex<Vec<Job>> {
    static S: OnceLock<Mutex<Vec<Job>>> = OnceLock::new();
    S.get_or_init(Default::default)
}

fn new_id() -> String {
    use std::sync::atomic::{AtomicU64, Ordering};
    static N: AtomicU64 = AtomicU64::new(0);
    let t = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_nanos()).unwrap_or(0);
    format!("{t:x}-{}-{}", std::process::id(), N.fetch_add(1, Ordering::Relaxed))
}

fn data_dir() -> PathBuf {
    std::env::var_os("LOCALAPPDATA")
        .map(PathBuf::from)
        .unwrap_or_else(std::env::temp_dir)
        .join("SophyStudio")
}

// ------------------------------------------------------------------ commands

/// Presets that every given file supports, in menu order.
#[tauri::command]
pub fn converter_presets(paths: Vec<String>) -> Vec<String> {
    let paths: Vec<PathBuf> = paths.into_iter().map(PathBuf::from).collect();
    file_converter::common_presets(&paths)
}

#[tauri::command]
pub async fn converter_pick_files(title: Option<String>, any: Option<bool>) -> Vec<String> {
    let exts: Vec<&str> = file_converter::all_extensions().collect();
    let mut dialog = rfd::AsyncFileDialog::new().set_title(title.unwrap_or_else(|| "Sophy Studio".into()));
    // the Compressor takes any file
    if !any.unwrap_or(false) {
        dialog = dialog.add_filter("Media", &exts);
    }
    dialog
        .pick_files()
        .await
        .unwrap_or_default()
        .into_iter()
        .map(|f| f.path().to_string_lossy().to_string())
        .collect()
}

/// Converts (or, with preset "compress", compresses) one file in the background; progress
/// arrives as "converter-progress" events.
#[tauri::command]
pub async fn converter_start(app: AppHandle, id: String, path: String, preset: String) -> Result<(), String> {
    let ffmpeg = sophy_core::MediaConverter::ensure_ffmpeg_binary().await?;
    let cancel = CancelHandle::default();
    running().lock().unwrap().insert(id.clone(), cancel.clone());
    let emit = move |p: Progress| {
        let _ = app.emit("converter-progress", p);
    };
    tauri::async_runtime::spawn_blocking(move || {
        let mut last = -1.0f32;
        let on_progress = |p: f32| {
            // a few updates per percent are plenty
            if p - last >= 0.01 || p >= 1.0 {
                last = p;
                emit(Progress { id: id.clone(), progress: p, state: "running", output: None, error: None, before: None, after: None });
            }
        };
        let result: Result<(PathBuf, Option<u64>, Option<u64>), String> = if preset == "compress" {
            sophy_core::compressor::compress(&ffmpeg, Path::new(&path), &cancel, on_progress).map(|c| (c.output, Some(c.before), Some(c.after)))
        } else {
            file_converter::convert(&ffmpeg, Path::new(&path), &preset, &cancel, on_progress).map(|o| (o, None, None))
        };
        running().lock().unwrap().remove(&id);
        let done = match result {
            Ok((out, before, after)) => Progress { id: id.clone(), progress: 1.0, state: "done", output: Some(out.to_string_lossy().to_string()), error: None, before, after },
            Err(e) if e == "CANCELLED" => Progress { id: id.clone(), progress: 0.0, state: "cancelled", output: None, error: None, before: None, after: None },
            Err(e) => Progress { id: id.clone(), progress: 0.0, state: "error", output: None, error: Some(e), before: None, after: None },
        };
        emit(done);
    });
    Ok(())
}

#[tauri::command]
pub fn converter_cancel(id: String) {
    if let Some(c) = running().lock().unwrap().get(&id) {
        c.cancel();
    }
}

// ------------------------------------------------------------------ preview

#[derive(Serialize)]
pub struct PreviewFile {
    /// file the pop-up loads (the original, or a temporary playable copy)
    path: String,
    /// image | video | audio | pdf | text
    kind: &'static str,
}

const PLAY_IMAGE: &[&str] = &["png", "jpg", "jpeg", "jfif", "webp", "bmp", "gif", "ico", "svg", "avif"];
const PLAY_VIDEO: &[&str] = &["mp4", "m4v", "webm", "ogv", "mov"];
const PLAY_AUDIO: &[&str] = &["mp3", "wav", "flac", "ogg", "oga", "opus", "m4a", "aac", "m4b"];
const TEXT: &[&str] = &["txt", "md", "json", "csv", "log", "lrc", "srt", "vtt", "xml", "ini", "yml", "yaml"];

/// What the pop-up should show for a file. Formats the web view can't play itself (MKV, AVI,
/// WMV, WMA, AIFF, TIFF …) get a temporary copy it can (re-wrapped when the codec allows,
/// otherwise a quick re-encode); progress arrives as "preview-progress" (0…1).
#[tauri::command]
pub async fn preview_prepare(app: AppHandle, path: String) -> Result<PreviewFile, String> {
    use tauri::Manager;
    let src = PathBuf::from(&path);
    if !src.exists() {
        return Err("NOT_FOUND".into());
    }
    let ext = src.extension().and_then(|e| e.to_str()).unwrap_or("").to_ascii_lowercase();
    let e = ext.as_str();
    let allow = |p: &Path| app.asset_protocol_scope().allow_file(p).map_err(|e| e.to_string());
    let direct = if PLAY_IMAGE.contains(&e) {
        Some("image")
    } else if PLAY_VIDEO.contains(&e) {
        Some("video")
    } else if PLAY_AUDIO.contains(&e) {
        Some("audio")
    } else if e == "pdf" {
        Some("pdf")
    } else if TEXT.contains(&e) {
        Some("text")
    } else {
        None
    };
    if let Some(kind) = direct {
        allow(&src)?;
        return Ok(PreviewFile { path, kind });
    }
    let cat = file_converter::category_of(&src).ok_or("UNSUPPORTED")?;

    // cached copy per file version (path + size + modified time)
    use std::hash::{Hash, Hasher};
    let meta = std::fs::metadata(&src).map_err(|e| e.to_string())?;
    let mut h = std::collections::hash_map::DefaultHasher::new();
    (path.as_str(), meta.len(), meta.modified().ok()).hash(&mut h);
    let dir = std::env::temp_dir().join("SophyStudio").join("preview");
    let _ = std::fs::create_dir_all(&dir);
    let (kind, out_ext) = match cat {
        file_converter::Category::Video => ("video", "mp4"),
        file_converter::Category::Audio => ("audio", "m4a"),
        _ => ("image", "png"),
    };
    let out = dir.join(format!("{:x}.{out_ext}", h.finish()));
    if !out.exists() {
        let ffmpeg = sophy_core::MediaConverter::ensure_ffmpeg_binary().await?;
        let (app2, src2, out2) = (app.clone(), src.clone(), out.clone());
        tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
            let s = |v: &[&str]| v.iter().map(|x| x.to_string()).collect::<Vec<String>>();
            let emit = |p: f32| {
                let _ = app2.emit("preview-progress", p);
            };
            let cancel = CancelHandle::default();
            match kind {
                "video" => {
                    // H.264 inside MKV/AVI/FLV only needs a new container: seconds instead of minutes
                    let copy = s(&["-map", "0:v:0", "-map", "0:a:0?", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart"]);
                    let encode = s(&["-map", "0:v:0", "-map", "0:a:0?", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "26", "-vf", "scale='min(1280,iw)':-2", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart"]);
                    if file_converter::video_codec(&ffmpeg, &src2).as_deref() == Some("h264")
                        && file_converter::run_ffmpeg(&ffmpeg, &src2, &copy, &out2, &cancel, emit).is_ok()
                    {
                        return Ok(());
                    }
                    file_converter::run_ffmpeg(&ffmpeg, &src2, &encode, &out2, &cancel, emit)
                }
                "audio" => file_converter::run_ffmpeg(&ffmpeg, &src2, &s(&["-vn", "-c:a", "aac", "-b:a", "192k"]), &out2, &cancel, emit),
                _ => file_converter::run_ffmpeg(&ffmpeg, &src2, &s(&["-frames:v", "1", "-update", "1"]), &out2, &cancel, emit),
            }
        })
        .await
        .map_err(|e| e.to_string())??;
    }
    allow(&out)?;
    Ok(PreviewFile { path: out.to_string_lossy().to_string(), kind })
}

/// Lets the preview pop-up load this one file (asset protocol; nothing else on disk is reachable).
#[tauri::command]
pub fn converter_allow_preview(app: AppHandle, path: String) -> Result<(), String> {
    use tauri::Manager;
    app.asset_protocol_scope().allow_file(&path).map_err(|e| e.to_string())
}

/// Opens Explorer with the file selected.
#[tauri::command]
pub fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        let _ = std::process::Command::new("explorer")
            .raw_arg(format!("/select,\"{}\"", path.replace('"', "")))
            .creation_flags(0x08000000)
            .spawn();
    }
    #[cfg(not(target_os = "windows"))]
    let _ = path;
}

/// Jobs of the right-click window so far (later ones arrive as "converter-jobs").
#[tauri::command]
pub fn converter_session() -> Vec<Job> {
    session().lock().unwrap().clone()
}

// ------------------------------------------------------------------ right-click window

/// Exclusive lock: only one host process at a time.
fn try_lock() -> Option<std::fs::File> {
    let dir = data_dir().join("convert");
    let _ = std::fs::create_dir_all(dir.join("queue"));
    let mut o = std::fs::OpenOptions::new();
    o.write(true).create(true).truncate(true);
    #[cfg(windows)]
    {
        use std::os::windows::fs::OpenOptionsExt;
        o.share_mode(0);
    }
    o.open(dir.join("host.lock")).ok()
}

fn queue_dir() -> PathBuf {
    data_dir().join("convert").join("queue")
}

fn take_queued() -> Vec<Job> {
    let mut jobs = Vec::new();
    let Ok(entries) = std::fs::read_dir(queue_dir()) else { return jobs };
    let mut files: Vec<PathBuf> = entries.flatten().map(|e| e.path()).filter(|p| p.extension().is_some_and(|e| e == "job")).collect();
    files.sort();
    for f in files {
        if let Ok(data) = std::fs::read(&f) {
            if let Ok(job) = serde_json::from_slice::<Job>(&data) {
                jobs.push(job);
            }
        }
        let _ = std::fs::remove_file(&f);
    }
    jobs
}

/// Entry point for `sophy.exe --convert <preset> <file>…`.
pub fn run_from_explorer(preset: String, files: Vec<String>) {
    let jobs: Vec<Job> = files.into_iter().map(|path| Job { id: new_id(), path, preset: preset.clone() }).collect();
    if jobs.is_empty() {
        return;
    }

    // Another window is open: hand the files over. If it closes before picking them up,
    // become the host ourselves.
    let mut jobs = jobs;
    let mut lock = try_lock();
    if lock.is_none() {
        let mut written = Vec::new();
        for job in &jobs {
            let f = queue_dir().join(format!("{}.job", job.id));
            if std::fs::write(&f, serde_json::to_vec(job).unwrap_or_default()).is_ok() {
                written.push(f);
            }
        }
        for _ in 0..20 {
            std::thread::sleep(std::time::Duration::from_millis(150));
            if written.iter().all(|f| !f.exists()) {
                return;
            }
            lock = try_lock();
            if lock.is_some() {
                break;
            }
        }
        if lock.is_none() {
            return;
        }
        // we are the host now: our own jobs are read back from the queue below
        jobs.clear();
    }
    let _lock = lock;
    session().lock().unwrap().extend(jobs);
    session().lock().unwrap().extend(take_queued());

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            converter_start,
            converter_cancel,
            converter_session,
            show_in_folder
        ])
        .setup(move |app| {
            let title = if preset == "compress" { "Sophy Studio Compressor" } else { "Sophy Studio Converter" };
            let window = tauri::WebviewWindowBuilder::new(app, "converter", tauri::WebviewUrl::App("index.html".into()))
                .title(title)
                .inner_size(460.0, 440.0)
                .min_inner_size(400.0, 320.0)
                .center()
                .visible(false)
                .focused(true)
                .background_color(tauri::window::Color(15, 16, 19, 255))
                .initialization_script("window.__SOPHY_CONVERTER__ = true;")
                .build()?;
            let _ = window.set_icon(tauri::include_image!("icons/icon.png"));

            // files selected together arrive a moment later through the queue
            let handle = app.handle().clone();
            std::thread::spawn(move || loop {
                std::thread::sleep(std::time::Duration::from_millis(300));
                let more = take_queued();
                if !more.is_empty() {
                    session().lock().unwrap().extend(more.clone());
                    let _ = handle.emit("converter-jobs", more);
                }
                if handle.get_webview_window("converter").is_none() {
                    break;
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running the converter window");
}

// ------------------------------------------------------------------ Explorer menu

const VERB: &str = "SophyStudioConverter";

#[derive(Deserialize)]
pub struct MenuLabels {
    /// "Sophy Studio Converter"
    title: String,
    /// preset output → label ("mp3" → "To MP3", "mp4-low" → "To MP4 (low quality)")
    outputs: HashMap<String, String>,
    /// modifier → label ("scale75" → "Scale 75%")
    groups: HashMap<String, String>,
    /// "Sophy Studio Compressor" (one entry for every file type)
    compress: Option<String>,
}

const COMPRESS_VERB: &str = "SophyStudioCompressor";

fn reg_str(s: &str) -> String {
    format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\""))
}

/// The .reg text: removes the old entries, then (when enabling) adds the menu for each type.
fn menu_reg(exe: &str, labels: Option<&MenuLabels>) -> String {
    let base = |ext: &str| format!("HKEY_CURRENT_USER\\Software\\Classes\\SystemFileAssociations\\.{ext}\\shell\\{VERB}");
    let mut out = String::from("Windows Registry Editor Version 5.00\r\n\r\n");
    for ext in file_converter::all_extensions() {
        out += &format!("[-{}]\r\n", base(ext));
    }
    let compress_key = format!("HKEY_CURRENT_USER\\Software\\Classes\\*\\shell\\{COMPRESS_VERB}");
    out += &format!("[-{compress_key}]\r\n");
    let Some(l) = labels else { return out };
    let icon = reg_str(&format!("\"{exe}\",0"));
    // Compressor: one entry for any file ("*")
    if let Some(title) = &l.compress {
        let cmd = reg_str(&format!("\"{exe}\" --compress \"%1\""));
        out += &format!("\r\n[{compress_key}]\r\n\"MUIVerb\"={}\r\n\"Icon\"={icon}\r\n\"MultiSelectModel\"=\"Player\"\r\n\r\n[{compress_key}\\command]\r\n@={cmd}\r\n", reg_str(title));
    }
    for ext in file_converter::all_extensions() {
        let Some(cat) = file_converter::category_of(Path::new(&format!("x.{ext}"))) else { continue };
        let key = base(ext);
        out += &format!("\r\n[{key}]\r\n\"MUIVerb\"={}\r\n\"Icon\"={icon}\r\n\"SubCommands\"=\"\"\r\n", reg_str(&l.title));
        let mut groups: Vec<(String, Vec<String>)> = Vec::new();
        let mut i = 0;
        for preset in file_converter::presets_for(cat) {
            let (group, output) = match preset.split_once(':') {
                Some((g, o)) => (Some(g.to_string()), o.to_string()),
                None => (None, preset.clone()),
            };
            match group {
                None => {
                    i += 1;
                    let label = l.outputs.get(&output).cloned().unwrap_or_else(|| output.to_uppercase());
                    let cmd = reg_str(&format!("\"{exe}\" --convert {preset} \"%1\""));
                    out += &format!("\r\n[{key}\\shell\\a{i:02}_{output}]\r\n\"MUIVerb\"={}\r\n\"MultiSelectModel\"=\"Player\"\r\n\r\n[{key}\\shell\\a{i:02}_{output}\\command]\r\n@={cmd}\r\n", reg_str(&label));
                }
                Some(g) => match groups.iter_mut().find(|(name, _)| *name == g) {
                    Some((_, list)) => list.push(preset),
                    None => groups.push((g, vec![preset])),
                },
            }
        }
        for (gi, (g, presets)) in groups.iter().enumerate() {
            let gkey = format!("{key}\\shell\\b{:02}_{g}", gi + 1);
            let glabel = l.groups.get(g).cloned().unwrap_or_else(|| g.clone());
            out += &format!("\r\n[{gkey}]\r\n\"MUIVerb\"={}\r\n\"SubCommands\"=\"\"\r\n", reg_str(&glabel));
            for (pi, preset) in presets.iter().enumerate() {
                let output = preset.split_once(':').map(|(_, o)| o).unwrap_or(preset);
                let label = l.outputs.get(output).cloned().unwrap_or_else(|| output.to_uppercase());
                let cmd = reg_str(&format!("\"{exe}\" --convert {preset} \"%1\""));
                out += &format!("\r\n[{gkey}\\shell\\a{:02}_{output}]\r\n\"MUIVerb\"={}\r\n\"MultiSelectModel\"=\"Player\"\r\n\r\n[{gkey}\\shell\\a{:02}_{output}\\command]\r\n@={cmd}\r\n", pi + 1, reg_str(&label), pi + 1);
            }
        }
    }
    out
}

/// Adds or removes "Sophy Studio Converter" in Explorer's right-click menu (current user,
/// no admin rights). Skips the work when nothing changed since the last time.
#[tauri::command]
pub fn converter_context_menu(enable: bool, labels: Option<MenuLabels>) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        let exe = std::env::current_exe().map_err(|e| e.to_string())?.to_string_lossy().to_string();
        let text = menu_reg(&exe, if enable { labels.as_ref() } else { None });

        use std::hash::{Hash, Hasher};
        let mut h = std::collections::hash_map::DefaultHasher::new();
        text.hash(&mut h);
        let stamp = format!("{:x}", h.finish());
        let stamp_file = data_dir().join("convert").join("menu.stamp");
        if std::fs::read_to_string(&stamp_file).ok().as_deref() == Some(stamp.as_str()) {
            return Ok(());
        }

        // .reg files are UTF-16 LE with a BOM
        let mut bytes = vec![0xFF, 0xFE];
        for u in text.encode_utf16() {
            bytes.extend_from_slice(&u.to_le_bytes());
        }
        let _ = std::fs::create_dir_all(data_dir().join("convert"));
        let file = data_dir().join("convert").join("menu.reg");
        std::fs::write(&file, bytes).map_err(|e| e.to_string())?;
        let ok = std::process::Command::new("reg")
            .arg("import")
            .arg(&file)
            .creation_flags(0x08000000)
            .status()
            .map(|s| s.success())
            .unwrap_or(false);
        let _ = std::fs::remove_file(&file);
        if !ok {
            return Err("MENU_FAILED".into());
        }
        let _ = std::fs::write(stamp_file, stamp);
    }
    #[cfg(not(target_os = "windows"))]
    let _ = (enable, labels);
    Ok(())
}
