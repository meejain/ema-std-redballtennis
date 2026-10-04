import { chromium } from 'playwright'; import fs from 'node:fs';
const [,, svgPath, out, sizeArg] = process.argv; const size = +(sizeArg||480);
const svg = fs.readFileSync(svgPath, 'utf8');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
await p.setContent(`<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="width:${size}px;height:${size}px;display:block"></body></html>`);
await p.waitForTimeout(300); await p.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }); await b.close(); console.log('wrote', out);
