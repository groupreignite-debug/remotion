// Synthesizes the subtle SFX into public/audio/sfx/ (no third-party samples, so no licensing questions).
// Run: node scripts/make-sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 48000;
const out = new URL("../public/audio/sfx/", import.meta.url);
mkdirSync(out, { recursive: true });

const wav = (samples) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  return buf;
};

const render = (seconds, fn) => Array.from({ length: Math.round(seconds * SR) }, (_, i) => fn(i / SR));
let seed = 7;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

// Clock tick: short filtered click with a woody 2.2kHz body.
let lp = 0;
const tick = render(0.08, (t) => {
  lp += 0.35 * (noise() - lp);
  return (lp * 0.6 + Math.sin(2 * Math.PI * 2200 * t) * 0.5) * Math.exp(-t * 90) * 0.7;
});

// "Close tab": two soft clicks, lower and duller.
let lp2 = 0;
const close = render(0.12, (t) => {
  lp2 += 0.2 * (noise() - lp2);
  const env = Math.exp(-t * 120) + (t > 0.045 ? Math.exp(-(t - 0.045) * 140) * 0.7 : 0);
  return (lp2 * 0.8 + Math.sin(2 * Math.PI * 900 * t) * 0.4) * env * 0.6;
});

// Marker draw: band-limited noise swell, ~0.6s.
let a = 0, b = 0;
const marker = render(0.6, (t) => {
  a += 0.5 * (noise() - a);
  b += 0.08 * (a - b);
  const env = Math.sin(Math.PI * Math.min(1, t / 0.6)) ** 0.7;
  return (a - b) * env * 0.35;
});

// Soft ding: sine + octave partial, gentle decay.
const ding = render(0.9, (t) =>
  (Math.sin(2 * Math.PI * 1318.5 * t) * 0.5 + Math.sin(2 * Math.PI * 2637 * t) * 0.12) *
  Math.min(1, t / 0.004) * Math.exp(-t * 5) * 0.5,
);

// End-card chime: two-note rising bell (E5 → B5).
const bell = (f, t) => (t < 0 ? 0 : (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.01 * t)) * Math.min(1, t / 0.005) * Math.exp(-t * 2.2));
const chime = render(2.2, (t) => (bell(659.3, t) + bell(987.8, t - 0.18)) * 0.3);

for (const [name, s] of Object.entries({ tick, close, marker, ding, chime })) {
  writeFileSync(new URL(`${name}.wav`, out), wav(s));
}
console.log("sfx written");
