/**
 * embed — a full-width video embed band (play: the 1500×900 YouTube frame between the promo
 * band and HOW TO PLAY). One cell holding the embed URL as a link; decorate() renders the
 * iframe from its href. The runtime's buildAutoBlocks() (scripts.js) is owner-locked, so the
 * URL rides this one-cell block instead of an auto-block (D1 exception recorded in the log).
 *
 * Schema: stardust/eds-schema/play.json §video.
 *
 * Authoring rows: 1. `<p><a href="https://www.youtube.com/embed/…">…</a></p>`
 *
 * @ew-exempt <a> embed link — embed source, rendered as the iframe (text-as-metadata)
 */

function embedSrc(href) {
  try {
    const u = new URL(href);
    if (u.hostname.endsWith('youtube.com') && u.pathname === '/watch' && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed${u.pathname}`;
    return href;
  } catch (e) {
    return href;
  }
}

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const source = document.createElement('div');
  source.className = 'embed-source';
  source.append(link.closest('p') || link);

  const frame = document.createElement('iframe');
  frame.src = embedSrc(link.href);
  frame.width = '1500';
  frame.height = '900';
  frame.title = link.title || 'Video';
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  frame.setAttribute('allowfullscreen', '');
  frame.loading = 'lazy';

  const wrap = document.createElement('div');
  wrap.className = 'embed-frame';
  wrap.append(frame);
  const spacer = document.createElement('div');
  spacer.className = 'embed-spacer';

  block.replaceChildren(wrap, spacer, source);
}
