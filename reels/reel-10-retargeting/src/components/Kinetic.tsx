import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, clamp01, EMBER_GRADIENT, FONT, sp} from '../theme';

/**
 * Word-by-word kinetic typography (RTL). `at` is either the frame the first
 * word enters (others follow every `stagger` frames) or one frame per word
 * (to land each word on its spoken timestamp). Words listed in `highlight`
 * scale up in the ember accent.
 */
export const Kinetic: React.FC<{
	text: string;
	at: number | number[];
	size: number;
	stagger?: number;
	weight?: number;
	highlight?: string[];
	color?: string;
	lineHeight?: number;
	style?: React.CSSProperties;
}> = ({text, at, size, stagger = 3, weight = 800, highlight = [], color = C.white, lineHeight = 1.25, style}) => {
	const frame = useCurrentFrame();
	const words = text.split(' ');
	return (
		<div
			style={{
				direction: 'rtl',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				columnGap: size * 0.34,
				fontFamily: FONT,
				fontWeight: weight,
				fontSize: size,
				lineHeight,
				color,
				textAlign: 'center',
				...style,
			}}
		>
			{words.map((w, i) => {
				const start = Array.isArray(at) ? at[Math.min(i, at.length - 1)] : at + i * stagger;
				const p = sp(frame, start, {damping: 13, stiffness: 170});
				const hot = highlight.some((h) => w.includes(h));
				const pop = hot ? sp(frame, start + 4, {damping: 9, stiffness: 180}) : 0;
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: clamp01(p),
							transform: `translateY(${(1 - p) * size * 0.45}px) scale(${0.9 + 0.1 * p + 0.08 * pop})`,
							filter: `blur(${Math.max(0, 1 - p) * 8}px)${hot ? ` drop-shadow(0 0 ${18 * clamp01(pop)}px rgba(255,106,26,0.7))` : ''}`,
						}}
					>
						{hot ? (
							<span
								style={{
									backgroundImage: EMBER_GRADIENT,
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									color: 'transparent',
								}}
							>
								{w}
							</span>
						) : (
							w
						)}
					</span>
				);
			})}
		</div>
	);
};
