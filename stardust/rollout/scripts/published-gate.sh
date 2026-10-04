#!/bin/bash
# published-origin pixel gate: deployed page vs the live capture (cached live.png from the prototype gate)
set -u; NODE=$(command -v node); HOST="https://main--sdt-redballtennis--aemcoder.aem.page"
for pair in "home::index.html" "play:play:play/index.html" "host:host:host/index.html" "404:404:404/index.html"; do IFS=: read -r s path out <<< "$pair"
  for W in 1440 360; do G="stardust/replica/gates/published-$s-$W"; /bin/mkdir -p "$G"
    $NODE scripts/replica/stitch-shot.mjs "$HOST/$path" "$G/deployed.png" --width $W >/dev/null 2>&1
    ( $NODE scripts/replica/pixel-compare.mjs "stardust/replica/gates/$s-$W/live.png" "$G/deployed.png" --out "$G/diff.png" --threshold 10 > "$G/pixel.txt" 2>&1 & pid=$!; ( /bin/sleep 150; /bin/kill $pid 2>/dev/null ) & w=$!; wait $pid 2>/dev/null; /bin/kill $w 2>/dev/null )
    printf '%s@%s: %s\n' "$s" "$W" "$(/usr/bin/grep -E 'height delta|differing' "$G/pixel.txt" | /usr/bin/tr '\n' ' ' | /usr/bin/sed -E 's/  +/ /g')"
    /usr/bin/grep -E '◄◄|[0-9]+\.[0-9]%$' "$G/pixel.txt" | /usr/bin/awk '$NF+0 > 15 {print "   hot:", $0}'
  done
done
