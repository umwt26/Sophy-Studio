# Sophy Studio v1.2

A patch release that fixes the in-app updater.

### Fixes
- **Update loop fixed:** the app no longer asks to update again and again after installing.
- **No more antivirus warnings from the installer:** removed the installer steps that Windows Security mistook for malware. Required tools (FFmpeg, yt-dlp) are still set up automatically by the app.
- **Safer updates:** the installer is verified (size and checksum) before it runs, installs in place with a progress bar, and Sophy Studio reopens by itself when it finishes.
- **Clearer errors:** if a download fails or is blocked, the update screen explains why and offers a manual download.

Your history, settings and downloaded files are kept.

### Download
- **`Sophy_Studio_Setup.exe`**: Windows installer
