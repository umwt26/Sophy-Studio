use lofty::config::WriteOptions;
use lofty::file::{AudioFile, TaggedFileExt};
use lofty::picture::{MimeType, Picture, PictureType};
use lofty::probe::Probe;
use lofty::tag::{Accessor, Tag, TagExt};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct AudioMetadata {
    pub file_path: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub year: Option<String>,
    pub genre: Option<String>,
    pub track_number: Option<String>,
    pub comment: Option<String>,
    pub duration_seconds: Option<f64>,
    pub format: Option<String>,
    pub cover_base64: Option<String>,
    pub cover_mime_type: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase")]
pub struct SaveMetadataInput {
    pub file_path: String,
    pub title: Option<String>,
    pub artist: Option<String>,
    pub album: Option<String>,
    pub year: Option<String>,
    pub genre: Option<String>,
    pub track_number: Option<String>,
    pub comment: Option<String>,
    pub cover_base64: Option<String>,
    pub cover_mime_type: Option<String>,
    pub remove_cover: Option<bool>,
}

pub struct MetadataManager;

impl MetadataManager {
    pub fn read_metadata(file_path: &Path) -> Result<AudioMetadata, String> {
        let tagged_file = Probe::open(file_path)
            .map_err(|e| format!("Dosya açılamadı: {}", e))?
            .read()
            .map_err(|e| format!("Ses metadata okunamadı: {}", e))?;

        let properties = tagged_file.properties();
        let duration_seconds = Some(properties.duration().as_secs_f64());
        let format = file_path
            .extension()
            .and_then(|ext| ext.to_str())
            .map(|s| s.to_uppercase());

        let mut meta = AudioMetadata {
            file_path: file_path.to_string_lossy().to_string(),
            duration_seconds,
            format,
            ..Default::default()
        };

        let tag = tagged_file
            .primary_tag()
            .or_else(|| tagged_file.first_tag());

        if let Some(tag) = tag {
            meta.title = tag.title().map(|s| s.to_string());
            meta.artist = tag.artist().map(|s| s.to_string());
            meta.album = tag.album().map(|s| s.to_string());
            meta.year = tag.year().map(|y| y.to_string());
            meta.genre = tag.genre().map(|s| s.to_string());
            meta.track_number = tag.track().map(|t| t.to_string());
            meta.comment = tag.comment().map(|s| s.to_string());

            if let Some(pic) = tag.pictures().first() {
                use base64::Engine;
                let b64 = base64::engine::general_purpose::STANDARD.encode(pic.data());
                meta.cover_base64 = Some(b64);
                let mime = match pic.mime_type() {
                    Some(MimeType::Jpeg) => "image/jpeg",
                    Some(MimeType::Png) => "image/png",
                    Some(MimeType::Gif) => "image/gif",
                    Some(MimeType::Bmp) => "image/bmp",
                    _ => "image/jpeg",
                };
                meta.cover_mime_type = Some(mime.to_string());
            }
        }

        Ok(meta)
    }

    pub fn save_metadata(input: &SaveMetadataInput) -> Result<(), String> {
        let path = Path::new(&input.file_path);
        let mut tagged_file = Probe::open(path)
            .map_err(|e| format!("Dosya açılamadı: {}", e))?
            .read()
            .map_err(|e| format!("Ses dosyası okunamadı: {}", e))?;

        let tag_type = tagged_file.primary_tag_type();
        let mut tag = match tagged_file.tag_mut(tag_type) {
            Some(t) => t.clone(),
            None => Tag::new(tag_type),
        };

        if let Some(ref title) = input.title {
            tag.set_title(title.clone());
        }
        if let Some(ref artist) = input.artist {
            tag.set_artist(artist.clone());
        }
        if let Some(ref album) = input.album {
            tag.set_album(album.clone());
        }
        if let Some(ref year) = input.year {
            if let Ok(y) = year.trim().parse::<u32>() {
                tag.set_year(y);
            }
        }
        if let Some(ref genre) = input.genre {
            tag.set_genre(genre.clone());
        }
        if let Some(ref track) = input.track_number {
            if let Ok(t) = track.trim().parse::<u32>() {
                tag.set_track(t);
            }
        }
        if let Some(ref comment) = input.comment {
            tag.set_comment(comment.clone());
        }

        if input.remove_cover.unwrap_or(false) {
            tag.remove_picture_type(PictureType::CoverFront);
            tag.remove_picture_type(PictureType::Other);
        } else if let Some(ref b64) = input.cover_base64 {
            if !b64.trim().is_empty() {
                use base64::Engine;
                let clean_b64 = if let Some(idx) = b64.find(',') {
                    &b64[idx + 1..]
                } else {
                    b64.as_str()
                };

                if let Ok(data) = base64::engine::general_purpose::STANDARD.decode(clean_b64.trim()) {
                    let mime = match input.cover_mime_type.as_deref() {
                        Some("image/png") => MimeType::Png,
                        Some("image/gif") => MimeType::Gif,
                        Some("image/bmp") => MimeType::Bmp,
                        _ => MimeType::Jpeg,
                    };
                    let pic = Picture::new_unchecked(
                        PictureType::CoverFront,
                        Some(mime),
                        None,
                        data,
                    );
                    tag.set_picture(0, pic);
                }
            }
        }

        tag.save_to_path(path, WriteOptions::default())
            .map_err(|e| format!("Etiketler dosyaya kaydedilemedi: {}", e))?;

        Ok(())
    }
}
