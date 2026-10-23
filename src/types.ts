export interface SongClip {
  id: string;
  title: string;
  display_name: string;
  handle: string;
  is_public: boolean;
  image_url: string;
  image_large_url: string;
  audio_url: string;
  video_url: string;
  duration?: number;
  prompt: string;
  tags: string;
  major_model_version: string;
  fallback_stream_url?: string;
}

export interface SongData {
  title: string;
  artist: string;
  duration: string;
  createdAt: string;
  genres: string[];
  coverUrl: string;
  lyrics: string;
  clip: SongClip;
}

export type AudioFormat = "mp3" | "wav" | "original";

export interface UpdateInfo {
  has_update: boolean;
  current_version: string;
  latest_version: string;
  release_notes: string;
  url: string;
  download_url?: string | null;
}

export type AppTab = "home" | "suno" | "universal" | "metadata" | "detector" | "sample-cutter" | "settings";

export type ThemeMode = "dark" | "light" | "system";
export type ThemeColor = "blue" | "red" | "green" | "purple" | "orange" | "pink";

export interface AppThemeConfig {
  mode: ThemeMode;
  color: ThemeColor;
}

export interface FolderSettings {
  all?: string | null;
  audio?: string | null;
  coverArt?: string | null;
  lyrics?: string | null;
  universal?: string | null;
}

export interface UniversalMediaInfo {
  title: string;
  uploader?: string | null;
  duration?: number | null;
  thumbnail?: string | null;
  extractor?: string | null;
  webpageUrl: string;
}

export interface AudioMetadata {
  filePath: string;
  title?: string;
  artist?: string;
  album?: string;
  year?: string;
  genre?: string;
  trackNumber?: string;
  comment?: string;
  durationSeconds?: number;
  format?: string;
  coverBase64?: string | null;
  coverMimeType?: string | null;
}

export interface KeyBpmResult {
  bpm: number;
  key: string;
  camelot: string;
  camelotColor: string;
  relativeKey: string;
  compatibleKeys: string[];
  duration: number;
  confidence?: number;
}

export interface UniversalHistoryItem {
  id: string;
  url: string;
  title: string;
  thumbnail?: string | null;
  format: "mp4" | "mp3";
  platform: string;
  timestamp: number;
  filePath?: string | null;
}


