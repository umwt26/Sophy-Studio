import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CheckCircleIcon, SidebarIcon, SparklesIcon, SunoPrompterIcon } from "./icons";
import { cachedReleaseNotes, fetchReleaseNotes, type ReleaseNotes } from "../utils/releaseNotes";
import { APP_VERSION, APP_VERSION_LABEL } from "../version";

// Built-in summary, only shown until the GitHub notes have been loaded once (offline first start).
const FALLBACK_ITEMS: { key: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "glass", Icon: SparklesIcon },
  { key: "sidebar", Icon: SidebarIcon },
  { key: "prompter", Icon: SunoPrompterIcon },
  { key: "fixes", Icon: CheckCircleIcon },
];

/**
 * What's new (Settings > About): the GitHub release notes of this version, written once
 * on GitHub and cached for offline use. Folded until "Show all".
 */
export const ReleaseNotesCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [notes, setNotes] = useState<ReleaseNotes | null>(cachedReleaseNotes);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void fetchReleaseNotes(APP_VERSION).then((n) => n && setNotes(n));
  }, []);

  const version = notes ? `v${notes.version}` : APP_VERSION_LABEL;
  const date = notes?.date ? new Date(notes.date).toLocaleDateString(i18n.language, { month: "long", year: "numeric" }) : "";

  return (
    <div className="section section-pad flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="section-title">{t("home.whatsNew.title", { version, defaultValue: "What's new in {{version}}" })}</p>
          <p className="section-desc">{t("home.whatsNew.subtitle", "Everything that changed in this update.")}</p>
        </div>
        {date && <span className="chip">{date}</span>}
      </div>
      {notes ? (
        <>
          <div className="release-body" data-open={open}>
            <MarkdownRenderer content={notes.body} />
          </div>
          <button type="button" className="btn btn-secondary btn-sm self-start" onClick={() => setOpen((o) => !o)}>
            {open ? t("home.showLess", "Show less") : t("home.showAll", "Show all")}
          </button>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          {FALLBACK_ITEMS.map(({ key, Icon }) => (
            <div key={key} className="flex gap-3">
              <span className="icon-tile !h-8 !w-8 !rounded-lg">
                <Icon className="!h-4 !w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.8438rem] font-semibold text-[var(--color-text-primary)]">{t(`home.whatsNew.${key}.title`)}</p>
                <p className="mt-0.5 text-[0.7812rem] leading-relaxed text-[var(--color-text-secondary)]">{t(`home.whatsNew.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
