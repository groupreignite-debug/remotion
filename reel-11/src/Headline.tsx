import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {draw, sp} from './primitives';
import {C, FONT_AR} from './theme';
import {LINES, lineEnd, lineStart, wordFrame} from './timing';

// Per script line: accent word indices, the index where the second (56px Medium)
// line starts, and words a scene renders itself instead of the headline.
const CONFIG: Record<number, {accent: number[]; brk?: number; skip?: number[]; hidden?: boolean}> = {
	1: {accent: [5, 6], brk: 3},
	2: {accent: [4]},
	3: {accent: [9], brk: 5},
	4: {accent: [1, 2], brk: 3},
	5: {accent: [4, 5, 10, 11], brk: 6},
	6: {accent: [7], brk: 7},
	7: {accent: [6, 10, 11], brk: 4},
	8: {accent: [7], brk: 5},
	9: {accent: [], skip: [0, 1]},
	10: {accent: [5]},
	11: {accent: [], hidden: true},
	12: {accent: [12, 13], brk: 7},
	13: {accent: [5], brk: 2},
	14: {accent: [5], brk: 4},
};

// One kinetic word: rises 24px through a mask with blur 8→0, landing on the frame it
// is spoken. Accent words ignite: a 0.3 s ember flare that settles to a soft glow.
export const Word: React.FC<{
	f: number;
	at: number;
	text: string;
	accent: boolean;
	size: number;
	weight: number;
	color?: string;
	flare?: number;
}> = ({f, at, text, accent, size, weight, color = C.text, flare = 1}) => {
	const t = sp(f, at - 4, {stiffness: 180});
	if (t <= 0.001) {
		return <span style={{display: 'inline-block', visibility: 'hidden', fontSize: size, fontWeight: weight}}>{text}</span>;
	}
	const settle = Math.min(1, t);
	const ignite = accent
		? interpolate(f - at, [0, 3, 9], [0, 1, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
		: 0;
	return (
		<span
			style={{
				display: 'inline-block',
				overflow: 'hidden',
				padding: '0.2em 0.06em',
				margin: '-0.2em -0.06em',
			}}
		>
			<span
				style={{
					display: 'inline-block',
					fontSize: size,
					fontWeight: weight,
					color: accent ? C.accent : color,
					transform: `translateY(${(1 - t) * 24}px)`,
					filter: `blur(${(1 - settle) * 8}px)`,
					opacity: Math.min(1, t * 1.4),
					textShadow: accent
						? `0 0 24px rgba(${C.accentRgb}, ${0.4 * (0.5 + ignite) * flare}), 0 0 ${60 * flare}px rgba(255, 170, 90, ${0.55 * ignite * flare})`
						: undefined,
				}}
			>
				{text}
			</span>
		</span>
	);
};

export const Headline: React.FC<{f: number}> = ({f}) => {
	const line = LINES.findIndex((_, i) => f >= lineStart(i + 1) - 6 && f < lineEnd(i + 1)) + 1;
	if (line === 0 || CONFIG[line].hidden) {
		return null;
	}
	const cfg = CONFIG[line];
	// Exit: drift up 20px, blur and fade over 6 frames before the next line lands.
	const exit = draw(f, lineEnd(line) - 8, 6);
	const words = LINES[line - 1].words.map((w, i) => ({...w, i})).filter((w) => !cfg.skip?.includes(w.i));
	const brk = cfg.brk ?? Infinity;
	const row = (ws: typeof words, size: number, weight: number) => (
		<div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.26em', rowGap: 4, justifyContent: 'flex-start'}}>
			{ws.map((w) => (
				<Word
					key={w.i}
					f={f}
					at={wordFrame(line, w.i)}
					text={w.text}
					accent={cfg.accent.includes(w.i)}
					size={size}
					weight={weight}
				/>
			))}
		</div>
	);
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: 260,
					right: 90,
					width: 900,
					direction: 'rtl',
					fontFamily: FONT_AR,
					lineHeight: 1.3,
					transform: `translateY(${-20 * exit}px)`,
					filter: `blur(${8 * exit}px)`,
					opacity: 1 - exit,
				}}
			>
				{row(words.filter((w) => w.i < brk), 70, 700)}
				{brk !== Infinity ? row(words.filter((w) => w.i >= brk), 56, 500) : null}
			</div>
		</AbsoluteFill>
	);
};
