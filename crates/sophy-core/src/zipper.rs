use std::path::{Path, PathBuf};
use std::fs::File;
use std::io::{Read, Write};
use zip::write::SimpleFileOptions;
use zip::ZipWriter;

pub fn create_all_zip(
    zip_path: &Path,
    files: &[(&str, &Path)], // (relative_name_in_zip, file_path_on_disk)
) -> Result<PathBuf, String> {
    let file = File::create(zip_path)
        .map_err(|e| format!("Failed to create zip file: {}", e))?;
    let mut zip = ZipWriter::new(file);
    let options = SimpleFileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated);

    let mut buffer = Vec::new();

    for (name_in_zip, disk_path) in files {
        if !disk_path.exists() {
            continue;
        }

        zip.start_file(*name_in_zip, options)
            .map_err(|e| format!("Zip error starting file {}: {}", name_in_zip, e))?;

        let mut f = File::open(disk_path)
            .map_err(|e| format!("Failed to open file {}: {}", disk_path.display(), e))?;
        buffer.clear();
        f.read_to_end(&mut buffer)
            .map_err(|e| format!("Failed to read file {}: {}", disk_path.display(), e))?;

        zip.write_all(&buffer)
            .map_err(|e| format!("Zip write error: {}", e))?;
    }

    zip.finish()
        .map_err(|e| format!("Failed to finalize zip file: {}", e))?;

    Ok(zip_path.to_path_buf())
}
