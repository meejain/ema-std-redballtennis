import { chromium } from 'playwright';
const [,, url, wArg, clickSel] = process.argv; const W = +wArg;
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const b = await chromium.launch(); const ctx = await b.newContext({viewport:{width:W,height:900},userAgent:UA}); const p = await ctx.newPage();
await p.goto(url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(3000);
const btn = await p.$('#onetrust-accept-btn-handler'); if (btn) { try { await btn.click({timeout:1500}); } catch{} await p.waitForTimeout(500); }
const dump = (label) => p.evaluate((label)=>{
  const props=['display','position','top','left','width','height','opacity','transition','backgroundColor','color','fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','marginLeft','borderBottom','borderTop','borderRadius','boxShadow','textAlign','justifyContent','alignItems','gap','flexDirection','textTransform','textDecoration','zIndex','overflow'];
  const info=(el)=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);const o={tag:el.tagName.toLowerCase(),cls:String(el.className).slice(0,90),aria:el.getAttribute('aria-expanded'),style:el.getAttribute('style'),rect:[Math.round(r.x),Math.round(r.y+scrollY),Math.round(r.width),Math.round(r.height)],text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,30)};for(const k of props){const v=cs[k];if(v&&v!=='none'&&v!=='normal'&&v!=='auto'&&v!=='0px'&&v!=='rgba(0, 0, 0, 0)'&&v!=='static'&&v!=='visible'&&v!=='all 0s ease 0s'&&v!=='start')o[k]=v;}return o;};
  const sels=['.top-navigation__top-bar','.top-navigation__top-bar-wrapper','.top-navigation__top-bar .dropdown','.top-navigation__logo-hamburger','.top-navigation__logo-hamburger--menu','.top-navigation__logo-hamburger--cancel','.top-navigation__navigation-menu','.navigation-menu__button-back','.navigation-menu__button-back-text','.navigation-menu__list','.navigation-menu__list-item--level-1','.navigation-menu__list-item--level-1 .level-1-content','.navigation-menu__list-item-link--level-1','.level-1-content__mobile-arrow','.toggle-button','.navigation-menu__sub-list','.navigation-menu__list-item-link--level-2','.drop-down','.drop-down__label-wrapper','.drop-down__select-list','.drop-down__image','.drop-down__image img','.drop-down__slogan','.drop-down__select-list-row','.drop-down__select-list-column','.drop-down__select-list-item','.drop-down__select-list-item a','.drop-down__close','.top-navigation__user-section--desktop'];
  const out={label,docH:document.documentElement.scrollHeight};
  for(const s of sels){const els=[...document.querySelectorAll(s)];out[s]=els.slice(0,4).map(info);}
  const tb=document.querySelector('.top-navigation__top-bar'); out.topBarParent=tb&&tb.parentElement.className; out.topBarChildren=tb?[...tb.children].map(c=>c.tagName+'.'+String(c.className).slice(0,60)):null;
  const nm=document.querySelector('.top-navigation__navigation-menu'); out.navMenuParent=nm&&String(nm.parentElement.className).slice(0,80); out.navMenuChildren=nm?[...nm.children].map(c=>c.tagName+'.'+String(c.className).slice(0,60)):null;
  return out;},label);
const before = await dump('before');
const target = await p.$(clickSel); if (target) { await target.click(); await p.waitForTimeout(700); }
const after = await dump('after');
await p.mouse.move(2,880); 
console.log(JSON.stringify({url,W,clickSel,before,after},null,0));
await b.close();
