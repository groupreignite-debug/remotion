import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Glass, Ripple} from '../components/Devices';
import {Kinetic} from '../components/Kinetic';
import {Sparks} from '../components/Sparks';
import {C, clamp01, EMBER_GRADIENT, FONT, sp, ws} from '../theme';

/** Line 14 — CTA: "اكتب PIXEL 👇" with a comment box, plus an engagement question. */
export const S14Cta: React.FC = () => {
	const frame = useCurrentFrame();
	const ctaAt = ws(14, 3); // "اكتب"
	const typeFrom = ws(14, 4); // "PIXEL"
	const sendAt = ws(14, 6) - 4;
	const askAt = ws(14, 6) + 2;
	const typed = 'PIXEL'.slice(0, Math.max(0, Math.min(5, Math.floor((frame - typeFrom) / 3) + 1)));
	const cta = sp(frame, ctaAt, {damping: 11, stiffness: 190});
	const box = sp(frame, ctaAt + 4, {damping: 14});
	const posted = sp(frame, sendAt + 2, {damping: 12, stiffness: 180});
	const caret = Math.floor(frame / 8) % 2 === 0;

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 165, left: 40, right: 40}}>
				<Kinetic text="موقعك فيه Pixel؟" at={[ws(14, 0), ws(14, 1), ws(14, 2)]} size={84} weight={900} highlight={['Pixel']} />
			</div>
			<div
				style={{
					position: 'absolute',
					top: 330,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 34,
					direction: 'rtl',
					fontFamily: FONT,
					fontWeight: 900,
					fontSize: 128,
					opacity: clamp01(cta),
					transform: `scale(${0.8 + 0.2 * cta})`,
					filter: `blur(${Math.max(0, 1 - cta) * 8}px)`,
				}}
			>
				<span style={{color: C.white}}>اكتب</span>
				<span style={{backgroundImage: EMBER_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 20px rgba(255,106,26,0.6))', direction: 'ltr'}}>PIXEL</span>
				<span style={{display: 'inline-block', transform: `translateY(${Math.sin(frame / 4) * 10}px)`}}>👇</span>
			</div>
			{/* comment sheet */}
			<Glass
				style={{
					position: 'absolute',
					top: 560,
					left: 90,
					right: 90,
					padding: 30,
					opacity: clamp01(box),
					transform: `perspective(1400px) rotateX(${(1 - clamp01(box)) * 10}deg) scale(${0.9 + 0.1 * box})`,
					filter: `blur(${Math.max(0, 1 - box) * 8}px)`,
				}}
			>
				<div style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.dim, textAlign: 'center', direction: 'ltr'}}>Comments</div>
				{/* posted comment */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						marginTop: 20,
						height: 96 * clamp01(posted),
						overflow: 'hidden',
						opacity: clamp01(posted),
						direction: 'ltr',
					}}
				>
					<div style={{width: 64, height: 64, borderRadius: 32, background: 'linear-gradient(135deg, #d6c7b8, #8a7d6b)', flexShrink: 0}} />
					<div style={{fontFamily: FONT}}>
						<div style={{fontWeight: 800, fontSize: 24, color: C.dim}}>you</div>
						<div style={{fontWeight: 900, fontSize: 40, color: C.white}}>PIXEL</div>
					</div>
					<span style={{marginLeft: 'auto', fontSize: 40, transform: `scale(${sp(frame, sendAt + 12, {damping: 8, stiffness: 220})})`}}>🧡</span>
				</div>
				{/* input */}
				<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, direction: 'ltr'}}>
					<div style={{width: 64, height: 64, borderRadius: 32, background: 'linear-gradient(135deg, #d6c7b8, #8a7d6b)', flexShrink: 0}} />
					<div
						style={{
							flex: 1,
							height: 76,
							borderRadius: 38,
							border: `2px solid ${frame >= typeFrom && frame < sendAt ? C.ember : 'rgba(255,255,255,0.25)'}`,
							display: 'flex',
							alignItems: 'center',
							padding: '0 28px',
							fontFamily: FONT,
							fontWeight: 800,
							fontSize: 36,
							color: frame >= typeFrom && frame < sendAt ? C.white : C.dim,
						}}
					>
						{frame >= typeFrom && frame < sendAt ? (
							<>
								{typed}
								<span style={{opacity: caret ? 1 : 0, color: C.ember}}>|</span>
							</>
						) : (
							'Add a comment…'
						)}
					</div>
					<div style={{position: 'relative', width: 76, height: 76, borderRadius: 38, background: EMBER_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<svg width="36" height="36" viewBox="0 0 24 24">
							<path d="M4 12 L20 4 L14 20 L11 13 Z" fill="#fff" />
						</svg>
						<Ripple x={38} y={38} p={clamp01((frame - sendAt) / 14)} />
					</div>
				</div>
			</Glass>
			<Sparks at={sendAt + 2} x={540} y={760} count={16} seed="send" />
			<div style={{position: 'absolute', top: 1010, left: 60, right: 60}}>
				<Kinetic text="وإنت؟ شو آخر شي لحقك؟ 👇" at={askAt} stagger={3} size={66} weight={800} highlight={['لحقك']} />
			</div>
		</AbsoluteFill>
	);
};

/** End card — Reignite Group logo + handle, the last ~1s. */
export const EndCard: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	if (frame < at - 6) {
		return null;
	}
	const p = sp(frame, at - 6, {damping: 16, stiffness: 120});
	const handle = sp(frame, at + 4, {damping: 14});
	return (
		<AbsoluteFill style={{background: '#000', opacity: clamp01(p * 1.5)}}>
			<AbsoluteFill style={{background: 'radial-gradient(520px 520px at 540px 860px, rgba(255,106,26,0.22), rgba(0,0,0,0) 70%)'}} />
			<div style={{position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<Img
					src={staticFile('logo.png')}
					style={{width: 1000, mixBlendMode: 'screen', transform: `scale(${0.9 + 0.1 * p})`, filter: `blur(${Math.max(0, 1 - p) * 10}px)`}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1120,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: FONT,
					fontWeight: 800,
					fontSize: 60,
					color: C.white,
					direction: 'ltr',
					opacity: clamp01(handle),
					transform: `translateY(${(1 - handle) * 24}px)`,
				}}
			>
				@reignitegroup
			</div>
			<Sparks at={at} x={540} y={790} count={20} seed="end" />
		</AbsoluteFill>
	);
};

