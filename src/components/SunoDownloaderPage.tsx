import React from "react";
import { useTranslation } from "react-i18next";
import { SearchBar } from "./SearchBar";
import { SongDetails } from "./SongDetails";
import { DownloadGrid } from "./DownloadGrid";
import { LyricsPanel } from "./LyricsPanel";
import { SearchIcon, SunoIcon } from "./icons";
import { PageHeader } from "./PageHeader";
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
  onOpenHistory?: () => void;
  historyCount?: number;
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
  onOpenHistory,
  historyCount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="page pb-8">
      <PageHeader
        Icon={SunoIcon}
        title={t("nav.suno", "Suno Downloader")}
        desc={t("drawer.sunoDesc", "320k MP3, WAV, cover art & lyrics")}
      />

      {/* Search Input Bar */}
      <SearchBar
        onFetch={onFetch}
        loading={loading}
        onOpenHistory={onOpenHistory}
        historyCount={historyCount}
      />

      {!song && !loading && (
        <div className="dropzone">
          <div className="dropzone-icon">
            <SearchIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {t("suno.emptyTitle", "Download a Suno Track")}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {t("suno.emptyDesc", "Paste a Suno song link into the bar above to download it.")}
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="section section-pad flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="spinner spinner-lg" />
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            {t("app.fetching", "Şarkı bilgileri alınıyor...")}
          </p>
        </div>
      )}

      {song && !loading && (
        <div className="section overflow-hidden">
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
