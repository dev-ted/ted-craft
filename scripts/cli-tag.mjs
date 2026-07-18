#!/usr/bin/env node
/**
 * Create an annotated git tag for the CLI package version: cli-vX.Y.Z
 * Usage: node scripts/cli-tag.mjs [--print]
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(
  readFileSync(join(root, "packages", "cli", "package.json"), "utf8"),
);
const version = pkg.version;
if (typeof version !== "string" || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`Invalid CLI version in packages/cli/package.json: ${version}`);
  process.exit(1);
}

const tag = `cli-v${version}`;

if (process.argv.includes("--print")) {
  console.log(tag);
  process.exit(0);
}

const existing = spawnSync("git", ["rev-parse", "-q", "--verify", `refs/tags/${tag}`], {
  cwd: root,
  encoding: "utf8",
});
if (existing.status === 0) {
  console.error(`Tag already exists: ${tag}`);
  process.exit(1);
}

const result = spawnSync(
  "git",
  ["tag", "-a", tag, "-m", `Release ted-craft CLI ${version}`],
  { cwd: root, stdio: "inherit" },
);
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Created tag ${tag}`);
console.log(`Push with: git push origin ${tag}`);
