<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="96" />

<h1>Sophy Studio</h1>

<p><b>Download it. Shape it. Tag it. Ship it.</b><br />
The high-performance, all-in-one desktop & mobile audio toolkit for modern creators and music producers.</p>

<p>
  <a href="#-----desktop--windows-"><b>🖥️ Desktop (Windows)</b></a>
  &nbsp;·&nbsp;
  <a href="#----mobile--android-"><b>📱 Mobile (Android)</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Download Releases</b></a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord Community</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Made by Beli!</a>
</p>

<p><sub><b>English</b> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=version&labelColor=0c0e14&color=38bdf8" alt="Version" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Android-38bdf8?style=flat-square&labelColor=0c0e14" alt="Windows | Android" />
  <img src="https://img.shields.io/badge/license-MIT-38bdf8?style=flat-square&labelColor=0c0e14" alt="MIT" />
  <img src="https://img.shields.io/badge/price-100%25%20Free-38bdf8?style=flat-square&labelColor=0c0e14" alt="100% Free" />
  <img src="https://img.shields.io/badge/languages-8%20languages-38bdf8?style=flat-square&labelColor=0c0e14" alt="8 languages" />
</p>

</div>

<br />

---

## 🖥️ Desktop Experience (Windows)

The desktop edition provides a distraction-free, sidebar-driven studio environment engineered with Tauri 2, Rust, and React 19. Every process runs directly on your PC with zero accounts, zero cloud delays, and zero audio quality loss.

<br />

### 1. Home Dashboard
All studio tools grouped into a logical workflow: Download, Create, and Edit & Analyze, accompanied by quick tips and a version changelog carousel.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Home Dashboard" width="100%" />
</p>

<br />

### 2. Suno Downloader 2.0
Paste any Suno song link to fetch studio 320 kbps MP3, lossless uncompressed WAV, or the raw source stream. High-res album artwork and synchronized lyrics (.lrc / .txt) are automatically extracted and embedded into the file. Includes a slide-over search history drawer with instant track reload.

<p align="center">
  <img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader 2.0" width="100%" />
</p>

<br />

### 3. Universal Media Downloader
Grab video or audio from YouTube, Instagram, TikTok, Facebook, X (Twitter), Reddit, SoundCloud, Pinterest and hundreds of other platforms. Download as MP4 video or 320k MP3 audio with a single click. Keep track of all queries in a sortable, platform-filtered history.

<p align="center">
  <img src="docs/screenshots/universal-downloader.png" alt="Universal Media Downloader" width="100%" />
</p>

<br />

### 4. Suno Style Prompter
Describe your song in natural language, in any of 8 supported languages, and get ready-to-paste Style of Music tags (up to 1,000 characters) and structured arrangement sections (up to 5,000 characters) formatted with [Intro], [Verse], [Chorus], and [Outro]. Runs entirely offline with a multilingual rule engine and an integrated local llama.cpp AI model.

<p align="center">
  <img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" width="100%" />
</p>

<br />

### 5. Sample Cutter (8s Waveform Slicer)
Load any audio track, slide an exact 8.0-second interactive loop window across the waveform, audition your slice with real-time playback, and export directly as 320k MP3 or lossless WAV. Specifically calibrated for Suno AI audio continuation uploads.

<p align="center">
  <img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter (8s Waveform Slicer)" width="100%" />
</p>

<br />

### 6. Audio Metadata Editor
View and edit track title, artist, album, year, genre, track number, and comments for MP3, WAV, FLAC, and M4A files. Writes native ID3v2.3 tags with embedded cover artwork that displays immediately in Windows Explorer, DJ software, and digital audio workstations.

<p align="center">
  <img src="docs/screenshots/metadata-editor.png" alt="Audio Metadata Editor" width="100%" />
</p>

<br />

### 7. Musical Key & BPM Detection
Drop any audio file to identify its root musical key, Camelot Wheel position (e.g., 8B / C Major), compatible harmonic mixing keys for DJs, and exact tempo with precision nudge adjustments (-1, +1, /2, *2). Powered offline by Essentia.js WebAssembly.

<p align="center">
  <img src="docs/screenshots/bpm-detect.png" alt="Musical Key & BPM Detection" width="100%" />
</p>

<br />

### 8. Desktop Settings & Personalization
Tailor Sophy Studio to your creative setup: 9 curated colour presets (Ocean, Lagoon, Forest, Amber, Ember, Crimson, Orchid, Violet, Graphite), an interactive 360° hex colour wheel, accessible text and display zoom scaling (90% to 150%), customizable output directories for each media type, and full 8-language localization.

<p align="center">
  <img src="docs/screenshots/appearance.png" alt="Desktop Settings & Personalization" width="100%" />
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lang.png" alt="Language" /></td>
    <td width="50%"><img src="docs/screenshots/erisilebilirlik.png" alt="Accessibility" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/output-folders.png" alt="Output Folders" /></td>
    <td width="50%"><img src="docs/screenshots/about.png" alt="About" /></td>
  </tr>
</table>


<br />

#### 📥 Download Sophy Studio for Windows
1. Download **`Sophy_Studio_Setup.exe`** from the [Latest Release](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Run the installer. No administrative rights needed; installs cleanly for the current user and automatically cleans up legacy versions while preserving all user data and settings.
3. Launch from the Start menu or Desktop shortcut.

<br />

---

## 📱 Mobile Experience (Android)

Sophy Studio Mobile brings the complete desktop production suite to your smartphone, structured in the exact same logical order from Home to Settings, optimized for touch gestures, handheld ergonomics, and mobile workflows.

<br />

### 1. Mobile Home Dashboard
The handheld studio command center. Access all audio downloaders, creation tools, and analyzer features with clean tactile cards and instant navigation.

<p align="center">
  <img src="docs/m-screenshots/m-homepage.jpg" alt="Mobile Home Dashboard" width="45%" />
</p>

<br />

### 2. Suno Downloader Mobile
Download Suno tracks directly to your phone as studio 320k MP3, lossless WAV, original stream, artwork, or lyrics (.lrc / .txt) with full search history.

<p align="center">
  <img src="docs/m-screenshots/m-sunodownloader.jpg" alt="Suno Downloader Mobile" width="45%" />
</p>

<br />

### 3. Universal Media Downloader & Share-to-Download
Download videos or audio from Instagram, TikTok, YouTube, X, Reddit and more. Plus, system-wide **Share-to-Download**: whenever you encounter a video in any app, tap Share -> Sophy Studio, and the download begins immediately!

<p align="center">
  <img src="docs/m-screenshots/m-univdownloader.jpg" alt="Universal Media Downloader & Share-to-Download" width="45%" />
</p>

<p align="center">
  <img src="docs/m-screenshots/m-share.gif" alt="Universal Media Downloader & Share-to-Download" width="45%" /><br />
  <sub><b>System-Wide Share-to-Download: share any video from social apps straight to Sophy Studio to download with 1 tap.</b></sub>
</p>

<br />

### 4. Suno Style Prompter Mobile
Compose detailed Style of Music tags and structured arrangements directly on your phone with the smart multilingual rule engine and instrumental hints.

<p align="center">
  <img src="docs/m-screenshots/m-sunoprompter.jpg" alt="Suno Style Prompter Mobile" width="45%" />
</p>

<br />

### 5. Sample Cutter Mobile
Slide an exact 8.0-second loop window across your track waveform on touch screen and export 320k MP3 or WAV slices for Suno continuation.

<p align="center">
  <img src="docs/m-screenshots/m-samplecutter.jpg" alt="Sample Cutter Mobile" width="45%" />
</p>

<br />

### 6. Audio Metadata Editor Mobile
Edit tags (title, artist, album, genre) and embed album artwork directly into audio files stored on your Android device.

<p align="center">
  <img src="docs/m-screenshots/m-metadata.jpg" alt="Audio Metadata Editor Mobile" width="45%" />
</p>

<br />

### 7. Key & BPM Detection Mobile
Analyze tracks on your phone offline: Camelot Wheel harmonic key notation, compatible harmonic pairs, and BPM tempo tracking.

<p align="center">
  <img src="docs/m-screenshots/m-keybpm.jpg" alt="Key & BPM Detection Mobile" width="45%" />
</p>

<br />

### 8. Mobile Settings & Liquid Glass Theme
Personalize your mobile experience: choose the exclusive fluid **Liquid Glass** theme with translucent glassmorphism, switch between 8 languages, and adjust accessible text/display scaling.

<p align="center">
  <img src="docs/m-screenshots/m-gorunum.gif" alt="Mobile Settings & Liquid Glass Theme" width="45%" />
</p>

<table>
  <tr>
    <td width="33%"><img src="docs/m-screenshots/m-lang.jpg" alt="Language" /></td>
    <td width="33%"><img src="docs/m-screenshots/m-erisilebilirlik.jpg" alt="Accessibility" /></td>
    <td width="33%"><img src="docs/m-screenshots/m-about.jpg" alt="About" /></td>
  </tr>
</table>


<br />

#### 📥 Download Sophy Studio for Android
1. Download **`Sophy_Studio_Mobile_v1.4.0.apk`** from the [Latest Release](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Open the `.apk` on your Android device and confirm installation.
3. Open the app, or share any video link directly to Sophy Studio!

<br />

---

## 🛠️ Technology Stack / Architektur

| Component | Desktop (Windows) | Mobile (Android) |
|---|---|---|
| **Shell & Runtime** | Tauri 2 · Rust | Capacitor / Tauri Android |
| **Frontend UI** | React 19 · TypeScript · Tailwind CSS 4 · Vanilla CSS | React 19 · TypeScript · Touch Gestures |
| **Audio Processing** | FFmpeg · lofty / id3 · Essentia.js (WASM) | Web Audio API · Essentia.js (WASM) |
| **Download Engine** | Native Suno Client · yt-dlp binary | Suno API Client · Extractor Service |
| **Offline AI Model** | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) | Multilingual Natural Language Rule Engine |
| **Packaging** | NSIS Per-User Installer (`.exe`) | Android Package (`.apk`) |

<br />

---

<a id="made-by-beli"></a>

## 🎵 Made by Beli!

Sophy Studio is crafted, designed, and maintained by **Beli!** — an independent music producer, rap artist, and software developer.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>🎧 Listen</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>📱 Connect</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X (Twitter) · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>💬 Community &amp; Support</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord Server · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Report an Issue</a>
    </td>
  </tr>
</table>

Supported by [Filerawave](https://www.filerawave.com) & [Filera Music](https://www.filera.page).

<br />

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
