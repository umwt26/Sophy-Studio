import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { analyzeAudio } from "../utils/audioAnalysis";
import type { KeyBpmResult } from "../types";

interface KeyBpmDetectPageProps {
  onShowToast: (msg: string) => void;
}

export const KeyBpmDetectPage: React.FC<KeyBpmDetectPageProps> = ({ onShowToast }) => {
  const { t } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<KeyBpmResult | null>(null);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);

  const processAudioBuffer = async (buffer: ArrayBuffer, name: string) => {
    try {
      setAnalyzing(true);
      setFileName(name);
      setResult(null);

      const res = await analyzeAudio(buffer);
      setResult(res);
      setCurrentBpm(res.bpm);
      onShowToast(t("detector.analyzed", "Key & BPM analizi tamamlandı!"));
    } catch (err: any) {
      onShowToast(`Analiz başarısız: ${err?.toString()}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectFile = async () => {
    try {
      const selectedPath = await invoke<string | null>("select_audio_file");
      if (selectedPath) {
        setAnalyzing(true);
        const name = selectedPath.split(/[\\/]/).pop() || "audio.mp3";
        setFileName(name);

        const bytes = await invoke<number[]>("read_file_binary", { filePath: selectedPath });
        const uint8 = new Uint8Array(bytes);
        await processAudioBuffer(uint8.buffer, name);
      }
    } catch (err: any) {
      setAnalyzing(false);
      onShowToast(`Dosya açılamadı: ${err?.toString()}`);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const buf = await file.arrayBuffer();
      await processAudioBuffer(buf, file.name);
    }
  };

  const handleHalfBpm = () => {
    if (currentBpm) setCurrentBpm(Math.round(currentBpm / 2));
  };

  const handleDoubleBpm = () => {
    if (currentBpm) setCurrentBpm(Math.round(currentBpm * 2));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-base text-amber-400">
              🎹
            </span>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {t("detector.title", "Key & BPM Detect")}
            </h2>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {t(
              "detector.subtitle",
              "Tunebat kalitesinde müzikal ton (Camelot çarkı + klasik nota) ve hassas BPM tempo analizörü."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectFile}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-amber-500 active:scale-95 disabled:opacity-50"
          >
            <span>📂</span>
            <span>{analyzing ? t("detector.analyzing", "Analiz Ediliyor...") : t("detector.selectFile", "Ses Dosyası Yükle")}</span>
          </button>
        </div>
      </div>

      {/* Upload Drop Zone if no result */}
      {!result && !analyzing && (
        <div
          onClick={handleSelectFile}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-app-border)] bg-[var(--color-app-surface)]/50 py-24 text-center transition-all hover:border-amber-500/50 hover:bg-[var(--color-app-surface)]"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-4xl text-amber-400">
            ⚡
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {t("detector.dropPrompt", "Ses dosyasını buraya bırakın veya tıklayıp seçin")}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              MP3, WAV, FLAC, M4A, OGG ve AAC formatları desteklenir • Saniyeler içinde %100 çevrimdışı analiz
            </p>
          </div>
        </div>
      )}

      {/* Loading animation */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] py-24 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {t("detector.analyzingAudio", "Ses Analiz Ediliyor...")}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {fileName} • Krumhansl-Schmuckler harmonik ton ve tempo tespiti çalışıyor
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !analyzing && currentBpm && (
        <div className="flex flex-col gap-6 animate-scale-in">
          {/* File summary pill */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-5 py-3">
            <div className="flex items-center gap-2 truncate">
              <span className="text-amber-400">🎵</span>
              <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                {fileName}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                ({Math.floor(result.duration / 60)}:{String(Math.floor(result.duration % 60)).padStart(2, "0")})
              </span>
            </div>

            <button
              type="button"
              onClick={handleSelectFile}
              className="rounded-lg border border-[var(--color-app-border)] bg-[#181b24] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-amber-500/40"
            >
              {t("detector.newAnalysis", "Yeni Analiz")}
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-app-border)] bg-gradient-to-br from-[#181a24] to-[#12131a] p-8 shadow-xl">
              <div
                className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: result.camelotColor }}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {t("detector.musicalKey", "Müzikal Ton (Key)")}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-black tracking-wider text-black shadow-md"
                  style={{ backgroundColor: result.camelotColor }}
                >
                  CAMELOT {result.camelot}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
                  {result.key}
                </h1>
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  Göreceli Ton: <strong className="text-[var(--color-text-primary)]">{result.relativeKey}</strong>
                </p>
              </div>

              <div className="mt-8 border-t border-[var(--color-app-border)]/60 pt-4">
                <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mb-2">
                  Harmonik Uyumlu Tonlar (DJ Mixing):
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.compatibleKeys.map((k) => (
                    <span
                      key={k}
                      className="rounded-md border border-[var(--color-app-border)] bg-[#1c1f2b] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BPM Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-app-border)] bg-gradient-to-br from-[#181a24] to-[#12131a] p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {t("detector.tempoBpm", "Tempo (BPM)")}
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 animate-pulse"
                    style={{ animationDuration: `${60 / currentBpm}s` }}
                  />
                  <span className="text-[11px] font-mono font-bold text-amber-400">BEAT</span>
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <h1 className="text-5xl font-black tracking-tight font-mono text-[var(--color-text-primary)]">
                  {currentBpm}
                </h1>
                <span className="text-base font-bold text-[var(--color-text-muted)]">BPM</span>
              </div>

              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Otomatik tempo algılama ve ritim zarfı korelasyonu.
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-[var(--color-app-border)]/60 pt-4">
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                  Düzeltme (Half/Double Time):
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleHalfBpm}
                    className="rounded-md border border-[var(--color-app-border)] bg-[#1c1f2b] px-3 py-1 text-xs font-bold text-[var(--color-text-secondary)] hover:text-white hover:border-amber-500/40"
                  >
                    /2 (Yarım)
                  </button>
                  <button
                    type="button"
                    onClick={handleDoubleBpm}
                    className="rounded-md border border-[var(--color-app-border)] bg-[#1c1f2b] px-3 py-1 text-xs font-bold text-[var(--color-text-secondary)] hover:text-white hover:border-amber-500/40"
                  >
                    x2 (Çift)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
