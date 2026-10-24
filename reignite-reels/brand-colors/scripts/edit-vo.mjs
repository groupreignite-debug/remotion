// Cut the chosen take after line 05 and after line 09, insert exactly 5.0s of silence at each cut,
// optionally speed up, and loudness-normalize the VO.
// Usage: node scripts/edit-vo.mjs <take.mp3> <cut1Sec> <cut2Sec> [speed=1.0]
// Writes public/audio/vo_raw.mp3 (the chosen take, untouched) and public/audio/vo.mp3 (edited).
// Cut points are in the ORIGINAL take's time; the script prints where the gaps land in vo.mp3.
// (Remotion's bundled ffmpeg has no asplit/anullsrc options, so the splice is done on raw PCM here.)
import { copyFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const FFMPEG = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const SR = 44100;
const GAP = 5.0;
const [take, c1s, c2s, speedS = "1.0"] = process.argv.slice(2);
const speed = Number(speedS);
const c1 = Number(c1s) / speed;
const c2 = Number(c2s) / speed;

copyFileSync(take, "public/audio/vo_raw.mp3");

const wavIn = execFileSync(FFMPEG, ["-hide_banner", "-v", "error", "-i", take, "-af", `atempo=${speed}`, "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", "-f", "wav", "-"], {
  maxBuffer: 1 << 28,
});
const dataAt = wavIn.indexOf("data") + 8;
const pcm = wavIn.subarray(dataAt);
const at = (s) => Math.round(s * SR) * 2;
const silence = Buffer.alloc(at(GAP));
const out = Buffer.concat([pcm.subarray(0, at(c1)), silence, pcm.subarray(at(c1), at(c2)), silence, pcm.subarray(at(c2))]);

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + out.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(out.length, 40);
const tmp = "public/audio/_vo_spliced.wav";
writeFileSync(tmp, Buffer.concat([header, out]));

execFileSync(FFMPEG, ["-hide_banner", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=9", "-ar", String(SR), "-c:a", "libmp3lame", "-b:a", "256k", "public/audio/vo.mp3"]);
unlinkSync(tmp);

console.log(JSON.stringify({ gaps: [+c1.toFixed(3), +(c2 + GAP).toFixed(3)], durationSec: +(out.length / 2 / SR).toFixed(3) }));
