import { cloneElement } from "react";
import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import {
  ar,
  C,
  Chip,
  Icon,
  Jacket,
  JACKET_SHADOW,
  Person,
  row,
} from "../world";

// 05 SHOP: a line-drawn clothes shop, the jacket on the rail. Someone walks in (door bell), tries the
// jacket, walks out: فات ✓ · جرّب ✓ · اشترى ✗. The orange salesperson remembers; when the person
// passes by again a speech bubble pops from the shop (the line itself stays in the subtitle).
const SHOP = [
  <path d="M90 1150 H990" />,
  <path d="M230 1150 V700 M850 1150 V700" />,
  <path d="M200 700 L250 610 H830 L880 700 Z" />,
  <path d="M330 610 L310 700 M420 610 L410 700 M510 610 L510 700 M600 610 L610 700 M690 610 L710 700 M770 610 L800 700" />,
  <rect x="270" y="740" width="340" height="320" rx="12" />,
  <path d="M300 790 H580" />,
  <rect x="660" y="760" width="150" height="390" rx="6" />,
  <circle cx="680" cy="960" r="6" />,
];
const T5 = SC.s5[0];
const tl = new Timeline();
tl.base("j5", { boxShadow: JACKET_SHADOW });
tl.set(
  ["j5", "hook5", "sales5", "p5", "p5in", "bub5", "bub5t", "c5a", "c5b", "c5c"],
  { opacity: 0 },
  0,
);
tl.fromTo(
  SHOP.map((_, i) => `sp${i}`),
  { strokeDasharray: 1, strokeDashoffset: 1 },
  { strokeDashoffset: 0 },
  T5 + 0.1,
  { d: 0.8, ease: ease.p2io, stagger: 0.07 },
);
tl.to("hook5", { opacity: 1 }, T5 + 0.7, { d: 0.3 });
tl.fromTo("j5", { opacity: 0, y: -20 }, { opacity: 1, y: 0 }, T5 + 0.8, {
  d: 0.5,
  ease: ease.backO(1.6),
});
tl.fromTo("j5", { rotation: -3 }, { rotation: 3 }, T5 + 1.3, {
  d: 0.7,
  yoyo: true,
  repeat: 3,
  ease: ease.sineIO,
});
// someone walks in …
tl.fromTo("p5", { x: -40, opacity: 0 }, { opacity: 1 }, W(37) - 0.55, {
  d: 0.3,
});
tl.to("p5", { x: 696 }, W(37) - 0.55, { d: 0.85, ease: ease.p1io });
tl.fromTo("p5", { y: 0 }, { y: -8 }, W(37) - 0.55, {
  d: 0.14,
  yoyo: true,
  repeat: 5,
  ease: ease.sineIO,
});
tl.to("p5", { opacity: 0, scale: 0.9 }, W(38) - 0.05, { d: 0.2 });
tl.fromTo("c5a", { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, W(38), {
  d: 0.45,
  ease: ease.p3o,
});
// … tries the jacket …
tl.to("p5in", { opacity: 1 }, W(39) - 0.1, { d: 0.2 });
tl.pulse("j5", W(39), 1.08);
tl.fromTo("c5b", { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, W(39), {
  d: 0.45,
  ease: ease.p3o,
});
tl.to("p5in", { opacity: 0 }, W(40) - 0.15, { d: 0.2 });
// … and leaves without buying
tl.set("p5", { x: 696, scale: 1 }, W(40) - 0.05);
tl.to("p5", { opacity: 1 }, W(40) - 0.05, { d: 0.15 });
tl.to("p5", { x: 1120 }, W(40) + 0.05, { d: 0.8, ease: ease.p1i });
tl.fromTo("c5c", { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, W(43) - 0.1, {
  d: 0.45,
  ease: ease.p3o,
});
// the good salesperson doesn't forget
tl.fromTo("sales5", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, W(44), {
  d: 0.5,
  ease: ease.p3o,
});
tl.to(["c5a", "c5b", "c5c"], { opacity: 0.25 }, W(44), { d: 0.4 });
// the person passes by again
tl.to("p5", { x: 860 }, W(49) - 0.2, { d: 1.0, ease: ease.p1o });
tl.fromTo("p5", { y: 0 }, { y: -8 }, W(49) - 0.2, {
  d: 0.14,
  yoyo: true,
  repeat: 5,
  ease: ease.sineIO,
});
tl.set("p5", { opacity: 1 }, W(49) - 0.2);
tl.fromTo(
  ["bub5", "bub5t"],
  { opacity: 0, scale: 0.85, y: 20 },
  { opacity: 1, scale: 1, y: 0 },
  W(53) - 0.1,
  {
    d: 0.5,
    ease: ease.backO(1.8),
  },
);
tl.to("j5", { boxShadow: "0px 0px 40px 8px rgba(255,77,26,0.5)" }, W(53), {
  d: 0.5,
});
tl.out(
  ["shop", "hook5", "j5", "p5", "bub5", "bub5t", "c5a", "c5b", "c5c"],
  SC.s5[1] - 0.45,
  0.4,
);

export const Shop: React.FC = () => {
  const t = useFilmTime("s5");
  const s = (id: string) => tl.style(id, t);
  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          ...s("shop"),
        }}
      >
        {SHOP.map((el, i) =>
          cloneElement(el, {
            key: i,
            pathLength: 1,
            fill: "none",
            stroke: C.paper55,
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: s(`sp${i}`),
          }),
        )}
      </svg>
      <svg
        viewBox="0 0 30 40"
        style={{
          position: "absolute",
          left: 425,
          top: 784,
          width: 30,
          height: 40,
          ...s("hook5"),
        }}
      >
        <path d="M15 2 V30" stroke={C.paper55} strokeWidth={3} />
      </svg>
      <Jacket
        small
        style={{
          left: 360,
          top: 812,
          width: 160,
          height: 160,
          transformOrigin: "50% 0%",
          ...s("j5"),
        }}
      />
      <Person
        style={{
          left: 700,
          top: 1006,
          width: 74,
          height: 124,
          color: C.orange,
          ...s("sales5"),
        }}
      />
      <Person
        style={{
          left: 530,
          top: 920,
          width: 62,
          height: 104,
          color: C.paper,
          ...s("p5in"),
        }}
      />
      <Person
        style={{
          left: 0,
          top: 1018,
          width: 80,
          height: 132,
          color: C.paper,
          ...s("p5"),
        }}
      />
      <svg
        viewBox="0 0 260 200"
        style={{
          position: "absolute",
          left: 610,
          top: 400,
          width: 260,
          height: 200,
          transformOrigin: "75% 100%",
          ...s("bub5"),
        }}
      >
        <path
          d="M36 10 H224 Q250 10 250 36 V124 Q250 150 224 150 H150 L128 192 L112 150 H36 Q10 150 10 124 V36 Q10 10 36 10 Z"
          fill={C.charcoal}
          stroke={C.orange}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 610,
          top: 410,
          width: 260,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "75% 100%",
          ...s("bub5t"),
        }}
      >
        <Icon name="hand" size={84} style={{ color: C.orange }} />
      </div>
      <div
        style={{
          ...row(1210, ar),
          height: 92,
          display: "flex",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <Chip style={s("c5a")}>
          <span>فات</span>
          <Icon name="check" size={44} style={{ color: C.orange }} />
        </Chip>
        <Chip style={s("c5b")}>
          <span>جرّب</span>
          <Icon name="check" size={44} style={{ color: C.orange }} />
        </Chip>
        <Chip style={{ color: C.paper55, ...s("c5c") }}>
          <span>اشترى</span>
          <Icon name="x" size={44} style={null} />
        </Chip>
      </div>
    </AbsoluteFill>
  );
};
