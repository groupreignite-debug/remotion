import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C} from '../theme';
import {typedCount, typingFrames, wordAt} from '../timing';
import {clamp, Flare, glowShadow, ignite, Label, ResultCard, SearchBar, Sfx, sp, TypingTicks} from '../ui';

export const QUERY = 'طبيب أسنان بالأشرفية';

export const RESULTS = [
	{title: 'Smile Dental Clinic', url: 'smiledental.lb › ashrafieh'},
	{title: 'Ashrafieh Dental Care', url: 'adcare.lb'},
	{title: 'Beirut Bright Teeth', url: 'brightteeth.lb › clinics'},
];

export const RESULT_Y = 720;
export const RESULT_GAP = 196;

// The hook: frame 0 is already mid-typing.
export const Scene01: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const typedEnd = r(wordAt(1, 'يدوّر')) + 6;
	// Negative start: about 9 characters are already typed on frame 0.
	const frames = typingFrames(QUERY, -14, typedEnd, 'hook');
	const enter = typedEnd + 4;
	const comp = r(wordAt(1, 'منافسك'));
	const why = r(wordAt(1, 'ليش'));
	const press = interpolate(frame, [enter, enter + 2, enter + 6], [0, 1, 0], clamp);

	const lock = sp(frame, fps, comp, 14);
	const sink = sp(frame, fps, comp, 18);
	const q = sp(frame, fps, why - 3, 9);

	return (
		<AbsoluteFill>
			<SearchBar
				shown={QUERY.slice(0, typedCount(frames, frame))}
				lastType={frames.filter((f) => f <= frame).pop() ?? -100}
				x={100}
				y={520}
				w={880}
				press={press}
			/>
			{RESULTS.map((res, i) => {
				const p = sp(frame, fps, enter + 3 + i * 4, 15);
				const isTop = i === 0;
				return (
					<ResultCard
						key={res.title}
						title={res.title}
						url={res.url}
						lines={2}
						rank={isTop && lock > 0.5 ? '#1' : null}
						outline={isTop ? lock : 0}
						style={{
							top: RESULT_Y + i * RESULT_GAP,
							transform: `translateY(${(1 - p) * 260}px) scale(${isTop ? 1 + 0.03 * lock : 1})`,
							opacity: Math.min(1, p * 1.5) * (isTop ? 1 : 1 - 0.35 * lock),
						}}
					/>
				);
			})}
			{/* "موقعك" ghost card sinks off the bottom of the results */}
			{(() => {
				const p = sp(frame, fps, enter + 15, 15);
				return (
					<ResultCard
						title="موقعك"
						url="yourwebsite.com"
						lines={1}
						dim
						style={{
							top: RESULT_Y + 3 * RESULT_GAP,
							transform: `translateY(${(1 - p) * 260 + sink * 420}px)`,
							opacity: Math.min(1, p * 1.5) * (1 - 0.65 * sink),
							filter: `blur(${sink * 3}px)`,
						}}
					/>
				);
			})()}
			<Label text="#1 Competitor" at={comp + 2} style={{right: 100, top: RESULT_Y - 46}} />
			<Label text="Not found" at={comp + 8} color={C.dim} style={{left: 100, top: 1560}} />
			<Flare x={540} y={RESULT_Y + 85} at={comp} size={900} />
			<TypingTicks frames={frames.filter((f) => f >= 0)} seed="hook" />
			<Sfx at={enter} name="tick1" volume={0.25} />
			<Sfx at={enter + 3} name="whoosh" volume={0.18} />
			<Sfx at={comp} name="ignite" volume={0.22} />
			<Sfx at={why} name="pop" volume={0.2} />
			{/* Big accent question mark */}
			<div
				style={{
					position: 'absolute',
					right: 120,
					top: 980,
					fontFamily: ARABIC,
					fontWeight: 700,
					fontSize: 420,
					lineHeight: 1,
					color: C.accent,
					transform: `translateY(${(1 - q) * -160}px) scale(${0.6 + 0.4 * q}) rotate(${(1 - q) * 12}deg)`,
					opacity: frame < why - 3 ? 0 : Math.min(1, q * 2),
					textShadow: glowShadow(0.6 + ignite(frame, why + 2, false)),
				}}
			>
				؟
			</div>
		</AbsoluteFill>
	);
};
