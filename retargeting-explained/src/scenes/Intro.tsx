import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { INTRO } from "../cues";
import { ease, Timeline } from "../timeline";
import { C, en, row } from "../world";

// 00 SIGNATURE INTRO (master 0–1.4s): `Retargeting` ignites left→right with an ember edge (0–0.4s),
// holds crisp (~0.55s), burns away left→right (0.96–1.36s). A light heat shimmer only while a front moves.
const IGN = [0.0, 0.4];
const BURN = [INTRO - 0.44, INTRO - 0.04];
const fx = (pct: number) => (pct / 100) * 1080; // front position in px (the row spans 1080px)

const tl = new Timeline();
// the ignite front starts on the "R", so frame 0 already shows the ember catching
tl.fromTo("i0", { i: 7, b: -12 }, { i: 112 }, IGN[0], {
  d: IGN[1] - IGN[0],
  ease: ease.p1io,
});
tl.fromTo("bar", { x: fx(7), opacity: 1 }, { x: fx(112) }, IGN[0], {
  d: IGN[1] - IGN[0],
  ease: ease.p1io,
});
tl.to("bar", { opacity: 0 }, IGN[1] - 0.06, { d: 0.08 });
tl.fromTo("glow", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }, 0.1, {
  d: 0.6,
  ease: ease.p2o,
});
tl.base("word", {
  filter: "url(#heat)",
  textShadow: "0 0 28px rgba(255,77,26,0.45)",
});
tl.set("word", { filter: "none" }, IGN[1] + 0.02);
tl.set("word", { filter: "url(#heat)" }, BURN[0]);
tl.to("word", { textShadow: "0 0 34px rgba(255,77,26,0.6)" }, IGN[1], {
  d: 0.25,
  yoyo: true,
  repeat: 1,
  ease: ease.sineIO,
});
tl.to("i0", { b: 112 }, BURN[0], { d: BURN[1] - BURN[0], ease: ease.p1io });
tl.fromTo("bar", { x: fx(-12) }, { x: fx(112) }, BURN[0], {
  d: BURN[1] - BURN[0],
  ease: ease.p1io,
  imm: false,
});
tl.to("bar", { opacity: 1 }, BURN[0], { d: 0.05 });
tl.to("bar", { opacity: 0 }, BURN[1] - 0.06, { d: 0.06 });
tl.to("glow", { opacity: 0 }, BURN[0] + 0.1, { d: 0.3 });
// heat shimmer: a light displacement that swells with each front and calms during the hold
tl.fromTo("heat", { scale: 0 }, { scale: 9 }, IGN[0] + 0.05, {
  d: 0.17,
  yoyo: true,
  repeat: 1,
  ease: ease.sineIO,
});
tl.fromTo("heat", { scale: 0 }, { scale: 14 }, BURN[0], {
  d: 0.2,
  yoyo: true,
  repeat: 1,
  ease: ease.sineIO,
  imm: false,
});
tl.fromTo("turb", { f: "0.010 0.060" }, { f: "0.014 0.085" }, 0, {
  d: INTRO,
  ease: ease.none,
});

// embers lift off the fronts (seeded, deterministic: same sequence as the reference build)
let seed = 909;
const er = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const EMBERS: { id: string; size: number }[] = [];
const ember = (t: number, pct: number) => {
  const id = `e${EMBERS.length}`;
  const x0 = fx(pct) + (er() - 0.5) * 30;
  const y0 = 90 + er() * 120;
  const size = 4 + Math.round(er() * 5);
  EMBERS.push({ id, size });
  tl.base(id, { opacity: 0 });
  tl.fromTo(id, { x: x0, y: y0, opacity: 0 }, { opacity: 0.95 }, t, {
    d: 0.06,
  });
  const life = Math.min(0.35 + er() * 0.2, INTRO - 0.05 - (t + 0.06)); // every ember is out before the film
  tl.to(
    id,
    { x: x0 + (er() - 0.3) * 40, y: y0 - 70 - er() * 110, opacity: 0 },
    t + 0.06,
    { d: life },
  );
};
for (let k = 0; k < 6; k++) {
  const f = k / 5;
  ember(IGN[0] + f * (IGN[1] - IGN[0] - 0.05), 8 + f * 98);
}
for (let k = 0; k < 10; k++) {
  const f = k / 9;
  ember(BURN[0] + f * (BURN[1] - BURN[0] - 0.04), -6 + f * 112);
}

export const Intro: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const i = tl.num("i0", "i", t);
  const b = tl.num("i0", "b", t);
  // the word is revealed between the burn-away front (b) and the ignite front (i)
  const burnMask = `linear-gradient(90deg, transparent ${b - 3}%, #000 ${b + 4}%, #000 ${i - 4}%, transparent ${i + 3}%)`;
  const edgeMask = `linear-gradient(90deg, transparent ${b - 2}%, #000 ${b + 2}%, transparent ${b + 9}%, transparent ${i - 9}%, #000 ${i - 2}%, transparent ${i + 2}%)`;
  const burn = {
    ...row(30, en),
    fontSize: 150,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.25,
  } as const;
  return (
    <AbsoluteFill>
      <svg
        style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }}
        aria-hidden
      >
        <filter id="heat" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={String(tl.get("turb", "f", t))}
            numOctaves={2}
            seed={7}
          />
          <feDisplacementMap
            in="SourceGraphic"
            scale={tl.num("heat", "scale", t)}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 830,
          width: 1080,
          height: 280,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 10,
            width: 800,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(255, 77, 26, 0.28), rgba(255, 77, 26, 0) 100%)",
            ...tl.style("glow", t),
          }}
        />
        <div
          style={{
            ...burn,
            color: C.paper,
            maskImage: burnMask,
            WebkitMaskImage: burnMask,
            ...tl.style("word", t),
          }}
        >
          Retargeting
        </div>
        <div
          style={{
            ...burn,
            color: C.gold,
            textShadow:
              "0 0 18px rgba(255, 77, 26, 0.9), 0 0 42px rgba(255, 77, 26, 0.6)",
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
          }}
        >
          Retargeting
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 90,
            height: 280,
            marginLeft: -45,
            background:
              "radial-gradient(closest-side, rgba(255, 176, 0, 0.55), rgba(255, 77, 26, 0.25) 45%, rgba(255, 77, 26, 0) 100%)",
            mixBlendMode: "screen",
            ...tl.style("bar", t),
          }}
        />
        <div style={{ position: "absolute", inset: 0 }}>
          {EMBERS.map((e) => (
            <i
              key={e.id}
              style={{
                position: "absolute",
                width: e.size,
                height: e.size,
                borderRadius: "50%",
                background: C.gold,
                boxShadow: "0 0 10px 3px rgba(255, 77, 26, 0.7)",
                ...tl.style(e.id, t),
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
