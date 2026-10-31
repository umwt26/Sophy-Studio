import React, { useCallback, useEffect, useRef, useState } from "react";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { CloseIcon, ExpandIcon, ExternalLinkIcon, MusicalNoteIcon, PauseIcon, PlayIcon, RepeatIcon, SkipIcon, SophyIcon, VolumeIcon } from "./icons";
import { fileName } from "../utils/converter";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type Kind = "image" | "video" | "audio" | "pdf" | "text";

const clock = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return h ? `${h}:${m.toString().padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

/**
 * Pop-up viewer for any file in the converter: images, PDFs, text, and a player for video and
 * audio. Formats the web view can't play (MKV, AVI, WMA, TIFF …) are first turned into a
 * temporary playable copy by the backend (preview_prepare), with a progress bar.
 */
export const MediaPreview: React.FC<{ path: string; onClose: () => void }> = ({ path, onClose }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<{ src: string; kind: Kind } | null>(null);
  const [failed, setFailed] = useState(false);
  const [preparing, setPreparing] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    let off: (() => void) | undefined;
    listen<number>("preview-progress", (e) => alive && setPreparing(e.payload))
      .then((u) => (off = u))
      .catch(() => {});
    invoke<{ path: string; kind: Kind }>("preview_prepare", { path })
      .then((r) => alive && setFile({ src: convertFileSrc(r.path), kind: r.kind }))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      off?.();
    };
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm animate-fade-in" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-[18px] border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-2xl animate-scale-in">
        <div className="flex items-center gap-3 border-b border-[var(--color-app-border-soft)] px-4 py-3">
          <p className="min-w-0 flex-1 truncate text-[0.875rem] font-semibold text-[var(--color-text-primary)]" title={path}>
            {fileName(path)}
          </p>
          <button type="button" className="icon-btn shrink-0" title={t("preview.openDefault", "Open with default app")} onClick={() => void invoke("open_url", { url: path })}>
            <ExternalLinkIcon />
          </button>
          <button type="button" className="icon-btn shrink-0" onClick={onClose} aria-label={t("converter.close", "Close")}>
            <CloseIcon />
          </button>
        </div>

        {failed ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="text-[0.9375rem] font-semibold text-[var(--color-text-primary)]">{t("preview.unsupported", "This format can't be previewed here.")}</p>
            <p className="max-w-sm text-[0.8125rem] text-[var(--color-text-secondary)]">{t("preview.unsupportedHint", "You can still convert it, or open it with your default app.")}</p>
            <button type="button" className="btn btn-secondary mt-1" onClick={() => void invoke("open_url", { url: path })}>
              <ExternalLinkIcon className="h-4 w-4" />
              <span>{t("preview.openDefault", "Open with default app")}</span>
            </button>
          </div>
        ) : !file ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16">
            {preparing === null ? (
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-app-border)] border-t-[var(--color-accent)]" />
            ) : (
              <>
                <p className="text-[0.875rem] font-medium text-[var(--color-text-primary)]">{t("preview.preparing", "Preparing the preview…")}</p>
                <div className="seekbar w-64 !cursor-default">
                  <div className="seekbar-fill transition-[width] duration-300" style={{ width: `${Math.round(preparing * 100)}%` }} />
                  <SophyIcon className="seekbar-thumb transition-[left] duration-300" style={{ left: `${Math.round(preparing * 100)}%` }} />
                </div>
                <p className="font-mono text-[0.75rem] text-[var(--color-text-secondary)]">{Math.round(preparing * 100)}%</p>
              </>
            )}
          </div>
        ) : file.kind === "image" ? (
          <ImageView src={file.src} onError={() => setFailed(true)} />
        ) : file.kind === "pdf" ? (
          <iframe src={file.src} title={fileName(path)} className="h-[74vh] w-full border-0 bg-white" />
        ) : file.kind === "text" ? (
          <TextView src={file.src} onError={() => setFailed(true)} />
        ) : (
          <Player src={file.src} video={file.kind === "video"} name={fileName(path)} onError={() => setFailed(true)} />
        )}
      </div>
    </div>
  );
};

/** Text files (lyrics, subtitles, notes …): the first 1 MB, as typed. */
const TextView: React.FC<{ src: string; onError: () => void }> = ({ src, onError }) => {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    fetch(src)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => b.slice(0, 1_000_000).text())
      .then(setText)
      .catch(onError);
  }, [src, onError]);
  return (
    <pre className="max-h-[72vh] overflow-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[0.8125rem] leading-relaxed text-[var(--color-text-primary)]">{text ?? ""}</pre>
  );
};

const ImageView: React.FC<{ src: string; onError: () => void }> = ({ src, onError }) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState<[number, number] | null>(null);
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className={`checker min-h-0 flex-1 ${zoom ? "overflow-auto" : "flex items-center justify-center overflow-hidden"} p-4`} style={{ maxHeight: "72vh" }}>
        <img
          src={src}
          alt=""
          onError={onError}
          onLoad={(e) => setSize([e.currentTarget.naturalWidth, e.currentTarget.naturalHeight])}
          onClick={() => setZoom((z) => !z)}
          className={zoom ? "max-w-none cursor-zoom-out" : "max-h-[64vh] max-w-full cursor-zoom-in object-contain"}
        />
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-app-border-soft)] px-4 py-2.5 text-[0.75rem] text-[var(--color-text-secondary)]">
        <span className="font-mono">{size ? `${size[0]} × ${size[1]} px` : ""}</span>
        <span>{zoom ? t("preview.clickFit", "Click to fit") : t("preview.clickZoom", "Click for actual size")}</span>
      </div>
    </div>
  );
};

const Player: React.FC<{ src: string; video: boolean; name: string; onError: () => void }> = ({ src, video, name, onError }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);

  const el = () => ref.current;
  const toggle = useCallback(() => {
    const m = el();
    if (!m) return;
    if (m.paused) void m.play();
    else m.pause();
  }, []);
  const seek = useCallback((delta: number) => {
    const m = el();
    if (m) m.currentTime = Math.min(Math.max(0, m.currentTime + delta), m.duration || 0);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      setTime(el()?.currentTime ?? 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const m = el();
    if (!m) return;
    m.volume = volume;
    m.muted = muted;
    m.playbackRate = speed;
    m.loop = loop;
  }, [volume, muted, speed, loop]);

  // keyboard: space play/pause, ←/→ 5 s, ↑/↓ volume, M mute, F full screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" && e.key !== " ") return;
      if (e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") seek(5);
      else if (e.key === "ArrowLeft") seek(-5);
      else if (e.key === "ArrowUp") setVolume((v) => Math.min(1, v + 0.1));
      else if (e.key === "ArrowDown") setVolume((v) => Math.max(0, v - 0.1));
      else if (e.key.toLowerCase() === "m") setMuted((x) => !x);
      else if (e.key.toLowerCase() === "f" && video) void boxRef.current?.requestFullscreen?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, seek, video]);

  const media = {
    ref,
    src,
    // the analyser (spectrum) may read the samples: the asset protocol answers with CORS headers
    crossOrigin: "anonymous" as const,
    autoPlay: true,
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onTimeUpdate: () => setTime(el()?.currentTime ?? 0),
    onLoadedMetadata: () => setDuration(el()?.duration ?? 0),
    onError,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {video ? (
        <div ref={boxRef} className="flex min-h-0 flex-1 items-center justify-center bg-black" onClick={toggle} onDoubleClick={() => void boxRef.current?.requestFullscreen?.()}>
          <video {...media} className="max-h-[62vh] w-full" />
        </div>
      ) : (
        <div className="flex flex-col items-stretch gap-4 px-4 pt-5 pb-2 sm:flex-row sm:items-center">
          <div className="h-36 min-w-0 flex-1 overflow-hidden rounded-[16px] border border-[var(--color-app-border-soft)] bg-[var(--color-app-surface-2)] px-3 pt-3">
            <Spectrum media={ref} playing={playing} />
          </div>
          <div className="flex min-w-0 items-center gap-3 sm:w-64">
            <span className="icon-tile !h-12 !w-12 shrink-0 !rounded-[16px]">
              <MusicalNoteIcon className="!h-6 !w-6" />
            </span>
            <p className="min-w-0 break-words text-[0.9375rem] font-semibold leading-snug text-[var(--color-text-primary)]">{name}</p>
          </div>
          <audio {...media} />
        </div>
      )}

      <div className="flex flex-col gap-2.5 px-4 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-12 font-mono text-[0.7188rem] text-[var(--color-text-secondary)]">{clock(time)}</span>
          <SeekBar
            value={time}
            max={duration}
            label={t("preview.seek", "Position")}
            onSeek={(v) => {
              const m = el();
              if (m) m.currentTime = v;
              setTime(v);
            }}
          />
          <span className="w-12 text-right font-mono text-[0.7188rem] text-[var(--color-text-secondary)]">{clock(duration)}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button type="button" className="icon-btn" onClick={() => seek(-10)} title={t("preview.back10", "Back 10 s")}>
              <SkipIcon back />
            </button>
            <button type="button" className="btn btn-primary !h-10 !w-10 !rounded-full !p-0" onClick={toggle} aria-label={playing ? t("preview.pause", "Pause") : t("preview.play", "Play")}>
              {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </button>
            <button type="button" className="icon-btn" onClick={() => seek(10)} title={t("preview.forward10", "Forward 10 s")}>
              <SkipIcon />
            </button>
            <button type="button" className={`icon-btn ${loop ? "text-[var(--color-accent)]" : ""}`} onClick={() => setLoop((l) => !l)} title={t("preview.loop", "Loop")} aria-pressed={loop}>
              <RepeatIcon />
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-[var(--color-app-border-soft)] p-0.5">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`rounded-full px-2 py-0.5 font-mono text-[0.6875rem] transition-colors ${speed === s ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
                title={t("preview.speed", "Speed")}
              >
                {s}×
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="icon-btn" onClick={() => setMuted((m) => !m)} title={muted ? t("preview.unmute", "Unmute") : t("preview.mute", "Mute")}>
              <VolumeIcon muted={muted || volume === 0} />
            </button>
            <input
              type="range"
              className="media-range w-24"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setMuted(false);
              }}
              aria-label={t("preview.volume", "Volume")}
            />
            {video && (
              <button type="button" className="icon-btn" onClick={() => void boxRef.current?.requestFullscreen?.()} title={t("preview.fullscreen", "Full screen")}>
                <ExpandIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Position bar: a rounded track as tall as the Sophy mark, filled up to the playhead, with the
 * Sophy mark itself as the handle. Click or drag anywhere on it; ←/→ also work (window keys).
 */
const SeekBar: React.FC<{ value: number; max: number; label: string; onSeek: (v: number) => void }> = ({ value, max, label, onSeek }) => {
  const ref = useRef<HTMLDivElement>(null);
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const at = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || max <= 0) return;
    onSeek(Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * max);
  };
  return (
    <div
      ref={ref}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      className="seekbar flex-1"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        at(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) at(e.clientX);
      }}
    >
      <div className="seekbar-fill" style={{ width: `${pct}%` }} />
      <SophyIcon className="seekbar-thumb" style={{ left: `${pct}%` }} />
    </div>
  );
};

/**
 * Live sound spectrum of the playing audio (Web Audio analyser). The bars move only while it
 * plays: on pause the loop stops and the last frame stays where it was.
 */
const Spectrum: React.FC<{ media: React.RefObject<HTMLMediaElement | null>; playing: boolean }> = ({ media, playing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graph = useRef<{ ctx: AudioContext; analyser: AnalyserNode } | null>(null);

  // one audio graph per element (createMediaElementSource may only be called once)
  useEffect(() => {
    return () => {
      void graph.current?.ctx.close();
      graph.current = null;
    };
  }, []);

  useEffect(() => {
    const el = media.current;
    const canvas = canvasRef.current;
    if (!el || !canvas || !playing) return;
    if (!graph.current) {
      try {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.78;
        ctx.createMediaElementSource(el).connect(analyser);
        analyser.connect(ctx.destination);
        graph.current = { ctx, analyser };
      } catch {
        return;
      }
    }
    const { ctx, analyser } = graph.current;
    void ctx.resume();
    const data = new Uint8Array(analyser.frequencyBinCount);
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#5b9dff";
    let raf = 0;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const g = canvas.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      analyser.getByteFrequencyData(data);
      const bars = Math.max(16, Math.floor(w / 9));
      const gap = 3;
      const bw = (w - gap * (bars - 1)) / bars;
      // log-ish spread: low frequencies get more bars, like a studio analyser
      const usable = Math.floor(data.length * 0.72);
      g.fillStyle = accent;
      for (let i = 0; i < bars; i++) {
        const from = Math.floor(Math.pow(i / bars, 1.6) * usable);
        const to = Math.max(from + 1, Math.floor(Math.pow((i + 1) / bars, 1.6) * usable));
        let v = 0;
        for (let k = from; k < to; k++) v = Math.max(v, data[k]);
        const bh = Math.max(3, (v / 255) * (h - 4));
        const x = i * (bw + gap);
        g.globalAlpha = 0.45 + 0.55 * (v / 255);
        g.beginPath();
        g.roundRect(x, h - bh, bw, bh + 6, Math.min(4, bw / 2));
        g.fill();
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing, media]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
};
