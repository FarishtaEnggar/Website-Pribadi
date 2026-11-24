#!/bin/sh
# Watches BRANCH of REPO, waits for the CI-built image of that commit to appear
# in the registry, then calls a Portainer stack webhook to redeploy.
set -u

: "${REPO:?REPO is required}"
: "${BRANCH:?BRANCH is required}"
: "${WEBHOOK_URL:?WEBHOOK_URL is required}"
IMAGE="${IMAGE:-ghcr.io/farishtaenggar/website-pribadi}"
INTERVAL="${INTERVAL:-180}"

apk add --no-cache git curl >/dev/null 2>&1 || true

state=/state/sha
registry=${IMAGE#ghcr.io/}
accept="application/vnd.oci.image.manifest.v1+json,application/vnd.oci.image.index.v1+json,application/vnd.docker.distribution.manifest.v2+json"

fetch_sha() {
  git ls-remote "https://github.com/$REPO" "refs/heads/$BRANCH" | cut -f1
}

image_ready() {
  sha=$1
  attempt=0
  while [ "$attempt" -lt 40 ]; do
    token=$(curl -fsS "https://ghcr.io/token?scope=repository:${registry}:pull&service=ghcr.io" \
      | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
    if [ -n "$token" ]; then
      code=$(curl -sS -o /dev/null -w '%{http_code}' \
        -H "Authorization: Bearer $token" -H "Accept: $accept" \
        "https://ghcr.io/v2/${registry}/manifests/sha-${sha}")
      if [ "$code" = "200" ]; then
        return 0
      fi
    fi
    attempt=$((attempt + 1))
    sleep 30
  done
  return 1
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
    echo "$(date -u +%FT%TZ) new commit $sha, waiting for image sha-$sha"
    if image_ready "$sha"; then
      code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$WEBHOOK_URL")
      echo "$(date -u +%FT%TZ) image ready, webhook=$code"
      case "$code" in
        2*) echo "$sha" >"$state" ;;
      esac
    else
      echo "$(date -u +%FT%TZ) image for $sha not published, will retry"
    fi
  else
    echo "$(date -u +%FT%TZ) unchanged ${sha:-unknown}"
  fi
done
