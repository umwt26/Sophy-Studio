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
      check_for_updates,
      install_update,
      read_audio_metadata,
      save_audio_metadata,
      select_audio_file,
      select_image_file,
      read_file_binary,
      read_file_base64,
      get_folder_settings,
      save_folder_settings,
      select_folder,
      open_folder_path,
      fetch_universal_media_info,
      download_universal_media
    ])
    .setup(|app| {
      if let Some(window) = app.get_webview_window("main") {
        let icon = tauri::include_image!("icons/icon.png");
        let _ = window.set_icon(icon);
      }

      // Proactively ensure yt-dlp and ffmpeg binaries in background
      tauri::async_runtime::spawn(async move {
        let _ = sophy_core::UniversalDownloader::ensure_ytdlp_binary().await;
        let _ = sophy_core::MediaConverter::ensure_ffmpeg_binary().await;
      });

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
