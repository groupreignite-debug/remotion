import {getLength, getPointAtLength} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, spring} from 'remotion';
import {C, FONT_LATIN, H, W} from './theme';
import {FPS} from './timing';

// Spring physics everywhere: damping 14–18, mass 0.8.
export const sp = (
	f: number,
	start: number,
	opts: {dur?: number; damping?: number; stiffness?: number} = {},
) =>
	spring({
		frame: f - start,
		fps: FPS,
		config: {damping: opts.damping ?? 15, mass: 0.8, stiffness: opts.stiffness ?? 120},
		durationInFrames: opts.dur,
	});

// Overshoot-free 0→1 springs for draw-ons and fades.
export const draw = (f: number, start: number, dur: number) =>
	Math.min(1, sp(f, start, {dur, damping: 18}));
export const fadeIn = (f: number, start: number, dur = 8) => draw(f, start, dur);
export const fadeOut = (f: number, start: number, dur = 8) => 1 - draw(f, start, dur);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// A full-frame SVG layer, wrapped in a div so CSS filters (blur, glow) animate.
export const Layer: React.FC<{
	style?: React.CSSProperties;
	children: React.ReactNode;
}> = ({style, children}) => (
	<AbsoluteFill style={style}>
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			{children}
		</svg>
	</AbsoluteFill>
);

// A path in its own coordinate box (24 for simple-icons), placed centred at (x, y)
// at `size` px. Strokes on with `progress`, then fills with `fill`.
export const DrawPath: React.FC<{
	d: string;
	x: number;
	y: number;
	size: number;
	box?: number;
	progress: number;
	fill: number;
	color?: string;
	fillColor?: string;
	strokePx?: number;
	mask?: string;
}> = ({d, x, y, size, box = 24, progress, fill, color = C.text, fillColor, strokePx = 2, mask}) => {
	const k = size / box;
	const len = getLength(d);
	return (
		<g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${k})`} mask={mask}>
			{fill > 0 ? <path d={d} fill={fillColor ?? color} opacity={fill} /> : null}
			{progress > 0 && fill < 1 ? (
				<path
					d={d}
					fill="none"
					stroke={color}
					strokeWidth={strokePx / k}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray={`${len} ${len}`}
					strokeDashoffset={len * (1 - progress)}
					opacity={1 - fill * 0.85}
				/>
			) : null}
		</g>
	);
};

// Glowing accent pen tip that rides the leading edge of a DrawPath stroke.
export const PenTip: React.FC<{
	d: string;
	x: number;
	y: number;
	size: number;
	box?: number;
	progress: number;
	opacity: number;
}> = ({d, x, y, size, box = 24, progress, opacity}) => {
	if (opacity <= 0) {
		return null;
	}
	const k = size / box;
	const p = getPointAtLength(d, getLength(d) * Math.min(progress, 0.9999));
	if (!p) {
		return null;
	}
	const px = x - size / 2 + p.x * k;
	const py = y - size / 2 + p.y * k;
	return (
		<g opacity={opacity}>
			<circle cx={px} cy={py} r={26} fill={C.accent} opacity={0.18} />
			<circle cx={px} cy={py} r={12} fill={C.accent} opacity={0.45} />
			<circle cx={px} cy={py} r={6} fill="#FFD9B8" />
		</g>
	);
};

export const DrawCircle: React.FC<{
	cx: number;
	cy: number;
	r: number;
	progress: number;
	color?: string;
	strokePx?: number;
	dash?: string;
	opacity?: number;
	startAngle?: number;
}> = ({cx, cy, r, progress, color = C.text, strokePx = 2, dash, opacity = 1, startAngle = -90}) => {
	if (progress <= 0) {
		return null;
	}
	const len = 2 * Math.PI * r;
	return (
		<g transform={`rotate(${startAngle} ${cx} ${cy})`} opacity={opacity}>
			{dash ? (
				<mask id={`m-${cx}-${cy}-${r}`}>
					<circle
						cx={cx}
						cy={cy}
						r={r}
						fill="none"
						stroke="#fff"
						strokeWidth={strokePx + 2}
						strokeDasharray={`${len} ${len}`}
						strokeDashoffset={len * (1 - progress)}
					/>
				</mask>
			) : null}
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="none"
				stroke={color}
				strokeWidth={strokePx}
				strokeLinecap="round"
				strokeDasharray={dash ?? `${len} ${len}`}
				strokeDashoffset={dash ? 0 : len * (1 - progress)}
				mask={dash ? `url(#m-${cx}-${cy}-${r})` : undefined}
			/>
		</g>
	);
};

// Construction line with small dots at both ends.
export const DrawLine: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	progress: number;
	color?: string;
	strokePx?: number;
	dots?: boolean;
	opacity?: number;
}> = ({x1, y1, x2, y2, progress, color = C.accent, strokePx = 2, dots = true, opacity = 1}) => {
	if (progress <= 0) {
		return null;
	}
	const ex = x1 + (x2 - x1) * progress;
	const ey = y1 + (y2 - y1) * progress;
	return (
		<g opacity={opacity}>
			<line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={strokePx} strokeLinecap="round" />
			{dots ? (
				<>
					<circle cx={x1} cy={y1} r={4.5} fill={color} />
					<circle cx={ex} cy={ey} r={4.5 * Math.min(1, progress * 3)} fill={color} />
				</>
			) : null}
		</g>
	);
};

// Uppercase, tracked English label that typewrites in.
export const TypeLabel: React.FC<{
	f: number;
	start: number;
	text: string;
	x: number;
	y: number;
	anchor?: 'start' | 'middle' | 'end';
	color?: string;
	size?: number;
	opacity?: number;
	weight?: number;
	upper?: boolean;
}> = ({f, start, text, x, y, anchor = 'start', color = C.accent, size = 24, opacity = 1, weight = 700, upper = true}) => {
	const n = Math.max(0, Math.min(text.length, Math.floor((f - start) * 1.4)));
	if (n === 0 || opacity <= 0) {
		return null;
	}
	const typing = n < text.length;
	return (
		<text
			x={x}
			y={y}
			textAnchor={anchor}
			fill={color}
			opacity={opacity}
			style={{
				fontFamily: FONT_LATIN,
				fontWeight: weight,
				fontSize: size,
				letterSpacing: upper ? '0.18em' : '0.04em',
			}}
		>
			{upper ? text.slice(0, n).toUpperCase() : text.slice(0, n)}
			{typing ? '▍' : ''}
		</text>
	);
};

// Arabic label inside SVG.
export const ArText: React.FC<{
	text: string;
	x: number;
	y: number;
	size: number;
	color?: string;
	weight?: number;
	anchor?: 'start' | 'middle' | 'end';
	opacity?: number;
	font: string;
}> = ({text, x, y, size, color = C.text, weight = 500, anchor = 'middle', opacity = 1, font}) => (
	<text
		x={x}
		y={y}
		direction="rtl"
		textAnchor={anchor}
		fill={color}
		opacity={opacity}
		style={{fontFamily: font, fontWeight: weight, fontSize: size}}
	>
		{text}
	</text>
);
