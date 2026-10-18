import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "./icons";

interface SearchBarProps {
  onFetch: (url: string) => void;
  loading: boolean;
  initialValue?: string;
}

export function SearchBar({ onFetch, loading, initialValue = "" }: SearchBarProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("app.inputPlaceholder", "Paste Suno song URL (e.g. https://suno.com/s/... or /song/...)")}
          className="h-12 w-full rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] pl-11 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="h-12 shrink-0 rounded-md bg-[var(--color-accent)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] active:bg-[#3f7fc1] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t("app.fetching", "Fetching…") : t("app.analyzeBtn", "Fetch Song")}
      </button>
    </form>
  );
}
