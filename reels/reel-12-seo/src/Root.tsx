import React from 'react';
import {Composition} from 'remotion';
import {END_CARD, Reel} from './Reel';
import {FPS, H, W} from './theme';
import {sec, VO_DURATION} from './timing';

export const RemotionRoot: React.FC = () => (
	<Composition id="Reel12SEO" component={Reel} durationInFrames={sec(VO_DURATION) + END_CARD} fps={FPS} width={W} height={H} />
);
