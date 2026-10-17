import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {DURATION, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Reel10"
			component={Reel}
			durationInFrames={DURATION}
			fps={FPS}
			width={W}
			height={H}
		/>
	);
};
