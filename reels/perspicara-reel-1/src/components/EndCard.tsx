import React from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {COLORS, GRADIENT} from '../config';
import {useEntrance} from './Headline';

export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame: frame - 4, fps, config: {damping: 16, stiffness: 120}});
	const glow = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: 'clamp'});
	const breathe = 1 + Math.sin(frame / 14) * 0.04;
	const name = useEntrance(16);
	const tagline = useEntrance(22);
	const cta = useEntrance(34);
	const underline = interpolate(frame, [44, 64], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				alignItems: 'center',
				justifyContent: 'center',
				paddingBottom: 160,
			}}
		>
			<div style={{position: 'relative', width: 420, height: 440}}>
				<div
					style={{
						position: 'absolute',
						inset: -140,
						borderRadius: '50%',
						background: `radial-gradient(circle, rgba(124,77,255,0.28) 0%, rgba(46,107,255,0.16) 38%, transparent 68%)`,
						opacity: glow,
						transform: `scale(${breathe})`,
						filter: 'blur(20px)',
					}}
				/>
				<Img
					src={staticFile('logo-p.png')}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit: 'contain',
						opacity: interpolate(logo, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
						transform: `scale(${0.7 + logo * 0.3})`,
					}}
				/>
			</div>
			<div
				style={{
					...name,
					marginTop: 70,
					fontSize: 104,
					fontWeight: 800,
					letterSpacing: '-0.02em',
					color: COLORS.navy,
				}}
			>
				Perspicara
			</div>
			<div
				style={{
					...tagline,
					marginTop: 10,
					fontSize: 36,
					fontWeight: 600,
					letterSpacing: '0.18em',
					textTransform: 'uppercase',
					color: COLORS.slate,
				}}
			>
				AI Consulting &amp; Automation
			</div>
			<div style={{...cta, marginTop: 90, textAlign: 'center'}}>
				<div style={{fontSize: 52, fontWeight: 600, color: COLORS.navy}}>
					Follow for more practical AI tips
				</div>
				<div
					style={{
						height: 8,
						borderRadius: 8,
						marginTop: 18,
						background: GRADIENT,
						width: `${underline * 100}%`,
						marginLeft: 'auto',
						marginRight: 'auto',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
