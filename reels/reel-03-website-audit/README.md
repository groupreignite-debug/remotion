# Reel 03 — الـ 5-Second Test (تدقيق موقع #1) · Reignite Group

Vertical motion-graphics reel built in Remotion. Output: **1080×1920, 30 fps, H.264 MP4, 59.05 s**:
`render/reel-03-website-audit.mp4`.

## Run

```bash
bun install
bun run dev        # Remotion Studio
bun run render     # -> out/reel-03-website-audit.mp4
```

If Remotion can't download its own Chrome, point it at a local Chromium:
`REMOTION_BROWSER=/path/to/chrome bun run render`.

## How it is synced

- `scripts/transcribe.py` transcribes each speech region with Whisper (medium, through sherpa-onnx, run locally).
  `scripts/align.py` uses that to place every word of the script, then snaps word boundaries to the 10 ms
  energy envelope (with a few manual corrections). Output: `src/timeline.json`.
- `src/timing.ts` turns those times into frames. Every scene starts on the first word of its line, and every
  kinetic word lands on the frame it is spoken.
- **The two 5-second silences.** The recorded voiceover only pauses about 1.4 s after "عدّ معي." and
  "الموقع التاني.", not 5 s. To keep the format, the voiceover is split inside each pause and padded with
  silence until the gap is exactly 150 frames. No voice audio is cut, stretched or re-timed. The countdowns
  (one number per second, with a tick on each) are locked to those 150 frames, and the screen goes black for
  the last 3 frames of each one. Total length = 51.06 s voiceover + 2 × ~3.6 s of silence + 0.8 s end card.
- The voiceover's 1.3 s of lead-in silence is kept. Visuals are already moving on frame 0.

## Assets

| File | What |
| --- | --- |
| `public/voiceover.m4a` | Original voiceover, untouched |
| `source-media/site-02-original.mp4` | Original screen recording (passing site) |
| `public/site-02-hero.mp4` | Made by `scripts/prepare-footage.sh`: 1.1–7.0 s of the recording (skips the iOS control centre), status bar and URL bar cropped off, real brand names blurred |
| `public/sfx/*.wav` | Sound design (ticks, whoosh, buzzer, chime, pop, stamp, keys, snap), synthesised by `scripts/make-sfx.py` |
| `public/fonts/*` | IBM Plex Sans Arabic and Inter (OFL), self-hosted so rendering needs no network |

## Things to confirm with the client

- **Script file**: `reel-03-website-audit-script-ar.txt` wasn't supplied, so the on-screen text uses the lines
  quoted in the brief, word for word.
- **Logo**: the flame logo file wasn't supplied. A vector flame stand-in is drawn on the end card. Drop the real
  file in `public/` and set `LOGO_FILE` in `src/components/Logo.tsx`.
- **Real names in the footage**: the recording is stripe.com. The Stripe logo, the "…running on Stripe" ticker
  and the customer-logo strip (Amazon / NVIDIA / Ford) are blurred. To show them, set `BLUR_REAL_NAMES = false` in
  `src/components/SiteTwo.tsx`.
- **Site 1** is an invented business ("RIVANA"), built in `src/components/SiteOne.tsx`.
