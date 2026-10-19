import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {labelStyle, SNAPPY, SOFT} from '../brand';
import {Phone} from '../components/Phone';
import {SiteOne} from '../components/SiteOne';
import {SiteTwo} from '../components/SiteTwo';
import {Stamp} from '../components/Stamp';
import {Headline} from '../components/Text';
import {lineWords, S, wordAt} from '../timing';

export const PASS_AT = 10;

// Scene 11 — split screen, FAIL vs PASS, "الوضوح" lands big
export const Split: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s11;
	const open = spring({frame, fps, config: SOFT});
	const clarity = wordAt(11, 'بالوضوح.') - from;
	const lab = spring({frame: frame - clarity + 8, fps, config: SNAPPY});
	const bob = Math.sin(frame / 20) * 6;
	return (
		<>
			<Headline words={lineWords(11, 0)} from={from} top={180} size={74} accent={['بالتصميم']} exitAt={null} />
			<Phone label="SITE 02" layout={{x: 540 - 245 * open, y: 905 + bob, w: 380, rotY: 10, rotX: 3}}>
				<SiteTwo startFrom={0} playbackRate={0.5} />
			</Phone>
			<Phone label="SITE 01" layout={{x: 540 + 245 * open, y: 905 - bob, w: 380, rotY: -10, rotX: 3}} screenFilter="grayscale(1) brightness(0.42)">
				<SiteOne scroll={0} />
			</Phone>
			<div style={{position: 'absolute', left: 785, top: 905, transform: 'translate(-50%, -50%)'}}>
				<Stamp type="fail" at={2} size={120} rotate={-10} />
			</div>
			<div style={{position: 'absolute', left: 295, top: 905, transform: 'translate(-50%, -50%)'}}>
				<Stamp type="pass" at={PASS_AT} size={120} rotate={-8} />
			</div>
			<div style={{position: 'absolute', top: 1300, left: 0, right: 0, textAlign: 'center', opacity: lab, transform: `translateY(${(1 - lab) * 20}px)`, ...labelStyle(28)}}>
				CLARITY
			</div>
			<Headline words={lineWords(11, 1)} from={from} top={1335} size={118} accent={['بالوضوح.']} exitAt={null} />
		</>
	);
};
