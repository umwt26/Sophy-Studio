// Suno Style Prompter: rule-based, offline, zero-load prompt builder.
// Never writes lyrics: lyrics_structure only contains section tags, performance
// directives and (localized) placeholders for the user's own words.

import {
  LEXICON,
  PLACEHOLDERS,
  SECTIONS,
  VERBS,
  type Category,
  type Family,
  type LexEntry,
  type SectionKind,
} from "./lexicon";

export const STYLE_LIMIT = 1000;
export const STRUCTURE_LIMIT = 5000;

export interface PromptOutput {
  style_prompt: string;
  lyrics_structure: string;
}

interface Tag {
  id: string;
  cat: Category;
  /** -1 = less, 0 = normal, 1 = more */
  level: number;
  /** added as a genre default, not by the user: replaced when the genre changes */
  auto?: boolean;
}

interface Section {
  kind: SectionKind;
  index?: number;
  directives: string[];
}

export interface PrompterState {
  tags: Tag[];
  bpm?: number;
  key?: string;
  sections: Section[];
  /** sections were explicitly given by the user (don't regenerate from genre) */
  customSections: boolean;
  /** bpm came from the genre default, not from the user */
  bpmAuto?: boolean;
}

export interface ApplyResult {
  state: PrompterState;
  output: PromptOutput;
  /** false when nothing musical was recognised in the input */
  understood: boolean;
}

export const emptyState = (): PrompterState => ({ tags: [], sections: [], customSections: false });

// ---------------------------------------------------------------- normalize / match

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ё/g, "е")
    .replace(/[’'`]/g, "'")
    .replace(/\s+/g, " ");
}

const LATIN = /[a-z0-9]/;

interface Compiled {
  re: RegExp;
}

const cache = new Map<string, Compiled>();

function compile(pattern: string): Compiled {
  const hit = cache.get(pattern);
  if (hit) return hit;
  const p = normalize(pattern);
  const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const latinStart = LATIN.test(p[0] ?? "");
  const latinEnd = LATIN.test(p[p.length - 1] ?? "");
  // Short Latin patterns need a right boundary ("pop" must not match "popular");
  // longer ones may carry suffixes (Turkish "saksafonu", "girişe").
  const left = latinStart ? "(?<![a-z0-9])" : "";
  // Common Turkish case/plural suffixes are allowed on short words too ("basları", "saza", "pianoyu").
  const right = latinEnd && p.length < 5 ? "(?:lari|leri|lar|ler|ini|ina|ine|yi|yu|ya|ye|nin|nun|i|u|a|e)?(?![a-z0-9])" : "";
  const c = { re: new RegExp(left + esc + right, "g") };
  cache.set(pattern, c);
  return c;
}

interface Hit<T> {
  item: T;
  pos: number;
  end: number;
}

function findAll<T extends { patterns: string[] }>(text: string, items: T[]): Hit<T>[] {
  const hits: Hit<T>[] = [];
  for (const item of items) {
    for (const pat of item.patterns) {
      const { re } = compile(pat);
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        hits.push({ item, pos: m.index, end: m.index + m[0].length });
        if (m[0].length === 0) re.lastIndex++;
      }
    }
  }
  // Longest match wins on overlaps ("melodic trap" over "trap", "sub bass" over "bass").
  hits.sort((a, b) => a.pos - b.pos || b.end - b.pos - (a.end - a.pos));
  const kept: Hit<T>[] = [];
  let lastEnd = -1;
  for (const h of hits) {
    if (h.pos < lastEnd) continue;
    kept.push(h);
    lastEnd = h.end;
  }
  return kept;
}

function hasAny(text: string, words: readonly string[]): number {
  let best = -1;
  for (const w of words) {
    const n = normalize(w);
    const latin = LATIN.test(n[0] ?? "");
    let from = 0;
    while (true) {
      const idx = text.indexOf(n, from);
      if (idx < 0) break;
      // Latin verbs must start a word ("kis" in "sarkisi" is not "kıs")
      if (!latin || idx === 0 || !LATIN.test(text[idx - 1])) {
        if (best < 0 || idx < best) best = idx;
        break;
      }
      from = idx + 1;
    }
  }
  return best;
}

/** Words that explicitly ask to COMBINE genres; anything else replaces the genre. */
const GENRE_ADD = ["add", "ekle", "mix", "karistir", "fusion", "fuzyon", "blend", "hinzu", "mische", "ajoute", "melange", "agrega", "anade", "mezcla", "adicione", "misture", "добав", "смеш", "追加", "混ぜ"];

// ---------------------------------------------------------------- defaults per family

const FAMILY_INSTRUMENTS: Record<Family, string[]> = {
  rap: ["808", "hihat", "snare"],
  pop: ["synth", "drums", "bass"],
  edm: ["synth", "kick", "sub-bass"],
  rock: ["electric-guitar", "bass", "drums"],
  ballad: ["piano", "strings"],
  folk: ["acoustic-guitar", "drums"],
  lofi: ["rhodes", "vinyl", "drums"],
  jazz: ["piano", "bass", "drums"],
  latin: ["drums", "bass", "guitar"],
  cinematic: ["strings", "choir", "piano"],
};

const GENRE_INSTRUMENTS: Record<string, string[]> = {
  "uk-drill": ["808", "sub-bass", "hihat"],
  "ny-drill": ["808", "sub-bass", "hihat"],
  drill: ["808", "sub-bass", "hihat"],
  phonk: ["808", "cowbell", "vocal-chops"],
  "boom-bap": ["drums", "piano", "vinyl"],
  arabesque: ["strings", "kanun", "darbuka"],
  "turkish-folk": ["baglama", "darbuka"],
  "anatolian-rock": ["baglama", "electric-guitar", "organ"],
  synthwave: ["synth", "drums", "bass"],
  "bossa-nova": ["acoustic-guitar", "drums"],
  flamenco: ["acoustic-guitar", "claps"],
  reggaeton: ["drums", "808", "synth"],
  enka: ["strings", "acoustic-guitar"],
};

const FAMILY_RHYTHM: Partial<Record<Family, string>> = {
  rap: "syncopated",
  edm: "four-on-floor",
  lofi: "slow",
};

type Plan = Array<SectionKind | [SectionKind, number]>;

const FAMILY_STRUCTURE: Record<Family, Plan> = {
  rap: ["intro", "hook", ["verse", 1], "hook", ["verse", 2], "bridge", "hook", "outro"],
  pop: ["intro", ["verse", 1], "pre-chorus", "chorus", ["verse", 2], "pre-chorus", "chorus", "bridge", "chorus", "outro"],
  edm: ["intro", "build-up", "drop", "breakdown", "build-up", "drop", "outro"],
  rock: ["intro", ["verse", 1], "chorus", ["verse", 2], "chorus", "solo", "chorus", "outro"],
  ballad: ["intro", ["verse", 1], "chorus", ["verse", 2], "chorus", "bridge", "chorus", "outro"],
  folk: ["intro", ["verse", 1], "chorus", ["verse", 2], "chorus", "interlude", "chorus", "outro"],
  lofi: ["intro", ["verse", 1], "hook", "interlude", ["verse", 2], "hook", "outro"],
  jazz: ["intro", ["verse", 1], "chorus", "solo", ["verse", 2], "chorus", "outro"],
  latin: ["intro", ["verse", 1], "pre-chorus", "chorus", ["verse", 2], "chorus", "bridge", "chorus", "outro"],
  cinematic: ["intro", "build-up", "interlude", "build-up", "outro"],
};

const DIRECTIVES: Record<SectionKind, Partial<Record<Family | "default", string>>> = {
  intro: { default: "Atmospheric, Filtered Beat", rap: "Layered Atmospheric Synths, Filtered Distant 808", edm: "Filtered Synths, Rising Energy", rock: "Guitar Riff Intro", ballad: "Soft Piano Intro", cinematic: "Slow Atmospheric Swell", lofi: "Vinyl Crackle, Mellow Keys" },
  verse: { default: "Steady Groove, Clear Delivery", rap: "Fast Delivery, Punchy Cadence", ballad: "Intimate, Soft Delivery", rock: "Driving Rhythm", lofi: "Laid-Back Flow" },
  "pre-chorus": { default: "Building Tension, Rising Melody" },
  hook: { default: "High Energy, Melodic Flow", lofi: "Catchy, Relaxed" },
  chorus: { default: "Full Instrumentation, Layered Harmonies", ballad: "Emotional Peak, Layered Harmonies", rock: "Anthemic, Full Band" },
  bridge: { default: "Minimal Instrumentation, Slow Atmospheric Build" },
  drop: { default: "Aggressive Sliding Sub-Bass, Full Energy" },
  "build-up": { default: "Rising Riser, Snare Roll" },
  "beat-switch": { default: "Aggressive Sliding Sub-Bass, New Rhythm" },
  breakdown: { default: "Stripped Back, Atmospheric" },
  solo: { default: "Emotional, Soaring Melody" },
  interlude: { default: "Instrumental Break, Ambient Texture" },
  outro: { default: "Gradual Fadeout, Reverb Tail" },
};

const SECTION_LABEL: Record<SectionKind, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.kind, s.label])
) as Record<SectionKind, string>;
const SECTION_VOCAL: Record<SectionKind, boolean> = Object.fromEntries(
  SECTIONS.map((s) => [s.kind, s.vocal])
) as Record<SectionKind, boolean>;

const byId = new Map(LEXICON.map((e) => [e.id, e]));

/** "less bass" also means less 808 / sub-bass; "more drums" also means more kick/snare/hats. */
const GROUPS: Record<string, string[]> = {
  bass: ["808", "sub-bass", "bass"],
  drums: ["drums", "kick", "snare", "hihat", "claps"],
  guitar: ["guitar", "acoustic-guitar", "electric-guitar"],
  synth: ["synth", "pad", "pluck"],
  strings: ["strings", "violin", "cello"],
};

// ---------------------------------------------------------------- core

function primaryFamily(state: PrompterState): Family {
  const genre = state.tags.find((t) => t.cat === "genre");
  return (genre && byId.get(genre.id)?.family) || "pop";
}

function isInstrumental(state: PrompterState) {
  return state.tags.some((t) => t.id === "instrumental");
}

function upsert(state: PrompterState, id: string, cat: Category, level = 0, auto = false) {
  const existing = state.tags.find((t) => t.id === id);
  if (existing) {
    existing.level = level || existing.level;
    if (!auto) existing.auto = false;
  } else state.tags.push({ id, cat, level, auto });
}

/** Genre defaults: instruments, rhythm, production, BPM. Only fills what the user didn't set. */
function applyGenreDefaults(state: PrompterState) {
  if (!state.tags.some((t) => t.cat === "genre")) upsert(state, "pop", "genre", 0, true);
  const fam = primaryFamily(state);
  const g = state.tags.find((t) => t.cat === "genre")!;
  if (!state.tags.some((t) => t.cat === "instrument")) {
    for (const id of GENRE_INSTRUMENTS[g.id] ?? FAMILY_INSTRUMENTS[fam]) if (byId.has(id)) upsert(state, id, "instrument", 0, true);
  }
  const rhythm = FAMILY_RHYTHM[fam];
  if (rhythm && !state.tags.some((t) => t.cat === "rhythm")) upsert(state, rhythm, "rhythm", 0, true);
  if (!state.bpm || state.bpmAuto) {
    state.bpm = byId.get(g.id)?.bpm;
    state.bpmAuto = true;
  }
  if (!state.tags.some((t) => t.cat === "production")) upsert(state, fam === "lofi" ? "lofi-grit" : "spacious", "production", 0, true);
}

function buildSections(state: PrompterState) {
  const fam = primaryFamily(state);
  const plan = FAMILY_STRUCTURE[fam];
  state.sections = plan.map((p) => {
    const [kind, index] = Array.isArray(p) ? p : [p, undefined];
    return { kind, index, directives: [] };
  });
}

function parseBpm(text: string): number | undefined {
  const m =
    text.match(/(\d{2,3})\s*(?:bpm|b\.p\.m|vurus|tempo|темп|уд)/) ||
    text.match(/(?:bpm|tempo|темп|テンポ)\s*[:=]?\s*(\d{2,3})/);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return n >= 40 && n <= 220 ? n : undefined;
}

const MINOR = ["minor", "minor", "minor", "moll", "mineur", "menor", "минор", "マイナー", "短調"];
const MAJOR = ["major", "major", "dur", "majeur", "mayor", "maior", "мажор", "メジャー", "長調"];

const SOLFEGE: Record<string, string> = { do: "c", re: "d", mi: "e", fa: "f", sol: "g", la: "a", si: "b" };

function parseKey(text: string): string | undefined {
  // "Do menor", "La minör", "Ré mineur" -> letter names
  text = text.replace(/(?<![a-z])(do|re|mi|fa|sol|la|si)(?=\s*(#|b|diyez|bemol|sharp|flat)?\s*(minor|minor|major|majeur|mineur|menor|mayor|maior|moll|dur|minor|major))/g, (_m, s: string) => SOLFEGE[s]);
  text = text.replace(/minör/g, "minor").replace(/majör/g, "major").replace(/minor/g, "minor");
  const m = text.match(/(?<![a-z])([a-g])\s*(#|b|sharp|diyez|bemol|flat)?\s*(minor|moll|mineur|menor|минор|major|dur|majeur|mayor|maior|мажор)/);
  if (!m) return undefined;
  const note = m[1].toUpperCase();
  const acc = m[2] ? (["#", "sharp", "diyez"].includes(m[2]) ? "#" : "b") : "";
  const mode = MINOR.some((w) => m[3].startsWith(normalize(w))) ? "Minor" : MAJOR.some((w) => m[3].startsWith(normalize(w))) ? "Major" : "";
  return mode ? `${note}${acc} ${mode} Key` : undefined;
}

function parseCount(text: string, sectionPos: number): number | undefined {
  // "2 verse", "iki verse", "3 куплета"
  const before = text.slice(Math.max(0, sectionPos - 8), sectionPos);
  const words: Record<string, number> = { iki: 2, uc: 3, dort: 4, two: 2, three: 3, four: 4, zwei: 2, drei: 3, deux: 2, trois: 3, dos: 2, tres: 3, dois: 2, два: 2, три: 3 };
  const d = before.match(/(\d)\s*$/);
  if (d) return Math.min(6, parseInt(d[1], 10));
  for (const [w, n] of Object.entries(words)) if (before.trimEnd().endsWith(w)) return n;
  return undefined;
}

type Op = "add" | "remove" | "less" | "more";

/** Decide the edit operation for an entity at `pos` from the nearest verb in the same clause. */
function opFor(text: string, pos: number, end: number): Op {
  const clauseStart = Math.max(text.lastIndexOf(",", pos), text.lastIndexOf(".", pos), text.lastIndexOf(" ve ", pos), text.lastIndexOf(" and ", pos), 0);
  const nextBreak = [",", ".", " ve ", " and ", " und ", " et ", " y ", " e ", " и "]
    .map((s) => text.indexOf(s, end))
    .filter((n) => n >= 0);
  const clauseEnd = nextBreak.length ? Math.min(...nextBreak) : text.length;
  const clause = text.slice(clauseStart, clauseEnd);
  if (hasAny(clause, VERBS.remove) >= 0) return "remove";
  if (hasAny(clause, VERBS.less) >= 0) return "less";
  if (hasAny(clause, VERBS.more) >= 0) return "more";
  return "add";
}

export function applyInput(prev: PrompterState, input: string, lang = "en"): ApplyResult {
  const state: PrompterState = JSON.parse(JSON.stringify(prev));
  const text = normalize(input);
  const isFirst = state.tags.length === 0 && state.sections.length === 0;
  let understood = false;

  // --- tempo / key
  const bpm = parseBpm(text);
  if (bpm) { state.bpm = bpm; state.bpmAuto = false; understood = true; }
  const key = parseKey(text);
  if (key) { state.key = key; understood = true; }

  // --- lexicon entities
  const hits = findAll(text, LEXICON);
  const sectionHits = findAll(text, SECTIONS);
  const newGenres = hits.filter((h) => h.item.cat === "genre" && opFor(text, h.pos, h.end) === "add");

  // A new genre replaces the old one(s) ("trap olsun", "make it drill") unless the user
  // explicitly asks to combine them. Auto-added genre defaults are always replaced.
  if (newGenres.length && !isFirst) {
    const combine = hasAny(text, GENRE_ADD) >= 0;
    state.tags = state.tags.filter((t) => !(t.cat === "genre" && (t.auto || !combine)) && !(t.auto && t.cat !== "genre"));
  }

  const sectionTargets = new Set<SectionKind>();
  for (const h of hits) {
    const e: LexEntry = h.item;
    const op = opFor(text, h.pos, h.end);
    understood = true;
    if (op === "remove") {
      state.tags = state.tags.filter((t) => t.id !== e.id);
      for (const s of state.sections) s.directives = s.directives.filter((d) => d !== e.label && d !== e.up && d !== e.down);
      continue;
    }
    const level = e.cat === "instrument" ? (op === "more" ? 1 : op === "less" ? -1 : 0) : 0;
    const group = GROUPS[e.id];
    if (group && (op === "less" || op === "more")) {
      const present = state.tags.filter((t) => group.includes(t.id));
      if (present.length) {
        for (const t of present) t.level = level;
        continue;
      }
    }

    upsert(state, e.id, e.cat, level);
    if (e.cat === "instrument" && (op === "less" || op === "more")) {
      const t = state.tags.find((x) => x.id === e.id);
      if (t) t.level = level;
    }

    // "girişe saksafon ekle" / "add a guitar solo": exactly one section named -> target it.
    if (e.cat === "instrument" && op === "add" && sectionHits.length === 1 && !isFirst) {
      const kind = sectionHits[0].item.kind;
      sectionTargets.add(kind);
      let targets = state.sections.filter((x) => x.kind === kind);
      if (!targets.length) {
        const sec: Section = { kind, directives: [] };
        const outroAt = state.sections.findIndex((x) => x.kind === "outro");
        if (outroAt >= 0) state.sections.splice(outroAt, 0, sec);
        else state.sections.push(sec);
        targets = [sec];
        state.customSections = true;
      }
      for (const sec of targets) if (!sec.directives.includes(e.label)) sec.directives.push(e.label);
    }
  }

  // --- explicit structure: 2+ distinct sections named in order (and not just a targeted edit)
  const structureHits = sectionHits.filter((h) => !sectionTargets.has(h.item.kind));
  if (structureHits.length >= 2) {
    understood = true;
    const sections: Section[] = [];
    let verseNo = 0;
    for (const h of structureHits) {
      const count = h.item.kind === "verse" ? parseCount(text, h.pos) ?? 1 : 1;
      for (let n = 0; n < count; n++) {
        if (h.item.kind === "verse") sections.push({ kind: "verse", index: ++verseNo, directives: [] });
        else sections.push({ kind: h.item.kind, directives: [] });
      }
    }
    state.sections = sections;
    state.customSections = true;
  } else if (structureHits.length === 1 && !isFirst) {
    // single section mentioned: add or remove it
    const h = structureHits[0];
    understood = true;
    const op = opFor(text, h.pos, h.end);
    if (op === "remove") state.sections = state.sections.filter((s) => s.kind !== h.item.kind);
    else if (!state.sections.some((s) => s.kind === h.item.kind)) {
      const outroAt = state.sections.findIndex((s) => s.kind === "outro");
      const sec: Section = { kind: h.item.kind, directives: [] };
      if (outroAt >= 0) state.sections.splice(outroAt, 0, sec);
      else state.sections.push(sec);
    }
    state.customSections = true;
  }

  // --- defaults for a fresh song, or re-derived after a genre change
  if (understood && (isFirst || newGenres.length)) applyGenreDefaults(state);
  if (understood && !state.customSections && (isFirst || state.sections.length === 0 || newGenres.length)) {
    const keep = state.sections.filter((s) => s.directives.length);
    buildSections(state);
    for (const k of keep) {
      const target = state.sections.find((s) => s.kind === k.kind);
      if (target) target.directives = k.directives;
    }
  }

  return { state, output: render(state, lang), understood };
}

// ---------------------------------------------------------------- render

function tagLabel(t: Tag): string {
  const e = byId.get(t.id);
  if (!e) return t.id;
  if (t.level > 0) return e.up ?? `Prominent ${e.label}`;
  if (t.level < 0) return e.down ?? `Subtle ${e.label}`;
  return e.label;
}

const ORDER: Category[] = ["genre", "instrument", "rhythm", "vocal", "mood", "production"];

export function render(state: PrompterState, lang = "en"): PromptOutput {
  // ----- style prompt: genre > instruments > tempo/key/rhythm > vocals > mood > mix
  const parts: string[] = [];
  for (const cat of ORDER) {
    if (cat === "rhythm") {
      if (state.bpm) parts.push(`${state.bpm} BPM`);
      if (state.key) parts.push(state.key);
    }
    for (const t of state.tags.filter((x) => x.cat === cat)) parts.push(tagLabel(t));
  }
  const unique = [...new Set(parts)];
  let style = "";
  for (const p of unique) {
    const next = style ? `${style}, ${p}` : p;
    if (next.length > STYLE_LIMIT) break;
    style = next;
  }

  // ----- structure
  const fam = primaryFamily(state);
  const instrumental = isInstrumental(state);
  const ph = PLACEHOLDERS[lang] ?? PLACEHOLDERS.en;
  const moodTag = state.tags.find((t) => t.cat === "mood");
  const blocks: string[] = [];
  state.sections.forEach((s, idx) => {
    const base = DIRECTIVES[s.kind][fam] ?? DIRECTIVES[s.kind].default ?? "";
    const extra = s.directives.filter((d) => !base.includes(d));
    let directive = [base, ...extra].filter(Boolean).join(", ");
    if (idx === 0 && moodTag && s.kind === "intro") directive = `${directive}, ${tagLabel(moodTag)}`;
    const vocal = SECTION_VOCAL[s.kind] && !instrumental;
    let label = SECTION_LABEL[s.kind];
    if (s.kind === "verse" && s.index) label = `${label} ${s.index}`;
    if (s.kind === "solo" && s.directives.length) {
      const inst = s.directives[0];
      label = `${inst} Solo`;
      directive = DIRECTIVES.solo.default ?? "";
    }
    if (instrumental && s.kind === "intro") label = "Instrumental Intro";
    else if (!vocal && s.kind === "intro") label = "Instrumental Intro";
    let block = `[${label}${directive ? `: ${directive}` : ""}]`;
    if (vocal) {
      const key = (["verse", "chorus", "hook", "bridge", "pre-chorus"] as const).find((k) => k === s.kind);
      if (key) block += `\n${ph[key]}`;
    }
    blocks.push(block);
  });
  if (blocks.length) blocks.push("[End]");
  let structure = "";
  for (const b of blocks) {
    const next = structure ? `${structure}\n\n${b}` : b;
    if (next.length > STRUCTURE_LIMIT) break;
    structure = next;
  }

  return { style_prompt: style, lyrics_structure: structure };
}
