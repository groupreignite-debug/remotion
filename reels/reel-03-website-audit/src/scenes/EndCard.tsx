import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER, SNAPPY, SOFT} from '../brand';
import {Logo} from '../components/Logo';

// Last ~1s: the only place the brand appears
export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame, fps, config: SNAPPY});
	const tag = spring({frame: frame - 8, fps, config: SOFT});
	const glow = 0.5 + 0.15 * Math.sin(frame / 4);
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 300}}>
			<div
				style={{
					transform: `scale(${0.75 + 0.25 * logo})`,
					opacity: logo,
					filter: `blur(${(1 - logo) * 10}px) drop-shadow(0 0 40px rgba(255,90,31,${glow * logo}))`,
				}}
			>
				<Logo width={820} />
			</div>
			<div
				style={{
					marginTop: 56,
					fontFamily: INTER,
					fontWeight: 500,
					fontSize: 34,
					color: C.text,
					opacity: tag * 0.85,
					transform: `translateY(${(1 - tag) * 24}px)`,
				}}
			>
				Launch sharper. Sell clearer. Scale faster.
			</div>
		</div>
	);
};
