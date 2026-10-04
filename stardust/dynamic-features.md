# Dynamic features — redballtennis.com

_provenance: stardust:dynamics Phases 1–3 (replica Phase 2 gate), 2026-09-17. Draft: `stardust/dynamics/dynamic-features.generated-plan.md` (37 rows) curated to the rows below; the 26 third-party tag hosts are collapsed into two rows (analytics stack, consent). Target origin probed: https://main--sdt-redballtennis--aemcoder.aem.live (both first-party AEM data paths are host-bound there, as expected)._

## Listings contract

none — the site has no listing blocks, no index-backed rails, no search.

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | f-signup-form | Newsletter sign-up (EMAIL + ZIP, "*JOIN THE FUN", submit disabled until valid; Vue lead-gen widget, no `<form>`, POST target inside USTA Vue clientlib) | F | home, play (3/4) | rebuild-native | needs-backend | scaffolded-awaiting-owner | forms: controls-not-form, client validation replicated, submission blocked with visible "no backend connected" state until USTA provides the lead-gen endpoint | **owner: USTA digital** — endpoint + consent copy sign-off | `v-lead-generation-form` in pages/home.html; detector missed it (no `<form>`, see notes N-06/N-10) |
| 2 | f-host-interest-form | Host interest form (same widget, different title/subtitle) | F | host (1/4) | rebuild-native | needs-backend | scaffolded-awaiting-owner | same block as #1 (variant `host`) | owner: USTA digital | pages/host.html |
| 3 | v-video-youtube | Home hero YouTube embed `0d6ahBtLavQ` | V | home (1/4) | embed-passthrough | self | pending | media as URL → `buildAutoBlocks` embed (same-src iframe; cancels in the pixel gate) | — | `https://www.youtube.com/embed/0d6ahBtLavQ` |
| 4 | m-usta-sites-dropdown | "USTA SITES" utility-bar dropdown (8 external links) | M | all (4/4) | rebuild-native | self | pending | chrome interaction in `blocks/header` (button + list, aria-expanded) | — | `.drop-down__label-wrapper` |
| 5 | m-mobile-nav | Hamburger menu at ≤767 (opens nav list + "VISIT OUR OTHER SITES" accordion) | M | all (4/4) | rebuild-native | self | pending | boilerplate header hamburger pattern re-skinned | — | `.top-navigation__logo-hamburger`, lift-home-360.json |
| 6 | x-auth-confirmation | `/en/home/confirmation.html` → client-side bounce to `account.usta.com/u/login` (Auth0) | X/A | confirmation | decided-out | needs-business-decision | decided-out | redirect row → `https://account.usta.com/` | owner: USTA identity — confirm the post-login return URL on the new host | pages/confirmation.json finalUrl |
| 7 | a-aem-settings | AEM runtime data (`/libs/granite/csrf/token.json`, `dict.en.json`, `segments.seg.js`, ContextHub, `data-*` personalisation attrs on containers) | A/D | all | decided-out | self | decided-out | none — CMS plumbing with no rendered consumer; host-bound on the target | — | `_dynamics.json` d-* rows; host-bound 2/2 |
| 8 | t-analytics-stack | Adobe Launch + Analytics/ECID/Target (demdex, omtrdc), Hotjar, Facebook pixel, Doubleclick, Everest, Bidtellect (bttrack), Simpli.fi, Basis, Sitescout, Lotame (crwdcntrl), GTM | T | all | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | `scripts/site-config.js` with the Launch property URL, disabled by default; enable per owner decision | owner: USTA marketing — which tags run on the new host | `_dynamics.json` t-* rows |
| 9 | t-consent-onetrust | OneTrust CMP (`cdn.cookielaw.org`, geolocation) | T | all | embed-passthrough | needs-credential | scaffolded-awaiting-owner | OneTrust script id in `site-config.js`, disabled until owner confirms domain script id for the new host | owner: USTA privacy | `_dynamics.json` |
| 10 | t-usablenet-a11y | UsableNet accessibility widget (`a42cdn.usablenet.com`; floating icon on confirmation page) | T | confirmation | decided-out | needs-business-decision | decided-out | — | — | detector |
| 11 | v-maps-csp-ping | `maps.googleapis.com/…/gen_204?csp_test` | V | all | decided-out | self | decided-out | side-effect of the USTA locationmanager clientlib; no map rendered on any page | — | detector |
| 12 | cr-vue-framework | Vue-rendered chrome (nav, lead-gen) | CR | all | rebuild-native | self | pending | covered by #1, #4, #5 — no blank capture (all text server-rendered or settled in capture) | — | `data-vue-root` |

## Decision batch

One message to the owner (USTA digital / marketing / privacy / identity):

1. **Lead-generation backend (#1, #2):** the endpoint the Vue widget posts to (inside the USTA proxy clientlib) and whether the new host may call it cross-origin, or a replacement (Marketo/SFMC form handler). Until then the forms render, validate and show "sign-up is not connected yet".
2. **Tags on the new host (#8, #9):** the Adobe Launch property to load, the OneTrust domain script id, and which pixels are still wanted. Shipped disabled in `scripts/site-config.js`.
3. **Identity (#6):** confirm that `/confirmation` should redirect to the USTA account login and what the return URL is.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| AEM runtime data (#7) | CMS plumbing; no rendered consumer | The migrated site has no CSRF token, i18n dictionary or ContextHub segments — nothing on the pages reads them. |
| confirmation page (#6) | identity flows are session-bound on account.usta.com | `/confirmation` is a redirect to the USTA account login; the site never renders a login UI itself. |
| Google Maps CSP ping (#11) | side-effect of a clientlib, no map on any page | Not migrated. |
| UsableNet widget (#10) | third-party a11y overlay on the external login page only | Not migrated; the migrated pages target native accessibility. |
