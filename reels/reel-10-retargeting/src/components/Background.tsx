import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, H, W} from '../theme';

const DUST = new Array(26).fill(true).map((_, i) => ({
	x: random(`dx${i}`) * W,
	y: random(`dy${i}`) * H,
	r: 2 + random(`dr${i}`) * 5,
	speed: 0.15 + random(`ds${i}`) * 0.5,
	phase: random(`dp${i}`) * Math.PI * 2,
}));

/** Dark gradient with a slowly drifting ember light blob and parallax dust. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const bx = 540 + Math.sin(t * 0.35) * 260;
	const by = 700 + Math.cos(t * 0.27) * 380;
	const b2x = 300 + Math.cos(t * 0.22 + 1) * 220;
	const b2y = 1500 + Math.sin(t * 0.31) * 220;

	return (
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${C.bg0} 0%, ${C.bg1} 55%, ${C.bg0} 100%)`}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(620px 620px at ${bx}px ${by}px, rgba(255,106,26,0.20), rgba(255,106,26,0) 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(520px 520px at ${b2x}px ${b2y}px, rgba(255,165,31,0.09), rgba(255,165,31,0) 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
				}}
			/>
			<svg width={W} height={H} style={{position: 'absolute'}}>
				{DUST.map((d, i) => {
					const y = (((d.y - frame * d.speed * 2) % H) + H) % H;
					const x = d.x + Math.sin(t * 0.6 + d.phase) * 18;
					const o = 0.1 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.3 + d.phase));
					return <circle key={i} cx={x} cy={y} r={d.r} fill={C.emberHot} opacity={o} style={{filter: 'blur(2px)'}} />;
				})}
			</svg>
		</AbsoluteFill>
	);
};

/** Subtle film grain, ~3% opacity, re-seeded every frame. */
export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.06, mixBlendMode: 'overlay'}}>
			<svg width={W} height={H}>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width={W} height={H} filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};
