import React from 'react';
import {C, FONT} from '../theme';

/** Flat-illustrated bomber jacket — the product that follows you everywhere. */
export const Jacket: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
	<svg width={size} height={size} viewBox="0 0 240 240" style={style}>
		<defs>
			<linearGradient id="jk-body" x1="0" x2="1">
				<stop offset="0" stopColor="#B9430E" />
				<stop offset="0.3" stopColor="#EC6A1F" />
				<stop offset="0.7" stopColor="#EC6A1F" />
				<stop offset="1" stopColor="#B9430E" />
			</linearGradient>
			<linearGradient id="jk-sleeve" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#E25E18" />
				<stop offset="1" stopColor="#A83A0B" />
			</linearGradient>
			<radialGradient id="jk-hi" cx="0.5" cy="0.3" r="0.5">
				<stop offset="0" stopColor="#fff" stopOpacity="0.28" />
				<stop offset="1" stopColor="#fff" stopOpacity="0" />
			</radialGradient>
		</defs>
		<ellipse cx="120" cy="226" rx="78" ry="7" fill="#000" opacity="0.22" />
		{/* sleeves */}
		<path d="M80 52 Q56 58 46 84 L22 178 L50 186 L72 112 Z" fill="url(#jk-sleeve)" />
		<path d="M160 52 Q184 58 194 84 L218 178 L190 186 L168 112 Z" fill="url(#jk-sleeve)" />
		<path d="M60 90 L40 170" stroke="#8E300A" strokeWidth="2" opacity="0.5" />
		<path d="M180 90 L200 170" stroke="#8E300A" strokeWidth="2" opacity="0.5" />
		{/* cuffs */}
		<path d="M22 178 L50 186 L46 202 L17 194 Z" fill="#2A1A12" />
		<path d="M218 178 L190 186 L194 202 L223 194 Z" fill="#2A1A12" />
		<path d="M20 186 L48 194" stroke="#4a3125" strokeWidth="9" strokeDasharray="2 3" />
		<path d="M220 186 L192 194" stroke="#4a3125" strokeWidth="9" strokeDasharray="2 3" />
		{/* body */}
		<path d="M80 50 L160 50 L172 92 L170 200 Q120 208 70 200 L68 92 Z" fill="url(#jk-body)" />
		<path d="M80 50 L160 50 L172 92 L170 200 Q120 208 70 200 L68 92 Z" fill="url(#jk-hi)" />
		{/* hem rib */}
		<path d="M70 196 Q120 204 170 196 L170 216 Q120 224 70 216 Z" fill="#2A1A12" />
		<path d="M72 206 Q120 214 168 206" stroke="#4a3125" strokeWidth="16" strokeDasharray="2 3" fill="none" />
		{/* collar */}
		<path d="M84 46 Q120 38 156 46 L150 60 Q120 72 90 60 Z" fill="#2A1A12" />
		<path d="M88 52 Q120 62 152 52" stroke="#4a3125" strokeWidth="8" strokeDasharray="2 3" fill="none" />
		{/* zipper */}
		<line x1="120" y1="64" x2="120" y2="214" stroke="#7A2A08" strokeWidth="6" />
		<line x1="120" y1="64" x2="120" y2="214" stroke="#E6E6E6" strokeWidth="2.4" strokeDasharray="3 2" />
		<rect x="116" y="90" width="8" height="14" rx="2" fill="#F2F2F2" />
		{/* pockets */}
		<path d="M86 138 L98 172" stroke="#7A2A08" strokeWidth="4" strokeLinecap="round" />
		<path d="M154 138 L142 172" stroke="#7A2A08" strokeWidth="4" strokeLinecap="round" />
		{/* sleeve pocket badge */}
		<rect x="46" y="98" width="16" height="12" rx="2" fill="#2A1A12" transform="rotate(14 54 104)" />
	</svg>
);

/** The jacket product shot used inside every ad mockup. */
export const JacketTile: React.FC<{
	width: number;
	height: number;
	tag?: boolean;
	style?: React.CSSProperties;
}> = ({width, height, tag = true, style}) => (
	<div
		style={{
			position: 'relative',
			width,
			height,
			overflow: 'hidden',
			background: 'radial-gradient(circle at 50% 45%, #FFF3E6 0%, #F6D9BF 60%, #E9BC97 100%)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...style,
		}}
	>
		<Jacket size={Math.min(width, height) * 0.86} />
		{tag ? (
			<div
				style={{
					position: 'absolute',
					top: Math.max(10, height * 0.06),
					left: Math.max(10, width * 0.05),
					padding: `${Math.max(3, height * 0.012)}px ${Math.max(8, width * 0.03)}px`,
					borderRadius: 999,
					background: '#1b120d',
					color: C.emberHot,
					fontFamily: FONT,
					fontWeight: 900,
					fontSize: Math.max(12, Math.min(width, height) * 0.075),
					direction: 'ltr',
				}}
			>
				-30%
			</div>
		) : null}
	</div>
);
