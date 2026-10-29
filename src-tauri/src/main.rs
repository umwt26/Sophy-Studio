// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  // started by the scheduled task: check for an update, maybe show a toast, no window
  if std::env::args().any(|a| a == "--update-check") {
    sophy_lib::background_update_check();
    return;
  }
  sophy_lib::run();
}

