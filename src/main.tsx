import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ConverterWindow } from './components/ConverterWindow.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { applyTheme, loadSavedTheme } from './utils/theme'
import { applyAccessibility, loadAccessibility } from './utils/accessibility'
import { applyGlass, loadGlass } from './utils/ui'

// Theme, glass and zoom go on before React paints anything, so the first frame is already final
applyTheme(loadSavedTheme())
applyGlass(loadGlass())
const zoomReady = applyAccessibility(loadAccessibility())

// The window starts hidden (tauri.conf.json "visible": false) and appears once the first
// real frame is drawn: no white box, no layout jump. A timer makes sure it always shows.
let shown = false
const showWindow = async () => {
  if (shown || !("__TAURI_INTERNALS__" in window)) return
  shown = true
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    await getCurrentWindow().show()
  } catch (e) {
    console.warn("Could not show the window:", e)
  }
}
setTimeout(showWindow, 2500)
void zoomReady.finally(() => requestAnimationFrame(() => requestAnimationFrame(() => void showWindow())))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* Explorer's right-click menu opens the converter window in its own process */}
      {(window as { __SOPHY_CONVERTER__?: boolean }).__SOPHY_CONVERTER__ ? <ConverterWindow /> : <App />}
    </ErrorBoundary>
  </StrictMode>,
)
