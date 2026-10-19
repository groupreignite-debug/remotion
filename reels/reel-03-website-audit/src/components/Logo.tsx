import {Img, staticFile} from 'remotion';
import {C} from '../brand';

// Set to the logo file name in /public (e.g. 'reignite-logo.png') once the official
// flame logo is supplied. Until then a vector flame mark in the brand accent is drawn.
export const LOGO_FILE: string | null = null;

export const Logo: React.FC<{size: number; flicker: number}> = ({size, flicker}) => {
	if (LOGO_FILE) {
		return <Img src={staticFile(LOGO_FILE)} style={{width: size, height: size, objectFit: 'contain'}} />;
	}

	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${18 + flicker * 10}px rgba(255,90,31,0.75))`}}>
			<path
				d="M50 4 C58 22 76 32 76 58 C76 78 64 94 50 94 C36 94 24 80 24 62 C24 46 34 38 38 26 C42 36 44 42 50 46 C52 32 50 18 50 4 Z"
				fill={C.accent}
			/>
			<path
				d={`M50 50 C55 60 ${63 + flicker * 2} 66 63 78 C63 88 57 94 50 94 C43 94 37 88 37 79 C37 70 43 66 45 58 C47 63 49 64 51 66 C52 60 51 55 50 50 Z`}
				fill={C.bg}
			/>
		</svg>
	);
};
