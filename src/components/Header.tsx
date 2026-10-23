import React from "react";
import {
  GlobeDownloadIcon,
  HomeIcon,
  MenuIcon,
  PianoIcon,
  SettingsIcon,
  SunoIcon,
  TagIcon,
} from "./icons";
import logoImg from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import type { AppTab } from "../types";

interface HeaderProps {
  activeTab: AppTab;
  onOpenMenu: () => void;
  onOpenSettings?: () => void;
  updateVersion?: string;
  onOpenUpdate?: () => void;
}

export function Header({
  activeTab,
  onOpenMenu,
  onOpenSettings,
  updateVersion,
  onOpenUpdate,
}: HeaderProps) {
  const { t } = useTranslation();

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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-app-border)] bg-[var(--color-app-surface)]/90 backdrop-blur-md px-4 select-none z-30 shadow-sm">
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
            className="h-7 w-7 rounded-lg object-contain shadow-sm"
          />
          <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] hidden sm:inline">
            Sophy Studio
          </span>
        </div>

        {/* Current Active Tool Pill (Clean SVG, No Emoji) */}
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-2.5 py-1 text-xs shadow-inner">
          <ActiveIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span className="font-bold text-[var(--color-accent)]">{currentTool.label}</span>
        </div>

        {updateVersion && (
          <button
            type="button"
            onClick={onOpenUpdate}
            title={t("app.updateNotice", { version: updateVersion })}
            className="flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-all"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
            <span>v{updateVersion}</span>
          </button>
        )}
      </div>

      {/* Right controls: Just clean minimal settings button */}
      <div className="flex items-center gap-2">
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            title={t("nav.settings", "Ayarlar")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all active:scale-95 shadow-sm"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}
