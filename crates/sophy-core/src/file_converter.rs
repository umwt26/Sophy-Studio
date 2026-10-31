//! File Converter: audio, video and image conversions with ffmpeg.
//!
//! A preset id is an output ("mp3", "mp4-low", "png") optionally prefixed by a modifier
//! ("scale75:mp4", "rotate-left:png"). Results are written next to the source file as
//! "<name> -- Sophy Studio Converter.<ext>", never over an existing file.

use serde::Serialize;
use std::io::{BufRead, BufReader, Read};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};

pub const SUFFIX: &str = " -- Sophy Studio Converter";

#[derive(Clone, Copy, PartialEq, Eq, Debug, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Category {
    Audio,
    Video,
    Image,
    /// GIF: an image that can also become a video
    Animated,
}

/// Extensions ffmpeg reads reliably, by category.
pub const AUDIO_EXT: &[&str] = &["mp3", "wav", "flac", "m4a", "aac", "ogg", "oga", "opus", "wma", "aiff", "aif", "ape", "m4b"];
pub const VIDEO_EXT: &[&str] = &["mp4", "mkv", "mov", "avi", "webm", "wmv", "flv", "m4v", "mpg", "mpeg", "3gp", "3gpp", "ogv", "ts", "vob"];
pub const IMAGE_EXT: &[&str] = &["png", "jpg", "jpeg", "jfif", "webp", "bmp", "tif", "tiff", "tga", "ico"];
pub const ANIMATED_EXT: &[&str] = &["gif"];

pub fn all_extensions() -> impl Iterator<Item = &'static str> {
    AUDIO_EXT.iter().chain(VIDEO_EXT).chain(IMAGE_EXT).chain(ANIMATED_EXT).copied()
}

pub fn category_of(path: &Path) -> Option<Category> {
    let ext = path.extension()?.to_str()?.to_ascii_lowercase();
    let e = ext.as_str();
    if AUDIO_EXT.contains(&e) {
        Some(Category::Audio)
    } else if VIDEO_EXT.contains(&e) {
        Some(Category::Video)
    } else if IMAGE_EXT.contains(&e) {
        Some(Category::Image)
    } else if ANIMATED_EXT.contains(&e) {
        Some(Category::Animated)
    } else {
        None
    }
}

const AUDIO_OUT: &[&str] = &["mp3", "aac", "flac", "ogg", "wav"];
const VIDEO_OUT: &[&str] = &["mp4", "mp4-low", "mkv", "webm", "ogv", "avi"];
const IMAGE_OUT: &[&str] = &["png", "jpg", "webp", "ico"];
/// Modifiers and the outputs they apply to, per category.
const MODIFIERS: &[&str] = &["scale75", "scale25", "720p", "1080p", "rotate-left", "rotate-right"];

/// All preset ids for one category, in menu order (plain outputs first, then modifier groups).
pub fn presets_for(cat: Category) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    let plain: Vec<&str> = match cat {
        Category::Audio => AUDIO_OUT.to_vec(),
        Category::Video => [VIDEO_OUT, &["gif", "gif-low"], AUDIO_OUT].concat(),
        Category::Image => IMAGE_OUT.to_vec(),
        Category::Animated => vec!["mp4", "webm", "mkv", "avi", "webp", "png", "jpg"],
    };
    out.extend(plain.iter().map(|s| s.to_string()));
    for m in MODIFIERS {
        let targets: &[&str] = match (cat, *m) {
            (Category::Video, "rotate-left" | "rotate-right") => VIDEO_OUT,
            (Category::Video, _) => &["mp4", "mkv", "webm", "ogv", "avi"],
            (Category::Image, "scale75" | "scale25" | "rotate-left" | "rotate-right") => &["png", "jpg", "webp"],
            _ => &[],
        };
        out.extend(targets.iter().map(|t| format!("{m}:{t}")));
    }
    out
}

/// Presets every given file supports (for a mixed selection), in menu order.
pub fn common_presets(paths: &[PathBuf]) -> Vec<String> {
    let mut cats: Vec<Category> = paths.iter().filter_map(|p| category_of(p)).collect();
    cats.dedup();
    let Some(first) = cats.first() else { return Vec::new() };
    let mut list = presets_for(*first);
    for c in &cats[1..] {
        let other = presets_for(*c);
        list.retain(|p| other.contains(p));
    }
    list
}

fn split(preset: &str) -> (Option<&str>, &str) {
    match preset.split_once(':') {
        Some((m, o)) => (Some(m), o),
        None => (None, preset),
    }
}

/// File extension a preset writes.
pub fn output_extension(preset: &str) -> &str {
    match split(preset).1 {
        "mp4-low" => "mp4",
        "gif-low" => "gif",
        o => o,
    }
}

/// "<dir>/<name> -- Sophy Studio Converter.<ext>", with " (2)", " (3)" … if taken.
pub fn output_path(input: &Path, preset: &str) -> PathBuf {
    let dir = input.parent().unwrap_or_else(|| Path::new("."));
    let stem = input.file_stem().and_then(|s| s.to_str()).unwrap_or("file");
    let ext = output_extension(preset);
    let mut n = 1;
    loop {
        let name = if n == 1 { format!("{stem}{SUFFIX}.{ext}") } else { format!("{stem}{SUFFIX} ({n}).{ext}") };
        let p = dir.join(name);
        if !p.exists() {
            return p;
        }
        n += 1;
    }
}

/// ffmpeg arguments between the input and the output file.
fn ffmpeg_args(preset: &str, cat: Category) -> Result<Vec<String>, String> {
    let (modifier, out) = split(preset);
    let mut filters: Vec<String> = Vec::new();
    match modifier {
        Some("scale75") => filters.push("scale=trunc(iw*0.75/2)*2:trunc(ih*0.75/2)*2".into()),
        Some("scale25") => filters.push("scale=trunc(iw*0.25/2)*2:trunc(ih*0.25/2)*2".into()),
        Some("720p") => filters.push("scale=-2:720".into()),
        Some("1080p") => filters.push("scale=-2:1080".into()),
        Some("rotate-left") => filters.push("transpose=2".into()),
        Some("rotate-right") => filters.push("transpose=1".into()),
        Some(m) => return Err(format!("unknown modifier {m}")),
        None => {}
    }
    let s = |v: &[&str]| v.iter().map(|x| x.to_string()).collect::<Vec<_>>();
    // x264 / vp9 need even sizes (GIFs and odd-sized videos)
    let even = "scale=trunc(iw/2)*2:trunc(ih/2)*2";
    let vf = |mut f: Vec<String>, extra: &[&str]| -> Vec<String> {
        f.extend(extra.iter().map(|x| x.to_string()));
        if f.is_empty() { vec![] } else { vec!["-vf".into(), f.join(",")] }
    };

    let mut args: Vec<String> = Vec::new();
    match out {
        "mp3" => args.extend(s(&["-vn", "-c:a", "libmp3lame", "-q:a", "2"])),
        "aac" => args.extend(s(&["-vn", "-c:a", "aac", "-b:a", "256k"])),
        "flac" => args.extend(s(&["-vn", "-c:a", "flac"])),
        "ogg" => args.extend(s(&["-vn", "-c:a", "libvorbis", "-q:a", "6"])),
        "wav" => args.extend(s(&["-vn", "-c:a", "pcm_s16le"])),
        "mp4" | "mkv" | "mp4-low" => {
            let low = out == "mp4-low";
            args.extend(vf(filters, &[even]));
            args.extend(s(&["-c:v", "libx264", "-preset", if low { "veryfast" } else { "medium" }, "-crf", if low { "28" } else { "20" }, "-pix_fmt", "yuv420p"]));
            args.extend(s(&["-c:a", "aac", "-b:a", if low { "128k" } else { "192k" }]));
            if out != "mkv" {
                args.extend(s(&["-movflags", "+faststart"]));
            }
        }
        "webm" => {
            args.extend(vf(filters, &[even]));
            args.extend(s(&["-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-crf", "32", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", "-c:a", "libopus", "-b:a", "128k"]));
        }
        "ogv" => {
            args.extend(vf(filters, &[even]));
            args.extend(s(&["-c:v", "libtheora", "-pix_fmt", "yuv420p", "-q:v", "7", "-c:a", "libvorbis", "-q:a", "5"]));
        }
        "avi" => {
            args.extend(vf(filters, &[even]));
            args.extend(s(&["-c:v", "mpeg4", "-q:v", "4", "-c:a", "libmp3lame", "-q:a", "4"]));
        }
        "gif" | "gif-low" => {
            let (fps, w, colors) = if out == "gif-low" { (10, 320, 64) } else { (15, 480, 256) };
            filters.push(format!("fps={fps},scale='min({w},iw)':-1:flags=lanczos,split[a][b];[a]palettegen=max_colors={colors}[p];[b][p]paletteuse"));
            args.extend(vf(filters, &[]));
            args.extend(s(&["-loop", "0"]));
        }
        "png" => {
            args.extend(vf(filters, &[]));
            args.extend(s(&["-frames:v", "1", "-update", "1"]));
        }
        "jpg" => {
            // JPG has no transparency: flatten onto white
            filters.push("format=rgba,split[bg][fg];[bg]drawbox=c=white:t=fill[w];[w][fg]overlay=format=auto,format=yuvj444p".into());
            args.extend(vf(filters, &[]));
            args.extend(s(&["-frames:v", "1", "-update", "1", "-q:v", "2"]));
        }
        "webp" => {
            args.extend(vf(filters, &[]));
            if cat == Category::Animated {
                args.extend(s(&["-c:v", "libwebp_anim", "-loop", "0", "-quality", "85"]));
            } else {
                args.extend(s(&["-c:v", "libwebp", "-quality", "85", "-frames:v", "1"]));
            }
        }
        "ico" => {
            args.extend(vf(filters, &["scale='min(256,iw)':'min(256,ih)':force_original_aspect_ratio=decrease"]));
            args.extend(s(&["-frames:v", "1"]));
        }
        o => return Err(format!("unknown output {o}")),
    }
    // keep tags (title, artist, …) where the format allows
    if matches!(cat, Category::Audio | Category::Video) {
        args.extend(s(&["-map_metadata", "0"]));
    }
    Ok(args)
}

/// Codec of the first video stream ("h264", "hevc", "vp9" …), read from ffmpeg's file summary.
pub fn video_codec(ffmpeg: &Path, input: &Path) -> Option<String> {
    let mut cmd = Command::new(ffmpeg);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }
    let out = cmd.args(["-hide_banner", "-i"]).arg(input).output().ok()?;
    let text = String::from_utf8_lossy(&out.stderr);
    let line = text.lines().find(|l| l.contains("Video: "))?;
    Some(line.split("Video: ").nth(1)?.split([' ', ',']).next()?.to_string())
}

fn parse_duration(line: &str) -> Option<f64> {
    let rest = line.trim().strip_prefix("Duration: ")?;
    let t = rest.split(',').next()?.trim();
    let mut parts = t.split(':');
    let h: f64 = parts.next()?.parse().ok()?;
    let m: f64 = parts.next()?.parse().ok()?;
    let s: f64 = parts.next()?.parse().ok()?;
    Some(h * 3600.0 + m * 60.0 + s)
}

/// A running conversion that can be cancelled from another thread.
#[derive(Clone, Default)]
pub struct CancelHandle(Arc<Mutex<Option<Child>>>, Arc<Mutex<bool>>);

impl CancelHandle {
    pub fn cancel(&self) {
        *self.1.lock().unwrap() = true;
        if let Some(c) = self.0.lock().unwrap().as_mut() {
            let _ = c.kill();
        }
    }
    pub fn is_cancelled(&self) -> bool {
        self.cancelled()
    }
    fn cancelled(&self) -> bool {
        *self.1.lock().unwrap()
    }
}

/// Converts one file; `progress` gets 0.0…1.0. Blocking: run it on a worker thread.
/// Returns the written file. A failed or cancelled run leaves no partial file behind.
pub fn convert(ffmpeg: &Path, input: &Path, preset: &str, cancel: &CancelHandle, progress: impl FnMut(f32)) -> Result<PathBuf, String> {
    let cat = category_of(input).ok_or("UNSUPPORTED")?;
    if !common_presets(&[input.to_path_buf()]).iter().any(|p| p == preset) {
        return Err("UNSUPPORTED".into());
    }
    if !input.exists() {
        return Err("NOT_FOUND".into());
    }
    let output = output_path(input, preset);
    run_ffmpeg(ffmpeg, input, &ffmpeg_args(preset, cat)?, &output, cancel, progress)?;
    Ok(output)
}

/// Runs "ffmpeg -i <input> <args> <output>" with progress (0.0…1.0) and cancellation.
/// A failed or cancelled run leaves no partial output behind.
pub fn run_ffmpeg(ffmpeg: &Path, input: &Path, args: &[String], output: &Path, cancel: &CancelHandle, mut progress: impl FnMut(f32)) -> Result<(), String> {
    let mut cmd = Command::new(ffmpeg);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }
    cmd.args(["-hide_banner", "-nostdin", "-y", "-i"]).arg(input);
    cmd.args(args);
    cmd.args(["-progress", "pipe:1", "-nostats"]).arg(output);
    cmd.stdin(Stdio::null()).stdout(Stdio::piped()).stderr(Stdio::piped());

    let mut child = cmd.spawn().map_err(|e| format!("FFMPEG_START: {e}"))?;
    let stdout = child.stdout.take();
    let stderr = child.stderr.take();
    *cancel.0.lock().unwrap() = Some(child);

    // stderr: total duration + the last lines for error messages
    let duration = Arc::new(Mutex::new(0f64));
    let tail = Arc::new(Mutex::new(Vec::<String>::new()));
    let err_thread = stderr.map(|mut e| {
        let (duration, tail) = (duration.clone(), tail.clone());
        std::thread::spawn(move || {
            let mut buf = String::new();
            let _ = e.read_to_string(&mut buf);
            for line in buf.lines() {
                if let Some(d) = parse_duration(line) {
                    let mut cur = duration.lock().unwrap();
                    if *cur == 0.0 {
                        *cur = d;
                    }
                }
            }
            *tail.lock().unwrap() = buf.lines().rev().take(4).map(|s| s.to_string()).collect();
        })
    });

    if let Some(out) = stdout {
        for line in BufReader::new(out).lines().map_while(Result::ok) {
            if let Some(us) = line.strip_prefix("out_time_us=").and_then(|v| v.parse::<f64>().ok()) {
                let d = *duration.lock().unwrap();
                if d > 0.0 {
                    progress(((us / 1_000_000.0) / d).clamp(0.0, 0.99) as f32);
                }
            }
        }
    }
    if let Some(t) = err_thread {
        let _ = t.join();
    }
    let status = cancel.0.lock().unwrap().take().map(|mut c| c.wait());

    if cancel.cancelled() {
        let _ = std::fs::remove_file(output);
        return Err("CANCELLED".into());
    }
    match status {
        Some(Ok(s)) if s.success() && output.exists() => {
            progress(1.0);
            Ok(())
        }
        _ => {
            let _ = std::fs::remove_file(output);
            let mut lines = tail.lock().unwrap().clone();
            lines.reverse();
            Err(format!("FAILED: {}", lines.join(" | ")))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Converts generated samples with every preset. Needs ffmpeg on PATH:
    /// cargo test -p sophy-core every_preset -- --ignored --nocapture
    #[test]
    #[ignore]
    fn every_preset() {
        let ffmpeg = PathBuf::from("ffmpeg");
        let dir = std::env::temp_dir().join("sophy-convert-test");
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        let make = |name: &str, args: &[&str]| {
            let p = dir.join(name);
            let ok = Command::new(&ffmpeg).args(["-hide_banner", "-loglevel", "error", "-y"]).args(args).arg(&p).status().unwrap().success();
            assert!(ok, "sample {name}");
            p
        };
        let samples = [
            make("song.mp3", &["-f", "lavfi", "-i", "sine=frequency=440:duration=3"]),
            make("clip.mkv", &["-f", "lavfi", "-i", "testsrc=size=321x241:rate=25:duration=2", "-f", "lavfi", "-i", "sine=duration=2", "-shortest", "-c:v", "ffv1", "-c:a", "flac"]),
            make("photo.png", &["-f", "lavfi", "-i", "testsrc=size=301x201", "-frames:v", "1"]),
            make("anim.gif", &["-f", "lavfi", "-i", "testsrc=size=161x121:rate=10:duration=1"]),
        ];
        let mut failed = Vec::new();
        for input in &samples {
            for preset in common_presets(&[input.clone()]) {
                let mut last = 0.0;
                match convert(&ffmpeg, input, &preset, &CancelHandle::default(), |p| last = p) {
                    Ok(out) => println!("ok   {:<10} {:<22} -> {} ({:.0}%)", input.file_name().unwrap().to_string_lossy(), preset, out.file_name().unwrap().to_string_lossy(), last * 100.0),
                    Err(e) => {
                        println!("FAIL {:<10} {:<22} {e}", input.file_name().unwrap().to_string_lossy(), preset);
                        failed.push(format!("{} {preset}", input.display()));
                    }
                }
            }
        }
        assert!(failed.is_empty(), "{failed:?}");
    }
}
