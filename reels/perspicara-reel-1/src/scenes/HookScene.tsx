import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {GRADIENT, SAFE, SHADOW} from '../config';
import {Grad, Headline} from '../components/Headline';

const CHIPS = [
	{x: 130, y: 470, delay: 10, size: 90, rot: -12},
	{x: 840, y: 400, delay: 16, size: 110, rot: 10},
	{x: 860, y: 1060, delay: 22, size: 84, rot: -6},
	{x: 150, y: 1120, delay: 28, size: 100, rot: 8},
];

export const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				padding: `${SAFE.top}px ${SAFE.side}px ${SAFE.bottom + 340}px`,
			}}
		>
			{CHIPS.map((c, i) => {
				const p = spring({frame: frame - c.delay, fps, config: {damping: 12, stiffness: 200}});
				const float = Math.sin((frame + i * 20) / 18) * 12;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: c.x - c.size / 2,
							top: c.y - c.size / 2 + float,
							width: c.size,
							height: c.size,
							borderRadius: 28,
							backgroundColor: 'white',
							boxShadow: SHADOW,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: c.size * 0.55,
							fontWeight: 800,
							opacity: interpolate(p, [0, 0.4], [0, 0.9], {extrapolateRight: 'clamp'}),
							transform: `scale(${p}) rotate(${c.rot}deg)`,
						}}
					>
						<span
							style={{
								backgroundImage: GRADIENT,
								WebkitBackgroundClip: 'text',
								color: 'transparent',
							}}
						>
							?
						</span>
					</div>
				);
			})}
			<Headline
				fast
				size={108}
				stagger={7}
				lines={[
					'The same',
					'questions.',
					<Grad key="g">All day long.</Grad>,
				]}
			/>
			<div
				style={{
					marginTop: 40,
					height: 10,
					borderRadius: 10,
					background: GRADIENT,
					width: interpolate(frame, [22, 40], [0, 420], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			/>
		</AbsoluteFill>
	);
};
