import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BrandAvatar, FacebookSidebar, InstagramFeed, NewsSite, YouTubePreroll} from '../components/Ads';
import {Browser, Phone} from '../components/Devices';
import {JacketTile} from '../components/Jacket';
import {Sparks} from '../components/Sparks';
import {C, clamp01, FONT, lineStart, sp, ws} from '../theme';

export const FREEZE_AT = 246; // 8.2s — everything stacks and freezes before "صدفة؟"

const InstagramStory: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: '#000'}}>
		<JacketTile width={362} height={772} tag={false} />
		<div style={{position: 'absolute', top: 58, left: 12, right: 12, display: 'flex', gap: 4}}>
			{[1, 0.6, 0].map((v, i) => (
				<div key={i} style={{flex: 1, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.25)', overflow: 'hidden'}}>
					<div style={{width: `${v * 100}%`, height: '100%', background: '#fff'}} />
				</div>
			))}
		</div>
		<div style={{position: 'absolute', top: 74, left: 14, display: 'flex', alignItems: 'center', gap: 8, direction: 'ltr'}}>
			<BrandAvatar size={36} />
			<span style={{fontFamily: FONT, fontWeight: 800, fontSize: 16, color: '#1b120d'}}>jacket.co</span>
			<span style={{fontFamily: FONT, fontWeight: 600, fontSize: 14, color: '#5a4b40'}}>Sponsored</span>
		</div>
		<div
			style={{
				position: 'absolute',
				bottom: 40,
				left: '50%',
				transform: 'translateX(-50%)',
				padding: '12px 30px',
				borderRadius: 26,
				background: '#fff',
				fontFamily: FONT,
				fontWeight: 800,
				fontSize: 18,
				color: '#111',
				boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
				direction: 'ltr',
				whiteSpace: 'nowrap',
			}}
		>
			⌃ Shop now
		</div>
	</div>
);

type Card = {
	at: number;
	pop: number;
	label: string;
	node: (frame: number) => React.ReactNode;
	stackRot: number;
	freeze: {x: number; y: number; rot: number; scale: number};
};

/** Line 02 — the same jacket ad pops up everywhere you go. */
export const S02Follow: React.FC = () => {
	const frame = useCurrentFrame();

	const cards: Card[] = [
		{
			at: lineStart(2) + 2,
			pop: ws(2, 3), // "الجاكيت"
			label: 'Instagram',
			stackRot: -3,
			freeze: {x: -235, y: -60, rot: -11, scale: 0.6},
			node: (f) => (
				<Phone width={390} height={800} screenBg="#fff" statusDark>
					<InstagramFeed adP={sp(f, ws(2, 3), {damping: 10, stiffness: 200})} />
				</Phone>
			),
		},
		{
			at: ws(2, 6), // "Instagram"
			pop: ws(2, 6),
			label: 'Stories',
			stackRot: 4,
			freeze: {x: 240, y: -90, rot: 10, scale: 0.6},
			node: () => (
				<Phone width={390} height={800}>
					<InstagramStory />
				</Phone>
			),
		},
		{
			at: ws(2, 8), // "YouTube"
			pop: ws(2, 8),
			label: 'YouTube',
			stackRot: -2,
			freeze: {x: 10, y: 30, rot: -2, scale: 0.64},
			node: (f) => (
				<Phone width={390} height={800}>
					<YouTubePreroll t={clamp01((f - ws(2, 8)) / 40)} />
				</Phone>
			),
		},
		{
			at: ws(2, 9), // "بكل"
			pop: ws(2, 9),
			label: 'News',
			stackRot: 3,
			freeze: {x: -40, y: -360, rot: -6, scale: 0.72},
			node: () => (
				<Browser width={880} height={560} url="dailynews.com">
					<NewsSite />
				</Browser>
			),
		},
		{
			at: ws(2, 10), // "مكان"
			pop: ws(2, 10),
			label: 'Facebook',
			stackRot: -4,
			freeze: {x: 40, y: 360, rot: 5, scale: 0.72},
			node: () => (
				<Browser width={880} height={560} url="facebook.com">
					<FacebookSidebar />
				</Browser>
			),
		},
	];

	const freeze = sp(frame, FREEZE_AT, {damping: 16, stiffness: 170});
	const shown = cards.filter((c) => frame >= c.pop).length;
	const lastPop = cards.reduce((acc, c) => (frame >= c.pop ? c.pop : acc), 0);
	const counterPop = lastPop ? sp(frame, lastPop, {damping: 9, stiffness: 220}) : 0;

	return (
		<AbsoluteFill>
			{/* stalker counter */}
			<div
				style={{
					position: 'absolute',
					top: 190,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					opacity: clamp01(sp(frame, cards[0].pop)),
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 18,
						padding: '14px 34px',
						borderRadius: 999,
						background: 'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
						border: '1.5px solid rgba(255,255,255,0.16)',
						boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
						fontFamily: FONT,
						transform: `scale(${0.88 + 0.12 * counterPop})`,
					}}
				>
					<span style={{fontSize: 64}}>👀</span>
					<span style={{fontSize: 70, fontWeight: 900, color: C.ember, direction: 'ltr'}}>×{shown}</span>
				</div>
			</div>
			<AbsoluteFill style={{perspective: 1800}}>
				{cards.map((c, i) => {
					if (frame < c.at - 1) {
						return null;
					}
					const p = sp(frame, c.at - 1, {damping: 10, stiffness: 210});
					// how many cards landed on top of this one
					const depth = cards.slice(i + 1).reduce((acc, n) => acc + clamp01(sp(frame, n.at - 1, {damping: 14, stiffness: 180})), 0);
					const stackScale = (0.55 + 0.45 * p) * (1 - 0.07 * depth) * (c.label === 'News' || c.label === 'Facebook' ? 0.84 : 0.95);
					const stackX = 0;
					const stackY = 70 - depth * 46;
					const stackRot = c.stackRot * (1 + depth * 0.6) + (1 - p) * 14;
					const x = interpolate(freeze, [0, 1], [stackX, c.freeze.x]);
					const y = interpolate(freeze, [0, 1], [stackY, c.freeze.y]);
					const rot = interpolate(freeze, [0, 1], [stackRot, c.freeze.rot]);
					const scale = interpolate(freeze, [0, 1], [stackScale, c.freeze.scale * (c.label === 'News' || c.label === 'Facebook' ? 1 : 1.12)]);
					const dim = interpolate(freeze, [0, 1], [1 - Math.min(0.45, depth * 0.18), 1]);
					return (
						<div
							key={c.label}
							style={{
								position: 'absolute',
								left: '50%',
								top: 780,
								transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) rotateY(${(1 - clamp01(p)) * 8}deg) scale(${scale})`,
								opacity: clamp01(p * 2),
								filter: `brightness(${dim}) blur(${Math.max(0, 1 - p) * 8}px)`,
							}}
						>
							{c.node(frame)}
							{/* peeking eyes sticker */}
							<div
								style={{
									position: 'absolute',
									top: -34,
									right: -24,
									fontSize: 72,
									transform: `scale(${sp(frame, c.pop + 4, {damping: 8, stiffness: 220})}) rotate(${12 - i * 6}deg)`,
								}}
							>
								👀
							</div>
						</div>
					);
				})}
			</AbsoluteFill>
			{cards.map((c, i) => (
				<Sparks key={c.label} at={c.pop} x={540 + (i % 2 ? 120 : -120)} y={640} count={10} spread={0.8} seed={`f${i}`} />
			))}
		</AbsoluteFill>
	);
};
