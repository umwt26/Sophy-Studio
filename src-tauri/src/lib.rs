mod commands;
mod converter;
mod instagram;
mod prompter_ai;
mod update_notify;

pub use converter::run_from_explorer as run_converter;
pub use update_notify::background_check as background_update_check;

use commands::*;
use prompter_ai::*;

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
      download_universal_media,
      cut_audio_sample,
      send_feedback,
      prompter_ai_status,
      prompter_ai_download,
      prompter_ai_delete,
      prompter_ai_understand,
      update_notify::save_notify_texts,
      converter::converter_presets,
      converter::converter_pick_files,
      converter::converter_start,
      converter::converter_cancel,
      converter::converter_context_menu,
      converter::show_in_folder,
      converter::converter_allow_preview,
      converter::preview_prepare,
      instagram::instagram_post,
      instagram::instagram_download
    ])
    .setup(|app| {
      // the main window is built here, not from tauri.conf.json ("create": false), so the
      // right-click converter (a separate process) can start with only its own small window
      if let Some(cfg) = app.config().app.windows.iter().find(|w| w.label == "main") {
        let window = tauri::WebviewWindowBuilder::from_config(app.handle(), cfg)?.build()?;
        let _ = window.set_icon(tauri::include_image!("icons/icon.png"));
      }

      // Automatically clean up legacy machine-wide v0.1.0 duplicate installations & shortcuts
      cleanup_legacy_installations();

      // Update notifications while the app is closed (scheduled task + Windows toast)
      update_notify::register();

      // Suno Style Prompter AI model: downloaded silently on first run (only on CPUs that can run it)
      prompter_ai::spawn_auto_download(app.handle().clone());

      // Proactively ensure yt-dlp, ffmpeg and ffprobe binaries in background
      tauri::async_runtime::spawn(async move {
        let _ = sophy_core::UniversalDownloader::ensure_ytdlp_binary().await;
        let _ = sophy_core::MediaConverter::ensure_ffmpeg_binary().await;
        let _ = sophy_core::MediaConverter::ensure_ffprobe_binary().await;
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
