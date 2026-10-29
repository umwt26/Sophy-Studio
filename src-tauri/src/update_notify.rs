//! Update notifications while Sophy Studio is closed (Windows).
//!
//! The app registers a per-user scheduled task that starts `sophy.exe --update-check` every
//! 6 hours. That run opens no window: it asks GitHub for the latest release and, when it is
//! newer, shows a Windows toast (once per version per day). Clicking the toast starts the app,
//! which then shows its own update screen. Toast texts come from the UI in the user's language.

// the registration only runs in release builds
#![cfg_attr(debug_assertions, allow(dead_code))]

use std::path::PathBuf;

const TASK_NAME: &str = "Sophy Studio Update Check";
const APP_ID: &str = "com.sophystudio.desktop";
const ICON: &[u8] = include_bytes!("../icons/128x128.png");

#[derive(serde::Serialize, serde::Deserialize, Default)]
struct NotifyState {
    /// "{version}" is replaced with the new version number
    title: String,
    body: String,
    last_version: String,
    last_at: u64,
    task_exe: String,
}

fn data_dir() -> PathBuf {
    let base = std::env::var_os("LOCALAPPDATA").map(PathBuf::from).unwrap_or_else(std::env::temp_dir);
    base.join("SophyStudio")
}

fn state_path() -> PathBuf {
    data_dir().join("update-notify.json")
}

fn load() -> NotifyState {
    std::fs::read(state_path())
        .ok()
        .and_then(|b| serde_json::from_slice(&b).ok())
        .unwrap_or_default()
}

fn save(s: &NotifyState) {
    let _ = std::fs::create_dir_all(data_dir());
    if let Ok(b) = serde_json::to_vec_pretty(s) {
        let _ = std::fs::write(state_path(), b);
    }
}

fn now_secs() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

#[cfg(target_os = "windows")]
fn run_hidden(program: &str, args: &[&str]) -> bool {
    use std::os::windows::process::CommandExt;
    std::process::Command::new(program)
        .args(args)
        .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

/// Toast texts in the UI language, saved whenever the language changes.
#[tauri::command]
pub fn save_notify_texts(title: String, body: String) {
    let mut s = load();
    s.title = title;
    s.body = body;
    save(&s);
}

/// Called at app start: (re)creates the scheduled task when the exe moved, and registers the
/// toast sender name and icon for this unpackaged app.
pub fn register() {
    #[cfg(all(target_os = "windows", not(debug_assertions)))]
    std::thread::spawn(|| {
        let Ok(exe) = std::env::current_exe() else { return };
        let exe = exe.to_string_lossy().to_string();
        let mut s = load();

        let icon = data_dir().join("notify-icon.png");
        let _ = std::fs::create_dir_all(data_dir());
        let _ = std::fs::write(&icon, ICON);
        let key = format!("HKCU\\Software\\Classes\\AppUserModelId\\{APP_ID}");
        run_hidden("reg", &["add", &key, "/v", "DisplayName", "/t", "REG_SZ", "/d", "Sophy Studio", "/f"]);
        run_hidden("reg", &["add", &key, "/v", "IconUri", "/t", "REG_SZ", "/d", &icon.to_string_lossy(), "/f"]);

        if s.task_exe != exe {
            let tr = format!("\"{exe}\" --update-check");
            let ok = run_hidden("schtasks", &["/Create", "/F", "/TN", TASK_NAME, "/SC", "HOURLY", "/MO", "6", "/TR", &tr]);
            if ok {
                s.task_exe = exe;
                save(&s);
            }
        }
    });
}

/// `sophy.exe --update-check`: one check, maybe one toast, then exit.
pub fn background_check() {
    let Ok(rt) = tokio::runtime::Builder::new_current_thread().enable_all().build() else { return };
    let Ok(info) = rt.block_on(crate::commands::check_for_updates(None)) else { return };
    if !info.has_update {
        return;
    }

    let mut s = load();
    let day = 24 * 60 * 60;
    if s.last_version == info.latest_version && now_secs().saturating_sub(s.last_at) < day {
        return;
    }
    s.last_version = info.latest_version.clone();
    s.last_at = now_secs();
    save(&s);

    let title = if s.title.is_empty() { "Sophy Studio {version} is out".to_string() } else { s.title.clone() };
    let body = if s.body.is_empty() { "Click to see what's new and update.".to_string() } else { s.body.clone() };
    show_toast(&title.replace("{version}", &info.latest_version), &body);
}

#[cfg(target_os = "windows")]
fn show_toast(title: &str, body: &str) {
    use tauri_winrt_notification::{Duration, Toast};
    let (tx, rx) = std::sync::mpsc::channel::<()>();
    let shown = Toast::new(APP_ID)
        .title(title)
        .text1(body)
        .duration(Duration::Long)
        .on_activated(move |_| {
            let _ = tx.send(());
            Ok(())
        })
        .show();
    if shown.is_err() {
        return;
    }
    // stay around for a while so a click on the toast can open the app
    if rx.recv_timeout(std::time::Duration::from_secs(120)).is_ok() {
        if let Ok(exe) = std::env::current_exe() {
            let _ = std::process::Command::new(exe).spawn();
        }
    }
}

#[cfg(not(target_os = "windows"))]
fn show_toast(_title: &str, _body: &str) {}
