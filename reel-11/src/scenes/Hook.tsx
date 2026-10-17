import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {APPLE, MCDONALDS, NIKE} from '../logos';
import {DrawCircle, DrawLine, DrawPath, Layer, PenTip, TypeLabel, draw, fadeIn, fadeOut, mix, sp} from '../primitives';
import {C, CX, CY, FONT_LATIN, FONT_MONO} from '../theme';
import {lineStart, wordFrame} from '../timing';

const SLOT = {L: 230, M: 540, R: 850};
const SIZE = 250;

// Dashed outline that traces itself on, with marching dashes.
const DashedTrace: React.FC<{x: number; y: number; w: number; h: number; progress: number; f: number; glow: number}> = ({
	x,
	y,
	w,
	h,
	progress,
	f,
	glow,
}) => {
	if (progress <= 0) {
		return null;
	}
	const per = 2 * (w + h);
	const id = `trace-${x}`;
	const d = `M${x - w / 2 + 24} ${y - h / 2}H${x + w / 2 - 24}a24 24 0 0 1 24 24V${y + h / 2 - 24}a24 24 0 0 1-24 24H${x - w / 2 + 24}a24 24 0 0 1-24-24V${y - h / 2 + 24}a24 24 0 0 1 24-24z`;
	return (
		<g>
			<mask id={id}>
				<path d={d} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray={`${per} ${per}`} strokeDashoffset={per * (1 - progress)} />
			</mask>
			<path
				d={d}
				fill="none"
				stroke={C.accent}
				strokeWidth={2 + glow}
				strokeDasharray="10 9"
				strokeDashoffset={-f * 0.8}
				mask={`url(#${id})`}
			/>
		</g>
	);
};

const Star: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
	const pts = Array.from({length: 10}, (_, i) => {
		const a = (-90 + i * 36) * (Math.PI / 180);
		const rr = i % 2 === 0 ? r : r * 0.45;
		return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
	}).join(' ');
	return <polygon points={pts} fill={C.text} />;
};

// Lines 01–03: the speed-drawn logos, their outlines, then the cluttered badge that
// falls apart until only the swoosh is left.
export const Hook: React.FC<{f: number}> = ({f}) => {
	const s2 = lineStart(2);
	const s3 = lineStart(3);
	if (f >= lineStart(4)) {
		return null;
	}

	// Swoosh: already mid-stroke on frame 0, done at ~1.0 s, then moves to the left slot.
	const swDraw = 0.12 + 0.88 * draw(f, -4, 34);
	const swFill = fadeIn(f, 26, 8);
	const toSlot = sp(f, 30);
	const toCentre = sp(f, s3 + 6);
	const swX = mix(mix(CX, SLOT.L, toSlot), CX, toCentre);
	const swSize = mix(mix(420, SIZE, toSlot), 330, toCentre);

	const apDraw = draw(f, 32, 26);
	const apFill = fadeIn(f, 54, 8);
	const mcDraw = draw(f, 58, 26);
	const mcFill = fadeIn(f, 80, 8);
	const pop = (start: number) => mix(0.94, 1, sp(f, start, {stiffness: 220}));

	const apOut = sp(f, s3 + 2);
	const mcOut = sp(f, s3 + 4);

	// Stopwatch counts real time and stops at 03.0 s.
	const t = Math.min(f, 90) / 30;
	const stopFlash = interpolate(f, [90, 93, 108], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const watchOpacity = fadeOut(f, s3, 8);

	// Line 02 outlines and labels.
	const outlineGlow = interpolate(f, [wordFrame(2, 4), wordFrame(2, 4) + 4, wordFrame(2, 4) + 14], [0, 2, 0.5], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const l2Out = fadeOut(f, s3, 8);

	// Line 03 badge.
	const cut = wordFrame(3, 8);
	const fall = (start: number) => ({
		dy: 150 * sp(f, start, {stiffness: 90}),
		o: fadeOut(f, start + 2, 10),
	});
	const stars = fall(wordFrame(3, 9));
	const word = fall(wordFrame(3, 9) + 4);
	const ribbon = fall(wordFrame(3, 9) + 8);
	const ring = fall(wordFrame(3, 9) + 12);
	const ribbonPop = sp(f, s3 + 40, {stiffness: 200});

	return (
		<AbsoluteFill>
			{/* Logos, with a soft shadow underneath. */}
			<Layer style={{filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.75))'}}>
				<g opacity={1 - Math.min(1, apOut)} transform={`translate(0 ${520 * apOut})`}>
					<g transform={`translate(${SLOT.M} ${CY}) scale(${pop(54)}) translate(${-SLOT.M} ${-CY})`}>
						<DrawPath d={APPLE} x={SLOT.M} y={CY} size={SIZE} progress={apDraw} fill={apFill} strokePx={3} />
					</g>
				</g>
				<g opacity={1 - Math.min(1, mcOut)} transform={`translate(${640 * mcOut} 0)`}>
					<g transform={`translate(${SLOT.R} ${CY}) scale(${pop(80)}) translate(${-SLOT.R} ${-CY})`}>
						<DrawPath d={MCDONALDS} x={SLOT.R} y={CY} size={SIZE} progress={mcDraw} fill={mcFill} strokePx={3} />
					</g>
				</g>
				<g transform={`translate(${swX} ${CY}) scale(${pop(26)}) translate(${-swX} ${-CY})`}>
					<DrawPath d={NIKE} x={swX} y={CY} size={swSize} progress={swDraw} fill={swFill} strokePx={3} />
				</g>
			</Layer>

			{/* Pen tip riding each stroke. */}
			<Layer>
				<PenTip d={NIKE} x={swX} y={CY} size={swSize} progress={swDraw} opacity={swDraw < 1 ? 1 : 0} />
				<PenTip d={APPLE} x={SLOT.M} y={CY} size={SIZE} progress={apDraw} opacity={apDraw > 0 && apDraw < 1 ? 1 : 0} />
				<PenTip d={MCDONALDS} x={SLOT.R} y={CY} size={SIZE} progress={mcDraw} opacity={mcDraw > 0 && mcDraw < 1 ? 1 : 0} />
			</Layer>

			{/* Stopwatch. */}
			<Layer style={{opacity: watchOpacity}}>
				<g transform={`translate(96 760) scale(${1 + 0.08 * stopFlash})`}>
					<circle cx={22} cy={-14} r={18} fill="none" stroke={f >= 90 ? C.accent : C.dim} strokeWidth={3} />
					<line x1={22} y1={-14} x2={22 + 11 * Math.sin(t * 2.1)} y2={-14 - 11 * Math.cos(t * 2.1)} stroke={f >= 90 ? C.accent : C.text} strokeWidth={3} strokeLinecap="round" />
					<rect x={17} y={-38} width={10} height={6} rx={2} fill={f >= 90 ? C.accent : C.dim} />
					<text
						x={56}
						y={0}
						fill={f >= 90 ? C.accent : C.text}
						style={{
							fontFamily: FONT_MONO,
							fontWeight: 500,
							fontSize: 42,
							filter: stopFlash > 0 ? `drop-shadow(0 0 ${18 * stopFlash}px rgba(${C.accentRgb}, 0.9))` : undefined,
						}}
					>
						{`${t.toFixed(1).padStart(4, '0')}s`}
					</text>
				</g>
			</Layer>

			{/* Line 02: traced outlines + labels. */}
			<Layer style={{opacity: l2Out, filter: outlineGlow > 0 ? `drop-shadow(0 0 ${10 * outlineGlow}px rgba(${C.accentRgb}, 0.6))` : undefined}}>
				{(['NIKE', 'APPLE', "MCDONALD'S"] as const).map((label, i) => {
					const x = [SLOT.L, SLOT.M, SLOT.R][i];
					const st = s2 + 4 + i * 6;
					return (
						<g key={label}>
							<DashedTrace x={x} y={CY} w={290} h={290} progress={draw(f, st, 16)} f={f} glow={outlineGlow} />
							<TypeLabel f={f} start={st + 8} text={label} x={x} y={CY + 192} anchor="middle" />
						</g>
					);
				})}
			</Layer>

			{/* Line 03: cluttered badge assembling around the swoosh. */}
			<Layer>
				<g opacity={ring.o} transform={`translate(0 ${ring.dy})`}>
					<DrawCircle cx={CX} cy={CY} r={250} progress={draw(f, s3 + 14, 18)} strokePx={4} />
					<DrawCircle cx={CX} cy={CY} r={228} progress={draw(f, s3 + 18, 18)} strokePx={2} opacity={0.6} />
				</g>
				<g opacity={stars.o} transform={`translate(0 ${stars.dy})`}>
					{[-2, -1, 0, 1, 2].map((k, i) => {
						const p = sp(f, s3 + 24 + i * 3, {stiffness: 220});
						const a = ((-90 + k * 20) * Math.PI) / 180;
						const x = CX + 200 * Math.cos(a);
						const y = CY + 200 * Math.sin(a);
						return (
							<g key={k} transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}>
								<Star x={x} y={y} r={k === 0 ? 20 : 14} />
							</g>
						);
					})}
				</g>
				<g opacity={word.o} transform={`translate(0 ${word.dy})`}>
					<TypeLabel f={f} start={s3 + 30} text="SPORTS CO." x={CX} y={CY - 98} anchor="middle" color={C.text} size={40} weight={800} />
				</g>
				<g
					opacity={ribbon.o * Math.min(1, ribbonPop * 2)}
					transform={`translate(0 ${ribbon.dy}) translate(${CX} ${CY + 150}) scale(${ribbonPop}) translate(${-CX} ${-CY - 150})`}
				>
					<path
						d={`M${CX - 190} ${CY + 122}h380l-26 28 26 28h-380l26-28z`}
						fill={C.bg}
						stroke={C.text}
						strokeWidth={3}
						strokeLinejoin="round"
					/>
					<TypeLabel f={f} start={s3 + 44} text="EST. 1971" x={CX} y={CY + 159} anchor="middle" color={C.text} size={24} />
				</g>
			</Layer>

			{/* + ADD → − SUBTRACT */}
			<Layer>
				<TypeLabel f={f} start={s3 + 16} text="+ ADD" x={110} y={1390} color={f >= cut ? C.dim : C.accent} size={28} />
				<DrawLine x1={104} y1={1381} x2={236} y2={1381} progress={draw(f, cut, 8)} color={C.text} strokePx={3} dots={false} />
				<g style={{filter: f >= cut ? `drop-shadow(0 0 14px rgba(${C.accentRgb}, 0.6))` : undefined}}>
					<TypeLabel f={f} start={cut + 2} text="− SUBTRACT" x={970} y={1390} anchor="end" size={28} />
				</g>
			</Layer>
		</AbsoluteFill>
	);
};
