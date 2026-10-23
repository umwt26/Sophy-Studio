import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { CloseIcon, ExternalLinkIcon, MusicIcon } from "./icons";
import sponsorFilerawave from "../assets/sponsor_filerawave.jpg";
import sponsorFileraLabel from "../assets/sponsor_filera_label.png";

interface AdModalProps {
  onClose: () => void;
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

const AUTO_CLOSE_MS = 10000;

export function AdModal({ onClose }: AdModalProps) {
  const { t } = useTranslation();
  const [sponsor] = useState(() => SPONSORS[Math.floor(Math.random() * SPONSORS.length)]);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_CLOSE_MS) * 100);
      setProgress(remaining);

      if (elapsed >= AUTO_CLOSE_MS) {
        clearInterval(interval);
        onClose();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onClose]);

  const handleOpenLink = (url: string) => {
    invoke("open_url", { url }).catch(() => {
      window.open(url, "_blank");
    });
  };

  return (
    <div className="fixed right-5 top-16 z-50 w-full max-w-[340px] animate-slide-in-right sm:right-6">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-app-border)] pb-2.5">
          <span className="chip font-medium text-[10px] text-[var(--color-accent)] border-[var(--color-accent)]/20 bg-[var(--color-accent-subtle)]">
            {t("app.sponsorTag", "SPONSOR")}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close", "Kapat")}
            className="flex h-6 w-6 items-center justify-center rounded-lg border border-[var(--color-app-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>

        {/* Sponsor Content */}
        {sponsor.type === "image" ? (
          <div className="mt-3">
            {/* Clickable Image Banner */}
            <div
              onClick={() => handleOpenLink(sponsor.url)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--color-app-border)] bg-black/40"
            >
              <img
                src={sponsor.image}
                alt={t(sponsor.titleKey, sponsor.id)}
                className="h-32 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                <span>{t(sponsor.titleKey, sponsor.id)}</span>
                <ExternalLinkIcon className="h-3 w-3 text-[var(--color-accent)]" />
              </div>
            </div>

            {/* Description & Link */}
            <div className="mt-2.5">
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t(sponsor.descKey, "")}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--color-app-border)] pt-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenLink(sponsor.url)}
                  className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline"
                >
                  <span>{sponsor.displayUrl}</span>
                  <ExternalLinkIcon className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenLink(sponsor.url)}
                  className="btn btn-primary text-xs px-3 py-1"
                >
                  {t("app.sponsorCta", "Ziyaret Et")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Spotify Artist Embed */
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1DB954]/15 text-[#1DB954]">
                <MusicIcon className="h-3.5 w-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-[var(--color-text-primary)]">
                {t(sponsor.titleKey, "")}
              </h4>
            </div>

            {/* Spotify Embed Player */}
            <div className="mt-2 overflow-hidden rounded-xl border border-[var(--color-app-border)]">
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: "12px" }}
                src={sponsor.embedUrl}
                width="100%"
                height="320"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full"
              />
            </div>

            {/* Link & Spotify CTA */}
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[var(--color-app-border)] pt-2.5">
              <button
                type="button"
                onClick={() => handleOpenLink(sponsor.url)}
                className="flex items-center gap-1 text-xs font-medium text-[#1DB954] hover:underline"
              >
                <span>{sponsor.displayUrl}</span>
                <ExternalLinkIcon className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenLink(sponsor.url)}
                className="btn text-xs px-3 py-1 font-semibold text-black bg-[#1DB954] hover:brightness-110"
              >
                <span>{t("app.openInSpotify", "Spotify'da Dinle")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Linear Progress Countdown Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-app-surface-2)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
