# Stardust plugin — general improvement notes (redballtennis run)

Site-agnostic observations collected while running the redballtennis.com same-design
migration (stardust 0.21.1, impeccable 4.3.1, Claude Code auto mode, 2026-09-17).
Site-specific issues live in `stardust/learnings.md`; this file is the human-readable
superset for the plugin maintainers. Each note names the skill file + section a change
would land in.

Format: **N-nn. title** — where · observed · why it matters · suggestion.

## Master skill (`skills/stardust/SKILL.md`)

**N-01. Setup step 2 still names a loader script that no longer exists (third rename).**
- Where: § Setup step 2 (`<harness>/skills/impeccable/scripts/load-context.mjs`).
- Observed: impeccable 4.0–4.1 shipped `scripts/context.mjs`; 4.3.1 ships a shell launcher
  `scripts/impeccable` with a `context` verb (native binary, no Node). Neither name in the
  stardust text has existed for months; every run starts with a `find`.
- Suggestion: stop naming a file. Say "run impeccable's own § Setup step 1 (its SKILL.md is the
  contract)" so stardust survives impeccable's loader renames.

**N-02. Setup step 1 lists only project-local skill dirs.**
- Where: § Setup step 1.
- Observed (again — also in earlier runs): marketplace installs live under
  `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/skills/`; a literal reading reports
  impeccable "not installed".
- Suggestion: add the plugin-cache path + "newest version dir wins" rule.

**N-03. No "the EDS repo is the stardust project root" guidance for repo-creating runs.**
- Where: § Setup / § Artifacts.
- Observed: when the run also creates the EDS repo, the agent must decide where `stardust/`
  lives. deploy/rollout implicitly require the repo root (they write `blocks/`, `styles/`,
  `head.html`).
- Suggestion: one sentence in § Setup.

## Extract (`skills/extract/`)

**N-04. crawl.mjs saves neither media nor fonts, although SKILL.md says it does.**
- Where: `extract/SKILL.md` § Phase 2 ("Save referenced media to `assets/media/`", "Font files
  captured via network-intercept … saved under `assets/fonts/`") vs `scripts/crawl.mjs`.
- Observed: after a clean 7/7 run, `assets/media/` and `assets/fonts/` did not exist; only
  `favicon.ico` and screenshots were written. Every downstream phase (recreation, deploy media
  rehost, fonts.css) needs those files, so each run hand-writes a harvest loop.
- Suggestion: implement both in crawl.mjs (response interception is already wired for
  `--dynamics`), or delete the two sentences and add an explicit `extract --assets` step.

**N-05. Redirected URLs are reported as content duplicates, not as redirects.**
- Where: `scripts/crawl.mjs` duplicate post-pass (`DUP-OF`), `_crawl-log.json#crawl`.
- Observed: two sitemap-free URLs 301'd to home; the crawler followed them, captured home twice,
  and flagged `duplicateOf: home`. `finalUrl` differs from `url` in the record, so the redirect is
  detectable, but nothing classifies it; `state.json` has no redirect concept and
  `stardust/redirects.tsv` (rollout's mechanism) has to be hand-authored.
- Suggestion: when `finalUrl` (path) ≠ requested (path) and the response chain had a 3xx, emit
  `redirectTo` on the record, list under `_crawl-log.json#crawl.redirects[]`, and let rollout's
  path-safety gate seed `redirects.tsv` from it.

**N-06. Client-side bounces to a foreign origin are captured as site pages.**
- Where: `scripts/crawl.mjs` response validation; `dynamics-detect.mjs`.
- Observed: `/en/home/confirmation.html` renders a tiny shell then JS-navigates to
  `account.usta.com/u/login?...` (Auth0). The crawl recorded the login page (title "Sign In",
  3 images, external forms) as a site page with `httpStatus: 200`; dynamics-detect then
  counted its 4 login/social forms as the site's own forms.
- Suggestion: when `new URL(finalUrl).origin !== origin`, mark the record `offOrigin: true`,
  keep it out of the page inventory, and pre-fill a dynamics row `class A · decided-out ·
  external hand-off`.

**N-07. `headings[]` records `tag` only — `level` is absent.**
- Where: `reference/current-state-schema.md` § headings vs crawl.mjs capture.
- Observed: records look like `{tag:"h1", text:…}`; downstream helpers that filter on
  `h.level === 1` (the schema field several references cite) get an empty outline.
- Suggestion: emit both, or make the schema and the crawler agree.

## Replica (`skills/replica/`)

**N-08. The CSS lift has no shipped instrument.**
- Where: `reference/recreation-procedure.md` § CSS lifting steps 2 and 4 ("capture per-element
  computed styles … at EVERY gate breakpoint").
- Observed: the step is mandatory and per-breakpoint, yet `scripts/` ships nothing for it; this
  run (like earlier ones) hand-wrote a Playwright walk (`stardust/replica/capture/lift.mjs`:
  rect + 60 computed props + ::before/::after + @font-face + media-query inventory per element).
- Suggestion: ship `replica/scripts/lift.mjs` with the same live-session hardening as the other
  probes, so the lift is reproducible and gate-comparable.

**N-09. `brand-review.html` and the full `_brand-extraction.json` are redesign artifacts the
replica flow still pays for.**
- Where: `replica/SKILL.md` Phase 1 delegates to `extract --prep` unchanged; extract Phases
  3–5 author brand-review + tensions detectors.
- Observed: in preserve mode nobody consumes tensions or the brand board (direct never runs).
  They cost real authoring time on a 4-page site.
- Suggestion: let replica pass `--no-brand-review` (or make Phase 5 opt-in outside the
  redesign flow).

## Dynamics (`skills/dynamics/`)

**N-10. Third-party tag noise dominates the draft triage on AEM/USTA-class sites.**
- Where: `scripts/dynamics-detect.mjs` + `vendors.json`.
- Observed: 26 third-party hosts per page, almost all analytics / consent / ad-tech (Adobe
  Target, Demdex, OneTrust, Google Maps CSP ping, Doubleclick). The `T` rows swamp the two rows
  that matter (newsletter form, YouTube embed).
- Suggestion: collapse known `T` vendors into one "tag stack" row by default; keep the
  per-host list in the JSON.

## Personal skill `eds-new-site` (Paolo's, not the plugin)

**P-01. DA folder guard false-positives.** `GET admin.da.live/list/aemcoder/<site>/` returned
`200` with body `[]` for a folder that did not exist. The guard text says "200 = exists → stop";
it should say "200 with a non-empty array".

**P-02. Handoff text names only the redesign chain** (`extract → prepare-migration → migrate`);
for a same-design migration the master skill forbids `prepare-migration`. Offer both chains.

**P-03. Slug confirmation step conflicts with hands-off runs.** "Confirm the final slug with the
user before creating anything" — under an explicit "proceed without asking" instruction the
skill should say the default (`sdt-<domain>`) is taken silently.

## Replica gate instruments (from the 404 archetype gate, 2026-09-17)

**N-11. `chrome-parity.mjs --json <file>` writes nothing** — the JSON goes to stdout regardless of the
argument; the gate doc reads as if it takes a path. Also its ICON pairing flags images whose only
difference is a content-hashed local filename (`red-ball-tennis-wbg-04927f.png` vs the live URL) as
signature mismatches — pair icons by rendered rect + intrinsic size, not by `src`.

**N-12. `motion-observe.mjs --click` misses `aria-expanded` / `display` toggles.** The widget sampler
records `transform`/`scrollLeft` only, so a dropdown that opens via `aria-expanded="true"` +
`display:block` (the USTA SITES menu) reads as dead — the one class the doc says to implement
("dropdown opens") is invisible to the instrument. Sample `aria-*` attribute mutations, class
mutations on the clicked element's siblings, and `display`/`visibility` of `aria-controls` targets.
Hover samples report `transition: all` without the duration the live rule declares.

**N-13. The `--main` symmetric-scope rule needs a "first match is the wrapper" warning.**
`recreation-procedure.md` says "adopt the live page's content-root class on the prototype's main
wrapper so one `--main` selector scopes both sides"; on AEM-classic pages the same class pair
(`container responsivegrid`) is on the ROOT wrapper (around header + content + footer) and on every
nested container, so `querySelector` picks the chrome-wrapping root and produces dozens of false
chrome reds, a document-height `mainHeight`, and an empty anchor list. Suggest: the gate doc tells
the agent to verify `--main` resolves to a node that EXCLUDES header/footer on the live side
(`anchor.mjs` could print the matched element's tag/classes and its child-section count and warn
when the header lands inside it).

**N-14. A rule-per-line CSS dump is not a complete lift.** Splitting the minified clientlibs on `}`
(`capture/css/ALL-RULES.txt`) loses rules nested in `@media` blocks whose first rule shares the
line, and misses cascade winners; the 404 h2 ramp (76px/44px) was only recoverable from computed
styles. Reinforces N-08: ship a computed-style lift instrument rather than relying on stylesheet grep.

**N-15. `anchor.mjs` finds no sections on AEM-classic live pages.** It looks for `section` / `.section`
children of the content root; AEM Core Components pages are nested `div.container.responsivegrid`
grids with no `<section>`, so the live side prints only the document height and the
"section-anchor inner loop" the gate doc recommends is unavailable exactly on the CMS class replica
targets most often. Suggest a `--sections <selector>` option (e.g. `:scope > .aem-Grid > .container`)
or a heuristic fallback to the content root's direct children with height > 40px.

**N-16. `stitch-shot --settle` leaves the OneTrust floating "cookie settings" button in the live
capture.** `#ot-sdk-btn-floating` is a fixed widget that survives consent acceptance, so it paints in
every stitched chunk and is the entire footer-crop residual on two archetypes (0.6–1.9%, thick
texture). Add it to the shared `dismissOverlays` hide list (it is not a banner, it is a persistent
launcher), or document a `--mask` recipe for it.

**N-17. `motion-observe.mjs` cannot see aria-attribute or inline-style state machines.** The dropdown
opens via `aria-expanded` + `display:block` on `aria-controls`, the hamburger swaps icons by inline
`style`, and the mobile menu is re-parented — none of it is a class mutation, so the instrument
reported the chrome as dead and every agent needed a hand-written click probe. Record attribute
mutations (`aria-*`, `style`) and childList re-parenting alongside class mutations.

**N-18. An "offline live twin" removes most live hits from the gate loop.** The play agent rebuilt
the live page offline from the crawler's saved DOM (`pages/<slug>.html`) + the captured stylesheets
+ local media/fonts and reproduced the live document height exactly at 1440/360/1920 — then used it
for box-map, region-diff (±2px shift search that separates sub-pixel LayoutUnit snapping from real
geometry error) and the 1920 fluid check with zero live navigations. `stitch-shot`/`anchor` could
offer `--offline <rendered.html>` for the live side once the first live capture exists; the doc's
"1920 box-map spot check" would then be free. (Scripts left in `stardust/replica/capture/`:
offline-render.mjs, geom.mjs, regiondiff.mjs — worth harvesting.)

**N-19. Inline-`style` background images are not harvested and are hard to spot.** A hero photo set
via `style="background-image:url(…)"` on a container appeared in `media.cssBackgrounds[]` but no
downstream step downloads cssBackgrounds (N-04); the agent had to curl it mid-gate. Same fix as
N-04: crawl.mjs should save every `media.imgs[]` AND `media.cssBackgrounds[]` URL.

**N-20. Sub-pixel LayoutUnit drift is a real 360 failure class.** A band whose live top is
3317.766px vs 3317.781px on the build snapped an input row 1px lower (13.8k differing px, 0.5% of
the page). `pixel-compare --band` cannot name it; the fix was a `-0.05px` margin. Worth a one-line
note in `source-fidelity-gate.md` § Band breakdown: "when a band's diff vanishes under a ±1px
vertical shift (regiondiff), it is LayoutUnit accumulation, not geometry — nudge a fractional margin".

**N-21. `pixel-compare.mjs` can hang indefinitely.** One run on a 360×5359 pair never returned
(killed after >10 min); five stale `pixel-compare.mjs` processes from OTHER stardust projects were
found alive on the same machine, so this is a recurring class, not a one-off. `gate.sh` inherits it.
Suggest an internal deadline (e.g. 120 s → exit 1 with "compare timed out") and a `--timeout` flag;
macOS has no `timeout` binary, so agents cannot easily wrap it.

**N-22. Deployed-origin probes should pair chrome by GEOMETRY, not by class.** After the EW contract
(no classes on authored elements) the header block's nav anchors carry no `navigation-menu__…` class,
so a selector-based probe ported from the prototype gate reports "no nav links" while the rendered
rects are pixel-identical to live. `chrome-parity.mjs` already pairs by text — the doc could say so
explicitly for the published-origin regime.

## Rollout / QA (published-origin phase)

**N-23. `qa/checks/*.mjs` hard-code the plugin's `skills/<name>/scripts` layout.** With the documented
"copy the scripts into the project" pattern (`scripts/qa/`, `scripts/deploy/`, …) the `dynamics`,
`ai-readability` and `editability` checks crash with `ERR_MODULE_NOT_FOUND`
(`<root>/deploy/scripts/ai-readability.mjs`). Resolve sibling skills through one base-dir option
(`--skills-dir`) or an env var, or state the required layout in `qa/SKILL.md` § Setup.

**N-24. `rollout/assemble.mjs` doubles the scheme** (`https://https://main--…aem.live/…`) when
`rollout.json#site.liveHost` carries `https://` — and nothing tells the user which form is expected
(inventory writes `null`). Normalise in assemble.mjs.

**N-25. `dynamics-check.mjs form-flow` has no honest state for a `needs-backend` interim.** The
forms reference prescribes "definition-driven block + explicit not-connected message, never pretend"
when Document Authoring has no intake; the checker can only pass when a POST *arrives*, so the
prescribed interim can never be replayed as a pass. Add `interim: true` (assert the notice text and
zero outbound requests) so the parity table stays truthful without hand-written presence checks.

**N-26. `aem.live` hosts serve `x-robots-tag: noindex` until a production domain exists**, so
`qa`'s `metadata/noindex-on-live` fires on every page of every pre-production rollout. Downgrade
to info when the base host ends in `.aem.live`/`.aem.page`, or document the allowlist entry.
