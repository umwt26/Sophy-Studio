<div align="center">

# 🎵 Sophy Studio — Suite de Producción de Audio y Música Todo en Uno

**La estación de audio moderna: Suno Song Downloader, Metadata Editor y Key & BPM Detect.**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/Sophy-Studio/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/Sophy-Studio)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / Idioma:** [English](README.md) • [Türkçe](README_TR.md) • [Deutsch](README_DE.md) • [Français](README_FR.md) • **Español** • [Русский](README_RU.md) • [Português](README_PT.md) • [日本語](README_JA.md)

</div>

---

## 💡 Acerca de Sophy Studio

> **¿Cansado de los límites de descarga de Suno, las cuotas restrictivas y las interfaces web lentas?**  
> ¡Bienvenido a **Sophy Studio**! La generación creativa de música no debería estar limitada por procesos engorrosos. Sophy Studio permite a creadores, productores y oyentes extraer audio limpio en calidad de estudio, WAV sin pérdidas, portadas en alta resolución y letras directamente desde enlaces de Suno a carpetas perfectamente organizadas en tu ordenador, de forma totalmente gratuita, ilimitada y ultrarrápida.

---

## ✨ Características destacadas

- **⚡ Análisis instantáneo de canciones:** Pega cualquier enlace de Suno (`suno.com/s/...`, `suno.com/song/...` o UUID) y obtén metadatos, prompts, letras y portadas en menos de un segundo.
- **🎧 Formatos de audio de estudio:**
  - **MP3 (320 kbps)** — Conversión de alta fidelidad con etiquetas ID3 incrustadas (Título, Artista, Género y Portada).
  - **WAV (Sin pérdidas 44.1 kHz 16-bit)** — Audio sin compresión listo para importar directamente a tu DAW (FL Studio, Ableton, Logic Pro, etc.).
  - **Audio original** — Flujo directo de la fuente sin recodificación.
- **📦 Descargar todo (.zip):** Agrupa el MP3 de 320k, la portada en alta resolución (.jpg) y la letra (.txt) en un archivo `.zip` ordenado con un solo clic.
- **🕒 Historial de búsqueda local:** No vuelvas a perder una canción. Tus búsquedas se guardan en tu equipo y puedes recargarlas al instante.
- **🌍 8 idiomas de interfaz:** English, Türkçe, Deutsch, Français, Español, Русский, Português y 日本語 con cambio en tiempo real.
- **🚀 Actualizador automático integrado:** Comprueba si hay nuevas versiones al iniciar y descarga e instala actualizaciones dentro de la propia aplicación.
- **📁 Biblioteca local organizada:** Guarda tus archivos automáticamente en `Documentos\Sophy Studio\` organizados en subcarpetas (`Audio`, `Cover Art`, `Lyrics`, `All`).

---

## 📸 Galería de capturas de pantalla

### 1. Detalles de la canción y panel de descargas
Revisa prompts, estilos, versión del modelo y descarga a máxima velocidad:
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy Detalles de canción" width="850" />
</div>

<br />

### 2. Selector de formatos de audio (MP3 / WAV / Original)
Elige el formato óptimo para escuchar en cualquier lugar o producir en tu DAW:
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy Selector de audio" width="850" />
</div>

<br />

### 3. Historial de búsqueda local
Acceso rápido a canciones analizadas previamente o limpieza de historial con un toque:
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy Historial" width="850" />
</div>

<br />

### 4. Soporte multiidioma internacional
Alterna instantáneamente entre los 8 idiomas disponibles según tus preferencias:
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy Idiomas" width="850" />
</div>

<br />

### 5. Interfaz minimalista y moderna
Modo oscuro enfocado y libre de distracciones, diseñado para la máxima comodidad:
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy Pantalla principal" width="850" />
</div>

---

## 📥 Instalación

### Instalador para Windows (Setup)
1. Descarga el archivo `Sophy_Studio_Setup.exe` más reciente desde la página de [Releases](https://github.com/umwt26/Sophy-Studio/releases).
2. Ejecuta el instalador y sigue el asistente moderno.
3. ¡Abre **Sophy Studio** directamente desde tu Escritorio o Menú Inicio!

---

## 🛠️ Stack tecnológico y arquitectura

| Capa | Tecnologías |
| :--- | :--- |
| **Núcleo de escritorio** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **Interfaz de usuario** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Motor multimedia** | Pipeline de descifrado en Rust y [FFmpeg](https://ffmpeg.org/) (modo silencioso) |
| **Instalador** | Asistente de instalación personalizado con NSIS 3.x |

---

## 🧑‍💻 Desarrollador y créditos

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 Licencia y aviso legal

Este proyecto está bajo la Licencia MIT.  
*Aviso legal: Sophy Studio es una herramienta independiente de código abierto y no está afiliada ni respaldada oficialmente por Suno AI. Por favor, respeta los derechos de autor y los términos de servicio de los artistas y las plataformas.*
