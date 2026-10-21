import {loadFont} from '@remotion/fonts';
import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// Cairo is bundled locally so rendering does not depend on Google Fonts
const fontFamily = 'Reignite Cairo';
loadFont({
	family: fontFamily,
	url: staticFile('reignite/cairo-arabic.woff2'),
	weight: '200 1000',
	unicodeRange:
		'U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFC',
});
loadFont({
	family: fontFamily,
	url: staticFile('reignite/cairo-latin.woff2'),
	weight: '200 1000',
	unicodeRange: 'U+0000-00FF, U+2000-206F',
});

const BG = '#0E0E0E';
const ORANGE = '#FF5A1F';
const WHITE = '#FFFFFF';
const GREEN = '#2BD576';
const RED = '#FF3B3B';
const PANEL = '#1A1A1A';
const LINE = '#2C2C2C';

// Instagram safe zone: x 0-850, y 230-1440
const SAFE_W = 850;
const CX = SAFE_W / 2;

const s = (sec: number) => Math.round(sec * 30);

const SCENES: {from: number; vo: string | null}[] = [
	{from: 0, vo: 'عندك Google Analytics؟ بعدك بحاجة لـPixel.'},
	{from: 2.9, vo: 'عم تدفع على إعلانات Meta؟ هيدا بيهمّك.'},
	{from: 5.1, vo: 'Google Analytics بيراقب موقعك.'},
	{from: 6.9, vo: 'من وين إجا الزائر، وشو عمل.'},
	{from: 9.4, vo: 'الـPixel بيبعت هالمعلومات لـMeta.'},
	{from: 11.6, vo: 'لتعرف مين اشترى بسبب الإعلان.'},
	{from: 14.6, vo: 'وترجع تلحق اللي فلّوا بلا ما يشتروا.'},
	{from: 16.7, vo: 'وتلاقي ناس بيشبهوا زبائنك.'},
	{from: 18.9, vo: 'Analytics بيخبرك. الـPixel بيعلّم إعلانك.'},
	{from: 21.4, vo: 'عم تشغّل إعلانات Meta؟ بدك التنين.'},
	{from: 23.6, vo: 'مش متأكد إذا موقعك فيه واحد؟'},
	{from: 25.8, vo: 'اكتب PIXEL بالكومنتات ومنشيّك معك.'},
	{from: 28.4, vo: null},
].map((scene) => ({...scene, from: s(scene.from)}));

export const REIGNITE_REEL_DURATION = s(30);

const usePop = (delay: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.6}});
};

const Orange: React.FC<{children: React.ReactNode}> = ({children}) => (
	<span style={{color: ORANGE}}>{children}</span>
);

const Card: React.FC<{
	children: React.ReactNode;
	dir?: 'rtl' | 'ltr';
	fontSize?: number;
	instant?: boolean;
}> = ({children, dir = 'rtl', fontSize = 92, instant = false}) => {
	const pop = usePop(0);
	const scale = instant ? interpolate(pop, [0, 1], [0.94, 1]) : pop;
	return (
		<div
			dir={dir}
			style={{
				position: 'absolute',
				top: 270,
				left: 0,
				width: SAFE_W,
				textAlign: 'center',
				fontFamily,
				fontWeight: 900,
				fontSize,
				lineHeight: 1.25,
				color: WHITE,
				transform: `scale(${scale})`,
				opacity: instant ? 1 : Math.min(1, pop * 2),
				textShadow: '0 6px 30px rgba(0,0,0,0.8)',
			}}
		>
			{children}
		</div>
	);
};

const Subtitle: React.FC<{text: string; durationInFrames: number}> = ({
	text,
	durationInFrames,
}) => {
	const frame = useCurrentFrame();
	const words = text.split(' ');
	const speakFrames = durationInFrames * 0.88;
	const active = Math.floor((frame / speakFrames) * words.length);
	return (
		<div
			style={{
				position: 'absolute',
				top: 1250,
				left: 30,
				width: SAFE_W - 60,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				dir="rtl"
				style={{
					fontFamily,
					fontWeight: 700,
					fontSize: 50,
					lineHeight: 1.45,
					textAlign: 'center',
					color: WHITE,
					background: 'rgba(0,0,0,0.6)',
					borderRadius: 24,
					padding: '10px 28px',
				}}
			>
				{words.map((word, i) => (
					<React.Fragment key={i}>
						<span
							style={{
								color: i === active ? ORANGE : WHITE,
								opacity: i <= active ? 1 : 0.35,
							}}
						>
							{word}
						</span>{' '}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const glowX = CX + Math.sin(frame / 40) * 160;
	const glowY = 820 + Math.cos(frame / 55) * 200;
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
					backgroundSize: '90px 90px',
					backgroundPosition: `0px ${(frame * 1.5) % 90}px`,
					opacity: 0.35,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${glowX}px ${glowY}px, rgba(255,90,31,0.28), transparent 520px)`,
				}}
			/>
		</AbsoluteFill>
	);
};

// Visual stage between the card and the subtitles
const Stage: React.FC<{children: React.ReactNode; zoom?: number}> = ({
	children,
	zoom = 1,
}) => (
	<div
		style={{
			position: 'absolute',
			top: 560,
			left: 0,
			width: SAFE_W,
			height: 640,
			transform: `scale(${zoom})`,
		}}
	>
		{children}
	</div>
);

const Laptop: React.FC<{children: React.ReactNode; width?: number}> = ({
	children,
	width = 640,
}) => {
	const height = width * 0.62;
	return (
		<div
			style={{
				position: 'absolute',
				left: CX - width / 2,
				top: 320 - height / 2 - 20,
				width,
			}}
		>
			<div
				style={{
					width,
					height,
					borderRadius: 22,
					border: `10px solid #333`,
					background: PANEL,
					overflow: 'hidden',
					position: 'relative',
					boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
				}}
			>
				{children}
			</div>
			<div
				style={{
					width: width + 80,
					marginLeft: -40,
					height: 22,
					background: '#3A3A3A',
					borderRadius: '0 0 18px 18px',
				}}
			/>
		</div>
	);
};

const Phone: React.FC<{
	children: React.ReactNode;
	x: number;
	y?: number;
	height?: number;
}> = ({children, x, y = 0, height = 600}) => {
	const width = height * 0.5;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - width / 2,
				top: y + 320 - height / 2,
				width,
				height,
				borderRadius: 44,
				border: '10px solid #333',
				background: PANEL,
				overflow: 'hidden',
				boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
			}}
		>
			{children}
		</div>
	);
};

const Bar: React.FC<{w: number | string; h?: number; color?: string}> = ({
	w,
	h = 16,
	color = '#3A3A3A',
}) => (
	<div
		style={{
			width: w,
			height: h,
			borderRadius: h / 2,
			background: color,
			marginBottom: 12,
		}}
	/>
);

const FeedPost: React.FC<{sponsored?: boolean}> = ({sponsored = false}) => (
	<div
		style={{
			margin: 14,
			padding: 14,
			borderRadius: 18,
			background: sponsored ? '#2A1A12' : '#222',
			border: sponsored ? `3px solid ${ORANGE}` : '3px solid transparent',
		}}
	>
		<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
			<div
				style={{
					width: 34,
					height: 34,
					borderRadius: 17,
					background: sponsored ? ORANGE : '#444',
				}}
			/>
			<Bar
				w={sponsored ? 70 : 100}
				h={12}
				color={sponsored ? ORANGE : '#444'}
			/>
		</div>
		<div
			style={{
				marginTop: 10,
				height: 150,
				borderRadius: 12,
				background: sponsored
					? `linear-gradient(135deg, ${ORANGE}, #FF9A3C)`
					: '#333',
			}}
		/>
	</div>
);

const Check: React.FC<{size: number; color: string; cross?: boolean}> = ({
	size,
	color,
	cross = false,
}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="46" fill={color} />
		{cross ? (
			<path
				d="M32 32 L68 68 M68 32 L32 68"
				stroke={WHITE}
				strokeWidth="12"
				strokeLinecap="round"
			/>
		) : (
			<path
				d="M28 52 L44 68 L74 36"
				stroke={WHITE}
				strokeWidth="12"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		)}
	</svg>
);

const Person: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx="50" cy="32" r="20" fill={color} />
		<path d="M14 96 C14 66 86 66 86 96 Z" fill={color} />
	</svg>
);

const Website: React.FC = () => (
	<div style={{padding: 26}}>
		<div style={{display: 'flex', gap: 10, marginBottom: 22}}>
			{[RED, '#FFB020', GREEN].map((c) => (
				<div
					key={c}
					style={{width: 16, height: 16, borderRadius: 8, background: c}}
				/>
			))}
		</div>
		<Bar w="60%" h={26} color="#444" />
		<Bar w="85%" />
		<Bar w="70%" />
		<div style={{display: 'flex', gap: 16, marginTop: 18}}>
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					style={{
						flex: 1,
						height: 120,
						borderRadius: 14,
						background: '#2A2A2A',
					}}
				/>
			))}
		</div>
	</div>
);

// ---------- Scenes ----------

const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const check = usePop(14);
	const stamp = usePop(42);
	return (
		<>
			<Card dir="ltr" fontSize={82} instant>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 24,
					}}
				>
					Google Analytics
					<div style={{transform: `scale(${check})`}}>
						<Check size={80} color={GREEN} />
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 24,
					}}
				>
					<Orange>Pixel</Orange>
					<div
						style={{
							transform: `scale(${interpolate(stamp, [0, 1], [2.6, 1])}) rotate(${interpolate(stamp, [0, 1], [-25, 0])}deg)`,
							opacity: stamp > 0.02 ? 1 : 0,
						}}
					>
						<Check size={80} color={RED} cross />
					</div>
				</div>
			</Card>
			<Stage zoom={interpolate(frame, [0, 87], [1, 1.08])}>
				<Laptop>
					<div
						style={{
							padding: 24,
							transform: `translateY(${-((frame * 4) % 200)}px)`,
						}}
					>
						{[0, 1].map((block) => (
							<div key={block} style={{marginBottom: 30}}>
								<div style={{display: 'flex', gap: 14, marginBottom: 20}}>
									{[0, 1, 2].map((i) => (
										<div
											key={i}
											style={{
												flex: 1,
												height: 60,
												borderRadius: 12,
												background: '#262626',
											}}
										/>
									))}
								</div>
								<div
									style={{
										display: 'flex',
										alignItems: 'flex-end',
										gap: 14,
										height: 170,
									}}
								>
									{[0.5, 0.7, 0.45, 0.85, 0.65, 0.95, 0.75].map((h, i) => (
										<div
											key={i}
											style={{
												flex: 1,
												borderRadius: 8,
												background: i % 2 ? ORANGE : '#555',
												height: `${h * 100 * Math.min(1, Math.max(0, (frame - i * 3) / 18))}%`,
											}}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				</Laptop>
			</Stage>
		</>
	);
};

const Scene2: React.FC = () => {
	const frame = useCurrentFrame();
	const zoom = interpolate(frame, [0, 66], [0.9, 1.15]);
	return (
		<>
			<Card>
				عم تدفع على <Orange>إعلانات</Orange>؟
			</Card>
			<Stage zoom={zoom}>
				<Phone x={CX}>
					<div style={{transform: `translateY(${-frame * 5}px)`}}>
						<FeedPost />
						<FeedPost sponsored />
						<FeedPost />
						<FeedPost />
					</div>
				</Phone>
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const t = (frame - i * 8) / 22;
					if (t < 0 || t > 1) return null;
					const x = CX - 120 + ((i * 53) % 240);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: x - 30,
								top: interpolate(t, [0, 1], [-60, 300]),
								width: 60,
								height: 60,
								borderRadius: 30,
								background: '#FFB020',
								border: '5px solid #C98200',
								opacity: interpolate(t, [0.75, 1], [1, 0], {
									extrapolateLeft: 'clamp',
								}),
								fontFamily,
								fontWeight: 900,
								fontSize: 36,
								color: '#7A4D00',
								textAlign: 'center',
								lineHeight: '50px',
							}}
						>
							$
						</div>
					);
				})}
			</Stage>
		</>
	);
};

const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const sweep = frame * 6;
	return (
		<>
			<Card>
				<span dir="ltr">GA</span> = <Orange>بيراقب</Orange> موقعك
			</Card>
			<Stage>
				<Laptop>
					<Website />
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: `conic-gradient(from ${sweep}deg at 50% 50%, rgba(255,90,31,0.35), transparent 60deg)`,
						}}
					/>
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: `${((i * 23 + frame * (1.5 + i * 0.3)) % 100).toFixed(1)}%`,
								top: `${20 + i * 14 + Math.sin(frame / 8 + i) * 6}%`,
								width: 22,
								height: 22,
								borderRadius: 11,
								background: ORANGE,
								boxShadow: `0 0 20px ${ORANGE}`,
							}}
						/>
					))}
				</Laptop>
				<svg
					width={150}
					height={150}
					viewBox="0 0 100 100"
					style={{
						position: 'absolute',
						left: CX - 75,
						top: -40,
						transform: `scale(${usePop(4)})`,
					}}
				>
					<path
						d="M5 50 Q50 5 95 50 Q50 95 5 50 Z"
						fill={PANEL}
						stroke={ORANGE}
						strokeWidth="6"
					/>
					<circle
						cx={50 + Math.sin(frame / 6) * 10}
						cy="50"
						r="16"
						fill={ORANGE}
					/>
				</svg>
			</Stage>
		</>
	);
};

const SourceIcon: React.FC<{kind: 'search' | 'social' | 'email'}> = ({
	kind,
}) => (
	<svg width={110} height={110} viewBox="0 0 100 100">
		<rect
			width="100"
			height="100"
			rx="26"
			fill={PANEL}
			stroke="#444"
			strokeWidth="4"
		/>
		{kind === 'search' ? (
			<>
				<circle
					cx="44"
					cy="44"
					r="18"
					stroke={WHITE}
					strokeWidth="8"
					fill="none"
				/>
				<path
					d="M58 58 L74 74"
					stroke={WHITE}
					strokeWidth="8"
					strokeLinecap="round"
				/>
			</>
		) : kind === 'social' ? (
			<>
				<circle cx="30" cy="50" r="9" fill={WHITE} />
				<circle cx="70" cy="30" r="9" fill={WHITE} />
				<circle cx="70" cy="70" r="9" fill={WHITE} />
				<path d="M30 50 L70 30 M30 50 L70 70" stroke={WHITE} strokeWidth="5" />
			</>
		) : (
			<>
				<rect
					x="22"
					y="30"
					width="56"
					height="40"
					rx="6"
					stroke={WHITE}
					strokeWidth="6"
					fill="none"
				/>
				<path
					d="M24 33 L50 54 L76 33"
					stroke={WHITE}
					strokeWidth="6"
					fill="none"
				/>
			</>
		)}
	</svg>
);

const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const kinds = ['search', 'social', 'email'] as const;
	const pops = [usePop(0), usePop(5), usePop(10)];
	return (
		<>
			<Card>
				<Orange>من وين</Orange> إجا؟ <Orange>شو</Orange> عمل؟
			</Card>
			<Stage>
				{kinds.map((kind, i) => {
					const pop = pops[i];
					return (
						<div
							key={kind}
							style={{
								position: 'absolute',
								left: 110 + i * 260 - 55,
								top: -40,
								transform: `scale(${pop})`,
							}}
						>
							<SourceIcon kind={kind} />
						</div>
					);
				})}
				<svg
					width={SAFE_W}
					height={640}
					style={{position: 'absolute', left: 0, top: 0}}
				>
					{kinds.map((kind, i) => (
						<path
							key={kind}
							d={`M${110 + i * 260} 80 Q${110 + i * 260} 180 ${CX} 240`}
							stroke={ORANGE}
							strokeWidth={6}
							fill="none"
							strokeDasharray="14 14"
							strokeDashoffset={-frame * 3}
						/>
					))}
				</svg>
				<div
					style={{
						position: 'absolute',
						left: CX - 280,
						top: 240,
						width: 560,
						height: 360,
						borderRadius: 22,
						border: '8px solid #333',
						background: PANEL,
						overflow: 'hidden',
					}}
				>
					<Website />
					{[
						[30, 40],
						[70, 30],
						[50, 70],
						[20, 75],
						[80, 72],
					].map(([x, y], i) => {
						const p = interpolate(frame - 15 - i * 7, [0, 12], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						});
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: `${x}%`,
									top: `${y}%`,
									width: 140,
									height: 140,
									marginLeft: -70,
									marginTop: -70,
									borderRadius: 70,
									background: `radial-gradient(circle, rgba(255,59,59,0.8), rgba(255,176,32,0.4) 45%, transparent 70%)`,
									transform: `scale(${p})`,
								}}
							/>
						);
					})}
				</div>
			</Stage>
		</>
	);
};

const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const cloud = usePop(10);
	return (
		<>
			<Card dir="ltr">
				<Orange>Pixel</Orange> ➜ Meta
			</Card>
			<Stage>
				<div
					style={{
						position: 'absolute',
						left: CX - 160,
						top: -20,
						width: 320,
						height: 160,
						borderRadius: 80,
						background: '#222',
						border: `6px solid ${WHITE}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily,
						fontWeight: 900,
						fontSize: 64,
						color: WHITE,
						transform: `scale(${cloud})`,
					}}
				>
					Meta
				</div>
				{new Array(14).fill(true).map((_, i) => {
					const t = ((frame * 2.2 + i * 31) % 300) / 300;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: CX - 10 + Math.sin(i * 1.7 + frame / 10) * 40,
								top: interpolate(t, [0, 1], [440, 150]),
								width: 20,
								height: 20,
								background: ORANGE,
								boxShadow: `0 0 18px ${ORANGE}`,
								opacity: Math.sin(t * Math.PI),
							}}
						/>
					);
				})}
				<div
					style={{
						position: 'absolute',
						left: CX - 280,
						top: 440,
						width: 560,
						height: 200,
						borderRadius: 22,
						border: '8px solid #333',
						background: PANEL,
						overflow: 'hidden',
					}}
				>
					<Website />
				</div>
				<div
					style={{
						position: 'absolute',
						left: CX - 50,
						top: 400,
						width: 100,
						height: 100,
						borderRadius: 16,
						background: ORANGE,
						boxShadow: `0 0 ${40 + Math.sin(frame / 4) * 20}px ${ORANGE}`,
						fontFamily: 'monospace',
						fontWeight: 700,
						fontSize: 40,
						color: WHITE,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{'</>'}
				</div>
			</Stage>
		</>
	);
};

const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const notif = usePop(20);
	const line = interpolate(frame, [35, 60], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<>
			<Card>
				<Orange>١.</Orange> مين اشترى من الإعلان
			</Card>
			<Stage>
				<Phone x={190} height={500}>
					<FeedPost sponsored />
				</Phone>
				<svg
					width={SAFE_W}
					height={640}
					style={{position: 'absolute', left: 0, top: 0}}
				>
					<path
						d={`M600 200 Q420 60 300 220`}
						stroke={ORANGE}
						strokeWidth={8}
						fill="none"
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - line}
					/>
				</svg>
				<svg
					width={220}
					height={220}
					viewBox="0 0 100 100"
					style={{position: 'absolute', left: 520, top: 260}}
				>
					<path
						d="M10 20 H24 L34 64 H80 L88 34 H30"
						stroke={WHITE}
						strokeWidth="7"
						fill="none"
						strokeLinejoin="round"
						strokeLinecap="round"
					/>
					<circle cx="40" cy="78" r="7" fill={WHITE} />
					<circle cx="74" cy="78" r="7" fill={WHITE} />
				</svg>
				<div
					style={{
						position: 'absolute',
						left: 440,
						top: 130,
						padding: '18px 26px',
						borderRadius: 20,
						background: WHITE,
						display: 'flex',
						alignItems: 'center',
						gap: 14,
						fontFamily,
						fontWeight: 900,
						fontSize: 40,
						color: BG,
						transform: `scale(${notif})`,
						boxShadow: `0 0 50px rgba(255,90,31,${0.6 * line})`,
					}}
				>
					<Check size={50} color={GREEN} /> Purchase
				</div>
			</Stage>
		</>
	);
};

const Scene7: React.FC = () => {
	const frame = useCurrentFrame();
	const leave = interpolate(frame, [5, 25], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const back = interpolate(frame, [22, 45], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const phone = usePop(30);
	return (
		<>
			<Card>
				<Orange>٢.</Orange> يلحق اللي <Orange>فلّوا</Orange>
			</Card>
			<Stage>
				<div
					style={{
						position: 'absolute',
						left: 40,
						top: 60,
						width: 360,
						height: 260,
						borderRadius: 18,
						border: '8px solid #333',
						background: PANEL,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							transform: 'scale(0.7)',
							transformOrigin: 'top left',
							width: '143%',
						}}
					>
						<Website />
					</div>
				</div>
				<div
					style={{
						position: 'absolute',
						left: interpolate(leave, [0, 1], [180, 90]),
						top: interpolate(leave, [0, 1], [160, 380]),
						opacity: 1 - back * 0.6,
					}}
				>
					<Person size={110} color={WHITE} />
				</div>
				<svg
					width={110}
					height={110}
					viewBox="0 0 100 100"
					style={{position: 'absolute', left: 290, top: 230, opacity: leave}}
				>
					<path
						d="M10 20 H24 L34 64 H80 L88 34 H30"
						stroke={RED}
						strokeWidth="8"
						fill="none"
						strokeLinejoin="round"
					/>
					<path d="M44 30 L72 58 M72 30 L44 58" stroke={RED} strokeWidth="8" />
				</svg>
				<svg
					width={SAFE_W}
					height={640}
					style={{position: 'absolute', left: 0, top: 0}}
				>
					<path
						d="M160 470 C 300 640, 520 600, 600 420"
						stroke={ORANGE}
						strokeWidth={10}
						fill="none"
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={1 - back}
					/>
					<path
						d="M570 440 L600 400 L630 450"
						stroke={ORANGE}
						strokeWidth={10}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						opacity={back > 0.95 ? 1 : 0}
					/>
				</svg>
				<div
					style={{transform: `scale(${phone})`, transformOrigin: '640px 220px'}}
				>
					<Phone x={640} y={-90} height={420}>
						<FeedPost sponsored />
					</Phone>
				</div>
			</Stage>
		</>
	);
};

const Scene8: React.FC = () => {
	const frame = useCurrentFrame();
	const cols = 5;
	const rows = 4;
	return (
		<>
			<Card>
				<Orange>٣.</Orange> ناس <Orange>متل</Orange> زبائنك
			</Card>
			<Stage>
				{new Array(cols * rows).fill(true).map((_, i) => {
					const col = i % cols;
					const row = Math.floor(i / cols);
					const isOrigin = i === 7;
					const dist = Math.hypot(col - 2, row - 1.5);
					const t = isOrigin
						? 1
						: interpolate(frame, [8 + dist * 8, 22 + dist * 8], [0, 1], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							});
					const x = interpolate(t, [0, 1], [CX, 85 + col * 170]);
					const y = interpolate(t, [0, 1], [290, 70 + row * 150]);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: x - 60,
								top: y - 60,
								opacity: t,
								transform: `scale(${isOrigin ? 1.25 + Math.sin(frame / 5) * 0.05 : t})`,
								zIndex: isOrigin ? 2 : 1,
							}}
						>
							<Person size={120} color={isOrigin ? ORANGE : '#DDDDDD'} />
						</div>
					);
				})}
			</Stage>
		</>
	);
};

const Scene9: React.FC = () => {
	const frame = useCurrentFrame();
	const grow = interpolate(frame, [20, 70], [0, 1], {
		extrapolateRight: 'clamp',
	});
	return (
		<>
			<Card fontSize={76}>
				<div style={{display: 'flex', justifyContent: 'space-around'}}>
					<div>
						<span dir="ltr">GA</span> بيخبرك
					</div>
					<div style={{color: '#555'}}>|</div>
					<div>
						<Orange>Pixel</Orange> بيعلّم
					</div>
				</div>
			</Card>
			<SplitHalves offset={0} spark={0} grow={grow} frame={frame} />
		</>
	);
};

const SplitHalves: React.FC<{
	offset: number;
	spark: number;
	grow: number;
	frame: number;
}> = ({offset, spark, grow, frame}) => (
	<Stage>
		{/* Right half in RTL reading order = GA (static report) */}
		<div
			style={{
				position: 'absolute',
				left: 445 - offset,
				top: 40,
				width: 380,
				height: 520,
				borderRadius: 26,
				background: PANEL,
				border: '6px solid #333',
				padding: 30,
				display: 'flex',
				alignItems: 'flex-end',
				gap: 18,
				boxSizing: 'border-box',
			}}
		>
			{[0.4, 0.6, 0.5, 0.75].map((h, i) => (
				<div
					key={i}
					style={{
						flex: 1,
						height: `${h * 80}%`,
						borderRadius: 10,
						background: '#555',
					}}
				/>
			))}
		</div>
		{/* Left half = Pixel (ad that learns) */}
		<div
			style={{
				position: 'absolute',
				left: 25 + offset,
				top: 40,
				width: 380,
				height: 520,
				borderRadius: 26,
				background: '#2A1A12',
				border: `6px solid ${ORANGE}`,
				padding: 24,
				boxSizing: 'border-box',
			}}
		>
			<div
				style={{
					height: 230,
					borderRadius: 16,
					background: `linear-gradient(135deg, ${ORANGE}, #FF9A3C)`,
					filter: `saturate(${0.6 + grow * 0.8})`,
				}}
			/>
			<div
				style={{
					display: 'flex',
					gap: 16,
					marginTop: 30,
					justifyContent: 'center',
				}}
			>
				{[0, 1, 2].map((i) => {
					const y = ((frame * 3 + i * 40) % 120) / 120;
					return (
						<svg
							key={i}
							width={80}
							height={140}
							viewBox="0 0 40 70"
							style={{
								transform: `translateY(${(1 - y) * 30}px)`,
								opacity: Math.sin(y * Math.PI),
							}}
						>
							<path
								d="M20 64 V10 M6 24 L20 8 L34 24"
								stroke={ORANGE}
								strokeWidth="6"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					);
				})}
			</div>
		</div>
		{spark > 0 ? (
			<div
				style={{
					position: 'absolute',
					left: CX - 300,
					top: 0,
					width: 600,
					height: 600,
					borderRadius: 300,
					background: `radial-gradient(circle, rgba(255,200,120,${spark}), rgba(255,90,31,${spark * 0.6}) 30%, transparent 65%)`,
					transform: `scale(${0.4 + (1 - spark) * 1.2})`,
				}}
			/>
		) : null}
	</Stage>
);

const Scene10: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const close = spring({frame: frame - 4, fps, config: {damping: 14}});
	const spark = interpolate(frame, [14, 34], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const punch = spring({frame: frame - 14, fps, config: {damping: 8}});
	return (
		<>
			<div
				style={{transform: `scale(${interpolate(punch, [0, 1], [1.3, 1])})`}}
			>
				<Card fontSize={120}>
					بدك <Orange>التنين</Orange>
				</Card>
			</div>
			<SplitHalves
				offset={close * 210}
				spark={frame >= 14 ? spark : 0}
				grow={1}
				frame={frame}
			/>
		</>
	);
};

const Scene11: React.FC = () => {
	const frame = useCurrentFrame();
	const blink = Math.floor(frame / 8) % 2 === 0;
	return (
		<>
			<Card>
				موقعك فيه <Orange>Pixel</Orange>؟
			</Card>
			<Stage>
				<Laptop>
					<Website />
				</Laptop>
				<svg
					width={220}
					height={220}
					viewBox="0 0 100 100"
					style={{
						position: 'absolute',
						left: CX - 160 + Math.sin(frame / 9) * 150,
						top: 120 + Math.cos(frame / 7) * 60,
					}}
				>
					<circle
						cx="40"
						cy="40"
						r="28"
						stroke={ORANGE}
						strokeWidth="8"
						fill="rgba(255,90,31,0.15)"
					/>
					<path
						d="M60 60 L88 88"
						stroke={ORANGE}
						strokeWidth="12"
						strokeLinecap="round"
					/>
				</svg>
				<div
					style={{
						position: 'absolute',
						left: 640,
						top: -30,
						fontFamily,
						fontWeight: 900,
						fontSize: 170,
						color: ORANGE,
						opacity: blink ? 1 : 0.25,
					}}
				>
					?
				</div>
			</Stage>
		</>
	);
};

const Scene12: React.FC = () => {
	const frame = useCurrentFrame();
	const letters = Math.min(5, Math.floor(frame / 6));
	const bounce = Math.abs(Math.sin(frame / 6)) * 30;
	return (
		<>
			<Card fontSize={100}>اكتب 👇</Card>
			<div
				style={{
					position: 'absolute',
					top: 470,
					left: 0,
					width: SAFE_W,
					textAlign: 'center',
					fontFamily,
					fontWeight: 900,
					fontSize: 230,
					letterSpacing: 10,
					color: ORANGE,
					textShadow: `0 0 60px rgba(255,90,31,0.6)`,
				}}
			>
				{'PIXEL'.slice(0, letters)}
				<span
					style={{opacity: Math.floor(frame / 8) % 2 ? 0 : 1, color: WHITE}}
				>
					|
				</span>
			</div>
			<svg
				width={200}
				height={180}
				viewBox="0 0 100 90"
				style={{
					position: 'absolute',
					left: CX - 100,
					top: 860,
					transform: `scale(${usePop(30)})`,
				}}
			>
				<path
					d="M10 10 H90 V60 H45 L25 80 V60 H10 Z"
					fill={PANEL}
					stroke={WHITE}
					strokeWidth="5"
					strokeLinejoin="round"
				/>
				<circle cx="32" cy="35" r="5" fill={ORANGE} />
				<circle cx="50" cy="35" r="5" fill={ORANGE} />
				<circle cx="68" cy="35" r="5" fill={ORANGE} />
			</svg>
			<svg
				width={120}
				height={150}
				viewBox="0 0 40 50"
				style={{position: 'absolute', left: CX - 60, top: 1060 + bounce}}
			>
				<path
					d="M20 4 V42 M6 28 L20 44 L34 28"
					stroke={ORANGE}
					strokeWidth="6"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</>
	);
};

const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = usePop(0);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${CX}px 800px, rgba(255,90,31,${0.25 + Math.sin(frame / 5) * 0.08}), transparent 480px)`,
				}}
			/>
			<Img
				src={staticFile('reignite/logo.png')}
				style={{
					position: 'absolute',
					width: 720,
					height: 720,
					left: CX - 360,
					top: 835 - 360,
					mixBlendMode: 'lighten',
					transform: `scale(${interpolate(pop, [0, 1], [0.85, 1])})`,
					opacity: pop,
				}}
			/>
		</AbsoluteFill>
	);
};

const SCENE_COMPONENTS: React.FC[] = [
	Scene1,
	Scene2,
	Scene3,
	Scene4,
	Scene5,
	Scene6,
	Scene7,
	Scene8,
	Scene9,
	Scene10,
	Scene11,
	Scene12,
	EndCard,
];

export const ReigniteReel: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<Background />
			{SCENES.map((scene, i) => {
				const end = SCENES[i + 1]?.from ?? REIGNITE_REEL_DURATION;
				const duration = end - scene.from;
				const SceneComponent = SCENE_COMPONENTS[i];
				return (
					<Sequence
						key={i}
						from={scene.from}
						durationInFrames={duration}
						name={`Scene ${i + 1}`}
					>
						<SceneComponent />
						{scene.vo ? (
							<Subtitle text={scene.vo} durationInFrames={duration} />
						) : null}
						{i > 0 ? (
							<Audio src={staticFile('reignite/whoosh.wav')} volume={0.35} />
						) : null}
						<Sequence from={i === 0 ? 14 : 3} layout="none">
							<Audio src={staticFile('reignite/pop.wav')} volume={0.3} />
						</Sequence>
					</Sequence>
				);
			})}
			<Sequence from={SCENES[0].from + 42} durationInFrames={20} layout="none">
				<Audio src={staticFile('reignite/impact.wav')} volume={0.4} />
			</Sequence>
			<Sequence from={SCENES[9].from + 12} durationInFrames={20} layout="none">
				<Audio src={staticFile('reignite/impact.wav')} volume={0.5} />
			</Sequence>
			{[1, 2, 3, 4, 5].map((n) => (
				<Sequence
					key={n}
					from={SCENES[11].from + n * 6}
					durationInFrames={6}
					layout="none"
				>
					<Audio src={staticFile('reignite/click.wav')} volume={0.45} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
