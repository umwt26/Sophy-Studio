import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { ChatBubbleIcon, SendIcon, AlertCircleIcon, SparklesIcon, CheckCircleIcon, CheckIcon } from "./icons";
import { PageHeader } from "./PageHeader";
import { APP_VERSION_LABEL } from "../version";

interface FeedbackPageProps {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

// The category value is sent to the backend as is; keep these strings stable.
const CATEGORIES = [
  { value: "Hata / Sorun Bildir", labelKey: "feedback.typeBug", fallback: "Report a Bug / Issue", descKey: "feedback.typeBugDesc", descFallback: "Something does not work or behaves oddly.", Icon: AlertCircleIcon },
  { value: "Öneri / Fikir", labelKey: "feedback.typeIdea", fallback: "Suggestion / Idea", descKey: "feedback.typeIdeaDesc", descFallback: "A feature or improvement you would like.", Icon: SparklesIcon },
  { value: "Diğer", labelKey: "feedback.typeOther", fallback: "Other", descKey: "feedback.typeOtherDesc", descFallback: "Anything else you want to tell us.", Icon: ChatBubbleIcon },
];

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onShowToast }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(t("feedback.errEmptyMessage", "Please enter a message or description."));
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await invoke<string>("send_feedback", {
        category,
        name: name.trim(),
        email: email.trim(),
        message: `${message.trim()}\n\n--\nSophy Studio ${APP_VERSION_LABEL}`,
      });
      onShowToast(
        res === "activation_needed"
          ? t("feedback.activationSent", "Feedback sent! Thank you.")
          : t("feedback.successToast", "Your feedback has been successfully sent, thank you!")
      );
      setMessage("");
      setSent(true);
    } catch (err: any) {
      console.error("Feedback submit error:", err);
      setError(t("feedback.errFailed", "Failed to send: ") + (err?.toString() || ""));
    } finally {
      setSending(false);
    }
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(`[Sophy Studio ${APP_VERSION_LABEL}] ${category} - ${name || t("feedback.anonymousUser", "User")}`);
    const body = encodeURIComponent(
      `Bildirim Türü: ${category}\nAd Soyad: ${name}\nE-posta: ${email}\nMesaj:\n${message}\n\n--\nSophy Studio ${APP_VERSION_LABEL}`
    );
    window.open(`mailto:umutszg46@gmail.com?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="page pb-10">
      <PageHeader
        Icon={ChatBubbleIcon}
        title={t("feedback.title", "Send Feedback")}
        desc={t("feedback.subtitle", "Directly submit your suggestions, feedback, or report bugs.")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
        {sent ? (
          <div className="section section-pad flex flex-col items-center gap-3 py-14 text-center animate-fade-up">
            <span className="icon-tile !h-14 !w-14 !rounded-2xl">
              <CheckCircleIcon className="!h-7 !w-7" />
            </span>
            <p className="text-[1.0625rem] font-semibold text-[var(--color-text-primary)]">{t("feedback.successTitle", "Thank you!")}</p>
            <p className="max-w-sm text-[0.8125rem] text-[var(--color-text-secondary)]">
              {t("feedback.successBody", "Your message has been sent. Every note is read and helps shape the next update.")}
            </p>
            <button type="button" className="btn btn-secondary mt-2" onClick={() => setSent(false)}>
              {t("feedback.sendAnother", "Send another")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="section stagger flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <span className="field-label !mb-0">{t("feedback.labelType", "Subject / Notification Type")}</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ value, labelKey, fallback, Icon }) => {
                  const active = category === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={sending}
                      onClick={() => setCategory(value)}
                      data-active={active}
                      className="lang-card !gap-2.5 !py-2.5 !pl-3 !pr-2.5"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      <span className="whitespace-nowrap text-left text-[0.8125rem] text-[var(--color-text-primary)]">{t(labelKey, fallback)}</span>
                      <span className="radio-dot !h-4 !w-4" data-active={active}>
                        {active && <CheckIcon className="h-2.5 w-2.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {(() => {
                const selected = CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
                return (
                  <p key={selected.value} className="setting-hint animate-fade-up">
                    {t(selected.descKey, selected.descFallback)}
                  </p>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="field-label">{t("feedback.labelName", "Full Name")}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={sending}
                  placeholder={t("feedback.placeholderName", "e.g. Jack Smith")}
                  className="input"
                />
              </label>
              <label className="flex flex-col">
                <span className="field-label">{t("feedback.labelEmail", "Email Address")}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sending}
                  placeholder={t("feedback.placeholderEmail", "name@example.com")}
                  className="input"
                />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="field-label">{t("feedback.labelMessage", "Message / Description")} *</span>
              <textarea
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                placeholder={t("feedback.placeholderMessage", "Describe your feedback, the issue you faced, or a new feature request...")}
                className="input resize-y py-2.5 min-h-[160px]"
              />
              <span className="mt-1.5 self-end font-mono text-[0.6875rem] text-[var(--color-text-muted)]">{message.length}</span>
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-[10px] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-3 text-[0.75rem] text-[var(--color-danger)] animate-fade-up">
                <AlertCircleIcon className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleOpenMailto}
                className="text-[0.75rem] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] underline underline-offset-4"
              >
                {t("feedback.orMailto", "or send via default email app")}
              </button>
              <button type="submit" disabled={sending} className="btn btn-primary w-full sm:w-auto px-6">
                {sending ? <span className="spinner !h-4 !w-4 !border-[var(--color-accent-fg)] !border-t-transparent" /> : <SendIcon />}
                <span>{sending ? t("feedback.sending", "Sending...") : t("feedback.sendBtn", "Send")}</span>
              </button>
            </div>
          </form>
        )}

        <aside className="section section-pad flex flex-col gap-3">
          <p className="section-title">{t("feedback.tipsTitle", "Helpful details")}</p>
          <ul className="flex flex-col gap-2.5">
            {[
              t("feedback.tip1", "Which tool you were using and what you clicked."),
              t("feedback.tip2", "What you expected and what happened instead."),
              t("feedback.tip3", "The link or file type, if a download or edit failed."),
            ].map((tip) => (
              <li key={tip} className="flex gap-2.5 text-[0.7812rem] leading-relaxed text-[var(--color-text-secondary)]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="divider my-1" />
          <p className="text-[0.75rem] leading-relaxed text-[var(--color-text-muted)]">
            {t("feedback.privacyNote", "Name and email are optional; add them only if you would like a reply. The app version ({{version}}) is included automatically.", { version: APP_VERSION_LABEL })}
          </p>
        </aside>
      </div>
    </div>
  );
};
