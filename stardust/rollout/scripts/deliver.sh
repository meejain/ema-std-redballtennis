#!/bin/bash
# deliver.sh <slug:daPath:edsPath>... — sanitise → lint → PUT → preview → live → verify .plain.html
set -u; set -a; source /Users/paolo/.claude/.env; set +a
CURL=/usr/bin/curl; NODE=$(command -v node || echo /Users/paolo/.nvm/versions/node/v25.2.1/bin/node)
ORG=aemcoder; REPO=sdt-redballtennis; HOST="https://main--$REPO--$ORG.aem.page"
for pair in "$@"; do IFS=: read -r f da path <<< "$pair"
  $NODE scripts/deploy/sanitise.js "content/$f.html" >/dev/null 2>&1
  lint=$($NODE scripts/rollout/delivery-lint.mjs --file "content/$f.html" --path "$path" 2>&1 | /usr/bin/tail -1)
  put=$($CURL -s -o /dev/null -w '%{http_code}' -X PUT -H "Authorization: Bearer $DA_TOKEN" -F "data=@content/$f.html;type=text/html" "https://admin.da.live/source/$ORG/$REPO/$da.html")
  pre=$($CURL -s -o "/tmp/pre-$f.json" -w '%{http_code}' -X POST -H "Authorization: Bearer $DA_TOKEN" "https://admin.hlx.page/preview/$ORG/$REPO/main/$da")
  live=$($CURL -s -o /dev/null -w '%{http_code}' -X POST -H "Authorization: Bearer $DA_TOKEN" "https://admin.hlx.page/live/$ORG/$REPO/main/$da")
  plain=$($CURL -s --compressed "$HOST/$da.plain.html")
  printf '%s: lint[%s] PUT %s preview %s live %s | plain: %s about:error, %s img, %s h1, %sB\n' "$f" "$lint" "$put" "$pre" "$live" "$(printf '%s' "$plain" | /usr/bin/grep -c about:error)" "$(printf '%s' "$plain" | /usr/bin/grep -o '<img' | /usr/bin/wc -l | /usr/bin/tr -d ' ')" "$(printf '%s' "$plain" | /usr/bin/grep -o '<h1' | /usr/bin/wc -l | /usr/bin/tr -d ' ')" "$(printf '%s' "$plain" | /usr/bin/wc -c | /usr/bin/tr -d ' ')"
  [ "$pre" != "200" ] && /usr/bin/head -c 300 "/tmp/pre-$f.json" && echo
done
