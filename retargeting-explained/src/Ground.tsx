import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { DUR, END, INTRO, SC, W } from "./cues";
import { ease, Timeline } from "./timeline";
import { C } from "./world";

// GROUND: the barely visible 72px grid with a slow drift, corner marks, the travelling orange glow
// behind each scene's key moment, and the progress hairline. It spans intro + film; its timeline is in
// film time, so during the intro it holds its first state.
const tl = new Timeline();
tl.fromTo("grid", { x: 0, y: 0 }, { x: 72, y: 144 }, 0, {
  d: DUR,
  ease: ease.none,
});
tl.fromTo("marks", { opacity: 0 }, { opacity: 1 }, 0.2, { d: 1.2 });
tl.fromTo("progfill", { scaleX: 0 }, { scaleX: 1 }, 0.4, {
  d: END - 0.4,
  ease: ease.none,
});
tl.to(["grid", "marks", "prog"], { opacity: 0 }, END - 0.4, {
  d: 0.8,
  ease: ease.p1io,
});

// the glow follows the meaning: (film time, centre x, centre y, opacity, scale, duration)
tl.base("glow", { opacity: 0 });
const glow = (
  t: number,
  x: number,
  y: number,
  op: number,
  s: number,
  d: number,
) =>
  tl.to("glow", { x: x - 540, y: y - 960, opacity: op, scale: s }, t, {
    d,
    ease: ease.p2io,
  });
const off = (t: number, d: number) => tl.to("glow", { opacity: 0 }, t, { d });
glow(0.8, 540, 1100, 0.85, 0.7, 0.25); // 01 لاحقك؟
off(1.2, 0.25);
off(W(13) - 0.3, 0.4);
glow(W(20), 540, 1030, 0.85, 0.6, 0.3); // 03 لأ.
off(SC.s3[1] - 0.35, 0.3);
glow(W(23), 540, 560, 0.7, 0.85, 0.6); // 04 Retargeting
off(W(25), 0.5);
glow(W(44) + 0.2, 737, 1060, 0.55, 0.4, 0.6); // 05 the salesperson
off(SC.s5[1] - 0.6, 0.4);
glow(W(77), 808, 760, 0.7, 0.5, 0.6); // 07 knows you
off(SC.s7[1] - 0.6, 0.4);
glow(W(127), 400, 1090, 0.8, 0.6, 0.7); // 10 فات وفلّ
off(SC.s10[1] - 0.6, 0.4);
glow(W(132), 540, 900, 0.6, 0.8, 0.7); // 11 اكتب PIXEL
off(END - 0.6, 0.5);

const useGroundTime = () => useCurrentFrame() / useVideoConfig().fps - INTRO;

export const Ground: React.FC = () => {
  const t = useGroundTime();
  const mark = {
    stroke: "rgba(245, 241, 234, 0.09)",
    strokeWidth: 1.5,
    fill: "none",
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -144,
          top: -144,
          width: 1368,
          height: 2208,
          backgroundImage:
            "linear-gradient(rgba(245, 241, 234, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 241, 234, 0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          ...tl.style("grid", t),
        }}
      />
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: 1080,
          height: 1920,
          ...tl.style("marks", t),
        }}
      >
        <path
          {...mark}
          d="M138 432h20M148 422v20 M922 432h20M932 422v20 M138 1380h20M148 1370v20 M922 1380h20M932 1370v20"
        />
        <path
          {...mark}
          d="M90 1400h120 M90 1400v-10 M130 1400v-6 M170 1400v-6 M210 1400v-10"
        />
        <path
          {...mark}
          d="M870 288h120 M990 288v10 M950 288v6 M910 288v6 M870 288v10"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 510,
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(255, 77, 26, 0.22), rgba(255, 77, 26, 0.07) 55%, rgba(255, 77, 26, 0) 100%)",
          ...tl.style("glow", t),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 236,
          height: 2,
          background: C.paper08,
          ...tl.style("prog", t),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.orange,
            transformOrigin: "0 50%",
            ...tl.style("progfill", t),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(120% 75% at 50% 48%, rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 0.38) 100%)",
    }}
  />
);
