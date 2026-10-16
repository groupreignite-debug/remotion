import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, en, Feed, Jacket, JACKET_SHADOW, row } from "../world";

// 02 FOLLOW: three feeds slide in (RTL order), the same jacket card pops into each one, and on the
// third it drifts toward the viewer. Plain words only: no platform logos, icons or colours.
// It dims and blurs behind 03 FREEZE.
const FOLLOW = SC.s2[0];
const tl = new Timeline();
tl.base(["j2", "j2c"], { boxShadow: JACKET_SHADOW });
tl.set(["lb1", "lb2", "lb3"], { opacity: 0 }, 0);
tl.fromTo("j2", { y: 0, rotation: 0 }, { y: -14 }, FOLLOW, {
  d: 0.5,
  yoyo: true,
  repeat: 1,
  ease: ease.sineIO,
});
tl.to("j2", { y: -40 }, W(11), {
  d: 0.18,
  yoyo: true,
  repeat: 1,
  ease: ease.p2o,
});
// feed 1: Instagram, the same card flies into the feed
tl.fromTo("sc1", { opacity: 0, x: 220 }, { opacity: 1, x: 0 }, W(13) - 0.25, {
  d: 0.6,
  ease: ease.p3o,
});
tl.rise("lb1", W(14) - 0.05, 0.45, 20);
tl.to("j2", { x: 375, y: 30, scale: 220 / 340 }, W(14) - 0.1, {
  d: 0.55,
  ease: ease.p3io,
});
tl.to("j2", { scale: 0.7 }, W(14) + 0.45, {
  d: 0.16,
  yoyo: true,
  repeat: 1,
  ease: ease.p2o,
});
// feed 2: YouTube
tl.fromTo("sc2", { opacity: 0, x: 220 }, { opacity: 1, x: 0 }, W(15) - 0.3, {
  d: 0.6,
  ease: ease.p3o,
});
tl.rise("lb2", W(16) - 0.05, 0.45, 20);
tl.pop("j2b", W(16));
// feed 3: everywhere, and it drifts toward the viewer
tl.fromTo("sc3", { opacity: 0, x: 220 }, { opacity: 1, x: 0 }, W(17) - 0.35, {
  d: 0.6,
  ease: ease.p3o,
});
tl.rise("lb3", W(17) - 0.05, 0.45, 20);
tl.pop("j2c", W(17) + 0.05);
tl.to(
  "j2c",
  {
    x: 200,
    y: 120,
    scale: 1.45,
    boxShadow: "0px 40px 80px 0px rgba(0,0,0,0.6)",
  },
  W(17) + 0.5,
  {
    d: 1.0,
    ease: ease.p2io,
  },
);
// freeze: dim behind the question
tl.to("s2in", { opacity: 0.12, scale: 0.97, filter: "blur(8px)" }, SC.s3[0], {
  d: 0.55,
  ease: ease.p2io,
});
tl.out("s2in", SC.s2[1] - 0.35, 0.3);

export const Follow: React.FC = () => {
  const t = useFilmTime("s2");
  const s = (id: string) => tl.style(id, t);
  const label = {
    fontSize: 42,
    fontWeight: 700,
    right: "auto",
    width: 300,
  } as const;
  return (
    <AbsoluteFill style={s("s2in")}>
      <div style={{ ...row(470, ar), ...label, left: 90, ...s("lb3") }}>
        بكل مكان
      </div>
      <div style={{ ...row(470, en), ...label, left: 390, ...s("lb2") }}>
        YouTube
      </div>
      <div style={{ ...row(470, en), ...label, left: 720, ...s("lb1") }}>
        Instagram
      </div>
      <Feed
        style={{ left: 90, top: 560, width: 270, height: 600, ...s("sc3") }}
      />
      <Feed
        style={{ left: 405, top: 560, width: 270, height: 600, ...s("sc2") }}
      />
      <Feed
        style={{ left: 720, top: 560, width: 270, height: 600, ...s("sc1") }}
      />
      <Jacket
        small
        style={{ left: 115, top: 690, width: 220, height: 220, ...s("j2c") }}
      />
      <Jacket
        small
        style={{ left: 430, top: 690, width: 220, height: 220, ...s("j2b") }}
      />
      <Jacket
        small={false}
        style={{
          left: 370,
          top: 660,
          width: 340,
          height: 340,
          transformOrigin: "0% 0%",
          ...s("j2"),
        }}
      />
    </AbsoluteFill>
  );
};
