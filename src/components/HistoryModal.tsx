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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--color-app-border)] pb-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-[var(--color-accent)]">
              {t("app.history", "HISTORY").toUpperCase()}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--color-text-primary)]">
              {t("app.historyTitle", "Search History")}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title={t("app.clearHistory", "Clear History")}
                className="flex items-center gap-1.5 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                <span>{t("app.clearHistory", "Clear All")}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)]"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-muted)]">
                <HistoryIcon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--color-text-secondary)]">
                {t("app.emptyHistory", "No search history yet.")}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {t("app.inputPlaceholder", "Analyzed songs will appear here")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {history.map((item, index) => {
                const itemId = item.clip?.id || item.title + index;
                return (
                  <div
                    key={itemId}
                    className="group relative flex items-center justify-between gap-3 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3 transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[#252830]"
                  >
                    {/* Clickable song info */}
                    <button
                      type="button"
                      onClick={() => onSelectSong(item)}
                      className="flex flex-1 items-center gap-3.5 text-left min-w-0"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-black/40">
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
                          <div className="flex h-full w-full items-center justify-center text-[var(--color-text-muted)]">
                            <MusicIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
                          {item.title}
                        </h4>
                        <p className="truncate text-xs text-[var(--color-text-secondary)]">
                          {item.artist}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                          {item.duration && <span>{item.duration}</span>}
                          {item.duration && item.createdAt && <span>•</span>}
                          {item.createdAt && <span>{item.createdAt}</span>}
                        </div>
                      </div>
                    </button>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectSong(item)}
                        className="rounded bg-[var(--color-accent)]/15 px-2.5 py-1 text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
                      >
                        {t("app.loadSong", "Load")}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(itemId);
                        }}
                        aria-label="Remove item"
                        className="flex h-7 w-7 items-center justify-center rounded text-[var(--color-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
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
