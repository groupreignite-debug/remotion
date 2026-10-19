import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, ARABIC, SNAPPY, SOFT} from '../brand';
import {Callout} from '../components/Callout';
import {lerpLayout, Phone, PhoneLayout} from '../components/Phone';
import {SITE_ONE_REGIONS, SiteOne} from '../components/SiteOne';
import {Stamp} from '../components/Stamp';
import {Headline} from '../components/Text';
import {COUNT1, COUNTDOWN_FRAMES, lineWords, S, wordAt} from '../timing';
import {CountdownNumber} from './Countdown';

export const STAGE: PhoneLayout = {x: 470, y: 1022, w: 500, rotY: -7, rotX: 3};
export const COUNT_LAYOUT: PhoneLayout = {x: 540, y: 1040, w: 560, rotY: 0, rotX: 0};
const K = STAGE.w / 880;

// Scenes 05–08 — the failing site
export const SiteOneStage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s05;
	const c1 = COUNT1 - from;
	const s6 = S.s06 - from;
	const s7 = S.s07 - from;
	const fail = wordAt(8, 'ما') - from;

	const inCount = frame >= c1 && frame < s6;
	const z = inCount ? spring({frame: frame - c1 + 3, fps, config: SOFT}) : 0;
	const layout = lerpLayout(STAGE, COUNT_LAYOUT, z);
	const progress = inCount ? Math.min(1, (frame - c1 + 1) / COUNTDOWN_FRAMES) : null;
	const scroll = inCount ? interpolate(frame - c1, [10, COUNTDOWN_FRAMES - 10], [0, 260], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

	// dashed outline searching for a button (scene 07)
	const spots = SITE_ONE_REGIONS.searchSpots;
	const order = [1, 2, 3, 0];
	let sx = spots[order[0]].x;
	let sy = spots[order[0]].y;
	order.forEach((o, i) => {
		if (i === 0) {
			return;
		}

		const p = spring({frame: frame - s7 - 6 - i * 13, fps, config: SOFT});
		sx += (spots[o].x - spots[order[i - 1]].x) * p;
		sy += (spots[o].y - spots[order[i - 1]].y) * p;
	});
	const searchIn = spring({frame: frame - s7 - 2, fps, config: SNAPPY});
	const qAt = s7 + 6 + order.length * 13;
	const q = frame >= qAt ? spring({frame: frame - qAt, fps, config: SNAPPY}) : 0;
	const qPulse = 1 + 0.12 * Math.sin((frame - qAt) / 4);

	const shakeAmt = interpolate(frame - fail, [0, 2, 14], [0, 18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shakeX = (random(`sx${frame}`) - 0.5) * shakeAmt;
	const shakeY = (random(`sy${frame}`) - 0.5) * shakeAmt;

	const screenFilter =
		frame >= fail ? 'grayscale(1) brightness(0.42)' : frame >= s6 ? 'grayscale(0.55) brightness(0.55)' : 'none';

	return (
		<div style={{position: 'absolute', inset: 0, transform: `translate(${shakeX}px, ${shakeY}px)`}}>
			<Headline words={lineWords(5)} from={from} top={190} size={84} accent={['عدّ']} exitAt={COUNT1} />
			<Headline words={lineWords(6)} from={from} top={160} size={64} accent={['وولا', 'كلمة']} exitAt={S.s07} width={1000} />
			<Headline words={lineWords(7)} from={from} top={160} size={64} accent={['زر']} exitAt={S.s08} width={1000} />
			<Headline words={lineWords(8)} from={from} top={200} size={76} accent={['ما', 'نجح']} exitAt={null} />
			<CountdownNumber at={c1} site="SITE 01" />
			<Phone
				layout={layout}
				label={inCount ? null : 'SITE 01'}
				progress={progress}
				screenFilter={screenFilter}
				overlay={
					<>
						{frame >= s6 && frame < s7 + 4 ? (
							<>
								<Callout box={SITE_ONE_REGIONS.welcome} at={wordAt(6, '"أهلا') - from} label="GREETING" labelAt={{x: -200, y: 300}} scale={K} />
								<Callout box={SITE_ONE_REGIONS.photo} at={wordAt(6, 'صورة') - from} label="HERO PHOTO" labelAt={{x: -200, y: 1150}} scale={K} />
							</>
						) : null}
						{frame >= s7 && frame < fail ? (
							<div
								style={{
									position: 'absolute',
									left: sx - 10,
									top: sy - 10,
									width: 380,
									height: 124,
									borderRadius: 24,
									border: `7px dashed ${C.accent}`,
									opacity: searchIn,
									transform: `scale(${0.7 + 0.3 * searchIn})`,
									boxShadow: '0 0 40px rgba(255,90,31,0.35)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div style={{fontFamily: ARABIC, fontWeight: 700, fontSize: 110, color: C.accent, transform: `scale(${q * qPulse})`, textShadow: '0 0 30px rgba(255,90,31,0.9)'}}>
									?
								</div>
							</div>
						) : null}
						<div style={{position: 'absolute', left: 440, top: 700, transform: 'translate(-50%, -50%)'}}>
							<Stamp type="fail" at={fail} size={250} rotate={-10} />
						</div>
					</>
				}
			>
				<SiteOne scroll={scroll} />
			</Phone>
		</div>
	);
};
