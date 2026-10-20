import {random} from 'remotion';
import ts from '../vo/timestamps.json';
import {FPS} from './theme';

export type Word = {text: string; start: number; end: number};
export type Line = {text: string; start: number; end: number; words: Word[]};

export const VO_DURATION: number = ts.duration;
const LINES: Line[] = ts.lines;

export const sec = (s: number) => Math.round(s * FPS);

export const line = (n: number) => LINES[n - 1];

// First frame of line n (1-based, matching the script table).
export const lineStart = (n: number) => sec(LINES[n - 1].start);

// Frame on which the word of line n that contains `needle` starts.
export const wordAt = (n: number, needle: string, occurrence = 0) => {
	const matches = LINES[n - 1].words.filter((w) => w.text.includes(needle));
	if (!matches[occurrence]) {
		throw new Error(`No word "${needle}" (#${occurrence}) in line ${n}`);
	}
	return sec(matches[occurrence].start);
};

export const wordEnd = (n: number, needle: string, occurrence = 0) => {
	const matches = LINES[n - 1].words.filter((w) => w.text.includes(needle));
	return sec(matches[occurrence].end);
};

// Frames on which each character of `text` lands, with slightly uneven key timing.
export const typingFrames = (
	text: string,
	start: number,
	end: number,
	seed: string,
): number[] => {
	const weights = [...text].map(
		(ch, i) => (ch === ' ' ? 1.6 : 0.6) + random(`${seed}-${i}`) * 0.9,
	);
	const total = weights.reduce((a, b) => a + b, 0);
	let acc = 0;
	return weights.map((w) => {
		acc += w;
		return Math.round(start + ((end - start) * (acc - w)) / total);
	});
};

export const typedCount = (frames: number[], frame: number) =>
	frames.filter((f) => f <= frame).length;
