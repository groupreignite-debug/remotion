import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C, INTER} from '../theme';
import {wordAt} from '../timing';
import {DrawLine, Flare, Label, Sfx, sp} from '../ui';

const Stamp: React.FC<{text: string; at: number; color: string; frame: number; fps: number}> = ({text, at, color, frame, fps}) => {
	const p = sp(frame, fps, at, 11);
	if (frame < at) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: 250,
				transform: `translate(-50%, 0) rotate(-9deg) scale(${2.2 - 1.2 * p})`,
				opacity: Math.min(1, p * 3),
				border: `6px solid ${color}`,
				borderRadius: 14,
				padding: '12px 30px',
				fontFamily: INTER,
				fontWeight: 800,
				fontSize: 52,
				letterSpacing: '0.12em',
				color,
				whiteSpace: 'nowrap',
				backfaceVisibility: 'hidden',
			}}
		>
			{text}
		</div>
	);
};

const CardFace: React.FC<{children?: React.ReactNode; back?: boolean}> = ({children, back = false}) => (
	<div
		style={{
			position: 'absolute',
			inset: 0,
			borderRadius: 22,
			background: '#1B1917',
			border: `2px solid ${back ? C.accent : 'rgba(242,238,230,0.3)'}`,
			backfaceVisibility: 'hidden',
			transform: back ? 'rotateY(180deg)' : undefined,
			padding: '36px 44px',
			boxShadow: back ? '0 0 60px rgba(255,90,31,0.25)' : '0 30px 80px rgba(0,0,0,0.6)',
		}}
	>
		<div style={{direction: 'rtl', fontFamily: ARABIC, fontWeight: 700, fontSize: 50, color: C.text}}>موقعك</div>
		<div style={{height: 2, background: back ? 'rgba(255,90,31,0.5)' : C.line, marginTop: 18}} />
		{[0, 1, 2, 3].map((i) => (
			<div key={i} style={{height: 2, background: C.line, marginTop: 54}} />
		))}
		{children}
	</div>
);

export const Scene04: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const notReg = r(wordAt(4, 'مسجّل'));
	const flip = r(wordAt(4, 'هيدا'));
	const idx = r(wordAt(4, 'Indexing'));

	const drawer = sp(frame, fps, -2, 16);
	const rise = sp(frame, fps, 8, 15);
	const flipP = sp(frame, fps, flip - 2, 14);
	const shelf = sp(frame, fps, flip + 4, 16);

	const cardTop = interpolate(rise, [0, 1], [1260, 640]);
	return (
		<AbsoluteFill>
			{/* Index drawer */}
			<div
				style={{
					position: 'absolute',
					left: 190,
					top: 1240,
					width: 700,
					height: 260,
					transform: `translateY(${(1 - drawer) * 120 + shelf * 200}px)`,
					opacity: drawer * (1 - shelf),
				}}
			>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 90, display: 'flex', gap: 10, padding: '0 30px'}}>
					{Array.from({length: 14}).map((_, i) => (
						<div key={i} style={{flex: 1, height: 70 + (i % 3) * 10, marginTop: 20 - (i % 3) * 10, background: '#1E1C1A', border: `2px solid ${C.line}`, borderRadius: 6}} />
					))}
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 80, bottom: 0, borderRadius: 18, background: C.card, border: `2px solid rgba(242,238,230,0.25)`}}>
					<div style={{position: 'absolute', left: '50%', top: 70, width: 180, height: 44, marginLeft: -90, borderRadius: 22, border: `3px solid ${C.dim}`}} />
					<div style={{position: 'absolute', left: '50%', top: 130, marginLeft: -60, width: 120, fontFamily: INTER, fontSize: 20, letterSpacing: '0.18em', color: C.dim, textAlign: 'center'}}>
						INDEX
					</div>
				</div>
			</div>
			{/* Catalogue card, flips to the indexed version */}
			<div style={{position: 'absolute', left: 190, top: cardTop, width: 700, height: 460, perspective: 1600, opacity: Math.min(1, rise * 2)}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						transformStyle: 'preserve-3d',
						transform: `rotateY(${180 * flipP}deg) rotateZ(${(1 - rise) * -4}deg)`,
					}}
				>
					<CardFace>
						<Stamp text="NOT INDEXED" at={notReg} color={C.dim} frame={frame} fps={fps} />
					</CardFace>
					<CardFace back>
						<Stamp text="INDEXED ✓" at={flip + 8} color={C.accent} frame={frame} fps={fps} />
					</CardFace>
				</div>
			</div>
			{/* Book on the shelf, connected to the card */}
			<div style={{position: 'absolute', left: 120, top: 1190, width: 840, height: 300, opacity: shelf, transform: `translateY(${(1 - shelf) * 60}px)`}}>
				<div style={{position: 'absolute', left: 0, right: 0, bottom: 40, height: 3, background: 'rgba(242,238,230,0.35)'}} />
				{Array.from({length: 16}).map((_, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							bottom: 43,
							left: 20 + i * 51,
							width: 42,
							height: 150 + ((i * 37) % 60),
							border: `2px solid ${i === 11 ? C.accent : 'rgba(242,238,230,0.3)'}`,
							background: i === 11 ? 'rgba(255,90,31,0.75)' : 'rgba(242,238,230,0.04)',
							borderRadius: 4,
							boxShadow: i === 11 ? '0 0 30px rgba(255,90,31,0.7)' : undefined,
						}}
					/>
				))}
			</div>
			{frame > flip ? (
				<DrawLine d="M 540 1100 L 540 1170 L 682 1170 L 682 1260" len={360} at={flip + 10} dots={[[540, 1100], [682, 1260]]} />
			) : null}
			<Label text="Indexing" at={idx + 4} style={{left: 190, top: 590}} />
			<Flare x={540} y={830} at={flip + 8} size={700} />
			<Sfx at={0} name="whoosh" volume={0.15} />
			<Sfx at={notReg} name="thud" volume={0.35} />
			<Sfx at={flip - 2} name="whoosh" volume={0.16} />
			<Sfx at={flip + 8} name="thud" volume={0.32} />
			<Sfx at={idx} name="ignite" volume={0.18} />
		</AbsoluteFill>
	);
};
