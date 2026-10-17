import React from 'react';
import {AbsoluteFill} from 'remotion';
import {APPLE, MCDONALDS, MERCEDES_STAR, NIKE, TARGET} from '../logos';
import {DrawLine, DrawPath, Layer, TypeLabel, draw, fadeIn, mix, sp} from '../primitives';
import {C, CX} from '../theme';
import {lineEnd, lineStart, wordFrame} from '../timing';

const BOARD = {cx: CX, cy: 960, w: 760, h: 470};
const PHONE = {w: 400, h: 760, top: 660};
const TILE = 100;
const GAP = 26;
const GRID_TOP = PHONE.top + 110;
// McDonald's lands in the centre of the first row.
const LAND = {x: CX, y: GRID_TOP + TILE / 2};

const Mercedes: React.FC<{x: number; y: number; size: number}> = ({x, y, size}) => (
	<g>
		<circle cx={x} cy={y} r={size * 0.46} fill="none" stroke={C.text} strokeWidth={size * 0.05} />
		<DrawPath d={MERCEDES_STAR} x={x} y={y} size={size * 0.98} progress={1} fill={1} />
	</g>
);

// Line 08: huge on a billboard, then a fast zoom-out until it is one app icon.
export const McDonalds: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(8);
	const end = lineEnd(8);
	if (f < s || f >= end) {
		return null;
	}
	const icon = wordFrame(8, 6);
	const frame = draw(f, s + 4, 18);
	const posts = draw(f, s + 12, 14);
	const archDraw = draw(f, s + 10, 22);
	const archFill = fadeIn(f, s + 30, 10);
	const push = 1 + 0.1 * draw(f, s, icon - s);

	// Zoom-out: log-space scale from the billboard down to one tile, with motion blur.
	const z = Math.min(1, sp(f, icon, {damping: 18, stiffness: 170}));
	const endScale = TILE / BOARD.w;
	const sc = push * Math.pow(endScale / push, z);
	const tx = mix(BOARD.cx, LAND.x, z);
	const ty = mix(BOARD.cy, LAND.y, z);
	const blur = 16 * Math.sin(Math.PI * z);
	const boardO = z > 0.9 ? Math.max(0, 1 - (z - 0.9) * 10) : 1;

	const phone = sp(f, icon, {damping: 16});
	const phoneOut = draw(f, end - 10, 9);
	const km = wordFrame(8, 4);
	const dimLine = draw(f, km, 12);

	const tiles = [
		{d: NIKE, x: LAND.x - TILE - GAP, y: LAND.y, at: icon + 8},
		{d: MCDONALDS, x: LAND.x, y: LAND.y, at: icon + 9},
		{d: APPLE, x: LAND.x + TILE + GAP, y: LAND.y, at: icon + 12},
		{d: TARGET, x: LAND.x - (TILE + GAP) / 2, y: LAND.y + TILE + GAP, at: icon + 15},
		{d: 'mercedes', x: LAND.x + (TILE + GAP) / 2, y: LAND.y + TILE + GAP, at: icon + 18},
	];

	return (
		<AbsoluteFill>
			{/* Phone mockup: glass card with notch, tilting in. */}
			{phone > 0 ? (
				<AbsoluteFill
					style={{
						perspective: 1600,
						opacity: Math.min(1, phone * 2) * (1 - phoneOut),
						filter: phoneOut > 0 ? `blur(${8 * phoneOut}px)` : undefined,
					}}
				>
					<div
						style={{
							position: 'absolute',
							left: CX - PHONE.w / 2,
							top: PHONE.top,
							width: PHONE.w,
							height: PHONE.h,
							borderRadius: 64,
							border: '2px solid rgba(242,238,230,0.32)',
							background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.05))',
							boxShadow: `0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 10px rgba(13,13,13,0.9), 0 0 60px rgba(${C.accentRgb}, 0.08)`,
							transform: `rotateY(${(1 - phone) * -32}deg) rotateX(${(1 - phone) * 16}deg) scale(${mix(0.8, 1, phone) * (1 - 0.1 * phoneOut)})`,
							transformOrigin: '50% 30%',
						}}
					>
						<div style={{position: 'absolute', left: PHONE.w / 2 - 60, top: 24, width: 120, height: 32, borderRadius: 16, background: '#000'}} />
					</div>
				</AbsoluteFill>
			) : null}

			<Layer style={{opacity: 1 - phoneOut}}>
				{tiles.map((t) => {
					const p = sp(f, t.at, {stiffness: 220});
					if (p <= 0) {
						return null;
					}
					const isMc = t.d === MCDONALDS;
					return (
						<g key={t.x + '-' + t.y} transform={`translate(${t.x} ${t.y}) scale(${p}) translate(${-t.x} ${-t.y})`}>
							<rect
								x={t.x - TILE / 2}
								y={t.y - TILE / 2}
								width={TILE}
								height={TILE}
								rx={26}
								fill="rgba(242,238,230,0.07)"
								stroke={isMc ? C.accent : 'rgba(242,238,230,0.25)'}
								strokeWidth={isMc ? 2.5 : 1.5}
							/>
							{t.d === 'mercedes' ? <Mercedes x={t.x} y={t.y} size={58} /> : <DrawPath d={t.d} x={t.x} y={t.y} size={56} progress={1} fill={1} />}
						</g>
					);
				})}
				<TypeLabel f={f} start={wordFrame(8, 7)} text="APP ICON" x={CX} y={LAND.y + 2 * (TILE + GAP) + 40} anchor="middle" />
			</Layer>

			{/* Billboard. */}
			{boardO > 0 ? (
				<Layer style={{opacity: boardO, filter: `blur(${blur}px) drop-shadow(0 30px 34px rgba(0,0,0,0.75))`}}>
					<g transform={`translate(${tx} ${ty}) scale(${sc}) translate(${-BOARD.cx} ${-BOARD.cy})`}>
						<rect
							x={BOARD.cx - BOARD.w / 2}
							y={BOARD.cy - BOARD.h / 2}
							width={BOARD.w}
							height={BOARD.h}
							rx={18}
							fill="rgba(242,238,230,0.03)"
							stroke={C.text}
							strokeOpacity={0.55}
							strokeWidth={3}
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1 - frame}
						/>
						<g opacity={1 - z}>
							{[-220, 220].map((dx) => (
								<line
									key={dx}
									x1={BOARD.cx + dx}
									y1={BOARD.cy + BOARD.h / 2}
									x2={BOARD.cx + dx}
									y2={BOARD.cy + BOARD.h / 2 + 230 * posts}
									stroke={C.text}
									strokeOpacity={0.55}
									strokeWidth={14}
								/>
							))}
						</g>
						<DrawPath d={MCDONALDS} x={BOARD.cx} y={BOARD.cy + 10} size={390} progress={archDraw} fill={archFill} strokePx={3} />
					</g>
				</Layer>
			) : null}

			{/* "عن بعد كيلومتر" distance callout. */}
			<Layer style={{opacity: 1 - z}}>
				<DrawLine x1={BOARD.cx - BOARD.w / 2} y1={1270} x2={BOARD.cx + BOARD.w / 2} y2={1270} progress={dimLine} strokePx={2} />
				<TypeLabel f={f} start={km + 6} text="≈ 1 KM" x={CX} y={1250} anchor="middle" />
			</Layer>
		</AbsoluteFill>
	);
};
