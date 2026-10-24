import React, { useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { applyInput, emptyState, render, STRUCTURE_LIMIT, STYLE_LIMIT, type PrompterState } from "../prompter/engine";
import { CheckIcon, LoadingSpinner, SendIcon, SparklesIcon, TrashIcon } from "./icons";

interface Props {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

interface Command {
  text: string;
  /** English brief produced by AI mode, when used */
  understoodAs?: string;
  ok: boolean;
}

interface Session {
  id: string;
  title: string;
  updatedAt: number;
  state: PrompterState;
  style: string;
  structure: string;
  /** user typed into the structure box: revisions must not overwrite it */
  structureEdited: boolean;
  commands: Command[];
}

interface AiStatus {
  cpuSupported: boolean;
  missingCpuFeatures: string[];
  modelDownloaded: boolean;
  modelSizeBytes?: number | null;
  downloading: boolean;
  downloadedBytes: number;
  totalBytes?: number | null;
}

const STORE_KEY = "sophy.prompter.sessions.v1";
/** Scripts the rule engine has no vocabulary for: Arabic, Hebrew, Devanagari & other Indic, Thai, Hangul, Han-only, Greek, Armenian, Georgian. */
const UNSUPPORTED_SCRIPT = /[\u0590-\u06FF\u0750-\u077F\u0900-\u0DFF\u0E00-\u0E7F\u1100-\u11FF\uAC00-\uD7AF\u0370-\u03FF\u0530-\u058F\u10A0-\u10FF]/;
const AI_KEY = "sophy.prompter.ai.v1";

function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(s: Session[]) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s.slice(0, 50)));
  } catch {
    /* storage full or unavailable: sessions stay in memory */
  }
}

const newSession = (): Session => ({
  id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  updatedAt: Date.now(),
  state: emptyState(),
  style: "",
  structure: "",
  structureEdited: false,
  commands: [],
});

function CopyButton({ text, label, onCopied }: { text: string; label: string; onCopied: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          onCopied();
          setTimeout(() => setDone(false), 1400);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="btn btn-secondary h-8 px-3 text-xs"
    >
      {done ? <CheckIcon className="h-3.5 w-3.5 text-[var(--color-success)]" /> : null}
      <span>{label}</span>
    </button>
  );
}

function Counter({ value, limit }: { value: number; limit: number }) {
  const near = value > limit * 0.9;
  return (
    <span className={`font-mono text-[11px] ${near ? "text-amber-400" : "text-[var(--color-text-muted)]"}`}>
      {value} / {limit}
    </span>
  );
}

export const SunoPrompterPage: React.FC<Props> = ({ onShowToast }) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const [sessions, setSessions] = useState<Session[]>(() => {
    const s = loadSessions();
    return s.length ? s : [newSession()];
  });
  const [activeId, setActiveId] = useState<string>(() => sessions[0].id);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [ai, setAi] = useState<AiStatus | null>(null);
  const [aiEnabled, setAiEnabled] = useState<boolean>(() => {
    try {
      // on by default; only an explicit "off" from the user turns it off
      return localStorage.getItem(AI_KEY) !== "off";
    } catch {
      return false;
    }
  });
  const [download, setDownload] = useState<{ downloaded: number; total?: number | null } | null>(null);

  const historyRef = useRef<HTMLDivElement>(null);
  const session = useMemo(() => sessions.find((s) => s.id === activeId) ?? sessions[0], [sessions, activeId]);

  useEffect(() => saveSessions(sessions), [sessions]);

  useEffect(() => {
    const refresh = () =>
      invoke<AiStatus>("prompter_ai_status")
        .then((st) => {
          setAi(st);
          setDownload(st.downloading ? { downloaded: st.downloadedBytes, total: st.totalBytes } : null);
        })
        .catch(() => setAi(null));
    void refresh();
    const unProgress = listen<{ downloaded: number; total?: number | null }>("prompter-ai-progress", (e) => setDownload(e.payload));
    // The model downloads automatically in the background on first run; refresh when it finishes.
    const unDone = listen("prompter-ai-finished", () => void refresh());
    return () => {
      unProgress.then((f) => f()).catch(() => {});
      unDone.then((f) => f()).catch(() => {});
    };
  }, []);

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight });
  }, [session.commands.length]);

  const aiActive = !!ai?.cpuSupported && !!ai?.modelDownloaded && aiEnabled;

  const update = (id: string, fn: (s: Session) => Session) =>
    setSessions((all) => {
      const next = all.map((s) => (s.id === id ? fn(s) : s));
      return next.sort((a, b) => b.updatedAt - a.updatedAt);
    });

  const startSession = () => {
    const s = newSession();
    setSessions((all) => [s, ...all]);
    setActiveId(s.id);
    setInput("");
    setNotice(null);
  };

  const deleteSession = (id: string) => {
    setSessions((all) => {
      const rest = all.filter((s) => s.id !== id);
      if (!rest.length) {
        const s = newSession();
        setActiveId(s.id);
        return [s];
      }
      if (id === activeId) setActiveId(rest[0].id);
      return rest;
    });
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setNotice(null);
    const target = session.id;
    let understoodAs: string | undefined;
    try {
      // The rule engine is exact for its 8 languages, so it goes first. The small model is
      // only used when the engine found nothing or the text is in a script it doesn't know;
      // that keeps the model's occasional guesses (e.g. "accordion" -> "guitar") out.
      let result = applyInput(session.state, text, lang);
      if (aiActive && (!result.understood || UNSUPPORTED_SCRIPT.test(text))) {
        try {
          understoodAs = await invoke<string>("prompter_ai_understand", { text });
          const viaAi = applyInput(session.state, understoodAs, lang);
          if (viaAi.understood) result = viaAi;
        } catch (err) {
          setNotice(t("prompter.aiError", "AI mode could not process this request, the built-in engine was used instead."));
          console.debug("prompter ai:", err);
        }
      }

      if (!result.understood) {
        setNotice(
          aiActive
            ? t("prompter.notUnderstoodAi", "No musical details found. Describe the genre, instruments, mood, vocals or tempo.")
            : t("prompter.notUnderstood", "No musical details recognised. Use genre, instrument or mood words, or turn on AI mode to write in any language.")
        );
      }
      const keepStructure = session.structureEdited && session.structure.trim().length > 0;
      if (keepStructure && result.understood) {
        setNotice(t("prompter.structureKept", "Your edited structure was kept. Use \"Regenerate structure\" to apply changes to it."));
      }
      update(target, (s) => {
        return {
          ...s,
          title: s.title || text.slice(0, 60),
          updatedAt: Date.now(),
          state: result.state,
          style: result.output.style_prompt,
          structure: keepStructure ? s.structure : result.output.lyrics_structure,
          commands: [...s.commands, { text, understoodAs, ok: result.understood }],
        };
      });
      setInput("");
    } finally {
      setBusy(false);
    }
  };

  const regenerateStructure = () => {
    const out = render(session.state, lang);
    update(session.id, (s) => ({ ...s, structure: out.lyrics_structure, structureEdited: false, updatedAt: Date.now() }));
    setNotice(null);
  };

  const retryDownload = async () => {
    if (!ai?.cpuSupported) return;
    setDownload({ downloaded: 0, total: null });
    try {
      await invoke("prompter_ai_download");
      const st = await invoke<AiStatus>("prompter_ai_status");
      setAi(st);
      onShowToast(t("prompter.aiReady", "AI mode is ready."));
    } catch (err) {
      const code = String(err).split(":")[0];
      onShowToast(
        code === "AI_DOWNLOAD_CORRUPT"
          ? t("prompter.aiCorrupt", "The model download was incomplete or damaged and was removed. Please try again.")
          : t("prompter.aiDownloadFailed", "The AI model could not be downloaded. Check your connection and try again."),
        "error"
      );
    } finally {
      setDownload(null);
    }
  };

  const toggleAi = () => {
    const next = !aiEnabled;
    setAiEnabled(next);
    try { localStorage.setItem(AI_KEY, next ? "on" : "off"); } catch { /* ignore */ }
  };

  const json = useMemo(
    () => JSON.stringify({ style_prompt: session.style, lyrics_structure: session.structure }, null, 2),
    [session.style, session.structure]
  );

  const pct = download?.total ? Math.floor((download.downloaded / download.total) * 100) : null;
  const copied = () => onShowToast(t("prompter.copied", "Copied to clipboard."));

  const examples = [
    t("prompter.example1", "Dark UK drill, male vocals, heavy autotune, 142 BPM"),
    t("prompter.example2", "Sad piano ballad with female vocals and strings"),
    t("prompter.example3", "Chill lo-fi instrumental with vinyl crackle"),
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="section section-pad flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">{t("prompter.title", "Suno Style Prompter")}</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {t("prompter.subtitle", "Describe a song in your own words and get a ready-to-paste Style and Structure for Suno. It never writes lyrics.")}
            </p>
          </div>
        </div>

        {/* AI mode */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {ai && !ai.cpuSupported ? (
            <span
              className="chip text-[11px]"
              title={`${t("prompter.aiUnsupportedHint", "This processor lacks:")} ${ai.missingCpuFeatures.join(", ")}`}
            >
              {t("prompter.aiUnsupported", "AI mode needs a newer CPU (AVX2)")}
            </span>
          ) : download ? (
            <div className="flex items-center gap-2 min-w-[220px]">
              <LoadingSpinner className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
              <div className="flex-1">
                <div className="text-[11px] text-[var(--color-text-secondary)]">
                  {t("prompter.aiDownloading", "Preparing AI model")} {pct !== null ? `${pct}%` : ""}
                </div>
                <div className="mt-1 h-1 rounded bg-[var(--color-app-border)] overflow-hidden">
                  <div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${pct ?? 3}%` }} />
                </div>
              </div>
            </div>
          ) : ai?.modelDownloaded ? (
            <button type="button" onClick={toggleAi} className={`btn h-8 px-3 text-xs ${aiEnabled ? "btn-primary" : "btn-secondary"}`}>
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>{aiEnabled ? t("prompter.aiOn", "AI mode: On") : t("prompter.aiOff", "AI mode: Off")}</span>
            </button>
          ) : ai ? (
            <button type="button" onClick={retryDownload} className="btn btn-secondary h-8 px-3 text-xs" title={t("prompter.aiEnableHint", "Lets you write in any language. Runs offline on your computer.")}>
              <SparklesIcon className="h-3.5 w-3.5" />
              <span>{t("prompter.aiEnable", "Download AI model")}</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-4 min-h-0">
        {/* Sessions */}
        <aside className="section p-3 flex flex-col gap-2 lg:self-start lg:max-h-[calc(100vh-220px)] overflow-hidden">
          <button type="button" onClick={startSession} className="btn btn-primary w-full h-9 text-xs">
            <span>+ {t("prompter.newSession", "New session")}</span>
          </button>
          <p className="eyebrow px-1 pt-1">{t("prompter.sessions", "Sessions")}</p>
          <div className="flex flex-col gap-1 overflow-y-auto pr-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer border transition-colors ${
                  s.id === session.id
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]"
                    : "border-transparent hover:bg-[var(--color-app-hover)]"
                }`}
                onClick={() => {
                  setActiveId(s.id);
                  setNotice(null);
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-[var(--color-text-primary)]">
                    {s.title || t("prompter.untitled", "New session")}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{new Date(s.updatedAt).toLocaleString(i18n.language)}</p>
                </div>
                <button
                  type="button"
                  aria-label={t("prompter.deleteSession", "Delete session")}
                  title={t("prompter.deleteSession", "Delete session")}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(s.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Command history (inputs only, no chat filler) */}
          <div className="section section-pad flex flex-col gap-3">
            {session.commands.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {t("prompter.emptyDesc", "Write what you want in one sentence. Then refine it: \"less bass\", \"BPM 140\", \"add saxophone to the intro\".")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex) => (
                    <button key={ex} type="button" onClick={() => setInput(ex)} className="chip text-[11px] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]">
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div ref={historyRef} className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                {session.commands.map((c, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-mono text-[var(--color-text-muted)] mr-2">{String(idx + 1).padStart(2, "0")}</span>
                    <span className={c.ok ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)] line-through"}>{c.text}</span>
                    {c.understoodAs && c.understoodAs !== c.text && (
                      <span className="block pl-7 text-[11px] text-[var(--color-text-muted)]">
                        {t("prompter.understoodAs", "Understood as")}: {c.understoodAs}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void submit();
                  }
                }}
                rows={2}
                maxLength={1200}
                placeholder={
                  session.commands.length
                    ? t("prompter.revisePlaceholder", "Refine it: \"less bass\", \"BPM 140\", \"add saxophone to the intro\"...")
                    : t("prompter.inputPlaceholder", "Describe your song: genre, mood, instruments, vocals, tempo, structure...")
                }
                className="input flex-1 resize-none py-2.5 text-sm"
              />
              <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary h-[52px] px-4">
                {busy ? <LoadingSpinner className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
                <span className="hidden sm:inline">{busy && aiActive ? t("prompter.aiThinking", "Analysing...") : t("prompter.send", "Generate")}</span>
              </button>
            </form>
            {notice && <p className="text-[11px] text-amber-400">{notice}</p>}
          </div>

          {/* Style */}
          <div className="section section-pad flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="section-title">{t("prompter.style", "Style of Music")}</p>
              <div className="flex items-center gap-3">
                <Counter value={session.style.length} limit={STYLE_LIMIT} />
                <CopyButton text={session.style} label={t("prompter.copy", "Copy")} onCopied={copied} />
              </div>
            </div>
            <textarea
              value={session.style}
              onChange={(e) => update(session.id, (s) => ({ ...s, style: e.target.value.slice(0, STYLE_LIMIT), updatedAt: Date.now() }))}
              rows={3}
              placeholder={t("prompter.stylePlaceholder", "Your Suno style tags will appear here.")}
              className="input resize-y py-2.5 text-sm font-mono leading-relaxed"
            />
          </div>

          {/* Structure */}
          <div className="section section-pad flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="section-title">{t("prompter.structure", "Structure / Arrangement")}</p>
                <p className="section-desc">{t("prompter.structureDesc", "Replace the lines in parentheses with your own lyrics before pasting into Suno.")}</p>
              </div>
              <div className="flex items-center gap-3">
                <Counter value={session.structure.length} limit={STRUCTURE_LIMIT} />
                {session.structureEdited && (
                  <button type="button" onClick={regenerateStructure} className="btn btn-secondary h-8 px-3 text-xs">
                    {t("prompter.regenerate", "Regenerate structure")}
                  </button>
                )}
                <CopyButton text={session.structure} label={t("prompter.copy", "Copy")} onCopied={copied} />
              </div>
            </div>
            <textarea
              value={session.structure}
              onChange={(e) =>
                update(session.id, (s) => ({ ...s, structure: e.target.value.slice(0, STRUCTURE_LIMIT), structureEdited: true, updatedAt: Date.now() }))
              }
              rows={14}
              placeholder={t("prompter.structurePlaceholder", "Section tags like [Intro], [Verse 1], [Chorus] will appear here.")}
              className="input resize-y py-2.5 text-sm font-mono leading-relaxed"
            />
            <div className="flex justify-end">
              <CopyButton text={session.style || session.structure ? json : ""} label={t("prompter.copyJson", "Copy as JSON")} onCopied={copied} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
