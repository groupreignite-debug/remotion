import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, SNAPPY, SOFT} from '../brand';
import {Chip} from './Phone';

/**
 * Accent outline box drawn on, with a leader line out to a label chip.
 * Lives in phone screen space (880 wide). `at` is local.
 */
export const Callout: React.FC<{
	box: {x: number; y: number; w: number; h: number};
	at: number;
	label: string;
	labelAt: {x: number; y: number};
	scale: number;
}> = ({box, at, label, labelAt, scale}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < at - 2) {
		return null;
	}

	const draw = spring({frame: frame - at + 2, fps, config: SOFT, durationInFrames: 14});
	const pop = spring({frame: frame - at, fps, config: SNAPPY});
	const line = spring({frame: frame - at - 4, fps, config: SOFT});
	const chipP = spring({frame: frame - at - 8, fps, config: SNAPPY});
	const pad = 10;
	// leader line starts from the box edge closest to the label
	const sx = labelAt.x < box.x ? box.x - pad : labelAt.x > box.x + box.w ? box.x + box.w + pad : box.x + box.w / 2;
	const sy = labelAt.y < box.y ? box.y - pad : labelAt.y > box.y + box.h ? box.y + box.h + pad : box.y + box.h / 2;
	const sw = 6 / Math.min(1, scale * 1.6);

	return (
		<>
			<svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={880} height={1585}>
				<rect
					x={box.x - pad}
					y={box.y - pad}
					width={box.w + pad * 2}
					height={box.h + pad * 2}
					rx={18}
					fill="rgba(255,90,31,0.07)"
					stroke={C.accent}
					strokeWidth={sw}
					pathLength={1}
					strokeDasharray="1 1"
					strokeDashoffset={1 - draw}
					style={{filter: 'drop-shadow(0 0 14px rgba(255,90,31,0.9))', transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px`, transform: `scale(${1.06 - 0.06 * pop})`}}
				/>
				<line x1={sx} y1={sy} x2={sx + (labelAt.x - sx) * line} y2={sy + (labelAt.y - sy) * line} stroke={C.accent} strokeWidth={sw * 0.7} />
				<circle cx={sx} cy={sy} r={sw * 1.4} fill={C.accent} opacity={line} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: labelAt.x,
					top: labelAt.y,
					transform: `translate(-50%, -50%) scale(${(chipP * 0.9) / scale})`,
					opacity: chipP,
				}}
			>
				<Chip text={label} size={22} />
			</div>
		</>
	);
};
