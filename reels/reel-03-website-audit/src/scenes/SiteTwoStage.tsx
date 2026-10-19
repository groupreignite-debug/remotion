import {interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SOFT} from '../brand';
import {Callout} from '../components/Callout';
import {lerpLayout, Phone} from '../components/Phone';
import {SITE_TWO_REGIONS, SITE_TWO_SETTLED, SiteTwo} from '../components/SiteTwo';
import {Headline} from '../components/Text';
import {COUNT2, COUNTDOWN_FRAMES, lineWords, S, wordAt} from '../timing';
import {CountdownNumber} from './Countdown';
import {COUNT_LAYOUT, STAGE} from './SiteOneStage';

const K = STAGE.w / 880;

// Scenes 09–10 — the passing site (provided screen recording)
export const SiteTwoStage: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s09;
	const c2 = COUNT2 - from;
	const s10 = S.s10 - from;
	const inCount = frame >= c2 && frame < s10;
	const z = inCount ? spring({frame: frame - c2 + 3, fps, config: SOFT}) : 0;
	const progress = inCount ? Math.min(1, (frame - c2 + 1) / COUNTDOWN_FRAMES) : null;
	const bright = frame >= s10 ? interpolate(frame - s10, [0, 12], [1.35, 1], {extrapolateRight: 'clamp'}) : 1;

	return (
		<>
			<Headline words={lineWords(9)} from={from} top={200} size={84} accent={['التاني.']} exitAt={COUNT2} />
			<Headline words={lineWords(10)} from={from} top={170} size={66} accent={['شو', 'بيعملوا،', 'ولمين،', 'والزر']} exitAt={null} width={1000} />
			<CountdownNumber at={c2} site="SITE 02" />
			<Phone
				layout={lerpLayout(STAGE, COUNT_LAYOUT, z)}
				label={inCount ? null : 'SITE 02'}
				progress={progress}
				screenFilter={`brightness(${bright})`}
				overlay={
					frame >= s10 ? (
						<>
							<Callout box={SITE_TWO_REGIONS.headline} at={wordAt(10, 'شو') - from} label="WHAT" labelAt={{x: -190, y: 260}} scale={K} />
							<Callout box={SITE_TWO_REGIONS.audience} at={wordAt(10, 'ولمين،') - from} label="WHO" labelAt={{x: -190, y: 1030}} scale={K} />
							<Callout box={SITE_TWO_REGIONS.button} at={wordAt(10, 'والزر') - from} label="NEXT STEP" labelAt={{x: -190, y: 820}} scale={K} />
						</>
					) : null
				}
			>
				<Sequence durationInFrames={s10} layout="none">
					<SiteTwo startFrom={0} playbackRate={1} />
				</Sequence>
				<Sequence from={s10} layout="none">
					<SiteTwo startFrom={SITE_TWO_SETTLED} playbackRate={0.45} />
				</Sequence>
			</Phone>
		</>
	);
};
