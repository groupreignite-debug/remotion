import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Grad, useEntrance} from '../components/Headline';
import {COLORS, SAFE, SHADOW} from '../config';

const Clock: React.FC = () => {
	const frame = useCurrentFrame();
	// Angular speed grows over time, so the hands spin faster and faster.
	const minute = 2 * frame + 0.09 * frame * frame;
	const hour = minute / 12;
	const pop = useEntrance(0, true);
	return (
		<div
			style={{
				...pop,
				width: 250,
				height: 250,
				borderRadius: '50%',
				backgroundColor: 'white',
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<svg width={220} height={220} viewBox="0 0 220 220">
				<defs>
					<linearGradient id="clockGrad" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor={COLORS.primary} />
						<stop offset="100%" stopColor={COLORS.violet} />
					</linearGradient>
				</defs>
				<circle cx={110} cy={110} r={96} fill="none" stroke="url(#clockGrad)" strokeWidth={12} />
				{Array.from({length: 12}).map((_, i) => (
					<line
						key={i}
						x1={110}
						y1={28}
						x2={110}
						y2={i % 3 === 0 ? 44 : 38}
						stroke={COLORS.lavender}
						strokeWidth={i % 3 === 0 ? 6 : 4}
						strokeLinecap="round"
						transform={`rotate(${i * 30} 110 110)`}
					/>
				))}
				<line
					x1={110}
					y1={110}
					x2={110}
					y2={64}
					stroke={COLORS.navy}
					strokeWidth={10}
					strokeLinecap="round"
					transform={`rotate(${hour} 110 110)`}
				/>
				<line
					x1={110}
					y1={110}
					x2={110}
					y2={42}
					stroke="url(#clockGrad)"
					strokeWidth={8}
					strokeLinecap="round"
					transform={`rotate(${minute} 110 110)`}
				/>
				<circle cx={110} cy={110} r={10} fill={COLORS.navy} />
			</svg>
		</div>
	);
};

const Arrow: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame, [delay, delay + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<svg width={80} height={110} viewBox="0 0 80 110" style={{margin: '6px 0'}}>
			<defs>
				<linearGradient id={`arrow${delay}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={COLORS.primary} />
					<stop offset="100%" stopColor={COLORS.violet} />
				</linearGradient>
			</defs>
			<path
				d="M40 6 L40 92 M14 68 L40 96 L66 68"
				stroke={`url(#arrow${delay})`}
				strokeWidth={12}
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - draw}
			/>
		</svg>
	);
};

const Step: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
	const style = useEntrance(delay);
	return (
		<div
			style={{
				...style,
				fontSize: 104,
				fontWeight: 800,
				letterSpacing: '-0.03em',
				color: COLORS.navy,
				lineHeight: 1.1,
			}}
		>
			{children}
		</div>
	);
};

export const TimeScene: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				padding: `${SAFE.top + 60}px ${SAFE.side}px 0`,
			}}
		>
			<Clock />
			<div
				style={{
					marginTop: 60,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Step delay={10}>1 minute</Step>
				<Arrow delay={32} />
				<Step delay={42}>1 hour</Step>
				<Arrow delay={70} />
				<Step delay={80}>
					<Grad>every week</Grad>
				</Step>
			</div>
		</AbsoluteFill>
	);
};
