import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { analyzeAudio } from "../utils/audioAnalysis";
import { BoltIcon, FolderIcon, MusicalNoteIcon, PianoIcon } from "./icons";
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
      onShowToast(`${t("detector.errorFailed", "Analiz başarısız")}: ${err?.toString()}`);
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
      onShowToast(`${t("detector.errorOpenFile", "Dosya açılamadı")}: ${err?.toString()}`);
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
    <div className="flex flex-col gap-4 animate-fade-in pb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 py-3 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <PianoIcon className="h-4 w-4 text-[var(--color-accent)]" />
            <span>{t("detector.title", "Key & BPM Detect")}</span>
          </h2>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
            {t(
              "detector.subtitle",
              "Tunebat standardında Krumhansl-Schmuckler müzikal ton ve tempo analizi."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={analyzing}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3.5 py-2 text-xs font-semibold text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all active:scale-95 disabled:opacity-50"
        >
          <FolderIcon className="h-3.5 w-3.5" />
          <span>
            {analyzing
              ? t("detector.analyzing", "Analiz Ediliyor...")
              : t("detector.selectFile", "Dosya Yükle")}
          </span>
        </button>
      </div>

      {/* Upload Drop Zone if no result */}
      {!result && !analyzing && (
        <div
          onClick={handleSelectFile}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[var(--color-app-border)] bg-[var(--color-app-surface)]/50 py-16 text-center transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-app-surface)]"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <BoltIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-[var(--color-text-primary)]">
              {t("detector.dropPrompt", "Ses dosyasını buraya bırakın veya tıklayıp seçin")}
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {t(
                "detector.dropFormats",
                "MP3, WAV, FLAC, M4A, OGG, AAC • Saniyeler içinde %100 çevrimdışı yerel analiz"
              )}
            </p>
          </div>
        </div>
      )}

      {/* Loading animation */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-[var(--color-text-primary)]">
              {t("detector.analyzingAudio", "Ses Analiz Ediliyor...")}
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              {fileName} • {t("detector.chromaNotice", "12-Chroma frekans analizi")}
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !analyzing && currentBpm && (
        <div className="flex flex-col gap-4 animate-scale-in">
          {/* File summary bar */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 py-2.5">
            <div className="flex items-center gap-2 truncate">
              <MusicalNoteIcon className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
              <span className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-sm">
                {fileName}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                ({Math.floor(result.duration / 60)}:
                {String(Math.floor(result.duration % 60)).padStart(2, "0")})
              </span>
            </div>

            <button
              type="button"
              onClick={handleSelectFile}
              className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
            >
              {t("detector.newAnalysis", "Yeni Analiz")}
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key Card */}
            <div className="flex flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {t("detector.musicalKey", "Müzikal Ton (Key)")}
                  </span>
                  <span
                    className="rounded px-2.5 py-0.5 text-xs font-black tracking-wider text-black shadow-sm"
                    style={{ backgroundColor: result.camelotColor }}
                  >
                    CAMELOT {result.camelot}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <h3 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
                    {result.key}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {t("detector.relativeKey", "Göreceli:")}{" "}
                    <strong className="text-[var(--color-text-primary)]">{result.relativeKey}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--color-app-border)] pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                  {t("detector.compatibleKeys", "Harmonik Uyumlu Tonlar (DJ Mixing):")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.compatibleKeys.map((k) => (
                    <span
                      key={k}
                      className="rounded bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2 py-0.5 text-[11px] font-mono font-bold text-[var(--color-text-primary)]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BPM Card */}
            <div className="flex flex-col justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {t("detector.tempoBpm", "Tempo (BPM)")}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-2.5 py-0.5">
                    <span
                      className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse"
                      style={{ animationDuration: `${60 / currentBpm}s` }}
                    />
                    <span className="text-[10px] font-mono font-bold text-[var(--color-accent)]">
                      BEAT
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight text-[var(--color-text-primary)]">
                    {currentBpm}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">BPM</span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">
                  {t(
                    "detector.bpmDescription",
                    "Otomatik ritim zarfı ve özilişki (autocorrelation) tespiti."
                  )}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--color-app-border)] pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {t("detector.tempoCorrection", "Tempo Düzeltme:")}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleHalfBpm}
                    className="rounded bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    {t("detector.halfBpm", "/2 Yarım")}
                  </button>
                  <button
                    type="button"
                    onClick={handleDoubleBpm}
                    className="rounded bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    {t("detector.doubleBpm", "x2 Çift")}
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
