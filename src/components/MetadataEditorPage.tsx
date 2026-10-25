import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useTranslation } from "react-i18next";
import {
  FolderIcon,
  ImageIcon,
  MusicalNoteIcon,
  SaveIcon,
  TagIcon,
  TrashIcon,
} from "./icons";
import { PageHeader } from "./PageHeader";
import { useSponsorGate } from "./AdModal";
import type { AudioMetadata } from "../types";

interface MetadataEditorPageProps {
  onShowToast: (msg: string, kind?: "success" | "error") => void;
}

export const MetadataEditorPage: React.FC<MetadataEditorPageProps> = ({ onShowToast }) => {
  const { t } = useTranslation();
  const { gate, modal: sponsorModal } = useSponsorGate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selectingCover, setSelectingCover] = useState(false);

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
      onShowToast(t("metadata.loaded", "Ses dosyası yüklendi!"));
    } catch (err: any) {
      onShowToast(`${t("metadata.loadError", "Metadata okunamadı")}: ${err?.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const applyCoverImage = async (imagePath: string) => {
    try {
      const b64 = await invoke<string>("read_file_base64", { filePath: imagePath });
      const lower = imagePath.toLowerCase();
      const mime = lower.endsWith(".png") ? "image/png" : "image/jpeg";
      setCoverBase64(b64);
      setCoverMimeType(mime);
      setRemoveCover(false);
      onShowToast(t("metadata.coverSelected", "Kapak görseli seçildi!"));
    } catch (err: any) {
      onShowToast(`${t("metadata.errorSelectCover", "Could not select cover")}: ${err?.toString()}`, "error");
    }
  };

  const handleSelectFile = async () => {
    if (selecting || loading || saving) return;
    try {
      setSelecting(true);
      const selected = await invoke<string | null>("select_audio_file");
      if (selected) {
        await loadFileMetadata(selected);
      }
    } catch (err: any) {
      onShowToast(`${t("metadata.errorSelectFile", "Dosya seçilemedi")}: ${err?.toString()}`);
    } finally {
      setSelecting(false);
    }
  };

  const handleSelectCover = async () => {
    if (selectingCover) return;
    try {
      setSelectingCover(true);
      const selectedImg = await invoke<string | null>("select_image_file");
      if (selectedImg) {
        await applyCoverImage(selectedImg);
      }
    } catch (err: any) {
      onShowToast(`${t("metadata.errorSelectCover", "Could not select cover")}: ${err?.toString()}`, "error");
    } finally {
      setSelectingCover(false);
    }
  };

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    try {
      getCurrentWebview().onDragDropEvent(async (event) => {
        if (event.payload.type === "enter" || event.payload.type === "over") {
          setIsDragOver(true);
        } else if (event.payload.type === "leave") {
          setIsDragOver(false);
        } else if (event.payload.type === "drop") {
          setIsDragOver(false);
          const paths = event.payload.paths;
          if (paths && paths.length > 0) {
            const first = paths[0];
            const lower = first.toLowerCase();
            if (
              lower.endsWith(".mp3") ||
              lower.endsWith(".wav") ||
              lower.endsWith(".flac") ||
              lower.endsWith(".m4a") ||
              lower.endsWith(".ogg") ||
              lower.endsWith(".aac")
            ) {
              await loadFileMetadata(first);
            } else if (
              lower.endsWith(".jpg") ||
              lower.endsWith(".jpeg") ||
              lower.endsWith(".png") ||
              lower.endsWith(".webp") ||
              lower.endsWith(".bmp")
            ) {
              await applyCoverImage(first);
            } else {
              onShowToast(t("metadata.dropFormats", "MP3, WAV, FLAC, M4A veya kapak için JPG/PNG bırakın."));
            }
          }
        }
      }).then((u) => {
        unlisten = u;
      });
    } catch {
      // not in tauri environment
    }

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Backend returns "CODE: detail" (see sophy-core metadata.rs).
  const describeMetadataError = (err: unknown): string => {
    const raw = String(err ?? "");
    switch (raw.split(":")[0]?.trim()) {
      case "METADATA_COVER_INVALID":
        return t("metadata.errCoverInvalid", "The cover image could not be read. Use a JPG, PNG, WEBP or BMP image.");
      case "METADATA_VERIFY_FAILED":
        return t("metadata.errVerify", "The tags were written but could not be confirmed. The file may be read-only or in use by another program.");
      case "METADATA_WRITE_FAILED":
        return t("metadata.errWrite", "Could not write to the file. Close any program using it (player, DAW) and try again.");
      case "METADATA_READ_FAILED":
        return t("metadata.errRead", "This audio file could not be read.");
      default:
        return `${t("metadata.errorSave", "Save failed")}: ${raw}`;
    }
  };

  // Writing tags is shown behind a sponsor, like downloads
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metadata?.filePath) return;
    gate(
      () => void runSave(),
      t("metadata.sponsorAction", "Save tags to file"),
      metadata.filePath.split(/[\\/]/).pop(),
      SaveIcon
    );
  };

  const runSave = async () => {
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
      await loadFileMetadata(metadata.filePath);
      onShowToast(t("metadata.saveSuccess", "Metadata başarıyla kaydedildi!"));
    } catch (err: any) {
      onShowToast(describeMetadataError(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        Icon={TagIcon}
        title={t("metadata.title", "Audio Metadata Editor")}
        desc={t("metadata.subtitle", "Edit title, artist, album and cover art of your audio files.")}
        actions={
          <button type="button" onClick={handleSelectFile} disabled={loading || saving} className="btn btn-secondary">
            <FolderIcon className="h-4 w-4" />
            <span>{loading ? t("metadata.reading", "Reading...") : t("metadata.selectFile", "Select File")}</span>
          </button>
        }
      />

      {!metadata && !loading && (
        <div
          onClick={handleSelectFile}
          className={`dropzone py-16 ${isDragOver ? "active" : ""}`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            <MusicalNoteIcon className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {t("metadata.dropPrompt", "Düzenlemek istediğiniz ses dosyasını seçin")}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {t("metadata.dropFormats", "MP3, WAV, FLAC, M4A, OGG • ID3v2.4 etiketleri düzenlenir")}
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="section section-pad flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-app-border)] border-t-[var(--color-accent)]" />
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">
            {t("metadata.readingFile", "Ses dosyası etiketleri okunuyor...")}
          </p>
        </div>
      )}

      {metadata && !loading && (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Cover Art & File Details */}
          <div className="section section-pad flex flex-col gap-3">
            <span className="eyebrow">
              {t("metadata.coverArt", "Albüm Kapağı")}
            </span>

            <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface-2)] flex items-center justify-center">
              {!removeCover && coverBase64 ? (
                <img
                  src={`data:${coverMimeType || "image/jpeg"};base64,${coverBase64}`}
                  alt="Cover Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[var(--color-text-tertiary)]">
                  <ImageIcon className="h-8 w-8 opacity-40" />
                  <span className="text-xs">{t("metadata.noCover", "Kapak Görseli Yok")}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectCover}
                className="btn btn-secondary flex-1 text-xs"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>{t("metadata.changeCover", "Kapak Değiştir")}</span>
              </button>
              {coverBase64 && !removeCover && (
                <button
                  type="button"
                  onClick={() => setRemoveCover(true)}
                  className="btn btn-secondary text-xs text-[var(--color-danger)] hover:border-[var(--color-danger)]/40"
                  title={t("common.delete", "Kaldır")}
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="mt-2 space-y-1.5 border-t border-[var(--color-app-border)] pt-3 text-[0.6875rem] text-[var(--color-text-secondary)]">
              <p className="truncate">
                <span className="text-[var(--color-text-tertiary)]">{t("metadata.infoFile", "Dosya:")}</span>{" "}
                <span className="font-mono text-[var(--color-text-primary)]">{metadata.filePath.split(/[\\/]/).pop()}</span>
              </p>
              <p>
                <span className="text-[var(--color-text-tertiary)]">{t("metadata.infoFormat", "Format:")}</span>{" "}
                <span className="font-mono text-[var(--color-text-primary)]">{metadata.format || "Audio"}</span>
              </p>
              {metadata.durationSeconds && (
                <p>
                  <span className="text-[var(--color-text-tertiary)]">{t("metadata.infoDuration", "Süre:")}</span>{" "}
                  <span className="font-mono text-[var(--color-text-primary)]">
                    {Math.floor(metadata.durationSeconds / 60)}:
                    {String(Math.floor(metadata.durationSeconds % 60)).padStart(2, "0")}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Metadata Fields Form */}
          <div className="md:col-span-2 section section-pad flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">
                {t("metadata.tagInfo", "Şarkı & Sanatçı Etiketleri")}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="field-label">
                    {t("metadata.labelTitle", "Şarkı Adı (Title)")}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("metadata.phTitle", "Şarkı adı...")}
                    className="input"
                  />
                </div>

                <div>
                  <label className="field-label">
                    {t("metadata.labelArtist", "Sanatçı (Artist)")}
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder={t("metadata.phArtist", "Sanatçı...")}
                    className="input"
                  />
                </div>

                <div>
                  <label className="field-label">
                    {t("metadata.labelAlbum", "Albüm (Album)")}
                  </label>
                  <input
                    type="text"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    placeholder={t("metadata.phAlbum", "Albüm adı...")}
                    className="input"
                  />
                </div>

                <div>
                  <label className="field-label">
                    {t("metadata.labelYear", "Yıl (Year)")}
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    className="input"
                  />
                </div>

                <div>
                  <label className="field-label">
                    {t("metadata.labelGenre", "Tür (Genre)")}
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="Hip-Hop, Electronic, Pop..."
                    className="input"
                  />
                </div>

                <div>
                  <label className="field-label">
                    {t("metadata.labelTrack", "Parça No (Track #)")}
                  </label>
                  <input
                    type="text"
                    value={trackNumber}
                    onChange={(e) => setTrackNumber(e.target.value)}
                    placeholder="1"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">
                  {t("metadata.labelComment", "Yorum / Not (Comment)")}
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("metadata.phComment", "İsteğe bağlı açıklama...")}
                  className="input"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end border-t border-[var(--color-app-border)] pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                <SaveIcon className="h-4 w-4" />
                <span>
                  {saving
                    ? t("metadata.saving", "Kaydediliyor...")
                    : t("metadata.saveButton", "Dosyaya Kaydet")}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}

      {sponsorModal}
    </div>
  );
};
