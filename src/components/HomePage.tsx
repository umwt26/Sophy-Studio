import React from "react";
import { useTranslation } from "react-i18next";
import {
  FolderIcon,
  GlobeDownloadIcon,
  PianoIcon,
  SunoIcon,
  TagIcon,
  ChevronRightIcon,
  SparklesIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterXIcon,
  YouTubeIcon,
  SpotifyIcon,
  GitHubIcon,
  DiscordIcon,
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
        "Essentia harmonik 12-Chroma ve ritim analiziyle parçanın müzikal tonunu (Camelot) ve BPM değerini ölçün."
      ),
      Icon: PianoIcon,
      tags: ["Camelot Wheel", "BPM", "Ritim Analizi", "Çevrimdışı"],
    },
  ];

  const socialLinks = [
    { label: "Instagram (@umw26t)", href: "https://www.instagram.com/umw26t/", Icon: InstagramIcon },
    { label: "Instagram (@_beli26)", href: "https://www.instagram.com/_beli26/", Icon: InstagramIcon },
    { label: "TikTok (@belionthebeat)", href: "https://www.tiktok.com/@belionthebeat", Icon: TikTokIcon },
    { label: "X / Twitter (@_beli26)", href: "https://x.com/_beli26", Icon: TwitterXIcon },
    { label: "YouTube (@beli26)", href: "https://www.youtube.com/@beli26", Icon: YouTubeIcon },
    { label: "Spotify (Beli!)", href: "https://open.spotify.com/intl-tr/artist/0abGcEf1RCkROklu9iYoR7", Icon: SpotifyIcon },
    { label: "GitHub (@umwt26)", href: "https://github.com/umwt26", Icon: GitHubIcon },
    { label: "Discord", href: "https://discord.gg/vwzjuhnpyP", Icon: DiscordIcon },
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

      {/* Release Notes Card */}
      <div className="section section-pad flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[var(--color-app-border)] pb-2.5">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-[var(--color-accent)]" />
            <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              {t("home.releaseNotesTitle", "v0.2.0 Güncelleme Notları & Yenilikler")}
            </h2>
          </div>
          <span className="chip text-[10px] font-mono">Ekim 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-xs text-[var(--color-text-secondary)]">
          <div className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/60 p-2.5">
            <span className="font-bold text-[var(--color-text-primary)] block mb-1">
              🎵 Suno 2.0 & Geçmiş Paneli
            </span>
            <p className="text-[11px] leading-relaxed">
              320k MP3, stüdyo WAV, albüm kapağı, senkronize sözler ve soldan açılan hızlı arama geçmişi.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/60 p-2.5">
            <span className="font-bold text-[var(--color-text-primary)] block mb-1">
              🌐 Universal Downloader
            </span>
            <p className="text-[11px] leading-relaxed">
              YouTube, Instagram, TikTok ve Facebook videolarını tek tıkla MP4 ve MP3 olarak kaydetme ve sıralı geçmiş.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/60 p-2.5">
            <span className="font-bold text-[var(--color-text-primary)] block mb-1">
              🎹 Key & BPM Dedektörü
            </span>
            <p className="text-[11px] leading-relaxed">
              Essentia motoru ile Camelot çarkı, göreceli ve harmonik tonlar, tempo ince ayarı (-1, +1, /2, x2).
            </p>
          </div>

          <div className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/60 p-2.5">
            <span className="font-bold text-[var(--color-text-primary)] block mb-1">
              🏷️ Metadata & Manrope UI
            </span>
            <p className="text-[11px] leading-relaxed">
              ID3v2.4 etiket ve kapak resmi gömme, çevrimdışı Manrope fontu, 6 renk teması ve 8 dil desteği.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
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

      {/* Clean Footer with Social Links */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--color-app-border)] pt-4 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <p>
            <strong className="text-[var(--color-text-primary)]">Sophy Studio</strong> © 2026{" "}
            <strong className="text-[var(--color-accent)]">Beli!</strong>
          </p>
          <span className="text-[var(--color-text-tertiary)]">•</span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">All rights reserved</span>
        </div>

        {/* Social media icons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {socialLinks.map((item) => {
            const SocialIcon = item.Icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.label}
                className="icon-btn h-7 w-7 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all"
              >
                <SocialIcon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
