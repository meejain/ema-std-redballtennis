import { chromium } from 'playwright';
const [,, url, w] = process.argv; const W = +(w || 1440);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
const errors = []; p.on('pageerror', (e) => errors.push(String(e).slice(0, 120))); p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 120)); });
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const q = (s) => document.querySelector(s); const rect = (el) => el ? [Math.round(el.getBoundingClientRect().top + scrollY), Math.round(el.getBoundingClientRect().height)] : null;
  const imgs = [...document.images].map((i) => ({ src: i.currentSrc.split('/').pop().slice(0, 40), ok: i.complete && i.naturalWidth > 0, w: i.clientWidth }));
  return { appear: document.body.classList.contains('appear'), headerStatus: q('header .header')?.dataset.blockStatus, footerStatus: q('footer .footer')?.dataset.blockStatus, header: rect(q('header')), topBar: rect(q('.top-navigation__top-bar')), mainBar: rect(q('.top-navigation__main-bar')), crumb: rect(q('.breadcrumb')), footer: rect(q('footer')), footerXf: rect(q('.footer-xf')), navLinks: [...document.querySelectorAll('.navigation-menu__list-item-link--level-1')].map((a) => a.textContent.trim() + (a.getAttribute('aria-current') ? '*' : '')), dropdown: !!q('.drop-down__label-wrapper'), brokenImgs: imgs.filter((i) => !i.ok).map((i) => i.src), zeroImgs: imgs.filter((i) => i.ok && i.w === 0).map((i) => i.src), sections: document.querySelectorAll('main .section').length, docH: document.documentElement.scrollHeight, title: document.title, navHeightVar: getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim() };
});
console.log(JSON.stringify({ url, W, ...r, errors }, null, 1)); await b.close();
