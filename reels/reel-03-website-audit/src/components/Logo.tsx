import {Img, staticFile} from 'remotion';

// Official Reignite Group lockup (flame + REIGNITE + GROUP).
// public/reignite-logo.png is the supplied file; the transparent version used here was made
// from it by keying out the black background (see README).
export const Logo: React.FC<{width: number}> = ({width}) => (
	<Img src={staticFile('reignite-logo-transparent.png')} style={{width, height: (width * 590) / 996}} />
);
