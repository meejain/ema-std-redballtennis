/**
 * hero — the split page lead: copy column + media column, closed by the section's red stripe.
 * Template-slotted (#95): the prototype's inner DOM is held as a fixed skeleton and the
 * authored elements are MOVED into role slots (EW1). Variants by class:
 *   - `hero video` (home)  media = the YouTube link → iframe over the red-lines vector
 *                          (fixed CSS asset /img/redball/vector-background-red.svg, 9b)
 *   - `hero prop`  (play)  media = fixed CSS photo /img/redball/rbt-play-v1.jpg (desktop column
 *                          + mobile strip), copy column only is authored
 *   - `hero photo` (host)  media = authored editorial <img> (cover layer); a second authored
 *                          <img> in the copy cell is the ≤767px inline photo
 *
 * Schemas: stardust/eds-schema/home.json §hero, play.json §hero, host.json §hero.
 *
 * Authoring rows (positional, one cell each — component-model shape "simple"):
 *   1. copy — h1 (`<em>` inside = brand-red run), optional sub-head
 *      `<p><strong><em>RED</em>RAW THE LINES</strong></p>`, optional inline <img> (mobile /
 *      hand photo), one or more lede <p>
 *   2. media (optional) — <img> (photo variant)
 *   The `video` variant's YouTube URL is NOT a block row: it is a plain link in DEFAULT CONTENT
 *   right after the block in the same section (D1); decorate() reabsorbs it (EW8) — the link's <p>
 *   moves into the media slot, the iframe renders from its href, the emptied wrapper is removed.
 *
 * @ew-exempt <a> YouTube link (default content after the block) — embed source, rendered as the
 *   iframe (text-as-metadata)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const TEMPLATE = `
<div class="hero-grid">
  <div class="hero-copy"><div class="hero-copy-inner"><div class="hero-copy-grid">
    <div class="hero-text">
      <div class="hero-title"></div>
      <div class="hero-sub"></div>
      <div class="hero-photo-mobile"><div class="hero-photo-mobile-inner"></div></div>
    </div>
    <div class="hero-inline-media"><div class="hero-inline-media-inner"></div></div>
    <div class="hero-rule"><hr></div>
    <div class="hero-lede"></div>
  </div></div></div>
  <div class="hero-red-rule"><hr></div>
  <div class="hero-media"><div class="hero-media-inner">
    <div class="hero-media-content"></div>
    <div class="hero-media-spacer"></div>
  </div></div>
</div>`;

function mediaNode(img) {
  return img.closest('p') || img.closest('picture') || img;
}

function embedFrame(link) {
  const frame = document.createElement('iframe');
  frame.src = link.href;
  frame.width = '560';
  frame.height = '315';
  frame.title = link.title || 'Video';
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  frame.setAttribute('allowfullscreen', '');
  return frame;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const [copyRow, mediaRow] = rows;
  const copy = copyRow.firstElementChild || copyRow;
  const media = mediaRow ? (mediaRow.firstElementChild || mediaRow) : null;

  // 1. QUERY + CAPTURE before moving anything (#42, EW1)
  const heading = copy.querySelector('h1, h2, h3');
  const inlineImgs = [...copy.querySelectorAll('img')].map(mediaNode);
  const ps = [...copy.querySelectorAll('p')].filter((p) => !p.querySelector('img, picture'));
  const sub = ps.find((p) => p.querySelector('strong, b') && !p.querySelector('a'));
  const ledes = ps.filter((p) => p !== sub);
  let mediaLink = media ? media.querySelector('a[href]') : null;
  // reabsorb a lone embed link authored as default content right after the block (EW8)
  const next = block.parentElement ? block.parentElement.nextElementSibling : null;
  if (!mediaLink && next && next.matches('.default-content-wrapper')) {
    const a = next.querySelector(
      'a[href*="youtube.com/embed/"], a[href*="youtube.com/watch"], a[href*="youtu.be/"]',
    );
    const p = a ? a.closest('p') : null;
    const lone = p && next.children.length === 1 && p.textContent.trim() === a.textContent.trim();
    if (lone) mediaLink = a;
  }
  const mediaImgs = media ? [...media.querySelectorAll('img')].map(mediaNode) : [];

  // 2. CREATE the skeleton
  const tpl = document.createElement('template');
  tpl.innerHTML = TEMPLATE.trim();
  const root = tpl.content.firstElementChild;
  const slot = (c) => root.querySelector(`.${c}`);

  // 3. MOVE the authored nodes
  if (heading) slot('hero-title').append(heading);
  if (sub) slot('hero-sub').append(sub);
  inlineImgs.forEach((n) => slot('hero-inline-media-inner').append(n));
  ledes.forEach((p) => slot('hero-lede').append(wrapNode(p, 'lede-p')));
  const content = slot('hero-media-content');
  if (mediaLink) {
    const embed = document.createElement('div');
    embed.className = 'hero-embed';
    const src = document.createElement('div');
    src.className = 'hero-embed-source';
    src.append(mediaLink.closest('p') || mediaLink);
    embed.append(embedFrame(mediaLink), src);
    content.append(embed);
    if (next && next.matches('.default-content-wrapper') && !next.children.length) next.remove();
  }
  mediaImgs.forEach((n) => content.append(n));

  // LCP: the first authored image is the hero's, load it eagerly
  const first = root.querySelector('img');
  if (first) {
    first.loading = 'eager';
    first.setAttribute('fetchpriority', 'high');
  }

  // 4. the emptied rows go; the authored nodes already moved
  block.replaceChildren(root);
}
