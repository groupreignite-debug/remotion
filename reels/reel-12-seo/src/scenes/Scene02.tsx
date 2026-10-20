import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER} from '../theme';
import {wordAt} from '../timing';
import {clamp, DrawLine, Flare, glowShadow, ignite, Label, Sfx, sp} from '../ui';

const CARD_W = 270;
const CARD_H = 330;
const CARD_Y = 820;
// RTL: the first spoken card sits on the right.
const CARD_X = [710, 405, 100];

const Icon: React.FC<{kind: number; p: number}> = ({kind, p}) => {
	const len = 260;
	const common = {
		fill: 'none',
		stroke: C.accent,
		strokeWidth: 5,
		strokeLinecap: 'round' as const,
		strokeLinejoin: 'round' as const,
		strokeDasharray: len,
		strokeDashoffset: len * (1 - p),
	};
	return (
		<svg width={120} height={120} viewBox="0 0 100 100">
			{kind === 0 ? (
				<>
					<circle cx="42" cy="42" r="24" {...common} />
					<path d="M60 60 L84 84" {...common} />
				</>
			) : kind === 1 ? (
				<>
					<path d="M26 12 H62 L78 28 V88 H26 Z" {...common} />
					<path d="M38 44 H66 M38 58 H66 M38 72 H56" {...common} />
				</>
			) : (
				<>
					<path d="M50 10 L82 22 V48 C82 70 66 84 50 90 C34 84 18 70 18 48 V22 Z" {...common} />
					<path d="M35 50 L46 61 L66 39" {...common} />
				</>
			)}
		</svg>
	);
};

export const Scene02: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const notEnough = r(wordAt(2, 'بيكفّي'));
	const cues = [r(wordAt(2, 'يلاقيه')), r(wordAt(2, 'يفهمو')), r(wordAt(2, 'ويوثق'))];
	const seo = r(wordAt(2, 'SEO'));
	const labels = ['Find', 'Understand', 'Trust'];

	// Opening: a "nice website" wireframe draws on, then is dismissed on "ما بيكفّي".
	const site = sp(frame, fps, 0, 16);
	const dismiss = sp(frame, fps, notEnough, 16);
	const merge = sp(frame, fps, seo - 6, 15);
	const word = sp(frame, fps, seo, 12);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 190,
					top: 640,
					width: 700,
					height: 820,
					borderRadius: 36,
					border: `2px solid rgba(242,238,230,${0.35 * (1 - dismiss)})`,
					background: C.card,
					transform: `translateY(${(1 - site) * 80 - dismiss * 140}px) scale(${1 - 0.35 * dismiss})`,
					opacity: Math.min(1, site * 1.5) * (1 - dismiss * 0.92),
					filter: `blur(${dismiss * 6}px)`,
					overflow: 'hidden',
				}}
			>
				<div style={{height: 300, margin: 30, borderRadius: 20, background: 'linear-gradient(135deg, #2a2522, #1a1817)'}} />
				<div style={{height: 26, width: '60%', margin: '0 30px', borderRadius: 13, background: C.text, opacity: 0.85}} />
				<div style={{height: 14, width: '80%', margin: '24px 30px 0', borderRadius: 7, background: C.line}} />
				<div style={{height: 14, width: '70%', margin: '16px 30px 0', borderRadius: 7, background: C.line}} />
				<div style={{height: 70, width: 240, margin: '40px 30px', borderRadius: 35, background: C.accent, opacity: 0.9}} />
			</div>
			<Label text="Nice website" at={8} color={C.dim} style={{left: 190, top: 590, opacity: 1 - dismiss}} />
			<Label text="Not enough" at={notEnough + 2} style={{left: 190, top: 1500, opacity: interpolate(frame, [cues[0] - 4, cues[0] + 4], [1, 0], clamp)}} />

			{cues.map((at, i) => {
				const p = sp(frame, fps, at - 3, 15);
				const icon = sp(frame, fps, at, 20, 18);
				const cx = 540 - CARD_W / 2;
				const x = interpolate(merge, [0, 1], [CARD_X[i], cx]);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: CARD_Y,
							width: CARD_W,
							height: CARD_H,
							borderRadius: 28,
							background: C.card,
							border: `2px solid ${C.line}`,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 34,
							transform: `translateY(${(1 - p) * 120}px) scale(${1 - 0.5 * merge})`,
							opacity: Math.min(1, p * 1.6) * (1 - merge),
							boxShadow: `0 30px 80px rgba(0,0,0,0.5), ${glowShadow(ignite(frame, at + 2, false) * 0.6).replace('none', '0 0 0 transparent')}`,
						}}
					>
						<Icon kind={i} p={icon} />
						<div style={{fontFamily: INTER, fontWeight: 600, fontSize: 24, letterSpacing: '0.18em', color: C.accent, textTransform: 'uppercase'}}>
							{labels[i]}
						</div>
					</div>
				);
			})}
			{cues.slice(1).map((at, i) => (
				<DrawLine
					key={i}
					d={`M ${CARD_X[i]} ${CARD_Y + CARD_H / 2} L ${CARD_X[i + 1] + CARD_W} ${CARD_Y + CARD_H / 2}`}
					len={40}
					at={at}
					dots={[]}
					dur={8}
				/>
			))}
			{/* SEO wordmark */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 800,
					textAlign: 'center',
					fontFamily: INTER,
					fontWeight: 800,
					fontSize: 300,
					letterSpacing: '0.02em',
					color: C.accent,
					transform: `scale(${0.4 + 0.6 * word})`,
					opacity: frame < seo ? 0 : Math.min(1, word * 2),
					textShadow: glowShadow(0.5 + ignite(frame, seo + 2, true)),
				}}
			>
				SEO
			</div>
			<Flare x={540} y={960} at={seo} size={1000} strong />
			{cues.map((at, i) => (
				<Sfx key={i} at={at - 2} name="pop" volume={0.16} />
			))}
			<Sfx at={notEnough} name="whoosh" volume={0.14} />
			<Sfx at={seo - 4} name="whoosh" volume={0.18} />
			<Sfx at={seo} name="ignite" volume={0.26} />
		</AbsoluteFill>
	);
};
