# ✨ Sophy Studio v2.0.2

A fix update: Suno downloads on Android are rebuilt from scratch and the Metadata Editor saves the artist the way Windows expects. Earlier v2.0.x changes are listed below. 🛠️

## 📦 Downloads

Both files are attached below, under **Assets**.

- 🖥️ **Windows**: `Sophy_Studio_Setup_v2.0.2.exe`
- 📱 **Android**: `Sophy_Studio_Mobile_v2.0.2.apk`

💾 Your history, settings and downloads are kept. Both apps offer this update by themselves.

---

## 🛠️ Fixed in v2.0.2

### 📱 Suno Downloader on Android, rebuilt
- **Downloads work again.** Suno closed its old direct MP3 links (they answer *403 Forbidden*) and now only serves encrypted audio. The Android app was refused when asking for the key to unlock it, so every download stopped with a 403 error.
- The new downloader tries every source Suno still serves, one after another:
  1. the encrypted song, unlocked with Suno's key. If Suno refuses the app, Sophy asks for the key through a hidden browser on suno.com, which Suno lets through;
  2. the song's video, which is not encrypted (the audio is taken out of it);
  3. the old direct MP3 links, in case Suno opens them again.
- If a download still fails, the error now says exactly which step failed and why, instead of a bare "403".
- MP3, WAV, original audio, cover art, lyrics and "All" (ZIP) all use the new downloader.

### 🏷️ Metadata Editor (Windows and Android)
- **The artist is now the main artist.** Windows shows the regular "Artist" tag as *Contributing artists*; the main artist it shows is the *Album artist*, which was left empty. Sophy now saves your artist in both, so it appears as the main artist in File Explorer, music players and streaming uploads.
- **Covers:** saving the cover was checked on MP3, M4A and FLAC, and Windows shows it in File Explorer right away.
- **About WAV files:** the cover is saved inside WAV files too, and players such as FL Studio, VLC and foobar2000 show it. Windows File Explorer, however, never shows covers or the album artist for WAV. The editor now says so when a WAV is open. Convert to FLAC (lossless) or MP3 with the File Converter if you want to see them in Explorer.

---

## 🛠️ Fixed in v2.0.1

- 📱 **Suno downloads on Android work again.** Suno now sends many songs encrypted; the app failed with *"CONVERT_FAILED … moov atom not found"*. Sophy Studio now unlocks these songs on the phone, exactly like the Windows app does, and saves them as 320k MP3, WAV or the original file.
- 📱 **Edit tab:** the sliding highlight now sits exactly on the selected tool (Metadata, Key & BPM, Convert, Compress). It used to drift to the side.
- 📱 The selected tool's name fits on narrow phones in every language instead of being cut off.
- 📸 **Instagram carousels show every photo and video again** (Windows and Android). Instagram had started refusing the old request, so a post with 6 photos showed only the cover. Sophy now reads the post the way embedded Instagram posts on websites do.
- 📱 **Instagram post picker on Android:** paste a post link in Universal to see every photo and video numbered, pick the ones you want and download only those (saved to `Download/Sophy Studio/Universal Media`).
- 🎹 **Key & BPM:** the Camelot badge and the "Harmonic Compatible Keys" list (8A, 6A …) are gone on both apps. You see the key, its relative key and the tempo.

---

# ✨ Everything new in v2.0

Two new tools, File Converter and Compressor, a built-in media player for every file, and smarter downloads. 🎉

## 🔄 File Converter (new)

- Audio, video and images to other formats: **MP3, AAC, FLAC, OGG, WAV, MP4, MKV, WebM, OGV, AVI, GIF, PNG, JPG, WebP, ICO**.
- Resize (75 %, 25 %, 720p, 1080p) or rotate left/right while converting.
- Several files at once, each with its own progress bar.
- 🖥️ **Right-click any media file in Explorer → Sophy Studio Converter**: a small window shows the progress, the app doesn't even open. Several selected files land in one window.
- The result is saved next to the original: `song -- Sophy Studio Converter.mp3`. Nothing is ever overwritten.

## 🗜️ Compressor (new)

- Makes **any file** smaller: photos, music, videos, **PDFs** and everything else (as ZIP). Up to 10 files at a time.
- Starts only when you press **Compress**; originals are never touched.
- Shows the size before and after: a 134 MB scanned PDF became 56 MB in about 20 seconds, WAV files shrink by up to 90 % (lossless FLAC).
- 🖥️ **Right-click any file → Sophy Studio Compressor**.
- Saved as `name -- Sophy Studio Compressor.ext`.

## ▶️ Built-in player

- 👁 **Preview** any file in the Converter and Compressor: photos, videos, music, PDFs and text files. Formats the app can't play by itself (MKV, AVI, WMA, TIFF …) are prepared automatically.
- Play/pause, ±10 s, speed 0.5×–2×, loop, volume, full screen, keyboard shortcuts.
- A **live sound spectrum** for music that moves only while it plays.
- The seek bar glides smoothly and its handle is the Sophy mark.

## ⬇️ Downloads

- Every file from the Suno and Universal downloaders now ends with `-- sophy.beli26.xyz - ID XXXXXX`.
- Same name already in the folder? The new file gets ` (1)`, ` (2)` … instead of replacing the old one.
- 📸 **Instagram posts**: paste a post link in the Universal downloader to see every photo and video numbered; pick the numbers and download only those.

## 📱 Android

- Converter, Compressor and the player with spectrum are in the **Edit** tab. Results are saved to `Download/Sophy Studio/Converter` and `…/Compressor`.
- 🛠️ Fixed: Suno and MP3/WAV downloads failing with *"Postprocessing: unable to obtain file audio codec with ffprobe"*. Suno songs now download directly, even faster.
- Send the Windows link to your email shows a live preview of the mail.

## 🖥️ Desktop

- The Mobile app page has equal-height cards and a live preview of the mail it sends.
- No more Windows scrollbar arrows; the sidebar fades softly at the edges instead.
- Key & BPM shows the key without the Camelot badge.
