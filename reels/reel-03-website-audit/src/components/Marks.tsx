import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SNAPPY} from '../brand';

/** Red-orange X (fail) or accent tick (pass) that pops in at `at` (local frame) */
export const Mark: React.FC<{type: 'x' | 'tick'; at: number; size: number}> = ({type, at, size}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - at, fps, config: SNAPPY});
	const draw = spring({frame: frame - at - 1, fps, config: {damping: 18, stiffness: 200}});
	if (frame < at) {
		return null;
	}

	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `scale(${0.4 + 0.6 * p}) rotate(${(1 - p) * -25}deg)`, overflow: 'visible', filter: 'drop-shadow(0 0 10px rgba(255,90,31,0.6))'}}>
			{type === 'x' ? (
				<>
					<path d="M22 22 L78 78" stroke={C.accent} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, draw * 2)} />
					<path d="M78 22 L22 78" stroke={C.accent} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, Math.min(1, draw * 2 - 1))} />
				</>
			) : (
				<>
					<circle cx={50} cy={50} r={46} fill={C.accent} opacity={p} />
					<path d="M28 52 L44 67 L73 35" stroke={C.bg} fill="none" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
				</>
			)}
		</svg>
	);
};
