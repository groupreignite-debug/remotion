import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/** Burst of small ember sparks at (x, y), fired at absolute frame `at`. */
export const Sparks: React.FC<{at: number; x: number; y: number; count?: number; spread?: number; seed?: string}> = ({
	at,
	x,
	y,
	count = 18,
	spread = 1,
	seed = 's',
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 34) {
		return null;
	}
	return (
		<svg
			width={800}
			height={800}
			viewBox="-400 -400 800 800"
			style={{position: 'absolute', left: x - 400, top: y - 400, pointerEvents: 'none', overflow: 'visible'}}
		>
			{new Array(count).fill(true).map((_, i) => {
				const a = random(`${seed}a${i}`) * Math.PI * 2;
				const v = (6 + random(`${seed}v${i}`) * 12) * spread;
				const life = 18 + random(`${seed}l${i}`) * 16;
				if (t > life) {
					return null;
				}
				const k = t / life;
				const drag = 1 - Math.exp(-t / 8);
				const px = Math.cos(a) * v * 8 * drag;
				const py = Math.sin(a) * v * 8 * drag + 0.25 * t * t;
				const vx = Math.cos(a) * v * Math.exp(-t / 8);
				const vy = Math.sin(a) * v * Math.exp(-t / 8) + 0.5 * t;
				const len = Math.max(1, Math.hypot(vx, vy));
				const tail = Math.min(26, len * 1.6);
				return (
					<line
						key={i}
						x1={px}
						y1={py}
						x2={px - (vx / len) * tail}
						y2={py - (vy / len) * tail}
						stroke={random(`${seed}c${i}`) > 0.5 ? C.emberHot : C.ember}
						strokeWidth={3.5 * (1 - k) + 1}
						strokeLinecap="round"
						opacity={1 - k}
						style={{filter: 'drop-shadow(0 0 6px rgba(255,140,40,0.9))'}}
					/>
				);
			})}
		</svg>
	);
};
