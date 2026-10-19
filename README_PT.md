<div align="center">

# 🎵 Sophy — Suno Downloader & Toolkit

**O melhor downloader e toolkit de alto desempenho para mídias do Suno AI no Desktop.**

[![Release](https://img.shields.io/badge/Release-v0.1.0-blue.svg?style=for-the-badge&logo=github)](https://github.com/umwt26/sophy-suno-downloader/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6.svg?style=for-the-badge&logo=windows)](https://github.com/umwt26/sophy-suno-downloader)
[![Built With](https://img.shields.io/badge/Built%20With-Tauri%202%20%7C%20Rust%20%7C%20React%2019-teal.svg?style=for-the-badge)](https://tauri.app)
[![Developer](https://img.shields.io/badge/Developer-Beli!%20(@umw26t)-E4405F.svg?style=for-the-badge&logo=instagram)](https://www.instagram.com/umw26t/)

<br />

🌐 **Language / Idioma:** [English](README.md) • [Türkçe](README_TR.md) • [Deutsch](README_DE.md) • [Français](README_FR.md) • [Español](README_ES.md) • [Русский](README_RU.md) • **Português** • [日本語](README_JA.md)

</div>

---

## 💡 Sobre o Sophy

> **Cansado dos limites de download do Suno, cotas restritivas e interfaces web lentas?**  
> Seja bem-vindo ao **Sophy**! A criação musical não deve ser limitada por processos complicados. O Sophy permite que produtores, músicos e ouvintes extraiam áudios limpos em qualidade de estúdio, WAVs sem perdas, capas em alta definição e letras diretamente de links do Suno em pastas organizadas no seu computador — de forma 100% gratuita, ilimitada e extremamente rápida.

---

## ✨ Principais recursos

- **⚡ Análise instantânea de faixas:** Cole qualquer link do Suno (`suno.com/s/...`, `suno.com/song/...` ou UUID) e obtenha metadados, tags, letras e capas em menos de um segundo.
- **🎧 Formatos de áudio de estúdio:**
  - **MP3 (320 kbps)** — Conversão limpa com metadados ID3 embutidos (Título, Artista, Estilo/Gênero e Capa).
  - **WAV (Sem perdas 44.1 kHz 16-bit)** — Áudio descompactado pronto para importar direto na sua DAW (FL Studio, Ableton, Logic Pro, etc.).
  - **Áudio Original** — Fluxo direto da fonte original sem recodificação.
- **📦 Baixar Tudo (.zip):** Agrupe o MP3 de 320k, a capa em HD (.jpg) e as letras (.txt) em um arquivo `.zip` organizado com um só clique.
- **🕒 Histórico local de buscas:** Nunca mais perca uma música. Suas pesquisas ficam salvas localmente para você recarregá-las a qualquer momento.
- **🌍 8 idiomas de interface:** English, Türkçe, Deutsch, Français, Español, Русский, Português e 日本語 com alternância em tempo real.
- **🚀 Atualizador automático integrado:** Identifica novas versões ao iniciar e instala atualizações direto no próprio aplicativo!
- **📁 Biblioteca local organizada:** Seus downloads são salvos em `Documentos\Sophy\` divididos em subpastas limpas (`Audio`, `Cover Art`, `Lyrics`, `All`).

---

## 📸 Demonstração em capturas de tela

### 1. Detalhes da música & Painel de download
Inspecione estilos, tags do prompt, versão do modelo e baixe em alta velocidade:
<div align="center">
  <img src="assets/screenshots/04_song_details.png" alt="Sophy Detalhes da música" width="850" />
</div>

<br />

### 2. Escolha do formato de áudio (MP3 / WAV / Original)
Escolha o formato ideal para reprodução no dia a dia ou produção musical:
<div align="center">
  <img src="assets/screenshots/05_audio_formats.png" alt="Sophy Formatos de áudio" width="850" />
</div>

<br />

### 3. Histórico local de buscas
Acesse rapidamente faixas analisadas anteriormente ou limpe o histórico com facilidade:
<div align="center">
  <img src="assets/screenshots/01_search_history.png" alt="Sophy Histórico de busca" width="850" />
</div>

<br />

### 4. Suporte multi-idioma global
Alterne instantaneamente entre os 8 idiomas suportados:
<div align="center">
  <img src="assets/screenshots/03_languages.png" alt="Sophy Idiomas" width="850" />
</div>

<br />

### 5. Interface minimalista & moderna
Design com tema escuro focado e sem distrações para sua máxima produtividade:
<div align="center">
  <img src="assets/screenshots/02_main_screen.png" alt="Sophy Tela principal" width="850" />
</div>

---

## 📥 Instalação

### Instalador para Windows (Setup)
1. Baixe o instalador `Sophy_Setup.exe` mais recente na página de [Releases](https://github.com/umwt26/sophy-suno-downloader/releases).
2. Execute o instalador e conclua o assistente moderno.
3. Abra o **Sophy** diretamente pela Área de Trabalho ou Menu Iniciar!

---

## 🛠️ Tecnologias e arquitetura

| Camada | Tecnologias |
| :--- | :--- |
| **Núcleo Desktop** | [Tauri 2](https://v2.tauri.app) + [Rust](https://www.rust-lang.org/) |
| **Interface Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Motor de Mídia** | Pipeline de descriptografia em Rust & [FFmpeg](https://ffmpeg.org/) (modo silencioso) |
| **Instalador** | Assistente de instalação customizado NSIS 3.x |

---

## 🧑‍💻 Desenvolvedor & Créditos

Crafted with ❤️ by **Beli! (Discord: @umw35t)**.

- 📸 **Instagram:** [@umw26t](https://www.instagram.com/umw26t/)
- 🌐 **GitHub:** [umwt26](https://github.com/umwt26)
- ⚡ **Discord Server:** [Filera](https://discord.gg/vwzjuhnpyP)

---

## 📄 Licença & Isenção de responsabilidade

Este projeto é distribuído sob a Licença MIT.  
*Aviso legal: O Sophy é um projeto de código aberto independente e não possui vínculo oficial com o Suno AI. Respeite sempre os direitos autorais e termos de serviço das plataformas e criadores.*
