<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>Скачивай. Обрабатывай. Подписывай. Выпускай.</b><br />
Небольшое приложение для Windows, которое забирает из браузера всю рутину создания музыки.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Скачать для Windows</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Что нового</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Автор — Beli!</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <b>Русский</b> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F&labelColor=0f1013&color=5b9dff" alt="версия" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/%D0%B1%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D0%BE-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="бесплатно" />
  <img src="https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA%D0%BE%D0%B2-8-5b9dff?style=flat-square&labelColor=0f1013" alt="языков" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Смена цветовой темы в Sophy Studio" width="100%" />

<sub>Одно приложение, девять цветовых тем и палитра для всего остального.</sub>

</div>

<br />

## Что внутри

Шесть инструментов в одном окне, сгруппированных так, как вы на самом деле работаете: **получить звук**, **сделать из него что-то**, **привести в порядок**. Всё работает на вашем компьютере. Никаких аккаунтов и очередей загрузки.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Home" width="100%" /><br />
  <sub><b>Главная:</b> все инструменты в одном месте (здесь на турецком).</sub>
</p>

### 01 &nbsp;/&nbsp; Загрузка

**Suno Downloader.** Вставьте ссылку Suno и получите трек в MP3 320 кбит/с, WAV без потерь или в исходном потоке, а также обложку, текст или всё сразу в zip-архиве. Теги и обложка записываются в файл, а последние треки остаются в истории с поиском.

**Universal Downloader.** Одно поле для YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud и других. Выберите **видео MP4** или **аудио MP3 320k**. Каждая загрузка попадает в историю, которую можно фильтровать, сортировать и открывать снова.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
  </tr>
  <tr>
    <td><sub><b>Suno Downloader:</b> данные трека, теги, аудио, обложка и текст на одном экране.</sub></td>
    <td><sub><b>Universal Downloader:</b> получить, посмотреть, выбрать видео или аудио.</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Создание

**Suno Style Prompter.** Опишите песню своими словами на любом языке и получите готовый **Style of Music** (до 1000 символов) и **Structure** (до 5000). Уточняйте как в разговоре: *«меньше баса»*, *«BPM 140»*, *«добавь саксофон во вступление»*. Он никогда не пишет текст песни, слова остаются вашими. Работает офлайн: движок правил сразу понимает восемь языков, а остальное берёт на себя небольшая встроенная модель ИИ (Qwen2.5 1.5B, локально через llama.cpp).

**Sample Cutter.** Загрузите любой трек, передвигайте фиксированное окно в 8 секунд по волновой форме, слушайте по кругу и экспортируйте фрагмент в MP3 или WAV. Сделано для загрузки аудио в Suno.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter:</b> чат внизу, Style и Structure сверху, копирование в один клик.</sub></td>
    <td><sub><b>Sample Cutter:</b> ровно 8 секунд, с покадровой подстройкой.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Правка и анализ

**Metadata Editor.** Название, исполнитель, альбом, год, жанр, номер трека, комментарий и обложка для MP3, WAV, FLAC и M4A. Теги WAV размещаются так, как их ожидает Проводник Windows, а каждое сохранение перечитывается, чтобы убедиться, что оно действительно записано.

**Key &amp; BPM Detect.** Перетащите файл и получите тональность, код Camelot с гармоничными соседями и темп. BPM можно подправить (−1, +1, ÷2, ×2). Анализ выполняется локально с помощью Essentia.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor:</b> теги и обложка записываются прямо в файл.</sub></td>
    <td><sub><b>Key &amp; BPM:</b> тональность, место на круге Camelot и темп за секунды.</sub></td>
  </tr>
</table>

<br />

## Под себя

- **Цветовые темы для всего интерфейса:** 9 готовых (Океан, Лагуна, Лес, Янтарь, Угли, Багровый, Орхидея, Фиалка, Графит) или любой цвет. Они окрашивают фон, боковую панель, рамки и выделение, а не только кнопки. «Оттенок фона» задаёт силу.
- **Светлая, тёмная или как в Windows.**
- **Специальные возможности:** размер текста от мелкого до очень крупного без поломки макета, масштаб интерфейса от 90 % до 150 % и переключатель «Уменьшить движение».
- **8 языков:** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Ваши папки:** отдельно выберите, куда сохранять аудио, обложки, тексты, zip-архивы и медиа.

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

## Установка

1. Скачайте **`Sophy_Studio_Setup.exe`** из [последнего релиза](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Запустите. Права администратора не нужны: приложение ставится только для вашего пользователя Windows.
3. Откройте Sophy Studio из меню «Пуск» или с рабочего стола.

**Требования:** 64-разрядная Windows 10 или 11. Visual C++ Redistributable не нужен.

**Первый запуск:** Sophy Studio в фоне скачивает FFmpeg, yt-dlp и офлайн-модель ИИ для Prompter. После этого инструменты анализа работают без интернета.

**Обновления:** при запуске приложение проверяет GitHub и обновляется само. История, настройки и загрузки сохраняются.

**Старые ПК:** рассчитано на компьютеры с i3/i5 первого поколения без видеокарты. Если процессор не тянет модель ИИ, Prompter незаметно переходит на движок правил.

<br />

## Под капотом

| Часть | Технологии |
|---|---|
| Оболочка | Tauri 2 · Rust |
| Интерфейс | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Аудио | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| Загрузки | Клиент Suno API · yt-dlp |
| Офлайн-ИИ | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Установщик | NSIS, для пользователя |

<br />

<a id="made-by-beli"></a>

## Автор — Beli!

Sophy Studio проектирует, разрабатывает и поддерживает **Beli!** — продюсер и артист, которому хотелось собрать в одном месте инструменты, раньше разбросанные по десяти вкладкам браузера.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Слушать</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Подписаться</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Общение и разработка</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Сообщить об ошибке</a>
    </td>
  </tr>
</table>

**При поддержке** [Filerawave](https://www.filerawave.com) — турецкой платформы дистрибуции музыки и видео для независимых артистов — и [Filera Music](https://www.filera.page).

Есть идеи или проблемы? Откройте страницу **«Отправить отзыв»** в приложении, создайте issue или заходите в Discord.

<br />

## Лицензия

MIT.

Sophy Studio — независимый проект, не связанный с Suno, YouTube, Instagram, TikTok или другими платформами, с которыми он работает, и не одобренный ими. Скачивайте только тот контент, который вы вправе использовать, и уважайте авторов и правила каждой платформы.
