<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="96" />

<h1>Sophy Studio</h1>

<p><b>Download it. Shape it. Tag it. Ship it.</b><br />
The high-performance, all-in-one desktop &amp; mobile audio toolkit for modern creators and music producers.</p>

<p>
  <a href="#-desktop-experience-windows"><b>🖥️ Desktop (Windows)</b></a>
  &nbsp;·&nbsp;
  <a href="#-mobile-experience-android"><b>📱 Mobile (Android)</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Download Releases</b></a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord Community</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Made by Beli!</a>
</p>

<p><sub><b>English</b> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=version&labelColor=0c0e14&color=38bdf8" alt="Latest version" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Android-38bdf8?style=flat-square&labelColor=0c0e14" alt="Windows and Android" />
  <img src="https://img.shields.io/badge/license-MIT-38bdf8?style=flat-square&labelColor=0c0e14" alt="MIT License" />
  <img src="https://img.shields.io/badge/price-100%25%20Free-38bdf8?style=flat-square&labelColor=0c0e14" alt="Free & Open Source" />
  <img src="https://img.shields.io/badge/languages-8%20languages-38bdf8?style=flat-square&labelColor=0c0e14" alt="8 languages" />
</p>

</div>

<br />

---

## 🖥️ Desktop Experience (Windows)

The desktop edition provides a distraction-free, sidebar-driven studio environment engineered with **Tauri 2, Rust, and React 19**. Every process runs directly on your PC with zero accounts, zero cloud delays, and zero audio quality loss.

<br />

### 1. Home Dashboard
All studio tools grouped into a logical workflow: **Download**, **Create**, and **Edit & Analyze**, accompanied by quick tips and a version changelog carousel.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Sophy Studio Desktop Home Screen" width="100%" />
</p>

<br />

### 2. Suno Downloader 2.0
Paste any Suno song link to fetch studio 320 kbps MP3, lossless uncompressed WAV, or the raw source stream. High-res album artwork and synchronized lyrics (`.lrc` / `.txt`) are automatically extracted and embedded into the file. Includes a slide-over search history drawer with instant track reload.

<p align="center">
  <img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader Desktop" width="100%" />
</p>

<br />

### 3. Universal Media Downloader
Grab video or audio from YouTube, Instagram, TikTok, Facebook, X (Twitter), Reddit, SoundCloud, Pinterest and hundreds of other platforms. Download as **MP4 video** or **320k MP3 audio** with a single click. Keep track of all queries in a sortable, platform-filtered history.

<p align="center">
  <img src="docs/screenshots/universal-downloader.png" alt="Universal Media Downloader Desktop" width="100%" />
</p>

<br />

### 4. Suno Style Prompter
Describe your song in natural language, in any of 8 supported languages, and get ready-to-paste **Style of Music** tags (up to 1,000 characters) and structured arrangement sections (up to 5,000 characters) formatted with `[Intro]`, `[Verse]`, `[Chorus]`, and `[Outro]`. Runs entirely offline with a multilingual rule engine and an integrated local `llama.cpp` AI model.

<p align="center">
  <img src="docs/screenshots/prompter.png" alt="Suno Style Prompter Desktop" width="100%" />
</p>

<br />

### 5. Sample Cutter (8s Waveform Slicer)
Load any audio track, slide an exact 8.0-second interactive loop window across the waveform, audition your slice with real-time playback, and export directly as 320k MP3 or lossless WAV. Specifically calibrated for Suno AI audio continuation uploads.

<p align="center">
  <img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter Desktop" width="100%" />
</p>

<br />

### 6. Audio Metadata Editor
View and edit track title, artist, album, year, genre, track number, and comments for MP3, WAV, FLAC, and M4A files. Writes native ID3v2.3 tags with embedded cover artwork that displays immediately in Windows Explorer, DJ software, and digital audio workstations.

<p align="center">
  <img src="docs/screenshots/metadata-editor.png" alt="Audio Metadata Editor Desktop" width="100%" />
</p>

<br />

### 7. Musical Key &amp; BPM Detection
Drop any audio file to identify its root musical key, Camelot Wheel position (e.g., `8B / C Major`), compatible harmonic mixing keys for DJs, and exact tempo with precision nudge adjustments (`-1`, `+1`, `/2`, `*2`). Powered offline by Essentia.js WebAssembly.

<p align="center">
  <img src="docs/screenshots/bpm-detect.png" alt="Key and BPM Detection Desktop" width="100%" />
</p>

<br />

### 8. Desktop Settings &amp; Personalization
Tailor Sophy Studio to your creative setup:
- **Dynamic Themes:** 9 curated presets (*Ocean, Lagoon, Forest, Amber, Ember, Crimson, Orchid, Violet, Graphite*) plus an interactive 360° hex colour wheel that tints backgrounds, sidebars, borders, and active selections.
- **Accessibility:** Scale text size from Small to Extra Large without breaking layouts, zoom display scale from 90% to 150%, and reduce motion toggles.
- **Dedicated Folders:** Choose independent destination directories for audio, media, covers, lyrics, and zip archives.
- **Full 8-Language Localization:** English, Türkçe, Deutsch, Français, Español, Português, Русский, and 日本語.

<p align="center">
  <img src="docs/screenshots/gorunum.gif" alt="Dynamic Themes Switching" width="100%" />
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lang.png" alt="Language Settings Desktop" /></td>
    <td width="50%"><img src="docs/screenshots/erisilebilirlik.png" alt="Accessibility Settings Desktop" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/output-folders.png" alt="Output Folders Settings Desktop" /></td>
    <td width="50%"><img src="docs/screenshots/about.png" alt="About Section Desktop" /></td>
  </tr>
</table>

<br />

#### 📥 Download Sophy Studio for Windows
1. Download **`Sophy_Studio_Setup.exe`** from the [Latest Release](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Run the installer. No administrative rights needed; installs for the current user and automatically cleans up legacy versions while preserving all user data and settings.
3. Launch from the Start menu or Desktop shortcut.

<br />

---

## 📱 Mobile Experience (Android)

**Sophy Studio Mobile** brings the complete desktop production suite to your smartphone, optimized for touch gestures, handheld ergonomics, and mobile workflows.

<br />

### ⚡ Mobile Highlight: System-Wide Share-to-Download
No need to manually copy and paste links. Whenever you encounter a video or track on Instagram, TikTok, YouTube, or X (Twitter), simply tap **Share**, choose **Sophy Studio**, and the download begins immediately!

<p align="center">
  <img src="docs/m-screenshots/m-share.gif" alt="System Share to Download on Android" width="45%" /><br />
  <sub><b>Share Target Integration:</b> Share reels and videos directly to Sophy Studio to download with 1 tap.</sub>
</p>

<br />

### 💧 Mobile Highlight: Liquid Glass Aesthetic
An exclusive mobile theme featuring fluid translucent glassmorphism, responsive ambient glows, and dark mode contrast tailored for OLED and AMOLED displays.

<p align="center">
  <img src="docs/m-screenshots/m-gorunum.gif" alt="Liquid Glass Theme on Mobile" width="45%" /><br />
  <sub><b>Liquid Glass:</b> Translucent materials, glowing accents, and fluid mobile transitions.</sub>
</p>

<br />

### Mobile Tool Flow (Home to Settings)

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-homepage.jpg" alt="Mobile Home" width="90%" /><br />
      <sub><b>1. Mobile Home Dashboard</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-sunodownloader.jpg" alt="Mobile Suno Downloader" width="90%" /><br />
      <sub><b>2. Suno Downloader (MP3/WAV/Cover/Lyrics)</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-univdownloader.jpg" alt="Mobile Universal Downloader" width="90%" /><br />
      <sub><b>3. Universal Media Downloader (Video & Audio)</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-sunoprompter.jpg" alt="Mobile Style Prompter" width="90%" /><br />
      <sub><b>4. Suno Style Prompter (Style & Structure)</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-samplecutter.jpg" alt="Mobile Sample Cutter" width="90%" /><br />
      <sub><b>5. Sample Cutter (8s Waveform Slicer)</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-metadata.jpg" alt="Mobile Metadata Editor" width="90%" /><br />
      <sub><b>6. Audio Metadata Editor & Cover Embedder</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-keybpm.jpg" alt="Mobile Key and BPM Detect" width="90%" /><br />
      <sub><b>7. Musical Key & BPM Detection</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-lang.jpg" alt="Mobile Language Settings" width="90%" /><br />
      <sub><b>8. Language & Region Settings</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-erisilebilirlik.jpg" alt="Mobile Accessibility Settings" width="90%" /><br />
      <sub><b>9. Mobile Accessibility (Text & Display Zoom)</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-about.jpg" alt="Mobile About Section" width="90%" /><br />
      <sub><b>10. Mobile About & Artist Profile</b></sub>
    </td>
  </tr>
</table>

<br />

#### 📥 Download Sophy Studio for Android
1. Download **`Sophy_Studio_Mobile_v1.4.0.apk`** from the [Latest Release](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Open the `.apk` on your Android device and confirm installation.
3. Open the app, or share any video link directly to Sophy Studio!

<br />

---

## 🛠️ Technology Stack

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

Proudly supported by [Filerawave](https://www.filerawave.com), music & video distribution platform for independent creators, and [Filera Music](https://www.filera.page).

<br />

---

## 📄 License &amp; Disclaimer

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

*Disclaimer:* Sophy Studio is an independent open-source project and is not affiliated with, sponsored by, or endorsed by Suno AI, YouTube, Instagram, TikTok, or any mentioned platforms. Users are responsible for complying with the terms of service of each platform and respecting content creators' rights.
