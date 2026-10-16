import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SAFE} from '../config';

export const LogoWatermark: React.FC<{fadeOutAt: number}> = ({fadeOutAt}) => {
	const frame = useCurrentFrame();
	const opacity =
		0.6 *
		interpolate(frame, [0, 12, fadeOutAt - 4, fadeOutAt + 6], [0, 1, 1, 0], {
			extrapolateRight: 'clamp',
		});
	return (
		<Img
			src={staticFile('logo-p.png')}
			style={{
				position: 'absolute',
				left: SAFE.side,
				top: SAFE.top + 10,
				height: 76,
				opacity,
			}}
		/>
	);
};
