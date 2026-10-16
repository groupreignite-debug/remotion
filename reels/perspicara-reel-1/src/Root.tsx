import React from 'react';
import {Composition, getStaticFiles} from 'remotion';
import {buildTimeline, FPS, HEIGHT, MUSIC, ReelProps, VOICEOVER, WIDTH} from './config';
import {Reel} from './Reel';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Reel1ProblemSolution"
			component={Reel}
			width={WIDTH}
			height={HEIGHT}
			fps={FPS}
			durationInFrames={buildTimeline().durationInFrames}
			defaultProps={{hasVoiceover: false, hasMusic: false} satisfies ReelProps}
			calculateMetadata={() => {
				const files = getStaticFiles().map((f) => f.name);
				return {
					props: {
						hasVoiceover: files.includes(VOICEOVER),
						hasMusic: files.includes(MUSIC),
					},
				};
			}}
		/>
	);
};
