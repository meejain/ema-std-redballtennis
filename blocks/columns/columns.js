/**
 * columns — icon + copy units. Reconstructive (#95): one authored row per unit, cells
 * `icon <img>` | `heading + lines`, MOVED into the unit layout (EW1). Variants by class:
 *   - `columns icons-dark`  (play HOW TO PLAY / HOW TO SCORE) — white-ring icon over an h2 and
 *      bold lines, two 1/2 units on the SECTION style `blue-balls`
 *   - `columns icons-light` (play WHAT YOU NEED TO PLAY) — two 5/12 units of icon + h3 + caption;
 *      the section head (h2) and the WHERE TO PLAY prose after it are default content styled
 *      through `.columns-container` (no reabsorption, the head sits outside the grid)
 *
 * Schemas: stardust/eds-schema/play.json §howto, §need.
 *
 * Authoring rows (one row per unit, two cells — component-model shape "container"):
 *   1. <img> (content.da.live URL, alt as live)
 *   2. h2 (icons-dark) | h3 (icons-light), then one <p> per line (`<strong>` for the bold lines)
 */

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  block.classList.add(`columns-${rows[0].children.length}-cols`);

  const inner = document.createElement('div');
  inner.className = 'columns-inner';
  const content = document.createElement('div');
  content.className = 'columns-content';
  inner.append(content);

  rows.forEach((row) => {
    const col = document.createElement('div');
    col.className = 'col';
    const colInner = document.createElement('div');
    colInner.className = 'col-inner';
    const grid = document.createElement('div');
    grid.className = 'col-grid';
    colInner.append(grid);
    col.append(colInner);

    const cells = [...row.children];
    cells.forEach((cell) => {
      const nodes = [...cell.children];
      const isIcon = nodes.length > 0 && nodes.every((n) => n.matches('img, picture') || n.querySelector('img, picture'));
      const w = document.createElement('div');
      if (isIcon) {
        w.className = 'col-icon';
        const box = document.createElement('div');
        box.className = 'col-icon-box';
        box.append(...nodes);
        w.append(box);
      } else {
        w.className = 'col-text';
        w.append(...nodes);
      }
      grid.append(w);
    });
    content.append(col);
  });

  block.replaceChildren(inner);
}
