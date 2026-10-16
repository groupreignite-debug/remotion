import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, C, row } from "../world";

// 03 FREEZE: the feeds dim and blur behind it, the question rises, لأ. stamps in orange.
// The bottom subtitle is hidden for this line (one text layer).
const tl = new Timeline();
tl.rise("s3q", W(19) - 0.1, 0.55, 40);
tl.fromTo(
  "s3n",
  { opacity: 0, scale: 1.8 },
  { opacity: 1, scale: 1 },
  W(20) - 0.04,
  { d: 0.32, ease: ease.expoO },
);
tl.out(["s3q", "s3n"], SC.s3[1] - 0.3, 0.25);

export const Freeze: React.FC = () => {
  const t = useFilmTime("s3");
  return (
    <AbsoluteFill>
      <div
        style={{
          ...row(640, ar),
          fontSize: 150,
          fontWeight: 800,
          lineHeight: 1.4,
          ...tl.style("s3q", t),
        }}
      >
        صدفة؟
      </div>
      <div
        style={{
          ...row(880, ar),
          color: C.orange,
          fontSize: 230,
          fontWeight: 900,
          lineHeight: 1.3,
          transformOrigin: "50% 55%",
          ...tl.style("s3n", t),
        }}
      >
        لأ.
      </div>
    </AbsoluteFill>
  );
};
