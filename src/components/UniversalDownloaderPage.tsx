import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import {
  GlobeDownloadIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  FolderIcon,
  HistoryIcon,
} from "./icons";
import { AdModal } from "./AdModal";
import { UniversalHistoryDrawer } from "./UniversalHistoryDrawer";
import type { UniversalHistoryItem, UniversalMediaInfo } from "../types";

const UNIVERSAL_HISTORY_KEY = "sophy_universal_history";

interface UniversalDownloaderPageProps {
  onShowToast: (msg: string) => void;
  onOpenFolder?: () => void;
}

function detectPlatform(rawUrl: string): string {
  const u = rawUrl.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "YouTube";
  if (u.includes("instagram.com")) return "Instagram";
  if (u.includes("tiktok.com")) return "TikTok";
  if (u.includes("facebook.com") || u.includes("fb.watch")) return "Facebook";
  if (u.includes("twitter.com") || u.includes("x.com")) return "Twitter";
  return "Diğer";
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

  // History & Drawer state
  const [history, setHistory] = useState<UniversalHistoryItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Ad Modal state for downloads
  const [pendingDownloadFormat, setPendingDownloadFormat] = useState<"mp4" | "mp3" | null>(null);
  const [adModalOpen, setAdModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(UNIVERSAL_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load universal history", e);
    }
  }, []);

  const saveHistory = (items: UniversalHistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(UNIVERSAL_HISTORY_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist universal history", e);
    }
  };

  const addToHistory = (item: UniversalHistoryItem) => {
    const filtered = history.filter((h) => h.id !== item.id && h.url !== item.url);
    const updated = [item, ...filtered].slice(0, 50);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
    onShowToast(t("app.clearHistory", "Geçmiş temizlendi."));
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
  };

  const handleFetchInfo = async (fetchUrl?: string) => {
    const targetUrl = (fetchUrl || url).trim();
    if (!targetUrl) {
      onShowToast(t("universal.errorEmpty", "Lütfen bir medya bağlantısı yapıştırın."));
      return;
    }

    try {
      setLoading(true);
      setMediaInfo(null);
      const info = await invoke<UniversalMediaInfo>("fetch_universal_media_info", {
        url: targetUrl,
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

  // Called when user clicks MP4 or MP3 button: opens 5s ad modal first
  const requestDownload = (format: "mp4" | "mp3") => {
    if (!mediaInfo) return;
    setPendingDownloadFormat(format);
    setAdModalOpen(true);
  };

  const executeDownload = async (format: "mp4" | "mp3") => {
    if (!mediaInfo) return;
    const downloadTargetUrl = mediaInfo.webpageUrl || url.trim();
    try {
      setDownloading(true);
      onShowToast(
        format === "mp4"
          ? t("universal.downloadingVideo", "Video indiriliyor...")
          : t("universal.downloadingAudio", "Ses dönüştürülüp indiriliyor...")
      );

      const savedPath = await invoke<string>("download_universal_media", {
        url: downloadTargetUrl,
        formatType: format,
        customDir: null,
      });

      // Add to history
      const platform = detectPlatform(downloadTargetUrl);
      addToHistory({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        url: downloadTargetUrl,
        title: mediaInfo.title || "Untitled Media",
        thumbnail: mediaInfo.thumbnail,
        format,
        platform,
        timestamp: Date.now(),
        filePath: savedPath,
      });

      onShowToast(
        `${t("universal.downloadComplete", "Başarıyla indirildi")}: ${savedPath.split(/[\\/]/).pop()}`
      );
    } catch (err: any) {
      onShowToast(
        `${t("universal.downloadError", "İndirme hatası")}: ${err?.toString() || ""}`
      );
    } finally {
      setDownloading(false);
      setPendingDownloadFormat(null);
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

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="btn btn-secondary text-xs gap-1.5"
            title={t("app.history", "Geçmiş")}
          >
            <HistoryIcon className="h-4 w-4 text-[var(--color-accent)]" />
            <span>{t("app.history", "Geçmiş")}</span>
            {history.length > 0 && (
              <span className="chip text-[10px] px-1.5 py-0 font-mono">{history.length}</span>
            )}
          </button>

          {onOpenFolder && (
            <button
              type="button"
              onClick={onOpenFolder}
              className="btn btn-secondary text-xs gap-1.5"
            >
              <FolderIcon className="text-[var(--color-accent)]" />
              <span>{t("universal.openFolder", "Medya Klasörü")}</span>
            </button>
          )}
        </div>
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
            onClick={() => handleFetchInfo()}
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
                  onClick={() => requestDownload("mp4")}
                  className="btn btn-primary"
                >
                  <VideoCameraIcon />
                  <span>{t("universal.downloadMp4", "Video İndir (MP4)")}</span>
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => requestDownload("mp3")}
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

      {/* Universal History Drawer (1/4 screen slide-over from left) */}
      <UniversalHistoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        history={history}
        onSelectUrl={(selectedUrl) => {
          setUrl(selectedUrl);
          handleFetchInfo(selectedUrl);
        }}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
      />

      {/* Action Ad Modal with 5s countdown lock before download */}
      {adModalOpen && pendingDownloadFormat && (
        <AdModal
          actionTitle={
            pendingDownloadFormat === "mp4"
              ? t("universal.downloadMp4", "Videoyu İndir (MP4)")
              : t("universal.downloadMp3", "Sesi İndir (MP3 320k)")
          }
          actionDesc={mediaInfo?.title || "Medya indirme işlemi hazır"}
          lockSeconds={5}
          onClose={() => {
            setAdModalOpen(false);
            setPendingDownloadFormat(null);
          }}
          onConfirm={() => {
            if (pendingDownloadFormat) {
              executeDownload(pendingDownloadFormat);
            }
          }}
        />
      )}
    </div>
  );
};
