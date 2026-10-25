<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>Descarga. Dale forma. Etiqueta. Publica.</b><br />
Una pequeña app de Windows que saca de tu navegador las partes aburridas de hacer música.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Descargar para Windows</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Notas de versión</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Hecho por Beli!</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <b>Español</b> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=versi%C3%B3n&labelColor=0f1013&color=5b9dff" alt="versión" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/gratis-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="gratis" />
  <img src="https://img.shields.io/badge/idiomas-8-5b9dff?style=flat-square&labelColor=0f1013" alt="idiomas" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Cambiar el tema de color en Sophy Studio" width="100%" />

<sub>Una app, nueve temas de color y un selector para todo lo demás.</sub>

</div>

<br />

## Qué incluye

Seis herramientas en una sola ventana, agrupadas como realmente trabajas: **consigue el audio**, **haz algo con él**, **déjalo listo**. Todo se ejecuta en tu propio PC. Sin cuentas y sin colas de subida.

<br />

### 01 &nbsp;/&nbsp; Descargar

**Suno Downloader.** Pega un enlace de Suno y obtén la canción en MP3 de 320 kbps, WAV sin pérdida o el stream original, además de la portada, la letra o todo junto en un zip. Las etiquetas y la portada se escriben en el archivo, y tus canciones recientes quedan en un historial con búsqueda.

**Universal Downloader.** Una sola caja para YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud y más. Elige **vídeo MP4** o **audio MP3 a 320k**. Cada descarga va a un historial que puedes filtrar, ordenar y volver a abrir.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/ana-sayfa.png" alt="Home" /></td>
  </tr>
  <tr>
    <td><sub><b>Universal Downloader:</b> obtén, previsualiza, elige vídeo o audio.</sub></td>
    <td><sub><b>Inicio:</b> todas las herramientas agrupadas en un solo lugar (aquí en turco).</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Crear

**Suno Style Prompter.** Describe una canción con tus palabras, en cualquier idioma, y obtén un **Style of Music** listo para pegar (hasta 1.000 caracteres) y una **Structure** (hasta 5.000). Afínalo como en una conversación: *«menos bajo»*, *«BPM 140»*, *«añade saxofón en la intro»*. Nunca escribe letras, las palabras siguen siendo tuyas. Funciona sin conexión: un motor de reglas entiende ocho idiomas al instante y un pequeño modelo de IA integrado (Qwen2.5 1.5B, ejecutado localmente con llama.cpp) se encarga del resto.

**Sample Cutter.** Carga cualquier canción, desliza una ventana fija de 8 segundos sobre la forma de onda, escúchala en bucle y exporta el fragmento en MP3 o WAV. Pensado para la subida de audio de Suno.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter:</b> el chat abajo, Style y Structure arriba, un clic para copiar.</sub></td>
    <td><sub><b>Sample Cutter:</b> un fragmento exacto de 8 segundos, ajustable fotograma a fotograma.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Editar y analizar

**Metadata Editor.** Título, artista, álbum, año, género, número de pista, comentario y portada para MP3, WAV, FLAC y M4A. Las etiquetas WAV se colocan como espera el Explorador de Windows, y cada guardado se vuelve a leer para comprobar que se escribió de verdad.

**Key &amp; BPM Detect.** Suelta un archivo y obtén su tonalidad, el código Camelot con sus vecinos armónicos y el tempo. Puedes ajustar el BPM (−1, +1, ÷2, ×2). El análisis se ejecuta localmente con Essentia.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor:</b> etiquetas y portada, escritas directamente en el archivo.</sub></td>
    <td><sub><b>Key &amp; BPM:</b> tonalidad, posición en la rueda Camelot y tempo en segundos.</sub></td>
  </tr>
</table>

<br />

## Hazla tuya

- **Temas de color que llegan a todo:** 9 predefinidos (Océano, Laguna, Bosque, Ámbar, Brasa, Carmesí, Orquídea, Violeta, Grafito) o cualquier color. Tiñen fondos, la barra lateral, bordes y selecciones, no solo botones. El tono de fondo define su intensidad.
- **Claro, oscuro o como Windows.**
- **Accesibilidad:** tamaño de texto de Pequeño a Muy grande sin romper el diseño, zoom de pantalla del 90 % al 150 % y un interruptor para reducir el movimiento.
- **8 idiomas:** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Tus carpetas:** elige por separado dónde va el audio, las portadas, las letras, los zip y los vídeos.

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

## Instalación

1. Descarga **`Sophy_Studio_Setup.exe`** desde la [última versión](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Ejecútalo. No necesita permisos de administrador; se instala solo para tu usuario de Windows.
3. Abre Sophy Studio desde el menú Inicio o el escritorio.

**Requisitos:** Windows 10 u 11 de 64 bits. No hace falta el Visual C++ Redistributable.

**Primer inicio:** Sophy Studio descarga en segundo plano FFmpeg, yt-dlp y el modelo de IA sin conexión del Prompter. Después, las herramientas de análisis funcionan sin internet.

**Actualizaciones:** la app revisa GitHub al iniciar y se actualiza sola. Tu historial, ajustes y descargas se conservan.

**PCs antiguos:** hecho para funcionar en equipos i3/i5 de primera generación sin tarjeta gráfica. Si el procesador no puede ejecutar el modelo de IA, el Prompter pasa en silencio a su motor de reglas.

<br />

## Por dentro

| Parte | Hecho con |
|---|---|
| Base de la app | Tauri 2 · Rust |
| Interfaz | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Audio | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| Descargas | Cliente de la API de Suno · yt-dlp |
| IA sin conexión | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Instalador | NSIS, por usuario |

<br />

<a id="made-by-beli"></a>

## Hecho por Beli!

Sophy Studio lo diseña, desarrolla y mantiene **Beli!**, productor y artista que quería reunir en un solo lugar las herramientas que antes vivían en diez pestañas del navegador.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Escuchar</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Seguir</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Hablar y construir</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Reportar un error</a>
    </td>
  </tr>
</table>

**Con el apoyo de** [Filerawave](https://www.filerawave.com), una plataforma turca de distribución de música y vídeo para artistas independientes, y [Filera Music](https://www.filera.page).

¿Ideas o problemas? Usa **Enviar comentarios** dentro de la app, abre un issue o saluda en Discord.

<br />

## Licencia

MIT.

Sophy Studio es un proyecto independiente y no está afiliado ni respaldado por Suno, YouTube, Instagram, TikTok ni ninguna otra plataforma con la que funciona. Descarga solo contenido que tengas derecho a usar y respeta a los creadores y los términos de cada plataforma.
