// stardust:migrate — Path A renderer for the redballtennis replica.
// Consumes the gated prototypes (stardust/prototypes/<slug>-proposed.html + page CSS + canon) and
// writes the self-contained bundle stardust/migrated/ per migrate/reference/{migration-procedure,
// asset-bundling, metadata-and-jsonld, content-preservation}.md and stardust/reference/
// migrate-output-format.md. Idempotent (sha skip) unless --force. Usage:
//   node stardust/scripts/migrate-replica.mjs [--force] [--pin-timestamp <ISO>] [slug ...]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const pinIdx = args.indexOf('--pin-timestamp');
const NOW = pinIdx >= 0 ? args[pinIdx + 1] : new Date().toISOString();
const only = args.filter((a, i) => !a.startsWith('--') && !(pinIdx >= 0 && i === pinIdx + 1));
const OUT = path.join(ROOT, 'stardust/migrated');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 7);
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const state = JSON.parse(read('stardust/state.json'));
const design = JSON.parse(read('DESIGN.json'));
const designMd = read('DESIGN.md');
const canon = { header: read('stardust/canon/header.html'), footer: read('stardust/canon/footer.html'), css: read('stardust/canon/canon.css'), fonts: read('stardust/canon/fonts.css'), js: exists('stardust/canon/chrome.js') ? read('stardust/canon/chrome.js') : '' };
const canonShas = { header: sha(canon.header), footer: sha(canon.footer), css: sha(canon.css) };
const dyn = exists('stardust/dynamic-features.md') ? read('stardust/dynamic-features.md') : '';

// Page map — re-homed EDS paths per MIGRATION-PLAN.md § 1 (decision recorded per page).
const PAGE_MAP = [
  { slug: 'home', sourceUrl: '/', aliases: ['/en/home.html', '/content/redballtennis/en/home.html'], outputPath: 'index.html' },
  { slug: 'play', sourceUrl: '/en/home/play.html', aliases: [], outputPath: 'play/index.html' },
  { slug: 'host', sourceUrl: '/en/home/host.html', aliases: [], outputPath: 'host/index.html' },
  { slug: '404', sourceUrl: '/en/home/404.html', aliases: [], outputPath: '404/index.html' },
];
const REDIRECT_TARGETS = { '/en/home/free-racquet-pack.html': '/', '/en/home/stay-current/national/USTA-awards-wheelchair-tennis-grants.html': '/' };
const ORIGIN = 'https://www.redballtennis.com';
const DEPLOY = (state.site.deployUrl || '').replace(/\/$/, '');
const inScope = state.pages.filter((p) => PAGE_MAP.some((m) => m.slug === p.slug) && (only.length ? only.includes(p.slug) : ['approved', 'migrated', 'prototyped'].includes(p.status)));

// Provenance validation (state-machine.md § Provenance validation)
for (const p of inScope) {
  const rec = JSON.parse(read(p.currentStatePath)); const pv = rec._provenance || {};
  const ok = pv.renderedBy === 'playwright' && Number.isInteger(pv.waitMs) && pv.waitMs > 0 && /^(fast|medium|spec|networkidle|domcontentloaded)(\(fallback\))?$/.test(pv.waitMode || '') && pv.httpStatus >= 200 && pv.httpStatus < 400 && !Number.isNaN(Date.parse(pv.fetchedAt));
  if (!ok) { console.error(`Page ${p.slug} lacks live-render evidence — re-extract with --refresh ${p.slug}`); process.exit(1); }
}
console.log(`Provenance OK on ${inScope.length} pages.`);

const bundled = new Set((state.migrate && state.migrate.bundledAssets) || []);
const missing = [];
const summary = { migrated: [], unchanged: [], failed: [], pages: [] };
const pageMapOut = PAGE_MAP.map(({ slug, sourceUrl, outputPath }) => ({ sourceUrl, outputPath, slug }));

function relPrefix(outputPath) { const depth = outputPath.split('/').length - 1; return depth === 0 ? './' : '../'.repeat(depth); }
function bundleAsset(ref, outputPath) {
  // ref: /stardust/current/assets/<subpath>  → copy to migrated/assets/<subpath>, return relative ref
  const m = ref.match(/^\/?stardust\/current\/assets\/(.+?)(\?.*)?$/); if (!m) return null;
  const sub = decodeURIComponent(m[1]); if (sub.includes('..')) return null;
  const src = path.join(ROOT, 'stardust/current/assets', sub); const dst = path.join(OUT, 'assets', sub);
  if (fs.existsSync(src)) { if (!fs.existsSync(dst)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); } bundled.add(sub); }
  else missing.push({ subpath: sub, referencedBy: [outputPath] });
  return `${relPrefix(outputPath)}assets/${sub}`;
}
function rewriteCssUrls(css, outputPath) { return css.replace(/url\(\s*(["']?)(\/stardust\/current\/assets\/[^"')]+)\1\s*\)/g, (all, q, u) => { const r = bundleAsset(u, outputPath); return r ? `url("${r}")` : all; }); }
function resolveInternal(href) {
  // returns { kind: 'internal', target: pageMap entry } | { kind:'redirect', to } | { kind:'external' } | { kind:'skip' }
  if (!href || /^(#|mailto:|tel:|javascript:)/.test(href)) return { kind: 'skip' };
  let u; try { u = new URL(href, ORIGIN); } catch { return { kind: 'skip' }; }
  if (u.origin !== ORIGIN) return { kind: 'external' };
  const p = u.pathname.replace(/\/$/, '') || '/';
  for (const m of PAGE_MAP) if (m.sourceUrl === p || m.aliases.includes(p)) return { kind: 'internal', target: m, hash: u.hash, search: u.search };
  if (REDIRECT_TARGETS[p]) { const t = PAGE_MAP.find((m) => m.sourceUrl === REDIRECT_TARGETS[p]); return { kind: 'internal', target: t, hash: u.hash, search: u.search, viaRedirect: p }; }
  return { kind: 'broken', path: p };
}
function rootTokens() {
  const t = design.extensions.canon.tokens;
  return `:root {\n  /* stardust token contract (token-contract.md) — values from DESIGN.md / DESIGN.json.extensions.canon.tokens */\n  --heading-font-family: ${t['--font-display']};\n  --body-font-family: ${t['--font-body']};\n  --heading-xxl: 100px; --heading-xl: 76px; --heading-lg: 56px; --heading-md: 36px;\n  --body: 32px; --body-sm: 16px;\n  --line-height-heading: 1.1; --line-height-body: 1.42857;\n  --color-bg: ${t['--color-paper']}; --color-fg: ${t['--color-ink']}; --color-accent: ${t['--color-red']};\n  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 40px; --spacing-2xl: 60px;\n  --section-padding: 40px; --max-width: 1440px; --radius: 9999px;\n}\n`;
}
function jsonLd(page, meta, outputPath) {
  const url = DEPLOY ? `${DEPLOY}/${outputPath.replace(/index\.html$/, '')}`.replace(/\/$/, '') || DEPLOY : `${ORIGIN}${PAGE_MAP.find((m) => m.slug === page.slug).sourceUrl}`;
  const org = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Red Ball Tennis (USTA)', url: DEPLOY || ORIGIN, logo: `${DEPLOY || ORIGIN}/assets/media/red-ball-tennis-wbg-04927f.png`, parentOrganization: { '@type': 'Organization', name: 'United States Tennis Association', url: 'https://www.usta.com/' } };
  const out = [org];
  if (page.type === 'landing') out.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Red Ball Tennis', url: DEPLOY || ORIGIN, description: meta.description });
  if (page.type === 'program') out.push({ '@context': 'https://schema.org', '@type': 'Service', name: meta.title === 'Play' ? 'Play Red Ball Tennis' : 'Host Red Ball Tennis', provider: { '@type': 'Organization', name: 'United States Tennis Association' }, description: meta.description, url });
  return out;
}

const browser = await chromium.launch();
for (const page of inScope) {
  const map = PAGE_MAP.find((m) => m.slug === page.slug);
  const protoPath = `stardust/prototypes/${page.slug}-proposed.html`;
  if (!exists(protoPath)) { summary.failed.push(`${page.slug} (no prototype)`); continue; }
  const proto = read(protoPath); const cssPath = `stardust/prototypes/${page.slug}.css`; const pageCss = exists(cssPath) ? read(cssPath) : '';
  const current = read(page.currentStatePath);
  const shas = { designMd: sha(designMd), designJson: sha(JSON.stringify(design)), sourceCurrent: sha(current), sourceProposed: sha(proto + pageCss), ...canonShas };
  const outFile = path.join(OUT, map.outputPath); const metaFile = path.join(path.dirname(outFile), '_meta.json');
  if (!FORCE && fs.existsSync(outFile) && fs.existsSync(metaFile)) {
    const prev = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    if (prev.designMdSha === shas.designMd && prev.designJsonSha === shas.designJson && prev.sourceCurrentSha === shas.sourceCurrent && prev.sourceProposedSha === shas.sourceProposed && JSON.stringify(prev.canonShas) === JSON.stringify(canonShas)) { summary.unchanged.push(page.slug); for (const a of (prev.bundledAssetList || [])) bundled.add(a); summary.pages.push({ slug: page.slug, file: path.relative(ROOT, outFile), assetsBundled: prev.assetsBundled }); continue; }
  }
  const rec = JSON.parse(current);
  const ctx = await browser.newContext(); const pg = await ctx.newPage();
  await pg.setContent(proto, { waitUntil: 'domcontentloaded' });
  const decisions = [{ kind: 'path-rehome', from: PAGE_MAP.find((m) => m.slug === page.slug).sourceUrl === '/' ? '/en/home.html' : map.sourceUrl, to: map.outputPath, reason: 'MIGRATION-PLAN.md § 1 URL map: short EDS paths; source paths kept alive via stardust/redirects.tsv' }];
  const deviations = [];
  // dynamic dependencies touching this page (content-preservation.md § Dynamic dependencies)
  const rows = [['f-signup-form', /v-lead-generation|signup-form|JOIN THE FUN/], ['f-host-interest-form', /Interested in hosting/], ['v-video-youtube', /youtube\.com\/embed/], ['m-usta-sites-dropdown', /drop-down__label-wrapper/], ['m-mobile-nav', /top-navigation__logo-hamburger/], ['t-analytics-stack', /./], ['t-consent-onetrust', /./]];
  for (const [id, re] of rows) if (re.test(proto) && dyn.includes(id)) { const line = dyn.split('\n').find((l) => l.includes(`| ${id} |`)) || ''; const cells = line.split('|').map((s) => s.trim()); deviations.push({ kind: 'dynamic-dependency', row: id, class: cells[4] || '', disposition: cells[6] || '', reproducibility: cells[7] || '', status: cells[8] || '', note: id.startsWith('t-') ? 'tags dropped from static output; re-wired at rollout D2 (disabled by default)' : 'markup preserved; behaviour delivered by the EDS block per dynamic-features-plan.md' }); }
  const result = await pg.evaluate(({ slug, type, outputPath, prefix, mapJson, redirectJson, origin }) => {
    const PAGE_MAP = JSON.parse(mapJson); const REDIR = JSON.parse(redirectJson); const report = { assets: new Set(), broken: [], internal: 0, external: 0, counts: {} };
    const rewriteRef = (v) => { const m = v.match(/^\/?stardust\/current\/assets\/(.+?)(\?.*)?$/); if (!m) return null; report.assets.add(decodeURIComponent(m[1])); return `${prefix}assets/${m[1]}`; };
    // template + section attributes
    const main = document.querySelector('main'); if (main) { main.setAttribute('data-template', type); if (!main.hasAttribute('data-section')) {} }
    document.querySelectorAll('main section').forEach((s, i) => { if (!s.getAttribute('data-section')) s.setAttribute('data-section', (s.className.split(' ').find((c) => c.startsWith('band--')) || `section-${i + 1}`).replace('band--', '')); if (!s.getAttribute('data-intent')) s.setAttribute('data-intent', 'preserve source section'); if (!s.getAttribute('data-layout')) s.setAttribute('data-layout', 'full-bleed'); });
    const hdr = document.querySelector('header'); if (hdr) hdr.setAttribute('data-canon', ''); const ftr = document.querySelector('footer'); if (ftr) ftr.setAttribute('data-canon', '');
    // assets: src / href(icon) / srcset / inline style
    document.querySelectorAll('[src]').forEach((el) => { const r = rewriteRef(el.getAttribute('src')); if (r) el.setAttribute('src', r); });
    document.querySelectorAll('[srcset]').forEach((el) => { el.setAttribute('srcset', el.getAttribute('srcset').split(',').map((e) => { const [u, d] = e.trim().split(/\s+/); const r = rewriteRef(u); return [r || u, d].filter(Boolean).join(' '); }).join(', ')); });
    document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((el) => { const r = rewriteRef(el.getAttribute('href')); if (r) el.setAttribute('href', r); });
    document.querySelectorAll('[style*="url("]').forEach((el) => { el.setAttribute('style', el.getAttribute('style').replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (a, q, u) => { const r = rewriteRef(u); return r ? `url("${r}")` : a; })); });
    // links
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href'); if (!href || /^(#|mailto:|tel:|javascript:)/.test(href) || href === '') return;
      let u; try { u = new URL(href, origin); } catch { return; }
      if (u.origin !== origin) { report.external++; return; }
      let p = u.pathname.replace(/\/$/, '') || '/'; if (REDIR[p]) p = REDIR[p];
      const t = PAGE_MAP.find((m) => m.sourceUrl === p || (m.aliases || []).includes(p));
      if (t) { a.setAttribute('href', `${prefix}${t.outputPath}${u.search}${u.hash}`); report.internal++; }
      else { a.setAttribute('data-broken-link', 'true'); report.broken.push(p); }
    });
    // content counts (role-classified, vs captured JSON later)
    const m = document.querySelector('main');
    report.counts = { headings: m.querySelectorAll('h1,h2,h3,h4,h5,h6').length, ctas: m.querySelectorAll('a, button').length, imgs: m.querySelectorAll('img').length, h1: document.querySelectorAll('h1').length, sections: m.querySelectorAll('section').length };
    report.title = document.title; report.description = (document.querySelector('meta[name="description"]') || {}).content || '';
    // strip HTML comments from the body (canon header.html carries an authoring note with sample hrefs that the pagemap audit would read as links)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT); const comments = []; while (walker.nextNode()) comments.push(walker.currentNode); comments.forEach((c) => c.remove());
    // strip external stylesheet links (they get inlined) and the chrome script (inlined)
    document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => l.remove()); document.querySelectorAll('script[src*="chrome.js"]').forEach((s) => s.remove());
    return { ...report, assets: [...report.assets], html: document.documentElement.outerHTML };
  }, { slug: page.slug, type: page.type, outputPath: map.outputPath, prefix: relPrefix(map.outputPath), mapJson: JSON.stringify(PAGE_MAP), redirectJson: JSON.stringify(REDIRECT_TARGETS), origin: ORIGIN });
  await ctx.close();
  // bundle the assets the DOM referenced + those referenced from CSS
  for (const sub of result.assets) bundleAsset(`/stardust/current/assets/${sub}`, map.outputPath);
  const css = [rootTokens(), '/* canon fonts */', rewriteCssUrls(canon.fonts, map.outputPath), '/* canon */', rewriteCssUrls(canon.css, map.outputPath), `/* page: ${page.slug} */`, rewriteCssUrls(pageCss, map.outputPath)].join('\n');
  // content-count acceptance vs captured record
  const cap = { headings: (rec.headings || []).length, imgs: (rec.media && rec.media.imgs || []).filter((i) => !/Hamburger|Cancel_Bold|Sites%20Icon|red-ball-tennis-wbg|red-ball-logo-mob/.test(i.src || '')).length };
  const drop = []; if (result.counts.headings < cap.headings) drop.push(`headings ${result.counts.headings} < ${cap.headings}`);
  if (result.counts.h1 !== (page.slug === '404' ? 0 : 1)) drop.push(`h1 count ${result.counts.h1}`);
  const gates = ['provenance', 'placeholder-gate', 'mobile-adapt']; if (!drop.length) gates.push('content-count'); else { summary.failed.push(`${page.slug} (content-count: ${drop.join('; ')})`); continue; }
  // head composition
  const canonical = DEPLOY ? `${DEPLOY}/${map.outputPath.replace(/index\.html$/, '')}` : `${ORIGIN}${map.sourceUrl}`;
  const prov = `<!-- stardust:migrate\n  writtenBy:        stardust:migrate\n  writtenAt:        ${NOW}\n  page:             ${page.slug}\n  slug:             ${page.slug}\n  pagePath:         migrated/${map.outputPath}\n  renderBranch:     A\n  fidelityTier:     archetype\n  sourceProposed:   ${protoPath}\n  sourceCurrent:    ${page.currentStatePath}\n  againstDirection: stardust/direction.md (preserve mode ${state.direction.resolvedAt})\n  designMd:         DESIGN.md (sha: ${shas.designMd})\n  designJson:       DESIGN.json (sha: ${shas.designJson})\n  canonShas:        header:${canonShas.header} footer:${canonShas.footer} css:${canonShas.css}\n  decisionTrace:    _meta.json\n  brokenInternalLinks: ${result.broken.length}\n  stardustVersion:  0.21.1\n-->`;
  const ld = jsonLd(page, { title: result.title, description: result.description }, map.outputPath).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  let html = result.html.replace(/<head>/, `<head>\n${prov}`);
  html = html.replace(/<\/head>/, `<link rel="canonical" href="${canonical}">\n<meta property="og:title" content="${result.title.replace(/"/g, '&quot;')}">\n<meta property="og:description" content="${result.description.replace(/"/g, '&quot;')}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Red Ball Tennis">\n<meta property="og:url" content="${canonical}">\n<meta name="theme-color" content="#0A2396">\n<meta name="robots" content="index,follow">\n<link rel="apple-touch-icon" href="${bundleAsset('/stardust/current/assets/media/rbt-favicon-180x180-d1914d.png', map.outputPath)}">\n<style>\n${css}\n</style>\n${ld}\n</head>`);
  if (canon.js) html = html.replace(/<\/body>/, `<script>\n${canon.js}\n</script>\n</body>`);
  html = `<!doctype html>\n${html}`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true }); fs.writeFileSync(outFile, html);
  const prog = exists(`stardust/replica/progress.${page.slug}.json`) ? JSON.parse(read(`stardust/replica/progress.${page.slug}.json`)) : null;
  const modules = (design.extensions.modules || []).filter((m) => (m.instances || []).includes(page.slug)).map((m) => m.id);
  const meta = { slug: page.slug, type: page.type, renderBranch: 'A', fidelityTier: 'archetype', archetypeSource: page.slug, template: null, modules, slotsFilled: [], canonShas, deviations: [], migrationDecisions: decisions, contentDeviations: deviations, gatesPassed: gates, sourceFidelityGate: prog ? { breakpoints: Object.fromEntries(Object.entries(prog.breakpoints || {}).map(([w, b]) => [w, b.result])), motion: prog.motion || null } : null, metadata: { title: result.title, description: result.description, canonical }, jsonLd: jsonLd(page, { title: result.title, description: result.description }, map.outputPath), brokenInternalLinks: result.broken, migratedAt: NOW, designMdSha: shas.designMd, designJsonSha: shas.designJson, sourceCurrentSha: shas.sourceCurrent, sourceProposedSha: shas.sourceProposed, assetsBundled: new Set([...result.assets]).size, bundledAssetList: [...new Set(result.assets)], outputPath: map.outputPath, sourceUrl: map.sourceUrl };
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
  summary.migrated.push(page.slug); summary.pages.push({ slug: page.slug, file: path.relative(ROOT, outFile), assetsBundled: meta.assetsBundled });
  page.status = 'migrated'; page.history.push({ status: 'migrated', at: NOW }); page.stale = false; page.migratedPath = path.relative(ROOT, outFile); page.fidelityTier = 'archetype'; page.gatesPassed = gates;
  console.log(`migrated ${page.slug} → ${map.outputPath} (assets ${meta.assetsBundled}, internal links ${result.internal}, external ${result.external}, broken ${result.broken.length}${result.broken.length ? ': ' + result.broken.join(', ') : ''})`);
}
await browser.close();
// sitewide: logo, robots, sitemap
bundleAsset('/stardust/current/assets/media/red-ball-tennis-wbg-04927f.png', 'index.html'); bundleAsset('/stardust/current/assets/favicon.ico', 'index.html');
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${DEPLOY || ORIGIN}/sitemap.xml\n`);
const prio = { landing: '1.0', program: '0.7', static: '0.7', unique: '0.3' };
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGE_MAP.filter((m) => m.slug !== '404').map((m) => { const p = state.pages.find((x) => x.slug === m.slug); return `  <url><loc>${DEPLOY || ORIGIN}/${m.outputPath.replace(/index\.html$/, '')}</loc><lastmod>${NOW.slice(0, 10)}</lastmod><priority>${prio[p.type] || '0.5'}</priority></url>`; }).join('\n')}\n</urlset>\n`);
// state
state.migrate = { at: NOW, outputDir: 'stardust/migrated/', selfContained: true, pageMap: pageMapOut, totalAssetsBundled: bundled.size, bundledAssets: [...bundled].sort(), pages: summary.pages, missingAssets: missing, cleanedAssets: [] };
state._provenance.writtenBy = 'stardust:migrate'; state._provenance.writtenAt = NOW;
fs.writeFileSync(path.join(ROOT, 'stardust/state.json'), JSON.stringify(state, null, 2));
fs.appendFileSync(path.join(ROOT, 'stardust/status.jsonl'), JSON.stringify({ ts: NOW, skill: 'stardust:migrate', phase: 'render', event: 'end', detail: `${summary.migrated.length} migrated, ${summary.unchanged.length} unchanged, ${summary.failed.length} failed`, artifact: 'stardust/migrated/' }) + '\n');
console.log(`\nmigrate complete\n================\n ${summary.migrated.length} migrated   ${summary.migrated.join(', ')}\n ${summary.unchanged.length} unchanged  ${summary.unchanged.join(', ')}\n ${summary.failed.length} failed     ${summary.failed.join('; ')}\nAssets bundled: ${bundled.size}; missing: ${missing.length}\nOutput: stardust/migrated/`);
if (summary.failed.length) process.exit(2);
