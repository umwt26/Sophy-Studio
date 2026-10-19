<div align="center">

# 🎵 Sophy — Suno Downloader & Toolkit

**Der ultimative, leistungsstarke Desktop-Downloader & Toolkit für Suno AI-Medien.**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/sophy-suno-downloader/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/sophy-suno-downloader)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / Sprache:** [English](README.md) • [Türkçe](README_TR.md) • **Deutsch** • [Français](README_FR.md) • [Español](README_ES.md) • [Русский](README_RU.md) • [Português](README_PT.md) • [日本語](README_JA.md)

</div>

---

## 💡 Über Sophy

> **Haben Sie genug von Suno-Download-Limits, restriktiven Quoten und trägen Web-Oberflächen?**  
> Willkommen bei **Sophy**! Kreative Musikgenerierung sollte nicht durch umständliche Download-Prozesse blockiert werden. Sophy ermöglicht es Musikern, Produzenten und Hörern, saubere Studio-Audiodateien, verlustfreie WAVs, Cover-Artworks und Songtexte direkt aus Suno-Links in sauber organisierte Ordner auf Ihrem Computer herunterzuladen – komplett kostenlos, unbegrenzt und blitzschnell.

---

## ✨ Hauptfunktionen

- **⚡ Blitzschnelle Track-Analyse:** Fügen Sie einen beliebigen Suno-Link (`suno.com/s/...`, `suno.com/song/...` oder UUID) ein und erhalten Sie alle Metadaten, Prompts, Songtexte und Cover-Bilder in unter einer Sekunde.
- **🎧 Studio-Audioformate:**
  - **MP3 (320 kbps)** — Hochwertige Konvertierung mit eingebetteten ID3-Tags (Titel, Künstler, Genre & Cover-Artwork).
  - **WAV (Verlustfrei 44.1 kHz 16-Bit)** — Unkomprimiertes Audio, ideal für den direkten Import in Ihre DAW (FL Studio, Ableton, Logic Pro usw.).
  - **Original-Audio** — Direkter Quell-Stream ohne Transkodierung.
- **📦 Alles herunterladen (.zip):** 320kbps MP3, hochauflösendes Coverbild (.jpg) und Songtexte (.txt) gebündelt in einem praktischen `.zip`-Paket mit einem Klick.
- **🕒 Lokaler Suchverlauf:** Verlieren Sie keinen Track mehr. Gesuchte Songs werden lokal gespeichert und können jederzeit mit einem Klick neu geladen werden.
- **🌍 8 UI-Sprachen:** English, Türkçe, Deutsch, Français, Español, Русский, Português und 日本語 mit sofortiger Umschaltung.
- **🚀 Integrierter Auto-Updater:** Prüft beim Start automatisch auf neue Versionen und kann Aktualisierungen direkt in der App herunterladen und installieren!
- **📁 Strukturierte lokale Bibliothek:** Sortiert Downloads automatisch unter `Dokumente\Sophy\` in saubere Unterordner (`Audio`, `Cover Art`, `Lyrics`, `All`).

---

## 📸 Screenshots & Vorschau

### 1. Song-Details & Download-Toolkit
Prüfen Sie Stil, Prompt-Tags, Modellversion und starten Sie Downloads:
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy Song-Details" width="850" />
</div>

<br />

### 2. Audio-Format-Auswahl (MP3 / WAV / Original)
Wählen Sie das optimale Format für Audio-Wiedergabe oder Studiobearbeitung:
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy Audio-Format-Auswahl" width="850" />
</div>

<br />

### 3. Lokaler Suchverlauf
Schneller Zugriff auf bereits geladene Tracks und unkomplizierte Verlaufslöschung:
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy Suchverlauf" width="850" />
</div>

<br />

### 4. Mehrsprachige Benutzeroberfläche
Wechseln Sie mühelos zwischen 8 unterstützten Weltsprachen:
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy Sprachauswahl" width="850" />
</div>

<br />

### 5. Minimalistische Benutzeroberfläche
Konzentriertes Dark-Mode-Design für produktives und angenehmes Arbeiten:
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy Hauptbildschirm" width="850" />
</div>

---

## 📥 Installation

### Windows Installationsprogramm (Setup)
1. Laden Sie die neueste `Sophy_Setup.exe` von der [Releases](https://github.com/umwt26/sophy-suno-downloader/releases)-Seite herunter.
2. Starten Sie das Setup und folgen Sie dem modernen Assistenten.
3. Starten Sie **Sophy** direkt vom Desktop oder Startmenü!

---

## 🛠️ Technologie-Stack

| Ebene | Technologien |
| :--- | :--- |
| **Desktop-Core** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **Frontend UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Media Engine** | Rust Decryption Pipeline & [FFmpeg](https://ffmpeg.org/) (silent mode) |
| **Installer** | Individueller NSIS 3.x Setup-Assistent |

---

## 🧑‍💻 Entwickler & Credits

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 Lizenz & Haftungsausschluss

Dieses Projekt ist unter der MIT-Lizenz lizenziert.  
*Haftungsausschluss: Sophy ist ein unabhängiges Open-Source-Toolkit und steht in keiner offiziellen Verbindung zu Suno AI. Bitte respektieren Sie die Urheberrechte und Nutzungsbedingungen der Künstler und Plattformen.*
