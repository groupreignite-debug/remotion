import React from 'react';
import {C, clamp01, FONT} from '../theme';
import {Jacket} from './Jacket';

export const SHOP_W = 1080;
export const SHOP_H = 880;
export const FLOOR_Y = 760;

const GARMENTS = ['#6b5a4e', '#3f4b5c', '#8a7d6b', '#4d3b45', '#56614f'];

const Shirt: React.FC<{x: number; color: string; sway: number}> = ({x, color, sway}) => (
	<g transform={`rotate(${sway} ${x} 300)`}>
		<path d={`M${x} 300 L${x} 312`} stroke="#b9b2a8" strokeWidth="3" />
		<path d={`M${x - 14} 318 Q${x} 306 ${x + 14} 318`} stroke="#b9b2a8" strokeWidth="3" fill="none" />
		<path
			d={`M${x - 30} 322 L${x - 12} 314 Q${x} 322 ${x + 12} 314 L${x + 30} 322 L${x + 40} 360 L${x + 26} 364 L${x + 24} 446 L${x - 24} 446 L${x - 26} 364 L${x - 40} 360 Z`}
			fill={color}
		/>
	</g>
);

/**
 * Flat clothes shop interior. Children are drawn on top (people, bubbles),
 * in shop coordinates (1080 × 880).
 */
export const Shop: React.FC<{
	t: number;
	lights: number;
	jacketOnRack: number;
	jacketGlow: number;
	street?: React.ReactNode;
	children?: React.ReactNode;
}> = ({t, lights, jacketOnRack, jacketGlow, street, children}) => {
	const l = clamp01(lights);
	return (
		<div style={{position: 'relative', width: SHOP_W, height: SHOP_H}}>
			<svg width={SHOP_W} height={SHOP_H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="shop-wall" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#1b130e" />
						<stop offset="1" stopColor="#2a1c13" />
					</linearGradient>
					<linearGradient id="shop-floor" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#3a2719" />
						<stop offset="1" stopColor="#140d09" />
					</linearGradient>
					<linearGradient id="shop-street" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#262c38" />
						<stop offset="1" stopColor="#3b3a3c" />
					</linearGradient>
					<radialGradient id="shop-lamp" cx="0.5" cy="0" r="1">
						<stop offset="0" stopColor="#FFB45E" stopOpacity="0.45" />
						<stop offset="1" stopColor="#FFB45E" stopOpacity="0" />
					</radialGradient>
				</defs>
				<rect x="0" y="0" width={SHOP_W} height={FLOOR_Y} rx="0" fill="url(#shop-wall)" />
				<rect x="0" y={FLOOR_Y} width={SHOP_W} height={SHOP_H - FLOOR_Y} fill="url(#shop-floor)" />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<line key={i} x1={i * 220 - 60} y1={SHOP_H} x2={540 + (i * 220 - 600) * 0.45} y2={FLOOR_Y} stroke="#000" strokeOpacity="0.25" strokeWidth="2" />
				))}
				{/* storefront window */}
				<rect x="40" y="150" width="440" height="470" rx="14" fill="url(#shop-street)" />
				<rect x="40" y="540" width="440" height="80" fill="#4a4648" />
				<rect x="40" y="150" width="440" height="470" rx="14" fill="none" stroke="#0e0a08" strokeWidth="14" />
				<line x1="260" y1="150" x2="260" y2="620" stroke="#0e0a08" strokeWidth="10" />
			</svg>
			{/* street layer (people walking past outside), clipped to the window */}
			<div style={{position: 'absolute', left: 47, top: 157, width: 426, height: 456, overflow: 'hidden', borderRadius: 8}}>
				<div style={{position: 'absolute', left: -47, top: -157, width: SHOP_W, height: SHOP_H}}>{street}</div>
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 60%, rgba(255,255,255,0))'}} />
			</div>
			<svg width={SHOP_W} height={SHOP_H} style={{position: 'absolute', inset: 0}}>
				<line x1="260" y1="150" x2="260" y2="620" stroke="#0e0a08" strokeWidth="10" />
				{/* neon sign */}
				<g opacity={0.35 + 0.65 * l} style={{filter: `drop-shadow(0 0 ${14 * l}px ${C.ember})`}}>
					<path d="M770 92 q0 -18 18 -18 q18 0 18 14 q0 10 -18 18 l-62 30 h124 l-62 -30" stroke={C.emberHot} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</g>
				{/* rack */}
				<line x1="560" y1="298" x2="1040" y2="298" stroke="#b9b2a8" strokeWidth="7" strokeLinecap="round" />
				<line x1="575" y1="298" x2="575" y2={FLOOR_Y} stroke="#8e877e" strokeWidth="7" />
				<line x1="1025" y1="298" x2="1025" y2={FLOOR_Y} stroke="#8e877e" strokeWidth="7" />
				<line x1="555" y1={FLOOR_Y} x2="600" y2={FLOOR_Y} stroke="#8e877e" strokeWidth="8" strokeLinecap="round" />
				<line x1="1000" y1={FLOOR_Y} x2="1045" y2={FLOOR_Y} stroke="#8e877e" strokeWidth="8" strokeLinecap="round" />
				{[640, 710, 900, 970].map((x, i) => (
					<Shirt key={x} x={x} color={GARMENTS[i]} sway={Math.sin(t * 1.4 + i) * 1.5} />
				))}
				{/* lamps */}
				{[300, 800].map((x) => (
					<g key={x}>
						<line x1={x} y1="0" x2={x} y2="40" stroke="#0b0806" strokeWidth="3" />
						<path d={`M${x - 34} 64 Q${x} 26 ${x + 34} 64 Z`} fill="#0f0b08" />
						<ellipse cx={x} cy="64" rx="22" ry="5" fill="#FFD9A0" opacity={0.3 + 0.7 * l} />
						<path d={`M${x - 30} 64 L${x - 260} ${FLOOR_Y + 80} L${x + 260} ${FLOOR_Y + 80} L${x + 30} 64 Z`} fill="url(#shop-lamp)" opacity={l * 0.8} />
					</g>
				))}
				{/* mirror */}
				<rect x="470" y="370" width="70" height="300" rx="35" fill="#3b4250" stroke="#0e0a08" strokeWidth="8" />
				<path d="M490 400 L520 380 M488 440 L526 410" stroke="#fff" strokeOpacity="0.25" strokeWidth="5" strokeLinecap="round" />
			</svg>
			{/* the jacket on the rack */}
			<div
				style={{
					position: 'absolute',
					left: 805 - 85,
					top: 300,
					width: 170,
					height: 170,
					opacity: jacketOnRack,
					transform: `scale(${0.85 + 0.15 * jacketOnRack + 0.06 * jacketGlow})`,
					filter: `drop-shadow(0 0 ${30 * jacketGlow}px rgba(255,120,30,${0.9 * jacketGlow}))`,
				}}
			>
				<svg width="170" height="20" style={{position: 'absolute', top: -6}}>
					<path d="M85 0 L85 10 M70 18 Q85 6 100 18" stroke="#b9b2a8" strokeWidth="3" fill="none" />
				</svg>
				<Jacket size={170} />
			</div>
			<div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>{children}</div>
			{/* warm vignette */}
			<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,${0.75 - 0.35 * l}) 100%)`, pointerEvents: 'none'}} />
		</div>
	);
};

/** The shop as a rounded, shadowed "window" into the illustration, below the headline zone. */
export const ShopStage: React.FC<{children: React.ReactNode; enter: number}> = ({children, enter}) => (
	<div
		style={{
			position: 'absolute',
			top: 370,
			left: 540 - (SHOP_W * 0.92) / 2,
			width: SHOP_W * 0.92,
			height: SHOP_H * 0.92,
			borderRadius: 44,
			overflow: 'hidden',
			boxShadow: '0 50px 100px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,255,255,0.12)',
			opacity: clamp01(enter),
			transform: `scale(${0.9 + 0.1 * enter})`,
			filter: `blur(${Math.max(0, 1 - enter) * 8}px)`,
		}}
	>
		<div style={{transform: 'scale(0.92)', transformOrigin: '0 0'}}>{children}</div>
	</div>
);

/** Position + gait for a person walking from `x0` to `x1` between frames `a` and `b`. */
export const walkTo = (frame: number, a: number, b: number, x0: number, x1: number) => {
	const p = clamp01((frame - a) / (b - a));
	// smoothstep: eases in and out like a person starting and stopping
	const e = p * p * (3 - 2 * p);
	const moving = p > 0 && p < 1;
	return {x: x0 + (x1 - x0) * e, walk: moving ? frame * 0.55 : 0, moving};
};
