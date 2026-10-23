import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SongData } from "../types";
import { CloseIcon, HistoryIcon, MusicIcon, SearchIcon, TrashIcon } from "./icons";

interface SunoHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SongData[];
  onSelectSong: (song: SongData) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const SunoHistoryDrawer: React.FC<SunoHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSong,
  onClearHistory,
  onRemoveItem,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredHistory = (Array.isArray(history) ? history : []).filter((item) => {
    if (!item || typeof item !== "object") return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const title = String(item.title || "").toLowerCase();
    const artist = String(item.artist || "").toLowerCase();
    const genresMatch = Array.isArray(item.genres) && item.genres.some((g) => String(g || "").toLowerCase().includes(q));
    return title.includes(q) || artist.includes(q) || genresMatch;
  });

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
                {t("app.historyTitle", "Suno Geçmişi")}
              </h2>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">
                {history.length} {t("app.historyCount", "kayıtlı şarkı")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
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

        {/* Search input if multiple items */}
        {history.length > 3 && (
          <div className="mt-3 relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("app.searchHistory", "Geçmişte ara...")}
              className="input has-icon-left !pl-9 py-1.5 text-xs w-full"
              style={{ paddingLeft: "34px" }}
            />
          </div>
        )}

        {/* History List */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-tertiary)]">
                <HistoryIcon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-medium text-[var(--color-text-secondary)]">
                {searchTerm
                  ? t("app.noSearchResults", "Eşleşen şarkı bulunamadı.")
                  : t("app.emptyHistory", "Henüz geçmiş kaydı yok.")}
              </p>
            </div>
          ) : (
            filteredHistory.map((item, index) => {
              const itemId = item.clip?.id || item.title + index;
              return (
                <div
                  key={itemId}
                  className="group relative flex items-center justify-between gap-2.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-2 transition-colors hover:border-[var(--color-accent)]/40"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSong(item);
                      onClose();
                    }}
                    className="flex flex-1 items-center gap-2.5 text-left min-w-0"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-black/40">
                      {item.coverUrl ? (
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-text-tertiary)]">
                          <MusicIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
                        {item.title}
                      </h4>
                      <p className="truncate text-[11px] text-[var(--color-text-secondary)]">
                        {item.artist}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--color-text-tertiary)] font-mono">
                        {item.duration && <span>{item.duration}</span>}
                        {item.duration && item.createdAt && <span>•</span>}
                        {item.createdAt && <span>{item.createdAt}</span>}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSong(item);
                        onClose();
                      }}
                      className="btn btn-primary text-xs px-2.5 py-1"
                    >
                      {t("app.loadSong", "Aç")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(itemId);
                      }}
                      className="btn btn-secondary text-xs px-2 py-1 text-rose-400 hover:border-rose-500/30"
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
