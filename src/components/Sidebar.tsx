import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChatBubbleIcon,
  GlobeDownloadIcon,
  HomeIcon,
  PianoIcon,
  ScissorsIcon,
  SettingsIcon,
  SidebarIcon,
  SunoPrompterIcon,
  SunoDownloaderIcon,
  TagIcon,
} from "./icons";
import logoImg from "../assets/logo.png";
import type { AppTab } from "../types";

const COLLAPSED_KEY = "sophy_sidebar_collapsed";
// Below this window width the sidebar starts as an icon rail
const AUTO_COLLAPSE_WIDTH = 1000;

type IconType = React.ComponentType<{ className?: string }>;

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  updateVersion?: string;
  onOpenUpdate?: () => void;
}

function readCollapsed(): boolean {
  try {
    const saved = localStorage.getItem(COLLAPSED_KEY);
    if (saved !== null) return saved === "1";
  } catch {
    // ignore
  }
  return window.innerWidth < AUTO_COLLAPSE_WIDTH;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  updateVersion,
  onOpenUpdate,
}) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  // Follow the window size until the user picks a state themselves
  useEffect(() => {
    const onResize = () => {
      try {
        if (localStorage.getItem(COLLAPSED_KEY) !== null) return;
      } catch {
        // ignore
      }
      setCollapsed(window.innerWidth < AUTO_COLLAPSE_WIDTH);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  const groups: { label: string; items: { id: AppTab; label: string; Icon: IconType }[] }[] = [
    {
      label: t("sidebar.download", "Download"),
      items: [
        { id: "suno", label: t("nav.suno", "Suno Downloader"), Icon: SunoDownloaderIcon },
        { id: "universal", label: t("nav.universal", "Universal Downloader"), Icon: GlobeDownloadIcon },
      ],
    },
    {
      label: t("sidebar.create", "Create"),
      items: [
        { id: "prompter", label: t("nav.prompter", "Suno Style Prompter"), Icon: SunoPrompterIcon },
        { id: "sample-cutter", label: t("nav.cutter", "Sample Cutter"), Icon: ScissorsIcon },
      ],
    },
    {
      label: t("sidebar.edit", "Edit & Analyze"),
      items: [
        { id: "metadata", label: t("nav.metadata", "Metadata Editor"), Icon: TagIcon },
        { id: "detector", label: t("nav.detector", "Key & BPM Detect"), Icon: PianoIcon },
      ],
    },
  ];

  const navButton = (id: AppTab, label: string, Icon: IconType) => (
    <button
      key={id}
      type="button"
      className="nav-item"
      data-active={activeTab === id}
      onClick={() => onSelectTab(id)}
      title={collapsed ? label : undefined}
    >
      <Icon />
      <span className="sidebar-label truncate">{label}</span>
    </button>
  );

  return (
    <aside className="sidebar" data-collapsed={collapsed}>
      <div className="sidebar-brand">
        <button
          type="button"
          onClick={() => onSelectTab("home")}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
          title="Sophy Studio"
        >
          <img src={logoImg} alt="" className="sidebar-logo" />
          <span className="sidebar-label min-w-0 text-[0.9375rem] font-semibold text-[var(--color-text-primary)] truncate">
            Sophy Studio
          </span>
        </button>
        <button
          type="button"
          onClick={toggle}
          className="icon-btn sidebar-hide shrink-0"
          aria-label={t("sidebar.collapse", "Collapse sidebar")}
          title={t("sidebar.collapse", "Collapse sidebar")}
        >
          <SidebarIcon />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
        {collapsed && (
          <button
            type="button"
            onClick={toggle}
            className="nav-item mb-1"
            aria-label={t("sidebar.expand", "Expand sidebar")}
            title={t("sidebar.expand", "Expand sidebar")}
          >
            <SidebarIcon />
          </button>
        )}
        {navButton("home", t("nav.home", "Home"), HomeIcon)}
        {groups.map((group) => (
          <div key={group.label}>
            <p className="sidebar-section">{group.label}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => navButton(item.id, item.label, item.Icon))}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-[var(--color-app-border-soft)] p-3">
        {updateVersion && (
          <button
            type="button"
            className="nav-item text-[var(--color-accent)]"
            onClick={onOpenUpdate}
            title={t("app.updateNotice", { version: updateVersion })}
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center shrink-0">
              <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            <span className="sidebar-label truncate">
              {t("sidebar.updateAvailable", { version: updateVersion, defaultValue: "Update to v{{version}}" })}
            </span>
          </button>
        )}
        {navButton("feedback", t("feedback.drawerButton", "Send Feedback"), ChatBubbleIcon)}
        {navButton("settings", t("nav.settings", "Settings"), SettingsIcon)}
      </div>
    </aside>
  );
};
