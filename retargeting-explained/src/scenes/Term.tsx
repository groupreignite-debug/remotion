import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, C, en, Icon, Jacket, Person, row } from "../world";

// 04 TERM: a caret, then `Retargeting` lands letter by letter (Latin, so per-letter is safe). A person
// and a small jacket card: a dotted arc goes out to the shop, an orange arc comes back to the same
// person. Then icons only (eye ← ✗ ← loop): the definition itself stays in the subtitle.
const WORD = "Retargeting".split("");
// at 168px Alexandria 900 the letters measure 1017px, more than the 880px the word may take; scaled down
// to fit, as the reference does at runtime
const WORD_SIZE = 168 * (880 / 1017);
const T4 = SC.s4[0];
const tl = new Timeline();
tl.set(
  [
    ...WORD.map((_, i) => `ch${i}`),
    "s4p",
    "s4j",
    "s4i1",
    "s4a1",
    "s4i2",
    "s4a2",
    "s4i3",
  ],
  { opacity: 0 },
  0,
);
tl.fromTo("caret", { opacity: 0 }, { opacity: 1 }, T4 + 0.05, { d: 0.15 });
tl.to("caret", { opacity: 0 }, T4 + 0.35, { d: 0.08 });
tl.to("caret", { opacity: 1 }, T4 + 0.55, { d: 0.08 });
tl.to("caret", { opacity: 0 }, W(23) - 0.05, { d: 0.1 });
WORD.forEach((_, i) =>
  tl.fromTo(
    `ch${i}`,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0 },
    W(23) - 0.05 + i * 0.035,
    { d: 0.42, ease: ease.p3o },
  ),
);
// the loop: out to the shop, and back to the same person
tl.rise("s4p", W(23) + 0.3, 0.5, 20);
tl.pop("s4j", W(23) + 0.45);
tl.fromTo("s4out", { opacity: 0 }, { opacity: 1 }, W(24) - 0.25, { d: 0.2 });
tl.fromTo("s4cr", { width: 0 }, { width: 520 }, W(24) - 0.25, {
  d: 0.7,
  ease: ease.p2io,
});
tl.fromTo(
  "s4back",
  { strokeDasharray: 640, strokeDashoffset: 640 },
  { strokeDashoffset: 0 },
  W(25),
  {
    d: 0.8,
    ease: ease.p2io,
  },
);
tl.fromTo("s4head", { opacity: 0 }, { opacity: 1 }, W(25) + 0.75, { d: 0.15 });
tl.pulse("s4p", W(25) + 0.8, 1.1);
// saw you → didn't buy → reach them again
tl.pop("s4i1", W(28) - 0.1, 0.4);
tl.fromTo(
  ["s4a1", "s4i2"],
  { opacity: 0, x: 24 },
  { opacity: 1, x: 0 },
  W(31) - 0.1,
  { d: 0.35, ease: ease.p3o, stagger: 0.08 },
);
tl.fromTo(
  ["s4a2", "s4i3"],
  { opacity: 0, x: 24 },
  { opacity: 1, x: 0 },
  W(32) - 0.05,
  { d: 0.35, ease: ease.p3o, stagger: 0.08 },
);
tl.to("s4i3", { rotation: 180 }, W(32) + 0.2, { d: 0.5, ease: ease.p2io });
tl.out("s4", SC.s4[1] - 0.35, 0.3);

export const Term: React.FC = () => {
  const t = useFilmTime("s4");
  const s = (id: string) => tl.style(id, t);
  return (
    <AbsoluteFill style={s("s4")}>
      <div
        style={{
          position: "absolute",
          left: 536,
          top: 470,
          width: 8,
          height: 150,
          background: C.orange,
          ...s("caret"),
        }}
      />
      <div
        style={{
          ...row(440, en),
          color: C.orange,
          fontSize: WORD_SIZE,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {WORD.map((c, i) => (
          <span key={i} style={{ display: "inline-block", ...s(`ch${i}`) }}>
            {c}
          </span>
        ))}
      </div>
      <Person
        style={{
          left: 196,
          top: 760,
          width: 100,
          height: 166,
          color: C.paper,
          ...s("s4p"),
        }}
      />
      <Jacket
        small
        style={{ left: 800, top: 770, width: 140, height: 140, ...s("s4j") }}
      />
      <svg
        viewBox="0 0 1080 360"
        style={{
          position: "absolute",
          left: 0,
          top: 660,
          width: 1080,
          height: 360,
        }}
      >
        <defs>
          <clipPath id="s4clip">
            <rect
              x="300"
              y="0"
              width={tl.num("s4cr", "width", t)}
              height="200"
            />
          </clipPath>
        </defs>
        <path
          clipPath="url(#s4clip)"
          d="M320 120 C 470 10, 680 10, 790 120"
          fill="none"
          stroke="rgba(245,241,234,0.55)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="2 16"
          style={s("s4out")}
        />
        <path
          d="M790 240 C 680 350, 470 350, 330 250"
          fill="none"
          stroke={C.orange}
          strokeWidth={6}
          strokeLinecap="round"
          style={s("s4back")}
        />
        <path
          d="M352 222 L326 248 L362 258"
          fill="none"
          stroke={C.orange}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={s("s4head")}
        />
      </svg>
      <div
        style={{
          ...row(1120, ar),
          height: 140,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
        }}
      >
        <Icon name="eye" size={104} style={{ color: C.paper, ...s("s4i1") }} />
        <Icon
          name="arrow"
          size={60}
          style={{ color: C.paper55, ...s("s4a1") }}
        />
        <Icon name="x" size={96} style={{ color: C.paper, ...s("s4i2") }} />
        <Icon
          name="arrow"
          size={60}
          style={{ color: C.paper55, ...s("s4a2") }}
        />
        <Icon
          name="repeat"
          size={104}
          style={{ color: C.orange, ...s("s4i3") }}
        />
      </div>
    </AbsoluteFill>
  );
};
