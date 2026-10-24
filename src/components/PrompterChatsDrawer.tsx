import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChatBubbleIcon, CloseIcon, SearchIcon, TrashIcon } from "./icons";

export interface ChatSummary {
  id: string;
  title: string;
  updatedAt: number;
  messages: number;
  style: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatSummary[];
  activeId: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

/** Slide-over list of Prompter chats, same look as the Suno / Universal history drawers. */
export const PrompterChatsDrawer: React.FC<Props> = ({ isOpen, onClose, chats, activeId, onSelect, onRemove, onClearAll }) => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  if (!isOpen) return null;

  const visible = chats.filter((c) => c.messages > 0);
  const q = search.trim().toLowerCase();
  const filtered = q ? visible.filter((c) => c.title.toLowerCase().includes(q) || c.style.toLowerCase().includes(q)) : visible;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      <aside className="relative flex h-full w-84 max-w-[85vw] flex-col border-r border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 shadow-2xl z-10 animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-[var(--color-app-border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
              <ChatBubbleIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[var(--color-text-primary)]">{t("prompter.chats", "Chats")}</h2>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">
                {visible.length} {t("prompter.chatsCount", "saved chats")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {visible.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                title={t("prompter.clearChats", "Delete all chats")}
                className="btn btn-secondary text-xs px-2 py-1 text-rose-400 hover:border-rose-500/30"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            )}
            <button type="button" onClick={onClose} aria-label={t("common.close", "Close")} className="icon-btn h-7 w-7">
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {visible.length > 3 && (
          <div className="mt-3 relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("prompter.searchChats", "Search chats...")}
              className="input has-icon-left !pl-9 py-1.5 text-xs w-full"
              style={{ paddingLeft: "34px" }}
            />
          </div>
        )}

        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-tertiary)]">
                <ChatBubbleIcon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-medium text-[var(--color-text-secondary)]">
                {q ? t("prompter.noSearchResults", "No matching chats.") : t("prompter.noChats", "No chats yet.")}
              </p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className={`group relative flex items-center justify-between gap-2.5 rounded-xl border p-2.5 transition-colors ${
                  c.id === activeId
                    ? "border-[var(--color-accent)]/50 bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] hover:border-[var(--color-accent)]/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(c.id);
                    onClose();
                  }}
                  className="flex-1 min-w-0 text-left"
                >
                  <h4 className="truncate text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">{c.title}</h4>
                  <p className="truncate text-[11px] text-[var(--color-text-secondary)]">{c.style || "—"}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--color-text-tertiary)] font-mono whitespace-nowrap">
                    <span>{new Date(c.updatedAt).toLocaleString(i18n.language, { dateStyle: "short", timeStyle: "short" })}</span>
                    <span>•</span>
                    <span>
                      {c.messages} {t("prompter.messages", "messages")}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c.id);
                      onClose();
                    }}
                    className="btn btn-primary text-xs px-2.5 py-1"
                  >
                    {t("prompter.open", "Open")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(c.id)}
                    title={t("prompter.deleteSession", "Delete chat")}
                    className="btn btn-secondary text-xs px-2 py-1 text-rose-400 hover:border-rose-500/30"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};
