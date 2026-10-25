<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>Téléchargez. Façonnez. Étiquetez. Partagez.</b><br />
Une petite app Windows qui sort de votre navigateur les parties ennuyeuses de la création musicale.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Télécharger pour Windows</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Notes de version</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Par Beli!</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <b>Français</b> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=version&labelColor=0f1013&color=5b9dff" alt="version" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/gratuit-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="gratuit" />
  <img src="https://img.shields.io/badge/langues-8-5b9dff?style=flat-square&labelColor=0f1013" alt="langues" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Changer de thème de couleur dans Sophy Studio" width="100%" />

<sub>Une app, neuf thèmes de couleur et un sélecteur pour tout le reste.</sub>

</div>

<br />

## Ce qu'il y a dedans

Six outils dans une seule fenêtre, rangés comme vous travaillez vraiment : **récupérer l'audio**, **en faire quelque chose**, **le mettre au propre**. Tout tourne sur votre PC. Pas de compte, pas de file d'attente d'envoi.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Home" width="100%" /><br />
  <sub><b>Accueil :</b> tous les outils regroupés au même endroit (ici en turc).</sub>
</p>

### 01 &nbsp;/&nbsp; Télécharger

**Suno Downloader.** Collez un lien Suno et récupérez le morceau en MP3 320 kbps, en WAV sans perte ou en flux original, avec la pochette, les paroles ou le tout dans un zip. Les tags et la pochette sont écrits dans le fichier, et vos derniers morceaux restent dans un historique consultable.

**Universal Downloader.** Un seul champ pour YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud et plus. Choisissez **vidéo MP4** ou **audio MP3 320k**. Chaque téléchargement rejoint un historique que vous pouvez filtrer, trier et rouvrir.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
  </tr>
  <tr>
    <td><sub><b>Suno Downloader :</b> infos du morceau, tags, audio, pochette et paroles au même endroit.</sub></td>
    <td><sub><b>Universal Downloader :</b> récupérer, prévisualiser, choisir vidéo ou audio.</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Créer

**Suno Style Prompter.** Décrivez un morceau avec vos mots, dans n'importe quelle langue, et obtenez un **Style of Music** prêt à coller (jusqu'à 1 000 caractères) et une **Structure** (jusqu'à 5 000). Affinez comme dans une conversation : *« moins de basse »*, *« BPM 140 »*, *« ajoute un saxophone dans l'intro »*. Il n'écrit jamais de paroles, les mots restent les vôtres. Il fonctionne hors ligne : un moteur de règles comprend huit langues instantanément, et un petit modèle d'IA intégré (Qwen2.5 1.5B, exécuté localement via llama.cpp) gère le reste.

**Sample Cutter.** Chargez n'importe quel morceau, faites glisser une fenêtre fixe de 8 secondes sur la forme d'onde, écoutez-la en boucle et exportez l'extrait en MP3 ou WAV. Pensé pour l'import audio de Suno.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter :</b> la discussion en bas, Style et Structure en haut, un clic pour copier.</sub></td>
    <td><sub><b>Sample Cutter :</b> un extrait de 8 secondes exactes, ajustable image par image.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Modifier &amp; analyser

**Metadata Editor.** Titre, artiste, album, année, genre, numéro de piste, commentaire et pochette pour MP3, WAV, FLAC et M4A. Les tags WAV sont placés comme l'Explorateur Windows les attend, et chaque enregistrement est relu pour vérifier qu'il a bien été écrit.

**Key &amp; BPM Detect.** Déposez un fichier et obtenez sa tonalité, le code Camelot avec ses voisins harmoniques et le tempo. Vous pouvez affiner le BPM (−1, +1, ÷2, ×2). L'analyse tourne localement avec Essentia.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor :</b> tags et pochette, écrits directement dans le fichier.</sub></td>
    <td><sub><b>Key &amp; BPM :</b> tonalité, position sur la roue Camelot et tempo en quelques secondes.</sub></td>
  </tr>
</table>

<br />

## À votre image

- **Des thèmes de couleur qui touchent tout :** 9 préréglages (Océan, Lagon, Forêt, Ambre, Braise, Cramoisi, Orchidée, Violet, Graphite) ou n'importe quelle couleur. Ils teintent les fonds, la barre latérale, les bordures et les sélections, pas seulement les boutons. La teinte de fond règle leur intensité.
- **Clair, sombre ou comme Windows.**
- **Accessibilité :** taille du texte de Petit à Très grand sans casser la mise en page, zoom d'affichage de 90 % à 150 % et un interrupteur pour réduire les animations.
- **8 langues :** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Vos dossiers :** choisissez séparément où vont l'audio, les pochettes, les paroles, les zip et les médias.

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

## Installation

1. Téléchargez **`Sophy_Studio_Setup.exe`** depuis la [dernière version](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Lancez-le. Pas besoin de droits administrateur ; il s'installe uniquement pour votre utilisateur Windows.
3. Ouvrez Sophy Studio depuis le menu Démarrer ou le bureau.

**Configuration requise :** Windows 10 ou 11 64 bits. Le Visual C++ Redistributable n'est pas nécessaire.

**Premier lancement :** Sophy Studio récupère en arrière-plan FFmpeg, yt-dlp et le modèle d'IA hors ligne du Prompter. Ensuite, les outils d'analyse fonctionnent sans internet.

**Mises à jour :** l'app vérifie GitHub au démarrage et se met à jour toute seule. Votre historique, vos réglages et vos téléchargements sont conservés.

**PC plus anciens :** conçu pour tourner sur des i3/i5 de première génération sans carte graphique. Si le processeur ne peut pas exécuter le modèle d'IA, le Prompter passe discrètement à son moteur de règles.

<br />

## Sous le capot

| Partie | Construit avec |
|---|---|
| Coque de l'app | Tauri 2 · Rust |
| Interface | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Audio | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| Téléchargements | Client API Suno · yt-dlp |
| IA hors ligne | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Installateur | NSIS, par utilisateur |

<br />

<a id="made-by-beli"></a>

## Par Beli!

Sophy Studio est conçu, développé et maintenu par **Beli!**, producteur et artiste qui voulait réunir en un seul endroit les outils dispersés dans dix onglets.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Écouter</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Suivre</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Discuter &amp; contribuer</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Signaler un bug</a>
    </td>
  </tr>
</table>

**Soutenu par** [Filerawave](https://www.filerawave.com), une plateforme turque de distribution musicale et vidéo pour artistes indépendants, et [Filera Music](https://www.filera.page).

Des idées ou un problème ? Utilisez **Envoyer un retour** dans l'app, ouvrez une issue ou passez sur Discord.

<br />

## Licence

MIT.

Sophy Studio est un projet indépendant, sans lien avec Suno, YouTube, Instagram, TikTok ou toute autre plateforme avec laquelle il fonctionne, et n'est pas approuvé par elles. Ne téléchargez que des contenus que vous avez le droit d'utiliser, et respectez les créateurs et les conditions de chaque plateforme.
