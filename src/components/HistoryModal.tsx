import { useTranslation } from "react-i18next";
import type { SongData } from "../types";
import { CloseIcon, HistoryIcon, MusicIcon, TrashIcon } from "./icons";

interface HistoryModalProps {
  history: SongData[];
  onClose: () => void;
  onSelectSong: (song: SongData) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export function HistoryModal({
  history,
  onClose,
  onSelectSong,
  onClearHistory,
  onRemoveItem,
}: HistoryModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-app-border)] pb-4">
          <div>
            <span className="eyebrow">
              {t("app.history", "Geçmiş")}
            </span>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              {t("app.historyTitle", "Arama Geçmişi")}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title={t("app.clearHistory", "Geçmişi Temizle")}
                className="btn btn-secondary text-xs text-rose-400 hover:border-rose-500/30"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                <span>{t("app.clearHistory", "Temizle")}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.close", "Kapat")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-tertiary)]">
                <HistoryIcon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs font-medium text-[var(--color-text-secondary)]">
                {t("app.emptyHistory", "Henüz arama geçmişi yok.")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((item, index) => {
                const itemId = item.clip?.id || item.title + index;
                return (
                  <div
                    key={itemId}
                    className="group relative flex items-center justify-between gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-2.5 transition-colors hover:border-[var(--color-accent)]/40"
                  >
                    {/* Clickable song info */}
                    <button
                      type="button"
                      onClick={() => onSelectSong(item)}
                      className="flex flex-1 items-center gap-3 text-left min-w-0"
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

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectSong(item)}
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
                        aria-label="Remove item"
                        className="btn btn-secondary text-xs px-2 py-1 text-rose-400 hover:border-rose-500/30"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
