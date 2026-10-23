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
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2.5">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t(
            "app.inputPlaceholder",
            "Suno şarkı linki yapıştırın (https://suno.com/s/... veya UUID)..."
          )}
          className="input input-lg pl-10"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="spinner" />
            <span>{t("app.fetching", "Alınıyor…")}</span>
          </span>
        ) : (
          <span>{t("app.analyzeBtn", "Şarkıyı Getir")}</span>
        )}
      </button>
    </form>
  );
}
