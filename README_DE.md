<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>Laden. Formen. Taggen. Veröffentlichen.</b><br />
Eine kleine Windows-App, die die lästigen Teile des Musikmachens aus deinem Browser holt.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Für Windows herunterladen</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Versionshinweise</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Von Beli!</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <b>Deutsch</b> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=version&labelColor=0f1013&color=5b9dff" alt="version" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/kostenlos-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="kostenlos" />
  <img src="https://img.shields.io/badge/sprachen-8-5b9dff?style=flat-square&labelColor=0f1013" alt="sprachen" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Farbthemen in Sophy Studio wechseln" width="100%" />

<sub>Eine App, neun Farbthemen und ein Farbwähler für alles dazwischen.</sub>

</div>

<br />

## Was drin ist

Sechs Werkzeuge in einem Fenster, so gruppiert, wie du wirklich arbeitest: **Audio holen**, **etwas daraus machen**, **aufräumen**. Alles läuft auf deinem eigenen PC. Keine Konten, keine Upload-Warteschlangen.

<br />

### 01 &nbsp;/&nbsp; Download

**Suno Downloader.** Füge einen Suno-Link ein und erhalte den Track als 320-kbps-MP3, verlustfreies WAV oder Original-Stream, dazu Cover, Songtext oder alles zusammen als ZIP. Tags und Cover werden in die Datei geschrieben, und deine letzten Tracks bleiben in einem durchsuchbaren Verlauf.

**Universal Downloader.** Ein Feld für YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud und mehr. Wähle **MP4-Video** oder **MP3-Audio mit 320k**. Jeder Download landet in einem Verlauf, den du filtern, sortieren und wieder öffnen kannst.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/ana-sayfa.png" alt="Home" /></td>
  </tr>
  <tr>
    <td><sub><b>Universal Downloader:</b> abrufen, Vorschau ansehen, Video oder Audio wählen.</sub></td>
    <td><sub><b>Startseite:</b> alle Werkzeuge gruppiert an einem Ort (hier auf Türkisch).</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Erstellen

**Suno Style Prompter.** Beschreibe einen Song mit deinen eigenen Worten, in jeder Sprache, und erhalte einen einfügefertigen **Style of Music** (bis 1.000 Zeichen) und eine **Structure** (bis 5.000). Verfeinere ihn wie im Gespräch: *„weniger Bass“*, *„BPM 140“*, *„Saxofon ins Intro“*. Er schreibt nie Songtexte, die Worte bleiben deine. Er funktioniert offline: Eine Regel-Engine versteht acht Sprachen sofort, ein kleines eingebautes KI-Modell (Qwen2.5 1.5B, lokal über llama.cpp) erledigt den Rest.

**Sample Cutter.** Lade einen beliebigen Track, schiebe ein festes 8-Sekunden-Fenster über die Wellenform, höre es in der Schleife und exportiere den Ausschnitt als MP3 oder WAV. Gemacht für den Audio-Upload von Suno.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter:</b> unten der Chat, oben Style und Structure, ein Klick zum Kopieren.</sub></td>
    <td><sub><b>Sample Cutter:</b> ein exakter 8-Sekunden-Ausschnitt, framegenau verschiebbar.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Bearbeiten &amp; analysieren

**Metadata Editor.** Titel, Interpret, Album, Jahr, Genre, Tracknummer, Kommentar und Cover für MP3, WAV, FLAC und M4A. WAV-Tags werden so abgelegt, wie der Windows Explorer sie erwartet, und jedes Speichern wird zurückgelesen, damit es wirklich sitzt.

**Key &amp; BPM Detect.** Datei ablegen und Tonart, Camelot-Code mit harmonischen Nachbarn und Tempo erhalten. Das BPM lässt sich feinjustieren (−1, +1, ÷2, ×2). Die Analyse läuft lokal mit Essentia.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor:</b> Tags und Cover, direkt in die Datei geschrieben.</sub></td>
    <td><sub><b>Key &amp; BPM:</b> Tonart, Position im Camelot-Rad und Tempo in Sekunden.</sub></td>
  </tr>
</table>

<br />

## Mach sie zu deiner

- **Farbthemen, die überall ankommen:** 9 Vorlagen (Ozean, Lagune, Wald, Bernstein, Glut, Karmesin, Orchidee, Violett, Graphit) oder jede beliebige Farbe. Sie färben Hintergründe, Seitenleiste, Rahmen und Auswahlen, nicht nur Schaltflächen. Der Hintergrundton bestimmt die Stärke.
- **Hell, dunkel oder wie Windows.**
- **Barrierefreiheit:** Textgröße von Klein bis Sehr groß ohne kaputtes Layout, Anzeige-Zoom von 90 % bis 150 % und ein Schalter für weniger Bewegung.
- **8 Sprachen:** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Deine Ordner:** lege getrennt fest, wohin Audio, Cover, Songtexte, ZIP-Dateien und Medien gehen.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lang.png" alt="Language" /></td>
    <td width="50%"><img src="docs/screenshots/erisilebilirlik.png" alt="Accessibility" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/output-folders.png" alt="Folders" /></td>
    <td width="50%"><img src="docs/screenshots/about.png" alt="About" /></td>
  </tr>
</table>

<br />

## Installation

1. Lade **`Sophy_Studio_Setup.exe`** aus dem [neuesten Release](https://github.com/umwt26/Sophy-Studio/releases/latest) herunter.
2. Starte es. Keine Administratorrechte nötig; es wird nur für deinen Windows-Benutzer installiert.
3. Öffne Sophy Studio über das Startmenü oder den Desktop.

**Voraussetzungen:** Windows 10 oder 11, 64 Bit. Das Visual C++ Redistributable wird nicht benötigt.

**Erster Start:** Sophy Studio lädt im Hintergrund FFmpeg, yt-dlp und das Offline-KI-Modell für den Prompter. Danach funktionieren die Analysewerkzeuge ohne Internet.

**Updates:** Die App prüft beim Start GitHub und aktualisiert sich selbst. Verlauf, Einstellungen und Downloads bleiben erhalten.

**Ältere PCs:** gebaut für Rechner mit i3/i5 der ersten Generation ohne Grafikkarte. Kann der Prozessor das KI-Modell nicht ausführen, wechselt der Prompter still zur Regel-Engine.

<br />

## Unter der Haube

| Bereich | Gebaut mit |
|---|---|
| App-Hülle | Tauri 2 · Rust |
| Oberfläche | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Audio | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| Downloads | Suno-API-Client · yt-dlp |
| Offline-KI | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Installer | NSIS, pro Benutzer |

<br />

<a id="made-by-beli"></a>

## Von Beli!

Sophy Studio wird von **Beli!** entworfen, gebaut und gepflegt, Produzent und Künstler, der die Werkzeuge aus zehn Browser-Tabs an einem Ort haben wollte.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Hören</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Folgen</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Reden &amp; mitbauen</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Fehler melden</a>
    </td>
  </tr>
</table>

**Unterstützt von** [Filerawave](https://www.filerawave.com), einer türkischen Musik- und Video-Vertriebsplattform für unabhängige Künstler, und [Filera Music](https://www.filera.page).

Ideen oder Probleme? Nutze **Feedback senden** in der App, eröffne ein Issue oder sag Hallo auf Discord.

<br />

## Lizenz

MIT.

Sophy Studio ist ein unabhängiges Projekt und steht in keiner Verbindung zu Suno, YouTube, Instagram, TikTok oder anderen Plattformen, mit denen es arbeitet, und wird von ihnen nicht unterstützt. Lade nur Inhalte herunter, die du nutzen darfst, und respektiere die Urheber und die Bedingungen der jeweiligen Plattform.
