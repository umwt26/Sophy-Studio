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
  onNavigateHome?: () => void;
  onOpenSettings?: () => void;
  updateVersion?: string;
  onOpenUpdate?: () => void;
}

export function Header({
  activeTab,
  onOpenMenu,
  onNavigateHome,
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
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 select-none z-30">
      {/* Left: Menu toggle + Logo + Active Tool indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t("header.openMenu", "Menüyü Aç")}
          className="icon-btn"
        >
          <MenuIcon />
        </button>

        <button
          type="button"
          onClick={onNavigateHome}
          title={t("nav.home", "Ana Sayfa")}
          className="flex items-center gap-2 pr-2.5 border-r border-[var(--color-app-border-soft)] hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <img
            src={logoImg}
            alt="Sophy Studio"
            className="h-6 w-6 rounded-md object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] hidden sm:inline">
            Sophy Studio
          </span>
        </button>

        {/* Current Active Tool Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-app-surface-2)] text-xs font-semibold text-[var(--color-text-primary)]">
          <ActiveIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span>{currentTool.label}</span>
        </div>

        {updateVersion && (
          <button
            type="button"
            onClick={onOpenUpdate}
            title={t("app.updateNotice", { version: updateVersion })}
            className="btn btn-sm btn-secondary text-[var(--color-accent)] gap-1.5 h-6 px-2 text-[11px]"
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
            className="icon-btn"
          >
            <SettingsIcon />
          </button>
        )}
      </div>
    </header>
  );
}
