---
name: Red Ball Tennis
description: Loud USTA campaign microsite — condensed red-and-blue display type, sticker photos, one idea per band
colors:
  usta-red: "#C80F2F"
  royal-blue: "#0A2396"
  footer-blue: "#092396"
  link-blue: "#0357B8"
  ink: "#000000"
  body-grey: "#333333"
  paper: "#FFFFFF"
  rule-grey: "#808080"
  field-border: "#565656"
  disabled-grey: "#A8A8A8"
  disabled-text: "#6D7278"
  hover-lime: "#CFFF05"
typography:
  display:
    fontFamily: "Graphik XXCond Bold, Impact, 'Arial Narrow', sans-serif"
    fontSize: "100px"
    fontWeight: 500
    lineHeight: 1.1
  headline:
    fontFamily: "Graphik XXCond Bold, Impact, 'Arial Narrow', sans-serif"
    fontSize: "76px"
    fontWeight: 500
    lineHeight: 1.1
  title:
    fontFamily: "Graphik XXCond Bold, Impact, 'Arial Narrow', sans-serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: 0.9
  subhead:
    fontFamily: "Graphik Regular, Tahoma, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "24px"
  lede:
    fontFamily: "Graphik Regular, Tahoma, sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "34px"
  card:
    fontFamily: "Graphik Semibold, Tahoma, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "24px"
  body:
    fontFamily: "Graphik Regular, Tahoma, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "22px"
  label:
    fontFamily: "Graphik Semibold, Tahoma, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0"
  nav:
    fontFamily: "Graphik Semibold, Tahoma, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "25px"
    letterSpacing: "0.8px"
rounded:
  pill: "9999px"
  circle: "50%"
  none: "0px"
spacing:
  band-sm: "20px"
  band-md: "40px"
  band-lg: "60px"
  gutter: "45px"
components:
  button-primary:
    backgroundColor: "{colors.royal-blue}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "18px 60px"
  button-inverse:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "18px 60px"
  button-red:
    backgroundColor: "{colors.usta-red}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "18px 60px"
  button-black:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "18px 60px"
  button-form-submit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "56px"
    width: "280px"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "50px"
---

# Design System: Red Ball Tennis (current state — descriptive)

_provenance: written by stardust:extract from computed styles lifted off the live pages at 1440 and 360 (stardust/replica/capture/lift-*.json), the captured page records, and the screenshots. Nothing here is authored; every value cites a live element. Replica promotes this file verbatim._

## Overview

**Creative North Star: "The Street-Campaign Poster"**

Red Ball Tennis is a one-message-per-band campaign site. Each full-width band carries a single
condensed headline, at most one paragraph and one pill button, and hands off to the next band
across a thin USTA-red rule. The typography does the shouting: 100px condensed capitals in red
or royal blue over generous white, with 32px body copy in heroes. Photography is treated as
props, not backdrop — tilted white-framed snapshots with hand-painted sticker labels (PLAY /
HOST / ON THE COURT / IN THE WILD) sitting on a wall of blue tennis balls, a cut-out hand
holding two balls, red diagonal court lines as a vector motif.

The system is flat and loud. There are no shadows, no gradients, no card surfaces; depth comes
from the photographic props and from stacking a white band on a blue band on a red rule.

**Key Characteristics:**
- Two brand colours (USTA red, royal blue) plus black and white; nothing else carries meaning.
- Condensed display type at very large sizes; everything else in Graphik Regular / Semibold.
- Full-width horizontal bands separated by a 6px red rule (`horizontal-bottom-red-stripe`).
- Pill buttons (9999px radius), uppercase Semibold 18px labels.
- Photos as tilted framed props; the blue tennis-ball wall as the signature ground.
- Identical chrome on every page: USTA utility bar, blue nav, breadcrumb strip; blue footer.

## Colors

Two saturated brand colours over black/white; greys appear only in form furniture.

### Primary
- **USTA Red** (#C80F2F — computed `rgb(200,15,47)`; the same hue also appears as `rgb(200,16,46)` on form asterisks and `rgb(200,15,46)` on the Play "Find a court" button): the H1, the "RED" wordplay spans, the band separator rule, the red buttons on Play, the red diagonal-lines motif.

### Secondary
- **Royal Blue** (#0A2396 — `rgb(10,35,150)`): nav bar ground, H2 headlines, hero sub-heads, the primary "Shop Now" button, the blue-balls band tint. The footer uses an authored `#092396`, one unit off, and is kept as authored.
- **Link Blue** (#0357B8 — `rgb(3,87,184)`): inline text links in the legal copy under forms; also the inherited colour of image links (invisible).

### Neutral
- **Ink** (#000000): body copy on white, card-band body on white cards, form labels, the black submit and 404 buttons.
- **Body Grey** (#333333): the inherited document colour on `body` — visible only where components don't set their own colour.
- **Paper** (#FFFFFF): page ground, text on blue, inverse buttons.
- **Rule Grey** (#808080): `<hr>` separators (all transparent-bordered spacers in practice).
- **Field Border** (#565656): text-input 1px border.
- **Disabled Grey** (#A8A8A8 ground, #6D7278 text — `.button-core[disabled]`): the disabled "*JOIN THE FUN" submit before both fields validate.
- **Hover Lime** (#CFFF05): nav-link and footer-link hover colour only.

### Named Rules
**The Two-Colour Rule.** Red says "Red Ball"; blue says "USTA". Every headline is one or the other. Black is for reading, white is for ground. The only third hue CSS introduces is the hover lime (#CFFF05 — nav links and footer links on `:hover`, lifted from `.red-ball-colors` rules); at rest the yellow-green of the HOST sticker and the logo's "tennis" script live only inside image assets.

## Typography

**Display Font:** Graphik XXCond Bold (self-hosted woff2; fallback Impact / Arial Narrow)
**Body Font:** Graphik Regular and Graphik Semibold (two separate self-hosted faces, both declared `font-weight: normal`; weight is chosen by switching family, not by `font-weight`)
**Legacy face:** USTA Sans Bold (declared, not observed on any migrated page)

**Character:** A compressed, all-caps display face at poster scale against a neutral grotesque for everything else. The pairing is a sports-brand staple; the scale is what makes it feel like a campaign.

### Hierarchy (values as computed at 1440; 360 in parentheses)
- **Display / H1** (Graphik XXCond Bold, 100px / 110px line, computed weight 500): page hero title, red on Home ("Red Ball Tennis"), blue on Play / Host. (360: 54px / 59.4px.)
- **Headline / H2** (Graphik XXCond Bold, 76px / 83.6px, blue or red): band titles "REDESIGNED FOR YOU", "WHAT YOU NEED TO PLAY", "WHERE TO PLAY". Centered.
- **Title / H4** (Graphik XXCond Bold, 56px / 50.5px, black): form titles "RED IS IN. ARE YOU?", "Interested in hosting Red Ball Tennis?"; the 404 headline.
- **Sub-head** (Graphik Regular 36px, rendered `<b>` weight 700, 24px line): "REDRAW THE LINES" with the "RED" span in red.
- **Lede** (Graphik Regular 32px / 34px, black): hero paragraphs.
- **Card copy** (Graphik Semibold 20px / 24px, white on the blue band).
- **Body** (Graphik Regular 16px / 22px): legal copy under forms; footer-adjacent text.
- **Label / Button** (Graphik Semibold 18px / 20px, uppercase; the form submit adds 1px letter-spacing).
- **Nav** (Graphik Semibold 16px / 25px, uppercase, 0.8px letter-spacing, white). Utility bar label 14px, computed weight 900. Breadcrumb 12px uppercase Graphik Regular.

### Named Rules
**The Family-Is-Weight Rule.** Weight changes are family changes (`Graphik Regular` → `Graphik Semibold`), so a `<b>` inside Graphik Regular renders faux-bold at weight 700 — that is the live rendering of "REDRAW THE LINES" and "Get the official racquet…" and must be reproduced, not "corrected".

## Layout

Full-width bands stacked vertically; `body` is 1440px wide at the gate width with no page max-width. Inside a band, the AEM 12-column grid places content: the Home hero text occupies columns 1–7 (750px wide, left edge at x=45) with the YouTube embed (450×300) right-aligned over the red-lines SVG; the promo band centres an H2 (1290px wide) + a Semibold sub-line + one pill button; the blue card band centres two 330px-wide columns (images 300px, copy 330px, pill CTAs) with ~210px between them; the form band is a 1310px column starting at x=65 with two 485px inputs and a 280×56 submit on one row. Vertical rhythm comes from AEM `padding-top/bottom-{small,medium}` utilities (20 / 40 / 60px) and the 6px red rule between bands.

At 360 the grid collapses to one column: hero text at x=12 (336px wide) with the prop image floated right at 68px wide; bands keep their padding; the two cards stack; the form inputs stack full-width; nav collapses to hamburger + mobile logo (60×44) at 44px bar height; the doc grows from 2510px to 3783px on Home.

Breakpoints observed in the shipped CSS: 639 / 767 / 768 / 991 / 992 / 1023 / 1024 / 1279 / 1280 / 1440 / 1920 (AEM `mobile` < 768, `tablet` 768–1023, `default` ≥ 1024).

## Elevation & Depth

Flat. No `box-shadow` on any element at either width; no gradients. Depth is photographic: the framed snapshots carry a painted drop shadow inside the PNG, and the blue-balls JPG provides texture behind the card band. The only overlay is the thin red rule.

**The No-Shadow Rule.** If a recreated element needs a shadow, the shadow belongs in the image asset, not in CSS.

## Shapes

Pills and circles only. Every button is a 9999px-radius pill; the Play page's icon holders are 50% circles with a 1px white ring; inputs and images are square-cornered (0px). The framed photos are rectangles rotated a few degrees inside their PNG.

## Components

### Buttons
- **Shape:** full pill (9999px).
- **Primary (blue):** royal blue ground, white uppercase Semibold 18px label, ~18px 60px padding, 165×56 on "Shop Now".
- **Inverse (white on blue band):** white ground, black label; 260×56 on the card CTAs.
- **Red:** USTA red ground, white label (Play "Find a court").
- **Black:** black ground, white label (404 "Take me back to the homepage", 450×56; form submit 280×56 with 1px tracking).
- **Hover / Focus:** `.button-core:hover { opacity: .7 }`; `:active` adds `drop-shadow(0 4px 4px rgba(0,0,0,.5))`; disabled = #A8A8A8 ground, #6D7278 text (source CSS; motion-observe confirms what fires).

### Inputs / Fields
- 485×50 white text inputs with 1px `#565656` border, 0px radius, no placeholder; label above in Semibold 14px uppercase with a red `*` prefix.
- Submit is disabled (grey) until both fields validate.

### Navigation
- **Utility bar:** black 45px bar; "USTA SITES" pill dropdown (white pill, black label 14px, chevron icon) listing 8 USTA properties.
- **Main bar:** royal blue, 100px tall at 1440; logo PNG (`red-ball-tennis-wbg.png`) at left (x≈40, 130px wide), three uppercase links HOME / PLAY / HOST from x=316 with ~50px gaps; the active page link carries a 2px white underline offset below the text.
- **Breadcrumb strip:** royal blue, 28px tall, 12px uppercase white "HOME > PLAY".
- **Mobile (≤767):** 44px blue bar, white hamburger icon at left, 60×44 mobile logo; the utility bar and links move into the hamburger panel.

### Footer
- Royal blue (#092396) band, ~200px tall: 100px logo at x=120, then "Terms & Conditions" and "Privacy Policy" in Semibold 18px white with −0.54px tracking on one row; a hidden "#redballtennis" line (display:none via `phe--display-none`).

### Signature: the framed-photo card
A 300px PNG that already contains the tilted white frame, the photo, the painted sticker label and its shadow; below it 330px of Semibold 20px white copy and an inverse pill CTA, all centred, on the blue-balls JPG ground.

## Do's and Don'ts

### Do:
- **Do** keep every band full-bleed with a 6px `#C80F2F` bottom rule where the source has `horizontal-bottom-red-stripe`.
- **Do** reproduce `<b>` inside Graphik Regular as faux-bold weight 700 (the live rendering).
- **Do** keep the card sticker labels inside the image assets; do not rebuild them in CSS.
- **Do** keep pill buttons at 56px height with the 18px Semibold uppercase label.

### Don't:
- **Don't** add shadows, gradients or a page max-width; the live site has none.
- **Don't** introduce a third hue or restyle the footer blue to match the nav blue (they differ by one unit and are kept as authored).
- **Don't** replace the YouTube embed with a poster image; it is a live same-src iframe.
