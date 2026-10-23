import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CloseIcon,
  FolderIcon,
  GlobeDownloadIcon,
  HistoryIcon,
  HomeIcon,
  PianoIcon,
  SettingsIcon,
  SunoIcon,
  TagIcon,
} from "./icons";
import logoImg from "../assets/logo.png";
import type { AppTab } from "../types";

interface StudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenFolder: () => void;
  onOpenHistory: () => void;
}

export const StudioDrawer: React.FC<StudioDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenFolder,
  onOpenHistory,
}) => {
  const { t } = useTranslation();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tools: {
    id: AppTab;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: "home",
      title: t("nav.home", "Ana Sayfa"),
      desc: t("drawer.homeDesc", "Stüdyo genel bakış & modüller"),
      icon: HomeIcon,
    },
    {
      id: "suno",
      title: t("nav.suno", "Suno Downloader"),
      desc: t("drawer.sunoDesc", "320k MP3, WAV, kapak ve sözler"),
      icon: SunoIcon,
      badge: "Suno AI",
    },
    {
      id: "universal",
      title: t("nav.universal", "Universal Downloader"),
      desc: t("drawer.universalDesc", "YouTube, Insta, TikTok MP4 & MP3"),
      icon: GlobeDownloadIcon,
      badge: "Media",
    },
    {
      id: "metadata",
      title: t("nav.metadata", "Metadata Editor"),
      desc: t("drawer.metadataDesc", "ID3 etiket & albüm kapağı"),
      icon: TagIcon,
      badge: "ID3v2",
    },
    {
      id: "detector",
      title: t("nav.detector", "Key & BPM Detect"),
      desc: t("drawer.detectorDesc", "Hassas Camelot nota & tempo tespiti"),
      icon: PianoIcon,
      badge: "Harmonic",
    },
    {
      id: "settings",
      title: t("nav.settings", "Ayarlar"),
      desc: t("drawer.settingsDesc", "Klasör yolları, temalar ve dil"),
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer content */}
      <aside className="relative flex h-full w-84 max-w-[85vw] flex-col border-r border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl z-10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-app-border)]">
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="Sophy Studio"
              className="h-8 w-8 rounded-lg object-contain shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                  Sophy Studio
                </span>
                <span className="rounded bg-[var(--color-accent)]/15 px-1.5 py-0.2 text-[9px] font-mono font-bold text-[var(--color-accent)]">
                  v0.2.0
                </span>
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Audio Production Workstation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", "Kapat")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-app-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tools Navigation Section */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
            {t("drawer.toolsSection", "Stüdyo Araçları")}
          </p>

          <div className="flex flex-col gap-1.5">
            {tools.map((item) => {
              const isActive = activeTab === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? "bg-[var(--color-app-surface-2)] border border-[var(--color-accent)]/40 shadow-sm text-[var(--color-text-primary)]"
                      : "border border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-app-surface-2)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isActive
                          ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)]/30 text-[var(--color-accent)]"
                          : "bg-[var(--color-app-surface-2)] border-[var(--color-app-border)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]"
                      }`}
                    >
                      <IconComp className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            isActive
                              ? "text-[var(--color-accent)]"
                              : "text-[var(--color-text-primary)]"
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-1.5 py-0.2 text-[9px] font-mono text-[var(--color-text-secondary)]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--color-text-secondary)] leading-tight mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Access Actions */}
          <p className="mt-5 px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
            {t("drawer.quickAccess", "Hızlı Erişim")}
          </p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                onOpenFolder();
                onClose();
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-app-surface-2)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <FolderIcon className="h-4 w-4 text-[var(--color-accent)]" />
              <span>{t("app.openFolder", "Stüdyo Klasörünü Aç")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenHistory();
                onClose();
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-app-surface-2)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <HistoryIcon className="h-4 w-4 text-[var(--color-accent)]" />
              <span>{t("app.history", "Arama Geçmişi")}</span>
            </button>
          </div>
        </div>

        {/* Footer info - NO low-end mention, ONLY Beli! */}
        <div className="pt-4 border-t border-[var(--color-app-border)] text-[10px] text-[var(--color-text-secondary)]">
          <p className="font-semibold text-[var(--color-text-primary)]">
            Sophy Studio © 2026 Beli!
          </p>
          <p className="mt-0.5">High-Performance Rust Core Engine</p>
        </div>
      </aside>
    </div>
  );
};
