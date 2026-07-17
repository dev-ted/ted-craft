#!/usr/bin/env node
import { findRepoRoot, loadRegistry } from "./load.js";
import path from "node:path";

const root = findRepoRoot();
const { issues } = loadRegistry(path.join(root, "registry"));
const errors = issues.filter((i) => i.severity === "error");
const warnings = issues.filter((i) => i.severity === "warning");

for (const w of warnings) {
  console.warn(`⚠ ${w.file}: ${w.message}`);
}
for (const e of errors) {
  console.error(`✗ ${e.file}: ${e.message}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}

console.log(`✓ Registry valid (${warnings.length} warning(s))`);
