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
  const [analysisStage, setAnalysisStage] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<KeyBpmResult | null>(null);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);

  const processAudioBuffer = async (buffer: ArrayBuffer, name: string) => {
    try {
      setAnalyzing(true);
      setFileName(name);
      setResult(null);
      setAnalysisStage("Ses dosyası taranıyor...");

      const res = await analyzeAudio(buffer, (stage) => {
        setAnalysisStage(stage);
      });

      setResult(res);
      setCurrentBpm(res.bpm);
      onShowToast(t("detector.analyzed", "Key & BPM analizi tamamlandı!"));
    } catch (err: any) {
      onShowToast(`${t("detector.errorFailed", "Analiz başarısız")}: ${err?.toString()}`);
    } finally {
      setAnalyzing(false);
      setAnalysisStage("");
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

  const handleNudgeBpm = (delta: number) => {
    if (currentBpm) setCurrentBpm(Math.max(1, currentBpm + delta));
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-10">
      {/* Top Banner Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-inner">
            <PianoIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--color-text-primary)]">
              {t("detector.title", "Key & BPM Detect")}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t(
                "detector.subtitle",
                "Tunebat standardında Essentia.js 12-Chroma HPCP ve multifeature ritim analizi."
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={analyzing}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-2 text-xs font-bold text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
        >
          <FolderIcon className="h-4 w-4" />
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
          className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-app-border)] bg-[var(--color-app-surface)]/40 py-20 text-center transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-app-surface)] shadow-inner"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-sm transition-transform group-hover:scale-110">
            <BoltIcon className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {t("detector.dropPrompt", "Ses dosyasını buraya bırakın veya tıklayıp seçin")}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t(
                "detector.dropFormats",
                "MP3, WAV, FLAC, M4A, OGG, AAC • %100 Çevrimdışı ve gizli Essentia.js analizi"
              )}
            </p>
          </div>
        </div>
      )}

      {/* Loading animation with detailed scanning stages */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] py-20 text-center shadow-md">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-3 border-[var(--color-app-border)] border-t-[var(--color-accent)]" />
            <PianoIcon className="absolute h-5 w-5 text-[var(--color-accent)]" />
          </div>

          <div className="flex flex-col gap-1.5 max-w-md px-4">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              {analysisStage || t("detector.analyzingAudio", "Ses Analiz Ediliyor...")}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] font-mono truncate">
              {fileName}
            </p>
          </div>

          {/* Animated scanning progress bar */}
          <div className="w-64 h-1.5 rounded-full bg-[var(--color-app-surface-2)] overflow-hidden mt-1">
            <div className="h-full bg-[var(--color-accent)] rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !analyzing && currentBpm && (
        <div className="flex flex-col gap-5 animate-scale-in">
          {/* File summary pill bar */}
          <div className="flex items-center justify-between rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2.5 truncate">
              <MusicalNoteIcon className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
              <span className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-sm">
                {fileName}
              </span>
              <span className="text-[11px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-app-surface-2)] px-2 py-0.5 rounded-md border border-[var(--color-app-border)]">
                {Math.floor(result.duration / 60)}:
                {String(Math.floor(result.duration % 60)).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                %{result.confidence} Güven
              </span>
            </div>

            <button
              type="button"
              onClick={handleSelectFile}
              className="rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all active:scale-95"
            >
              {t("detector.newAnalysis", "Yeni Analiz")}
            </button>
          </div>

          {/* Studio Console Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Key & Scale Console Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-sm relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {t("detector.musicalKey", "Müzikal Ton (Key)")}
                  </span>
                  <div
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-black tracking-wider text-black shadow-lg"
                    style={{
                      backgroundColor: result.camelotColor,
                      boxShadow: `0 0 16px ${result.camelotColor}50`,
                    }}
                  >
                    <span>CAMELOT</span>
                    <span>{result.camelot}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-1">
                  <h3 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
                    {result.key}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {t("detector.relativeKey", "Göreceli:")}{" "}
                    <strong className="text-[var(--color-text-primary)]">{result.relativeKey}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--color-app-border)] pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                  {t("detector.compatibleKeys", "Harmonik Uyumlu Tonlar (DJ Mixing):")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.compatibleKeys.map((k) => (
                    <span
                      key={k}
                      className="rounded-lg bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-mono font-bold text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. BPM & Rhythm Console Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-sm relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {t("detector.tempoBpm", "Tempo (BPM)")}
                  </span>
                  <div className="flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] animate-ping"
                      style={{ animationDuration: `${Math.max(0.2, 60 / currentBpm)}s` }}
                    />
                    <span className="text-[10px] font-mono font-bold text-[var(--color-accent)]">
                      BEAT SYNC
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl font-black font-mono tracking-tight text-[var(--color-text-primary)]">
                    {currentBpm}
                  </span>
                  <span className="text-sm font-bold text-[var(--color-text-secondary)]">BPM</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
                  {t(
                    "detector.bpmDescription",
                    "Essentia.js multifeature vuruş tespiti ve özilişki (autocorrelation)."
                  )}
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--color-app-border)] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {t("detector.tempoCorrection", "Tempo Düzeltme:")}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNudgeBpm(-1)}
                    className="rounded-lg bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-mono font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNudgeBpm(1)}
                    className="rounded-lg bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-mono font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={handleHalfBpm}
                    className="rounded-lg bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
                  >
                    {t("detector.halfBpm", "/2 Yarım")}
                  </button>
                  <button
                    type="button"
                    onClick={handleDoubleBpm}
                    className="rounded-lg bg-[var(--color-app-surface-2)] border border-[var(--color-app-border)] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-colors"
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
