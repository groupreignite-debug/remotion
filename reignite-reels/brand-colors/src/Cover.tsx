import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ASSETS, BRANDS, C, FONT, LOGO_STYLE } from "./theme";
import { Grid } from "./components/Base";
import { ensureFonts } from "./fonts";

// Cover: text inside the centre 1080x1350 (y 285-1635) so it survives the grid crop.
export const Cover: React.FC = () => {
  ensureFonts();
  const pairs = [BRANDS.coke, BRANDS.mcd, BRANDS.spotify];
  return (
    <AbsoluteFill>
      <Grid />
      <div dir="rtl" lang="ar" style={{ position: "absolute", top: 360, left: 60, right: 60, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1.25, color: C.text }}>
        ليش البراندات الكبيرة
        <br />
        <span style={{ color: C.orange }}>لونين بس؟</span>
      </div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 48 }}>
        {pairs.map((p) => (
          <div key={p.name} style={{ width: 240, borderRadius: 28, overflow: "hidden", boxShadow: `0 0 0 2px ${C.line}` }}>
            <div style={{ height: 200, background: p.a }} />
            <div style={{ height: 200, background: p.b }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.dim, letterSpacing: 4 }}>
        60 / 30 / 10
      </div>
      {ASSETS.logo ? <Img src={staticFile("logo/reignite-group-logo.png")} style={{ ...LOGO_STYLE, position: "absolute", top: 1400, left: "50%", transform: "translateX(-50%)", height: 200 }} /> : null}
    </AbsoluteFill>
  );
};
