import { AbsoluteFill } from "remotion";
import { END, SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, C, en, PixelDot, row } from "../world";

// 11 CTA: a large orange comment bubble with PIXEL and the Pixel dot pulsing beside it; the prompt, a
// bobbing down arrow (👇 as a line icon), then the promise. The subtitle shows only موقعك فيه Pixel؟.
const T11 = SC.s11[0];
const tl = new Timeline();
tl.set(["w11", "t11a", "t11b", "arr11"], { opacity: 0 }, 0);
tl.fromTo(
  "bub11",
  { opacity: 0, scale: 0.8, y: 30 },
  { opacity: 1, scale: 1, y: 0 },
  T11 + 0.2,
  { d: 0.7, ease: ease.backO(1.8) },
);
tl.rise("w11", T11 + 0.45, 0.55, 26);
tl.fromTo(
  "px11",
  { scale: 1, opacity: 0.6 },
  { scale: 1.45, opacity: 1 },
  W(131) - 0.1,
  {
    d: 0.45,
    yoyo: true,
    repeat: 7,
    ease: ease.sineIO,
  },
);
tl.rise("t11a", W(132) - 0.05, 0.55, 30);
tl.fromTo("arr11", { opacity: 0, y: -10 }, { opacity: 1, y: 0 }, W(133) + 0.2, {
  d: 0.4,
  ease: ease.p3o,
});
tl.to("arr11", { y: 16 }, W(133) + 0.6, {
  d: 0.45,
  yoyo: true,
  repeat: 3,
  ease: ease.sineIO,
});
tl.rise("t11b", W(135) - 0.05, 0.55, 24);
tl.out("s11", END - 0.5, 0.4);

export const Cta: React.FC = () => {
  const t = useFilmTime("s11");
  const s = (id: string) => tl.style(id, t);
  return (
    <AbsoluteFill style={s("s11")}>
      <svg
        viewBox="0 0 740 380"
        style={{
          position: "absolute",
          left: 170,
          top: 400,
          width: 740,
          height: 380,
          transformOrigin: "20% 90%",
          ...s("bub11"),
        }}
      >
        <path
          d="M60 14 H680 Q726 14 726 60 V250 Q726 296 680 296 H200 L120 364 L132 296 H60 Q14 296 14 250 V60 Q14 14 60 14 Z"
          fill="none"
          stroke={C.orange}
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          ...row(414, en),
          left: 184,
          right: "auto",
          width: 712,
          height: 282,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          ...s("w11"),
        }}
      >
        <span
          style={{ fontSize: 150, fontWeight: 900, letterSpacing: "0.02em" }}
        >
          PIXEL
        </span>
        <PixelDot
          style={{
            position: "relative",
            width: 38,
            height: 38,
            marginTop: 70,
            ...s("px11"),
          }}
        />
      </div>
      <div
        style={{
          ...row(860, ar),
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.4,
          ...s("t11a"),
        }}
      >
        اكتب <span style={{ ...en, color: C.orange }}>PIXEL</span>
      </div>
      <svg
        viewBox="0 0 64 90"
        style={{
          position: "absolute",
          left: 508,
          top: 1010,
          width: 64,
          height: 90,
          ...s("arr11"),
        }}
      >
        <path
          d="M32 6 V78 M8 56 L32 80 L56 56"
          fill="none"
          stroke={C.orange}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          ...row(1150, ar),
          fontSize: 62,
          fontWeight: 600,
          lineHeight: 1.4,
          color: C.paper70,
          ...s("t11b"),
        }}
      >
        ومنقلّك كيف تتأكد
      </div>
    </AbsoluteFill>
  );
};
