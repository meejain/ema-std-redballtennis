# Learnings ledger — redballtennis.com replica → EDS (run 2026-09-17)

Per `skills/stardust/reference/learnings.md`: one entry per failure class this run surfaced, with
evidence, the skill + section to change, and `status: pending` until a maintainer harvests it.
Site-agnostic detail for each item lives in `STARDUST-IMPROVEMENT-NOTES.md` (N-nn).

| id | class | evidence | proposed change | status |
|---|---|---|---|---|
| L-01 | extract-gap | crawl.mjs wrote no `assets/media/` or `assets/fonts/`; 30 media + 4 fonts harvested by hand; one inline-style background (`rbt-play-v1.jpg`) only found mid-gate | `extract/scripts/crawl.mjs`: save every `media.imgs[]` + `media.cssBackgrounds[]` URL and intercept font responses, as SKILL.md § Phase 2 already promises (N-04, N-19) | pending |
| L-02 | extract-classification | two 301 targets recorded as `duplicateOf: home`; a JS bounce to account.usta.com captured as a site page with 4 login forms | crawl.mjs: emit `redirectTo` on 3xx / `offOrigin` on foreign `finalUrl`; dynamics pre-fills an `A` decided-out row (N-05, N-06) | pending |
| L-03 | gate-scoping | `--main ".container.responsivegrid"` matched the AEM ROOT wrapper (header+footer inside): 24 false 🔴, doc-height mainHeight, empty anchors on 4 archetypes | `source-fidelity-gate.md` § Hardening rule 3: require the matched node to exclude header/footer; `anchor.mjs` prints the matched element + warns (N-13) | pending |
| L-04 | instrument-blindness | `motion-observe.mjs` reported the dropdown and hamburger as dead: they are `aria-expanded` / inline-style / re-parenting state machines, not class mutations | record attribute + childList mutations (N-12, N-17) | pending |
| L-05 | instrument-noise | `chrome-parity.mjs` ICON deltas on every archetype = hashed local filenames of identical assets | pair icons by rect + intrinsic size (N-11) | pending |
| L-06 | instrument-hang | `pixel-compare.mjs` hung >10 min on a 360×5359 pair; 8 stale instances from other projects found on the machine | internal deadline + `--timeout` (N-21) | pending |
| L-07 | capture-state | live-only OneTrust floating launcher (`#ot-sdk-btn-floating`) was the whole footer-crop residual on every page (0.6–2.5%) | `live-session.mjs dismissOverlays`: hide persistent CMP launchers (N-16) | pending |
| L-08 | doc-drift | master § Setup names `load-context.mjs`; impeccable 4.3.1 ships `scripts/impeccable context` | point at impeccable's own § Setup (N-01) | pending |
| L-09 | script-layout | `qa/checks/*.mjs` import `../../../deploy/scripts/…` — the documented "copy scripts into the project" layout (`scripts/<skill>/`) makes three qa checks crash (`ERR_MODULE_NOT_FOUND`); root symlinks `deploy`, `dynamics`, `replica` were needed | resolve sibling skills via an env/CLI base dir, or document the required `skills/<name>/scripts` layout (N-23) | pending |
| L-10 | assemble-bug | `rollout/assemble.mjs` prints `https://https://…` when `site.liveHost` already carries a scheme; inventory writes `liveHost: null` so the doc's "fill it in" step invites a full URL | normalise the scheme in assemble.mjs (N-24) | pending |
| L-11 | dynamics-check-gap | `form-flow` cannot express the honest interim state of a `needs-backend` form (validated UI, explicit not-connected notice, NO request) — it requires a POST to "arrive" | add an `interim: true` mode asserting the notice + zero requests (N-25) | pending |
| L-12 | sub-pixel | a 0.015px LayoutUnit difference snapped a 360 band 1px, 0.5% of the page; regiondiff with ±1px shift search named it | note in `source-fidelity-gate.md` § Band breakdown (N-20) | pending |
