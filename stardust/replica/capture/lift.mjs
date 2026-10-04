// Computed-style lift of the LIVE page at a given width. Writes a JSON map of every
// visible text/media/container element with rect + the style groups the gate measures.
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
const [,, url, out, wArg] = process.argv; const W = +(wArg || 1440);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, userAgent: UA, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500);
for (const sel of ['#onetrust-accept-btn-handler', 'button:has-text("Accept All")']) { const b = await page.$(sel); if (b) { try { await b.click({ timeout: 1000 }); } catch {} await page.waitForTimeout(500); break; } }
await page.mouse.move(2, W > 700 ? 880 : 800);
// scroll settle
await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400)); });
const data = await page.evaluate(() => {
  const props = ['display','position','fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','textTransform','textAlign','color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','borderTopWidth','borderBottomWidth','borderLeftWidth','borderRightWidth','borderColor','borderRadius','boxShadow','width','maxWidth','minHeight','height','gap','flexDirection','justifyContent','alignItems','gridTemplateColumns','textDecoration','opacity','overflow','zIndex','top','left','right','bottom','objectFit','aspectRatio','textRendering','webkitFontSmoothing','float','verticalAlign','whiteSpace','textShadow','transform'];
  const out = []; let idx = 0;
  const visible = (el, r) => r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
  const walk = (el, depth, pathArr) => {
    if (!(el instanceof Element)) return; if (['SCRIPT','STYLE','NOSCRIPT','TEMPLATE','IFRAME'].includes(el.tagName)) { if (el.tagName === 'IFRAME') { const r = el.getBoundingClientRect(); out.push({ i: idx++, tag: 'iframe', src: el.src, rect: [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)], depth }); } return; }
    if (el.id === 'onetrust-consent-sdk' || el.id === 'onetrust-banner-sdk' || el.className?.toString?.().includes('acsb')) return;
    const r = el.getBoundingClientRect(); if (!visible(el, r)) return;
    const cs = getComputedStyle(el);
    const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' ');
    const isMedia = ['IMG','SVG','VIDEO','PICTURE','INPUT','BUTTON','SELECT','TEXTAREA','A'].includes(el.tagName);
    const rec = { i: idx++, tag: el.tagName.toLowerCase(), cls: (typeof el.className === 'string' ? el.className : '').trim().slice(0, 160), id: el.id || undefined, depth, rect: [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)], text: ownText.slice(0, 120) || undefined, href: el.tagName === 'A' ? el.getAttribute('href') : undefined, src: el.tagName === 'IMG' ? (el.currentSrc || el.src) : undefined, alt: el.tagName === 'IMG' ? el.alt : undefined, nat: el.tagName === 'IMG' ? [el.naturalWidth, el.naturalHeight] : undefined, s: {} };
    for (const p of props) { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)' && v !== 'static' && v !== 'visible' && v !== 'start') rec.s[p] = v; }
    for (const pe of ['::before', '::after']) { const pc = getComputedStyle(el, pe); if (pc.content && pc.content !== 'none' && pc.content !== 'normal') { rec[pe] = { content: pc.content, bg: pc.backgroundImage, bgc: pc.backgroundColor, w: pc.width, h: pc.height, pos: pc.position }; } }
    if (ownText || isMedia || el.children.length === 0 || depth < 9) out.push(rec);
    for (const c of el.children) walk(c, depth + 1);
  };
  walk(document.body, 0, []);
  // stylesheet meta: font-faces + media queries (same-origin sheets)
  const faces = [], medias = new Set();
  for (const ss of document.styleSheets) { let rules; try { rules = ss.cssRules; } catch { continue; } for (const r of rules) { if (r instanceof CSSFontFaceRule) faces.push(r.cssText.slice(0, 400)); if (r instanceof CSSMediaRule) medias.add(r.conditionText || r.media.mediaText); } }
  return { url: location.href, width: innerWidth, docHeight: document.documentElement.scrollHeight, title: document.title, bodyClass: document.body.className, htmlFont: getComputedStyle(document.documentElement).fontSize, bodyStyle: { fontFamily: getComputedStyle(document.body).fontFamily, fontSize: getComputedStyle(document.body).fontSize, color: getComputedStyle(document.body).color, bg: getComputedStyle(document.body).backgroundColor, textRendering: getComputedStyle(document.body).textRendering, smoothing: getComputedStyle(document.body).webkitFontSmoothing, lineHeight: getComputedStyle(document.body).lineHeight }, fontFaces: faces, mediaQueries: [...medias], elements: out };
});
await mkdir('stardust/replica/capture', { recursive: true });
await writeFile(out, JSON.stringify(data, null, 1));
console.log(`${url} @${W}: docHeight=${data.docHeight} elements=${data.elements.length} faces=${data.fontFaces.length} mq=${data.mediaQueries.length} -> ${out}`);
await browser.close();
