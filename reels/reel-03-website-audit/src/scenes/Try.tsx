import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C, SOFT} from '../brand';
import {Checklist} from '../components/Checklist';
import {Phone} from '../components/Phone';
import {Stopwatch} from '../components/Stopwatch';
import {Headline} from '../components/Text';
import {lineWords, S, wordAt} from '../timing';

export const TYPED_URL = 'موقعك.com';
export const typingStart = () => wordAt(12, 'موقعك');
export const CHAR_FRAMES = 2;

// Scene 12 — empty phone, address bar typing "موقعك.com", idle stopwatch, empty checklist
export const Try: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s12;
	const type0 = typingStart() - from;
	const chars = Math.max(0, Math.min(TYPED_URL.length, Math.floor((frame - type0) / CHAR_FRAMES) + 1));
	const caret = Math.floor(frame / 8) % 2 === 0;
	const inP = spring({frame, fps, config: SOFT});
	const sweep = (frame % 150) / 150;

	return (
		<>
			<Headline words={lineWords(12, 0)} from={from} top={180} size={74} accent={['موقعك']} exitAt={null} />
			<div style={{position: 'absolute', left: 95, top: 430, opacity: inP, transform: `scale(${0.7 + 0.3 * inP})`}}>
				<Stopwatch size={220} sweep={sweep} text={null} />
			</div>
			<Checklist
				appear={[4, 7, 10, 13, 16]}
				fill={[8, 11, 14, 17, 20]}
				dockAt={-100}
				dock={{x: 30, y: 790, w: 330, rowH: 86, gap: 12}}
				marks={[null, null, null, null, null]}
				header={null}
				score={null}
				dim={0}
			/>
			<Phone label="YOUR SITE" layout={{x: 715, y: 870 + Math.sin(frame / 22) * 6, w: 420, rotY: -9, rotX: 3}}>
				<div style={{position: 'absolute', inset: 0, background: '#121212'}}>
					<div
						style={{
							position: 'absolute',
							left: 40,
							right: 40,
							top: 120,
							height: 112,
							borderRadius: 56,
							background: '#262524',
							border: `4px solid ${chars > 0 ? C.accent : 'rgba(255,255,255,0.08)'}`,
							boxShadow: chars > 0 ? '0 0 40px rgba(255,90,31,0.35)' : 'none',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							fontFamily: ARABIC,
							fontWeight: 700,
							fontSize: 54,
							color: C.text,
						}}
					>
						<span style={{direction: 'ltr', unicodeBidi: 'isolate'}}>{TYPED_URL.slice(0, chars)}</span>
						<span style={{width: 5, height: 62, background: C.accent, opacity: caret ? 1 : 0}} />
					</div>
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: 60,
								width: i === 0 ? 760 : 760 - i * 110,
								top: 330 + i * (i === 0 ? 0 : 90) + (i > 0 ? 330 : 0),
								height: i === 0 ? 300 : 44,
								borderRadius: 18,
								background: `rgba(255,255,255,${0.04 + 0.025 * Math.sin(frame / 12 + i)})`,
							}}
						/>
					))}
				</div>
			</Phone>
			<Headline words={[...lineWords(12, 1), ...lineWords(12, 2)]} from={from} top={1300} size={70} accent={['في', 'شغل.']} exitAt={null} />
		</>
	);
};
