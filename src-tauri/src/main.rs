// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  // started by the scheduled task: check for an update, maybe show a toast, no window
  if std::env::args().any(|a| a == "--update-check") {
    sophy_lib::background_update_check();
    return;
  }
  // Explorer right-click "Sophy Studio Compressor": sophy.exe --compress <file>…
  if let Some(i) = std::env::args().position(|a| a == "--compress") {
    let files: Vec<String> = std::env::args().skip(i + 1).collect();
    sophy_lib::run_converter("compress".into(), files);
    return;
  }
  // Explorer right-click menu: sophy.exe --convert <preset> <file>…
  let args: Vec<String> = std::env::args().collect();
  if let Some(i) = args.iter().position(|a| a == "--convert") {
    if let Some(preset) = args.get(i + 1) {
      sophy_lib::run_converter(preset.clone(), args[i + 2..].to_vec());
      return;
    }
  }
  sophy_lib::run();
}

