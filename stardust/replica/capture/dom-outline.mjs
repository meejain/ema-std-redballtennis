import { chromium } from 'playwright';
const [,, file, sel, maxDepth] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.route('**/*', r => r.request().url().startsWith('file://') ? r.continue() : r.abort());
await p.goto('file://' + file, { waitUntil: 'domcontentloaded' });
const out = await p.evaluate(({sel, maxDepth}) => {
  const root = document.querySelector(sel); const lines = [];
  const walk = (el, d) => {
    if (d > maxDepth) return;
    if (el.nodeType === 3) { const t = el.textContent.replace(/\s+/g,' ').trim(); if (t) lines.push('  '.repeat(d) + '#text ' + JSON.stringify(t.slice(0,140))); else if (el.textContent.includes(' ')) lines.push('  '.repeat(d)+'#text NBSP'); return; }
    if (el.nodeType !== 1) return;
    if (['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) return;
    let s = '  '.repeat(d) + '<' + el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') s += ' .' + el.className.trim().split(/\s+/).join('.');
    for (const a of ['id','src','alt','href','style','hidden','aria-hidden','type','disabled','data-cmp-hook-image','title','loading','width','height','placeholder','for','name','target','value']) if (el.hasAttribute(a)) s += ` ${a}=${JSON.stringify(el.getAttribute(a).slice(0,150))}`;
    s += '>'; lines.push(s);
    for (const c of el.childNodes) walk(c, d+1);
  };
  walk(root, 0); return lines.join('\n');
}, {sel, maxDepth: +maxDepth||40});
console.log(out); await b.close();
