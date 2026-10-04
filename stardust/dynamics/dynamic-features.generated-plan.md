<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-09-17T15:37:51.855Z · input stardust/current/_dynamics.json (4 pages, 37 findings) · target probe https://main--sdt-redballtennis--aemcoder.aem.live -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 4/4 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-unknown-third-party-host-bttrack-com | A | unknown third-party host bttrack.com | 3/4 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-cms-app-settings-object-granite | A | CMS / app settings object Granite | 3/4 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 3/4 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | a-unknown-third-party-host-www-gstatic-com | A | unknown third-party host www.gstatic.com | 2/4 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-jnn-pa-googleapis-com | A | unknown third-party host jnn-pa.googleapis.com | 2/4 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/4 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | cr-client-framework-vue | CR | client framework vue | 3/4 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | d-first-party-data-file-get-libs-granite-csrf-token-json | D | first-party data file GET /libs/granite/csrf/token.json | 4/4 (reach 7/7) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 10 | d-first-party-data-file-get-libs-cq-i18n-dict-en-json | D | first-party data file GET /libs/cq/i18n/dict.en.json | 3/4 (reach 6/7) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 11 | f-form-c0d577f2f-no-action-js-wired-2-fields | F | form "c0d577f2f" → no action (JS-wired) (2 fields) | 1/4 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 12 | i18n-locale-variants-hc | I18N | locale variants hc | 1/4 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 13 | i18n-locale-variants-en | I18N | locale variants en | 1/4 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 14 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 3/4 | rebuild-native | self | pending | chrome-interaction | none (motion-observe evidence) |  |
| 15 | t-unknown-third-party-host-www-usta-com | T | unknown third-party host www.usta.com | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-unknown-third-party-host-cdn-bttrack-com | T | unknown third-party host cdn.bttrack.com | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-unknown-third-party-host-tag-simpli-fi | T | unknown third-party host tag.simpli.fi | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-analytics-session-replay | T | analytics: session replay | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-sync-crwdcntrl-net | T | unknown third-party host sync.crwdcntrl.net | 4/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-consent-onetrust | T | consent: OneTrust | 3/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 24 | t-unknown-third-party-host-www-google-com | T | unknown third-party host www.google.com | 2/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-yt3-ggpht-com | T | unknown third-party host yt3.ggpht.com | 2/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-ajax-googleapis-com | T | unknown third-party host ajax.googleapis.com | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-cdn01-basis-net | T | unknown third-party host cdn01.basis.net | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-www-google-ch | T | unknown third-party host www.google.ch | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-a42cdn-usablenet-com | T | unknown third-party host a42cdn.usablenet.com | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-pixel-sync-sitescout-com | T | unknown third-party host pixel-sync.sitescout.com | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-unknown-third-party-host-pixel-sitescout-com | T | unknown third-party host pixel.sitescout.com | 1/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | v-maps-embedded-map-service | V | maps: embedded map service | 4/4 | embed-passthrough | self | pending | media-as-url | none (player ids are public) |  |
| 34 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 3/4 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 35 | v-video-youtube | V | video: YouTube | 2/4 | embed-passthrough | self | pending | media-as-url | none (player ids are public) |  |
| 36 | x-auth-identity-provider | X | auth: identity provider | 1/4 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 37 | x-sign-in-account-links | X | sign-in / account links | 1/4 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 9 row(s) — read-settings, settled-dom-snapshot, sheet-sync, chrome-interaction, media-as-url.
- **One owner decision batch:** 26 row(s) — inspect the XHR, add a vendor row · production endpoint; interim capture ships now · scope of the locale trees · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 2 of 2 probed API paths — the off-origin data work.

## Phases

- **tags** — 18
- **detect** — 7
- **data** — 2
- **locale wave** — 2
- **media** — 2
- **register** — 2
- **capture** — 1
- **forms** — 1
- **interactive** — 1
- **embeds** — 1
