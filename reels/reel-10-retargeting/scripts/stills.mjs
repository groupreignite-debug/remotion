// Renders a contact sheet of frames for visual review.
// Usage: node scripts/stills.mjs <out.png> <frame> <frame> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [out, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Reel10', browserExecutable});
const dir = fs.mkdtempSync('/tmp/stills-');
const files = [];
for (const f of frames) {
	const file = path.join(dir, `${String(f).padStart(5, '0')}.png`);
	await renderStill({serveUrl, composition, frame: Number(f), output: file, browserExecutable, scale: 0.4});
	files.push(file);
}
const cols = Math.min(4, files.length);
const inputs = files.flatMap((f) => ['-i', f]);
const labels = files.map((_, i) => `[${i}]drawtext=text='${frames[i]}':x=10:y=10:fontsize=28:fontcolor=yellow:box=1:boxcolor=black[v${i}]`).join(';');
const rows = Math.ceil(files.length / cols);
const layout = files.map((_, i) => `${(i % cols) * 432}_${Math.floor(i / cols) * 768}`).join('|');
execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', `${labels};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${layout}:fill=gray`, out]);
console.log('wrote', out, rows, 'rows');
