import {Composition} from 'remotion';
import {Reel03} from './Reel03';
import {DURATION, FPS} from './timing';

export const Root: React.FC = () => {
	return (
		<Composition
			id="Reel03"
			component={Reel03}
			durationInFrames={DURATION}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	);
};
