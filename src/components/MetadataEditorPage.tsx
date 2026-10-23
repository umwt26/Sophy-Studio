import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import type { AudioMetadata } from "../types";

interface MetadataEditorPageProps {
  onShowToast: (msg: string) => void;
}

export const MetadataEditorPage: React.FC<MetadataEditorPageProps> = ({ onShowToast }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [comment, setComment] = useState("");
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const [coverMimeType, setCoverMimeType] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  const loadFileMetadata = async (filePath: string) => {
    try {
      setLoading(true);
      const res = await invoke<AudioMetadata>("read_audio_metadata", { filePath });
      setMetadata(res);
      setTitle(res.title || "");
      setArtist(res.artist || "");
      setAlbum(res.album || "");
      setYear(res.year || "");
      setGenre(res.genre || "");
      setTrackNumber(res.trackNumber || "");
      setComment(res.comment || "");
      setCoverBase64(res.coverBase64 || null);
      setCoverMimeType(res.coverMimeType || "image/jpeg");
      setRemoveCover(false);
      onShowToast(t("metadata.loaded", "Ses dosyası başarıyla yüklendi!"));
    } catch (err: any) {
      onShowToast(`${t("metadata.loadError", "Metadata okunamadı")}: ${err?.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = async () => {
    try {
      const selected = await invoke<string | null>("select_audio_file");
      if (selected) {
        await loadFileMetadata(selected);
      }
    } catch (err: any) {
      onShowToast(`Dosya seçilemedi: ${err?.toString()}`);
    }
  };

  const handleSelectCover = async () => {
    try {
      const selectedImg = await invoke<string | null>("select_image_file");
      if (selectedImg) {
        const bytes = await invoke<number[]>("read_file_binary", { filePath: selectedImg });
        const uint8 = new Uint8Array(bytes);
        let binary = "";
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const b64 = window.btoa(binary);
        const lower = selectedImg.toLowerCase();
        const mime = lower.endsWith(".png") ? "image/png" : "image/jpeg";
        setCoverBase64(b64);
        setCoverMimeType(mime);
        setRemoveCover(false);
        onShowToast(t("metadata.coverSelected", "Kapak görseli seçildi!"));
      }
    } catch (err: any) {
      onShowToast(`Kapak seçilemedi: ${err?.toString()}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata?.filePath) return;

    try {
      setSaving(true);
      await invoke("save_audio_metadata", {
        input: {
          filePath: metadata.filePath,
          title: title.trim() || null,
          artist: artist.trim() || null,
          album: album.trim() || null,
          year: year.trim() || null,
          genre: genre.trim() || null,
          trackNumber: trackNumber.trim() || null,
          comment: comment.trim() || null,
          coverBase64: removeCover ? null : coverBase64,
          coverMimeType: removeCover ? null : coverMimeType,
          removeCover,
        },
      });
      onShowToast(t("metadata.saveSuccess", "Metadata başarıyla dosyaya kaydedildi!"));
    } catch (err: any) {
      onShowToast(`Kaydetme hatası: ${err?.toString()}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-base text-emerald-400">
              🏷️
            </span>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {t("metadata.title", "Audio Metadata Editor")}
            </h2>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {t(
              "metadata.subtitle",
              "MP3, WAV, FLAC veya M4A dosyanızı seçin; sanatçı, şarkı adı ve albüm kapak resmini anında düzenleyin."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={loading || saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
        >
          <span>📂</span>
          <span>{loading ? t("metadata.reading", "Okunuyor...") : t("metadata.selectFile", "Ses Dosyası Seç")}</span>
        </button>
      </div>

      {!metadata && !loading && (
        <div
          onClick={handleSelectFile}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--color-app-border)] bg-[var(--color-app-surface)]/50 py-20 text-center transition-all hover:border-emerald-500/50 hover:bg-[var(--color-app-surface)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl text-emerald-400">
            🎵
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {t("metadata.dropPrompt", "Düzenlemek istediğiniz ses dosyasını buraya seçin")}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Desteklenen formatlar: MP3, WAV, FLAC, M4A, OGG
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("metadata.readingFile", "Ses dosyası etiketleri taranıyor...")}
          </p>
        </div>
      )}

      {metadata && !loading && (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Cover Art & File Details */}
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {t("metadata.coverArt", "Albüm Kapağı")}
            </h4>

            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[var(--color-app-border)] bg-[#111318] flex items-center justify-center shadow-inner group">
              {!removeCover && coverBase64 ? (
                <img
                  src={`data:${coverMimeType || "image/jpeg"};base64,${coverBase64}`}
                  alt="Cover Preview"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[var(--color-text-muted)]">
                  <span className="text-4xl">🖼️</span>
                  <span className="text-xs">{t("metadata.noCover", "Kapak Görseli Yok")}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectCover}
                className="flex-1 rounded-lg border border-[var(--color-app-border)] bg-[#1c1f2a] py-2 text-xs font-semibold text-[var(--color-text-primary)] hover:border-emerald-500/50 hover:bg-[#232736]"
              >
                {t("metadata.changeCover", "Kapak Değiştir")}
              </button>
              {coverBase64 && !removeCover && (
                <button
                  type="button"
                  onClick={() => setRemoveCover(true)}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                >
                  {t("metadata.removeCover", "Kaldır")}
                </button>
              )}
            </div>

            <div className="mt-2 space-y-1.5 border-t border-[var(--color-app-border)]/60 pt-3 text-[11px] text-[var(--color-text-muted)]">
              <p className="truncate">
                <strong className="text-[var(--color-text-secondary)]">Dosya:</strong> {metadata.filePath.split(/[\\/]/).pop()}
              </p>
              <p>
                <strong className="text-[var(--color-text-secondary)]">Format:</strong> {metadata.format || "Bilinmiyor"}
              </p>
              {metadata.durationSeconds && (
                <p>
                  <strong className="text-[var(--color-text-secondary)]">Süre:</strong> {Math.floor(metadata.durationSeconds / 60)}:
                  {String(Math.floor(metadata.durationSeconds % 60)).padStart(2, "0")}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Metadata Fields Form */}
          <div className="md:col-span-2 flex flex-col gap-4 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {t("metadata.tagInfo", "Şarkı & Sanatçı Etiketleri")}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("metadata.labelTitle", "Şarkı Adı (Title)")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Şarkı adı..."
                  className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("metadata.labelArtist", "Sanatçı (Artist)")}
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Sanatçı..."
                  className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("metadata.labelAlbum", "Albüm (Album)")}
                </label>
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="Albüm adı..."
                  className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("metadata.labelYear", "Yıl (Year)")}
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Örn: 2026"
                  className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("metadata.labelGenre", "Tür (Genre)")}
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Örn: Pop, Rock, Electronic..."
                  className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                  {t("metadata.labelTrack", "Parça Numarası (Track #)")}
                </label>
                <input
                  type="text"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  placeholder="Örn: 1"
                  className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                {t("metadata.labelComment", "Yorum / Açıklama (Comment)")}
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="İsteğe bağlı not..."
                className="w-full rounded-lg border border-[var(--color-app-border)] bg-[#13151b] px-3.5 py-2 text-xs text-[var(--color-text-primary)] focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-[var(--color-app-border)]/60 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
              >
                <span>💾</span>
                <span>{saving ? t("metadata.saving", "Kaydediliyor...") : t("metadata.saveButton", "Dosyaya Kaydet")}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
