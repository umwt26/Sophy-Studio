mod commands;

use commands::*;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      resolve_song,
      get_sophy_paths,
      open_sophy_folder,
      open_url,
      download_media,
      check_for_updates
    ])
    .setup(|app| {
      if let Some(window) = app.get_webview_window("main") {
        let icon = tauri::include_image!("icons/icon.png");
        let _ = window.set_icon(icon);
      }

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
