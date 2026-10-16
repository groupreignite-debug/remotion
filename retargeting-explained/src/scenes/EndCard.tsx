import { AbsoluteFill, Img, staticFile } from "remotion";
import { END, useFilmTime } from "../cues";
import { ease, Timeline } from "../timeline";

// 12 END CARD: the supplied Reignite Group logo, used exactly as supplied (no redraw, recolour or crop),
// fades in 0.97 → 1 with the Reignite chime. `lighten` lets the PNG's black field sit on the charcoal.
const tl = new Timeline();
tl.fromTo(
  "logo",
  { opacity: 0, scale: 0.97 },
  { opacity: 1, scale: 1 },
  END + 0.1,
  { d: 1.2, ease: ease.p2o },
);

export const EndCard: React.FC = () => {
  const t = useFilmTime("s12");
  return (
    <AbsoluteFill style={{ mixBlendMode: "lighten" }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 741,
          width: 780,
          height: 439,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("reignite-group-logo.png")}
          alt="Reignite Group"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            ...tl.style("logo", t),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
