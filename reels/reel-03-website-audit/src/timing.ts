import timeline from './timeline.json';

export const FPS = 30;
export const COUNTDOWN_FRAMES = 5 * FPS;

type Phrase = (typeof timeline.phrases)[number];
const P: Phrase[] = timeline.phrases;
const f = (s: number) => Math.round(s * FPS);

const phrasesOf = (line: number) => P.filter((p) => p.line === line);

// The recorded voiceover only pauses ~1.4s after "عدّ معي." and "الموقع التاني.".
// The format needs a true 5-second silence there, so the voiceover is split inside
// each pause and padded with silence until the gap is exactly 5s. Nothing else is
// touched: no voice samples are cut, stretched or re-timed.
const gap = (before: Phrase, after: Phrase) => {
	const start = f(before.end);
	const end = f(after.start);
	return {cut: Math.round((start + end) / 2), insert: COUNTDOWN_FRAMES - (end - start)};
};
const gap1 = gap(phrasesOf(5).at(-1)!, phrasesOf(6)[0]);
const gap2 = gap(phrasesOf(9).at(-1)!, phrasesOf(10)[0]);

export const VO_SEGMENTS = [
	{trimBefore: 0, trimAfter: gap1.cut, from: 0},
	{trimBefore: gap1.cut, trimAfter: gap2.cut, from: gap1.cut + gap1.insert},
	{trimBefore: gap2.cut, trimAfter: null, from: gap2.cut + gap1.insert + gap2.insert},
];

/** Original voiceover seconds -> output frame */
export const toFrame = (sec: number) => {
	const fr = f(sec);
	return fr + (fr >= gap1.cut ? gap1.insert : 0) + (fr >= gap2.cut ? gap2.insert : 0);
};

export type TimedWord = {w: string; frame: number; end: number};

export const norm = (s: string) => s.replace(/["،.:؟…,!]/g, '');

export const lineWords = (line: number, phrase: number | null = null): TimedWord[] =>
	phrasesOf(line)
		.filter((_, i) => phrase === null || i === phrase)
		.flatMap((p) => p.words.map((w) => ({w: w.w, frame: toFrame(w.start), end: toFrame(w.end)})));

export const wordAt = (line: number, text: string, nth = 0) => {
	const match = lineWords(line).filter((w) => norm(w.w) === norm(text))[nth];
	if (!match) {
		throw new Error(`Word "${text}" not found in line ${line}`);
	}

	return match.frame;
};

export const lineStart = (line: number) => lineWords(line)[0].frame;
export const lineEnd = (line: number) => lineWords(line).at(-1)!.end;

// Scene boundaries: every scene starts on the first word of its line
export const S = {
	s01: 0,
	s02: lineStart(2),
	s03: lineStart(3),
	s04: lineStart(4),
	s05: lineStart(5),
	s06: lineStart(6),
	s07: lineStart(7),
	s08: lineStart(8),
	s09: lineStart(9),
	s10: lineStart(10),
	s11: lineStart(11),
	s12: lineStart(12),
	s13: lineStart(13),
};

// Countdowns are locked to the two silences
export const COUNT1 = lineEnd(5);
export const COUNT2 = lineEnd(9);

// Short tail after the last word belongs to the end card (≤1s past the voiceover)
export const END_CARD = lineEnd(13) + 8;
export const VO_END = toFrame(timeline.duration);
export const DURATION = VO_END + 24;
