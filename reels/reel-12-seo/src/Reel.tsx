import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence} from 'remotion';
import vo from '../vo/voiceover.mp3';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';
import {Scene12} from './scenes/Scene12';
import {EndCard, Scene13} from './scenes/Scene13';
import {lineStart, sec, VO_DURATION} from './timing';
import {Background, Camera, Exit, Grain, Headline} from './ui';

export const END_CARD = 30;

// Each scene starts a few frames before its first spoken word so that word
// lands on the frame it is spoken.
const LEAD = 5;

type HeadlineSpec = {accents: number[]; strong?: number[]; mediumFrom?: number};

const HEADLINES: Record<number, HeadlineSpec> = {
	1: {accents: [7], strong: [7]},
	2: {accents: [3, 4, 13], strong: [13], mediumFrom: 5},
	3: {accents: [4], mediumFrom: 4},
	4: {accents: [10], mediumFrom: 8},
	5: {accents: [5, 6], mediumFrom: 7},
	6: {accents: [8, 9, 10], mediumFrom: 4},
	7: {accents: [5, 6, 7]},
	8: {accents: [8], mediumFrom: 3},
	9: {accents: [8], mediumFrom: 3},
	10: {accents: [7, 8], mediumFrom: 5},
	11: {accents: [6, 7, 8]},
	12: {accents: [7], strong: [7]},
	13: {accents: [1], strong: [1], mediumFrom: 3},
};

// Visual scenes; scene 10 spans lines 10 and 11.
const SCENES: {lines: number[]; C: React.FC<{start: number; dur: number}>}[] = [
	{lines: [1], C: Scene01},
	{lines: [2], C: Scene02},
	{lines: [3], C: Scene03},
	{lines: [4], C: Scene04},
	{lines: [5], C: Scene05},
	{lines: [6], C: Scene06},
	{lines: [7], C: Scene07},
	{lines: [8], C: Scene08},
	{lines: [9], C: Scene09},
	{lines: [10, 11], C: Scene10},
	{lines: [12], C: Scene12},
	{lines: [13], C: Scene13},
];

const startOf = (n: number) => (n === 1 ? 0 : lineStart(n) - LEAD);

export const Reel: React.FC = () => {
	const voEnd = sec(VO_DURATION);
	return (
		<AbsoluteFill style={{backgroundColor: '#0D0D0D'}}>
			<Background />
			{SCENES.map(({lines, C: Scene}, i) => {
				const start = startOf(lines[0]);
				const next = SCENES[i + 1];
				const end = next ? startOf(next.lines[0]) : voEnd;
				const dur = end - start;
				return (
					<Sequence key={i} from={start} durationInFrames={dur} name={`Scene ${lines.join('+')}`}>
						<Exit dur={dur}>
							<Camera duration={dur}>
								<Scene start={start} dur={dur} />
							</Camera>
						</Exit>
					</Sequence>
				);
			})}
			{Object.entries(HEADLINES).map(([key, spec]) => {
				const n = Number(key);
				const start = startOf(n);
				const end = n === 13 ? voEnd : startOf(n + 1);
				const dur = end - start;
				return (
					<Sequence key={n} from={start} durationInFrames={dur} name={`Line ${n}`}>
						<Headline n={n} sceneStart={start} accents={spec.accents} strong={spec.strong} mediumFrom={spec.mediumFrom} exitAt={dur - 6} />
					</Sequence>
				);
			})}
			<Sequence from={voEnd} durationInFrames={END_CARD} name="End card">
				<EndCard />
			</Sequence>
			<Html5Audio src={vo} />
			<Grain />
		</AbsoluteFill>
	);
};
