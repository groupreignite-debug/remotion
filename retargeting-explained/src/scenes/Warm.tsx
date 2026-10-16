import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, C, Person, row } from "../world";

// 07 WARM: two small shops. Left, a grey stranger with a long dotted path; right, an orange person
// who knows you, with a short one.
const T7 = SC.s7[0];
const tl = new Timeline();
tl.set(["pL", "pR", "lL", "lR", "s7z"], { opacity: 0 }, 0);
tl.set(["pathL", "pathR"], { scaleY: 0 }, 0);
tl.fromTo(
  ["shopL", "shopR"],
  { strokeDasharray: 1, strokeDashoffset: 1 },
  { strokeDashoffset: 0 },
  T7 + 0.1,
  {
    d: 0.7,
    ease: ease.p2io,
    stagger: 0.12,
  },
);
tl.rise("pL", W(72), 0.5, 20);
tl.to("pathL", { scaleY: 1 }, W(72) + 0.3, { d: 0.9, ease: ease.p2io });
tl.rise("lL", W(73), 0.45, 18);
tl.rise("pR", W(77) - 0.15, 0.5, 20);
tl.to("pathR", { scaleY: 1 }, W(77) + 0.15, { d: 0.35, ease: ease.p2o });
tl.rise("lR", W(77), 0.45, 18);
tl.fromTo(
  "s7z",
  { opacity: 0, scale: 0.9 },
  { opacity: 1, scale: 1 },
  W(82) - 0.15,
  { d: 0.55, ease: ease.expoO },
);
tl.out("s7", SC.s7[1] - 0.35, 0.3);

export const Warm: React.FC = () => {
  const t = useFilmTime("s7");
  const s = (id: string) => tl.style(id, t);
  const shop = (id: string, left: number) => (
    <svg
      viewBox="0 0 160 140"
      style={{ position: "absolute", left, top: 400, width: 160, height: 140 }}
    >
      <path
        pathLength={1}
        d="M10 40 L30 6 H130 L150 40 Z M22 40 V134 H138 V40 M66 134 V84 H94 V134"
        fill="none"
        stroke={C.paper55}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={s(id)}
      />
    </svg>
  );
  const path = (left: number, height: number, color: string) => ({
    position: "absolute" as const,
    left,
    top: 556,
    width: 0,
    height,
    borderLeft: `5px dotted ${color}`,
    transformOrigin: "50% 100%",
  });
  return (
    <AbsoluteFill style={s("s7")}>
      {shop("shopL", 190)}
      {shop("shopR", 730)}
      <div style={{ ...path(268, 420, C.muted), ...s("pathL") }} />
      <div style={{ ...path(808, 90, C.orange), ...s("pathR") }} />
      <Person
        style={{
          left: 226,
          top: 990,
          width: 88,
          height: 146,
          color: C.muted,
          ...s("pL"),
        }}
      />
      <Person
        style={{
          left: 766,
          top: 660,
          width: 88,
          height: 146,
          color: C.orange,
          ...s("pR"),
        }}
      />
      <div
        style={{
          ...row(826, ar),
          left: 590,
          right: "auto",
          width: 440,
          color: C.orange,
          fontSize: 54,
          fontWeight: 800,
          ...s("lR"),
        }}
      >
        بيعرفك
      </div>
      <div
        style={{
          ...row(1156, ar),
          left: 50,
          right: "auto",
          width: 440,
          fontSize: 54,
          fontWeight: 700,
          color: C.paper55,
          ...s("lL"),
        }}
      >
        ما بيعرفك
      </div>
      <div
        style={{
          ...row(1270, ar),
          color: C.orange,
          fontSize: 76,
          fontWeight: 800,
          lineHeight: 1.3,
          ...s("s7z"),
        }}
      >
        مش من الصفر
      </div>
    </AbsoluteFill>
  );
};
