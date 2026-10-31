import React, { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTranslation } from "react-i18next";
import { ConvertJobRow } from "./ConvertJobRow";
import logoImg from "../assets/logo.png";
import { categoryOf, type ConvertJob } from "../utils/converter";
import { useConvertJobs } from "../utils/useConvertJobs";

const CLOSE_AFTER = 4;

/**
 * The window Explorer's right-click menu opens (`sophy.exe --convert …`): only the
 * conversions and their progress. Closes by itself a few seconds after everything
 * finished without errors.
 */
export const ConverterWindow: React.FC = () => {
  const { t } = useTranslation();
  const { jobs, add, cancel } = useConvertJobs();
  const [countdown, setCountdown] = useState<number | null>(null);
  const shown = useRef(false);

  useEffect(() => {
    invoke<ConvertJob[]>("converter_session")
      .then((list) => add(list))
      .catch(() => {});
    let off: (() => void) | undefined;
    listen<ConvertJob[]>("converter-jobs", (e) => add(e.payload))
      .then((u) => (off = u))
      .catch(() => {});
    // show once painted, like the main window
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (shown.current) return;
        shown.current = true;
        void getCurrentWindow().show();
        void getCurrentWindow().setFocus();
      })
    );
    return () => off?.();
  }, [add]);

  const allDone = jobs.length > 0 && jobs.every((j) => j.state === "done" || j.state === "error" || j.state === "cancelled");
  const failed = jobs.filter((j) => j.state === "error").length;
  const done = jobs.filter((j) => j.state === "done").length;
  const running = jobs.find((j) => j.state === "running");
  const overall = jobs.length ? jobs.reduce((s, j) => s + (j.state === "running" ? j.progress : j.state === "queued" ? 0 : 1), 0) / jobs.length : 0;

  // close by itself when all went well; stays open on errors
  useEffect(() => {
    if (!allDone || failed > 0) {
      setCountdown(null);
      return;
    }
    setCountdown(CLOSE_AFTER);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return c;
        if (c <= 1) {
          clearInterval(timer);
          void getCurrentWindow().close();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [allDone, failed]);

  return (
    <div className="flex h-screen flex-col bg-[var(--color-app-bg)]">
      <header className="flex items-center gap-3 px-4 pt-4 pb-3">
        <img src={logoImg} alt="" className="h-9 w-9 object-contain" />
        <div className="min-w-0 flex-1">
          <p className="text-[0.9375rem] font-semibold text-[var(--color-text-primary)]">{jobs.length > 0 && jobs.every((j) => j.preset === "compress") ? "Sophy Studio Compressor" : "Sophy Studio Converter"}</p>
          <p className="truncate text-[0.75rem] text-[var(--color-text-secondary)]">
            {allDone
              ? failed > 0
                ? t("converter.summaryFailed", { done, failed, defaultValue: "{{done}} done, {{failed}} failed" })
                : t(jobs.every((j) => j.preset === "compress") ? "compressor.summaryDone" : "converter.summaryDone", { count: done, defaultValue: "{{count}} file(s) converted" })
              : t(jobs.every((j) => j.preset === "compress") ? "compressor.summaryRunning" : "converter.summaryRunning", { current: Math.min(jobs.indexOf(running ?? jobs[0]) + 1, jobs.length), total: jobs.length, defaultValue: "Converting {{current}} of {{total}}" })}
          </p>
        </div>
        <span className="font-mono text-[0.8125rem] font-semibold text-[var(--color-accent)]">{Math.round(overall * 100)}%</span>
      </header>

      <div className="mx-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-app-surface-2)]">
        <div className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300" style={{ width: `${Math.max(3, overall * 100)}%` }} />
      </div>

      <div className="section mx-4 mt-3 mb-3 flex-1 overflow-y-auto">
        {jobs.map((j) => (
          <ConvertJobRow key={j.id} job={j} category={categoryOf(j.path)} onCancel={cancel} />
        ))}
      </div>

      <footer className="flex items-center justify-between gap-3 px-4 pb-4">
        <p className="text-[0.7188rem] text-[var(--color-text-muted)]">
          {countdown !== null ? t("converter.closingIn", { seconds: countdown, defaultValue: "Closing in {{seconds}} s" }) : t("converter.savedNextShort", "Saved next to the original files")}
        </p>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => {
            // closing mid-way stops the remaining conversions (no half-written files are left)
            jobs.filter((j) => j.state === "running" || j.state === "queued").forEach((j) => cancel(j.id));
            setTimeout(() => void getCurrentWindow().close(), allDone ? 0 : 400);
          }}
        >
          {allDone ? t("converter.close", "Close") : t("converter.stop", "Stop and close")}
        </button>
      </footer>
    </div>
  );
};
