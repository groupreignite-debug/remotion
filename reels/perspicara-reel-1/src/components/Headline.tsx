import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, GRADIENT} from '../config';

// Slide up + fade in + scale 0.96 → 1, settles in ~12–15 frames.
export const useEntrance = (delay: number, fast = false): React.CSSProperties => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({
		frame: frame - delay,
		fps,
		config: fast
			? {damping: 18, stiffness: 260, mass: 0.6}
			: {damping: 20, stiffness: 180, mass: 0.7},
		durationInFrames: fast ? 12 : 15,
	});
	return {
		opacity: interpolate(p, [0, 0.6], [0, 1], {extrapolateRight: 'clamp'}),
		transform: `translateY(${(1 - p) * 50}px) scale(${0.96 + p * 0.04})`,
	};
};

export const Grad: React.FC<{children: React.ReactNode}> = ({children}) => (
	<span
		style={{
			backgroundImage: GRADIENT,
			WebkitBackgroundClip: 'text',
			backgroundClip: 'text',
			color: 'transparent',
			// avoid clipping descenders/italics of the gradient text
			paddingBottom: '0.08em',
		}}
	>
		{children}
	</span>
);

export const Headline: React.FC<{
	lines: React.ReactNode[];
	delay?: number;
	stagger?: number;
	size?: number;
	fast?: boolean;
}> = ({lines, delay = 0, stagger = 6, size = 100, fast = false}) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
				gap: size * 0.08,
			}}
		>
			{lines.map((line, i) => (
				<HeadlineLine key={i} delay={delay + i * stagger} size={size} fast={fast}>
					{line}
				</HeadlineLine>
			))}
		</div>
	);
};

const HeadlineLine: React.FC<{
	children: React.ReactNode;
	delay: number;
	size: number;
	fast: boolean;
}> = ({children, delay, size, fast}) => {
	const style = useEntrance(delay, fast);
	return (
		<div
			style={{
				...style,
				fontSize: size,
				fontWeight: 800,
				lineHeight: 1.08,
				letterSpacing: '-0.03em',
				color: COLORS.navy,
			}}
		>
			{children}
		</div>
	);
};

export const SubText: React.FC<{children: React.ReactNode; delay: number}> = ({
	children,
	delay,
}) => {
	const style = useEntrance(delay);
	return (
		<div
			style={{
				...style,
				fontSize: 56,
				fontWeight: 500,
				color: COLORS.slate,
				textAlign: 'center',
				lineHeight: 1.25,
			}}
		>
			{children}
		</div>
	);
};
