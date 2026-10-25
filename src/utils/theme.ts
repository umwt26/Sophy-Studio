import type { AppThemeConfig, ThemeTint } from "../types";

const THEME_STORAGE_KEY = "sophy_studio_theme_config";

export interface ThemePreset {
  id: string;
  /** i18n key under settings.themes */
  nameKey: string;
  fallbackName: string;
  /** Accent used on dark surfaces */
  dark: string;
  /** Deeper accent used on light surfaces so text and icons stay readable */
  light: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "ocean", nameKey: "settings.themes.ocean", fallbackName: "Ocean", dark: "#5b9dff", light: "#2563eb" },
  { id: "lagoon", nameKey: "settings.themes.lagoon", fallbackName: "Lagoon", dark: "#34d1bf", light: "#0d8a7d" },
  { id: "forest", nameKey: "settings.themes.forest", fallbackName: "Forest", dark: "#5fd38a", light: "#15803d" },
  { id: "amber", nameKey: "settings.themes.amber", fallbackName: "Amber", dark: "#f5b83d", light: "#b45309" },
  { id: "ember", nameKey: "settings.themes.ember", fallbackName: "Ember", dark: "#ff8a4c", light: "#d9480f" },
  { id: "crimson", nameKey: "settings.themes.crimson", fallbackName: "Crimson", dark: "#f2606f", light: "#d02d3f" },
  { id: "orchid", nameKey: "settings.themes.orchid", fallbackName: "Orchid", dark: "#f17bc0", light: "#c0267f" },
  { id: "violet", nameKey: "settings.themes.violet", fallbackName: "Violet", dark: "#a78bfa", light: "#6d48e0" },
  { id: "graphite", nameKey: "settings.themes.graphite", fallbackName: "Graphite", dark: "#d4d6dc", light: "#3b3f48" },
];

// Ids used before v1.3, mapped to the closest new preset
const LEGACY_PRESETS: Record<string, string> = {
  blue: "ocean",
  red: "crimson",
  green: "forest",
  purple: "violet",
  orange: "ember",
  pink: "orchid",
};

const DEFAULT_CONFIG: AppThemeConfig = { mode: "dark", color: "ocean", tint: "subtle" };

type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: string): Rgb | null {
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

/** Linear blend of two colours, `amount` = share of `b` (0..1). */
function mix(a: string, b: string, amount: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  return rgbToHex(
    ca.r + (cb.r - ca.r) * amount,
    ca.g + (cb.g - ca.g) * amount,
    ca.b + (cb.b - ca.b) * amount
  );
}

function alpha(hex: string, a: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

function luminance(hex: string): number {
  const c = hexToRgb(hex);
  if (!c) return 0;
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

/** Pushes a custom colour towards a readable value for the current mode. */
function readableAccent(hex: string, isDark: boolean): string {
  let out = hex;
  for (let i = 0; i < 8; i++) {
    const l = luminance(out);
    if (isDark && l < 0.16) out = mix(out, "#ffffff", 0.18);
    else if (!isDark && l > 0.28) out = mix(out, "#000000", 0.16);
    else break;
  }
  return out;
}

export function findPreset(id: string): ThemePreset | undefined {
  const resolved = LEGACY_PRESETS[id] ?? id;
  return THEME_PRESETS.find((p) => p.id === resolved);
}

export function isCustomColor(config: AppThemeConfig): boolean {
  return typeof config.color === "string" && config.color.startsWith("#");
}

/** The accent hex the user picked (before mode adjustments). */
export function pickedAccent(config: AppThemeConfig, isDark = true): string {
  if (isCustomColor(config)) return config.color;
  const preset = findPreset(config.color) ?? THEME_PRESETS[0];
  return isDark ? preset.dark : preset.light;
}

export function resolveIsDark(mode: AppThemeConfig["mode"]): boolean {
  if (mode === "light") return false;
  if (mode === "system") return window.matchMedia("(prefers-color-scheme: dark)").matches;
  return true;
}

export function loadSavedTheme(): AppThemeConfig {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.mode && parsed.color) {
        const color: string = findPreset(parsed.color)?.id ?? (String(parsed.color).startsWith("#") ? parsed.color : "ocean");
        const tint: ThemeTint = ["none", "subtle", "rich"].includes(parsed.tint) ? parsed.tint : "subtle";
        return { mode: parsed.mode, color, tint };
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

export function saveTheme(config: AppThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
  // Fade colours only while the user is changing the theme, never during normal use
  const root = document.documentElement;
  root.classList.add("theme-transition");
  if (transitionTimer) clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => root.classList.remove("theme-transition"), 350);
  applyTheme(config);
}

// How much of the accent hue bleeds into each surface, per tint level
const TINT_LEVELS: Record<ThemeTint, { bg: number; surface: number; border: number }> = {
  none: { bg: 0, surface: 0, border: 0 },
  subtle: { bg: 0.035, surface: 0.05, border: 0.09 },
  rich: { bg: 0.08, surface: 0.11, border: 0.18 },
};

const DARK_BASE = {
  bg: "#0f1013",
  sidebar: "#131418",
  surface: "#17181d",
  surface2: "#1d1f24",
  hover: "#24262c",
  border: "#2a2c33",
  borderSoft: "#202227",
  text: "#eceef2",
  text2: "#a2a5ae",
  text3: "#6c6f79",
};

const LIGHT_BASE = {
  bg: "#f4f5f7",
  sidebar: "#ebedf0",
  surface: "#ffffff",
  surface2: "#f2f3f6",
  hover: "#e7e9ed",
  border: "#dcdfe5",
  borderSoft: "#e7e9ee",
  text: "#15171c",
  text2: "#525762",
  text3: "#8c919c",
};

export function applyTheme(config: AppThemeConfig): void {
  const root = document.documentElement;
  const isDark = resolveIsDark(config.mode);
  const base = isDark ? DARK_BASE : LIGHT_BASE;
  const tint = TINT_LEVELS[config.tint ?? "subtle"];

  const accent = isCustomColor(config) ? readableAccent(config.color, isDark) : pickedAccent(config, isDark);
  const accentFg = luminance(accent) > 0.4 ? "#111216" : "#ffffff";
  // Hover: a touch lighter on dark, a touch deeper on light
  const accentHover = mix(accent, isDark ? "#ffffff" : "#000000", 0.12);

  const set = (name: string, value: string) => root.style.setProperty(name, value);

  set("--color-accent", accent);
  set("--color-accent-hover", accentHover);
  set("--color-accent-fg", accentFg);
  set("--color-accent-soft", alpha(accent, isDark ? 0.14 : 0.11));
  set("--color-accent-line", alpha(accent, isDark ? 0.38 : 0.34));

  set("--color-app-bg", mix(base.bg, accent, tint.bg));
  set("--color-app-sidebar", mix(base.sidebar, accent, tint.surface));
  set("--color-app-surface", mix(base.surface, accent, tint.bg));
  set("--color-app-surface-2", mix(base.surface2, accent, tint.surface));
  set("--color-app-hover", mix(base.hover, accent, tint.surface));
  set("--color-app-border", mix(base.border, accent, tint.border));
  set("--color-app-border-soft", mix(base.borderSoft, accent, tint.border));

  set("--color-text-primary", base.text);
  set("--color-text-secondary", mix(base.text2, accent, tint.bg));
  set("--color-text-muted", mix(base.text3, accent, tint.surface));

  set("--color-danger", isDark ? "#f2606f" : "#d02d3f");
  set("--color-success", isDark ? "#4cc98a" : "#15803d");
  set("--color-warning", isDark ? "#f5b83d" : "#b45309");

  root.style.colorScheme = isDark ? "dark" : "light";
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light-mode", !isDark);
}
