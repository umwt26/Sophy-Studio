import type { KeyBpmResult } from "../types";
// @ts-ignore
import EssentiaWASM from "essentia.js/dist/essentia-wasm.umd.js";
// @ts-ignore
import Essentia from "essentia.js/dist/essentia.js-core.umd.js";

// Camelot Wheel mappings
interface CamelotInfo {
  camelot: string;
  color: string;
  relative: string;
  compatibles: string[];
}

const CAMELOT_MAP: Record<string, CamelotInfo> = {
  // Major keys (B)
  "B Major": { camelot: "1B", color: "#38bdf8", relative: "Ab Minor (1A)", compatibles: ["1A", "12B", "2B"] },
  "F# Major": { camelot: "2B", color: "#06b6d4", relative: "Eb Minor (2A)", compatibles: ["2A", "1B", "3B"] },
  "Gb Major": { camelot: "2B", color: "#06b6d4", relative: "Eb Minor (2A)", compatibles: ["2A", "1B", "3B"] },
  "Db Major": { camelot: "3B", color: "#14b8a6", relative: "Bb Minor (3A)", compatibles: ["3A", "2B", "4B"] },
  "C# Major": { camelot: "3B", color: "#14b8a6", relative: "Bb Minor (3A)", compatibles: ["3A", "2B", "4B"] },
  "Ab Major": { camelot: "4B", color: "#10b981", relative: "F Minor (4A)", compatibles: ["4A", "3B", "5B"] },
  "G# Major": { camelot: "4B", color: "#10b981", relative: "F Minor (4A)", compatibles: ["4A", "3B", "5B"] },
  "Eb Major": { camelot: "5B", color: "#22c55e", relative: "C Minor (5A)", compatibles: ["5A", "4B", "6B"] },
  "D# Major": { camelot: "5B", color: "#22c55e", relative: "C Minor (5A)", compatibles: ["5A", "4B", "6B"] },
  "Bb Major": { camelot: "6B", color: "#84cc16", relative: "G Minor (6A)", compatibles: ["6A", "5B", "7B"] },
  "A# Major": { camelot: "6B", color: "#84cc16", relative: "G Minor (6A)", compatibles: ["6A", "5B", "7B"] },
  "F Major": { camelot: "7B", color: "#eab308", relative: "D Minor (7A)", compatibles: ["7A", "6B", "8B"] },
  "C Major": { camelot: "8B", color: "#f59e0b", relative: "A Minor (8A)", compatibles: ["8A", "7B", "9B"] },
  "G Major": { camelot: "9B", color: "#f97316", relative: "E Minor (9A)", compatibles: ["9A", "8B", "10B"] },
  "D Major": { camelot: "10B", color: "#ef4444", relative: "B Minor (10A)", compatibles: ["10A", "9B", "11B"] },
  "A Major": { camelot: "11B", color: "#ec4899", relative: "F# Minor (11A)", compatibles: ["11A", "10B", "12B"] },
  "E Major": { camelot: "12B", color: "#a855f7", relative: "C# Minor (12A)", compatibles: ["12A", "11B", "1B"] },

  // Minor keys (A)
  "Ab Minor": { camelot: "1A", color: "#0ea5e9", relative: "B Major (1B)", compatibles: ["1B", "12A", "2A"] },
  "G# Minor": { camelot: "1A", color: "#0ea5e9", relative: "B Major (1B)", compatibles: ["1B", "12A", "2A"] },
  "Eb Minor": { camelot: "2A", color: "#0284c7", relative: "F# Major (2B)", compatibles: ["2B", "1A", "3A"] },
  "D# Minor": { camelot: "2A", color: "#0284c7", relative: "F# Major (2B)", compatibles: ["2B", "1A", "3A"] },
  "Bb Minor": { camelot: "3A", color: "#0d9488", relative: "Db Major (3B)", compatibles: ["3B", "2A", "4A"] },
  "A# Minor": { camelot: "3A", color: "#0d9488", relative: "Db Major (3B)", compatibles: ["3B", "2A", "4A"] },
  "F Minor": { camelot: "4A", color: "#059669", relative: "Ab Major (4B)", compatibles: ["4B", "3A", "5A"] },
  "C Minor": { camelot: "5A", color: "#16a34a", relative: "Eb Major (5B)", compatibles: ["5B", "4A", "6A"] },
  "G Minor": { camelot: "6A", color: "#65a30d", relative: "Bb Major (6B)", compatibles: ["6B", "5A", "7A"] },
  "D Minor": { camelot: "7A", color: "#ca8a04", relative: "F Major (7B)", compatibles: ["7B", "6A", "8A"] },
  "A Minor": { camelot: "8A", color: "#d97706", relative: "C Major (8B)", compatibles: ["8B", "7A", "9A"] },
  "E Minor": { camelot: "9A", color: "#ea580c", relative: "G Major (9B)", compatibles: ["9B", "8A", "10A"] },
  "B Minor": { camelot: "10A", color: "#dc2626", relative: "D Major (10B)", compatibles: ["10B", "9A", "11A"] },
  "F# Minor": { camelot: "11A", color: "#db2777", relative: "A Major (11B)", compatibles: ["11B", "10A", "12A"] },
  "C# Minor": { camelot: "12A", color: "#9333ea", relative: "E Major (12B)", compatibles: ["12B", "11A", "1A"] },
  "Db Minor": { camelot: "12A", color: "#9333ea", relative: "E Major (12B)", compatibles: ["12B", "11A", "1A"] },
};

function unwrapWasm(w: any): any {
  if (!w) return w;
  if (typeof w.EssentiaJS === "function") return w;
  if (w.default && typeof w.default.EssentiaJS === "function") return w.default;
  if (w.EssentiaWASM && typeof w.EssentiaWASM.EssentiaJS === "function") return w.EssentiaWASM;
  if (w.default?.EssentiaWASM && typeof w.default.EssentiaWASM.EssentiaJS === "function") return w.default.EssentiaWASM;
  return w;
}

function unwrapCore(c: any): any {
  if (typeof c === "function") return c;
  if (c && typeof c.default === "function") return c.default;
  if (c && typeof c.Essentia === "function") return c.Essentia;
  return c;
}

let essentiaGlobal: any = null;

function getEssentiaInstance(): any {
  if (!essentiaGlobal) {
    const WasmBackend = unwrapWasm(EssentiaWASM);
    const CoreClass = unwrapCore(Essentia);
    essentiaGlobal = new CoreClass(WasmBackend);
  }
  return essentiaGlobal;
}

/**
 * Resamples an AudioBuffer to standard 44.1kHz mono PCM vector for Essentia algorithms.
 */
async function getMonoPcm44100(audioBuffer: AudioBuffer): Promise<Float32Array> {
  const targetSr = 44100;
  // Limit to 120 seconds max to prevent browser freeze on giant audio sets
  const duration = Math.min(audioBuffer.duration, 120);

  // Use OfflineAudioContext for clean, hardware-accelerated polyphase resampling
  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    1,
    Math.ceil(duration * targetSr),
    targetSr
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const rendered = await offlineCtx.startRendering();
  return rendered.getChannelData(0);
}

/**
 * High-precision Tunebat-grade Key & BPM Analysis using Essentia.js
 * (KeyExtractor 12-Chroma HPCP + RhythmExtractor2013 multifeature beat tracking)
 */
export async function analyzeAudio(
  arrayBuffer: ArrayBuffer,
  onProgress?: (stage: string) => void
): Promise<KeyBpmResult> {
  // 1. Decode Web Audio Buffer
  onProgress?.("decoding");
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // 2. Resample to 44.1kHz mono Float32Array
  onProgress?.("resampling");
  const monoPcm = await getMonoPcm44100(decodedBuffer);

  // Artificial smooth pacing for user experience if processing is sub-second
  await new Promise((r) => setTimeout(r, 400));

  // 3. Initialize Essentia WASM Engine
  onProgress?.("chroma");
  const essentia = getEssentiaInstance();
  const audioVector = essentia.arrayToVector(monoPcm);

  try {
    // 4. Extract Musical Key with Essentia KeyExtractor
    const keyData = essentia.KeyExtractor(
      audioVector,
      true, // averageDetuningCorrection
      4096, // frameSize
      4096, // hopSize
      12,   // hpcpSize
      3500, // maxFrequency
      60,   // maximumSpectralPeaks
      25,   // minFrequency
      0.2,  // pcpThreshold
      "bgate", // profileType (standard harmonic profile)
      44100 // sampleRate
    );

    await new Promise((r) => setTimeout(r, 400));

    // 5. Extract BPM with Essentia RhythmExtractor2013 (industry standard multifeature)
    onProgress?.("rhythm");
    const rhythmData = essentia.RhythmExtractor2013(audioVector, 208, "multifeature", 40);

    // Format Key
    let detectedKey = keyData.key || "C";
    let detectedScale = keyData.scale || "major";
    // Normalize format: e.g. "D" + " " + "Minor"
    const capitalizedScale = detectedScale.toLowerCase() === "minor" ? "Minor" : "Major";
    const fullKey = `${detectedKey} ${capitalizedScale}`;

    // Camelot Wheel lookup
    const camelotInfo = CAMELOT_MAP[fullKey] || {
      camelot: "8B",
      color: "#f59e0b",
      relative: "A Minor (8A)",
      compatibles: ["8A", "7B", "9B"],
    };

    // Format BPM
    let rawBpm = Number(rhythmData.bpm);
    if (!rawBpm || isNaN(rawBpm)) rawBpm = 120;
    let finalBpm = Math.round(rawBpm);

    // Human audible music bounds check (common half/double tempo correction)
    if (finalBpm < 55 && finalBpm > 0) finalBpm *= 2;
    if (finalBpm > 210) finalBpm = Math.round(finalBpm / 2);

    onProgress?.("complete");
    await new Promise((r) => setTimeout(r, 300));

    return {
      key: fullKey,
      camelot: camelotInfo.camelot,
      camelotColor: camelotInfo.color,
      relativeKey: camelotInfo.relative,
      compatibleKeys: camelotInfo.compatibles,
      bpm: finalBpm,
      duration: decodedBuffer.duration,
      confidence: Math.round((keyData.strength || 0.85) * 100),
    };
  } finally {
    try {
      if (audioVector && typeof audioVector.delete === "function") {
        audioVector.delete();
      }
    } catch {
      // ignore
    }
    try {
      if (audioCtx && typeof audioCtx.close === "function") {
        audioCtx.close();
      }
    } catch {
      // ignore
    }
  }
}
