import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER, SNAPPY, SOFT} from '../brand';
import {Logo} from '../components/Logo';

// Last ~1s: the only place the brand appears
export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame, fps, config: SNAPPY});
	const name = spring({frame: frame - 5, fps, config: SOFT});
	const tag = spring({frame: frame - 10, fps, config: SOFT});
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 220}}>
			<div style={{transform: `scale(${0.6 + 0.4 * logo})`, opacity: logo}}>
				<Logo size={230} flicker={Math.sin(frame / 3)} />
			</div>
			<div
				style={{
					marginTop: 46,
					fontFamily: INTER,
					fontWeight: 800,
					fontSize: 60,
					letterSpacing: '0.18em',
					color: C.text,
					opacity: name,
					transform: `translateY(${(1 - name) * 30}px)`,
					filter: `blur(${(1 - name) * 8}px)`,
				}}
			>
				REIGNITE GROUP
			</div>
			<div
				style={{
					marginTop: 22,
					fontFamily: INTER,
					fontWeight: 500,
					fontSize: 31,
					color: C.dim,
					opacity: tag,
					transform: `translateY(${(1 - tag) * 24}px)`,
				}}
			>
				Launch sharper. Sell clearer. Scale faster.
			</div>
		</div>
	);
};
