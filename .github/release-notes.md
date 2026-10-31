# ✨ Sophy Studio v2.0.1

A fix update: Suno downloads on Android work again and Instagram carousels show every photo. Everything new in v2.0 is listed below. 🛠️

## 📦 Downloads

Both files are attached below, under **Assets**.

- 🖥️ **Windows**: `Sophy_Studio_Setup_v2.0.1.exe`
- 📱 **Android**: `Sophy_Studio_Mobile_v2.0.1.apk`

💾 Your history, settings and downloads are kept. Both apps offer this update by themselves.

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
