import data from "./data/lines.json";
import words from "./data/words.json";
import { SCRIPT } from "./data/script";

export const END_CARD_S = 1.8;

export type Line = { id: string; start: number; end: number };
const byId = Object.fromEntries((data.lines as Line[]).map((l) => [l.id, l]));
export const LINES = data.lines as Line[];
export const line = (id: string): Line => byId[id];
export const VO_END = data.voEnd as number;

const ids = LINES.map((l) => l.id);
// Each scene runs from its line's start to the next line's start (last one to VO_END).
export const SCENES: Record<string, [number, number]> = Object.fromEntries([
  ...ids.map((id, i) => [id, [i === 0 ? 0 : line(id).start, i < ids.length - 1 ? line(ids[i + 1]).start : VO_END]]),
  ["end", [VO_END, VO_END + END_CARD_S]],
]);

type Word = { text: string; start: number; end: number };
const WORDS = words as Word[];
export const wordTime = (id: string, n: number): number => {
  const l = line(id);
  const inLine = WORDS.filter((w) => w.start >= l.start - 0.05 && w.start < l.end + 0.05 && w.text.trim() !== "");
  if (inLine.length) return inLine[Math.min(n, inLine.length - 1)].start;
  const count = SCRIPT[id].split(/\s+/).length;
  return l.start + ((l.end - l.start) * Math.min(n, count - 1)) / count;
};
