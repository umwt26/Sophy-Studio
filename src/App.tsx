import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type Event } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./components/HomePage";
import { SunoDownloaderPage } from "./components/SunoDownloaderPage";
import { UniversalDownloaderPage } from "./components/UniversalDownloaderPage";
import { MetadataEditorPage } from "./components/MetadataEditorPage";
import { SunoPrompterPage } from "./components/SunoPrompterPage";
import { KeyBpmDetectPage } from "./components/KeyBpmDetectPage";
import { SampleCutterPage } from "./components/SampleCutterPage";
import { SettingsPage } from "./components/SettingsPage";
import { AudioFormatModal } from "./components/AudioFormatModal";
import { FeedbackPage } from "./components/FeedbackPage";
import { MobileAppPage } from "./components/MobileAppPage";
import { SunoHistoryDrawer } from "./components/SunoHistoryDrawer";
import { AdModal } from "./components/AdModal";
import { UpdateModal } from "./components/UpdateModal";
import { clearUpdateAttempt, readUpdateAttempt } from "./utils/updateAttempt";
import { Toast, type ToastKind } from "./components/Toast";
import { applyTheme, loadSavedTheme } from "./utils/theme";
import type { AppTab, AudioFormat, SongClip, SongData, UpdateInfo } from "./types";

const HISTORY_STORAGE_KEY = "sophy_search_history";

function formatDuration(sec?: number): string {
  if (sec == null || isNaN(sec)) return "";
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppTab>("home");

  // Texts for the update toast that the background check shows while the app is closed
  useEffect(() => {
    invoke("save_notify_texts", {
      title: t("notify.updateTitle", { version: "{version}", defaultValue: "Sophy Studio {{version}} is out" }),
      body: t("notify.updateBodyDesktop", "Click to see what's new and update."),
    }).catch(() => {});
  }, [i18n.language, t]);
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [sunoDrawerOpen, setSunoDrawerOpen] = useState(false);

  // Ad interstitial modal state for Suno downloads
  const [pendingSunoFormat, setPendingSunoFormat] = useState<
    "mp3" | "wav" | "cover" | "lyrics" | "all" | "original" | null
  >(null);
  const [adModalOpen, setAdModalOpen] = useState(false);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updatePreviouslyFailed, setUpdatePreviouslyFailed] = useState(false);
  const [history, setHistory] = useState<SongData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastKind, setToastKind] = useState<ToastKind>("success");
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize theme on app mount
  useEffect(() => {
    // theme, zoom and glass are already applied in main.tsx before the first paint
    // "Follow Windows" mode reacts to OS theme changes while the app is open
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const config = loadSavedTheme();
      if (config.mode === "system") applyTheme(config);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Check for updates from GitHub in the background
  useEffect(() => {
    invoke<UpdateInfo>("check_for_updates")
      .then((res) => {
        const attempt = readUpdateAttempt();
        if (res && res.has_update) {
          // Loop guard: if we already launched the installer for this exact version
          // and the app is still on the same old version, the install did not apply.
          // Show the manual path instead of silently re-running the same installer.
          setUpdatePreviouslyFailed(
            !!attempt &&
              attempt.target === res.latest_version &&
              attempt.from === res.current_version
          );
          setUpdateInfo(res);
          setUpdateModalOpen(true);
        } else if (attempt) {
          clearUpdateAttempt();
        }
      })
      .catch((e) => {
        console.debug("Update check:", e);
      });
  }, []);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load search history", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (items: SongData[]) => {
    setHistory(items);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist search history", e);
    }
  };

  const addToHistory = (newSong: SongData) => {
    const songId = newSong.clip?.id;
    const filtered = history.filter((item) => {
      if (songId && item.clip?.id) {
        return item.clip.id !== songId;
      }
      return item.title !== newSong.title;
    });
    const updated = [newSong, ...filtered].slice(0, 40);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
    showToast(t("app.clearHistory", "Geçmiş temizlendi."));
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter(
      (item, idx) => (item.clip?.id || item.title + idx) !== id
    );
    saveHistory(updated);
  };

  const handleSelectHistorySong = (selected: SongData) => {
    setSong(selected);
    setSunoDrawerOpen(false);
    setActiveTab("suno");
    showToast(`${t("app.loadSong", "Yüklendi")}: ${selected.title}`);
  };

  useEffect(() => {
    const unlisten = listen("download-status", (event: Event<string>) => {
      showToast(event.payload);
    });
    return () => {
      unlisten.then((f: () => void) => f());
    };
  }, []);

  const showToast = (message: string, kind: ToastKind = "success") => {
    setToastMessage(message);
    setToastKind(kind);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastMessage(null), kind === "error" ? 6000 : 3400);
  };

  const handleFetch = async (url: string) => {
    const trimmed = url.trim();

    if (!trimmed) {
      showToast(t("app.errorEmptyLink", "Lütfen bir Suno şarkı linki girin."));
      return;
    }

    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const isSunoUrl = /suno\.(com|ai)/i.test(trimmed);
    if (!isSunoUrl && !uuidRegex.test(trimmed)) {
      showToast(t("app.errorInvalidLink", "Lütfen geçerli bir Suno şarkı linki girin."));
      return;
    }

    setLoading(true);
    setSong(null);

    try {
      const clip = await invoke<SongClip>("resolve_song", { input: trimmed });
      const mappedSong: SongData = {
        title: clip.title || "Untitled Track",
        artist: `${clip.display_name || "Unknown Artist"} ${clip.handle ? `(@${clip.handle})` : ""}`,
        duration: formatDuration(clip.duration),
        createdAt: clip.major_model_version ? clip.major_model_version.toUpperCase() : "Suno AI",
        genres: clip.tags
          ? clip.tags.split(",").map((g) => g.trim()).filter(Boolean).slice(0, 5)
          : ["AI Music"],
        coverUrl: clip.image_large_url || clip.image_url,
        lyrics: clip.prompt || "(No lyrics / Instrumental track)",
        clip,
      };
      setSong(mappedSong);
      addToHistory(mappedSong);
    } catch (err: any) {
      const errMsg = err?.toString?.() || "";
      if (errMsg.includes("404") || errMsg.toLowerCase().includes("not found")) {
        showToast(t("app.errorNotFound", "Şarkı bulunamadı. Silinmiş veya gizli olabilir."));
      } else {
        showToast(t("app.errorFetchFailed", "Şarkı bilgileri alınamadı. Bağlantıyı kontrol edin."));
      }
    } finally {
      setLoading(false);
    }
  };

  // User selects format to download -> open 5s Ad Interstitial Modal first
  const requestDownload = (format: "mp3" | "wav" | "cover" | "lyrics" | "all" | "original") => {
    if (!song) return;
    setPendingSunoFormat(format);
    setAdModalOpen(true);
  };

  const executeDownload = async (format: "mp3" | "wav" | "cover" | "lyrics" | "all" | "original") => {
    if (!song) return;

    setDownloading(true);
    try {
      const savedPath = await invoke<string>("download_media", {
        clip: song.clip,
        targetFormat: format === "original" ? "m4a" : format,
      });
      showToast(`Kaydedildi: ${savedPath.split(/[\\/]/).pop()}`);
    } catch (err: any) {
      showToast(`${t("universal.downloadError", "Download failed")}: ${err.toString()}`, "error");
    } finally {
      setDownloading(false);
      setPendingSunoFormat(null);
    }
  };

  const handleAudioFormatSelect = (format: AudioFormat) => {
    setAudioModalOpen(false);
    requestDownload(format);
  };

  const handleOpenFolder = async () => {
    try {
      await invoke("open_sophy_folder");
    } catch (err: any) {
      showToast(`Klasör açılamadı: ${err.toString()}`);
    }
  };

  const getFormatActionTitle = (format: string | null) => {
    if (format === "cover") return t("app.sponsorActions.cover", "Download Cover Art");
    if (format === "lyrics") return t("app.sponsorActions.lyrics", "Download Lyrics");
    if (format === "all") return t("app.sponsorActions.all", "Download All (.zip)");
    if (format === "mp3") return t("app.sponsorActions.mp3", "Download as MP3 (320k)");
    if (format === "wav") return t("app.sponsorActions.wav", "Download Lossless WAV");
    if (format === "original") return t("app.sponsorActions.original", "Download Original Audio");
    return t("app.startDownload", "Start Download");
  };

  return (
    <div className="app-shell text-[var(--color-text-primary)]">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        updateVersion={updateInfo?.has_update ? updateInfo.latest_version : undefined}
        onOpenUpdate={() => setUpdateModalOpen(true)}
      />

      <main className="app-main">
        <div className="app-content flex flex-col">
          {activeTab === "home" && (
            <HomePage onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === "suno" && (
            <SunoDownloaderPage
              song={song}
              loading={loading}
              downloading={downloading}
              onFetch={handleFetch}
              onAudioClick={() => setAudioModalOpen(true)}
              onCoverClick={() => requestDownload("cover")}
              onLyricsClick={() => requestDownload("lyrics")}
              onDownloadAllClick={() => requestDownload("all")}
              onOpenHistory={() => setSunoDrawerOpen(true)}
              historyCount={history.length}
            />
          )}

          {activeTab === "universal" && (
            <UniversalDownloaderPage
              onShowToast={showToast}
              onOpenFolder={handleOpenFolder}
            />
          )}

          {activeTab === "metadata" && (
            <MetadataEditorPage onShowToast={showToast} />
          )}

          {activeTab === "detector" && (
            <KeyBpmDetectPage onShowToast={showToast} />
          )}

          {activeTab === "sample-cutter" && (
            <SampleCutterPage
              onShowToast={showToast}
              onOpenFolder={handleOpenFolder}
            />
          )}

          {activeTab === "prompter" && <SunoPrompterPage onShowToast={showToast} />}

          {activeTab === "mobile-app" && <MobileAppPage onShowToast={showToast} />}
          {activeTab === "feedback" && <FeedbackPage onShowToast={showToast} />}

          {activeTab === "settings" && (
            <SettingsPage onShowToast={showToast} />
          )}
        </div>
      </main>

      {audioModalOpen && (
        <AudioFormatModal
          onClose={() => setAudioModalOpen(false)}
          onSelect={handleAudioFormatSelect}
        />
      )}


      {/* Suno History Slide-over Drawer (1/4 screen) */}
      <SunoHistoryDrawer
        isOpen={sunoDrawerOpen}
        onClose={() => setSunoDrawerOpen(false)}
        history={history}
        onSelectSong={handleSelectHistorySong}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
      />

      {/* Action Ad Interstitial Modal with 5s countdown lock for Suno downloads */}
      {adModalOpen && pendingSunoFormat && (
        <AdModal
          actionTitle={getFormatActionTitle(pendingSunoFormat)}
          actionDesc={song?.title || t("app.sponsorSongReady", "Suno track ready to download")}
          lockSeconds={5}
          onClose={() => {
            setAdModalOpen(false);
            setPendingSunoFormat(null);
          }}
          onConfirm={() => {
            if (pendingSunoFormat) {
              executeDownload(pendingSunoFormat);
            }
          }}
        />
      )}

      {updateModalOpen && updateInfo && (
        <UpdateModal updateInfo={updateInfo} previouslyFailed={updatePreviouslyFailed} />
      )}

      {toastMessage && <Toast message={toastMessage} kind={toastKind} />}
    </div>
  );
}
