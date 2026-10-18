use crate::model::SongClip;
use serde_json::Value;

pub async fn fetch_song_clip(client: &reqwest::Client, uuid: &str) -> Result<SongClip, String> {
    let api_url = format!("https://studio-api-prod.suno.com/api/clip/{}", uuid);
    let resp = client
        .get(&api_url)
        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| format!("Network error while connecting to Suno API: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("Suno API returned status: {}", resp.status()));
    }

    let json: Value = resp
        .json()
        .await
        .map_err(|e| format!("Failed to parse Suno API response: {}", e))?;

    let id = json["id"].as_str().unwrap_or(uuid).to_string();
    let title = json["title"].as_str().unwrap_or("Untitled Song").to_string();
    let display_name = json["display_name"].as_str().unwrap_or("Unknown Artist").to_string();
    let handle = json["handle"].as_str().unwrap_or("").to_string();
    let is_public = json["is_public"].as_bool().unwrap_or(false);

    let raw_image = json["image_url"].as_str().unwrap_or("");
    let raw_large = json["image_large_url"].as_str().unwrap_or(raw_image);

    let image_url = if !raw_image.is_empty() {
        raw_image.replace("cdn2.suno.ai", "cdn1.suno.ai")
    } else {
        format!("https://cdn1.suno.ai/image_{}.jpeg", id)
    };

    let image_large_url = if !raw_large.is_empty() {
        raw_large.replace("cdn2.suno.ai", "cdn1.suno.ai")
    } else {
        format!("https://cdn1.suno.ai/image_large_{}.jpeg", id)
    };

    let audio_url = json["audio_url"].as_str().unwrap_or("").to_string();
    let video_url = json["video_url"].as_str().unwrap_or("").to_string();

    let duration = json["metadata"]["duration"].as_f64();
    let prompt = json["metadata"]["prompt"].as_str().unwrap_or("").to_string();
    let tags = json["metadata"]["tags"].as_str().unwrap_or("").to_string();
    let major_model_version = json["major_model_version"].as_str().unwrap_or("").to_string();

    // Check media_urls for progressive opus/m4a streams as fallback
    let mut fallback_stream_url = None;
    if let Some(media_urls) = json["media_urls"].as_array() {
        for m in media_urls {
            if let Some(url_str) = m["url"].as_str() {
                if !url_str.is_empty() {
                    fallback_stream_url = Some(url_str.to_string());
                    break;
                }
            }
        }
    }

    Ok(SongClip {
        id,
        title,
        display_name,
        handle,
        is_public,
        image_url,
        image_large_url,
        audio_url,
        video_url,
        duration,
        prompt,
        tags,
        major_model_version,
        fallback_stream_url,
    })
}
