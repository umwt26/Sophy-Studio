use regex::Regex;
use std::sync::LazyLock;

static UUID_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?i)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}").unwrap()
});

static SHORT_RE: LazyLock<Regex> = LazyLock::new(|| {
    Regex::new(r"(?i)suno\.com/s/([A-Za-z0-9_-]+)").unwrap()
});

pub enum ResolvedLink {
    DirectId(String),
    ShortCode(String),
}

pub fn parse_input_link(input: &str) -> Option<ResolvedLink> {
    let trimmed = input.trim();
    if let Some(caps) = SHORT_RE.captures(trimmed) {
        if let Some(m) = caps.get(1) {
            return Some(ResolvedLink::ShortCode(m.as_str().to_string()));
        }
    }
    if let Some(m) = UUID_RE.find(trimmed) {
        return Some(ResolvedLink::DirectId(m.as_str().to_string()));
    }
    None
}

pub async fn resolve_to_uuid(client: &reqwest::Client, input: &str) -> Result<String, String> {
    match parse_input_link(input) {
        Some(ResolvedLink::DirectId(id)) => Ok(id),
        Some(ResolvedLink::ShortCode(code)) => {
            let short_url = format!("https://suno.com/s/{}", code);
            let resp = client
                .get(&short_url)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .send()
                .await
                .map_err(|e| format!("Failed to resolve short link: {}", e))?;

            let final_url = resp.url().as_str();
            if let Some(m) = UUID_RE.find(final_url) {
                return Ok(m.as_str().to_string());
            }

            // Fallback: search HTML for canonical or uuid
            let text = resp
                .text()
                .await
                .map_err(|e| format!("Failed to read response body: {}", e))?;
            if let Some(m) = UUID_RE.find(&text) {
                return Ok(m.as_str().to_string());
            }

            Err(format!("Could not extract song ID from {}", short_url))
        }
        None => Err("Invalid Suno link or ID format. Expected a link like https://suno.com/s/... or UUID".to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_input_link() {
        let direct = "https://suno.com/song/47dc465a-561f-4b74-8bb5-b84164e481b6";
        assert!(matches!(parse_input_link(direct), Some(ResolvedLink::DirectId(_))));

        let short = "https://suno.com/s/OFsm1ynGEMMX9B2e";
        assert!(matches!(parse_input_link(short), Some(ResolvedLink::ShortCode(_))));

        let raw_uuid = "47dc465a-561f-4b74-8bb5-b84164e481b6";
        assert!(matches!(parse_input_link(raw_uuid), Some(ResolvedLink::DirectId(_))));
    }
}
