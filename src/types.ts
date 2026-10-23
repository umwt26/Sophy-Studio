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

export type AppTab = "home" | "suno" | "metadata" | "detector";

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
}

