import React from "react";
import { useTranslation } from "react-i18next";
import {
  FolderIcon,
  GlobeDownloadIcon,
  PianoIcon,
  SunoIcon,
  TagIcon,
  ChevronRightIcon,
} from "./icons";
import type { AppTab } from "../types";

interface HomePageProps {
  onNavigate: (tab: AppTab) => void;
  onOpenFolder: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenFolder }) => {
  const { t } = useTranslation();

  const tools: {
    id: AppTab;
    title: string;
    desc: string;
    Icon: React.ComponentType<{ className?: string }>;
    tags: string[];
  }[] = [
    {
      id: "suno",
      title: t("home.sunoTitle", "Suno Downloader"),
      desc: t(
        "home.sunoDesc",
        "Suno parçalarını 320k MP3, kayıpsız WAV, yüksek çözünürlüklü kapak ve senkron şarkı sözleriyle indirin."
      ),
      Icon: SunoIcon,
      tags: ["320k MP3", "WAV", "Lyrics", "Cover Art"],
    },
    {
      id: "universal",
      title: t("home.universalTitle", "Universal Media Downloader"),
      desc: t(
        "home.universalDesc",
        "YouTube, Instagram, TikTok ve diğer platformlardan tek tıkla MP4 video veya MP3 ses indirin."
      ),
      Icon: GlobeDownloadIcon,
      tags: ["YouTube", "Instagram", "TikTok", "MP4 / MP3"],
    },
    {
      id: "metadata",
      title: t("home.metadataTitle", "Metadata Editor"),
      desc: t(
        "home.metadataDesc",
        "MP3, WAV, FLAC veya M4A ses dosyalarınızın sanatçı, şarkı adı ve albüm kapak resimlerini düzenleyin."
      ),
      Icon: TagIcon,
      tags: ["ID3v2", "Albüm Kapağı", "FLAC / WAV", "Etiket Düzenleme"],
    },
    {
      id: "detector",
      title: t("home.detectorTitle", "Key & BPM Detect"),
      desc: t(
        "home.detectorDesc",
        "Essentia.js harmonik 12-Chroma HPCP ve ritim analiziyle parçanın müzikal tonunu (Camelot) ve BPM değerini ölçün."
      ),
      Icon: PianoIcon,
      tags: ["Camelot Wheel", "BPM", "Ritim Analizi", "Çevrimdışı"],
    },
  ];

  return (
    <div className="page pb-8">
      {/* Welcome Banner */}
      <div className="section section-pad flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              Sophy Studio
            </h1>
            <span className="chip text-[11px] font-mono">v0.2.0</span>
          </div>
          <p className="section-desc mt-1">
            {t(
              "home.heroSubtitle",
              "Müzik indirme, medya yakalama, ses etiketleme ve Key/BPM analizi araçları."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFolder}
          className="btn btn-secondary self-start sm:self-auto"
        >
          <FolderIcon className="text-[var(--color-accent)]" />
          <span>{t("home.openOutputFolder", "Stüdyo Klasörü")}</span>
        </button>
      </div>

      {/* Main Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = tool.Icon;
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="section section-pad flex flex-col justify-between cursor-pointer transition-all duration-150 hover:border-[var(--color-accent)] hover:bg-[var(--color-app-surface-2)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/30 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
                </div>

                <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {tool.title}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--color-app-border-soft)]">
                {tool.tags.map((tag) => (
                  <span key={tag} className="chip text-[10.5px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Tips / Workflow Bar */}
      <div className="section section-pad">
        <p className="eyebrow mb-2.5">{t("home.workflowTitle", "İpuçları & Kısayollar")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
            <span>{t("home.tipDragDrop", "Ses dosyalarını doğrudan pencereye sürükleyip bırakabilirsiniz.")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
            <span>{t("home.tipCoverArt", "Metadata editöründe albüm kapağı olarak JPG veya PNG kullanın.")}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
            <span>{t("home.tipOffline", "Tüm analiz ve dönüşümler yerel olarak, internet yüklemesi olmadan çalışır.")}</span>
          </div>
        </div>
      </div>

      {/* Clean Footer */}
      <footer className="flex items-center justify-between border-t border-[var(--color-app-border)] pt-4 text-xs text-[var(--color-text-secondary)]">
        <p>
          <strong className="text-[var(--color-text-primary)]">Sophy Studio</strong> © 2026{" "}
          <strong className="text-[var(--color-accent)]">Beli!</strong>
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/umw26t"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            @umw26t
          </a>
          <span>•</span>
          <a
            href="https://github.com/umwt26/Sophy-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
