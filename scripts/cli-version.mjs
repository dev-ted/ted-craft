#!/usr/bin/env node
/**
 * Bump packages/cli/package.json version without npm workspace reify.
 * Usage: node scripts/cli-version.mjs <patch|minor|major>
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(root, "packages", "cli", "package.json");
const bump = process.argv[2];

if (bump !== "patch" && bump !== "minor" && bump !== "major") {
  console.error("Usage: node scripts/cli-version.mjs <patch|minor|major>");
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const current = pkg.version;
const match = /^(\d+)\.(\d+)\.(\d+)(?:-.*)?$/.exec(current);
if (!match) {
  console.error(`Invalid version in packages/cli/package.json: ${current}`);
  process.exit(1);
}

let major = Number(match[1]);
let minor = Number(match[2]);
let patch = Number(match[3]);

switch (bump) {
  case "major":
    major += 1;
    minor = 0;
    patch = 0;
    break;
  case "minor":
    minor += 1;
    patch = 0;
    break;
  case "patch":
    patch += 1;
    break;
  default: {
    const _exhaustive = bump;
    throw new Error(`Unhandled bump: ${_exhaustive}`);
  }
}

const next = `${major}.${minor}.${patch}`;
pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
console.log(`ted-craft ${current} → ${next}`);
