import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Kinetic} from '../components/Kinetic';
import {Sparks} from '../components/Sparks';
import {C, clamp01, EMBER_GRADIENT, FONT, sp, ws} from '../theme';

const WORD = 'Retargeting';

/** Line 04 — "Retargeting" revealed big and centred, subtitle "شو يعني؟". */
export const S04Name: React.FC = () => {
	const frame = useCurrentFrame();
	const at = ws(4, 2);
	const rings = sp(frame, ws(4, 0), {damping: 20, stiffness: 60});
	const line = sp(frame, at + 8, {damping: 18, stiffness: 90});
	const sub = sp(frame, at + 14, {damping: 14});
	const t = frame / 30;

	return (
		<AbsoluteFill>
			{/* target rings behind the word */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{[160, 270, 380, 490].map((r, i) => (
					<circle
						key={r}
						cx={540}
						cy={800}
						r={r * (0.7 + 0.3 * rings)}
						fill="none"
						stroke={i === 0 ? C.ember : 'rgba(255,255,255,0.12)'}
						strokeWidth={i === 0 ? 3 : 2}
						strokeDasharray={i % 2 ? '6 14' : undefined}
						opacity={clamp01(rings) * (i === 0 ? 0.5 : 1)}
						transform={`rotate(${t * (i % 2 ? 12 : -8)} 540 800)`}
					/>
				))}
				<g opacity={clamp01(rings) * 0.5} stroke="rgba(255,255,255,0.3)" strokeWidth="2">
					<line x1={540} y1={250} x2={540} y2={340} />
					<line x1={540} y1={1260} x2={540} y2={1350} />
					<line x1={20} y1={800} x2={110} y2={800} />
					<line x1={970} y1={800} x2={1060} y2={800} />
				</g>
			</svg>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0}}>
				<Kinetic text="هيدا اسمو" at={[ws(4, 0), ws(4, 1)]} size={64} weight={700} color={C.dim} />
			</div>
			<div
				style={{
					position: 'absolute',
					top: 690,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					direction: 'ltr',
					fontFamily: FONT,
					fontWeight: 900,
					fontSize: 172,
					letterSpacing: -4,
					filter: `drop-shadow(0 0 ${26 * clamp01(line)}px rgba(255,106,26,0.55))`,
				}}
			>
				{WORD.split('').map((ch, i) => {
					const p = sp(frame, at + i * 1.2, {damping: 14, stiffness: 190});
					return (
						<span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: 10}}>
							<span
								style={{
									display: 'inline-block',
									transform: `translateY(${(1 - p) * 110}%)`,
									filter: `blur(${Math.max(0, 1 - p) * 8}px)`,
									backgroundImage: i < 2 ? EMBER_GRADIENT : 'linear-gradient(180deg, #fff, #f1e6dd)',
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent',
								}}
							>
								{ch}
							</span>
						</span>
					);
				})}
			</div>
			<div
				style={{
					position: 'absolute',
					top: 965,
					left: '50%',
					width: 700,
					height: 8,
					marginLeft: -350,
					borderRadius: 4,
					background: EMBER_GRADIENT,
					transform: `scaleX(${clamp01(line)})`,
					boxShadow: '0 0 24px rgba(255,106,26,0.8)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 1010,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: FONT,
					fontWeight: 800,
					fontSize: 76,
					color: C.white,
					direction: 'rtl',
					opacity: clamp01(sub),
					transform: `translateY(${(1 - sub) * 30}px) scale(${0.9 + 0.1 * sub})`,
					filter: `blur(${Math.max(0, 1 - sub) * 8}px)`,
				}}
			>
				شو يعني؟
			</div>
			<Sparks at={at + 6} x={540} y={820} count={14} spread={1.1} seed="rt" />
		</AbsoluteFill>
	);
};
