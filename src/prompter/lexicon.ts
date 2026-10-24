// Multilingual music lexicon for the Suno Style Prompter rule engine.
// Patterns are matched against normalized input (lowercase, accents stripped, ı->i, ß->ss).
// Covers the 8 UI languages (en, tr, de, fr, es, pt, ru, ja) plus common English music terms.
// Patterns of 5+ characters also match with suffixes ("saksafonu", "girişe"), shorter ones need a boundary.

export type Category = "genre" | "instrument" | "rhythm" | "vocal" | "mood" | "production";

export interface LexEntry {
  id: string;
  cat: Category;
  /** Label used in the style prompt. */
  label: string;
  /** Label used when the user asks for "more" of it. */
  up?: string;
  /** Label used when the user asks for "less" of it. */
  down?: string;
  /** Genre family, drives default instruments / structure / tempo. */
  family?: Family;
  /** Default BPM for genres. */
  bpm?: number;
  patterns: string[];
}

export type Family = "rap" | "pop" | "edm" | "rock" | "ballad" | "folk" | "lofi" | "jazz" | "latin" | "cinematic";

const g = (id: string, label: string, family: Family, bpm: number, ...patterns: string[]): LexEntry => ({
  id, cat: "genre", label, family, bpm, patterns,
});
const i = (id: string, label: string, up: string, down: string, ...patterns: string[]): LexEntry => ({
  id, cat: "instrument", label, up, down, patterns,
});
const t = (cat: Category, id: string, label: string, ...patterns: string[]): LexEntry => ({ id, cat, label, patterns });

export const LEXICON: LexEntry[] = [
  // ---------------- Genres (most specific first) ----------------
  g("uk-drill", "UK Drill", "rap", 142, "uk drill", "uk dril"),
  g("ny-drill", "NY Drill", "rap", 144, "ny drill", "brooklyn drill", "new york drill"),
  g("drill", "Drill", "rap", 142, "drill", "дрилл", "ドリル"),
  g("melodic-trap", "Melodic Trap", "rap", 140, "melodic trap", "melodik trap", "melodischer trap", "trap melodique", "trap melodico", "мелодичный трэп"),
  g("dark-trap", "Dark Trap", "rap", 140, "dark trap", "karanlik trap"),
  g("phonk", "Phonk", "rap", 130, "brazilian phonk", "phonk", "фонк", "フォンク"),
  g("trap", "Trap", "rap", 140, "trap", "трэп", "трап", "トラップ"),
  g("boom-bap", "90s Boom Bap", "rap", 90, "boom bap", "boombap", "90s hip hop", "90lar rap", "old school rap", "oldschool"),
  g("hip-hop", "Hip-Hop", "rap", 95, "hip hop", "hiphop", "hip-hop", "хип-хоп", "хип хоп", "ヒップホップ"),
  g("turkish-rap", "Turkish Rap", "rap", 95, "turkce rap", "turk rap", "turkish rap"),
  g("rap", "Rap", "rap", 95, "rap", "рэп", "ラップ"),
  g("rnb", "Contemporary R&B", "pop", 90, "r&b", "rnb", "r n b", "ритм-н-блюз"),
  g("afrobeats", "Afrobeats", "latin", 105, "afrobeat", "afro beat"),
  g("amapiano", "Amapiano", "edm", 112, "amapiano"),
  g("reggaeton", "Reggaeton", "latin", 95, "reggaeton", "regueton", "реггетон", "レゲトン"),
  g("baile-funk", "Baile Funk", "latin", 130, "baile funk", "funk carioca", "funk brasileiro"),
  g("bossa-nova", "Bossa Nova", "jazz", 120, "bossa nova", "bossa"),
  g("sertanejo", "Sertanejo", "folk", 100, "sertanej"),
  g("samba", "Samba", "latin", 100, "samba"),
  g("fado", "Fado", "ballad", 70, "fado"),
  g("flamenco", "Flamenco", "folk", 110, "flamenco", "фламенко"),
  g("salsa", "Salsa", "latin", 180, "salsa"),
  g("bachata", "Bachata", "latin", 125, "bachata"),
  g("cumbia", "Cumbia", "latin", 95, "cumbia"),
  g("dancehall", "Dancehall", "latin", 100, "dancehall"),
  g("reggae", "Reggae", "latin", 75, "reggae", "регги", "レゲエ"),
  g("k-pop", "K-Pop", "pop", 120, "k-pop", "kpop", "k pop", "кей-поп"),
  g("j-pop", "J-Pop", "pop", 125, "j-pop", "jpop", "j pop", "jポップ", "j-ポップ"),
  g("city-pop", "80s City Pop", "pop", 110, "city pop", "シティポップ"),
  g("enka", "Enka", "ballad", 75, "enka", "演歌"),
  g("anime", "Anime Opening Rock", "rock", 170, "anime", "アニソン", "アニメ"),
  g("synthwave", "Synthwave", "edm", 100, "synthwave", "retrowave", "outrun", "синтвейв", "シンセウェイブ"),
  g("hyperpop", "Hyperpop", "edm", 160, "hyperpop"),
  g("dubstep", "Dubstep", "edm", 140, "dubstep", "дабстеп"),
  g("drum-and-bass", "Drum and Bass", "edm", 174, "drum and bass", "drum & bass", "drum n bass", "dnb", "d&b", "драм-н-бейс"),
  g("techno", "Techno", "edm", 130, "techno", "tekno", "техно", "テクノ"),
  g("house", "House", "edm", 124, "deep house", "house", "хаус", "ハウス"),
  g("trance", "Trance", "edm", 138, "trance", "транс", "トランス"),
  g("jersey-club", "Jersey Club", "edm", 140, "jersey club"),
  g("edm", "EDM", "edm", 128, "edm", "electronic dance", "elektronik", "electronic", "electronique", "electronica", "eletronica", "электрон", "エレクトロ"),
  g("lofi", "Lo-Fi Hip-Hop", "lofi", 80, "lo-fi", "lofi", "lo fi", "лоу-фай", "ローファイ"),
  g("arabesque", "Turkish Arabesque", "ballad", 85, "arabesk", "arabesque"),
  g("anatolian-rock", "Anatolian Psychedelic Rock", "rock", 115, "anadolu rock", "anatolian rock", "anadolu psych"),
  g("turkish-folk", "Turkish Folk", "folk", 95, "turku", "halk muzigi", "turkish folk", "turk halk"),
  g("turkish-pop", "Turkish Pop", "pop", 110, "turkce pop", "turk pop", "turkish pop"),
  g("chanson", "French Chanson", "ballad", 90, "chanson"),
  g("schlager", "Schlager", "pop", 125, "schlager"),
  g("metal", "Heavy Metal", "rock", 150, "metal", "метал", "メタル"),
  g("punk", "Punk Rock", "rock", 170, "punk", "панк", "パンク"),
  g("grunge", "Grunge", "rock", 110, "grunge", "гранж"),
  g("indie", "Indie Rock", "rock", 120, "indie", "инди", "インディー"),
  g("rock", "Rock", "rock", 120, "rock", "рок", "ロック"),
  g("blues", "Blues", "jazz", 80, "blues", "блюз", "ブルース"),
  g("jazz", "Jazz", "jazz", 110, "jazz", "caz", "джаз", "ジャズ"),
  g("soul", "Soul", "pop", 90, "soul", "соул", "ソウル"),
  g("funk", "Funk", "pop", 110, "funk", "фанк", "ファンク"),
  g("disco", "Disco", "pop", 120, "disco", "disko", "диско", "ディスコ"),
  g("gospel", "Gospel", "ballad", 80, "gospel"),
  g("country", "Country", "folk", 100, "country", "кантри", "カントリー"),
  g("folk", "Folk", "folk", 100, "folk", "фолк", "フォーク"),
  g("cinematic", "Cinematic Orchestral", "cinematic", 90, "cinematic", "sinematik", "orchestral", "orkestral", "film muzigi", "soundtrack", "кинематограф", "оркестр", "映画", "オーケストラ"),
  g("ambient", "Ambient", "cinematic", 70, "ambient", "эмбиент", "アンビエント"),
  g("ballad", "Ballad", "ballad", 72, "ballad", "balad", "ballade", "balada", "баллад", "バラード"),
  g("pop", "Pop", "pop", 118, "pop", "поп", "ポップ"),

  // ---------------- Instruments ----------------
  i("808", "808 Bass", "Heavy Distorted 808", "Subtle 808", "808", "sekiz sifir sekiz"),
  i("sub-bass", "Sliding Sub-Bass", "Heavy Sliding Sub-Bass", "Soft Sub-Bass", "sub bass", "sub-bass", "subbass", "sliding bass"),
  i("bass", "Deep Bass", "Heavy Bass", "Light Bass", "bass", "bas", "basse", "bajo", "baixo", "бас", "ベース"),
  i("kick", "Punchy Kick", "Hard-Hitting Kick", "Soft Kick", "kick", "davul vurus", "бочка", "キック"),
  i("snare", "Crisp Snare", "Cracking Snare", "Soft Snare", "snare", "trampet", "малый барабан", "スネア"),
  i("hihat", "Crisp Hi-Hats", "Rapid Hi-Hat Rolls", "Sparse Hi-Hats", "hi-hat", "hihat", "hi hat", "хай-хэт", "ハイハット"),
  i("claps", "Layered Claps", "Loud Claps", "Soft Claps", "clap", "alkis", "хлопк"),
  i("drums", "Live Drums", "Powerful Drums", "Light Percussion", "drums", "davul", "bateria", "bateria", "schlagzeug", "batterie", "барабан", "ドラム"),
  i("piano", "Piano", "Prominent Piano", "Soft Piano", "piano", "piyano", "klavier", "пианино", "фортепиано", "ピアノ"),
  i("rhodes", "Rhodes Electric Piano", "Prominent Rhodes", "Soft Rhodes", "rhodes", "electric piano", "elektrik piyano"),
  i("acoustic-guitar", "Acoustic Guitar", "Prominent Acoustic Guitar", "Soft Acoustic Guitar", "acoustic guitar", "akustik gitar", "akustikgitarre", "guitare acoustique", "guitarra acustica", "violao", "акустическая гитара", "アコギ", "アコースティックギター"),
  i("electric-guitar", "Electric Guitar", "Distorted Electric Guitar", "Clean Electric Guitar", "electric guitar", "elektro gitar", "e-gitarre", "guitare electrique", "guitarra electrica", "guitarra eletrica", "электрогитар", "エレキ"),
  i("guitar", "Guitar", "Prominent Guitar", "Soft Guitar", "guitar", "gitar", "gitarre", "guitare", "guitarra", "гитар", "ギター"),
  i("strings", "String Section", "Soaring Strings", "Soft Strings", "strings", "yaylilar", "streicher", "cordes", "cuerdas", "cordas", "струнн", "ストリングス"),
  i("violin", "Violin", "Soaring Violin", "Soft Violin", "violin", "keman", "geige", "violon", "violin", "violino", "скрипк", "バイオリン"),
  i("cello", "Cello", "Deep Cello", "Soft Cello", "cello", "viyolonsel", "violoncelle", "violonchelo", "violoncelo", "виолончел", "チェロ"),
  i("sax", "Saxophone", "Wailing Saxophone", "Smooth Saxophone", "saxophone", "saksafon", "saxofon", "saxofone", "saxo", "sax", "саксофон", "サックス"),
  i("trumpet", "Trumpet", "Bold Trumpet", "Muted Trumpet", "trumpet", "trompet", "trompete", "trompette", "trompeta", "труба", "トランペット"),
  i("brass", "Brass Section", "Bold Brass", "Soft Brass", "brass", "nefesli", "blechblas", "cuivres", "metales", "metais", "духовые", "ブラス"),
  i("flute", "Flute", "Airy Flute", "Soft Flute", "flute", "flut", "flote", "flauta", "флейт", "フルート"),
  i("clarinet", "Clarinet", "Expressive Clarinet", "Soft Clarinet", "clarinet", "klarnet", "klarinette", "clarinette", "clarinete", "кларнет", "クラリネット"),
  i("synth", "Analog Synths", "Wide Analog Synth Leads", "Subtle Synth Pads", "synth", "synthesizer", "sentezleyici", "sintetizador", "синтезатор", "синт", "シンセ"),
  i("pad", "Atmospheric Pads", "Lush Pads", "Faint Pads", "pad", "pads"),
  i("pluck", "Synth Plucks", "Bright Plucks", "Soft Plucks", "pluck"),
  i("bells", "Bells", "Haunting Bells", "Soft Bells", "bells", "zil", "glocken", "cloches", "campanas", "sinos", "колокол", "ベル"),
  i("choir", "Choir", "Epic Choir", "Distant Choir", "choir", "koro", "chor", "choeur", "coro", "хор", "クワイア", "合唱"),
  i("organ", "Organ", "Booming Organ", "Soft Organ", "organ", "org", "orgel", "orgue", "organo", "orgao", "орган", "オルガン"),
  i("baglama", "Bağlama (Saz)", "Prominent Bağlama", "Soft Bağlama", "baglama", "saz"),
  i("darbuka", "Darbuka", "Driving Darbuka", "Light Darbuka", "darbuka", "darbouka"),
  i("ney", "Ney Flute", "Haunting Ney", "Soft Ney", "ney"),
  i("kanun", "Kanun", "Prominent Kanun", "Soft Kanun", "kanun", "qanun"),
  i("oud", "Oud", "Prominent Oud", "Soft Oud", "oud", "ud", "уд"),
  i("sitar", "Sitar", "Prominent Sitar", "Soft Sitar", "sitar", "ситар"),
  i("kalimba", "Kalimba", "Bright Kalimba", "Soft Kalimba", "kalimba"),
  i("harp", "Harp", "Cascading Harp", "Soft Harp", "harp", "arp", "harfe", "harpe", "arpa", "арф", "ハープ"),
  i("accordion", "Accordion", "Prominent Accordion", "Soft Accordion", "accordion", "akordeon", "akkordeon", "accordeon", "acordeon", "acordeao", "аккордеон", "アコーディオン"),
  i("cowbell", "Phonk Cowbell", "Loud Cowbell Melody", "Subtle Cowbell", "cowbell", "kovbel", "ковбел"),
  i("vocal-chops", "Vocal Chops", "Glitchy Vocal Chops", "Subtle Vocal Chops", "vocal chop", "vokal chop"),
  i("vinyl", "Vinyl Crackle", "Heavy Vinyl Crackle", "Faint Vinyl Crackle", "vinyl", "plak", "пластинк"),

  // ---------------- Rhythm / feel ----------------
  t("rhythm", "syncopated", "Syncopated Rhythm", "syncopated", "senkoplu", "synkopiert", "syncope", "sincopado"),
  t("rhythm", "fast", "Fast Cadence", "fast", "hizli", "schnell", "rapide", "rapido", "быстр", "速い", "アップテンポ", "uptempo", "up-tempo"),
  t("rhythm", "slow", "Slow Groove", "slow", "yavas", "langsam", "lent", "lento", "медленн", "遅い", "スロー"),
  t("rhythm", "half-time", "Half-Time Groove", "half time", "half-time"),
  t("rhythm", "four-on-floor", "Four-on-the-Floor Beat", "four on the floor", "4/4"),
  t("rhythm", "bouncy", "Bouncy Groove", "bouncy", "hoplayan", "ziplayan"),
  t("rhythm", "swing", "Swing Feel", "swing"),

  // ---------------- Vocals ----------------
  t("vocal", "male", "Male Vocals", "male", "erkek", "man vocal", "mannlich", "masculin", "masculino", "hombre", "homem", "мужск", "男性", "男声"),
  t("vocal", "female", "Female Vocals", "female", "kadin", "kiz vokal", "weiblich", "feminin", "femenin", "feminino", "mujer", "mulher", "женск", "女性", "女声"),
  t("vocal", "duet", "Male and Female Duet", "duet", "duet", "duett", "duo", "dueto", "дуэт", "デュエット"),
  t("vocal", "autotune", "Heavy Autotune", "autotune", "auto-tune", "auto tune", "otoyun", "автотюн", "オートチューン"),
  t("vocal", "adlibs", "Reverb Drenched Ad-libs", "ad-lib", "adlib", "ad lib"),
  t("vocal", "raspy", "Raspy Gritty Vocals", "raspy", "gritty voice", "kisik ses", "bogus ses", "rauchig", "rauque", "ronco", "хрипл"),
  t("vocal", "whisper", "Whispered Vocals", "whisper", "fisilti", "flustern", "chuchot", "susurr", "sussurr", "шепот", "шёпот", "囁"),
  t("vocal", "harmonies", "Layered Harmonies", "harmon", "armoni", "гармони", "ハモ"),
  t("vocal", "melodic-vocals", "Melodic Rap Flow", "melodic flow", "melodik flow", "melodic rap", "melodik rap"),
  t("vocal", "emotional-vocals", "Raw Emotional Delivery", "emotional vocal", "duygusal vokal", "duygulu"),
  t("vocal", "instrumental", "Instrumental", "instrumental", "enstrumantal", "enstrumental", "instrumentale", "sozsuz", "vokalsiz", "no vocals", "ohne gesang", "sans voix", "sin voz", "sem voz", "без вокал", "без слов", "инструментал", "インスト", "ボーカルなし"),

  // ---------------- Mood ----------------
  t("mood", "dark", "Dark Tone", "dark", "karanlik", "kasvetli", "dunkel", "duster", "sombre", "obscur", "oscuro", "sombrio", "escuro", "мрачн", "темн", "тёмн", "ダーク", "暗い"),
  t("mood", "sad", "Melancholic Sad Mood", "sad", "huzunlu", "uzgun", "huzun", "traurig", "triste", "грустн", "печальн", "悲しい", "切ない"),
  t("mood", "emotional", "Emotional", "emotional", "duygusal", "emotional", "emotionnel", "emocional", "эмоциональн", "エモい", "エモーショナル"),
  t("mood", "happy", "Uplifting Happy Vibe", "happy", "mutlu", "neseli", "frohlich", "joyeux", "feliz", "alegre", "весел", "радост", "明るい", "楽しい"),
  t("mood", "aggressive", "Aggressive Punch", "aggressive", "agresif", "sert", "aggressiv", "agressif", "agresivo", "agressivo", "агрессив", "攻撃的", "激しい"),
  t("mood", "chill", "Chill Laid-Back Vibe", "chill", "sakin", "rahat", "entspannt", "detendu", "relajado", "relaxado", "спокойн", "расслабл", "チル", "落ち着"),
  t("mood", "epic", "Epic Grand Atmosphere", "epic", "epik", "episch", "epique", "epico", "эпич", "壮大"),
  t("mood", "romantic", "Romantic", "romantic", "romantik", "romantisch", "romantique", "romantico", "романтич", "ロマンチック"),
  t("mood", "energetic", "High Energy", "energetic", "enerjik", "energisch", "energique", "energico", "энергичн", "エネルギッシュ", "hype", "gaz"),
  t("mood", "nostalgic", "Nostalgic", "nostalgic", "nostaljik", "nostalgisch", "nostalgique", "nostalgico", "ностальги", "懐かしい", "ノスタルジック"),
  t("mood", "dreamy", "Dreamy Ethereal", "dreamy", "ruya gibi", "ruyamsi", "vertraumt", "reveur", "sonador", "sonhador", "мечтательн", "夢のよう"),
  t("mood", "mysterious", "Mysterious", "mysterious", "gizemli", "geheimnisvoll", "mysterieux", "misterioso", "загадочн", "ミステリアス"),
  t("mood", "angry", "Angry Intense", "angry", "ofkeli", "sinirli", "wutend", "en colere", "enojado", "furioso", "зл", "怒り"),
  t("mood", "motivational", "Motivational Anthem", "motivational", "motive", "motivasyon", "motivierend", "motivant", "motivador", "мотивац"),

  // ---------------- Production / mix ----------------
  t("production", "lofi-grit", "Lo-Fi Grit", "lo-fi grit", "gritty", "dusty", "tozlu", "kirli ses"),
  t("production", "analog", "Warm Analog Saturation", "analog", "warm", "sicak", "warm sound", "analogique", "аналог", "アナログ"),
  t("production", "spacious", "Spacious Mix", "spacious", "genis", "wide", "weitraumig", "spatial", "amplio", "amplo", "простор", "広がり"),
  t("production", "reverb", "Lush Reverb", "reverb", "yanki", "hall", "reverbe", "reverberacion", "реверб", "リバーブ"),
  t("production", "polished", "Polished Radio-Ready Mix", "polished", "radio", "temiz miks", "clean mix", "radio ready"),
  t("production", "raw", "Raw Unpolished Sound", "raw", "ham ses", "roh", "brut", "crudo", "cru", "сыр"),
  t("production", "vintage", "Vintage Tape Sound", "vintage", "eski usul", "retro", "tape", "kaset", "винтаж", "ретро", "ヴィンテージ", "レトロ"),
  t("production", "80s", "80s Production", "80s", "80ler", "80'ler", "80er", "annees 80", "anos 80", "80-х", "80年代"),
  t("production", "90s", "90s Production", "90s", "90lar", "90'lar", "90er", "annees 90", "anos 90", "90-х", "90年代"),
  t("production", "punchy", "Punchy Mix", "punchy", "vurucu", "druckvoll", "percutant", "contundente"),
  t("production", "minimal", "Minimal Arrangement", "minimal", "sade", "minimalist", "минимал", "ミニマル"),
];

// ---------------- Song sections ----------------
export interface SectionDef {
  kind: SectionKind;
  label: string;
  vocal: boolean;
  patterns: string[];
}

export type SectionKind =
  | "intro" | "verse" | "pre-chorus" | "hook" | "chorus" | "bridge" | "drop" | "build-up"
  | "beat-switch" | "breakdown" | "solo" | "interlude" | "outro";

export const SECTIONS: SectionDef[] = [
  { kind: "pre-chorus", label: "Pre-Chorus", vocal: true, patterns: ["pre-chorus", "pre chorus", "prechorus", "nakarat oncesi", "on nakarat", "pre-refrain", "pre-estribillo", "pre-refrao", "предприпев", "プレコーラス", "bメロ"] },
  { kind: "beat-switch", label: "Beat Switch", vocal: false, patterns: ["beat switch", "beat degisimi", "beat degis", "ritim degisimi", "beatwechsel", "changement de beat", "cambio de beat", "mudanca de beat", "смена бита", "ビートスイッチ"] },
  { kind: "build-up", label: "Build-Up", vocal: false, patterns: ["build-up", "build up", "buildup", "yukselis", "aufbau", "montee", "subida", "нарастан", "ビルドアップ"] },
  { kind: "breakdown", label: "Breakdown", vocal: false, patterns: ["breakdown", "kirilma"] },
  { kind: "interlude", label: "Interlude", vocal: false, patterns: ["interlude", "ara muzik", "ara bolum", "zwischenspiel", "interludio", "интерлюдия", "間奏"] },
  { kind: "intro", label: "Intro", vocal: false, patterns: ["intro", "giris", "einleitung", "introduction", "introduccion", "introducao", "вступлен", "интро", "イントロ"] },
  { kind: "verse", label: "Verse", vocal: true, patterns: ["verse", "kita", "strophe", "couplet", "verso", "estrofe", "куплет", "ヴァース", "aメロ"] },
  { kind: "hook", label: "Hook", vocal: true, patterns: ["hook", "huk", "хук", "フック"] },
  { kind: "chorus", label: "Chorus", vocal: true, patterns: ["chorus", "nakarat", "refrain", "estribillo", "refrao", "coro", "припев", "サビ", "コーラス"] },
  { kind: "bridge", label: "Bridge", vocal: true, patterns: ["bridge", "kopru", "brucke", "pont", "puente", "ponte", "бридж", "ブリッジ", "cメロ"] },
  { kind: "drop", label: "Drop", vocal: false, patterns: ["drop", "дроп", "ドロップ"] },
  { kind: "solo", label: "Solo", vocal: false, patterns: ["solo", "соло", "ソロ"] },
  { kind: "outro", label: "Outro", vocal: false, patterns: ["outro", "cikis", "bitis", "kapanis", "schluss", "final", "conclusion", "аутро", "концовк", "アウトロ"] },
];

// ---------------- Edit verbs (revisions) ----------------
export const VERBS = {
  remove: ["remove", "delete", "drop the", "without", "no more", "cikar", "kaldir", "sil", "olmasin", "istemiyorum", "entfern", "ohne", "retire", "enleve", "supprime", "sans", "quita", "elimina", "saca", "sin ", "remov", "tira", "sem ", "убер", "удал", "без ", "削除", "なし", "抜いて", "消して"],
  less: ["less", "lower", "reduce", "softer", "quieter", "turn down", "azalt", "kis", "dusur", "daha az", "hafiflet", "weniger", "leiser", "reduzier", "moins", "baisse", "reduis", "menos", "baja", "reduce", "diminu", "abaixa", "меньше", "тише", "убав", "уменьш", "控えめ", "少なく", "下げ", "小さく"],
  more: ["more", "boost", "louder", "heavier", "increase", "turn up", "stronger", "daha fazla", "artir", "yukselt", "guclendir", "agirlastir", "daha cok", "mehr", "lauter", "starker", "plus de", "monte", "augmente", "mas ", "sube", "aumenta", "mais ", "aumente", "больше", "громче", "усиль", "もっと", "強く", "上げ"],
  add: ["add", "include", "put", "with", "ekle", "koy", "olsun", "hinzu", "mit ", "ajoute", "avec", "agrega", "anade", "con ", "adicione", "coloque", "com ", "добав", "с ", "追加", "入れて"],
} as const;

/** Placeholder lines for vocal sections, in the UI language. Never actual lyrics. */
export const PLACEHOLDERS: Record<string, Record<"verse" | "chorus" | "hook" | "bridge" | "pre-chorus", string>> = {
  en: { verse: "(Write your verse lyrics here)", chorus: "(Write your chorus lyrics here)", hook: "(Write your hook lyrics here)", bridge: "(Write your bridge lyrics here)", "pre-chorus": "(Write your pre-chorus lyrics here)" },
  tr: { verse: "(Verse sözlerini buraya yaz)", chorus: "(Nakarat sözlerini buraya yaz)", hook: "(Hook sözlerini buraya yaz)", bridge: "(Geçiş sözlerini buraya yaz)", "pre-chorus": "(Nakarat öncesi sözlerini buraya yaz)" },
  de: { verse: "(Schreibe hier deine Strophe)", chorus: "(Schreibe hier deinen Refrain)", hook: "(Schreibe hier deine Hook)", bridge: "(Schreibe hier deine Bridge)", "pre-chorus": "(Schreibe hier deinen Pre-Chorus)" },
  fr: { verse: "(Écris ton couplet ici)", chorus: "(Écris ton refrain ici)", hook: "(Écris ton hook ici)", bridge: "(Écris ton pont ici)", "pre-chorus": "(Écris ton pré-refrain ici)" },
  es: { verse: "(Escribe aquí tu verso)", chorus: "(Escribe aquí tu estribillo)", hook: "(Escribe aquí tu hook)", bridge: "(Escribe aquí tu puente)", "pre-chorus": "(Escribe aquí tu pre-estribillo)" },
  pt: { verse: "(Escreva aqui o seu verso)", chorus: "(Escreva aqui o seu refrão)", hook: "(Escreva aqui o seu hook)", bridge: "(Escreva aqui a sua ponte)", "pre-chorus": "(Escreva aqui o seu pré-refrão)" },
  ru: { verse: "(Напишите здесь текст куплета)", chorus: "(Напишите здесь текст припева)", hook: "(Напишите здесь текст хука)", bridge: "(Напишите здесь текст бриджа)", "pre-chorus": "(Напишите здесь текст предприпева)" },
  ja: { verse: "（ここにヴァースの歌詞を書いてください）", chorus: "（ここにサビの歌詞を書いてください）", hook: "（ここにフックの歌詞を書いてください）", bridge: "（ここにブリッジの歌詞を書いてください）", "pre-chorus": "（ここにプレコーラスの歌詞を書いてください）" },
};
