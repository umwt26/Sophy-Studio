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
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "home",
      title: t("nav.home", "Ana Sayfa"),
      desc: t("drawer.homeDesc", "Genel bakış ve araçlar"),
      Icon: HomeIcon,
    },
    {
      id: "suno",
      title: t("nav.suno", "Suno Downloader"),
      desc: t("drawer.sunoDesc", "320k MP3, WAV, kapak ve sözler"),
      Icon: SunoIcon,
    },
    {
      id: "universal",
      title: t("nav.universal", "Universal Downloader"),
      desc: t("drawer.universalDesc", "YouTube, Insta, TikTok MP4 & MP3"),
      Icon: GlobeDownloadIcon,
    },
    {
      id: "metadata",
      title: t("nav.metadata", "Metadata Editor"),
      desc: t("drawer.metadataDesc", "ID3 etiket & albüm kapağı"),
      Icon: TagIcon,
    },
    {
      id: "detector",
      title: t("nav.detector", "Key & BPM Detect"),
      desc: t("drawer.detectorDesc", "Camelot nota ve tempo tespiti"),
      Icon: PianoIcon,
    },
    {
      id: "settings",
      title: t("nav.settings", "Ayarlar"),
      desc: t("drawer.settingsDesc", "Klasör yolları, temalar ve dil"),
      Icon: SettingsIcon,
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
      <aside className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl z-10 animate-slide-in-right">
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
                <span className="chip text-[10px] font-mono">v0.2.0</span>
              </div>
              <p className="text-[11px] text-[var(--color-text-secondary)]">
                {t("app.subtitle", "Ses & Medya Araçları")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", "Kapat")}
            className="icon-btn"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tools Navigation Section */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <p className="eyebrow px-2 mb-2">{t("drawer.toolsSection", "Menü")}</p>

          <div className="flex flex-col gap-1">
            {tools.map((item) => {
              const isActive = activeTab === item.id;
              const IconComp = item.Icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-active={isActive ? "true" : "false"}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className="nav-item h-auto py-2.5"
                >
                  <IconComp className={isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold leading-tight ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-secondary)] truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Quick Access Actions */}
          <p className="eyebrow px-2 mt-6 mb-2">{t("drawer.quickAccess", "Hızlı Erişim")}</p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                onOpenFolder();
                onClose();
              }}
              className="nav-item text-xs"
            >
              <FolderIcon className="text-[var(--color-accent)]" />
              <span>{t("app.openFolder", "Stüdyo Klasörünü Aç")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenHistory();
                onClose();
              }}
              className="nav-item text-xs"
            >
              <HistoryIcon className="text-[var(--color-accent)]" />
              <span>{t("app.history", "Arama Geçmişi")}</span>
            </button>
          </div>
        </div>

        {/* Footer info - clean and respectful */}
        <div className="pt-4 border-t border-[var(--color-app-border)] text-xs text-[var(--color-text-secondary)] flex items-center justify-between">
          <p className="font-medium text-[var(--color-text-primary)]">Sophy Studio</p>
          <span className="text-[11px] text-[var(--color-text-muted)]">© 2026 Beli!</span>
        </div>
      </aside>
    </div>
  );
};
