const STORAGE_KEY = "sophy_accessibility";

export interface AccessibilityConfig {
  /** Multiplier for all text (root font size) */
  textScale: number;
  /** Zoom of the whole interface */
  displayScale: number;
  reduceMotion: boolean;
}

export const TEXT_SCALES = [0.9, 1, 1.125, 1.25] as const;
export const DISPLAY_SCALES = [0.9, 1, 1.1, 1.25, 1.5] as const;

const DEFAULT_CONFIG: AccessibilityConfig = { textScale: 1, displayScale: 1, reduceMotion: false };

export function loadAccessibility(): AccessibilityConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        textScale: TEXT_SCALES.includes(p.textScale) ? p.textScale : 1,
        displayScale: DISPLAY_SCALES.includes(p.displayScale) ? p.displayScale : 1,
        reduceMotion: !!p.reduceMotion,
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

export function saveAccessibility(config: AccessibilityConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
  applyAccessibility(config);
}

async function applyDisplayScale(scale: number): Promise<void> {
  const root = document.documentElement;
  // In the desktop app the WebView itself is zoomed, so layout (100vh etc.)
  // stays correct. The CSS fallback only serves the plain browser preview.
  if ("__TAURI_INTERNALS__" in window) {
    try {
      const { getCurrentWebview } = await import("@tauri-apps/api/webview");
      await getCurrentWebview().setZoom(scale);
      root.style.removeProperty("zoom");
      return;
    } catch (e) {
      console.warn("Display zoom failed:", e);
    }
  }
  if (scale === 1) root.style.removeProperty("zoom");
  else root.style.setProperty("zoom", String(scale));
}

export function applyAccessibility(config: AccessibilityConfig): void {
  const root = document.documentElement;
  root.style.setProperty("--text-scale", String(config.textScale));
  root.classList.toggle("reduce-motion", config.reduceMotion);
  void applyDisplayScale(config.displayScale);
}
