import { useTranslation } from "react-i18next";
import type { AudioFormat } from "../types";
import { ChevronRightIcon, CloseIcon } from "./icons";

interface AudioFormatModalProps {
  onClose: () => void;
  onSelect: (format: AudioFormat) => void;
}

export function AudioFormatModal({ onClose, onSelect }: AudioFormatModalProps) {
  const { t } = useTranslation();

  const options: { id: AudioFormat; title: string; description: string }[] = [
    {
      id: "mp3",
      title: "MP3",
      description: t(
        "modal.mp3Desc",
        "En uyumlu format. Şarkı adı, sanatçı, albüm kapağı ve söz etiketlerini içerir."
      ),
    },
    {
      id: "wav",
      title: "WAV",
      description: t(
        "modal.wavDesc",
        "Kayıpsız stüdyo formatı. MP3'ten daha hızlı ancak dosya boyutu daha büyüktür."
      ),
    },
    {
      id: "original",
      title: t("modal.originalTitle", "Orijinal Ses"),
      description: t(
        "modal.originalDesc",
        "En hızlı. Suno'daki kaynak formatı kayıpsız ve doğrudan indirir."
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-2xl animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close", "Kapat")}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <span className="eyebrow">
          {t("modal.saveAudio", "Format Seçimi")}
        </span>
        <h2 className="mt-1 text-base font-semibold text-[var(--color-text-primary)]">
          {t("modal.chooseFormat", "Ses formatını belirleyin")}
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {t(
            "modal.formatNotice",
            "MP3 ve WAV dönüştürmeleri cihazınızda yerel olarak yapılır."
          )}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-3 text-left transition-all hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-app-surface-2)]/80"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {option.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
                  {option.description}
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)] transition-colors group-hover:text-[var(--color-accent)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
