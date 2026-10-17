import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Word} from '../Headline';
import {APPLE, APPLE_PLAIN, BITE} from '../logos';
import {ArText, DrawCircle, DrawLine, DrawPath, Layer, TypeLabel, draw, fadeIn, fadeOut, mix, sp} from '../primitives';
import {C, CX, CY, FONT_AR, FONT_LATIN} from '../theme';
import {END_CARD_START, LINES, lineEnd, lineStart, wordFrame} from '../timing';

// Line 09: "هيدا السر" lands huge; the long description gets slashed.
export const Secret: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(9);
	const end = lineEnd(9);
	if (f < s || f >= end) {
		return null;
	}
	const tail = draw(f, end - 8, 8);
	const slash = wordFrame(9, 4);
	const widths = [820, 760, 800, 700, 780, 520];
	const barsDim = mix(1, 0.35, draw(f, slash + 6, 10));
	return (
		<AbsoluteFill style={{opacity: 1 - tail, transform: `translateY(${-20 * tail}px)`, filter: tail > 0 ? `blur(${8 * tail}px)` : undefined}}>
			<div
				style={{
					position: 'absolute',
					top: 760,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					columnGap: '0.28em',
					direction: 'rtl',
					fontFamily: FONT_AR,
				}}
			>
				{[0, 1].map((i) => (
					<Word key={i} f={f} at={wordFrame(9, i)} text={LINES[8].words[i].text} accent={i === 1} size={120} weight={700} flare={1.8} />
				))}
			</div>
			<Layer style={{opacity: barsDim}}>
				{widths.map((w, i) => {
					const p = sp(f, wordFrame(9, 2) + i * 3, {stiffness: 160});
					return <rect key={i} x={950 - w * Math.min(1, p)} y={1010 + i * 46} width={w * Math.min(1, p)} height={18} rx={9} fill={C.dim} opacity={0.65 * Math.min(1, p * 2)} />;
				})}
			</Layer>
			<Layer style={{filter: `drop-shadow(0 0 14px rgba(${C.accentRgb}, 0.7))`}}>
				<DrawLine x1={150} y1={985} x2={930} y2={1268} progress={draw(f, slash, 8)} strokePx={7} dots={false} />
				<DrawLine x1={930} y1={985} x2={150} y2={1268} progress={draw(f, slash + 5, 8)} strokePx={7} dots={false} />
			</Layer>
		</AbsoluteFill>
	);
};

// Line 10: checklist, each row ticks on its word.
export const Checklist: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(10);
	// Hard cut into line 11: no exit animation.
	if (f < s || f >= lineEnd(10)) {
		return null;
	}
	const rows = [
		{ar: 'مميز', en: 'DISTINCTIVE', at: wordFrame(10, 2)},
		{ar: 'واضح', en: 'CLEAR', at: wordFrame(10, 3)},
		{ar: 'ينعرف بثانية', en: 'RECOGNIZABLE', at: wordFrame(10, 4)},
	];
	return (
		<Layer>
			{rows.map((r, i) => {
				const y = 840 + i * 200;
				const inT = sp(f, s + i * 4);
				const tick = sp(f, r.at, {damping: 14, stiffness: 240});
				const check = draw(f, r.at + 2, 8);
				const done = f >= r.at;
				return (
					<g key={r.en} opacity={Math.min(1, inT * 1.5)} transform={`translate(0 ${(1 - Math.min(1, inT)) * 30})`}>
						<line x1={120} y1={y + 70} x2={960} y2={y + 70} stroke={C.text} strokeOpacity={0.08} strokeWidth={2} />
						<circle cx={920} cy={y} r={36} fill="none" stroke={C.accent} strokeWidth={3} />
						{tick > 0 ? (
							<g style={{filter: `drop-shadow(0 0 16px rgba(${C.accentRgb}, 0.6))`}}>
								<circle cx={920} cy={y} r={36 * tick} fill={C.accent} />
								<path
									d={`M${920 - 15} ${y + 1}L${920 - 4} ${y + 12}L${920 + 17} ${y - 12}`}
									fill="none"
									stroke={C.bg}
									strokeWidth={7}
									strokeLinecap="round"
									strokeLinejoin="round"
									pathLength={1}
									strokeDasharray="1 1"
									strokeDashoffset={1 - check}
								/>
							</g>
						) : null}
						<ArText text={r.ar} x={850} y={y + 22} size={62} weight={700} anchor="start" color={done ? C.text : C.dim} font={FONT_AR} />
						<TypeLabel f={f} start={r.at + 3} text={r.en} x={130} y={y + 10} size={24} />
					</g>
				);
			})}
		</Layer>
	);
};

// Line 11: the only hard cut — an accent bar slams in from the right.
export const BAR_H = 300;
export const Interrupt: React.FC<{f: number; wipe: number}> = ({f, wipe}) => {
	const s = lineStart(11);
	if (f < s || wipe >= 1) {
		return null;
	}
	const slam = sp(f, s, {damping: 14, stiffness: 320});
	const x = (1 - slam) * 1100 - wipe * 1150;
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: x,
					top: CY - BAR_H / 2,
					width: 1080,
					height: BAR_H,
					background: C.accent,
					boxShadow: `0 0 80px rgba(${C.accentRgb}, 0.35)`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					columnGap: '0.28em',
					direction: 'rtl',
					fontFamily: FONT_AR,
				}}
			>
				{[0, 1].map((i) => (
					<Word key={i} f={f} at={wordFrame(11, i)} text={LINES[10].words[i].text} accent={false} size={124} weight={700} color={C.bg} />
				))}
			</div>
		</AbsoluteFill>
	);
};

const SHAPES_Y = 1000;
const SHAPE_X = [260, 540, 820];
const shapeEls = (i: number) => {
	const x = SHAPE_X[i];
	if (i === 0) {
		return <polygon points={`${x},${SHAPES_Y - 90} ${x + 95},${SHAPES_Y + 75} ${x - 95},${SHAPES_Y + 75}`} fill={C.dim} />;
	}
	if (i === 1) {
		return <rect x={x - 82} y={SHAPES_Y - 82} width={164} height={164} rx={30} fill={C.dim} />;
	}
	return <circle cx={x} cy={SHAPES_Y} r={88} fill={C.dim} />;
};

// Line 12: generic shapes, "minimal logo" struck through, a dull mechanical bob.
export const Generic: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(12);
	const end = lineEnd(12);
	if (f < s || f >= end) {
		return null;
	}
	const minimal = wordFrame(12, 9);
	const strike = draw(f, wordFrame(12, 10), 10);
	const generic = wordFrame(12, 12);
	const tq = Math.floor((f - generic) / 3) * 3;
	const bob = f >= generic ? 12 * Math.sin(tq / 5) : 0;
	const textOut = fadeOut(f, end - 8, 8);
	const minimalIn = sp(f, minimal);
	return (
		<AbsoluteFill>
			<Layer style={{filter: 'drop-shadow(0 20px 24px rgba(0,0,0,0.7))'}}>
				{[0, 1, 2].map((i) => {
					const p = sp(f, wordFrame(12, 1) + i * 6, {stiffness: 200});
					const x = SHAPE_X[i];
					return (
						<g key={i} opacity={Math.min(1, p * 2)} transform={`translate(0 ${bob}) translate(${x} ${SHAPES_Y}) scale(${p}) translate(${-x} ${-SHAPES_Y})`}>
							{shapeEls(i)}
						</g>
					);
				})}
			</Layer>
			<Layer style={{opacity: textOut}}>
				<g opacity={Math.min(1, minimalIn * 1.5) * mix(1, 0.55, strike)} transform={`translate(0 ${(1 - Math.min(1, minimalIn)) * 24})`}>
					<text x={CX} y={1250} textAnchor="middle" fill={C.text} style={{fontFamily: FONT_LATIN, fontWeight: 600, fontSize: 60}}>
						minimal logo
					</text>
				</g>
				<DrawLine x1={340} y1={1232} x2={740} y2={1232} progress={strike} strokePx={6} dots={false} />
				<TypeLabel f={f} start={generic} text="GENERIC" x={CX} y={1350} anchor="middle" size={32} />
			</Layer>
		</AbsoluteFill>
	);
};

// Line 13: shapes collapse, the apple returns and splits into "simple shape" vs "strong logo".
export const Keep: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(13);
	const end = lineEnd(13);
	if (f < s || f >= end) {
		return null;
	}
	const collapse = draw(f, s, 12);
	const appear = sp(f, s + 6, {stiffness: 200});
	const split = sp(f, wordFrame(13, 1));
	const size = 300;
	const lx = mix(CX, 280, split);
	const rx = mix(CX, 800, split);
	const ay = 1020;
	const keep = wordFrame(13, 5);
	const k = size / 24;
	const bite = {x: rx - size / 2 + BITE.cx * k, y: ay - size / 2 + BITE.cy * k};
	const tail = draw(f, end - 8, 8);
	const labelIn = (at: number) => Math.min(1, sp(f, at));
	return (
		<AbsoluteFill style={{opacity: 1 - tail, filter: tail > 0 ? `blur(${8 * tail}px)` : undefined}}>
			{collapse < 1 ? (
				<Layer>
					{[0, 1, 2].map((i) => {
						const x = mix(SHAPE_X[i], CX, collapse);
						return (
							<g key={i} opacity={1 - collapse} transform={`translate(${x - SHAPE_X[i]} ${(ay - SHAPES_Y) * collapse}) translate(${SHAPE_X[i]} ${SHAPES_Y}) scale(${1 - collapse}) translate(${-SHAPE_X[i]} ${-SHAPES_Y})`}>
								{shapeEls(i)}
							</g>
						);
					})}
				</Layer>
			) : null}
			<Layer style={{filter: 'drop-shadow(0 24px 28px rgba(0,0,0,0.75))'}}>
				<g opacity={Math.min(1, split * 3)}>
					<DrawPath d={APPLE_PLAIN} x={lx} y={ay} size={size} progress={1} fill={1} color={C.dim} />
				</g>
				<g transform={`translate(${rx} ${ay}) scale(${appear}) translate(${-rx} ${-ay})`}>
					<DrawPath d={APPLE} x={rx} y={ay} size={size} progress={1} fill={1} />
				</g>
			</Layer>
			<Layer>
				<line x1={CX} y1={800} x2={CX} y2={mix(800, 1330, draw(f, wordFrame(13, 1) + 4, 16))} stroke={C.text} strokeOpacity={0.25} strokeWidth={2} />
				<g opacity={labelIn(wordFrame(13, 1) + 8)} transform={`translate(0 ${(1 - labelIn(wordFrame(13, 1) + 8)) * 24})`}>
					<ArText text="شكل بسيط" x={280} y={1265} size={46} color={C.dim} font={FONT_AR} />
				</g>
				<g opacity={labelIn(wordFrame(13, 1) + 12)} transform={`translate(0 ${(1 - labelIn(wordFrame(13, 1) + 12)) * 24})`}>
					<ArText text="لوغو قوي" x={800} y={1265} size={46} weight={700} font={FONT_AR} />
				</g>
				<DrawLine x1={895} y1={1292} x2={705} y2={1292} progress={draw(f, wordFrame(13, 2), 14)} strokePx={4} dots={false} />
			</Layer>
			<Layer style={{filter: `drop-shadow(0 0 14px rgba(${C.accentRgb}, 0.7))`}}>
				<DrawCircle cx={bite.x} cy={bite.y} r={80} progress={draw(f, keep, 14)} color={C.accent} strokePx={4} startAngle={200} />
				<DrawLine x1={bite.x} y1={bite.y - 82} x2={bite.x} y2={bite.y - 150} progress={draw(f, keep + 10, 8)} dots={false} />
				<TypeLabel f={f} start={keep + 14} text="KEEP" x={bite.x} y={bite.y - 166} anchor="middle" size={30} />
			</Layer>
		</AbsoluteFill>
	);
};

const ICONS = {
	comment: 'M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
	file: 'M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v6h6M8 13h8M8 17h6',
	send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
};

// Line 14: CTA bubble with "لوغو", then comment → file → message.
export const Cta: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(14);
	if (f < s || f >= END_CARD_START + 8) {
		return null;
	}
	const bubble = sp(f, wordFrame(14, 1), {damping: 14, stiffness: 200});
	const steps = [
		{d: ICONS.comment, ar: 'تعليق', x: 830, at: wordFrame(14, 6)},
		{d: ICONS.file, ar: 'ملف', x: CX, at: wordFrame(14, 7)},
		{d: ICONS.send, ar: 'رسالة', x: 250, at: wordFrame(14, 8)},
	];
	const arrows = [
		{x1: 740, x2: 630, at: wordFrame(14, 6) + 14},
		{x1: 450, x2: 340, at: wordFrame(14, 7) + 14},
	];
	const out = draw(f, END_CARD_START, 8);
	return (
		<AbsoluteFill style={{opacity: 1 - out, filter: out > 0 ? `blur(${8 * out}px)` : undefined}}>
			{bubble > 0 ? (
				<Layer style={{filter: `drop-shadow(0 0 22px rgba(${C.accentRgb}, 0.35))`}}>
					<g transform={`translate(${CX} 940) scale(${mix(0.6, 1, bubble)}) translate(${-CX} -940)`} opacity={Math.min(1, bubble * 2)}>
						<path
							d={`M${CX - 232} 815h464a48 48 0 0 1 48 48v154a48 48 0 0 1-48 48H${CX - 120}l-70 56 8-56H${CX - 232}a48 48 0 0 1-48-48V863a48 48 0 0 1 48-48z`}
							fill="rgba(251,97,6,0.06)"
							stroke={C.accent}
							strokeWidth={4}
							strokeLinejoin="round"
						/>
					</g>
				</Layer>
			) : null}
			<div style={{position: 'absolute', top: 838, width: '100%', display: 'flex', justifyContent: 'center', direction: 'rtl', fontFamily: FONT_AR}}>
				<Word f={f} at={wordFrame(14, 5)} text="لوغو" accent size={150} weight={700} flare={2} />
			</div>
			<Layer>
				{steps.map((st) => {
					const p = sp(f, st.at, {stiffness: 200});
					const d = draw(f, st.at, 16);
					return (
						<g key={st.ar}>
							<g transform={`translate(${st.x} 1250) scale(${mix(0.8, 1, Math.min(1, p))}) translate(${-st.x} -1250)`}>
								<DrawPath d={st.d} x={st.x} y={1250} size={84} progress={d} fill={0} strokePx={3.5} />
							</g>
							<g opacity={Math.min(1, p * 1.5)}>
								<ArText text={st.ar} x={st.x} y={1350} size={36} font={FONT_AR} />
							</g>
						</g>
					);
				})}
				{arrows.map((a) => {
					const p = draw(f, a.at, 10);
					return (
						<g key={a.x1}>
							<DrawLine x1={a.x1} y1={1250} x2={a.x2} y2={1250} progress={p} strokePx={3} dots={false} />
							{p > 0.85 ? (
								<path d={`M${a.x2 + 16} ${1250 - 14}L${a.x2} 1250L${a.x2 + 16} ${1250 + 14}`} fill="none" stroke={C.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
							) : null}
						</g>
					);
				})}
			</Layer>
		</AbsoluteFill>
	);
};

// Final ~1 s: Reignite end card.
export const EndCard: React.FC<{f: number}> = ({f}) => {
	if (f < END_CARD_START) {
		return null;
	}
	const bg = fadeIn(f, END_CARD_START, 6);
	const logo = sp(f, END_CARD_START + 2, {damping: 14, stiffness: 180});
	const text = sp(f, END_CARD_START + 7);
	const tag = fadeIn(f, END_CARD_START + 11, 8);
	const ember = 0.6 + 0.4 * Math.sin((f - END_CARD_START) / 4);
	return (
		<AbsoluteFill style={{backgroundColor: `rgba(13,13,13,${0.9 * bg})`}}>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingBottom: 120}}>
				<Img
					src={staticFile('reignite-flame.png')}
					style={{
						height: 240,
						transform: `scale(${mix(0.7, 1, logo)})`,
						opacity: Math.min(1, logo * 2),
						filter: `drop-shadow(0 0 ${40 * ember}px rgba(${C.accentRgb}, ${0.55 * ember}))`,
					}}
				/>
				<div
					style={{
						marginTop: 36,
						fontFamily: FONT_LATIN,
						fontWeight: 800,
						fontSize: 58,
						letterSpacing: '0.18em',
						color: C.text,
						opacity: Math.min(1, text * 1.5),
						transform: `translateY(${(1 - Math.min(1, text)) * 24}px)`,
					}}
				>
					REIGNITE GROUP
				</div>
				<div style={{marginTop: 18, fontFamily: FONT_LATIN, fontSize: 26, color: C.text, opacity: 0.7 * tag, letterSpacing: '0.02em'}}>
					Launch sharper. Sell clearer. Scale faster.
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
