import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C, INTER} from '../theme';
import {wordAt} from '../timing';
import {DrawLine, Flare, glowShadow, ignite, Label, Sfx, sp} from '../ui';
import {QUERY} from './Scene01';

const KW = ['طبيب', 'أسنان', 'الأشرفية'];

export const Scene07: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const words = r(wordAt(7, 'هالكلمات'));
	const noMatch = r(wordAt(7, 'ما', 1));
	const rise = r(wordAt(7, 'تطلع'));

	const inP = sp(frame, fps, -3, 16);
	const chip = sp(frame, fps, 2, 15);
	const x = sp(frame, fps, noMatch - 2, 10);
	const up = sp(frame, fps, rise - 4, 15);
	const listIn = sp(frame, fps, noMatch, 16);

	// Right card travels into the #1 slot of the results list.
	const rcLeft = interpolate(up, [0, 1], [560, 100]);
	const rcTop = interpolate(up, [0, 1], [880, 1100]);
	const rcW = interpolate(up, [0, 1], [420, 880]);

	return (
		<AbsoluteFill>
			{/* Keyword chip */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 620,
					display: 'flex',
					justifyContent: 'center',
					transform: `translateY(${(1 - chip) * -40}px)`,
					opacity: chip,
				}}
			>
				<div style={{direction: 'rtl', fontFamily: ARABIC, fontWeight: 600, fontSize: 44, color: C.accent, border: `2px solid ${C.accent}`, borderRadius: 40, padding: '10px 36px', background: 'rgba(255,90,31,0.08)'}}>
					{QUERY}
				</div>
			</div>
			<DrawLine d="M 470 720 L 470 790 L 290 790 L 290 870" len={340} at={words - 2} color={C.dim} dots={[[470, 720], [290, 870]]} />
			<DrawLine d="M 610 720 L 610 790 L 770 790 L 770 870" len={320} at={words} dots={[[610, 720], [770, 870]]} />

			{/* Left: generic site — no match */}
			<div
				style={{
					position: 'absolute',
					left: 80,
					top: 880,
					width: 420,
					height: 240,
					borderRadius: 26,
					background: C.card,
					border: `2px solid ${C.line}`,
					padding: 30,
					transform: `translateY(${(1 - inP) * 100 + up * 260}px)`,
					opacity: Math.min(1, inP * 1.5) * (1 - up * 0.75),
					filter: `grayscale(1) blur(${up * 3}px)`,
				}}
			>
				<div style={{direction: 'rtl', fontFamily: ARABIC, fontWeight: 700, fontSize: 50, color: C.dim}}>أهلا وسهلا</div>
				<div style={{height: 10, width: '80%', background: C.line, borderRadius: 5, marginTop: 30}} />
				<div style={{height: 10, width: '55%', background: C.line, borderRadius: 5, marginTop: 16}} />
				<div
					style={{
						position: 'absolute',
						right: 26,
						bottom: 18,
						fontSize: 96,
						lineHeight: 1,
						color: C.dim,
						fontFamily: ARABIC,
						transform: `scale(${x}) rotate(${(1 - x) * 30}deg)`,
						opacity: frame < noMatch - 2 ? 0 : 1,
					}}
				>
					✕
				</div>
			</div>
			<Label text="No match" at={noMatch + 2} color={C.dim} style={{left: 80, top: 1140, opacity: 1 - up}} />

			{/* Results list the matching card climbs into */}
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: 100,
						top: 1100 + i * 120 + up * 120,
						width: 880,
						height: 100,
						borderRadius: 20,
						background: 'rgba(22,21,20,0.8)',
						border: `2px solid ${C.line}`,
						opacity: listIn * 0.9 * (i === 2 ? 1 - up : 1),
						transform: `translateY(${(1 - listIn) * 60}px)`,
					}}
				>
					<div style={{height: 10, width: '45%', background: C.line, borderRadius: 5, margin: '30px 30px 0'}} />
					<div style={{height: 10, width: '30%', background: C.line, borderRadius: 5, margin: '16px 30px 0'}} />
				</div>
			))}

			{/* Right: site that contains the keywords */}
			<div
				style={{
					position: 'absolute',
					left: rcLeft,
					top: rcTop,
					width: rcW,
					height: interpolate(up, [0, 1], [240, 110]),
					borderRadius: 26,
					background: C.cardHi,
					border: `2px solid ${frame >= words ? C.accent : C.line}`,
					boxShadow: frame >= words ? `0 0 ${40 + 30 * up}px rgba(255,90,31,0.3)` : 'none',
					padding: interpolate(up, [0, 1], [30, 22]),
					transform: `translateY(${(1 - inP) * 100}px)`,
					opacity: Math.min(1, inP * 1.5),
					display: 'flex',
					flexDirection: up > 0.5 ? 'row-reverse' : 'column',
					alignItems: up > 0.5 ? 'center' : 'flex-end',
					gap: 16,
					zIndex: 2,
				}}
			>
				<div style={{direction: 'rtl', fontFamily: ARABIC, fontWeight: 700, fontSize: 44, display: 'flex', gap: 14, whiteSpace: 'nowrap'}}>
					{KW.map((k, i) => {
						const at = words + i * 4;
						const lit = frame >= at;
						return (
							<React.Fragment key={k}>
								{i === 2 ? <span style={{color: C.dim}}>•</span> : null}
								<span style={{color: lit ? C.accent : C.text, textShadow: glowShadow(ignite(frame, at + 1, false))}}>{k}</span>
							</React.Fragment>
						);
					})}
				</div>
				{up > 0.5 ? (
					<div style={{fontFamily: INTER, fontWeight: 700, fontSize: 26, color: C.accent, letterSpacing: '0.1em', marginRight: 'auto'}}>#1</div>
				) : (
					<>
						<div style={{height: 10, width: '80%', background: C.line, borderRadius: 5, marginTop: 14}} />
						<div style={{height: 10, width: '55%', background: C.line, borderRadius: 5}} />
					</>
				)}
			</div>
			<Label text="Match" at={words + 10} style={{right: 80, top: 1140, opacity: 1 - up}} />
			<Flare x={540} y={1155} at={rise + 6} size={800} />
			{KW.map((_, i) => (
				<Sfx key={i} at={words + i * 4} name="tick2" volume={0.2} />
			))}
			<Sfx at={noMatch} name="error" volume={0.22} />
			<Sfx at={rise - 4} name="whoosh" volume={0.16} />
		</AbsoluteFill>
	);
};
