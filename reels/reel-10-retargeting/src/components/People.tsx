import React from 'react';
import {C} from '../theme';

const SKIN = '#E9B48C';
const HAIR = '#2a1c16';

/**
 * Flat-illustrated person. (x, y) is the point between the feet.
 * `walk` drives the gait (pass frame-based phase, 0 when standing),
 * `wave` (0..1) raises the right arm.
 */
export const Person: React.FC<{
	x: number;
	y: number;
	height?: number;
	walk?: number;
	facing?: 1 | -1;
	shirt?: string;
	jacket?: number;
	apron?: boolean;
	wave?: number;
	waveT?: number;
	opacity?: number;
	style?: React.CSSProperties;
}> = ({x, y, height = 380, walk = 0, facing = 1, shirt = '#5b6b82', jacket = 0, apron = false, wave = 0, waveT = 0, opacity = 1, style}) => {
	const s = height / 230;
	const swing = Math.sin(walk) * 26;
	const bob = Math.abs(Math.cos(walk)) * 3 * (walk === 0 ? 0 : 1);
	const armR = -swing - wave * (150 + Math.sin(waveT * 0.6) * 18);
	return (
		<svg
			width={110 * s}
			height={240 * s}
			viewBox="-5 -10 110 240"
			style={{
				position: 'absolute',
				left: x - 55 * s,
				top: y - 230 * s,
				transform: `scaleX(${facing})`,
				opacity,
				overflow: 'visible',
				...style,
			}}
		>
			<ellipse cx="50" cy="228" rx="34" ry="6" fill="#000" opacity="0.35" />
			<g transform={`translate(0 ${-bob})`}>
				{/* legs */}
				<g transform={`rotate(${swing} 44 128)`}>
					<rect x="37" y="126" width="15" height="88" rx="7" fill="#26262e" />
					<rect x="33" y="206" width="24" height="12" rx="6" fill="#111" />
				</g>
				<g transform={`rotate(${-swing} 56 128)`}>
					<rect x="48" y="126" width="15" height="88" rx="7" fill="#2e2e37" />
					<rect x="45" y="206" width="24" height="12" rx="6" fill="#111" />
				</g>
				{/* back arm */}
				<g transform={`rotate(${swing} 34 62)`}>
					<rect x="26" y="56" width="14" height="66" rx="7" fill={jacket > 0.5 ? '#B9430E' : shirt} style={{filter: 'brightness(0.8)'}} />
					<circle cx="33" cy="122" r="7" fill={SKIN} />
				</g>
				{/* torso */}
				<rect x="28" y="52" width="44" height="82" rx="16" fill={shirt} />
				{jacket > 0 ? (
					<g opacity={jacket}>
						<rect x="26" y="52" width="48" height="84" rx="16" fill="#EC6A1F" />
						<rect x="26" y="124" width="48" height="12" rx="5" fill="#2A1A12" />
						<line x1="50" y1="56" x2="50" y2="134" stroke="#7A2A08" strokeWidth="3" />
						<path d="M36 52 Q50 62 64 52" stroke="#2A1A12" strokeWidth="6" fill="none" />
					</g>
				) : null}
				{apron ? (
					<g>
						<path d="M34 70 L66 70 L68 134 L32 134 Z" fill={C.ember} />
						<path d="M34 70 L40 54 M66 70 L60 54" stroke={C.ember} strokeWidth="3" />
						<rect x="40" y="84" width="20" height="8" rx="3" fill="#fff" opacity="0.9" />
					</g>
				) : null}
				{/* front arm */}
				<g transform={`rotate(${armR} 66 62)`}>
					<rect x="60" y="56" width="14" height="66" rx="7" fill={jacket > 0.5 ? '#D85A17' : shirt} />
					<circle cx="67" cy="122" r="7.5" fill={SKIN} />
				</g>
				{/* head */}
				<rect x="44" y="38" width="12" height="16" rx="5" fill={SKIN} />
				<circle cx="50" cy="26" r="20" fill={SKIN} />
				<path d="M30 24 Q31 3 51 4 Q71 5 70 22 Q62 13 50 15 Q38 16 30 24 Z" fill={HAIR} />
				<circle cx="58" cy="27" r="2.4" fill="#2a1c16" />
				<path d="M56 36 Q61 39 65 35" stroke="#7a3d26" strokeWidth="2" fill="none" strokeLinecap="round" />
			</g>
		</svg>
	);
};

/** Simple user glyph for the audience diagram. */
export const UserGlyph: React.FC<{size: number; color: string; glow?: number}> = ({size, color, glow = 0}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 40 40"
		style={{filter: glow > 0 ? `drop-shadow(0 0 ${10 * glow}px rgba(255,106,26,${0.9 * glow}))` : undefined}}
	>
		<circle cx="20" cy="13" r="8" fill={color} />
		<path d="M5 37 Q5 23 20 23 Q35 23 35 37 Z" fill={color} />
	</svg>
);
