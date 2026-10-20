import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {typedCount, typingFrames, wordAt, wordEnd} from '../timing';
import {clamp, DrawLine, Flare, Label, SearchBar, Sfx, sp, TypingTicks} from '../ui';
import {QUERY} from './Scene01';

const NAME = 'Dr. Karam Clinic';

export const Scene06: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const name = r(wordAt(6, 'اسمك'));
	const nameFrames = typingFrames(NAME, 3, name - 4, 'name');
	const delFrom = name + 5;
	const delTo = delFrom + 9;
	const qFrames = typingFrames(QUERY, r(wordAt(6, 'بيكتب', 1)), r(wordAt(6, 'بالأشرفية')) + 8, 'query');
	const hl = r(wordEnd(6, 'بالأشرفية')) - 8;

	let shown = NAME.slice(0, typedCount(nameFrames, frame));
	let lastType = nameFrames.filter((f) => f <= frame).pop() ?? -100;
	if (frame >= delFrom) {
		const left = Math.round(interpolate(frame, [delFrom, delTo], [NAME.length, 0], clamp));
		shown = NAME.slice(0, left);
		lastType = Math.min(frame, delTo);
	}
	if (frame >= qFrames[0]) {
		shown = QUERY.slice(0, typedCount(qFrames, frame));
		lastType = qFrames.filter((f) => f <= frame).pop() ?? lastType;
	}
	const delTicks = Array.from({length: 6}).map((_, i) => delFrom + Math.round((i * (delTo - delFrom)) / 6));

	const bar = sp(frame, fps, -3, 16);
	const h = sp(frame, fps, hl, 14);
	const strike = frame >= name - 2 && frame < delFrom ? interpolate(frame, [name - 2, name + 3], [0, 1], clamp) : 0;

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - bar) * 80}px)`, opacity: bar}}>
				<SearchBar shown={shown} lastType={lastType} x={80} y={820} w={920} h={140} fontSize={50} highlight={h} />
			</div>
			{/* Hesitation: the name gets a dim strike before being deleted */}
			<div style={{position: 'absolute', left: 226, top: 889, height: 3, width: 420 * strike, background: C.dim, opacity: strike > 0 ? 0.9 : 0}} />
			<Label text="Your name" at={8} color={C.dim} style={{left: 100, top: 760, opacity: interpolate(frame, [delFrom, delFrom + 6], [1, 0], clamp)}} />
			<DrawLine d="M 800 980 L 800 1110 L 660 1110" len={300} at={hl + 2} dots={[[800, 980], [660, 1110]]} />
			<Label text="Keywords" at={hl + 8} style={{left: 400, top: 1094}} />
			<Flare x={640} y={890} at={hl} size={700} />
			<TypingTicks frames={nameFrames} seed="name" />
			<TypingTicks frames={delTicks} seed="del" />
			<TypingTicks frames={qFrames} seed="q" />
			<Sfx at={hl} name="ignite" volume={0.2} />
		</AbsoluteFill>
	);
};
