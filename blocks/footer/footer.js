/**
 * footer — the redballtennis.com footer experience fragment (#092396 band),
 * template-slotted (deploy Step 6 / #95) from the authored /footer document.
 *
 * /footer document contract (default content only, three sections):
 *   1. logo  — <p><a href="/"><img …red-ball-tennis-wbg.png></a></p> (100px wide, as live)
 *   2. links — <ul> of legal links (Terms & Conditions, Privacy Policy — external usta.com)
 *   3. tag   — <p><strong>#redballtennis</strong></p> (mobile-only line, hidden ≥1024 as live)
 *
 * Decode (#98): the pipeline may wrap each <li>'s link in <p> on live; both shapes are
 * normalised by unwrapping `li > p`.
 *
 * Experience Workspace (EW1/EW2): the authored <a>+<picture>, <ul> and <p> are MOVED into
 * the template slots; wrappers carry the live class names, authored elements carry none.
 * The live inner `div.footer` is emitted as `div.footer-main` — `.footer` is the block's own
 * root class and the boilerplate's `footer .footer { visibility: hidden }` would hide it.
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const TEMPLATE = `
<div class="separator separator--mobile"><hr></div>
<div class="footer-logo"><div class="cmp-image"></div></div>
<div class="footer-main">
  <div class="footer-links">
    <nav aria-label="RedBallTennis footer links"></nav>
    <nav aria-label="Social media links"><ul class="footer-links__social"></ul></nav>
  </div>
</div>
<div class="separator separator--mobile"><hr></div>
<div class="footer-tag"><div class="cmp-text"></div></div>
<div class="separator"><hr></div>`;

function dropBlankText(el) {
  [...el.childNodes].forEach((n) => {
    if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
  });
}

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

function slotLogo(root, section) {
  const slot = root.querySelector('.footer-logo .cmp-image');
  if (!section) return;
  const media = section.querySelector('picture, img');
  if (!media) return;
  let link = section.querySelector('a');
  if (!link) {
    link = document.createElement('a');
    link.href = '/';
  }
  link.removeAttribute('title');
  link.append(media);
  dropBlankText(link);
  slot.append(link);
}

function slotLinks(root, section) {
  const nav = root.querySelector('.footer-links nav');
  const list = section ? section.querySelector('ul') : null;
  if (!list) return;
  list.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
  externalTargets(list);
  nav.append(list);
}

function slotTag(root, section) {
  const tag = root.querySelector('.footer-tag');
  const paragraph = section ? section.querySelector('p') : null;
  if (!paragraph) {
    tag.previousElementSibling.remove();
    tag.remove();
    return;
  }
  tag.querySelector('.cmp-text').append(paragraph);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const root = document.createElement('div');
  root.className = 'footer-xf';
  root.innerHTML = TEMPLATE;

  // skip empty sections (a metadata-only section leaves an empty <div> in the fragment and would shift the slot contract)
  const sections = fragment ? [...fragment.children].filter((sec) => sec.textContent.trim() || sec.querySelector('picture, img')) : [];
  slotLogo(root, sections[0]);
  slotLinks(root, sections[1]);
  slotTag(root, sections[2]);

  block.append(root);
}
