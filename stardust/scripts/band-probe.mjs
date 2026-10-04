import { chromium } from 'playwright';
const [,, url, w, y1, y2] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1500);
const r = await p.evaluate(([a, z]) => { const out = []; for (const el of document.querySelectorAll('main *')) { const rc = el.getBoundingClientRect(); const top = rc.top + scrollY; if (rc.height > 200 && top < z && top + rc.height > a) { const cs = getComputedStyle(el); out.push(`${el.tagName.toLowerCase()}.${(el.className||'').toString().split(' ').slice(0,3).join('.')} y${Math.round(top)} h${Math.round(rc.height)} bg=${cs.backgroundImage.slice(0,90)} ${el.tagName==='IMG'?'src='+el.currentSrc.slice(-50)+' nat='+el.naturalWidth+'x'+el.naturalHeight:''}`); } } return out; }, [+y1, +y2]);
console.log(r.join('\n')); await b.close();
