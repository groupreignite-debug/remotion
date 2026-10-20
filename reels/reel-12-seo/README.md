# Reel 12 — موقعك حلو… بس غوغل شايفو؟ (SEO)

Vertical 1080×1920, 30fps motion-graphics reel for Reignite Group, built with Remotion.

## Voiceover

- `vo/voiceover.mp3`: the master audio, used untouched. ElevenLabs `eleven_multilingual_v2`, voice "Fadi – Lebanese Conversational" (`oJQlz7pz2yWd7MRmDUXm`), the 13 script lines in one pass. It runs 61.0s (speech ends at 60.6s).
- `vo/transcript-words.json`: word timings from ElevenLabs Scribe.
- `vo/timestamps.json`: those timings aligned onto the exact script words (`scripts/align.py`). Every scene and word reveal is driven from this file.

## Commands

```bash
bun install
bun run dev        # Remotion Studio
bun run render     # out/reel-12-seo.mp4 (H.264)
```

Fonts (IBM Plex Sans Arabic, Inter, Aref Ruqaa) are bundled in `public/fonts`, and the SFX in `public/sfx` are synthesized by `scripts/make-sfx.py`. A render doesn't need any network access.

## Layout

- `src/Reel.tsx`: the scene list, headline accents, the voiceover and the end card.
- `src/ui.tsx`: shared pieces (background grid/vignette/light, grain, camera push-in, kinetic headline, labels, draw-on lines, search bar, result card, flare, badge, SFX).
- `src/scenes/SceneXX.tsx`: one file per scene. Scene 10 covers script lines 10 and 11.
