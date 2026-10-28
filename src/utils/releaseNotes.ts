// "What's new" comes straight from the GitHub release of the installed version, so the
// notes are written once (on GitHub) and never by hand in the app. Cached for offline use.
// Same file in the desktop and mobile apps.

const API = "https://api.github.com/repos/umwt26/Sophy-Studio/releases?per_page=20";
const CACHE_KEY = "sophy_release_notes";

export interface ReleaseNotes {
  /** "1.4.1" */
  version: string;
  body: string;
  /** ISO date the release was published */
  date: string;
  url: string;
}

const digits = (tag: string) => tag.replace(/^[^0-9]*/, "");

export function cachedReleaseNotes(): ReleaseNotes | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as ReleaseNotes) : null;
  } catch {
    return null;
  }
}

/**
 * Notes of the release that matches `currentVersion`; before that release exists on GitHub
 * (e.g. while testing a new build) the newest published release is shown instead.
 */
export async function fetchReleaseNotes(currentVersion: string): Promise<ReleaseNotes | null> {
  try {
    const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return cachedReleaseNotes();
    type Release = { tag_name?: string; body?: string; draft?: boolean; published_at?: string; html_url?: string };
    const list = ((await res.json()) as Release[]).filter((r) => !r.draft && r.body);
    const rel = list.find((r) => digits(r.tag_name ?? "") === currentVersion) ?? list[0];
    if (!rel) return cachedReleaseNotes();
    const notes: ReleaseNotes = { version: digits(rel.tag_name ?? ""), body: rel.body ?? "", date: rel.published_at ?? "", url: rel.html_url ?? "" };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(notes));
    } catch {
      // storage full / unavailable: fine, it is fetched again next time
    }
    return notes;
  } catch {
    return cachedReleaseNotes();
  }
}
