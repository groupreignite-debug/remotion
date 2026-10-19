import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C} from '../brand';

const EMBERS = new Array(16).fill(true).map((_, i) => ({
	x: random(`x${i}`) * 1080,
	y: random(`y${i}`) * 1920,
	size: 3 + random(`s${i}`) * 5,
	speed: 0.35 + random(`v${i}`) * 0.6,
	phase: random(`p${i}`) * Math.PI * 2,
}));

/** Layer 1 (far): grid + moving ember light. Layer 2 (mid): drifting embers. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const lx = 540 + Math.sin(frame / 70) * 240;
	const ly = 980 + Math.cos(frame / 95) * 260;

	return (
		<AbsoluteFill style={{background: C.bg}}>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
					backgroundSize: '64px 64px',
					backgroundPosition: `${(frame * 0.12) % 64}px ${(-frame * 0.3) % 64}px`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(520px 520px at ${lx}px ${ly}px, rgba(255,90,31,0.17), rgba(255,90,31,0.05) 45%, transparent 72%)`,
				}}
			/>
			{EMBERS.map((e, i) => {
				const y = (((e.y - frame * e.speed * 1.6) % 1920) + 1920) % 1920;
				const x = e.x + Math.sin(frame / 40 + e.phase) * 18;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: e.size,
							height: e.size,
							borderRadius: '50%',
							background: C.accent,
							opacity: 0.18 + 0.12 * Math.sin(frame / 20 + e.phase),
							filter: 'blur(1.5px)',
						}}
					/>
				);
			})}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 75% 60% at 50% 46%, transparent 35%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

/** 2% film grain, re-seeded every frame */
export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', opacity: 0.06, mixBlendMode: 'overlay'}}>
			<svg width="1080" height="1920">
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="1080" height="1920" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

/** Shared SVG filters (horizontal motion blur for whip pans) */
export const Filters: React.FC = () => (
	<svg width="0" height="0" style={{position: 'absolute'}}>
		<filter id="whipblur" x="-20%" y="0" width="140%" height="100%">
			<feGaussianBlur stdDeviation="46 0" />
		</filter>
	</svg>
);
