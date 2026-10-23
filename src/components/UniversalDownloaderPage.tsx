import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import {
  GlobeDownloadIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  FolderIcon,
} from "./icons";
import type { UniversalMediaInfo } from "../types";

interface UniversalDownloaderPageProps {
  onShowToast: (msg: string) => void;
  onOpenFolder?: () => void;
}

export const UniversalDownloaderPage: React.FC<UniversalDownloaderPageProps> = ({
  onShowToast,
  onOpenFolder,
}) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<UniversalMediaInfo | null>(null);

  const handleFetchInfo = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      onShowToast(t("universal.errorEmpty", "Lütfen bir medya bağlantısı yapıştırın."));
      return;
    }

    try {
      setLoading(true);
      setMediaInfo(null);
      const info = await invoke<UniversalMediaInfo>("fetch_universal_media_info", {
        url: trimmed,
      });
      setMediaInfo(info);
      onShowToast(t("universal.infoLoaded", "Medya bilgisi başarıyla alındı!"));
    } catch (err: any) {
      onShowToast(
        `${t("universal.fetchError", "Bilgiler alınamadı")}: ${err?.toString() || ""}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: "mp4" | "mp3") => {
    if (!mediaInfo) return;
    try {
      setDownloading(true);
      onShowToast(
        format === "mp4"
          ? t("universal.downloadingVideo", "Video indiriliyor...")
          : t("universal.downloadingAudio", "Ses dönüştürülüp indiriliyor...")
      );
      const savedPath = await invoke<string>("download_universal_media", {
        url: mediaInfo.webpageUrl || url.trim(),
        format,
      });
      onShowToast(
        `${t("universal.downloadComplete", "Başarıyla indirildi")}: ${savedPath}`
      );
    } catch (err: any) {
      onShowToast(
        `${t("universal.downloadError", "İndirme hatası")}: ${err?.toString() || ""}`
      );
    } finally {
      setDownloading(false);
    }
  };

  const formatDuration = (sec?: number) => {
    if (!sec || isNaN(sec)) return "";
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-10">
      {/* Top Banner / Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <GlobeDownloadIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--color-text-primary)]">
              {t("universal.title", "Universal Media Downloader")}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t(
                "universal.subtitle",
                "Instagram, YouTube, TikTok, Facebook, Twitter/X ve diğer tüm platformlardan MP4 video veya MP3 ses indirin."
              )}
            </p>
          </div>
        </div>

        {onOpenFolder && (
          <button
            type="button"
            onClick={onOpenFolder}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <FolderIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            <span>{t("universal.openFolder", "Medya Klasörü")}</span>
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFetchInfo();
            }}
            placeholder={t(
              "universal.placeholder",
              "Medya linki yapıştırın (YouTube, Instagram, TikTok, Facebook, Twitter, vb.)..."
            )}
            className="flex-1 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-2.5 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 focus:border-[var(--color-accent)] focus:outline-none transition-colors font-mono"
          />

          <button
            type="button"
            disabled={loading || downloading}
            onClick={handleFetchInfo}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span>{t("universal.fetching", "Bilgi Alınıyor...")}</span>
            ) : (
              <>
                <GlobeDownloadIcon className="h-4 w-4" />
                <span>{t("universal.fetchBtn", "Medyayı Getir")}</span>
              </>
            )}
          </button>
        </div>

        {/* Supported platforms tag strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-[var(--color-text-secondary)] pt-3 border-t border-[var(--color-app-border)]">
          <span className="font-semibold">{t("universal.supported", "Desteklenen Siteler:")}</span>
          {["YouTube", "Instagram", "TikTok", "Facebook", "Twitter / X", "Pinterest", "Reddit", "SoundCloud"].map(
            (p) => (
              <span
                key={p}
                className="rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-primary)]"
              >
                {p}
              </span>
            )
          )}
        </div>
      </div>

      {/* Media Details & Download Card */}
      {mediaInfo && (
        <div className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm animate-fade-in">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            {/* Thumbnail */}
            {mediaInfo.thumbnail ? (
              <img
                src={mediaInfo.thumbnail}
                alt={mediaInfo.title}
                className="w-full md:w-56 aspect-video rounded-lg object-cover border border-[var(--color-app-border)] shadow-md"
              />
            ) : (
              <div className="w-full md:w-56 aspect-video rounded-lg bg-[var(--color-app-surface-2)] flex items-center justify-center border border-[var(--color-app-border)] text-[var(--color-text-secondary)]">
                <GlobeDownloadIcon className="h-8 w-8 opacity-40" />
              </div>
            )}

            {/* Info details */}
            <div className="flex-1 flex flex-col justify-between h-full gap-3">
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-snug">
                  {mediaInfo.title || t("universal.untitled", "İsimsiz Medya")}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  {mediaInfo.uploader && (
                    <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 border border-[var(--color-app-border)]">
                      {mediaInfo.uploader}
                    </span>
                  )}
                  {mediaInfo.duration && (
                    <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 font-mono border border-[var(--color-app-border)]">
                      {formatDuration(mediaInfo.duration)}
                    </span>
                  )}
                  {mediaInfo.extractor && (
                    <span className="rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)] px-2 py-0.5 font-mono uppercase text-[10px] font-bold border border-[var(--color-accent)]/30">
                      {mediaInfo.extractor}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-app-border)]">
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => handleDownload("mp4")}
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <VideoCameraIcon className="h-4 w-4" />
                  <span>{t("universal.downloadMp4", "Video İndir (MP4)")}</span>
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => handleDownload("mp3")}
                  className="flex items-center gap-2 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-2.5 text-xs font-bold text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all active:scale-95 disabled:opacity-50"
                >
                  <MusicalNoteIcon className="h-4 w-4" />
                  <span>{t("universal.downloadMp3", "Ses İndir (MP3 320k)")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
