// Remembers the last update the app launched an installer for, so a failed
// install cannot loop forever (same installer re-run on every launch).

const ATTEMPT_KEY = "sophy.updateAttempt";

interface UpdateAttempt {
  target: string;
  from: string;
  at: number;
}

export function readUpdateAttempt(): UpdateAttempt | null {
  try {
    const raw = localStorage.getItem(ATTEMPT_KEY);
    return raw ? (JSON.parse(raw) as UpdateAttempt) : null;
  } catch {
    return null;
  }
}

export function clearUpdateAttempt() {
  try {
    localStorage.removeItem(ATTEMPT_KEY);
  } catch {
    /* ignore */
  }
}

export function recordUpdateAttempt(target: string, from: string) {
  try {
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify({ target, from, at: Date.now() }));
  } catch {
    /* ignore */
  }
}
