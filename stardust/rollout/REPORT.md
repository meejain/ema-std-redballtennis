# rollout — redballtennis.com → aem-eds (2026-09-17)

```
rollout — redballtennis.com → aem-eds
==================================================
Pages       4 total · 4 verified · 4 deployed · 0 pending · 0 content-pending · 0 stale
Templates   3 (landing 1/1, program 2/2, static 1/1)
Blocks      10 modules → 4 content blocks converted (hero, cards, columns, signup-form) + embed auto-block,
            chrome → header/footer blocks (+ /nav, /footer documents), 2 bands → default content
Quality     health 80/100 · open P1 0 / P2 4 / P3 0
To deliver  none
Content     none awaiting a content track
```

Live: https://main--sdt-redballtennis--aemcoder.aem.live/ (/play, /host, /404) · preview: same host on `.aem.page` · repo: https://github.com/aemcoder/sdt-redballtennis · authoring: https://da.live/#/aemcoder/sdt-redballtennis

## Fidelity (published origin vs live redballtennis.com, stitched captures, `pixel-compare`)

| page | 1440 pixel / Δh | 360 pixel / Δh | header crop | footer crop | CLS (delayed fonts + chrome) |
|---|---|---|---|---|---|
| home | 0.31 % / 0 | 3.18 % / 1 px | 1.09 % / 1.02 % | 0.63 % / 2.51 % | 0.008 (1440) · 0.0002 (360) |
| play | 0.17 % / 0 | 0.58 % / 0 | 1.09 % / 1.02 % | 0.63 % / 1.91 % | 0.002 |
| host | 0.39 % / 0 | 0.89 % / 0 | 1.09 % / 1.02 % | 0.63 % / 1.91 % | 0.001 |
| 404  | 0.27 % / 0 | 1.11 % / 0 | — | — | — |

Prototype-regime numbers (recreation vs live) were 0.10–0.22 % at 1440 and 0.51–0.63 % at 360 — the delivered pages hold them. Residuals: the live-only OneTrust floating launcher in every footer crop; home@360 hero 1 px (sub-pixel snap) which also lifts the home mobile footer crop to 2.51 %; YouTube same-src iframe render noise.

## Dynamic parity (`stardust/qa/dynamics-report.md`) — 11/11

| feature | class | disposition | status | replayed check |
|---|---|---|---|---|
| USTA SITES dropdown | M | rebuild-native | done | button + 8 links present; opens via aria-expanded |
| hamburger ≤1369 | M | rebuild-native | done | present; live class state machine + .3s transition |
| YouTube hero embed | V | embed-passthrough | done | iframe + 10 playback requests |
| newsletter / host forms | F | rebuild-native | **scaffolded-awaiting-owner** | 2 inputs + disabled submit; not-connected notice on submit; no request leaves the page |
| Adobe Launch / analytics / pixels | T | embed-passthrough | scaffolded-awaiting-owner (disabled) | 0 requests to 9 gated hosts |
| OneTrust | T | embed-passthrough | scaffolded-awaiting-owner (disabled) | 0 requests to 2 gated hosts |
| /confirmation → account.usta.com | X | decided-out | redirect 301 | — |
| AEM runtime data | A | decided-out | — | — |
| page errors | CR | — | done | 0 on 4 pages |

## Owner decision batch (nothing blocks the build)

1. Fonts: Graphik ×3 + USTA Sans self-hosted from the source's own files — confirm the licence covers the new host, or swap to the metric-matched fallbacks (`fonts/LICENSING.md`, one-line change in `styles/fonts.css`).
2. Lead-generation endpoint for the two forms (`scripts/site-config.js#forms.leadGenEndpoint`).
3. Tags on the new host: Launch property, OneTrust domain script id, pixels (`scripts/site-config.js`).
4. Identity: `/confirmation` redirect target + post-login return URL.
5. Production domain → sitemap config (exclude `/nav`, `/footer`), robots (aem.live serves noindex), JSON-LD (optimize P2 ×3 — the migrated bundle already carries Organization/WebSite/Service JSON-LD; EDS pages need it via metadata or head).

## Verify / optimize / QA

- verify: 4/4 (404 flipped manually: the live 404 has no `<h1>` — kept verbatim; QA allowlist).
- optimize (`rollout:baseline`): health 80/100; open P2: JSON-LD ×3, sitemap (EDS auto sitemap exists; assemble.mjs artefact in `stardust/rollout/site/`).
- qa sweep: `stardust/qa/report.html` (allowlist: aem.live noindex, 404 h1, fragments in the auto sitemap). Warns to review: og:type not emitted, trailing-slash redirects (added), heading order on /host (live outline), perf budget (YouTube iframe JS ≈1 MB).
- dashboard: `stardust/rollout/dashboard/index.html`.
