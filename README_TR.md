<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="96" />

<h1>Sophy Studio</h1>

<p><b>İndir. Şekillendir. Etiketle. Yayınla.</b><br />
Modern müzik üreticileri ve içerik üreticileri için yüksek performanslı, hepsi bir arada masaüstü ve mobil ses stüdyosu.</p>

<p>
  <a href="#-masaüstü-deneyimi-windows"><b>🖥️ Masaüstü (Windows)</b></a>
  &nbsp;·&nbsp;
  <a href="#-mobil-deneyimi-android"><b>📱 Mobil (Android)</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Sürümleri İndir</b></a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord Topluluğu</a>
  &nbsp;·&nbsp;
  <a href="#geliştirici-ve-tasarım-beli">Beli! Tarafından Yapıldı</a>
</p>

<p><sub><a href="README.md">English</a> · <b>Türkçe</b> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <a href="README_PT.md">Português</a> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=s%C3%BCr%C3%BCm&labelColor=0c0e14&color=38bdf8" alt="Son sürüm" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Android-38bdf8?style=flat-square&labelColor=0c0e14" alt="Windows ve Android" />
  <img src="https://img.shields.io/badge/lisans-MIT-38bdf8?style=flat-square&labelColor=0c0e14" alt="MIT Lisansı" />
  <img src="https://img.shields.io/badge/fiyat-100%25%20%C3%9ccretsiz-38bdf8?style=flat-square&labelColor=0c0e14" alt="Tamamen Ücretsiz" />
  <img src="https://img.shields.io/badge/dil-8%20dil-38bdf8?style=flat-square&labelColor=0c0e14" alt="8 Dil Desteği" />
</p>

</div>

<br />

---

## 🖥️ Masaüstü Deneyimi (Windows)

Masaüstü sürümü, **Tauri 2, Rust ve React 19** ile sıfırdan geliştirilmiş, dikkat dağıtmayan, yan menülü eksiksiz bir stüdyo ortamı sunar. Tüm işlemler hesap gerektirmeden, bulut gecikmesi olmadan ve ses kalitesinden ödün vermeden doğrudan bilgisayarınızda yerel çalışır.

<br />

### 1. Ana Sayfa Kontrol Paneli
Tüm stüdyo araçları mantıksal bir iş akışıyla gruplanmıştır: **İndir**, **Üret** ve **Düzenle & Analiz Et**. Hızlı kullanım ipuçları ve sürüm notları karuseli eşlik eder.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Sophy Studio Masaüstü Ana Sayfa" width="100%" />
</p>

<br />

### 2. Suno Downloader 2.0
Herhangi bir Suno şarkı bağlantısını yapıştırarak stüdyo kalitesinde 320 kbps MP3, kayıpsız sıkıştırılmamış WAV veya ham ses akışını indirin. Yüksek çözünürlüklü albüm kapağı ve senkronize şarkı sözleri (`.lrc` / `.txt`) otomatik olarak çıkartılıp dosyaya gömülür. Geçmiş şarkılarınıza tek tıkla dönmenizi sağlayan açılır arama geçmişi çekmecesini içerir.

<p align="center">
  <img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader Masaüstü" width="100%" />
</p>

<br />

### 3. Evrensel Medya İndirici (Universal Downloader)
YouTube, Instagram, TikTok, Facebook, X (Twitter), Reddit, SoundCloud, Pinterest ve yüzlerce platformdan video veya ses yakalayın. Tek tıkla **MP4 video** veya **320k MP3 ses** seçimi yapın. Filtrelenebilir ve sıralanabilir indirme geçmişi sunar.

<p align="center">
  <img src="docs/screenshots/universal-downloader.png" alt="Universal Medya İndirici Masaüstü" width="100%" />
</p>

<br />

### 4. Suno Style Prompter
Aklınızdaki şarkıyı kendi cümlelerinizle 8 dilden birinde ifade edin; Suno AI için doğrudan kopyalanabilir **Style of Music** etiketleri (1.000 karaktere kadar) ve `[Intro]`, `[Verse]`, `[Chorus]`, `[Drop]`, `[Outro]` düzeninde şarkı yapısı şablonları (5.000 karaktere kadar) edinin. Asla söz yazmaz; yaratıcı sözler size aittir. Çok dilli kural motoru ve entegre yerel `llama.cpp` yapay zekasıyla tamamen çevrimdışı çalışır.

<p align="center">
  <img src="docs/screenshots/prompter.png" alt="Suno Style Prompter Masaüstü" width="100%" />
</p>

<br />

### 5. Sample Kesici (8 Saniyelik Dalga Boyu Dilimleyici)
Herhangi bir ses parçasını yükleyin, 8.0 saniyelik sabit döngü penceresini dalga boyu üzerinde kaydırın, gerçek zamanlı önizleme yapın ve 320k MP3 ya da kayıpsız WAV olarak dışa aktarın. Suno AI ses devam ettirme (audio continuation) yüklemeleri için hassas olarak ayarlanmıştır.

<p align="center">
  <img src="docs/screenshots/sample-cutter.png" alt="Sample Kesici Masaüstü" width="100%" />
</p>

<br />

### 6. Ses Metadata Editörü
MP3, WAV, FLAC ve M4A dosyalarının başlık, sanatçı, albüm, yıl, tür, parça numarası ve açıklamalarını düzenleyin. Albüm kapağını ID3v2.3 standartlarında doğrudan dosyaya gömer; kapak Windows Gezgini'nde, DJ yazılımlarında ve dijital ses istasyonlarında anında görünür.

<p align="center">
  <img src="docs/screenshots/metadata-editor.png" alt="Ses Metadata Editörü Masaüstü" width="100%" />
</p>

<br />

### 7. Müzikal Ton (Key) &amp; BPM Tespiti
Herhangi bir ses dosyasını sürükleyip bırakarak parça tonunu, Camelot çarkındaki konumunu (örn. `8B / Do Majör`), DJ'ler için uyumlu miks tonlarını ve kesin tempo değerini tespit edin. İnce tempo çarpanlarıyla (`-1`, `+1`, `/2`, `*2`) ayar yapabilirsiniz. Essentia.js WebAssembly ile tamamen çevrimdışı analiz eder.

<p align="center">
  <img src="docs/screenshots/bpm-detect.png" alt="Key ve BPM Tespiti Masaüstü" width="100%" />
</p>

<br />

### 8. Masaüstü Ayarları &amp; Kişiselleştirme
Sophy Studio'yu yaratıcı çalışma ortamınıza uyarlayın:
- **Dinamik Renk Temaları:** 9 özel palet (*Okyanus, Lagün, Orman, Kehribar, Kor, Yakut, Orkide, Menekşe, Grafit*) ve arka planları, kenarlıkları, butonları boyayan 360° renk tekerleği.
- **Erişilebilirlik:** Düzeni bozmadan Küçük'ten Çok Büyük'e yazı tipi ölçekleme, arayüz yakınlaştırma (%90 - %150) ve hareket azaltma seçeneği.
- **Özel Çıktı Klasörleri:** Ses, video, kapak, söz ve arşiv dosyalarınızı ayrı klasörlere yönlendirin.
- **8 Dil Desteği:** Türkçe, English, Deutsch, Français, Español, Português, Русский ve 日本語.

<p align="center">
  <img src="docs/screenshots/gorunum.gif" alt="Dinamik Temalar Geçişi" width="100%" />
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lang.png" alt="Dil Ayarları Masaüstü" /></td>
    <td width="50%"><img src="docs/screenshots/erisilebilirlik.png" alt="Erişilebilirlik Ayarları Masaüstü" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/output-folders.png" alt="Çıktı Klasörleri Masaüstü" /></td>
    <td width="50%"><img src="docs/screenshots/about.png" alt="Hakkında Kısmı Masaüstü" /></td>
  </tr>
</table>

<br />

#### 📥 Windows İçin İndir
1. [En Son Sürüm](https://github.com/umwt26/Sophy-Studio/releases/latest) sayfasından **`Sophy_Studio_Setup.exe`** dosyasını indirin.
2. Kurulumu çalıştırın. Yönetici yetkisi gerektirmez; geçerli kullanıcı için temiz kurulum yapar ve verilerinize dokunmadan eski sürümleri otomatik temizler.
3. Başlat menüsünden veya masaüstü kısayolundan başlatın.

<br />

---

## 📱 Mobil Deneyimi (Android)

**Sophy Studio Mobil**, masaüstündeki eksiksiz prodüksiyon araç setini akıllı telefonunuza taşır; dokunmatik hareketler, tek elle kullanım ergonomisi ve mobil iş akışlarına özel olarak tasarlanmıştır.

<br />

### ⚡ Mobil Öne Çıkan: Doğrudan Paylaş ve İndir (Share-to-Download)
Linkleri elle kopyalayıp yapıştırmakla uğraşmayın. Instagram, TikTok, YouTube veya X (Twitter)'da gezinirken beğendiğiniz bir video veya parçada **Paylaş**'a basıp **Sophy Studio**'yu seçtiğiniz an indirme işlemi arka planda anında başlar!

<p align="center">
  <img src="docs/m-screenshots/m-share.gif" alt="Android Sistem Paylaşımı ile İndirme" width="45%" /><br />
  <sub><b>Sistem Paylaşım Entegrasyonu:</b> Videoları doğrudan Sophy Studio ile paylaşarak tek dokunuşla indirin.</sub>
</p>

<br />

### 💧 Mobil Öne Çıkan: Liquid Glass Teması
Akışkan yarı saydam cam efektleri, arka plan parlamaları ve AMOLED ekranlar için optimize edilmiş derin kontrastlı özel mobil tema.

<p align="center">
  <img src="docs/m-screenshots/m-gorunum.gif" alt="Mobil Liquid Glass Teması" width="45%" /><br />
  <sub><b>Liquid Glass:</b> Yarı saydam cam malzemeler, dinamik vurgular ve akıcı geçişler.</sub>
</p>

<br />

### Mobil Araç Akışı (Ana Sayfadan Ayarlara)

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-homepage.jpg" alt="Mobil Ana Sayfa" width="90%" /><br />
      <sub><b>1. Mobil Ana Sayfa Paneli</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-sunodownloader.jpg" alt="Mobil Suno Downloader" width="90%" /><br />
      <sub><b>2. Suno Downloader (MP3/WAV/Kapak/Söz)</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-univdownloader.jpg" alt="Mobil Universal Downloader" width="90%" /><br />
      <sub><b>3. Evrensel Medya İndirici (Video & Ses)</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-sunoprompter.jpg" alt="Mobil Style Prompter" width="90%" /><br />
      <sub><b>4. Suno Style Prompter (Tür & Düzen)</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-samplecutter.jpg" alt="Mobil Sample Kesici" width="90%" /><br />
      <sub><b>5. Sample Kesici (8s Dalga Boyu Dilimleyici)</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-metadata.jpg" alt="Mobil Metadata Editörü" width="90%" /><br />
      <sub><b>6. Ses Metadata Editörü & Kapak Gömücü</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-keybpm.jpg" alt="Mobil Key ve BPM" width="90%" /><br />
      <sub><b>7. Müzikal Ton & BPM Tespiti</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-lang.jpg" alt="Mobil Dil Ayarları" width="90%" /><br />
      <sub><b>8. Dil ve Bölge Ayarları</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-erisilebilirlik.jpg" alt="Mobil Erişilebilirlik" width="90%" /><br />
      <sub><b>9. Mobil Erişilebilirlik (Metin & Ekran Yakınlaştırma)</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/m-screenshots/m-about.jpg" alt="Mobil Hakkında" width="90%" /><br />
      <sub><b>10. Mobil Hakkında ve Sanatçı Profili</b></sub>
    </td>
  </tr>
</table>

<br />

#### 📥 Android İçin İndir
1. [En Son Sürüm](https://github.com/umwt26/Sophy-Studio/releases/latest) sayfasından **`Sophy_Studio_Mobile_v1.4.0.apk`** dosyasını indirin.
2. Telefonunuzda APK dosyasını açıp yüklemeyi onaylayın.
3. Uygulamayı açın ya da Instagram, TikTok veya YouTube'da herhangi bir videoda **Paylaş**'a basıp **Sophy Studio**'yu seçin!

<br />

---

## 🛠️ Teknoloji Mimarisi

| Bileşen | Masaüstü (Windows) | Mobil (Android) |
|---|---|---|
| **Kabuk & Runtime** | Tauri 2 · Rust | Capacitor / Tauri Android |
| **Arayüz (Frontend)** | React 19 · TypeScript · Tailwind CSS 4 | React 19 · TypeScript · Dokunmatik Hareketler |
| **Ses İşleme** | FFmpeg · lofty / id3 · Essentia.js (WASM) | Web Audio API · Essentia.js (WASM) |
| **İndirme Motoru** | Yerel Suno Client · yt-dlp binary | Suno API Client · Extractor Servisi |
| **Offline Yapay Zeka** | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) | Çok Dilli Doğal Dil Kural Motoru |
| **Paketleme** | NSIS Kullanıcı Bazlı Kurulum (`.exe`) | Android Paketi (`.apk`) |

<br />

---

<a id="geliştirici-ve-tasarım-beli"></a>

## 🎵 Geliştirici ve Tasarım: Beli!

Sophy Studio; bağımsız müzik yapımcısı, rap sanatçısı ve yazılımcı **Beli!** tarafından geliştirilmektedir.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>🎧 Müzikler</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>📱 Sosyal Medya</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X (Twitter) · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>💬 Topluluk &amp; Destek</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord Sunucusu · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Hata Bildir</a>
    </td>
  </tr>
</table>

Bağımsız sanatçıların müzik dağıtım platformu [Filerawave](https://www.filerawave.com) ve [Filera Music](https://www.filera.page) tarafından desteklenmektedir.

<br />

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile korunmaktadır — detaylar için [LICENSE](LICENSE) dosyasına göz atabilirsiniz.
