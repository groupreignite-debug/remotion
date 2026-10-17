import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Finger, Phone, Ripple} from '../components/Devices';
import {Jacket, JacketTile} from '../components/Jacket';
import {Kinetic} from '../components/Kinetic';
import {C, clamp01, FONT, sp, ws} from '../theme';

const TILE_W = 162;
const TILE_H = 214;
const GRID_TOP = 122;
const JACKET_INDEX = 5;
const COLORS = ['#6b5a4e', '#3f4b5c', '#8a7d6b', '#4d3b45', '#56614f', '', '#7c6a5c', '#3d4a44', '#5d4f63', '#80705e'];

const MiniShirt: React.FC<{color: string}> = ({color}) => (
	<svg width="110" height="120" viewBox="-40 300 80 150">
		<path d="M-30 322 L-12 314 Q0 322 12 314 L30 322 L40 360 L26 364 L24 446 L-24 446 L-26 364 L-40 360 Z" fill={color} />
	</svg>
);

/** Line 01 — phone mid-scroll on a clothing site, taps the jacket, swipes away. */
export const S01Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const tapAt = ws(1, 5); // "جاكيت"
	const swipeAt = ws(1, 7); // "وفلّيت"

	// Already mid-scroll at frame 0, decelerating to rest with the jacket in view.
	const scroll = 300 - 420 * Math.exp(-(frame + 8) / 22);
	const tap = sp(frame, tapAt, {damping: 20, stiffness: 120});
	const page = sp(frame, tapAt + 3, {damping: 15, stiffness: 140});
	const swipe = sp(frame, swipeAt, {damping: 16, stiffness: 110});

	const jx = 12 + (JACKET_INDEX % 2) * (TILE_W + 10) + TILE_W / 2;
	const jy = GRID_TOP + Math.floor(JACKET_INDEX / 2) * (TILE_H + 12) + TILE_H / 2 - scroll;

	// Finger: drags up (scroll) at the start, then comes back to tap the jacket, then swipes away.
	const dragging = frame < 34;
	const fingerX = dragging ? 230 : frame < swipeAt ? interpolate(frame, [34, tapAt - 4], [330, jx], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : jx + swipe * 260;
	const fingerY = dragging ? 620 - (frame + 8) * 9 : frame < swipeAt ? interpolate(frame, [34, tapAt - 4], [620, jy], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : jy + 80;
	const fingerO = dragging ? 1 - clamp01((frame - 22) / 10) : frame < 40 ? clamp01((frame - 34) / 6) : frame > swipeAt + 10 ? 1 - clamp01((frame - swipeAt - 10) / 6) : 1;
	const pressed = sp(frame, tapAt - 2, {damping: 20}) - sp(frame, tapAt + 4, {damping: 20});

	const tilt = interpolate(sp(frame, -10, {damping: 30, stiffness: 40}), [0, 1], [-14, -6]) + swipe * 10;

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 175, left: 60, right: 60}}>
				<Kinetic text="شفت شي مرة… وصار يلحقك؟" at={-40} size={96} weight={900} highlight={['يلحقك']} lineHeight={1.2} />
			</div>
			<div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center', perspective: 1600}}>
				<div style={{transform: `rotateY(${tilt}deg) rotateX(4deg) translateX(${swipe * -30}px)`}}>
					<Phone width={390} height={800} screenBg="#f6f3ef" statusDark>
						{/* shop header */}
						<div
							style={{
								position: 'absolute',
								top: 52,
								left: 0,
								right: 0,
								height: 58,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '0 18px',
								direction: 'ltr',
								background: '#f6f3ef',
								zIndex: 2,
								borderBottom: '1px solid #e6dfd6',
							}}
						>
							<span style={{fontFamily: FONT, fontWeight: 900, fontSize: 22, color: '#1b120d'}}>JACKET CO.</span>
							<svg width="26" height="26" viewBox="0 0 24 24">
								<path d="M3 4h3l2.4 11h10.2L21 7H7" stroke="#1b120d" strokeWidth="2" fill="none" strokeLinejoin="round" />
								<circle cx="10" cy="19.5" r="1.6" fill="#1b120d" />
								<circle cx="17" cy="19.5" r="1.6" fill="#1b120d" />
							</svg>
						</div>
						{/* product grid */}
						<div style={{position: 'absolute', left: 0, top: -scroll, width: '100%'}}>
							{COLORS.map((c, i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										left: 12 + (i % 2) * (TILE_W + 10),
										top: GRID_TOP + Math.floor(i / 2) * (TILE_H + 12),
										width: TILE_W,
										height: TILE_H,
										borderRadius: 16,
										overflow: 'hidden',
										background: '#fff',
										boxShadow: i === JACKET_INDEX ? `0 0 0 ${3 * tap}px ${C.ember}` : '0 2px 6px rgba(0,0,0,0.06)',
									}}
								>
									{i === JACKET_INDEX ? (
										<JacketTile width={TILE_W} height={166} tag={false} />
									) : (
										<div style={{height: 166, background: '#efe9e2', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
											<MiniShirt color={c} />
										</div>
									)}
									<div style={{padding: '6px 10px', direction: 'ltr'}}>
										<div style={{width: '70%', height: 9, borderRadius: 5, background: '#ddd5cc'}} />
										<div style={{width: '35%', height: 9, borderRadius: 5, background: i === JACKET_INDEX ? C.ember : '#e7e0d8', marginTop: 7}} />
									</div>
								</div>
							))}
						</div>
						{/* product page */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								top: 52,
								background: '#f6f3ef',
								opacity: clamp01(page),
								transform: `translateX(${swipe * 420}px) scale(${0.85 + 0.15 * page})`,
								filter: `blur(${(1 - clamp01(page)) * 8 + Math.sin(Math.PI * clamp01(swipe)) * 6}px)`,
								transformOrigin: `${jx}px ${jy}px`,
								zIndex: 3,
							}}
						>
							<JacketTile width={362} height={380} />
							<div style={{padding: '16px 20px', direction: 'ltr', fontFamily: FONT}}>
								<div style={{fontSize: 26, fontWeight: 900, color: '#1b120d'}}>Ember Bomber Jacket</div>
								<div style={{display: 'flex', gap: 10, alignItems: 'baseline', marginTop: 4}}>
									<span style={{fontSize: 26, fontWeight: 900, color: C.emberDeep}}>$62</span>
									<span style={{fontSize: 18, fontWeight: 700, color: '#9b8f84', textDecoration: 'line-through'}}>$89</span>
								</div>
								<div style={{display: 'flex', gap: 10, marginTop: 14}}>
									{['S', 'M', 'L', 'XL'].map((s) => (
										<div
											key={s}
											style={{
												width: 54,
												height: 44,
												borderRadius: 12,
												border: `2px solid ${s === 'M' ? '#1b120d' : '#d8d0c7'}`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontWeight: 800,
												fontSize: 18,
												color: '#1b120d',
											}}
										>
											{s}
										</div>
									))}
								</div>
								<div
									style={{
										marginTop: 22,
										height: 58,
										borderRadius: 18,
										background: '#1b120d',
										color: '#fff',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontWeight: 800,
										fontSize: 20,
									}}
								>
									Add to cart
								</div>
							</div>
						</div>
						<Ripple x={jx} y={jy} p={clamp01((frame - tapAt) / 14)} color={C.ember} />
						<div style={{position: 'absolute', inset: 0, zIndex: 4}}>
							<Finger x={fingerX} y={fingerY} opacity={fingerO} pressed={pressed} />
						</div>
					</Phone>
				</div>
			</div>
			{/* floating heart on "حلو…" */}
			{frame >= ws(1, 6) ? (
				<div
					style={{
						position: 'absolute',
						left: 760,
						top: 760 - (frame - ws(1, 6)) * 3,
						fontSize: 80,
						opacity: 1 - clamp01((frame - ws(1, 6) - 14) / 10),
						transform: `scale(${sp(frame, ws(1, 6), {damping: 9, stiffness: 200})}) rotate(12deg)`,
					}}
				>
					<span style={{fontFamily: FONT}}>🧡</span>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
