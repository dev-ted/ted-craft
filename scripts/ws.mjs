#!/usr/bin/env node
/**
 * Run a workspace package script without npm/bun/pnpm/yarn-specific flags.
 * Usage: node scripts/ws.mjs <package-name> <script> [...args]
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [packageName, scriptName, ...forwardedArgs] = process.argv.slice(2);

if (!packageName || !scriptName) {
  console.error("Usage: node scripts/ws.mjs <package-name> <script> [...args]");
  process.exit(1);
}

function expandWorkspaceGlob(pattern) {
  if (!pattern.endsWith("/*")) {
    const dir = join(root, pattern);
    return existsSync(dir) ? [dir] : [];
  }
  const parent = join(root, pattern.slice(0, -2));
  if (!existsSync(parent)) return [];
  return readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(parent, entry.name));
}

function findPackageDir(name) {
  const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const workspaceGlobs = rootPkg.workspaces ?? [];
  for (const glob of workspaceGlobs) {
    for (const dir of expandWorkspaceGlob(glob)) {
      const pkgPath = join(dir, "package.json");
      if (!existsSync(pkgPath)) continue;
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
      if (pkg.name === name) return { dir, pkg };
    }
  }
  return null;
}

const found = findPackageDir(packageName);
if (!found) {
  console.error(`Workspace package not found: ${packageName}`);
  process.exit(1);
}

const { dir, pkg } = found;
const script = pkg.scripts?.[scriptName];
if (!script) {
  console.error(`Script "${scriptName}" not found in ${packageName}`);
  process.exit(1);
}

const pathSep = process.platform === "win32" ? ";" : ":";
const pathKey = process.platform === "win32" ? "Path" : "PATH";
const binDirs = [join(dir, "node_modules", ".bin"), join(root, "node_modules", ".bin")];
const existingPath = process.env[pathKey] ?? process.env.PATH ?? "";
const env = {
  ...process.env,
  [pathKey]: [...binDirs, existingPath].join(pathSep),
};

const suffix =
  forwardedArgs.length === 0
    ? ""
    : ` ${forwardedArgs.map((arg) => JSON.stringify(arg)).join(" ")}`;

const result = spawnSync(`${script}${suffix}`, {
  cwd: dir,
  env,
  stdio: "inherit",
  shell: true,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
