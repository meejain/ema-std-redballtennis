import { chromium } from 'playwright';
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1440,height:900},userAgent:UA}); const p=await ctx.newPage();
await p.goto('https://www.redballtennis.com/en/home.html',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(3000);
const btn=await p.$('#onetrust-accept-btn-handler'); if(btn){try{await btn.click({timeout:1000});}catch{} await p.waitForTimeout(400);} await p.mouse.move(2,880);
const r=await p.evaluate(()=>{ const pts=[[700,30],[700,59],[700,61],[700,110],[700,163],[700,166],[700,180],[10,30],[100,30]]; const out={}; for(const [x,y] of pts){ const els=document.elementsFromPoint(x,y).slice(0,8).map(e=>{const cs=getComputedStyle(e); return `${e.tagName.toLowerCase()}.${(e.className||'').toString().split(' ').filter(Boolean).slice(0,2).join('.')} bg=${cs.backgroundColor} bgi=${cs.backgroundImage.slice(0,40)} op=${cs.opacity} pos=${cs.position} z=${cs.zIndex}`}); out[`${x},${y}`]=els; }
 const tb=document.querySelector('.top-navigation__top-bar'); const cs=getComputedStyle(tb); out.topbar={bg:cs.backgroundColor, bgi:cs.backgroundImage, cls:tb.className, style:tb.getAttribute('style'), before:getComputedStyle(tb,'::before').content, beforeBg:getComputedStyle(tb,'::before').backgroundColor, after:getComputedStyle(tb,'::after').content};
 const dd=document.querySelector('.drop-down__select-list'); out.dropdownList={display:getComputedStyle(dd).display, rect:JSON.stringify(dd.getBoundingClientRect()), bg:getComputedStyle(dd).backgroundColor};
 const nav=document.querySelector('.top-navigation'); out.navStyle=nav.getAttribute('style'); out.navBg=getComputedStyle(nav).backgroundColor;
 return out; });
console.log(JSON.stringify(r,null,1));
const clip=await p.screenshot({clip:{x:0,y:0,width:1440,height:200}}); await import('node:fs').then(fs=>fs.writeFileSync('stardust/replica/capture/header-live-1440.png',clip));
await b.close();
