<div align="center">

# 🎵 Sophy Studio — Suno Downloader & Toolkit

**Suno AI メディアのための究極・超高速デスクトップダウンローダー＆ツールキット。**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/Sophy-Studio/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/Sophy-Studio)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / 言語:** [English](README.md) • [Türkçe](README_TR.md) • [Deutsch](README_DE.md) • [Français](README_FR.md) • [Español](README_ES.md) • [Русский](README_RU.md) • [Português](README_PT.md) • **日本語**

</div>

---

## 💡 Sophy Studio について

> **Sunoのダウンロード制限、クォータ、重いWebインターフェースにうんざりしていませんか？**  
> **Sophy Studio** へようこそ！クリエイティブな楽曲生成は、煩わしいダウンロード手順に邪魔されるべきではありません。Sophy Studio は、クリエイター、プロデューサー、リスナーが Suno リンクからスタジオ品質のオーディオ、可逆圧縮 WAV、高解像度のアートワーク、歌詞を直接PC内の整理されたフォルダへ抽出できる、完全無料・無制限・超高速なデスクトップツールです。

---

## ✨ 主な機能

- **⚡ 瞬時の楽曲解析:** Sunoの楽曲リンク（`suno.com/s/...`、`suno.com/song/...`、またはUUID）を貼り付けるだけで、1秒未満でメタデータ、プロンプトタグ、歌詞、ジャケット画像を自動取得。
- **🎧 スタジオ品質のオーディオフォーマット:**
  - **MP3 (320 kbps)** — ID3メタデータタグ（曲名、アーティスト、スタイル/ジャンル、アートワーク）が埋め込まれた高音質変換。
  - **WAV (ロスレス 44.1 kHz 16-bit)** — DAW（FL Studio、Ableton、Logic Proなど）にそのままインポート可能な非圧縮オーディオ。
  - **オリジナル音声** — エンコードなしでソース音声を直接取得。
- **📦 一括ダウンロード (.zip):** 320kbps MP3、高解像度ジャケット画像（.jpg）、歌詞（.txt）をワンクリックで整然とした `.zip` ファイルにパッケージ化。
- **🕒 ローカル検索履歴:** 過去に解析した楽曲をローカルに保存。履歴からいつでもワンクリックで再読み込み可能。
- **🌍 8ヶ国語の多言語対応:** English、Türkçe、Deutsch、Français、Español、Русский、Português、日本語に対応し、即座に言語切り替えが可能。
- **🚀 アプリ内自動アップデーター:** 起動時に GitHub Releases を自動確認し、最新バージョンをアプリ内で直接ダウンロード＆自動更新！
- **📁 整理されたローカルライブラリ:** ダウンロードしたメディアは `Documents\Sophy Studio\` 内の専用フォルダ（`Audio`, `Cover Art`, `Lyrics`, `All`）へ自動分類。

---

## 📸 スクリーンショット

### 1. 楽曲詳細 & ダウンロードツール
プロンプトタグ、モデルバージョンを確認し、高速ダウンロードを実行：
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy 楽曲詳細" width="850" />
</div>

<br />

### 2. オーディオフォーマット選択 (MP3 / WAV / Original)
音楽鑑賞用またはDAW編集用に最適なフォーマットを選択：
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy フォーマット選択" width="850" />
</div>

<br />

### 3. ローカル検索履歴
過去に取得したトラックへの素早いアクセスや履歴の整理：
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy 検索履歴" width="850" />
</div>

<br />

### 4. 国際多言語サポート
使い慣れた言語にリアルタイムで切り替え可能：
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy 言語切り替え" width="850" />
</div>

<br />

### 5. ミニマルで洗練されたメイン画面
作業に集中できる洗練されたダークテーマデザイン：
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy メイン画面" width="850" />
</div>

---

## 📥 インストール方法

### Windows インストーラー (Setup)
1. [Releases](https://github.com/umwt26/Sophy-Studio/releases) ページから最新の `Sophy_Studio_Setup.exe` をダウンロードします。
2. インストーラーを起動し、案内に従ってインストールを完了します。
3. デスクトップまたはスタートメニューから **Sophy Studio** を起動してお楽しみください！

---

## 🛠️ 技術スタック & アーキテクチャ

| レイヤー | 技術 |
| :--- | :--- |
| **デスクトップコア** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **フロントエンド UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **メディアエンジン** | 独自 Rust 復号パイプライン & [FFmpeg](https://ffmpeg.org/) (サイレントモード) |
| **インストーラー** | カスタム NSIS 3.x セットアップウィザード |

---

## 🧑‍💻 開発者 & クレジット

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 ライセンス & 免責事項

本プロジェクトは MIT ライセンスの下で公開されています。  
*免責事項: Sophy Studio は独立したオープンソースツールであり、Suno AI との公式な提携や保証はありません。各クリエイターおよびプラットフォームの利用規約や著作権を遵守してご利用ください。*
