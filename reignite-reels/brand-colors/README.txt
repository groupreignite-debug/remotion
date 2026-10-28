REIGNITE | Brand Colors reel - Remotion project

HOW TO RENDER
1. Install Node.js (already on this PC).
2. Open a terminal in this folder and run:   npm install
3. Preview and edit live:                    npm run studio
4. Render the final MP4:                     npm run render
   Output: out/brand-colors.mp4 (1080x1920, 30fps)
5. Render the cover:                         npx remotion still Cover out/cover.png

WHERE THINGS ARE
- src/data/script.ts      the 12 voiceover / subtitle lines
- src/data/lines.json     timing of each line (placeholder from the brief until a VO exists)
- src/scenes/Scenes.tsx   all 12 scenes + end card
- src/theme.ts            brand colors, font, and ASSETS switches
- src/sfx.ts              which sound file plays for whoosh/pop/click/etc.
- public/frames/          Coolors screenshots used in scene 10
- public/logo/            Reignite logo
- public/audio/sfx/       sound effects

AUDIO (ElevenLabs)
- public/audio/vo.mp3      Voiceover: your own recording (vo_raw.m4a), first 0.62s of silence
                           trimmed, EQ'd for clarity (low-mid cut, presence boost), lightly
                           compressed, loudness-normalized to about -14 LUFS.
- src/data/words.json      ElevenLabs Scribe word timings for vo.mp3 (shifted for the trim).
- src/data/lines.json      Line timings built from words.json:  node scripts/build-lines.mjs 0 0
- public/audio/sfx/el/     ElevenLabs sound effects (trimmed, peak -1 dBFS):
                             whoosh, ding, click, ignite  - reused from the "GA vs Pixel" reel
                             pop, flip, flash             - generated for this reel
- src/sfx.ts               Which file plays for each cue, and its volume.
ElevenLabs flow with everything: "Reignite Reel - Brand Colors VO + SFX".

CHANGING THE VOICEOVER
1. Replace public/audio/vo.mp3 (theme.ts already has vo: true).
2. Transcribe it with ElevenLabs Scribe and save the words to src/data/words.json.
3. Run: node scripts/build-lines.mjs 0 0
