import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Kinetic} from '../components/Kinetic';
import {Jacket} from '../components/Jacket';
import {Person} from '../components/People';
import {Shop, ShopStage, walkTo} from '../components/Shop';
import {C, clamp01, sp, ws} from '../theme';
import {FEET} from './S06Shop';

/** Line 07 — the smart salesperson remembers you and waves as you walk past again. */
export const S07Salesperson: React.FC = () => {
	const frame = useCurrentFrame();
	const thinkAt = ws(7, 2); // "ما بينساه"
	const passAt = ws(7, 4); // "بس يرجع يمرق"
	const waveAt = ws(7, 7) - 6; // "بيقلّو"
	const sayAt = ws(7, 8); // "بعدها"
	const spot = sp(frame, ws(7, 0), {damping: 20, stiffness: 80});
	const think = clamp01(sp(frame, thinkAt, {damping: 12})) - clamp01(sp(frame, passAt + 4, {damping: 16}));
	const street = walkTo(frame, passAt + 2, passAt + 74, 560, -80);
	const wave = clamp01(sp(frame, waveAt, {damping: 12})) * (1 - clamp01(sp(frame, sayAt + 40, {damping: 16})));
	const bubble = sp(frame, sayAt - 4, {damping: 12, stiffness: 170});

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 175, left: 40, right: 40}}>
				<Kinetic text="البيّاع الشاطر" at={[ws(7, 0), ws(7, 1)]} size={92} weight={900} highlight={['الشاطر']} />
			</div>
			<ShopStage enter={1}>
				<Shop
					t={frame / 30}
					lights={1}
					jacketOnRack={1}
					jacketGlow={clamp01(sp(frame, ws(7, 9), {damping: 14}))}
					street={<Person x={street.x} y={600} height={300} walk={street.walk} facing={-1} />}
				>
					{/* spotlight on the salesperson */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: `radial-gradient(300px 520px at 960px 620px, rgba(255,170,90,${0.22 * spot}), rgba(0,0,0,${0.45 * spot}) 100%)`,
						}}
					/>
					<Person x={960} y={FEET} height={420} facing={-1} shirt="#2f3138" apron wave={wave} waveT={frame} />
					{/* thought bubble: he remembers the customer and the jacket */}
					<div style={{position: 'absolute', left: 640, top: 150, opacity: clamp01(think), transform: `scale(${0.6 + 0.4 * clamp01(think)})`, transformOrigin: '90% 100%'}}>
						<div style={{position: 'absolute', left: 250, top: 230, width: 26, height: 26, borderRadius: 13, background: '#fff'}} />
						<div style={{position: 'absolute', left: 280, top: 262, width: 16, height: 16, borderRadius: 8, background: '#fff'}} />
						<div style={{width: 270, height: 210, borderRadius: 110, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
							<svg width="90" height="90" viewBox="0 0 40 40">
								<circle cx="20" cy="20" r="14" fill="#E9B48C" />
								<path d="M6 18 Q7 4 21 5 Q35 6 34 17 Q28 11 20 12 Q11 12 6 18 Z" fill="#2a1c16" />
								<circle cx="25" cy="21" r="1.8" fill="#2a1c16" />
							</svg>
							<span style={{fontSize: 34, color: C.ember, fontWeight: 900}}>+</span>
							<Jacket size={100} />
						</div>
					</div>
				</Shop>
			</ShopStage>
			{/* speech bubble */}
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 470,
					width: 760,
					padding: '30px 36px',
					borderRadius: 40,
					background: '#fff',
					boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 4px rgba(255,106,26,0.35)',
					opacity: clamp01(bubble),
					transform: `scale(${0.6 + 0.4 * bubble})`,
					transformOrigin: '100% 100%',
					filter: `blur(${Math.max(0, 1 - bubble) * 8}px)`,
				}}
			>
				<Kinetic
					text='"بعدها القطعة ناطرتك."'
					at={[ws(7, 8), ws(7, 9), ws(7, 10)]}
					size={62}
					weight={900}
					color="#1b120d"
					highlight={['ناطرتك']}
				/>
				<div style={{position: 'absolute', right: 50, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '34px solid #fff'}} />
			</div>
		</AbsoluteFill>
	);
};
