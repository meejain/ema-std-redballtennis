import { chromium } from 'playwright';
const [,, url, w, sel] = process.argv; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(url, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate((s) => [...document.querySelectorAll(s)].map((e) => [Math.round(e.getBoundingClientRect().top + scrollY), Math.round(e.getBoundingClientRect().height), (e.className || '').toString().split(' ').slice(0, 3).join('.')]), sel))); await b.close();
