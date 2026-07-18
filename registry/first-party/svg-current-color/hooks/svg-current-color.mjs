#!/usr/bin/env node
/**
 * SVG currentColor normalizer (Cursor afterFileEdit hook).
 *
 * Threat model: local-only. Reads stdin JSON from Cursor, and may rewrite a
 * single .svg file under a workspace root. No network, no shell, no eval.
 * Preserves fill="none" and values already set to currentColor.
 */
import { readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve, sep } from "node:path";

const RESERVED = new Set(["none", "currentcolor", "currentColor"]);
const MAX_BYTES = 2 * 1024 * 1024;

/**
 * @param {unknown} input
 * @returns {string | null}
 */
function resolveFilePath(input) {
  if (!input || typeof input !== "object") return null;
  const raw = /** @type {{ file_path?: unknown }} */ (input).file_path;
  if (typeof raw !== "string" || !raw.trim()) return null;
  if (isAbsolute(raw)) return resolve(raw);
  const roots = /** @type {{ workspace_roots?: unknown }} */ (input).workspace_roots;
  const root = Array.isArray(roots) && typeof roots[0] === "string" ? roots[0] : null;
  return root ? resolve(join(root, raw)) : resolve(raw);
}

/**
 * @param {string} filePath
 * @param {unknown} input
 * @returns {boolean}
 */
function isInsideWorkspace(filePath, input) {
  const roots = /** @type {{ workspace_roots?: unknown }} */ (input).workspace_roots;
  if (!Array.isArray(roots) || roots.length === 0) return false;

  let realFile;
  try {
    // Follows symlinks — rejects targets outside the workspace.
    realFile = realpathSync(filePath);
  } catch {
    // Missing path: jail on the lexical absolute path.
    realFile = resolve(filePath);
  }

  for (const root of roots) {
    if (typeof root !== "string" || !root.trim()) continue;
    let realRoot;
    try {
      realRoot = realpathSync(root);
    } catch {
      realRoot = resolve(root);
    }
    const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep;
    if (realFile === realRoot || realFile.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} value
 */
function isReserved(value) {
  return RESERVED.has(value.trim());
}

/**
 * @param {string} svg
 */
function normalizeSvgColors(svg) {
  let result = svg;

  result = result.replace(
    /\bstroke=(["'])([^"']*)\1/gi,
    (_, quote, value) =>
      isReserved(value) ? `stroke=${quote}${value}${quote}` : 'stroke="currentColor"',
  );

  result = result.replace(
    /\bfill=(["'])([^"']*)\1/gi,
    (_, quote, value) =>
      isReserved(value) ? `fill=${quote}${value}${quote}` : 'fill="currentColor"',
  );

  result = result.replace(
    /\bstroke:\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|[a-z]+)\s*(;|(?=\s|"))/gi,
    (match, color, tail) =>
      isReserved(color) ? match : `stroke:currentColor${tail}`,
  );

  result = result.replace(
    /\bfill:\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|[a-z]+)\s*(;|(?=\s|"))/gi,
    (match, color, tail) =>
      isReserved(color) ? match : `fill:currentColor${tail}`,
  );

  return result;
}

function main() {
  try {
    const input = JSON.parse(readFileSync(0, "utf8"));
    const filePath = resolveFilePath(input);

    if (!filePath || !filePath.toLowerCase().endsWith(".svg")) {
      process.exit(0);
    }

    if (!isInsideWorkspace(filePath, input)) {
      process.exit(0);
    }

    let st;
    try {
      st = statSync(filePath);
    } catch {
      process.exit(0);
    }

    if (!st.isFile() || st.size > MAX_BYTES) {
      process.exit(0);
    }

    const before = readFileSync(filePath, "utf8");
    const after = normalizeSvgColors(before);

    if (after !== before) {
      writeFileSync(filePath, after, "utf8");
    }
  } catch {
    // Fail closed: never break the agent loop.
  }

  process.exit(0);
}

main();
