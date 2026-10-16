import { useCurrentFrame } from "remotion";
import cues from "../scripts/cues.json";

// Salem's recording, aligned word by word (scripts/build_vo_human.py in the HyperFrames build): every
// scene, subtitle and SFX is keyed to W(i), the start of word slot i, in film seconds. The recording is
// trimmed so its first word lands at 0.12s of the film.
export const FPS = 30;
export const INTRO = 1.4; // the signature intro in front of the film
export const INTRO_FRAMES = Math.round(INTRO * FPS); // 42
export const DUR = cues.duration; // film: VO + 3s end card
export const END = cues.endcard; // end card starts
export const W = (i: number) => cues.words[i][0];
export const We = (i: number) => cues.words[i][1];
export const LINES = cues.lines;

// scene windows in film seconds, each opening a little before its first word (as in apply_cues.py)
export const SC = {
  s1: [0, W(8) - 0.25],
  s2: [W(8) - 0.25, W(21) - 0.3],
  s3: [W(19) - 0.15, W(21) - 0.3],
  s4: [W(21) - 0.3, W(34) - 0.15],
  s5: [W(34) - 0.15, W(56) - 0.4],
  s6: [W(56) - 0.4, W(71) - 0.35],
  s7: [W(71) - 0.35, W(84) - 0.35],
  s8: [W(84) - 0.35, W(94) - 0.35],
  s9: [W(94) - 0.35, W(113) - 0.4],
  s10: [W(113) - 0.4, W(129) - 0.35],
  s11: [W(129) - 0.35, END],
  s12: [END, DUR],
} as const;
export type SceneKey = keyof typeof SC;

// seconds → the first frame at or after it (a clip that starts at 4.47s is first visible on frame 135)
export const toFrame = (s: number) => Math.ceil(s * FPS - 1e-6);
export const sceneFrom = (k: SceneKey) => toFrame(SC[k][0]);
export const sceneFrames = (k: SceneKey) =>
  toFrame(SC[k][1]) - toFrame(SC[k][0]);

// film seconds inside a scene's <Sequence>
export const useFilmTime = (k: SceneKey) =>
  (useCurrentFrame() + sceneFrom(k)) / FPS;
