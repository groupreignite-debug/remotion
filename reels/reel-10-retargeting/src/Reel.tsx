import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile} from 'remotion';
import './fonts';
import {Background, Grain} from './components/Background';
import {Captions} from './components/Captions';
import {SceneShell, Transition} from './components/SceneShell';
import {S01Hook} from './scenes/S01Hook';
import {S02Follow} from './scenes/S02Follow';
import {S03NotChance} from './scenes/S03NotChance';
import {S04Name} from './scenes/S04Name';
import {S05Definition} from './scenes/S05Definition';
import {S06Shop} from './scenes/S06Shop';
import {S07Salesperson} from './scenes/S07Salesperson';
import {S08Pixel} from './scenes/S08Pixel';
import {S09Why} from './scenes/S09Why';
import {S10Spam, spamPops} from './scenes/S10Spam';
import {S11Segments} from './scenes/S11Segments';
import {S12Stop} from './scenes/S12Stop';
import {S13Payoff} from './scenes/S13Payoff';
import {EndCard, S14Cta} from './scenes/S14Cta';
import {DURATION, lineEnd, lineStart, ws} from './theme';

type SceneDef = {component: React.FC; enter: Transition};

// One scene per script line. `enter` is the transition INTO that scene;
// the only hard cut is into line 03 ("صدفة؟ لأ.").
const SCENES: SceneDef[] = [
	{component: S01Hook, enter: 'cut'},
	{component: S02Follow, enter: 'whip'},
	{component: S03NotChance, enter: 'cut'},
	{component: S04Name, enter: 'zoom'},
	{component: S05Definition, enter: 'zoom'},
	{component: S06Shop, enter: 'wipe'},
	{component: S07Salesperson, enter: 'fade'},
	{component: S08Pixel, enter: 'fade'},
	{component: S09Why, enter: 'whip'},
	{component: S10Spam, enter: 'zoom'},
	{component: S11Segments, enter: 'wipe'},
	{component: S12Stop, enter: 'zoom'},
	{component: S13Payoff, enter: 'wipe'},
	{component: S14Cta, enter: 'whip'},
];

export const END_CARD_AT = 1744;

const sfx: {at: number; src: string; volume: number}[] = [
	{at: ws(1, 5), src: 'tap', volume: 0.35},
	{at: ws(1, 7), src: 'whoosh', volume: 0.16},
	...[ws(2, 3), ws(2, 6), ws(2, 8), ws(2, 9), ws(2, 10)].map((at) => ({at, src: 'pop', volume: 0.28})),
	{at: ws(3, 1), src: 'impact', volume: 0.38},
	{at: ws(8, 2), src: 'pop', volume: 0.25},
	{at: ws(8, 9), src: 'pop', volume: 0.22},
	{at: ws(8, 11), src: 'pop', volume: 0.22},
	...spamPops().map((at, i) => ({at, src: 'pop', volume: 0.12 + Math.min(0.1, i * 0.008)})),
	{at: ws(11, 4), src: 'pop', volume: 0.25},
	{at: ws(11, 11), src: 'pop', volume: 0.25},
	{at: ws(12, 1), src: 'ding', volume: 0.22},
	{at: ws(12, 3), src: 'tap', volume: 0.35},
	{at: ws(14, 6) - 4, src: 'tap', volume: 0.35},
	{at: END_CARD_AT - 6, src: 'whoosh', volume: 0.16},
	// whooshes on every soft transition
	...SCENES.map((s, i) => ({s, n: i + 1}))
		.filter(({s, n}) => n > 1 && s.enter !== 'cut')
		.map(({n}) => ({at: lineStart(n) - 7, src: 'whoosh', volume: 0.14})),
];

export const Reel: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#050507'}}>
			<Background />
			{SCENES.map((s, i) => {
				const n = i + 1;
				const next = SCENES[i + 1];
				const Comp = s.component;
				return (
					<SceneShell
						key={n}
						id={`s${n}`}
						from={lineStart(n)}
						to={n === SCENES.length ? DURATION : lineEnd(n)}
						enter={s.enter}
						exit={next ? next.enter : 'cut'}
					>
						<Comp />
					</SceneShell>
				);
			})}
			<EndCard at={END_CARD_AT} />
			<Captions hidden={[[lineStart(3), lineStart(4)], [END_CARD_AT - 4, DURATION]]} />
			<Grain />
			<Html5Audio src={staticFile('voiceover.m4a')} />
			{sfx.map((s, i) => (
				<Sequence key={i} from={Math.max(0, s.at)} durationInFrames={45} layout="none">
					<Html5Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
