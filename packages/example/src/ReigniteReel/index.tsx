import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {REIGNITE_REEL_DURATION, ReigniteReel} from './ReigniteReel';

// Standalone entry point: `bunx remotion render src/ReigniteReel/index.tsx`
const Root: React.FC = () => (
	<Composition
		id="reignite-ga-vs-pixel"
		component={ReigniteReel}
		width={1080}
		height={1920}
		fps={30}
		durationInFrames={REIGNITE_REEL_DURATION}
	/>
);

registerRoot(Root);
