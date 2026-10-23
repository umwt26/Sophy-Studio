import type { AppThemeConfig } from "../types";

const THEME_STORAGE_KEY = "sophy_studio_theme_config";

export const ACCENT_COLORS: Record<string, { name: string; hex: string; hover: string; soft: string }> = {
  blue: {
    name: "Mavi (Ana)",
    hex: "#38bdf8",
    hover: "#0ea5e9",
    soft: "rgba(56, 189, 248, 0.16)",
  },
  red: {
    name: "Kırmızı",
    hex: "#ef4444",
    hover: "#dc2626",
    soft: "rgba(239, 68, 68, 0.16)",
  },
  green: {
    name: "Yeşil",
    hex: "#10b981",
    hover: "#059669",
    soft: "rgba(16, 185, 129, 0.16)",
  },
  purple: {
    name: "Mor",
    hex: "#a855f7",
    hover: "#9333ea",
    soft: "rgba(168, 85, 247, 0.16)",
  },
  orange: {
    name: "Turuncu",
    hex: "#f97316",
    hover: "#ea580c",
    soft: "rgba(249, 115, 22, 0.16)",
  },
  pink: {
    name: "Pembe",
    hex: "#ec4899",
    hover: "#db2777",
    soft: "rgba(236, 72, 153, 0.16)",
  },
};

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function computeAccent(hex: string): { hex: string; hover: string; soft: string } {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return ACCENT_COLORS.blue;
  }
  const hoverHex = rgbToHex(
    Math.min(255, Math.round(rgb.r * 1.15)),
    Math.min(255, Math.round(rgb.g * 1.15)),
    Math.min(255, Math.round(rgb.b * 1.15))
  );
  return {
    hex,
    hover: hoverHex,
    soft: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`,
  };
}

export function loadSavedTheme(): AppThemeConfig {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.mode && parsed.color) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return { mode: "dark", color: "blue", customHex: "#38bdf8" };
}

export function saveTheme(config: AppThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
  applyTheme(config);
}

export function applyTheme(config: AppThemeConfig): void {
  const root = document.documentElement;

  // Resolve mode (Dark / Light / Windows System)
  let isDark = true;
  if (config.mode === "light") {
    isDark = false;
  } else if (config.mode === "system") {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Accent colors
  let accent: { hex: string; hover: string; soft: string };
  if (config.customHex && config.customHex.startsWith("#")) {
    accent = computeAccent(config.customHex);
  } else if (typeof config.color === "string" && config.color.startsWith("#")) {
    accent = computeAccent(config.color);
  } else if (ACCENT_COLORS[config.color]) {
    accent = ACCENT_COLORS[config.color];
  } else {
    accent = ACCENT_COLORS.blue;
  }

  root.style.setProperty("--color-accent", accent.hex);
  root.style.setProperty("--color-accent-hover", accent.hover);
  root.style.setProperty("--color-accent-soft", accent.soft);

  // Surface and text colors based on Dark vs Light
  if (isDark) {
    root.style.setProperty("--color-app-bg", "#0d0f14");
    root.style.setProperty("--color-app-surface", "#11131a");
    root.style.setProperty("--color-app-surface-2", "#161922");
    root.style.setProperty("--color-app-border", "#202532");
    root.style.setProperty("--color-app-border-soft", "#1a1e29");
    root.style.setProperty("--color-text-primary", "#f3f4f6");
    root.style.setProperty("--color-text-secondary", "#8e94a5");
    root.style.setProperty("--color-text-muted", "#5e6375");
    root.classList.remove("light-mode");
    root.classList.add("dark");
  } else {
    root.style.setProperty("--color-app-bg", "#f4f6f9");
    root.style.setProperty("--color-app-surface", "#ffffff");
    root.style.setProperty("--color-app-surface-2", "#f0f2f6");
    root.style.setProperty("--color-app-border", "#dce1e9");
    root.style.setProperty("--color-app-border-soft", "#e5e9f0");
    root.style.setProperty("--color-text-primary", "#111827");
    root.style.setProperty("--color-text-secondary", "#4b5563");
    root.style.setProperty("--color-text-muted", "#9ca3af");
    root.classList.remove("dark");
    root.classList.add("light-mode");
  }
}
