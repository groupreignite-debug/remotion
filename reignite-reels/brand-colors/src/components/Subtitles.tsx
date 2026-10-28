import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { KEY_TERMS, SCRIPT } from "../data/script";
import { LINES } from "../timeline";
import { Term } from "./Base";

// Wrap Latin key terms in <bdi> + orange; everything else stays Arabic.
const renderLine = (text: string) => {
  const re = new RegExp(`(${KEY_TERMS.map((t) => t.replace(/[-]/g, "\\-")).join("|")})`, "g");
  return text.split(re).map((part, i) => (KEY_TERMS.includes(part) ? <Term key={i}>{part}</Term> : <React.Fragment key={i}>{part}</React.Fragment>));
};

// One line at a time, whole-line fade/rise. Kept above y=1440 (Instagram safe zone).
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = LINES.findIndex((l, i) => t >= l.start && t < Math.min(l.end + 0.2, LINES[i + 1]?.start ?? Infinity));
  if (idx < 0) return null;
  const l = LINES[idx];
  const local = (t - l.start) * fps;
  const p = interpolate(local, [0, 0.25 * fps], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 500, display: "flex", justifyContent: "center" }}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 600,
          lineHeight: 1.45,
          color: C.text,
          textAlign: "center",
          background: "rgba(26,26,26,0.82)",
          border: `1px solid ${C.line}`,
          borderRadius: 28,
          padding: "16px 34px",
          opacity: p,
          transform: `translateY(${(1 - p) * 14}px)`,
        }}
      >
        {renderLine(SCRIPT[l.id])}
      </div>
    </div>
  );
};
