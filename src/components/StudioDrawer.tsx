import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon, FolderIcon, HistoryIcon } from "./icons";
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

  const tools: { id: AppTab; title: string; desc: string; icon: string; badge?: string }[] = [
    {
      id: "home",
      title: t("nav.home", "Ana Sayfa"),
      desc: "Stüdyo genel bakış & durum",
      icon: "🏠",
    },
    {
      id: "suno",
      title: t("nav.suno", "Suno Downloader"),
      desc: "320k MP3, WAV & orijinal akış",
      icon: "🎧",
      badge: "Suno AI",
    },
    {
      id: "metadata",
      title: t("nav.metadata", "Metadata Editor"),
      desc: "ID3 etiket & kapak düzenleme",
      icon: "🏷️",
      badge: "ID3v2",
    },
    {
      id: "detector",
      title: t("nav.detector", "Key & BPM Detect"),
      desc: "Tunebat Camelot & tempo tespiti",
      icon: "🎹",
      badge: "Harmonic",
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
      <aside className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-[#202532] bg-[#0f1117] p-5 shadow-2xl z-10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#202532]">
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="Sophy Studio"
              className="h-8 w-8 rounded-lg object-contain shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">Sophy Studio</span>
                <span className="rounded bg-[#38bdf8]/15 px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#38bdf8]">
                  v0.2.0
                </span>
              </div>
              <p className="text-[10px] text-[#717686]">Audio Production Suite</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#202532] text-[#8e93a4] hover:border-[#38bdf8]/40 hover:text-white transition-colors"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tools Navigation Section */}
        <div className="mt-4 flex-1 overflow-y-auto">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#5a5f70] mb-2">
            Stüdyo Araçları
          </p>

          <div className="flex flex-col gap-1.5">
            {tools.map((item) => {
              const isActive = activeTab === item.id;
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
                      ? "bg-[#181c26] border border-[#38bdf8]/30 shadow-md text-white"
                      : "border border-transparent text-[#9ea3b5] hover:bg-[#141720] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#141722] text-lg border border-[#222736]">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isActive ? "text-[#38bdf8]" : "text-white"}`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded bg-[#222634] px-1.5 py-0.2 text-[9px] font-mono text-[#82889e]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#6b7082] leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />}
                </button>
              );
            })}
          </div>

          {/* Quick Access Actions */}
          <p className="mt-6 px-2 text-[10px] font-bold uppercase tracking-wider text-[#5a5f70] mb-2">
            Hızlı Erişim
          </p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                onOpenFolder();
                onClose();
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#9ea3b5] hover:bg-[#141720] hover:text-white transition-colors"
            >
              <FolderIcon className="h-4 w-4 text-[#38bdf8]" />
              <span>{t("app.openFolder", "Stüdyo Klasörünü Aç")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenHistory();
                onClose();
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#9ea3b5] hover:bg-[#141720] hover:text-white transition-colors"
            >
              <HistoryIcon className="h-4 w-4 text-[#a78bfa]" />
              <span>{t("app.history", "Arama Geçmişi")}</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#202532] text-[10px] text-[#555a6a]">
          <p className="font-medium text-[#7a8094]">Sophy Studio © 2026 Umut / Beli</p>
          <p className="mt-0.5">Rust Core Engine • Low-End PC Ready</p>
        </div>
      </aside>
    </div>
  );
};
