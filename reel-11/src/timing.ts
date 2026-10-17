import data from '../vo/timestamps.json';

export const FPS = 30;
export const toFrame = (sec: number) => Math.round(sec * FPS);

export const LINES = data.lines;

// Duration of vo/voiceover.mp3 (ffprobe: 59.951 s).
export const VO_FRAMES = Math.ceil(59.951 * FPS);
export const END_CARD_FRAMES = 30;
export const TOTAL_FRAMES = VO_FRAMES + END_CARD_FRAMES;
// The end card takes over right after the last word is spoken.
export const END_CARD_START = toFrame(LINES[13].end) + 2;

export const lineStart = (line: number) => toFrame(LINES[line - 1].start);
export const lineEnd = (line: number) =>
	line === LINES.length ? END_CARD_START : lineStart(line + 1);
export const wordFrame = (line: number, word: number) =>
	toFrame(LINES[line - 1].words[word].start);
