import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ARABIC, C, SCRIPT} from '../theme';
import {wordAt} from '../timing';
import {clamp, glowShadow, ignite, Label, Sfx, sp} from '../ui';

const BOOK = {x: 250, y: 600, w: 580, h: 820};

export const Scene05: React.FC<{start: number; dur: number}> = ({start, dur}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const cover = r(wordAt(5, 'الغلاف'));
	const hello = r(wordAt(5, 'أهلا'));
	const sahla = r(wordAt(5, 'وسهلا'));
	const scan = r(wordAt(5, 'المكتبة'));
	const qs = [r(wordAt(5, 'بتعرف')), r(wordAt(5, 'شو')), r(wordAt(5, 'الكتاب'))];

	// Close-up: the book swings in and the camera tilts toward the cover.
	const inP = sp(frame, fps, -2, 17);
	const helloP = sp(frame, fps, hello - 3, 16);
	const sahlaP = sp(frame, fps, sahla - 3, 16);
	const scanY = interpolate(frame, [scan, scan + 22], [0, 1], {...clamp, easing: (t) => 0.5 - Math.cos(Math.PI * t) / 2});
	const scanOn = frame >= scan && frame <= scan + 26;
	const tilt = interpolate(frame, [0, dur], [-10, 6], clamp);

	const qPos = [
		[BOOK.x - 40, BOOK.y + 130, -14],
		[BOOK.x + BOOK.w - 70, BOOK.y + 40, 12],
		[BOOK.x + BOOK.w - 10, BOOK.y + 560, -6],
	];

	return (
		<AbsoluteFill style={{perspective: 2000}}>
			<div
				style={{
					position: 'absolute',
					left: BOOK.x,
					top: BOOK.y,
					width: BOOK.w,
					height: BOOK.h,
					transform: `translateY(${(1 - inP) * 200}px) rotateY(${tilt + (1 - inP) * -40}deg) rotateZ(${(1 - inP) * 6}deg) scale(${0.85 + 0.15 * inP})`,
					opacity: Math.min(1, inP * 1.6),
				}}
			>
				{/* Pages edge */}
				<div style={{position: 'absolute', left: 18, top: 14, right: -14, bottom: -14, borderRadius: 14, background: '#2A2724', border: `2px solid ${C.line}`}} />
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: 14,
						background: 'linear-gradient(160deg, #24201D 0%, #171513 100%)',
						border: '2px solid rgba(242,238,230,0.28)',
						boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
						overflow: 'hidden',
					}}
				>
					<div style={{position: 'absolute', left: 34, top: 0, bottom: 0, width: 3, background: 'rgba(242,238,230,0.12)'}} />
					<div style={{position: 'absolute', inset: 50, border: '2px solid rgba(242,238,230,0.14)', borderRadius: 8}} />
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 300,
							textAlign: 'center',
							direction: 'rtl',
							fontFamily: SCRIPT,
							fontWeight: 700,
							fontSize: 112,
							color: C.text,
						}}
					>
						<span style={{display: 'inline-block', opacity: helloP, transform: `translateY(${(1 - helloP) * 24}px)`, filter: `blur(${(1 - helloP) * 8}px)`}}>
							أهلا
						</span>{' '}
						<span style={{display: 'inline-block', opacity: sahlaP, transform: `translateY(${(1 - sahlaP) * 24}px)`, filter: `blur(${(1 - sahlaP) * 8}px)`}}>
							وسهلا
						</span>
					</div>
					<div style={{position: 'absolute', left: 190, right: 190, top: 500, height: 2, background: 'rgba(242,238,230,0.25)', transform: `scaleX(${sahlaP})`}} />
					{/* Scanner line */}
					{scanOn ? (
						<>
							<div style={{position: 'absolute', left: 0, right: 0, top: scanY * BOOK.h - 80, height: 80, background: 'linear-gradient(transparent, rgba(255,90,31,0.22))'}} />
							<div style={{position: 'absolute', left: 0, right: 0, top: scanY * BOOK.h, height: 4, background: C.accent, boxShadow: '0 0 30px 6px rgba(255,90,31,0.7)'}} />
						</>
					) : null}
				</div>
			</div>
			{qs.map((at, i) => {
				const p = sp(frame, fps, at - 2, 10);
				const [x, y, rot] = qPos[i];
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							fontFamily: ARABIC,
							fontWeight: 700,
							fontSize: 150,
							lineHeight: 1,
							color: C.accent,
							opacity: frame < at - 2 ? 0 : Math.min(1, p * 2),
							transform: `scale(${p}) rotate(${rot + Math.sin((frame - at) / 9) * 4}deg) translateY(${Math.sin((frame - at) / 12) * 6}px)`,
							textShadow: glowShadow(0.4 + ignite(frame, at + 2, false)),
						}}
					>
						؟
					</div>
				);
			})}
			<Label text="Cover" at={cover} color={C.dim} style={{left: BOOK.x, top: BOOK.y - 54}} />
			<Label text="No topic" at={qs[2] + 2} style={{left: BOOK.x, top: BOOK.y + BOOK.h + 40}} />
			<Sfx at={0} name="whoosh" volume={0.15} />
			<Sfx at={scan} name="whoosh" volume={0.12} />
			{qs.map((at, i) => (
				<Sfx key={i} at={at - 1} name="pop" volume={0.15} />
			))}
		</AbsoluteFill>
	);
};
