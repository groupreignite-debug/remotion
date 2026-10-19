import {random, useCurrentFrame} from 'remotion';
import {ARABIC, INTER} from '../brand';
import {SCREEN_W} from './Phone';

// Invented business. Built to look like a real-but-weak small-business site:
// big hero photo, "أهلا وسهلا / Welcome", vague slogan, cluttered nav, no clear button.
export const SITE_ONE_NAME = 'RIVANA';

// Regions in screen space (used for callouts)
export const SITE_ONE_REGIONS = {
	welcome: {x: 170, y: 400, w: 540, h: 205},
	photo: {x: 14, y: 176, w: 852, h: 884},
	searchSpots: [
		{x: 260, y: 770, w: 360, h: 104},
		{x: 470, y: 1300, w: 360, h: 104},
		{x: 60, y: 1300, w: 360, h: 104},
		{x: 260, y: 900, w: 360, h: 104},
	],
};

const BOKEH = new Array(26).fill(true).map((_, i) => ({
	x: random(`bx${i}`) * 900 - 10,
	y: 40 + random(`by${i}`) * 560,
	r: 22 + random(`br${i}`) * 70,
	hue: 28 + random(`bh${i}`) * 22,
	light: 62 + random(`bl${i}`) * 25,
	o: 0.25 + random(`bo${i}`) * 0.5,
	blur: 4 + random(`bb${i}`) * 14,
}));

const NAV = ['HOME', 'ABOUT US', 'SERVICES', 'PRODUCTS', 'GALLERY', 'NEWS', 'EVENTS', 'CAREERS', 'FAQ', 'CONTACT'];

export const SiteOne: React.FC<{scroll: number}> = ({scroll}) => {
	const frame = useCurrentFrame();
	const marquee = (frame * 2.2) % 700;
	const slide = Math.floor(frame / 50) % 4;

	return (
		<div style={{position: 'absolute', inset: 0, background: '#f4efe8', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: -scroll, width: SCREEN_W}}>
				{/* top utility bar */}
				<div
					style={{
						height: 92,
						background: '#2b2420',
						color: '#cbbfb2',
						fontFamily: INTER,
						fontSize: 17,
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'space-between',
						padding: '0 22px 10px',
					}}
				>
					<span>Mon–Sat 9:00–18:00</span>
					<span style={{display: 'flex', gap: 10}}>
						{['f', 'in', 'ig', 'yt', 'x'].map((s) => (
							<span key={s} style={{width: 24, height: 24, borderRadius: 12, background: '#544841', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd'}}>
								{s}
							</span>
						))}
					</span>
					<span>EN | عربي</span>
				</div>
				{/* cluttered nav */}
				<div style={{height: 84, background: '#fffaf3', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 14, borderBottom: '1px solid #e0d6ca'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0}}>
						<div style={{width: 40, height: 40, borderRadius: 20, background: 'radial-gradient(circle at 35% 35%, #c9a46a, #7a5a2e)'}} />
						<div style={{fontFamily: INTER, fontWeight: 800, fontSize: 24, color: '#5a4630', letterSpacing: '0.04em'}}>{SITE_ONE_NAME}</div>
					</div>
					<div style={{display: 'flex', flexWrap: 'wrap', columnGap: 11, rowGap: 2, fontFamily: INTER, fontSize: 13.5, fontWeight: 600, color: '#6d5c4b', lineHeight: 1.2}}>
						{NAV.map((n) => (
							<span key={n}>{n}</span>
						))}
					</div>
					<div style={{flexShrink: 0, display: 'flex', gap: 10, alignItems: 'center'}}>
						<div style={{width: 26, height: 26, borderRadius: 13, border: '3px solid #6d5c4b'}} />
						<div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
							{[0, 1, 2].map((i) => (
								<div key={i} style={{width: 30, height: 4, background: '#6d5c4b'}} />
							))}
						</div>
					</div>
				</div>
				{/* hero photo (warm café bokeh) */}
				<div style={{position: 'relative', height: 884, overflow: 'hidden', background: 'linear-gradient(170deg, #1d1410 0%, #4a3020 35%, #8c5a32 62%, #2d1d14 100%)'}}>
					<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 45% at 70% 30%, rgba(255,214,150,0.55), transparent 70%)'}} />
					{BOKEH.map((b, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: b.x + Math.sin(frame / 60 + i) * 4,
								top: b.y,
								width: b.r,
								height: b.r,
								borderRadius: '50%',
								background: `hsla(${b.hue}, 90%, ${b.light}%, ${b.o})`,
								filter: `blur(${b.blur}px)`,
							}}
						/>
					))}
					{/* table + cup silhouettes */}
					<div style={{position: 'absolute', left: -40, right: -40, top: 690, height: 240, background: 'linear-gradient(180deg, #3b2619, #1a100b)', borderRadius: '50% 50% 0 0 / 30% 30% 0 0'}} />
					<div style={{position: 'absolute', left: 560, top: 600, width: 150, height: 120, background: 'linear-gradient(90deg, #d8cfc4, #fff 40%, #bdb2a6)', borderRadius: '0 0 60px 60px'}} />
					<div style={{position: 'absolute', left: 700, top: 625, width: 46, height: 60, border: '12px solid #cfc5b9', borderLeft: 'none', borderRadius: '0 30px 30px 0'}} />
					<div style={{position: 'absolute', left: 540, top: 708, width: 190, height: 26, background: '#e9e2d9', borderRadius: '50%'}} />
					<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45))'}} />
					<div style={{position: 'absolute', top: 236, left: 0, right: 0, textAlign: 'center', color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>
						<div style={{fontFamily: ARABIC, fontWeight: 700, fontSize: 118, lineHeight: 1.2}}>أهلا وسهلا</div>
						<div style={{fontFamily: INTER, fontWeight: 300, fontSize: 60, letterSpacing: '0.12em', marginTop: -6}}>Welcome</div>
						<div style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 30, marginTop: 20, opacity: 0.9}}>Quality · Passion · Excellence</div>
					</div>
					{/* carousel arrows + dots */}
					{['‹', '›'].map((a, i) => (
						<div key={a} style={{position: 'absolute', top: 480, [i === 0 ? 'left' : 'right']: 16, width: 54, height: 54, borderRadius: 27, background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 44, lineHeight: '48px', textAlign: 'center'}}>
							{a}
						</div>
					))}
					<div style={{position: 'absolute', bottom: 26, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12}}>
						{[0, 1, 2, 3].map((d) => (
							<div key={d} style={{width: d === slide ? 30 : 12, height: 12, borderRadius: 6, background: d === slide ? '#fff' : 'rgba(255,255,255,0.5)'}} />
						))}
					</div>
				</div>
				{/* marquee */}
				<div style={{height: 64, background: '#b8864b', overflow: 'hidden', whiteSpace: 'nowrap', fontFamily: INTER, fontWeight: 700, fontSize: 22, color: '#fff', lineHeight: '64px'}}>
					<div style={{transform: `translateX(${-marquee}px)`}}>
						{'★ NEW ARRIVALS ★ SPECIAL OFFERS ★ BEST QUALITY ★ SINCE 1998 ★ NEW ARRIVALS ★ SPECIAL OFFERS ★ BEST QUALITY ★ SINCE 1998 ★'}
					</div>
				</div>
				{/* about */}
				<div style={{padding: '50px 46px 30px', direction: 'rtl', textAlign: 'right'}}>
					<div style={{fontFamily: ARABIC, fontWeight: 700, fontSize: 44, color: '#4a3a2c'}}>من نحن</div>
					<div style={{width: 70, height: 4, background: '#b8864b', margin: '10px 0 24px auto'}} />
					<div style={{fontFamily: ARABIC, fontSize: 27, lineHeight: 1.7, color: '#7b6d60'}}>
						نحن شركة رائدة نسعى دائماً إلى تقديم الأفضل لعملائنا الكرام. رؤيتنا هي التميّز، ورسالتنا هي الجودة والثقة والالتزام في كل ما نقوم به.
					</div>
					<div style={{fontFamily: INTER, fontSize: 21, color: '#a08a73', marginTop: 16, direction: 'ltr', textAlign: 'right'}}>Read more »</div>
				</div>
				{/* gallery */}
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '10px 30px'}}>
					{['#8b6a4a', '#b49572', '#6e5440', '#c7ab88'].map((c, i) => (
						<div key={i} style={{height: 250, borderRadius: 6, background: `linear-gradient(${40 + i * 50}deg, ${c}, #e8dccd)`}} />
					))}
				</div>
			</div>
		</div>
	);
};
