import { chromium } from 'playwright';
const [,, url] = process.argv; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
console.log(JSON.stringify(await p.evaluate(() => {
  const sf = document.querySelector('.signup-form'); const zero = [...document.images].filter((i) => i.complete && i.naturalWidth > 0 && i.clientWidth === 0).map((i) => ({ src: i.currentSrc.split('/').pop().slice(0, 30), closest: i.closest('[class]')?.className.slice(0, 60), display: getComputedStyle(i.closest('picture') || i).display, mq: i.closest('picture')?.querySelector('source')?.media }));
  const sec404 = [...document.querySelectorAll('main .section')].map((s) => ({ cls: s.className, h: Math.round(s.getBoundingClientRect().height) }));
  return { hasForm: !!sf?.querySelector('form'), sfOuter: sf ? sf.outerHTML.replace(/\s+/g, ' ').slice(0, 900) : null, buttons: sf ? [...sf.querySelectorAll('button')].map((b) => b.className + '|' + b.textContent.trim() + '|disabled=' + b.disabled) : null, inputs: sf ? [...sf.querySelectorAll('input')].map((i) => '#' + i.id) : null, status: sf ? [...sf.querySelectorAll('[role=status], .notice')].map((n) => n.className) : null, zero, sections: sec404 };
}), null, 1)); await b.close();
