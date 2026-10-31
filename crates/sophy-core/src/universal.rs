use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::process::Command;

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct UniversalMediaInfo {
    pub title: String,
    pub uploader: Option<String>,
    pub duration: Option<f64>,
    pub thumbnail: Option<String>,
    pub extractor: Option<String>,
    pub webpage_url: String,
}

pub struct UniversalDownloader;

fn create_silent_command(program: &std::path::Path) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd
}

impl UniversalDownloader {
    pub async fn ensure_ytdlp_binary() -> Result<PathBuf, String> {
        // 1. Check in same folder as current executable
        if let Ok(exe) = std::env::current_exe() {
            if let Some(parent) = exe.parent() {
                let local = parent.join("yt-dlp.exe");
                if local.exists() && local.metadata().map(|m| m.len()).unwrap_or(0) > 1_000_000 {
                    return Ok(local);
                }
            }
        }

        // 2. Check in LocalAppData/SophyStudio/bin/yt-dlp.exe
        if let Some(local_app_data) = dirs::data_local_dir() {
            let bin_path = local_app_data.join("SophyStudio").join("bin").join("yt-dlp.exe");
            if bin_path.exists() && bin_path.metadata().map(|m| m.len()).unwrap_or(0) > 1_000_000 {
                return Ok(bin_path);
            }
        }

        // 3. Check in System PATH
        if let Ok(output) = {
            #[cfg(windows)]
            {
                let mut c = Command::new("where");
                use std::os::windows::process::CommandExt;
                c.creation_flags(0x08000000);
                c.arg("yt-dlp").output()
            }
            #[cfg(not(windows))]
            {
                Command::new("which").arg("yt-dlp").output()
            }
        } {
            if output.status.success() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                if let Some(first_line) = stdout.lines().next() {
                    let path = PathBuf::from(first_line.trim());
                    if path.exists() {
                        return Ok(path);
                    }
                }
            }
        }

        // 4. Download yt-dlp.exe automatically if not installed
        if let Some(local_app_data) = dirs::data_local_dir() {
            let bin_dir = local_app_data.join("SophyStudio").join("bin");
            let _ = std::fs::create_dir_all(&bin_dir);
            let target_exe = bin_dir.join("yt-dlp.exe");
            let temp_exe = bin_dir.join("yt-dlp.exe.download");

            let client = reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(120))
                .build()
                .unwrap_or_else(|_| reqwest::Client::new());
            let url = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";
            let resp = client.get(url).send().await.map_err(|e| format!("yt-dlp indirilemedi: {}", e))?;
            if resp.status().is_success() {
                let bytes = resp.bytes().await.map_err(|e| format!("Veri okunamadı: {}", e))?;
                if bytes.len() > 1_000_000 {
                    std::fs::write(&temp_exe, bytes).map_err(|e| format!("Dosya yazılamadı: {}", e))?;
                    let _ = std::fs::rename(&temp_exe, &target_exe);
                    return Ok(target_exe);
                }
            }
        }

        Err("yt-dlp motoru bulunamadı ve indirilemedi. Lütfen internet bağlantınızı kontrol edin.".to_string())
    }

    pub async fn fetch_info(url: &str) -> Result<UniversalMediaInfo, String> {
        let ytdlp_path = Self::ensure_ytdlp_binary().await?;

        let output = create_silent_command(&ytdlp_path)
            .args([
                "--dump-json",
                "--no-playlist",
                "--no-warnings",
                "--quiet",
                url,
            ])
            .output()
            .map_err(|e| format!("Komut çalıştırılamadı: {}", e))?;

        if !output.status.success() {
            return Err(classify_ytdlp_error(&String::from_utf8_lossy(&output.stderr)));
        }

        let json_str = String::from_utf8_lossy(&output.stdout);
        let val: serde_json::Value = serde_json::from_str(&json_str)
            .map_err(|e| format!("JSON parse hatası: {}", e))?;

        let title = val["title"]
            .as_str()
            .unwrap_or("Untitled Media")
            .to_string();

        let uploader = val["uploader"]
            .as_str()
            .or_else(|| val["channel"].as_str())
            .or_else(|| val["creator"].as_str())
            .map(|s| s.to_string());

        let duration = val["duration"].as_f64();
        let thumbnail = val["thumbnail"]
            .as_str()
            .or_else(|| val["thumbnails"].as_array().and_then(|a| a.last()).and_then(|t| t["url"].as_str()))
            .map(|s| s.to_string());

        let extractor = val["extractor_key"]
            .as_str()
            .or_else(|| val["extractor"].as_str())
            .map(|s| s.to_string());

        Ok(UniversalMediaInfo {
            title,
            uploader,
            duration,
            thumbnail,
            extractor,
            webpage_url: url.to_string(),
        })
    }

    pub async fn download(
        url: &str,
        format_type: &str, // "video" or "audio"
        out_dir: &Path,
    ) -> Result<String, String> {
        let ytdlp_path = Self::ensure_ytdlp_binary().await?;

        // Ensure ffmpeg is also available so yt-dlp doesn't fail on conversion or merge
        let ffmpeg_res = crate::converter::MediaConverter::ensure_ffmpeg_binary().await;

        // yt-dlp writes into a private temp folder; the finished file is then moved next to the
        // others with the Sophy tag and " (1)" style numbering, so nothing is ever overwritten
        let work = out_dir.join(format!(".sophy-{}", uuid::Uuid::new_v4().simple()));
        std::fs::create_dir_all(&work).map_err(|e| format!("İndirme klasörü oluşturulamadı: {}", e))?;
        let output_template = work.join("%(title).150B.%(ext)s");
        let template_str = output_template.to_string_lossy().to_string();

        let mut cmd = create_silent_command(&ytdlp_path);
        cmd.arg("--no-playlist");
        cmd.arg("--no-warnings");
        cmd.arg("-o");
        cmd.arg(&template_str);

        if let Ok(ref ffmpeg_path) = ffmpeg_res {
            if let Some(parent) = ffmpeg_path.parent() {
                cmd.arg("--ffmpeg-location");
                cmd.arg(parent);
            } else {
                cmd.arg("--ffmpeg-location");
                cmd.arg(ffmpeg_path);
            }
        }

        let fmt = format_type.to_lowercase();
        if fmt == "audio" || fmt == "mp3" {
            cmd.args([
                // Some sites (Pinterest, Reddit, Vimeo HLS...) only expose separate
                // audio/video streams, others only muxed files: accept all of them.
                "-f",
                "ba/b/bv*+ba",
                "-x",
                "--audio-format",
                "mp3",
                "--audio-quality",
                "320k",
            ]);
        } else {
            cmd.args([
                // 1) mp4+m4a pair  2) any video+audio pair (e.g. Pinterest HLS, audio is .mp4)
                // 3) muxed mp4  4) any muxed file  5) video-only (clips without sound)
                "-f",
                "bv*[ext=mp4]+ba[ext=m4a]/bv*+ba/b[ext=mp4]/b/bv*",
                "--merge-output-format",
                "mp4",
            ]);
        }

        cmd.arg(url);

        let output = cmd.output().map_err(|e| format!("İndirme başlatılamadı: {}", e))?;

        if !output.status.success() {
            let _ = std::fs::remove_dir_all(&work);
            return Err(classify_ytdlp_error(&String::from_utf8_lossy(&output.stderr)));
        }
        let tag = crate::paths::SophyPaths::download_tag();
        let mut last = None;
        for f in std::fs::read_dir(&work).map(|r| r.flatten().map(|e| e.path()).collect::<Vec<_>>()).unwrap_or_default() {
            if !f.is_file() || f.extension().is_some_and(|e| e == "part" || e == "ytdl") {
                continue;
            }
            let stem = f.file_stem().map(|s| s.to_string_lossy().to_string()).unwrap_or_else(|| "media".into());
            let ext = f.extension().map(|s| s.to_string_lossy().to_string()).unwrap_or_default();
            let dest = crate::paths::SophyPaths::unique_path(out_dir, &format!("{stem}{tag}"), &ext);
            if std::fs::rename(&f, &dest).is_err() {
                std::fs::copy(&f, &dest).map_err(|e| format!("Dosya taşınamadı: {}", e))?;
            }
            last = Some(dest);
        }
        let _ = std::fs::remove_dir_all(&work);
        match last {
            Some(p) => Ok(p.to_string_lossy().to_string()),
            None => Err("MEDIA_FAILED: no file was written".into()),
        }
    }
}

/// Turns yt-dlp stderr into "CODE: detail" so the UI can show a translated message.
/// Codes: MEDIA_NO_FORMATS, MEDIA_UNSUPPORTED, MEDIA_PRIVATE, MEDIA_FAILED.
fn classify_ytdlp_error(stderr: &str) -> String {
    let detail = stderr
        .lines()
        .rev()
        .find(|l| l.contains("ERROR"))
        .unwrap_or_else(|| stderr.lines().last().unwrap_or(""))
        .trim()
        .to_string();
    let lower = stderr.to_lowercase();
    let code = if lower.contains("requested format is not available")
        || lower.contains("no video formats found")
    {
        "MEDIA_NO_FORMATS"
    } else if lower.contains("unsupported url") {
        "MEDIA_UNSUPPORTED"
    } else if lower.contains("private")
        || lower.contains("login required")
        || lower.contains("sign in")
        || lower.contains("http error 403")
    {
        "MEDIA_PRIVATE"
    } else {
        "MEDIA_FAILED"
    };
    format!("{}: {}", code, detail)
}
