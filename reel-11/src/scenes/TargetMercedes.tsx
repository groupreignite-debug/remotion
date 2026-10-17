import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {MERCEDES_STAR} from '../logos';
import {DrawCircle, DrawLine, DrawPath, Layer, TypeLabel, draw, fadeIn, fadeOut, mix, sp} from '../primitives';
import {C, CX, CY, FONT_LATIN} from '../theme';
import {lineEnd, lineStart, wordFrame} from '../timing';

const R1 = 70;

// Line 06: 1 : 2 : 3 — three circles, then the fill that makes it Target.
export const Target: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(6);
	const end = lineEnd(6);
	if (f < s || f >= end) {
		return null;
	}
	const geometry = wordFrame(6, 7);
	const fill = sp(f, geometry, {damping: 14, stiffness: 160});
	const fillScale = mix(0.55, 1, fill);
	const fillO = Math.min(1, fill * 2.5);
	const guidesOut = fadeOut(f, geometry, 10);
	const ticks = [
		{r: 1, label: 'r', at: wordFrame(6, 4)},
		{r: 2, label: '2r', at: wordFrame(6, 5)},
		{r: 3, label: '3r', at: wordFrame(6, 6)},
	];
	const tail = draw(f, end - 8, 8);
	const glowAmt = interpolate(f, [geometry, geometry + 6, geometry + 18], [0, 1, 0.4], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const centre = sp(f, s + 6, {stiffness: 220});

	return (
		<AbsoluteFill style={{opacity: 1 - tail, filter: tail > 0 ? `blur(${8 * tail}px)` : undefined}}>
			<Layer style={{filter: `drop-shadow(0 0 ${28 * glowAmt}px rgba(${C.accentRgb}, ${0.5 * glowAmt}))`}}>
				<g transform={`translate(${CX} ${CY}) scale(${1 - 0.3 * tail}) translate(${-CX} ${-CY})`}>
					{fill > 0 ? (
						<g opacity={fillO}>
							<circle cx={CX} cy={CY} r={3 * R1 * fillScale} fill={C.accent} />
							<circle cx={CX} cy={CY} r={2 * R1 * mix(0.7, 1, fill)} fill={C.bg} />
							<circle cx={CX} cy={CY} r={R1 * fillScale} fill={C.accent} />
						</g>
					) : null}
					<g opacity={1 - fillO}>
						{[1, 2, 3].map((m, i) => (
							<DrawCircle key={m} cx={CX} cy={CY} r={m * R1} progress={draw(f, wordFrame(6, 1) + i * 5, 16)} strokePx={2.5} />
						))}
						<circle cx={CX} cy={CY} r={6 * centre} fill={C.accent} />
					</g>
				</g>
			</Layer>
			<Layer style={{opacity: guidesOut}}>
				<DrawLine x1={CX} y1={CY} x2={CX + 3 * R1} y2={CY} progress={draw(f, wordFrame(6, 3), 14)} />
				{ticks.map((t) => {
					const p = sp(f, t.at, {stiffness: 220});
					const x = CX + t.r * R1;
					return (
						<g key={t.label} opacity={Math.min(1, p * 2)}>
							<line x1={x} y1={CY - 12 * p} x2={x} y2={CY + 12 * p} stroke={C.accent} strokeWidth={2.5} />
							<text x={x} y={CY - 26} textAnchor="middle" fill={C.accent} style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: 24, fontStyle: 'italic'}}>
								{t.label}
							</text>
						</g>
					);
				})}
			</Layer>
			<Layer>
				<TypeLabel f={f} start={wordFrame(6, 6)} text="1 : 2 : 3" x={CX} y={CY + 3 * R1 + 84} anchor="middle" size={34} />
			</Layer>
		</AbsoluteFill>
	);
};

const RING = 210;
const STAR_SIZE = (24 * (RING - 12)) / 10.6;
const ARMS = [-90, 30, 150].map((a) => (a * Math.PI) / 180);

// Line 07: ring, three arms, 120° symmetry, everything returns to one centre.
export const Mercedes: React.FC<{f: number}> = ({f}) => {
	const s = lineStart(7);
	const end = lineEnd(7);
	if (f < s || f >= end) {
		return null;
	}
	const ring = draw(f, s + 4, 18);
	const arms = draw(f, s + 18, 20);
	const armsFill = fadeIn(f, s + 34, 10);
	const three = wordFrame(7, 1);
	const balanced = wordFrame(7, 6);
	const point = wordFrame(7, 10);
	const one = wordFrame(7, 11);
	const numbersOut = fadeOut(f, balanced, 8);
	const arcsDim = mix(1, 0.3, draw(f, point, 10));
	const tail = draw(f, end - 8, 8);

	const arc = (a0: number, a1: number, r: number) => {
		const p0 = {x: CX + r * Math.cos(a0), y: CY + r * Math.sin(a0)};
		const p1 = {x: CX + r * Math.cos(a1), y: CY + r * Math.sin(a1)};
		return `M${p0.x} ${p0.y}A${r} ${r} 0 0 1 ${p1.x} ${p1.y}`;
	};
	const dot = sp(f, one, {damping: 14, stiffness: 220});
	const pulse = ((f - one) % 24) / 24;

	return (
		<AbsoluteFill style={{opacity: 1 - tail, filter: tail > 0 ? `blur(${8 * tail}px)` : undefined}}>
			<Layer style={{filter: 'drop-shadow(0 26px 30px rgba(0,0,0,0.75))'}}>
				<g transform={`translate(${CX} ${CY}) scale(${1 - 0.3 * tail}) translate(${-CX} ${-CY})`}>
					<DrawCircle cx={CX} cy={CY} r={RING} progress={ring} strokePx={14} />
					<DrawPath d={MERCEDES_STAR} x={CX} y={CY} size={STAR_SIZE} progress={arms} fill={armsFill} strokePx={3} />
				</g>
			</Layer>

			<Layer style={{opacity: numbersOut}}>
				{ARMS.map((a, i) => {
					const p = sp(f, three + i * 4, {stiffness: 220});
					const x = CX + (RING + 46) * Math.cos(a);
					const y = CY + (RING + 46) * Math.sin(a) + 12;
					return (
						<text key={i} x={x} y={y} textAnchor="middle" fill={C.accent} opacity={Math.min(1, p * 2)} style={{fontFamily: FONT_LATIN, fontWeight: 800, fontSize: 34 * Math.max(0.01, p)}}>
							{i + 1}
						</text>
					);
				})}
				<TypeLabel f={f} start={wordFrame(7, 2)} text="3 ARMS + 1 RING" x={CX} y={CY + RING + 120} anchor="middle" />
			</Layer>

			<Layer style={{opacity: arcsDim}}>
				{ARMS.map((a, i) => {
					const a0 = a + 0.09;
					const a1 = a + (2 * Math.PI) / 3 - 0.09;
					const p = draw(f, balanced + i * 4, 16);
					const mid = a + Math.PI / 3;
					return (
						<g key={i}>
							<path d={arc(a0, a1, RING + 44)} fill="none" stroke={C.accent} strokeWidth={2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" />
							<text
								x={CX + (RING + 84) * Math.cos(mid)}
								y={CY + (RING + 84) * Math.sin(mid) + 9}
								textAnchor="middle"
								fill={C.accent}
								opacity={fadeIn(f, balanced + i * 4 + 10, 6)}
								style={{fontFamily: FONT_LATIN, fontWeight: 700, fontSize: 24}}
							>
								120°
							</text>
						</g>
					);
				})}
			</Layer>
			<Layer style={{opacity: fadeOut(f, point, 8)}}>
				<TypeLabel f={f} start={balanced + 6} text="SYMMETRY" x={CX} y={CY + RING + 160} anchor="middle" />
			</Layer>

			<Layer style={{filter: `drop-shadow(0 0 12px rgba(${C.accentRgb}, 0.7))`}}>
				{ARMS.map((a, i) => (
					<DrawLine
						key={i}
						x1={CX + (RING - 14) * Math.cos(a)}
						y1={CY + (RING - 14) * Math.sin(a)}
						x2={CX}
						y2={CY}
						progress={draw(f, point + i * 3, 12)}
						strokePx={3}
					/>
				))}
				{dot > 0 ? (
					<>
						<circle cx={CX} cy={CY} r={18 + 40 * pulse} fill="none" stroke={C.accent} strokeWidth={3} opacity={(1 - pulse) * 0.8} />
						<circle cx={CX} cy={CY} r={16 * dot} fill={C.accent} />
					</>
				) : null}
				<TypeLabel f={f} start={one + 2} text="ONE CENTER" x={CX} y={CY + RING + 160} anchor="middle" />
			</Layer>
		</AbsoluteFill>
	);
};
