use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct FolderSettings {
    pub all: Option<String>,
    pub audio: Option<String>,
    pub cover_art: Option<String>,
    pub lyrics: Option<String>,
    pub universal: Option<String>,
}

pub struct SophyPaths {
    pub base: PathBuf,
    pub audio: PathBuf,
    pub cover_art: PathBuf,
    pub lyrics: PathBuf,
    pub all: PathBuf,
    pub universal: PathBuf,
}

impl SophyPaths {
    fn config_file_path() -> Option<PathBuf> {
        dirs::config_dir().map(|p| p.join("SophyStudio").join("folders.json"))
    }

    pub fn load_saved_settings() -> FolderSettings {
        if let Some(config_path) = Self::config_file_path() {
            if let Ok(data) = std::fs::read_to_string(&config_path) {
                if let Ok(settings) = serde_json::from_str::<FolderSettings>(&data) {
                    return settings;
                }
            }
        }
        FolderSettings::default()
    }

    pub fn save_settings(settings: &FolderSettings) -> Result<(), String> {
        if let Some(config_path) = Self::config_file_path() {
            if let Some(parent) = config_path.parent() {
                let _ = std::fs::create_dir_all(parent);
            }
            let data = serde_json::to_string_pretty(settings)
                .map_err(|e| format!("Failed to serialize settings: {}", e))?;
            std::fs::write(&config_path, data)
                .map_err(|e| format!("Failed to write settings file: {}", e))?;
        }
        Ok(())
    }

    pub fn init() -> Result<Self, String> {
        let docs = dirs::document_dir()
            .ok_or_else(|| "Could not locate user's Documents folder".to_string())?;

        let base = docs.join("Sophy Studio");
        let default_audio = base.join("Audio");
        let default_cover_art = base.join("Cover Art");
        let default_lyrics = base.join("Lyrics");
        let default_all = base.join("All");
        let default_universal = base.join("Universal Media");

        let saved = Self::load_saved_settings();

        let audio = saved
            .audio
            .filter(|s| !s.trim().is_empty())
            .map(PathBuf::from)
            .unwrap_or(default_audio);

        let cover_art = saved
            .cover_art
            .filter(|s| !s.trim().is_empty())
            .map(PathBuf::from)
            .unwrap_or(default_cover_art);

        let lyrics = saved
            .lyrics
            .filter(|s| !s.trim().is_empty())
            .map(PathBuf::from)
            .unwrap_or(default_lyrics);

        let all = saved
            .all
            .filter(|s| !s.trim().is_empty())
            .map(PathBuf::from)
            .unwrap_or(default_all);

        let universal = saved
            .universal
            .filter(|s| !s.trim().is_empty())
            .map(PathBuf::from)
            .unwrap_or(default_universal);

        // Ensure directories exist
        for dir in [&base, &audio, &cover_art, &lyrics, &all, &universal] {
            std::fs::create_dir_all(dir)
                .map_err(|e| format!("Failed to create directory {:?}: {}", dir, e))?;
        }

        Ok(Self {
            base,
            audio,
            cover_art,
            lyrics,
            all,
            universal,
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
