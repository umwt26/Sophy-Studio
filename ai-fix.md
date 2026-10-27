# Fixes to bring to the desktop app (.exe)

Already fixed and tested in the mobile app (`C:\Users\Umut\Projects\Sophy Studio Mobile`). The Prompter engine is the same file on both sides, so the quickest route is to copy the mobile versions over and keep the desktop UI changes below.

## 1. Suno Prompter engine

Files: `src/prompter/engine.ts`, `src/prompter/lexicon.ts`.
Copy from: `Sophy Studio Mobile/src/prompter/engine.ts` and `lexicon.ts`. The only difference is the extra `isInstrumental` export.

### Problems the user reported

- They asked for no vocals and still got vocal sections, or "Instrumental" written into the style.
- "trap olcak" with something else in the same message turned into Pop.
- Several genres in one message got mixed together.
- In short: the engine should read what is actually written and understand it in every language, not guess.

### Test cases: before → after

| Input | Before | After |
|---|---|---|
| `trap beat, vokal olmasın` | vocal sections stayed | Trap, no vocal sections |
| `sözü olmasın, drill olsun` | vocals stayed | Drill, no vocal sections |
| `Ich will einen Trap Song ohne Gesang` | **Pop** ("ohne" removed Trap) | Trap, no vocal sections |
| `Make a drill-style hood trap song … instrumental` | "Drill, Trap" mixed | Trap (the genre right before "song") |
| `sözsüz bir trap şarkısı` | style contained "Instrumental" | style has no "Instrumental"; a hint in the reply instead |
| `trap with piano` → `remove the piano` | no instruments left | Trap's default instruments come back |
| `pop şarkısı, gitar olmasın` | — | Pop, no guitar (genre kept) |

### What changed

1. **The verb applies only to the closest entity** (`opFor`).
   - Before: any remove word ("olmasın", "ohne", "without", "sin", "без"…) in a clause removed *everything* in that clause, including the genre.
   - Now: the verb only applies to the entity nearest to it in the same clause.
   - Words inside a matched entity ("ohne Gesang", "sözü olmasın") never count as verbs.
   - Clause breaks now include "ama / fakat / but / aber / mais / pero / mas / но" and ";".
   - New helper: `positionsOf()`.
2. **No-vocals phrases added to the `instrumental` entry** in `lexicon.ts`:
   - Turkish: "vokal olmasın", "vokal istemiyorum", "vokal yok", "söz olmasın", "sözü olmasın", "sözleri olmasın", "söz istemiyorum", "söz yok", "şarkı sözü olmasın", "sesli olmasın".
   - English: "without vocals", "without lyrics", "no lyrics", "no singing", "no vocal".
   - German: "kein Gesang", "keine Vocals", "ohne Vocals", "ohne Text".
   - French: "sans paroles", "sans chant".
   - Spanish: "sin letra", "sin vocal".
   - Portuguese: "sem letra", "sem vocal".
   - Russian: "без голоса".
3. **One genre per message.**
   - When several genres appear in one message without "mix / add / karıştır / fusion…", keep only the one directly before a song noun ("song, track, beat, şarkı, parça, Lied, chanson, canción, песня, 曲").
   - If none of them sits before a song noun, keep the first one named.
   - Constant: `SONG_NOUNS`.
4. **"Instrumental" is never written into the Style of Music.**
   - Suno has its own Instrumental switch, so the tag is skipped in `render()`.
   - Vocal sections and placeholders are still left out of the structure.
   - `isInstrumental(state)` is now exported for the UI.
5. **Default instruments come back** when the user removes the last instrument.

### Desktop UI change (SunoPrompterPage.tsx)

- When `isInstrumental(result.state)` is true, show a small accent-coloured note under the result: "No vocals: turn on the Instrumental switch in Suno."
- Mobile key: `mobile.instrumentalHint`. On desktop, add something like `prompter.instrumentalHint` in all 8 languages. The mobile JSONs have the translations ready.

### Test harness

- Location: `C:\Users\Umut\AppData\Local\Temp\claude\…\scratchpad\engtest\test.ts`.
- Steps:
  1. Copy `engine.ts` and `lexicon.ts` into the folder.
  2. Change the import to `./lexicon.ts`.
  3. Run `node test.ts`.
- Custom cases: pass them as a JSON argument, for example `node test.ts '[["trap olcak"]]'`.

### Still worth doing later

- More colloquial forms (for example "vokalsiz olsun ama koro olsun").
- A choir that should stay while "no vocals" is on.
- Phonk adds "Vocal Chops" even when the song is instrumental. Skip `vocal-chops` from the defaults when `isInstrumental`.
- Real language understanding would need an on-device model. The rule engine now covers the common phrasings in all 8 languages.

## 2. Accessibility preview text

- File: `src/components/SettingsPage.tsx:430`.
- The text-size preview card shows "Suno Downloader" as its title. Change it to **"Sophy Studio"**: replace `{t("settings.textPreviewTitle", "Suno Downloader")}` with the plain text `Sophy Studio`, the same as on mobile.

## 3. Release notes

- After these land, update the home "what's new" and `release-notes.md` in all 8 languages (standing rule).
