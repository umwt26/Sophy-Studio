import type { AudioFormat } from "../types";
import { ChevronRightIcon, CloseIcon } from "./icons";

interface FormatOption {
  id: AudioFormat;
  title: string;
  description: string;
}

const OPTIONS: FormatOption[] = [
  {
    id: "mp3",
    title: "MP3",
    description: "Most compatible. Includes available title, creator, Style, cover art and lyrics.",
  },
  {
    id: "wav",
    title: "WAV",
    description: "Uncompressed for editing. Faster than MP3, but the file is much larger.",
  },
  {
    id: "original",
    title: "Original audio",
    description: "Fastest. Keeps the source format and its existing information unchanged.",
  },
];

interface AudioFormatModalProps {
  onClose: () => void;
  onSelect: (format: AudioFormat) => void;
}

export function AudioFormatModal({ onClose, onSelect }: AudioFormatModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <p className="text-xs font-bold tracking-wider text-[var(--color-accent)]">SAVE AUDIO</p>
        <h2 className="mt-1.5 pr-10 text-2xl font-bold text-[var(--color-text-primary)]">
          Choose an audio format
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          MP3 and WAV are created on this device. Original audio skips conversion.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className="group flex items-center justify-between gap-4 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-3.5 text-left transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[#262932] active:bg-[#20232a]"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{option.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {option.description}
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-accent)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
