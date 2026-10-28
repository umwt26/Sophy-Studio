<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="96" />

<h1>Sophy Studio</h1>

<p><b>Laden. Formen. Taggen. Veröffentlichen.</b><br />
Das leistungsstarke All-in-One-Audiostudio für Desktop und Mobilgeräte für moderne Musikproduzenten.</p>

<p>
  <a href="#-----desktop--windows-"><b>🖥️ Desktop (Windows)</b></a>
  &nbsp;·&nbsp;
  <a href="#----mobil--android-"><b>📱 Mobil (Android)</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Releases herunterladen</b></a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord-Community</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Von Beli!</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <b>Deutsch</b> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=version&labelColor=0c0e14&color=38bdf8" alt="Version" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Android-38bdf8?style=flat-square&labelColor=0c0e14" alt="Windows | Android" />
  <img src="https://img.shields.io/badge/license-MIT-38bdf8?style=flat-square&labelColor=0c0e14" alt="MIT" />
  <img src="https://img.shields.io/badge/price-100%25%20Kostenlos-38bdf8?style=flat-square&labelColor=0c0e14" alt="100% Kostenlos" />
  <img src="https://img.shields.io/badge/languages-8%20Sprachen-38bdf8?style=flat-square&labelColor=0c0e14" alt="8 Sprachen" />
</p>

</div>

<br />

---

## 🖥️ Desktop-Erlebnis (Windows)

Die Desktop-Version bietet eine fokussierte Studioumgebung mit Seitenleiste, entwickelt mit Tauri 2, Rust und React 19. Alle Prozesse laufen direkt und lokal auf deinem PC – ohne Benutzerkonten, ohne Cloud-Warteschlangen und ohne Audio-Qualitätsverlust.

<br />

### 1. Startseite / Dashboard
Alle Werkzeuge übersichtlich gebündelt: Herunterladen, Erstellen und Bearbeiten & Analysieren, begleitet von nützlichen Schnelltipps und einem Versionshinweise-Karussell.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Startseite / Dashboard" width="100%" />
</p>

<br />

### 2. Suno Downloader 2.0
Füge einen Suno-Songlink ein und lade 320 kbps MP3 in Studioqualität, verlustfreies WAV oder den Original-Audiostream herunter. Hochauflösendes Albumcover und synchronisierte Songtexte (.lrc / .txt) werden automatisch extrahiert und eingebettet.

<p align="center">
  <img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader 2.0" width="100%" />
</p>

<br />

### 3. Universal Media Downloader
Lade Videos oder Audio von YouTube, Instagram, TikTok, Facebook, X (Twitter), Reddit, SoundCloud und Hunderten weiteren Plattformen herunter. Wähle mit einem Klick zwischen MP4-Video oder 320k-MP3-Audio.

<p align="center">
  <img src="docs/screenshots/universal-downloader.png" alt="Universal Media Downloader" width="100%" />
</p>

<br />

### 4. Suno Style Prompter
Beschreibe deine Songidee in deinen eigenen Worten in einer von 8 Sprachen und erhalte sofort kopierbare Style-of-Music-Tags und strukturierte Song-Abschnitte ([Intro], [Verse], [Chorus], [Outro]). Läuft komplett offline.

<p align="center">
  <img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" width="100%" />
</p>

<br />

### 5. Sample Cutter (8s Waveform Slicer)
Lade einen beliebigen Track, bewege ein exaktes 8,0-Sekunden-Schleifenfenster über die Wellenform und exportiere den Ausschnitt direkt als 320k MP3 oder verlustfreies WAV – maßgeschneidert für Suno-Audio-Fortsetzungen.

<p align="center">
  <img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter (8s Waveform Slicer)" width="100%" />
</p>

<br />

### 6. Audio-Metadaten-Editor
Bearbeite Titel, Interpret, Album, Jahr, Genre und Titelnummer für MP3, WAV, FLAC und M4A. Schreibt ID3v2.3-Tags und bettet Coverbilder direkt in die Datei ein.

<p align="center">
  <img src="docs/screenshots/metadata-editor.png" alt="Audio-Metadaten-Editor" width="100%" />
</p>

<br />

### 7. Tonart- (Key) & BPM-Erkennung
Ziehe eine Audiodatei hinein, um die Tonart, die Position im Camelot-Rad (z. B. 8B / C-Dur) und das genaue Tempo mit Feinanpassung (-1, +1, /2, *2) zu ermitteln. Powered by Essentia.js WebAssembly.

<p align="center">
  <img src="docs/screenshots/bpm-detect.png" alt="Tonart- (Key) & BPM-Erkennung" width="100%" />
</p>

<br />

### 8. Desktop-Einstellungen & Personalisierung
Passe Sophy Studio an: 9 Farbthemen, dynamischer 360°-Farbwähler, barrierefreie Schrift- und Oberflächenskalierung (90% - 150%) und 8 Sprachen.

<p align="center">
  <img src="docs/screenshots/appearance.png" alt="Desktop-Einstellungen & Personalisierung" width="100%" />
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

#### 📥 Sophy Studio für Windows herunterladen
1. Lade **`Sophy_Studio_Setup.exe`** aus dem neuesten Release herunter.
2. Starte den Installer. Keine Administratorrechte erforderlich; installiert sich sauber für deinen Benutzer.
3. Starte die App aus dem Startmenü oder über die Desktop-Verknüpfung.

<br />

---

## 📱 Mobil-Erlebnis (Android)

Sophy Studio Mobile bringt das komplette Desktop-Studiopaket auf dein Smartphone – von der Startseite bis zu den Einstellungen in der gleichen klaren Reihenfolge, optimiert für Touch-Gesten und mobile Workflows.

<br />

### 1. Mobil-Startseite / Dashboard
Deine mobile Studio-Schaltzentrale. Alle Downloader, Kreativ-Tools und Analysefunktionen sofort griffbereit mit intuitiven Touch-Karten.

<p align="center">
  <img src="docs/m-screenshots/m-homepage.jpg" alt="Mobil-Startseite / Dashboard" width="45%" />
</p>

<br />

### 2. Mobil Suno Downloader
Lade Suno-Tracks direkt auf dein Smartphone als 320k MP3, verlustfreies WAV, Originalstream, Cover und Songtexte (.lrc / .txt).

<p align="center">
  <img src="docs/m-screenshots/m-sunodownloader.jpg" alt="Mobil Suno Downloader" width="45%" />
</p>

<br />

### 3. Universal Downloader & Teilen zum Herunterladen (Share-to-Download)
Lade Videos oder Audio von Instagram, TikTok, YouTube und X herunter. Mit **Share-to-Download**: tippe in Social-Media-Apps einfach auf Teilen -> Sophy Studio, und der Download startet sofort!

<p align="center">
  <img src="docs/m-screenshots/m-univdownloader.jpg" alt="Universal Downloader & Teilen zum Herunterladen (Share-to-Download)" width="45%" />
</p>

<p align="center">
  <img src="docs/m-screenshots/m-share.gif" alt="Universal Downloader & Teilen zum Herunterladen (Share-to-Download)" width="45%" /><br />
  <sub><b>Systemweite Teilen-Integration: Videos direkt mit Sophy Studio teilen und mit einem Tippen herunterladen.</b></sub>
</p>

<br />

### 4. Mobil Suno Style Prompter
Erstelle präzise Style-of-Music-Tags und Song-Strukturen direkt auf dem Smartphone mit der mehrsprachigen Regel-Engine.

<p align="center">
  <img src="docs/m-screenshots/m-sunoprompter.jpg" alt="Mobil Suno Style Prompter" width="45%" />
</p>

<br />

### 5. Mobil Sample Cutter
Verschiebe das 8,0-Sekunden-Schleifenfenster auf dem Touchscreen und schneide Loops für Suno.

<p align="center">
  <img src="docs/m-screenshots/m-samplecutter.jpg" alt="Mobil Sample Cutter" width="45%" />
</p>

<br />

### 6. Mobil Audio-Metadaten-Editor
Bearbeite ID3-Tags und binde Albumcover direkt in die Audiodateien auf deinem Android-Gerät ein.

<p align="center">
  <img src="docs/m-screenshots/m-metadata.jpg" alt="Mobil Audio-Metadaten-Editor" width="45%" />
</p>

<br />

### 7. Mobil Tonart- & BPM-Erkennung
Analysiere Tracks unterwegs offline: Camelot-Notationsrad, kompatible Mix-Tonarten und präzise BPM-Erkennung.

<p align="center">
  <img src="docs/m-screenshots/m-keybpm.jpg" alt="Mobil Tonart- & BPM-Erkennung" width="45%" />
</p>

<br />

### 8. Mobil-Einstellungen & Liquid Glass Thema
Wähle das exklusive **Liquid Glass**-Design mit flüssigem Glasmorphismus, wechsle zwischen 8 Sprachen und passe Touch-Skalierungen an.

<p align="center">
  <img src="docs/m-screenshots/m-gorunum.gif" alt="Mobil-Einstellungen & Liquid Glass Thema" width="45%" />
</p>

<table>
  <tr>
    <td width="33%"><img src="docs/m-screenshots/m-lang.jpg" alt="Language" /></td>
    <td width="33%"><img src="docs/m-screenshots/m-erisilebilirlik.jpg" alt="Accessibility" /></td>
    <td width="33%"><img src="docs/m-screenshots/m-about.jpg" alt="About" /></td>
  </tr>
</table>


<br />

#### 📥 Sophy Studio für Android herunterladen
1. Lade **`Sophy_Studio_Mobile_v1.4.0.apk`** aus dem neuesten Release herunter.
2. Öffne die .apk auf deinem Android-Gerät und bestätige die Installation.
3. Öffne die App oder teile ein beliebiges Video direkt mit Sophy Studio!

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
