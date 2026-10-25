import React from "react";
import { useTranslation } from "react-i18next";
import {
  GlobeDownloadIcon,
  PianoIcon,
  ScissorsIcon,
  SunoDownloaderIcon,
  TagIcon,
  ChevronRightIcon,
  SparklesIcon,
  SunoPrompterIcon,
  ArrowDownTrayIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterXIcon,
  YouTubeIcon,
  SpotifyIcon,
  GitHubIcon,
  DiscordIcon,
  SidebarIcon,
  PaletteIcon,
  UserIcon,
  SettingsIcon,
  DocumentTextIcon,
  BoltIcon,
  CheckCircleIcon,
  ChatBubbleIcon,
} from "./icons";
import type { AppTab } from "../types";
import { APP_VERSION_LABEL } from "../version";

interface HomePageProps {
  onNavigate: (tab: AppTab) => void;
}

// "What's new" entries for the current version; texts live in home.whatsNew.<key>.
// Rewrite these (all 8 locales + .github/release-notes.md) with every release.
const RELEASE_ITEMS: { key: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "layout", Icon: SidebarIcon },
  { key: "themes", Icon: PaletteIcon },
  { key: "accessibility", Icon: UserIcon },
  { key: "settings", Icon: SettingsIcon },
  { key: "feedback", Icon: ChatBubbleIcon },
  { key: "motion", Icon: SparklesIcon },
  { key: "sponsors", Icon: ArrowDownTrayIcon },
  { key: "icons", Icon: SunoDownloaderIcon },
  { key: "font", Icon: DocumentTextIcon },
  { key: "performance", Icon: BoltIcon },
  { key: "fixes", Icon: CheckCircleIcon },
];

type Tool = {
  id: AppTab;
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  tags: string[];
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const groups: { label: string; tools: Tool[] }[] = [
    {
      label: t("sidebar.download", "Download"),
      tools: [
        {
          id: "suno",
          title: t("home.sunoTitle", "Suno Downloader"),
          desc: t("home.sunoDesc", "Download Suno AI tracks in studio 320k MP3, lossless WAV, original audio stream, cover art and lyrics."),
          Icon: SunoDownloaderIcon,
          tags: ["MP3", "WAV", t("home.tagLyrics", "Lyrics")],
        },
        {
          id: "universal",
          title: t("home.universalTitle", "Universal Media Downloader"),
          desc: t("home.universalDesc", "Download MP4 video and MP3 audio from Instagram, YouTube, TikTok, Facebook, Twitter/X and more in one click."),
          Icon: GlobeDownloadIcon,
          tags: ["YouTube", "TikTok", "MP4 / MP3"],
        },
      ],
    },
    {
      label: t("sidebar.create", "Create"),
      tools: [
        {
          id: "prompter",
          title: t("home.prompterTitle", "Suno Style Prompter"),
          desc: t("home.prompterDesc", "Describe a song in any language and get ready-to-paste Suno style tags and a song structure. Works offline."),
          Icon: SunoPrompterIcon,
          tags: [t("home.tagStructure", "Structure"), t("home.tagOffline", "Offline")],
        },
        {
          id: "sample-cutter",
          title: t("home.cutterTitle", "Sample Cutter (8s)"),
          desc: t("home.cutterDesc", "Trim seamless 8-second audio samples from your tracks for Suno and music production."),
          Icon: ScissorsIcon,
          tags: ["8s", "MP3", "WAV"],
        },
      ],
    },
    {
      label: t("sidebar.edit", "Edit & Analyze"),
      tools: [
        {
          id: "metadata",
          title: t("home.metadataTitle", "Metadata Editor"),
          desc: t("home.metadataDesc", "Edit song title, artist, album, year, and embed high-resolution album cover art directly into audio files."),
          Icon: TagIcon,
          tags: ["ID3", t("home.tagCoverArt", "Cover Art")],
        },
        {
          id: "detector",
          title: t("home.detectorTitle", "Key & BPM Detect"),
          desc: t("home.detectorDesc", "Harmonic analysis to accurately detect musical key (Camelot wheel) and tempo (BPM) in seconds."),
          Icon: PianoIcon,
          tags: ["Camelot", "BPM"],
        },
      ],
    },
  ];

  const socialLinks = [
    { label: "Instagram (@umw26t)", href: "https://www.instagram.com/umw26t/", Icon: InstagramIcon },
    { label: "Instagram (@_beli26)", href: "https://www.instagram.com/_beli26/", Icon: InstagramIcon },
    { label: "TikTok (@belionthebeat)", href: "https://www.tiktok.com/@belionthebeat", Icon: TikTokIcon },
    { label: "X / Twitter (@_beli26)", href: "https://x.com/_beli26", Icon: TwitterXIcon },
    { label: "YouTube (@beli26)", href: "https://www.youtube.com/@beli26", Icon: YouTubeIcon },
    { label: "Spotify (Beli!)", href: "https://open.spotify.com/intl-tr/artist/0abGcEf1RCkROklu9iYoR7", Icon: SpotifyIcon },
    { label: "GitHub (@umwt26)", href: "https://github.com/umwt26", Icon: GitHubIcon },
    { label: "Discord", href: "https://discord.gg/vwzjuhnpyP", Icon: DiscordIcon },
  ];

  const tips = [
    t("home.tipDragDrop", "You can drag and drop audio files directly into the window."),
    t("home.tipCoverArt", "Use JPG or PNG images as album cover artwork in the metadata editor."),
    t("home.tipOffline", "All analysis and conversions run locally on your device without internet upload."),
  ];

  return (
    <div className="page stagger pb-8">
      <div className="min-w-0">
        <h1 className="page-title">Sophy Studio</h1>
        <p className="page-desc max-w-2xl">
          {t("home.heroSubtitle", "Clean desktop toolkit for AI audio downloads, media capture, 8s sample slicing, metadata editing, and Key & BPM analysis.")}
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2.5">
          <p className="eyebrow">{group.label}</p>
          <div className="stagger grid grid-cols-1 lg:grid-cols-2 gap-3">
            {group.tools.map(({ id, title, desc, Icon, tags }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="tool-card group section flex items-start gap-3.5 p-4 text-left cursor-pointer"
              >
                <span className="icon-tile">
                  <Icon />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="tool-card-title text-[0.9062rem] font-semibold text-[var(--color-text-primary)] transition-colors">{title}</span>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
                  </span>
                  <span className="text-[0.7812rem] leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">{desc}</span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="section section-pad flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="section-title">
              {t("home.whatsNew.title", { version: APP_VERSION_LABEL, defaultValue: "What's new in {{version}}" })}
            </p>
            <p className="section-desc">{t("home.whatsNew.subtitle", "Everything that changed in this update.")}</p>
          </div>
          <span className="chip">{t("home.releaseMonth", "October 2026")}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          {RELEASE_ITEMS.map(({ key, Icon }) => (
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
      </div>

      <div className="flex flex-col gap-3">
        <div className="section section-pad flex flex-col gap-3">
          <p className="section-title">{t("home.workflowTitle", "Tips & Shortcuts")}</p>
          <ul className="flex flex-col gap-2.5">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-[0.7812rem] leading-relaxed text-[var(--color-text-secondary)]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--color-app-border-soft)] pt-4 text-xs text-[var(--color-text-secondary)]">
        <p>
          <span className="font-semibold text-[var(--color-text-primary)]">Sophy Studio</span> © 2026{" "}
          <span className="font-semibold text-[var(--color-accent)]">Beli!</span>
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {socialLinks.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label} className="icon-btn h-8 w-8">
              <Icon className="!h-4 !w-4" />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};
