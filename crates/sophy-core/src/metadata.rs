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

use id3::TagLike;

pub struct MetadataManager;

impl MetadataManager {
    pub fn read_metadata(file_path: &Path) -> Result<AudioMetadata, String> {
        let ext = file_path
            .extension()
            .and_then(|ext| ext.to_str())
            .map(|s| s.to_lowercase())
            .unwrap_or_default();

        let mut meta = AudioMetadata {
            file_path: file_path.to_string_lossy().to_string(),
            format: Some(ext.to_uppercase()),
            ..Default::default()
        };

        // Try to get duration from lofty probe
        if let Ok(tagged_file) = Probe::open(file_path).and_then(|p| p.read()) {
            let properties = tagged_file.properties();
            meta.duration_seconds = Some(properties.duration().as_secs_f64());
        }

        // 1. For MP3 and WAV: Check id3 crate first for full ID3v2.3 tags & cover art
        if ext == "mp3" || ext == "wav" {
            if let Ok(id3_tag) = id3::Tag::read_from_path(file_path) {
                if let Some(title) = id3_tag.title() {
                    meta.title = Some(title.to_string());
                }
                if let Some(artist) = id3_tag.artist() {
                    meta.artist = Some(artist.to_string());
                }
                if let Some(album) = id3_tag.album() {
                    meta.album = Some(album.to_string());
                }
                if let Some(year) = id3_tag.year() {
                    meta.year = Some(year.to_string());
                }
                if let Some(genre) = id3_tag.genre() {
                    meta.genre = Some(genre.to_string());
                }
                if let Some(track) = id3_tag.track() {
                    meta.track_number = Some(track.to_string());
                }
                if let Some(comment) = id3_tag.comments().next() {
                    meta.comment = Some(comment.text.clone());
                }

                if let Some(pic) = id3_tag.pictures().next() {
                    use base64::Engine;
                    let b64 = base64::engine::general_purpose::STANDARD.encode(&pic.data);
                    meta.cover_base64 = Some(b64);
                    meta.cover_mime_type = Some(pic.mime_type.clone());
                    return Ok(meta);
                }
            }
        }

        // 2. Lofty fallback (for FLAC, M4A, OGG or if ID3 was empty)
        if let Ok(tagged_file) = Probe::open(file_path).and_then(|p| p.read()) {
            let tag = tagged_file
                .primary_tag()
                .or_else(|| tagged_file.first_tag());

            if let Some(tag) = tag {
                if meta.title.is_none() {
                    meta.title = tag.title().map(|s| s.to_string());
                }
                if meta.artist.is_none() {
                    meta.artist = tag.artist().map(|s| s.to_string());
                }
                if meta.album.is_none() {
                    meta.album = tag.album().map(|s| s.to_string());
                }
                if meta.year.is_none() {
                    meta.year = tag.year().map(|y| y.to_string());
                }
                if meta.genre.is_none() {
                    meta.genre = tag.genre().map(|s| s.to_string());
                }
                if meta.track_number.is_none() {
                    meta.track_number = tag.track().map(|t| t.to_string());
                }
                if meta.comment.is_none() {
                    meta.comment = tag.comment().map(|s| s.to_string());
                }

                if meta.cover_base64.is_none() {
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
            }
        }

        Ok(meta)
    }

    pub fn save_metadata(input: &SaveMetadataInput) -> Result<(), String> {
        let path = Path::new(&input.file_path);
        let ext = path
            .extension()
            .and_then(|e| e.to_str())
            .map(|s| s.to_lowercase())
            .unwrap_or_default();

        // 1. For MP3 and WAV files: write standard ID3v2.3 (APIC picture + text frames)
        if ext == "mp3" || ext == "wav" {
            let mut id3_tag = id3::Tag::read_from_path(path).unwrap_or_else(|_| id3::Tag::new());

            if let Some(ref title) = input.title {
                id3_tag.set_title(title.clone());
            }
            if let Some(ref artist) = input.artist {
                id3_tag.set_artist(artist.clone());
            }
            if let Some(ref album) = input.album {
                id3_tag.set_album(album.clone());
            }
            if let Some(ref year) = input.year {
                if let Ok(y) = year.trim().parse::<i32>() {
                    id3_tag.set_year(y);
                }
            }
            if let Some(ref genre) = input.genre {
                id3_tag.set_genre(genre.clone());
            }
            if let Some(ref track) = input.track_number {
                if let Ok(t) = track.trim().parse::<u32>() {
                    id3_tag.set_track(t);
                }
            }
            if let Some(ref comment) = input.comment {
                id3_tag.add_frame(id3::frame::Comment {
                    lang: "eng".to_string(),
                    description: String::new(),
                    text: comment.clone(),
                });
            }

            if input.remove_cover.unwrap_or(false) {
                id3_tag.remove_all_pictures();
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
                            Some("image/png") => "image/png",
                            Some("image/gif") => "image/gif",
                            Some("image/bmp") => "image/bmp",
                            _ => "image/jpeg",
                        };
                        id3_tag.remove_all_pictures();
                        id3_tag.add_frame(id3::frame::Picture {
                            mime_type: mime.to_string(),
                            picture_type: id3::frame::PictureType::CoverFront,
                            description: String::new(),
                            data,
                        });
                    }
                }
            }

            id3_tag.write_to_path(path, id3::Version::Id3v23)
                .map_err(|e| format!("ID3 etiketleri kaydedilemedi: {}", e))?;

            // For WAV, also write basic RIFF INFO chunk for legacy Windows Explorer details
            if ext == "wav" {
                let mut riff_tag = Tag::new(lofty::tag::TagType::RiffInfo);
                if let Some(ref title) = input.title {
                    riff_tag.set_title(title.clone());
                }
                if let Some(ref artist) = input.artist {
                    riff_tag.set_artist(artist.clone());
                }
                if let Some(ref album) = input.album {
                    riff_tag.set_album(album.clone());
                }
                if let Some(ref year) = input.year {
                    if let Ok(y) = year.trim().parse::<u32>() {
                        riff_tag.set_year(y);
                    }
                }
                let _ = riff_tag.save_to_path(path, WriteOptions::default());
            }

            return Ok(());
        }

        // 2. For FLAC, M4A, OGG: Use Lofty (Vorbis comments & MP4 Ilst)
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
                    tag.remove_picture_type(PictureType::CoverFront);
                    tag.push_picture(pic);
                }
            }
        }

        tag.save_to_path(path, WriteOptions::default())
            .map_err(|e| format!("Etiketler dosyaya kaydedilemedi: {}", e))?;

        Ok(())
    }
}


