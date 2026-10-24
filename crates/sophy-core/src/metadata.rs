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

/// Longest edge for embedded covers. Large/odd covers are a common reason
/// players and Windows Explorer silently ignore embedded art.
const COVER_MAX_EDGE: u32 = 1400;

/// Decodes the user's image (JPEG/PNG/WEBP/BMP/GIF) and returns bytes + the REAL mime type.
/// JPEG/PNG within limits are kept byte-for-byte; everything else is converted to JPEG.
/// (Previously WEBP/BMP were embedded but labelled "image/jpeg", which most players reject.)
fn normalize_cover(raw: &[u8]) -> Result<(Vec<u8>, &'static str), String> {
    use image::{ImageFormat, ImageReader};
    use std::io::Cursor;

    let format = image::guess_format(raw)
        .map_err(|_| "METADATA_COVER_INVALID: unsupported image".to_string())?;
    let img = ImageReader::with_format(Cursor::new(raw), format)
        .decode()
        .map_err(|e| format!("METADATA_COVER_INVALID: {}", e))?;

    let fits = img.width() <= COVER_MAX_EDGE && img.height() <= COVER_MAX_EDGE;
    match format {
        ImageFormat::Jpeg if fits => return Ok((raw.to_vec(), "image/jpeg")),
        ImageFormat::Png if fits && raw.len() <= 1_500_000 => return Ok((raw.to_vec(), "image/png")),
        _ => {}
    }

    let img = if fits {
        img
    } else {
        img.resize(COVER_MAX_EDGE, COVER_MAX_EDGE, image::imageops::FilterType::Lanczos3)
    };
    let rgb = img.to_rgb8();
    let mut out = Vec::new();
    image::codecs::jpeg::JpegEncoder::new_with_quality(&mut out, 90)
        .encode_image(&rgb)
        .map_err(|e| format!("METADATA_COVER_INVALID: {}", e))?;
    Ok((out, "image/jpeg"))
}

fn decode_cover_b64(b64: &str) -> Result<Option<(Vec<u8>, &'static str)>, String> {
    use base64::Engine;
    if b64.trim().is_empty() {
        return Ok(None);
    }
    let clean = match b64.find(',') {
        Some(idx) => &b64[idx + 1..],
        None => b64,
    };
    let raw = base64::engine::general_purpose::STANDARD
        .decode(clean.trim())
        .map_err(|e| format!("METADATA_COVER_INVALID: {}", e))?;
    normalize_cover(&raw).map(Some)
}

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
            } else if let Some((data, mime)) = decode_cover_b64(input.cover_base64.as_deref().unwrap_or(""))? {
                id3_tag.remove_all_pictures();
                id3_tag.add_frame(id3::frame::Picture {
                    mime_type: mime.to_string(),
                    picture_type: id3::frame::PictureType::CoverFront,
                    description: String::new(),
                    data,
                });
            }

            id3_tag
                .write_to_path(path, id3::Version::Id3v23)
                .map_err(|e| format!("METADATA_WRITE_FAILED: {}", e))?;

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
                if let Some(ref genre) = input.genre {
                    riff_tag.set_genre(genre.clone());
                }
                if let Some(ref comment) = input.comment {
                    riff_tag.set_comment(comment.clone());
                }
                if let Some(ref track) = input.track_number {
                    if let Ok(t) = track.trim().parse::<u32>() {
                        riff_tag.set_track(t);
                    }
                }
                // Windows Explorer reads WAV titles/artists from RIFF INFO, so this must not fail silently.
                riff_tag
                    .save_to_path(path, WriteOptions::default())
                    .map_err(|e| format!("METADATA_WRITE_FAILED: {}", e))?;
            }

            return Self::verify_saved(path, input);
        }

        // 2. For FLAC, M4A, OGG: Use Lofty (Vorbis comments & MP4 Ilst)
        let mut tagged_file = Probe::open(path)
            .map_err(|e| format!("METADATA_READ_FAILED: {}", e))?
            .read()
            .map_err(|e| format!("METADATA_READ_FAILED: {}", e))?;

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
        } else if let Some((data, mime)) = decode_cover_b64(input.cover_base64.as_deref().unwrap_or(""))? {
            let mime = if mime == "image/png" { MimeType::Png } else { MimeType::Jpeg };
            let pic = Picture::new_unchecked(PictureType::CoverFront, Some(mime), None, data);
            tag.remove_picture_type(PictureType::CoverFront);
            tag.push_picture(pic);
        }

        tag.save_to_path(path, WriteOptions::default())
            .map_err(|e| format!("METADATA_WRITE_FAILED: {}", e))?;

        Self::verify_saved(path, input)
    }

    /// Re-reads the file so the UI never reports success for a cover/title that did not stick.
    fn verify_saved(path: &Path, input: &SaveMetadataInput) -> Result<(), String> {
        let saved = Self::read_metadata(path).map_err(|e| format!("METADATA_VERIFY_FAILED: {}", e))?;
        let wants_cover = !input.remove_cover.unwrap_or(false)
            && input.cover_base64.as_deref().map(|b| !b.trim().is_empty()).unwrap_or(false);
        if wants_cover && saved.cover_base64.is_none() {
            return Err("METADATA_VERIFY_FAILED: cover was not stored".to_string());
        }
        if let Some(ref title) = input.title {
            if saved.title.as_deref() != Some(title.as_str()) {
                return Err("METADATA_VERIFY_FAILED: title was not stored".to_string());
            }
        }
        Ok(())
    }
}


