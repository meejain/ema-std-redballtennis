# Dynamic features plan — redballtennis.com

| phase | deliverables | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| D2-a (self) | `blocks/header` with USTA SITES dropdown + hamburger (#4, #5); YouTube embed via `buildAutoBlocks` (#3) | nav document `/nav` carries the utility links list, the logo and the three nav links as authored lists; the embed is a bare YouTube URL in the hero | parity.json: dropdown opens/closes (aria-expanded flips), hamburger opens at 360, iframe src present; published origin at 1440 + 360 | — | S |
| D2-b (interim) | `blocks/signup-form` (#1, #2): fields, red asterisks, client validation, disabled→enabled submit, "not connected" notice on submit | one block, rows: icon · title · subtitle · email label · zip label · submit label · legal rich-text; variant class `host` | parity.json: submit disabled with empty fields, enabled with valid email+zip; notice shown on click | endpoint (owner batch #1) | S |
| D2-c (scaffold) | `scripts/site-config.js` with Launch/OneTrust ids, disabled (#8, #9) | code-only | parity.json: no third-party requests on the published origin while disabled | owner batch #2 | XS |
| D2-d | redirect rows in `stardust/redirects.tsv` incl. `/confirmation` → account.usta.com (#6) | redirects sheet | verify.mjs + qa: 301s resolve | owner batch #3 | XS |
