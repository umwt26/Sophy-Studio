import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Convert Hex to HSV
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 200, s: 80, v: 95 };
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

const PRESET_SWATCHES = [
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#8b5cf6",
  "#ef4444",
  "#10b981",
  "#eab308",
  "#ec4899",
  "#f59e0b",
  "#06b6d4",
  "#14b8a6",
  "#84cc16",
  "#0284c7",
  "#059669",
  "#e11d48",
  "#d946ef",
];

export const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({
  color,
  onChange,
}) => {
  const { t } = useTranslation();
  const initialHsv = hexToHsv(color);
  const [hue, setHue] = useState(initialHsv.h);
  const [sat, setSat] = useState(initialHsv.s);
  const [val, setVal] = useState(initialHsv.v);
  const [hexInput, setHexInput] = useState(color.toUpperCase());
  const [alpha, setAlpha] = useState(100);

  const satValBoxRef = useRef<HTMLDivElement | null>(null);
  const hueSliderRef = useRef<HTMLDivElement | null>(null);
  const alphaSliderRef = useRef<HTMLDivElement | null>(null);

  // Sync when prop changes from outside
  useEffect(() => {
    const hsv = hexToHsv(color);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setHexInput(color.toUpperCase());
  }, [color]);

  // Update color from HSV
  const updateHsv = useCallback(
    (newH: number, newS: number, newV: number) => {
      setHue(newH);
      setSat(newS);
      setVal(newV);
      const rgb = hsvToRgb(newH, newS, newV);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHexInput(hex.toUpperCase());
      onChange(hex);
    },
    [onChange]
  );

  // 2D Saturation / Value Box drag handler
  const handleSatValMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!satValBoxRef.current) return;

    const updateFromMouse = (moveEv: MouseEvent | React.MouseEvent) => {
      if (!satValBoxRef.current) return;
      const rect = satValBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, moveEv.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, moveEv.clientY - rect.top));

      const newSat = Math.round((x / rect.width) * 100);
      const newVal = Math.round((1 - y / rect.height) * 100);
      updateHsv(hue, newSat, newVal);
    };

    updateFromMouse(e);

    const onMouseMove = (moveEv: MouseEvent) => {
      updateFromMouse(moveEv);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Hue Slider drag handler
  const handleHueMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hueSliderRef.current) return;

    const updateHue = (moveEv: MouseEvent | React.MouseEvent) => {
      if (!hueSliderRef.current) return;
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, moveEv.clientX - rect.left));
      const newHue = Math.round((x / rect.width) * 360) % 360;
      updateHsv(newHue, sat, val);
    };

    updateHue(e);

    const onMouseMove = (moveEv: MouseEvent) => {
      updateHue(moveEv);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Alpha Slider drag handler
  const handleAlphaMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!alphaSliderRef.current) return;

    const updateAlpha = (moveEv: MouseEvent | React.MouseEvent) => {
      if (!alphaSliderRef.current) return;
      const rect = alphaSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, moveEv.clientX - rect.left));
      const newAlpha = Math.round((x / rect.width) * 100);
      setAlpha(newAlpha);
    };

    updateAlpha(e);

    const onMouseMove = (moveEv: MouseEvent) => {
      updateAlpha(moveEv);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Hex Text input change
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const clean = raw.trim();
    if (/^#?[0-9A-Fa-f]{6}$/.test(clean)) {
      const formatted = clean.startsWith("#") ? clean : `#${clean}`;
      const hsv = hexToHsv(formatted);
      setHue(hsv.h);
      setSat(hsv.s);
      setVal(hsv.v);
      onChange(formatted);
    }
  };

  // Current pure Hue color for 2D background
  const currentHueHex = rgbToHex(
    hsvToRgb(hue, 100, 100).r,
    hsvToRgb(hue, 100, 100).g,
    hsvToRgb(hue, 100, 100).b
  );

  return (
    <div className="flex flex-col w-full max-w-sm rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 shadow-xl select-none">
      {/* 2D Saturation / Value Gradient Box */}
      <div
        ref={satValBoxRef}
        onMouseDown={handleSatValMouseDown}
        className="relative h-44 w-full cursor-crosshair rounded-xl overflow-hidden shadow-inner"
        style={{
          backgroundColor: currentHueHex,
          backgroundImage:
            "linear-gradient(to right, #ffffff, transparent), linear-gradient(to top, #000000, transparent)",
        }}
      >
        {/* Circular Pointer Ring */}
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.8)]"
          style={{
            left: `${sat}%`,
            top: `${100 - val}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Sliders Container */}
      <div className="mt-4 flex flex-col gap-3">
        {/* Rainbow Hue Slider */}
        <div className="flex items-center gap-2.5">
          <div
            ref={hueSliderRef}
            onMouseDown={handleHueMouseDown}
            className="relative h-3 flex-1 cursor-pointer rounded-full"
            style={{
              background:
                "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-app-surface)] shadow-md"
              style={{
                left: `${(hue / 360) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Opacity / Alpha Slider */}
        <div className="flex items-center gap-2.5">
          <div
            ref={alphaSliderRef}
            onMouseDown={handleAlphaMouseDown}
            className="relative h-3 flex-1 cursor-pointer rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(to right, transparent, ${color})`,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--color-app-surface)] shadow-md"
              style={{
                left: `${alpha}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Inputs / Format Row matching Image 3 */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
          <span>Hex</span>
        </div>

        <div className="flex-1 flex items-center justify-center rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-primary)]">
          <input
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            className="w-full text-center bg-transparent outline-none font-semibold uppercase tracking-wider"
            maxLength={7}
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
          <span>{alpha}%</span>
        </div>
      </div>

      {/* Last Colors / Swatches Header */}
      <div className="mt-4 border-t border-[var(--color-app-border)] pt-3">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-secondary)]">
            {t("settings.swatchesTitle", "Hazır & Son Renkler")}
          </span>
          <span
            className="h-3 w-3 rounded-full border border-white/20"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* 2-row color grid matching Image 3 */}
        <div className="grid grid-cols-8 gap-2">
          {PRESET_SWATCHES.map((swatch, idx) => {
            const isSelected = color.toLowerCase() === swatch.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const hsv = hexToHsv(swatch);
                  setHue(hsv.h);
                  setSat(hsv.s);
                  setVal(hsv.v);
                  setHexInput(swatch.toUpperCase());
                  onChange(swatch);
                }}
                className={`group relative h-6 w-full rounded-md transition-transform hover:scale-110 focus:outline-none ${
                  isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-[var(--color-app-surface)]" : ""
                }`}
                style={{ backgroundColor: swatch }}
                title={swatch}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
