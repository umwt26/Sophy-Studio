import type { KeyBpmResult } from "../types";

// Pitch classes
const PITCH_CLASSES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// KeyFinder / Sha'ath Harmonic Profiles (Industry standard in DJ software & Tunebat)
const KEYFINDER_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const KEYFINDER_MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

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
 * Radix-2 Cooley-Tukey In-Place Fast Fourier Transform (O(N log N))
 */
function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  // Bit-reversal permutation
  let j = 0;
  for (let i = 0; i < n - 1; i++) {
    if (i < j) {
      const tempR = re[i]; re[i] = re[j]; re[j] = tempR;
      const tempI = im[i]; im[i] = im[j]; im[j] = tempI;
    }
    let k = n >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  // Butterfly computations
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (-2 * Math.PI) / len;
    const wStepR = Math.cos(angle);
    const wStepI = Math.sin(angle);

    for (let i = 0; i < n; i += len) {
      let wR = 1;
      let wI = 0;
      for (let k = 0; k < halfLen; k++) {
        const uR = re[i + k];
        const uI = im[i + k];
        const vR = re[i + k + halfLen] * wR - im[i + k + halfLen] * wI;
        const vI = re[i + k + halfLen] * wI + im[i + k + halfLen] * wR;

        re[i + k] = uR + vR;
        im[i + k] = uI + vI;
        re[i + k + halfLen] = uR - vR;
        im[i + k + halfLen] = uI - vI;

        const nextWR = wR * wStepR - wI * wStepI;
        const nextWI = wR * wStepI + wI * wStepR;
        wR = nextWR;
        wI = nextWI;
      }
    }
  }
}

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
 * Decodes audio and renders two distinct signals:
 * 1. Full mono harmonic track (11025 Hz)
 * 2. Low-pass filtered (140 Hz) kick/bass rhythm track (isolated for tempo detection)
 */
async function decodeAudioSignals(arrayBuffer: ArrayBuffer): Promise<{
  harmonicData: Float32Array;
  rhythmData: Float32Array;
  sampleRate: number;
  duration: number;
}> {
  const tempCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);
  await tempCtx.close();

  const duration = audioBuffer.duration;
  const targetSampleRate = 11025;
  const targetLength = Math.floor(duration * targetSampleRate);

  // 1. Render Full Harmonic Mono Track
  const harmCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const harmSource = harmCtx.createBufferSource();
  harmSource.buffer = audioBuffer;
  harmSource.connect(harmCtx.destination);
  harmSource.start(0);
  const renderedHarmBuffer = await harmCtx.startRendering();

  // 2. Render Low-Pass Filtered (140 Hz) Rhythm Track (isolates kicks & sub-bass, eliminates vocals/synths/hi-hats)
  const rhythmCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
  const rhythmSource = rhythmCtx.createBufferSource();
  rhythmSource.buffer = audioBuffer;

  const lowpassFilter = rhythmCtx.createBiquadFilter();
  lowpassFilter.type = "lowpass";
  lowpassFilter.frequency.value = 140; // 140Hz cutoff filters out everything except kick drum punch
  lowpassFilter.Q.value = 1.0;

  rhythmSource.connect(lowpassFilter);
  lowpassFilter.connect(rhythmCtx.destination);
  rhythmSource.start(0);
  const renderedRhythmBuffer = await rhythmCtx.startRendering();

  return {
    harmonicData: renderedHarmBuffer.getChannelData(0),
    rhythmData: renderedRhythmBuffer.getChannelData(0),
    sampleRate: targetSampleRate,
    duration,
  };
}

/**
 * Tunebat-grade precision BPM detection using kick-filtered onsets & autocorrelation
 */
function detectBpm(rhythmSamples: Float32Array, sampleRate: number): number {
  // Step 1: Compute smoothed energy envelope on the 140Hz kick track (hop size = 16 ~ 689 Hz)
  const hop = 16;
  const envLen = Math.floor(rhythmSamples.length / hop);
  const envelope = new Float32Array(envLen);
  const envRate = sampleRate / hop;

  for (let i = 0; i < envLen; i++) {
    let sum = 0;
    const start = i * hop;
    for (let j = 0; j < hop; j++) {
      const v = rhythmSamples[start + j];
      sum += v * v;
    }
    envelope[i] = Math.sqrt(sum / hop);
  }

  // Step 2: First-order difference (onset detection)
  const onsets = new Float32Array(envLen);
  for (let i = 1; i < envLen; i++) {
    const diff = envelope[i] - envelope[i - 1];
    onsets[i] = diff > 0 ? diff : 0;
  }

  // Step 3: Autocorrelation over musical tempo range (65 to 190 BPM)
  const minBpm = 65;
  const maxBpm = 190;
  const minLag = Math.floor((envRate * 60) / maxBpm);
  const maxLag = Math.floor((envRate * 60) / minBpm);

  // Take a representative active portion of the track (up to 45 seconds)
  const sliceLen = Math.min(onsets.length, Math.floor(envRate * 45));
  const startIdx = Math.floor((onsets.length - sliceLen) / 3);

  const bpmScores: { bpm: number; lag: number; score: number }[] = [];

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    const len = sliceLen - lag;
    for (let i = 0; i < len; i++) {
      corr += onsets[startIdx + i] * onsets[startIdx + i + lag];
    }
    const bpm = (envRate * 60) / lag;
    bpmScores.push({ bpm, lag, score: corr });
  }

  // Find peak correlation
  bpmScores.sort((a, b) => b.score - a.score);
  const topCandidate = bpmScores[0];
  let finalBpm = topCandidate ? topCandidate.bpm : 120;

  // Harmonically check for half-time / double-time ambiguity:
  // e.g. 70 BPM (half-time trap kick-snare) vs 140 BPM
  // If the detected peak is near 70, check if 140 has strong correlation:
  if (finalBpm >= 65 && finalBpm <= 85) {
    const doubleBpm = finalBpm * 2;
    const match = bpmScores.find((b) => Math.abs(b.bpm - doubleBpm) < 2);
    if (match && match.score > topCandidate.score * 0.45) {
      finalBpm = doubleBpm;
    }
  }

  return Math.round(finalBpm);
}

/**
 * Tunebat-grade Musical Key Detection:
 * Uses Radix-2 FFT + KeyFinder Profiles + Bass Tonic Reinforcement
 */
function detectKey(samples: Float32Array, sampleRate: number): {
  key: string;
  camelot: string;
  color: string;
  relative: string;
  compatibles: string[];
} {
  const fftSize = 4096;
  const hopSize = 2048;

  const fullChroma = new Float64Array(12);
  const bassChroma = new Float64Array(12);

  // Precompute Hanning window
  const window = new Float32Array(fftSize);
  for (let i = 0; i < fftSize; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
  }

  // Precompute bin to musical pitch parameters
  const binPitch = new Int8Array(fftSize / 2);
  const binWeight = new Float32Array(fftSize / 2);
  const isBassBin = new Uint8Array(fftSize / 2);

  for (let bin = 1; bin < fftSize / 2; bin++) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq >= 55 && freq <= 1800) {
      // 55 Hz (A1) to 1800 Hz (A6)
      const midi = 69 + 12 * Math.log2(freq / 440);
      const nearestNote = Math.round(midi);
      const pitchClass = ((nearestNote % 12) + 12) % 12;
      const deviation = Math.abs(midi - nearestNote);

      binPitch[bin] = pitchClass;
      // Gaussian semitone tuning weight (rejects non-harmonic noise between pitches)
      binWeight[bin] = Math.exp(-16 * deviation * deviation);
      // Bass register (55 Hz to 260 Hz) contains the fundamental roots of chords
      isBassBin[bin] = freq <= 260 ? 1 : 0;
    } else {
      binPitch[bin] = -1;
    }
  }

  const totalFrames = Math.floor((samples.length - fftSize) / hopSize);
  const startFrame = Math.floor(totalFrames * 0.1);
  const endFrame = Math.min(totalFrames - 1, startFrame + 180); // ~35 seconds of high-fidelity FFT

  const re = new Float32Array(fftSize);
  const im = new Float32Array(fftSize);

  for (let f = startFrame; f < endFrame; f++) {
    const offset = f * hopSize;
    for (let i = 0; i < fftSize; i++) {
      re[i] = samples[offset + i] * window[i];
      im[i] = 0;
    }

    // Run exact Radix-2 FFT
    fft(re, im);

    // Accumulate chromagram energies
    for (let bin = 1; bin < fftSize / 2; bin++) {
      const p = binPitch[bin];
      if (p >= 0) {
        const mag = Math.sqrt(re[bin] * re[bin] + im[bin] * im[bin]);
        const energy = mag * binWeight[bin];
        fullChroma[p] += energy;
        if (isBassBin[bin]) {
          bassChroma[p] += energy;
        }
      }
    }
  }

  // Normalize Full Chroma
  let maxFull = 0;
  let maxBass = 0;
  for (let i = 0; i < 12; i++) {
    if (fullChroma[i] > maxFull) maxFull = fullChroma[i];
    if (bassChroma[i] > maxBass) maxBass = bassChroma[i];
  }
  if (maxFull > 0) {
    for (let i = 0; i < 12; i++) fullChroma[i] /= maxFull;
  }
  if (maxBass > 0) {
    for (let i = 0; i < 12; i++) bassChroma[i] /= maxBass;
  }

  const chromaArray = Array.from(fullChroma);

  // Correlate against 24 KeyFinder profiles + Bass Tonic Reinforcement
  let bestScore = -999;
  let bestKeyName = "C Major";

  for (let root = 0; root < 12; root++) {
    // 1. Candidate Major Key
    const majProf = new Array(12);
    for (let i = 0; i < 12; i++) {
      majProf[i] = KEYFINDER_MAJOR[(i - root + 12) % 12];
    }
    let majScore = correlation(chromaArray, majProf);
    // Reinforce candidate key if its tonic root is prominent in the bass register
    majScore += bassChroma[root] * 0.28;

    if (majScore > bestScore) {
      bestScore = majScore;
      bestKeyName = `${PITCH_CLASSES[root]} Major`;
    }

    // 2. Candidate Minor Key
    const minProf = new Array(12);
    for (let i = 0; i < 12; i++) {
      minProf[i] = KEYFINDER_MINOR[(i - root + 12) % 12];
    }
    let minScore = correlation(chromaArray, minProf);
    // Reinforce candidate key if its tonic root is prominent in the bass register
    minScore += bassChroma[root] * 0.28;

    if (minScore > bestScore) {
      bestScore = minScore;
      bestKeyName = `${PITCH_CLASSES[root]} Minor`;
    }
  }

  const camelotInfo = CAMELOT_MAP[bestKeyName] || {
    camelot: "12A",
    color: "#9333ea",
    relative: "E Major (12B)",
    compatibles: ["12B", "11A", "1A"],
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
  const { harmonicData, rhythmData, sampleRate, duration } = await decodeAudioSignals(arrayBuffer);

  const bpm = detectBpm(rhythmData, sampleRate);
  const keyInfo = detectKey(harmonicData, sampleRate);

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
