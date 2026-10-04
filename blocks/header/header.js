/**
 * header — the redballtennis.com three-bar chrome (black-on-blue utility bar with the
 * "USTA SITES" dropdown, blue main bar with logo + nav, blue breadcrumb strip),
 * template-slotted (deploy Step 6 / #95) from the authored /nav document.
 *
 * /nav document contract (default content only, three sections):
 *   1. brand   — one <p><a href="/"> holding two <img> (desktop logo, mobile logo);
 *                the pipeline emits <picture>. A single image is used for both.
 *   2. links   — one <ul>: <li><a href="/">HOME</a>, <li><a href="/play">PLAY</a>, …;
 *                a <li> whose text has no link but carries a nested <ul> is the
 *                "VISIT OUR OTHER SITES" dropdown item (mobile-only row, as live).
 *   3. tools   — <p>USTA SITES</p> (the dropdown pill label), an optional second
 *                <p>VISIT OUR OTHER SITES</p> (the dropdown slogan) and the <ul> of
 *                external USTA sites shown in the open dropdown.
 *
 * Decode (#98): on live the pipeline wraps each list item's trigger in <p>
 * (<li><p><a>…</p><ul>); the harness/authored shape is <li><a>…<ul>. Both are
 * normalised by unwrapping `:scope > p`.
 *
 * Experience Workspace (EW1–EW3): every authored element (the logo <a> + its
 * <picture>s, the nav <ul>, the tools <p>s and <ul>) is MOVED into a template slot;
 * template wrappers carry the live class names, authored elements carry none
 * (the `active` nav state is `aria-current="page"`, an attribute).
 * @ew-exempt <li> breadcrumb — "Home" / ">" / the current page label are generated
 *   from location + getMetadata('breadcrumb') || document.title (runtime values,
 *   allowlisted strings: "Home", ">").
 *
 * Interaction (the ONLY two behaviours observed live, stardust/canon/chrome.js):
 *   - USTA SITES dropdown: the pill button toggles aria-expanded; CSS shows the list.
 *   - ≤1369px hamburger: the nav menu is re-parented into the utility bar; the click
 *     adds `top-navigation__top-bar--opened top-to-bottom` (top .3s transition),
 *     shows the menu and swaps the burger / cancel icons.
 *   Escape and focus-out close both (stock header machinery, restyled).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// the live mobile chrome switch is 1369px
const isDesktop = window.matchMedia('(min-width: 1370px)');

const TEMPLATE = `
<div class="topnavigation">
  <nav class="top-navigation red-ball-colors" aria-label="Site">
    <div id="top-navigation-bar" class="top-navigation__top-bar">
      <div class="top-navigation__top-bar-wrapper">
        <div class="dropdown"><div class="drop-down"><div class="drop-down__wrapper">
          <button class="drop-down__label-wrapper" id="usta-sites-label" type="button" aria-expanded="false" aria-controls="usta-sites-list">
            <span class="drop-down__select-icon" aria-hidden="true"></span>
            <div class="drop-down__label"></div>
          </button>
          <div class="drop-down__select-list">
            <div class="drop-down__image">
              <img src="/img/redball/sites-icon.svg" alt="USTA" width="170" height="28">
              <div class="drop-down__slogan"></div>
            </div>
            <div class="drop-down__select-list-row" id="usta-sites-list"></div>
            <div class="drop-down__close" role="button" tabindex="0" aria-label="Close"></div>
          </div>
        </div></div></div>
        <div class="top-navigation__user-section--desktop"></div>
      </div>
    </div>
    <div class="top-navigation__main-bar">
      <div class="top-navigation__logo">
        <button class="top-navigation__logo-hamburger" type="button" aria-expanded="false" aria-controls="top-navigation-bar" aria-label="Open navigation">
          <img class="top-navigation__logo-hamburger--menu" src="/img/redball/hamburger-menu-white.svg" alt="" aria-hidden="true" width="24" height="24">
          <img class="top-navigation__logo-hamburger--cancel" src="/img/redball/cancel-bold-white.svg" alt="" aria-hidden="true" width="18" height="18">
        </button>
        <div class="top-navigation__logo-image"></div>
      </div>
      <nav class="top-navigation__navigation-menu navigation-menu" aria-label="Main menu"></nav>
    </div>
  </nav>
</div>
<div class="breadcrumb red-ball-colors">
  <div class="cmp-breadcrumb cmp-breadcrumb__wrapper">
    <nav aria-label="Breadcrumb"><ol class="cmp-breadcrumb__navigation"></ol></nav>
  </div>
</div>`;

/** Wrap an AUTHORED node in a generated wrapper that carries the layout class (EW2). */
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

/** #98 — unwrap the <p> the pipeline puts around a list item's trigger (live shape). */
function unwrapItemParagraphs(list) {
  list.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/** Drop whitespace-only text nodes so flex/inline slots don't get phantom items. */
function dropBlankText(el) {
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
  });
}

/** Off-origin links open in a new tab, as live. */
function externalTargets(list) {
  list.querySelectorAll('a[href]').forEach((a) => {
    try {
      if (new URL(a.href, window.location).origin !== window.location.origin) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
    } catch (e) { /* leave the link alone */ }
  });
}

const normalizePath = (p) => (p.replace(/\.html$/, '').replace(/\/+$/, '') || '/');

/* ---- slots ---- */

function slotBrand(root, section) {
  const slot = root.querySelector('.top-navigation__logo-image');
  if (!section) return;
  const media = [...section.querySelectorAll('picture, img')]
    .filter((el) => el.tagName === 'PICTURE' || !el.closest('picture'));
  if (!media.length) return;
  let link = section.querySelector('a');
  if (!link) {
    link = document.createElement('a');
    link.href = '/';
  }
  link.removeAttribute('title');
  const desktop = wrapNode(media[0], 'top-navigation__logo-image--desktop');
  link.append(desktop);
  if (media[1]) link.append(wrapNode(media[1], 'top-navigation__logo-image--mobile'));
  dropBlankText(link);
  slot.append(link);
}

function slotLinks(root, section) {
  const menu = root.querySelector('.navigation-menu');
  const list = section ? section.querySelector('ul') : null;
  if (!list) return;
  unwrapItemParagraphs(list);
  externalTargets(list);
  const here = normalizePath(window.location.pathname);
  list.querySelectorAll(':scope > li').forEach((li) => {
    dropBlankText(li);
    const a = li.querySelector(':scope > a[href]');
    if (!a) return;
    try {
      const url = new URL(a.href, window.location);
      // live marks PLAY on /play and HOST on /host — nothing on home
      if (url.origin === window.location.origin && here !== '/'
        && normalizePath(url.pathname) === here) {
        a.setAttribute('aria-current', 'page');
      }
    } catch (e) { /* not a URL */ }
  });
  menu.append(list);
}

function slotTools(root, section) {
  const dropdown = root.querySelector('.dropdown');
  if (!section) {
    dropdown.remove();
    return;
  }
  const paragraphs = [...section.querySelectorAll('p')].filter((p) => !p.querySelector('a, picture, img'));
  const list = section.querySelector('ul');
  const label = root.querySelector('.drop-down__label');
  const slogan = root.querySelector('.drop-down__slogan');
  const row = root.querySelector('.drop-down__select-list-row');
  if (paragraphs[0]) label.append(paragraphs[0]);
  if (paragraphs[1]) slogan.append(paragraphs[1]);
  if (list) {
    unwrapItemParagraphs(list);
    externalTargets(list);
    list.setAttribute('aria-labelledby', 'usta-sites-label');
    row.append(list);
  }
}

/** @ew-exempt generated trail — see the block JSDoc. */
function buildBreadcrumb(root) {
  const ol = root.querySelector('.cmp-breadcrumb__navigation');
  const here = normalizePath(window.location.pathname);
  const current = document.createElement('li');
  current.className = 'cmp-breadcrumb__navigation-item--active';
  if (here === '/' || here === '/index') {
    current.textContent = 'Home';
    ol.append(current);
    return;
  }
  const home = document.createElement('li');
  home.className = 'cmp-breadcrumb__navigation-item';
  const link = document.createElement('a');
  link.className = 'cmp-breadcrumb__navigation-item--inactive';
  link.href = '/';
  link.textContent = 'Home';
  const divider = document.createElement('span');
  divider.className = 'cmp-breadcrumb__navigation-item-divider';
  divider.textContent = '>';
  home.append(link, ' ', divider);
  const meta = getMetadata('breadcrumb');
  const title = (document.title || '').split(/\s+[|–—-]\s+/)[0].trim();
  const h1 = document.querySelector('main h1');
  current.textContent = meta || title || (h1 ? h1.textContent.trim() : '');
  ol.append(home, current);
}

/* ---- interaction ---- */

function wireDropdown(root) {
  const button = root.querySelector('.drop-down__label-wrapper');
  if (!button) return;
  const dropdown = root.querySelector('.drop-down');
  const close = root.querySelector('.drop-down__close');
  const setOpen = (open) => button.setAttribute('aria-expanded', open ? 'true' : 'false');
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  button.addEventListener('click', () => setOpen(!isOpen()));
  close.addEventListener('click', () => {
    setOpen(false);
    button.focus();
  });
  close.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      setOpen(false);
      button.focus();
    }
  });
  dropdown.addEventListener('focusout', (e) => {
    if (!dropdown.contains(e.relatedTarget)) setOpen(false);
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
}

function wireHamburger(root) {
  const burger = root.querySelector('.top-navigation__logo-hamburger');
  const topBar = root.querySelector('#top-navigation-bar');
  const mainBar = root.querySelector('.top-navigation__main-bar');
  const menu = root.querySelector('.navigation-menu');
  const nav = root.querySelector('.top-navigation');
  const icon = (name) => burger.querySelector(`.top-navigation__logo-hamburger--${name}`);
  const isOpen = () => burger.getAttribute('aria-expanded') === 'true';

  let setOpen;
  const closeOnEscape = (e) => {
    if (e.code === 'Escape' && isOpen()) {
      setOpen(false);
      burger.focus();
    }
  };
  const closeOnFocusLost = (e) => {
    if (!nav.contains(e.relatedTarget)) setOpen(false);
  };
  setOpen = (open) => {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    // the live state machine: classes on the utility bar (top .3s), inline display swaps
    topBar.classList.toggle('top-navigation__top-bar--opened', open);
    topBar.classList.toggle('top-to-bottom', open);
    menu.style.display = open ? 'block' : '';
    icon('menu').style.display = open ? 'none' : '';
    icon('cancel').style.display = open ? 'inline' : '';
    if (open) {
      window.addEventListener('keydown', closeOnEscape);
      nav.addEventListener('focusout', closeOnFocusLost);
    } else {
      window.removeEventListener('keydown', closeOnEscape);
      nav.removeEventListener('focusout', closeOnFocusLost);
    }
  };
  // ≤1369 the menu lives in the utility bar (the slide-down panel); ≥1370 in the main bar
  const place = () => {
    if (isDesktop.matches) {
      if (menu.parentElement !== mainBar) mainBar.append(menu);
      setOpen(false);
    } else if (menu.parentElement !== topBar) {
      topBar.append(menu);
    }
  };
  burger.addEventListener('click', () => setOpen(!isOpen()));
  place();
  isDesktop.addEventListener('change', place);
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const root = document.createElement('div');
  root.className = 'nav-wrapper';
  root.innerHTML = TEMPLATE;

  // skip empty sections (a metadata-only section leaves an empty <div> in the fragment and would shift the slot contract)
  const sections = fragment ? [...fragment.children].filter((sec) => sec.textContent.trim() || sec.querySelector('picture, img')) : [];
  slotBrand(root, sections[0]);
  slotLinks(root, sections[1]);
  slotTools(root, sections[2]);
  buildBreadcrumb(root);
  wireDropdown(root);
  wireHamburger(root);

  block.append(root);
}
