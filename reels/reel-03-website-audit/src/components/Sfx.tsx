import {Audio} from '@remotion/media';
import {Sequence, staticFile} from 'remotion';

export type SfxName = 'tick' | 'whoosh' | 'buzzer' | 'chime' | 'pop' | 'stamp' | 'key' | 'snap';

export const Sfx: React.FC<{name: SfxName; at: number; volume: number}> = ({name, at, volume}) => (
	<Sequence from={Math.max(0, at)} durationInFrames={45} layout="none" name={`sfx:${name}`}>
		<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
	</Sequence>
);
