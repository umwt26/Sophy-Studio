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
                // Windows only reads LIST/INFO when it comes AFTER the audio data chunk
                // (verified on Windows 11 26100). ffmpeg and most tools write it before.
                move_info_after_data(path).map_err(|e| format!("METADATA_WRITE_FAILED: {}", e))?;
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

/// Rewrites a RIFF/WAVE file so every LIST/INFO chunk sits after the `data` chunk.
/// Streams through a temp file next to the original and atomically replaces it.
/// No-op when the layout is already fine or the file is not a plain RIFF/WAVE.
pub fn move_info_after_data(path: &Path) -> std::io::Result<()> {
    use std::fs::File;
    use std::io::{BufReader, BufWriter, Read, Seek, SeekFrom, Write};

    let mut f = BufReader::new(File::open(path)?);
    let mut header = [0u8; 12];
    if f.read_exact(&mut header).is_err() || &header[0..4] != b"RIFF" || &header[8..12] != b"WAVE" {
        return Ok(());
    }
    let file_len = f.get_ref().metadata()?.len();

    // (id, offset of chunk body, body size, is LIST/INFO)
    let mut chunks: Vec<([u8; 4], u64, u32, bool)> = Vec::new();
    let mut pos = 12u64;
    while pos + 8 <= file_len {
        f.seek(SeekFrom::Start(pos))?;
        let mut h = [0u8; 8];
        f.read_exact(&mut h)?;
        let id = [h[0], h[1], h[2], h[3]];
        let size = u32::from_le_bytes([h[4], h[5], h[6], h[7]]);
        let body = pos + 8;
        if body + size as u64 > file_len {
            return Ok(()); // truncated/streamed file: leave untouched
        }
        let mut is_info = false;
        if &id == b"LIST" && size >= 4 {
            let mut kind = [0u8; 4];
            f.read_exact(&mut kind)?;
            is_info = &kind == b"INFO";
        }
        chunks.push((id, body, size, is_info));
        pos = body + size as u64 + (size as u64 & 1);
    }

    let data_idx = match chunks.iter().position(|c| &c.0 == b"data") {
        Some(i) => i,
        None => return Ok(()),
    };
    let needs_move = chunks.iter().enumerate().any(|(i, c)| c.3 && i < data_idx);
    if !needs_move {
        return Ok(());
    }

    let ordered: Vec<_> = chunks
        .iter()
        .filter(|c| !c.3)
        .chain(chunks.iter().filter(|c| c.3))
        .cloned()
        .collect();

    let tmp = path.with_extension("wav.sophy-tmp");
    {
        let mut out = BufWriter::new(File::create(&tmp)?);
        let total: u64 = 4 + ordered.iter().map(|c| 8 + c.2 as u64 + (c.2 as u64 & 1)).sum::<u64>();
        out.write_all(b"RIFF")?;
        out.write_all(&(total.min(u32::MAX as u64) as u32).to_le_bytes())?;
        out.write_all(b"WAVE")?;
        let mut buf = vec![0u8; 1 << 16];
        for (id, body, size, _) in &ordered {
            out.write_all(id)?;
            out.write_all(&size.to_le_bytes())?;
            f.seek(SeekFrom::Start(*body))?;
            let mut left = *size as u64;
            while left > 0 {
                let n = left.min(buf.len() as u64) as usize;
                f.read_exact(&mut buf[..n])?;
                out.write_all(&buf[..n])?;
                left -= n as u64;
            }
            if size & 1 == 1 {
                out.write_all(&[0])?;
            }
        }
        out.flush()?;
    }
    drop(f);
    if let Err(e) = std::fs::rename(&tmp, path) {
        let _ = std::fs::remove_file(&tmp);
        return Err(e);
    }
    Ok(())
}
