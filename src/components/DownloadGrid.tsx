import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon, ImageIcon, LyricsIcon, MusicIcon, ZipIcon } from "./icons";

interface DownloadCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  disabled?: boolean;
  onClick: () => void;
}

function DownloadCard({ icon, title, subtitle, disabled, onClick }: DownloadCardProps) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex flex-1 flex-col items-start gap-3 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-4 text-left transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-app-surface-2)]/80 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
      </div>
      <span className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-semibold text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
        <DownloadIcon className="h-3.5 w-3.5" />
        {t("suno.download", "İndir")}
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

export function DownloadGrid({
  downloading,
  onAudioClick,
  onCoverClick,
  onLyricsClick,
  onDownloadAllClick,
}: DownloadGridProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <DownloadCard
          icon={<MusicIcon className="h-5 w-5" />}
          title={t("app.audio", "Ses")}
          subtitle={t("suno.audioSub", "MP3, WAV veya orijinal")}
          disabled={downloading}
          onClick={onAudioClick}
        />
        <DownloadCard
          icon={<ImageIcon className="h-5 w-5" />}
          title={t("app.coverArt", "Kapak Görseli")}
          subtitle={t("suno.coverSub", "Yüksek çözünürlük")}
          disabled={downloading}
          onClick={onCoverClick}
        />
        <DownloadCard
          icon={<LyricsIcon className="h-5 w-5" />}
          title={t("app.lyrics", "Şarkı Sözleri")}
          subtitle={t("suno.lyricsSub", "Metin dosyası (.lrc / .txt)")}
          disabled={downloading}
          onClick={onLyricsClick}
        />
      </div>

      <button
        type="button"
        disabled={downloading}
        onClick={onDownloadAllClick}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] text-sm font-bold text-black transition-all hover:brightness-110 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
      >
        <ZipIcon className="h-4.5 w-4.5" />
        <span>
          {downloading
            ? t("app.downloading", "İndiriliyor...")
            : t("app.downloadAll", "Tümünü İndir (.zip)")}
        </span>
      </button>
    </div>
  );
}
