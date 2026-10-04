# Archetype recreation brief — redballtennis.com replica (stardust:replica Phase 3 + 4)

You are recreating ONE page of https://www.redballtennis.com/ as a clean, standalone HTML/CSS
prototype that must measure near-identical to the live page. This is **recreation, not redesign**:
no taste, no improvements, no "cleanup" of the design. Any visual delta that is not in
`stardust/replica/inconsistency-register.md` (it is EMPTY — pure replica) is a defect.

Project root (run every command from here): `/Users/paolo/stardust/2026-08/redballtennis/sdt-redballtennis`
Static server already running: `http://localhost:8793/` serves the project root
(verify with `lsof -nP -iTCP:8793 -sTCP:LISTEN`; if it is gone: `nohup python3 -m http.server 8793 --bind 127.0.0.1 >/tmp/rbt-http.log 2>&1 &`).

## Your page

| slug | live URL | prototype file | page CSS |
|---|---|---|---|
| `<slug>` | see the task message | `stardust/prototypes/<slug>-proposed.html` | `stardust/prototypes/<slug>.css` |

Prototype URL under the server: `http://localhost:8793/stardust/prototypes/<slug>-proposed.html`

## Inputs (read these — do NOT re-scrape the live site for content)

- `stardust/current/pages/<slug>.json` — captured record: `title`, `description`, `headings[]`
  (`{tag,text}`), `body[]` (block-level text nodes in order), `ctas[]` (`{label,href}`),
  `links[]`, `media.imgs[]`, `media.cssBackgrounds[]`. **Every string in the prototype comes from
  here or from the rendered DOM below, verbatim.**
- `stardust/current/pages/<slug>.html` — the settled rendered DOM of the live page (parse offline
  for structure, wrapping elements, inline styles, `<b>`/`<span>` splits, image `src`/`alt`,
  href targets, hidden nodes). Search it with node/grep; never paste it.
- `stardust/current/assets/screenshots/<slug>.png` — full-page 1440 capture (ground truth for
  composition). View it with the Read tool.
- `stardust/replica/capture/lift-<slug>-1440.json` and `lift-<slug>-360.json` — computed styles
  per visible element (`rect:[x,y,w,h]` in page coords, `s:{fontFamily,fontSize,…,paddingTop,…}`,
  `::before/::after`). This is the primary geometry source. `docHeight` is the live doc height.
- `stardust/replica/capture/css/ALL-RULES.txt` — the source site's CSS split one rule per line
  (14k rules). `grep -E '\.classname' stardust/replica/capture/css/ALL-RULES.txt` gives the
  authored rule (padding utilities like `.padding-top-medium`, `.horizontal-bottom-red-stripe`,
  `.button-core`, `.cmp-text`, `.aem-Grid--default--7`, `@media` breakpoints). **Fidelity values
  come from here, not from your eye.**
- `stardust/current/assets/media/` — every image already downloaded (basename + 6-char hash).
  Reference them as `/stardust/current/assets/media/<file>` (root-relative; the server root is the
  project root). Find the file for a live URL by basename (e.g. `hand-with-ball-*.png`).
- `stardust/current/assets/fonts/` — Graphik-Regular-App.woff2, Graphik-Semibold-App.woff2,
  GraphikXXCondensed-Bold-App.woff2, USTASans-Bold.otf.
- `stardust/canon/` — the SHARED layer, already authored: `fonts.css` (@font-face with the exact
  live family names "Graphik Regular", "Graphik Semibold", "Graphik XXCond Bold", "USTA Sans" —
  all `font-weight: normal`), `canon.css` (tokens, base, chrome, buttons, band utilities),
  `header.html`, `footer.html`. **Include them; do not fork them.** Only the `home` agent may edit
  canon files (it is the canon author). Every other agent records chrome deltas it finds in its
  final report instead of editing canon.
- `DESIGN.md` / `DESIGN.json` (root) — descriptive current-state spec (tokens, type ramp).
- Method references (read the sections you need):
  `/Users/paolo/.claude/plugins/cache/adobe-skills/stardust/0.21.1/skills/replica/reference/recreation-procedure.md`
  `/Users/paolo/.claude/plugins/cache/adobe-skills/stardust/0.21.1/skills/replica/reference/source-fidelity-gate.md`

## Prototype shape (mandatory)

```html
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…verbatim live title…</title><meta name="description" content="…verbatim…">
<link rel="icon" href="/stardust/current/assets/favicon.ico">
<link rel="stylesheet" href="/stardust/canon/fonts.css">
<link rel="stylesheet" href="/stardust/canon/canon.css">
<link rel="stylesheet" href="/stardust/prototypes/<slug>.css">
</head><body class="redball-editable-page">
<header class="site-header"> …paste the CONTENT of stardust/canon/header.html verbatim (set the
  active nav link + breadcrumb trail for this page exactly as the live page does)… </header>
<main class="container responsivegrid full-width--root page-<slug>"> …your sections… </main>
<footer class="site-footer"> …paste stardust/canon/footer.html verbatim… </footer>
</body></html>
```

- `main.container.responsivegrid.full-width--root` is the content root — the gate scopes BOTH sides with
  `--main ".container.responsivegrid.full-width--root"` (on live, `querySelector` returns the outermost content
  container right after the header). Nothing else in your document may carry that class pair
  before `<main>`.
- Sections: semantic `<section class="band band--<name>" data-section="<name>">` wrappers with
  BEM-ish classes; **`display: flow-root` on every section wrapper** (AEM-classic clearfix
  containment — margins do not collapse on live).
- Every section that carries `horizontal-bottom-red-stripe` on live gets `class="band red-stripe"`
  (canon.css implements the exact ::after rule: 16px `#c80f2f`, `bottom: 8px`, container
  `padding-bottom: 8px`).
- **Mobile is its own authoring pass.** Lift geometry at 360 from `lift-<slug>-360.json` and the
  source `@media(max-width:767px)` / `(max-width:639px)` rules; do not shrink desktop.
- Lift the sizing MODEL, not the resolved px: AEM grid columns are percentages
  (`aem-GridColumn--default--7` = 58.33%, offsets = `margin-left: N/12*100%`). Where a width scales
  with the viewport on live, encode the % rule. The chrome max-width is 1440px.

## Content rules (content-diff measures these)

1. **Verbatim text**; paragraphs from the source's block nodes (never split on newlines).
2. **Role parity — mirror the live wrapping element per string**: `<h1>`/`<h2>`/`<h4>` levels as
   live; CTAs are `<a>` (not `<button>`) except the form submit which IS a `<button>`; the
   sub-head is `<b>` containing `<span>RED</span>RAW THE LINES` (mirror the span split); card copy
   is `<p>` with the live inline `style` semantics reproduced in CSS.
3. **Granularity parity**: mirror inner spans and `<b>` splits; reproduce hidden nodes that live
   carries inside the content root (e.g. `phe-block` spacer divs are empty — you may drop empty
   elements; keep hidden TEXT nodes hidden, not deleted).
4. **AEM richtext byte patterns are load-bearing**: `<p>&nbsp;</p>`, `<br>` inside headings, a
   trailing `&nbsp;` — reproduce as captured when they render height.
5. Images: same `src` basename (local file), same `alt` (empty `alt=""` stays empty), same
   intrinsic size; the YouTube embed is the SAME `<iframe src="https://www.youtube.com/embed/0d6ahBtLavQ">`
  (same-src cancels out in the pixel diff).
6. Forms: reproduce controls exactly (labels with the red `*` span, `<input type="text">` with
   the live ids, the disabled `<button>` "*JOIN THE FUN"). No wiring.
7. No `text-wrap: balance`. No shadows/gradients unless the lift shows them. No new hues.

## Gate (run ALL, per breakpoint 1440 then 360; hard cap 3 iterations per breakpoint)

```bash
W=1440   # then 360
S=<slug>; LIVE="<live URL>"; PROTO="http://localhost:8793/stardust/prototypes/$S-proposed.html"
G="stardust/replica/gates/$S-$W"; mkdir -p "$G"
# 1 structural (live hit) — milestones only: iteration 1, after any markup change, final
node scripts/diff/content-diff.mjs "$LIVE" "$PROTO" --profile generic --width $W --main ".container.responsivegrid.full-width--root" --dismiss | tee "$G/content-diff-iter1.txt"
# 2 visual heuristics (live hit) — same milestones
node scripts/diff/visual-diff.mjs "$LIVE" "$PROTO" --profile generic --width $W --main ".container.responsivegrid.full-width--root" --dismiss --out "$G/vdiff" | tee "$G/visual-diff-iter1.txt"
# 3 pixel — live capture ONCE per breakpoint, prototype re-captured every iteration
[ -f "$G/live.png" ] || node scripts/replica/stitch-shot.mjs "$LIVE" "$G/live.png" --width $W --settle
node scripts/replica/stitch-shot.mjs "$PROTO" "$G/proto.png" --width $W
node scripts/replica/pixel-compare.mjs "$G/live.png" "$G/proto.png" --out "$G/diff-iter1.png" --threshold 10 | tee "$G/pixel-iter1.txt"
# 4 section anchors (build side is free; live side once per fix round at most)
node scripts/replica/anchor.mjs "$LIVE"  --width $W --main ".container.responsivegrid.full-width--root" > "$G/anchor-live.txt"
node scripts/replica/anchor.mjs "$PROTO" --width $W --main ".container.responsivegrid.full-width--root" > "$G/anchor-proto-iter1.txt"
# 5 chrome parity (live hit) BEFORE any pixel round on chrome, then crop gates on the SAME pngs
node scripts/replica/chrome-parity.mjs "$LIVE" "$PROTO" --width $W --no-defaults \
  --region header=".cmp-experiencefragment--header-xf|header" --region footer=".cmp-experiencefragment--footer-xf|footer" | tee "$G/chrome-parity-iter1.txt"
node scripts/replica/crop-compare.mjs "$G/live.png" "$G/proto.png" --y 0 --height <headerH> --out "$G/chrome-header-diff.png"
node scripts/replica/crop-compare.mjs "$G/live.png" "$G/proto.png" --y <liveDocH-footerH> --y-b <protoDocH-footerH> --height <footerH> --out "$G/chrome-footer-diff.png"
# row-level instruments when a band stays hot (no live hit)
node scripts/replica/row-profile.mjs "$G/live.png" "$G/proto.png" --columns 7
node scripts/replica/row-profile.mjs "$G/live.png" "$G/proto.png" --color '#c80f2f'
```

Header height on live: 195px at 1440 (60 utility + 105 main + 30 breadcrumb), 74px at 360
(44 + 30). Footer: 242px at 1440, 319px at 360 (read exact values off the anchor output).

**Pass bar (per breakpoint):** content-diff 0 structural 🔴 (🟡/🟠 justified in the ledger);
visual-diff flags none/justified; pixel ≤ 10% with every >15% band explained; |height Δ| ≤ 8px;
header crop ≤ 2% and footer crop ≤ 2%. Fix the FIRST hot band top-down (everything below it is
offset-contaminated); every fix cites the instrument line that demanded it; before counting an
iteration, verify the differing-pixel count actually moved. After 3 iterations: log residuals
with band, %, cause, and who inherits them — then stop.

If the pixel probe reports `scroll stall` or a challenge (exit 3), record it as gate-blocked and
rely on the other probes — never fake a number.

## Interaction parity (REQUIRED after the static gate passes — observed, never inferred)

```bash
node scripts/replica/motion-observe.mjs "$LIVE" "stardust/replica/motion/$S.json" --width 1440 \
  --hover ".button-core" --hover ".navigation-menu__list-item-link--level-1" --hover ".footer-links__sites a" \
  --click ".drop-down__label-wrapper"
node scripts/replica/motion-observe.mjs "$LIVE" "stardust/replica/motion/$S-360.json" --width 360 --click ".top-navigation__logo-hamburger"
```

Implement ONLY behaviours that measurably fired (hover diffs with changed properties, class
mutations, header timeline states), with the measured values; the source CSS supplies exact
keyframe/transition values for fired behaviours. Dead classes = not implemented. Chrome behaviours
(dropdown, hamburger) belong to canon — the `home` agent implements them in
`stardust/canon/canon.css` + `stardust/canon/chrome.js` (vanilla, a few lines, same class-state
machine as live); other agents record "fired / not fired" in their report. Re-run pixel-compare
after adding motion — the number must return to the gated value.

## Ledger — write your entry to `stardust/replica/progress.<slug>.json`

```json
{ "pageType": "<type>", "archetype": "<slug>", "liveUrl": "…", "prototype": "stardust/prototypes/<slug>-proposed.html",
  "breakpoints": { "1440": { "iterations": N, "result": { "structuralRed": 0, "visualFlags": "…", "pixelPct": 0.0, "heightDelta": 0, "headerCropPct": 0.0, "footerCropPct": 0.0, "pass": true },
      "justified": [ { "probe": "content|visual|pixel", "flag": "…", "why": "…" } ],
      "residuals": [ { "band": "y a–b", "pct": 0.0, "cause": "…", "flaggedFor": "delivery|user" } ],
      "captureState": [] }, "360": { … } },
  "motion": { "observed": ["…"], "implemented": ["…"], "dead": ["…"] },
  "chromeDeltas": ["…only if you are not the home agent…"],
  "portations": [], "notes": ["…anything a maintainer of the stardust plugin should know (instrument bugs, doc gaps)…"] }
```

## Hard constraints

- Never edit `stardust/state.json`, `stardust/status.jsonl`, `stardust/journal.md`, or commit.
- Never edit files under `scripts/` (the instruments). If an instrument measures falsely, say so
  in `notes` with the evidence and work around it in the prototype, never by patching the tool.
- Never fetch the live site for content (only the gate instruments navigate it; budget ≈ 1 live
  hit per instrument per breakpoint per full gate run).
- Never paste the live DOM or port page-level CSS; per-section CSS portation only for paint effects
  the computed lift cannot express, logged under `portations`.
- Keep going until the gate passes or the 3-iteration cap is spent at BOTH breakpoints; then
  write the ledger and return a short report: metrics table per breakpoint, residuals, justified
  flags, motion inventory, chrome deltas, files written.
