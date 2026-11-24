#!/bin/sh
# Watches BRANCH of REPO and calls a Portainer stack webhook whenever the
# branch head changes. Runs in a tiny container next to the app stack.
set -u

: "${REPO:?REPO is required}"
: "${BRANCH:?BRANCH is required}"
: "${WEBHOOK_URL:?WEBHOOK_URL is required}"
INTERVAL="${INTERVAL:-180}"

apk add --no-cache git curl >/dev/null 2>&1 || true

state=/state/sha

fetch_sha() {
  git ls-remote "https://github.com/$REPO" "refs/heads/$BRANCH" | cut -f1
}

if [ ! -f "$state" ]; then
  first=$(fetch_sha)
  echo "$(date -u +%FT%TZ) baseline ${first:-none}"
  if [ -n "$first" ]; then
    echo "$first" >"$state"
  fi
fi

while :; do
  sleep "$INTERVAL"
  sha=$(fetch_sha)
  last=$(cat "$state" 2>/dev/null || echo none)

  if [ -n "$sha" ] && [ "$sha" != "$last" ]; then
    code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$WEBHOOK_URL")
    echo "$(date -u +%FT%TZ) new commit $sha webhook=$code"
    case "$code" in
      2*) echo "$sha" >"$state" ;;
    esac
  else
    echo "$(date -u +%FT%TZ) unchanged ${sha:-unknown}"
  fi
done
