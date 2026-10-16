import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, C, row } from "../world";

// 10 LINE: a calm type beat, whole words rising (never letter by letter: it would break the Arabic
// joins), slow push-in; فات وفلّ. lands in orange. The bottom subtitle is hidden for this line.
const LINES = [
  {
    top: 560,
    size: 64,
    weight: 600,
    color: C.paper70,
    words: ["مش", "كل", "إعلان", "لازم", "يحكي"],
    t: W(113) - 0.05,
    gap: 0.12,
    y: 34,
  },
  {
    top: 660,
    size: 64,
    weight: 600,
    color: C.paper70,
    words: ["مع", "ناس", "جداد."],
    t: W(118) - 0.05,
    gap: 0.12,
    y: 34,
  },
  {
    top: 870,
    size: 92,
    weight: 800,
    color: C.paper,
    words: ["أقرب", "زبون…"],
    t: W(122) - 0.05,
    gap: 0.16,
    y: 40,
  },
  {
    top: 1005,
    size: 92,
    weight: 800,
    color: C.paper,
    words: ["هوي", "اللي"],
    t: W(125) - 0.05,
    gap: 0.14,
    y: 40,
  },
];
const ORANGE_WORDS = {
  words: ["فات", "وفلّ."],
  t: W(127) - 0.05,
  gap: 0.16,
  y: 40,
};
const tl = new Timeline();
LINES.forEach((l, li) =>
  l.words.forEach((_, i) => tl.rise(`w${li}-${i}`, l.t + i * l.gap, 0.55, l.y)),
);
ORANGE_WORDS.words.forEach((_, i) =>
  tl.rise(
    `or-${i}`,
    ORANGE_WORDS.t + i * ORANGE_WORDS.gap,
    0.55,
    ORANGE_WORDS.y,
  ),
);
tl.fromTo("s10in", { scale: 1 }, { scale: 1.05 }, SC.s10[0], {
  d: SC.s10[1] - SC.s10[0],
  ease: ease.sineIO,
});
tl.out("s10in", SC.s10[1] - 0.35, 0.3);

export const Line: React.FC = () => {
  const t = useFilmTime("s10");
  const s = (id: string) => tl.style(id, t);
  const word: CSSProperties = { display: "inline-block" };
  return (
    <AbsoluteFill style={s("s10in")}>
      {LINES.map((l, li) => (
        <div
          key={l.top}
          style={{
            ...row(l.top, ar),
            fontSize: l.size,
            fontWeight: l.weight,
            lineHeight: 1.4,
            color: l.color,
          }}
        >
          {l.words.map((w, i) => (
            <span key={w}>
              {i > 0 ? " " : null}
              <span style={{ ...word, ...s(`w${li}-${i}`) }}>{w}</span>
            </span>
          ))}
          {li === 3
            ? ORANGE_WORDS.words.map((w, i) => (
                <span key={w}>
                  {" "}
                  <span style={{ ...word, color: C.orange, ...s(`or-${i}`) }}>
                    {w}
                  </span>
                </span>
              ))
            : null}
        </div>
      ))}
    </AbsoluteFill>
  );
};
