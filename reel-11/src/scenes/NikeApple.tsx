import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {APPLE_BODY, APPLE_LEAF, APPLE_PLAIN, BITE, NIKE} from '../logos';
import {ArText, DrawCircle, DrawLine, DrawPath, Layer, TypeLabel, draw, fadeIn, fadeOut, mix, sp} from '../primitives';
import {C, CX, CY, FONT_AR} from '../theme';
import {lineEnd, lineStart, wordFrame} from '../timing';

const NIKE_BIG = 560;

// Line 04: one shape — motion, direction, character.
export const Nike: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(4);
	const end = lineEnd(4);
	if (f < s || f >= end) {
		return null;
	}
	const size = mix(330, NIKE_BIG, sp(f, wordFrame(4, 1)));
	const k = size / 24;
	const motion = wordFrame(4, 5);
	const direction = wordFrame(4, 6);
	const character = wordFrame(4, 7);

	// Tiny confident overshoot bounce on "شخصية".
	const pulse = sp(f, character, {damping: 14, stiffness: 240}) - sp(f, character + 4, {damping: 14, stiffness: 240});
	const nudge = 26 * (sp(f, motion, {stiffness: 200}) - sp(f, motion + 6, {stiffness: 160}));

	const left = CX - size / 2 - 30;
	const right = CX + size / 2 + 30;
	const top = CY - size / 2 + 7.8 * k - 34;
	const bottom = CY - size / 2 + 16.2 * k + 34;
	const boxD = `M${left} ${top}H${right}V${bottom}H${left}Z`;
	const boxLen = 2 * (right - left + bottom - top);
	const box = draw(f, wordFrame(4, 1) + 6, 18);
	const tailOut = fadeOut(f, end - 8, 8);

	// Arrow riding just above the swoosh's upper curve, in swoosh coordinates.
	const arrowD = 'M1.4 8.6C0.5 11.9 2.6 13.7 6.4 12.5L22.2 5.9';
	const arrow = draw(f, direction, 18);
	const ang = Math.atan2(5.9 - 12.5, 22.2 - 6.4);
	const head = (da: number) => `L${22.2 + 1.1 * Math.cos(ang + da)} ${5.9 + 1.1 * Math.sin(ang + da)}`;

	const ox = CX - size / 2;
	const oy = CY - size / 2;
	const labels = [
		{ar: 'حركة', en: 'MOTION', x: 830, at: motion},
		{ar: 'اتجاه', en: 'DIRECTION', x: CX, at: direction},
		{ar: 'شخصية', en: 'CHARACTER', x: 250, at: character},
	];

	return (
		<AbsoluteFill>
			{/* Speed lines streak in from the left edge. */}
			<Layer>
				{[0, 1, 2].map((i) => {
					const t = sp(f, motion + i * 3, {stiffness: 200, damping: 18});
					const o = fadeOut(f, motion + i * 3 + 9, 7);
					if (t <= 0 || o <= 0) {
						return null;
					}
					const hx = mix(-60, 760, t);
					const y = CY - 70 + i * 62;
					return (
						<line key={i} x1={hx - 300 * (1 - 0.6 * t)} y1={y} x2={hx} y2={y} stroke={i === 1 ? C.accent : C.text} strokeOpacity={0.7 * o} strokeWidth={3} strokeLinecap="round" />
					);
				})}
			</Layer>

			<Layer style={{opacity: tailOut}}>
				<path d={boxD} fill="none" stroke={C.text} strokeOpacity={0.35} strokeWidth={2} strokeDasharray={`${boxLen} ${boxLen}`} strokeDashoffset={boxLen * (1 - box)} />
				{box > 0 ? (
					<>
						<circle cx={left} cy={top} r={4.5} fill={C.accent} />
						<circle cx={right} cy={bottom} r={4.5 * box} fill={C.accent} />
					</>
				) : null}
				<TypeLabel f={f} start={wordFrame(4, 1) + 10} text="1 SHAPE" x={left} y={top - 16} />
			</Layer>

			<Layer style={{filter: 'drop-shadow(0 26px 30px rgba(0,0,0,0.75))'}}>
				<g transform={`translate(${CX + nudge} ${CY}) scale(${1 + 0.16 * pulse}) rotate(${-7 * pulse}) translate(${-CX} ${-CY})`}>
					<DrawPath d={NIKE} x={CX} y={CY} size={size} progress={1} fill={1} />
				</g>
			</Layer>

			<Layer style={{opacity: tailOut, filter: `drop-shadow(0 0 10px rgba(${C.accentRgb}, 0.6))`}}>
				{arrow > 0 ? (
					<g transform={`translate(${ox + nudge} ${oy}) scale(${k})`}>
						<path d={arrowD} fill="none" stroke={C.accent} strokeWidth={4 / k} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} />
						{arrow > 0.9 ? (
							<path d={`M22.2 5.9${head(Math.PI - 0.5)}M22.2 5.9${head(Math.PI + 0.5)}`} fill="none" stroke={C.accent} strokeWidth={4 / k} strokeLinecap="round" opacity={(arrow - 0.9) * 10} />
						) : null}
					</g>
				) : null}
			</Layer>

			<Layer style={{opacity: tailOut}}>
				{labels.map((l) => {
					const t = sp(f, l.at - 2);
					return (
						<g key={l.en} opacity={Math.min(1, t * 1.5)} transform={`translate(0 ${(1 - Math.min(1, t)) * 24})`}>
							<ArText text={l.ar} x={l.x} y={1300} size={42} font={FONT_AR} />
							<TypeLabel f={f} start={l.at + 2} text={l.en} x={l.x} y={1346} anchor="middle" size={22} />
						</g>
					);
				})}
			</Layer>
		</AbsoluteFill>
	);
};

// Line 05: plain apple silhouette → construction → the bite cut out → the real logo.
export const APPLE_SIZE = 460;
export const Apple: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(5);
	const end = lineEnd(5);
	if (f < s || f >= end) {
		return null;
	}
	const size = APPLE_SIZE;
	const k = size / 24;
	const ox = CX - size / 2;
	const oy = CY - size / 2;
	const P = (x: number, y: number) => ({x: ox + x * k, y: oy + y * k});

	// Match-cut from the swoosh.
	const swOut = draw(f, s, 12);
	const inT = sp(f, s + 2);
	const outline = draw(f, s + 2, 20);
	const fill = fadeIn(f, s + 18, 10);

	const bite = wordFrame(5, 4);
	const biteC = P(BITE.cx, BITE.cy);
	const biteR = BITE.r * k;
	const cutR = biteR * draw(f, bite + 8, 10);
	const remember = wordFrame(5, 10);
	const clean = f >= remember;
	const constructionOut = fadeOut(f, remember, 10);
	const leaf = sp(f, remember + 3, {damping: 14, stiffness: 200});
	const leafBase = P(12.9, 5.4);
	const ring = draw(f, wordFrame(5, 11), 22);
	const glowAmt = interpolate(f, [wordFrame(5, 11), wordFrame(5, 11) + 6, wordFrame(5, 11) + 18], [0, 1, 0.35], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const tail = draw(f, end - 8, 8);

	const circles = [
		{c: P(12.2, 15.6), r: 8.4},
		{c: P(8.1, 12.4), r: 6.2},
		{c: P(16.4, 12.4), r: 6.2},
		{c: P(8.6, 19.6), r: 4.4},
		{c: P(16.3, 19.6), r: 4.4},
	];

	return (
		<AbsoluteFill>
			{swOut < 1 ? (
				<Layer style={{opacity: 1 - swOut, filter: `blur(${10 * swOut}px)`}}>
					<g transform={`translate(${CX} ${CY}) scale(${1 - 0.35 * swOut}) translate(${-CX} ${-CY})`}>
						<DrawPath d={NIKE} x={CX} y={CY} size={NIKE_BIG} progress={1} fill={1} />
					</g>
				</Layer>
			) : null}

			<Layer
				style={{
					opacity: 1 - tail,
					filter: `blur(${(1 - Math.min(1, inT)) * 12 + tail * 8}px) drop-shadow(0 26px 30px rgba(0,0,0,0.75)) drop-shadow(0 0 ${30 * glowAmt}px rgba(${C.accentRgb}, ${0.55 * glowAmt}))`,
				}}
			>
				<defs>
					<mask id="apple-bite" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
						<rect width={1080} height={1920} fill="#fff" />
						<circle cx={biteC.x} cy={biteC.y} r={cutR} fill="#000" />
					</mask>
				</defs>
				<g transform={`translate(${CX} ${CY}) scale(${mix(1.12, 1, Math.min(1, inT)) * (1 - 0.4 * tail)}) translate(${-CX} ${-CY})`}>
					{clean ? (
						<>
							<DrawPath d={APPLE_BODY} x={CX} y={CY} size={size} progress={1} fill={1} />
							<g transform={`translate(${leafBase.x} ${leafBase.y}) scale(${leaf}) translate(${-leafBase.x} ${-leafBase.y})`}>
								<DrawPath d={APPLE_LEAF} x={CX} y={CY} size={size} progress={1} fill={1} />
							</g>
						</>
					) : (
						<g mask="url(#apple-bite)">
							<DrawPath d={APPLE_PLAIN} x={CX} y={CY} size={size} progress={outline} fill={fill} strokePx={3} />
						</g>
					)}
				</g>
			</Layer>

			<Layer style={{opacity: constructionOut}}>
				<TypeLabel f={f} start={wordFrame(5, 1)} text="SILHOUETTE" x={ox + 20} y={oy + 60} />
				{circles.map((c, i) => (
					<DrawCircle key={i} cx={c.c.x} cy={c.c.y} r={c.r * k} progress={draw(f, wordFrame(5, 2) - 6 + i * 4, 18)} opacity={0.35} />
				))}
				<DrawCircle cx={biteC.x} cy={biteC.y} r={biteR} progress={draw(f, bite, 12)} color={C.accent} strokePx={3} startAngle={180} />
				<DrawLine x1={biteC.x + 40} y1={biteC.y - 90} x2={930} y2={860} progress={draw(f, bite + 12, 10)} />
				<TypeLabel f={f} start={bite + 18} text="THE BITE" x={930} y={838} anchor="middle" />
			</Layer>

			{/* Accent glow ring pulse on "ما تنتسى". */}
			{ring > 0 ? (
				<Layer style={{opacity: (1 - ring) * (1 - tail)}}>
					<circle cx={CX} cy={CY + 40} r={mix(240, 340, ring)} fill="none" stroke={C.accent} strokeWidth={4} />
				</Layer>
			) : null}
		</AbsoluteFill>
	);
};
