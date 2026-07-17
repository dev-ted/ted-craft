import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, loadRegistry } from "./load.js";
import type { RegistryIndex } from "./schema.js";

export function generateIndex(repoRoot?: string): RegistryIndex {
  const root = repoRoot ?? findRepoRoot();
  const registryRoot = path.join(root, "registry");
  const { items, issues } = loadRegistry(registryRoot);
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length > 0) {
    for (const err of errors) {
      console.error(`✗ ${err.file}: ${err.message}`);
    }
    throw new Error(`Registry validation failed with ${errors.length} error(s)`);
  }

  const index: RegistryIndex = {
    generatedAt: new Date().toISOString(),
    items,
  };

  const outPath = path.join(registryRoot, "index.json");
  fs.writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`);

  const webDataDir = path.join(root, "apps", "web", "src", "data");
  fs.mkdirSync(webDataDir, { recursive: true });
  const webCopy = path.join(webDataDir, "registry.json");
  fs.writeFileSync(webCopy, `${JSON.stringify(index, null, 2)}\n`);

  console.log(`Wrote ${items.length} items → ${path.relative(root, outPath)}`);
  console.log(`Copied index → ${path.relative(root, webCopy)}`);
  return index;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateIndex();
}
