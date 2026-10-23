import React, { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  FolderIcon,
  GlobeDownloadIcon,
  HomeIcon,
  MenuIcon,
  PianoIcon,
  SettingsIcon,
  SunoIcon,
  TagIcon,
  TranslateIcon,
} from "./icons";
import logoImg from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import type { AppTab } from "../types";

interface HeaderProps {
  activeTab: AppTab;
  onOpenMenu: () => void;
  onOpenFolder?: () => void;
  onOpenSettings?: () => void;
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

export function Header({
  activeTab,
  onOpenMenu,
  onOpenFolder,
  onOpenSettings,
  updateVersion,
  onOpenUpdate,
}: HeaderProps) {
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

  const activeToolInfo: Record<
    AppTab,
    { label: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    home: { label: t("nav.home", "Ana Sayfa"), Icon: HomeIcon },
    suno: { label: t("nav.suno", "Suno Downloader"), Icon: SunoIcon },
    universal: { label: t("nav.universal", "Universal Downloader"), Icon: GlobeDownloadIcon },
    metadata: { label: t("nav.metadata", "Metadata Editor"), Icon: TagIcon },
    detector: { label: t("nav.detector", "Key & BPM Detect"), Icon: PianoIcon },
    settings: { label: t("nav.settings", "Ayarlar"), Icon: SettingsIcon },
  };

  const currentTool = activeToolInfo[activeTab] || activeToolInfo.home;
  const ActiveIcon = currentTool.Icon;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 select-none z-30 shadow-sm">
      {/* Left: Burger Button + Logo + Active Tool Pill */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t("header.openMenu", "Menüyü Aç")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-all active:scale-95 shadow-sm"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src={logoImg}
            alt="Sophy Studio Logo"
            className="h-7 w-7 rounded-lg object-contain"
          />
          <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] hidden sm:inline">
            Sophy Studio
          </span>
        </div>

        {/* Current Active Tool Pill (Clean SVG, No Emoji) */}
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-2.5 py-1 text-xs">
          <ActiveIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span className="font-bold text-[var(--color-accent)]">{currentTool.label}</span>
        </div>

        {updateVersion && (
          <button
            type="button"
            onClick={onOpenUpdate}
            title={t("app.updateNotice", { version: updateVersion })}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-all"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
            <span>v{updateVersion}</span>
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Open Folder Button */}
        {onOpenFolder && (
          <button
            type="button"
            onClick={onOpenFolder}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <FolderIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            <span className="hidden md:inline">{t("app.openFolder", "Klasörü Aç")}</span>
          </button>
        )}

        {/* Direct Settings Button */}
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            title={t("nav.settings", "Ayarlar")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        )}

        {/* Language Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((prev) => !prev)}
            aria-expanded={langOpen}
            className={`flex h-8 items-center gap-1.5 rounded-lg border bg-[var(--color-app-surface-2)] px-2.5 text-xs font-semibold transition-all ${
              langOpen
                ? "border-[var(--color-accent)] text-[var(--color-text-primary)]"
                : "border-[var(--color-app-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <TranslateIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
            <span className="font-bold text-[11px]">{currentLang.flag}</span>
            <ChevronDownIcon
              className={`h-3 w-3 text-[var(--color-text-secondary)] transition-transform ${
                langOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {langOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-1.5 shadow-2xl backdrop-blur-md animate-scale-in">
              <div className="flex flex-col gap-0.5">
                {LANGUAGES.map((lang) => {
                  const isSelected = (i18n.language || "en").startsWith(lang.code);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-bold"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-app-surface-2)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--color-text-secondary)] font-bold">
                          {lang.flag}
                        </span>
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && <CheckIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
