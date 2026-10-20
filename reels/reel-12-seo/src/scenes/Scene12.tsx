import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C} from '../theme';
import {wordAt} from '../timing';
import {clamp, Flare, glowShadow, ignite, Label, ResultCard, SearchBar, Sfx, sp} from '../ui';
import {QUERY, RESULT_GAP, RESULT_Y, RESULTS} from './Scene01';

// Callback to the hook: same results page, but "موقعك" takes the #1 spot.
export const Scene12: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const must = r(wordAt(12, 'لازم'));
	const found = r(wordAt(12, 'بينلاقى'));

	const back = sp(frame, fps, -3, 16);
	const climb = sp(frame, fps, must, 15);
	const lock = sp(frame, fps, found - 2, 12);
	const big = sp(frame, fps, found - 3, 11);
	const g = ignite(frame, found + 2, true);

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', inset: 0, opacity: back, transform: `scale(${0.94 + 0.06 * back})`}}>
				<SearchBar shown={QUERY} lastType={-100} x={100} y={520} w={880} focus={0.4} />
				{RESULTS.map((res, i) => {
					const yy = RESULT_Y + i * RESULT_GAP + climb * RESULT_GAP;
					return (
						<ResultCard
							key={res.title}
							title={res.title}
							url={res.url}
							lines={2}
							rank={`#${i + 1 + (climb > 0.5 ? 1 : 0)}`}
							style={{top: yy, opacity: i === 2 ? 1 - climb : 0.85}}
						/>
					);
				})}
				<ResultCard
					title="موقعك"
					url="yourwebsite.com"
					lines={2}
					rank={climb > 0.5 ? '#1' : null}
					outline={lock}
					style={{
						top: interpolate(climb, [0, 1], [RESULT_Y + 4 * RESULT_GAP, RESULT_Y]),
						transform: `scale(${1 + 0.04 * lock})`,
						zIndex: 3,
						opacity: interpolate(climb, [0, 0.2], [0.4, 1], clamp),
					}}
				/>
			</div>
			<Label text="Found" at={found + 4} style={{right: 100, top: RESULT_Y - 46}} />
			<Flare x={540} y={RESULT_Y + 85} at={found} size={1100} strong />
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 1330,
					textAlign: 'center',
					direction: 'rtl',
					fontFamily: ARABIC,
					fontWeight: 700,
					fontSize: 170,
					lineHeight: 1.2,
					color: C.accent,
					opacity: frame < found - 3 ? 0 : Math.min(1, big * 1.5),
					transform: `translateY(${(1 - big) * 60}px) scale(${0.7 + 0.3 * big})`,
					filter: `blur(${(1 - Math.min(1, big)) * 8}px)`,
					textShadow: glowShadow(0.5 + g),
				}}
			>
				بينلاقى
			</div>
			<Sfx at={0} name="whoosh" volume={0.16} />
			<Sfx at={must} name="whoosh" volume={0.18} />
			<Sfx at={found} name="ignite" volume={0.32} />
		</AbsoluteFill>
	);
};
