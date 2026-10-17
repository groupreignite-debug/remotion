import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import fonts from './fonts.json';

// Fonts are bundled in public/fonts (downloaded from Google Fonts) so renders work offline.
for (const font of fonts) {
	loadFont({family: font.family, url: staticFile(font.file), weight: font.weight, unicodeRange: font.unicodeRange, format: 'woff2'});
}

export const C = {
	bg: '#0D0D0D',
	text: '#F2EEE6',
	dim: '#6B6762',
	// Sampled from the dominant flame colour of the provided Reignite logo.
	accent: '#FB6106',
	accentRgb: '251, 97, 6',
};

export const FONT_AR = "'IBM Plex Sans Arabic', 'Cairo', sans-serif";
export const FONT_LATIN = "'Inter', sans-serif";
export const FONT_MONO = "'JetBrains Mono', monospace";

export const W = 1080;
export const H = 1920;
// Centre of the visual band (y 700–1400).
export const CX = 540;
export const CY = 1050;
