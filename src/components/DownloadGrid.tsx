import type { ReactNode } from "react";
import { DownloadIcon, ImageIcon, LyricsIcon, MusicIcon, ZipIcon } from "./icons";

interface DownloadCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  disabled?: boolean;
  onClick: () => void;
}

function DownloadCard({ icon, title, subtitle, disabled, onClick }: DownloadCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex flex-1 flex-col items-start gap-3 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-4 text-left transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[#262932] active:bg-[#20232a] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
      </div>
      <span className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-medium text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
        <DownloadIcon className="h-3.5 w-3.5" />
        Download
      </span>
    </button>
  );
}

interface DownloadGridProps {
  downloading?: boolean;
  onAudioClick: () => void;
  onCoverClick: () => void;
  onLyricsClick: () => void;
  onDownloadAllClick: () => void;
}

export function DownloadGrid({ downloading, onAudioClick, onCoverClick, onLyricsClick, onDownloadAllClick }: DownloadGridProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <DownloadCard
          icon={<MusicIcon className="h-5 w-5" />}
          title="Audio"
          subtitle="MP3, WAV or original"
          disabled={downloading}
          onClick={onAudioClick}
        />
        <DownloadCard
          icon={<ImageIcon className="h-5 w-5" />}
          title="Cover Art"
          subtitle="Full resolution image"
          disabled={downloading}
          onClick={onCoverClick}
        />
        <DownloadCard
          icon={<LyricsIcon className="h-5 w-5" />}
          title="Lyrics"
          subtitle="Plain text file"
          disabled={downloading}
          onClick={onLyricsClick}
        />
      </div>

      <button
        type="button"
        disabled={downloading}
        onClick={onDownloadAllClick}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] active:bg-[#3f7fc1] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ZipIcon className="h-4.5 w-4.5" />
        {downloading ? "Preparing download..." : "Download all (.zip)"}
      </button>
    </div>
  );
}
