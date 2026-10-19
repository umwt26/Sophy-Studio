<div align="center">

# 🎵 Sophy — Suno Downloader & Toolkit

**L'outil ultime et ultra-rapide de téléchargement et boîte à outils pour Suno AI.**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/sophy-suno-downloader/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/sophy-suno-downloader)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / Langue :** [English](README.md) • [Türkçe](README_TR.md) • [Deutsch](README_DE.md) • **Français** • [Español](README_ES.md) • [Русский](README_RU.md) • [Português](README_PT.md) • [日本語](README_JA.md)

</div>

---

## 💡 À propos de Sophy

> **Vous en avez assez des limites de téléchargement de Suno, des quotas restrictifs et des interfaces web lentes ?**  
> Bienvenue sur **Sophy** ! La création musicale ne devrait jamais être freinée par des démarches de téléchargement fastidieuses. Sophy permet aux créateurs, producteurs et passionnés d'extraire des pistes audio en qualité studio, des fichiers WAV sans perte, des pochettes HD et les paroles directement à partir des liens Suno dans des dossiers parfaitement organisés – de manière 100 % gratuite, illimitée et fulgurante.

---

## ✨ Fonctionnalités clés

- **⚡ Analyse instantanée des morceaux :** Collez n'importe quel lien Suno (`suno.com/s/...`, `suno.com/song/...` ou UUID) et obtenez métadonnées, tags, paroles et pochettes en moins d'une seconde.
- **🎧 Formats audio studio :**
  - **MP3 (320 kbps)** — Conversion haute fidélité avec tags ID3 intégrés (Titre, Artiste, Style/Genre et pochette).
  - **WAV (Sans perte 44.1 kHz 16-bit)** — Audio non compressé prêt à être importé dans votre STAN (FL Studio, Ableton, Logic Pro, etc.).
  - **Audio original** — Flux source direct sans réencodage.
- **📦 Tout télécharger (.zip) :** Emballez le MP3 320k, la pochette HD (.jpg) et les paroles (.txt) dans un fichier `.zip` ordonné en un seul clic.
- **🕒 Historique de recherche local :** Ne perdez plus jamais un morceau. Vos recherches sont mémorisées localement et rechargeables instantanément.
- **🌍 8 langues d'interface :** English, Türkçe, Deutsch, Français, Español, Русский, Português et 日本語 avec changement dynamique.
- **🚀 Mises à jour automatiques intégrées :** Détecte les nouvelles versions au démarrage et installe la mise à jour directement dans l'application !
- **📁 Bibliothèque locale organisée :** Vos fichiers sont classés proprement dans `Documents\Sophy\` avec des sous-dossiers dédiés (`Audio`, `Cover Art`, `Lyrics`, `All`).

---

## 📸 Aperçu & Captures d'écran

### 1. Fiche du morceau & Outils de téléchargement
Analysez les prompts, la version du modèle et téléchargez en un clin d'œil :
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy Détails du morceau" width="850" />
</div>

<br />

### 2. Sélecteur de formats audio (MP3 / WAV / Original)
Choisissez le format idéal adapté à l'écoute nomade ou à la production musicale :
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy Formats audio" width="850" />
</div>

<br />

### 3. Historique local des recherches
Retrouvez vos titres précédents ou nettoyez votre historique en toute liberté :
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy Historique" width="850" />
</div>

<br />

### 4. Support multilingue international
Passez facilement d'une langue à une autre selon vos préférences :
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy Langues" width="850" />
</div>

<br />

### 5. Interface d'accueil minimaliste
Un design sombre, élégant et sans distraction pensé pour une efficacité maximale :
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy Écran principal" width="850" />
</div>

---

## 📥 Installation

### Programme d'installation Windows (Setup)
1. Téléchargez la dernière version de `Sophy_Setup.exe` sur la page [Releases](https://github.com/umwt26/sophy-suno-downloader/releases).
2. Lancez l'installateur et laissez-vous guider par l'assistant.
3. Lancez **Sophy** depuis votre bureau ou le menu Démarrer !

---

## 🛠️ Stack technique & Architecture

| Composant | Technologies |
| :--- | :--- |
| **Cœur Desktop** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **Interface UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Moteur média** | Pipeline de déchiffrement Rust & [FFmpeg](https://ffmpeg.org/) (mode silencieux) |
| **Installateur** | Assistant d'installation personnalisé NSIS 3.x |

---

## 🧑‍💻 Développeur & Crédits

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 Licence & Mentions légales

Ce projet est sous licence MIT.  
*Avertissement : Sophy est un projet open-source indépendant et n'est ni affilié ni approuvé par Suno AI. Veuillez respecter les droits d'auteur et les conditions d'utilisation des créateurs et des plateformes.*
