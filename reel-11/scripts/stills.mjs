import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
const root = process.cwd();
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const browser = await openBrowser('chrome', {browserExecutable: process.env.BROWSER_EXECUTABLE ?? null});
const composition = await selectComposition({serveUrl, id: 'Reel11', puppeteerInstance: browser});
for (const frame of frames) {
  await renderStill({serveUrl, composition, frame, output: path.join(root, `out/stills/f${String(frame).padStart(4,'0')}.png`), puppeteerInstance: browser, scale: 0.5});
  console.log('ok', frame);
}
await browser.close({silent: true});
