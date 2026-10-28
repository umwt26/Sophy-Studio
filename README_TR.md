<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="96" />

<h1>Sophy Studio</h1>

<p><b>İndir. Şekillendir. Etiketle. Yayınla.</b><br />
Modern müzik üreticileri ve içerik üreticileri için yüksek performanslı, hepsi bir arada masaüstü ve mobil ses stüdyosu.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Windows İçin İndir (.exe)</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Android İçin İndir (.apk)</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Sürüm Notları</a>
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

<br />

<img src="docs/screenshots/gorunum.gif" alt="Sophy Studio Dinamik Temalar" width="100%" />

<sub>Tek bir stüdyo paketi. 9 dinamik renk teması, özel renk tekerleği ve yeni yarı saydam <b>Liquid Glass</b> mobil teması.</sub>

</div>

<br />

---

## 📱 v1.4.0 Yenilikleri — Sophy Studio Mobil Çıktı!

Sophy Studio artık masaüstünün sınırlarını aşıp cebinize girdi! **v1.4.0** masaüstü sürümümüzle eş zamanlı olarak **Sophy Studio Mobil (Android)** sürümünü gururla sunuyoruz:

<table>
  <tr>
    <td width="50%"><img src="docs/m-screenshots/m-share.gif" alt="Android Sistem Paylaşımı ile İndirme" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-homepage.jpg" alt="Sophy Studio Mobil Ana Sayfa" /></td>
  </tr>
  <tr>
    <td><sub><b>Doğrudan Paylaş ve İndir:</b> Instagram, TikTok, YouTube veya Twitter'da gezinirken "Paylaş"a basıp Sophy Studio'yu seçtiğiniz an indirme işlemi hemen başlar.</sub></td>
    <td><sub><b>Mobil Ana Sayfa:</b> Masaüstüyle birebir özellik eşitliği, dokunmatik hareketler ve akıcı mobil arayüz.</sub></td>
  </tr>
</table>

- **Android Paylaş-ve-İndir:** Instagram, TikTok, YouTube, X (Twitter) veya tarayıcınızda herhangi bir videoda *Paylaş* butonuna basıp **Sophy Studio**'yu seçin; uygulama bağlantıyı otomatik olarak yakalayıp indirmeyi başlatır!
- **Liquid Glass Teması:** Zarif akışkan cam efektleri, arka plan parlamaları ve dokunsal geri bildirimler.
- **Akıllı Enstrümantal Prompter Motoru:** Doğal dil işleme motorumuz artık Style alanına gereksiz `Instrumental` etiketi yazmaz (Suno'nun kendi butonunu kullanmanız için arayüzde özel yönlendirme kutusu gösterir). "Olmasın", "without", "ohne" gibi kelimeleri tüm cümleyi silmek yerine sadece en yakınındaki enstrümana uygular (`opFor`).

<br />

---

## 🎛️ Eksiksiz Stüdyo Araç Kiti

Tüm işlemler **hesap gerektirmeden, aboneliksiz ve harici sunuculara veri yüklemeden** kendi cihazınızda yerel olarak çalışır.

<p align="center">
  <img src="docs/screenshots/ana-sayfa.png" alt="Sophy Studio Masaüstü Kontrol Paneli" width="100%" /><br />
  <sub><b>Masaüstü Paneli:</b> İndirme, müzik üretimi ve ses analizi araçları yan menü düzeninde elinizin altında.</sub>
</p>

<br />

### 01 &nbsp;/&nbsp; İndirme Araçları

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/sophy-downloader.png" alt="Suno Downloader Masaüstü" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-sunodownloader.jpg" alt="Suno Downloader Mobil" /></td>
  </tr>
  <tr>
    <td colspan="2">
      <b>Suno Downloader 2.0</b><br />
      Suno şarkı linkini yapıştırarak stüdyo kalitesinde <b>320 kbps MP3</b>, kayıpsız <b>WAV</b> veya ham ses akışını indirin. Şarkı kapağını ve senkronize şarkı sözlerini (<code>.lrc</code> / <code>.txt</code>) otomatik olarak indirir ve ses dosyasına gömer. Hızlı arama geçmişi çekmecesiyle önceki parçalarınıza anında geri dönün.
    </td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader Masaüstü" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-univdownloader.jpg" alt="Universal Downloader Mobil" /></td>
  </tr>
  <tr>
    <td colspan="2">
      <b>Evrensel Medya İndirici (Universal Downloader)</b><br />
      YouTube, Instagram, TikTok, Facebook, X (Twitter), Reddit, SoundCloud, Pinterest ve yüzlerce platformdan video veya ses indirin. Tek tıkla <b>MP4 video</b> veya <b>320k MP3 ses</b> seçimi yapın. Filtrelenebilir ve sıralanabilir indirme geçmişi sunar.
    </td>
  </tr>
</table>

<br />

### 02 &nbsp;/&nbsp; Üretim &amp; Yapay Zeka Araçları

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter Masaüstü" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-sunoprompter.jpg" alt="Suno Style Prompter Mobil" /></td>
  </tr>
  <tr>
    <td colspan="2">
      <b>Suno Style Prompter</b><br />
      Aklınızdaki şarkıyı kendi cümlelerinizle dilediğiniz dilde anlatın; Suno için kopyalanmaya hazır <b>Style of Music</b> etiketleri ve <b>[Intro] / [Verse] / [Chorus] / [Drop] / [Outro]</b> şarkı düzeni şablonları oluştursun. Asla kendi kafasına göre söz yazmaz, yaratıcılık tamamen size aittir. 8 dilde çalışan kural motoru ve yerel offline yapay zeka (<code>llama.cpp</code>) ile desteklenir.
    </td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter Masaüstü" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-samplecutter.jpg" alt="Sample Cutter Mobil" /></td>
  </tr>
  <tr>
    <td colspan="2">
      <b>Sample Kesici (8 Saniyelik Dalga Boyu Dilimleyici)</b><br />
      Herhangi bir parçayı yükleyin, 8.0 saniyelik sabit döngü penceresini dalga boyu üzerinde kaydırın, gerçek zamanlı dinleyin ve 320k MP3 ya da kayıpsız WAV olarak dışa aktarın. Suno'nun devam ettirme (audio continuation) özelliği için özel olarak tasarlanmıştır.
    </td>
  </tr>
</table>

<br />

### 03 &nbsp;/&nbsp; Düzenleme &amp; Analiz

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor Masaüstü" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-metadata.jpg" alt="Metadata Editor Mobil" /></td>
  </tr>
  <tr>
    <td colspan="2">
      <b>Ses Metadata Editörü &amp; Kapak Resmi Gömücü</b><br />
      MP3, WAV, FLAC ve M4A formatlarındaki parçaların başlık, sanatçı, albüm, yıl, tür, parça numarası ve açıklamalarını düzenleyin. Albüm kapağı görselini ID3v2.3 standartlarında doğrudan dosyaya gömer; kapak Windows Gezgini'nde, DJ yazılımlarında ve telefonunuzda hemen görünür.
    </td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key and BPM Detect Masaüstü" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-keybpm.jpg" alt="Key and BPM Detect Mobil" /></td>
  </tr>
  <tr>
    <td colspan="2">
      <b>Müzikal Ton (Key) &amp; BPM Tespiti</b><br />
      Ses dosyasını sürükleyip bırakarak parça tonunu, Camelot çarkındaki konumunu (örn. <code>8B / Do Majör</code>), uyumlu miks tonlarını ve kesin BPM değerini tespit edin. Tempo çarpanlarıyla (<code>-1</code>, <code>+1</code>, <code>/2</code>, <code>*2</code>) ince ayar yapabilirsiniz. Essentia.js WebAssembly ile tamamen çevrimdışı analiz eder.
    </td>
  </tr>
</table>

<br />

---

## 🎨 Kişiselleştirme &amp; Erişilebilirlik

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/lang.png" alt="Dil Ayarları" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-lang.jpg" alt="Mobil Dil Ayarları" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/erisilebilirlik.png" alt="Erişilebilirlik Ayarları" /></td>
    <td width="50%"><img src="docs/m-screenshots/m-erisilebilirlik.jpg" alt="Mobil Erişilebilirlik Ayarları" /></td>
  </tr>
</table>

- **8 Dil Desteği:** Türkçe, English, Deutsch, Français, Español, Português, Русский ve 日本語 dillerinde eksiksiz kullanım.
- **Dinamik Renk Temaları:** 9 özel palet (*Okyanus, Lagün, Orman, Kehribar, Kor, Yakut, Orkide, Menekşe, Grafit*), mobilde **Liquid Glass** ve 360° renk tekerleği.
- **Erişilebilirlik:** Sayfa düzenini bozmadan Küçük'ten Çok Büyük'e yazı tipi ölçekleme, arayüz yakınlaştırma (%90 - %150) ve hareket azaltma seçeneği.
- **Özel Çıktı Klasörleri:** Ses, video, kapak, söz ve arşiv dosyalarınızı ayrı klasörlere yönlendirin.

<br />

---

## 📥 Kurulum

### Windows Masaüstü
1. [En Son Sürüm](https://github.com/umwt26/Sophy-Studio/releases/latest) sayfasından **`Sophy_Studio_Setup.exe`** dosyasını indirin.
2. Kurulumu çalıştırın. Yönetici yetkisi gerektirmez; eski sürümleri kullanıcı verilerinize dokunmadan otomatik temizler.
3. Başlat menüsünden veya masaüstü kısayolundan Sophy Studio'yu açın.

### Android Mobil
1. [En Son Sürüm](https://github.com/umwt26/Sophy-Studio/releases/latest) sayfasından **`Sophy_Studio_Mobile_v1.4.0.apk`** dosyasını indirin.
2. Telefonunuzda APK dosyasına tıklayıp yükleyin.
3. Uygulamayı açın ya da Instagram, TikTok veya YouTube'da bir videoda **Paylaş**'a basıp **Sophy Studio**'yu seçin!

<br />

---

<a id="geliştirici-ve-tasarım-beli"></a>

## 🎵 Geliştirici ve Tasarım: Beli!

Sophy Studio; müzik yapımcısı, rap sanatçısı ve yazılımcı **Beli!** tarafından bağımsız olarak geliştirilmekte ve sürdürülmektedir.

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

Bu proje **MIT Lisansı** ile korunmaktadır.
