import {getAudioDurationInSeconds} from '@remotion/media-utils';
import React from 'react';
import {Composition, getStaticFiles, staticFile} from 'remotion';
import {
	buildPlaceholderCaptions,
	buildScenes,
	CAPTIONS_JSON,
	Caption,
	FPS,
	HEIGHT,
	MUSIC,
	PLACEHOLDER_SPEECH_END,
	ReelProps,
	VOICEOVER,
	WIDTH,
} from './config';
import {Reel} from './Reel';

const defaultScenes = buildScenes(PLACEHOLDER_SPEECH_END);

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Reel1ProblemSolution"
			component={Reel}
			width={WIDTH}
			height={HEIGHT}
			fps={FPS}
			durationInFrames={1050}
			defaultProps={
				{
					scenes: defaultScenes,
					captions: buildPlaceholderCaptions(defaultScenes),
					hasVoiceover: false,
					hasMusic: false,
				} satisfies ReelProps
			}
			calculateMetadata={async () => {
				const files = getStaticFiles().map((f) => f.name);
				const hasVoiceover = files.includes(VOICEOVER);
				const hasMusic = files.includes(MUSIC);

				// Small breath after the last spoken word before the end card.
				const speechSeconds = hasVoiceover
					? (await getAudioDurationInSeconds(staticFile(VOICEOVER))) + 0.4
					: PLACEHOLDER_SPEECH_END;
				const scenes = buildScenes(speechSeconds);

				const captions: Caption[] = files.includes(CAPTIONS_JSON)
					? await fetch(staticFile(CAPTIONS_JSON)).then((r) => r.json())
					: buildPlaceholderCaptions(scenes);

				const last = scenes[scenes.length - 1];
				return {
					durationInFrames: last.from + last.durationInFrames,
					props: {scenes, captions, hasVoiceover, hasMusic},
				};
			}}
		/>
	);
};
