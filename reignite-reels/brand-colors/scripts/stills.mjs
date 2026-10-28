// Preview helper: bundle once, render a still for each given second.
// Usage: node scripts/stills.mjs <outDir> 1.5 6 15 ...
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [outDir, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "BrandColors", browserExecutable: process.env.REMOTION_BROWSER ?? null });
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  await renderStill({ serveUrl, composition, frame, output: path.join(outDir, `s_${String(s).padStart(5, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 70, scale: 0.5, browserExecutable: process.env.REMOTION_BROWSER ?? null });
  console.log("rendered", s);
}
