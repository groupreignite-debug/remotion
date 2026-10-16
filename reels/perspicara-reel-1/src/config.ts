import {continueRender, delayRender, staticFile} from 'remotion';

// Inter (Google Fonts, variable 100–900), self-hosted so renders work offline.
export const fontFamily = 'Inter';
if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Inter');
	const face = new FontFace(fontFamily, `url(${staticFile('fonts/Inter-latin.woff2')}) format('woff2')`, {
		weight: '100 900',
	});
	face
		.load()
		.then(() => {
			document.fonts.add(face);
			continueRender(handle);
		})
		.catch((err) => {
			console.error(err);
			continueRender(handle);
		});
}

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const COLORS = {
	bg: '#FFFFFF',
	bgSoft: '#F5F7FF',
	primary: '#2E6BFF',
	electric: '#3B9BFF',
	violet: '#7C4DFF',
	lavender: '#C4B5FD',
	navy: '#0B1033',
	slate: '#4A5170',
	green: '#16C784',
};

export const GRADIENT = `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.violet})`;

export const SAFE = {top: 220, bottom: 380, side: 80};

export const SHADOW =
	'0 30px 60px -20px rgba(11, 16, 51, 0.18), 0 8px 24px -8px rgba(46, 107, 255, 0.12)';

export type SceneId = 'hook' | 'chat' | 'time' | 'ai' | 'timeBack' | 'end';

export type Scene = {id: SceneId; from: number; durationInFrames: number};

export type Caption = {text: string; startMs: number; endMs: number};

type SpeechSceneId = Exclude<SceneId, 'end'>;
type Phrase = {text: string; start: number; end: number};

// Voiceover, split by the scene it plays over. `start`/`end` are seconds in
// public/audio/reel-1.mp3 (found with ffmpeg silencedetect on the ElevenLabs take).
// If the voiceover is regenerated, update these timings.
export const VO_PHRASES: Record<SpeechSceneId, Phrase[]> = {
	hook: [{text: 'Your team is answering the same questions all day long.', start: 0.05, end: 3.05}],
	chat: [
		{text: 'What are your hours?', start: 3.61, end: 4.35},
		{text: "What's your price?", start: 4.64, end: 5.25},
		{text: 'Are you available?', start: 5.58, end: 6.35},
	],
	time: [
		{text: 'Every answer takes a minute,', start: 6.87, end: 8.22},
		{text: 'and those minutes turn into hours,', start: 8.66, end: 10.31},
		{text: 'every single week.', start: 10.93, end: 11.98},
	],
	ai: [
		{
			text: 'Now imagine an assistant that answers all of it instantly, day or night, without ever getting tired.',
			start: 12.9,
			end: 18.14,
		},
	],
	timeBack: [
		{text: 'Your customers get replies in seconds,', start: 18.81, end: 20.7},
		{text: 'and your team gets their time back for the work that really matters.', start: 21.07, end: 24.34},
	],
};

// Scenes never get shorter than this, so the visuals have room to breathe.
const MIN_SCENE_SECONDS: Record<SpeechSceneId, number> = {
	hook: 4,
	chat: 4.6,
	time: 6,
	ai: 7.2,
	timeBack: 7.5,
};
// Speech starts this long after a scene begins (after the crossfade) ...
const LEAD = 0.3;
// ... and the scene holds this long after the last word.
const TAIL = 0.35;
export const END_CARD_SECONDS = 4;

export const VOICEOVER = 'audio/reel-1.mp3';
export const MUSIC = 'audio/music.mp3';

export const TRANSITION = 9;

// A slice of the voiceover, placed at `from` on the timeline (all in frames).
export type VoSegment = {from: number; trimBefore: number; trimAfter: number};

export const buildTimeline = () => {
	const scenes: Scene[] = [];
	const captions: Caption[] = [];
	const voSegments: VoSegment[] = [];
	let t = 0;
	for (const id of Object.keys(VO_PHRASES) as SpeechSceneId[]) {
		const phrases = VO_PHRASES[id];
		const srcFrom = Math.max(0, phrases[0].start - 0.12);
		const srcTo = phrases[phrases.length - 1].end + 0.2;
		const duration = Math.max(MIN_SCENE_SECONDS[id], LEAD + (srcTo - srcFrom) + TAIL);
		const from = Math.round(t * FPS);
		scenes.push({id, from, durationInFrames: Math.round((t + duration) * FPS) - from});
		voSegments.push({
			from: Math.round((t + LEAD) * FPS),
			trimBefore: Math.round(srcFrom * FPS),
			trimAfter: Math.round(srcTo * FPS),
		});

		// Timeline time = source time + offset. Words are spread across each phrase,
		// longer words taking a bit longer.
		const offset = t + LEAD - srcFrom;
		for (const phrase of phrases) {
			const words = phrase.text.split(' ');
			const weights = words.map((w) => 2 + w.length);
			const totalWeight = weights.reduce((a, b) => a + b, 0);
			let ms = (phrase.start + offset) * 1000;
			const phraseMs = (phrase.end - phrase.start) * 1000;
			words.forEach((text, i) => {
				const d = (phraseMs * weights[i]) / totalWeight;
				captions.push({text, startMs: ms, endMs: ms + d});
				ms += d;
			});
		}
		t += duration;
	}
	const endFrom = Math.round(t * FPS);
	scenes.push({id: 'end', from: endFrom, durationInFrames: END_CARD_SECONDS * FPS});
	return {scenes, captions, voSegments, durationInFrames: endFrom + END_CARD_SECONDS * FPS};
};

export type ReelProps = {
	hasVoiceover: boolean;
	hasMusic: boolean;
};

export const getScene = (scenes: Scene[], id: SceneId): Scene => {
	const scene = scenes.find((s) => s.id === id);
	if (!scene) {
		throw new Error(`Missing scene ${id}`);
	}
	return scene;
};
