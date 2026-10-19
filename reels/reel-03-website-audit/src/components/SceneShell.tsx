import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FIRM, SOFT} from '../brand';

export type Transition = 'zoom' | 'wipe' | 'whip' | 'cut';
export const OVERLAP = 10;

/**
 * Wraps a scene: constant slow push-in (1 -> 1.04) plus the enter / exit transition.
 * The parent Sequence should last `dur + OVERLAP` unless exit is 'cut'.
 */
export const SceneShell: React.FC<{
	dur: number;
	enter: Transition;
	exit: Transition;
	children: React.ReactNode;
}> = ({dur, enter, exit, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const push = interpolate(frame, [0, dur], [1, 1.04], {extrapolateRight: 'clamp'});
	const ein = enter === 'cut' ? 1 : spring({frame, fps, config: enter === 'whip' ? FIRM : SOFT, durationInFrames: 16});
	const ex = exit === 'cut' ? 0 : spring({frame: frame - dur, fps, config: FIRM, durationInFrames: OVERLAP});

	let transform = `scale(${push})`;
	let opacity = 1;
	let filter = 'none';
	let clipPath: string | undefined;

	if (enter === 'zoom' && ein < 1) {
		transform = `scale(${push * (0.8 + 0.2 * ein)})`;
		opacity = ein;
		filter = `blur(${(1 - ein) * 16}px)`;
	}

	if (enter === 'whip' && ein < 0.995) {
		transform = `translateX(${(1 - ein) * 1080}px) scale(${push})`;
		filter = ein < 0.92 ? 'url(#whipblur)' : 'none';
	}

	if (enter === 'wipe' && ein < 0.999) {
		clipPath = `circle(${ein * 125}% at 50% 48%)`;
	}

	if (ex > 0) {
		if (exit === 'zoom') {
			transform = `scale(${push * (1 + 0.8 * ex)})`;
			opacity = 1 - ex;
			filter = `blur(${ex * 18}px)`;
		}

		if (exit === 'whip') {
			transform = `translateX(${-ex * 1080}px) scale(${push})`;
			filter = ex < 0.92 ? 'url(#whipblur)' : 'none';
		}

		if (exit === 'wipe') {
			opacity = 1 - ex * 0.6;
		}
	}

	return <AbsoluteFill style={{transform, opacity, filter, clipPath}}>{children}</AbsoluteFill>;
};
