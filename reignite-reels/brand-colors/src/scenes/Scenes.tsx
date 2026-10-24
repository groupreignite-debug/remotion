import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ASSETS, BRANDS, C, FLASH, FONT, LOGO_STYLE, ease } from "../theme";
import { Ar, Term } from "../components/Base";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0..1 progress from `at` seconds over `dur` seconds, eased.
const useP = (at = 0, dur = 0.5) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [at * fps, (at + dur) * fps], [0, 1], { ...clamp, easing: ease });
};
const useSpr = (at = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at * fps, fps, config: { damping } });
};

// Headline card at the top of the safe area.
const Headline: React.FC<{ children: React.ReactNode; top?: number; size?: number }> = ({ children, top = 300, size = 84 }) => {
  const p = useSpr(0.05, 200);
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <Ar style={{ fontSize: size, fontWeight: 800, textAlign: "center", lineHeight: 1.3 }}>{children}</Ar>
    </div>
  );
};

// Two stacked color blocks with the brand name as plain text (never a logo).
const BrandPair: React.FC<{ a: string; b: string; name: string; at?: number }> = ({ a, b, name, at = 0 }) => {
  const pa = useSpr(at, 16);
  const pb = useSpr(at + 0.12, 16);
  const pn = useP(at + 0.25, 0.4);
  const W = 640;
  const H = 300;
  return (
    <div style={{ position: "absolute", top: 520, left: (1080 - W) / 2, width: W }}>
      <div style={{ height: H, background: a, borderRadius: "36px 36px 0 0", transform: `translateX(${(1 - pa) * -900}px)` }} />
      <div style={{ height: H, background: b, borderRadius: "0 0 36px 36px", transform: `translateX(${(1 - pb) * 900}px)`, boxShadow: `0 0 0 2px ${C.line}` }} />
      <div style={{ marginTop: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.text, opacity: pn, transform: `translateY(${(1 - pn) * 20}px)` }}>{name}</div>
    </div>
  );
};

// 01 HOOK: random colors flash, then snap to Coca-Cola's two blocks.
export const S01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flashEnd = 0.7 * fps;
  if (frame < flashEnd) {
    const i = Math.floor(frame / 3) % FLASH.length;
    return <AbsoluteFill style={{ background: FLASH[i] }} />;
  }
  return (
    <AbsoluteFill>
      <Headline>
        ليش <Term>Coca-Cola</Term>
        <br />
        لونين بس؟
      </Headline>
      <BrandPair a={BRANDS.coke.a} b={BRANDS.coke.b} name="" at={0.7} />
    </AbsoluteFill>
  );
};

// 02 Clutter of many colors collapses into two big ones.
export const S02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const collapse = useP(0.25, 0.6);
  const grow = useSpr(0.65, 14);
  const dots = Array.from({ length: 14 }, (_, i) => {
    const ang = (i / 14) * Math.PI * 2 + frame / fps;
    const r = 260 + 60 * Math.sin(i * 1.7);
    return { x: 540 + Math.cos(ang) * r, y: 820 + Math.sin(ang) * r, c: FLASH[i % FLASH.length] };
  });
  return (
    <AbsoluteFill>
      <Headline>
        ألوان أقل
        <br />
        <span style={{ color: C.orange }}>بتنعرف أسرع</span>
      </Headline>
      {dots.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: d.x - 45, top: d.y - 45, width: 90, height: 90, borderRadius: 45, background: d.c, transform: `scale(${1 - collapse})` }} />
      ))}
      <div style={{ position: "absolute", top: 640, left: 0, width: 1080, display: "flex", justifyContent: "center", gap: 40 }}>
        {[C.orange, C.text].map((c, i) => (
          <div key={i} style={{ width: 300, height: 300, borderRadius: 150, background: c, transform: `scale(${grow})` }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const S03: React.FC = () => <BrandPair a={BRANDS.mcd.a} b={BRANDS.mcd.b} name={BRANDS.mcd.name} />;
export const S04: React.FC = () => <BrandPair a={BRANDS.spotify.a} b={BRANDS.spotify.b} name={BRANDS.spotify.name} />;

// 05 Seven dots, four pop, three grow.
export const S05: React.FC = () => {
  const pop = useP(0.6, 0.35);
  const grow = useSpr(0.9, 12);
  const seven = ["#FF4D1A", "#7F7CAF", "#1A1A1A", "#00A6ED", "#F5F1EA", "#7FB800", "#FFB000"];
  const keep = new Set([0, 2, 4]);
  return (
    <AbsoluteFill>
      <Headline>
        <span style={{ color: C.dim, textDecoration: "line-through" }}>7 ألوان</span>
        {"  "}
        <span style={{ color: C.orange }}>3 ألوان</span>
      </Headline>
      <div style={{ position: "absolute", top: 640, left: 0, width: 1080, height: 240, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        {seven.map((c, i) => {
          const s = keep.has(i) ? 1 : 1 - pop;
          const w = keep.has(i) ? 96 + 104 * grow : 96 * (1 - pop);
          return <div key={i} style={{ width: w, height: keep.has(i) ? w : 96, borderRadius: 999, background: c, transform: `scale(${s})`, boxShadow: `0 0 0 3px ${C.line}` }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Numbered: React.FC<{ n: string; title: React.ReactNode; sub: React.ReactNode; dark?: boolean }> = ({ n, title, sub, dark }) => {
  const p = useSpr(0.1, 200);
  const col = dark ? C.bg : C.text;
  return (
    <div style={{ position: "absolute", top: 300, left: 60, right: 60, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <Ar style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, color: col }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: dark ? C.bg : C.orange, color: dark ? C.orange : C.bg, fontSize: 68, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
        <div style={{ fontSize: 76, fontWeight: 800 }}>{title}</div>
      </Ar>
      <Ar style={{ marginTop: 26, textAlign: "center", fontSize: 54, fontWeight: 600, color: dark ? "rgba(26,26,26,0.75)" : C.dim }}>{sub}</Ar>
    </div>
  );
};

// 06 Main color floods the screen.
export const S06: React.FC = () => {
  const fill = useP(0, 0.7);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 1400, top: 900 - 1400, width: 2800, height: 2800, borderRadius: 1400, background: C.orange, transform: `scale(${0.07 + 0.93 * fill})` }} />
      <Numbered n="١" title="لون أساسي" sub="هيدا شخصيتك" dark />
      <div style={{ position: "absolute", top: 760, left: 0, width: 1080, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.bg, opacity: useP(0.5, 0.4) }}>
        #FF4D1A
      </div>
    </AbsoluteFill>
  );
};

// 07 Neutral panel with text lines typing on.
export const S07: React.FC = () => {
  const panel = useSpr(0.1, 16);
  const rows = [0.92, 0.7, 0.85, 0.55, 0.78];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Numbered n="٢" title="لون محايد" sub="للنصوص والخلفيات" />
      <div style={{ position: "absolute", top: 600, left: 220, width: 640, height: 560, borderRadius: 36, overflow: "hidden", display: "flex", transform: `scale(${panel})` }}>
        {[C.text, "#111111"].map((bg, k) => (
          <div key={k} style={{ flex: 1, background: bg, padding: 40, display: "flex", flexDirection: "column", gap: 26 }}>
            {rows.map((w, i) => {
              const p = interpolate(frame, [(0.4 + i * 0.18) * fps, (0.7 + i * 0.18) * fps], [0, 1], clamp);
              return <div key={i} style={{ height: 26, width: `${w * 100 * p}%`, borderRadius: 13, background: k === 0 ? "#1A1A1A" : C.text, opacity: 0.85 }} />;
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Minimal website mockup in neutrals; the button is the only accent.
const MockPage: React.FC<{ accentOn: number }> = ({ accentOn }) => (
  <div style={{ width: 620, height: 640, borderRadius: 32, background: C.text, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.5)" }}>
    <div style={{ height: 70, background: "#1A1A1A", display: "flex", alignItems: "center", gap: 12, padding: "0 28px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "rgba(245,241,234,0.35)" }} />
      ))}
    </div>
    <div style={{ padding: 44, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ height: 44, width: "80%", borderRadius: 12, background: "#1A1A1A" }} />
      <div style={{ height: 22, width: "95%", borderRadius: 11, background: "rgba(26,26,26,0.35)" }} />
      <div style={{ height: 22, width: "70%", borderRadius: 11, background: "rgba(26,26,26,0.35)" }} />
      <div style={{ height: 160, borderRadius: 18, background: "rgba(26,26,26,0.12)", marginTop: 10 }} />
      <div
        style={{
          marginTop: 14,
          alignSelf: "center",
          width: 300,
          height: 92,
          borderRadius: 46,
          background: interpolate(accentOn, [0, 1], [0, 1]) > 0.5 ? C.gold : "rgba(26,26,26,0.2)",
          boxShadow: accentOn > 0.5 ? `0 0 ${60 * accentOn}px ${C.gold}` : "none",
          transform: `scale(${1 + 0.08 * Math.sin(Math.PI * accentOn)})`,
        }}
      />
    </div>
  </div>
);

// 08 Only the button lights up in the accent color, then a tap ripple.
export const S08: React.FC = () => {
  const on = useP(0.5, 0.3);
  const tap = useP(0.9, 0.5);
  const page = useSpr(0, 16);
  return (
    <AbsoluteFill>
      <Numbered n="٣" title={<Term color={C.gold}>Accent</Term>} sub="بس للأزرار" />
      <div style={{ position: "absolute", top: 600, left: 230, transform: `translateY(${(1 - page) * 200}px)`, opacity: page }}>
        <MockPage accentOn={on} />
        <div style={{ position: "absolute", left: 310 - 90, top: 545 - 90, width: 180, height: 180, borderRadius: 90, border: `6px solid ${C.gold}`, transform: `scale(${0.3 + tap})`, opacity: tap > 0 ? 1 - tap : 0 }} />
      </div>
    </AbsoluteFill>
  );
};

// 09 60 / 30 / 10 bar.
export const S09: React.FC = () => {
  const parts = [
    { v: 60, c: C.text, t: C.bg },
    { v: 30, c: C.orange, t: C.bg },
    { v: 10, c: C.gold, t: C.bg },
  ];
  return (
    <AbsoluteFill>
      <Headline size={130}>
        <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
          60 / 30 / 10
        </span>
      </Headline>
      <div style={{ position: "absolute", top: 600, left: 190, width: 700, height: 560, display: "flex", flexDirection: "column", gap: 0, borderRadius: 32, overflow: "hidden" }}>
        {parts.map((p, i) => {
          const g = useP(0.2 + i * 0.25, 0.45);
          return (
            <div key={i} style={{ flexGrow: p.v * g + 0.001, flexBasis: 0, background: p.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 70, color: p.t }}>
              {g > 0.6 ? `${p.v}%` : ""}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 10 Coolors frames flipping inside a phone, last one held with a slow zoom.
const FRAMES = ["frame_01.jpg", "frame_02.jpg", "frame_03.jpg", "frame_04.jpg", "frame_05.jpg", "frame_06.jpg", "frame_07_final_reignite_palette.jpg"];
export const S10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const per = Math.round(0.2 * fps);
  const idx = Math.min(FRAMES.length - 1, Math.floor(frame / per));
  const held = Math.max(0, frame - per * (FRAMES.length - 1));
  const zoom = 1 + 0.06 * interpolate(held, [0, Math.max(1, durationInFrames - per * (FRAMES.length - 1))], [0, 1], clamp);
  const inP = useSpr(0, 18);
  const W = 440;
  const H = Math.round(W * (1218 / 563));
  return (
    <AbsoluteFill>
      <Headline top={240} size={70}>
        <Term>Coolors</Term> ببلاش
      </Headline>
      <div
        style={{
          position: "absolute",
          top: 380,
          left: (1080 - W - 24) / 2,
          width: W + 24,
          height: Math.min(H, 880) + 24,
          borderRadius: 56,
          background: "#0E0E0E",
          padding: 12,
          boxShadow: `0 0 0 2px ${C.line}, 0 40px 120px rgba(0,0,0,0.6)`,
          transform: `translateY(${(1 - inP) * 300}px) scale(${zoom})`,
          transformOrigin: "50% 30%",
        }}
      >
        <div style={{ width: W, height: Math.min(H, 880), borderRadius: 46, overflow: "hidden" }}>
          <Img src={staticFile(`frames/${FRAMES[idx]}`)} style={{ width: W, height: H, objectFit: "cover" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 11 One hex code lands on a site, a post, a card and a sign.
export const S11: React.FC = () => {
  const chip = useSpr(0, 14);
  const items = [
    { label: "الموقع", w: 340, h: 230 },
    { label: "Instagram", w: 230, h: 230 },
    { label: "كرت", w: 340, h: 200 },
    { label: "يافطة", w: 230, h: 200 },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 290, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "22px 48px", borderRadius: 999, background: C.orange, fontFamily: FONT, fontWeight: 900, fontSize: 80, color: C.bg, transform: `scale(${chip})` }}>#FF4D1A</div>
      </div>
      <Ar style={{ position: "absolute", top: 450, left: 0, width: 1080, textAlign: "center", fontSize: 62, fontWeight: 800, opacity: useP(0.2, 0.4) }}>
        نفس الكود بكل مكان
      </Ar>
      <div style={{ position: "absolute", top: 610, left: 160, width: 760, display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "center" }}>
        {items.map((it, i) => {
          const p = useSpr(0.35 + i * 0.15, 14);
          return (
            <div key={i} style={{ width: it.w, transform: `scale(${p})`, opacity: p }}>
              <div style={{ height: it.h, borderRadius: 24, background: C.text, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "30%", background: C.orange }} />
                <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ height: 16, width: "80%", borderRadius: 8, background: "#1A1A1A" }} />
                  <div style={{ height: 12, width: "55%", borderRadius: 6, background: "rgba(26,26,26,0.35)" }} />
                </div>
              </div>
              <Ar style={{ marginTop: 12, textAlign: "center", fontSize: 36, fontWeight: 600, color: C.dim }}>{it.label}</Ar>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 12 CTA: save icon bounces, then colors flash again to set up the loop.
export const S12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = useSpr(0.1, 9);
  const t1 = useP(0.3, 0.4);
  const t2 = useP(0.6, 0.4);
  const flashFrom = durationInFrames - Math.round(0.45 * fps);
  if (frame >= flashFrom) {
    const i = Math.floor((frame - flashFrom) / 3) % FLASH.length;
    return <AbsoluteFill style={{ background: FLASH[i] }} />;
  }
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 420, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <svg width={300} height={380} viewBox="0 0 100 126" style={{ transform: `scale(${b}) translateY(${(1 - b) * 40}px)` }}>
          <path d="M10 6 h80 a6 6 0 0 1 6 6 v108 l-46 -30 l-46 30 v-108 a6 6 0 0 1 6 -6z" fill={C.orange} />
        </svg>
      </div>
      <Ar style={{ position: "absolute", top: 900, left: 0, width: 1080, textAlign: "center", fontSize: 96, fontWeight: 900, opacity: t1 }}>
        احفظ الفيديو
      </Ar>
      <Ar style={{ position: "absolute", top: 1040, left: 0, width: 1080, textAlign: "center", fontSize: 64, fontWeight: 700, color: C.orange, opacity: t2 }}>
        واختار ألوانك اليوم
      </Ar>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const p = useP(0.1, 0.9);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
      {ASSETS.logo ? <Img src={staticFile("logo/reignite-group-logo.png")} style={{ ...LOGO_STYLE, width: 900, opacity: p, transform: `scale(${0.97 + 0.03 * p})` }} /> : null}
    </AbsoluteFill>
  );
};
