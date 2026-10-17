# Reel 10 — Retargeting (شو يعني؟)

Vertical 1080×1920 @ 30fps Remotion project for Reignite Group. Length = voiceover length (59.23s → 1778 frames).

## Run

```bash
npm install
npm run dev                       # Remotion Studio
npx remotion render Reel10 out/reel-10-retargeting.mp4
```

In environments where Remotion can't download its headless Chrome, pass a local one:
`--browser-executable=/path/to/chrome-headless-shell`.

## How sync works

- `public/voiceover.m4a` is the untouched master track (not trimmed, re-timed or re-encoded).
- `scripts/transcript-words.json` holds word-level timestamps from transcribing the voiceover (ElevenLabs Scribe).
- `scripts/align.py` maps every word of `scripts/script-ar.txt` **verbatim** onto those timestamps
  (a few dialect spellings differ between the transcript and the script — the script wording always wins)
  and generates `src/timing.ts`:

  ```bash
  python3 -I scripts/align.py scripts/script-ar.txt scripts/transcript-words.json src/timing.ts
  ```

- Every scene starts on the first word of its script line (`lineStart(n)`), and all in-scene beats are keyed
  to word timestamps via `ws(line, wordIndex)`.
- Captions (`src/components/Captions.tsx`) show the script words with the current word highlighted.

## Structure

- `src/Reel.tsx` — scene list, transitions, captions, SFX.
- `src/scenes/S01…S14` — one scene per script line; `EndCard` (logo + @reignitegroup) runs the last ~1s.
- `src/components/` — background (moving light + dust + grain), scene shell (zoom-through / whip pan with motion blur /
  masked wipe / single hard cut into line 03, plus continuous 1→1.05 push-in), kinetic type, phone/browser mockups,
  ad mockups (Instagram feed & story, YouTube pre-roll, news banner, Facebook sidebar), shop illustration, sparks.
- `public/sfx/` — whoosh / pop / impact / ding / tap, synthesised with ffmpeg, mixed well under the voice.
- `public/fonts/` — Cairo (Arabic + Latin) and Grand Hotel (Instagram wordmark), loaded locally.
- `scripts/stills.mjs` — renders a contact sheet of frames for review: `node scripts/stills.mjs out/sheet.png 0 100 200`.
