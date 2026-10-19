import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER, SOFT} from '../brand';
import {Phone} from '../components/Phone';
import {SiteOne} from '../components/SiteOne';
import {SiteTwo} from '../components/SiteTwo';
import {Stopwatch} from '../components/Stopwatch';
import {Word} from '../components/Text';
import {lineWords, norm} from '../timing';

// Scene 01 — HOOK. Starts moving on frame 0: phones are mid-slide, stopwatch already ticking.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = lineWords(1);
	const at = (t: string) => words.find((w) => norm(w.w) === norm(t))!.frame;
	const slide = spring({frame: frame + 9, fps, config: SOFT, durationInFrames: 30});
	const bob = Math.sin(frame / 22) * 8;
	const row = (list: string[], size: number) =>
		list.map((t) => <Word key={t} text={t} at={at(t)} size={size} accent={false} />);

	return (
		<>
			<div style={{position: 'absolute', top: 170, left: 0, right: 0, direction: 'rtl', display: 'flex', justifyContent: 'center', gap: 24}}>
				{row(['خلّينا', 'نعمل', 'الـ'], 84)}
			</div>
			<div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 34}}>
				<Word text="5-Second" at={at('5-Second')} size={122} accent font={INTER} weight={900} />
				<Word text="Test" at={at('Test')} size={122} accent font={INTER} weight={900} />
			</div>
			<div style={{position: 'absolute', top: 455, left: 0, right: 0, direction: 'rtl', display: 'flex', justifyContent: 'center', gap: 24}}>
				{row(['على', 'موقعين.'], 84)}
			</div>
			<Phone
				label="SITE 02"
				layout={{x: 205 - (1 - slide) * 600, y: 1080 + bob, w: 330, rotY: 14 + (1 - slide) * 30, rotX: 4}}
			>
				<SiteTwo startFrom={0} playbackRate={0.5} />
			</Phone>
			<Phone
				label="SITE 01"
				layout={{x: 875 + (1 - slide) * 600, y: 1080 - bob, w: 330, rotY: -14 - (1 - slide) * 30, rotX: 4}}
			>
				<SiteOne scroll={0} />
			</Phone>
			<div style={{position: 'absolute', left: 540 - 125, top: 950, transform: `scale(${0.6 + 0.4 * slide})`}}>
				<Stopwatch size={250} sweep={((frame + 40) % 150) / 150} text={null} />
			</div>
			<div style={{position: 'absolute', top: 1240, left: 0, right: 0, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 30, color: C.dim, letterSpacing: '0.18em'}}>
				VS
			</div>
		</>
	);
};
