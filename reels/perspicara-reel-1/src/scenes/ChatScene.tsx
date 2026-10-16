import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Card, ChatHeader} from '../components/Card';
import {ChatBubble} from '../components/ChatBubble';
import {COLORS, GRADIENT, SAFE} from '../config';

const MAIN = [
	{text: 'What are your hours?', at: 12, time: '9:02 AM'},
	{text: "What's the price?", at: 44, time: '9:04 AM'},
	{text: 'Are you available?', at: 72, time: '9:05 AM'},
];

// The pile keeps growing after the three headline questions.
const PILE = [
	'Do you deliver?',
	"What's the price again?",
];

export const ChatScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const counterIn = spring({frame: frame - 82, fps, config: {damping: 12, stiffness: 220}});
	const count = 12 + Math.max(0, Math.floor((frame - 82) * 0.5));
	const bump = 1 + Math.max(0, Math.sin((frame - 82) * 0.9)) * 0.06 * counterIn;

	return (
		<AbsoluteFill style={{padding: `${SAFE.top + 110}px ${SAFE.side}px 0`}}>
			<Card style={{height: 960, display: 'flex', flexDirection: 'column'}}>
				<ChatHeader
					avatar="?"
					title="Customer messages"
					subtitle="Inbox · today"
					right={
						<div
							style={{
								padding: '14px 24px',
								borderRadius: 999,
								background: GRADIENT,
								color: 'white',
								fontSize: 32,
								fontWeight: 800,
								opacity: counterIn,
								transform: `scale(${counterIn * bump})`,
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							+{count} more
						</div>
					}
				/>
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						gap: 26,
						padding: '30px 36px 40px',
						overflow: 'hidden',
						background: `linear-gradient(180deg, white 0%, ${COLORS.bgSoft} 100%)`,
					}}
				>
					{MAIN.map((m) => (
						<ChatBubble
							key={m.text}
							side="customer"
							text={m.text}
							at={m.at}
							meta={m.time}
						/>
					))}
					{PILE.map((text, i) => (
						<ChatBubble
							key={text}
							side="customer"
							text={text}
							at={90 + i * 14}
							fontSize={38}
							faded
						/>
					))}
				</div>
			</Card>
		</AbsoluteFill>
	);
};
