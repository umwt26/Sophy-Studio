import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { CloseIcon, ExternalLinkIcon } from "./icons";
import type { UpdateInfo } from "../types";

interface UpdateModalProps {
  updateInfo: UpdateInfo;
  onClose: () => void;
}

export function UpdateModal({ updateInfo, onClose }: UpdateModalProps) {
  const { t } = useTranslation();

  const handleOpenRelease = () => {
    invoke("open_url", { url: updateInfo.url }).catch(() => {
      window.open(updateInfo.url, "_blank");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-xl border border-[var(--color-app-border)] bg-[#181a22] p-6 shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)]"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>

        {/* Update Icon & Tag */}
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]/20 text-base text-[var(--color-accent)] shadow-inner">
            🚀
          </span>
          <span className="rounded bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[var(--color-accent)]">
            GITHUB RELEASES
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-bold text-[var(--color-text-primary)]">
          {t("app.updateAvailable", "Yeni Sürüm Mevcut!")}
        </h3>

        {/* Friendly Message */}
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t("app.updateNotice", {
            version: updateInfo.latest_version,
            defaultValue: `Aa yeni sürüm var, hadi güncelle beni! (v${updateInfo.latest_version})`,
          })}
        </p>

        {/* Release Notes Preview if present */}
        {updateInfo.release_notes && (
          <div className="mt-3 max-h-28 overflow-y-auto rounded-md border border-[var(--color-app-border)] bg-[#14161c] p-3 text-xs text-[var(--color-text-muted)]">
            <p className="font-semibold text-[var(--color-text-secondary)] mb-1">
              Yenilikler / Release Notes:
            </p>
            <p className="whitespace-pre-line leading-relaxed">
              {updateInfo.release_notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-[var(--color-app-border)]/60 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {t("app.updateDismiss", "Kapat")}
          </button>

          <button
            type="button"
            onClick={handleOpenRelease}
            className="flex items-center gap-1.5 rounded-md bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] active:bg-[#3f7fc1] shadow-[0_2px_12px_rgba(84,151,224,0.3)]"
          >
            <span>{t("app.updateBtn", "Şimdi Güncelle")}</span>
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
