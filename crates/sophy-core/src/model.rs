use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SongClip {
    pub id: String,
    pub title: String,
    pub display_name: String,
    pub handle: String,
    pub is_public: bool,
    pub image_url: String,
    pub image_large_url: String,
    pub audio_url: String,
    pub video_url: String,
    pub duration: Option<f64>,
    pub prompt: String,
    pub tags: String,
    pub major_model_version: String,
    pub fallback_stream_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadProgress {
    pub item_id: String,
    pub downloaded_bytes: u64,
    pub total_bytes: Option<u64>,
    pub stage: String,
}
