import React from 'react';
import {FONT} from '../theme';

/** Realistic phone: bezel, dynamic island, status bar, side buttons, glass sheen, shadow. */
export const Phone: React.FC<{
	width?: number;
	height?: number;
	children: React.ReactNode;
	screenBg?: string;
	statusDark?: boolean;
	style?: React.CSSProperties;
}> = ({width = 420, height = 860, children, screenBg = '#000', statusDark = false, style}) => {
	const bezel = 14;
	const statusColor = statusDark ? '#111' : '#fff';
	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				borderRadius: 64,
				background: 'linear-gradient(145deg, #3a3a40, #121214 40%, #26262b)',
				padding: bezel,
				boxShadow:
					'0 50px 90px rgba(0,0,0,0.65), 0 18px 30px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 0 1px rgba(0,0,0,0.8)',
				...style,
			}}
		>
			{/* side buttons */}
			<div style={{position: 'absolute', left: -4, top: 170, width: 5, height: 60, borderRadius: 3, background: '#2b2b30'}} />
			<div style={{position: 'absolute', left: -4, top: 250, width: 5, height: 60, borderRadius: 3, background: '#2b2b30'}} />
			<div style={{position: 'absolute', right: -4, top: 210, width: 5, height: 95, borderRadius: 3, background: '#2b2b30'}} />
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					borderRadius: 52,
					overflow: 'hidden',
					background: screenBg,
				}}
			>
				{children}
				{/* status bar */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 52,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '6px 34px 0',
						fontFamily: FONT,
						fontWeight: 700,
						fontSize: 17,
						color: statusColor,
						direction: 'ltr',
					}}
				>
					<span>9:41</span>
					<span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
						<svg width="20" height="12" viewBox="0 0 20 12">
							{[0, 1, 2, 3].map((i) => (
								<rect key={i} x={i * 5} y={9 - i * 3} width="3.4" height={3 + i * 3} rx="1" fill={statusColor} />
							))}
						</svg>
						<svg width="27" height="13" viewBox="0 0 27 13">
							<rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke={statusColor} opacity="0.5" />
							<rect x="2.5" y="2.5" width="17" height="8" rx="2" fill={statusColor} />
							<rect x="24.5" y="4.5" width="2" height="4" rx="1" fill={statusColor} opacity="0.5" />
						</svg>
					</span>
				</div>
				{/* dynamic island */}
				<div
					style={{
						position: 'absolute',
						top: 12,
						left: '50%',
						width: 118,
						height: 34,
						marginLeft: -59,
						borderRadius: 20,
						background: '#000',
					}}
				/>
				{/* glass sheen */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 28%)',
						pointerEvents: 'none',
					}}
				/>
			</div>
		</div>
	);
};

/** Desktop browser window card with traffic lights and URL bar. */
export const Browser: React.FC<{
	width: number;
	height: number;
	url: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({width, height, url, children, style}) => {
	return (
		<div
			style={{
				width,
				height,
				borderRadius: 22,
				overflow: 'hidden',
				background: '#fff',
				boxShadow: '0 45px 90px rgba(0,0,0,0.6), 0 12px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
				display: 'flex',
				flexDirection: 'column',
				...style,
			}}
		>
			<div
				style={{
					height: 54,
					background: '#ececf0',
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					padding: '0 18px',
					direction: 'ltr',
					flexShrink: 0,
				}}
			>
				{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
					<div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
				))}
				<div
					style={{
						flex: 1,
						marginLeft: 16,
						height: 32,
						borderRadius: 10,
						background: '#fff',
						display: 'flex',
						alignItems: 'center',
						padding: '0 14px',
						gap: 8,
						fontFamily: FONT,
						fontSize: 17,
						fontWeight: 600,
						color: '#555',
					}}
				>
					<svg width="12" height="14" viewBox="0 0 12 14">
						<rect x="1" y="6" width="10" height="7.5" rx="2" fill="#777" />
						<path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke="#777" strokeWidth="1.6" fill="none" />
					</svg>
					{url}
				</div>
			</div>
			<div style={{position: 'relative', flex: 1, overflow: 'hidden'}}>{children}</div>
		</div>
	);
};

/** Glassmorphism card. */
export const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div
		style={{
			background: 'linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))',
			border: '1.5px solid rgba(255,255,255,0.14)',
			borderRadius: 36,
			backdropFilter: 'blur(18px)',
			boxShadow: '0 30px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
			...style,
		}}
	>
		{children}
	</div>
);

/** Tap ripple, drawn at (x, y) inside a positioned parent. `p` is 0..1 progress. */
export const Ripple: React.FC<{x: number; y: number; p: number; color?: string}> = ({x, y, p, color = '#fff'}) => {
	if (p <= 0 || p >= 1) {
		return null;
	}
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: x - 60,
					top: y - 60,
					width: 120,
					height: 120,
					borderRadius: 60,
					border: `4px solid ${color}`,
					opacity: 1 - p,
					transform: `scale(${0.2 + p})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: x - 26,
					top: y - 26,
					width: 52,
					height: 52,
					borderRadius: 26,
					background: color,
					opacity: 0.45 * (1 - p),
					transform: `scale(${1 - p * 0.3})`,
				}}
			/>
		</>
	);
};

/** Finger/cursor dot. */
export const Finger: React.FC<{x: number; y: number; opacity?: number; pressed?: number}> = ({x, y, opacity = 1, pressed = 0}) => (
	<div
		style={{
			position: 'absolute',
			left: x - 30,
			top: y - 30,
			width: 60,
			height: 60,
			borderRadius: 30,
			background: 'rgba(255,255,255,0.85)',
			border: '3px solid rgba(255,255,255,1)',
			boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
			opacity,
			transform: `scale(${1 - pressed * 0.2})`,
		}}
	/>
);
