import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { ArrowDownTrayIcon, CloseIcon, ExternalLinkIcon, MusicIcon } from "./icons";
import sponsorFilerawave from "../assets/sponsor_filerawave.jpg";
import sponsorFileraLabel from "../assets/sponsor_filera_label.png";

export interface AdModalProps {
  onClose: () => void;
  onConfirm: () => void;
  actionTitle?: string;
  actionDesc?: string;
  lockSeconds?: number;
}

type Sponsor =
  | {
      id: "filerawave";
      type: "image";
      image: string;
      titleKey: string;
      descKey: string;
      url: string;
      displayUrl: string;
    }
  | {
      id: "beli";
      type: "spotify";
      embedUrl: string;
      titleKey: string;
      url: string;
      displayUrl: string;
    }
  | {
      id: "chewas";
      type: "spotify";
      embedUrl: string;
      titleKey: string;
      url: string;
      displayUrl: string;
    }
  | {
      id: "senboii";
      type: "spotify";
      embedUrl: string;
      titleKey: string;
      url: string;
      displayUrl: string;
    }
  | {
      id: "filera-label";
      type: "image";
      image: string;
      titleKey: string;
      descKey: string;
      url: string;
      displayUrl: string;
    };

const SPONSORS: Sponsor[] = [
  {
    id: "filerawave",
    type: "image",
    image: sponsorFilerawave,
    titleKey: "app.sponsor1Title",
    descKey: "app.sponsor1Desc",
    url: "https://www.filerawave.com",
    displayUrl: "www.filerawave.com",
  },
  {
    id: "beli",
    type: "spotify",
    embedUrl:
      "https://open.spotify.com/embed/artist/0abGcEf1RCkROklu9iYoR7?utm_source=generator&si=3450f8f27f3b4d42",
    titleKey: "app.sponsor2Title",
    url: "https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7",
    displayUrl: "open.spotify.com",
  },
  {
    id: "chewas",
    type: "spotify",
    embedUrl:
      "https://open.spotify.com/embed/artist/2ZXaPwuVmFIhqxeQnxLNSV?utm_source=generator&si=f9ccc6e00365497f",
    titleKey: "app.sponsor3Title",
    url: "https://open.spotify.com/artist/2ZXaPwuVmFIhqxeQnxLNSV",
    displayUrl: "open.spotify.com",
  },
  {
    id: "senboii",
    type: "spotify",
    embedUrl:
      "https://open.spotify.com/embed/artist/6yTxcwdkzw4GzAwQjv036S?utm_source=generator&si=0d2b812f4e30468c",
    titleKey: "app.sponsor4Title",
    url: "https://open.spotify.com/artist/6yTxcwdkzw4GzAwQjv036S",
    displayUrl: "open.spotify.com",
  },
  {
    id: "filera-label",
    type: "image",
    image: sponsorFileraLabel,
    titleKey: "app.sponsor5Title",
    descKey: "app.sponsor5Desc",
    url: "https://www.filera.page",
    displayUrl: "www.filera.page",
  },
];

export function AdModal({
  onClose,
  onConfirm,
  actionTitle,
  actionDesc,
  lockSeconds = 5,
}: AdModalProps) {
  const { t } = useTranslation();
  const effectiveActionTitle = actionTitle || t("app.startDownload", "İndirmeyi Başlat");
  // Fixed random sponsor for this impression instance
  const [sponsor] = useState(() => SPONSORS[Math.floor(Math.random() * SPONSORS.length)]);
  const [secondsRemaining, setSecondsRemaining] = useState(lockSeconds);
  const startTimeRef = useRef<number>(Date.now());

  // Fixed countdown timer - immune to hover, re-renders or pointer events
  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, lockSeconds - elapsed);
      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [lockSeconds]);

  const handleOpenLink = (url: string) => {
    invoke("open_url", { url }).catch(() => {
      window.open(url, "_blank");
    });
  };

  const handleConfirmAction = () => {
    if (secondsRemaining > 0) return;
    onConfirm();
    onClose();
  };

  const isUnlocked = secondsRemaining <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl animate-scale-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-app-border)] pb-3">
          <div className="flex items-center gap-2">
            <span className="chip font-medium text-[10px] text-[var(--color-accent)] border-[var(--color-accent)]/20 bg-[var(--color-accent-subtle)]">
              {t("app.sponsorTag", "SPONSOR")}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {actionDesc || t("app.sponsorSupport", "Sponsorlarımızın desteğiyle sunulmaktadır")}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", "Kapat")}
            className="icon-btn h-7 w-7"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Sponsor Content Area */}
        {sponsor.type === "image" ? (
          <div className="mt-4">
            <div
              onClick={() => handleOpenLink(sponsor.url)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--color-app-border)] bg-black/40"
            >
              <img
                src={sponsor.image}
                alt={t(sponsor.titleKey, sponsor.id)}
                className="h-36 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                <span>{t(sponsor.titleKey, sponsor.id)}</span>
                <ExternalLinkIcon className="h-3 w-3 text-[var(--color-accent)]" />
              </div>
            </div>

            <div className="mt-2.5">
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t(sponsor.descKey, "")}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1DB954]/15 text-[#1DB954]">
                  <MusicIcon className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-semibold text-[var(--color-text-primary)]">
                  {t(sponsor.titleKey, "")}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => handleOpenLink(sponsor.url)}
                className="flex items-center gap-1 text-[11px] font-medium text-[#1DB954] hover:underline"
              >
                <span>Spotify</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--color-app-border)]">
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: "12px" }}
                src={sponsor.embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Action Button & Timer Area */}
        <div className="mt-5 pt-3 border-t border-[var(--color-app-border)] flex flex-col gap-2">
          {isUnlocked ? (
            <button
              type="button"
              onClick={handleConfirmAction}
              className="btn btn-primary w-full py-2.5 text-xs font-bold shadow-lg animate-pulse"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{effectiveActionTitle}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="btn btn-secondary w-full py-2.5 text-xs font-semibold opacity-60 cursor-not-allowed"
            >
              <span>
                {actionTitle} ({secondsRemaining}s)
              </span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-tertiary)] px-1">
            <span>
              {isUnlocked
                ? t("app.adReady", "Hazır! Butona basarak devam edebilirsiniz.")
                : t("app.adWait", `${secondsRemaining} saniye sonra aktifleşecek...`)}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="hover:text-[var(--color-text-secondary)] transition-colors"
            >
              {t("common.cancel", "İptal")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
