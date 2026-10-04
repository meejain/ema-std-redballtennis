# Journal — redballtennis.com same-design migration to EDS

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-09-17T15:24:00Z — Kick-off: EDS repo created, site extracted, direction preserved, dynamics triaged

**Prompt:** Migrate https://www.redballtennis.com/ to EDS with stardust; create a private EDS repo with the personal `eds-new-site` skill; define the full migration plan; migrate the ~100 most visible pages to final fidelity, then stop for review; proceed without asking; track general stardust improvements in a notes file.

**Decisions:**
- Flow = **replica** (same design; the user said "migrate", not "redesign"). Hands-off mode stamped (`state.json.handsOff`).
- Repo slug `sdt-redballtennis` (Stardust prefix per the personal skill), org `aemcoder`, private. The cloned repo is the stardust project root.
- The site is tiny: 7 URLs → 4 real pages + 2 redirects + 1 client-side bounce to the USTA account login. "100 most visible pages" therefore = the whole site; every page is an archetype.
- Fonts: self-host the captured first-party Graphik/USTA Sans files (deviation from the skill's "substitute" default, recorded as a named assumption and the #1 open decision).
- Pure replica: inconsistency register empty.
- Confirmation page is decided-out (external auth) and becomes a redirect row.

**Artifacts touched:**
- repo aemcoder/sdt-redballtennis — created (boilerplate), `fstab.yaml` pushed, Code Sync installed, config entry verified, boilerplate index/nav/footer seeded + published (aem.page + aem.live 200)
- `stardust/current/` — created: 7 page records + rendered DOM, 7 screenshots, favicon, 30 media files, 4 fonts, `_crawl-log.json`, `_dynamics.json`, `_brand-extraction.json`, `PRODUCT.md`, `DESIGN.md`, `DESIGN.json`, `brand-review.html`
- `stardust/replica/capture/lift.mjs` + `lift-{home,play,host,404}-{1440,360}.json` — created (computed-style lift)
- `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` (root) — promoted verbatim
- `stardust/direction.md`, `stardust/replica/inconsistency-register.md`, `stardust/redirects.tsv`, `stardust/dynamic-features.md`, `stardust/dynamic-features-plan.md` — created
- `stardust/state.json`, `stardust/status.jsonl` — created
- `MIGRATION-PLAN.md`, `STARDUST-IMPROVEMENT-NOTES.md` — created
- `scripts/{replica,diff,dynamics,rollout,deploy,migrate}/`, `stardust/scripts/crawl.mjs` — plugin scripts copied into the project

**Findings worth flagging:**
- crawl.mjs writes neither `assets/media/` nor `assets/fonts/` despite the SKILL text; harvested by hand (notes N-04).
- 301 targets are recorded as content duplicates, not redirects (N-05); a JS bounce to a foreign origin is captured as a site page and its login forms counted as the site's forms (N-06).
- The dynamics detector missed the newsletter form (Vue controls, no `<form>`); rows added manually.
- Source fonts are served without CORS, so hotlinking is impossible; the page `body` computes Times 16px — every component sets its own family, so the recreation must never rely on inheritance.
- The PLAY/HOST sticker labels and polaroid frames are baked into the card PNGs.

**Open questions:**
- Fonts licence stance (self-host vs substitute) — default taken, flagged.
- Owner decision batch (lead-gen endpoint, tags, identity return URL).

**Next:** Phase 3 recreation — canon (fonts, tokens, header, footer) from the home archetype, then play/host/404 prototypes; gate each at 1440 and 360.

---
## 2026-09-17T18:50:00Z — Recreation gated on all four pages; bundle migrated

**Prompt:** *(continuation of the kick-off run — no new user input)*

**Decisions:**
- Every page is an archetype (no siblings). Canon (fonts, tokens, header, footer, chrome.js) was pre-authored from the live CSS/computed styles and then owned by the home agent; play/host/404 agents pasted it and reported chrome deltas instead of editing it.
- Content-root selector for the gate corrected from `.container.responsivegrid` (matches the live ROOT wrapper) to `.container.responsivegrid.full-width--root`; the brief and the notes record why.
- Approvals granted hands-off after all gates passed (`approvedBy: "hands-off"` in state.json history).
- Migrated tree uses the plan's re-homed paths (`index.html`, `play/`, `host/`, `404/`) rather than the URL-literal `/en/home/...`; recorded per page as a `path-rehome` migration decision; source paths live in `stardust/redirects.tsv`.
- Design-hook ignores (`cramped-padding`, `tight-leading`, `low-contrast`) persisted file-scoped to the recreation tree: measured live values are fidelity, not defects.
- One canon base rule added after gating (`body { overflow: hidden auto }`, needed at 360 on host); all four pixel rounds re-run — numbers unchanged.

**Gate results (final, vs live, stitched captures):**

| page | 1440 pixel / Δh | 360 pixel / Δh | structural 🔴 | header / footer crop |
|---|---|---|---|---|
| home | 0.22% / 0 | 0.61% / 0 | 0 | 0.00% / 0.63% (1440) · 0.00% / 1.91% (360) |
| play | 0.13% / 0 | 0.56% / 0 | 0 | 0.00% / 0.63% · 0.00% / 1.91% |
| host | 0.17% / 0 | 0.63% / 0 | 0 | 0.00% / 0.63% · 0.00% / 1.91% |
| 404  | 0.10% / 0 | 0.51% / 0 | 0 | 0.00% / 0.63% · 0.00% / 1.91% |

The single shared residual is the live-only OneTrust floating cookie button (fixed, bottom-left, repeats at every stitched seam). Motion: button hover opacity .7, footer link hover lime, USTA SITES dropdown (aria-expanded), ≤1369 hamburger state machine — all observed live and implemented in canon; nav-link hover never fired live and was removed.

**Artifacts touched:**
- `stardust/canon/*` — finalised · `stardust/prototypes/{home,play,host,404}-proposed.html` + `.css` — created
- `stardust/replica/gates/*`, `stardust/replica/motion/*`, `stardust/replica/progress.*.json` — gate evidence and ledgers
- `stardust/migrated/` — 4 pages, 32 bundled assets, robots.txt, sitemap.xml; pagemap + file:// audits OK; served over HTTP the home bundle measures 0.22% (= prototype)
- `stardust/state.json` (approved → migrated, `migrate` block), `stardust/status.jsonl`
- `fonts/*.woff2`, `fonts/LICENSING.md`, `styles/fonts.css`, `favicon.ico`, `stardust/runtime-contract.json` — EDS foundation inputs
- DA `media/redball/*` — 30 assets uploaded (404 badge rasterized to PNG: the 122KB SVG exceeds the pipeline's 40KB SVG limit)
- `STARDUST-IMPROVEMENT-NOTES.md` — N-11…N-20 added from the agents' instrument findings

**Findings worth flagging:**
- `pixel-compare.mjs` can stall indefinitely on tall captures; stale instances from other projects were found on the machine (note pending).
- The live-only OneTrust launcher (`#ot-sdk-btn-floating`) is the whole footer-crop residual on every page.

**Open questions:** unchanged (fonts licence, owner decision batch).

**Next:** EDS conversion — foundation + chrome (agent running), then page blocks, content documents, DA delivery, published-origin gate, QA.

---
## 2026-09-17T20:20:00Z — EDS conversion delivered: 4 pages live, published-origin gate passed

**Prompt:** *(continuation; the user asked for progress and to open the local URLs — answered in chat)*

**Decisions:**
- Chrome first (foundation + header/footer blocks + `/nav`, `/footer`), then page blocks by a second agent (two watchdog stalls; a leaner brief with line-ranged reads finished the job).
- David's Model: embed URLs are plain links in default content — `buildEmbedAutoBlocks()` added to `scripts/scripts.js` (project hook); the home hero reabsorbs its YouTube link (EW8). Promo/WHERE TO PLAY/404 bodies are default content with section styles (`promo`, `centered`, `not-found`, `red-stripe`, `blue-balls`, `form-band`).
- 404: live page has no `<h1>` — kept; repo `404.html` rewritten to the not-found section so unknown paths render the live design; QA allowlist entry.
- Fragment metadata (robots noindex) on `/nav` broke the header slot contract (empty leading section) — reverted; header/footer blocks now skip empty sections.
- Forms: `form-flow` cannot pass without a POST; parity file records presence checks + the explicit not-connected notice until the owner supplies the endpoint (N-25).
- aem.live `x-robots-tag: noindex` and the auto sitemap listing fragments are allowlisted with reasons (production-domain items).

**Artifacts touched:**
- `styles/styles.css`, `styles/fonts.css`, `fonts/*`, `blocks/{header,footer,hero,cards,columns,signup-form,embed}`, `scripts/scripts.js` (auto-block hook), `scripts/site-config.js`, `404.html`, `img/redball/*` — created/updated (commits b2fb2c2, ad691e5, 7bfccf2 + geometry fixes)
- `content/{index,play,host,404,nav,footer}.html`, `content/redirects.json` — authored; PUT + previewed + published (DA `aemcoder/sdt-redballtennis`)
- `stardust/rollout/` — coverage ledgers, plan, REPORT.md, site artefacts, dashboard; `stardust/dynamics/parity.json`; `stardust/qa/` (report, allowlist, dynamics-report, baselines); `stardust/learnings.md`; `stardust/eds-conversion-log.md` (agents)
- `STARDUST-IMPROVEMENT-NOTES.md` N-21…N-26; `MIGRATION-PLAN.md` phases 3–7 marked done

**Findings worth flagging:**
- A metadata block in a fragment yields an empty first section — any positional chrome contract must skip empty sections.
- The QA checks require the plugin's `skills/<name>/scripts` layout (`deploy/scripts/…` relative to the qa dir) — solved with root shim dirs.
- `rollout/assemble.mjs` doubles the URL scheme when `liveHost` includes `https://`.

**Open questions:** the owner decision batch (fonts licence, lead-gen endpoint, tags/consent ids, identity return URL, production domain → sitemap/robots/JSON-LD).

**Next:** user review of https://main--sdt-redballtennis--aemcoder.aem.live/ ; then the owner decisions and the production-domain set-up.

---
