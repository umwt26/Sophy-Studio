import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { RefreshIcon, SettingsIcon } from "./icons";
import { ACCENT_COLORS, loadSavedTheme, saveTheme } from "../utils/theme";
import type { AppThemeConfig, FolderSettings, ThemeColor, ThemeMode } from "../types";

interface SettingsPageProps {
  onShowToast: (msg: string) => void;
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

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<"folders" | "appearance" | "language" | "about">("folders");

  // Folder states
  const [folderSettings, setFolderSettings] = useState<FolderSettings>({});

  // Theme state
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>(loadSavedTheme());

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const res = await invoke<FolderSettings>("get_folder_settings");
      setFolderSettings(res);
    } catch (err: any) {
      console.warn("Folder settings error:", err);
    }
  };

  const handleSelectFolder = async (key: keyof FolderSettings, title: string) => {
    try {
      const selected = await invoke<string | null>("select_folder", { title });
      if (selected) {
        const updated = { ...folderSettings, [key]: selected };
        setFolderSettings(updated);
        await invoke("save_folder_settings", { settings: updated });
        onShowToast(t("settings.folderSaved", "Klasör konumu kaydedildi!"));
      }
    } catch (err: any) {
      onShowToast(`Klasör seçilemedi: ${err?.toString()}`);
    }
  };

  const handleOpenFolder = async (path?: string | null) => {
    if (!path) return;
    try {
      await invoke("open_folder_path", { folderPath: path });
    } catch (err: any) {
      onShowToast(`Klasör açılamadı: ${err?.toString()}`);
    }
  };

  const handleResetFolders = async () => {
    try {
      const emptySettings: FolderSettings = {
        all: null,
        audio: null,
        coverArt: null,
        lyrics: null,
        universal: null,
      };
      await invoke("save_folder_settings", { settings: emptySettings });
      await loadFolders();
      onShowToast(t("settings.foldersReset", "Klasör konumları varsayılana sıfırlandı!"));
    } catch (err: any) {
      onShowToast(`Sıfırlama hatası: ${err?.toString()}`);
    }
  };

  const handleModeChange = (mode: ThemeMode) => {
    const updated = { ...themeConfig, mode };
    setThemeConfig(updated);
    saveTheme(updated);
  };

  const handleColorChange = (color: ThemeColor) => {
    const updated = { ...themeConfig, color };
    setThemeConfig(updated);
    saveTheme(updated);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-10">
      {/* Settings Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--color-text-primary)]">
              {t("settings.title", "Ayarlar & Tercihler")}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("settings.subtitle", "Klasör yolları, görünüm teması ve dil yapılandırması.")}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-1">
          <button
            type="button"
            onClick={() => setActiveCategory("folders")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === "folders"
                ? "bg-[var(--color-app-surface)] text-[var(--color-accent)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("settings.tabFolders", "Klasörler")}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("appearance")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === "appearance"
                ? "bg-[var(--color-app-surface)] text-[var(--color-accent)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("settings.tabAppearance", "Görünüm")}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("language")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === "language"
                ? "bg-[var(--color-app-surface)] text-[var(--color-accent)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("settings.tabLanguage", "Dil")}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("about")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === "about"
                ? "bg-[var(--color-app-surface)] text-[var(--color-accent)] shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {t("settings.tabAbout", "Hakkında")}
          </button>
        </div>
      </div>

      {/* Category 1: Folders */}
      {activeCategory === "folders" && (
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-app-border)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                {t("settings.folderPathsTitle", "İndirme & Kayıt Klasörleri")}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {t("settings.folderPathsDesc", "Her indirme türü için hedef klasörü ayrı ayrı özelleştirebilirsiniz.")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFolders}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              <span>{t("settings.resetDefaults", "Varsayılana Sıfırla")}</span>
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {/* Audio Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {t("settings.folderAudio", "Audio (MP3 / WAV)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)] truncate max-w-md">
                  {folderSettings.audio || "Documents/Sophy Studio/Audio"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.audio)}
                  className="rounded-md border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("audio", "Audio Klasörü Seç")}
                  className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-black"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* All (.zip) Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {t("settings.folderAll", "All (Toplu .zip Arşivleri)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)] truncate max-w-md">
                  {folderSettings.all || "Documents/Sophy Studio/All"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.all)}
                  className="rounded-md border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("all", "All (.zip) Klasörü Seç")}
                  className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-black"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* Cover Art Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {t("settings.folderCover", "Cover Art (Albüm Kapakları)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)] truncate max-w-md">
                  {folderSettings.coverArt || "Documents/Sophy Studio/Cover Art"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.coverArt)}
                  className="rounded-md border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("coverArt", "Cover Art Klasörü Seç")}
                  className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-black"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* Lyrics Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {t("settings.folderLyrics", "Lyrics (Şarkı Sözleri)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)] truncate max-w-md">
                  {folderSettings.lyrics || "Documents/Sophy Studio/Lyrics"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.lyrics)}
                  className="rounded-md border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("lyrics", "Lyrics Klasörü Seç")}
                  className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-black"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* Universal Media Downloader Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {t("settings.folderUniversal", "Universal Media (YouTube / Sosyal Medya)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)] truncate max-w-md">
                  {folderSettings.universal || "Documents/Sophy Studio/Universal Media"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.universal)}
                  className="rounded-md border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("universal", "Universal Media Klasörü Seç")}
                  className="rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-black"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category 2: Appearance & Themes */}
      {activeCategory === "appearance" && (
        <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm">
          {/* Theme Mode */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
              {t("settings.themeModeTitle", "Arayüz Modu")}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
              {t("settings.themeModeDesc", "Karanlık, aydınlık veya Windows sistem tercihinizi takip edin.")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleModeChange("dark")}
                className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all ${
                  themeConfig.mode === "dark"
                    ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)] shadow-md"
                    : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/50 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {t("settings.modeDark", "Karanlık")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("light")}
                className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all ${
                  themeConfig.mode === "light"
                    ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)] shadow-md"
                    : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/50 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {t("settings.modeLight", "Aydınlık")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("system")}
                className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all ${
                  themeConfig.mode === "system"
                    ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)] shadow-md"
                    : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/50 hover:border-[var(--color-accent)]/40"
                }`}
              >
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {t("settings.modeSystem", "Windows Takip Et")}
                </span>
              </button>
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="border-t border-[var(--color-app-border)] pt-5">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
              {t("settings.themeColorTitle", "Vurgu Renk Teması")}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
              {t("settings.themeColorDesc", "Buton, ikon ve aktif alanlar için beğendiğiniz rengi seçin.")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {(Object.keys(ACCENT_COLORS) as ThemeColor[]).map((col) => {
                const item = ACCENT_COLORS[col];
                const isSelected = themeConfig.color === col;
                const keyName = `settings.accent${col.charAt(0).toUpperCase() + col.slice(1)}`;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleColorChange(col)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-[var(--color-text-primary)] bg-[var(--color-app-surface-2)] shadow-md"
                        : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/40 hover:border-[var(--color-accent)]"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full shadow-md"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      {t(keyName, item.name)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category 3: Language */}
      {activeCategory === "language" && (
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
              {t("settings.languageTitle", "Uygulama Dili")}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("settings.languageDesc", "Sophy Studio arayüzü için tercih ettiğiniz dili seçin.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {LANGUAGES.map((lang) => {
              const isSelected = (i18n.language || "en").startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    onShowToast(`${lang.label}`);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)] text-[var(--color-accent)] font-bold shadow-sm"
                      : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/40 text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[var(--color-text-secondary)]">
                      {lang.flag}
                    </span>
                    <span className="text-xs font-medium">{lang.label}</span>
                  </div>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category 4: About */}
      {activeCategory === "about" && (
        <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-bold text-lg border border-[var(--color-accent)]/20">
              SS
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Sophy Studio</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Modern Audio & Multi-Platform Media Workstation • v0.2.0
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-[var(--color-app-border)] pt-4 text-xs text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              <strong className="text-[var(--color-text-primary)]">{t("settings.developer", "Geliştirici")}:</strong> Beli! (
              <a
                href="https://www.instagram.com/umw26t/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                @umw26t
              </a>
              )
            </p>
            <p>
              <strong className="text-[var(--color-text-primary)]">GitHub:</strong>{" "}
              <a
                href="https://github.com/umwt26/Sophy-Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                github.com/umwt26/Sophy-Studio
              </a>
            </p>
            <p>
              <strong className="text-[var(--color-text-primary)]">Core:</strong> Tauri 2 • Rust Core •
              React 19 • yt-dlp & FFmpeg Silent Engine
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)] pt-2">
              Sophy Studio © 2026 Beli! (@umw26t). {t("settings.rights", "Tüm hakları saklıdır.")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
