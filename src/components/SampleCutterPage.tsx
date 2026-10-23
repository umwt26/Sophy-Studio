import React, { useState, useRef, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import {
  ScissorsIcon,
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  FolderIcon,
  CloseIcon,
  SparklesIcon,
} from "./icons";

interface SampleCutterPageProps {
  onShowToast: (msg: string) => void;
  onOpenFolder?: () => void;
}

const SAMPLE_DURATION = 8.0; // Strictly 8.0 seconds

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mStr = m.toString().padStart(2, "0");
  const sStr = s.toFixed(1).padStart(4, "0");
  return `${mStr}:${sStr}`;
}

export const SampleCutterPage: React.FC<SampleCutterPageProps> = ({
  onShowToast,
  onOpenFolder,
}) => {
  const { t } = useTranslation();

  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<"mp3" | "wav" | null>(null);

  // Audio & Waveform state
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startSec, setStartSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [playProgress, setPlayProgress] = useState<number>(0); // 0 to 1 inside 8s

  // Canvas & dragging
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartClientXRef = useRef<number>(0);
  const dragInitialStartSecRef = useRef<number>(0);

  // Audio Context & Source
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const playStartAudioTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Audio Context on demand
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Stop current playback
  const stopPlayback = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch {
        // ignore
      }
      activeSourceRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
    setPlayProgress(0);
  }, []);

  // Play the 8-second slice
  const playSlice = useCallback(
    (offsetSec: number = startSec) => {
      if (!audioBuffer) return;
      stopPlayback();

      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const effectiveOffset = Math.max(0, Math.min(offsetSec, duration - SAMPLE_DURATION));
      const playDuration = Math.min(SAMPLE_DURATION, duration - effectiveOffset);

      source.start(0, effectiveOffset, playDuration);
      activeSourceRef.current = source;
      playStartAudioTimeRef.current = ctx.currentTime;
      setIsPlaying(true);

      source.onended = () => {
        if (activeSourceRef.current === source) {
          if (isLooping) {
            playSlice(effectiveOffset);
          } else {
            stopPlayback();
          }
        }
      };

      // Progress animation
      const updateProgress = () => {
        if (!activeSourceRef.current) return;
        const elapsed = ctx.currentTime - playStartAudioTimeRef.current;
        const pct = Math.min(1, Math.max(0, elapsed / playDuration));
        setPlayProgress(pct);
        if (pct < 1) {
          animFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };
      animFrameRef.current = requestAnimationFrame(updateProgress);
    },
    [audioBuffer, duration, startSec, isLooping, getAudioContext, stopPlayback]
  );

  // Toggle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      playSlice(startSec);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopPlayback]);

  // Load and decode audio file
  const loadAudioFromPath = async (selectedPath: string) => {
    stopPlayback();
    setLoading(true);

    try {
      const rawBytes = await invoke<number[]>("read_file_binary", {
        filePath: selectedPath,
      });

      const uint8 = new Uint8Array(rawBytes);
      const ctx = getAudioContext();
      const decodedBuffer = await ctx.decodeAudioData(uint8.buffer);

      if (decodedBuffer.duration < 1.0) {
        throw new Error(t("cutter.tooShort", "Ses dosyası çok kısa."));
      }

      setAudioBuffer(decodedBuffer);
      setDuration(decodedBuffer.duration);
      setFilePath(selectedPath);

      // Extract file name
      const cleanName = selectedPath.split(/[/\\]/).pop() || "Audio Sample";
      setFileName(cleanName);

      // Estimate file size in MB
      const mb = (rawBytes.length / (1024 * 1024)).toFixed(2);
      setFileSize(`${mb} MB`);

      // Set initial start position (centered or at 0)
      const maxStart = Math.max(0, decodedBuffer.duration - SAMPLE_DURATION);
      setStartSec(Math.min(0, maxStart));

      onShowToast(t("cutter.loaded", "Ses dosyası başarıyla yüklendi!"));
    } catch (err: any) {
      console.error("Failed to load audio for sample cutting:", err);
      onShowToast(`${t("cutter.loadError", "Dosya açılamadı")}: ${err?.toString() || ""}`);
    } finally {
      setLoading(false);
    }
  };

  // Pick file via Tauri dialog
  const handleSelectFile = async () => {
    try {
      const selected = await invoke<string | null>("select_audio_file");
      if (selected) {
        await loadAudioFromPath(selected);
      }
    } catch (e: any) {
      onShowToast(`${t("common.error", "Hata")}: ${e?.toString() || ""}`);
    }
  };

  // Drag & Drop onto container
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const webkitPath = (file as any).path;
      if (webkitPath) {
        await loadAudioFromPath(webkitPath);
      } else {
        // Fallback array buffer decode
        const arrayBuf = await file.arrayBuffer();
        const ctx = getAudioContext();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        setAudioBuffer(decoded);
        setDuration(decoded.duration);
        setFileName(file.name);
        setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        setStartSec(0);
      }
    }
  };

  // Draw Waveform onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Calculate peaks
    const rawData = audioBuffer.getChannelData(0);
    const numBars = Math.floor(width / 3.5); // bar width + gap
    const step = Math.ceil(rawData.length / numBars);
    const peaks: number[] = [];

    for (let i = 0; i < numBars; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = rawData[i * step + j] || 0;
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      peaks.push(Math.max(Math.abs(min), Math.abs(max)));
    }

    // Determine 8s range in terms of bar indices
    const startPct = duration > 0 ? startSec / duration : 0;
    const endPct = duration > 0 ? (startSec + SAMPLE_DURATION) / duration : 1;
    const startBarIdx = Math.floor(startPct * numBars);
    const endBarIdx = Math.ceil(endPct * numBars);

    // Draw bars
    const barWidth = 2.0;
    const centerY = height / 2;

    peaks.forEach((peak, i) => {
      const x = i * 3.5;
      const barHeight = Math.max(3, peak * (height * 0.85));
      const isInsideSlice = i >= startBarIdx && i <= endBarIdx;

      if (isInsideSlice) {
        // Active selected range
        ctx.fillStyle = "var(--color-accent)";
      } else {
        // Dimmed unselected background
        ctx.fillStyle = "rgba(148, 163, 184, 0.22)";
      }

      // Draw rounded bar
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 1.5);
      ctx.fill();
    });
  }, [audioBuffer, duration, startSec]);

  // Window drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!audioBuffer || duration <= 0) return;
    isDraggingRef.current = true;
    dragStartClientXRef.current = e.clientX;
    dragInitialStartSecRef.current = startSec;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !waveformContainerRef.current) return;
      const rect = waveformContainerRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - dragStartClientXRef.current;
      const deltaSec = (deltaX / rect.width) * duration;

      const maxStart = Math.max(0, duration - SAMPLE_DURATION);
      const newStart = Math.max(0, Math.min(maxStart, dragInitialStartSecRef.current + deltaSec));
      setStartSec(newStart);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Click on waveform to jump window
  const handleWaveformClick = (e: React.MouseEvent) => {
    if (!waveformContainerRef.current || !audioBuffer || duration <= 0) return;
    const rect = waveformContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = clickPct * duration;

    // Center the 8s window around click
    const maxStart = Math.max(0, duration - SAMPLE_DURATION);
    const newStart = Math.max(0, Math.min(maxStart, targetSec - SAMPLE_DURATION / 2));
    setStartSec(newStart);
    if (isPlaying) {
      playSlice(newStart);
    }
  };

  // Export Sample
  const handleExport = async (format: "mp3" | "wav") => {
    if (!filePath) {
      onShowToast(t("cutter.noFileToExport", "Dışa aktarmak için bir dosya yükleyin."));
      return;
    }

    try {
      setExporting(format);
      stopPlayback();

      const outPath = await invoke<string>("cut_audio_sample", {
        inputPath: filePath,
        startSec,
        durationSec: SAMPLE_DURATION,
        targetFormat: format,
      });

      onShowToast(
        `${t("cutter.exportSuccess", "8 saniyelik sample kaydedildi!")} (${outPath})`
      );
    } catch (err: any) {
      console.error("Export sample failed:", err);
      onShowToast(`${t("cutter.exportError", "Dışa aktarma hatası")}: ${err?.toString() || ""}`);
    } finally {
      setExporting(null);
    }
  };

  // Nudge start position
  const nudge = (deltaSec: number) => {
    const maxStart = Math.max(0, duration - SAMPLE_DURATION);
    const newStart = Math.max(0, Math.min(maxStart, startSec + deltaSec));
    setStartSec(newStart);
    if (isPlaying) {
      playSlice(newStart);
    }
  };

  // Percentage calculations for sliding window overlay
  const windowLeftPct = duration > 0 ? (startSec / duration) * 100 : 0;
  const windowWidthPct = duration > 0 ? Math.min(100, (SAMPLE_DURATION / duration) * 100) : 100;

  return (
    <div className="page pb-12">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] shadow-sm border border-[var(--color-accent)]/20">
            <ScissorsIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="page-title text-base font-bold text-[var(--color-text-primary)]">
                {t("cutter.title", "Sample Kesici (8s)")}
              </h1>
              <span className="chip text-[10px] font-bold px-2 py-0.5 bg-[var(--color-accent)] text-black border-transparent">
                8.0s Fixed
              </span>
            </div>
            <p className="page-subtitle text-xs text-[var(--color-text-secondary)] mt-0.5">
              {t(
                "cutter.subtitle",
                "Ses dosyasından tam 8 saniyelik stüdyo kesitleri kırpın ve yüksek kalitede kaydedin."
              )}
            </p>
          </div>
        </div>

        {onOpenFolder && (
          <button
            type="button"
            onClick={onOpenFolder}
            className="btn btn-secondary text-xs gap-1.5 self-start sm:self-auto"
          >
            <FolderIcon className="text-[var(--color-accent)] h-4 w-4" />
            <span>{t("cutter.openFolder", "Ses Klasörü")}</span>
          </button>
        )}
      </div>

      {/* Upload Zone / Active Track Info */}
      {!audioBuffer ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleSelectFile}
          className="dropzone cursor-pointer p-10 flex flex-col items-center justify-center text-center transition-all hover:border-[var(--color-accent)]/60 hover:bg-[var(--color-app-surface-2)]/40"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] mb-3 border border-[var(--color-accent)]/30">
            <ScissorsIcon className="h-7 w-7" />
          </div>
          <p className="text-sm font-bold text-[var(--color-text-primary)]">
            {loading
              ? t("cutter.decoding", "Ses dosyası işleniyor...")
              : t("cutter.dropPrompt", "Kesmek istediğiniz ses dosyasını sürükleyin veya seçin")}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm">
            {t("cutter.formats", "MP3, WAV, FLAC, M4A, OGG, AAC desteklenir • Otomatik dalga formu analizi")}
          </p>
          <button
            type="button"
            disabled={loading}
            className="btn btn-primary text-xs mt-4 px-5 py-2"
          >
            {loading ? <span className="spinner" /> : t("cutter.selectFile", "Dosya Seç")}
          </button>
        </div>
      ) : (
        <div className="section section-pad flex flex-col gap-5">
          {/* Track Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-app-border)] pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] shrink-0">
                <ScissorsIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-xs sm:max-w-md">
                  {fileName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--color-text-tertiary)] font-mono">
                  <span>{formatTime(duration)}</span>
                  <span>•</span>
                  <span>{fileSize}</span>
                  <span>•</span>
                  <span>{audioBuffer.sampleRate} Hz</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectFile}
                className="btn btn-secondary text-xs px-3 py-1.5"
              >
                {t("cutter.changeFile", "Dosya Değiştir")}
              </button>
              <button
                type="button"
                onClick={() => {
                  stopPlayback();
                  setAudioBuffer(null);
                  setFilePath(null);
                }}
                className="icon-btn h-8 w-8 text-rose-400 hover:text-rose-300"
                title={t("common.close", "Kapat")}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Waveform & 8s Sliding Window */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)] font-mono px-1">
              <span>00:00.0</span>
              <span className="text-[var(--color-accent)] font-semibold">
                {t("cutter.dragInstruction", "Kaydırıcıyı sağa-sola taşıyarak 8s aralığı belirleyin")}
              </span>
              <span>{formatTime(duration)}</span>
            </div>

            <div
              ref={waveformContainerRef}
              onClick={handleWaveformClick}
              className="relative h-28 w-full rounded-2xl bg-black/60 border border-[var(--color-app-border)] p-2 cursor-pointer select-none overflow-hidden group shadow-inner"
            >
              {/* Canvas Waveform */}
              <canvas ref={canvasRef} className="h-full w-full pointer-events-none" />

              {/* 8-Second Sliding Window Overlay (Suno style) */}
              <div
                style={{
                  left: `${windowLeftPct}%`,
                  width: `${windowWidthPct}%`,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e);
                }}
                className="absolute inset-y-1 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/15 shadow-[0_0_20px_var(--color-accent-soft)] cursor-grab active:cursor-grabbing flex flex-col justify-between transition-colors z-10"
              >
                {/* Top Grip Handle (Matches Suno reference video) */}
                <div className="self-center -mt-2 px-3 py-0.5 rounded-full bg-[var(--color-accent)] text-black shadow-md flex items-center justify-center gap-0.5">
                  <span className="w-0.5 h-2.5 bg-black/80 rounded-full" />
                  <span className="w-0.5 h-2.5 bg-black/80 rounded-full" />
                  <span className="w-0.5 h-2.5 bg-black/80 rounded-full" />
                </div>

                {/* Live Playhead inside the 8s slice */}
                {isPlaying && (
                  <div
                    style={{ left: `${playProgress * 100}%` }}
                    className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_white] pointer-events-none"
                  />
                )}

                {/* Bottom Duration Badge */}
                <div className="self-center -mb-1 px-2 py-0.2 rounded-full bg-black/80 text-[var(--color-accent)] text-[9px] font-mono font-bold border border-[var(--color-accent)]/40">
                  8.0s
                </div>
              </div>
            </div>
          </div>

          {/* Player & Fine-Tuning Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)]/60">
            {/* Play & Loop Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="h-10 w-10 rounded-xl bg-[var(--color-accent)] hover:brightness-110 text-black flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title={isPlaying ? t("cutter.pause", "Durdur") : t("cutter.play", "8s Kesiti Çal")}
              >
                {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`icon-btn h-9 w-9 rounded-xl ${
                  isLooping
                    ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/40"
                    : "text-[var(--color-text-tertiary)]"
                }`}
                title={isLooping ? t("cutter.loopOn", "Döngü Açık") : t("cutter.loopOff", "Döngü Kapalı")}
              >
                <RepeatIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Time Indicators */}
            <div className="flex items-center gap-2 font-mono text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-[var(--color-app-border)]">
              <span className="text-[var(--color-text-secondary)]">{t("cutter.start", "Başlangıç:")}</span>
              <span className="font-bold text-[var(--color-text-primary)]">{formatTime(startSec)}</span>
              <span className="text-[var(--color-text-tertiary)]">—</span>
              <span className="text-[var(--color-text-secondary)]">{t("cutter.end", "Bitiş:")}</span>
              <span className="font-bold text-[var(--color-accent)]">
                {formatTime(Math.min(duration, startSec + SAMPLE_DURATION))}
              </span>
            </div>

            {/* Precision Nudge Buttons */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[var(--color-text-tertiary)] mr-1">
                {t("cutter.fineTune", "İnce Ayar:")}
              </span>
              <button
                type="button"
                onClick={() => nudge(-1.0)}
                className="chip text-[10px] px-2 py-1 hover:border-[var(--color-accent)] cursor-pointer"
              >
                -1s
              </button>
              <button
                type="button"
                onClick={() => nudge(-0.1)}
                className="chip text-[10px] px-2 py-1 hover:border-[var(--color-accent)] cursor-pointer"
              >
                -0.1s
              </button>
              <button
                type="button"
                onClick={() => nudge(0.1)}
                className="chip text-[10px] px-2 py-1 hover:border-[var(--color-accent)] cursor-pointer"
              >
                +0.1s
              </button>
              <button
                type="button"
                onClick={() => nudge(1.0)}
                className="chip text-[10px] px-2 py-1 hover:border-[var(--color-accent)] cursor-pointer"
              >
                +1s
              </button>
            </div>
          </div>

          {/* Export Action Section */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={exporting !== null}
              onClick={() => handleExport("mp3")}
              className="btn btn-secondary w-full sm:w-auto text-xs px-5 py-2.5 gap-2 border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]"
            >
              {exporting === "mp3" ? (
                <span className="spinner" />
              ) : (
                <ScissorsIcon className="h-4 w-4 text-[var(--color-accent)]" />
              )}
              <span>{t("cutter.exportMp3", "8s MP3 Olarak Kaydet (320k)")}</span>
            </button>

            <button
              type="button"
              disabled={exporting !== null}
              onClick={() => handleExport("wav")}
              className="btn btn-primary w-full sm:w-auto text-xs px-6 py-2.5 gap-2 shadow-lg shadow-[var(--color-accent-soft)]"
            >
              {exporting === "wav" ? (
                <span className="spinner" />
              ) : (
                <SparklesIcon className="h-4 w-4 text-black" />
              )}
              <span>{t("cutter.exportWav", "8s WAV Olarak Kaydet (Lossless)")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
