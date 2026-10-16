# Perspicara — Reel 1: Problem → Solution

Vertical 1080×1920 @ 30fps Instagram reel (~35s), built with Remotion. Standalone project (not part of the monorepo workspaces).

```bash
npm install
npm run dev      # Remotion Studio
npm run still    # out/still.png (frame 600)
npm run render   # out/reel-1-problem-solution.mp4
```

In a container without Chrome downloads, add `--browser-executable=<path to chrome-headless-shell>`.

## Voiceover, music, captions
- Put the TTS voiceover at `public/audio/reel-1.mp3`. Scene timings in `src/config.ts` (`SCENE_STARTS`) are scaled to its length automatically; the 4s end card follows.
- Optional music at `public/audio/music.mp3` (ducked to ~0.07 under the voice).
- Optional word-level captions at `public/captions/reel-1.json` (`[{text, startMs, endMs}]`, e.g. from Whisper). Without it, captions are timed evenly per scene.

## Logo
`public/logo-p.png` is the "P" mark extracted from the original logo (`public/logo.png`) with the black background removed. The wordmark is typeset in Inter (self-hosted at `public/fonts`).
