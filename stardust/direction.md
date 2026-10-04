---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-17T15:38:09Z
  againstInput: https://www.redballtennis.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
    - stardust/replica/capture/lift-*-{1440,360}.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.redballtennis.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-09-17T15:38:09Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation

Activated 2026-09-17T15:38:09Z by the user's instruction "proceed without asking for my input" for the whole
run (repo setup → replica → migrate → rollout). state.json.handsOff = true. Every interactive
gate auto-resolves per skills/stardust/SKILL.md § Hands-off mode; quality gates run unchanged.

## Named assumptions (hands-off)

1. **Flow = replica (keep the design).** The user said "migrate … to the final fidelity"; no
   redesign intent was expressed. replica → migrate → deploy/rollout; prepare-migration is not run.
2. **Scope = the whole site.** The user asked for "the 100 most visible pages"; discovery found 7
   URLs of which 4 render distinct pages (home, play, host, 404), 2 are 301 redirects to home and 1
   (confirmation) bounces client-side to the USTA account login on account.usta.com. All 4 real
   pages are migrated; the 2 redirects become redirect rows; confirmation is a dynamics
   decided-out row (external auth hand-off).
3. **Fonts: self-host the captured brand faces** (Graphik Regular / Semibold / XXCond Bold,
   USTA Sans) in the EDS repo. recreation-procedure.md § Fonts policy defaults to "substitute,
   never rehost" for commercial kits. Deviation rationale: the faces are first-party self-hosted
   on the source origin (no third-party kit, no domain lock), the site owner (USTA) holds the
   licence, and the user asked for final fidelity. The brand family names stay first in every
   stack so a substitute swap is a one-line fonts.css change. **Flagged as the first open decision
   for the user (MIGRATION-PLAN.md § Open decisions).**
4. **Volume caps** are moot (4 pages); every page is its own archetype, no siblings.
5. **Breakpoints** for the source-fidelity gate: 1440 and 360 (replica default).
6. **Project root = the EDS repo** (aemcoder/sdt-redballtennis clone), because deploy/rollout
   write blocks/, styles/, head.html at the repo root.
