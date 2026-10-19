import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FIRM, labelStyle, SNAPPY, SOFT} from '../brand';
import {Stopwatch} from '../components/Stopwatch';
import {Headline} from '../components/Text';
import {lineWords, S, wordAt} from '../timing';

// Scene 02 — three beats: browser opens -> ring counts 1–5 fast -> browser snaps shut
export const Idea: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s02;
	const open = wordAt(2, 'بتفتح') - from;
	const count = wordAt(2, 'بتعدّ') - from;
	const close = wordAt(2, 'وبتسكّرو.') - from;

	const o = spring({frame: frame - open + 4, fps, config: SNAPPY});
	const shut = spring({frame: frame - close, fps, config: FIRM});
	const sx = interpolate(shut, [0, 0.5, 1], [1, 1, 0.02], {extrapolateRight: 'clamp'});
	const sy = interpolate(shut, [0, 0.5], [1, 0.012], {extrapolateRight: 'clamp'});
	const flash = interpolate(frame - close, [4, 7, 14], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const per = (close - count) / 5;
	const n = Math.min(5, Math.floor((frame - count) / per) + 1);
	const ringIn = spring({frame: frame - count + 3, fps, config: SNAPPY});
	const winScale = 0.3 + 0.7 * o;
	const beats = [open, count, close];

	return (
		<>
			<Headline words={lineWords(2)} from={from} top={190} size={72} accent={['بسيطة:']} exitAt={null} />
			<div
				style={{
					position: 'absolute',
					left: 540 - 380,
					top: 980 - 280,
					width: 760,
					height: 560,
					transform: `scale(${winScale * sx}, ${winScale * sy}) translateY(${Math.sin(frame / 18) * 6}px)`,
					opacity: frame < open - 4 ? 0.5 : 1,
					borderRadius: 30,
					border: `3px solid ${C.accent}`,
					background: 'rgba(20,18,17,0.92)',
					boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 50px rgba(255,90,31,0.18)',
					overflow: 'hidden',
				}}
			>
				<div style={{height: 70, borderBottom: '2px solid rgba(255,90,31,0.4)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 26px'}}>
					{[0, 1, 2].map((i) => (
						<div key={i} style={{width: 18, height: 18, borderRadius: 9, background: i === 0 ? C.accent : 'rgba(242,238,230,0.25)'}} />
					))}
					<div style={{flex: 1, height: 34, marginLeft: 20, borderRadius: 17, background: 'rgba(242,238,230,0.08)'}} />
				</div>
				<div style={{padding: 40}}>
					{[0.9, 0.6, 0.75, 0.4].map((wd, i) => (
						<div
							key={i}
							style={{
								height: i === 0 ? 120 : 26,
								width: `${wd * 100 * interpolate(o, [0.3 + i * 0.1, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}%`,
								borderRadius: 12,
								background: i === 0 ? 'rgba(255,90,31,0.18)' : 'rgba(242,238,230,0.12)',
								marginBottom: 26,
							}}
						/>
					))}
					<div style={{width: 200, height: 58, borderRadius: 29, border: `2px solid rgba(255,90,31,0.5)`}} />
				</div>
			</div>
			{frame >= close + 8 ? (
				<div
					style={{
						position: 'absolute',
						left: 540 - 14,
						top: 980 - 14,
						width: 28,
						height: 28,
						borderRadius: 14,
						background: C.accent,
						transform: `scale(${spring({frame: frame - close - 8, fps, config: SNAPPY}) * (1 + 0.25 * Math.sin((frame - close) / 3))})`,
						boxShadow: '0 0 40px 10px rgba(255,90,31,0.6)',
					}}
				/>
			) : null}
			<div style={{position: 'absolute', left: 540 - 400, right: 540 - 400, top: 978, height: 4, background: C.accent, opacity: flash, boxShadow: `0 0 ${40 * flash}px ${C.accent}`}} />
			{frame >= count - 3 && frame < close + 6 ? (
				<div style={{position: 'absolute', left: 540 - 150, top: 980 - 160, transform: `scale(${ringIn * (1 - shut * 0.6)})`, opacity: 1 - shut}}>
					<Stopwatch size={300} sweep={Math.min(1, (frame - count) / (close - count))} text={String(Math.max(1, n))} pulse={ignitePulse(frame - count, per)} />
				</div>
			) : null}
			<div style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 36}}>
				{['OPEN', 'COUNT', 'CLOSE'].map((t, i) => {
					const on = spring({frame: frame - beats[i], fps, config: SOFT});
					return (
						<div
							key={t}
							style={{
								...labelStyle(22),
								padding: '14px 26px',
								borderRadius: 40,
								border: `2px solid ${on > 0.5 ? C.accent : 'rgba(255,90,31,0.25)'}`,
								color: on > 0.5 ? C.bg : 'rgba(255,90,31,0.45)',
								background: `rgba(255,90,31,${on})`,
								transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, on) * Math.PI)})`,
							}}
						>
							{`0${i + 1} ${t}`}
						</div>
					);
				})}
			</div>
		</>
	);
};

const ignitePulse = (t: number, per: number) => {
	if (t < 0) {
		return 0;
	}

	const local = t % per;
	return Math.max(0, 1 - local / per);
};
