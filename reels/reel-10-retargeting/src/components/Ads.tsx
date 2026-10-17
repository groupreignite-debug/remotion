import React from 'react';
import {C, FONT} from '../theme';
import {Jacket, JacketTile} from './Jacket';

const ui = (size: number, weight = 600, color = '#111'): React.CSSProperties => ({
	fontFamily: FONT,
	fontSize: size,
	fontWeight: weight,
	color,
	direction: 'ltr',
});

const Bar: React.FC<{w: number | string; h?: number; c?: string; style?: React.CSSProperties}> = ({w, h = 12, c = '#e4e4e8', style}) => (
	<div style={{width: w, height: h, borderRadius: h / 2, background: c, ...style}} />
);

export const BrandAvatar: React.FC<{size: number}> = ({size}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size / 2,
			background: '#1b120d',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
			flexShrink: 0,
		}}
	>
		<Jacket size={size * 0.9} />
	</div>
);

const Icon: React.FC<{d: string; size?: number; color?: string; fill?: string}> = ({d, size = 26, color = '#111', fill = 'none'}) => (
	<svg width={size} height={size} viewBox="0 0 24 24">
		<path d={d} stroke={color} strokeWidth="1.9" fill={fill} strokeLinejoin="round" strokeLinecap="round" />
	</svg>
);

const HEART = 'M12 20s-7.5-4.6-9-9.2C2 7.5 4.2 4.5 7.3 4.5c2 0 3.6 1.2 4.7 2.9 1.1-1.7 2.7-2.9 4.7-2.9 3.1 0 5.3 3 4.3 6.3C19.5 15.4 12 20 12 20z';
const BUBBLE = 'M20.5 12a8.5 8.5 0 01-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1120.5 12z';
const PLANE = 'M21.5 3.5L10 14M21.5 3.5l-7 17-4.5-6.5-6.5-4.5z';
const SAVE = 'M6 3.5h12v17l-6-4.5-6 4.5z';
const HOME = 'M3.5 10.5L12 3.5l8.5 7V20.5h-6v-6h-5v6h-6z';
const SEARCH = 'M10.5 17.5a7 7 0 100-14 7 7 0 000 14zM15.5 15.5l5 5';
const PLUS = 'M4 4h16v16H4zM12 8v8M8 12h8';
const REELS = 'M4 4h16v16H4zM4 9h16M9 4l3 5M14 4l3 5M10.5 12.5v5l4-2.5z';

/** Instagram feed screen with a sponsored jacket post. `adP` 0..1 pops the ad in. */
export const InstagramFeed: React.FC<{adP: number; liked?: number}> = ({adP, liked = 0}) => (
	<div style={{position: 'absolute', inset: 0, background: '#fff'}}>
		<div style={{position: 'absolute', top: 54, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'ltr'}}>
			<span style={{fontFamily: "'Grand Hotel', cursive", fontSize: 40, color: '#111'}}>Instagram</span>
			<span style={{display: 'flex', gap: 18}}>
				<Icon d={HEART} />
				<Icon d={PLANE} />
			</span>
		</div>
		<div style={{position: 'absolute', top: 112, left: 14, display: 'flex', gap: 14, direction: 'ltr'}}>
			{[0, 1, 2, 3, 4].map((i) => (
				<div
					key={i}
					style={{
						width: 66,
						height: 66,
						borderRadius: 33,
						padding: 3,
						background: 'linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF)',
					}}
				>
					<div style={{width: '100%', height: '100%', borderRadius: 33, border: '3px solid #fff', background: ['#d9cfc4', '#c7d3dc', '#d8c8d8', '#cfd8c7', '#e3d5c0'][i]}} />
				</div>
			))}
		</div>
		<div style={{position: 'absolute', top: 200, left: 0, right: 0, height: 1, background: '#eee'}} />
		<div
			style={{
				position: 'absolute',
				top: 210,
				left: 0,
				right: 0,
				transformOrigin: '50% 30%',
				transform: `scale(${0.85 + 0.15 * adP})`,
				opacity: Math.min(1, adP * 1.4),
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', direction: 'ltr'}}>
				<BrandAvatar size={40} />
				<div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.15}}>
					<span style={ui(17, 800)}>jacket.co</span>
					<span style={ui(13, 600, '#666')}>Sponsored</span>
				</div>
				<span style={{marginLeft: 'auto', ...ui(22, 900)}}>···</span>
			</div>
			<JacketTile width={392} height={392} />
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '10px 16px',
					background: '#f2f2f4',
					direction: 'ltr',
					...ui(16, 700, '#0064E0'),
				}}
			>
				<span>Shop now</span>
				<span>›</span>
			</div>
			<div style={{display: 'flex', gap: 16, padding: '12px 14px', direction: 'ltr'}}>
				<Icon d={HEART} color={liked > 0.5 ? '#ff3040' : '#111'} fill={liked > 0.5 ? '#ff3040' : 'none'} />
				<Icon d={BUBBLE} />
				<Icon d={PLANE} />
				<span style={{marginLeft: 'auto'}}>
					<Icon d={SAVE} />
				</span>
			</div>
			<div style={{padding: '0 14px', ...ui(15, 800)}}>2,481 likes</div>
		</div>
		<div
			style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: 64,
				borderTop: '1px solid #eee',
				background: '#fff',
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
			}}
		>
			{[HOME, SEARCH, PLUS, REELS].map((d) => (
				<Icon key={d} d={d} />
			))}
			<div style={{width: 26, height: 26, borderRadius: 13, background: '#d6c7b8'}} />
		</div>
	</div>
);

/** YouTube app with the jacket running as a skippable pre-roll. */
export const YouTubePreroll: React.FC<{t: number}> = ({t}) => (
	<div style={{position: 'absolute', inset: 0, background: '#0f0f0f'}}>
		<div style={{position: 'absolute', top: 56, left: 18, display: 'flex', alignItems: 'center', gap: 6, direction: 'ltr'}}>
			<div style={{width: 40, height: 28, borderRadius: 8, background: '#FF0033', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '12px solid #fff', marginLeft: 3}} />
			</div>
			<span style={{...ui(24, 800, '#fff'), letterSpacing: -1}}>YouTube</span>
		</div>
		<div style={{position: 'absolute', top: 104, left: 0, width: 392, height: 221}}>
			<JacketTile width={392} height={221} tag={false} />
			<div style={{position: 'absolute', left: 10, bottom: 14, padding: '2px 8px', borderRadius: 4, background: '#FFCC00', ...ui(14, 800, '#111')}}>
				Ad · 0:0{Math.max(1, 5 - Math.floor(t * 4))}
			</div>
			<div
				style={{
					position: 'absolute',
					right: 0,
					bottom: 14,
					padding: '8px 14px',
					background: 'rgba(0,0,0,0.75)',
					border: '1px solid rgba(255,255,255,0.4)',
					borderRight: 'none',
					...ui(15, 700, '#fff'),
				}}
			>
				Skip Ad ⏭
			</div>
			<div style={{position: 'absolute', left: 0, bottom: 0, height: 5, width: `${18 + t * 60}%`, background: '#FFCC00'}} />
		</div>
		<div style={{position: 'absolute', top: 340, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 12, direction: 'ltr'}}>
			<BrandAvatar size={44} />
			<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
				<span style={ui(18, 800, '#fff')}>Jacket Co.</span>
				<span style={ui(14, 600, '#aaa')}>Sponsored · jacketco.com</span>
			</div>
			<div style={{marginLeft: 'auto', padding: '10px 18px', borderRadius: 20, background: '#3EA6FF', ...ui(16, 800, '#0f0f0f')}}>Shop now</div>
		</div>
		{[0, 1].map((i) => (
			<div key={i} style={{position: 'absolute', top: 420 + i * 200, left: 16, right: 16}}>
				<div style={{width: '100%', height: 140, borderRadius: 14, background: '#272727'}} />
				<Bar w="80%" h={14} c="#333" style={{marginTop: 14}} />
				<Bar w="50%" h={12} c="#2a2a2a" style={{marginTop: 10}} />
			</div>
		))}
	</div>
);

/** News website with a big jacket banner ad. */
export const NewsSite: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: '#fff', padding: '18px 26px', direction: 'ltr'}}>
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #111', paddingBottom: 10}}>
			<span style={{fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 900, color: '#111'}}>The Daily News</span>
			<span style={{display: 'flex', gap: 12}}>
				<Bar w={60} />
				<Bar w={60} />
				<Bar w={60} />
			</span>
		</div>
		<div
			style={{
				marginTop: 16,
				height: 120,
				borderRadius: 10,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				background: 'linear-gradient(90deg, #1b120d, #3a1d0e)',
				boxShadow: '0 0 0 3px rgba(255,106,26,0.6)',
			}}
		>
			<JacketTile width={160} height={120} tag={false} />
			<div style={{padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 4}}>
				<span style={ui(28, 900, '#fff')}>Jacket Co.</span>
				<span style={ui(18, 700, C.emberHot)}>The one you liked · -30%</span>
			</div>
			<div style={{marginLeft: 'auto', marginRight: 20, padding: '10px 18px', borderRadius: 10, background: C.ember, ...ui(18, 800, '#fff')}}>Shop now</div>
			<span style={{position: 'absolute', marginTop: -96, marginLeft: 4, ...ui(10, 700, '#aaa')}}>AD</span>
		</div>
		<div style={{display: 'flex', gap: 22, marginTop: 20}}>
			<div style={{flex: 2}}>
				<div style={{height: 170, borderRadius: 10, background: '#e9e9ee'}} />
				<Bar w="95%" h={18} c="#cfcfd6" style={{marginTop: 14}} />
				<Bar w="80%" h={18} c="#cfcfd6" style={{marginTop: 10}} />
				<Bar w="90%" h={10} style={{marginTop: 14}} />
			</div>
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
				{[0, 1, 2, 3].map((i) => (
					<div key={i} style={{display: 'flex', gap: 8}}>
						<div style={{width: 54, height: 44, borderRadius: 6, background: '#ececf0'}} />
						<div style={{flex: 1}}>
							<Bar w="100%" h={10} />
							<Bar w="70%" h={10} style={{marginTop: 8}} />
						</div>
					</div>
				))}
			</div>
		</div>
	</div>
);

/** Facebook desktop with the jacket in the right "Sponsored" column. */
export const FacebookSidebar: React.FC = () => (
	<div style={{position: 'absolute', inset: 0, background: '#f0f2f5', direction: 'ltr'}}>
		<div style={{height: 58, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, boxShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>
			<div style={{width: 40, height: 40, borderRadius: 20, background: '#0866FF', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
				<span style={{...ui(40, 900, '#fff'), lineHeight: '40px', marginBottom: -6, marginLeft: 6}}>f</span>
			</div>
			<div style={{width: 220, height: 36, borderRadius: 18, background: '#f0f2f5'}} />
		</div>
		<div style={{display: 'flex', gap: 16, padding: 16}}>
			<div style={{width: 130, display: 'flex', flexDirection: 'column', gap: 14}}>
				{[0, 1, 2, 3, 4].map((i) => (
					<div key={i} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
						<div style={{width: 26, height: 26, borderRadius: 13, background: '#d8dde6'}} />
						<Bar w={80} h={10} c="#d8dde6" />
					</div>
				))}
			</div>
			<div style={{flex: 1, background: '#fff', borderRadius: 10, padding: 14}}>
				<div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
					<div style={{width: 36, height: 36, borderRadius: 18, background: '#d8dde6'}} />
					<Bar w={120} h={12} c="#d8dde6" />
				</div>
				<Bar w="90%" h={10} style={{marginTop: 14}} />
				<div style={{height: 200, borderRadius: 8, background: '#e4e6eb', marginTop: 12}} />
			</div>
			<div style={{width: 230}}>
				<span style={ui(17, 800, '#65676B')}>Sponsored</span>
				<div
					style={{
						marginTop: 10,
						display: 'flex',
						gap: 10,
						alignItems: 'center',
						background: '#fff',
						borderRadius: 10,
						padding: 8,
						boxShadow: '0 0 0 3px rgba(255,106,26,0.55)',
					}}
				>
					<JacketTile width={100} height={100} tag={false} style={{borderRadius: 8}} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
						<span style={ui(16, 800)}>Jacket Co.</span>
						<span style={ui(13, 600, '#65676B')}>jacketco.com</span>
					</div>
				</div>
				<div style={{marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', opacity: 0.6}}>
					<div style={{width: 100, height: 70, borderRadius: 8, background: '#e4e6eb'}} />
					<div>
						<Bar w={90} h={10} c="#d8dde6" />
						<Bar w={60} h={10} c="#d8dde6" style={{marginTop: 8}} />
					</div>
				</div>
			</div>
		</div>
	</div>
);
