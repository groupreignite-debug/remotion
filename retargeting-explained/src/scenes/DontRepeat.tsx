import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { C, en, Icon, JACKET_SHADOW, JacketDrawing, row } from "../world";

// 08 DON'T REPEAT: the same jacket ad is dealt five times like a deck (card flicks), each one more
// faded. ×5 = 😴 (the sleepy face is a line icon), and on "بيزهق" the deck slides away.
const DECK = [0, 1, 2, 3, 4];
const tl = new Timeline();
tl.set(["s8t", "s8eq", "s8face"], { opacity: 0 }, 0);
const dealt = [SC.s8[0] + 0.25, W(87), W(88), W(90), W(91)];
DECK.forEach((k) => {
  const rot = k === 0 ? 0 : (k % 2 ? -1 : 1) * (2 + k);
  tl.fromTo(
    `card${k}`,
    { opacity: 0, x: 520, y: -k * 26, rotation: 16 },
    { opacity: 1 - k * 0.15, x: 0, rotation: rot },
    dealt[k],
    {
      d: 0.35,
      ease: ease.p3o,
    },
  );
});
tl.fromTo(
  "s8t",
  { opacity: 0, scale: 1.4 },
  { opacity: 1, scale: 1 },
  W(91) + 0.1,
  { d: 0.3, ease: ease.expoO },
);
tl.fromTo(
  ["s8eq", "s8face"],
  { opacity: 0, scale: 0.6 },
  { opacity: 1, scale: 1 },
  W(92),
  {
    d: 0.45,
    ease: ease.backO(2),
    stagger: 0.1,
  },
);
tl.to("s8face", { rotation: -8 }, W(93) + 0.2, {
  d: 0.4,
  yoyo: true,
  repeat: 1,
  ease: ease.sineIO,
});
// slides away on "بيزهق", fully gone before the scene ends
tl.to(
  DECK.map((k) => `card${k}`),
  { x: -900, rotation: -18, opacity: 0 },
  W(93) + 0.05,
  { d: 0.4, ease: ease.p2i, stagger: 0.02 },
);
tl.out(["s8t", "s8eq", "s8face"], SC.s8[1] - 0.3, 0.25);

export const DontRepeat: React.FC = () => {
  const t = useFilmTime("s8");
  const s = (id: string) => tl.style(id, t);
  const pill = (
    left: number,
    top: number,
    width: number,
    height: number,
    background: string,
    opacity: number,
  ) => (
    <i
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: height / 2,
        background,
        opacity,
      }}
    />
  );
  return (
    <AbsoluteFill>
      {DECK.map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 350,
            top: 500,
            width: 380,
            height: 460,
            borderRadius: 28,
            background: C.paper,
            boxShadow: JACKET_SHADOW,
            ...s(`card${k}`),
          }}
        >
          <JacketDrawing
            style={{ left: "15%", top: "6%", width: "70%", height: "58%" }}
          />
          {pill(44, 330, 220, 20, C.charcoal, 0.85)}
          {pill(44, 366, 140, 20, C.charcoal, 0.35)}
          {pill(236, 398, 100, 36, C.orange, 1)}
        </div>
      ))}
      <div
        style={{
          ...row(1130, en),
          height: 120,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
        }}
      >
        <span
          style={{
            fontSize: 104,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            ...s("s8t"),
          }}
        >
          ×5
        </span>
        <span
          style={{
            fontSize: 70,
            fontWeight: 400,
            color: C.paper55,
            ...s("s8eq"),
          }}
        >
          =
        </span>
        <Icon
          name="sleepy"
          size={112}
          style={{ color: C.paper, ...s("s8face") }}
        />
      </div>
    </AbsoluteFill>
  );
};
