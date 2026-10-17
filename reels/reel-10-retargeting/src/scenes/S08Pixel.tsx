import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Browser, Glass} from '../components/Devices';
import {Jacket, JacketTile} from '../components/Jacket';
import {Kinetic} from '../components/Kinetic';
import {Person, UserGlyph} from '../components/People';
import {Sparks} from '../components/Sparks';
import {C, clamp01, FONT, sp, ws} from '../theme';

const PixelIcon: React.FC<{size: number; glow: number}> = ({size, glow}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size * 0.28,
			background: 'linear-gradient(160deg, #2a170d, #120a06)',
			border: `${Math.max(2, size * 0.02)}px solid ${C.ember}`,
			boxShadow: `0 0 ${size * 0.35 * glow}px rgba(255,106,26,${0.8 * glow}), inset 0 0 ${size * 0.2}px rgba(255,106,26,0.25)`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: FONT,
			fontWeight: 900,
			fontSize: size * 0.38,
			color: C.emberHot,
			direction: 'ltr',
			textShadow: `0 0 ${size * 0.12}px rgba(255,140,40,0.9)`,
		}}
	>
		{'</>'}
	</div>
);

const LogRow: React.FC<{at: number; frame: number; text: string; icon: string}> = ({at, frame, text, icon}) => {
	const p = sp(frame, at, {damping: 12, stiffness: 190});
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				direction: 'rtl',
				padding: '16px 24px',
				borderRadius: 22,
				background: 'rgba(255,255,255,0.06)',
				border: '1.5px solid rgba(255,106,26,0.35)',
				opacity: clamp01(p),
				transform: `translateX(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})`,
				filter: `blur(${Math.max(0, 1 - p) * 8}px)`,
			}}
		>
			<UserGlyph size={46} color={C.ember} glow={0.6} />
			<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.white}}>{text}</span>
			<span style={{marginRight: 'auto', fontSize: 40}}>{icon}</span>
		</div>
	);
};

/** Line 08 — the salesperson morphs into the Pixel, which sits on your site logging visitors. */
export const S08Pixel: React.FC = () => {
	const frame = useCurrentFrame();
	const start = ws(8, 0);
	const morph = sp(frame, ws(8, 1) - 6, {damping: 16, stiffness: 120}); // → "Pixel"
	const site = sp(frame, ws(8, 5), {damping: 15, stiffness: 120}); // "كود صغير"
	const toCorner = clamp01(sp(frame, ws(8, 6), {damping: 16, stiffness: 110}));
	const visitPage = ws(8, 9); // "مين فات"
	const visitCart = ws(8, 11); // "وعلى أي صفحة"
	const onCart = clamp01(sp(frame, visitCart - 4, {damping: 18}));

	// Pixel icon travels from the centre into the website's corner.
	const iconSize = interpolate(toCorner, [0, 1], [260, 92]);
	const iconX = interpolate(toCorner, [0, 1], [540, 168]);
	const iconY = interpolate(toCorner, [0, 1], [760, 790]);

	// cursor through the site
	const cx = interpolate(frame, [ws(8, 7), visitPage, visitCart - 6, visitCart], [760, 420, 820, 860], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const cy = interpolate(frame, [ws(8, 7), visitPage, visitCart - 6, visitCart], [760, 640, 470, 470], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill>
			{/* phase A: salesperson morphs into the pixel */}
			{morph < 0.98 ? (
				<div
					style={{
						position: 'absolute',
						left: 540,
						top: 1000,
						opacity: 1 - clamp01(morph),
						transform: `scale(${1 - 0.7 * clamp01(morph)})`,
						filter: `blur(${clamp01(morph) * 14}px)`,
						transformOrigin: '0 -240px',
					}}
				>
					<Person x={0} y={0} height={520} facing={-1} shirt="#2f3138" apron />
				</div>
			) : null}
			<div style={{position: 'absolute', top: 175, left: 40, right: 40, opacity: 1 - toCorner}}>
				<Kinetic text="عالإنترنت" at={start} size={80} weight={800} color={C.dim} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 370,
					opacity: clamp01(site),
					transform: `perspective(1600px) rotateY(${(1 - clamp01(site)) * -8}deg) scale(${0.9 + 0.1 * site})`,
					filter: `blur(${Math.max(0, 1 - site) * 8}px)`,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Browser width={900} height={560} url="jacketco.com">
					<div style={{position: 'absolute', inset: 0, background: '#f6f3ef', direction: 'ltr', fontFamily: FONT}}>
						<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 26px', borderBottom: '1px solid #e6dfd6'}}>
							<span style={{fontWeight: 900, fontSize: 26, color: '#1b120d'}}>JACKET CO.</span>
							<span style={{display: 'flex', gap: 22, fontWeight: 700, fontSize: 18, color: '#7b6e63', alignItems: 'center'}}>
								<span>New</span>
								<span>Men</span>
								<span>Women</span>
								<span style={{position: 'relative', fontSize: 26}}>
									🛒
									<span style={{position: 'absolute', top: -8, right: -12, width: 22, height: 22, borderRadius: 11, background: C.ember, color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${onCart})`}}>1</span>
								</span>
							</span>
						</div>
						{/* product page */}
						<div style={{position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, display: 'flex', gap: 26, padding: 26, opacity: 1 - onCart}}>
							<JacketTile width={360} height={380} style={{borderRadius: 18}} />
							<div style={{flex: 1, paddingTop: 20}}>
								<div style={{fontWeight: 900, fontSize: 34, color: '#1b120d'}}>Ember Bomber</div>
								<div style={{fontWeight: 900, fontSize: 30, color: C.emberDeep, marginTop: 6}}>$62</div>
								<div style={{width: '90%', height: 12, borderRadius: 6, background: '#e2dad1', marginTop: 24}} />
								<div style={{width: '70%', height: 12, borderRadius: 6, background: '#e2dad1', marginTop: 12}} />
								<div style={{marginTop: 40, height: 62, borderRadius: 16, background: '#1b120d', color: '#fff', fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Add to cart</div>
							</div>
						</div>
						{/* cart page */}
						<div style={{position: 'absolute', top: 70, left: 0, right: 0, bottom: 0, padding: 30, opacity: onCart, transform: `translateX(${(1 - onCart) * 60}px)`}}>
							<div style={{fontWeight: 900, fontSize: 34, color: '#1b120d'}}>Your cart</div>
							<div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, padding: 16, borderRadius: 18, background: '#fff'}}>
								<div style={{width: 120, height: 120, borderRadius: 14, background: '#f6d9bf', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Jacket size={110} />
								</div>
								<div style={{flex: 1}}>
									<div style={{fontWeight: 800, fontSize: 26, color: '#1b120d'}}>Ember Bomber · M</div>
									<div style={{fontWeight: 900, fontSize: 24, color: C.emberDeep}}>$62</div>
								</div>
							</div>
							<div style={{marginTop: 30, height: 62, borderRadius: 16, background: '#1b120d', color: '#fff', fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Checkout</div>
						</div>
					</div>
				</Browser>
			</div>
			{/* cursor */}
			{frame >= ws(8, 7) ? (
				<svg width="44" height="54" viewBox="0 0 22 27" style={{position: 'absolute', left: cx, top: cy, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'}}>
					<path d="M2 2 L2 22 L7.5 16.5 L11 25 L14.5 23.5 L11 15 L19 15 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
				</svg>
			) : null}
			{/* the pixel */}
			<div
				style={{
					position: 'absolute',
					left: iconX - iconSize / 2,
					top: iconY - iconSize / 2,
					opacity: clamp01(morph),
					transform: `scale(${0.6 + 0.4 * morph})`,
					filter: `blur(${Math.max(0, 1 - morph) * 10}px)`,
				}}
			>
				<PixelIcon size={iconSize} glow={0.6 + 0.4 * Math.sin(frame / 5) ** 2} />
				<div
					style={{
						position: 'absolute',
						top: iconSize + 14 * (1 - toCorner),
						left: '50%',
						transform: `translateX(-50%) scale(${1 - 0.55 * toCorner})`,
						transformOrigin: '50% 0',
						fontFamily: FONT,
						fontWeight: 900,
						fontSize: 74,
						color: C.white,
						direction: 'ltr',
						whiteSpace: 'nowrap',
					}}
				>
					Pixel
				</div>
			</div>
			<div style={{position: 'absolute', top: 1110, left: 0, right: 0, opacity: 1 - toCorner}}>
				<Kinetic text="هوي البيّاع" at={[ws(8, 3), ws(8, 4)]} size={70} weight={900} highlight={['البيّاع']} />
			</div>
			<Sparks at={ws(8, 2)} x={540} y={760} count={22} spread={1.3} seed="px" />
			{/* visitor log */}
			<Glass
				style={{
					position: 'absolute',
					top: 960,
					left: 110,
					right: 110,
					padding: 22,
					display: 'flex',
					flexDirection: 'column',
					gap: 14,
					opacity: clamp01(sp(frame, ws(8, 8), {damping: 14})),
					borderRadius: 30,
				}}
			>
				<LogRow at={visitPage} frame={frame} text="زار: صفحة الجاكيت" icon="🧥" />
				<LogRow at={visitCart} frame={frame} text="زار: السلة" icon="🛒" />
			</Glass>
		</AbsoluteFill>
	);
};
