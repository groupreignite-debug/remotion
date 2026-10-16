import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import { ar, C, Icon, Jacket, PixelDot } from "../world";

// 09 THE RULES: three rows build down, icon on the right (RTL), a mini ad thumbnail on the left.
// Saw it → show it again. In the cart → remind (the Pixel dot on the thumbnail). Bought → on "وقّف" the
// row turns gold (the only gold in the reel) and the ad fades out.
const ORANGE = "rgba(255,77,26,1)";
const GOLD = "rgba(255,176,0,1)";
const tl = new Timeline();
tl.base("rw3", {
  borderColor: "rgba(245,241,234,0.14)",
  backgroundColor: "rgba(245,241,234,0.03)",
});
tl.base("ico3", { color: ORANGE, borderColor: "rgba(245,241,234,0.14)" });
tl.base("rc3", { color: ORANGE });
tl.set(["rw1", "rw2", "rw3", "rc1", "rc2", "rc3", "rw2px"], { opacity: 0 }, 0);
const ruleIn = (r: string, t: number) =>
  tl.fromTo(r, { opacity: 0, x: 60 }, { opacity: 1, x: 0 }, t, {
    d: 0.55,
    ease: ease.p3o,
  });
const actionIn = (rc: string, t: number) =>
  tl.fromTo(rc, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, t, {
    d: 0.45,
    ease: ease.p3o,
  });
ruleIn("rw1", W(94) - 0.05);
actionIn("rc1", W(97) - 0.05);
tl.fromTo(
  "th1",
  { opacity: 0.4, scale: 0.85 },
  { opacity: 1, scale: 1 },
  W(97),
  { d: 0.45, ease: ease.backO(2) },
);
ruleIn("rw2", W(101) - 0.05);
actionIn("rc2", W(104) - 0.05);
tl.pop("rw2px", W(104) + 0.1, 0.4);
tl.to("rw1", { opacity: 0.5 }, W(101), { d: 0.4 });
ruleIn("rw3", W(108) - 0.05);
tl.to("rw2", { opacity: 0.5 }, W(108), { d: 0.4 });
actionIn("rc3", W(110) - 0.05);
// bought → the ad switches off, the row turns gold
const TG = W(110) + 0.15;
tl.to(
  "rw3",
  {
    borderColor: "rgba(255,176,0,0.75)",
    backgroundColor: "rgba(255,176,0,0.06)",
  },
  TG,
  { d: 0.4 },
);
tl.to(["ico3", "rc3"], { color: GOLD }, TG, { d: 0.4 });
tl.to("ico3", { borderColor: GOLD }, TG, { d: 0.4 });
tl.to("th3", { opacity: 0, scale: 0.85 }, TG + 0.1, { d: 0.5, ease: ease.p2i });
// rows 1–2 come back right after the gold moment, so the scene's fade-out takes all three together
tl.to(["rw1", "rw2"], { opacity: 1 }, TG + 0.1, { d: 0.35 });
tl.out(["rw1", "rw2", "rw3"], SC.s9[1] - 0.35, 0.3);

const RULES = [
  { n: 1, top: 450, icon: "eye", cond: "شاف", result: "repeat" },
  { n: 2, top: 730, icon: "cart", cond: "بالسلة", result: "bell" },
  { n: 3, top: 1010, icon: "check", cond: "اشترى", result: "stop" },
] as const;

export const Rules: React.FC = () => {
  const t = useFilmTime("s9");
  const s = (id: string) => tl.style(id, t);
  return (
    <AbsoluteFill>
      {RULES.map((r) => (
        <div
          key={r.n}
          style={{
            ...ar,
            position: "absolute",
            left: 90,
            top: r.top,
            width: 900,
            height: 240,
            borderRadius: 30,
            border: `2px solid ${C.paper14}`,
            background: "rgba(245, 241, 234, 0.03)",
            ...s(`rw${r.n}`),
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 34,
              top: 56,
              width: 128,
              height: 128,
              borderRadius: "50%",
              border: `3px solid ${C.paper14}`,
              color: C.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...s(`ico${r.n}`),
            }}
          >
            <Icon name={r.icon} size={62} style={null} />
          </div>
          <div
            style={{
              position: "absolute",
              right: 196,
              top: 0,
              height: 240,
              display: "flex",
              alignItems: "center",
              gap: 30,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 64, fontWeight: 800 }}>{r.cond}</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                color: C.orange,
                ...s(`rc${r.n}`),
              }}
            >
              <Icon name="arrow" size={52} style={{ color: C.paper55 }} />
              <Icon name={r.result} size={80} style={null} />
            </span>
          </div>
          <Jacket
            small
            style={{
              left: 40,
              top: 50,
              width: 140,
              height: 140,
              ...s(`th${r.n}`),
            }}
          />
          {r.n === 2 ? (
            <PixelDot style={{ left: 162, top: 34, ...s("rw2px") }} />
          ) : null}
        </div>
      ))}
    </AbsoluteFill>
  );
};
