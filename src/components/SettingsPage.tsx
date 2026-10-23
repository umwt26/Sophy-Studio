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
  { code: "en", label: "English", tag: "EN" },
  { code: "tr", label: "Türkçe", tag: "TR" },
  { code: "de", label: "Deutsch", tag: "DE" },
  { code: "fr", label: "Français", tag: "FR" },
  { code: "es", label: "Español", tag: "ES" },
  { code: "ru", label: "Русский", tag: "RU" },
  { code: "pt", label: "Português", tag: "PT" },
  { code: "ja", label: "日本語", tag: "JA" },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<"folders" | "appearance" | "language" | "about">("folders");

  const [folderSettings, setFolderSettings] = useState<FolderSettings>({});
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
    <div className="page">
      {/* Settings Header Bar */}
      <div className="section section-pad flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {t("settings.title", "Ayarlar")}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("settings.subtitle", "Klasör yolları, arayüz teması ve dil tercihleri.")}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="segmented">
          <button
            type="button"
            onClick={() => setActiveCategory("folders")}
            className={`segmented-item ${activeCategory === "folders" ? "active" : ""}`}
          >
            {t("settings.tabFolders", "Klasörler")}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("appearance")}
            className={`segmented-item ${activeCategory === "appearance" ? "active" : ""}`}
          >
            {t("settings.tabAppearance", "Görünüm")}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("language")}
            className={`segmented-item ${activeCategory === "language" ? "active" : ""}`}
          >
            {t("settings.tabLanguage", "Dil")}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("about")}
            className={`segmented-item ${activeCategory === "about" ? "active" : ""}`}
          >
            {t("settings.tabAbout", "Hakkında")}
          </button>
        </div>
      </div>

      {/* Category 1: Folders */}
      {activeCategory === "folders" && (
        <div className="section section-pad flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-app-border)]">
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {t("settings.folderPathsTitle", "İndirme & Kayıt Klasörleri")}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {t("settings.folderPathsDesc", "Her indirme türü için hedef klasörü ayrı ayrı özelleştirebilirsiniz.")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFolders}
              className="btn btn-secondary text-xs"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              <span>{t("settings.resetDefaults", "Varsayılana Sıfırla")}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Audio Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t("settings.folderAudio", "Audio (MP3 / WAV)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">
                  {folderSettings.audio || "Documents/Sophy Studio/Audio"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.audio)}
                  className="btn btn-secondary text-xs px-2.5 py-1"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("audio", "Audio Klasörü Seç")}
                  className="btn btn-primary text-xs px-3 py-1"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* All (.zip) Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t("settings.folderAll", "All (Toplu .zip Arşivleri)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">
                  {folderSettings.all || "Documents/Sophy Studio/All"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.all)}
                  className="btn btn-secondary text-xs px-2.5 py-1"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("all", "All (.zip) Klasörü Seç")}
                  className="btn btn-primary text-xs px-3 py-1"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* Cover Art Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t("settings.folderCover", "Cover Art (Albüm Kapakları)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">
                  {folderSettings.coverArt || "Documents/Sophy Studio/Cover Art"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.coverArt)}
                  className="btn btn-secondary text-xs px-2.5 py-1"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("coverArt", "Cover Art Klasörü Seç")}
                  className="btn btn-primary text-xs px-3 py-1"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* Lyrics Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t("settings.folderLyrics", "Lyrics (Şarkı Sözleri)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">
                  {folderSettings.lyrics || "Documents/Sophy Studio/Lyrics"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.lyrics)}
                  className="btn btn-secondary text-xs px-2.5 py-1"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("lyrics", "Lyrics Klasörü Seç")}
                  className="btn btn-primary text-xs px-3 py-1"
                >
                  {t("settings.changeFolder", "Değiştir")}
                </button>
              </div>
            </div>

            {/* Universal Media Downloader Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t("settings.folderUniversal", "Universal Media (Medya İndirici)")}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-tertiary)] truncate max-w-md">
                  {folderSettings.universal || "Documents/Sophy Studio/Universal Media"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenFolder(folderSettings.universal)}
                  className="btn btn-secondary text-xs px-2.5 py-1"
                >
                  {t("settings.openFolder", "Aç")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectFolder("universal", "Universal Media Klasörü Seç")}
                  className="btn btn-primary text-xs px-3 py-1"
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
        <div className="section section-pad flex flex-col gap-5">
          {/* Theme Mode */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
              {t("settings.themeModeTitle", "Arayüz Modu")}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
              {t("settings.themeModeDesc", "Karanlık, aydınlık veya Windows sistem tercihinizi takip edin.")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["dark", "light", "system"] as ThemeMode[]).map((mode) => {
                const isSelected = themeConfig.mode === mode;
                const label =
                  mode === "dark"
                    ? t("settings.modeDark", "Karanlık")
                    : mode === "light"
                    ? t("settings.modeLight", "Aydınlık")
                    : t("settings.modeSystem", "Windows Sistem");
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleModeChange(mode)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)] text-[var(--color-accent)]"
                        : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/40 text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30"
                    }`}
                  >
                    <span className="text-xs font-semibold">{label}</span>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Palette */}
          <div className="border-t border-[var(--color-app-border)] pt-5">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
              {t("settings.themeColorTitle", "Vurgu Rengi")}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
              {t("settings.themeColorDesc", "Buton, ikon ve aktif alanlar için renk paleti.")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {(Object.keys(ACCENT_COLORS) as ThemeColor[]).map((col) => {
                const item = ACCENT_COLORS[col];
                const isSelected = themeConfig.color === col;
                const keyName = `settings.accent${col.charAt(0).toUpperCase() + col.slice(1)}`;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleColorChange(col)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 transition-all ${
                      isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)]"
                        : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/30 hover:border-[var(--color-accent)]/30"
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">
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
        <div className="section section-pad flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
              {t("settings.languageTitle", "Uygulama Dili")}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("settings.languageDesc", "Arayüz için tercih ettiğiniz dili seçin.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
            {LANGUAGES.map((lang) => {
              const isSelected = (i18n.language || "en").startsWith(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    onShowToast(lang.label);
                  }}
                  className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-app-surface-2)] text-[var(--color-accent)] font-semibold"
                      : "border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/30 text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="chip font-mono text-[10px] font-semibold">{lang.tag}</span>
                    <span className="text-xs">{lang.label}</span>
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
        <div className="section section-pad flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold text-sm border border-[var(--color-accent)]/20">
              SS
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Sophy Studio</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                v0.2.0 • Audio & Media Toolkit
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-[var(--color-app-border)] pt-4 text-xs text-[var(--color-text-secondary)] leading-relaxed">
            <p>
              <strong className="text-[var(--color-text-primary)] font-medium">
                {t("settings.developer", "Geliştirici")}:
              </strong>{" "}
              Beli! (
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
              <strong className="text-[var(--color-text-primary)] font-medium">GitHub:</strong>{" "}
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
              <strong className="text-[var(--color-text-primary)] font-medium">Core:</strong> Tauri 2 • Rust
              Core • React 19 • yt-dlp & FFmpeg
            </p>
            <p className="text-[11px] text-[var(--color-text-tertiary)] pt-2">
              Sophy Studio © 2026 Beli! (@umw26t). {t("settings.rights", "Tüm hakları saklıdır.")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
