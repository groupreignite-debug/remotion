import type { CSSProperties, ReactNode } from "react";

// The one world of the reel: the jacket card, the Pixel dot, the person, the phone, the line icons.
// Drawn exactly as in the HyperFrames build. Emoji are drawn as line icons (Alexandria has none, and a
// fallback emoji font would look different from scene to scene).

export const C = {
  orange: "#FF4D1A",
  charcoal: "#1A1A1A",
  paper: "#F5F1EA",
  gold: "#FFB000",
  paper70: "rgba(245, 241, 234, 0.7)",
  paper55: "rgba(245, 241, 234, 0.55)",
  paper14: "rgba(245, 241, 234, 0.14)",
  paper08: "rgba(245, 241, 234, 0.08)",
  muted: "#6E6A64",
};

export const abs: CSSProperties = { position: "absolute" };

// a centred text row across the full width
export const row = (top: number, s: CSSProperties = {}): CSSProperties => ({
  position: "absolute",
  left: 0,
  right: 0,
  top,
  textAlign: "center",
  whiteSpace: "nowrap",
  ...s,
});
export const ar: CSSProperties = { direction: "rtl", unicodeBidi: "isolate" };
export const en: CSSProperties = { direction: "ltr", unicodeBidi: "isolate" };

export const JACKET_SHADOW = "0px 18px 40px 0px rgba(0,0,0,0.35)";

export const JacketDrawing: React.FC<{ readonly style: CSSProperties }> = ({
  style,
}) => (
  <svg
    viewBox="0 0 100 100"
    style={{ position: "absolute", display: "block", ...style }}
  >
    <path
      d="M38 14 L50 30 L62 14 M38 14 L22 20 L10 46 L22 52 L26 44 L26 88 L74 88 L74 44 L78 52 L90 46 L78 20 L62 14 M50 30 V88 M33 66 H43 M57 66 H67"
      fill="none"
      stroke={C.charcoal}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="50" cy="40" r="3.5" fill={C.orange} />
  </svg>
);

// the off-white jacket card: the item left behind, the card that follows, the product the Pixel remembers
export const Jacket: React.FC<{
  readonly style: CSSProperties;
  readonly small: boolean;
}> = ({ style, small }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: small ? 16 : 28,
      background: C.paper,
      boxShadow: JACKET_SHADOW,
      ...style,
    }}
  >
    <JacketDrawing
      style={{ left: "14%", top: "12%", width: "72%", height: "72%" }}
    />
  </div>
);

export const Person: React.FC<{ readonly style: CSSProperties }> = ({
  style,
}) => (
  <div style={{ position: "absolute", display: "block", ...style }}>
    <svg
      viewBox="0 0 60 100"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        fill: "currentColor",
      }}
    >
      <circle cx="30" cy="16" r="14" />
      <path d="M5 98 V64 Q5 38 30 38 Q55 38 55 64 V98 Z" />
    </svg>
  </div>
);

// line icons on a 24-unit grid, stroke = currentColor
const ICONS = {
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  hand: (
    <>
      <path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.3l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" />
    </>
  ),
  cart: (
    <>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L22 7H5.1" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  arrow: <path d="M20 12H4M10 6l-6 6 6 6" />,
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  stop: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M7 12h10" />
    </>
  ),
  sleepy: (
    <>
      <circle cx="11" cy="13.5" r="9" />
      <path d="M6.5 12q1.6 1.4 3.2 0M12.3 12q1.6 1.4 3.2 0" />
      <circle cx="11" cy="17.3" r="1.2" />
      <path d="M17.6 1.6h3.6l-3.6 3.6h3.6" />
    </>
  ),
};

export const Icon: React.FC<{
  readonly name: keyof typeof ICONS;
  readonly size: number;
  readonly style: CSSProperties | null;
}> = ({ name, size, style }) => (
  <i
    style={{
      display: "block",
      width: size,
      height: size,
      flex: "none",
      ...style,
    }}
  >
    <svg
      viewBox="0 0 24 24"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2.2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    >
      {ICONS[name]}
    </svg>
  </i>
);

export const Cursor: React.FC<{ readonly style: CSSProperties }> = ({
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: 58,
      height: 58,
      ...style,
    }}
  >
    <svg
      viewBox="0 0 24 24"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <path
        d="M4 2 L4 21 L9.2 15.9 L12.6 23 L15.6 21.6 L12.3 14.6 L19.4 14.6 Z"
        fill={C.paper}
        stroke={C.charcoal}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// tap ring: positioned by its centre
export const Ring: React.FC<{
  readonly left: number;
  readonly top: number;
  readonly style: CSSProperties;
}> = ({ left, top, style }) => (
  <i
    style={{
      position: "absolute",
      left,
      top,
      width: 90,
      height: 90,
      margin: "-45px 0 0 -45px",
      borderRadius: "50%",
      border: `4px solid ${C.orange}`,
      ...style,
    }}
  />
);

// the Pixel: one small glowing orange dot, always the same
export const PixelDot: React.FC<{ readonly style: CSSProperties }> = ({
  style,
}) => (
  <i
    style={{
      position: "absolute",
      display: "block",
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: C.orange,
      boxShadow: "0 0 18px 5px rgba(255, 77, 26, 0.55)",
      ...style,
    }}
  />
);

export const Bar: React.FC<{ readonly style: CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      height: 18,
      borderRadius: 9,
      background: C.paper14,
      ...style,
    }}
  />
);

export const Phone: React.FC<{
  readonly style: CSSProperties;
  readonly children: ReactNode;
}> = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 48,
      border: `3px solid ${C.paper14}`,
      background: "rgba(245, 241, 234, 0.03)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// an abstract social feed (no platform logos, icons or colours)
export const Feed: React.FC<{ readonly style: CSSProperties }> = ({
  style,
}) => {
  const dot = (top: number): CSSProperties => ({
    position: "absolute",
    display: "block",
    left: 22,
    top,
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: C.paper14,
  });
  const block = (top: number, height: number): CSSProperties => ({
    position: "absolute",
    left: 22,
    top,
    width: 220,
    height,
    borderRadius: 16,
    background: C.paper08,
  });
  return (
    <Phone style={{ borderRadius: 40, ...style }}>
      <Bar style={{ left: 22, top: 22, width: 90, height: 10 }} />
      <i style={dot(66)} />
      <Bar style={{ left: 80, top: 72, width: 130, height: 14 }} />
      <Bar style={{ left: 80, top: 94, width: 80, height: 10 }} />
      <div style={block(128, 220)} />
      <Bar style={{ left: 22, top: 370, width: 200, height: 12 }} />
      <Bar style={{ left: 22, top: 394, width: 140, height: 12 }} />
      <i style={dot(440)} />
      <Bar style={{ left: 80, top: 446, width: 120, height: 14 }} />
      <div style={block(502, 120)} />
    </Phone>
  );
};

export const Chip: React.FC<{
  readonly style: CSSProperties;
  readonly children: ReactNode;
}> = ({ style, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      height: 92,
      padding: "0 36px",
      borderRadius: 46,
      border: `2px solid ${C.paper14}`,
      background: "rgba(245, 241, 234, 0.04)",
      fontSize: 46,
      fontWeight: 700,
      ...style,
    }}
  >
    {children}
  </div>
);
