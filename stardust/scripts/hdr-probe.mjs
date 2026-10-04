import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://main--sdt-redballtennis--aemcoder.aem.page/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
console.log(await p.evaluate(() => [...document.querySelectorAll('header a')].map((a) => { const r = a.getBoundingClientRect(); return `${a.textContent.trim().slice(0, 24) || '(img)'} [${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)}x${Math.round(r.height)}] .${(a.className || '').toString().split(' ')[0]} ${a.getAttribute('href')}`; }).join('\n')));
console.log('--- nav list html:', await p.evaluate(() => (document.querySelector('.navigation-menu__list') || document.querySelector('header ul'))?.outerHTML.replace(/\s+/g, ' ').slice(0, 700)));
await b.close();
