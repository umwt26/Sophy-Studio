use std::path::{Path, PathBuf};
use std::process::Command;

pub struct MediaConverter;

fn create_silent_command(program: &Path) -> Command {
    let mut cmd = Command::new(program);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }
    cmd
}

impl MediaConverter {
    pub async fn ensure_ffmpeg_binary() -> Result<PathBuf, String> {
        // 1. Check in same folder as current executable
        if let Ok(exe) = std::env::current_exe() {
            if let Some(parent) = exe.parent() {
                let local = parent.join("ffmpeg.exe");
                if local.exists() && local.metadata().map(|m| m.len()).unwrap_or(0) > 1_000_000 {
                    return Ok(local);
                }
            }
        }

        // 2. Check in LocalAppData/SophyStudio/bin/ffmpeg.exe
        if let Some(local_app_data) = dirs::data_local_dir() {
            let bin_path = local_app_data.join("SophyStudio").join("bin").join("ffmpeg.exe");
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
                c.arg("ffmpeg").output()
            }
            #[cfg(not(windows))]
            {
                Command::new("which").arg("ffmpeg").output()
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

        // 4. Download ffmpeg.exe automatically if missing
        if let Some(local_app_data) = dirs::data_local_dir() {
            let bin_dir = local_app_data.join("SophyStudio").join("bin");
            let _ = std::fs::create_dir_all(&bin_dir);
            let target_exe = bin_dir.join("ffmpeg.exe");
            let temp_exe = bin_dir.join("ffmpeg.exe.download");

            let client = reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(300))
                .build()
                .unwrap_or_else(|_| reqwest::Client::new());

            let url = "https://github.com/eugeneware/ffmpeg-static/releases/latest/download/ffmpeg-win32-x64";
            let resp = client.get(url).send().await.map_err(|e| format!("FFmpeg indirilemedi: {}", e))?;
            if resp.status().is_success() {
                let bytes = resp.bytes().await.map_err(|e| format!("FFmpeg verisi okunamadı: {}", e))?;
                if bytes.len() > 1_000_000 {
                    std::fs::write(&temp_exe, bytes).map_err(|e| format!("FFmpeg yazılamadı: {}", e))?;
                    let _ = std::fs::rename(&temp_exe, &target_exe);
                    return Ok(target_exe);
                }
            }
        }

        Err("FFmpeg ses motoru bulunamadı ve otomatik indirilemedi. Lütfen internet bağlantınızı kontrol edin.".to_string())
    }

    pub async fn convert_to_mp3(input_file: &Path, output_file: &Path) -> Result<(), String> {
        let ffmpeg_path = Self::ensure_ffmpeg_binary().await?;
        let output = create_silent_command(&ffmpeg_path)
            .args([
                "-y",
                "-i",
                input_file.to_str().unwrap(),
                "-vn",
                "-c:a",
                "libmp3lame",
                "-b:a",
                "320k",
                output_file.to_str().unwrap(),
            ])
            .output()
            .map_err(|e| format!("Failed to run FFmpeg for MP3 conversion: {}", e))?;

        if output.status.success() {
            Ok(())
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(format!("FFmpeg MP3 conversion failed: {}", stderr.trim()))
        }
    }

    pub async fn convert_to_wav(input_file: &Path, output_file: &Path) -> Result<(), String> {
        let ffmpeg_path = Self::ensure_ffmpeg_binary().await?;
        let output = create_silent_command(&ffmpeg_path)
            .args([
                "-y",
                "-i",
                input_file.to_str().unwrap(),
                "-vn",
                "-c:a",
                "pcm_s16le",
                "-ar",
                "44100",
                output_file.to_str().unwrap(),
            ])
            .output()
            .map_err(|e| format!("Failed to run FFmpeg for WAV conversion: {}", e))?;

        if output.status.success() {
            Ok(())
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(format!("FFmpeg WAV conversion failed: {}", stderr.trim()))
        }
    }

    pub async fn render_cover_video(
        audio_file: &Path,
        cover_image: &Path,
        output_mp4: &Path,
    ) -> Result<(), String> {
        let ffmpeg_path = Self::ensure_ffmpeg_binary().await?;
        let output = create_silent_command(&ffmpeg_path)
            .args([
                "-y",
                "-loop",
                "1",
                "-i",
                cover_image.to_str().unwrap(),
                "-i",
                audio_file.to_str().unwrap(),
                "-c:v",
                "libx264",
                "-tune",
                "stillimage",
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                "-pix_fmt",
                "yuv420p",
                "-shortest",
                output_mp4.to_str().unwrap(),
            ])
            .output()
            .map_err(|e| format!("Failed to render MP4 video with FFmpeg: {}", e))?;

        if output.status.success() {
            Ok(())
        } else {
            let stderr = String::from_utf8_lossy(&output.stderr);
            Err(format!("FFmpeg video rendering failed: {}", stderr.trim()))
        }
    }
}
