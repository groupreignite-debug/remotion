import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {labelStyle, SOFT} from '../brand';
import {Headline} from '../components/Text';
import {lineWords, S} from '../timing';

// Scenes 03 + 04 share the stage; the cards themselves live in the global checklist layer.
export const Questions: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s03;
	const lab = spring({frame: frame - (S.s04 - from) - 4, fps, config: SOFT});
	return (
		<>
			<Headline words={lineWords(3)} from={from} top={200} size={76} accent={['خمس', 'أسئلة:']} exitAt={S.s04} />
			<div style={{position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center', opacity: lab, transform: `translateY(${(1 - lab) * 30}px)`, ...labelStyle(30)}}>
				5-SECOND TEST
			</div>
		</>
	);
};
