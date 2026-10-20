import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER} from '../theme';
import {wordAt} from '../timing';
import {Badge, clamp, DrawLine, Flare, Label, Sfx, sp} from '../ui';

const Phone: React.FC<{x: number; y: number; scale: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, scale, children, style}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			width: 360,
			height: 740,
			borderRadius: 56,
			border: '3px solid rgba(242,238,230,0.5)',
			background: '#121110',
			padding: 22,
			transform: `scale(${scale})`,
			boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
			...style,
		}}
	>
		<div style={{width: 110, height: 26, borderRadius: 13, background: '#000', margin: '0 auto 18px'}} />
		<div style={{position: 'relative', height: 640, borderRadius: 36, background: C.card, overflow: 'hidden'}}>{children}</div>
	</div>
);

export const Scene08: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const google = r(wordAt(8, 'غوغل'));
	const opens = r(wordAt(8, 'بيفتح'));
	const fast = r(wordAt(8, 'بسرعة'));
	const mobile = r(wordAt(8, 'عالموبايل'));

	const phoneIn = sp(frame, fps, google - 6, 16);
	const load = interpolate(frame, [opens, fast + 4], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 2.4});
	const loaded = sp(frame, fps, fast + 4, 15);
	const needle = sp(frame, fps, fast - 2, 11);
	const gaugeIn = sp(frame, fps, google, 16);
	const ghost = interpolate(frame, [mobile, mobile + 20], [0.45, 0], clamp);

	// Gauge geometry
	const gx = 790;
	const gy = 1180;
	const R = 170;
	const angle = interpolate(needle, [0, 1], [-170, -28]);
	const arc = (a0: number, a1: number) => {
		const p0 = [gx + R * Math.cos((a0 * Math.PI) / 180), gy + R * Math.sin((a0 * Math.PI) / 180)];
		const p1 = [gx + R * Math.cos((a1 * Math.PI) / 180), gy + R * Math.sin((a1 * Math.PI) / 180)];
		return `M ${p0[0]} ${p0[1]} A ${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}`;
	};
	const spin = (frame * 12) % 360;

	return (
		<AbsoluteFill>
			<Badge text="01" at={2} x={80} y={600} />
			<Label text="Tip" at={6} color={C.dim} style={{left: 222, top: 642}} />
			{/* Ghost slow phone stuck on a spinner */}
			<Phone x={20} y={800} scale={0.7} style={{opacity: ghost * phoneIn, filter: 'blur(2px)'}}>
				<div style={{position: 'absolute', left: '50%', top: '45%', width: 70, height: 70, marginLeft: -35, borderRadius: 35, border: `6px solid ${C.line}`, borderTopColor: C.dim, transform: `rotate(${spin}deg)`}} />
			</Phone>
			<Phone x={150} y={760} scale={0.92} style={{transform: `translateY(${(1 - phoneIn) * 200}px) scale(0.92)`, opacity: phoneIn}}>
				<div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${load * 100}%`, background: C.accent, boxShadow: '0 0 20px rgba(255,90,31,0.8)', opacity: 1 - loaded}} />
				<div style={{opacity: loaded, transform: `translateY(${(1 - loaded) * 30}px)`, padding: 20}}>
					<div style={{height: 200, borderRadius: 18, background: 'linear-gradient(135deg, #2a2522, #1a1817)'}} />
					<div style={{height: 22, width: '70%', borderRadius: 11, background: C.text, marginTop: 24, opacity: 0.85}} />
					<div style={{height: 12, width: '90%', borderRadius: 6, background: C.line, marginTop: 20}} />
					<div style={{height: 12, width: '75%', borderRadius: 6, background: C.line, marginTop: 14}} />
					<div style={{height: 56, width: 170, borderRadius: 28, background: C.accent, marginTop: 30}} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: '42%', textAlign: 'center', fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.text, opacity: frame >= opens && loaded < 0.3 ? 1 - loaded * 3 : 0}}>
					{(load * 0.8).toFixed(1)}s
				</div>
			</Phone>
			{/* Speed gauge */}
			<div style={{position: 'absolute', inset: 0, opacity: gaugeIn, transform: `translateY(${(1 - gaugeIn) * 60}px)`}}>
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<path d={arc(-180, -60)} stroke={C.line} strokeWidth={18} fill="none" strokeLinecap="round" />
					<path d={arc(-55, 0)} stroke={C.accent} strokeWidth={18} fill="none" strokeLinecap="round" opacity={0.4 + 0.6 * needle} />
					<line
						x1={gx}
						y1={gy}
						x2={gx + (R - 30) * Math.cos((angle * Math.PI) / 180)}
						y2={gy + (R - 30) * Math.sin((angle * Math.PI) / 180)}
						stroke={C.text}
						strokeWidth={6}
						strokeLinecap="round"
					/>
					<circle cx={gx} cy={gy} r={14} fill={C.accent} />
				</svg>
			</div>
			<DrawLine d={`M ${gx} ${gy + 40} L ${gx} ${gy + 140}`} len={100} at={fast + 4} dots={[[gx, gy + 40]]} />
			<Label text="Mobile speed" at={fast + 8} style={{right: 60, top: gy + 160}} />
			<Flare x={gx + 120} y={gy - 90} at={fast + 6} size={400} />
			<Sfx at={0} name="whoosh" volume={0.15} />
			<Sfx at={2} name="pop" volume={0.18} />
			<Sfx at={fast - 2} name="whoosh" volume={0.15} />
			<Sfx at={fast + 6} name="ignite" volume={0.18} />
		</AbsoluteFill>
	);
};
