// the dev build talks to the local website preview (npm run preview, port 3200)
export const SITE = import.meta.env.DEV ? "http://localhost:3200" : "https://sophy.beli26.xyz";
const PUBLIC_SITE = "https://sophy.beli26.xyz";

const SITE_LANGS = ["en", "tr", "de", "es", "fr", "pt", "ru", "ja"];
export const siteLang = (lang: string) => {
  const l = lang.toLowerCase().split("-")[0];
  return SITE_LANGS.includes(l) ? l : "en";
};
export const siteUrl = (lang: string, path = "") => `${PUBLIC_SITE}/${siteLang(lang)}/${path}`;

/** Error codes the site returns, plus "offline" when it can't be reached. */
export type SendLinkError = "bad_name" | "bad_email" | "too_many" | "offline" | "failed";

/** Asks the website to email the download link for the other platform (Resend, from sophy@beli26.xyz). */
export async function sendDownloadLink(opts: { name: string; email: string; platform: "android" | "windows"; lang: string }): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${SITE}/api/send-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...opts, lang: siteLang(opts.lang), source: "desktop-app" }),
    });
  } catch {
    throw "offline" as SendLinkError;
  }
  const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (res.ok && j.ok) return;
  throw (["bad_name", "bad_email", "too_many"].includes(j.error ?? "") ? j.error : "failed") as SendLinkError;
}
