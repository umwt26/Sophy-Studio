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
      className="group flex flex-1 flex-col items-start gap-2.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-4 text-left transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-app-hover)] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-app-surface)] border border-[var(--color-app-border)] text-[var(--color-accent)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[var(--color-text-primary)]">{title}</p>
        <p className="text-[0.6875rem] text-[var(--color-text-secondary)] mt-0.5">{subtitle}</p>
      </div>
      <span className="mt-auto flex items-center gap-1 text-[0.6875rem] font-semibold text-[var(--color-accent)] pt-1">
        <DownloadIcon className="h-3 w-3" />
        <span>{t("suno.download", "İndir")}</span>
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
    <div className="flex flex-col gap-3 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <DownloadCard
          icon={<MusicIcon className="h-4.5 w-4.5" />}
          title={t("app.audio", "Ses")}
          subtitle={t("suno.audioSub", "MP3, WAV veya Orijinal")}
          disabled={downloading}
          onClick={onAudioClick}
        />
        <DownloadCard
          icon={<ImageIcon className="h-4.5 w-4.5" />}
          title={t("app.coverArt", "Kapak Görseli")}
          subtitle={t("suno.coverSub", "Yüksek Çözünürlük")}
          disabled={downloading}
          onClick={onCoverClick}
        />
        <DownloadCard
          icon={<LyricsIcon className="h-4.5 w-4.5" />}
          title={t("app.lyrics", "Şarkı Sözleri")}
          subtitle={t("suno.lyricsSub", "Metin & Senkron Söz")}
          disabled={downloading}
          onClick={onLyricsClick}
        />
      </div>

      <button
        type="button"
        disabled={downloading}
        onClick={onDownloadAllClick}
        className="btn btn-primary btn-lg w-full mt-1"
      >
        <ZipIcon />
        <span>
          {downloading
            ? t("app.downloading", "İndiriliyor...")
            : t("app.downloadAll", "Tümünü İndir (.zip)")}
        </span>
      </button>
    </div>
  );
}
