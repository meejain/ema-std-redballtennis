# redballtennis.com → AEM Edge Delivery Services — migration plan

_Stardust 0.21.1 · replica flow (keep the design) · hands-off run started 2026-09-17 · project root = this repo (`aemcoder/sdt-redballtennis`, private)._

## 0. Summary

| item | value |
|---|---|
| Source | https://www.redballtennis.com/ — AEM Sites (USTA multi-site: `redball` + `usta` clientlibs, Vue chrome) |
| Target | EDS + da.live · repo `aemcoder/sdt-redballtennis` · content `https://content.da.live/aemcoder/sdt-redballtennis/` |
| Preview / live | https://main--sdt-redballtennis--aemcoder.aem.page/ · https://main--sdt-redballtennis--aemcoder.aem.live/ |
| Flow | **replica → migrate → deploy/rollout** (same design; `prepare-migration` is not used) |
| Inventory | 7 discovered URLs → **4 real pages** (home, play, host, 404) + 2 source 301s + 1 external auth bounce |
| "100 most visible pages" | the whole site — all 4 pages are migrated at archetype (craft-gated) fidelity; there are no siblings |
| Fidelity bar | per page, per breakpoint (1440, 360): 0 structural 🔴 · pixel ≤ 10 % · height Δ ≤ 8 px · header + footer crops ≤ 2 % · final number measured on the **published origin** |

## 1. Inventory and URL map

| slug | source | type | archetype | EDS path | notes |
|---|---|---|---|---|---|
| home | `/en/home.html` (and `/`) | landing | yes | `/` (index) | hero + YouTube, promo band, Play/Host prop cards, newsletter form |
| play | `/en/home/play.html` | program | yes | `/play` | hero + red pattern, promo band, tall photo band, how-to-play/score, what-you-need, where-to-play, form |
| host | `/en/home/host.html` | program | yes | `/host` | photo hero, promo band, On-the-court/In-the-wild cards + host CTA, host interest form |
| 404 | `/en/home/404.html` | static | yes | `/404` (+ repo `404.html`) | badge, headline, back-home CTA |
| confirmation | `/en/home/confirmation.html` | unique | — | redirect → `https://account.usta.com/` | client-side bounce to the USTA Auth0 login; dynamics row #6, decided-out |
| free-racquet-pack | `/en/home/free-racquet-pack.html` | redirect | — | → `/` | source 301 |
| stay-current/…/USTA-awards-wheelchair-tennis-grants | `/en/home/stay-current/national/USTA-awards-wheelchair-tennis-grants.html` | redirect | — | → `/` | source 301 |

All source paths keep working through `stardust/redirects.tsv` (wired into the EDS redirects sheet at rollout Phase D).

## 2. Phases

| # | phase | skill | status | evidence |
|---|---|---|---|---|
| 0 | EDS repo + da.live wiring (repo, fstab, Code Sync, config entry, seed content, preview + live 200) | eds-new-site | **done** | https://main--sdt-redballtennis--aemcoder.aem.live/ serves the boilerplate |
| 1 | Extract (prep, `--dynamics`): 7/7 live captures, vision check, media (30) + fonts (4) harvested, computed-style lift at 1440 + 360 | stardust:extract (crawl.mjs) | **done** | `stardust/current/`, `stardust/replica/capture/lift-*.json` |
| 2 | Preserve direction: PRODUCT/DESIGN promoted verbatim, empty inconsistency register, dynamics triage (12 rows, 3 owner decisions) | stardust:replica Phase 2 | **done** | `stardust/direction.md`, `stardust/replica/inconsistency-register.md`, `stardust/dynamic-features.md` |
| 3 | Recreate: canon (fonts, tokens, header, footer, shared CSS) + one clean prototype per page | stardust:replica Phase 3 | **done** | `stardust/canon/`, `stardust/prototypes/<slug>-proposed.html` |
| 4 | Source-fidelity gate per prototype × {1440, 360}: content-diff, visual-diff, stitched pixel diff, chrome crop gate, ≤ 3 iterations, then motion-observe + interaction parity | stardust:replica Phase 4 | **done** — home 0.22/0.61 %, play 0.13/0.56 %, host 0.17/0.63 %, 404 0.10/0.51 %, Δh 0, 0 structural 🔴 | `stardust/replica/gates/<slug>-<w>/`, `stardust/replica/progress.json`, `stardust/replica/motion/` |
| 5 | Migrate: platform-agnostic bundle, content-count acceptance, portability audits | stardust:migrate | **done** — 4 pages, 32 assets, pagemap + file:// audits OK | `stardust/migrated/` |
| 6 | Deploy / rollout: blocks + foundation CSS, nav/footer documents, DA content, preview + publish, delivery gates, published-origin gate, dynamics D2 (dropdown, hamburger, embed, form scaffold), redirects | stardust:rollout (drives deploy) | **done** — published-origin gate: home 0.31/3.18 %, play 0.17/0.58 %, host 0.39/0.89 %, 404 0.27/1.11 % (Δh 0, home@360 1 px); chrome crops ≤ 1.1 % header / ≤ 2.5 % footer; CLS ≤ 0.008; dynamics parity 11/11 | `blocks/`, `styles/`, `content/`, `stardust/rollout/` |
| 7 | QA sweep of the live site + report; learnings ledger | stardust:qa, rollout Phase H | **done** — `stardust/qa/report.html`, `stardust/learnings.md` | `stardust/qa/`, `stardust/learnings.md` |
| 8 | **User review** — fonts decision, owner decision batch, go/no-go for DNS | user | **waiting** | this file § 5; live: https://main--sdt-redballtennis--aemcoder.aem.live/ |

## 3. Block plan (David's Model — one pattern, one block; prose stays default content)

| block / doc | kind | pages | source of truth | decode tier |
|---|---|---|---|---|
| `/nav` document + `blocks/header` | chrome | all | `stardust/canon/header.html` — utility bar (USTA SITES dropdown, 8 links), blue bar (logo, HOME/PLAY/HOST, active underline), breadcrumb strip; hamburger ≤ 767 | template-slotted |
| `/footer` document + `blocks/footer` | chrome | all | `stardust/canon/footer.html` — logo, Terms & Conditions, Privacy Policy, mobile-only `#redballtennis` | template-slotted |
| `hero` (variants `video`, `prop`, `photo`) | block | home, play, host | split hero: text column + media; red-lines SVG / red-ball pattern / edge-bleed photo | template-slotted |
| promo band | **default content** + section style `promo` | home, play, host | H2 + `<b>` sub-line + primary button | — |
| `cards` (variant `props`) | block | home, host | framed-photo PNG + copy + inverse pill CTA on the blue-balls ground; host adds footnote + centred CTA | reconstructive |
| `columns` (variants `icon-dark`, `icon-light`) | block | play | HOW TO PLAY / HOW TO SCORE; WHAT YOU NEED TO PLAY | reconstructive |
| `signup-form` (variant `host`) | block | home, play, host | Vue lead-gen widget → controls, validation, disabled submit, "not connected" notice | template-slotted |
| photo band, where-to-play, 404 body | **default content** + section styles (`photo-band`, `red-rule`, `centered`) | play, 404 | image / H2 + p + button | — |
| YouTube embed | auto-block (`buildAutoBlocks`) | home | bare URL in the hero | — |
| section separator | section style `red-rule` (6 px `#C80F2F` bottom border) | all | `horizontal-bottom-red-stripe` | — |

Foundation (`styles/styles.css` + `styles/fonts.css`): tokens from `DESIGN.json.extensions.canon.tokens`; `@font-face` for the 4 captured faces (`/fonts/*.woff2|otf`, brand family first in every stack); `--nav-height` = 195 px desktop / 74 px mobile so the late-loading header does not shift the hero; global `border-box` reset; `img { height: auto }`; `main .section:empty { display: none }`.

## 4. Dynamic surface (from `stardust/dynamic-features.md`)

| ship autonomously (`self`) | interim + owner decision |
|---|---|
| USTA SITES dropdown, hamburger nav, YouTube embed, redirects, mobile `#redballtennis` | newsletter / host forms (render + validate, submission blocked until the USTA lead-gen endpoint is provided); Adobe Launch + OneTrust + pixels shipped **disabled** in `scripts/site-config.js`; `/confirmation` → account.usta.com |

## 5. Open decisions for the user (nothing blocks the build; all have a named default)

1. **Fonts.** Default taken: self-host Graphik Regular / Semibold / XXCond Bold and USTA Sans from the captured first-party files (USTA holds the licence; needed for final fidelity). Alternative per the skill's default policy: metric-matched substitutes with the brand family first in the stack. One-line swap in `styles/fonts.css`.
2. **Lead-generation backend** for the two forms (endpoint or replacement handler).
3. **Tags on the new host**: Launch property, OneTrust script id, which pixels.
4. **Identity**: `/confirmation` redirect target and post-login return URL.
5. **404 strategy**: the repo `404.html` now carries the replica's not-found section (unknown paths render the live design); the content page `/404` is also published so the copy stays editable. The live 404 has no `<h1>` — kept verbatim (QA allowlist).
6. **Sitemap / robots**: the aem.live host serves `x-robots-tag: noindex` and an automatic sitemap that lists the `/nav` and `/footer` fragments (now marked noindex). Both resolve with the production-domain set-up (sitemap config in the site admin).

## 6. Where things live

- `stardust/state.json` — page lifecycle · `stardust/status.jsonl` — phase ledger · `stardust/journal.md` — narrative
- `stardust/current/` — captured source (pages, screenshots, media, fonts, brand extraction, brand review)
- `stardust/replica/` — capture lift, gates, motion evidence, progress ledger, inconsistency register
- `stardust/canon/`, `stardust/prototypes/` — recreation · `stardust/migrated/` — agnostic bundle · `stardust/rollout/` — delivery ledger + dashboard
- `STARDUST-IMPROVEMENT-NOTES.md` — plugin feedback (site-agnostic) · `stardust/learnings.md` — per-run ledger
