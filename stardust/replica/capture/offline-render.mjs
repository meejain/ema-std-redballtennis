// Offline re-render of the SAVED live DOM with the SAVED live CSS + local fonts/media (zero live hits).
// usage: node offline-render.mjs <slug> <width> <out-prefix>   → <out>.png (full page) + <out>.json (rects)
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path';
const [,, slug, wArg, out] = process.argv; const W = +wArg;
const root = process.cwd();
const cssDir = path.join(root, 'stardust/replica/capture/css'); const cssFiles = fs.readdirSync(cssDir);
const mediaDir = path.join(root, 'stardust/current/assets/media'); const mediaFiles = fs.readdirSync(mediaDir);
const fontDir = path.join(root, 'stardust/current/assets/fonts');
const mime = (f) => ({ '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.woff2':'font/woff2', '.otf':'font/otf' })[path.extname(f).toLowerCase()] || 'application/octet-stream';
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: W, height: 900 } });
const pageUrl = `http://localhost:8793/stardust/current/pages/${slug}.html`;
await page.route('**/*', async (r) => {
  const u = new URL(r.request().url()); const p = u.pathname; const base = path.basename(p);
  if (r.request().url() === pageUrl) return r.continue();
  if (p.endsWith('.css')) { const h = base.match(/\.([0-9a-f]{32})\.css$/)?.[1]; const f = cssFiles.find(x => h && x.includes(h)); if (f) return r.fulfill({ path: path.join(cssDir, f), contentType: 'text/css' }); return r.abort(); }
  if (/\.(woff2|otf|ttf)$/.test(base)) { const f = path.join(fontDir, base); if (fs.existsSync(f)) return r.fulfill({ path: f, contentType: mime(f) }); return r.abort(); }
  if (/\.(svg|png|jpe?g)$/i.test(base)) { const stem = decodeURIComponent(base).replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9_.-]/g, '-'); const ext = path.extname(base).toLowerCase();
    let f = mediaFiles.find(x => x.startsWith(stem + '-') && x.toLowerCase().endsWith(ext)); if (!f) f = mediaFiles.find(x => x.startsWith(stem + '-'));
    if (f) return r.fulfill({ path: path.join(mediaDir, f), contentType: mime(f) }); return r.abort(); }
  return r.abort();
});
await page.goto(pageUrl, { waitUntil: 'load' }); await page.waitForTimeout(800);
await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
await page.waitForTimeout(300);
const data = await page.evaluate(() => {
  const root = document.querySelector('.container.responsivegrid'); const rows = [];
  const walk = (el, d) => { if (el.nodeType !== 1) return; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    if (cs.display !== 'none' && !['SCRIPT','STYLE','META','LINK'].includes(el.tagName)) {
      let t = ''; for (const c of el.childNodes) if (c.nodeType === 3) t += c.textContent; t = t.replace(/\s+/g,' ').trim();
      rows.push({ d, tag: el.tagName.toLowerCase(), cls: (el.className && typeof el.className === 'string') ? el.className.trim().slice(0,120) : '', id: el.id || undefined, rect: [Math.round(r.left*10)/10, Math.round((r.top+scrollY)*10)/10, Math.round(r.width*10)/10, Math.round(r.height*10)/10], text: t.slice(0,60) || undefined,
        pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].join(' '), mar: [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft].join(' '), disp: cs.display, font: `${cs.fontFamily.split(',')[0]} ${cs.fontSize}/${cs.lineHeight}`, color: cs.color, bg: cs.backgroundColor + (cs.backgroundImage !== 'none' ? ' img' : ''), fl: cs.float, w: cs.width, minw: cs.minWidth, maxw: cs.maxWidth });
      for (const c of el.children) walk(c, d+1); } };
  walk(root, 0); return { docHeight: document.documentElement.scrollHeight, rows };
});
fs.writeFileSync(out + '.json', JSON.stringify(data));
await page.screenshot({ path: out + '.png', fullPage: true });
console.log('docHeight', data.docHeight, 'rows', data.rows.length);
await b.close();
