//! Tauri commands for the Suno Style Prompter AI mode (see sophy_core::prompter_ai).

use sophy_core::prompter_ai;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn prompter_ai_status() -> prompter_ai::AiStatus {
    prompter_ai::status()
}

#[tauri::command]
pub async fn prompter_ai_download(app: AppHandle) -> Result<(), String> {
    prompter_ai::download(move |p| {
        let _ = app.emit("prompter-ai-progress", p);
    })
    .await
}

#[tauri::command]
pub fn prompter_ai_delete() -> Result<(), String> {
    prompter_ai::delete_model()
}

/// Rewrites the user's request (any language) into an English music brief for the rule engine.
#[tauri::command]
pub async fn prompter_ai_understand(text: String) -> Result<String, String> {
    tauri::async_runtime::spawn_blocking(move || prompter_ai::understand(&text))
        .await
        .map_err(|e| format!("AI_FAILED: {e}"))?
}
