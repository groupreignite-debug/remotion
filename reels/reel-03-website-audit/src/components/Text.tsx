import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {ARABIC, C, glow, SNAPPY, SOFT} from '../brand';
import {norm, TimedWord} from '../timing';

const LEAD = 6; // reveal starts this many frames early so the word lands on its spoken frame

export const ignite = (frame: number, at: number) =>
	interpolate(frame - at, [0, 3, 9], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** One kinetic word: rises out of a mask with blur 8px -> 0, lands on `at` (local frame). */
export const Word: React.FC<{
	text: string;
	at: number;
	size: number;
	accent: boolean;
	font?: string;
	weight?: number;
	color?: string;
	style?: React.CSSProperties;
}> = ({text, at, size, accent, font = ARABIC, weight = 700, color = C.text, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - (at - LEAD), fps, config: SNAPPY});
	const g = accent ? ignite(frame, at) : 0;
	const lit = accent && frame >= at;
	return (
		<span
			style={{
				display: 'inline-block',
				overflow: 'hidden',
				padding: '0.18em 0.08em 0.12em',
				margin: '-0.18em -0.08em -0.12em',
				verticalAlign: 'bottom',
				...style,
			}}
		>
			<span
				style={{
					display: 'inline-block',
					fontFamily: font,
					fontWeight: weight,
					fontSize: size,
					lineHeight: 1.25,
					color: lit ? C.accent : color,
					transform: `translateY(${(1 - p) * 105}%) scale(${1 + 0.07 * g})`,
					filter: `blur(${(1 - p) * 8}px)`,
					opacity: frame < at - LEAD ? 0 : 1,
					textShadow: glow(g),
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</span>
		</span>
	);
};

/** A spoken line, word for word, RTL. `from` = absolute frame the parent Sequence starts on. */
export const Headline: React.FC<{
	words: TimedWord[];
	from: number;
	top: number;
	size: number;
	accent: string[];
	exitAt: number | null;
	width?: number;
	gap?: number;
}> = ({words, from, top, size, accent, exitAt, width = 960, gap = 0.28}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ex = exitAt === null ? 0 : spring({frame: frame - (exitAt - from), fps, config: SOFT, durationInFrames: 12});
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left: (1080 - width) / 2,
				width,
				direction: 'rtl',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				columnGap: size * gap,
				rowGap: size * 0.1,
				transform: `translateY(${-40 * ex}px)`,
				opacity: 1 - ex,
				filter: `blur(${ex * 10}px)`,
			}}
		>
			{words.map((w, i) => (
				<Word key={i} text={w.w} at={w.frame - from} size={size} accent={accent.map(norm).includes(norm(w.w))} />
			))}
		</div>
	);
};
