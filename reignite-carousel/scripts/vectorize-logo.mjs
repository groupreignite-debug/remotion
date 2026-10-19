// One-off: traces the flame mark from assets/logo-source.png into assets/flame.svg.
import sharp from 'sharp';
import potrace from 'potrace';
import {writeFileSync} from 'node:fs';

const SCALE = 6;
const box = {left: 513, top: 315, width: 224, height: 304};

const mask = await sharp('assets/logo-source.png')
	.extract(box)
	.greyscale()
	.resize(box.width * SCALE, box.height * SCALE, {kernel: 'lanczos3'})
	.blur(2)
	.threshold(110)
	.negate()
	.png()
	.toBuffer();

potrace.trace(mask, {turdSize: 40, optTolerance: 0.2, alphaMax: 1.1}, (err, svg) => {
	if (err) throw err;
	const d = svg.match(/ d="([^"]+)"/)[1];
	// Flame sits at x 523–726, y 325–608 in the source; crop the viewBox to it (+2px).
	const vb = [8, 8, 207, 287].map((n) => n * SCALE).join(' ');
	writeFileSync(
		'assets/flame.svg',
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
<defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#F98203"/><stop offset="1" stop-color="#F85A03"/>
</linearGradient></defs>
<path fill="url(#fg)" fill-rule="evenodd" d="${d}"/>
</svg>
`,
	);
	console.log('wrote assets/flame.svg', d.length);
});
