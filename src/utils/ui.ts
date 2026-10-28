const GLASS_KEY = "sophy_ui_glass";

/** Liquid-glass style for the bottom bar and sheets; off = flat surfaces. On by default. */
export function loadGlass(): boolean {
  try {
    return localStorage.getItem(GLASS_KEY) !== "0";
  } catch {
    return true;
  }
}

export function saveGlass(on: boolean): void {
  try {
    localStorage.setItem(GLASS_KEY, on ? "1" : "0");
  } catch {
    // ignore
  }
  applyGlass(on);
}

export function applyGlass(on: boolean): void {
  document.documentElement.classList.toggle("glass", on);
}
