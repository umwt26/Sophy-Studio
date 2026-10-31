import React, { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useTranslation } from "react-i18next";
import { PageHeader } from "./PageHeader";
import { ConvertJobRow } from "./ConvertJobRow";
import { CloseIcon, ConvertIcon, EyeIcon, PlusIcon } from "./icons";
import { MediaPreview } from "./MediaPreview";
import { categoryOf, fileName, groupLabel, groupOf, newJobId, outputLabel, outputOf } from "../utils/converter";
import { useConvertJobs } from "../utils/useConvertJobs";

interface ConverterPageProps {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

/**
 * File Converter: audio, video and images to other formats, also resized or rotated.
 * Results land next to the original file as "<name> -- Sophy Studio Converter.<ext>".
 */
export const ConverterPage: React.FC<ConverterPageProps> = ({ onShowToast }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<string[]>([]);
  const [presets, setPresets] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { jobs, add, cancel, clearFinished } = useConvertJobs();

  const addFiles = (paths: string[]) => {
    const ok = paths.filter((p) => categoryOf(p));
    if (ok.length < paths.length) onShowToast(t("converter.someSkipped", "Some files were skipped: this type can't be converted."), "error");
    if (ok.length) setFiles((cur) => [...cur, ...ok.filter((p) => !cur.includes(p))]);
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

  useEffect(() => {
    if (!files.length) return setPresets([]);
    invoke<string[]>("converter_presets", { paths: files })
      .then(setPresets)
      .catch(() => setPresets([]));
  }, [files]);

  const { plain, groups } = useMemo(() => {
    const plain = presets.filter((p) => !groupOf(p));
    const groups: { name: string; presets: string[] }[] = [];
    for (const p of presets) {
      const g = groupOf(p);
      if (!g) continue;
      const found = groups.find((x) => x.name === g);
      if (found) found.presets.push(p);
      else groups.push({ name: g, presets: [p] });
    }
    return { plain, groups };
  }, [presets]);

  const pick = async () => {
    const picked = await invoke<string[]>("converter_pick_files", { title: t("converter.pickTitle", "Choose files to convert") }).catch(() => []);
    addFiles(picked);
  };

  const start = (preset: string) => {
    add(files.map((path) => ({ id: newJobId(), path, preset })));
  };


  const finished = jobs.some((j) => j.state === "done" || j.state === "error" || j.state === "cancelled");

  return (
    <div className="page pb-10">
      <PageHeader
        Icon={ConvertIcon}
        title={t("converter.title", "File Converter")}
        desc={t("converter.subtitle", "Audio, video and images to other formats. Saved next to the original file.")}
        actions={
          files.length > 0 ? (
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
            <ConvertIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {dragOver ? t("converter.dropNow", "Drop the files here") : t("converter.dropPrompt", "Drag files here or click to choose")}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{t("converter.dropFormats", "MP3, WAV, FLAC, MP4, MKV, MOV, PNG, JPG, WEBP, GIF and more • Several at once")}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          <div className="section stagger flex flex-col gap-4 p-5">
            <div>
              <p className="section-title">{t("converter.convertTo", "Convert to")}</p>
              <p className="section-desc">
                {t("converter.selected", { count: files.length, defaultValue: "{{count}} file(s) selected" })}
                {" · "}
                {t("converter.savedNext", "saved next to each original")}
              </p>
            </div>

            {plain.length === 0 ? (
              <p className="text-[0.8125rem] text-[var(--color-text-secondary)]">{t("converter.noCommon", "These files have no format in common. Convert audio, video and images separately.")}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                {plain.map((p) => (
                  <button key={p} type="button" className="btn btn-secondary justify-start" onClick={() => start(p)}>
                    <ConvertIcon className="h-4 w-4 text-[var(--color-accent)]" />
                    <span className="truncate">{outputLabel(t, p)}</span>
                  </button>
                ))}
              </div>
            )}

            {groups.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-[var(--color-app-border-soft)] pt-4">
                {groups.map((g) => (
                  <div key={g.name} className="rounded-[12px] border border-[var(--color-app-border-soft)]">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[0.8438rem] font-medium text-[var(--color-text-primary)]"
                      onClick={() => setOpenGroup((o) => (o === g.name ? null : g.name))}
                      aria-expanded={openGroup === g.name}
                    >
                      {groupLabel(t, g.name)}
                      <span className="text-[0.75rem] text-[var(--color-text-muted)]">{openGroup === g.name ? "−" : "+"}</span>
                    </button>
                    {openGroup === g.name && (
                      <div className="flex flex-wrap gap-2 px-3.5 pb-3 animate-fade-up">
                        {g.presets.map((p) => (
                          <button key={p} type="button" className="btn btn-secondary btn-sm" onClick={() => start(p)}>
                            {outputLabel(t, outputOf(p))}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="section flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="section-title">{t("converter.files", "Files")}</p>
              <button type="button" className="text-[0.75rem] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]" onClick={() => setFiles([])}>
                {t("converter.clear", "Clear")}
              </button>
            </div>
            <ul className="max-h-[340px] overflow-y-auto border-t border-[var(--color-app-border-soft)]">
              {files.map((f) => (
                <li key={f} className="flex items-center gap-2.5 px-4 py-2 text-[0.8125rem]">
                  <span className="chip shrink-0 font-mono uppercase">{f.split(".").pop()}</span>
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
          </aside>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="section">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-app-border-soft)]">
            <p className="section-title">{t("converter.conversions", "Conversions")}</p>
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
