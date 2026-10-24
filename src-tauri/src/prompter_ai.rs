//! Tauri commands for the Suno Style Prompter AI mode (see sophy_core::prompter_ai).

use sophy_core::prompter_ai;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn prompter_ai_status() -> prompter_ai::AiStatus {
    prompter_ai::status()
}

#[tauri::command]
pub async fn prompter_ai_download(app: AppHandle) -> Result<(), String> {
    let emitter = app.clone();
    let r = prompter_ai::download(move |p| {
        let _ = emitter.emit("prompter-ai-progress", p);
    })
    .await;
    let _ = app.emit("prompter-ai-finished", r.clone().err());
    r
}

/// Called once on app start: downloads the model in the background if needed.
pub fn spawn_auto_download(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let emitter = app.clone();
        let r = prompter_ai::ensure_model(move |p| {
            let _ = emitter.emit("prompter-ai-progress", p);
        })
        .await;
        let _ = app.emit("prompter-ai-finished", r.err());
    });
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
