import { useTranslation } from "react-i18next";
import { LyricsIcon } from "./icons";

interface LyricsPanelProps {
  lyrics: string;
}

export function LyricsPanel({ lyrics }: LyricsPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-app-border)] p-6">
      <div className="flex items-center gap-2">
        <LyricsIcon className="h-4 w-4 text-[var(--color-accent)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          {t("app.lyrics", "Şarkı Sözleri")}
        </h3>
      </div>
      <div className="h-48 overflow-y-auto rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-4">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {lyrics}
        </pre>
      </div>
    </div>
  );
}
