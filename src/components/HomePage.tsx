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
    <div className="flex flex-col gap-5 pb-8 animate-fade-in">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#202532] bg-[#11131a] px-5 py-4 shadow-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-base font-bold tracking-tight text-white">
              Sophy Studio Workstation
            </h1>
            <span className="rounded bg-[#1a1f2c] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#232838]">
              v0.2.0
            </span>
          </div>
          <p className="text-xs text-[#7d8496]">
            {t(
              "home.heroSubtitle",
              "Müzik prodüksiyonu, ses etiketleme ve Key/BPM analizi için optimize edilmiş yerel stüdyo paketi."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFolder}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-lg border border-[#252b3a] bg-[#161a24] px-3.5 py-2 text-xs font-semibold text-[#a5acbe] hover:border-[#38bdf8]/50 hover:bg-[#1c2230] hover:text-white transition-all active:scale-95"
        >
          <span>📁</span>
          <span>{t("home.openOutputFolder", "Kayıt Klasörü")}</span>
        </button>
      </div>

      {/* 3 Main Modular Tool Racks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: Suno Song Downloader */}
        <div
          onClick={() => onNavigate("suno")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[#202532] bg-[#11131a] p-5 transition-all duration-200 hover:border-[#38bdf8]/40 hover:bg-[#141722] hover:shadow-lg hover:shadow-sky-500/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-xl border border-sky-500/20 text-sky-400">
                🎧
              </span>
              <span className="rounded bg-[#181c28] px-2 py-0.5 text-[9px] font-mono font-semibold text-sky-400 border border-sky-500/20">
                MODULE 01
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                {t("home.sunoTitle", "Suno Song Downloader")}
              </h3>
              <p className="mt-1.5 text-xs text-[#7e8598] leading-relaxed">
                Suno AI parçalarını stüdyo kalitesinde 320k MP3, uncompressed WAV, kapak görseli ve senkron sözlerle indirin.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                320kbps MP3
              </span>
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                44.1kHz WAV
              </span>
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                Lyrics
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#1d222e] pt-3 text-xs font-semibold text-sky-400">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Module 2: Audio Metadata Editor */}
        <div
          onClick={() => onNavigate("metadata")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[#202532] bg-[#11131a] p-5 transition-all duration-200 hover:border-emerald-500/40 hover:bg-[#141722] hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-xl border border-emerald-500/20 text-emerald-400">
                🏷️
              </span>
              <span className="rounded bg-[#181c28] px-2 py-0.5 text-[9px] font-mono font-semibold text-emerald-400 border border-emerald-500/20">
                MODULE 02
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {t("home.metadataTitle", "Metadata Editor")}
              </h3>
              <p className="mt-1.5 text-xs text-[#7e8598] leading-relaxed">
                Ses dosyalarınıza şarkı adı, sanatçı, albüm etiketleri ve yüksek çözünürlüklü ön kapak görseli gömün.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                ID3v2.4
              </span>
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                Cover Art
              </span>
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                FLAC/MP3/WAV
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#1d222e] pt-3 text-xs font-semibold text-emerald-400">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>

        {/* Module 3: Key & BPM Detect */}
        <div
          onClick={() => onNavigate("detector")}
          className="group cursor-pointer flex flex-col justify-between rounded-xl border border-[#202532] bg-[#11131a] p-5 transition-all duration-200 hover:border-amber-500/40 hover:bg-[#141722] hover:shadow-lg hover:shadow-amber-500/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-xl border border-amber-500/20 text-amber-400">
                🎹
              </span>
              <span className="rounded bg-[#181c28] px-2 py-0.5 text-[9px] font-mono font-semibold text-amber-400 border border-amber-500/20">
                MODULE 03
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                {t("home.detectorTitle", "Key & BPM Detect")}
              </h3>
              <p className="mt-1.5 text-xs text-[#7e8598] leading-relaxed">
                Tunebat kalitesinde Krumhansl-Schmuckler analiziyle Camelot çarkı, standart nota ve hassas tempo tespiti.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                Camelot 1A-12B
              </span>
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                Auto Tempo
              </span>
              <span className="rounded bg-[#171a24] px-2 py-0.5 text-[10px] font-mono text-[#8a92a6] border border-[#222736]">
                Harmonic Mix
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#1d222e] pt-3 text-xs font-semibold text-amber-400">
            <span>{t("home.openTool", "Aracı Başlat")}</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>

      {/* Studio Engine Telemetry Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#202532] bg-[#11131a] p-4 text-xs">
          <div className="flex items-center gap-2 text-white font-bold mb-2">
            <span>⚙️</span>
            <span>Çekirdek Motor Altyapısı</span>
          </div>
          <div className="space-y-1.5 text-[#7e8598]">
            <div className="flex justify-between">
              <span>Yerel İşleme:</span>
              <span className="font-mono text-emerald-400">Rust Core v0.2.0 (Offline)</span>
            </div>
            <div className="flex justify-between">
              <span>Etiket Kütüphanesi:</span>
              <span className="font-mono text-white">Lofty Multi-Format Engine</span>
            </div>
            <div className="flex justify-between">
              <span>Harmonik Algoritma:</span>
              <span className="font-mono text-sky-400">Krumhansl-Schmuckler 12-Chroma</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#202532] bg-[#11131a] p-4 text-xs">
          <div className="flex items-center gap-2 text-white font-bold mb-2">
            <span>🛡️</span>
            <span>Gizlilik & Donanım Güvencesi</span>
          </div>
          <div className="space-y-1.5 text-[#7e8598]">
            <div className="flex justify-between">
              <span>Bulut / Sunucu:</span>
              <span className="font-mono text-emerald-400">%100 Çevrimdışı (Dosya yüklenmez)</span>
            </div>
            <div className="flex justify-between">
              <span>Sistem Yükü:</span>
              <span className="font-mono text-white">Low-End PC Optimize (&lt;100MB RAM)</span>
            </div>
            <div className="flex justify-between">
              <span>Desteklenen Diller:</span>
              <span className="font-mono text-white">TR, EN, DE, FR, ES, RU, PT, JA (8 Dil)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Studio Footer */}
      <footer className="mt-1 flex items-center justify-between border-t border-[#1d222e] pt-4 text-[11px] text-[#60677a]">
        <p>
          <strong className="text-[#888f9f]">Sophy Studio</strong> © 2026 <strong>Umut / Beli</strong>. All rights reserved.
        </p>
        <a
          href="https://github.com/umwt26/Sophy-Studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#38bdf8] hover:underline"
        >
          GitHub Repository
        </a>
      </footer>
    </div>
  );
};
