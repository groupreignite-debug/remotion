import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {labelStyle, SNAPPY} from '../brand';
import {Stopwatch} from '../components/Stopwatch';
import {COUNTDOWN_FRAMES, FPS} from '../timing';

/** Big accent 1 -> 5, one number per second, locked to the silence starting at local frame `at` */
export const CountdownNumber: React.FC<{at: number; site: string}> = ({at, site}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame - at;
	if (t < 0 || t >= COUNTDOWN_FRAMES) {
		return null;
	}

	const n = Math.floor(t / FPS) + 1;
	const pop = spring({frame: t % FPS, fps, config: SNAPPY});
	const pulse = Math.max(0, 1 - (t % FPS) / 12);
	const inP = spring({frame: t, fps, config: SNAPPY});
	return (
		<>
			<div style={{position: 'absolute', left: 540 - 150, top: 118, transform: `scale(${inP})`}}>
				<div style={{transform: `scale(${1.25 - 0.25 * pop})`}}>
					<Stopwatch size={300} sweep={(t + 1) / COUNTDOWN_FRAMES} text={String(n)} textSize={150} pulse={pulse} />
				</div>
			</div>
			<div style={{position: 'absolute', top: 438, left: 0, right: 0, textAlign: 'center', opacity: inP, ...labelStyle(22)}}>
				{`${site} · 5-SECOND TEST`}
			</div>
		</>
	);
};
