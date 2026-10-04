/**
 * cards — the framed-photo prop cards on the blue-balls ground (variant `props`; `props host`
 * for the host page's two wider cards). Reconstructive (#95): one authored row per card,
 * classified by content and MOVED into the card layout (EW1). The block paints nothing behind
 * itself — the photo ground is the SECTION style `blue-balls`.
 *
 * Schemas: stardust/eds-schema/home.json §play-host, host.json §play.
 *
 * Authoring rows (one row per card, one cell — component-model shape "container"):
 *   <img> (content.da.live URL, alt as live) · copy <p> · optional CTA `<p><em><a>` (white pill)
 * Host adds its footnote <p> + `<p><em><a>HOST WITH THE MOST</a></em></p>` as DEFAULT CONTENT
 * after the block in the same section; the CSS lays them out via `.cards-container`.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const inner = document.createElement('div');
  inner.className = 'cards-inner';
  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  inner.append(grid);

  rows.forEach((row) => {
    const card = document.createElement('article');
    card.className = 'card';
    // capture everything before moving (EW1)
    const cells = [...row.children];
    const imgs = [];
    const ctas = [];
    const texts = [];
    cells.forEach((cell) => {
      [...cell.children].forEach((el) => {
        if (el.matches('img, picture') || el.querySelector('img, picture')) imgs.push(el);
        else if (el.querySelector('a.button, a[href]')) ctas.push(el);
        else texts.push(el);
      });
    });
    imgs.forEach((n) => card.append(wrapNode(n, 'card-image')));
    if (texts.length) {
      const t = document.createElement('div');
      t.className = 'card-text';
      t.append(...texts);
      card.append(t);
    }
    if (ctas.length) {
      const a = document.createElement('div');
      a.className = 'card-cta';
      a.append(...ctas);
      card.append(a);
    }
    grid.append(card);
  });

  block.replaceChildren(inner);
}
