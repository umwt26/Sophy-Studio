import { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { ConvertJob, ProgressEvent } from "./converter";

/**
 * Conversion queue shared by the File Converter page and the right-click window:
 * jobs run one at a time (ffmpeg already uses every CPU core), progress comes from
 * the "converter-progress" event.
 */
export function useConvertJobs() {
  const [jobs, setJobs] = useState<ConvertJob[]>([]);
  const activeRef = useRef<string | null>(null);

  useEffect(() => {
    let off: (() => void) | undefined;
    listen<ProgressEvent>("converter-progress", (e) => {
      const p = e.payload;
      setJobs((list) => list.map((j) => (j.id === p.id ? { ...j, progress: p.progress, state: p.state, output: p.output, error: p.error, before: p.before, after: p.after } : j)));
      if (p.state !== "running" && activeRef.current === p.id) activeRef.current = null;
    })
      .then((u) => (off = u))
      .catch(() => {});
    return () => off?.();
  }, []);

  // start the next queued job whenever nothing is running
  useEffect(() => {
    const busy = jobs.some((j) => j.state === "running");
    if (busy || activeRef.current) return;
    const next = jobs.find((j) => j.state === "queued");
    if (!next) return;
    activeRef.current = next.id;
    setJobs((list) => list.map((j) => (j.id === next.id ? { ...j, state: "running", progress: 0 } : j)));
    invoke("converter_start", { id: next.id, path: next.path, preset: next.preset }).catch((err) => {
      activeRef.current = null;
      setJobs((list) => list.map((j) => (j.id === next.id ? { ...j, state: "error", error: String(err) } : j)));
    });
  }, [jobs]);

  const add = useCallback((more: { id: string; path: string; preset: string }[]) => {
    // the same job can be announced twice (session list + event): keep the first
    setJobs((list) => [...list, ...more.filter((m) => !list.some((j) => j.id === m.id)).map((m) => ({ ...m, progress: 0, state: "queued" as const }))]);
  }, []);

  const cancel = useCallback((id: string) => {
    setJobs((list) => list.map((j) => (j.id === id && j.state === "queued" ? { ...j, state: "cancelled" } : j)));
    void invoke("converter_cancel", { id }).catch(() => {});
  }, []);

  const clearFinished = useCallback(() => {
    setJobs((list) => list.filter((j) => j.state === "queued" || j.state === "running"));
  }, []);

  return { jobs, add, cancel, clearFinished };
}
