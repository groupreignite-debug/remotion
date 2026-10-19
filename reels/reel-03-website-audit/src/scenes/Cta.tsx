import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, glow, INTER, labelStyle, SNAPPY} from '../brand';
import {Headline, ignite} from '../components/Text';
import {lineWords, S, wordAt} from '../timing';

export const CTA_WORD = 'AUDIT';
export const ctaTypingStart = () => wordAt(13, 'AUDIT') - 2;
export const CTA_CHAR_FRAMES = 2;

// Scene 13 — comment box with AUDIT typed in
export const Cta: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s13;
	const box = spring({frame: frame - 3, fps, config: SNAPPY});
	const t0 = ctaTypingStart() - from;
	const chars = Math.max(0, Math.min(CTA_WORD.length, Math.floor((frame - t0) / CTA_CHAR_FRAMES) + 1));
	const done = t0 + CTA_WORD.length * CTA_CHAR_FRAMES;
	const g = ignite(frame, done);
	const lit = frame >= done;
	const caret = Math.floor(frame / 8) % 2 === 0;

	return (
		<>
			<Headline words={lineWords(13, 0)} from={from} top={230} size={86} accent={[]} exitAt={null} />
			<div
				style={{
					position: 'absolute',
					left: 70,
					width: 940,
					top: 560,
					borderRadius: 44,
					background: '#151413',
					border: '1.5px solid rgba(255,255,255,0.08)',
					boxShadow: '0 50px 120px rgba(0,0,0,0.6)',
					padding: '40px 44px 44px',
					transform: `translateY(${(1 - box) * 160}px) scale(${0.85 + 0.15 * box})`,
					opacity: box,
				}}
			>
				<div style={{...labelStyle(22), color: C.dim, textAlign: 'center', marginBottom: 34}}>COMMENTS</div>
				{[0.62, 0.45].map((wd, i) => (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 30, opacity: 0.7}}>
						<div style={{width: 72, height: 72, borderRadius: 36, background: `linear-gradient(135deg, #3a3633, #24211f)`}} />
						<div style={{flex: 1}}>
							<div style={{width: `${wd * 60}%`, height: 18, borderRadius: 9, background: 'rgba(242,238,230,0.22)', marginBottom: 12}} />
							<div style={{width: `${wd * 100}%`, height: 16, borderRadius: 8, background: 'rgba(242,238,230,0.1)'}} />
						</div>
					</div>
				))}
				<div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 20}}>
					<div style={{width: 84, height: 84, borderRadius: 42, border: `4px solid ${C.accent}`, background: '#24211f', flexShrink: 0}} />
					<div
						style={{
							flex: 1,
							height: 170,
							borderRadius: 85,
							border: `4px solid ${C.accent}`,
							boxShadow: `0 0 ${30 + 50 * g}px rgba(255,90,31,${0.35 + 0.4 * g})`,
							display: 'flex',
							alignItems: 'center',
							padding: '0 40px',
						}}
					>
						<span
							style={{
								fontFamily: INTER,
								fontWeight: 900,
								fontSize: 104,
								letterSpacing: '0.06em',
								color: lit ? C.accent : C.text,
								textShadow: glow(g),
								transform: `scale(${1 + 0.06 * g})`,
								display: 'inline-block',
							}}
						>
							{chars > 0 ? CTA_WORD.slice(0, chars) : ''}
						</span>
						{chars === 0 ? (
							<span style={{fontFamily: INTER, fontSize: 40, color: C.dim}}>Add a comment…</span>
						) : null}
						<span style={{width: 6, height: 96, marginLeft: 8, background: C.accent, opacity: caret && !lit ? 1 : 0}} />
					</div>
					<div
						style={{
							width: 96,
							height: 96,
							borderRadius: 48,
							background: lit ? C.accent : 'rgba(255,90,31,0.25)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
							transform: `scale(${1 + 0.15 * g})`,
						}}
					>
						<svg width={44} height={44} viewBox="0 0 24 24">
							<path d="M3 11.5 L21 3 L13.5 21 L11 13 Z" fill={C.bg} />
						</svg>
					</div>
				</div>
			</div>
			<Headline words={lineWords(13, 1)} from={from} top={1320} size={84} accent={['AUDIT']} exitAt={null} />
		</>
	);
};
