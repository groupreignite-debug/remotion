import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W, We } from "../cues";
import { ease, Timeline } from "../timeline";
import {
  ar,
  Bar,
  C,
  Chip,
  Cursor,
  Feed,
  Icon,
  Jacket,
  JACKET_SHADOW,
  Phone,
  Ring,
  row,
} from "../world";

// 01 HOOK. 0–1.2s, a teaser of the twist (frame 0 already full): the jacket card is big in the centre
// with three feeds; inside 0.3s the same card pops into each feed, at 0.8s it lunges at the camera and
// لاحقك؟ stamps. 1.2s: rewind to the setup, a shop page; the cursor taps the jacket, the phone slides
// away and the jacket is left floating. No logo.
const TAP = Math.max(W(5), 1.9);
const tl = new Timeline();
tl.base("j1", { boxShadow: JACKET_SHADOW });
tl.base("r1", { opacity: 0 });
tl.set(["hk", "rew", "ph1", "c1a", "c1b"], { opacity: 0 }, 0);
tl.fromTo("j1", { scale: 1, rotation: 0 }, { scale: 1.04, rotation: -2 }, 0, {
  d: 0.3,
  ease: ease.sineO,
});
["tj1", "tj2", "tj3"].forEach((j, i) =>
  tl.fromTo(
    j,
    { opacity: 0, scale: 0.3 },
    { opacity: 1, scale: 1 },
    0.05 + i * 0.12,
    { d: 0.3, ease: ease.backO(2.6) },
  ),
);
tl.to(
  "j1",
  {
    scale: 1.3,
    y: 30,
    rotation: 0,
    boxShadow: "0px 50px 90px 0px rgba(0,0,0,0.65)",
  },
  0.78,
  {
    d: 0.24,
    ease: ease.p3o,
  },
);
tl.to(["tf1", "tf2", "tf3"], { opacity: 0.2 }, 0.8, { d: 0.2 });
tl.fromTo("hk", { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1 }, 0.82, {
  d: 0.22,
  ease: ease.expoO,
});
tl.keys("hk", "x", [0, -16, 13, -9, 6, 0], 1.0, 0.24);
// rewind: everything flies back the way it came
tl.to("rew", { opacity: 1 }, 1.18, { d: 0.06 });
tl.keys("rew", "x", [0, -12, 0, -12, 0], 1.18, 0.36);
tl.to("rew", { opacity: 0 }, 1.55, { d: 0.15 });
tl.to("hk", { opacity: 0, scale: 0.8 }, 1.2, { d: 0.15, ease: ease.p2i });
tl.to("tf1", { x: 640, opacity: 0 }, 1.22, { d: 0.3, ease: ease.p2i });
tl.to("tf2", { y: 820, opacity: 0 }, 1.25, { d: 0.3, ease: ease.p2i });
tl.to("tf3", { x: -640, opacity: 0 }, 1.28, { d: 0.3, ease: ease.p2i });
tl.to("j1", { scale: 1, y: 0, boxShadow: JACKET_SHADOW }, 1.22, {
  d: 0.32,
  ease: ease.p3io,
});
tl.fromTo("ph1", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1 }, 1.38, {
  d: 0.3,
  ease: ease.p2o,
});
// the setup, as the voice tells it: saw it, tapped it, left
tl.fromTo(
  "c1a",
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0 },
  Math.max(W(4), 1.6),
  { d: 0.45, ease: ease.p3o },
);
tl.fromTo("cur1", { x: 840, y: 1250, opacity: 0 }, { opacity: 1 }, TAP - 0.5, {
  d: 0.2,
});
tl.to("cur1", { x: 552, y: 742 }, TAP - 0.5, { d: 0.45, ease: ease.p2io });
tl.to("cur1", { scale: 0.82 }, TAP, {
  d: 0.09,
  yoyo: true,
  repeat: 1,
  ease: ease.p2o,
});
tl.ring("r1", TAP);
tl.pulse("j1", TAP, 1.05);
tl.to("cur1", { opacity: 0 }, TAP + 0.25, { d: 0.2 });
tl.to("ph1", { y: 700, opacity: 0 }, W(7) - 0.15, { d: 0.6, ease: ease.p3i });
tl.fromTo("c1b", { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, W(7), {
  d: 0.45,
  ease: ease.p3o,
});
tl.to("j1", { y: 100 }, W(7) + 0.05, { d: 0.8, ease: ease.p2io });
tl.to("j1", { rotation: -3 }, We(7) - 0.2, {
  d: 0.5,
  yoyo: true,
  repeat: 1,
  ease: ease.sineIO,
});
tl.out(["c1a", "c1b"], SC.s1[1] - 0.35, 0.3);

export const Hook: React.FC = () => {
  const t = useFilmTime("s1");
  const s = (id: string) => tl.style(id, t);
  const feed = (id: string, jacket: string, left: number) => (
    <div
      style={{
        position: "absolute",
        left,
        top: 950,
        width: 270,
        height: 430,
        ...s(id),
      }}
    >
      <Feed style={{ left: 0, top: 0, width: 270, height: 430 }} />
      <Jacket
        small
        style={{ left: 25, top: 131, width: 220, height: 220, ...s(jacket) }}
      />
    </div>
  );
  return (
    <AbsoluteFill>
      {/* the abstract shop page (no brand) */}
      <Phone
        style={{ left: 330, top: 430, width: 420, height: 820, ...s("ph1") }}
      >
        <Bar style={{ left: 150, top: 22, width: 120, height: 10 }} />
        <Bar style={{ left: 40, top: 70, width: 120 }} />
        <Bar style={{ left: 300, top: 70, width: 80 }} />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 130,
            width: 340,
            height: 340,
            borderRadius: 28,
            background: C.paper08,
          }}
        />
        <Bar style={{ left: 40, top: 500, width: 240, height: 24 }} />
        <Bar style={{ left: 40, top: 544, width: 130, height: 24 }} />
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 610,
            width: 340,
            height: 80,
            borderRadius: 40,
            border: `2px solid ${C.paper14}`,
          }}
        />
        <Bar style={{ left: 40, top: 730, width: 340, height: 10 }} />
      </Phone>
      {/* teaser: the jacket is already in every feed before the voice gets there */}
      {feed("tf1", "tj1", 720)}
      {feed("tf2", "tj2", 405)}
      {feed("tf3", "tj3", 90)}
      <Jacket
        small={false}
        style={{ left: 370, top: 560, width: 340, height: 340, ...s("j1") }}
      />
      <div
        style={{
          ...row(1050, ar),
          color: C.orange,
          fontSize: 210,
          fontWeight: 900,
          lineHeight: 1.3,
          transformOrigin: "50% 55%",
          ...s("hk"),
        }}
      >
        لاحقك؟
      </div>
      <svg
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: 480,
          top: 330,
          width: 120,
          height: 120,
          ...s("rew"),
        }}
      >
        <path d="M11 19 2 12l9-7v14Z M22 19l-9-7 9-7v14Z" fill={C.orange} />
      </svg>
      <Ring left={560} top={740} style={s("r1")} />
      <Cursor style={{ transformOrigin: "10% 10%", ...s("cur1") }} />
      <div
        style={{
          ...row(1300, ar),
          height: 92,
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <Chip style={s("c1a")}>
          <Icon name="eye" size={44} style={{ color: C.orange }} />
          <span>شفت</span>
        </Chip>
        <Chip style={s("c1b")}>
          <Icon name="hand" size={44} style={{ color: C.orange }} />
          <span>فلّيت</span>
        </Chip>
      </div>
    </AbsoluteFill>
  );
};
