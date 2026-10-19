import {AbsoluteFill, Html5Audio, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SOFT} from './brand';
import {Background, Filters, Grain} from './components/Background';
import {Checklist, MarkSpec, SIDE_DOCK} from './components/Checklist';
import {SceneShell, Transition, OVERLAP} from './components/SceneShell';
import {Sfx} from './components/Sfx';
import {Cta, CTA_CHAR_FRAMES, CTA_WORD, ctaTypingStart} from './scenes/Cta';
import {EndCard} from './scenes/EndCard';
import {Hook} from './scenes/Hook';
import {Idea} from './scenes/Idea';
import {Questions} from './scenes/Questions';
import {SiteOneStage} from './scenes/SiteOneStage';
import {SiteTwoStage} from './scenes/SiteTwoStage';
import {PASS_AT, Split} from './scenes/Split';
import {CHAR_FRAMES, Try, TYPED_URL, typingStart} from './scenes/Try';
import {COUNT1, COUNT2, COUNTDOWN_FRAMES, DURATION, END_CARD, lineEnd, S, VO_SEGMENTS, wordAt} from './timing';

const SCENES: {from: number; to: number; enter: Transition; exit: Transition; el: React.ReactNode; name: string}[] = [
	{name: '01 Hook', from: S.s01, to: S.s02, enter: 'cut', exit: 'zoom', el: <Hook />},
	{name: '02 Idea', from: S.s02, to: S.s03, enter: 'zoom', exit: 'wipe', el: <Idea />},
	{name: '03–04 Questions', from: S.s03, to: S.s05, enter: 'wipe', exit: 'zoom', el: <Questions />},
	{name: '05–08 Site 1', from: S.s05, to: S.s09, enter: 'zoom', exit: 'whip', el: <SiteOneStage />},
	{name: '09–10 Site 2', from: S.s09, to: S.s11, enter: 'whip', exit: 'wipe', el: <SiteTwoStage />},
	{name: '11 Split', from: S.s11, to: S.s12, enter: 'wipe', exit: 'whip', el: <Split />},
	{name: '12 Try', from: S.s12, to: S.s13, enter: 'whip', exit: 'zoom', el: <Try />},
	{name: '13 CTA', from: S.s13, to: END_CARD, enter: 'zoom', exit: 'wipe', el: <Cta />},
	{name: 'End card', from: END_CARD, to: DURATION, enter: 'wipe', exit: 'cut', el: <EndCard />},
];

// Question i is "filled" on its first spoken word
const FILL = [wordAt(4, 'شو', 0), wordAt(4, 'لمين؟'), wordAt(4, 'ليش'), wordAt(4, 'شو', 1), wordAt(4, 'فيني')];
const APPEAR = [0, 1, 2, 3, 4].map((i) => wordAt(3, 'خمس') - 10 + i * 4);
const DOCK_AT = lineEnd(4) + 3;
const FAIL = wordAt(8, 'ما');
const SITE1_MARKS: MarkSpec[] = [
	{type: 'x', at: wordAt(6, 'كلمة')},
	{type: 'x', at: FAIL + 5},
	{type: 'x', at: FAIL + 9},
	{type: 'x', at: wordAt(7, 'المطلوب')},
	{type: 'tick', at: FAIL + 13},
];
const SITE2_MARKS: MarkSpec[] = [
	{type: 'tick', at: wordAt(10, 'شو')},
	{type: 'tick', at: wordAt(10, 'ولمين،')},
	null,
	{type: 'tick', at: wordAt(10, 'والزر')},
	null,
];

/** The 5-question cards / docked checklist that persists from scene 03 to scene 10 */
const ChecklistLayer: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const from = S.s03;
	const abs = frame + from;
	const local = (m: MarkSpec): MarkSpec => (m ? {...m, at: m.at - from} : null);
	const site2 = abs >= S.s09;
	// during the countdowns the website is the focus: checklist dims and slides aside
	const counting = [COUNT1, COUNT2].reduce((acc, c) => acc + spring({frame: abs - c, fps, config: SOFT}) - spring({frame: abs - c - COUNTDOWN_FRAMES + 2, fps, config: SOFT}), 0);
	const out = spring({frame: frame - (S.s11 - from), fps, config: SOFT, durationInFrames: OVERLAP});
	const reset = site2 ? spring({frame: frame - (S.s09 - from), fps, config: SOFT}) : 1;
	return (
		<AbsoluteFill style={{opacity: (1 - out) * (0.3 + 0.7 * reset), transform: `translateX(${out * 300 + counting * 190}px)`}}>
			<Checklist
				appear={APPEAR.map((a) => a - from)}
				fill={FILL.map((f) => f - from)}
				dockAt={DOCK_AT - from}
				dock={SIDE_DOCK}
				marks={(site2 ? SITE2_MARKS : SITE1_MARKS).map(local)}
				header={site2 ? 'SITE 02' : 'SITE 01'}
				score={site2 ? null : {text: '1 / 5', at: FAIL + 15 - from}}
				dim={counting}
			/>
		</AbsoluteFill>
	);
};

export const Reel03: React.FC = () => {
	const frame = useCurrentFrame();
	const snapBlack = [COUNT1, COUNT2].some((c) => frame >= c + COUNTDOWN_FRAMES - 3 && frame < c + COUNTDOWN_FRAMES);
	const idleCount = wordAt(2, 'بتعدّ');
	const idleClose = wordAt(2, 'وبتسكّرو.');

	return (
		<AbsoluteFill>
			<Filters />
			<Background />
			{SCENES.map((s) => (
				<Sequence key={s.name} name={s.name} from={s.from} durationInFrames={s.to - s.from + (s.exit === 'cut' ? 0 : OVERLAP)}>
					<SceneShell dur={s.to - s.from} enter={s.enter} exit={s.exit}>
						{s.el}
					</SceneShell>
				</Sequence>
			))}
			<Sequence name="Checklist" from={S.s03} durationInFrames={S.s11 - S.s03 + OVERLAP}>
				<ChecklistLayer />
			</Sequence>
			{snapBlack ? <AbsoluteFill style={{background: '#000'}} /> : null}
			<Grain />

			{/* Voiceover — untouched, only spaced out to restore the two 5s silences */}
			{VO_SEGMENTS.map((seg) => (
				<Sequence key={seg.from} from={seg.from} name="Voiceover" layout="none">
					<Html5Audio src={staticFile('voiceover.m4a')} trimBefore={seg.trimBefore} trimAfter={seg.trimAfter ?? undefined} />
				</Sequence>
			))}

			{/* Sound design */}
			{[S.s02, S.s03, S.s05, S.s09, S.s11, S.s12, S.s13, END_CARD].map((t) => (
				<Sfx key={`w${t}`} name="whoosh" at={t - 6} volume={0.45} />
			))}
			{[0, 1, 2, 3, 4].map((k) => (
				<Sfx key={`it${k}`} name="tick" at={Math.round(idleCount + ((idleClose - idleCount) / 5) * k)} volume={0.3} />
			))}
			<Sfx name="snap" at={idleClose} volume={0.45} />
			{APPEAR.map((a, i) => (
				<Sfx key={`ap${i}`} name="pop" at={a} volume={0.15} />
			))}
			{FILL.map((f, i) => (
				<Sfx key={`fi${i}`} name="pop" at={f} volume={0.25} />
			))}
			{[COUNT1, COUNT2].flatMap((c) => [
				...[0, 1, 2, 3, 4].map((k) => <Sfx key={`ct${c}${k}`} name="tick" at={c + k * 30} volume={0.65} />),
				<Sfx key={`sn${c}`} name="snap" at={c + COUNTDOWN_FRAMES - 3} volume={0.6} />,
			])}
			{SITE1_MARKS.concat(SITE2_MARKS).map((m, i) => (m ? <Sfx key={`m${i}`} name="pop" at={m.at} volume={0.3} /> : null))}
			<Sfx name="stamp" at={FAIL} volume={0.7} />
			<Sfx name="buzzer" at={FAIL} volume={0.45} />
			<Sfx name="stamp" at={S.s11 + 2} volume={0.3} />
			<Sfx name="chime" at={S.s11 + PASS_AT} volume={0.45} />
			{TYPED_URL.split('').map((_, i) => (
				<Sfx key={`k${i}`} name="key" at={typingStart() + i * CHAR_FRAMES} volume={0.35} />
			))}
			{CTA_WORD.split('').map((_, i) => (
				<Sfx key={`a${i}`} name="key" at={ctaTypingStart() + i * CTA_CHAR_FRAMES} volume={0.4} />
			))}
		</AbsoluteFill>
	);
};
