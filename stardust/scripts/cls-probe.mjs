// CLS probe on the DEPLOYED page with delayed woff2 + /nav + /footer fetches (deploy SKILL #100/#101)
import { chromium } from 'playwright';
const [,, url, w] = process.argv; const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +(w || 1440), height: 900 } });
await ctx.route(/\.(woff2|otf)(\?|$)|\/nav\.plain\.html|\/footer\.plain\.html|fonts\.css/, async (route) => { await new Promise((r) => setTimeout(r, 1500)); route.continue(); });
const p = await ctx.newPage();
await p.addInitScript(() => { window.__cls = 0; window.__shifts = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: (e.sources || []).map((s) => s.node && (s.node.className || s.node.tagName)).join(',').slice(0, 80) }); } }).observe({ type: 'layout-shift', buffered: true }); });
await p.goto(url, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(4500);
const r = await p.evaluate(() => ({ cls: +window.__cls.toFixed(4), shifts: window.__shifts.slice(0, 8) }));
console.log(JSON.stringify({ url, w: +(w || 1440), ...r })); await b.close();
