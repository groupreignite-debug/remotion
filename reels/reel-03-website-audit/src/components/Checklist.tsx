import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C, INTER, labelStyle, SNAPPY, SOFT} from '../brand';
import {Mark} from './Marks';
import {ignite} from './Text';

export const QUESTIONS = [
	{ar: 'شو بيعملوا؟', en: 'WHAT'},
	{ar: 'لمين؟', en: 'WHO'},
	{ar: 'ليش هني؟', en: 'WHY YOU'},
	{ar: 'شو الخطوة الجاية؟', en: 'NEXT STEP'},
	{ar: 'فيني إتّكل عليهن؟', en: 'TRUST'},
];

export type MarkSpec = {type: 'x' | 'tick'; at: number} | null;
export type DockBox = {x: number; y: number; w: number; rowH: number; gap: number};

export const CARDS: DockBox = {x: 100, y: 450, w: 880, rowH: 168, gap: 30};
export const SIDE_DOCK: DockBox = {x: 760, y: 560, w: 300, rowH: 104, gap: 16};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The five questions. Starts as big outline cards, then shrinks (dock 0 -> 1) into a
 * compact checklist that is reused to score both sites. All frames are local.
 */
export const Checklist: React.FC<{
	appear: number[];
	fill: (number | null)[];
	dockAt: number | null;
	dock: DockBox;
	marks: MarkSpec[];
	header: string | null;
	score: {text: string; at: number} | null;
	dim: number;
}> = ({appear, fill, dockAt, dock, marks, header, score, dim}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<div style={{position: 'absolute', inset: 0, opacity: 1 - dim * 0.75}}>
			{header && dockAt !== null ? (
				<div
					style={{
						position: 'absolute',
						left: dock.x,
						top: dock.y - 92,
						width: dock.w,
						textAlign: 'center',
						opacity: spring({frame: frame - dockAt - 8, fps, config: SOFT}),
					}}
				>
					<div style={labelStyle(17)}>{header}</div>
					{score ? (
						<div
							style={{
								fontFamily: INTER,
								fontWeight: 900,
								fontSize: 44,
								color: C.text,
								marginTop: 2,
								transform: `scale(${spring({frame: frame - score.at, fps, config: SNAPPY})})`,
							}}
						>
							{score.text}
						</div>
					) : null}
				</div>
			) : null}
			{QUESTIONS.map((q, i) => {
				const inP = spring({frame: frame - appear[i], fps, config: SNAPPY});
				const d = dockAt === null ? 0 : spring({frame: frame - dockAt - i * 2, fps, config: SOFT});
				const x = mix(CARDS.x, dock.x, d);
				const y = mix(CARDS.y + i * (CARDS.rowH + CARDS.gap), dock.y + i * (dock.rowH + dock.gap), d);
				const w = mix(CARDS.w, dock.w, d);
				const h = mix(CARDS.rowH, dock.rowH, d);
				const num = mix(86, 42, d);
				const textSize = mix(58, 21, d);
				const enSize = mix(20, 12, d);
				const f = fill[i];
				const fillP = f === null ? 0 : spring({frame: frame - (f - 5), fps, config: SNAPPY});
				const g = f === null ? 0 : ignite(frame, f);
				const mark = marks[i];
				const failed = mark && mark.type === 'x' && frame >= mark.at;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: w,
							height: h,
							opacity: inP,
							transform: `translateY(${(1 - inP) * 140}px) scale(${0.9 + 0.1 * inP})`,
							borderRadius: mix(30, 20, d),
							border: `${mix(3, 2, d)}px solid ${failed ? C.dim : C.accent}`,
							background: fillP > 0 ? `rgba(255,90,31,${0.06 * fillP})` : 'rgba(255,255,255,0.015)',
							boxShadow: g > 0 ? `0 0 ${40 * g}px rgba(255,90,31,${0.5 * g})` : 'none',
							direction: 'rtl',
							display: 'flex',
							alignItems: 'center',
							padding: `0 ${mix(30, 12, d)}px`,
							gap: mix(28, 8, d),
							boxSizing: 'border-box',
						}}
					>
						<div
							style={{
								width: num,
								height: num,
								flexShrink: 0,
								borderRadius: '50%',
								border: `${mix(3, 2, d)}px solid ${failed ? C.dim : C.accent}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: INTER,
								fontWeight: 800,
								fontSize: num * 0.46,
								color: failed ? C.dim : C.accent,
							}}
						>
							{i + 1}
						</div>
						<div style={{flex: 1, minWidth: 0, overflow: 'hidden'}}>
							<div
								style={{
									fontFamily: ARABIC,
									fontWeight: 700,
									fontSize: textSize,
									lineHeight: 1.25,
									color: failed ? C.dim : C.text,
									whiteSpace: 'nowrap',
									transform: `translateY(${(1 - fillP) * 100}%)`,
									filter: `blur(${(1 - fillP) * 8}px)`,
									opacity: f === null || frame < f - 5 ? 0 : 1,
									textShadow: g > 0 ? `0 0 ${24 * g}px rgba(255,90,31,${0.8 * g})` : 'none',
								}}
							>
								{q.ar}
							</div>
							<div style={{...labelStyle(enSize), direction: 'ltr', textAlign: 'right', marginTop: mix(6, 1, d), opacity: interpolate(fillP, [0.4, 1], [0, 1], {extrapolateLeft: 'clamp'}), color: failed ? C.dim : C.accent}}>
								{q.en}
							</div>
						</div>
						<div style={{width: mix(0, 34, d), flexShrink: 0, display: 'flex', justifyContent: 'center'}}>
							{mark && d > 0.5 ? <Mark type={mark.type} at={mark.at} size={34} /> : null}
						</div>
					</div>
				);
			})}
		</div>
	);
};
