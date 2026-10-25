import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import {
  FolderIcon,
  TranslateIcon,
  PaletteIcon,
  RefreshIcon,
  SparklesIcon,
  CheckIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterXIcon,
  YouTubeIcon,
  SpotifyIcon,
  GitHubIcon,
  DiscordIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  ExternalLinkIcon,
  UserIcon,
} from "./icons";
import { THEME_PRESETS, isCustomColor, loadSavedTheme, pickedAccent, resolveIsDark, saveTheme } from "../utils/theme";
import {
  DISPLAY_SCALES,
  TEXT_SCALES,
  loadAccessibility,
  saveAccessibility,
  type AccessibilityConfig,
} from "../utils/accessibility";
import type { AppThemeConfig, FolderSettings, ThemeMode, ThemeTint } from "../types";
import { ColorWheelPicker } from "./ColorWheelPicker";
import { LanguageFlag } from "./Flags";
import logoImg from "../assets/logo.png";
import { APP_VERSION_LABEL } from "../version";

interface SettingsPageProps {
  onShowToast: (msg: string) => void;
}

type Category = "language" | "appearance" | "accessibility" | "folders" | "about";

const LANGUAGES = [
  { code: "en", native: "English", tag: "EN" },
  { code: "tr", native: "Türkçe", tag: "TR" },
  { code: "de", native: "Deutsch", tag: "DE" },
  { code: "fr", native: "Français", tag: "FR" },
  { code: "es", native: "Español", tag: "ES" },
  { code: "pt", native: "Português", tag: "PT" },
  { code: "ru", native: "Русский", tag: "RU" },
  { code: "ja", native: "日本語", tag: "JA" },
];

const SOCIAL_LINKS = [
  { label: "@umw26t", network: "Instagram", href: "https://www.instagram.com/umw26t/", Icon: InstagramIcon },
  { label: "@_beli26", network: "Instagram", href: "https://www.instagram.com/_beli26/", Icon: InstagramIcon },
  { label: "@belionthebeat", network: "TikTok", href: "https://www.tiktok.com/@belionthebeat", Icon: TikTokIcon },
  { label: "@_beli26", network: "X", href: "https://x.com/_beli26", Icon: TwitterXIcon },
  { label: "@beli26", network: "YouTube", href: "https://www.youtube.com/@beli26", Icon: YouTubeIcon },
  { label: "Beli!", network: "Spotify", href: "https://open.spotify.com/intl-tr/artist/0abGcEf1RCkROklu9iYoR7", Icon: SpotifyIcon },
  { label: "@umwt26", network: "GitHub", href: "https://github.com/umwt26", Icon: GitHubIcon },
  { label: "Filera", network: "Discord", href: "https://discord.gg/R9c7g78g", Icon: DiscordIcon },
];

// Fixed palettes for the mode previews, so each card shows its own mode
const PREVIEW = {
  light: { bg: "#f4f5f7", side: "#e8eaee", card: "#ffffff", line: "#d5d9e0", text: "#9aa0ab" },
  dark: { bg: "#0f1013", side: "#16171b", card: "#1d1f24", line: "#30323a", text: "#5c606b" },
};

function ModePreview({ mode, accent }: { mode: "light" | "dark"; accent: string }) {
  const p = PREVIEW[mode];
  return (
    <div className="flex h-full w-full" style={{ backgroundColor: p.bg }}>
      <div className="flex w-[28%] flex-col gap-1.5 p-2" style={{ backgroundColor: p.side }}>
        <span className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: accent }} />
        <span className="h-1.5 w-full rounded-full" style={{ backgroundColor: p.line }} />
        <span className="h-1.5 w-2/3 rounded-full" style={{ backgroundColor: p.line }} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <span className="h-2 w-1/2 rounded-full" style={{ backgroundColor: p.text }} />
        <div className="flex flex-1 flex-col gap-1 rounded-md p-1.5" style={{ backgroundColor: p.card }}>
          <span className="h-1.5 w-4/5 rounded-full" style={{ backgroundColor: p.line }} />
          <span className="h-1.5 w-3/5 rounded-full" style={{ backgroundColor: p.line }} />
          <span className="mt-auto h-2.5 w-8 rounded" style={{ backgroundColor: accent }} />
        </div>
      </div>
    </div>
  );
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onShowToast }) => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>("language");
  const [folderSettings, setFolderSettings] = useState<FolderSettings>({});
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>(loadSavedTheme);
  const [a11y, setA11y] = useState<AccessibilityConfig>(loadAccessibility);

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
        onShowToast(t("settings.folderSaved", "Folder location saved!"));
      }
    } catch (err: any) {
      onShowToast(`${t("settings.folderError", "Could not select folder")}: ${err?.toString()}`);
    }
  };

  const handleOpenFolder = async (path?: string | null) => {
    if (!path) return;
    try {
      await invoke("open_folder_path", { folderPath: path });
    } catch (err: any) {
      onShowToast(`${t("settings.folderOpenError", "Could not open folder")}: ${err?.toString()}`);
    }
  };

  const handleResetFolders = async () => {
    try {
      const emptySettings: FolderSettings = { all: null, audio: null, coverArt: null, lyrics: null, universal: null };
      await invoke("save_folder_settings", { settings: emptySettings });
      await loadFolders();
      onShowToast(t("settings.foldersReset", "Folder locations reset to defaults!"));
    } catch (err: any) {
      onShowToast(`${t("settings.folderError", "Could not select folder")}: ${err?.toString()}`);
    }
  };

  const updateTheme = (patch: Partial<AppThemeConfig>) => {
    const updated = { ...themeConfig, ...patch };
    setThemeConfig(updated);
    saveTheme(updated);
  };

  const updateA11y = (patch: Partial<AccessibilityConfig>) => {
    const updated = { ...a11y, ...patch };
    setA11y(updated);
    saveAccessibility(updated);
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem("sophy_lang", code);
    } catch {
      // ignore
    }
  };

  const isDark = resolveIsDark(themeConfig.mode);
  const customActive = isCustomColor(themeConfig);
  const wheelColor = customActive ? themeConfig.color : pickedAccent(themeConfig, true);
  const currentLang = (i18n.language || "en").slice(0, 2);

  const categories: { id: Category; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "language", label: t("settings.tabLanguage", "Language"), Icon: TranslateIcon },
    { id: "appearance", label: t("settings.tabAppearance", "Appearance"), Icon: PaletteIcon },
    { id: "accessibility", label: t("settings.tabAccessibility", "Accessibility"), Icon: UserIcon },
    { id: "folders", label: t("settings.tabFolders", "Folders"), Icon: FolderIcon },
    { id: "about", label: t("settings.tabAbout", "About"), Icon: SparklesIcon },
  ];

  const modes: { id: ThemeMode; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "light", label: t("settings.modeLight", "Light"), Icon: SunIcon },
    { id: "dark", label: t("settings.modeDark", "Dark"), Icon: MoonIcon },
    { id: "system", label: t("settings.modeSystemShort", "System"), Icon: MonitorIcon },
  ];

  const tints: { id: ThemeTint; label: string }[] = [
    { id: "none", label: t("settings.tintNone", "Neutral") },
    { id: "subtle", label: t("settings.tintSubtle", "Subtle") },
    { id: "rich", label: t("settings.tintRich", "Rich") },
  ];

  const textScaleLabels: Record<number, string> = {
    0.9: t("settings.sizeSmall", "Small"),
    1: t("settings.sizeDefault", "Default"),
    1.125: t("settings.sizeLarge", "Large"),
    1.25: t("settings.sizeXLarge", "Extra large"),
  };

  const folders: { key: keyof FolderSettings; label: string; fallback: string; dialog: string }[] = [
    {
      key: "audio",
      label: t("settings.folderAudio", "Audio (MP3 / WAV)"),
      fallback: "Documents/Sophy Studio/Audio",
      dialog: t("settings.dialogSelectAudioFolder", "Select Audio Folder"),
    },
    {
      key: "all",
      label: t("settings.folderAll", "All (Batch .zip Archives)"),
      fallback: "Documents/Sophy Studio/All",
      dialog: t("settings.dialogSelectAllFolder", "Select Batch Download Folder"),
    },
    {
      key: "coverArt",
      label: t("settings.folderCover", "Cover Art (Album Artwork)"),
      fallback: "Documents/Sophy Studio/Cover Art",
      dialog: t("settings.dialogSelectCoverFolder", "Select Cover Art Folder"),
    },
    {
      key: "lyrics",
      label: t("settings.folderLyrics", "Lyrics (Song Lyrics)"),
      fallback: "Documents/Sophy Studio/Lyrics",
      dialog: t("settings.dialogSelectLyricsFolder", "Select Lyrics Folder"),
    },
    {
      key: "universal",
      label: t("settings.folderUniversal", "Universal Media (Media Downloader)"),
      fallback: "Documents/Sophy Studio/Universal Media",
      dialog: t("settings.dialogSelectUniversalFolder", "Select Universal Media Folder"),
    },
  ];

  const header = (title: string, desc: string, action?: React.ReactNode) => (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[1.0625rem] font-semibold text-[var(--color-text-primary)]">{title}</h2>
        <p className="text-[0.8125rem] text-[var(--color-text-secondary)] mt-0.5">{desc}</p>
      </div>
      {action}
    </div>
  );

  const rowText = (label: string, hint: string) => (
    <div className="min-w-0">
      <p className="setting-label">{label}</p>
      <p className="setting-hint">{hint}</p>
    </div>
  );

  return (
    <div className="page pb-10">
      <div>
        <h1 className="page-title">{t("nav.settings", "Settings")}</h1>
        <p className="page-desc">{t("settings.subtitle", "Folder paths, visual themes, and language configuration.")}</p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <nav className="w-full md:w-52 shrink-0 flex md:flex-col gap-0.5 overflow-x-auto">
          {categories.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className="nav-item before:!hidden"
              data-active={activeCategory === id}
              onClick={() => setActiveCategory(id)}
            >
              <Icon />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        {/* Re-mounted per category so its content animates in */}
        <section key={activeCategory} className="stagger flex-1 flex flex-col gap-4 min-w-0 w-full">
          {activeCategory === "language" && (
            <>
              {header(t("settings.languageTitle", "App Language"), t("settings.languageDesc", "Choose your preferred interface language."))}

              <div className="stagger grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LANGUAGES.map((lang) => {
                  const active = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => changeLanguage(lang.code)}
                      data-active={active}
                      className="lang-card"
                    >
                      <LanguageFlag code={lang.code} />
                      <span className="flex min-w-0 flex-1 flex-col text-left">
                        <span className="truncate text-[0.9375rem] text-[var(--color-text-primary)]">{lang.native}</span>
                        {t(`settings.languageNames.${lang.code}`, lang.native) !== lang.native && (
                          <span className="truncate text-[0.75rem] text-[var(--color-text-muted)]">
                            {t(`settings.languageNames.${lang.code}`, lang.native)}
                          </span>
                        )}
                      </span>
                      <span className="radio-dot" data-active={active}>
                        {active && <CheckIcon className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="setting-hint">{t("settings.languageNote", "The language is remembered and used the next time you open Sophy Studio.")}</p>
            </>
          )}

          {activeCategory === "appearance" && (
            <>
              {header(t("settings.appearance", "Appearance"), t("settings.appearanceDesc", "Pick how Sophy Studio looks. Changes apply right away."))}

              <div className="section setting-list">
                <div className="setting-row setting-row-stack">
                  {rowText(t("settings.modeTitle", "Mode"), t("settings.modeHint", "Light, dark, or follow the Windows setting."))}
                  <div className="grid grid-cols-3 gap-3">
                    {modes.map(({ id, label, Icon }) => {
                      const active = themeConfig.mode === id;
                      const accent = id === "light" ? pickedAccent(themeConfig, false) : pickedAccent(themeConfig, true);
                      return (
                        <button key={id} type="button" className="mode-card" data-active={active} onClick={() => updateTheme({ mode: id })}>
                          <span className="mode-preview">
                            {id === "system" ? (
                              <span className="flex h-full w-full">
                                <span className="h-full w-1/2 overflow-hidden">
                                  <span className="block h-full w-[200%]">
                                    <ModePreview mode="light" accent={pickedAccent(themeConfig, false)} />
                                  </span>
                                </span>
                                <span className="h-full w-1/2 overflow-hidden">
                                  <span className="block h-full w-[200%] -translate-x-1/2">
                                    <ModePreview mode="dark" accent={pickedAccent(themeConfig, true)} />
                                  </span>
                                </span>
                              </span>
                            ) : (
                              <ModePreview mode={id} accent={accent} />
                            )}
                          </span>
                          <span className="flex items-center justify-between gap-2 px-1">
                            <span className="flex items-center gap-2 text-[0.8125rem] text-[var(--color-text-primary)]">
                              <Icon className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                              {label}
                            </span>
                            <span className="radio-dot" data-active={active}>
                              {active && <CheckIcon className="h-3 w-3" />}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="setting-row flex-wrap">
                  {rowText(
                    t("settings.tintTitle", "Background tone"),
                    t("settings.tintHint", "How much of the theme colour shows in backgrounds, the sidebar and borders.")
                  )}
                  <div className="segmented">
                    {tints.map(({ id, label }) => (
                      <button key={id} type="button" data-active={themeConfig.tint === id} onClick={() => updateTheme({ tint: id })}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="section setting-list">
                <div className="setting-row setting-row-stack">
                  {rowText(
                    t("settings.colorThemeTitle", "Colour theme"),
                    t("settings.colorThemeHint", "Sets the colour of buttons, the active page, highlights and selections.")
                  )}
                  <ColorWheelPicker color={wheelColor} onChange={(hex) => updateTheme({ color: hex })} />
                  <p className="setting-hint -mt-1">
                    {t("settings.customHint", "Very dark or very light colours are adjusted slightly so text stays readable.")}
                  </p>
                </div>

                <div className="setting-row setting-row-stack">
                  <p className="eyebrow">{t("settings.presetColors", "Preset colours")}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                    {THEME_PRESETS.map((preset) => {
                      const active = !customActive && themeConfig.color === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          className="preset-chip"
                          data-active={active}
                          onClick={() => updateTheme({ color: preset.id })}
                          title={t(preset.nameKey, preset.fallbackName)}
                        >
                          <span className="preset-dot" style={{ backgroundColor: isDark ? preset.dark : preset.light }}>
                            {active && <CheckIcon className="h-3.5 w-3.5" style={{ color: "#fff", mixBlendMode: "difference" }} />}
                          </span>
                          <span className="truncate text-[0.75rem]">{t(preset.nameKey, preset.fallbackName)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeCategory === "accessibility" && (
            <>
              {header(
                t("settings.tabAccessibility", "Accessibility"),
                t("settings.accessibilityDesc", "Make text and the interface easier to read and use.")
              )}

              <div className="section setting-list">
                <div className="setting-row setting-row-stack">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {rowText(t("settings.textSizeTitle", "Text size"), t("settings.textSizeHint", "Makes all text larger or smaller without changing the layout."))}
                    <div className="segmented">
                      {TEXT_SCALES.map((s) => (
                        <button key={s} type="button" data-active={a11y.textScale === s} onClick={() => updateA11y({ textScale: s })}>
                          {textScaleLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[10px] border border-[var(--color-app-border-soft)] bg-[var(--color-app-bg)] px-4 py-3">
                    <p className="text-[0.9375rem] text-[var(--color-text-primary)]">{t("settings.textPreviewTitle", "Suno Downloader")}</p>
                    <p className="text-[0.8125rem] text-[var(--color-text-secondary)]">
                      {t("settings.textPreviewBody", "This is how text will look across Sophy Studio.")}
                    </p>
                  </div>
                </div>

                <div className="setting-row flex-wrap">
                  {rowText(
                    t("settings.displaySizeTitle", "Display size"),
                    t("settings.displaySizeHint", "Zooms the whole interface: text, icons, buttons and spacing.")
                  )}
                  <div className="segmented">
                    {DISPLAY_SCALES.map((s) => (
                      <button key={s} type="button" data-active={a11y.displayScale === s} onClick={() => updateA11y({ displayScale: s })}>
                        {Math.round(s * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-row">
                  {rowText(
                    t("settings.reduceMotionTitle", "Reduce motion"),
                    t("settings.reduceMotionHint", "Turns off animations and transitions.")
                  )}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={a11y.reduceMotion}
                    className="switch"
                    data-on={a11y.reduceMotion}
                    onClick={() => updateA11y({ reduceMotion: !a11y.reduceMotion })}
                  >
                    <span />
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => updateA11y({ textScale: 1, displayScale: 1, reduceMotion: false })}>
                  <RefreshIcon />
                  <span>{t("settings.resetDefaults", "Reset to Defaults")}</span>
                </button>
              </div>
            </>
          )}

          {activeCategory === "folders" && (
            <>
              {header(
                t("settings.folderPathsTitle", "Download & Output Folders"),
                t("settings.folderPathsDesc", "Customize destination folders individually for each download type."),
                <button type="button" onClick={handleResetFolders} className="btn btn-sm btn-ghost shrink-0">
                  <RefreshIcon />
                  <span>{t("settings.resetDefaults", "Reset to Defaults")}</span>
                </button>
              )}

              <div className="section setting-list">
                {folders.map((folder) => (
                  <div key={folder.key} className="setting-row flex-wrap">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="icon-tile !h-9 !w-9 !rounded-lg">
                        <FolderIcon className="!h-[18px] !w-[18px]" />
                      </span>
                      <div className="min-w-0">
                        <p className="setting-label">{folder.label}</p>
                        <p className="font-mono text-[0.7188rem] text-[var(--color-text-muted)] truncate mt-0.5" title={folderSettings[folder.key] || folder.fallback}>
                          {folderSettings[folder.key] || folder.fallback}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenFolder(folderSettings[folder.key])}
                        disabled={!folderSettings[folder.key]}
                        className="btn btn-sm btn-ghost"
                      >
                        {t("settings.openFolder", "Open")}
                      </button>
                      <button type="button" onClick={() => handleSelectFolder(folder.key, folder.dialog)} className="btn btn-sm btn-secondary">
                        {t("settings.changeFolder", "Change")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeCategory === "about" && (
            <>
              {header(t("settings.tabAbout", "About"), t("settings.aboutTagline", "All-in-one audio and media toolkit."))}

              <div className="section setting-list">
                <div className="setting-row">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img src={logoImg} alt="" className="h-11 w-11 object-contain shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] font-semibold text-[var(--color-text-primary)]">Sophy Studio</p>
                      <p className="setting-hint">by Beli!</p>
                    </div>
                  </div>
                  <span className="chip chip-accent font-mono">{APP_VERSION_LABEL}</span>
                </div>

                <div className="setting-row setting-row-stack">
                  <p className="setting-label">{t("settings.socialMedia", "Social Media")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SOCIAL_LINKS.map(({ label, network, href, Icon }) => (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="swatch group">
                        <Icon className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]" />
                        <span className="truncate flex-1">{label}</span>
                        <span className="text-[0.7188rem] text-[var(--color-text-muted)]">{network}</span>
                        <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
