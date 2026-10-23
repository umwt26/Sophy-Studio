import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useTranslation } from "react-i18next";
import { analyzeAudio } from "../utils/audioAnalysis";
import { FolderIcon, MusicalNoteIcon, PianoIcon } from "./icons";
import { AdModal } from "./AdModal";
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
  const [pendingResult, setPendingResult] = useState<KeyBpmResult | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const processAudioBuffer = async (buffer: ArrayBuffer, name: string) => {
    try {
      setAnalyzing(true);
      setFileName(name);
      setResult(null);
      setPendingResult(null);
      setAnalysisStage(t("detector.readingAudio", "Ses dosyası taranıyor..."));

      const stageLabels: Record<string, string> = {
        decoding: t("detector.stageDecoding", "Ses dalgaları ve frekans katmanları çözülüyor..."),
        resampling: t("detector.stageResampling", "44.1kHz stüdyo frekansına dönüştürülüyor..."),
        chroma: t("detector.stageChroma", "Harmonik 12-Chroma HPCP & Ton profili çıkarılıyor..."),
        rhythm: t("detector.stageRhythm", "Ritim örüntüsü & vuruş aralıkları taranıyor..."),
        complete: t("detector.stageComplete", "Tunebat Camelot & tempo tespiti tamamlandı!"),
      };

      const res = await analyzeAudio(buffer, (stage) => {
        setAnalysisStage(stageLabels[stage] || stage);
      });

      setPendingResult(res);
      setShowAdModal(true);
    } catch (err: any) {
      onShowToast(`${t("detector.errorFailed", "Analiz başarısız")}: ${err?.toString()}`);
    } finally {
      setAnalyzing(false);
      setAnalysisStage("");
    }
  };

  const handleAdConfirm = () => {
    if (pendingResult) {
      setResult(pendingResult);
      setCurrentBpm(pendingResult.bpm);
      setPendingResult(null);
      onShowToast(t("detector.analyzed", "Key & BPM analizi tamamlandı!"));
    }
  };

  const handleSelectFile = async () => {
    if (selecting || analyzing) return;
    try {
      setSelecting(true);
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
    } finally {
      setSelecting(false);
    }
  };

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    try {
      getCurrentWebview().onDragDropEvent(async (event) => {
        if (event.payload.type === "enter" || event.payload.type === "over") {
          setIsDragOver(true);
        } else if (event.payload.type === "leave") {
          setIsDragOver(false);
        } else if (event.payload.type === "drop") {
          setIsDragOver(false);
          const paths = event.payload.paths;
          if (paths && paths.length > 0) {
            const first = paths[0];
            const lower = first.toLowerCase();
            if (
              lower.endsWith(".mp3") ||
              lower.endsWith(".wav") ||
              lower.endsWith(".flac") ||
              lower.endsWith(".m4a") ||
              lower.endsWith(".ogg") ||
              lower.endsWith(".aac")
            ) {
              setAnalyzing(true);
              const name = first.split(/[\\/]/).pop() || "audio.mp3";
              setFileName(name);
              try {
                const bytes = await invoke<number[]>("read_file_binary", { filePath: first });
                const uint8 = new Uint8Array(bytes);
                await processAudioBuffer(uint8.buffer, name);
              } catch (e: any) {
                setAnalyzing(false);
                onShowToast(`${t("detector.errorOpenFile", "Dosya açılamadı")}: ${e?.toString()}`);
              }
            } else {
              onShowToast(t("metadata.dropFormats", "Geçerli bir ses dosyası bırakın (MP3, WAV, FLAC, M4A)"));
            }
          }
        }
      }).then((u) => {
        unlisten = u;
      });
    } catch {
      // not in tauri environment
    }

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

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
    <div className="page">
      {/* Top Header Card */}
      <div className="section section-pad flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <PianoIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {t("detector.title", "Key & BPM Detect")}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("detector.subtitle", "Harmonik ton, Camelot kodu ve tempo analizi.")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={analyzing || selecting}
          className="btn btn-secondary self-start sm:self-auto"
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
          className={`dropzone py-16 ${isDragOver ? "active" : ""}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <MusicalNoteIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {isDragOver
                ? t("detector.dropNow", "Ses dosyasını buraya bırakın")
                : t("detector.dropPrompt", "Ses dosyasını buraya sürükleyin veya seçin")}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {t("detector.dropFormats", "MP3, WAV, FLAC, M4A, OGG, AAC • Cihazınızda çevrimdışı işlenir")}
            </p>
          </div>
        </div>
      )}

      {/* Analyzing state */}
      {analyzing && (
        <div className="section section-pad flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-app-border)] border-t-[var(--color-accent)]" />
          </div>
          <div className="flex flex-col gap-1 max-w-md px-4">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {analysisStage || t("detector.analyzingAudio", "Ses Analiz Ediliyor...")}
            </p>
            <p className="text-xs font-mono text-[var(--color-text-tertiary)] truncate">
              {fileName}
            </p>
          </div>
          <div className="w-48 h-1 rounded-full bg-[var(--color-app-surface-2)] overflow-hidden mt-1">
            <div className="h-full bg-[var(--color-accent)] rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !analyzing && currentBpm && (
        <div className="flex flex-col gap-4 animate-scale-in">
          {/* File summary bar */}
          <div className="section px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <MusicalNoteIcon className="h-4 w-4 text-[var(--color-accent)] shrink-0" />
              <span className="text-xs font-medium text-[var(--color-text-primary)] truncate max-w-sm">
                {fileName}
              </span>
              <span className="chip text-[11px] font-mono">
                {Math.floor(result.duration / 60)}:
                {String(Math.floor(result.duration % 60)).padStart(2, "0")}
              </span>
              <span className="chip text-[11px] font-medium text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                %{result.confidence} {t("detector.confidence", "Güven")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSelectFile}
              className="btn btn-secondary text-xs"
            >
              {t("detector.newAnalysis", "Yeni Analiz")}
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Key Card */}
            <div className="section section-pad flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow">
                    {t("detector.musicalKey", "Müzikal Ton (Key)")}
                  </span>
                  <div
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-black"
                    style={{ backgroundColor: result.camelotColor }}
                  >
                    <span>CAMELOT</span>
                    <span>{result.camelot}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col">
                  <h3 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    {result.key}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {t("detector.relativeKey", "Göreceli:")}{" "}
                    <strong className="text-[var(--color-text-primary)] font-medium">{result.relativeKey}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[var(--color-app-border)] pt-4">
                <p className="eyebrow mb-2">
                  {t("detector.compatibleKeys", "Harmonik Uyumlu Tonlar (DJ Mixing)")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.compatibleKeys.map((k) => (
                    <span key={k} className="chip font-mono font-medium">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. BPM Card */}
            <div className="section section-pad flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow">
                    {t("detector.tempoBpm", "Tempo (BPM)")}
                  </span>
                  <div className="flex items-center gap-2 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent-subtle)] px-2.5 py-0.5">
                    <span
                      className="h-2 w-2 rounded-full bg-[var(--color-accent)]"
                      style={{
                        animation: `pulse ${Math.max(0.2, 60 / currentBpm)}s infinite ease-in-out`,
                      }}
                    />
                    <span className="text-[10px] font-mono font-medium text-[var(--color-accent)]">
                      TEMPO
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                    {currentBpm}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)]">BPM</span>
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                  {t("detector.bpmDescription", "Doğruluk oranı yüksek vuruş ve ritim tespiti.")}
                </p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--color-app-border)] pt-4">
                <span className="eyebrow">
                  {t("detector.tempoCorrection", "Tempo Düzelt")}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNudgeBpm(-1)}
                    className="btn btn-secondary px-2 py-1 text-xs font-mono"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNudgeBpm(1)}
                    className="btn btn-secondary px-2 py-1 text-xs font-mono"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={handleHalfBpm}
                    className="btn btn-secondary px-2.5 py-1 text-xs"
                  >
                    /2
                  </button>
                  <button
                    type="button"
                    onClick={handleDoubleBpm}
                    className="btn btn-secondary px-2.5 py-1 text-xs"
                  >
                    x2
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdModal && (
        <AdModal
          actionTitle={t("detector.showResults", "Sonuçları Göster")}
          actionDesc={t("detector.readyResults", "Key & BPM analiz sonuçları hazır.")}
          lockSeconds={5}
          onClose={() => {
            setShowAdModal(false);
            setPendingResult(null);
          }}
          onConfirm={handleAdConfirm}
        />
      )}
    </div>
  );
};
