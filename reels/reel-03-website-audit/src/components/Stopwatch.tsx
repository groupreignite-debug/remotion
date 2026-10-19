import {C, INTER} from '../brand';

/** Accent stopwatch ring. `sweep` = 0..1 of the current lap. */
export const Stopwatch: React.FC<{size: number; sweep: number; text: string | null; textSize?: number; pulse?: number}> = ({size, sweep, text, textSize, pulse = 0}) => {
	const r = 42;
	const angle = sweep * 360;
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
				<rect x={45} y={-4} width={10} height={7} rx={2} fill={C.accent} />
				<rect x={47.5} y={2} width={5} height={5} fill={C.accent} />
				<circle cx={50} cy={53} r={r} fill="rgba(13,13,13,0.85)" stroke="rgba(255,90,31,0.22)" strokeWidth={4} />
				{new Array(60).fill(true).map((_, i) => {
					const a = (i / 60) * Math.PI * 2;
					const long = i % 5 === 0;
					return (
						<line
							key={i}
							x1={50 + Math.sin(a) * (r - 4)}
							y1={53 - Math.cos(a) * (r - 4)}
							x2={50 + Math.sin(a) * (r - (long ? 9 : 6))}
							y2={53 - Math.cos(a) * (r - (long ? 9 : 6))}
							stroke={i / 60 <= sweep ? C.accent : 'rgba(242,238,230,0.25)'}
							strokeWidth={long ? 1.4 : 0.7}
						/>
					);
				})}
				<circle
					cx={50}
					cy={53}
					r={r}
					fill="none"
					stroke={C.accent}
					strokeWidth={4 + pulse * 2}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray="1 1"
					strokeDashoffset={1 - sweep}
					transform="rotate(-90 50 53)"
					style={{filter: `drop-shadow(0 0 ${4 + pulse * 6}px rgba(255,90,31,0.9))`}}
				/>
				{text === null ? (
					<g transform={`rotate(${angle} 50 53)`}>
						<line x1={50} y1={56} x2={50} y2={18} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
						<circle cx={50} cy={53} r={3.2} fill={C.accent} />
					</g>
				) : null}
			</svg>
			{text !== null ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						top: size * 0.06,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: INTER,
						fontWeight: 900,
						fontSize: textSize ?? size * 0.42,
						color: C.accent,
						textShadow: `0 0 ${20 + pulse * 30}px rgba(255,90,31,${0.5 + pulse * 0.4})`,
					}}
				>
					{text}
				</div>
			) : null}
		</div>
	);
};
