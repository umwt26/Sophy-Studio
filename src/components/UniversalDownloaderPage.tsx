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
        formatType: format,
        customDir: null,
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

  const formatDuration = (sec?: number | null) => {
    if (!sec || isNaN(sec)) return "";
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className="page pb-8">
      {/* Top Header Card */}
      <div className="section section-pad flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GlobeDownloadIcon className="h-5 w-5 text-[var(--color-accent)]" />
            <h1 className="text-base font-bold text-[var(--color-text-primary)]">
              {t("universal.title", "Universal Media Downloader")}
            </h1>
          </div>
          <p className="section-desc mt-1">
            {t(
              "universal.subtitle",
              "YouTube, Instagram, TikTok, Facebook ve tüm platformlardan MP4 video veya MP3 ses indirin."
            )}
          </p>
        </div>

        {onOpenFolder && (
          <button
            type="button"
            onClick={onOpenFolder}
            className="btn btn-secondary self-start sm:self-auto"
          >
            <FolderIcon className="text-[var(--color-accent)]" />
            <span>{t("universal.openFolder", "Medya Klasörü")}</span>
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="section section-pad">
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
              "Medya bağlantısı yapıştırın (YouTube, Instagram, TikTok, vb.)..."
            )}
            className="input input-lg flex-1 font-mono text-xs"
          />

          <button
            type="button"
            disabled={loading || downloading}
            onClick={handleFetchInfo}
            className="btn btn-primary btn-lg shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" />
                <span>{t("universal.fetching", "Bilgi Alınıyor...")}</span>
              </span>
            ) : (
              <>
                <GlobeDownloadIcon />
                <span>{t("universal.fetchBtn", "Medyayı Getir")}</span>
              </>
            )}
          </button>
        </div>

        {/* Supported platforms tags */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--color-app-border-soft)]">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] mr-1">
            {t("universal.supported", "Desteklenen Siteler:")}
          </span>
          {[
            "YouTube",
            "Instagram",
            "TikTok",
            "Facebook",
            "Twitter / X",
            "Pinterest",
            "Reddit",
            "SoundCloud",
          ].map((site) => (
            <span key={site} className="chip text-[10.5px]">
              {site}
            </span>
          ))}
        </div>
      </div>

      {/* Media Details & Download Card */}
      {mediaInfo && (
        <div className="section section-pad animate-fade-in">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            {/* Thumbnail */}
            {mediaInfo.thumbnail ? (
              <img
                src={mediaInfo.thumbnail}
                alt={mediaInfo.title}
                className="w-full md:w-60 aspect-video rounded-lg object-cover border border-[var(--color-app-border)] shadow-sm"
              />
            ) : (
              <div className="w-full md:w-60 aspect-video rounded-lg bg-[var(--color-app-surface-2)] flex items-center justify-center border border-[var(--color-app-border)] text-[var(--color-text-secondary)]">
                <GlobeDownloadIcon className="h-8 w-8 opacity-40" />
              </div>
            )}

            {/* Info details */}
            <div className="flex-1 flex flex-col justify-between gap-4 w-full">
              <div>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug">
                  {mediaInfo.title || t("universal.untitled", "İsimsiz Medya")}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  {mediaInfo.uploader && (
                    <span className="chip">{mediaInfo.uploader}</span>
                  )}
                  {mediaInfo.duration && (
                    <span className="chip font-mono">
                      {formatDuration(mediaInfo.duration)}
                    </span>
                  )}
                  {mediaInfo.extractor && (
                    <span className="chip chip-accent uppercase text-[10px]">
                      {mediaInfo.extractor}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[var(--color-app-border-soft)]">
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => handleDownload("mp4")}
                  className="btn btn-primary"
                >
                  <VideoCameraIcon />
                  <span>{t("universal.downloadMp4", "Video İndir (MP4)")}</span>
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => handleDownload("mp3")}
                  className="btn btn-secondary"
                >
                  <MusicalNoteIcon />
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
