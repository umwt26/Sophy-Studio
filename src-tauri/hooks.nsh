; Sophy Studio NSIS hooks
;
; Keep this file minimal. Antivirus engines (Windows Defender included) score
; installers heuristically. A hidden script shell that bypasses execution
; policy and downloads executables, force-killing processes, or silently
; running uninstallers are classic "dropper" signatures; they caused the
; v1.1.x setups to be flagged and quarantined. CI rejects this file if such
; commands come back.
;
; - Running-instance handling is done by Tauri's own NSIS template.
; - Upgrades over an existing currentUser install are handled by Tauri itself.
; - ffmpeg / ffprobe / yt-dlp are fetched by the app at runtime
;   (sophy_core::*::ensure_*_binary), so the installer downloads nothing.

!macro NSIS_HOOK_PREINSTALL
  ; Legacy v0.1.0 was a machine-wide install under Program Files.
  ; Only touch it if it actually exists.
  IfFileExists "$PROGRAMFILES64\Sophy Studio\uninstall.exe" 0 +2
    ExecWait '"$PROGRAMFILES64\Sophy Studio\uninstall.exe" /S'

  IfFileExists "$PROGRAMFILES64\Sophy\uninstall.exe" 0 +2
    ExecWait '"$PROGRAMFILES64\Sophy\uninstall.exe" /S'

  ; Leftover per-user shortcut from the pre-rename "Sophy" builds
  Delete "$DESKTOP\Sophy.lnk"
  Delete "$SMPROGRAMS\Sophy.lnk"
!macroend

!macro NSIS_HOOK_POSTINSTALL
  CreateDirectory "$LOCALAPPDATA\SophyStudio\bin"
!macroend

!macro NSIS_HOOK_PREUNINSTALL
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
!macroend
