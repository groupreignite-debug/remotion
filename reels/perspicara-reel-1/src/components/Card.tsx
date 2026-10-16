import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, GRADIENT, SHADOW} from '../config';

export const Card: React.FC<{
	children: React.ReactNode;
	style?: React.CSSProperties;
	delay?: number;
}> = ({children, style, delay = 0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - delay, fps, config: {damping: 20, stiffness: 160}});
	return (
		<div
			style={{
				backgroundColor: COLORS.bg,
				borderRadius: 32,
				boxShadow: SHADOW,
				border: '1px solid rgba(46, 107, 255, 0.08)',
				overflow: 'hidden',
				opacity: interpolate(p, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}),
				transform: `translateY(${(1 - p) * 60}px) scale(${0.96 + p * 0.04})`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

// Phone-style chat header used by both chat scenes.
export const ChatHeader: React.FC<{
	title: string;
	subtitle: string;
	avatar: React.ReactNode;
	right?: React.ReactNode;
}> = ({title, subtitle, avatar, right}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: 24,
			padding: '32px 36px',
			borderBottom: `2px solid ${COLORS.bgSoft}`,
		}}
	>
		<div
			style={{
				width: 84,
				height: 84,
				borderRadius: 26,
				background: GRADIENT,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'white',
				fontWeight: 800,
				fontSize: 34,
				flexShrink: 0,
			}}
		>
			{avatar}
		</div>
		<div style={{flex: 1}}>
			<div style={{fontSize: 40, fontWeight: 700, color: COLORS.navy}}>{title}</div>
			<div style={{fontSize: 30, fontWeight: 500, color: COLORS.slate, marginTop: 4}}>
				{subtitle}
			</div>
		</div>
		{right}
	</div>
);
