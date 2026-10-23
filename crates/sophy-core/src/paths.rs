use std::path::PathBuf;

pub struct SophyPaths {
    pub base: PathBuf,
    pub audio: PathBuf,
    pub video: PathBuf,
    pub cover_art: PathBuf,
    pub lyrics: PathBuf,
    pub all: PathBuf,
}

impl SophyPaths {
    pub fn init() -> Result<Self, String> {
        let docs = dirs::document_dir()
            .ok_or_else(|| "Could not locate user's Documents folder".to_string())?;

        let base = docs.join("Sophy Studio");
        let audio = base.join("Audio");
        let video = base.join("Video");
        let cover_art = base.join("Cover Art");
        let lyrics = base.join("Lyrics");
        let all = base.join("All");

        // Ensure directories exist (Audio, Cover Art, Lyrics, All - Video is removed)
        for dir in [&base, &audio, &cover_art, &lyrics, &all] {
            std::fs::create_dir_all(dir)
                .map_err(|e| format!("Failed to create directory {:?}: {}", dir, e))?;
        }

        // Clean up legacy empty Video folder if it exists
        if video.exists() {
            let _ = std::fs::remove_dir(&video);
        }

        Ok(Self {
            base,
            audio,
            video,
            cover_art,
            lyrics,
            all,
        })
    }

    pub fn sanitize_filename(name: &str) -> String {
        let cleaned = sanitize_filename::sanitize(name);
        if cleaned.trim().is_empty() {
            "Untitled".to_string()
        } else {
            cleaned.trim().to_string()
        }
    }
}
