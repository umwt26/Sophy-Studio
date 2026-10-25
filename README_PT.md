<div align="center">

<img src="src-tauri/icons/128x128@2x.png" alt="Sophy Studio" width="88" />

<h1>Sophy Studio</h1>

<p><b>Baixe. Molde. Etiquete. Publique.</b><br />
Um pequeno app para Windows que tira do navegador as partes chatas de fazer música.</p>

<p>
  <a href="https://github.com/umwt26/Sophy-Studio/releases/latest"><b>Baixar para Windows</b></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/umwt26/Sophy-Studio/releases">Notas da versão</a>
  &nbsp;·&nbsp;
  <a href="https://discord.gg/vwzjuhnpyP">Discord</a>
  &nbsp;·&nbsp;
  <a href="#made-by-beli">Feito por Beli!</a>
</p>

<p><sub><a href="README.md">English</a> · <a href="README_TR.md">Türkçe</a> · <a href="README_DE.md">Deutsch</a> · <a href="README_FR.md">Français</a> · <a href="README_ES.md">Español</a> · <b>Português</b> · <a href="README_RU.md">Русский</a> · <a href="README_JA.md">日本語</a></sub></p>

<p>
  <img src="https://img.shields.io/github/v/release/umwt26/Sophy-Studio?style=flat-square&label=vers%C3%A3o&labelColor=0f1013&color=5b9dff" alt="versão" />
  <img src="https://img.shields.io/badge/windows-10%20%7C%2011-5b9dff?style=flat-square&labelColor=0f1013" alt="Windows 10 | 11" />
  <img src="https://img.shields.io/badge/gr%C3%A1tis-%E2%9C%93-5b9dff?style=flat-square&labelColor=0f1013" alt="grátis" />
  <img src="https://img.shields.io/badge/idiomas-8-5b9dff?style=flat-square&labelColor=0f1013" alt="idiomas" />
</p>

<img src="docs/screenshots/gorunum.gif" alt="Trocando o tema de cor no Sophy Studio" width="100%" />

<sub>Um app, nove temas de cor e um seletor para tudo o que fica no meio.</sub>

</div>

<br />

## O que tem dentro

Seis ferramentas em uma janela, agrupadas do jeito que você realmente trabalha: **pegue o áudio**, **faça algo com ele**, **deixe tudo certinho**. Tudo roda no seu próprio PC. Sem contas e sem filas de upload.

<br />

### 01 &nbsp;/&nbsp; Baixar

**Suno Downloader.** Cole um link do Suno e receba a faixa em MP3 de 320 kbps, WAV sem perdas ou o stream original, além da capa, da letra ou de tudo junto em um zip. Tags e capa são gravadas no arquivo, e suas faixas recentes ficam em um histórico pesquisável.

**Universal Downloader.** Uma caixa só para YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, SoundCloud e mais. Escolha **vídeo MP4** ou **áudio MP3 320k**. Cada download vai para um histórico que você pode filtrar, ordenar e reabrir.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/universal-downloader.png" alt="Universal Downloader" /></td>
    <td width="50%"><img src="docs/screenshots/ana-sayfa.png" alt="Home" /></td>
  </tr>
  <tr>
    <td><sub><b>Universal Downloader:</b> buscar, pré-visualizar, escolher vídeo ou áudio.</sub></td>
    <td><sub><b>Início:</b> todas as ferramentas agrupadas em um lugar (aqui em turco).</sub></td>
  </tr>
</table>

### 02 &nbsp;/&nbsp; Criar

**Suno Style Prompter.** Descreva uma música com suas palavras, em qualquer idioma, e receba um **Style of Music** pronto para colar (até 1.000 caracteres) e uma **Structure** (até 5.000). Ajuste como numa conversa: *"menos grave"*, *"BPM 140"*, *"coloca saxofone na intro"*. Ele nunca escreve letras, as palavras continuam suas. Funciona offline: um motor de regras entende oito idiomas na hora, e um pequeno modelo de IA embutido (Qwen2.5 1.5B, rodando localmente via llama.cpp) cuida do resto.

**Sample Cutter.** Carregue qualquer faixa, deslize uma janela fixa de 8 segundos pela forma de onda, ouça em loop e exporte o trecho em MP3 ou WAV. Feito para o upload de áudio do Suno.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/prompter.png" alt="Suno Style Prompter" /></td>
    <td width="50%"><img src="docs/screenshots/sample-cutter.png" alt="Sample Cutter" /></td>
  </tr>
  <tr>
    <td><sub><b>Style Prompter:</b> chat embaixo, Style e Structure em cima, um clique para copiar.</sub></td>
    <td><sub><b>Sample Cutter:</b> um trecho exato de 8 segundos, ajustável quadro a quadro.</sub></td>
  </tr>
</table>

### 03 &nbsp;/&nbsp; Editar e analisar

**Metadata Editor.** Título, artista, álbum, ano, gênero, número da faixa, comentário e capa para MP3, WAV, FLAC e M4A. As tags WAV são organizadas do jeito que o Explorador do Windows espera, e cada gravação é relida para garantir que foi salva de verdade.

**Key &amp; BPM Detect.** Solte um arquivo e receba o tom, o código Camelot com os vizinhos harmônicos e o andamento. Dá para ajustar o BPM (−1, +1, ÷2, ×2). A análise roda localmente com Essentia.

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/metadata-editor.png" alt="Metadata Editor" /></td>
    <td width="50%"><img src="docs/screenshots/bpm-detect.png" alt="Key & BPM Detect" /></td>
  </tr>
  <tr>
    <td><sub><b>Metadata Editor:</b> tags e capa, gravadas direto no arquivo.</sub></td>
    <td><sub><b>Key &amp; BPM:</b> tom, posição na roda Camelot e andamento em segundos.</sub></td>
  </tr>
</table>

<br />

## Do seu jeito

- **Temas de cor que chegam a tudo:** 9 predefinidos (Oceano, Lagoa, Floresta, Âmbar, Brasa, Carmesim, Orquídea, Violeta, Grafite) ou qualquer cor. Eles colorem fundos, a barra lateral, bordas e seleções, não só os botões. O tom de fundo define a intensidade.
- **Claro, escuro ou igual ao Windows.**
- **Acessibilidade:** tamanho do texto de Pequeno a Muito grande sem quebrar o layout, zoom de exibição de 90% a 150% e um botão para reduzir movimento.
- **8 idiomas:** English, Türkçe, Deutsch, Français, Español, Português, Русский, 日本語.
- **Suas pastas:** escolha separadamente para onde vão áudio, capas, letras, arquivos zip e mídia.

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

## Instalação

1. Baixe o **`Sophy_Studio_Setup.exe`** da [versão mais recente](https://github.com/umwt26/Sophy-Studio/releases/latest).
2. Execute. Não precisa de permissão de administrador; ele é instalado só para o seu usuário do Windows.
3. Abra o Sophy Studio pelo menu Iniciar ou pela área de trabalho.

**Requisitos:** Windows 10 ou 11 de 64 bits. O Visual C++ Redistributable não é necessário.

**Primeira abertura:** o Sophy Studio baixa em segundo plano o FFmpeg, o yt-dlp e o modelo de IA offline do Prompter. Depois disso, as ferramentas de análise funcionam sem internet.

**Atualizações:** o app verifica o GitHub ao abrir e se atualiza sozinho. Seu histórico, configurações e downloads são mantidos.

**PCs antigos:** feito para rodar em máquinas i3/i5 de primeira geração sem placa de vídeo. Se o processador não conseguir rodar o modelo de IA, o Prompter passa discretamente para o motor de regras.

<br />

## Por dentro

| Parte | Feito com |
|---|---|
| Base do app | Tauri 2 · Rust |
| Interface | React 19 · TypeScript · Tailwind CSS 4 · i18next |
| Áudio | FFmpeg · lofty / id3 · Essentia.js (WebAssembly) |
| Downloads | Cliente da API do Suno · yt-dlp |
| IA offline | llama.cpp · Qwen2.5-1.5B-Instruct (Q4_K_M) |
| Instalador | NSIS, por usuário |

<br />

<a id="made-by-beli"></a>

## Feito por Beli!

O Sophy Studio é projetado, desenvolvido e mantido por **Beli!**, produtor e artista que queria reunir em um só lugar as ferramentas que antes ficavam espalhadas em dez abas do navegador.

<table>
  <tr>
    <td valign="top" width="33%">
      <b>Ouça</b><br /><br />
      <a href="https://open.spotify.com/artist/0abGcEf1RCkROklu9iYoR7">Spotify · Beli!</a><br />
      <a href="https://www.youtube.com/@beli26">YouTube · @beli26</a><br />
      <a href="https://www.tiktok.com/@belionthebeat">TikTok · @belionthebeat</a>
    </td>
    <td valign="top" width="33%">
      <b>Siga</b><br /><br />
      <a href="https://www.instagram.com/umw26t/">Instagram · @umw26t</a><br />
      <a href="https://www.instagram.com/_beli26/">Instagram · @_beli26</a><br />
      <a href="https://x.com/_beli26">X · @_beli26</a>
    </td>
    <td valign="top" width="33%">
      <b>Converse e contribua</b><br /><br />
      <a href="https://discord.gg/vwzjuhnpyP">Discord · Filera</a><br />
      <a href="https://github.com/umwt26">GitHub · @umwt26</a><br />
      <a href="https://github.com/umwt26/Sophy-Studio/issues">Reportar um bug</a>
    </td>
  </tr>
</table>

**Com o apoio de** [Filerawave](https://www.filerawave.com), uma plataforma turca de distribuição de música e vídeo para artistas independentes, e [Filera Music](https://www.filera.page).

Ideias ou problemas? Use **Enviar feedback** dentro do app, abra uma issue ou diga oi no Discord.

<br />

## Licença

MIT.

O Sophy Studio é um projeto independente e não é afiliado nem endossado por Suno, YouTube, Instagram, TikTok ou qualquer outra plataforma com que trabalha. Baixe apenas conteúdo que você tem o direito de usar e respeite os criadores e os termos de cada plataforma.
