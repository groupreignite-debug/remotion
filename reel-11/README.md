# Reel 11 — ليش أقوى اللوغوهات بسيطة؟ (Reignite Group)

Vertical motion-graphics reel, 1080×1920 at 30 fps, built in Remotion and synced word-by-word to the approved voiceover.

## Voiceover

- `vo/voiceover.mp3`: the approved master (Take 1, 59.95 s). Voice: ElevenLabs "Rami – Friendly and Easygoing" (Levantine), model `eleven_multilingual_v2`, default voice settings. It was generated through the ElevenLabs connector because this environment couldn't reach the ElevenLabs API. The connector exposes no speed/stability controls, so the length was approved at ~60 s rather than the brief's 65–70 s.
- `vo/script.txt`: the exact script, one line per scene.
- `vo/timestamps.json`: word-level timings grouped by script line. They come from ElevenLabs Scribe v1 run on the master take; every word was checked against the script by `scripts/build-timestamps.py`.
- `vo-candidates/`: the three voice auditions for line 01 (A Fadi, B Rami, C Marwan).

## Running

```bash
npm install
npm run dev      # Remotion Studio
npm run render   # → out/reel-11.mp4 (H.264)
```

Total length: voiceover + 30-frame end card = 1,829 frames (60.97 s).

## Layout of the source

- `src/timing.ts`: every scene and word reveal is driven by `vo/timestamps.json`.
- `src/Headline.tsx`: kinetic Arabic headline (rise + mask + blur, ember "ignite" on accent words, drift-up exit).
- `src/Chrome.tsx`: background (grid parallax, moving ember light, vignette), fixed header and film grain.
- `src/scenes/`: one component per scene: `Hook` (01–03), `Nike`/`Apple` (04–05), `Target`/`Mercedes` (06–07), `McDonalds` (08), and `Closing` (09–14 + end card).
- `src/logos.ts`: SVG paths for the logos. Nike, Apple and McDonald's come from `simple-icons`. Mercedes and Target are built from geometry, because simple-icons no longer ships Mercedes. All are rendered in off-white.
- `public/fonts`: IBM Plex Sans Arabic, Inter and JetBrains Mono, bundled locally so renders don't depend on Google Fonts.
- `public/sfx`: soft ticks, whoosh, impact and pen scratch, synthesised by `scripts/make-sfx.sh`.
- `scripts/stills.mjs`: renders review stills (`node scripts/stills.mjs 0 300 900`).

The accent `#FB6106` was sampled from the provided logo's flame.
