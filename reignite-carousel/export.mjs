// Renders every .slide in slides.html at 2x and downscales to 1080x1350 PNGs in out/.
import {chromium} from 'playwright-core';
import sharp from 'sharp';
import {existsSync, mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const executablePath = process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch({executablePath});
const page = await browser.newPage({viewport: {width: 1200, height: 1400}, deviceScaleFactor: 2});
await page.goto(pathToFileURL('slides.html').href, {waitUntil: 'networkidle'});
await page.evaluate(() => document.fonts.ready);

mkdirSync('out', {recursive: true});
const slides = await page.$$('.slide');
for (const [i, slide] of slides.entries()) {
	const file = `out/slide-${String(i + 1).padStart(2, '0')}.png`;
	const png = await slide.screenshot({type: 'png'});
	await sharp(png).resize(1080, 1350, {kernel: 'lanczos3'}).png().toFile(file);
	console.log(file);
}
await browser.close();
