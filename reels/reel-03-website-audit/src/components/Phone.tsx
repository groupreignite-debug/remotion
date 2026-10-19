import {C, INTER, labelStyle} from '../brand';

// Screen coordinate space shared by both sites: the screen recording is 880px wide and,
// once the iOS status bar and the Safari URL bar are cropped off, 1585px tall.
export const SCREEN_W = 880;
export const SCREEN_H = 1585;

export type PhoneLayout = {x: number; y: number; w: number; rotY: number; rotX: number};

export const lerpLayout = (a: PhoneLayout, b: PhoneLayout, t: number): PhoneLayout => ({
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t,
	w: a.w + (b.w - a.w) * t,
	rotY: a.rotY + (b.rotY - a.rotY) * t,
	rotX: a.rotX + (b.rotX - a.rotX) * t,
});

/**
 * Phone mockup: rounded corners, dynamic-island notch, soft shadow, slight 3D tilt.
 * `children` render in the 880x1585 screen space (clipped), `overlay` in the same
 * space but unclipped (callouts, stamps, leader lines can leave the phone).
 */
export const Phone: React.FC<{
	layout: PhoneLayout;
	children: React.ReactNode;
	overlay?: React.ReactNode;
	progress?: number | null;
	label?: string | null;
	screenFilter?: string;
	opacity?: number;
}> = ({layout, children, overlay = null, progress = null, label = null, screenFilter = 'none', opacity = 1}) => {
	const {x, y, w, rotY, rotX} = layout;
	const k = w / SCREEN_W;
	const h = SCREEN_H * k;
	const bezel = w * 0.032;
	const outerW = w + bezel * 2;
	const outerH = h + bezel * 2;
	const radius = w * 0.13;
	const ring = 22 * (w / 500);

	return (
		<div
			style={{
				position: 'absolute',
				left: x - outerW / 2,
				top: y - outerH / 2,
				width: outerW,
				height: outerH,
				transform: `perspective(2400px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
				opacity,
			}}
		>
			{label ? (
				<div style={{position: 'absolute', top: -58 * (w / 500) - 10, left: 0, right: 0, textAlign: 'center', ...labelStyle(Math.max(18, 24 * (w / 500)))}}>
					{label}
				</div>
			) : null}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: radius + bezel,
					background: 'linear-gradient(145deg, #3a3835 0%, #151413 40%, #0a0a0a 100%)',
					boxShadow: `0 ${w * 0.12}px ${w * 0.24}px rgba(0,0,0,0.65), 0 ${w * 0.02}px ${w * 0.05}px rgba(0,0,0,0.5), inset 0 0 0 1.5px rgba(255,255,255,0.12)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: bezel,
					top: bezel,
					width: w,
					height: h,
					borderRadius: radius,
					overflow: 'hidden',
					background: '#fff',
				}}
			>
				<div style={{width: SCREEN_W, height: SCREEN_H, transform: `scale(${k})`, transformOrigin: '0 0', position: 'relative', filter: screenFilter}}>
					{children}
				</div>
				{/* dynamic island */}
				<div
					style={{
						position: 'absolute',
						top: 20 * k,
						left: w / 2 - 125 * k,
						width: 250 * k,
						height: 72 * k,
						borderRadius: 40 * k,
						background: '#000',
					}}
				/>
				{/* glass reflection */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%)',
						pointerEvents: 'none',
					}}
				/>
			</div>
			{overlay ? (
				<div style={{position: 'absolute', left: bezel, top: bezel, width: SCREEN_W, height: SCREEN_H, transform: `scale(${k})`, transformOrigin: '0 0'}}>
					{overlay}
				</div>
			) : null}
			{progress !== null ? (
				<svg
					width={outerW + ring * 2}
					height={outerH + ring * 2}
					style={{position: 'absolute', left: -ring, top: -ring, overflow: 'visible'}}
				>
					<rect
						x={3}
						y={3}
						width={outerW + ring * 2 - 6}
						height={outerH + ring * 2 - 6}
						rx={radius + bezel + ring}
						fill="none"
						stroke="rgba(255,90,31,0.18)"
						strokeWidth={5}
					/>
					<rect
						x={3}
						y={3}
						width={outerW + ring * 2 - 6}
						height={outerH + ring * 2 - 6}
						rx={radius + bezel + ring}
						fill="none"
						stroke={C.accent}
						strokeWidth={7}
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - progress}
						style={{filter: 'drop-shadow(0 0 10px rgba(255,90,31,0.8))'}}
					/>
				</svg>
			) : null}
		</div>
	);
};

/** Small uppercase chip used next to callouts */
export const Chip: React.FC<{text: string; size: number}> = ({text, size}) => (
	<div
		style={{
			fontFamily: INTER,
			fontWeight: 800,
			fontSize: size,
			letterSpacing: '0.18em',
			color: C.bg,
			background: C.accent,
			padding: `${size * 0.4}px ${size * 0.7}px`,
			borderRadius: size * 0.4,
			whiteSpace: 'nowrap',
			boxShadow: '0 0 30px rgba(255,90,31,0.45)',
		}}
	>
		{text}
	</div>
);
