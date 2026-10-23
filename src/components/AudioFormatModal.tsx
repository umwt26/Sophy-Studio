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
      <div className="relative w-full max-w-md rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-2xl animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close", "Kapat")}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <p className="text-xs font-bold tracking-wider text-[var(--color-accent)] uppercase">
          {t("modal.saveAudio", "Ses Formatı Seç")}
        </p>
        <h2 className="mt-1.5 pr-10 text-xl font-bold text-[var(--color-text-primary)]">
          {t("modal.chooseFormat", "Hangi formatta kaydetmek istersiniz?")}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {t(
            "modal.formatNotice",
            "MP3 ve WAV dönüştürmeleri cihazınızda yerel olarak yapılır. Orijinal ses dönüştürmesiz kaydedilir."
          )}
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-3 text-left transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-app-surface-2)]/80 active:scale-98"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {option.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {option.description}
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-accent)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
