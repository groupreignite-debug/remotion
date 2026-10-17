import React from 'react';
import {useCurrentFrame} from 'remotion';
import {LINES, TimedWord} from '../timing';
import {C, clamp01, FONT, sec, sp} from '../theme';

type Chunk = {words: TimedWord[]; from: number; to: number};

const PUNCT = /[،.؟:…"!]$/;

// Split each script line into short caption pages (≤4 words, breaking on punctuation).
const CHUNKS: Chunk[] = (() => {
	const pages: TimedWord[][] = [];
	for (const line of LINES) {
		let page: TimedWord[] = [];
		for (const w of line.words) {
			page.push(w);
			if (page.length >= 4 || (PUNCT.test(w.text) && page.length >= 2)) {
				pages.push(page);
				page = [];
			}
		}
		if (page.length) {
			pages.push(page);
		}
	}
	return pages.map((words, i) => {
		const next = pages[i + 1];
		const lastEnd = sec(words[words.length - 1].end);
		const to = next ? Math.min(sec(next[0].start), lastEnd + 18) : lastEnd + 15;
		return {words, from: sec(words[0].start) - 2, to};
	});
})();

/** Burned-in, word-highlighted captions in the lower-middle safe zone. */
export const Captions: React.FC<{hidden: [number, number][]}> = ({hidden}) => {
	const frame = useCurrentFrame();
	if (hidden.some(([a, b]) => frame >= a && frame < b)) {
		return null;
	}
	const chunk = CHUNKS.find((c) => frame >= c.from && frame < c.to);
	if (!chunk) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				top: 1290,
				left: 70,
				right: 150,
				height: 220,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					direction: 'rtl',
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: 22,
					rowGap: 0,
					fontFamily: FONT,
					fontWeight: 800,
					fontSize: 66,
					lineHeight: 1.35,
					textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)',
				}}
			>
				{chunk.words.map((w, i) => {
					const start = sec(w.start);
					const next = chunk.words[i + 1];
					const active = frame >= start && frame < (next ? sec(next.start) : sec(w.end) + 8);
					const spoken = frame >= start;
					const p = sp(frame, chunk.from + i * 2, {damping: 15, stiffness: 200});
					const pop = sp(frame, start, {damping: 10, stiffness: 220});
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								color: active ? C.ember : spoken ? C.white : 'rgba(255,255,255,0.5)',
								opacity: clamp01(p),
								transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + 0.1 * p + (active ? 0.08 * clamp01(pop) : 0)})`,
								filter: `blur(${Math.max(0, 1 - p) * 6}px)`,
								textShadow: active
									? '0 0 24px rgba(255,106,26,0.55), 0 4px 20px rgba(0,0,0,0.95)'
									: undefined,
							}}
						>
							{w.text}
						</span>
					);
				})}
			</div>
		</div>
	);
};
