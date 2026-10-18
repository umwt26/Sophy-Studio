use std::path::Path;
use std::process::Command;

pub struct MediaConverter;

fn create_silent_command(program: &str) -> Command {
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
    pub fn convert_to_mp3(input_file: &Path, output_file: &Path) -> Result<(), String> {
        let output = create_silent_command("ffmpeg")
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

    pub fn convert_to_wav(input_file: &Path, output_file: &Path) -> Result<(), String> {
        let output = create_silent_command("ffmpeg")
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

    pub fn render_cover_video(
        audio_file: &Path,
        cover_image: &Path,
        output_mp4: &Path,
    ) -> Result<(), String> {
        let output = create_silent_command("ffmpeg")
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
