import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { SC, useFilmTime, W } from "../cues";
import { ease, Timeline } from "../timeline";
import {
  ar,
  Bar,
  C,
  Cursor,
  en,
  Icon,
  Jacket,
  Person,
  PixelDot,
  Ring,
  row,
} from "../world";

// 06 PIXEL: a browser window rises; the orange salesperson shrinks into the Pixel dot in the page
// corner. The cursor visits the product page (the dot pulses, a dashed line drops to the memory list),
// then the cart. The Pixel is described only as a small code that remembers who visited and which page.
const T6 = SC.s6[0];
const tl = new Timeline();
tl.base(["px6r", "r6"], { opacity: 0 });
tl.base("cartbtn", {
  borderColor: "rgba(245,241,234,0.14)",
  color: "rgba(245,241,234,0.7)",
});
tl.set(["s6lab", "pgB", "px6", "cur6", "m1", "m2"], { opacity: 0 }, 0);
tl.set("mline", { scaleY: 0 }, 0);
tl.fromTo("bw", { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, T6 + 0.15, {
  d: 0.7,
  ease: ease.p3o,
});
// the salesperson shrinks into the Pixel dot in the page corner
tl.to("sales6", { x: 171, y: -557, scale: 0.18 }, T6 + 0.3, {
  d: 0.85,
  ease: ease.p3io,
});
tl.to("sales6", { opacity: 0 }, T6 + 1.0, { d: 0.2 });
tl.fromTo(
  "px6",
  { opacity: 0, scale: 0.3 },
  { opacity: 1, scale: 1 },
  T6 + 1.0,
  { d: 0.35, ease: ease.backO(3) },
);
tl.fromTo("s6lab", { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, W(59) - 0.1, {
  d: 0.55,
  ease: ease.p3o,
});
for (const t of [W(62), W(65), W(68) + 0.15]) {
  tl.pulse("px6", t, 1.5);
  tl.ring("px6r", t);
}
// the visit: product page …
tl.fromTo(
  "cur6",
  { x: 980, y: 1200, opacity: 0 },
  { opacity: 1 },
  W(63) - 0.35,
  { d: 0.25 },
);
tl.to("cur6", { x: 330, y: 760 }, W(63) - 0.35, { d: 0.6, ease: ease.p2io });
tl.set("r6", { x: 330, y: 760 }, 0);
tl.ring("r6", W(64));
tl.pulse("j6", W(64), 1.05);
tl.to("mline", { scaleY: 1 }, W(65), { d: 0.6, ease: ease.p2io });
tl.fromTo("m1", { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, W(67) - 0.1, {
  d: 0.45,
  ease: ease.p3o,
});
// … then the cart
tl.to("cur6", { x: 720, y: 892 }, W(67) + 0.05, { d: 0.5, ease: ease.p2io });
tl.set("r6", { x: 720, y: 892 }, W(68) - 0.1);
tl.ring("r6", W(68) - 0.05);
tl.to(
  "cartbtn",
  { borderColor: "rgba(255,77,26,1)", color: "rgba(255,77,26,1)" },
  W(68) - 0.05,
  { d: 0.2 },
);
tl.to("pgA", { opacity: 0 }, W(68) + 0.1, { d: 0.25 });
tl.to("pgB", { opacity: 1 }, W(68) + 0.15, { d: 0.3 });
tl.fromTo("m2", { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, W(70) - 0.1, {
  d: 0.45,
  ease: ease.p3o,
});
tl.to("cur6", { opacity: 0 }, W(70) + 0.2, { d: 0.3 });
tl.out("s6", SC.s6[1] - 0.35, 0.3);

export const Pixel: React.FC = () => {
  const t = useFilmTime("s6");
  const s = (id: string) => tl.style(id, t);
  const dot: CSSProperties = {
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: C.paper14,
    display: "block",
  };
  const memRow = (top: number): CSSProperties => ({
    position: "absolute",
    right: 50,
    top,
    height: 70,
    display: "flex",
    alignItems: "center",
    gap: 18,
    fontSize: 48,
    fontWeight: 700,
  });
  const page: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 66,
    width: 820,
    height: 554,
  };
  return (
    <AbsoluteFill style={s("s6")}>
      <div
        style={{
          ...row(330, en),
          height: 110,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          ...s("s6lab"),
        }}
      >
        <span
          style={{
            color: C.orange,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: "0.02em",
          }}
        >
          PIXEL
        </span>
        <span style={{ fontSize: 80, fontWeight: 400, color: C.paper55 }}>
          =
        </span>
        <span style={{ ...ar, fontSize: 84, fontWeight: 800 }}>البيّاع</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 480,
          width: 820,
          height: 620,
          borderRadius: 30,
          border: `2px solid ${C.paper14}`,
          background: "#202020",
          overflow: "hidden",
          ...s("bw"),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 26,
            display: "flex",
            gap: 12,
          }}
        >
          <i style={dot} />
          <i style={dot} />
          <i style={dot} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 16,
            width: 440,
            height: 34,
            borderRadius: 17,
            background: C.paper08,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 66,
            height: 1,
            background: C.paper08,
          }}
        />
        <div style={{ ...page, ...s("pgA") }}>
          <Jacket
            small
            style={{ left: 50, top: 50, width: 300, height: 300, ...s("j6") }}
          />
          <Bar style={{ left: 400, top: 80, width: 330, height: 26 }} />
          <Bar style={{ left: 400, top: 130, width: 200, height: 26 }} />
          <Bar style={{ left: 400, top: 200, width: 360, height: 12 }} />
          <Bar style={{ left: 400, top: 228, width: 300, height: 12 }} />
          <div
            style={{
              position: "absolute",
              left: 400,
              top: 290,
              width: 360,
              height: 84,
              borderRadius: 42,
              borderWidth: 2,
              borderStyle: "solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...s("cartbtn"),
            }}
          >
            <Icon name="cart" size={44} style={null} />
          </div>
          <Bar style={{ left: 50, top: 420, width: 710, height: 12 }} />
          <Bar style={{ left: 50, top: 450, width: 520, height: 12 }} />
        </div>
        <div style={{ ...page, ...s("pgB") }}>
          <div
            style={{ position: "absolute", left: 50, top: 46, color: C.orange }}
          >
            <Icon name="cart" size={70} style={null} />
          </div>
          <Bar style={{ left: 140, top: 70, width: 220, height: 26 }} />
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 160,
              width: 720,
              height: 190,
              borderRadius: 22,
              border: `2px solid ${C.paper14}`,
            }}
          />
          <Jacket
            small
            style={{ left: 76, top: 185, width: 140, height: 140 }}
          />
          <Bar style={{ left: 250, top: 205, width: 300, height: 24 }} />
          <Bar style={{ left: 250, top: 250, width: 160, height: 24 }} />
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 400,
              width: 720,
              height: 84,
              borderRadius: 42,
              border: `2px solid ${C.paper14}`,
            }}
          />
        </div>
      </div>
      <PixelDot style={{ left: 896, top: 499, ...s("px6") }} />
      <Ring left={908} top={511} style={s("px6r")} />
      <Person
        style={{
          left: 700,
          top: 1006,
          width: 74,
          height: 124,
          color: C.orange,
          ...s("sales6"),
        }}
      />
      <Cursor style={s("cur6")} />
      <Ring left={0} top={0} style={s("r6")} />
      <div
        style={{
          position: "absolute",
          left: 906,
          top: 524,
          width: 0,
          height: 640,
          borderLeft: "3px dashed rgba(255, 77, 26, 0.7)",
          transformOrigin: "50% 0",
          ...s("mline"),
        }}
      />
      <div
        style={{
          ...ar,
          position: "absolute",
          left: 130,
          top: 1164,
          width: 820,
          height: 210,
          borderRadius: 26,
          border: "2px solid rgba(255, 77, 26, 0.45)",
          background: "rgba(255, 77, 26, 0.05)",
        }}
      >
        <div style={{ ...memRow(30), ...s("m1") }}>
          <span>فات</span>
          <Icon name="check" size={44} style={{ color: C.orange }} />
        </div>
        <div style={{ ...memRow(110), ...s("m2") }}>
          <span>صفحة الجاكيت</span>
          <Icon name="check" size={44} style={{ color: C.orange }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
