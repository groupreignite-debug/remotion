import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, INTER} from '../theme';
import {typedCount, typingFrames, wordAt} from '../timing';
import {clamp, DrawLine, Flare, glowShadow, ignite, Label, SearchBar, Sfx, sp, TypingTicks} from '../ui';

const BAR = {x: 50, y: 800, w: 980, h: 160};

// Lines 10 + 11 share one search bar: type the site: query, then show it comes back empty.
export const Scene10: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = (f: number) => f - start;
	const seen = r(wordAt(10, 'شايفك'));
	const type = r(wordAt(10, 'اكتب'));
	const site = r(wordAt(10, 'site'));
	const colon = r(wordAt(10, 'نقطتين'));
	const domainStart = r(wordAt(10, 'وبعدها'));
	const domainEnd = r(wordAt(10, 'موقعك')) + 10;
	const enter = r(wordAt(11, 'إذا')) + 2;
	const nothing = r(wordAt(11, 'شي'));

	const siteFrames = typingFrames('site', site, site + 9, 'site');
	const colonFrames = [colon + 2];
	const domainFrames = typingFrames('yourwebsite.com', domainStart, domainEnd, 'domain');
	const all = [...siteFrames, ...colonFrames, ...domainFrames];
	const n = typedCount(all, frame);
	const lastType = all.filter((f) => f <= frame).pop() ?? -100;

	const barIn = sp(frame, fps, -3, 16);
	const focus = sp(frame, fps, type, 14);
	const colonP = ignite(frame, colon + 3, true);
	const press = interpolate(frame, [enter, enter + 2, enter + 7], [0, 1, 0], clamp);
	const lift = sp(frame, fps, enter, 15);
	const empty = sp(frame, fps, nothing - 4, 14);
	const shake = frame >= nothing && frame < nothing + 10 ? Math.sin((frame - nothing) * 2.4) * (10 - (frame - nothing)) * 1.2 : 0;

	const y = BAR.y - lift * 180;
	const full = 'site:yourwebsite.com';
	const shown = full.slice(0, n);

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - barIn) * 140}px) scale(${0.9 + 0.1 * barIn})`, opacity: barIn}}>
				<SearchBar shown={shown} lastType={lastType} x={BAR.x} y={y} w={BAR.w} h={BAR.h} fontSize={64} focus={focus} press={press}>
					<span style={{fontFamily: INTER, fontWeight: 600}}>
						{shown.slice(0, 4)}
						{n >= 5 ? (
							<span style={{color: C.accent, display: 'inline-block', transform: `scale(${1 + 0.5 * Math.min(1, colonP)})`, textShadow: glowShadow(colonP), padding: '0 2px'}}>:</span>
						) : null}
						{shown.slice(5)}
					</span>
				</SearchBar>
			</div>
			{/* Corner brackets frame the bar on "شايفك" */}
			{[
				[BAR.x - 20, BAR.y - 20, 1, 1],
				[BAR.x + BAR.w + 20, BAR.y - 20, -1, 1],
				[BAR.x - 20, BAR.y + BAR.h + 20, 1, -1],
				[BAR.x + BAR.w + 20, BAR.y + BAR.h + 20, -1, -1],
			].map(([cx, cy, dx, dy], i) => (
				<div key={i} style={{position: 'absolute', inset: 0, opacity: 1 - lift, transform: `translateY(${-lift * 180}px)`}}>
					<DrawLine d={`M ${cx} ${cy + dy * 50} L ${cx} ${cy} L ${cx + dx * 50} ${cy}`} len={100} at={seen + i} dots={[]} />
				</div>
			))}
			<Label text="Try it now" at={domainEnd - 4} style={{right: BAR.x + 10, top: y + BAR.h + 26}} />
			<Flare x={540} y={y + BAR.h / 2} at={domainEnd - 4} size={900} />

			{/* Empty results */}
			<div
				style={{
					position: 'absolute',
					left: 90,
					top: 900,
					width: 900,
					height: 480,
					borderRadius: 30,
					border: `3px dashed ${C.dim}`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 18,
					opacity: empty,
					transform: `translateY(${(1 - empty) * 80}px) translateX(${shake}px)`,
				}}
			>
				<svg width={90} height={90} viewBox="0 0 40 40">
					<circle cx="17" cy="17" r="11" stroke={C.dim} strokeWidth="3" fill="none" />
					<path d="M25 25 L35 35" stroke={C.dim} strokeWidth="3" strokeLinecap="round" />
					<path d="M12 12 L22 22 M22 12 L12 22" stroke={C.dim} strokeWidth="2.5" strokeLinecap="round" />
				</svg>
				<div style={{fontFamily: INTER, fontWeight: 500, fontSize: 46, color: C.dim}}>No results</div>
			</div>
			<TypingTicks frames={all} seed="sitecheck" />
			<Sfx at={0} name="whoosh" volume={0.15} />
			<Sfx at={colon + 3} name="pop" volume={0.18} />
			<Sfx at={enter} name="tick1" volume={0.3} />
			<Sfx at={nothing} name="error" volume={0.28} />
		</AbsoluteFill>
	);
};
