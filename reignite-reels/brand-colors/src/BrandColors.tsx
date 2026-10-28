import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { ASSETS } from "./theme";
import { Grid } from "./components/Base";
import { Subtitles } from "./components/Subtitles";
import * as S from "./scenes/Scenes";
import { NUMBERS_AT, SCENES, VO_END, wordAt } from "./timeline";
import { ensureFonts } from "./fonts";
import { SFX, SFX_VOL } from "./sfx";

const COMPONENTS: Record<string, React.FC> = {
  "01": S.S01, "02": S.S02, "03": S.S03, "04": S.S04, "05": S.S05, "06": S.S06,
  "07": S.S07, "08": S.S08, "09": S.S09, "10": S.S10, "11": S.S11, "12": S.S12, end: S.EndCard,
};

// Sound cues relative to each scene's start, in seconds.
const CUES: [scene: string, at: number, sfx: keyof typeof SFX][] = [
  ["01", 0, "flash"], ["01", 0.7, "whoosh"],
  ["02", 0, "whoosh"], ["02", 0.25, "pop"], ["02", 0.65, "pop"],
  ["03", 0, "whoosh"], ["03", wordAt("03", 2) - 0.1, "pop"], ["04", 0, "whoosh"], ["04", wordAt("04", 2) - 0.1, "pop"],
  ["05", 0, "whoosh"], ["05", wordAt("05", 4) - 0.3, "pop"], ["05", wordAt("05", 4), "ding"],
  ["06", 0, "whoosh"], ["07", 0, "whoosh"],
  ["08", 0, "whoosh"], ["08", 0.9, "click"],
  ["09", 0, "whoosh"], ...NUMBERS_AT.map((t) => ["09", t - 0.1, "pop"] as [string, number, keyof typeof SFX]),
  ["10", 0, "whoosh"], ...[0.2, 0.4, 0.6, 0.8, 1.0, 1.2].map((t) => ["10", t, "flip"] as [string, number, keyof typeof SFX]),
  ["11", 0, "whoosh"], ["11", 0.35, "pop"], ["11", 0.5, "pop"], ["11", 0.65, "pop"], ["11", 0.8, "pop"],
  ["12", 0, "whoosh"], ["12", 0.1, "ding"],
  ["end", 0, "ignite"],
];

export const BrandColors: React.FC = () => {
  ensureFonts();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Grid />
      {Object.entries(SCENES).map(([name, [a, b]]) => {
        const from = Math.round(a * fps);
        const Comp = COMPONENTS[name];
        return (
          <Sequence key={name} name={name} from={from} durationInFrames={Math.max(1, Math.round(b * fps) - from)}>
            <Comp />
          </Sequence>
        );
      })}
      <Subtitles />
      {CUES.map(([scene, at, k], i) => (
        <Sequence key={i} from={Math.round((SCENES[scene][0] + at) * fps)} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(SFX[k])} volume={SFX_VOL[k]} />
        </Sequence>
      ))}
      {ASSETS.vo ? <Audio src={staticFile("audio/vo.mp3")} /> : null}
    </AbsoluteFill>
  );
};
