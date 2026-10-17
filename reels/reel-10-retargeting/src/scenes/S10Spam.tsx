import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {BrandAvatar} from '../components/Ads';
import {Phone} from '../components/Devices';
import {JacketTile} from '../components/Jacket';
import {C, clamp01, FONT, sp, ws} from '../theme';

export const spamPops = () => {
	const from = ws(10, 3); // "تفرجيه"
	const to = ws(10, 9) + 14; // after "بيزهق"
	const out: number[] = [];
	for (let f = from, gap = 9; f < to; f += gap, gap = Math.max(4, gap - 0.6)) {
		out.push(Math.round(f));
	}
	return out;
};

const AD_H = 300;

const MiniAd: React.FC = () => (
	<div style={{background: '#fff', borderBottom: '6px solid #f0eeeb'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', direction: 'ltr'}}>
			<BrandAvatar size={30} />
			<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 15, color: '#111'}}>jacket.co</span>
			<span style={{fontFamily: FONT, fontWeight: 600, fontSize: 12, color: '#777'}}>Sponsored</span>
		</div>
		<JacketTile width={362} height={AD_H - 52} />
	</div>
);

/** Line 10 — the same ad over and over; the viewer goes 🙂 → 😐 → 😤. */
export const S10Spam: React.FC = () => {
	const frame = useCurrentFrame();
	const pops = spamPops();
	const count = pops.filter((p) => frame >= p).length;
	const last = pops[Math.max(0, count - 1)];
	const offset = count === 0 ? 0 : (count - 1 + clamp01(sp(frame, last, {damping: 14, stiffness: 200}))) * AD_H;

	const faces: [number, string][] = [
		[ws(10, 4), '🙂'], // "نفس"
		[ws(10, 6), '😐'], // "كل يوم"
		[ws(10, 9), '😤'], // "بيزهق"
	];
	const faceIdx = faces.filter(([f]) => frame >= f - 2).length - 1;
	const faceAt = faceIdx >= 0 ? faces[faceIdx][0] : 0;
	const faceP = sp(frame, faceAt - 2, {damping: 9, stiffness: 220});
	const angry = faceIdx === 2;
	const shake = angry ? 10 * Math.max(0, 1 - (frame - faceAt) / 30) : 0;
	const warn = sp(frame, ws(10, 0), {damping: 11, stiffness: 200});
	const counterP = count ? sp(frame, last, {damping: 8, stiffness: 260}) : 0;

	return (
		<AbsoluteFill>
			{/* ⚠️ chip */}
			<div
				style={{
					position: 'absolute',
					top: 180,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						padding: '14px 36px',
						borderRadius: 999,
						background: `rgba(255,59,78,${0.12 + 0.2 * (count / pops.length)})`,
						border: '2px solid rgba(255,59,78,0.6)',
						fontFamily: FONT,
						fontWeight: 900,
						fontSize: 58,
						color: C.white,
						opacity: clamp01(warn),
						transform: `scale(${0.9 + 0.1 * warn})`,
						filter: `blur(${Math.max(0, 1 - warn) * 8}px)`,
						direction: 'rtl',
					}}
				>
					<span>⚠️</span>
					<span>نفس الإعلان</span>
					<span style={{color: C.red, direction: 'ltr', display: 'inline-block', minWidth: 120, transform: `scale(${0.85 + 0.15 * counterP})`}}>×{count + 1}</span>
				</div>
			</div>
			<div style={{position: 'absolute', top: 340, left: 110, perspective: 1600}}>
				<div style={{transform: `rotateY(8deg) translateX(${(random(`p${frame}`) - 0.5) * shake * 0.6}px)`}}>
					<Phone width={390} height={800} screenBg="#fff" statusDark>
						<div style={{position: 'absolute', top: 52, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
							<div style={{position: 'absolute', left: 0, right: 0, top: -(pops.length - 1) * AD_H + offset}}>
								{pops.map((p) => (
									<MiniAd key={p} />
								))}
							</div>
						</div>
					</Phone>
				</div>
			</div>
			{/* the viewer */}
			<div
				style={{
					position: 'absolute',
					top: 560,
					left: 640,
					width: 340,
					height: 340,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 170,
					background: angry ? 'radial-gradient(circle, rgba(255,59,78,0.35), rgba(255,59,78,0) 70%)' : 'radial-gradient(circle, rgba(255,165,31,0.22), rgba(255,165,31,0) 70%)',
					transform: `translate(${(random(`fx${frame}`) - 0.5) * shake}px, ${(random(`fy${frame}`) - 0.5) * shake}px)`,
				}}
			>
				{faceIdx >= 0 ? (
					<span style={{fontSize: 210, fontFamily: FONT, transform: `scale(${0.7 + 0.3 * faceP}) rotate(${(1 - faceP) * -12}deg)`, display: 'inline-block'}}>
						{faces[faceIdx][1]}
					</span>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
