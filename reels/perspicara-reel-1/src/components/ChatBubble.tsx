import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, GRADIENT} from '../config';

export const ChatBubble: React.FC<{
	text: string;
	at: number;
	side: 'customer' | 'ai';
	meta?: React.ReactNode;
	fontSize?: number;
	faded?: boolean;
}> = ({text, at, side, meta, fontSize = 46, faded = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at) {
		return null;
	}
	const p = spring({
		frame: frame - at,
		fps,
		config: {damping: 14, stiffness: 220, mass: 0.6},
	});
	const isAi = side === 'ai';

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: isAi ? 'flex-end' : 'flex-start',
				opacity: interpolate(p, [0, 0.4], [0, faded ? 0.55 : 1], {
					extrapolateRight: 'clamp',
				}),
				transform: `scale(${0.6 + p * 0.4})`,
				transformOrigin: isAi ? 'bottom right' : 'bottom left',
			}}
		>
			<div
				style={{
					maxWidth: 680,
					padding: `${fontSize * 0.5}px ${fontSize * 0.7}px`,
					fontSize,
					fontWeight: 500,
					lineHeight: 1.25,
					borderRadius: 32,
					borderBottomLeftRadius: isAi ? 32 : 10,
					borderBottomRightRadius: isAi ? 10 : 32,
					background: isAi ? GRADIENT : COLORS.bgSoft,
					color: isAi ? 'white' : COLORS.navy,
					boxShadow: isAi
						? '0 14px 30px -12px rgba(46, 107, 255, 0.55)'
						: '0 6px 16px -8px rgba(11, 16, 51, 0.12)',
					border: isAi ? 'none' : '1px solid rgba(11, 16, 51, 0.05)',
				}}
			>
				{text}
			</div>
			{meta ? (
				<div
					style={{
						marginTop: 10,
						fontSize: 26,
						fontWeight: 600,
						color: COLORS.slate,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
					}}
				>
					{meta}
				</div>
			) : null}
		</div>
	);
};
