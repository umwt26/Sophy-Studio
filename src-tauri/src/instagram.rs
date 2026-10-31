//! Instagram posts in the Universal downloader: every photo and video of a post (also
//! carousels), so the user can pick numbers and download just those.
//!
//! Uses the same public query Instagram's own logged-out web page makes (page cookies + LSD
//! token → graphql/query). Instagram limits it per IP and sometimes asks for a login; then
//! the post page's preview image is offered instead (IG_LIMITED tells the UI).

use serde::{Deserialize, Serialize};
use sophy_core::SophyPaths;

const UA: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const APP_ID: &str = "936619743392459";
const DOC_ID: &str = "8845758582119845";

#[derive(Serialize, Deserialize, Clone)]
pub struct IgItem {
    /// 1-based position in the post
    pub index: usize,
    pub video: bool,
    /// full-size photo, or the video file
    pub url: String,
    /// photo / video cover for the picker
    pub thumb: String,
}

#[derive(Serialize)]
pub struct IgPost {
    pub shortcode: String,
    pub owner: String,
    pub caption: String,
    pub items: Vec<IgItem>,
    /// true when Instagram refused the full query and only the preview image is known
    pub limited: bool,
}

/// "instagram.com/p/<code>", "/reel/<code>", "/tv/<code>" → code
pub fn shortcode(url: &str) -> Option<String> {
    let re = regex::Regex::new(r"instagram\.com/(?:[A-Za-z0-9_.]+/)?(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)").ok()?;
    re.captures(url).map(|c| c[1].to_string())
}

fn client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .user_agent(UA)
        .connect_timeout(std::time::Duration::from_secs(15))
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| e.to_string())
}

fn meta(html: &str, property: &str) -> Option<String> {
    let re = regex::Regex::new(&format!(r#"<meta[^>]+property="{}"[^>]+content="([^"]*)""#, regex::escape(property))).ok()?;
    re.captures(html).map(|c| unescape(&c[1]))
}

/// HTML entities in meta tags: &amp; &quot; &#039; and numeric ones like &#x1f3a7; (emoji)
fn unescape(s: &str) -> String {
    let re = regex::Regex::new(r"&#(x?)([0-9a-fA-F]+);").unwrap();
    let s = re.replace_all(s, |c: &regex::Captures| {
        let n = if &c[1] == "x" { u32::from_str_radix(&c[2], 16) } else { c[2].parse() };
        n.ok().and_then(char::from_u32).map(|ch| ch.to_string()).unwrap_or_default()
    });
    s.replace("&quot;", "\"").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
}

#[tauri::command]
pub async fn instagram_post(url: String) -> Result<IgPost, String> {
    let code = shortcode(&url).ok_or("IG_NOT_A_POST")?;
    let client = client()?;
    let page_url = format!("https://www.instagram.com/p/{code}/");

    let page = client.get(&page_url).send().await.map_err(|e| format!("IG_NETWORK: {e}"))?;
    let cookies: Vec<String> = page
        .headers()
        .get_all(reqwest::header::SET_COOKIE)
        .iter()
        .filter_map(|v| v.to_str().ok())
        .filter_map(|v| v.split(';').next().map(|s| s.to_string()))
        .collect();
    let html = page.text().await.unwrap_or_default();
    let csrf = cookies.iter().find_map(|c| c.strip_prefix("csrftoken=")).unwrap_or("").to_string();
    let lsd = regex::Regex::new(r#""LSD",\[\],\{"token":"([^"]+)""#)
        .ok()
        .and_then(|re| re.captures(&html).map(|c| c[1].to_string()))
        .unwrap_or_default();

    let variables = serde_json::json!({ "shortcode": code, "fetch_tagged_user_count": null, "hoisted_comment_id": null, "hoisted_reply_id": null }).to_string();
    let form = [
        ("av", "0"),
        ("__d", "www"),
        ("__user", "0"),
        ("__a", "1"),
        ("lsd", lsd.as_str()),
        ("fb_api_caller_class", "RelayModern"),
        ("fb_api_req_friendly_name", "PolarisPostActionLoadPostQueryQuery"),
        ("server_timestamps", "true"),
        ("variables", variables.as_str()),
        ("doc_id", DOC_ID),
    ];
    let full = client
        .post("https://www.instagram.com/graphql/query")
        .header("X-IG-App-ID", APP_ID)
        .header("X-FB-LSD", &lsd)
        .header("X-CSRFToken", &csrf)
        .header("X-ASBD-ID", "129477")
        .header("X-FB-Friendly-Name", "PolarisPostActionLoadPostQueryQuery")
        .header("Origin", "https://www.instagram.com")
        .header("Referer", &page_url)
        .header("Cookie", cookies.join("; "))
        .form(&form)
        .send()
        .await
        .ok();
    let json: Option<serde_json::Value> = match full {
        Some(r) => r.json().await.ok(),
        None => None,
    };

    if let Some(m) = json.as_ref().map(|j| &j["data"]["xdt_shortcode_media"]).filter(|m| m.is_object()) {
        let nodes: Vec<&serde_json::Value> = match m["edge_sidecar_to_children"]["edges"].as_array() {
            Some(edges) => edges.iter().map(|e| &e["node"]).collect(),
            None => vec![m],
        };
        let items = nodes
            .iter()
            .enumerate()
            .filter_map(|(i, n)| {
                let thumb = n["display_url"].as_str()?.to_string();
                let video = n["is_video"].as_bool().unwrap_or(false);
                let url = if video { n["video_url"].as_str().map(|s| s.to_string()).unwrap_or_else(|| thumb.clone()) } else { thumb.clone() };
                Some(IgItem { index: i + 1, video, url, thumb })
            })
            .collect::<Vec<_>>();
        if !items.is_empty() {
            return Ok(IgPost {
                shortcode: code,
                owner: m["owner"]["username"].as_str().unwrap_or("instagram").to_string(),
                caption: m["edge_media_to_caption"]["edges"][0]["node"]["text"].as_str().unwrap_or("").to_string(),
                items,
                limited: false,
            });
        }
    }

    // Instagram refused (rate limit / login wall). Link previews (the user agent chat apps use)
    // still get the post's cover image and title; a reel is then downloaded by yt-dlp.
    let preview = client
        .get(&page_url)
        .header(reqwest::header::USER_AGENT, "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)")
        .send()
        .await
        .ok();
    let html = match preview {
        Some(r) => r.text().await.unwrap_or_default(),
        None => String::new(),
    };
    if let Some(img) = meta(&html, "og:image") {
        let og_url = meta(&html, "og:url").unwrap_or_default();
        let video = og_url.contains("/reel/") || og_url.contains("/tv/") || meta(&html, "og:type").is_some_and(|t| t.starts_with("video"));
        let title = meta(&html, "og:title").unwrap_or_default();
        let owner = og_url
            .split("instagram.com/")
            .nth(1)
            .and_then(|r| r.split('/').next())
            .filter(|u| !matches!(*u, "p" | "reel" | "tv" | ""))
            .map(|u| u.to_string())
            .unwrap_or_else(|| title.split(" on Instagram").next().unwrap_or("instagram").trim().to_string());
        return Ok(IgPost {
            shortcode: code,
            owner,
            caption: meta(&html, "og:description").unwrap_or_default(),
            items: vec![IgItem { index: 1, video, url: if video { page_url.clone() } else { img.clone() }, thumb: img }],
            limited: true,
        });
    }
    Err("IG_LIMITED".into())
}

/// Saves the chosen photos/videos into the Universal Media folder:
/// "<owner> <code> 3 -- sophy.beli26.xyz - ID XXXXXX.jpg", never over an existing file.
#[tauri::command]
pub async fn instagram_download(owner: String, shortcode: String, items: Vec<IgItem>) -> Result<Vec<String>, String> {
    let dir = SophyPaths::init()?.universal;
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let client = client()?;
    let tag = SophyPaths::download_tag();
    let owner = SophyPaths::sanitize_filename(&owner);
    let mut saved = Vec::new();
    for item in items {
        // a reel known only from its page: yt-dlp fetches the video
        if item.video && item.url.starts_with("https://www.instagram.com/") {
            saved.push(sophy_core::UniversalDownloader::download(&item.url, "video", &dir).await?);
            continue;
        }
        let resp = client.get(&item.url).send().await.map_err(|e| format!("IG_NETWORK: {e}"))?;
        if !resp.status().is_success() {
            return Err(format!("IG_NETWORK: HTTP {}", resp.status()));
        }
        let ext = if item.video {
            "mp4"
        } else {
            match resp.headers().get(reqwest::header::CONTENT_TYPE).and_then(|v| v.to_str().ok()) {
                Some(t) if t.contains("webp") => "webp",
                Some(t) if t.contains("png") => "png",
                Some(t) if t.contains("heic") => "heic",
                _ => "jpg",
            }
        };
        let bytes = resp.bytes().await.map_err(|e| format!("IG_NETWORK: {e}"))?;
        let path = SophyPaths::unique_path(&dir, &format!("{owner} {shortcode} {}{tag}", item.index), ext);
        std::fs::write(&path, &bytes).map_err(|e| e.to_string())?;
        saved.push(path.to_string_lossy().to_string());
    }
    Ok(saved)
}
