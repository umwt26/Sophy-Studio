import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { AlertCircleIcon, CheckCircleIcon, CloseIcon, DocumentTextIcon, EyeIcon, FolderIcon, ImageIcon, MusicalNoteIcon, VideoCameraIcon } from "./icons";
import { fileName, formatBytes, presetLabel, type ConvertCategory, type ConvertJob } from "../utils/converter";

const ICONS: Record<ConvertCategory, React.ComponentType<{ className?: string }>> = {
  audio: MusicalNoteIcon,
  video: VideoCameraIcon,
  image: ImageIcon,
  animated: ImageIcon,
};

/** One conversion: file, preset, progress bar, then "Show in folder" or the error. */
export const ConvertJobRow: React.FC<{ job: ConvertJob; category?: ConvertCategory | null; onCancel: (id: string) => void; onPreview?: (path: string) => void }> = ({ job, category, onCancel, onPreview }) => {
  const { t } = useTranslation();
  // PDFs and other non-media files (Compressor) get a document icon
  const Icon = category ? ICONS[category] : DocumentTextIcon;
  const pct = Math.round(job.progress * 100);

  const status =
    job.state === "queued"
      ? t("converter.queued", "Waiting")
      : job.state === "running"
        ? `${pct}%`
        : job.state === "done"
          ? t("converter.done", "Done")
          : job.state === "cancelled"
            ? t("converter.cancelled", "Cancelled")
            : job.error === "ALREADY_SMALL"
              ? t("compressor.small", "Already small")
            : t("converter.failed", "Failed");

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-[var(--color-app-border-soft)] first:border-t-0 animate-fade-up">
      <span className="icon-tile !h-9 !w-9 shrink-0">
        {job.state === "done" ? <CheckCircleIcon /> : job.state === "error" ? <AlertCircleIcon /> : <Icon />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[0.8438rem] font-medium text-[var(--color-text-primary)]" title={job.path}>
            {fileName(job.output ?? job.path)}
          </p>
          <span
            className={`shrink-0 font-mono text-[0.7188rem] ${
              job.state === "done" ? "text-[var(--color-success)]" : job.state === "error" ? "text-[var(--color-danger)]" : "text-[var(--color-text-secondary)]"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="truncate text-[0.7188rem] text-[var(--color-text-muted)]">
          {job.before && job.after ? (
            <>
              {formatBytes(job.before)} → <span className="font-semibold text-[var(--color-text-primary)]">{formatBytes(job.after)}</span>{" "}
              <span className="font-semibold text-[var(--color-success)]">−{Math.round((1 - job.after / job.before) * 100)}%</span>
            </>
          ) : (
            presetLabel(t, job.preset)
          )}
        </p>
        {(job.state === "running" || job.state === "queued") && (
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--color-app-surface-2)]">
            <div
              className={`h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-200 ${job.state === "queued" || pct === 0 ? "w-1/4 animate-pulse" : ""}`}
              style={job.state === "running" && pct > 0 ? { width: `${pct}%` } : undefined}
            />
          </div>
        )}
        {job.state === "error" && (
          <p className="mt-1 line-clamp-2 text-[0.7188rem] text-[var(--color-danger)]" title={job.error}>
            {job.error === "ALREADY_SMALL" ? t("compressor.alreadySmall", "Already as small as it gets: nothing was written.") : job.error === "PDF_ENCRYPTED" ? t("compressor.encrypted", "This PDF is password protected.") : job.error === "UNSUPPORTED" ? t("converter.errUnsupported", "This file type can't be converted this way.") : job.error === "NOT_FOUND" ? t("converter.errNotFound", "The file no longer exists.") : t("converter.errFailed", "The conversion failed.")}
          </p>
        )}
      </div>
      {job.state === "done" && job.output && onPreview && (
        <button type="button" className="icon-btn shrink-0" title={t("preview.open", "Preview")} onClick={() => onPreview(job.output!)}>
          <EyeIcon />
        </button>
      )}
      {job.state === "done" && job.output ? (
        <button type="button" className="icon-btn shrink-0" title={t("converter.showInFolder", "Show in folder")} onClick={() => void invoke("show_in_folder", { path: job.output })}>
          <FolderIcon />
        </button>
      ) : job.state === "running" || job.state === "queued" ? (
        <button type="button" className="icon-btn shrink-0" title={t("converter.cancel", "Cancel")} onClick={() => onCancel(job.id)}>
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
};
