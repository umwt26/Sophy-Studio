//! Diagnostic: tag a file the same way the Metadata Editor does.
//! usage: tag_probe <audio> <cover-image>
use base64::Engine;

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let b64 = base64::engine::general_purpose::STANDARD.encode(std::fs::read(&args[2]).unwrap());
    let input = sophy_core::SaveMetadataInput {
        file_path: args[1].clone(),
        title: Some("Probe Title".into()),
        artist: Some("Probe Artist".into()),
        album: Some("Probe Album".into()),
        year: Some("2026".into()),
        genre: Some("Rap".into()),
        track_number: Some("3".into()),
        comment: None,
        cover_base64: Some(b64),
        cover_mime_type: Some("image/jpeg".into()),
        remove_cover: Some(false),
    };
    match sophy_core::MetadataManager::save_metadata(&input) {
        Ok(_) => println!("save OK"),
        Err(e) => println!("save ERR {e}"),
    }
}
