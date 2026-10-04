# EDS conversion log — redballtennis.com replica (foundation + chrome)

Running history of "why does this look the way it does". This entry covers Step 3–6 of the
deploy methodology (foundation, fonts, buttons, chrome) for the same-design replica of
https://www.redballtennis.com/. Runtime: vanilla adobe/aem-boilerplate
(`stardust/runtime-contract.json`). Nothing was deployed, committed or pushed from this pass.

## Decisions locked

| Topic | Decision |
|---|---|
| Chrome blocks | `blocks/header` + `blocks/footer`, **template-slotted** (#95): `decorate()` holds the live DOM from `stardust/canon/header.html` / `footer.html` (live BEM class names kept so `canon.css` ports 1:1) and MOVES the authored nodes of `/nav` and `/footer` into fixed role slots (EW1). No reconstructive parsing (anti-pattern 5). |
| `/nav` contract | 3 default-content sections: (1) brand `<p><a href="/"><img desktop><img mobile></a></p>`; (2) nav `<ul>` HOME `/`, PLAY `/play`, HOST `/host`, plus a link-less `VISIT OUR OTHER SITES` item with the nested `<ul>` of 8 external USTA sites (mobile-only row, as live); (3) tools `<p>USTA SITES</p>` (pill label) + `<p>VISIT OUR OTHER SITES</p>` (dropdown slogan — added so `decorate()` adds no words, #100) + the same 8 links as a `<ul>`. |
| `/footer` contract | (1) `<p><a href="/"><img wbg></a></p>` logo (100px wide); (2) `<ul>` Terms & Conditions / Privacy Policy (usta.com, fully qualified); (3) `<p><strong>#redballtennis</strong></p>` (mobile-only tag). Authored as `<strong>` — DA/the pipeline emit `<strong>` for bold regardless (live has `<b>`; chrome-parity reports the tag diff, unavoidable). |
| Nav decode (#98) | `li > p` unwrapped on both lists (live delivers `<li><p><a>`); the harness mocks are written in the live shape to exercise it. |
| Active link | `aria-current="page"` (attribute, EW2 forbids classes on authored elements) on the nav `<a>` whose normalised pathname equals `location.pathname`; skipped on `/` (live marks PLAY/HOST only, nothing on home/404). Styled as the live `.active` 4px white underline. |
| Breadcrumb | Generated trail (`@ew-exempt` in the header JSDoc): `Home` on `/`; elsewhere `Home > <label>` where label = `getMetadata('breadcrumb')` ‖ `document.title` before the first ` | / – / — / - ` separator ‖ `<h1>`. Page agents can author `breadcrumb: Play` in the metadata block when the SEO title is not the nav title. Allowlisted generated strings: "Home", ">". |
| Dropdown label in a `<button>` | The live pill is a `<button>`; the authored `<p>USTA SITES</p>` is moved into it (EW1 satisfied, EW7 caveat noted). Chrome is not edited in place through the header block — `/nav` opens as its own document in the canvas — so the button host is accepted for live fidelity (chrome-parity pairs the clickable box). |
| Footer inner class | Live `div.footer` is emitted as `div.footer-main`: `.footer` is the block root and the boilerplate's `footer .footer { visibility: hidden }` would hide an inner `.footer` forever. |
| Breakpoint | The live mobile chrome switch is **1369px** (not 767): `isDesktop = (min-width: 1370px)`, `--nav-height` 195px → 74px at `(width <= 1369px)`, header/footer CSS mirror canon's `@media (max-width: 1369px)` / footer 1023px / type 767px. |
| Reservation (#81) | `--nav-height: 195px` (60 utility + 105 main + 30 breadcrumb) / `74px` ≤1369 (44 + 30); `header { background: #0a2396 }` so the reserve is invisible. Position/z-index live on the block's `.top-navigation` (z-index 1030) — the mobile panel is absolutely positioned inside it. Footer: no reservation. |
| Section scaffold | Full-bleed bands (`main > .section { margin: 0 }`, `main > .section > div { max-width: none; padding: 0 }`) — the live AEM grid is percentage-of-viewport; blocks own their inner geometry. Default content gets the live leaf-column padding `8px 15px` (`8px 4px` ≤767). `main .section:empty { display: none }`. |
| Section `style` set (D1) | `red-stripe` (16px red rule at bottom 8px, padding-bottom 8px), `promo` (padding 32/64, centred blue 76px h2 + bold sub-line + one pill filling the 2/12 column — matches live to the pixel at 1440 and 360), `blue-balls` (`/img/redball/host-play-bg.jpg` cover, white text), `centered`, `form-band` (black CTAs). One value per section (#120). |
| Buttons | Boilerplate selectors restyled to the live `.button-core` pill: Graphik Semibold 18/20 uppercase, height 56, **padding 14px** (the lifted live value — `lift-home-1440.json`; the brief's "14px 32px" was not what live computes), border 2px transparent, radius 9999, min-width 120 ≥768, `width:100%; max-width:280px` ≤767, hover/active opacity .7. Unclassed base = live default (black/white); `.primary` blue/white; `.secondary` white/black; `.accent` red/white. **Letter-spacing 0** on the anchor: live puts 1px on the pill but 0 on the inner label span, and the rendered "Shop Now" label measures 100.594px both live and in the harness with 0 tracking (108.6 with 1px). |
| Black variant | Two mechanisms: (a) unclassed `a.button` / `button.button` is already black (live default); (b) section context `main .section.form-band :is(a.button, button.button)` forces black whatever emphasis the author used. Blocks may add `.<block> a.button { background: #000 }` (404). |
| Fonts | Brand faces already shipped (`styles/fonts.css`, `fonts/*.woff2`, licensing banner at the top of `styles.css`, `fonts/LICENSING.md`). Metric-matched fallbacks in `styles.css`: `graphik-fallback` (local Arial, size-adjust **101.99%**), `graphik-semibold-fallback` (local Arial, **101.65%**), `graphik-xxcond-fallback` (local "Arial Narrow", **65.18%**) — size-adjust from MEASURED rendered widths (headless Chromium, brand face ÷ local face, `qa/fontprobe.mjs`), ascent/descent/line-gap from the woff2 `hhea` table ÷ size-adjust. Stacks name brand first, fallback second. Body computes Times 16px/1.42857 #333 as live; `p, div, span, button, select, input` get Graphik Regular; h1–h3 display, h4–h6 semibold (canon base). |
| Fixed assets (9b) | `img/redball/`: `host-play-bg.jpg`, `sites-icon.svg`, `hamburger-menu-white.svg`, `cancel-bold-white.svg` — root-relative in CSS/JS. `grep -rn "http://localhost\|aem\.page/img\|aem\.live/img" blocks/` is empty. |
| stylelint | `selector-class-pattern` / `no-descending-specificity` / `number-max-precision` disabled per file with a reason: live BEM names kept on purpose, AEM-grid fractions kept at lifted precision (chrome-parity compares computed strings). |
| ESLint | The project's `@babel/eslint-parser` cannot load (`@babel/core` missing from node_modules); header/footer JS lint clean under airbnb-base with the default parser (`qa/eslintrc.tmp.json`). No install was made to avoid pruning the `--no-save` playwright. |
| impeccable | 3 `design-system-font` ignore-values persisted in `.impeccable/config.json` for the `-fallback` faces (they are metric-matched local aliases, not new brand fonts). |

## Harness measurements (aem up :3000, `qa/page.html`, live-shaped `/qa/nav` + `/qa/footer` mocks)

| | 1440 | 360 |
|---|---|---|
| header (host = block) | **195** = 60 + 105 + 30 | **74** = 44 + 30 (utility bar off-canvas, 1px) |
| footer | **242.55** (live 242) | **319.41** (live 319) |
| `body.appear` | yes | yes |
| pageerrors / console errors | 0 / 0 | 0 / 0 |
| broken images | 3 × content.da.live 401 (expected — binaries not uploaded yet) | same |
| dropdown | click → `aria-expanded=true`, list 400×397 at (8,12), 8 items, slogan shown; Escape closes | n/a (hidden ≤1369) |
| hamburger | n/a | click → `top-navigation__top-bar--opened top-to-bottom`, panel `top: 74px`, menu re-parented into `#top-navigation-bar`, rows HOME 59 / PLAY 49 / HOST 49 / VISIT OUR OTHER SITES 49 (arrow), icons swapped; second click closes |
| promo section | h2 1290×84 @x75, p 1290×24, button 210×56 @x615 — live 1290×84 @75 / 210×56 @615 | h2 322×48 @19, button 133×56 @154 — live 133×56 @154 |
| `qa-gate.mjs` | PASS 10/10 | — |
| `ew-editability-probe --content content/qa-chrome.html --simulate-editor` | authored 5 / editable 5 / dead 0 / drift 0 | — |

## chrome-parity (live `/en/home/404.html` vs harness, `--no-defaults`, header/footer regions)

Deltas remaining after fixes (breadcrumb label → title "404", footer host bg removed, mobile logo dims):

- **header REGION STYLE background transparent → #0a2396** — mandated (#81 `header { background }` reserve). Every text pair (7/7 at 1440, 3/3 at 360) and icon count matches with no style/rect delta.
- **footer REGION BOX Δy** — page-height difference of the QA content, not chrome.
- **`#redballtennis` `<b>` → `<strong>`** — pipeline-inherent tag (bold = `<strong>`).
- **ICON signature `Hamburger-Menu-White.svg` → `hamburger-menu-white.svg`** — src-name noise.
- Fixed in the pass: `MISSING "404"/EXTRA "QA harness"` (harness title), footer `backgroundColor` on the host, header `position static → relative` (moved to `.top-navigation`), mobile logo icon width 70 → 60 (mock dims).

## Lints

- `davids-model-lint.mjs content/nav.html content/footer.html content/qa-chrome.html` — PASS 0 🔴 0 🟡
- `delivery-lint.mjs --file content/nav.html --path /nav --type fragment` — 0 P0/P1/P2; same for `/footer`; `/qa-chrome` page — clean
- `sanitise.js` run on all three (no non-ASCII)
- stylelint (header.css, footer.css, styles.css) — clean; ESLint (airbnb-base, default parser) — clean
- token-completeness gate (`comm -23 …`) — empty; fixed-asset grep — empty

## Deferred to the deployed-origin gate

- EW editability of the CHROME content: the harness probe instruments `<main>` only; verify `/nav` and `/footer` in the da.live canvas (they open as their own documents). The `USTA SITES` label lives inside the live `<button>` (EW7) — accepted for fidelity, see above.
- CLS probe with delayed woff2/nav fetches (#101), the ≥98% chrome crop gate (#115), the ≥1920 box check (#116), styled-nav check with the REAL pipeline shape (`<li><p><a>`, linked `<picture>` pairs inside one `<a>`).
- `<a>` holding two `<img>` in one paragraph (brand): verify the pipeline keeps both pictures inside the link; the block also accepts a link-less pair (it synthesises `<a href="/">`).
- 404 page breadcrumb label: the repo `404.html` titles "Page not found"; live shows "404" — decide when the 404 page is converted (author `<title>404</title>` or accept).

## Media to upload (I do not PUT; binaries staged for the central upload)

| local file | DA path | used by |
|---|---|---|
| `content/media-upload/redball/red-ball-tennis-wbg.png` (528×331) | `/media/redball/red-ball-tennis-wbg.png` | `/nav` desktop logo, `/footer` logo (live footer used a 128×80 rendition of the same art) |
| `content/media-upload/redball/red-ball-logo-mob.png` (60×44) | `/media/redball/red-ball-logo-mob.png` | `/nav` mobile logo |

Code-origin fixed assets (committed, no upload): `img/redball/host-play-bg.jpg`, `sites-icon.svg`, `hamburger-menu-white.svg`, `cancel-bold-white.svg`.

## Files written this pass

`styles/styles.css`, `blocks/header/header.{js,css}`, `blocks/footer/footer.{js,css}`, `content/nav.html`, `content/footer.html`, `content/qa-chrome.html` (temporary QA page — delete or keep out of the publish roster), `content/media-upload/redball/*`, `img/redball/*`, `.impeccable/config.json` (3 ignore-values), `qa/` (gitignored: harness, mocks, probes, screenshots).

---

# EDS conversion log — pages (home, play, host, 404): blocks + content

Step 7–9 of the deploy methodology for the four gated prototypes (`stardust/prototypes/*-proposed.html`,
pixel-gated ≤0.63% vs live). Nothing deployed / PUT / committed. Foundation (`styles/styles.css`, chrome) untouched — every delta that needs it is listed under **Central to-do**.
One project-owned hook edited on the coordinator's instruction: `scripts/scripts.js#buildAutoBlocks` gained
`buildEmbedAutoBlocks()` (a YouTube link alone in its section → `embed` block, D1).

## Block inventory

| block | variants | tier (#95) | shape | schema | notes |
|---|---|---|---|---|---|
| `blocks/hero` | `video` (home) · `prop` (play) · `photo` (host) | template-slotted | simple (row 1 copy, row 2 media `<img>`; video URL = default content, reabsorbed) | `eds-schema/home.json §hero`, `play.json §hero`, `host.json §hero` | prototype inner DOM held as a skeleton; h1 / sub-head / inline `<img>` / lede `<p>`s / media link or `<img>` MOVED into role slots (EW1). `video`: the YouTube URL is a plain link in DEFAULT CONTENT right after the block (D1); decorate() reabsorbs it (EW8: `block.parentElement.nextElementSibling` → `.default-content-wrapper` holding only that link → the `<p>` moves into the media slot, iframe from its href, emptied wrapper removed; link kept hidden in `.hero-embed-source`, `@ew-exempt`), red-lines vector = fixed CSS asset `img/redball/vector-background-red.svg` (9b). `prop`: photo is a CSS background on live → `img/redball/rbt-play-v1.jpg` root-relative (desktop column + 340px mobile strip). `photo`: desktop photo authored (`host-red-ball.jpg`, cover layer via `object-fit`), mobile photo authored in the copy cell (`rbt-host-v1.jpeg`, shown ≤767). First `<img>` gets `loading=eager` + `fetchpriority=high`; media column height reserved by padding (224px). |
| `blocks/cards` | `props` (home) · `props host` (host) | reconstructive | container (one row per card) | `home.json §play-host`, `host.json §play` | cell = `<img>` + copy `<p>` + optional `<p><em><a>` (white pill). Paints nothing behind itself — ground is the section style `blue-balls`; `cards.css` only sets `background-clip: content-box` on `.blue-balls.cards-container` (live pads 8px white around the photo). Host footnote + `HOST WITH THE MOST` are default content after the block, laid out via `.cards-container .cards-wrapper ~ .default-content-wrapper`. |
| `blocks/columns` | `icons-dark` (play HOW TO PLAY / SCORE) · `icons-light` (play WHAT YOU NEED) | reconstructive | container (row = unit; cells icon \| copy) | `play.json §howto`, `play.json §need` | `icons-dark` on `blue-balls` (padding-top 0 + `background-clip: content-box` from `columns.css`). `icons-light` shares its section with the `WHAT YOU NEED TO PLAY` head (before) and the `WHERE TO PLAY` h2 + p + accent CTA (after) — both default content, styled through `.columns-container:has(.columns.icons-light) .default-content-wrapper` (the head sits outside the grid → styled in place, no reabsorption). |
| `blocks/signup-form` | default (play) · `newsletter` (home) · `host` (host) | template-slotted | simple (+ one 3-cell labels row) | `home.json §newsletter`, `play.json §need`, `host.json §host-form` | rows (every row one cell, D3): icon · h4 · subtitle · EMAIL · ZIP/POSTAL CODE · *JOIN THE FUN · legal — plain paragraphs read by order (subtitle, then the three control labels). Label `<p>`s MOVED into the `<label>`s, the submit label into the `<button>` (EW7 caveat declared). Inputs `#email-value-id` / `#zipcode-value-id`; submit disabled until both non-empty and email matches `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`; submit POSTs JSON to `siteConfig.forms.leadGenEndpoint` (dynamic import — the round-trip harness inlines block JS) or shows `<p role="status" class="notice">Sign-up is not connected yet — your details were not sent.</p>`. Variants only differ in band padding (16/32+15px gutters · 8/32 · 8/0; mobile halves). |
| `blocks/embed` | — | auto-block (`buildEmbedAutoBlocks` in `scripts/scripts.js`) | simple | `play.json §video` | authored as a plain link alone in its section; the auto-block wraps it (`buildBlock('embed')`). 1500×900 YouTube frame, clipped at 1440 like live (`overflow: hidden`), 16px live spacer band folded into `padding-top`. A lone embed link that shares a section with a block (home hero) is left for that block to reabsorb. |

Fixed assets added (9b): `img/redball/vector-background-red.svg`, `img/redball/rbt-play-v1.jpg`. No host-red-ball fallback copied (2500×1667 JPG; the authored image is the layer).

## Per-page section triage

| page | live band | EDS section | style |
|---|---|---|---|
| home | hero (h1 · RED/RAW · hand · lede · YouTube) | `hero video` | `red-stripe` |
| home/play/host | REDESIGNED FOR YOU | default content (h2 · `<strong>` line · `<strong><a>` Shop Now) | `promo, red-stripe` |
| home | play/host cards | `cards props` | `blue-balls` |
| home | newsletter | `signup-form newsletter` | `red-stripe` |
| play | hero (h1 with red `Red` · lede · CSS photo) | `hero prop` | `red-stripe` |
| play | spacer (16px) + video | plain YouTube link → auto-blocked `embed` | — |
| play | HOW TO PLAY / SCORE | `columns icons-dark` | `blue-balls` |
| play | WHAT YOU NEED + WHERE TO PLAY (inner stripe) | h2 (dc) + `columns icons-light` + h2/p/`<em><strong><a>` (dc) | `red-stripe` |
| play | newsletter (outer stripe) | `signup-form` | `red-stripe` |
| host | hero (h1 · mobile img · 2 ledes · photo) | `hero photo` | `red-stripe` |
| host | cards + footnote + HOST WITH THE MOST | `cards props host` + default content | `blue-balls` |
| host | form | `signup-form host` | `red-stripe` |
| 404 | badge · h2 · black pill | default content | `centered, form-band` |

Hidden-on-live content NOT authored (deliberate, `omitted` in the schemas): home/host `FIND AN EVENT` / `HOST AN EVENT` ambassador cards (`aem-GridColumn--default--hide` + `--tablet--hide`), host `GET EQUIPPED` button, host `Helpful Links` band, host `man.png` pair, play `YOU DRAW THE LINE` tagline (`display:none` at every width). The 16px empty AEM spacer container on play is folded into `embed` (empty EDS sections collapse).

Metadata blocks: Title `Red Ball Tennis` / `Play | Red Ball Tennis` / `Host | Red Ball Tennis` / `404 | Red Ball Tennis`; Description verbatim from `stardust/current/pages/<slug>.json` (home sentence; play `Play`; host `Host`; 404 has none live → no row); `breadcrumb` Home / Play / Host / 404. `sanitise.js` run on all four (5 entities).

## Gate table (harness `qa/<slug>.html` on :3000, live-shaped `/qa/nav` + `/qa/footer` mocks, content.da.live media mirrored to `qa/media/redball/`)

| page | davids-model | delivery-lint | block-roundtrip | EW probe (`--simulate-editor`) | qa-gate | pixel 1440 | pixel 360 |
|---|---|---|---|---|---|---|---|
| home | **0 🔴** · 2 🟡 (hero/cards "prose-only block" candidates — genuine bespoke/repeat patterns) | 0 P0/P1 · 3 P2 cross-origin-optimize (advisory-justified: no block calls `createOptimizedPicture`; the authored `<img>`/`<picture>` is moved as-is and the pipeline delivers the `<picture>`) | **✓ closed** with `--map "cards=section[data-section=play-host] .play-host__cards"` (the visible card column; the sibling `.play-host__hidden` ambassador buttons are `display:none` on live) · hero 🟠 EXTRA = the exempt YouTube source · EW 14/14 | 17/17 editable, 0 dead, 0 drift, Δh 0 | PASS 21/21 | **1.41 %**, Δh −1 (0.23 % / Δh 0 with the promo 1px isolated, see residuals) | **4.94 %**, Δh −1 (3.04 % / 0) |
| play | **0 🔴** · 2 🟡 (hero candidate; 4 authored SVGs — all pure-vector ≤7.4KB) | 0 P0/P1 · 2 P2 (same justification) | **✓ closed** (columns: 1 proto section ↔ 2 blocks by design) · EW 18/18 | 30/30, 0 dead, 0 drift | PASS 26/26 (⚠ embed 1600px full-bleed = live) | **1.27 %**, Δh −1 (0.14 % / 0) | **2.89 %**, Δh −1 (0.57 % / 0) |
| host | **0 🔴** · 2 🟡 | 0 P0/P1 · 4 P2 (same justification) | hero ✓ (🟡 img count: live counts the hidden `man.png` pair) · cards **1 🔴 residual** with `--map "cards=section[data-section=play] .play__inner"`: `GET EQUIPPED` — a `[hidden]` button (`aem-GridColumn--default--hide`) inside the same live column as the visible note/CTA, so no prototype selector isolates it; not authored on purpose (invisible on live) · signup-form ✓ · EW 13/13 | 16/16, 0 dead, 0 drift | PASS 21/21 | **1.52 %**, Δh −1 (0.29 % / 0) | **3.34 %**, Δh −1 (0.88 % / 0) |
| 404 | 0 🔴 0 🟡 | **1 P0 h1** (documented: live 404 has no h1) | n/a (no blocks) | 2/2 | FAIL on `exactly one <h1>` only | 36.55 %, Δh −356 (styles.css deltas, below) | 45.83 %, Δh −228 |

Other gates: `grep -rn "http://localhost\|aem\.page/img\|aem\.live/img" blocks/` empty; token-completeness `comm -23` empty; stylelint clean (5 block CSS files); ESLint airbnb-base (default parser, `qa/eslintrc.tmp.json`) clean. Section heights vs the prototype at 1440/360: every block section matches to the pixel (hero 571/536/531 · cards 605/710 · howto 708 · need 811+579 · forms 587/579/539; mobile 1215/969/1005 · 928/1062 · 1041 · 717+1005 · 1021/1005/1061).

## Residuals (after 2 iterations; cap 3)

1. **Promo band 308 vs 309px** (all three pages, both widths): the foundation's `main .section.promo p.button-wrapper { margin: 16px auto 0 }` models the live separator column as 16px; live computes 17px (8 + 1px hr + 8). The 1px shifts everything below by one row → the whole-page % (1.3–1.5 % @1440, 2.9–4.9 % @360) is dominated by this offset. `qa/<slug>-pf.html` (harness-only patch `margin-top: 17px`) isolates the block residuals: 0.14–0.29 % @1440, 0.57–3.04 % @360, Δh 0. **styles.css to-do**, not edited here.
2. **Home @360 3.0 % with the promo isolated**: the cards band (y 1500–2500) — live renders the 512px card PNGs through a different rendition/scaler (edge anti-aliasing over the busy photo), plus an on-page floating badge on the live capture at x≈10,y≈1720 (not content). Geometry identical (928px band).
3. **Host @1440 hero photo**: identical box (600×505) but `object-fit: cover` on the 2500×1667 source vs live's `background-size: cover` on the same file → sub-pixel resampling noise only.
4. Legal/label text anti-aliasing noise on the form bands (same fonts, same boxes).

## Deviations from the brief (and why)

- **Sub-fields use `<em>`, not `<span>`**: `<p><strong><em>RED</em>RAW THE LINES</strong></p>` and `<h1>Tennis <em>Red</em>esigned For You</h1>` — DA strips `<span>` from cells (ENCODE contract); the block styles `em` as the brand-red, non-italic run.
- **Disabled submit = black @ 0.5 opacity**, not `#a8a8a8/#6d7278`: the live capture samples rgb(126,126,126) at the pill; the prototypes encode `.subscribe-button[disabled] { background:#000 } :disabled { opacity:.5 }` and passed the 0.63 % gate that way.
- **WHERE TO PLAY** lives in the same section as `columns icons-light` (default content after the block, section `red-stripe`) instead of a separate `centered, red-stripe` section: its red h2, 24px `&nbsp;` gap, 17px separator and 72px tail need CSS that only a block file may carry (styles.css locked). Same mechanism the brief prescribes for the host footnote.
- **`promo, red-stripe` / `centered, form-band`** are authored comma-separated (aem.js splits `style` on commas; the earlier chrome harness regex only handled prose sections — `qa/build-page.mjs` emulates the pipeline for block sections too).
- **Hidden live content omitted** (listed above) — the one remaining round-trip 🔴 (host `GET EQUIPPED`) is such a `hidden` button.
- **Live 404 has no h1** — kept as h2 (delivery-lint P0 + qa-gate h1 check fail by design; do not invent an h1).
- **Host hero authors the desktop photo** (`host-red-ball.jpg`, editorial cover layer) in addition to the mobile `rbt-host-v1.jpeg` the brief named; man.png is hidden on live and not authored.

## Central to-do (owner / foundation)

1. `styles/styles.css` — `main .section.promo .default-content-wrapper p.button-wrapper { margin-top: 17px }` (live separator column is 17px; the 1px is the whole residual on home/play/host).
2. `styles/styles.css` — a 404 skin for `centered` (or a `not-found` style): section `padding-top: 64px` (32 ≤767); inner column `width: 66.667%; margin-left: 16.667%` (83.33 % / 8.33 % ≤767); badge `<picture>` 238px centred with 10px + 24px transparent separator columns around it; h2 76px/1.1 `#000` (44px ≤767), 8px column padding; 50px separator; CTA column `width: 50%` with the pill filling it (100 % ≤767, 14px label ≤767); trailing spacer `padding: 224px 0` (112 ≤767). Currently Δh −356 / −228.
3. `scripts/scripts.js` — review the added `buildEmbedAutoBlocks()` (YouTube embed/watch/youtu.be links alone in their section → `embed` block; skips sections that also hold a block so the hero can reabsorb its video). Extend the host list if other embed providers appear.
4. `styles/styles.css` — consider `background-clip: content-box` on `.blue-balls` (and `padding-top: 0` for the howto case) so `cards.css`/`columns.css` stop reaching into the section.
5. Media: all `content.da.live/.../media/redball/*` referenced here are in `stardust/rollout/media-upload.tsv` (201). `red-ball-tennis-circle.png` is the 480px rasterisation of the >40KB SVG. Post-preview: grep `.plain.html` for `about:error` = 0 and `<img>` counts (home 5, play 7, host 6, 404 1).
6. `scripts/site-config.js#forms.leadGenEndpoint` — owner to supply; until then every submit shows the "not connected" notice.
7. Deployed-origin only: EW editability of the form labels inside `<label>`/`<button>` in the real canvas (EW7), CLS with real fonts/renditions, the `<picture>` descender (#111 — image paragraphs already `line-height: 0`), 1600px wide check of `embed` (live is 1500px full-bleed).

Scratch artefacts (qa/, not for commit): `qa/build-page.mjs` (harness builder), `qa/probe.mjs`, `qa/tree.mjs`, `qa/proto-probe.mjs`, `qa/crop3.mjs`, `qa/<slug>{,-pf}-{1440,360}{,-diff}.png`, `qa/media/redball/*` mirrors, `qa/nav.plain.html` / `qa/footer.plain.html` repointed at the mirrors.
