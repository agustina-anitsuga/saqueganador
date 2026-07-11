#!/usr/bin/env bash
# Bundle a Lambda function (inlining ./shared/*) and deploy it.
#
# Since functions now import from ../shared, they can no longer be deployed as
# raw .mjs files — esbuild bundles each index.mjs plus its shared imports into a
# single self-contained index.mjs, which is what gets zipped and uploaded.
#
# Usage:
#   ./deploy.sh <function-dir> [<function-dir> ...]   # bundle + deploy
#   ./deploy.sh --dry <function-dir> ...              # bundle only, no upload
#
# The AWS SDK (@aws-sdk/*) and Node built-ins stay external — they are provided
# by the nodejs22.x runtime, so we must not bundle them.
set -euo pipefail

cd "$(dirname "$0")"

# Locate an esbuild binary (repo-local; falls back to npx).
ESBUILD="$(command -v esbuild || true)"
for candidate in ../website/node_modules/.bin/esbuild ./node_modules/.bin/esbuild; do
  [ -x "$candidate" ] && ESBUILD="$candidate" && break
done
[ -n "$ESBUILD" ] || ESBUILD="npx --yes esbuild"

DRY=0
if [ "${1:-}" = "--dry" ]; then DRY=1; shift; fi
[ "$#" -ge 1 ] || { echo "usage: $0 [--dry] <function-dir> ..."; exit 1; }

for FN in "$@"; do
  FN="${FN%/}"
  [ -f "$FN/index.mjs" ] || { echo "SKIP $FN (no index.mjs)"; continue; }
  BUILD="/tmp/sg-build/$FN"
  rm -rf "$BUILD"; mkdir -p "$BUILD"

  $ESBUILD "$FN/index.mjs" \
    --bundle --platform=node --target=node22 --format=esm \
    --external:@aws-sdk/* \
    --outfile="$BUILD/index.mjs"

  ( cd "$BUILD" && rm -f ../"$FN".zip && zip -q "/tmp/sg-build/$(basename "$FN").zip" index.mjs )

  if [ "$DRY" = "1" ]; then
    echo "BUNDLED $FN ($(wc -c < "$BUILD/index.mjs" | tr -d ' ') bytes) — not deployed (--dry)"
  else
    status=$(aws lambda update-function-code \
      --function-name "$FN" \
      --zip-file "fileb:///tmp/sg-build/$(basename "$FN").zip" \
      --query 'LastUpdateStatus' --output text)
    aws lambda wait function-updated --function-name "$FN"
    echo "DEPLOYED $FN ($status)"
  fi
done
