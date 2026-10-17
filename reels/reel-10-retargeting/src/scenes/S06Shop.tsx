import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Kinetic} from '../components/Kinetic';
import {Person} from '../components/People';
import {Shop, ShopStage, walkTo} from '../components/Shop';
import {Sparks} from '../components/Sparks';
import {clamp01, FONT, sp, ws} from '../theme';

export const FEET = 840;

/** Line 06 — a customer walks in, tries the jacket on, walks out empty-handed. */
export const S06Shop: React.FC = () => {
	const frame = useCurrentFrame();
	const enterAt = ws(6, 3) - 4; // "حدا"
	const tryAt = ws(6, 5); // "جرّب"
	const offAt = tryAt + 11;
	const leaveAt = ws(6, 6); // "وطلع"
	const noBuyAt = ws(6, 7); // "بلا"

	const inWalk = walkTo(frame, enterAt, tryAt - 1, -120, 640);
	const outWalk = walkTo(frame, leaveAt, leaveAt + 32, 640, -160);
	const leaving = frame >= leaveAt;
	const pos = leaving ? outWalk : inWalk;
	const wearing = clamp01(sp(frame, tryAt, {damping: 12, stiffness: 200})) - clamp01(sp(frame, offAt, {damping: 14, stiffness: 200}));
	const bag = sp(frame, noBuyAt, {damping: 10, stiffness: 200});

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 175, left: 40, right: 40}}>
				<Kinetic text="تخيّل محل تياب" at={[ws(6, 0), ws(6, 1), ws(6, 2)]} size={92} weight={900} highlight={['تياب']} />
			</div>
			<ShopStage enter={sp(frame, ws(6, 0) - 4, {damping: 15})}>
				<Shop t={frame / 30} lights={sp(frame, ws(6, 1), {damping: 20, stiffness: 60})} jacketOnRack={1 - wearing} jacketGlow={0}>
					<Person x={960} y={FEET} height={420} facing={-1} shirt="#2f3138" apron />
					<Person x={pos.x} y={FEET} height={420} walk={pos.walk} facing={leaving ? -1 : 1} jacket={wearing} />
					<Sparks at={tryAt + 2} x={640} y={560} count={14} seed="try" />
					{frame >= noBuyAt ? (
						<div
							style={{
								position: 'absolute',
								left: pos.x - 50,
								top: 300,
								width: 100,
								height: 100,
								borderRadius: 50,
								background: 'rgba(20,14,10,0.85)',
								border: '2px solid rgba(255,255,255,0.25)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `scale(${bag})`,
								opacity: 1 - clamp01((frame - noBuyAt - 22) / 6),
							}}
						>
							<svg width="56" height="56" viewBox="0 0 24 24">
								<path d="M5 8h14l-1 13H6z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
								<path d="M9 8V6a3 3 0 016 0v2" fill="none" stroke="#fff" strokeWidth="1.8" />
							</svg>
							<span style={{position: 'absolute', right: -6, bottom: -6, width: 40, height: 40, borderRadius: 20, background: '#ff3b4e', color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✕</span>
						</div>
					) : null}
				</Shop>
			</ShopStage>
		</AbsoluteFill>
	);
};
