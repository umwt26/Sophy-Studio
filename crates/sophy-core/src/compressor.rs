//! Compressor: makes any file smaller and saves it next to the original as
//! "<name> -- Sophy Studio Compressor.<ext>".
//!
//! - images: JPG re-encoded, PNG colour-reduced (like pngquant), WebP/GIF lighter, BMP/TIFF → PNG
//! - audio: MP3/AAC/OGG/Opus at a lower bit rate, WAV/AIFF → FLAC (lossless), WMA/APE → MP3
//! - video: H.264 at a sensible quality, at most 1080p (WebM stays VP9)
//! - PDF: embedded photos re-encoded and shrunk, every stream deflated, unused objects dropped
//! - anything else: a ZIP archive (deflate, best)
//!
//! When the result would not be smaller, nothing is written ("ALREADY_SMALL").

use crate::file_converter::{run_ffmpeg, CancelHandle};
use serde::Serialize;
use std::path::{Path, PathBuf};

pub const SUFFIX: &str = " -- Sophy Studio Compressor";

#[derive(Debug, Clone, Serialize)]
pub struct Compressed {
    pub output: PathBuf,
    pub before: u64,
    pub after: u64,
}

fn ext_of(p: &Path) -> String {
    p.extension().and_then(|e| e.to_str()).unwrap_or("").to_ascii_lowercase()
}

fn out_path(input: &Path, ext: &str) -> PathBuf {
    let dir = input.parent().unwrap_or_else(|| Path::new("."));
    let stem = input.file_stem().and_then(|s| s.to_str()).unwrap_or("file");
    crate::paths::SophyPaths::unique_path(dir, &format!("{stem}{SUFFIX}"), ext)
}

fn s(v: &[&str]) -> Vec<String> {
    v.iter().map(|x| x.to_string()).collect()
}

/// (ffmpeg arguments, output extension) for media files; None for PDFs and other files.
fn plan(ext: &str) -> Option<(Vec<String>, &'static str)> {
    // very large photos are brought down to 4K on the long side
    let cap4k = "scale='if(gt(iw,ih),min(3840,iw),-2)':'if(gt(iw,ih),-2,min(3840,ih))'";
    Some(match ext {
        "jpg" | "jpeg" | "jfif" => ([s(&["-vf", cap4k]), s(&["-q:v", "6", "-frames:v", "1", "-update", "1"])].concat(), "jpg"),
        "png" => (
            s(&["-vf", "split[a][b];[a]palettegen=reserve_transparent=1:max_colors=256:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a:alpha_threshold=128", "-frames:v", "1", "-update", "1", "-compression_level", "100"]),
            "png",
        ),
        "webp" => (s(&["-c:v", "libwebp", "-quality", "70", "-frames:v", "1"]), "webp"),
        "gif" => (s(&["-vf", "split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4", "-loop", "0"]), "gif"),
        "bmp" | "tif" | "tiff" | "tga" => (s(&["-frames:v", "1", "-update", "1", "-compression_level", "100"]), "png"),

        "mp3" => (s(&["-vn", "-c:a", "libmp3lame", "-b:a", "128k", "-map_metadata", "0"]), "mp3"),
        "m4a" | "aac" | "m4b" => (s(&["-vn", "-c:a", "aac", "-b:a", "128k", "-map_metadata", "0"]), "m4a"),
        "ogg" | "oga" => (s(&["-vn", "-c:a", "libvorbis", "-q:a", "3", "-map_metadata", "0"]), "ogg"),
        "opus" => (s(&["-vn", "-c:a", "libopus", "-b:a", "64k", "-map_metadata", "0"]), "opus"),
        "wav" | "aiff" | "aif" => (s(&["-vn", "-c:a", "flac", "-compression_level", "8", "-map_metadata", "0"]), "flac"),
        "flac" => (s(&["-vn", "-c:a", "flac", "-compression_level", "12", "-map_metadata", "0"]), "flac"),
        "wma" | "ape" => (s(&["-vn", "-c:a", "libmp3lame", "-b:a", "192k", "-map_metadata", "0"]), "mp3"),

        "webm" => (
            s(&["-vf", "scale=-2:'min(1080,ih)'", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "96k"]),
            "webm",
        ),
        "mp4" | "m4v" | "mov" | "mkv" | "avi" | "wmv" | "flv" | "mpg" | "mpeg" | "3gp" | "3gpp" | "ts" | "vob" | "ogv" => (
            s(&["-vf", "scale=-2:'min(1080,ih)'", "-c:v", "libx264", "-preset", "medium", "-crf", "28", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "-map_metadata", "0"]),
            "mp4",
        ),
        _ => return None,
    })
}

/// "image" | "audio" | "video" | "pdf" | "other": how a file will be compressed.
pub fn kind_of(path: &Path) -> &'static str {
    let ext = ext_of(path);
    match plan(&ext) {
        Some((_, out)) => match out {
            "jpg" | "png" | "webp" | "gif" => "image",
            "mp3" | "m4a" | "ogg" | "opus" | "flac" => "audio",
            _ => "video",
        },
        None if ext == "pdf" => "pdf",
        None => "other",
    }
}

/// Compresses one file. Blocking: run it on a worker thread.
pub fn compress(ffmpeg: &Path, input: &Path, cancel: &CancelHandle, mut progress: impl FnMut(f32)) -> Result<Compressed, String> {
    if !input.is_file() {
        return Err("NOT_FOUND".into());
    }
    let before = std::fs::metadata(input).map(|m| m.len()).unwrap_or(0);
    let ext = ext_of(input);

    let output = if let Some((args, out_ext)) = plan(&ext) {
        let out = out_path(input, out_ext);
        run_ffmpeg(ffmpeg, input, &args, &out, cancel, &mut progress)?;
        out
    } else if ext == "pdf" {
        let out = out_path(input, "pdf");
        if let Err(e) = compress_pdf(input, &out, cancel, &mut progress) {
            let _ = std::fs::remove_file(&out);
            return Err(e);
        }
        out
    } else {
        progress(0.1);
        let out = out_path(input, "zip");
        if let Err(e) = zip_one(input, &out) {
            let _ = std::fs::remove_file(&out);
            return Err(e);
        }
        out
    };

    let after = std::fs::metadata(&output).map(|m| m.len()).unwrap_or(u64::MAX);
    if after >= before {
        let _ = std::fs::remove_file(&output);
        return Err("ALREADY_SMALL".into());
    }
    progress(1.0);
    Ok(Compressed { output, before, after })
}

fn zip_one(input: &Path, out: &Path) -> Result<(), String> {
    use std::io::Write;
    let name = input.file_name().and_then(|n| n.to_str()).unwrap_or("file");
    let data = std::fs::read(input).map_err(|e| format!("FAILED: {e}"))?;
    let f = std::fs::File::create(out).map_err(|e| format!("FAILED: {e}"))?;
    let mut z = zip::ZipWriter::new(f);
    let opts = zip::write::SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .compression_level(Some(9))
        .large_file(data.len() as u64 > u32::MAX as u64);
    z.start_file(name, opts).map_err(|e| format!("FAILED: {e}"))?;
    z.write_all(&data).map_err(|e| format!("FAILED: {e}"))?;
    z.finish().map_err(|e| format!("FAILED: {e}"))?;
    Ok(())
}

// ------------------------------------------------------------------ PDF

/// FlateDecode pixels, undoing the PNG row predictor (Predictor 10–15) scanners like to use.
fn inflate_image(data: &[u8], dict: &lopdf::Dictionary, colors: usize, width: usize) -> Result<Vec<u8>, ()> {
    use std::io::Read;
    let mut raw = Vec::new();
    flate2::read::ZlibDecoder::new(data).read_to_end(&mut raw).map_err(|_| ())?;
    let parms = dict.get(b"DecodeParms").ok().and_then(|o| o.as_dict().ok());
    let predictor = parms.and_then(|p| p.get(b"Predictor").ok()).and_then(|o| o.as_i64().ok()).unwrap_or(1);
    if predictor < 10 {
        return if predictor == 1 { Ok(raw) } else { Err(()) };
    }
    let columns = parms.and_then(|p| p.get(b"Columns").ok()).and_then(|o| o.as_i64().ok()).unwrap_or(width as i64) as usize;
    let bpp = colors; // 8 bits per component
    let stride = columns * colors;
    let mut out = Vec::with_capacity(raw.len());
    let mut prev = vec![0u8; stride];
    for row in raw.chunks(stride + 1) {
        if row.len() < stride + 1 {
            break;
        }
        let (kind, src) = (row[0], &row[1..]);
        let mut cur = vec![0u8; stride];
        for i in 0..stride {
            let a = if i >= bpp { cur[i - bpp] as i16 } else { 0 };
            let b = prev[i] as i16;
            let c = if i >= bpp { prev[i - bpp] as i16 } else { 0 };
            let pred = match kind {
                0 => 0,
                1 => a,
                2 => b,
                3 => (a + b) / 2,
                4 => {
                    let p = a + b - c;
                    let (pa, pb, pc) = ((p - a).abs(), (p - b).abs(), (p - c).abs());
                    if pa <= pb && pa <= pc { a } else if pb <= pc { b } else { c }
                }
                _ => return Err(()),
            };
            cur[i] = src[i].wrapping_add(pred as u8);
        }
        out.extend_from_slice(&cur);
        prev = cur;
    }
    Ok(out)
}

const PDF_MAX_SIDE: u32 = 2000;
const PDF_JPEG_QUALITY: u8 = 65;

/// Images are re-encoded on every CPU core at once; `progress` follows the images done
/// (5 % reading, 5–90 % images, the rest packing and saving).
fn compress_pdf(input: &Path, out: &Path, cancel: &CancelHandle, progress: &mut dyn FnMut(f32)) -> Result<(), String> {
    use lopdf::Object;
    use std::sync::atomic::{AtomicUsize, Ordering};
    let mut doc = lopdf::Document::load(input).map_err(|e| format!("PDF_UNREADABLE: {e}"))?;
    if doc.is_encrypted() {
        return Err("PDF_ENCRYPTED".into());
    }
    progress(0.05);

    let mut images: Vec<&mut lopdf::Stream> = doc
        .objects
        .values_mut()
        .filter_map(|o| match o {
            Object::Stream(s) if s.dict.get(b"Subtype").and_then(|n| n.as_name()).map(|n| n == b"Image").unwrap_or(false) => Some(s),
            _ => None,
        })
        .collect();
    let count = images.len();
    let total = count.max(1);
    let done = AtomicUsize::new(0);
    let threads = std::thread::available_parallelism().map(|n| n.get()).unwrap_or(4).min(16);
    let per = images.len().div_ceil(threads).max(1);
    std::thread::scope(|scope| {
        for chunk in images.chunks_mut(per) {
            let done = &done;
            scope.spawn(move || {
                for s in chunk.iter_mut() {
                    if cancel.is_cancelled() {
                        return;
                    }
                    let _ = shrink_image(s);
                    done.fetch_add(1, Ordering::Relaxed);
                }
            });
        }
        // report from this thread while the workers run
        while done.load(Ordering::Relaxed) < count && !cancel.is_cancelled() {
            progress(0.05 + 0.85 * done.load(Ordering::Relaxed) as f32 / total as f32);
            std::thread::sleep(std::time::Duration::from_millis(150));
        }
    });
    if cancel.is_cancelled() {
        return Err("CANCELLED".into());
    }
    progress(0.92);
    doc.compress();
    doc.prune_objects();
    doc.renumber_objects();
    doc.save(out).map_err(|e| format!("FAILED: {e}"))?;
    Ok(())
}

/// Re-encodes one embedded image as a smaller JPEG when that is safe (8-bit RGB or grey,
/// stored as JPEG or deflated pixels) and actually smaller. Anything else is left alone.
fn shrink_image(stream: &mut lopdf::Stream) -> Result<(), ()> {
    use image::{DynamicImage, GrayImage, RgbImage};
    use lopdf::Object;
    let dict = &stream.dict;
    let name = |key: &[u8]| dict.get(key).ok().and_then(|o| o.as_name().ok()).map(|n| n.to_vec());
    let filter = match dict.get(b"Filter").ok() {
        Some(Object::Name(n)) => n.clone(),
        Some(Object::Array(a)) if a.len() == 1 => a[0].as_name().map_err(|_| ())?.to_vec(),
        None => b"None".to_vec(),
        _ => return Err(()),
    };
    let space = name(b"ColorSpace").ok_or(())?;
    if space != b"DeviceRGB" && space != b"DeviceGray" {
        return Err(());
    }
    if dict.get(b"BitsPerComponent").and_then(|o| o.as_i64()).unwrap_or(8) != 8 || dict.has(b"Decode") || dict.has(b"ImageMask") {
        return Err(());
    }
    let w = dict.get(b"Width").and_then(|o| o.as_i64()).map_err(|_| ())? as u32;
    let h = dict.get(b"Height").and_then(|o| o.as_i64()).map_err(|_| ())? as u32;

    let img: DynamicImage = match filter.as_slice() {
        b"DCTDecode" => image::load_from_memory_with_format(&stream.content, image::ImageFormat::Jpeg).map_err(|_| ())?,
        b"FlateDecode" | b"None" => {
            let colors = if space == b"DeviceRGB" { 3 } else { 1 };
            let raw = if filter == b"None" { stream.content.clone() } else { inflate_image(&stream.content, dict, colors, w as usize)? };
            if space == b"DeviceRGB" {
                DynamicImage::ImageRgb8(RgbImage::from_raw(w, h, raw).ok_or(())?)
            } else {
                DynamicImage::ImageLuma8(GrayImage::from_raw(w, h, raw).ok_or(())?)
            }
        }
        _ => return Err(()),
    };
    // tiny images (icons, lines) aren't worth it and JPEG would blur them
    if w * h < 64 * 64 {
        return Err(());
    }
    // Triangle (bilinear) is several times faster than Lanczos and looks the same on scans
    let img = if w.max(h) > PDF_MAX_SIDE { img.resize(PDF_MAX_SIDE, PDF_MAX_SIDE, image::imageops::FilterType::Triangle) } else { img };
    let img = if space == b"DeviceGray" { DynamicImage::ImageLuma8(img.to_luma8()) } else { DynamicImage::ImageRgb8(img.to_rgb8()) };

    let mut jpeg = Vec::new();
    image::codecs::jpeg::JpegEncoder::new_with_quality(&mut jpeg, PDF_JPEG_QUALITY).encode_image(&img).map_err(|_| ())?;
    if jpeg.len() >= stream.content.len() {
        return Err(());
    }
    let (nw, nh) = (img.width() as i64, img.height() as i64);
    stream.dict.set("Filter", Object::Name(b"DCTDecode".to_vec()));
    stream.dict.remove(b"DecodeParms");
    stream.dict.set("Width", nw);
    stream.dict.set("Height", nh);
    stream.dict.set("BitsPerComponent", 8);
    stream.set_content(jpeg);
    // already JPEG: keep doc.compress() from deflating it again
    stream.allows_compression = false;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::process::Command;

    /// cargo test -p sophy-core compress_samples -- --ignored --nocapture
    /// (SOPHY_TEST_PDF=<a pdf> adds a PDF; it is copied, never changed)
    #[test]
    #[ignore]
    fn compress_samples() {
        let ffmpeg = PathBuf::from("ffmpeg");
        let dir = std::env::temp_dir().join(format!("sophy-compress-test-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let make = |name: &str, args: &[&str]| {
            let p = dir.join(name);
            assert!(Command::new(&ffmpeg).args(["-hide_banner", "-loglevel", "error", "-y"]).args(args).arg(&p).status().unwrap().success(), "{name}");
            p
        };
        let mut files = vec![
            make("photo.jpg", &["-f", "lavfi", "-i", "testsrc2=size=3000x2000", "-frames:v", "1", "-q:v", "1"]),
            make("shot.png", &["-f", "lavfi", "-i", "testsrc2=size=1600x900", "-frames:v", "1"]),
            make("song.wav", &["-f", "lavfi", "-i", "sine=frequency=330:duration=20", "-ac", "2"]),
            make("song.mp3", &["-f", "lavfi", "-i", "anoisesrc=d=20:a=0.2", "-b:a", "320k"]),
            make("clip.mp4", &["-f", "lavfi", "-i", "testsrc2=size=1920x1080:rate=30:duration=6", "-c:v", "libx264", "-crf", "10", "-pix_fmt", "yuv420p"]),
            make("notes.txt", &["-f", "lavfi", "-i", "sine=duration=1", "-f", "s16le"]),
        ];
        if let Ok(pdf) = std::env::var("SOPHY_TEST_PDF") {
            let copy = dir.join("doc.pdf");
            std::fs::copy(pdf, &copy).unwrap();
            files.push(copy);
        }
        for f in files {
            match compress(&ffmpeg, &f, &CancelHandle::default(), |_| {}) {
                Ok(r) => println!("ok   {:<10} {:>9} -> {:>9} ({:>3}% smaller)  {}", f.file_name().unwrap().to_string_lossy(), r.before, r.after, 100 - r.after * 100 / r.before.max(1), r.output.file_name().unwrap().to_string_lossy()),
                Err(e) => println!("--   {:<10} {e}", f.file_name().unwrap().to_string_lossy()),
            }
        }
    }
}

