import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Sparks} from '../components/Sparks';
import {C, clamp01, EMBER_GRADIENT, FONT, sp, ws} from '../theme';

/** Line 03 — hard cut to black: "صدفة؟" … "لأ." slams in. */
export const S03NotChance: React.FC = () => {
	const frame = useCurrentFrame();
	const q = ws(3, 0);
	const no = ws(3, 1);
	const pq = sp(frame, q, {damping: 13, stiffness: 220});
	const pn = sp(frame, no, {damping: 12, stiffness: 260, mass: 1.2});
	const hit = frame - no;
	const shake = hit >= 0 && hit < 14 ? (1 - hit / 14) * 22 : 0;
	const sx = (random(`sx${frame}`) - 0.5) * shake;
	const sy = (random(`sy${frame}`) - 0.5) * shake;
	const flash = hit >= 0 && hit < 6 ? 0.22 * (1 - hit / 6) : 0;

	return (
		<AbsoluteFill style={{background: '#000', transform: `translate(${sx}px, ${sy}px)`}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(600px 600px at 540px 980px, rgba(255,106,26,${0.22 * clamp01(pn)}), rgba(0,0,0,0) 70%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 560,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: FONT,
					fontWeight: 900,
					fontSize: 190,
					color: C.white,
					direction: 'rtl',
					opacity: clamp01(pq) * (1 - 0.55 * clamp01(pn)),
					transform: `scale(${(0.9 + 0.1 * pq) * (1 - 0.18 * clamp01(pn))}) translateY(${-60 * clamp01(pn)}px)`,
					filter: `blur(${Math.max(0, 1 - pq) * 8}px)`,
				}}
			>
				صدفة؟
			</div>
			<div
				style={{
					position: 'absolute',
					top: 820,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					opacity: frame >= no ? 1 : 0,
					transform: `scale(${1.7 - 0.7 * pn})`,
					filter: `drop-shadow(0 0 ${40 * clamp01(pn)}px rgba(255,106,26,0.75))`,
				}}
			>
				<span
					style={{
						fontFamily: FONT,
						fontWeight: 900,
						fontSize: 300,
						lineHeight: 1.1,
						direction: 'rtl',
						backgroundImage: EMBER_GRADIENT,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
					}}
				>
					لأ.
				</span>
			</div>
			<Sparks at={no + 2} x={540} y={1000} count={36} spread={1.6} seed="no" />
			<AbsoluteFill style={{background: '#fff', opacity: flash}} />
		</AbsoluteFill>
	);
};
