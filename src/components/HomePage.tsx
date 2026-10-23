import React from "react";
import { useTranslation } from "react-i18next";
import type { AppTab } from "../types";

interface HomePageProps {
  onNavigate: (tab: AppTab) => void;
  onOpenFolder: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenFolder }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-app-border)] bg-gradient-to-br from-[#161822]/90 via-[#12141a]/95 to-[#0b0c10] p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 text-sm text-[var(--color-accent)] font-bold shadow-inner">
                🎵
              </span>
              <span className="rounded-full bg-[var(--color-accent)]/15 px-3 py-0.5 text-xs font-semibold tracking-wide text-[var(--color-accent)]">
                ALL-IN-ONE AUDIO SUITE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Sophy Studio
            </h1>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {t(
                "home.heroSubtitle",
                "Yapay zeka müzik indirme, yüksek çözünürlüklü etiket (ID3) düzenleme ve profesyonel Key & BPM analizlerini tek çatı altında sunan modern stüdyo paketi."
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenFolder}
            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-app-border)] bg-[#1e212b]/80 px-4 py-3 text-xs font-medium text-[var(--color-text-primary)] shadow-md transition-all hover:border-[var(--color-accent)]/50 hover:bg-[#252836] active:scale-95"
          >
            <span>📁</span>
            <span>{t("home.openOutputFolder", "Stüdyo Klasörünü Aç")}</span>
          </button>
        </div>
      </div>

      {/* 3 Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Suno Song Downloader */}
        <div
          onClick={() => onNavigate("suno")}
          className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-2xl text-indigo-400 group-hover:scale-110 transition-transform">
              🎧
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-indigo-400 transition-colors">
                {t("home.sunoTitle", "Suno Song Downloader")}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t(
                  "home.sunoDesc",
                  "Suno AI parçalarını tek tıkla 320kbps MP3, kayıpsız WAV, orijinal akış, kapak görseli ve senkron sözlerle indirin."
                )}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Card 2: Metadata Editor */}
        <div
          onClick={() => onNavigate("metadata")}
          className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-2xl text-emerald-400 group-hover:scale-110 transition-transform">
              🏷️
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">
                {t("home.metadataTitle", "Metadata Editor")}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t(
                  "home.metadataDesc",
                  "MP3, WAV, FLAC ve M4A dosyalarının şarkı adı, sanatçı, albüm bilgilerini ve yüksek çözünürlüklü kapak resimlerini düzenleyin."
                )}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Card 3: Key & BPM Detect */}
        <div
          onClick={() => onNavigate("detector")}
          className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-2xl text-amber-400 group-hover:scale-110 transition-transform">
              🎹
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-amber-400 transition-colors">
                {t("home.detectorTitle", "Key & BPM Detect")}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t(
                  "home.detectorDesc",
                  "Tunebat standardında Krumhansl-Schmuckler analiziyle parçaların tonunu (Camelot çarkı + standart nota) ve BPM değerini saniyeler içinde ölçün."
                )}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>

      {/* Studio Engine & Features Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
            {t("home.featuresTitle", "Stüdyo Yetenekleri")}
          </h4>
          <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Yerel & Gizli:</strong> Ses dosyalarınız sunucuya yüklenmez, her şey cihazınızda çalışır.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Low-End Dostu:</strong> Düşük RAM ve işlemci kullanımı için optimize edilmiş Rust ve Web Worker mimarisi.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span><strong>Sessiz FFmpeg:</strong> Arka planda terminal penceresi açılmadan kusursuz dönüşüm.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
            {t("home.engineTitle", "Sistem & Motor Durumu")}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
              <span>Çekirdek Altyapı:</span>
              <span className="font-mono text-emerald-400">Rust Core v0.2.0 + Lofty Engine</span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
              <span>Key & BPM Motoru:</span>
              <span className="font-mono text-indigo-400">Krumhansl-Schmuckler 12-Chroma</span>
            </div>
            <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
              <span>Kurulu Diller:</span>
              <span className="font-mono text-[var(--color-text-primary)]">TR, EN, DE, FR, ES, RU, PT, JA (8 Dil)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Copyright */}
      <footer className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-app-border)]/60 pt-6 text-center text-xs text-[var(--color-text-muted)] md:flex-row md:text-left">
        <p>
          <strong>Sophy Studio</strong> © 2026 <strong>Umut / Beli</strong>. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="rounded bg-[var(--color-app-border)]/40 px-2 py-0.5 text-[11px] font-mono">
            v0.2.0
          </span>
          <a
            href="https://github.com/umwt26/Sophy-Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
};
