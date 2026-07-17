#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CURSOR_HOME="${HOME}/.cursor"
SKILLS_DEST="${CURSOR_HOME}/skills"
AGENTS_DEST="${CURSOR_HOME}/agents"

echo "Installing from: ${REPO_ROOT}"
echo "Target: ${CURSOR_HOME}"

mkdir -p "${SKILLS_DEST}" "${AGENTS_DEST}"

if [[ -d "${REPO_ROOT}/skills" ]]; then
  for skill in "${REPO_ROOT}/skills"/*; do
    [[ -d "${skill}" ]] || continue
    name="$(basename "${skill}")"
    rm -rf "${SKILLS_DEST}/${name}"
    cp -R "${skill}" "${SKILLS_DEST}/${name}"
    echo "  skill: ${name}"
  done
fi

if [[ -d "${REPO_ROOT}/agents" ]]; then
  for agent in "${REPO_ROOT}/agents"/*.md; do
    [[ -f "${agent}" ]] || continue
    cp -f "${agent}" "${AGENTS_DEST}/"
    echo "  agent: $(basename "${agent}")"
  done
fi

echo ""
echo "Done. Restart Cursor to pick up changes."
