import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, FolderIcon, MenuIcon, TranslateIcon } from "./icons";
import logoImg from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import type { AppTab } from "../types";

interface HeaderProps {
  activeTab: AppTab;
  onOpenMenu: () => void;
  onOpenFolder?: () => void;
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

  const activeToolLabel = {
    home: { label: t("nav.home", "Ana Sayfa"), icon: "🏠" },
    suno: { label: t("nav.suno", "Suno Downloader"), icon: "🎧" },
    metadata: { label: t("nav.metadata", "Metadata Editor"), icon: "🏷️" },
    detector: { label: t("nav.detector", "Key & BPM Detect"), icon: "🎹" },
  }[activeTab];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#202532] bg-[#0d0f14] px-4 select-none z-30">
      {/* Left: Burger Button + Logo + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Menüyü Aç"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#202532] bg-[#141720] text-[#9ea3b5] hover:border-[#38bdf8]/40 hover:bg-[#1a1e2b] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src={logoImg}
            alt="Sophy Studio Logo"
            className="h-7 w-7 rounded-lg object-contain"
          />
          <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">
            Sophy Studio
          </span>
        </div>

        {/* Current Active Tool Pill */}
        <div className="flex items-center gap-1.5 rounded-md border border-[#202532] bg-[#141720] px-2.5 py-1 text-xs">
          <span>{activeToolLabel.icon}</span>
          <span className="font-semibold text-[#38bdf8]">{activeToolLabel.label}</span>
        </div>

        {updateVersion && (
          <button
            type="button"
            onClick={onOpenUpdate}
            title={t("app.updateNotice", { version: updateVersion })}
            className="flex items-center gap-1.5 rounded-full border border-sky-500/50 bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-400 hover:bg-sky-500 hover:text-white transition-all"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>v{updateVersion}</span>
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Open Folder Button */}
        <button
          type="button"
          onClick={onOpenFolder}
          className="flex items-center gap-1.5 rounded-lg border border-[#202532] bg-[#141720] px-3 py-1.5 text-xs font-medium text-[#9ea3b5] hover:border-[#38bdf8]/40 hover:text-white transition-colors"
        >
          <FolderIcon className="h-3.5 w-3.5 text-[#38bdf8]" />
          <span className="hidden md:inline">{t("app.openFolder", "Klasörü Aç")}</span>
        </button>

        {/* Language Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setLangOpen((prev) => !prev)}
            aria-expanded={langOpen}
            className={`flex h-8 items-center gap-2 rounded-lg border bg-[#141720] px-2.5 text-xs font-medium transition-all ${
              langOpen
                ? "border-[#38bdf8] text-white"
                : "border-[#202532] text-[#9ea3b5] hover:border-[#38bdf8]/40 hover:text-white"
            }`}
          >
            <TranslateIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold text-[11px]">{currentLang.flag}</span>
            <ChevronDownIcon
              className={`h-3 w-3 text-[#62687a] transition-transform ${
                langOpen ? "rotate-180 text-white" : ""
              }`}
            />
          </button>

          {/* Floating Dropdown Menu */}
          {langOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-40 rounded-xl border border-[#202532] bg-[#11131a] p-1.5 shadow-2xl backdrop-blur-md animate-scale-in">
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
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[#38bdf8]/15 text-[#38bdf8] font-bold"
                          : "text-[#9ea3b5] hover:bg-[#1a1e29] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#646a7e]">
                          {lang.flag}
                        </span>
                        <span>{lang.label}</span>
                      </div>
                      {isSelected && <CheckIcon className="h-3.5 w-3.5 text-[#38bdf8]" />}
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
