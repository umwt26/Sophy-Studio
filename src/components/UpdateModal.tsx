import { useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { ArrowDownTrayIcon, CloseIcon, ExternalLinkIcon, LoadingSpinner, SparklesIcon } from "./icons";
import type { UpdateInfo } from "../types";

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  onClose: () => void;
}

export function UpdateModal({ updateInfo, onClose }: UpdateModalProps) {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      await invoke("install_update", { downloadUrl: updateInfo.download_url });
    } catch (err: unknown) {
      console.error("Auto update failed:", err);
      setUpdating(false);
      setErrorMsg(typeof err === "string" ? err : "Otomatik güncelleme indirilemedi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 shadow-2xl animate-scale-in">
        {/* Close Button */}
        {!updating && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", "Kapat")}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}

        {/* Update Icon & Tag */}
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <SparklesIcon className="h-4 w-4" />
          </span>
          <span className="chip text-[10px] font-mono font-medium">
            v{updateInfo.latest_version}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
          {updating
            ? t("app.updatingTitle", "Güncelleme İndiriliyor...")
            : t("app.updateAvailable", "Yeni Sürüm Mevcut")}
        </h3>

        {/* Friendly Message */}
        <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {updating
            ? t("app.updatingDesc", "Yeni sürüm indiriliyor ve kurulum başlatılıyor. Lütfen bekleyin...")
            : t("app.updateNotice", {
                version: updateInfo.latest_version,
                defaultValue: `Yeni sürüm kullanıma hazır (v${updateInfo.latest_version}).`,
              })}
        </p>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <p className="font-semibold">{errorMsg}</p>
            <p className="mt-1 text-[11px] text-rose-300/80">
              Web sayfasından kurulum dosyasını doğrudan indirebilirsiniz.
            </p>
          </div>
        )}

        {/* Release Notes */}
        {!updating && updateInfo.release_notes && (
          <div className="mt-3 max-h-28 overflow-y-auto rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] p-3 text-xs text-[var(--color-text-secondary)]">
            <p className="font-semibold text-[var(--color-text-primary)] mb-1">
              {t("app.releaseNotes", "Sürüm Notları:")}
            </p>
            <p className="whitespace-pre-line leading-relaxed font-mono text-[11px]">
              {updateInfo.release_notes}
            </p>
          </div>
        )}

        {/* Updating Animation */}
        {updating && (
          <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] py-5">
            <LoadingSpinner className="h-6 w-6 text-[var(--color-accent)] animate-spin" />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              {t("app.downloadingUpdate", "İndiriliyor ve hazırlanıyor...")}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[var(--color-app-border)] pt-4">
          {!updating && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs"
            >
              {t("app.updateDismiss", "Daha Sonra")}
            </button>
          )}

          {errorMsg ? (
            <button
              type="button"
              onClick={handleOpenReleaseWeb}
              className="btn btn-primary text-xs"
            >
              <span>{t("app.manualDownload", "Manuel İndir")}</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={updating}
              onClick={handleUpdateClick}
              className="btn btn-primary text-xs"
            >
              {updating ? (
                <>
                  <LoadingSpinner className="h-3.5 w-3.5 animate-spin" />
                  <span>{t("app.downloading", "İndiriliyor...")}</span>
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                  <span>{t("app.updateBtn", "Güncelle")}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
