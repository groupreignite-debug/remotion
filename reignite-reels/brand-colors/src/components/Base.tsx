import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, ease } from "../theme";

// Barely visible 72px grid with slow drift.
export const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = ((frame / fps) * 6) % 72;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        backgroundPosition: `${drift}px ${drift}px`,
        opacity: 1,
      }}
    >
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, transparent 30%, ${C.bg} 85%)` }} />
    </AbsoluteFill>
  );
};

// Arabic text container: always RTL, never split into letters.
export const Ar: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div dir="rtl" lang="ar" style={{ fontFamily: FONT, color: C.text, ...style }}>
    {children}
  </div>
);

// Latin term inside an Arabic line, isolated so punctuation/order don't flip.
export const Term: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.orange }) => (
  <bdi dir="ltr" style={{ color, unicodeBidi: "isolate" }}>
    {children}
  </bdi>
);

// Masked rise: whole element slides up from behind a clip edge.
export const Rise: React.FC<{ delay?: number; dur?: number; distance?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  dur = 0.6,
  distance = 60,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [delay * fps, (delay + dur) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * distance}px)`, opacity: p }}>{children}</div>
    </div>
  );
};

export const useSpring = (delaySec = 0, config = { damping: 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delaySec * fps, fps, config });
};

export const fadeIn = (frame: number, fps: number, at = 0, dur = 0.4) =>
  interpolate(frame, [at * fps, (at + dur) * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

// Corner label: site title + tag pill (e.g. مثال), top of frame, clear of Instagram's top UI.
export const Label: React.FC<{ title: string; tag: string; opacity?: number; y?: number }> = ({ title, tag, opacity = 1, y = 0 }) => (
  <div style={{ position: "absolute", top: 160, right: 56, left: 56, opacity, transform: `translateY(${y}px)` }}>
    <Ar style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div style={{ fontSize: 58, fontWeight: 800 }}>{title}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          padding: "8px 24px",
          borderRadius: 999,
          border: `2px solid ${C.orange}`,
          color: C.text,
        }}
      >
        {tag}
      </div>
    </Ar>
  </div>
);
