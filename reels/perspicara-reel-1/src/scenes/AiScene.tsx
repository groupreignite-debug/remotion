import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Card, ChatHeader} from '../components/Card';
import {ChatBubble} from '../components/ChatBubble';
import {Grad, Headline, SubText} from '../components/Headline';
import {COLORS, GRADIENT, SAFE} from '../config';

const NIGHT_AT = 150;

const EXCHANGES = [
	{q: 'What are your hours?', a: "We're open 9 to 6, Monday to Saturday.", at: 40},
	{q: 'Are you available tomorrow?', a: 'Yes! 10:00 or 14:30 are free. Want one?', at: 95},
	{q: "What's the price?", a: 'Plans start at $49/month. Here are the details.', at: NIGHT_AT + 16},
];

const Check: React.FC = () => (
	<svg width={30} height={30} viewBox="0 0 30 30">
		<circle cx={15} cy={15} r={15} fill={COLORS.green} />
		<path d="M8 15.5 L13 20 L22 10" stroke="white" strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const DayNightToggle: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring({frame: frame - NIGHT_AT, fps, config: {damping: 16, stiffness: 160}});
	return (
		<div
			style={{
				width: 150,
				height: 74,
				borderRadius: 999,
				position: 'relative',
				background: p > 0.5 ? COLORS.navy : '#FFF4D6',
				boxShadow: 'inset 0 2px 6px rgba(11,16,51,0.12)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 7,
					left: 7 + p * 76,
					width: 60,
					height: 60,
					borderRadius: '50%',
					background: p > 0.5 ? GRADIENT : '#FFB547',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxShadow: '0 4px 10px rgba(11,16,51,0.2)',
				}}
			>
				<svg width={34} height={34} viewBox="0 0 34 34">
					{p > 0.5 ? (
						<path d="M22 5 A13 13 0 1 0 29 22 A10 10 0 1 1 22 5 Z" fill="white" />
					) : (
						<g fill="white">
							<circle cx={17} cy={17} r={7} />
							{Array.from({length: 8}).map((_, i) => (
								<rect key={i} x={15.5} y={1} width={3} height={6} rx={1.5} transform={`rotate(${i * 45} 17 17)`} />
							))}
						</g>
					)}
				</svg>
			</div>
		</div>
	);
};

export const AiScene: React.FC = () => {
	const frame = useCurrentFrame();
	const isNight = frame >= NIGHT_AT + 4;

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				padding: `${SAFE.top + 70}px ${SAFE.side}px 0`,
			}}
		>
			<Headline size={92} lines={['Meet your', <Grad key="g">AI assistant</Grad>]} />
			<div style={{marginTop: 18}}>
				<SubText delay={30}>Instant replies. Day or night.</SubText>
			</div>
			<Card
				delay={8}
				style={{
					marginTop: 40,
					width: '100%',
					height: 760,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<ChatHeader
					avatar="AI"
					title="AI assistant"
					subtitle={isNight ? 'Online · 11:48 PM' : 'Online · 2:14 PM'}
					right={<DayNightToggle />}
				/>
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						gap: 20,
						padding: '24px 32px 32px',
						overflow: 'hidden',
						background: `linear-gradient(180deg, white 0%, ${COLORS.bgSoft} 100%)`,
					}}
				>
					{EXCHANGES.map((e) => (
						<React.Fragment key={e.q}>
							<ChatBubble side="customer" text={e.q} at={e.at} fontSize={36} />
							<ChatBubble
								side="ai"
								text={e.a}
								at={e.at + 6}
								fontSize={36}
								meta={
									<>
										<Check /> Replied in 0.4s
									</>
								}
							/>
						</React.Fragment>
					))}
				</div>
			</Card>
		</AbsoluteFill>
	);
};
