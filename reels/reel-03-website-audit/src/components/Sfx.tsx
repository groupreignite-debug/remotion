import {Html5Audio, Sequence, staticFile} from 'remotion';

// Master level for all sound effects, sitting under the voiceover
const SFX_GAIN = 0.7;

export type SfxName = 'tick' | 'whoosh' | 'buzzer' | 'chime' | 'pop' | 'stamp' | 'key' | 'snap';

export const Sfx: React.FC<{name: SfxName; at: number; volume: number}> = ({name, at, volume}) => (
	<Sequence from={Math.max(0, at)} durationInFrames={45} layout="none" name={`sfx:${name}`}>
		<Html5Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_GAIN} />
	</Sequence>
);
