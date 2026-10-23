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
    <div className="flex flex-col gap-4 animate-fade-in pb-8">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#202532] bg-[#11131a] px-4 py-3 shadow-md">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🎹</span>
            <span>{t("detector.title", "Key & BPM Detect")}</span>
          </h2>
          <p className="text-[11px] text-[#717789] mt-0.5">
            Tunebat standardında Krumhansl-Schmuckler müzikal ton ve tempo analizi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={analyzing}
          className="flex items-center gap-1.5 rounded-lg border border-[#252b3a] bg-[#161a24] px-3.5 py-2 text-xs font-semibold text-[#f59e0b] hover:border-[#f59e0b]/50 hover:bg-[#1f1d17] transition-all active:scale-95 disabled:opacity-50"
        >
          <span>📂</span>
          <span>{analyzing ? t("detector.analyzing", "Analiz Ediliyor...") : t("detector.selectFile", "Dosya Yükle")}</span>
        </button>
      </div>

      {/* Upload Drop Zone if no result */}
      {!result && !analyzing && (
        <div
          onClick={handleSelectFile}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[#202532] bg-[#11131a]/50 py-16 text-center transition-all hover:border-[#f59e0b]/40 hover:bg-[#11131a]"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1813] text-2xl text-[#f59e0b] border border-[#342918]">
            ⚡
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-white">
              {t("detector.dropPrompt", "Ses dosyasını buraya bırakın veya tıklayıp seçin")}
            </p>
            <p className="text-[11px] text-[#646a7e]">
              MP3, WAV, FLAC, M4A, OGG, AAC • Saniyeler içinde %100 çevrimdışı yerel analiz
            </p>
          </div>
        </div>
      )}

      {/* Loading animation */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#202532] bg-[#11131a] py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f59e0b] border-t-transparent" />
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-white">
              {t("detector.analyzingAudio", "Ses Analiz Ediliyor...")}
            </p>
            <p className="text-[11px] text-[#6e7488]">
              {fileName} • Krumhansl-Schmuckler 12-Chroma frekans analizi
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !analyzing && currentBpm && (
        <div className="flex flex-col gap-4 animate-scale-in">
          {/* File summary bar */}
          <div className="flex items-center justify-between rounded-xl border border-[#202532] bg-[#11131a] px-4 py-2.5">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#f59e0b]">🎵</span>
              <span className="text-xs font-bold text-white truncate max-w-sm">
                {fileName}
              </span>
              <span className="text-[11px] font-mono text-[#6e7488]">
                ({Math.floor(result.duration / 60)}:{String(Math.floor(result.duration % 60)).padStart(2, "0")})
              </span>
            </div>

            <button
              type="button"
              onClick={handleSelectFile}
              className="rounded-lg border border-[#202532] bg-[#161a24] px-3 py-1 text-xs font-semibold text-[#8a92a6] hover:text-white hover:border-[#f59e0b]/40 transition-colors"
            >
              {t("detector.newAnalysis", "Yeni Analiz")}
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Key Card */}
            <div className="flex flex-col justify-between rounded-xl border border-[#202532] bg-[#11131a] p-5 shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#63697c]">
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
                  <h3 className="text-3xl font-black tracking-tight text-white">
                    {result.key}
                  </h3>
                  <p className="text-xs text-[#7e8598]">
                    Göreceli: <strong className="text-white">{result.relativeKey}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#1d222e] pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#555b6c] mb-1.5">
                  Harmonik Uyumlu Tonlar (DJ Mixing):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.compatibleKeys.map((k) => (
                    <span
                      key={k}
                      className="rounded bg-[#161a24] border border-[#222736] px-2 py-0.5 text-[11px] font-mono font-bold text-[#a5acbe]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BPM Card */}
            <div className="flex flex-col justify-between rounded-xl border border-[#202532] bg-[#11131a] p-5 shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#63697c]">
                    {t("detector.tempoBpm", "Tempo (BPM)")}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5">
                    <span
                      className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"
                      style={{ animationDuration: `${60 / currentBpm}s` }}
                    />
                    <span className="text-[10px] font-mono font-bold text-amber-400">BEAT</span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    {currentBpm}
                  </span>
                  <span className="text-xs font-bold text-[#646a7e]">BPM</span>
                </div>
                <p className="text-[11px] text-[#717789] mt-1">
                  Otomatik ritim zarfı ve özilişki (autocorrelation) tespiti.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#1d222e] pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555b6c]">
                  Tempo Düzeltme:
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleHalfBpm}
                    className="rounded bg-[#161a24] border border-[#222736] px-2.5 py-1 text-xs font-bold text-[#a5acbe] hover:text-white hover:border-[#f59e0b]/40 transition-colors"
                  >
                    /2 Yarım
                  </button>
                  <button
                    type="button"
                    onClick={handleDoubleBpm}
                    className="rounded bg-[#161a24] border border-[#222736] px-2.5 py-1 text-xs font-bold text-[#a5acbe] hover:text-white hover:border-[#f59e0b]/40 transition-colors"
                  >
                    x2 Çift
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
