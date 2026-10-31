import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { PageHeader } from "./PageHeader";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  RefreshIcon,
  ScissorsIcon,
  SendIcon,
  SunoPrompterIcon,
} from "./icons";
import phoneShot from "../assets/m-home.webp";
import logoImg from "../assets/logo.png";
import { sendDownloadLink, siteUrl, type SendLinkError } from "../utils/sendLink";

interface MobileAppPageProps {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

const openUrl = (url: string) => {
  invoke("open_url", { url }).catch(() => window.open(url, "_blank"));
};

/** Introduces the Android app and emails its download link through the website (Resend). */
export const MobileAppPage: React.FC<MobileAppPageProps> = ({ onShowToast }) => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<"intro" | "form" | "sent">("intro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errors: Record<SendLinkError, string> = {
    bad_name: t("sendLink.errName", "Please write your name."),
    bad_email: t("sendLink.errEmail", "That email address doesn't look right."),
    too_many: t("sendLink.errTooMany", "Too many requests. Try again later."),
    offline: t("sendLink.errOffline", "No connection. Check your internet and try again."),
    failed: t("sendLink.errFailed", "The mail couldn't be sent. Try again in a moment."),
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError(errors.bad_name);
    if (!/^\S+@\S+\.\S{2,}$/.test(email.trim())) return setError(errors.bad_email);
    setSending(true);
    setError(null);
    try {
      await sendDownloadLink({ name: name.trim(), email: email.trim(), platform: "android", lang: i18n.language });
      setView("sent");
      onShowToast(t("sendLink.sentTitle", "Check your inbox"));
    } catch (err) {
      setError(errors[err as SendLinkError] ?? errors.failed);
    } finally {
      setSending(false);
    }
  };

  const features = [
    { Icon: SendIcon, title: t("mobileApp.f1t", "Share to download"), desc: t("mobileApp.f1d", "") },
    { Icon: SunoPrompterIcon, title: t("mobileApp.f2t", "Suno and the Prompter"), desc: t("mobileApp.f2d", "") },
    { Icon: ScissorsIcon, title: t("mobileApp.f3t", "Cut, tag, analyse"), desc: t("mobileApp.f3d", "") },
    { Icon: RefreshIcon, title: t("mobileApp.f4t", "Updates together"), desc: t("mobileApp.f4d", "") },
  ];

  return (
    <div className="page pb-10">
      <PageHeader Icon={PhoneIcon} title={t("mobileApp.title", "Sophy Studio for Android")} desc={t("mobileApp.subtitle", "")} />

      {/* both cards share the row height: the text card and the phone card line up */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-stretch">
        {view === "intro" && (
          <section key="intro" className="section stagger flex h-full flex-col gap-5 p-5">
            <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-primary)] max-w-[60ch]">{t("mobileApp.lead", "")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-3 rounded-[14px] border border-[var(--color-app-border-soft)] bg-[var(--color-app-surface-2)] p-3.5">
                  <span className="icon-tile !h-9 !w-9 shrink-0">
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.875rem] font-semibold text-[var(--color-text-primary)]">{title}</p>
                    <p className="mt-0.5 text-[0.78rem] leading-relaxed text-[var(--color-text-secondary)]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider mt-auto" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="setting-label">{t("mobileApp.sendTitle", "Send it to my email")}</p>
                <p className="setting-hint">{t("mobileApp.sendDesc", "")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary" onClick={() => setView("form")}>
                  <MailIcon />
                  <span>{t("mobileApp.sendBtn", "Email me the link")}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {view === "form" && (
          <form key="form" onSubmit={submit} className="section stagger flex h-full flex-col gap-5 p-5" noValidate>
            <div className="flex items-start gap-3">
              <button type="button" className="icon-btn shrink-0" onClick={() => setView("intro")} aria-label={t("sendLink.back", "Back")}>
                <ChevronLeftIcon />
              </button>
              <div className="min-w-0">
                <h2 className="text-[1.0625rem] font-semibold text-[var(--color-text-primary)]">{t("sendLink.formTitle", "Where should we send it?")}</h2>
                <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-secondary)]">{t("sendLink.formDescAndroid", "")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="field-label">{t("sendLink.name", "Name and surname")}</span>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} disabled={sending} autoComplete="name" maxLength={80} placeholder={t("sendLink.namePh", "")} autoFocus />
              </label>
              <label className="flex flex-col">
                <span className="field-label">{t("sendLink.email", "Email address")}</span>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={sending} autoComplete="email" placeholder={t("sendLink.emailPh", "")} />
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-[10px] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-3 text-[0.75rem] text-[var(--color-danger)] animate-fade-up">
                <AlertCircleIcon className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <MailPreview name={name} email={email} />

            <div className="mt-auto flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[0.75rem] text-[var(--color-text-muted)]">{t("sendLink.privacy", "")}</p>
              <button type="submit" disabled={sending} className="btn btn-primary px-6">
                {sending ? <span className="spinner !h-4 !w-4 !border-[var(--color-accent-fg)] !border-t-transparent" /> : <SendIcon />}
                <span>{sending ? t("sendLink.sending", "Sending…") : t("sendLink.send", "Send the link")}</span>
              </button>
            </div>
          </form>
        )}

        {view === "sent" && (
          <section key="sent" className="section section-pad flex h-full flex-col items-center justify-center gap-3 py-14 text-center animate-fade-up">
            <span className="icon-tile !h-14 !w-14 !rounded-2xl">
              <CheckCircleIcon className="!h-7 !w-7" />
            </span>
            <p className="text-[1.0625rem] font-semibold text-[var(--color-text-primary)]">{t("sendLink.sentTitle", "Check your inbox")}</p>
            <p className="max-w-sm text-[0.8125rem] text-[var(--color-text-secondary)]">{t("sendLink.sentBody", { email: email.trim() })}</p>
            <button type="button" className="btn btn-secondary mt-2" onClick={() => setView("form")}>
              {t("sendLink.again", "Send to another address")}
            </button>
          </section>
        )}

        <aside className="section flex h-full flex-col items-center justify-center gap-3 p-4">
          <div className="phone-frame">
            <img src={phoneShot} alt="" className="block h-auto w-full" />
          </div>
          <span className="chip">{t("mobileApp.req", "Android 8.0 or newer · Free")}</span>
        </aside>
      </div>

      <WebsiteCard />
    </div>
  );
};

/** The website (sophy.beli26.xyz): downloads, release notes and the blog. */
export const WebsiteCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="section setting-list">
      <div className="setting-row flex-wrap">
      <div className="flex items-center gap-3.5 min-w-0">
        <span className="icon-tile shrink-0">
          <GlobeIcon />
        </span>
        <div className="min-w-0">
          <p className="setting-label">{t("website.title", "Sophy Studio on the web")}</p>
          <p className="setting-hint">{t("website.desc", "Downloads, release notes and the blog live on sophy.beli26.xyz.")}</p>
        </div>
      </div>
      <button type="button" className="btn btn-secondary shrink-0" onClick={() => openUrl(siteUrl(i18n.language))}>
        <span>sophy.beli26.xyz</span>
        <ExternalLinkIcon />
      </button>
      </div>
    </div>
  );
};

/** What arrives in the inbox: a small copy of the real mail, greeting the name being typed. */
const MailPreview: React.FC<{ name: string; email: string }> = ({ name, email }) => {
  const { t } = useTranslation();
  // the name fills in as it is typed; "…" until then (works in every language)
  const first = name.trim().split(/\s+/)[0] || "…";
  return (
    <div className="rounded-[16px] border border-[var(--color-app-border-soft)] bg-[var(--color-app-surface-2)] p-4">
      <p className="eyebrow mb-3">{t("sendLink.previewTitle", "Your inbox")}</p>
      <div className="flex items-center gap-3 border-b border-[var(--color-app-border-soft)] pb-3">
        <img src={logoImg} alt="" className="h-9 w-9 shrink-0 rounded-[10px] object-contain" />
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline justify-between gap-2 text-[0.8125rem]">
            <span className="font-semibold text-[var(--color-text-primary)]">Sophy Studio</span>
            <span className="shrink-0 text-[0.6875rem] text-[var(--color-text-muted)]">{t("sendLink.previewNow", "now")}</span>
          </p>
          <p className="truncate text-[0.75rem] text-[var(--color-text-secondary)]">
            sophy@beli26.xyz → {email.trim() || "name@example.com"}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[0.8125rem] font-semibold text-[var(--color-text-primary)]">{t("sendLink.previewSubject", "Sophy Studio for Android: your download link")}</p>
      <p className="mt-2 text-[0.8125rem] text-[var(--color-text-primary)]">{t("sendLink.previewHi", { name: first, defaultValue: "Hi {{name}}," })}</p>
      <p className="mt-1 text-[0.78rem] leading-relaxed text-[var(--color-text-secondary)]">{t("sendLink.previewBody", "Here is Sophy Studio for your phone. Open this mail on your Android phone and tap the button.")}</p>
      <span className="mt-3 inline-flex items-center rounded-[12px] bg-[var(--color-accent)] px-4 py-2 text-[0.78rem] font-semibold text-[var(--color-accent-fg)]">
        {t("sendLink.previewButton", "Download for Android")}
      </span>
    </div>
  );
};
