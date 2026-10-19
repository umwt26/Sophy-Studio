<div align="center">

# 🎵 Sophy — Suno Downloader & Toolkit

**Ультимативный высокопроизводительный десктопный загрузчик и инструментарий для медиа Suno AI.**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/sophy-suno-downloader/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/sophy-suno-downloader)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / Язык:** [English](README.md) • [Türkçe](README_TR.md) • [Deutsch](README_DE.md) • [Français](README_FR.md) • [Español](README_ES.md) • **Русский** • [Português](README_PT.md) • [日本語](README_JA.md)

</div>

---

## 💡 О программе Sophy

> **Устали от ограничений на скачивание в Suno, лимитов и медленного веб-интерфейса?**  
> Добро пожаловать в **Sophy**! Создание музыки не должно упираться в неудобный процесс загрузки. Sophy позволяет музыкантам, продюсерам и слушателям получать чистый студийный звук, lossless WAV, обложки в оригинальном качестве и тексты песен напрямую по ссылкам Suno в аккуратно структурированные папки — абсолютно бесплатно, без ограничений и молниеносно.

---

## ✨ Ключевые возможности

- **⚡ Мгновенный анализ трека:** Вставьте любую ссылку Suno (`suno.com/s/...`, `suno.com/song/...` или UUID) и получите полные метаданные, промпты, текст и обложку менее чем за секунду.
- **🎧 Студийные аудиоформаты:**
  - **MP3 (320 kbps)** — Чистая конвертация с встроенными ID3-тегами (название, автор, жанр и обложка).
  - **WAV (Lossless 44.1 kHz 16-bit)** — Несжатое аудио без потерь, готовое для импорта в DAW (FL Studio, Ableton, Logic Pro и др.).
  - **Оригинальное аудио** — Прямой поток исходного качества без перекодирования.
- **📦 Скачать всё (.zip):** 320kbps MP3, обложка в HD (.jpg) и текст (.txt), упакованные в один аккуратный `.zip`-архив в один клик.
- **🕒 Локальная история поиска:** Ваши предыдущие запросы сохраняются прямо на устройстве и открываются заново в один клик.
- **🌍 8 языков интерфейса:** English, Türkçe, Deutsch, Français, Español, Русский, Português и 日本語 с моментальным переключением.
- **🚀 Встроенный автоапдейтер:** Автоматически проверяет наличие обновлений на GitHub и позволяет обновиться прямо внутри приложения в один клик.
- **📁 Четкая структура файлов:** Все загрузки автоматически сохраняются в `Документы\Sophy\` по удобным подпапкам (`Audio`, `Cover Art`, `Lyrics`, `All`).

---

## 📸 Скриншоты и интерфейс

### 1. Детали трека и панель загрузки
Просматривайте стили, промпты, версию модели и запускайте быструю загрузку:
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy Детали трека" width="850" />
</div>

<br />

### 2. Выбор аудиоформата (MP3 / WAV / Оригинал)
Выбирайте оптимальный формат как для прослушивания, так и для студийной работы:
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy Выбор формата" width="850" />
</div>

<br />

### 3. Локальная история поиска
Быстрый доступ к ранее обработанным композициям и простая очистка истории:
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy История поиска" width="850" />
</div>

<br />

### 4. Мультиязычный интерфейс
Переключайтесь между 8 поддерживаемыми языками в реальном времени:
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy Выбор языка" width="850" />
</div>

<br />

### 5. Минималистичный домашний экран
Стильная темная тема без лишних отвлекающих элементов для максимального комфорта:
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy Главный экран" width="850" />
</div>

---

## 📥 Установка

### Установщик для Windows (Setup)
1. Скачайте свежий `Sophy_Setup.exe` со страницы [Releases](https://github.com/umwt26/sophy-suno-downloader/releases).
2. Запустите инсталлятор и следуйте подсказкам мастера установки.
3. Запускайте **Sophy** с рабочего стола или из меню «Пуск»!

---

## 🛠️ Стек технологий

| Уровень | Технологии |
| :--- | :--- |
| **Десктопная основа** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **Фронтенд** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Медиа-движок** | Собственный Rust-пайплайн дешифрования и [FFmpeg](https://ffmpeg.org/) (тихий режим) |
| **Инсталлятор** | Кастомный мастер установки NSIS 3.x |

---

## 🧑‍💻 Автор и благодарности

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 Лицензия и правовая информация

Проект распространяется под лицензией MIT.  
*Дисклеймер: Sophy — независимый проект с открытым исходным кодом и официально не связан с Suno AI. Пожалуйста, соблюдайте авторские права и правила сервисов.*
