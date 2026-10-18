fn main() {
  // Re-run build script when icon or tauri config changes
  println!("cargo:rerun-if-changed=icons/icon.ico");
  println!("cargo:rerun-if-changed=tauri.conf.json");
  tauri_build::build()
}
