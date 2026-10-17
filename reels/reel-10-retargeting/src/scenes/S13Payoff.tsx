import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Kinetic} from '../components/Kinetic';
import {Person} from '../components/People';
import {Shop, ShopStage, walkTo} from '../components/Shop';
import {Sparks} from '../components/Sparks';
import {clamp01, FONT, sp, ws} from '../theme';
import {FEET} from './S06Shop';

/** Line 13 — calm beat: the same customer walks back in. */
export const S13Payoff: React.FC = () => {
	const frame = useCurrentFrame();
	const start = ws(13, 0);
	const passA = start + 8;
	const enterA = ws(13, 6);
	const arrive = ws(13, 9) + 6;
	const street = walkTo(frame, passA, passA + 40, 560, -80);
	const inside = walkTo(frame, enterA, arrive, -140, 620);
	const wave = clamp01(sp(frame, arrive - 8, {damping: 12})) * (1 - clamp01(sp(frame, arrive + 40, {damping: 16})));
	const heart = sp(frame, ws(13, 11), {damping: 9, stiffness: 200});

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: 150, left: 50, right: 50}}>
				<Kinetic
					text="أقرب زبون… هوي اللي فات وفلّ."
					at={[ws(13, 9), ws(13, 10), ws(13, 11), ws(13, 12), ws(13, 13), ws(13, 14)]}
					size={78}
					weight={900}
					highlight={['أقرب', 'زبون', 'فات', 'وفلّ']}
					lineHeight={1.3}
				/>
			</div>
			<ShopStage enter={sp(frame, start - 4, {damping: 18})}>
				<Shop
					t={frame / 30}
					lights={sp(frame, start + 6, {damping: 22, stiffness: 40})}
					jacketOnRack={1}
					jacketGlow={clamp01(sp(frame, arrive, {damping: 14})) * 0.7}
					street={frame < passA + 42 ? <Person x={street.x} y={600} height={300} walk={street.walk} facing={-1} /> : null}
				>
					<Person x={960} y={FEET} height={420} facing={-1} shirt="#2f3138" apron wave={wave} waveT={frame} />
					{frame >= enterA ? <Person x={inside.x} y={FEET} height={420} walk={inside.walk} facing={1} /> : null}
					{frame >= ws(13, 11) ? (
						<div style={{position: 'absolute', left: 560, top: 320, fontSize: 90, fontFamily: FONT, transform: `scale(${heart}) translateY(${-(frame - ws(13, 11)) * 0.8}px)`}}>🧡</div>
					) : null}
					<Sparks at={ws(13, 11)} x={605} y={370} count={12} seed="heart" />
				</Shop>
			</ShopStage>
		</AbsoluteFill>
	);
};
