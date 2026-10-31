import React from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon, ImageIcon, InstagramIcon, VideoCameraIcon } from "./icons";

export interface IgItem {
  index: number;
  video: boolean;
  url: string;
  thumb: string;
}

export interface IgPost {
  shortcode: string;
  owner: string;
  caption: string;
  items: IgItem[];
  limited: boolean;
}

export const isInstagramPost = (url: string) => /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:p|reel|reels|tv)\/[A-Za-z0-9_-]+/i.test(url);

/**
 * An Instagram post in the Universal downloader: every photo and video numbered; tap the
 * numbers to pick, then download only those (all are picked to start with).
 */
export const InstagramPostPicker: React.FC<{
  post: IgPost;
  selected: number[];
  onToggle: (index: number) => void;
  onSelectAll: (all: boolean) => void;
  onDownload: () => void;
  downloading: boolean;
}> = ({ post, selected, onToggle, onSelectAll, onDownload, downloading }) => {
  const { t } = useTranslation();
  const many = post.items.length > 1;

  return (
    <div className="section section-pad flex flex-col gap-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="icon-tile shrink-0">
          <InstagramIcon />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--color-text-primary)]">
            @{post.owner}
            <span className="ml-2 chip font-mono text-[0.625rem]">{t("universal.igCount", { count: post.items.length, defaultValue: "{{count}} item(s)" })}</span>
          </p>
          {post.caption && <p className="mt-1 line-clamp-2 text-xs text-[var(--color-text-secondary)]">{post.caption}</p>}
        </div>
      </div>

      {post.limited && (
        <p className="rounded-[10px] border border-[var(--color-app-border-soft)] bg-[var(--color-app-surface-2)] px-3 py-2 text-[0.75rem] text-[var(--color-text-secondary)]">
          {t("universal.igLimited", "Instagram is only giving the cover right now (it limits requests). Try again in a few minutes to see every photo.")}
        </p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {post.items.map((item) => {
          const on = selected.includes(item.index);
          return (
            <button
              key={item.index}
              type="button"
              onClick={() => onToggle(item.index)}
              aria-pressed={on}
              className={`group relative aspect-square overflow-hidden rounded-[12px] border-2 transition-all ${on ? "border-[var(--color-accent)]" : "border-transparent opacity-60 hover:opacity-90"}`}
            >
              <img src={item.thumb} alt="" referrerPolicy="no-referrer" loading="lazy" className="h-full w-full object-cover" />
              <span
                className={`absolute left-1.5 top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-[0.75rem] font-bold ${on ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "bg-black/60 text-white"}`}
              >
                {item.index}
              </span>
              <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
                {item.video ? <VideoCameraIcon className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
              </span>
              {on && (
                <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)]">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[var(--color-app-border-soft)] pt-3">
        {many ? (
          <div className="flex items-center gap-1.5">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onSelectAll(true)}>
              {t("universal.igAll", "Select all")}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onSelectAll(false)}>
              {t("universal.igNone", "Clear")}
            </button>
          </div>
        ) : (
          <span />
        )}
        <button type="button" className="btn btn-primary" disabled={downloading || selected.length === 0} onClick={onDownload}>
          {downloading ? <span className="spinner" /> : <GlobeDownloadSmall />}
          <span>
            {many
              ? t("universal.igDownload", { count: selected.length, defaultValue: "Download selected ({{count}})" })
              : t("universal.igDownloadOne", "Download post")}
          </span>
        </button>
      </div>
    </div>
  );
};

const GlobeDownloadSmall = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4v11" />
    <path d="m7.5 11 4.5 4.5 4.5-4.5" />
    <path d="M5 20h14" />
  </svg>
);
