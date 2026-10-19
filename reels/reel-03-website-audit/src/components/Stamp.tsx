import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FIRM, INTER} from '../brand';
import {Mark} from './Marks';

/** FAIL (dimmed, with red-orange X) or PASS (accent, with tick) stamp slamming in at `at` */
export const Stamp: React.FC<{type: 'fail' | 'pass'; at: number; size: number; rotate: number}> = ({type, at, size, rotate}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 4) {
		return null;
	}

	const p = spring({frame: frame - at + 4, fps, config: FIRM});
	const color = type === 'fail' ? C.dim : C.accent;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: size * 0.18,
				padding: `${size * 0.1}px ${size * 0.3}px`,
				border: `${size * 0.07}px solid ${color}`,
				borderRadius: size * 0.16,
				background: 'rgba(13,13,13,0.82)',
				transform: `scale(${2.4 - 1.4 * p}) rotate(${rotate}deg)`,
				opacity: Math.min(1, p * 2.5),
				boxShadow: type === 'pass' ? '0 0 60px rgba(255,90,31,0.5)' : '0 20px 60px rgba(0,0,0,0.6)',
			}}
		>
			<Mark type={type === 'fail' ? 'x' : 'tick'} at={at} size={size * 0.62} />
			<div style={{fontFamily: INTER, fontWeight: 900, fontSize: size * 0.62, letterSpacing: '0.18em', color: type === 'fail' ? C.dim : C.accent, lineHeight: 1}}>
				{type === 'fail' ? 'FAIL' : 'PASS'}
			</div>
		</div>
	);
};
