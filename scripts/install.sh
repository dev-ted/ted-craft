#!/usr/bin/env bash
# Deprecated: prefer `npx ted-craft add <slug> -a cursor -g -y`
# Thin wrapper installs all first-party skills + subagents from the local registry.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "ted-craft: use npx ted-craft add <slug> for selective installs."
echo "Falling back to full local sync from registry/first-party …"
echo ""

if command -v npx >/dev/null 2>&1; then
  cd "${REPO_ROOT}"
  if [[ -f registry/index.json ]]; then
    while IFS= read -r slug; do
      [[ -z "${slug}" ]] && continue
      npx --yes tsx packages/cli/src/cli.ts add "${slug}" -a cursor -g -y || true
    done < <(node -e "const i=require('./registry/index.json'); for (const x of i.items) if (x.sourceType==='first-party') console.log(x.slug)")
    echo ""
    echo "Done. Restart Cursor to pick up changes."
    exit 0
  fi
fi

# Legacy copy fallback
CURSOR_HOME="${HOME}/.cursor"
mkdir -p "${CURSOR_HOME}/skills" "${CURSOR_HOME}/agents"
for dir in "${REPO_ROOT}"/registry/first-party/*; do
  [[ -d "${dir}" ]] || continue
  name="$(basename "${dir}")"
  if [[ -d "${dir}/skill" ]]; then
    rm -rf "${CURSOR_HOME}/skills/${name}"
    cp -R "${dir}/skill" "${CURSOR_HOME}/skills/${name}"
    echo "  skill: ${name}"
  fi
  if [[ -d "${dir}/subagent" ]]; then
    for agent in "${dir}/subagent"/*.md; do
      [[ -f "${agent}" ]] || continue
      cp -f "${agent}" "${CURSOR_HOME}/agents/"
      echo "  agent: $(basename "${agent}")"
    done
  fi
done
echo ""
echo "Done. Restart Cursor to pick up changes."
