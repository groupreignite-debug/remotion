import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C} from '../theme';
import {wordAt} from '../timing';
import {clamp, DrawLine, Flare, glowShadow, ignite, Sfx, sp} from '../ui';

// Perspective corridor of shelves. World units: x across, y down, z into the screen.
const VP_X = 540;
const VP_Y = 1000;
const FOCAL = 1;
const WALL_X = 520;
const SHELF_YS = [-560, -380, -200, -20, 160, 340];
const SHELF_H = 160;

export const HERO = {wall: 1 as const, shelf: 4, z: 1.0};

type Book = {wall: -1 | 1; shelf: number; z: number; dz: number; h: number; tone: number; hero: boolean};

export const buildBooks = (seed: string, zMax: number): Book[] => {
	const books: Book[] = [];
	for (const wall of [-1, 1] as const) {
		SHELF_YS.forEach((_, shelf) => {
			let z = 0.55;
			let i = 0;
			while (z < zMax) {
				const dz = 0.05 + random(`${seed}${wall}${shelf}${i}`) * 0.07;
				books.push({wall, shelf, z, dz: dz * 0.85, h: SHELF_H * (0.62 + random(`${seed}h${wall}${shelf}${i}`) * 0.32), tone: random(`${seed}t${wall}${shelf}${i}`), hero: false});
				z += dz;
				i++;
			}
		});
	}
	const shelfBooks = books.filter((b) => b.wall === HERO.wall && b.shelf === HERO.shelf);
	const hero = shelfBooks.reduce((a, b) => (Math.abs(b.z - HERO.z) < Math.abs(a.z - HERO.z) ? b : a));
	hero.hero = true;
	return books;
};

const project = (x: number, y: number, z: number) => [VP_X + (x * FOCAL) / z, VP_Y + (y * FOCAL) / z];

export const Library: React.FC<{camZ: number; hero: number; heroGlow: number; dimAll?: number}> = ({camZ, hero, heroGlow, dimAll = 0}) => {
	const books = useMemo(() => buildBooks('lib', 26), []);
	const polys: React.ReactNode[] = [];
	const zNear = 0.35;
	// Shelf boards.
	for (const wall of [-1, 1]) {
		SHELF_YS.forEach((y, s) => {
			const z0 = Math.max(zNear, 0.55 - camZ);
			const z1 = 26 - camZ;
			const yb = y + SHELF_H;
			const [ax, ay] = project(wall * WALL_X, yb, z0);
			const [bx, by] = project(wall * WALL_X, yb, z1);
			polys.push(<line key={`s${wall}${s}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={C.text} strokeOpacity={0.35 * (1 - dimAll)} strokeWidth={2} />);
		});
	}
	books.forEach((b, i) => {
		const z = b.z - camZ;
		if (z < zNear) {
			return;
		}
		const isHero = b.hero;
		if (isHero && heroGlow < 0) {
			return;
		}
		const out = isHero ? hero * 150 : 0;
		const x = b.wall * (WALL_X - out);
		const yb = SHELF_YS[b.shelf] + SHELF_H;
		const yt = yb - b.h;
		const p = [project(x, yb, z), project(x, yt, z), project(x, yt, z + b.dz), project(x, yb, z + b.dz)];
		const fade = interpolate(z, [zNear, 0.9, 10, 24], [0, 1, 0.55, 0.08], clamp) * (1 - dimAll * (isHero ? 0 : 0.85));
		polys.push(
			<polygon
				key={i}
				points={p.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ')}
				fill={isHero ? `rgba(255,90,31,${0.15 + 0.75 * heroGlow})` : `rgba(242,238,230,${0.03 + b.tone * 0.05})`}
				stroke={isHero && heroGlow > 0 ? C.accent : C.text}
				strokeOpacity={isHero && heroGlow > 0 ? 1 : fade * 0.55}
				fillOpacity={isHero ? 1 : fade}
				strokeWidth={isHero ? 3 : 1.2}
				style={isHero && heroGlow > 0 ? {filter: `drop-shadow(0 0 ${20 * heroGlow}px rgba(255,90,31,0.9))`} : undefined}
			/>,
		);
	});
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
			{polys}
		</svg>
	);
};

export const heroAnchor = (camZ: number, hero: number) => {
	const b = buildBooks('lib', 26).find((bk) => bk.hero)!;
	const z = b.z - camZ + b.dz / 2;
	const x = WALL_X - hero * 150;
	const y = SHELF_YS[b.shelf] + SHELF_H - b.h / 2;
	return project(x, y, z);
};

export const Scene03: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const bookAt = r(wordAt(3, 'كتاب'));
	// Camera pulls back to reveal the endless library.
	const pull = sp(frame, fps, -4, 20, Math.max(30, bookAt));
	const camZ = interpolate(pull, [0, 1], [0.6, -0.15]) - interpolate(frame, [0, dur], [0, 0.25], clamp);
	const hero = sp(frame, fps, bookAt - 2, 14);
	const [ax, ay] = heroAnchor(camZ, 0);
	// The "موقعك" book slides out of the shelf toward the viewer.
	const hx = ax - hero * 170;
	const hy = ay - hero * 40;
	const g = ignite(frame, bookAt + 2, false);
	const label = sp(frame, fps, bookAt + 6, 16);
	return (
		<AbsoluteFill>
			<Library camZ={camZ} hero={0} heroGlow={frame >= bookAt - 2 ? -1 : 0} />
			{frame >= bookAt - 2 ? (
				<div
					style={{
						position: 'absolute',
						left: hx - 30,
						top: hy - 120,
						width: 60,
						height: 240,
						borderRadius: 6,
						background: 'linear-gradient(90deg, #FF7A45, #FF5A1F 40%, #C8410F)',
						border: '2px solid #FFB08A',
						transform: `scale(${0.35 + 0.75 * hero}) perspective(600px) rotateY(${(1 - hero) * 55}deg)`,
						boxShadow: `0 0 ${30 + 40 * hero}px rgba(255,90,31,${0.5 + 0.4 * g})`,
					}}
				>
					<div style={{position: 'absolute', left: 8, right: 8, top: 30, height: 3, background: 'rgba(13,13,13,0.5)'}} />
					<div style={{position: 'absolute', left: 8, right: 8, bottom: 30, height: 3, background: 'rgba(13,13,13,0.5)'}} />
				</div>
			) : null}
			<Flare x={hx} y={hy} at={bookAt} size={420} />
			<DrawLine d={`M ${hx - 50} ${hy - 60} L ${hx - 170} ${hy - 220} L ${hx - 330} ${hy - 220}`} len={420} at={bookAt + 4} dots={[[hx - 50, hy - 60], [hx - 330, hy - 220]]} />
			<div
				style={{
					position: 'absolute',
					left: hx - 560,
					top: hy - 220 - 76,
					width: 220,
					textAlign: 'right',
					fontFamily: ARABIC,
					fontWeight: 700,
					fontSize: 54,
					color: C.accent,
					opacity: label,
					transform: `translateY(${(1 - label) * 20}px)`,
					textShadow: glowShadow(g),
				}}
			>
				موقعك
			</div>
			<Sfx at={0} name="whoosh" volume={0.18} />
			<Sfx at={bookAt} name="ignite" volume={0.2} />
		</AbsoluteFill>
	);
};
