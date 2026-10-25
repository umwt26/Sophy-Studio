<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>Download it. Shape it. Tag it. Ship it.</b><br />
A small Windows app that keeps the boring parts of making music out of your browser.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Download for Windows</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Release notes</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Made by Beli!</a>
</p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=version&labelColor=0f1013&color=5b9dff" alt="Latest version" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 and 11" />
  <img src="https://img.shields.io/badge/price-free-5b9dff?style=flat-square&labelColor=0f1013" alt="Free" />
  <img src="https://img.shields.io/badge/languages-8-5b9dff?style=flat-square&labelColor=0f1013" alt="8 languages" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Switching colour themes in Sophy Studio" width="100%" />

<sub>One app, nine colour themes, and a colour picker for everything in between.</sub>

</div>

<br />

## What's inside

Six tools in one window, grouped the way you actually work: **get the audio**, **make something with it**, **clean it up**. Everything runs on your own PC. There are no accounts and no upload queues.

<br />

### 01 &nbsp;/&nbsp; Download

**Suno Downloader.** Paste a Suno link and get the track as 320 kbps MP3, lossless WAV or the original stream, plus cover art, lyrics, or everything zipped together. Tags and artwork are written into the file, and your recent tracks stay in a searchable history.

**Universal Downloader.** One box for YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud and more. Pick **MP4 video** or **MP3 320k audio**. Every download lands in a history you can filter, sort and reopen.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/ana-sayfa.png" alt="Home screen" /></td>
  </tr>
  <tr>
    <td><sub><b>Universal Downloader:</b> fetch, preview, choose video or audio.</sub></td>
    <td><sub><b>Home:</b> every tool grouped in one place (shown here in Turkish).</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Create

**Suno Style Prompter.** Describe a song in your own words, in any language, and get a ready-to-paste **Style of Music** (up to 1,000 characters) and **Structure** (up to 5,000). Refine it like a conversation: *"less bass"*, *"BPM 140"*, *"add saxophone to the intro"*. It never writes lyrics, so the words stay yours. It works offline: a rule engine understands eight languages instantly, and a small built-in AI model (Qwen2.5 1.5B, running locally through llama.cpp) handles the rest.

**Sample Cutter.** Load any track, slide a fixed 8-second window across the waveform, preview it in a loop and export the slice as MP3 or WAV. Built for Suno's audio upload.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter:</b> chat on the bottom, Style and Structure on top, one click to copy.</sub></td>
    <td><sub><b>Sample Cutter:</b> an exact 8-second slice, nudged to the frame.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Edit &amp; analyze

**Metadata Editor.** Title, artist, album, year, genre, track number, comment and cover art for MP3, WAV, FLAC and M4A. WAV tags are laid out the way Windows Explorer expects, and every save is read back to make sure it actually stuck.

**Key &amp; BPM Detect.** Drop a file and get its key, the Camelot code with harmonic neighbours, and the tempo. You can fine-tune the BPM (−1, +1, ÷2, ×2). Analysis runs locally with Essentia.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key and BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor:</b> tags and artwork, written straight into the file.</sub></td>
    <td><sub><b>Key &amp; BPM:</b> key, Camelot wheel position and tempo in seconds.</sub></td>
  </tr>
</table>

<br />

## Make it yours

- **Colour themes that reach everything:** 9 presets (Ocean, Lagoon, Forest, Amber, Ember, Crimson, Orchid, Violet, Graphite) or any colour. They tint backgrounds, the sidebar, borders and selections, not just buttons. Background tone sets how strong the tint is.
- **Light, dark or follow Windows.**
- **Accessibility:** text size from Small to Extra large without breaking the layout, display zoom from 90% to 150%, and a reduce-motion switch.
- **8 languages:** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Your folders:** choose where audio, cover art, lyrics, zip files and media go, separately.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lang.png" alt="Language settings" /></td>
    <td width="50%"><img src="docs/screenshots/erisilebilirlik.png" alt="Accessibility settings" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/output-folders.png" alt="Output folders" /></td>
    <td width="50%"><img src="docs/screenshots/about.png" alt="About" /></td>
  </tr>
</table>

<br />

## Install

1. Download **`Sophy_Studio_Setup.exe`** from the [latest release](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Run it. No admin rights needed; it installs for your Windows user only.
3. Open Sophy Studio from the Start menu or desktop.

**Requirements:** 64-bit Windows 10 or 11. The Visual C++ Redistributable is not needed.

**First launch:** Sophy Studio fetches FFmpeg and yt-dlp, and the offline AI model for the Prompter, in the background. After that the analysis tools work without internet.

**Updates:** the app checks GitHub on start-up and updates itself in place. Your history, settings and downloads are kept.

**Older PCs:** built to run on first-gen i3/i5 machines without a graphics card. If the processor can't run the AI model, the Prompter quietly falls back to its rule engine.

<br />

## Under the hood

| Part | Built with |
|---|---|
| App shell | Tauri 2 · Rust |
| Interface | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Audio | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| Downloads | Suno API client · yt-dlp |
| Offline AI | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Installer | NSIS, per-user |

<br />

## Made by Beli!

Sophy Studio is designed, built and maintained by **Beli!**, a producer and artist who wanted the tools that used to live in ten browser tabs in one place.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Listen</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Follow</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Talk &amp; build</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Report a bug</a>
    </td>
  </tr>
</table>

**Supported by** [Filerawave](https://www.filerawave.com), a Turkey-based music and video distribution platform for independent artists, and [Filera Music](https://www.filera.page).

Ideas or problems? Use **Send Feedback** inside the app, open an issue, or say hi on Discord.

<br />

## License

MIT.

Sophy Studio is an independent project and is not affiliated with or endorsed by Suno, YouTube, Instagram, TikTok or any other platform it works with. Only download content you have the right to use, and respect the creators and the terms of each platform.
