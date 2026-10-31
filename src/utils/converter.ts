import { invoke } from "@tauri-apps/api/core";
import type { TFunction } from "i18next";

export type ConvertCategory = "audio" | "video" | "image" | "animated";
export type JobState = "queued" | "running" | "done" | "error" | "cancelled";

export interface ConvertJob {
  id: string;
  path: string;
  preset: string;
  progress: number;
  state: JobState;
  output?: string;
  error?: string;
  /** Compressor: file sizes in bytes */
  before?: number;
  after?: number;
}

export interface ProgressEvent {
  id: string;
  progress: number;
  state: "running" | "done" | "error" | "cancelled";
  output?: string;
  error?: string;
  before?: number;
  after?: number;
}

export const fileName = (p: string) => p.split(/[\\/]/).pop() || p;

let counter = 0;
export const newJobId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

/** Output part of a preset id: "scale75:mp4" → "mp4". */
export const outputOf = (preset: string) => preset.split(":").pop() || preset;
/** Modifier part: "scale75:mp4" → "scale75", "mp4" → null. */
export const groupOf = (preset: string) => (preset.includes(":") ? preset.split(":")[0] : null);

/** "To MP3", "To MP4 (low quality)" … in the UI language. */
export function outputLabel(t: TFunction, output: string): string {
  const low = output.endsWith("-low");
  const fmt = output.replace("-low", "").toUpperCase();
  return low
    ? t("converter.toLow", { format: fmt, defaultValue: "To {{format}} (low quality)" })
    : t("converter.to", { format: fmt, defaultValue: "To {{format}}" });
}

export function groupLabel(t: TFunction, group: string): string {
  const labels: Record<string, string> = {
    scale75: t("converter.scale", { pct: 75, defaultValue: "Scale {{pct}}%" }),
    scale25: t("converter.scale", { pct: 25, defaultValue: "Scale {{pct}}%" }),
    "720p": t("converter.resize", { size: "720p", defaultValue: "Resize to {{size}}" }),
    "1080p": t("converter.resize", { size: "1080p", defaultValue: "Resize to {{size}}" }),
    "rotate-left": t("converter.rotateLeft", "Rotate left"),
    "rotate-right": t("converter.rotateRight", "Rotate right"),
  };
  return labels[group] ?? group;
}

/** Full label: "Rotate left · To PNG". */
export const presetLabel = (t: TFunction, preset: string) => {
  if (preset === "compress") return t("compressor.compress", "Compress");
  const g = groupOf(preset);
  return g ? `${groupLabel(t, g)} · ${outputLabel(t, outputOf(preset))}` : outputLabel(t, preset);
};

// ---------------------------------------------------------------- Explorer menu

const ALL_OUTPUTS = ["mp3", "aac", "flac", "ogg", "wav", "mp4", "mp4-low", "mkv", "webm", "ogv", "avi", "gif", "gif-low", "png", "jpg", "webp", "ico"];
const ALL_GROUPS = ["scale75", "scale25", "720p", "1080p", "rotate-left", "rotate-right"];

/**
 * Keeps "Sophy Studio Converter" in Explorer's right-click menu (always on), pointing at this
 * exe and labelled in the UI language. The backend skips the work when nothing changed.
 */
export async function syncContextMenu(t: TFunction): Promise<void> {
  await invoke("converter_context_menu", {
    enable: true,
    labels: {
      title: "Sophy Studio Converter",
      outputs: Object.fromEntries(ALL_OUTPUTS.map((o) => [o, outputLabel(t, o)])),
      groups: Object.fromEntries(ALL_GROUPS.map((g) => [g, groupLabel(t, g)])),
      compress: "Sophy Studio Compressor",
    },
  });
}

// same lists as crates/sophy-core/src/file_converter.rs
const EXT: Record<ConvertCategory, string[]> = {
  audio: ["mp3", "wav", "flac", "m4a", "aac", "ogg", "oga", "opus", "wma", "aiff", "aif", "ape", "m4b"],
  video: ["mp4", "mkv", "mov", "avi", "webm", "wmv", "flv", "m4v", "mpg", "mpeg", "3gp", "3gpp", "ogv", "ts", "vob"],
  image: ["png", "jpg", "jpeg", "jfif", "webp", "bmp", "tif", "tiff", "tga", "ico"],
  animated: ["gif"],
};

export function categoryOf(path: string): ConvertCategory | null {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return (Object.keys(EXT) as ConvertCategory[]).find((c) => EXT[c].includes(ext)) ?? null;
}

/** 1.2 MB, 340 KB … */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB"];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}
