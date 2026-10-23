import React from "react";
import { useTranslation } from "react-i18next";
import {
  FolderIcon,
  GlobeDownloadIcon,
  PianoIcon,
  ShieldCheckIcon,
  SunoIcon,
  TagIcon,
} from "./icons";
import type { AppTab } from "../types";

interface HomePageProps {
  onNavigate: (tab: AppTab) => void;
  onOpenFolder: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenFolder }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fade-in">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <h1 className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
              Sophy Studio Workstation
            </h1>
            <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
              v0.2.0
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {t(
              "home.heroSubtitle",
              "Müzik prodüksiyonu, medya indirme, ses etiketleme ve Key/BPM analizi için yerel stüdyo paketi."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFolder}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-all active:scale-95 shadow-sm"
        >
          <FolderIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span>{t("home.openOutputFolder", "Stüdyo Klasörü")}</span>
        </button>
      </div>

      {/* 4 Main Modular Tool Racks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: Suno Song Downloader */}
        <div
          onClick={() => onNavigate("suno")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                <SunoIcon className="h-5 w-5" />
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[9px] font-mono font-semibold text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                MODULE 01
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                {t("home.sunoTitle", "Suno Song Downloader")}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t(
                  "home.sunoDesc",
                  "Suno AI parçalarını stüdyo kalitesinde 320k MP3, uncompressed WAV, kapak görseli ve senkron sözlerle indirin."
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                320k MP3
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                WAV
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                Lyrics
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-app-border)] pt-3 text-xs font-bold text-[var(--color-accent)]">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Module 2: Universal Media Downloader */}
        <div
          onClick={() => onNavigate("universal")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                <GlobeDownloadIcon className="h-5 w-5" />
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[9px] font-mono font-semibold text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                MODULE 02
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                {t("home.universalTitle", "Universal Media Downloader")}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t(
                  "home.universalDesc",
                  "Instagram, YouTube, TikTok, Facebook ve diğer platformlardan tek tıkla MP4 video ve MP3 ses indirin."
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                YouTube
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                Instagram
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                TikTok
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-app-border)] pt-3 text-xs font-bold text-[var(--color-accent)]">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Module 3: Audio Metadata Editor */}
        <div
          onClick={() => onNavigate("metadata")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                <TagIcon className="h-5 w-5" />
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[9px] font-mono font-semibold text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                MODULE 03
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                {t("home.metadataTitle", "Metadata Editor")}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t(
                  "home.metadataDesc",
                  "MP3, WAV, FLAC veya M4A dosyalarının şarkı adı, sanatçı, albüm etiketlerini ve albüm kapaklarını doğrudan düzenleyin."
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                ID3v2.4
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                Album Art
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                FLAC/WAV
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-app-border)] pt-3 text-xs font-bold text-[var(--color-accent)]">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Module 4: Key & BPM Detect */}
        <div
          onClick={() => onNavigate("detector")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                <PianoIcon className="h-5 w-5" />
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[9px] font-mono font-semibold text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                MODULE 04
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                {t("home.detectorTitle", "Key & BPM Detect")}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t(
                  "home.detectorDesc",
                  "Tunebat kalitesinde 12-Chroma Krumhansl-Schmuckler analiziyle parça tonunu ve tempo (BPM) değerini saniyeler içinde ölçün."
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                Camelot Wheel
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                BPM Tempo
              </span>
              <span className="rounded bg-[var(--color-app-surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--color-text-secondary)] border border-[var(--color-app-border)]">
                100% Offline
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-app-border)] pt-3 text-xs font-bold text-[var(--color-accent)]">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>

      {/* Studio Info Rack - No low-end, pure pro info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 text-xs">
          <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-bold mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            <span>{t("home.engineTitle", "Sistem & Ses Motoru Durumu")}</span>
          </div>
          <div className="space-y-1.5 text-[var(--color-text-secondary)]">
            <div className="flex justify-between">
              <span>{t("home.coreEngine", "Yerel Çekirdek:")}</span>
              <span className="font-mono text-[var(--color-text-primary)]">
                Tauri 2.0 + Rust High-Performance Engine
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("home.audioDecoder", "Ses İşleme & Dönüştürücü:")}</span>
              <span className="font-mono text-[var(--color-text-primary)]">
                Native FFmpeg / Symphonia
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("home.harmonicEngine", "Harmonik & Ton Analizi:")}</span>
              <span className="font-mono text-[var(--color-accent)]">
                Krumhansl-Schmuckler 12-Chroma
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 text-xs">
          <div className="flex items-center gap-2 text-[var(--color-text-primary)] font-bold mb-2">
            <ShieldCheckIcon className="h-4 w-4 text-[var(--color-accent)]" />
            <span>{t("home.privacyTitle", "Gizlilik & Güvenlik Güvencesi")}</span>
          </div>
          <div className="space-y-1.5 text-[var(--color-text-secondary)]">
            <div className="flex justify-between">
              <span>{t("home.cloudServer", "Bulut / Sunucu:")}</span>
              <span className="font-mono text-emerald-400">
                {t("home.offlineDesc", "%100 Yerel (Dosya yüklenmez)")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("home.executionModel", "İşlem Modeli:")}</span>
              <span className="font-mono text-[var(--color-text-primary)]">
                {t("home.nativeMemory", "Sıfır Terminal / Arka Plan İşlemleri")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("home.supportedLanguages", "Desteklenen Diller:")}</span>
              <span className="font-mono text-[var(--color-text-primary)]">
                TR, EN, DE, FR, ES, RU, PT, JA (8 Dil)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Studio Footer - ONLY Beli! */}
      <footer className="mt-1 flex items-center justify-between border-t border-[var(--color-app-border)] pt-4 text-[11px] text-[var(--color-text-secondary)]">
        <p>
          <strong className="text-[var(--color-text-primary)]">Sophy Studio</strong> © 2026{" "}
          <strong className="text-[var(--color-accent)]">Beli!</strong>. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/umw26t"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors font-medium"
          >
            @umw26t
          </a>
          <span>•</span>
          <a
            href="https://github.com/umwt26/Sophy-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors font-medium"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};
