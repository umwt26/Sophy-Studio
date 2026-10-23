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
    <div className="flex flex-col gap-4 animate-fade-in pb-8">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#202532] bg-[#11131a] px-4 py-3 shadow-md">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🏷️</span>
            <span>{t("metadata.title", "Audio Metadata Editor")}</span>
          </h2>
          <p className="text-[11px] text-[#717789] mt-0.5">
            MP3, WAV, FLAC, M4A etiket ve albüm kapak görseli düzenleyici.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelectFile}
          disabled={loading || saving}
          className="flex items-center gap-1.5 rounded-lg border border-[#252b3a] bg-[#161a24] px-3.5 py-2 text-xs font-semibold text-[#38bdf8] hover:border-[#38bdf8]/50 hover:bg-[#1a1f2c] transition-all active:scale-95 disabled:opacity-50"
        >
          <span>📂</span>
          <span>{loading ? t("metadata.reading", "Okunuyor...") : t("metadata.selectFile", "Dosya Seç")}</span>
        </button>
      </div>

      {!metadata && !loading && (
        <div
          onClick={handleSelectFile}
          className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[#202532] bg-[#11131a]/50 py-16 text-center transition-all hover:border-[#38bdf8]/40 hover:bg-[#11131a]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161924] text-2xl text-[#38bdf8] border border-[#222736]">
            🎵
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold text-white">
              {t("metadata.dropPrompt", "Düzenlemek istediğiniz ses dosyasını seçin")}
            </p>
            <p className="text-[11px] text-[#646a7e]">
              MP3, WAV, FLAC, M4A, OGG • Doğrudan dosyaya ID3v2.4 kaydeder
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#202532] bg-[#11131a] py-16 text-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#38bdf8] border-t-transparent" />
          <p className="text-xs font-medium text-[#888f9f]">
            {t("metadata.readingFile", "Ses dosyası etiketleri taranıyor...")}
          </p>
        </div>
      )}

      {metadata && !loading && (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Cover Art & File Details */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#202532] bg-[#11131a] p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#63697c]">
              {t("metadata.coverArt", "Albüm Kapağı")}
            </h4>

            <div className="relative aspect-square w-full max-w-[220px] mx-auto overflow-hidden rounded-lg border border-[#202532] bg-[#0d0f14] flex items-center justify-center shadow-inner group">
              {!removeCover && coverBase64 ? (
                <img
                  src={`data:${coverMimeType || "image/jpeg"};base64,${coverBase64}`}
                  alt="Cover Preview"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#555a6a]">
                  <span className="text-3xl">🖼️</span>
                  <span className="text-[11px]">{t("metadata.noCover", "Kapak Görseli Yok")}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectCover}
                className="flex-1 rounded-lg border border-[#202532] bg-[#161a24] py-1.5 text-xs font-semibold text-white hover:border-[#38bdf8]/40 hover:bg-[#1b202c] transition-colors"
              >
                {t("metadata.changeCover", "Kapak Değiştir")}
              </button>
              {coverBase64 && !removeCover && (
                <button
                  type="button"
                  onClick={() => setRemoveCover(true)}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                >
                  {t("metadata.removeCover", "Kaldır")}
                </button>
              )}
            </div>

            <div className="mt-1 space-y-1 border-t border-[#1d222e] pt-2.5 text-[10px] text-[#676e80]">
              <p className="truncate">
                <strong className="text-[#888f9f]">Dosya:</strong> {metadata.filePath.split(/[\\/]/).pop()}
              </p>
              <p>
                <strong className="text-[#888f9f]">Format:</strong> {metadata.format || "Audio"}
              </p>
              {metadata.durationSeconds && (
                <p>
                  <strong className="text-[#888f9f]">Süre:</strong> {Math.floor(metadata.durationSeconds / 60)}:
                  {String(Math.floor(metadata.durationSeconds % 60)).padStart(2, "0")}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Metadata Fields Form */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-xl border border-[#202532] bg-[#11131a] p-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#63697c]">
                {t("metadata.tagInfo", "Şarkı & Sanatçı Etiketleri")}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                    {t("metadata.labelTitle", "Şarkı Adı (Title)")}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Şarkı adı..."
                    className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                    {t("metadata.labelArtist", "Sanatçı (Artist)")}
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Sanatçı..."
                    className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                    {t("metadata.labelAlbum", "Albüm (Album)")}
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder="Albüm adı..."
                    className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                    {t("metadata.labelYear", "Yıl (Year)")}
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Örn: 2026"
                    className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                    {t("metadata.labelGenre", "Tür (Genre)")}
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Örn: Hip-Hop, Electronic..."
                    className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                    {t("metadata.labelTrack", "Parça No (Track #)")}
                  </label>
                  <input
                    type="text"
                    value={trackNumber}
                    onChange={(e) => setTrackNumber(e.target.value)}
                    placeholder="Örn: 1"
                    className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#7d8496] mb-1">
                  {t("metadata.labelComment", "Yorum / Not (Comment)")}
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="İsteğe bağlı açıklama..."
                  className="w-full rounded-lg border border-[#202532] bg-[#0d0f14] px-3 py-1.5 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end border-t border-[#1d222e] pt-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-[#38bdf8] px-5 py-2 text-xs font-bold text-[#0d0f14] shadow-md transition-all hover:bg-[#0ea5e9] active:scale-95 disabled:opacity-50"
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
