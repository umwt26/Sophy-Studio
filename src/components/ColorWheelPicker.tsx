import React, { useState, useRef, useEffect, useCallback } from "react";
import { hexToRgb, rgbToHex } from "../utils/theme";

interface ColorWheelPickerProps {
  color: string;
  onChange: (hex: string) => void;
}

// Convert HSV (0-360, 0-100, 0-100) to RGB
function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const val = Math.max(0, Math.min(100, v)) / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Convert Hex to HSV
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 215, s: 65, v: 100 };
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);
  return { h, s, v };
}

/** Starts a pointer drag on `el` and reports the relative position (0..1) until release. */
function trackDrag(e: React.PointerEvent, el: HTMLElement | null, onMove: (x: number, y: number) => void) {
  if (!el) return;
  e.preventDefault();
  const report = (clientX: number, clientY: number) => {
    const rect = el.getBoundingClientRect();
    onMove(
      Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    );
  };
  report(e.clientX, e.clientY);
  const move = (ev: PointerEvent) => report(ev.clientX, ev.clientY);
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({ color, onChange }) => {
  const initial = hexToHsv(color);
  const [hue, setHue] = useState(initial.h);
  const [sat, setSat] = useState(initial.s);
  const [val, setVal] = useState(initial.v);
  const [hexInput, setHexInput] = useState(color.toUpperCase());

  const boxRef = useRef<HTMLDivElement | null>(null);
  const hueRef = useRef<HTMLDivElement | null>(null);

  // Sync when the colour changes from outside
  useEffect(() => {
    const hsv = hexToHsv(color);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setHexInput(color.toUpperCase());
  }, [color]);

  const commit = useCallback(
    (h: number, s: number, v: number) => {
      setHue(h);
      setSat(s);
      setVal(v);
      const rgb = hsvToRgb(h, s, v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHexInput(hex.toUpperCase());
      onChange(hex);
    },
    [onChange]
  );

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const clean = raw.trim();
    if (/^#?[0-9A-Fa-f]{6}$/.test(clean)) {
      onChange(clean.startsWith("#") ? clean : `#${clean}`);
    }
  };

  const pureHue = hsvToRgb(hue, 100, 100);
  const pureHueHex = rgbToHex(pureHue.r, pureHue.g, pureHue.b);

  return (
    <div className="flex flex-col xl:flex-row gap-4 items-stretch select-none">
      {/* Saturation / brightness area (colour pickers need a continuous field here) */}
      <div
        ref={boxRef}
        onPointerDown={(e) => trackDrag(e, boxRef.current, (x, y) => commit(hue, Math.round(x * 100), Math.round((1 - y) * 100)))}
        className="relative h-44 w-full xl:w-80 shrink-0 cursor-crosshair rounded-lg overflow-hidden border border-[var(--color-app-border)]"
        style={{
          backgroundColor: pureHueHex,
          backgroundImage: "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
        }}
      >
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: `${sat}%`, top: `${100 - val}%`, backgroundColor: color, boxShadow: "0 0 0 1px rgba(0,0,0,.4)" }}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 min-w-0">
        <div>
          <div
            ref={hueRef}
            onPointerDown={(e) => trackDrag(e, hueRef.current, (x) => commit(Math.round(x * 359), sat, val))}
            className="relative h-3 w-full cursor-pointer rounded-full"
            style={{
              background: "linear-gradient(to right, #f00, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00)",
            }}
          >
            <div
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{ left: `${(hue / 359) * 100}%`, backgroundColor: pureHueHex, boxShadow: "0 0 0 1px rgba(0,0,0,.4)" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-9 w-9 shrink-0 rounded-lg border border-[var(--color-app-border)]" style={{ backgroundColor: color }} />
          <label className="flex-1 min-w-0">
            <span className="field-label !mb-1">HEX</span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInput}
              maxLength={7}
              spellCheck={false}
              className="input h-9 font-mono uppercase tracking-wider"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
