<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>İndir. Şekillendir. Etiketle. Paylaş.</b><br />
Müzik yapmanın sıkıcı kısımlarını tarayıcından uzak tutan küçük bir Windows uygulaması.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Windows için indir</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Sürüm notları</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Beli! tarafından</a>
</p>

<p><sub><a href="README.md">English</a> · <b>Türkçe</b> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=s%C3%BCr%C3%BCm&labelColor=0f1013&color=5b9dff" alt="sürüm" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/%C3%BCcretsiz-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="ücretsiz" />
  <img src="https://img.shields.io/badge/dil-8-5b9dff?style=flat-square&labelColor=0f1013" alt="dil" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Sophy Studio'da renk teması değiştirme" width="100%" />

<sub>Tek uygulama, dokuz renk teması ve aradaki her şey için bir renk seçici.</sub>

</div>

<br />

## İçinde neler var

Tek pencerede altı araç, gerçekten çalıştığın sırayla gruplanmış: **sesi al**, **onunla bir şey üret**, **düzenle**. Her şey kendi bilgisayarında çalışır. Hesap yok, yükleme kuyruğu yok.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Home" width="100%" /><br />
  <sub><b>Ana sayfa:</b> tüm araçlar tek yerde, gruplanmış.</sub>
</p>

### 01 &nbsp;/&nbsp; İndir

**Suno Downloader.** Bir Suno linki yapıştır; parçayı 320 kbps MP3, kayıpsız WAV ya da orijinal akış olarak al, yanında kapak görseli, şarkı sözleri veya hepsini tek bir zip dosyasında. Etiketler ve kapak dosyanın içine yazılır, son parçaların aranabilir bir geçmişte durur.

**Universal Downloader.** YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud ve daha fazlası için tek kutu. **MP4 video** ya da **MP3 320k ses** seç. Her indirme filtreleyip sıralayabildiğin ve yeniden açabildiğin bir geçmişe düşer.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
  </tr>
  <tr>
    <td><sub><b>Suno Downloader:</b> parça bilgileri, etiketler, ses, kapak ve sözler tek ekranda.</sub></td>
    <td><sub><b>Universal Downloader:</b> getir, önizle, video ya da ses seç.</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Üret

**Suno Style Prompter.** Bir şarkıyı kendi kelimelerinle, istediğin dilde anlat; yapıştırmaya hazır bir **Style of Music** (en fazla 1.000 karakter) ve **Structure** (en fazla 5.000) al. Sohbet eder gibi düzelt: *"basları kıs"*, *"BPM 140 yap"*, *"girişe saksafon ekle"*. Asla şarkı sözü yazmaz, sözler senin kalır. Çevrimdışı çalışır: kural motoru sekiz dili anında anlar, geri kalanını küçük bir yerleşik yapay zekâ modeli (llama.cpp ile yerelde çalışan Qwen2.5 1.5B) halleder.

**Sample Kesici.** Herhangi bir parçayı yükle, sabit 8 saniyelik pencereyi dalga formu üzerinde kaydır, döngüde dinle ve kesiti MP3 ya da WAV olarak dışa aktar. Suno'nun ses yükleme özelliği için yapıldı.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter:</b> altta sohbet, üstte Style ve Structure, tek tıkla kopyala.</sub></td>
    <td><sub><b>Sample Kesici:</b> tam 8 saniyelik kesit, kare kare ayarlanır.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Düzenle ve analiz et

**Metadata Editor.** MP3, WAV, FLAC ve M4A için şarkı adı, sanatçı, albüm, yıl, tür, parça numarası, yorum ve kapak görseli. WAV etiketleri Windows Gezgini'nin beklediği şekilde yerleştirilir, her kayıt gerçekten yazıldığından emin olmak için tekrar okunur.

**Key & BPM Detect.** Bir dosya bırak; tonunu, harmonik komşularıyla birlikte Camelot kodunu ve temposunu al. BPM'i ince ayarlayabilirsin (−1, +1, ÷2, ×2). Analiz Essentia ile yerelde çalışır.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor:</b> etiketler ve kapak, doğrudan dosyaya yazılır.</sub></td>
    <td><sub><b>Key &amp; BPM:</b> ton, Camelot çarkındaki yeri ve tempo, saniyeler içinde.</sub></td>
  </tr>
</table>

<br />

## Sana göre ayarla

- **Her yere uzanan renk temaları:** 9 hazır tema (Okyanus, Lagün, Orman, Kehribar, Kor, Kızıl, Orkide, Menekşe, Grafit) ya da istediğin herhangi bir renk. Sadece butonları değil, arka planları, kenar çubuğunu, kenarlıkları ve seçimleri de renklendirir. Arka plan tonu ne kadar baskın olacağını belirler.
- **Açık, koyu ya da Windows'u takip et.**
- **Erişilebilirlik:** düzeni bozmadan Küçük'ten Çok büyük'e yazı boyutu, %90 ile %150 arasında görüntü yakınlaştırma ve hareketi azaltma anahtarı.
- **8 dil:** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Senin klasörlerin:** ses, kapak, şarkı sözü, zip ve medya dosyalarının nereye gideceğini ayrı ayrı seç.

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

## Kurulum

1. [Son sürümden](https://github.com/umwt26/Sophy-Studio/releases/latest) **`Sophy_Studio_Setup.exe`** dosyasını indir.
2. Çalıştır. Yönetici izni gerekmez, sadece senin Windows kullanıcına kurulur.
3. Sophy Studio'yu Başlat menüsünden ya da masaüstünden aç.

**Gereksinimler:** 64 bit Windows 10 veya 11. Visual C++ Redistributable gerekmez.

**İlk açılış:** Sophy Studio arka planda FFmpeg'i, yt-dlp'yi ve Prompter için çevrimdışı yapay zekâ modelini indirir. Sonrasında analiz araçları internetsiz çalışır.

**Güncellemeler:** uygulama açılışta GitHub'ı kontrol eder ve kendini yerinde günceller. Geçmişin, ayarların ve indirdiklerin korunur.

**Eski bilgisayarlar:** ekran kartı olmayan 1. nesil i3/i5 makinelerde çalışacak şekilde yapıldı. İşlemci yapay zekâ modelini çalıştıramazsa Prompter sessizce kural motoruna geçer.

<br />

## Arka planda

| Bölüm | Kullanılanlar |
|---|---|
| Uygulama kabuğu | Tauri 2 · Rust |
| Arayüz | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Ses | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| İndirmeler | Suno API istemcisi · yt-dlp |
| Çevrimdışı yapay zekâ | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Kurulum | NSIS, kullanıcı bazlı |

<br />

<a id="made-by-beli"></a>

## Beli! tarafından yapıldı

Sophy Studio, eskiden on tarayıcı sekmesinde duran araçları tek bir yerde toplamak isteyen yapımcı ve sanatçı **Beli!** tarafından tasarlanıyor, geliştiriliyor ve sürdürülüyor.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Dinle</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Takip et</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Konuş ve geliştir</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Hata bildir</a>
    </td>
  </tr>
</table>

**Destekleyenler:** bağımsız sanatçılar için Türkiye merkezli müzik ve video dağıtım platformu [Filerawave](https://www.filerawave.com) ve [Filera Music](https://www.filera.page).

Fikrin ya da bir sorunun mu var? Uygulamadaki **Geri Bildirim Gönder** sayfasını kullan, bir issue aç ya da Discord'a uğra.

<br />

## Lisans

MIT.

Sophy Studio bağımsız bir projedir; Suno, YouTube, Instagram, TikTok veya birlikte çalıştığı diğer platformlarla bağlantılı değildir ve onlar tarafından desteklenmez. Sadece kullanma hakkına sahip olduğun içerikleri indir; içerik üreticilerine ve her platformun kullanım koşullarına saygı göster.
