<div align="center">

# 🎵 Sophy — Suno Downloader & Toolkit

**The Ultimate High-Performance Desktop Downloader & Toolkit for Suno AI Media.**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/sophy-suno-downloader/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/sophy-suno-downloader)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / Dil:** [English](README.md) • [Türkçe](README_TR.md) • [Deutsch](README_DE.md) • [Français](README_FR.md) • [Español](README_ES.md) • [Русский](README_RU.md) • [Português](README_PT.md) • [日本語](README_JA.md)

</div>

---

## 💡 About Sophy

> **Tired of Suno download limits, restrictive quotas, and sluggish web interfaces?**  
> Welcome to **Sophy**! Creative music generation shouldn't be locked behind tedious download steps. Sophy empowers creators, producers, and listeners to extract clean, studio-grade audio, lossless WAVs, artwork, and lyrics straight from Suno links into neatly structured folders on your computer — completely free, unlimited, and blisteringly fast.

---

## ✨ Key Features

- **⚡ Instant Track Analysis:** Paste any Suno track link (`suno.com/s/...`, `suno.com/song/...`, or UUID) and retrieve full metadata, tags, lyrics, artist details, and artwork in under a second.
- **🎧 Studio Audio Formats:**
  - **MP3 (320 kbps)** — Clean high-bitrate conversion with embedded ID3 metadata tags (Title, Artist, Style/Genre, and Cover Art).
  - **WAV (Lossless 44.1 kHz 16-bit)** — Uncompressed audio ready for import directly into your DAW (FL Studio, Ableton, Logic Pro, etc.).
  - **Original Audio** — Direct stream capture without transcoding.
- **📦 Download All (.zip):** Package the 320kbps MP3, original high-res cover art (.jpg), and lyrics (.txt) into an organized `.zip` file in a single click.
- **🕒 Local Search History:** Never lose a track again. Sophy stores your analyzed tracks locally so you can reload any previous song instantly.
- **🌍 8 Interface Languages:** English, Türkçe, Deutsch, Français, Español, Русский, Português, and 日本語 with dynamic real-time switching.
- **🔕 100% Silent Processing:** No disruptive black terminal or command prompt windows — all conversions run quietly in the background.
- **🚀 Automatic Remote Update Checker:** Directly checks GitHub Releases on startup to alert you as soon as a new version is released.
- **📁 Organized Local Library:** Automatically manages your downloads under `Documents\Sophy\` sorted into clean subdirectories (`Audio`, `Cover Art`, `Lyrics`, `All`).

---

## 📸 Screenshots Showcase

### 1. Song Details & Download Toolkit
Inspect track style, prompt tags, model version, and trigger high-speed downloads:
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy Song Details" width="850" />
</div>

<br />

### 2. Audio Format Selection (MP3 320k / Lossless WAV / Original)
Choose your preferred audio rendering format tailored for casual listening or DAW editing:
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy Audio Format Modal" width="850" />
</div>

<br />

### 3. Local Search History
Quickly reload previously fetched tracks or clear history at your discretion:
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy Search History" width="850" />
</div>

<br />

### 4. International Multi-Language Support
Switch on the fly between 8 supported world languages:
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy Language Dropdown" width="850" />
</div>

<br />

### 5. Minimalist Home Interface
Distraction-free dark mode interface designed for maximum productivity:
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy Main Screen" width="850" />
</div>

---

## 📥 Installation

### Windows Installer (Setup)
1. Download the latest `Sophy_Setup.exe` from the [Releases](https://github.com/umwt26/sophy-suno-downloader/releases) page.
2. Run the installer and follow the modern setup wizard.
3. Launch **Sophy** from your Desktop or Start Menu!

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Desktop Shell** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **Frontend UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Media Engine** | Custom Rust decryption pipeline & [FFmpeg](https://ffmpeg.org/) (silent mode) |
| **Installer** | Customized NSIS 3.x setup wizard |

---

## 🧑‍💻 Developer & Credits

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 License & Disclaimer

This project is licensed under the MIT License.  
*Disclaimer: Sophy is an independent open-source toolkit and is not officially affiliated with or endorsed by Suno AI. Please respect the copyrights and terms of service of the creators and platforms.*
