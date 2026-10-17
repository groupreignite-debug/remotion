import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame} from 'remotion';
import {clamp01, FPS, ramp, W} from '../theme';

export type Transition = 'cut' | 'zoom' | 'whip' | 'wipe' | 'fade';

const PAD = 6;

const progress = (frame: number, start: number) =>
	spring({
		frame: frame - start,
		fps: FPS,
		config: {damping: 18, stiffness: 120, mass: 0.9},
		durationInFrames: PAD * 2,
	});

/**
 * Mounts a scene between `from` and `to` (absolute frames), handles the
 * transition in and out, and applies a slow continuous push-in (1 → 1.05).
 */
export const SceneShell: React.FC<{
	id: string;
	from: number;
	to: number;
	enter: Transition;
	exit: Transition;
	children: React.ReactNode;
}> = ({id, from, to, enter, exit, children}) => {
	const frame = useCurrentFrame();
	const start = enter === 'cut' ? from : from - PAD;
	const end = exit === 'cut' ? to : to + PAD;
	if (frame < start || frame >= end) {
		return null;
	}

	const pIn = enter === 'cut' ? 1 : progress(frame, start);
	const pOut = exit === 'cut' || exit === 'wipe' ? 0 : progress(frame, to - PAD);
	const push = 1 + 0.05 * ramp(frame, from, to);

	let scale = push;
	let x = 0;
	let opacity = 1;
	let blur = 0;
	let whipBlur = 0;
	let clipPath: string | undefined;

	if (enter === 'zoom') {
		scale *= 0.8 + 0.2 * pIn;
		opacity *= clamp01(pIn);
		blur += (1 - clamp01(pIn)) * 14;
	} else if (enter === 'whip') {
		x -= (1 - pIn) * W;
		whipBlur += Math.sin(Math.PI * clamp01(pIn)) * 60;
	} else if (enter === 'wipe') {
		clipPath = `circle(${clamp01(pIn) * 125}% at 50% 42%)`;
	} else if (enter === 'fade') {
		opacity *= clamp01(pIn);
	}

	if (exit === 'zoom') {
		scale *= 1 + 0.6 * pOut;
		opacity *= 1 - clamp01(pOut);
		blur += clamp01(pOut) * 14;
	} else if (exit === 'whip') {
		x += pOut * W;
		whipBlur += Math.sin(Math.PI * clamp01(pOut)) * 60;
	} else if (exit === 'fade') {
		opacity *= 1 - clamp01(pOut);
	}

	const filters = [blur > 0.05 ? `blur(${blur}px)` : '', whipBlur > 0.5 ? `url(#whip-${id})` : '']
		.filter(Boolean)
		.join(' ');

	return (
		<AbsoluteFill
			style={{
				transform: `translateX(${x}px) scale(${scale})`,
				opacity,
				filter: filters || undefined,
				clipPath,
			}}
		>
			<svg width={0} height={0} style={{position: 'absolute'}}>
				<filter id={`whip-${id}`} x="-20%" y="0" width="140%" height="100%">
					<feGaussianBlur stdDeviation={`${whipBlur} 0`} />
				</filter>
			</svg>
			{children}
		</AbsoluteFill>
	);
};
