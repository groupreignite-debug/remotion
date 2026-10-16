import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Grad, Headline, useEntrance} from '../components/Headline';
import {COLORS, SAFE, SHADOW} from '../config';

export const TimeBackScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const fill = interpolate(frame, [24, 110], [0, 360], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => 1 - Math.pow(1 - t, 3),
	});
	const check = spring({frame: frame - 112, fps, config: {damping: 12, stiffness: 180}});
	const iconIn = useEntrance(14);
	const SIZE = 400;

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				padding: `${SAFE.top + 120}px ${SAFE.side}px 0`,
			}}
		>
			<Headline
				size={100}
				lines={[
					'Your team gets',
					<React.Fragment key="g">
						their <Grad>time back.</Grad>
					</React.Fragment>,
				]}
			/>
			<div
				style={{
					...iconIn,
					marginTop: 80,
					width: SIZE,
					height: SIZE,
					borderRadius: '50%',
					backgroundColor: 'white',
					boxShadow: SHADOW,
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{/* Gradient fill sweeping around the dial */}
				<div
					style={{
						position: 'absolute',
						inset: 26,
						borderRadius: '50%',
						background: `conic-gradient(from 0deg, ${COLORS.primary} 0deg, ${COLORS.electric} ${fill * 0.4}deg, ${COLORS.violet} ${fill}deg, ${COLORS.bgSoft} ${fill}deg)`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						inset: 26,
						borderRadius: '50%',
						border: `6px solid ${COLORS.bgSoft}`,
					}}
				/>
				<div
					style={{
						position: 'relative',
						width: 190,
						height: 190,
						borderRadius: '50%',
						backgroundColor: 'white',
						boxShadow: '0 10px 30px -10px rgba(46,107,255,0.4)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<svg width={110} height={110} viewBox="0 0 110 110" style={{transform: `scale(${check})`}}>
						<path
							d="M24 57 L46 78 L88 32"
							stroke={COLORS.primary}
							strokeWidth={14}
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<div
						style={{
							position: 'absolute',
							fontSize: 34,
							fontWeight: 800,
							color: COLORS.navy,
							opacity: 1 - check,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						+{Math.round((fill / 360) * 5)}h
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
