!macro NSIS_HOOK_PREINSTALL
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; Create LocalAppData/SophyStudio/bin directory
  CreateDirectory "$LOCALAPPDATA\SophyStudio\bin"

  ; Silently start background download of ffmpeg, ffprobe and yt-dlp if not already present
  ExecShell "" "powershell.exe" "-WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command `if (!(Test-Path '$LOCALAPPDATA\SophyStudio\bin\ffmpeg.exe')) { try { (New-Object System.Net.WebClient).DownloadFile('https://github.com/eugeneware/ffmpeg-static/releases/latest/download/ffmpeg-win32-x64', '$LOCALAPPDATA\SophyStudio\bin\ffmpeg.exe') } catch {} }; if (!(Test-Path '$LOCALAPPDATA\SophyStudio\bin\ffprobe.exe')) { try { (New-Object System.Net.WebClient).DownloadFile('https://github.com/eugeneware/ffmpeg-static/releases/latest/download/ffprobe-win32-x64', '$LOCALAPPDATA\SophyStudio\bin\ffprobe.exe') } catch {} }; if (!(Test-Path '$LOCALAPPDATA\SophyStudio\bin\yt-dlp.exe')) { try { (New-Object System.Net.WebClient).DownloadFile('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe', '$LOCALAPPDATA\SophyStudio\bin\yt-dlp.exe') } catch {} }`"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
!macroend
