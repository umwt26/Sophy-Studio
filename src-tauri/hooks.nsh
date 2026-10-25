; Sophy Studio NSIS hooks
;
; Keep this file minimal. Antivirus engines (Windows Defender included) score
; installers heuristically. A hidden script shell that bypasses execution
; policy and downloads executables, force-killing processes, or blindly
; running uninstallers on every launch are classic "dropper" signatures; they caused the
; v1.1.x setups to be flagged and quarantined. CI rejects this file if such
; commands come back.
;
; - Running-instance handling is done by Tauri's own NSIS template.
; - Upgrades over an existing currentUser install: installer.nsi (Tauri's
;   template with one change) removes the old copy silently, keeping app data,
;   then installs the new version. No "uninstall first?" page is shown.
; - ffmpeg / ffprobe / yt-dlp are fetched by the app at runtime
;   (sophy_core::*::ensure_*_binary), so the installer downloads nothing.
;
; Legacy cleanup works from Windows' own "Installed apps" registry entries
; (the same data Settings > Apps uses), never from guessed folders:
;   - v0.1.0 was installed per-machine (Program Files, HKLM)
;   - pre-rename builds were registered as "Sophy"
; The current per-user "Sophy Studio" install is handled by installer.nsi
; and is never uninstalled here. Uninstallers run with /S only, so the
; "delete app data" option stays off: history and settings are kept.

!macro SOPHY_REMOVE_LEGACY ID ROOT NAME
  !define _SL_ID ${ID}
  Push $R0
  Push $R1
  Push $R2
  ReadRegStr $R0 ${ROOT} "Software\Microsoft\Windows\CurrentVersion\Uninstall\${NAME}" "UninstallString"
  StrCmp $R0 "" sophy_legacy_done_${_SL_ID}
  ; strip surrounding quotes
  StrCpy $R2 $R0 1
  StrCmp $R2 '"' 0 +3
    StrCpy $R0 $R0 "" 1
    StrCpy $R0 $R0 -1
  ; safety: never remove the install that is being updated right now
  StrCmp $R0 "$INSTDIR\uninstall.exe" sophy_legacy_done_${_SL_ID}
  IfFileExists "$R0" 0 sophy_legacy_key_${_SL_ID}
    ${GetParent} "$R0" $R1
    DetailPrint "Removing previous Sophy installation: $R1"
    ExecWait '"$R0" /S _?=$R1'
    Delete "$R0"
    RMDir "$R1"
  sophy_legacy_key_${_SL_ID}:
  ; orphaned entry (folder already gone) -> drop it so it no longer shows in Apps
  DeleteRegKey ${ROOT} "Software\Microsoft\Windows\CurrentVersion\Uninstall\${NAME}"
  sophy_legacy_done_${_SL_ID}:
  Pop $R2
  Pop $R1
  Pop $R0
  !undef _SL_ID
!macroend

!macro NSIS_HOOK_PREINSTALL
  !insertmacro SOPHY_REMOVE_LEGACY 1 HKLM "Sophy Studio"
  !insertmacro SOPHY_REMOVE_LEGACY 2 HKLM "Sophy"
  !insertmacro SOPHY_REMOVE_LEGACY 3 HKCU "Sophy"

  ; Leftover shortcuts from the pre-rename "Sophy" builds
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
