import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Glass} from '../components/Devices';
import {UserGlyph} from '../components/People';
import {Sparks} from '../components/Sparks';
import {C, clamp01, FONT, sp, ws} from '../theme';

const SHOP = {x: 540, y: 470};
const COLS = 5;
const ROWS = 4;
const VISITORS = [1, 6, 8, 12, 18];

const home = (i: number) => ({x: 540 + ((i % COLS) - 2) * 165, y: 830 + Math.floor(i / COLS) * 118});

/** Line 05 — crowd → some visit the shop → leave without buying → ember arrow brings exactly them back. */
export const S05Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const visit = ws(5, 5); // "شافوك"
	const leave = ws(5, 7); // "بس"
	const arrowAt = ws(5, 9) + 2; // "اشتروا"
	const shopIn = sp(frame, ws(5, 0) - 2, {damping: 13});

	return (
		<AbsoluteFill>
			{/* the brand / shop */}
			<div
				style={{
					position: 'absolute',
					left: SHOP.x - 120,
					top: SHOP.y - 130,
					opacity: clamp01(shopIn),
					transform: `scale(${0.9 + 0.1 * shopIn})`,
					filter: `blur(${Math.max(0, 1 - shopIn) * 8}px)`,
				}}
			>
				<Glass style={{width: 240, height: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
					<svg width="120" height="110" viewBox="0 0 120 110">
						<path d="M10 40 L22 10 H98 L110 40 Z" fill={C.ember} />
						<path d="M10 40 q12 14 25 0 q12 14 25 0 q12 14 25 0 q12 14 25 0" fill={C.emberHot} />
						<rect x="18" y="48" width="84" height="56" rx="6" fill="rgba(255,255,255,0.9)" />
						<rect x="48" y="66" width="24" height="38" rx="3" fill="#2a1a12" />
						<rect x="26" y="58" width="16" height="16" rx="3" fill="#2a1a12" opacity="0.5" />
						<rect x="78" y="58" width="16" height="16" rx="3" fill="#2a1a12" opacity="0.5" />
					</svg>
					<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.white}}>متجرك</span>
				</Glass>
			</div>
			{/* return arrows */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<marker id="arrow-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
						<path d="M0 0 L10 5 L0 10 Z" fill={C.emberHot} />
					</marker>
				</defs>
				{VISITORS.map((v, k) => {
					const h = home(v);
					const side = h.x < 540 ? -1 : h.x > 540 ? 1 : k % 2 ? 1 : -1;
					const sx = SHOP.x + side * 120;
					const sy = SHOP.y + 40;
					const cx = h.x + side * 260;
					const cy = (sy + h.y) / 2 - 60;
					const d = `M${sx} ${sy} Q${cx} ${cy} ${h.x + side * 4} ${h.y - 70}`;
					const p = clamp01(sp(frame, arrowAt + k * 2, {damping: 18, stiffness: 90}));
					return (
						<path
							key={v}
							d={d}
							fill="none"
							stroke={C.ember}
							strokeWidth={7}
							strokeLinecap="round"
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1 - p}
							markerEnd={p > 0.92 ? 'url(#arrow-head)' : undefined}
							style={{filter: 'drop-shadow(0 0 10px rgba(255,106,26,0.85))'}}
							opacity={p > 0 ? 1 : 0}
						/>
					);
				})}
			</svg>
			{/* the crowd */}
			{new Array(COLS * ROWS).fill(true).map((_, i) => {
				const h = home(i);
				const isVisitor = VISITORS.includes(i);
				const pIn = sp(frame, ws(5, 0) + i * 0.8, {damping: 13, stiffness: 180});
				const go = isVisitor ? clamp01(sp(frame, visit + VISITORS.indexOf(i) * 2, {damping: 16, stiffness: 120})) : 0;
				const back = isVisitor ? clamp01(sp(frame, leave + VISITORS.indexOf(i) * 2, {damping: 16, stiffness: 120})) : 0;
				const at = go - back;
				const k = VISITORS.indexOf(i);
				const target = {x: SHOP.x + (k - 2) * 46, y: SHOP.y + 150};
				const x = interpolate(at, [0, 1], [h.x, target.x]);
				const y = interpolate(at, [0, 1], [h.y, target.y]) - Math.sin(Math.PI * at) * 60;
				const glow = isVisitor ? clamp01(sp(frame, arrowAt + 10 + k * 2, {damping: 14})) : 0;
				const color = isVisitor && (go > 0.1 || glow > 0) ? (glow > 0.2 ? C.ember : '#f3e5d9') : 'rgba(255,255,255,0.32)';
				const size = 96 * (1 - 0.45 * at) * (1 + 0.12 * glow);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - size / 2,
							top: y - size / 2,
							opacity: clamp01(pIn),
							transform: `scale(${0.9 + 0.1 * pIn})`,
							filter: `blur(${Math.max(0, 1 - pIn) * 8}px)`,
						}}
					>
						<UserGlyph size={size} color={color} glow={glow} />
						{isVisitor && back > 0.5 && glow < 0.5 ? (
							<div
								style={{
									position: 'absolute',
									top: -26,
									right: -18,
									width: 38,
									height: 38,
									borderRadius: 19,
									background: '#1b1b1f',
									border: '2px solid rgba(255,255,255,0.3)',
									color: '#fff',
									fontFamily: FONT,
									fontWeight: 900,
									fontSize: 24,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${sp(frame, leave + 6 + k * 2, {damping: 9, stiffness: 220})})`,
								}}
							>
								✕
							</div>
						) : null}
					</div>
				);
			})}
			{VISITORS.map((v, k) => (
				<Sparks key={v} at={arrowAt + 10 + k * 2} x={home(v).x} y={home(v).y} count={8} spread={0.6} seed={`v${v}`} />
			))}
		</AbsoluteFill>
	);
};
