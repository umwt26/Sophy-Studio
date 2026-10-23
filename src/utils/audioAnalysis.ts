import type { KeyBpmResult } from "../types";

// Pitch classes
const PITCH_CLASSES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Krumhansl-Kessler key profiles
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

// Camelot Wheel mappings
interface CamelotInfo {
  camelot: string;
  color: string;
  relative: string;
  compatibles: string[];
}

const CAMELOT_MAP: Record<string, CamelotInfo> = {
  // Major keys
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

  // Minor keys
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

/**
 * Pearson Correlation Coefficient
 */
function correlation(a: number[], b: number[]): number {
  const n = a.length;
  let sumA = 0;
  let sumB = 0;
  for (let i = 0; i < n; i++) {
    sumA += a[i];
    sumB += b[i];
  }
  const meanA = sumA / n;
  const meanB = sumB / n;

  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}

/**
 * Decodes audio and resamples to a mono 11025 Hz buffer.
 * Low-end PC friendly: minimal RAM footprint & lightning fast FFTs.
 */
async function getResampledMonoAudio(arrayBuffer: ArrayBuffer): Promise<{ data: Float32Array; sampleRate: number; duration: number }> {
  // Decode audio using standard Web Audio OfflineContext
  const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
  await tempCtx.close();

  const duration = audioBuffer.duration;
  const targetSampleRate = 11025;
  const targetLength = Math.floor(duration * targetSampleRate);

  // Render to downsampled mono
  const offlineCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  return {
    data: renderedBuffer.getChannelData(0),
    sampleRate: targetSampleRate,
    duration,
  };
}

/**
 * Detect BPM via onset envelope + autocorrelation
 */
function detectBpm(samples: Float32Array, sampleRate: number): number {
  // Step 1: Compute downsampled energy envelope (decimate by 8 ~ 1378 Hz)
  const decimation = 8;
  const envLen = Math.floor(samples.length / decimation);
  const envelope = new Float32Array(envLen);

  for (let i = 0; i < envLen; i++) {
    let sum = 0;
    const start = i * decimation;
    for (let j = 0; j < decimation; j++) {
      const val = samples[start + j];
      sum += val * val;
    }
    envelope[i] = Math.sqrt(sum / decimation);
  }

  // Step 2: First-order positive difference (spectral flux / onset strength)
  const onset = new Float32Array(envLen);
  for (let i = 1; i < envLen; i++) {
    const diff = envelope[i] - envelope[i - 1];
    onset[i] = diff > 0 ? diff : 0;
  }

  // Step 3: Autocorrelation for tempo range (65 to 185 BPM)
  const effectiveSampleRate = sampleRate / decimation;
  const minBpm = 65;
  const maxBpm = 185;
  const minLag = Math.floor((effectiveSampleRate * 60) / maxBpm);
  const maxLag = Math.floor((effectiveSampleRate * 60) / minBpm);

  // Take a representative slice (up to 40 seconds) to keep computation ultra-light
  const sliceLen = Math.min(onset.length, Math.floor(effectiveSampleRate * 40));
  const startIdx = Math.floor((onset.length - sliceLen) / 3);

  let bestLag = minLag;
  let maxCorr = -1;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    const count = sliceLen - lag;
    for (let i = 0; i < count; i += 2) {
      corr += onset[startIdx + i] * onset[startIdx + i + lag];
    }
    if (corr > maxCorr) {
      maxCorr = corr;
      bestLag = lag;
    }
  }

  let rawBpm = (effectiveSampleRate * 60) / bestLag;

  // Harmonically adjust if within standard club/electronic tempo
  if (rawBpm < 70) rawBpm *= 2;
  if (rawBpm > 175) rawBpm /= 2;

  return Math.round(rawBpm);
}

/**
 * Detect Musical Key via Chromagram & Krumhansl-Schmuckler algorithm
 */
function detectKey(samples: Float32Array, sampleRate: number): { key: string; camelot: string; color: string; relative: string; compatibles: string[] } {
  const fftSize = 4096;
  const hopSize = 2048;
  const chroma = new Float64Array(12);

  // Focus analysis on the core harmonic body of the track (avoiding long intros/outros)
  const totalFrames = Math.floor((samples.length - fftSize) / hopSize);
  const startFrame = Math.floor(totalFrames * 0.1);
  const endFrame = Math.min(totalFrames - 1, startFrame + 400); // Analyze up to ~75 seconds

  // Precompute Hanning window
  const window = new Float32Array(fftSize);
  for (let i = 0; i < fftSize; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
  }

  // Precompute bin to pitch mappings
  const binPitches = new Int8Array(fftSize / 2);
  const binWeights = new Float32Array(fftSize / 2);
  for (let bin = 1; bin < fftSize / 2; bin++) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq >= 55 && freq <= 2000) {
      // Within musical pitch range A1 to B6
      const midi = 69 + 12 * Math.log2(freq / 440);
      const pitchClass = ((Math.round(midi) % 12) + 12) % 12;
      binPitches[bin] = pitchClass;
      // High-pass weighting to balance bass and mid frequencies
      binWeights[bin] = Math.min(1.0, freq / 180);
    } else {
      binPitches[bin] = -1;
    }
  }

  // Real FFT using simple Cooley-Tukey or discrete Fourier bins of interest
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);

  for (let f = startFrame; f < endFrame; f += 2) {
    const offset = f * hopSize;
    for (let i = 0; i < fftSize; i++) {
      real[i] = samples[offset + i] * window[i];
      imag[i] = 0;
    }

    // Power spectrum estimation across musically active bins
    for (let bin = 1; bin < fftSize / 2; bin++) {
      const p = binPitches[bin];
      if (p >= 0) {
        // Direct DFT component calculation for target bin
        const angleStep = (2 * Math.PI * bin) / fftSize;
        let r = 0;
        let im = 0;
        for (let i = 0; i < fftSize; i += 4) {
          const a = angleStep * i;
          r += real[i] * Math.cos(a);
          im -= real[i] * Math.sin(a);
        }
        const mag = Math.sqrt(r * r + im * im) * binWeights[bin];
        chroma[p] += mag;
      }
    }
  }

  // Normalize chroma vector
  let maxChroma = 0;
  for (let i = 0; i < 12; i++) {
    if (chroma[i] > maxChroma) maxChroma = chroma[i];
  }
  if (maxChroma > 0) {
    for (let i = 0; i < 12; i++) {
      chroma[i] /= maxChroma;
    }
  }

  const chromaArray = Array.from(chroma);

  // Correlate with 24 Major & Minor profiles
  let bestScore = -999;
  let bestKeyName = "C Major";

  for (let root = 0; root < 12; root++) {
    // Major
    const majorProfileRotated = new Array(12);
    for (let i = 0; i < 12; i++) {
      majorProfileRotated[i] = MAJOR_PROFILE[(i - root + 12) % 12];
    }
    const majorScore = correlation(chromaArray, majorProfileRotated);
    if (majorScore > bestScore) {
      bestScore = majorScore;
      bestKeyName = `${PITCH_CLASSES[root]} Major`;
    }

    // Minor
    const minorProfileRotated = new Array(12);
    for (let i = 0; i < 12; i++) {
      minorProfileRotated[i] = MINOR_PROFILE[(i - root + 12) % 12];
    }
    const minorScore = correlation(chromaArray, minorProfileRotated);
    if (minorScore > bestScore) {
      bestScore = minorScore;
      bestKeyName = `${PITCH_CLASSES[root]} Minor`;
    }
  }

  const camelotInfo = CAMELOT_MAP[bestKeyName] || {
    camelot: "8B",
    color: "#f59e0b",
    relative: "A Minor (8A)",
    compatibles: ["8A", "7B", "9B"],
  };

  return {
    key: bestKeyName,
    camelot: camelotInfo.camelot,
    color: camelotInfo.color,
    relative: camelotInfo.relative,
    compatibles: camelotInfo.compatibles,
  };
}

/**
 * Main Tunebat-grade analysis entry point
 */
export async function analyzeAudio(arrayBuffer: ArrayBuffer): Promise<KeyBpmResult> {
  const { data, sampleRate, duration } = await getResampledMonoAudio(arrayBuffer);

  const bpm = detectBpm(data, sampleRate);
  const keyInfo = detectKey(data, sampleRate);

  return {
    bpm,
    key: keyInfo.key,
    camelot: keyInfo.camelot,
    camelotColor: keyInfo.color,
    relativeKey: keyInfo.relative,
    compatibleKeys: keyInfo.compatibles,
    duration,
  };
}
