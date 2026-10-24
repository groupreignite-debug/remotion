import { Easing } from "remotion";

export const C = {
  bg: "#1A1A1A",
  orange: "#FF4D1A",
  text: "#F5F1EA",
  gold: "#FFB000",
  dim: "rgba(245,241,234,0.55)",
  line: "rgba(245,241,234,0.14)",
};

// Brand color blocks (approximate, shown as color + plain-text name only, never logos).
export const BRANDS = {
  coke: { name: "Coca-Cola", a: "#E61D2B", b: "#FFFFFF" },
  mcd: { name: "McDonald's", a: "#DA291C", b: "#FFC72C" },
  spotify: { name: "Spotify", a: "#1DB954", b: "#191414" },
};

export const FLASH = ["#E61D2B", "#1DB954", "#FFC72C", "#7F7CAF", "#00A6ED", "#FF4D1A", "#D81E5B", "#95D9C3"];

export const FONT = "Alexandria";

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Set to true once the matching file is in public/.
export const ASSETS = {
  fonts: false,
  vo: true, // public/audio/vo.mp3 (ElevenLabs, Fadi voice)
  logo: true,
  music: false,
};

export const LOGO_STYLE = { mixBlendMode: "lighten" } as const;
