// Build-side geometry probe (free): prints [x,y,w,h] + font for text/media elements under .container.responsivegrid
import { chromium } from 'playwright';
const [,, url, wArg] = process.argv; const W = +wArg;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(600);
await p.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 20)); } window.scrollTo(0, 0); });
await p.waitForTimeout(200);
const out = await p.evaluate(() => {
  const root = document.querySelector('main.container.responsivegrid') || document.querySelector('.container.responsivegrid.full-width--root');
  const sel = 'h1,h2,h3,h4,p,b,img,hr,a.button-core,input,button,iframe,label,section,.band';
  const rows = [`docHeight ${document.documentElement.scrollHeight} main [${Math.round(root.getBoundingClientRect().top+scrollY)} ${Math.round(root.getBoundingClientRect().height)}]`];
  for (const el of root.querySelectorAll(sel)) { const cs = getComputedStyle(el); if (cs.display === 'none') continue; const r = el.getBoundingClientRect(); if (!r.width && !r.height) continue;
    let t = ''; for (const c of el.childNodes) if (c.nodeType === 3) t += c.textContent; t = t.replace(/\s+/g,' ').trim().slice(0,32);
    rows.push(`${el.tagName.toLowerCase()} [${Math.round(r.left*10)/10}, ${Math.round((r.top+scrollY)*10)/10}, ${Math.round(r.width*10)/10}, ${Math.round(r.height*10)/10}] ${cs.fontFamily.split(',')[0].replace(/"/g,'')} ${cs.fontSize}/${cs.lineHeight} ${t ? JSON.stringify(t) : ''}`); }
  return rows.join('\n'); });
console.log(out); await b.close();
