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
- Voiceover: `public/audio/reel-1.mp3` (ElevenLabs, voice "Kayleigh", eleven_v4). Each scene plays its own slice of it, so the visuals keep their pacing.
- Slice and caption timings come from `VO_PHRASES` in `src/config.ts`, measured with `ffmpeg -af silencedetect`. **If you regenerate the voiceover, update those timings.**
- Optional music at `public/audio/music.mp3` (quieter under the voice, lifts on the end card).

## Logo
`public/logo-p.png` is the "P" mark extracted from the original logo (`public/logo.png`) with the black background removed. The wordmark is typeset in Inter (self-hosted at `public/fonts`).
