import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {fadeIn} from './primitives';
import {C, CX, CY, FONT_AR, FONT_LATIN} from './theme';

// Background: base, slow-moving ember light, parallax grid, vignette.
export const Background: React.FC<{f: number; cam: number}> = ({f, cam}) => {
	const lx = CX + Math.sin(f / 95) * 160;
	const ly = CY + Math.cos(f / 120) * 110;
	// The grid moves at 30% of the foreground camera.
	const gridScale = 1 + (cam - 1) * 0.3;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle 620px at ${lx}px ${ly}px, rgba(${C.accentRgb}, 0.06), transparent 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					inset: -128,
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
					backgroundSize: '64px 64px',
					transform: `translateY(${-((f * 0.25) % 64)}px) scale(${gridScale})`,
					transformOrigin: `${CX + 128}px ${CY + 128}px`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 75% 60% at 50% 52%, transparent 45%, rgba(0,0,0,0.78) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

// Fixed header in the top safe area. Fades in by frame 6 and never moves.
export const Header: React.FC<{f: number; out: number}> = ({f, out}) => (
	<AbsoluteFill style={{opacity: fadeIn(f, 0, 6) * (1 - out)}}>
		<div style={{position: 'absolute', left: 64, top: 84, display: 'flex', alignItems: 'center', gap: 16}}>
			<Img src={staticFile('reignite-flame.png')} style={{height: 56}} />
			<div style={{fontFamily: FONT_LATIN}}>
				<div style={{color: C.text, fontWeight: 700, fontSize: 20, letterSpacing: '0.18em'}}>REIGNITE GROUP</div>
				<div style={{color: C.dim, fontSize: 14, marginTop: 4, letterSpacing: '0.04em'}}>@reignitegroup</div>
			</div>
		</div>
		<div style={{position: 'absolute', right: 64, top: 86, display: 'flex', alignItems: 'center', gap: 16}}>
			<div
				style={{
					fontFamily: FONT_LATIN,
					fontWeight: 700,
					fontSize: 18,
					color: C.accent,
					border: `2px solid ${C.accent}`,
					borderRadius: 10,
					padding: '6px 9px',
					letterSpacing: '0.06em',
				}}
			>
				11
			</div>
			<div style={{fontFamily: FONT_AR, direction: 'rtl', textAlign: 'right', fontSize: 22, lineHeight: 1.3}}>
				<div style={{color: C.text, fontWeight: 700}}>التسويق</div>
				<div style={{color: C.dim, fontWeight: 500}}>بلغة بسيطة</div>
			</div>
		</div>
	</AbsoluteFill>
);

// Subtle full-frame film grain.
export const Grain: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'screen', pointerEvents: 'none'}}>
		<svg width="100%" height="100%">
			<filter id="grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 24} stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#grain)" />
		</svg>
	</AbsoluteFill>
);
