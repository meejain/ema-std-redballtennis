---
_provenance:
  writtenBy: stardust:extract
  mode: descriptive (current state — not authored)
  writtenAt: 2026-09-17
  readArtifacts: [stardust/current/pages/*.json, stardust/current/_brand-extraction.json, stardust/current/assets/screenshots/*.png]
---

# Red Ball Tennis (redballtennis.com) — current state

## Register

`brand`. A single-purpose marketing microsite for a USTA program. Every page sells one idea
(play Red Ball Tennis / host Red Ball Tennis) and funnels to one of three actions: watch the
launch video, buy the official racquet, sign up for email.

## Users

_provenance: inferred from captured copy ("Whether you're new to the game, coming back after a
break, or just looking to get active")._

- Adults who are new to tennis, lapsed, or intimidated by the formal game.
- Social organizers: people who could run a league at a brewery, a team event at the office,
  or add a program at a tennis / pickleball facility (the Host page's audience).
- Facility operators looking to "fill gaps" with a lower-barrier program.

## Product Purpose

Recruit players and hosts for Red Ball Tennis, USTA's low-pressure format (slower red balls,
23-inch racquets, any hard surface, simplified scoring). Secondary: sell the co-branded HEAD
racquet ("Redesigned for you — Shop Now") and grow an email list ("Red is in. Are you?").

## Brand Personality

Loud, playful, confident, a little irreverent. Copy leans on wordplay ("REDraw the lines",
"Tennis REDesigned for you", "Red is in. Are you?", "Host with the most", "Share the love").
Visually: heavy condensed display type in USTA red and royal blue, hand-cut sticker-style labels
(PLAY / HOST pills that look like paint swipes), photos in tilted white "polaroid" frames on a
wall of blue tennis balls, a yellow-green highlighter accent. It reads like a street-campaign
poster, not an institution.

## Anti-references

_provenance: inferred from what the design avoids._ Not the corporate usta.com register (dense
navigation, grey utility UI), not a sports-federation rulebook, not a generic SaaS landing page.

## Design Principles (as observed)

1. **One idea per band.** Full-width horizontal bands separated by a thin red rule; each carries
   one message and at most one CTA.
2. **Two brand colours do all the work.** Red for identity and headline moments, royal blue for
   grounds and secondary type; black/white for everything else; yellow-green only as the HOST
   sticker.
3. **Display type is the hero.** 100px condensed headlines; body copy is large (32px in heroes).
4. **Photos are props.** Tilted, white-framed snapshots and cut-out objects (hand with ball),
   never full-bleed editorial photography (except the Host hero).
5. **Same chrome everywhere.** USTA "sites" utility bar → blue nav with logo + HOME / PLAY /
   HOST → breadcrumb; blue footer with logo + Terms & Conditions / Privacy Policy.

## Inventory

| slug | source URL | type | notes |
|---|---|---|---|
| home | /en/home.html (also /) | landing | hero + video, racquet promo band, Play/Host cards, newsletter form |
| play | /en/home/play.html | program | hero, promo band, tall red-ball photo band, how-to-play/score, what-you-need, where-to-play, newsletter form |
| host | /en/home/host.html | program | hero with photo, promo band, On-the-court/In-the-wild cards, host interest form |
| 404 | /en/home/404.html | static | badge, headline, back-home CTA |
| confirmation | /en/home/confirmation.html | unique | client-side bounce to account.usta.com login — external auth, not a content page |

Redirects (source 301): /en/home/free-racquet-pack.html → home; /en/home/stay-current/national/USTA-awards-wheelchair-tennis-grants.html → /.
