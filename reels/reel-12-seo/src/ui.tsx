import React from 'react';
import {
	AbsoluteFill,
	Html5Audio,
	interpolate,
	random,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {ARABIC, C, INTER} from './theme';
import {line, sec} from './timing';

export const sp = (
	frame: number,
	fps: number,
	at: number,
	damping = 16,
	durationInFrames: number | null = null,
) =>
	spring({
		frame: frame - at,
		fps,
		config: {damping, stiffness: 140, mass: 0.9},
		durationInFrames: durationInFrames ?? undefined,
	});

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

// Short ember "ignite" glow peaking on `at`, ~0.3s (strong = longer and bigger).
export const ignite = (frame: number, at: number, strong: boolean) => {
	const len = strong ? 16 : 9;
	if (frame < at - 2 || frame > at + len) {
		return 0;
	}
	const rise = interpolate(frame, [at - 2, at + 1], [0, 1], clamp);
	const fall = interpolate(frame, [at + 1, at + len], [1, 0], clamp);
	return Math.min(rise, fall) * (strong ? 1.6 : 1);
};

export const glowShadow = (g: number) =>
	g <= 0
		? 'none'
		: `0 0 ${12 + 30 * g}px rgba(255,90,31,${0.85 * Math.min(1, g)}), 0 0 ${4 + 8 * g}px rgba(255,170,120,${0.6 * Math.min(1, g)})`;

/* ---------- Sound ---------- */

export const Sfx: React.FC<{
	at: number;
	name: string;
	volume: number;
}> = ({at, name, volume}) => (
	<Sequence from={at} durationInFrames={60} layout="none">
		<Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
	</Sequence>
);

export const TypingTicks: React.FC<{frames: number[]; seed: string}> = ({
	frames,
	seed,
}) => (
	<>
		{frames.map((f, i) => (
			<Sfx
				key={i}
				at={f}
				name={`tick${Math.floor(random(`${seed}-t${i}`) * 3)}`}
				volume={0.09 + random(`${seed}-v${i}`) * 0.05}
			/>
		))}
	</>
);

/* ---------- Background ---------- */

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	// Grid parallax: drifts slowly (30% of the camera's travel).
	const gx = (frame * 0.12) % 64;
	const gy = (frame * 0.3) % 64;
	const lx = 540 + Math.sin(frame / 70) * 220;
	const ly = 980 + Math.cos(frame / 90) * 260;
	return (
		<AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.03) 2px, transparent 2px)',
					backgroundSize: '64px 64px',
					backgroundPosition: `${gx}px ${-gy}px`,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle 520px at ${lx}px ${ly}px, rgba(255,90,31,0.11), rgba(255,90,31,0.03) 55%, transparent 75%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 85% 70% at 50% 48%, transparent 45%, rgba(0,0,0,0.75) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

export const Grain: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id="grain">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
						numOctaves={2}
						seed={frame % 24}
						stitchTiles="stitch"
					/>
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

// Slow push-in 1 -> 1.04 across the scene.
export const Camera: React.FC<{
	duration: number;
	children: React.ReactNode;
	from?: number;
	to?: number;
}> = ({duration, children, from = 1, to = 1.04}) => {
	const frame = useCurrentFrame();
	const s = interpolate(frame, [0, duration], [from, to], clamp);
	return (
		<AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '50% 52%'}}>
			{children}
		</AbsoluteFill>
	);
};

/* ---------- Headline (the caption) ---------- */

const isLatin = (t: string) => /^[A-Za-z]/.test(t);

// Renders script line `n` word for word. Every word lands on the frame it is
// spoken (frames are relative to the scene, which starts at `sceneStart`).
export const Headline: React.FC<{
	n: number;
	sceneStart: number;
	accents: number[];
	strong?: number[];
	mediumFrom?: number;
	size?: number;
	exitAt: number | null;
	top?: number;
}> = ({n, sceneStart, accents, strong = [], mediumFrom, size = 70, exitAt, top = 200}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = line(n).words;
	// Consecutive Latin words (e.g. "Google Business Profile") stay in LTR order.
	const groups: number[][] = [];
	words.forEach((w, i) => {
		const last = groups[groups.length - 1];
		if (last && isLatin(w.text) && isLatin(words[last[last.length - 1]].text)) {
			last.push(i);
		} else {
			groups.push([i]);
		}
	});
	const exit = exitAt === null ? 0 : interpolate(frame, [exitAt, exitAt + 6], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				top,
				right: 80,
				left: 80,
				direction: 'rtl',
				display: 'flex',
				flexWrap: 'wrap',
				columnGap: size * 0.26,
				rowGap: size * 0.08,
				fontFamily: ARABIC,
				fontSize: size,
				lineHeight: 1.45,
				color: C.text,
				transform: `translateY(${-40 * exit}px)`,
				filter: `blur(${10 * exit}px)`,
				opacity: 1 - exit,
			}}
		>
			{groups.map((g) => (
				<span key={g[0]} style={{display: 'inline-flex', direction: isLatin(words[g[0]].text) ? 'ltr' : 'rtl', columnGap: size * 0.22}}>
					{g.map((i) => {
						const w = words[i];
						const at = Math.max(0, sec(w.start) - sceneStart);
						// Land on the spoken frame: start the spring a few frames early.
						const p = sp(frame, fps, at - 4, 15);
						const isAccent = accents.includes(i);
						const g2 = isAccent ? ignite(frame, at + 2, strong.includes(i)) : 0;
						const medium = mediumFrom !== undefined && i >= mediumFrom;
						return (
							<span key={i} style={{display: 'inline-block', overflow: 'hidden', padding: '0 0.3em 0.12em', margin: '0 -0.3em -0.12em'}}>
								<span
									style={{
										display: 'inline-block',
										transform: `translateY(${(1 - p) * 24}px)`,
										filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
										opacity: Math.min(1, p * 1.4),
										fontWeight: medium && !isAccent ? 500 : 700,
										color: isAccent ? C.accent : medium ? 'rgba(242,238,230,0.86)' : C.text,
										textShadow: glowShadow(g2),
									}}
								>
									{w.text}
								</span>
							</span>
						);
					})}
				</span>
			))}
		</div>
	);
};

/* ---------- Labels & construction lines ---------- */

export const Label: React.FC<{
	text: string;
	at: number;
	style?: React.CSSProperties;
	size?: number;
	color?: string;
}> = ({text, at, style, size = 24, color = C.accent}) => {
	const frame = useCurrentFrame();
	const n = Math.max(0, Math.min(text.length, Math.floor((frame - at) / 1.3)));
	if (frame < at) {
		return null;
	}
	const caretOn = n < text.length || Math.floor((frame - at) / 8) % 2 === 0;
	return (
		<div
			style={{
				position: 'absolute',
				fontFamily: INTER,
				fontWeight: 600,
				fontSize: size,
				letterSpacing: '0.18em',
				textTransform: 'uppercase',
				color,
				whiteSpace: 'nowrap',
				direction: 'ltr',
				...style,
			}}
		>
			{text.slice(0, n)}
			<span style={{opacity: caretOn && frame - at < 50 ? 1 : 0}}>▍</span>
		</div>
	);
};

// 2px line that draws on with strokeDashoffset, with dot ends.
export const DrawLine: React.FC<{
	d: string;
	at: number;
	len: number;
	color?: string;
	dur?: number;
	dots?: [number, number][];
	width?: number;
}> = ({d, at, len, color = C.accent, dur = 14, dots = [], width = 2}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = sp(frame, fps, at, 18, dur);
	return (
		<svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width={1080} height={1920}>
			<path
				d={d}
				fill="none"
				stroke={color}
				strokeWidth={width}
				strokeDasharray={len}
				strokeDashoffset={len * (1 - p)}
				strokeLinecap="round"
			/>
			{dots.map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={5 * Math.min(1, p * 2)} fill={color} opacity={i === 0 ? 1 : p} />
			))}
		</svg>
	);
};

/* ---------- Search bar mockup ---------- */

export const SearchBar: React.FC<{
	shown: string;
	lastType: number;
	x: number;
	y: number;
	w: number;
	h?: number;
	fontSize?: number;
	placeholder?: string;
	highlight?: number;
	focus?: number;
	press?: number;
	children?: React.ReactNode;
}> = ({shown, lastType, x, y, w, h = 120, fontSize = 44, placeholder = 'Search Google', highlight = 0, focus = 1, press = 0, children}) => {
	const frame = useCurrentFrame();
	const rtl = /[\u0600-\u06FF]/.test(shown);
	const caretOn = frame - lastType < 6 || Math.floor(frame / 9) % 2 === 0;
	const hl = Math.max(0, Math.min(1, highlight));
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w,
				height: h,
				borderRadius: h / 2,
				background: C.card,
				border: `2px solid ${focus > 0.5 ? 'rgba(242,238,230,0.22)' : C.line}`,
				boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 ${6 * focus}px rgba(255,90,31,${0.08 * focus})`,
				display: 'flex',
				alignItems: 'center',
				padding: `0 ${h * 0.42}px`,
				gap: 26,
				direction: 'ltr',
				transform: `scale(${1 - 0.03 * press})`,
			}}
		>
			<svg width={h * 0.36} height={h * 0.36} viewBox="0 0 40 40" style={{flexShrink: 0}}>
				<circle cx="17" cy="17" r="11" stroke={C.dim} strokeWidth="3.5" fill="none" />
				<path d="M25 25 L35 35" stroke={C.dim} strokeWidth="3.5" strokeLinecap="round" />
			</svg>
			<div
				style={{
					flex: 1,
					direction: rtl ? 'rtl' : 'ltr',
					fontFamily: rtl ? ARABIC : INTER,
					fontWeight: 500,
					fontSize,
					color: C.text,
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					height: '100%',
				}}
			>
				{shown.length === 0 ? (
					<span style={{color: C.dim, position: 'absolute', left: 30, fontFamily: INTER}}>{placeholder}</span>
				) : null}
				<span
					style={{
						color: `rgb(${242 + 13 * hl},${238 - 148 * hl},${230 - 199 * hl})`,
						background: `rgba(255,90,31,${0.14 * hl})`,
						borderRadius: 12,
						padding: '0 8px',
						textShadow: glowShadow(hl * 0.5),
					}}
				>
					{children ?? shown}
				</span>
				<span
					style={{
						display: 'inline-block',
						width: 4,
						height: fontSize * 1.1,
						background: C.accent,
						marginInlineStart: 2,
						opacity: caretOn ? 1 : 0,
						borderRadius: 2,
						flexShrink: 0,
					}}
				/>
			</div>
		</div>
	);
};

/* ---------- Results card ---------- */

export const ResultCard: React.FC<{
	title: string;
	url: string;
	lines: number;
	style?: React.CSSProperties;
	outline?: number;
	dim?: boolean;
	rank?: string | null;
	children?: React.ReactNode;
}> = ({title, url, lines, style, outline = 0, dim = false, rank = null, children}) => (
	<div
		style={{
			position: 'absolute',
			width: 880,
			height: 170,
			left: 100,
			borderRadius: 26,
			background: dim ? 'rgba(22,21,20,0.6)' : C.card,
			border: `2px solid ${outline > 0 ? `rgba(255,90,31,${outline})` : C.line}`,
			boxShadow: outline > 0 ? `0 0 ${50 * outline}px rgba(255,90,31,${0.35 * outline}), 0 20px 60px rgba(0,0,0,0.5)` : '0 20px 60px rgba(0,0,0,0.5)',
			padding: '28px 36px',
			direction: 'ltr',
			fontFamily: INTER,
			...style,
		}}
	>
		<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{width: 30, height: 30, borderRadius: 15, background: dim ? C.line : '#2E2B28', border: `2px solid ${outline > 0.5 ? C.accent : C.line}`}} />
			<div style={{fontSize: 22, color: C.dim}}>{url}</div>
			{rank ? (
				<div style={{marginLeft: 'auto', fontSize: 22, fontWeight: 700, color: outline > 0.5 ? C.accent : C.dim, letterSpacing: '0.1em'}}>{rank}</div>
			) : null}
		</div>
		<div style={{fontSize: 36, fontWeight: 600, color: dim ? C.dim : C.text, marginTop: 12, fontFamily: /[؀-ۿ]/.test(title) ? ARABIC : INTER, direction: /[؀-ۿ]/.test(title) ? 'rtl' : 'ltr', textAlign: 'left'}}>
			{title}
		</div>
		{Array.from({length: lines}).map((_, i) => (
			<div key={i} style={{height: 10, width: `${70 - i * 18}%`, background: C.line, borderRadius: 5, marginTop: 14}} />
		))}
		{children}
	</div>
);

/* ---------- Flare, badge, exit ---------- */

// Ember flare burst: expanding ring + soft glow centred at (x, y).
export const Flare: React.FC<{x: number; y: number; at: number; size: number; strong?: boolean}> = ({x, y, at, size, strong = false}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > 40) {
		return null;
	}
	const ring = interpolate(t, [0, 22], [0.2, 1], {...clamp, easing: (v) => 1 - (1 - v) ** 3});
	const o = interpolate(t, [0, 3, 30], [0, 1, 0], clamp) * (strong ? 1 : 0.7);
	return (
		<div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					background: 'radial-gradient(circle, rgba(255,120,60,0.55), rgba(255,90,31,0.18) 40%, transparent 70%)',
					transform: `scale(${0.5 + ring * 0.7})`,
					opacity: o,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					border: `${strong ? 4 : 2}px solid ${C.accent}`,
					transform: `scale(${ring * (strong ? 1.3 : 1)})`,
					opacity: o * (1 - ring),
				}}
			/>
		</div>
	);
};

export const Badge: React.FC<{text: string; at: number; x: number; y: number}> = ({text, at, x, y}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = sp(frame, fps, at, 14);
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: 120,
				height: 120,
				borderRadius: 28,
				border: `2px solid ${C.accent}`,
				background: 'rgba(255,90,31,0.08)',
				color: C.accent,
				fontFamily: INTER,
				fontWeight: 800,
				fontSize: 54,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`,
				opacity: Math.min(1, p * 2),
				boxShadow: glowShadow(ignite(frame, at + 4, false)),
			}}
		>
			{text}
		</div>
	);
};

// Visual layer exit: drift up, blur and fade during the last 6 frames.
export const Exit: React.FC<{dur: number; children: React.ReactNode; enabled?: boolean}> = ({dur, children, enabled = true}) => {
	const frame = useCurrentFrame();
	const e = enabled ? interpolate(frame, [dur - 6, dur], [0, 1], clamp) : 0;
	return (
		<AbsoluteFill style={{opacity: 1 - e, filter: e > 0 ? `blur(${e * 10}px)` : undefined, transform: `translateY(${-30 * e}px)`}}>
			{children}
		</AbsoluteFill>
	);
};
