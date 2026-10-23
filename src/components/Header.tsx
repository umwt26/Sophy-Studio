import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, FolderIcon, HistoryIcon, TranslateIcon } from "./icons";
import logoImg from "../assets/logo.png";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onOpenFolder?: () => void;
  onOpenHistory?: () => void;
  updateVersion?: string;
  onOpenUpdate?: () => void;
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "EN" },
  { code: "tr", label: "Türkçe", flag: "TR" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "ru", label: "Русский", flag: "RU" },
  { code: "pt", label: "Português", flag: "PT" },
  { code: "ja", label: "日本語", flag: "JA" },
];

export function Header({ onOpenFolder, onOpenHistory, updateVersion, onOpenUpdate }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLangOpen(false);
      }
    }

    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [langOpen]);

  const currentLang =
    LANGUAGES.find((lang) => (i18n.language || "en").startsWith(lang.code)) || LANGUAGES[0];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-6">
      <div className="flex items-center gap-3">
        <img
          src={logoImg}
          alt="Sophy Studio Logo"
          className="h-8 w-8 rounded-lg object-contain drop-shadow-[0_2px_8px_rgba(84,151,224,0.3)]"
        />
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-bold tracking-tight text-[var(--color-text-primary)]">
            Sophy Studio
          </span>
          {updateVersion && (
            <button
              type="button"
              onClick={onOpenUpdate}
              title={t("app.updateNotice", { version: updateVersion })}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
              <span>v{updateVersion}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* History Button */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-2 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)] active:bg-[#282b33]"
        >
          <HistoryIcon className="h-4 w-4" />
          <span>{t("app.history", "History")}</span>
        </button>

        {/* Custom Premium Language Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((prev) => !prev)}
            aria-expanded={langOpen}
            aria-label="Select language"
            className={`flex h-9 items-center gap-2.5 rounded-md border bg-[var(--color-app-surface-2)] px-3 text-xs font-medium transition-all ${
              langOpen
                ? "border-[var(--color-accent)] text-[var(--color-text-primary)] shadow-[0_0_14px_rgba(84,151,224,0.22)]"
                : "border-[var(--color-app-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)] active:bg-[#282b33]"
            }`}
          >
            <TranslateIcon className="h-4 w-4 shrink-0" />
            <span className="font-semibold">{currentLang.label}</span>
            <ChevronDownIcon
              className={`h-3 w-3 text-[var(--color-text-muted)] transition-transform duration-200 ${
                langOpen ? "rotate-180 text-[var(--color-text-primary)]" : ""
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {langOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-lg border border-[var(--color-app-border)] bg-[#181a20] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.65)] backdrop-blur-md animate-scale-in">
              <div className="flex flex-col gap-0.5">
                {LANGUAGES.map((lang) => {
                  const isSelected = currentLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-semibold"
                          : "text-[var(--color-text-secondary)] hover:bg-[#242730] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`inline-flex h-4.5 w-6 items-center justify-center rounded text-[10px] font-bold tracking-wider transition-colors ${
                            isSelected
                              ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                              : "bg-[#232630] text-[var(--color-text-muted)] group-hover:bg-[#2b2f3b] group-hover:text-[var(--color-text-secondary)]"
                          }`}
                        >
                          {lang.flag}
                        </span>
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && (
                        <CheckIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Open Folder Button */}
        <button
          type="button"
          onClick={onOpenFolder}
          className="flex items-center gap-2 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text-primary)] active:bg-[#282b33]"
        >
          <FolderIcon className="h-4 w-4" />
          {t("app.openFolder", "Open Sophy Studio Folder")}
        </button>
      </div>
    </header>
  );
}
