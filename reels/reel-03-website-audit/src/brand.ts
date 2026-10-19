import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const C = {
	bg: '#0D0D0D',
	text: '#F2EEE6',
	dim: '#6B6762',
	accent: '#FF5A1F',
};

// Fonts are self-hosted in public/fonts (IBM Plex Sans Arabic + Inter, from Google Fonts, OFL)
// so renders never depend on network access.
export const ARABIC = 'IBM Plex Sans Arabic';
export const INTER = 'Inter';

const RANGES = {
	arabic: 'U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC',
	latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212',
};

for (const weight of ['400', '500', '700']) {
	for (const subset of ['arabic', 'latin'] as const) {
		loadFont({family: ARABIC, url: staticFile(`fonts/plex-arabic-${weight}-${subset}.woff2`), weight, unicodeRange: RANGES[subset]});
	}
}

loadFont({family: INTER, url: staticFile('fonts/inter-latin-var.woff2'), weight: '100 900'});

// Spring presets (damping kept within 14–18 as per the brief)
export const SOFT = {damping: 16, stiffness: 110, mass: 1};
export const SNAPPY = {damping: 14, stiffness: 190, mass: 0.8};
export const FIRM = {damping: 18, stiffness: 260, mass: 0.7};

export const glow = (g: number) =>
	g <= 0.001
		? 'none'
		: `0 0 ${18 * g}px rgba(255,90,31,${0.9 * g}), 0 0 ${48 * g}px rgba(255,90,31,${0.55 * g})`;

/** English micro-label style: Inter, uppercase, tracked 0.18em, accent */
export const labelStyle = (size: number): React.CSSProperties => ({
	fontFamily: INTER,
	fontWeight: 700,
	fontSize: size,
	letterSpacing: '0.18em',
	textTransform: 'uppercase',
	color: C.accent,
	whiteSpace: 'nowrap',
});
