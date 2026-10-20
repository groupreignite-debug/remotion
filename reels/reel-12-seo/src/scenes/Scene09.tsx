import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER} from '../theme';
import {wordAt} from '../timing';
import {Badge, clamp, Label, Sfx, sp} from '../ui';

const MAP = {x: 90, y: 760, w: 900, h: 760};

// Simple street network inside the map frame.
const STREETS = [
	'M 0 180 C 220 160 420 230 900 200',
	'M 0 470 C 300 440 520 520 900 480',
	'M 0 650 L 900 610',
	'M 160 0 C 180 260 120 480 200 760',
	'M 470 0 C 430 300 520 500 480 760',
	'M 760 0 L 720 760',
	'M 0 330 L 470 380',
	'M 480 330 C 600 300 700 360 900 340',
	'M 200 560 L 480 600',
];

const PIN = {x: 480 + 6, y: 470};

export const Scene09: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const profile = r(wordAt(9, 'Google'));
	const map = r(wordAt(9, 'عالخريطة'));

	const frameIn = sp(frame, fps, -2, 17);
	const drift = interpolate(frame, [0, 140], [0, -30], clamp);
	const pin = sp(frame, fps, map - 4, 9);
	const card = sp(frame, fps, map + 6, 14);

	return (
		<AbsoluteFill>
			<Badge text="02" at={2} x={80} y={600} />
			<Label text="Tip" at={6} color={C.dim} style={{left: 222, top: 642}} />
			<div
				style={{
					position: 'absolute',
					left: MAP.x,
					top: MAP.y,
					width: MAP.w,
					height: MAP.h,
					borderRadius: 34,
					overflow: 'hidden',
					background: '#121110',
					border: '2px solid rgba(242,238,230,0.2)',
					transform: `translateY(${(1 - frameIn) * 120}px)`,
					opacity: frameIn,
				}}
			>
				<svg width={MAP.w} height={MAP.h} style={{position: 'absolute', left: 0, top: drift, transform: `scale(1.08)`}}>
					{/* blocks */}
					{Array.from({length: 18}).map((_, i) => (
						<rect
							key={i}
							x={random(`bx${i}`) * 820}
							y={random(`by${i}`) * 700}
							width={50 + random(`bw${i}`) * 90}
							height={40 + random(`bh${i}`) * 70}
							rx={8}
							fill="rgba(242,238,230,0.03)"
							opacity={interpolate(frame, [10 + i, 22 + i], [0, 1], clamp)}
						/>
					))}
					{STREETS.map((d, i) => {
						const p = sp(frame, fps, 2 + i * 3, 18, 24);
						return <path key={i} d={d} stroke="#3A3734" strokeWidth={i < 6 ? 14 : 8} fill="none" strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - p)} />;
					})}
					{/* Ripples */}
					{[0, 8, 16].map((d) => {
						const t = frame - map - d;
						if (t < 0 || t > 40) {
							return null;
						}
						return <circle key={d} cx={PIN.x} cy={PIN.y} r={10 + t * 5} fill="none" stroke={C.accent} strokeWidth={3} opacity={1 - t / 40} />;
					})}
				</svg>
				{/* Pin */}
				<svg
					width={90}
					height={120}
					viewBox="0 0 60 80"
					style={{
						position: 'absolute',
						left: PIN.x - 45,
						top: PIN.y - 120 + drift,
						transform: `translateY(${(1 - pin) * -500}px) scaleY(${frame >= map - 4 ? 1 + 0.12 * Math.sin(Math.min(1, pin) * Math.PI) : 1})`,
						transformOrigin: '50% 100%',
						opacity: frame < map - 4 ? 0 : 1,
						filter: 'drop-shadow(0 0 24px rgba(255,90,31,0.8))',
					}}
				>
					<path d="M30 78 C30 78 4 46 4 28 A26 26 0 0 1 56 28 C56 46 30 78 30 78 Z" fill={C.accent} />
					<circle cx="30" cy="28" r="10" fill="#121110" />
				</svg>
				{/* Business card */}
				<div
					style={{
						position: 'absolute',
						left: PIN.x + 60,
						top: PIN.y - 200 + drift,
						width: 320,
						borderRadius: 20,
						background: C.cardHi,
						border: `2px solid ${C.accent}`,
						padding: '20px 24px',
						fontFamily: INTER,
						transform: `scale(${card}) translateY(${(1 - card) * 20}px)`,
						transformOrigin: '0% 100%',
						opacity: Math.min(1, card * 2),
					}}
				>
					<div style={{fontWeight: 700, fontSize: 30, color: C.text}}>Your Business</div>
					<div style={{display: 'flex', gap: 6, marginTop: 10}}>
						{[0, 1, 2, 3, 4].map((i) => (
							<svg key={i} width={26} height={26} viewBox="0 0 24 24" style={{opacity: interpolate(frame, [map + 10 + i * 2, map + 14 + i * 2], [0, 1], clamp)}}>
								<path d="M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9 Z" fill="none" stroke={C.accent} strokeWidth={1.8} strokeLinejoin="round" />
							</svg>
						))}
					</div>
					<div style={{marginTop: 10, fontSize: 24, fontWeight: 600, color: C.accent}}>Open</div>
				</div>
			</div>
			<Label text="Business profile" at={profile} color={C.dim} style={{right: MAP.x, top: MAP.y - 50}} />
			<Label text="Google Maps" at={map + 8} style={{right: MAP.x, top: MAP.y + MAP.h + 30}} />
			<Sfx at={0} name="whoosh" volume={0.15} />
			<Sfx at={2} name="pop" volume={0.18} />
			<Sfx at={map} name="chime" volume={0.28} />
		</AbsoluteFill>
	);
};
