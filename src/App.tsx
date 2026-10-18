import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type Event } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { SongDetails } from "./components/SongDetails";
import { DownloadGrid } from "./components/DownloadGrid";
import { LyricsPanel } from "./components/LyricsPanel";
import { AudioFormatModal } from "./components/AudioFormatModal";
import { HistoryModal } from "./components/HistoryModal";
import { AdModal } from "./components/AdModal";
import { UpdateModal } from "./components/UpdateModal";
import { Toast } from "./components/Toast";
import type { AudioFormat, SongClip, SongData, UpdateInfo } from "./types";
import { SearchIcon } from "./components/icons";

const HISTORY_STORAGE_KEY = "sophy_search_history";

function formatDuration(sec?: number): string {
  if (sec == null || isNaN(sec)) return "";
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${s % 60 < 10 ? "0" : ""}${s % 60}`;
}

export default function App() {
  const { t } = useTranslation();
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [history, setHistory] = useState<SongData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for updates from GitHub in the background
  useEffect(() => {
    invoke<UpdateInfo>("check_for_updates")
      .then((res) => {
        if (res && res.has_update) {
          setUpdateInfo(res);
          setUpdateModalOpen(true);
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
    const updated = [newSong, ...filtered].slice(0, 30);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
    showToast(t("app.clearHistory", "History cleared."));
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = history.filter(
      (item, idx) => (item.clip?.id || item.title + idx) !== id
    );
    saveHistory(updated);
  };

  const handleSelectHistorySong = (selected: SongData) => {
    setSong(selected);
    setHistoryModalOpen(false);
    showToast(`${t("app.loadSong", "Loaded")}: ${selected.title}`);
  };

  useEffect(() => {
    const unlisten = listen("download-status", (event: Event<string>) => {
      showToast(event.payload);
    });
    return () => {
      unlisten.then((f: () => void) => f());
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastMessage(null), 3400);
  };

  const handleFetch = async (url: string) => {
    const trimmed = url.trim();

    // 1. Validation: Empty link check
    if (!trimmed) {
      showToast(t("app.errorEmptyLink", "Lütfen bir Suno şarkı linki girin."));
      return;
    }

    // 2. Validation: Suno link / UUID format check
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

  const executeDownload = async (format: "mp3" | "wav" | "cover" | "lyrics" | "all" | "original") => {
    if (!song) return;

    // Show sponsor popup ad when download initiates
    setAdModalOpen(true);

    setDownloading(true);
    try {
      const savedPath = await invoke<string>("download_media", {
        clip: song.clip,
        targetFormat: format === "original" ? "m4a" : format,
      });
      showToast(`Saved: ${savedPath.split(/[\\/]/).pop()}`);
    } catch (err: any) {
      showToast(`Download failed: ${err.toString()}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleAudioFormatSelect = (format: AudioFormat) => {
    setAudioModalOpen(false);
    executeDownload(format);
  };

  const handleOpenFolder = async () => {
    try {
      await invoke("open_sophy_folder");
    } catch (err: any) {
      showToast(`Failed to open folder: ${err.toString()}`);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[var(--color-app-bg)] text-[var(--color-text-primary)]">
      <Header
        onOpenFolder={handleOpenFolder}
        onOpenHistory={() => setHistoryModalOpen(true)}
        updateVersion={updateInfo?.has_update ? updateInfo.latest_version : undefined}
        onOpenUpdate={() => setUpdateModalOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
          <SearchBar onFetch={handleFetch} loading={loading} />

          {!song && !loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[var(--color-app-border)] py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-app-border)] bg-[var(--color-app-surface)] text-[var(--color-text-muted)]">
                <SearchIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                {t("app.inputPlaceholder", "Paste a Suno link above and hit Fetch Song to get started")}
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface)] py-20 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-app-border)] border-t-[var(--color-accent)]" />
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                {t("app.fetching", "Fetching song details…")}
              </p>
            </div>
          )}

          {song && !loading && (
            <div className="overflow-hidden rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-surface)]">
              <SongDetails song={song} />
              <DownloadGrid
                downloading={downloading}
                onAudioClick={() => setAudioModalOpen(true)}
                onCoverClick={() => executeDownload("cover")}
                onLyricsClick={() => executeDownload("lyrics")}
                onDownloadAllClick={() => executeDownload("all")}
              />
              <LyricsPanel lyrics={song.lyrics} />
            </div>
          )}
        </div>
      </main>

      {audioModalOpen && (
        <AudioFormatModal
          onClose={() => setAudioModalOpen(false)}
          onSelect={handleAudioFormatSelect}
        />
      )}

      {historyModalOpen && (
        <HistoryModal
          history={history}
          onClose={() => setHistoryModalOpen(false)}
          onSelectSong={handleSelectHistorySong}
          onClearHistory={handleClearHistory}
          onRemoveItem={handleRemoveHistoryItem}
        />
      )}

      {adModalOpen && (
        <AdModal onClose={() => setAdModalOpen(false)} />
      )}

      {updateModalOpen && updateInfo && (
        <UpdateModal
          updateInfo={updateInfo}
          onClose={() => setUpdateModalOpen(false)}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
