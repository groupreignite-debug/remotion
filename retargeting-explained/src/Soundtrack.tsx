import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { DUR, FPS, LINES } from "./cues";
import sfx from "./sfx.json";

// The film's sound (film frames). Salem's VO is the loudest element. The music bed (scripts/build_audio.py,
// the same dark minimal bed as the earlier episodes) starts at frame 0 with no fade-in and is ducked
// ~-7 dB under every VO line as a function of the frame; it sits low so a trending sound can still be added
// in Instagram. Each SFX is its own clip, placed on the frame its cue falls in.
// Loudness (-14 LUFS, true peak < -1 dBFS) is set after the render by scripts/master.sh, as in the reference.

const lerpPoints = (x: number, pts: [number, number][]) => {
  for (let i = pts.length - 2; i >= 0; i--) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x >= x0) {
      return x1 === x0
        ? y1
        : y0 + ((Math.min(x, x1) - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return pts[0][1];
};

// 1 = full bed, 0.45 under a spoken line (in 0.15s, out over 0.35s after it)
const duck = (t: number) =>
  Math.min(
    ...Object.values(LINES).map((l) => {
      const a = l.s - 0.12;
      const b = l.e + 0.15;
      return lerpPoints(t, [
        [0, 1],
        [Math.max(a - 0.15, 0), 1],
        [a, 0.45],
        [b, 0.45],
        [b + 0.35, 1],
        [DUR, 1],
      ]);
    }),
  );

export const Soundtrack: React.FC = () => (
  <>
    <Audio name="VO (Salem)" src={staticFile("audio/vo_track.wav")} />
    <Audio
      name="Music"
      src={staticFile("audio/music.wav")}
      volume={(f) => duck(f / FPS)}
    />
    {sfx.map((e) => (
      <Sequence
        key={e.file}
        from={e.frame}
        name={`SFX ${e.file.slice(10, -4)}`}
      >
        <Audio src={staticFile(e.file)} volume={e.volume} />
      </Sequence>
    ))}
  </>
);
