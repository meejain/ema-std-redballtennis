# ⚠️ FONT LICENSING — confirm before going live on aem.live

| file | family (as declared) | foundry | status |
|---|---|---|---|
| Graphik-Regular-App.woff2 | "Graphik Regular" | Commercial Type (Graphik) | **licence held by USTA for redballtennis.com; embedding on the new host must be confirmed** |
| Graphik-Semibold-App.woff2 | "Graphik Semibold" | Commercial Type (Graphik) | same |
| GraphikXXCondensed-Bold-App.woff2 | "Graphik XXCond Bold" | Commercial Type (Graphik Compact/XXCondensed) | same |
| USTASans-Bold.woff2 | "USTA Sans" | USTA proprietary | declared on the source, not observed in use; ship for parity |

Source of the files: the live site's own first-party clientlib
(`/etc.clientlibs/redball/components/structure/page/clientlibs/resources/fonts/`), captured 2026-09-17.
Decision record: `stardust/direction.md § Named assumptions #3`; open decision #1 in `MIGRATION-PLAN.md`.

**Remove path** (if the licence cannot be confirmed): delete the four files and their `@font-face`
rules in `styles/fonts.css`; every stack in `styles/styles.css` names a metric-matched local fallback
second (`graphik-fallback`, `graphik-xxcond-fallback` → Arial / Arial Narrow), so the site keeps its
metrics and falls back to system faces. The recreation's pixel gate will then report a permanent
justified font residual.
