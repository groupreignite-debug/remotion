import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrandAvatar} from '../components/Ads';
import {Ripple} from '../components/Devices';
import {JacketTile} from '../components/Jacket';
import {Sparks} from '../components/Sparks';
import {C, clamp01, FONT, sp, ws} from '../theme';

/** Line 12 — purchase ✅, then the ad is switched OFF and slides away. */
export const S12Stop: React.FC = () => {
	const frame = useCurrentFrame();
	const buyAt = ws(12, 1); // "اشترى"
	const toggleAt = ws(12, 3); // "الإعلان"
	const outAt = ws(12, 4) + 4; // "عنو"
	const card = sp(frame, ws(12, 0) - 4, {damping: 14});
	const check = sp(frame, buyAt, {damping: 9, stiffness: 200});
	const off = clamp01(sp(frame, toggleAt, {damping: 14, stiffness: 220}));
	const out = clamp01(sp(frame, outAt, {damping: 16, stiffness: 120}));

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 540 - 230,
					top: 330,
					width: 460,
					borderRadius: 32,
					overflow: 'hidden',
					background: '#fff',
					boxShadow: '0 40px 80px rgba(0,0,0,0.55)',
					opacity: clamp01(card) * (1 - out),
					transform: `perspective(1400px) rotateY(${(1 - clamp01(card)) * -8 + out * 25}deg) translateX(${out * -700}px) scale(${0.9 + 0.1 * card})`,
					filter: `grayscale(${off}) brightness(${1 - 0.35 * off}) blur(${Math.max(0, 1 - card) * 8 + out * 6}px)`,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', direction: 'ltr'}}>
					<BrandAvatar size={38} />
					<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 19, color: '#111'}}>jacket.co</span>
					<span style={{fontFamily: FONT, fontWeight: 600, fontSize: 15, color: '#777'}}>Sponsored</span>
				</div>
				<JacketTile width={460} height={400} />
			</div>
			{/* purchase check */}
			<div
				style={{
					position: 'absolute',
					left: 540 + 120,
					top: 280,
					width: 170,
					height: 170,
					borderRadius: 85,
					background: C.green,
					boxShadow: '0 0 50px rgba(43,214,123,0.6), 0 20px 40px rgba(0,0,0,0.4)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${check}) rotate(${(1 - clamp01(check)) * -40}deg)`,
					opacity: clamp01(check * 3) * (1 - out * 0.3),
				}}
			>
				<svg width="100" height="100" viewBox="0 0 24 24">
					<path d="M5 12.5 L10 17.5 L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp01(sp(frame, buyAt + 4, {damping: 20}))} />
				</svg>
			</div>
			<Sparks at={buyAt + 2} x={745} y={365} count={20} seed="buy" />
			{/* ad toggle */}
			<div
				style={{
					position: 'absolute',
					top: 900,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					opacity: clamp01(sp(frame, ws(12, 2) - 4, {damping: 14})),
				}}
			>
				<div
					style={{
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						gap: 34,
						padding: '26px 40px',
						borderRadius: 40,
						background: 'linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))',
						border: '1.5px solid rgba(255,255,255,0.14)',
						boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
						direction: 'ltr',
						fontFamily: FONT,
					}}
				>
					<span style={{fontWeight: 900, fontSize: 56, color: C.white}}>Ad</span>
					<div style={{position: 'relative', width: 200, height: 100, borderRadius: 50, background: off > 0.5 ? '#3a3a40' : C.ember, boxShadow: off > 0.5 ? 'none' : '0 0 30px rgba(255,106,26,0.7)'}}>
						<div
							style={{
								position: 'absolute',
								top: 8,
								left: 108 - off * 100,
								width: 84,
								height: 84,
								borderRadius: 42,
								background: '#fff',
								boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
							}}
						/>
						<Ripple x={150 - off * 100} y={50} p={clamp01((frame - toggleAt) / 14)} />
					</div>
					<span style={{fontWeight: 900, fontSize: 56, color: off > 0.5 ? C.dim : C.ember, minWidth: 110}}>{off > 0.5 ? 'OFF' : 'ON'}</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
