import React from "react";
import { useTranslation } from "react-i18next";
import { SearchBar } from "./SearchBar";
import { SongDetails } from "./SongDetails";
import { DownloadGrid } from "./DownloadGrid";
import { LyricsPanel } from "./LyricsPanel";
import { SearchIcon } from "./icons";
import type { SongData } from "../types";

interface SunoDownloaderPageProps {
  song: SongData | null;
  loading: boolean;
  downloading: boolean;
  onFetch: (url: string) => void;
  onAudioClick: () => void;
  onCoverClick: () => void;
  onLyricsClick: () => void;
  onDownloadAllClick: () => void;
}

export const SunoDownloaderPage: React.FC<SunoDownloaderPageProps> = ({
  song,
  loading,
  downloading,
  onFetch,
  onAudioClick,
  onCoverClick,
  onLyricsClick,
  onDownloadAllClick,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-8">
      {/* Search Input Bar */}
      <SearchBar onFetch={onFetch} loading={loading} />

      {!song && !loading && (
        <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[#202532] bg-[#11131a]/50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161924] text-xl border border-[#222736] text-[#38bdf8]">
            <SearchIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-white">
              {t("suno.emptyTitle", "Suno Şarkısı İndir")}
            </p>
            <p className="text-[11px] text-[#717789]">
              {t("app.inputPlaceholder", "Paste a Suno link above and hit Fetch Song to get started")}
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-app-border)] border-t-[var(--color-accent)]" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("app.fetching", "Fetching song details…")}
          </p>
        </div>
      )}

      {song && !loading && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-xl">
          <SongDetails song={song} />
          <DownloadGrid
            downloading={downloading}
            onAudioClick={onAudioClick}
            onCoverClick={onCoverClick}
            onLyricsClick={onLyricsClick}
            onDownloadAllClick={onDownloadAllClick}
          />
          <LyricsPanel lyrics={song.lyrics} />
        </div>
      )}
    </div>
  );
};
