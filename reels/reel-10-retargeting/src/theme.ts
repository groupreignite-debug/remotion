import type React from 'react';
import {Easing, interpolate, spring} from 'remotion';
import {LINES} from './timing';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
// Voiceover is 59.23s → 1777 frames, rounded up so the audio is never cut.
export const DURATION = 1778;

export const C = {
	bg0: '#050507',
	bg1: '#140d09',
	ember: '#FF6A1A',
	emberHot: '#FFA51F',
	emberDeep: '#E23B0B',
	white: '#FFFFFF',
	dim: 'rgba(255,255,255,0.55)',
	faint: 'rgba(255,255,255,0.18)',
	glass: 'rgba(255,255,255,0.07)',
	glassBorder: 'rgba(255,255,255,0.14)',
	red: '#FF3B4E',
	green: '#2BD67B',
};

export const EMBER_GRADIENT = `linear-gradient(160deg, ${C.emberHot} 0%, ${C.ember} 55%, ${C.emberDeep} 100%)`;
export const FONT = "Cairo, 'Noto Color Emoji', sans-serif";

export const sec = (s: number) => Math.round(s * FPS);

/** Absolute frame at which word `i` of script line `line` starts being spoken. */
export const ws = (line: number, i: number) => sec(LINES[line - 1].words[i].start);
export const we = (line: number, i: number) => sec(LINES[line - 1].words[i].end);

/** Scene n starts at the first spoken word of line n (line 1 starts at frame 0). */
export const lineStart = (n: number) => (n === 1 ? 0 : ws(n, 0));
export const lineEnd = (n: number) => (n === LINES.length ? DURATION : lineStart(n + 1));

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const sp = (
	frame: number,
	at: number,
	config: Partial<{damping: number; stiffness: number; mass: number}> = {},
) =>
	spring({
		frame: frame - at,
		fps: FPS,
		config: {damping: 14, stiffness: 150, mass: 1, ...config},
	});

/** Layered entrance: scale 0.9→1, opacity, blur 8px→0. */
export const enterStyle = (p: number, blur = 8): React.CSSProperties => ({
	opacity: clamp01(p),
	transform: `scale(${0.9 + 0.1 * p})`,
	filter: `blur(${Math.max(0, 1 - p) * blur}px)`,
});

export const smooth = Easing.bezier(0.45, 0, 0.55, 1);

export const ramp = (frame: number, from: number, to: number, a = 0, b = 1) =>
	interpolate(frame, [from, to], [a, b], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: smooth,
	});
