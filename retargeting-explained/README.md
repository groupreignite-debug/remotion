# Reignite Group — "Retargeting" (شو يعني؟), Remotion build

9:16 Arabic reel, **1080×1920, 30fps, 1850 frames (61.67s) = 1.4s signature intro + 60.24s film**.
Composition id `RetargetingExplained`; cover still `RetargetingCover`.

The same reel as the HyperFrames build (`groupreignite-debug/hyperfr`, branch `claude/new-session-54jvi0`,
`videos/retargeting-explained/`), rebuilt in Remotion: same script, Salem's own recording, same burning
`Retargeting` intro, same storyboard, look, timings and sounds. That build was only read, not modified.

Deliverables: `renders/retargeting-explained.mp4` (H.264 + AAC 256k, −14.0 LUFS integrated, true peak −1.2 dBFS)
and `cover.png`.

## Commands

```bash
npm i
npm run dev                  # Remotion Studio
npm run render               # render + master the audio + export cover.png (scripts/render.sh)
# with a local Chromium instead of Remotion's download:
BROWSER=/path/to/chrome-headless-shell npm run render
npm run lint                 # eslint + tsc
npm run audio                # rebuild the music + SFX stems (python3: numpy, scipy, soundfile)
```

## How it is built

- `src/cues.ts` — Salem's word timings (`scripts/cues.json`, from the HyperFrames build's alignment of his
  recording) and the scene windows. Every scene, subtitle and SFX is keyed to `W(i)`, the start of word *i*,
  in film seconds. The film starts at frame 42 (after the 1.4s intro); frames are `seconds × 30`.
- `src/RetargetingExplained.tsx` — the intro in `<Sequence from={0} durationInFrames={42}>`, the film in
  `<Sequence from={42}>`, and inside it one `<Sequence>` per storyboard scene. 03 FREEZE overlaps the end of
  02 FOLLOW (the feeds dim behind it), so these are plain Sequences, not a series.
- `src/timeline.ts` — a small frame-driven port of the GSAP timeline the reference was authored with. Each
  scene declares its tweens once (`fromTo`, `to`, `set`, with the same eases in terms of Remotion's `Easing`)
  and reads values at the time given by `useCurrentFrame()`. There are no CSS transitions and no timers, so every
  render is identical. Because it keeps GSAP's semantics (start values, immediate `from` values,
  overlapping tweens), each scene file reads line for line like the reference and the frames match it
  (SSIM 0.993 over all 1850 frames against the HyperFrames render).
- `src/scenes/*` — one component per scene (00 intro … 12 end card). `src/world.tsx` holds the recurring
  drawn objects: the jacket card, the Pixel dot, the person, phones and feeds, and the line icons. Emoji are
  drawn as line icons because Alexandria has none.
- `src/Subtitles.tsx` — `SUBTITLES: {text, startFrame, endFrame, hidden}[]`, built from the word
  timings. Lines 03 and 13, and the "اكتب PIXEL…" half of 14, are `hidden: true` because the centre shows them big
  (one text layer). Latin key terms are drawn orange.
- `src/Soundtrack.tsx` — Salem's VO, the music bed ducked under each spoken line as a function of the
  frame, and each SFX in its own `<Sequence>` (`src/sfx.json`). The intro's ember sound plays in the intro
  Sequence.
- `src/fonts.ts` — Alexandria 300–900, Arabic + Latin subsets, loaded from `public/fonts/` with
  `@remotion/fonts` (the render waits for them).

## Audio

- `public/audio/vo_track.wav` — Salem's recording (`source/vo_human_raw.m4a`, the file he sent), cleaned
  and trimmed so his first word lands at 0.12s, exactly as in the HyperFrames build. His voice is never replaced.
- `public/audio/music.wav`, `public/audio/sfx/*.wav` — `scripts/build_audio.py`, the reference's generator
  with the same seed. It writes the bed un-ducked and one file per SFX event (the sub-frame remainder of
  each cue is leading silence). Mixed back together, the stems are sample-identical to the reference's
  `music.wav` / `sfx.wav`.
- `public/audio/intro.wav` — the intro's ember sound, copied from the reference.
- Loudness: the raw Remotion mix is −15.9 LUFS and already peaks near −0.7 dBFS. Like the reference,
  `scripts/render.sh` applies a fixed +2.0 dB gain into a limiter after the render, which gives −14.0 LUFS and a
  true peak of −1.2 dBFS. Re-measure if the mix changes (the script prints the result).
- `scripts/build_vo_human.py`, `scripts/build_intro_audio.py` and `scripts/vo_human_words.json` are kept
  for reference. They are the reference pipeline that produced `vo_track.wav`, `intro.wav` and `cues.json`.

## Brand

Charcoal `#1A1A1A`, orange `#FF4D1A`, off-white `#F5F1EA`, gold `#FFB000` once (the "bought" rule in scene 09),
plus the neutral `#6E6A64` for the stranger in scene 07. The logo `public/reignite-group-logo.png` is the
supplied file, byte-identical and unmodified. It appears only on the end card and the cover. `Instagram` and
`YouTube` appear as plain words only, with no logos or platform colours.
