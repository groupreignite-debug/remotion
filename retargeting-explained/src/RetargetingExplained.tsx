import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { END, INTRO_FRAMES, sceneFrames, sceneFrom, toFrame } from "./cues";
import { Ground, Vignette } from "./Ground";
import { Soundtrack } from "./Soundtrack";
import { Subtitles } from "./Subtitles";
import { Cta } from "./scenes/Cta";
import { DontRepeat } from "./scenes/DontRepeat";
import { EndCard } from "./scenes/EndCard";
import { Follow } from "./scenes/Follow";
import { Freeze } from "./scenes/Freeze";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Line } from "./scenes/Line";
import { Pixel } from "./scenes/Pixel";
import { Rules } from "./scenes/Rules";
import { Shop } from "./scenes/Shop";
import { Term } from "./scenes/Term";
import { Warm } from "./scenes/Warm";
import { C } from "./world";
import "./fonts";

// Reignite Group, شو يعني؟ — "Retargeting". 1080×1920, 30fps: the 1.4s signature intro, then the film
// (Salem's VO + the 3s end card). Every scene is timed from the word timings of Salem's recording.
// Scene 03 overlaps the end of 02 (02 dims behind it), so the scenes are plain Sequences, not a series.
export const RetargetingExplained: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: C.charcoal,
        color: C.paper,
        fontFamily: "Alexandria, sans-serif",
        WebkitFontSmoothing: "antialiased",
        overflow: "hidden",
      }}
    >
      <Ground />
      <Sequence name="00 Intro"  durationInFrames={INTRO_FRAMES}>
        <Intro />
        <Audio name="Intro ember" src={staticFile("audio/intro.wav")} />
      </Sequence>
      <Sequence name="Film" from={INTRO_FRAMES}>
        <Sequence
          name="01 Hook"
          from={sceneFrom("s1")}
          durationInFrames={sceneFrames("s1")}
        >
          <Hook />
        </Sequence>
        <Sequence
          name="02 Follow"
          from={sceneFrom("s2")}
          durationInFrames={sceneFrames("s2")}
        >
          <Follow />
        </Sequence>
        <Sequence
          name="03 Freeze"
          from={sceneFrom("s3")}
          durationInFrames={sceneFrames("s3")}
        >
          <Freeze />
        </Sequence>
        <Sequence
          name="04 Term"
          from={sceneFrom("s4")}
          durationInFrames={sceneFrames("s4")}
        >
          <Term />
        </Sequence>
        <Sequence
          name="05 Shop"
          from={sceneFrom("s5")}
          durationInFrames={sceneFrames("s5")}
        >
          <Shop />
        </Sequence>
        <Sequence
          name="06 Pixel"
          from={sceneFrom("s6")}
          durationInFrames={sceneFrames("s6")}
        >
          <Pixel />
        </Sequence>
        <Sequence
          name="07 Warm"
          from={sceneFrom("s7")}
          durationInFrames={sceneFrames("s7")}
        >
          <Warm />
        </Sequence>
        <Sequence
          name="08 Don't repeat"
          from={sceneFrom("s8")}
          durationInFrames={sceneFrames("s8")}
        >
          <DontRepeat />
        </Sequence>
        <Sequence
          name="09 The rules"
          from={sceneFrom("s9")}
          durationInFrames={sceneFrames("s9")}
        >
          <Rules />
        </Sequence>
        <Sequence
          name="10 Line"
          from={sceneFrom("s10")}
          durationInFrames={sceneFrames("s10")}
        >
          <Line />
        </Sequence>
        <Sequence
          name="11 CTA"
          from={sceneFrom("s11")}
          durationInFrames={sceneFrames("s11")}
        >
          <Cta />
        </Sequence>
        <Sequence
          name="12 End card"
          from={sceneFrom("s12")}
          durationInFrames={sceneFrames("s12")}
        >
          <EndCard />
        </Sequence>
        <Soundtrack />
      </Sequence>
      <Vignette />
      <Sequence
        name="Subtitles"
        from={INTRO_FRAMES}
        durationInFrames={toFrame(END)}
      >
        <Subtitles />
      </Sequence>
    </AbsoluteFill>
  );
};
