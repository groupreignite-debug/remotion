import { AbsoluteFill, Img, staticFile } from "remotion";
import { ar, C, en, Jacket, row } from "./world";
import "./fonts";

// Episode cover (series template): charcoal, small شو يعني؟ in orange, `Retargeting` huge in off-white,
// ليش الإعلان لاحقك؟ beneath it with the jacket card beside it, the logo small at the bottom.
// All text stays inside the centre 1080×1350 (y 285–1635) so it survives the grid crop.
export const Cover: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.charcoal,
      color: C.paper,
      fontFamily: "Alexandria, sans-serif",
      WebkitFontSmoothing: "antialiased",
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(245,241,234,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,234,0.035) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 560,
        width: 800,
        height: 800,
        borderRadius: "50%",
        background:
          "radial-gradient(closest-side, rgba(255,77,26,0.2), rgba(255,77,26,0.06) 55%, rgba(255,77,26,0) 100%)",
      }}
    />
    <div
      style={{
        ...row(360, ar),
        fontSize: 60,
        fontWeight: 800,
        color: C.orange,
      }}
    >
      شو يعني؟
    </div>
    <div
      style={{
        ...row(470),
        left: 470,
        right: 470,
        height: 4,
        background: C.paper14,
      }}
    />
    <div
      style={{
        ...row(610, en),
        fontSize: 150,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        lineHeight: 1.15,
      }}
    >
      Retargeting
    </div>
    <div
      style={{
        ...row(1010, ar),
        height: 220,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 36,
      }}
    >
      <span style={{ fontSize: 62, fontWeight: 800 }}>
        ليش الإعلان <span style={{ color: C.orange }}>لاحقك؟</span>
      </span>
      <Jacket
        small={false}
        style={{
          position: "relative",
          width: 160,
          height: 160,
          borderRadius: 26,
        }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 390,
        top: 1430,
        width: 300,
        height: 169,
        mixBlendMode: "lighten",
      }}
    >
      <Img
        src={staticFile("reignite-group-logo.png")}
        alt="Reignite Group"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 75% at 50% 48%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.38) 100%)",
      }}
    />
  </AbsoluteFill>
);
