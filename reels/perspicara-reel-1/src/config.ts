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

// Placeholder scene start times (in seconds), used when no voiceover is present.
// The speech-carrying scenes were nudged from the brief so the ~73-word script fits.
// When `public/audio/reel-1.mp3` exists, everything before the end card is
// scaled to the voiceover length (see calculateMetadata in Root.tsx).
export const SCENE_STARTS: Record<SceneId, number> = {
	hook: 0,
	chat: 4,
	time: 9.5,
	ai: 15.5,
	timeBack: 23.5,
	end: 31,
};
export const PLACEHOLDER_SPEECH_END = SCENE_STARTS.end;
export const END_CARD_SECONDS = 4;

// Voiceover, split by the scene it plays over.
export const SCRIPT: Record<Exclude<SceneId, 'end'>, string> = {
	hook: 'Your team is answering the same questions all day long.',
	chat: "What are your hours? What's your price? Are you available?",
	time: 'Every answer takes a minute, and those minutes turn into hours, every single week.',
	ai: 'Now imagine an assistant that answers all of it instantly, day or night, without ever getting tired.',
	timeBack:
		'Your customers get replies in seconds, and your team gets their time back for the work that really matters.',
};

export const VOICEOVER = 'audio/reel-1.mp3';
export const MUSIC = 'audio/music.mp3';
export const CAPTIONS_JSON = 'captions/reel-1.json';

export const TRANSITION = 9;

export const buildScenes = (speechSeconds: number): Scene[] => {
	const scale = speechSeconds / PLACEHOLDER_SPEECH_END;
	const ids = Object.keys(SCENE_STARTS) as SceneId[];
	const starts = ids.map((id) => Math.round(SCENE_STARTS[id] * scale * FPS));
	const total = starts[starts.length - 1] + END_CARD_SECONDS * FPS;
	return ids.map((id, i) => ({
		id,
		from: starts[i],
		durationInFrames: (i === ids.length - 1 ? total : starts[i + 1]) - starts[i],
	}));
};

// Evenly-timed word captions per scene, used until a real transcript exists.
export const buildPlaceholderCaptions = (scenes: Scene[]): Caption[] => {
	const captions: Caption[] = [];
	for (const scene of scenes) {
		if (scene.id === 'end') {
			continue;
		}
		const words = SCRIPT[scene.id].split(' ');
		const startMs = ((scene.from + 6) / FPS) * 1000;
		const endMs = ((scene.from + scene.durationInFrames - 8) / FPS) * 1000;
		// Longer words take a bit longer to say.
		const weights = words.map((w) => 2 + w.length);
		const totalWeight = weights.reduce((a, b) => a + b, 0);
		let t = startMs;
		words.forEach((text, i) => {
			const d = ((endMs - startMs) * weights[i]) / totalWeight;
			captions.push({text, startMs: t, endMs: t + d});
			t += d;
		});
	}
	return captions;
};

export type ReelProps = {
	scenes: Scene[];
	captions: Caption[];
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
