import {Video} from '@remotion/media';
import {staticFile} from 'remotion';

// The provided screen recording (passing site), prepared by scripts/prepare-footage.sh:
// 1.1s–7.0s of the recording, status bar + URL bar cropped (880x1585), and the real
// brand names blurred. Set to false only if the client OKs showing them.
export const BLUR_REAL_NAMES = true;

// The page sits still for the first ~2.3s of the clip, scrolls up 37px, then sits still
// again from ~2.9s. Callouts use the second resting position.
export const SITE_TWO_SETTLED = 2.9 * 30; // frames into the clip

// Regions in screen space at the settled position
export const SITE_TWO_REGIONS = {
	headline: {x: 22, y: 381, w: 784, h: 178},
	audience: {x: 22, y: 1170, w: 790, h: 128},
	button: {x: 26, y: 619, w: 340, h: 112},
};

export const SiteTwo: React.FC<{startFrom: number; playbackRate: number}> = ({startFrom, playbackRate}) => {
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff'}}>
			<Video
				src={staticFile(BLUR_REAL_NAMES ? 'site-02-hero.mp4' : 'site-02-hero-unblurred.mp4')}
				trimBefore={startFrom}
				playbackRate={playbackRate}
				muted
				style={{position: 'absolute', left: 0, top: 0, width: 880, height: 1585}}
			/>
		</div>
	);
};
