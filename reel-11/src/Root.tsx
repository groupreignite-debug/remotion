import React from 'react';
import {AbsoluteFill, Composition, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Background, Grain, Header} from './Chrome';
import {Headline} from './Headline';
import {draw, fadeIn, mix} from './primitives';
import {Checklist, Cta, EndCard, Generic, Interrupt, Keep, Secret} from './scenes/Closing';
import {Hook} from './scenes/Hook';
import {McDonalds} from './scenes/McDonalds';
import {Apple, Nike} from './scenes/NikeApple';
import {Mercedes, Target} from './scenes/TargetMercedes';
import {CX, CY, H, W} from './theme';
import {END_CARD_START, FPS, LINES, TOTAL_FRAMES, lineEnd, lineStart, wordFrame} from './timing';

// Slow push-in (1 → 1.04) per scene, settling back over the first frames of the next.
const camera = (f: number) => {
	const idx = LINES.findIndex((_, i) => f < lineEnd(i + 1));
	const line = idx === -1 ? LINES.length : idx + 1;
	const s = lineStart(line);
	const e = lineEnd(line);
	const target = 1 + 0.04 * Math.min(1, Math.max(0, (f - s) / (e - s)));
	return line === 1 || line === 11 ? target : mix(1.04, target, draw(f, s, 14));
};

const SHAKE = [
	[6, -4],
	[-6, 5],
	[4, -3],
	[-3, 2],
];

const tick = (frame: number) => ({frame, src: 'sfx/tick.wav', volume: 0.16});
const whoosh = (frame: number) => ({frame, src: 'sfx/whoosh.wav', volume: 0.2});
const SFX: {frame: number; src: string; volume: number}[] = [
	{frame: 0, src: 'sfx/pen.wav', volume: 0.12},
	...[30, 56, 82, 90].map(tick),
	...[110, 116, 122].map(tick),
	...[lineStart(3) + 24, lineStart(3) + 27, lineStart(3) + 30, lineStart(3) + 40].map(tick),
	...[0, 4, 8, 12].map((d) => tick(wordFrame(3, 9) + d)),
	...[wordFrame(4, 5), wordFrame(4, 6), wordFrame(4, 7)].map(tick),
	tick(wordFrame(5, 4) + 8),
	tick(wordFrame(6, 7)),
	...[0, 4, 8].map((d) => tick(wordFrame(7, 1) + d)),
	tick(wordFrame(7, 11)),
	...[8, 9, 12, 15, 18].map((d) => tick(wordFrame(8, 6) + d)),
	...[2, 3, 4].map((w) => tick(wordFrame(10, w))),
	...[0, 6, 12].map((d) => tick(wordFrame(12, 1) + d)),
	tick(wordFrame(13, 5)),
	tick(wordFrame(14, 1)),
	...[6, 7, 8].map((w) => tick(wordFrame(14, w))),
	...[3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14].map((l) => whoosh(lineStart(l) - 4)),
	whoosh(wordFrame(8, 6) - 2),
	whoosh(END_CARD_START - 4),
	{frame: lineStart(11), src: 'sfx/impact.wav', volume: 0.55},
];

const Reel: React.FC = () => {
	const f = useCurrentFrame();
	const cam = camera(f);
	const shakeI = f - lineStart(11) - 2;
	const [sx, sy] = shakeI >= 0 && shakeI < SHAKE.length ? SHAKE[shakeI] : [0, 0];
	const wipe = f >= lineStart(12) ? draw(f, lineStart(12), 10) : 0;
	return (
		<AbsoluteFill>
			<Background f={f} cam={cam} />
			<AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
				<AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: `${CX}px ${CY}px`}}>
					<Hook f={f} />
					<Nike f={f} />
					<Apple f={f} />
					<Target f={f} />
					<Mercedes f={f} />
					<McDonalds f={f} />
					<Secret f={f} />
					<Checklist f={f} />
					<Generic f={f} />
					<Keep f={f} />
					<Cta f={f} />
				</AbsoluteFill>
				<Interrupt f={f} wipe={wipe} />
				<Headline f={f} />
			</AbsoluteFill>
			<EndCard f={f} />
			<Header f={f} out={fadeIn(f, END_CARD_START, 6)} />
			<Grain f={f} />
			<Html5Audio src={staticFile('voiceover.wav')} />
			{SFX.map((s, i) => (
				<Sequence key={i} from={s.frame} layout="none">
					<Html5Audio src={staticFile(s.src)} volume={s.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

export const Root: React.FC = () => (
	<Composition id="Reel11" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
