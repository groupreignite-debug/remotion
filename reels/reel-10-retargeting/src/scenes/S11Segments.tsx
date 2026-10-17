import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BrandAvatar} from '../components/Ads';
import {Glass} from '../components/Devices';
import {Jacket, JacketTile} from '../components/Jacket';
import {Kinetic} from '../components/Kinetic';
import {Sparks} from '../components/Sparks';
import {C, clamp01, FONT, sp, ws} from '../theme';

const Lane: React.FC<{
	top: number;
	frame: number;
	labelAt: number;
	arrowAt: number;
	adAt: number;
	label: string;
	icon: string;
	ad: React.ReactNode;
}> = ({top, frame, labelAt, arrowAt, adAt, label, icon, ad}) => {
	const lane = sp(frame, labelAt - 4, {damping: 15});
	const arrow = clamp01(sp(frame, arrowAt, {damping: 18, stiffness: 120}));
	const adP = sp(frame, adAt, {damping: 10, stiffness: 200});
	return (
		<Glass
			style={{
				position: 'absolute',
				top,
				left: 50,
				right: 50,
				height: 400,
				opacity: clamp01(lane),
				transform: `scale(${0.9 + 0.1 * lane})`,
				filter: `blur(${Math.max(0, 1 - lane) * 8}px)`,
			}}
		>
			{/* label (right side, RTL) */}
			<div style={{position: 'absolute', right: 34, top: 0, bottom: 0, width: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
				<div style={{fontSize: 96}}>{icon}</div>
				<Kinetic text={label} at={labelAt} size={56} weight={900} stagger={4} />
			</div>
			{/* arrow → ad */}
			<svg width={160} height={60} style={{position: 'absolute', left: 400, top: 170}}>
				<path d="M150 30 L20 30" stroke={C.ember} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} style={{filter: 'drop-shadow(0 0 8px rgba(255,106,26,0.9))'}} />
				<path d="M40 10 L16 30 L40 50" stroke={C.ember} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.85 ? 1 : 0} />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: 34,
					top: 30,
					opacity: clamp01(adP),
					transform: `perspective(1200px) rotateY(${(1 - clamp01(adP)) * 8}deg) scale(${0.6 + 0.4 * adP})`,
					filter: `blur(${Math.max(0, 1 - adP) * 8}px)`,
				}}
			>
				{ad}
			</div>
		</Glass>
	);
};

const AdCard: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{width: 340, height: 340, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 24px 50px rgba(0,0,0,0.5)'}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', direction: 'ltr'}}>
			<BrandAvatar size={32} />
			<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 16, color: '#111'}}>jacket.co</span>
			<span style={{fontFamily: FONT, fontWeight: 600, fontSize: 13, color: '#777'}}>Sponsored</span>
		</div>
		{children}
	</div>
);

/** Line 11 — smart segmentation: viewed the product vs. added to cart. */
export const S11Segments: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Lane
				top={330}
				frame={frame}
				labelAt={ws(11, 1)}
				arrowAt={ws(11, 3)}
				adAt={ws(11, 4)}
				label="شاف المنتج"
				icon="👁️"
				ad={
					<AdCard>
						<JacketTile width={340} height={230} />
						<div style={{padding: '6px 14px', fontFamily: FONT, fontWeight: 800, fontSize: 18, color: '#0064E0', direction: 'ltr'}}>Shop now ›</div>
					</AdCard>
				}
			/>
			<Lane
				top={790}
				frame={frame}
				labelAt={ws(11, 8)}
				arrowAt={ws(11, 10)}
				adAt={ws(11, 11)}
				label="حطّو بالسلة"
				icon="🛒"
				ad={
					<AdCard>
						<div style={{height: 290, background: 'linear-gradient(160deg, #2a170d, #120a06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6}}>
							<div style={{position: 'relative'}}>
								<Jacket size={150} />
								<div style={{position: 'absolute', right: -18, bottom: 0, fontSize: 64}}>🛒</div>
							</div>
							<Kinetic text="بعدو ناطرك 🛒" at={[ws(11, 12), ws(11, 13), ws(11, 13) + 3]} size={44} weight={900} highlight={['ناطرك']} />
						</div>
					</AdCard>
				}
			/>
			<Sparks at={ws(11, 4) + 2} x={250} y={530} count={12} seed="l1" />
			<Sparks at={ws(11, 11) + 2} x={250} y={990} count={12} seed="l2" />
		</AbsoluteFill>
	);
};
