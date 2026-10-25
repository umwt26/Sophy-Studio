import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ExternalLinkIcon,
  LoadingSpinner,
  RefreshIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "./icons";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { UpdateInfo } from "../types";
import { recordUpdateAttempt } from "../utils/updateAttempt";

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  /** True when the installer for this version was already launched once and the app is still old. */
  previouslyFailed?: boolean;
  onClose?: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ updateInfo, previouslyFailed = false }) => {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    previouslyFailed
      ? t("app.updateNotApplied", "The previous update attempt did not complete. Retry, or download the installer manually from GitHub.")
      : null
  );

  const describeError = (err: unknown): string => {
    const raw = typeof err === "string" ? err : err instanceof Error ? err.message : "";
    const code = raw.split(":")[0]?.trim();
    switch (code) {
      case "UPDATE_DOWNLOAD_FAILED":
        return t("app.updateErrDownload", "The update could not be downloaded. Check your internet connection and try again.");
      case "UPDATE_CORRUPT":
        return t("app.updateErrCorrupt", "The downloaded file was incomplete or damaged, so it was not run. Please try again.");
      case "UPDATE_BLOCKED_BY_AV":
        return t("app.updateErrAntivirus", "Windows Security blocked the installer. Download it manually from GitHub, or allow it in Windows Security.");
      case "UPDATE_LAUNCH_FAILED":
      case "UPDATE_WRITE_FAILED":
        return t("app.updateErrLaunch", "The installer could not be started.");
      default:
        return t("app.autoUpdateFailed", "Could not download automatic update.");
    }
  };

  const handleOpenReleaseWeb = () => {
    invoke("open_url", { url: updateInfo.url }).catch(() => {
      window.open(updateInfo.url, "_blank");
    });
  };

  const handleUpdateClick = async () => {
    if (!updateInfo.download_url) {
      handleOpenReleaseWeb();
      return;
    }

    try {
      setUpdating(true);
      setErrorMsg(null);
      await invoke("install_update", {
        downloadUrl: updateInfo.download_url,
        version: updateInfo.latest_version,
        expectedSize: updateInfo.download_size ?? null,
        expectedSha256: updateInfo.download_sha256 ?? null,
      });
      // Installer launched; the app is about to exit. Remember the attempt so a
      // failed install cannot turn into an endless update loop on next launch.
      recordUpdateAttempt(updateInfo.latest_version, updateInfo.current_version);
    } catch (err: unknown) {
      console.error("Auto update failed:", err);
      setUpdating(false);
      setErrorMsg(describeError(err));
    }
  };

  const currentVersion = updateInfo.current_version.startsWith("v")
    ? updateInfo.current_version
    : `v${updateInfo.current_version}`;
  const latestVersion = updateInfo.latest_version.startsWith("v")
    ? updateInfo.latest_version
    : `v${updateInfo.latest_version}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-app-bg)] p-4 sm:p-6 md:p-10 animate-fade-in select-none">
      {/* Main Fullscreen Dashboard Card */}
      <div className="relative flex h-full max-h-[820px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)]">
        {/* Top Header Section */}
        <div className="relative border-b border-[var(--color-app-border)] px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 px-3 py-1 text-[0.6875rem] font-bold text-[var(--color-accent)] uppercase tracking-wider shadow-sm">
                <SparklesIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                {t("app.mandatoryUpdate", "Mandatory Update")}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold">
                <span className="chip px-2.5 py-0.5 text-[var(--color-text-secondary)]">{currentVersion}</span>
                <span className="text-[var(--color-accent)] font-bold">→</span>
                <span className="chip px-2.5 py-0.5 bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/40 font-bold">
                  {latestVersion}
                </span>
              </div>
            </div>

            <span className="chip text-[0.625rem] font-mono text-[var(--color-text-tertiary)] uppercase">
              Sophy Studio Desktop
            </span>
          </div>

          <h1 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {t("app.updateHeaderTitle", "New Version Ready to Install")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            {t(
              "app.updateHeaderDesc",
              "Sophy Studio has been updated with essential stability fixes, features, and security improvements. Please update to continue your uninterrupted workflow."
            )}
          </p>
        </div>

        {/* Release Notes Body */}
        <div className="flex-1 min-h-0 flex flex-col px-6 py-4 sm:px-8 sm:py-5 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--color-app-border)]/60">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-[var(--color-accent)]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                {t("app.releaseNotes", "Release Notes")}
              </h2>
            </div>
            <span className="text-[0.6875rem] text-[var(--color-text-tertiary)] font-mono">
              Release {latestVersion}
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] p-4 sm:p-5 pr-3">
            {updateInfo.release_notes ? (
              <MarkdownRenderer content={updateInfo.release_notes} />
            ) : (
              <p className="text-xs text-[var(--color-text-tertiary)] italic">
                {t("app.noNotesAvailable", "No release notes available for this release.")}
              </p>
            )}
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="mx-6 sm:mx-8 mb-3 rounded-2xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 p-3.5 text-xs text-[var(--color-danger)] flex items-start gap-3 animate-shake">
            <div className="h-5 w-5 rounded-full bg-[var(--color-danger)]/20 text-[var(--color-danger)] flex items-center justify-center shrink-0 mt-0.5">
              !
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[var(--color-danger)]">{errorMsg}</p>
              <p className="mt-0.5 text-[0.6875rem] text-[var(--color-danger)]">
                {t("app.manualWebNotice", "You can download the installer directly from the GitHub release page.")}
              </p>
            </div>
          </div>
        )}

        {/* Footer & Actions */}
        <div className="border-t border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-6 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
            <ShieldCheckIcon className="h-4 w-4 text-[var(--color-success)] shrink-0" />
            <span className="text-[0.6875rem] leading-snug">
              {t(
                "app.dataGuaranteedNotice",
                "Your search history, studio settings, and downloaded tracks are safely preserved."
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {errorMsg ? (
              <>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdateClick}
                  className="btn btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5"
                >
                  <RefreshIcon className="h-3.5 w-3.5" />
                  <span>{t("common.retry", "Retry")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenReleaseWeb}
                  className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-2 flex-1 sm:flex-initial"
                >
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  <span>{t("app.manualDownload", "Manual Download (Web)")}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={updating}
                onClick={handleUpdateClick}
                className="btn btn-primary w-full sm:w-auto px-8 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2.5"
              >
                {updating ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 animate-spin" />
                    <span>{t("app.downloadingUpdate", "Downloading and preparing setup...")}</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span>
                      {t("app.updateNowBtn", "Update Now")} ({latestVersion})
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
