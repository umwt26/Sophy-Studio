<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>ダウンロード。加工。タグ付け。リリース。</b><br />
音楽づくりの面倒な作業をブラウザから切り離す、小さな Windows アプリ。</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Windows 版をダウンロード</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">リリースノート</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Beli! 制作</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <b>日本語</b></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3&labelColor=0f1013&color=5b9dff" alt="バージョン" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/%E7%84%A1%E6%96%99-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="無料" />
  <img src="https://img.shields.io/badge/%E8%A8%80%E8%AA%9E-8-5b9dff?style=flat-square&labelColor=0f1013" alt="言語" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Sophy Studio でカラーテーマを切り替える様子" width="100%" />

<sub>ひとつのアプリに 9 つのカラーテーマ、その間を埋めるカラーピッカー。</sub>

</div>

<br />

## できること

6 つのツールをひとつのウィンドウに、実際の作業の流れどおりにまとめました：**音を手に入れる**、**それで何かを作る**、**仕上げる**。すべて自分の PC 上で動きます。アカウントもアップロード待ちもありません。

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Home" width="100%" /><br />
  <sub><b>ホーム：</b>すべてのツールをひとまとめに（画面はトルコ語表示）。</sub>
</p>

### 01 &nbsp;/&nbsp; ダウンロード

**Suno Downloader.** Suno のリンクを貼るだけで、320 kbps の MP3、ロスレス WAV、またはオリジナルのストリームで曲を取得。カバー画像や歌詞、すべてをまとめた zip も選べます。タグとカバーはファイルに書き込まれ、最近の曲は検索できる履歴に残ります。

**Universal Downloader.** YouTube、Instagram、TikTok、Facebook、X、Pinterest、Reddit、SoundCloud などにひとつの入力欄で対応。**MP4 動画**か **MP3 320k 音声**を選べます。ダウンロードはすべて、絞り込み・並べ替え・再表示ができる履歴に残ります。

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
  </tr>
  <tr>
    <td><sub><b>Suno Downloader：</b>曲の情報、タグ、音声、カバー、歌詞をひとつの画面で。</sub></td>
    <td><sub><b>Universal Downloader：</b>取得してプレビュー、動画か音声を選択。</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; 作成

**Suno Style Prompter.** 曲のイメージを自分の言葉で、どの言語でも書くだけで、そのまま貼れる **Style of Music**（最大 1,000 文字）と **Structure**（最大 5,000 文字）が手に入ります。*「ベースを控えめに」*、*「BPM 140」*、*「イントロにサックスを」*のように会話感覚で調整できます。歌詞は書かないので、言葉はあなたのものです。オフラインで動作：ルールエンジンが 8 言語を即座に理解し、それ以外は内蔵の小さな AI モデル（llama.cpp でローカル実行する Qwen2.5 1.5B）が担当します。

**Sample Cutter.** 好きな曲を読み込み、固定 8 秒のウィンドウを波形の上でスライド。ループで試聴し、MP3 か WAV で書き出せます。Suno の音声アップロード向けに作りました。

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter：</b>下でチャット、上に Style と Structure、ワンクリックでコピー。</sub></td>
    <td><sub><b>Sample Cutter：</b>ぴったり 8 秒、コマ単位で微調整。</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; 編集と解析

**Metadata Editor.** MP3、WAV、FLAC、M4A のタイトル、アーティスト、アルバム、年、ジャンル、トラック番号、コメント、カバー画像を編集。WAV タグは Windows エクスプローラーが読める配置で書き込み、保存のたびに読み直して確実に反映されたか確認します。

**Key &amp; BPM Detect.** ファイルをドロップすると、キー、ハーモニックな隣接キーを含む Camelot コード、テンポを表示。BPM は微調整できます（−1、+1、÷2、×2）。解析は Essentia でローカル実行されます。

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor：</b>タグとカバーをファイルに直接書き込み。</sub></td>
    <td><sub><b>Key &amp; BPM：</b>キー、Camelot ホイール上の位置、テンポを数秒で。</sub></td>
  </tr>
</table>

<br />

## 自分好みに

- **アプリ全体に効くカラーテーマ：** 9 つのプリセット（オーシャン、ラグーン、フォレスト、アンバー、エンバー、クリムゾン、オーキッド、バイオレット、グラファイト）または好きな色。ボタンだけでなく、背景、サイドバー、枠線、選択範囲まで色が変わります。背景のトーンで強さを調整できます。
- **ライト、ダーク、または Windows に合わせる。**
- **アクセシビリティ：** レイアウトを崩さずに文字サイズを小〜特大に、表示を 90%〜150% に拡大、動きを減らすスイッチも。
- **8 言語：** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語。
- **保存先フォルダー：** 音声、カバー、歌詞、zip、メディアの保存先を個別に選べます。

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

## インストール

1. [最新リリース](https://github.com/umwt26/Sophy-Studio/releases/latest)から **`Sophy_Studio_Setup.exe`** をダウンロード。
2. 実行します。管理者権限は不要で、あなたの Windows ユーザーだけにインストールされます。
3. スタートメニューかデスクトップから Sophy Studio を開きます。

**動作環境：** 64 ビット版 Windows 10 または 11。Visual C++ 再頒布可能パッケージは不要です。

**初回起動：** FFmpeg、yt-dlp、Prompter 用のオフライン AI モデルをバックグラウンドで取得します。その後、解析ツールはインターネットなしで動作します。

**アップデート：** 起動時に GitHub を確認し、自動でアップデートします。履歴、設定、ダウンロードしたファイルはそのまま残ります。

**古い PC：** グラフィックボードのない第 1 世代 i3/i5 でも動くように作っています。CPU が AI モデルを実行できない場合、Prompter は静かにルールエンジンに切り替わります。

<br />

## 中身

| パーツ | 使用技術 |
|---|---|
| アプリ基盤 | Tauri 2 · Rust |
| インターフェース | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| オーディオ | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| ダウンロード | Suno API クライアント · yt-dlp |
| オフライン AI | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| インストーラー | NSIS（ユーザー単位） |

<br />

<a id="made-by-beli"></a>

## Beli! 制作

Sophy Studio は、ブラウザの 10 個のタブに散らばっていたツールをひとつにまとめたかったプロデューサー兼アーティスト、**Beli!** がデザイン・開発・保守しています。

<table>
  <tr>
    <td valign="top" width="33%">
      <b>聴く</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>フォロー</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>話す・つくる</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">不具合を報告</a>
    </td>
  </tr>
</table>

**サポート：** インディーアーティスト向けのトルコ発音楽・映像配信プラットフォーム [Filerawave](https://www.filerawave.com) と [Filera Music](https://www.filera.page)。

アイデアや不具合があれば、アプリ内の **フィードバックを送信** ページ、issue、または Discord へどうぞ。

<br />

## ライセンス

MIT.

Sophy Studio は独立したプロジェクトであり、Suno、YouTube、Instagram、TikTok など連携するいずれのプラットフォームとも提携しておらず、承認も受けていません。利用する権利のあるコンテンツだけをダウンロードし、クリエイターと各プラットフォームの規約を尊重してください。
