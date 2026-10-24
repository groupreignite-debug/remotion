import { loadFont } from "@remotion/fonts";
import { loadFont as loadGoogleAlexandria } from "@remotion/google-fonts/Alexandria";
import { continueRender, delayRender, staticFile } from "remotion";
import { ASSETS, FONT } from "./theme";

// Alexandria .woff2 files copied from videos/incrementality-explained/assets/fonts/ (hyperfr).
// Adjust names here to match the copied files.
const FILES: { file: string; weight: string }[] = [
  { file: "Alexandria-Light.woff2", weight: "300" },
  { file: "Alexandria-Regular.woff2", weight: "400" },
  { file: "Alexandria-Medium.woff2", weight: "500" },
  { file: "Alexandria-SemiBold.woff2", weight: "600" },
  { file: "Alexandria-Bold.woff2", weight: "700" },
  { file: "Alexandria-ExtraBold.woff2", weight: "800" },
  { file: "Alexandria-Black.woff2", weight: "900" },
];

let started = false;
export const ensureFonts = () => {
  if (started) return;
  started = true;
  if (!ASSETS.fonts) {
    // Same typeface from Google Fonts until the brand files are in public/fonts/.
    loadGoogleAlexandria("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["arabic", "latin"] });
    return;
  }
  const handle = delayRender("Loading Alexandria");
  Promise.all(FILES.map((f) => loadFont({ family: FONT, url: staticFile(`fonts/${f.file}`), weight: f.weight, format: "woff2" }))).then(() => continueRender(handle));
};
