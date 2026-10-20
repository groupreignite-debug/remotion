import {continueRender, delayRender, staticFile} from 'remotion';
import fonts from './fonts.json';

// Fonts are bundled in public/fonts so renders don't depend on Google's CDN.
export const ARABIC = 'IBM Plex Sans Arabic';
export const INTER = 'Inter';
export const SCRIPT = 'Aref Ruqaa';

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading fonts');
	Promise.all(
		fonts.map((f) => {
			const face = new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format('woff2')`, {
				weight: f.weight,
				unicodeRange: f.range,
			});
			document.fonts.add(face);
			return face.load();
		}),
	).then(() => continueRender(handle));
}

export const C = {
	bg: '#0D0D0D',
	card: '#161514',
	cardHi: '#1E1C1A',
	line: '#2A2826',
	text: '#F2EEE6',
	dim: '#6B6762',
	accent: '#FF5A1F',
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
// Bottom 300px are reserved for platform UI.
export const SAFE_BOTTOM = H - 300;
// Visuals sit in the middle third.
export const MID_Y = 980;
