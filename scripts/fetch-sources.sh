#!/usr/bin/env bash
# Downloads each data source at its pinned commit into .cache/sources/<id>.
# Only the files listed in scripts/data/sources.json are checked out.
set -euo pipefail
cd "$(dirname "$0")/.."
CACHE=.cache/sources
mkdir -p "$CACHE"
node -e '
const s = require("./scripts/data/sources.json").sources.filter(x => x.repo);
for (const x of s) console.log([x.id, x.repo, x.commit, ...x.paths].join("\u001f"));
' | while IFS=$'\x1f' read -r -a parts; do
  id="${parts[0]}"; repo="${parts[1]}"; commit="${parts[2]}"; paths=("${parts[@]:3}")
  dir="$CACHE/$id"
  if [ -f "$dir/.fetched-$commit" ]; then echo "✓ $id (cached)"; continue; fi
  rm -rf "$dir"; mkdir -p "$dir"
  git -C "$dir" init -q
  git -C "$dir" remote add origin "$repo"
  git -C "$dir" sparse-checkout set --no-cone "${paths[@]}"
  git -C "$dir" fetch -q --depth 1 --filter=blob:none origin "$commit"
  git -C "$dir" checkout -q FETCH_HEAD
  touch "$dir/.fetched-$commit"
  echo "✓ $id @ ${commit:0:7}"
done
