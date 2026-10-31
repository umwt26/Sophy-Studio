import React, { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useTranslation } from "react-i18next";
import { PageHeader } from "./PageHeader";
import { ConvertJobRow } from "./ConvertJobRow";
import { MediaPreview } from "./MediaPreview";
import { CloseIcon, CompressIcon, EyeIcon, PlusIcon } from "./icons";
import { categoryOf, fileName, formatBytes, newJobId } from "../utils/converter";
import { useConvertJobs } from "../utils/useConvertJobs";

const MAX_FILES = 10;

interface CompressorPageProps {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

/**
 * Compressor: up to 10 files of any kind (photos, music, video, PDF, anything else) made
 * smaller in one go. Starts only on the Compress button; each result lands next to its
 * original as "<name> -- Sophy Studio Compressor.<ext>".
 */
export const CompressorPage: React.FC<CompressorPageProps> = ({ onShowToast }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { jobs, add, cancel, clearFinished } = useConvertJobs();

  const addFiles = (paths: string[]) => {
    setFiles((cur) => {
      const fresh = paths.filter((p) => !cur.includes(p));
      const room = MAX_FILES - cur.length;
      if (fresh.length > room) onShowToast(t("compressor.tooMany", { max: MAX_FILES, defaultValue: "Up to {{max}} files at a time." }), "error");
      return [...cur, ...fresh.slice(0, Math.max(0, room))];
    });
  };

  useEffect(() => {
    let off: (() => void) | undefined;
    try {
      getCurrentWebview()
        .onDragDropEvent((e) => {
          if (e.payload.type === "enter" || e.payload.type === "over") setDragOver(true);
          else if (e.payload.type === "leave") setDragOver(false);
          else if (e.payload.type === "drop") {
            setDragOver(false);
            addFiles(e.payload.paths ?? []);
          }
        })
        .then((u) => (off = u));
    } catch {
      // browser preview
    }
    return () => off?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = async () => {
    const picked = await invoke<string[]>("converter_pick_files", { title: t("compressor.pickTitle", "Choose files to compress"), any: true }).catch(() => []);
    addFiles(picked);
  };

  const start = () => {
    add(files.map((path) => ({ id: newJobId(), path, preset: "compress" })));
    setFiles([]);
  };

  const busy = jobs.some((j) => j.state === "running" || j.state === "queued");
  const finished = jobs.some((j) => j.state === "done" || j.state === "error" || j.state === "cancelled");
  const saved = useMemo(() => jobs.reduce((s, j) => s + (j.before && j.after ? j.before - j.after : 0), 0), [jobs]);

  return (
    <div className="page pb-10">
      <PageHeader
        Icon={CompressIcon}
        title={t("compressor.title", "Compressor")}
        desc={t("compressor.subtitle", "Make photos, music, videos, PDFs and any other file smaller. Saved next to the original.")}
        actions={
          files.length > 0 && files.length < MAX_FILES ? (
            <button type="button" className="btn btn-secondary" onClick={pick}>
              <PlusIcon className="h-4 w-4" />
              <span>{t("converter.addFiles", "Add files")}</span>
            </button>
          ) : undefined
        }
      />

      {files.length === 0 ? (
        <div className={`dropzone py-16 ${dragOver ? "active" : ""}`} onClick={pick}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent-subtle)] text-[var(--color-accent)]">
            <CompressIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {dragOver ? t("converter.dropNow", "Drop the files here") : t("converter.dropPrompt", "Drag files here or click to choose")}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{t("compressor.dropFormats", { max: MAX_FILES, defaultValue: "JPG, PNG, MP3, WAV, MP4, PDF and any other file • Up to {{max}} at once" })}</p>
          </div>
        </div>
      ) : (
        <div className="section">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="section-title">{t("compressor.ready", { count: files.length, max: MAX_FILES, defaultValue: "{{count}} / {{max}} files" })}</p>
              <p className="section-desc">{t("compressor.readyHint", "Nothing changes until you press Compress. Originals are never touched.")}</p>
            </div>
            <button type="button" className="text-[0.75rem] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" onClick={() => setFiles([])}>
              {t("converter.clear", "Clear")}
            </button>
          </div>
          <ul className="border-t border-[var(--color-app-border-soft)]">
            {files.map((f) => (
              <li key={f} className="flex items-center gap-2.5 px-4 py-2 text-[0.8125rem]">
                <span className="chip w-14 shrink-0 justify-center font-mono uppercase">{f.split(".").pop()?.slice(0, 5)}</span>
                <span className="min-w-0 flex-1 truncate text-[var(--color-text-primary)]" title={f}>
                  {fileName(f)}
                </span>
                <button type="button" className="icon-btn !h-7 !w-7 shrink-0" onClick={() => setPreview(f)} title={t("preview.open", "Preview")}>
                  <EyeIcon className="!h-4 !w-4" />
                </button>
                <button type="button" className="icon-btn !h-7 !w-7 shrink-0" onClick={() => setFiles((cur) => cur.filter((x) => x !== f))} aria-label={t("converter.remove", "Remove")}>
                  <CloseIcon className="!h-3.5 !w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-end border-t border-[var(--color-app-border-soft)] px-4 py-3">
            <button type="button" className="btn btn-primary px-6" onClick={start}>
              <CompressIcon className="h-4 w-4" />
              <span>{t("compressor.compressN", { count: files.length, defaultValue: "Compress {{count}} file(s)" })}</span>
            </button>
          </div>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="section">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-app-border-soft)]">
            <div>
              <p className="section-title">{t("compressor.results", "Results")}</p>
              {saved > 0 && !busy && <p className="section-desc">{t("compressor.saved", { size: formatBytes(saved), defaultValue: "{{size}} saved in total" })}</p>}
            </div>
            {finished && (
              <button type="button" className="text-[0.75rem] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" onClick={clearFinished}>
                {t("converter.clearFinished", "Clear finished")}
              </button>
            )}
          </div>
          <div className="flex flex-col">
            {[...jobs].reverse().map((j) => (
              <ConvertJobRow key={j.id} job={j} category={categoryOf(j.path)} onCancel={cancel} onPreview={setPreview} />
            ))}
          </div>
        </div>
      )}

      {preview && <MediaPreview path={preview} onClose={() => setPreview(null)} />}
    </div>
  );
};
