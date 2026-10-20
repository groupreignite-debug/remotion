import React from 'react';
import {AbsoluteFill, interpolate, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER} from '../theme';
import {typedCount, typingFrames, wordAt} from '../timing';
import {clamp, Flare, glowShadow, ignite, Sfx, sp, TypingTicks} from '../ui';

export const Scene13: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const seo = r(wordAt(13, 'SEO'));
	const check = r(wordAt(13, 'فحص'));
	const frames = typingFrames('SEO', seo - 3, seo + 5, 'cta');
	const n = typedCount(frames, frame);

	const box = sp(frame, fps, -4, 13);
	const g = ignite(frame, seo + 7, true);
	const send = sp(frame, fps, check, 12);
	const pulse = 1 + 0.06 * Math.sin(frame / 5) * send;
	const caretOn = Math.floor(frame / 9) % 2 === 0;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 760,
					width: 940,
					borderRadius: 36,
					background: C.card,
					border: `3px solid ${C.accent}`,
					boxShadow: `0 0 ${50 + 60 * Math.min(1, g)}px rgba(255,90,31,${0.25 + 0.3 * Math.min(1, g)}), 0 40px 100px rgba(0,0,0,0.6)`,
					padding: '34px 40px',
					transform: `translateY(${(1 - box) * 160}px) scale(${0.85 + 0.15 * box})`,
					opacity: Math.min(1, box * 1.5),
					fontFamily: INTER,
				}}
			>
				<div style={{fontSize: 26, fontWeight: 600, color: C.dim, letterSpacing: '0.04em'}}>Comments</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 26}}>
					<div style={{width: 96, height: 96, borderRadius: 48, background: '#2E2B28', flexShrink: 0}} />
					<div style={{flex: 1, height: 170, borderRadius: 26, background: '#100F0E', border: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 34px'}}>
						{n === 0 ? <span style={{fontSize: 40, color: C.dim}}>Add a comment…</span> : null}
						<span style={{fontSize: 130, fontWeight: 800, color: C.accent, letterSpacing: '0.04em', textShadow: glowShadow(0.4 + g)}}>{'SEO'.slice(0, n)}</span>
						<span style={{width: 6, height: 110, background: C.accent, marginLeft: 6, opacity: caretOn ? 1 : 0, borderRadius: 3}} />
					</div>
					<div
						style={{
							width: 96,
							height: 96,
							borderRadius: 48,
							background: send > 0.1 ? C.accent : C.line,
							flexShrink: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${pulse})`,
						}}
					>
						<svg width={44} height={44} viewBox="0 0 24 24">
							<path d="M3 12 L21 3 L14 21 L11 13 Z" fill={send > 0.1 ? C.bg : C.dim} />
						</svg>
					</div>
				</div>
			</div>
			<Flare x={540} y={1000} at={seo + 6} size={1000} strong />
			<TypingTicks frames={frames} seed="cta" />
			<Sfx at={seo + 6} name="ignite" volume={0.3} />
			<Sfx at={check} name="pop" volume={0.18} />
		</AbsoluteFill>
	);
};

export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = sp(frame, fps, 0, 14);
	const t = interpolate(frame, [8, 18], [0, 1], clamp);
	const breathe = 0.6 + 0.25 * Math.sin(frame / 6);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					position: 'absolute',
					width: 900,
					height: 900,
					left: 90,
					top: 430,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,90,31,0.28), rgba(255,90,31,0.06) 45%, transparent 70%)',
					opacity: p * breathe,
				}}
			/>
			<Img
				src={staticFile('logo.png')}
				style={{
					position: 'absolute',
					width: 760,
					left: 160,
					top: 470,
					mixBlendMode: 'screen',
					transform: `scale(${0.9 + 0.1 * p})`,
					opacity: Math.min(1, p * 1.5),
					filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 1250,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: INTER,
					fontWeight: 500,
					fontSize: 28,
					letterSpacing: '0.08em',
					color: C.text,
					opacity: t,
					transform: `translateY(${(1 - t) * 16}px)`,
				}}
			>
				Launch sharper. Sell clearer. Scale faster.
			</div>
			<Sfx at={0} name="chime" volume={0.18} />
		</AbsoluteFill>
	);
};

