import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { UniversalHistoryItem } from "../types";
import {
  CloseIcon,
  GlobeDownloadIcon,
  HistoryIcon,
  SearchIcon,
  TrashIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
} from "./icons";

interface UniversalHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: UniversalHistoryItem[];
  onSelectUrl: (url: string) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

const PLATFORMS = ["Tümü", "YouTube", "Instagram", "TikTok", "Facebook", "Twitter", "Diğer"];

export const UniversalHistoryDrawer: React.FC<UniversalHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history = [],
  onSelectUrl,
  onClearHistory,
  onRemoveItem,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("Tümü");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const processedHistory = useMemo(() => {
    try {
      let list = Array.isArray(history) ? [...history] : [];

      // Safe filter
      list = list.filter((item) => item && typeof item === "object");

      // Filter by search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        list = list.filter((item) => {
          const title = String(item.title || "").toLowerCase();
          const url = String(item.url || "").toLowerCase();
          const platform = String(item.platform || "").toLowerCase();
          return title.includes(q) || url.includes(q) || platform.includes(q);
        });
      }

      // Filter by platform
      if (selectedPlatform !== "Tümü" && selectedPlatform !== "All") {
        list = list.filter(
          (item) => String(item.platform || "Diğer").toLowerCase() === selectedPlatform.toLowerCase()
        );
      }

      // Safe sort
      list.sort((a, b) => {
        const timeA = typeof a?.timestamp === "number" ? a.timestamp : 0;
        const timeB = typeof b?.timestamp === "number" ? b.timestamp : 0;
        if (sortBy === "newest") return timeB - timeA;
        if (sortBy === "oldest") return timeA - timeB;
        const titleA = String(a?.title || "");
        const titleB = String(b?.title || "");
        return titleA.localeCompare(titleB);
      });

      return list;
    } catch (e) {
      console.error("Error sorting universal history", e);
      return [];
    }
  }, [history, searchTerm, selectedPlatform, sortBy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel on Left (approx 1/4 screen width) */}
      <aside className="relative flex h-full w-84 max-w-[85vw] flex-col border-r border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 shadow-2xl z-10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-app-border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
              <HistoryIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[var(--color-text-primary)]">
                {t("universal.historyTitle", "Medya Geçmişi")}
              </h2>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">
                {Array.isArray(history) ? history.length : 0} {t("universal.historyCount", "indirilen içerik")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {Array.isArray(history) && history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title={t("app.clearHistory", "Temizle")}
                className="btn btn-secondary text-xs px-2 py-1 text-rose-400 hover:border-rose-500/30"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.close", "Kapat")}
              className="icon-btn h-7 w-7"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-3 flex flex-col gap-2">
          {/* Search Box */}
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("universal.searchHistory", "Başlık veya link ara...")}
              className="input has-icon-left !pl-9 py-1.5 text-xs w-full"
              style={{ paddingLeft: "34px" }}
            />
          </div>

          {/* Sort & Platform Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
              {t("universal.sortBy", "Sırala:")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className={`chip text-[10px] px-2 py-0.5 ${
                  sortBy === "newest" ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold" : ""
                }`}
              >
                {t("universal.newest", "En Yeni")}
              </button>
              <button
                type="button"
                onClick={() => setSortBy("oldest")}
                className={`chip text-[10px] px-2 py-0.5 ${
                  sortBy === "oldest" ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold" : ""
                }`}
              >
                {t("universal.oldest", "En Eski")}
              </button>
              <button
                type="button"
                onClick={() => setSortBy("title")}
                className={`chip text-[10px] px-2 py-0.5 ${
                  sortBy === "title" ? "border-[var(--color-accent)] text-[var(--color-accent)] font-bold" : ""
                }`}
              >
                {t("universal.az", "A-Z")}
              </button>
            </div>
          </div>

          {/* Platform Filter Chips */}
          <div className="flex flex-wrap gap-1 pt-1 overflow-x-auto pb-1">
            {PLATFORMS.map((plat) => (
              <button
                key={plat}
                type="button"
                onClick={() => setSelectedPlatform(plat)}
                className={`chip text-[10px] px-2 py-0.5 cursor-pointer ${
                  selectedPlatform === plat
                    ? "bg-[var(--color-accent)] text-black font-bold border-transparent"
                    : "hover:border-[var(--color-accent)]/50"
                }`}
              >
                {plat === "Tümü" ? t("universal.allPlatforms", "Tümü") : plat}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="mt-2.5 flex-1 overflow-y-auto pr-1 space-y-2">
          {processedHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-tertiary)]">
                <GlobeDownloadIcon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-medium text-[var(--color-text-secondary)]">
                {searchTerm || selectedPlatform !== "Tümü"
                  ? t("universal.noFilteredResults", "Seçilen kriterde medya bulunamadı.")
                  : t("universal.emptyHistory", "Henüz indirilen medya geçmişi yok.")}
              </p>
            </div>
          ) : (
            processedHistory.map((item) => {
              const formatLabel = String(item.format || "mp4").toUpperCase();
              const platformLabel = String(item.platform || "Medya");
              const titleText = String(item.title || t("universal.untitled", "İsimsiz Medya"));
              const urlText = String(item.url || "");
              const dateText = item.timestamp ? new Date(item.timestamp).toLocaleDateString() : "";

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col gap-2 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-2.5 transition-colors hover:border-[var(--color-accent)]/40"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={titleText}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : formatLabel === "MP4" ? (
                        <VideoCameraIcon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                      ) : (
                        <MusicalNoteIcon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
                      )}
                      <span className="absolute bottom-1 right-1 chip text-[9px] px-1 py-0 font-mono font-bold bg-black/75">
                        {formatLabel}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="chip text-[9px] px-1.5 py-0 font-medium">
                          {platformLabel}
                        </span>
                        {dateText && (
                          <span className="text-[10px] text-[var(--color-text-tertiary)] font-mono">
                            {dateText}
                          </span>
                        )}
                      </div>

                      <h4 className="truncate text-xs font-semibold text-[var(--color-text-primary)]">
                        {titleText}
                      </h4>
                      <p className="truncate text-[10px] text-[var(--color-text-tertiary)] font-mono mt-0.5">
                        {urlText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--color-app-border)] pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectUrl(urlText);
                        onClose();
                      }}
                      className="btn btn-secondary text-xs px-2 py-0.5 text-[var(--color-accent)]"
                    >
                      <span>{t("universal.loadAndDownload", "Yükle & İndir")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="icon-btn h-6 w-6 text-rose-400 hover:text-rose-300"
                      title={t("common.delete", "Sil")}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};
