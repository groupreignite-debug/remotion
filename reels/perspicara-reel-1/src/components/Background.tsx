import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../config';

const BLOBS = [
	{color: COLORS.lavender, size: 900, x: -200, y: 120, speed: 0.011, phase: 0, opacity: 0.15},
	{color: COLORS.electric, size: 760, x: 520, y: 640, speed: 0.009, phase: 2, opacity: 0.11},
	{color: COLORS.lavender, size: 820, x: 300, y: 1320, speed: 0.013, phase: 4, opacity: 0.13},
	{color: COLORS.electric, size: 600, x: -160, y: 1180, speed: 0.008, phase: 1, opacity: 0.1},
];

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / 30;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, overflow: 'hidden'}}>
			{BLOBS.map((b, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: b.x + Math.sin(frame * b.speed + b.phase) * 90,
						top: b.y + Math.cos(frame * b.speed * 0.8 + b.phase) * 70,
						width: b.size,
						height: b.size,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
						opacity: b.opacity,
						filter: 'blur(40px)',
					}}
				/>
			))}
			{/* Faint ribbon echoing the logo's "P" curve */}
			<svg
				width={1080}
				height={1920}
				viewBox="0 0 1080 1920"
				style={{position: 'absolute', inset: 0, opacity: 0.09}}
			>
				<defs>
					<linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={COLORS.primary} />
						<stop offset="100%" stopColor={COLORS.violet} />
					</linearGradient>
				</defs>
				<path
					d={`M -100 ${1500 + Math.sin(t * 0.5) * 40}
              C 300 ${1180 + Math.sin(t * 0.7) * 60}, 760 ${1700 + Math.cos(t * 0.6) * 60}, 1200 ${1260 + Math.sin(t * 0.4) * 50}`}
					stroke="url(#ribbon)"
					strokeWidth={70}
					fill="none"
					strokeLinecap="round"
				/>
				<path
					d={`M -100 ${420 + Math.cos(t * 0.45) * 40}
              C 380 ${200 + Math.cos(t * 0.6) * 50}, 700 ${640 + Math.sin(t * 0.5) * 50}, 1200 ${300 + Math.cos(t * 0.35) * 40}`}
					stroke="url(#ribbon)"
					strokeWidth={34}
					fill="none"
					strokeLinecap="round"
					opacity={0.7}
				/>
			</svg>
		</AbsoluteFill>
	);
};
