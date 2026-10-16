import React from 'react';
import {
	AbsoluteFill,
	Html5Audio,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Background} from './components/Background';
import {Captions} from './components/Captions';
import {EndCard} from './components/EndCard';
import {LogoWatermark} from './components/LogoWatermark';
import {
	buildTimeline,
	fontFamily,
	getScene,
	MUSIC,
	ReelProps,
	SceneId,
	TRANSITION,
	VOICEOVER,
} from './config';
import {AiScene} from './scenes/AiScene';
import {ChatScene} from './scenes/ChatScene';
import {HookScene} from './scenes/HookScene';
import {TimeBackScene} from './scenes/TimeBackScene';
import {TimeScene} from './scenes/TimeScene';

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
	hook: HookScene,
	chat: ChatScene,
	time: TimeScene,
	ai: AiScene,
	timeBack: TimeBackScene,
	end: EndCard,
};

// Crossfade + slight slide: each scene overlaps the next by TRANSITION frames.
const SceneTransition: React.FC<{
	children: React.ReactNode;
	isFirst: boolean;
	isLast: boolean;
}> = ({children, isFirst, isLast}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const fadeIn = isFirst
		? 1
		: interpolate(frame, [0, TRANSITION], [0, 1], {extrapolateRight: 'clamp'});
	const fadeOut = isLast
		? 1
		: interpolate(
				frame,
				[durationInFrames - TRANSITION, durationInFrames],
				[1, 0],
				{extrapolateLeft: 'clamp'},
			);
	const slide = (1 - fadeIn) * 40 - (1 - fadeOut) * 40;
	return (
		<AbsoluteFill
			style={{opacity: fadeIn * fadeOut, transform: `translateY(${slide}px)`}}
		>
			{children}
		</AbsoluteFill>
	);
};

const {scenes, captions, voSegments} = buildTimeline();

export const Reel: React.FC<ReelProps> = ({hasVoiceover, hasMusic}) => {
	const end = getScene(scenes, 'end');

	return (
		<AbsoluteFill style={{backgroundColor: '#FFFFFF', fontFamily}}>
			<Background />
			{scenes.map((scene, i) => {
				const Component = SCENE_COMPONENTS[scene.id];
				const isLast = i === scenes.length - 1;
				return (
					<Sequence
						key={scene.id}
						name={scene.id}
						from={scene.from}
						durationInFrames={scene.durationInFrames + (isLast ? 0 : TRANSITION)}
					>
						<SceneTransition isFirst={i === 0} isLast={isLast}>
							<Component />
						</SceneTransition>
					</Sequence>
				);
			})}
			<Sequence durationInFrames={end.from + TRANSITION} name="Watermark">
				<LogoWatermark fadeOutAt={end.from} />
			</Sequence>
			<Captions captions={captions} />
			{hasVoiceover
				? voSegments.map((seg) => (
						<Sequence key={seg.from} from={seg.from} name="Voiceover">
							<Html5Audio
								src={staticFile(VOICEOVER)}
								trimBefore={seg.trimBefore}
								trimAfter={seg.trimAfter}
							/>
						</Sequence>
					))
				: null}
			{hasMusic ? (
				<Html5Audio
					src={staticFile(MUSIC)}
					loop
					// Ducked under the voice, lifts slightly on the end card.
					volume={(f) =>
						interpolate(
							f,
							[0, 15, end.from, end.from + 20],
							[0, hasVoiceover ? 0.07 : 0.12, hasVoiceover ? 0.07 : 0.12, 0.14],
							{extrapolateRight: 'clamp'},
						) *
						interpolate(
							f,
							[end.from + end.durationInFrames - 25, end.from + end.durationInFrames],
							[1, 0],
							{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
						)
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
