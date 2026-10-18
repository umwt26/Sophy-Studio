use aes::cipher::{KeyIvInit, StreamCipher};
use aes::Aes128;
use aes_gcm::aead::{Aead, KeyInit, Payload};
use aes_gcm::Aes256Gcm;
use base64::prelude::*;
use ctr::Ctr128BE;
use sha2::{Digest, Sha256};

type Aes128Ctr = Ctr128BE<Aes128>;

#[derive(serde::Deserialize, Debug)]
struct MangoRights {
    key: String,
    iv: String,
    glt: String,
}

pub async fn decrypt_suno_stream(
    client: &reqwest::Client,
    content_id: &str,
    encrypted_bytes: &[u8],
) -> Result<Vec<u8>, String> {
    // 1. Request DRM rights
    let payload = serde_json::json!({
        "content_params": {
            "content_id": content_id,
            "content_type": "clip"
        }
    });

    let resp = client
        .post("https://studio-api-prod.suno.com/api/mango/rights")
        .header("Content-Type", "application/json")
        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")
        .header("Accept", "application/json")
        .header("Origin", "https://suno.com")
        .header("Referer", "https://suno.com/")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Failed to connect to Suno rights server: {}", e))?;

    if !resp.status().is_success() {
        return Err(format!("Suno rights server returned error: {}", resp.status()));
    }

    let rights: MangoRights = resp
        .json()
        .await
        .map_err(|e| format!("Failed to parse Suno DRM rights: {}", e))?;

    // 2. Derive userKey = SHA-256(glt)
    let user_key_hash = Sha256::digest(rights.glt.as_bytes());
    let gcm_cipher = Aes256Gcm::new_from_slice(&user_key_hash)
        .map_err(|e| format!("Failed to init GCM cipher: {}", e))?;

    // 3. Unwrap key & iv
    let unwrap = |b64: &str, label: &str| -> Result<Vec<u8>, String> {
        let raw = BASE64_STANDARD
            .decode(b64)
            .map_err(|e| format!("Invalid base64 in DRM {}: {}", label, e))?;
        if raw.len() < 28 {
            return Err(format!("DRM {} data too short", label));
        }
        let nonce = aes_gcm::Nonce::from_slice(&raw[0..12]);
        let ciphertext_with_tag = &raw[12..];

        let payload = Payload {
            msg: ciphertext_with_tag,
            aad: content_id.as_bytes(),
        };

        gcm_cipher
            .decrypt(nonce, payload)
            .map_err(|e| format!("Failed to unwrap DRM {}: {}", label, e))
    };

    let raw_key = unwrap(&rights.key, "key")?;
    let raw_iv = unwrap(&rights.iv, "iv")?;

    if raw_key.len() != 16 {
        return Err(format!("Unexpected key length: {}", raw_key.len()));
    }
    if raw_iv.len() != 16 {
        return Err(format!("Unexpected IV length: {}", raw_iv.len()));
    }

    // 4. Decrypt audio with AES-128-CTR
    let mut decrypted = encrypted_bytes.to_vec();
    let mut ctr_cipher = Aes128Ctr::new(raw_key.as_slice().into(), raw_iv.as_slice().into());
    ctr_cipher.apply_keystream(&mut decrypted);

    Ok(decrypted)
}
