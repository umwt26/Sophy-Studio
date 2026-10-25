import React, { useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { applyInput, emptyState, render, STRUCTURE_LIMIT, STYLE_LIMIT, type PrompterState } from "../prompter/engine";
import { ChatBubbleIcon, CheckIcon, LoadingSpinner, PlusIcon, SendIcon, SunoPrompterIcon } from "./icons";
import { PageHeader } from "./PageHeader";
import { PrompterChatsDrawer } from "./PrompterChatsDrawer";

interface Props {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

interface Command {
  text: string;
  /** English brief produced by the AI model, when it was used */
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
/** Same inner spacing on every side of the result boxes. */
const BOX_STYLE: React.CSSProperties = { height: "100%", padding: "12px 14px", lineHeight: "22px" };
/** Scripts the rule engine has no vocabulary for: Arabic, Hebrew, Indic, Thai, Hangul, Greek, Armenian, Georgian. */
const UNSUPPORTED_SCRIPT = /[֐-ۿݐ-ݿऀ-෿฀-๿ᄀ-ᇿ가-힯Ͱ-Ͽ԰-֏Ⴀ-ჿ]/;

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
    // empty chats are not worth keeping
    localStorage.setItem(STORE_KEY, JSON.stringify(s.filter((x) => x.commands.length).slice(0, 50)));
  } catch {
    /* storage full or unavailable: chats stay in memory */
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
      className="btn btn-secondary h-7 px-2.5 text-[0.6875rem]"
    >
      {done ? <CheckIcon className="h-3.5 w-3.5 text-[var(--color-success)]" /> : null}
      <span>{label}</span>
    </button>
  );
}

function Counter({ value, limit }: { value: number; limit: number }) {
  const near = value > limit * 0.9;
  return (
    <span className={`font-mono text-[0.6875rem] ${near ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"}`}>
      {value} / {limit}
    </span>
  );
}

export const SunoPrompterPage: React.FC<Props> = ({ onShowToast }) => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "en").slice(0, 2);

  const [sessions, setSessions] = useState<Session[]>(() => {
    const s = loadSessions();
    return [newSession(), ...s];
  });
  const [activeId, setActiveId] = useState<string>(() => sessions[0].id);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [chatsOpen, setChatsOpen] = useState(false);

  const [ai, setAi] = useState<AiStatus | null>(null);
  const [download, setDownload] = useState<{ downloaded: number; total?: number | null } | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
    // The model downloads automatically on first run; refresh when it finishes.
    const unDone = listen("prompter-ai-finished", () => void refresh());
    return () => {
      unProgress.then((f) => f()).catch(() => {});
      unDone.then((f) => f()).catch(() => {});
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [session.commands.length, session.id]);

  // AI is always on whenever this computer can run it and the model is in place.
  const aiActive = !!ai?.cpuSupported && !!ai?.modelDownloaded;

  const update = (id: string, fn: (s: Session) => Session) =>
    setSessions((all) => all.map((s) => (s.id === id ? fn(s) : s)).sort((a, b) => b.updatedAt - a.updatedAt));

  const startChat = () => {
    // reuse the current chat if it is still empty
    if (session.commands.length === 0) {
      inputRef.current?.focus();
      return;
    }
    const s = newSession();
    setSessions((all) => [s, ...all]);
    setActiveId(s.id);
    setInput("");
    setNotice(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const removeChat = (id: string) => {
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

  const clearChats = () => {
    const s = newSession();
    setSessions([s]);
    setActiveId(s.id);
    setNotice(null);
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || busy || preparing) return;
    setBusy(true);
    setNotice(null);
    const target = session.id;
    let understoodAs: string | undefined;
    try {
      // The rule engine is exact for its 8 languages, so it goes first. The model is used
      // when the engine found nothing or the text is in a script it has no vocabulary for.
      let result = applyInput(session.state, text, lang);
      if (aiActive && (!result.understood || UNSUPPORTED_SCRIPT.test(text))) {
        try {
          understoodAs = await invoke<string>("prompter_ai_understand", { text });
          const viaAi = applyInput(session.state, understoodAs, lang);
          if (viaAi.understood) result = viaAi;
        } catch (err) {
          console.debug("prompter ai:", err);
        }
      }

      if (!result.understood) {
        setNotice(
          aiActive
            ? t("prompter.notUnderstoodAi", "No musical details found. Describe the genre, instruments, mood, vocals or tempo.")
            : t("prompter.notUnderstood", "No musical details recognised. Use genre, instrument or mood words.")
        );
      }
      const keepStructure = session.structureEdited && session.structure.trim().length > 0;
      if (keepStructure && result.understood) {
        setNotice(t("prompter.structureKept", "Your edited structure was kept. Use \"Regenerate structure\" to apply changes to it."));
      }
      update(target, (s) => ({
        ...s,
        title: s.title || text.slice(0, 60),
        updatedAt: Date.now(),
        state: result.state,
        style: result.output.style_prompt,
        structure: keepStructure ? s.structure : result.output.lyrics_structure,
        commands: [...s.commands, { text, understoodAs, ok: result.understood }],
      }));
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "44px";
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
      setAi(await invoke<AiStatus>("prompter_ai_status"));
      onShowToast(t("prompter.aiReady", "AI mode is ready."));
    } catch (err) {
      const code = String(err).split(":")[0];
      if (code !== "AI_BUSY") {
        onShowToast(
          code === "AI_DOWNLOAD_CORRUPT"
            ? t("prompter.aiCorrupt", "The model download was incomplete or damaged and was removed. Please try again.")
            : t("prompter.aiDownloadFailed", "The AI model could not be downloaded. Check your connection and try again."),
          "error"
        );
      }
    } finally {
      setDownload(null);
    }
  };

  const json = useMemo(
    () => JSON.stringify({ style_prompt: session.style, lyrics_structure: session.structure }, null, 2),
    [session.style, session.structure]
  );
  const pct = download?.total ? Math.floor((download.downloaded / download.total) * 100) : null;
  const copied = () => onShowToast(t("prompter.copied", "Copied to clipboard."));
  const savedChats = sessions.filter((s) => s.commands.length > 0);

  const examples = [
    t("prompter.example1", "Dark UK drill, male vocals, heavy autotune, 142 BPM"),
    t("prompter.example2", "Sad piano ballad with female vocals and strings"),
    t("prompter.example3", "Chill lo-fi instrumental with vinyl crackle"),
  ];

  // Model preparation: only a progress bar while it downloads (sending is blocked meanwhile),
  // and a small retry link if the automatic download failed. Nothing is shown otherwise.
  const preparing = !!ai?.cpuSupported && !ai?.modelDownloaded && (!!download || !!ai?.downloading);
  const downloadFailed = !!ai?.cpuSupported && !ai?.modelDownloaded && !preparing;

  return (
    // Fits the window: header + results + chat on one screen, no page scrolling.
    // 48px = main container vertical padding (2 x 24px).
    <div className="page !gap-4" style={{ height: "calc(100vh - 48px)", minHeight: 520 }}>
      <PageHeader
        Icon={SunoPrompterIcon}
        title={t("prompter.title", "Suno Style Prompter")}
        desc={t("prompter.subtitle", "Describe a song in your own words and get a ready-to-paste Style and Structure for Suno. It never writes lyrics.")}
        actions={
          <>
            {/* Same size and style for both header actions */}
            <button type="button" onClick={() => setChatsOpen(true)} className="btn btn-secondary w-36 gap-2" title={t("prompter.chats", "Chats")}>
              <ChatBubbleIcon className="h-4 w-4 text-[var(--color-accent)]" />
              <span>{t("prompter.chats", "Chats")}</span>
              {savedChats.length > 0 && <span className="font-mono text-[0.625rem] text-[var(--color-text-muted)]">{savedChats.length}</span>}
            </button>
            <button type="button" onClick={startChat} className="btn btn-secondary w-36 gap-2">
              <PlusIcon className="h-4 w-4 text-[var(--color-accent)]" />
              <span>{t("prompter.newChat", "New chat")}</span>
            </button>
          </>
        }
      />

      {/* Results: Style | Structure side by side */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="section p-4 flex flex-col gap-2 min-w-0 min-h-0">
          <div className="flex items-center justify-between gap-2">
            <p className="section-title">{t("prompter.style", "Style of Music")}</p>
            <div className="flex items-center gap-2">
              <Counter value={session.style.length} limit={STYLE_LIMIT} />
              <CopyButton text={session.style} label={t("prompter.copy", "Copy")} onCopied={copied} />
            </div>
          </div>
          <textarea
            value={session.style}
            onChange={(e) => update(session.id, (s) => ({ ...s, style: e.target.value.slice(0, STYLE_LIMIT), updatedAt: Date.now() }))}
            placeholder={t("prompter.stylePlaceholder", "Your Suno style tags will appear here.")}
            className="input resize-none text-[0.8125rem] font-mono flex-1 min-h-0"
            style={BOX_STYLE}
          />
          <p className="text-[0.6875rem] text-[var(--color-text-muted)]">
            {t("prompter.styleDesc", "Paste this into the Style of Music field in Suno.")}
          </p>
        </div>

        <div className="section p-4 flex flex-col gap-2 min-w-0 min-h-0">
          <div className="flex items-center justify-between gap-2">
            <p className="section-title">{t("prompter.structure", "Structure / Arrangement")}</p>
            <div className="flex items-center gap-2">
              <Counter value={session.structure.length} limit={STRUCTURE_LIMIT} />
              {session.structureEdited && (
                <button type="button" onClick={regenerateStructure} className="btn btn-secondary h-7 px-2.5 text-[0.6875rem]">
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
            placeholder={t("prompter.structurePlaceholder", "Section tags like [Intro], [Verse 1], [Chorus] will appear here.")}
            className="input resize-none text-[0.8125rem] font-mono flex-1 min-h-0"
            style={BOX_STYLE}
          />
          <p className="text-[0.6875rem] text-[var(--color-text-muted)]">
            {t("prompter.structureDesc", "Replace the lines in parentheses with your own lyrics before pasting into Suno.")}
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className="section flex flex-col overflow-hidden shrink-0">
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-[var(--color-app-border)]">
          <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate">{session.title || t("prompter.untitled", "New chat")}</p>
          <CopyButton text={session.style || session.structure ? json : ""} label={t("prompter.copyJson", "Copy as JSON")} onCopied={copied} />
        </div>

        <div ref={chatRef} className="flex flex-col gap-3 px-4 py-3 overflow-y-auto" style={{ height: "clamp(110px, 22vh, 230px)" }}>
          {session.commands.length === 0 ? (
            <div className="m-auto flex flex-col items-center gap-3 text-center max-w-xl">
              <p className="text-xs text-[var(--color-text-secondary)]">
                {t("prompter.emptyDesc", "Write what you want in one sentence. Then refine it: \"less bass\", \"BPM 140\", \"add saxophone to the intro\".")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setInput(ex);
                      inputRef.current?.focus();
                    }}
                    className="chip text-[0.6875rem] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            session.commands.map((c, idx) => (
              <div key={idx} className="flex flex-col items-end gap-1">
                <div
                  className={`max-w-[80%] rounded-2xl rounded-br-md px-3.5 py-2 text-[0.8125rem] leading-relaxed ${
                    c.ok
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                      : "bg-[var(--color-app-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-app-border)]"
                  }`}
                >
                  {c.text}
                </div>
                <span className="text-[0.625rem] text-[var(--color-text-muted)] flex items-center gap-1">
                  {c.ok ? <CheckIcon className="h-3 w-3 text-[var(--color-success)]" /> : null}
                  {c.ok ? t("prompter.applied", "Applied") : t("prompter.notApplied", "Not recognised")}
                  {c.understoodAs && c.understoodAs !== c.text ? ` · ${t("prompter.understoodAs", "Understood as")}: ${c.understoodAs}` : ""}
                </span>
              </div>
            ))
          )}
          {busy && (
            <div className="flex justify-end">
              <span className="flex items-center gap-2 text-[0.6875rem] text-[var(--color-text-muted)]">
                <LoadingSpinner className="h-3.5 w-3.5 animate-spin" />
                {t("prompter.aiThinking", "Analysing...")}
              </span>
            </div>
          )}
        </div>

        {notice && <p className="px-4 pb-2 text-[0.6875rem] text-[var(--color-warning)]">{notice}</p>}

        {preparing && (
          <div className="px-4 pb-2.5">
            <div className="flex items-center justify-between text-[0.6875rem] text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1.5">
                <LoadingSpinner className="h-3.5 w-3.5 animate-spin text-[var(--color-accent)]" />
                {t("prompter.aiDownloading", "Preparing AI model")}
              </span>
              <span className="font-mono">{pct !== null ? `${pct}%` : ""}</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-[var(--color-app-border)] overflow-hidden">
              <div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${pct ?? 2}%` }} />
            </div>
          </div>
        )}
        {downloadFailed && (
          <p className="px-4 pb-2 text-[0.6875rem] text-[var(--color-text-muted)]">
            {t("prompter.aiNotReady", "The AI model isn't downloaded yet, the built-in engine is used.")}{" "}
            <button type="button" onClick={retryDownload} className="text-[var(--color-accent)] hover:underline">
              {t("prompter.aiEnable", "Download AI model")}
            </button>
          </p>
        )}

        <form
          className="flex items-end gap-2 border-t border-[var(--color-app-border)] p-3 bg-[var(--color-app-surface-2)]/40"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // grow with the text (one line = 44px, max ~5 lines)
              const el = e.target;
              el.style.height = "44px";
              el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            rows={1}
            maxLength={1200}
            disabled={preparing}
            placeholder={
              preparing
                ? t("prompter.waitForAi", "Wait a moment, the AI model is being prepared...")
                : session.commands.length
                ? t("prompter.revisePlaceholder", "Refine it: \"less bass\", \"BPM 140\", \"add saxophone to the intro\"...")
                : t("prompter.inputPlaceholder", "Describe your song: genre, mood, instruments, vocals, tempo, structure...")
            }
            className="input flex-1 resize-none text-sm rounded-xl"
            // 44px tall with 20px line height and 11px vertical padding: text sits centred
            style={{ height: 44, maxHeight: 128, paddingTop: 11, paddingBottom: 11, lineHeight: "20px" }}
          />
          <button type="submit" disabled={busy || preparing || !input.trim()} className="btn btn-primary shrink-0 p-0 rounded-xl" style={{ height: 44, width: 44 }} aria-label={t("prompter.send", "Send")}>
            {busy ? <LoadingSpinner className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          </button>
        </form>
      </div>

      <PrompterChatsDrawer
        isOpen={chatsOpen}
        onClose={() => setChatsOpen(false)}
        chats={savedChats.map((s) => ({ id: s.id, title: s.title, updatedAt: s.updatedAt, messages: s.commands.length, style: s.style }))}
        activeId={session.id}
        onSelect={(id) => {
          setActiveId(id);
          setNotice(null);
        }}
        onRemove={removeChat}
        onClearAll={clearChats}
      />
    </div>
  );
};
