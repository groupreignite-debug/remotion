import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Caption, COLORS, SAFE, SHADOW} from '../config';
import {Grad} from './Headline';

const MAX_WORDS = 5;

// Burned-in captions: short phrase pages, current word in the brand gradient.
export const Captions: React.FC<{captions: Caption[]}> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ms = (frame / fps) * 1000;

	const pages = useMemo(() => {
		const result: Caption[][] = [];
		let current: Caption[] = [];
		captions.forEach((c, i) => {
			current.push(c);
			const next = captions[i + 1];
			const endsSentence = /[.?!,]$/.test(c.text.trim());
			const gap = next ? next.startMs - c.endMs > 400 : true;
			if (current.length >= MAX_WORDS || endsSentence || gap) {
				result.push(current);
				current = [];
			}
		});
		return result;
	}, [captions]);

	const pageIndex = pages.findIndex(
		(p, i) =>
			ms >= p[0].startMs &&
			ms < Math.min(p[p.length - 1].endMs + 500, pages[i + 1]?.[0].startMs ?? Infinity),
	);
	if (pageIndex === -1) {
		return null;
	}
	const page = pages[pageIndex];
	const pageStartFrame = Math.round((page[0].startMs / 1000) * fps);
	const p = spring({
		frame: frame - pageStartFrame,
		fps,
		config: {damping: 18, stiffness: 260, mass: 0.5},
		durationInFrames: 8,
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: SAFE.bottom + 20,
				paddingLeft: SAFE.side,
				paddingRight: SAFE.side,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					backgroundColor: 'white',
					borderRadius: 32,
					boxShadow: SHADOW,
					padding: '22px 38px',
					fontSize: 48,
					fontWeight: 700,
					lineHeight: 1.3,
					color: COLORS.navy,
					textAlign: 'center',
					maxWidth: 1080 - SAFE.side * 2,
					opacity: interpolate(p, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}),
					transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + p * 0.04})`,
				}}
			>
				{page.map((word, i) => {
					const active = ms >= word.startMs && ms < word.endMs;
					return (
						<React.Fragment key={i}>
							{i > 0 ? ' ' : null}
							{active ? <Grad>{word.text.trim()}</Grad> : word.text.trim()}
						</React.Fragment>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
