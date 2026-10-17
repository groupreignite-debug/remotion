import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Glass} from '../components/Devices';
import {Kinetic} from '../components/Kinetic';
import {Sparks} from '../components/Sparks';
import {C, clamp01, FONT, sp, ws} from '../theme';

/** A path drawn right→left (RTL), with the traveller's position at `progress` (0..1). */
const Track: React.FC<{d: string; progress: number; color: string; glow: boolean; reveal: number}> = ({d, progress, color, glow, reveal}) => (
	<svg width={820} height={200} viewBox="0 0 820 200" style={{overflow: 'visible'}}>
		<path d={d} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - reveal} />
		<path
			d={d}
			fill="none"
			stroke={color}
			strokeWidth={16}
			strokeLinecap="round"
			pathLength={1}
			strokeDasharray={`${progress} 1`}
			style={glow ? {filter: 'drop-shadow(0 0 14px rgba(255,106,26,0.9))'} : undefined}
		/>
	</svg>
);

/** Line 09 — new customer starts from zero (long uphill) vs. one who already knows you (halfway there). */
export const S09Why: React.FC = () => {
	const frame = useCurrentFrame();
	const coldAt = ws(9, 3); // "لأن"
	const warmAt = ws(9, 5); // "الشخص"
	const knowsAt = ws(9, 6); // "بيعرفك"
	const zeroAt = ws(9, 11); // "من الصفر"

	const cold = sp(frame, coldAt, {damping: 14});
	const warm = sp(frame, warmAt, {damping: 14});
	const knows = clamp01(sp(frame, knowsAt, {damping: 20, stiffness: 50}));
	const warmProgress = clamp01(warm) * 0.5 + knows * 0.32;
	const coldProgress = 0.02 + clamp01(sp(frame, zeroAt + 8, {damping: 30, stiffness: 20})) * 0.05;
	const shake = frame >= zeroAt && frame < zeroAt + 14 ? (1 - (frame - zeroAt) / 14) * 12 : 0;

	const coldPath = 'M800 180 L700 160 L640 120 L580 140 L500 80 L430 100 L340 40 L260 70 L170 20 L20 10';
	const warmPath = 'M800 110 C 600 110, 300 110, 20 110';

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 175, left: 40, right: 40}}>
				<Kinetic text="وليش هالشي مهم؟" at={[ws(9, 0), ws(9, 1), ws(9, 2)]} size={92} weight={900} highlight={['مهم؟']} />
			</div>
			{/* cold: new customer */}
			<Glass
				style={{
					position: 'absolute',
					top: 420,
					left: 70,
					right: 70,
					height: 360,
					padding: '30px 40px',
					opacity: clamp01(cold) * (1 - 0.35 * knows),
					transform: `scale(${(0.9 + 0.1 * cold) * (1 - 0.04 * knows)}) translateX(${(random(`c${frame}`) - 0.5) * shake}px)`,
					filter: `blur(${Math.max(0, 1 - cold) * 8}px)`,
				}}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl', fontFamily: FONT}}>
					<span style={{fontWeight: 800, fontSize: 52, color: C.white}}>زبون جديد = من الصفر</span>
					<span style={{fontWeight: 900, fontSize: 56, color: C.dim, direction: 'ltr'}}>{Math.round(coldProgress * 100 - 2)}%</span>
				</div>
				<div style={{marginTop: 50}}>
					<Track d={coldPath} progress={coldProgress} color="rgba(255,255,255,0.7)" glow={false} reveal={clamp01(sp(frame, coldAt + 4, {damping: 20, stiffness: 60}))} />
				</div>
			</Glass>
			{/* warm: knows you */}
			<Glass
				style={{
					position: 'absolute',
					top: 830,
					left: 70,
					right: 70,
					height: 360,
					padding: '30px 40px',
					opacity: clamp01(warm),
					transform: `scale(${(0.9 + 0.1 * warm) * (1 + 0.04 * knows)})`,
					filter: `blur(${Math.max(0, 1 - warm) * 8}px)`,
					border: `2px solid rgba(255,106,26,${0.2 + 0.6 * knows})`,
					boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 ${60 * knows}px rgba(255,106,26,${0.45 * knows})`,
				}}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'rtl', fontFamily: FONT}}>
					<span style={{fontWeight: 900, fontSize: 56, color: C.ember}}>زبون بيعرفك</span>
					<span style={{fontWeight: 900, fontSize: 64, color: C.emberHot, direction: 'ltr'}}>{Math.round(warmProgress * 100)}%</span>
				</div>
				<div style={{marginTop: 60, position: 'relative'}}>
					<Track d={warmPath} progress={warmProgress} color={C.ember} glow reveal={clamp01(sp(frame, warmAt + 2, {damping: 20, stiffness: 80}))} />
					{/* traveller dot */}
					<div
						style={{
							position: 'absolute',
							top: 110 - 22,
							left: 800 - warmProgress * 780 - 22,
							width: 44,
							height: 44,
							borderRadius: 22,
							background: C.emberHot,
							boxShadow: '0 0 30px rgba(255,140,40,0.95)',
							opacity: clamp01(warm),
						}}
					/>
					<div style={{position: 'absolute', top: 72, left: 0, fontSize: 60}}>🏁</div>
				</div>
			</Glass>
			<Sparks at={knowsAt + 6} x={540} y={1010} count={18} seed="warm" />
		</AbsoluteFill>
	);
};
