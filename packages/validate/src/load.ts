import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  catalogEntrySchema,
  firstPartyManifestSchema,
  type CatalogEntry,
  type FirstPartyManifest,
  type RegistryItem,
} from "./schema.js";
import { scanForSecrets, type SecretFinding } from "./secrets.js";

export type ValidationIssue = {
  file: string;
  message: string;
  severity: "error" | "warning";
};

const USER_PATH_RE =
  /(?:\/Users\/(?!\.\.\.)[A-Za-z0-9._-]+(?:\/[^\s"'`]*)?|C:\\Users\\(?!\.\.\.)[A-Za-z0-9._-]+(?:\\[^\s"'`]*)?)/gi;

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      out.push(...walkFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function validateFrontmatter(
  filePath: string,
  requiredName?: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!fs.existsSync(filePath)) {
    issues.push({
      file: filePath,
      message: "Missing required file",
      severity: "error",
    });
    return issues;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  if (typeof data.name !== "string" || !data.name.trim()) {
    issues.push({
      file: filePath,
      message: "Frontmatter missing required `name`",
      severity: "error",
    });
  } else if (requiredName && data.name !== requiredName) {
    issues.push({
      file: filePath,
      message: `Frontmatter name "${data.name}" does not match expected "${requiredName}"`,
      severity: "error",
    });
  }
  if (typeof data.description !== "string" || !data.description.trim()) {
    issues.push({
      file: filePath,
      message: "Frontmatter missing required `description`",
      severity: "error",
    });
  }
  return issues;
}

function checkUserPaths(filePath: string, content: string): ValidationIssue[] {
  const matches = content.match(USER_PATH_RE);
  if (!matches) return [];
  return matches.map((m) => ({
    file: filePath,
    message: `Hardcoded user path blocked: ${m}`,
    severity: "error" as const,
  }));
}

export function loadRegistry(registryRoot: string): {
  items: RegistryItem[];
  issues: ValidationIssue[];
  secrets: SecretFinding[];
} {
  const issues: ValidationIssue[] = [];
  const items: RegistryItem[] = [];
  const secrets: SecretFinding[] = [];

  const firstPartyRoot = path.join(registryRoot, "first-party");
  const catalogRoot = path.join(registryRoot, "catalog");

  if (fs.existsSync(firstPartyRoot)) {
    for (const entry of fs.readdirSync(firstPartyRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(firstPartyRoot, entry.name);
      const manifestPath = path.join(dir, "manifest.json");
      if (!fs.existsSync(manifestPath)) {
        issues.push({
          file: dir,
          message: "Missing manifest.json",
          severity: "error",
        });
        continue;
      }

      const parsed = firstPartyManifestSchema.safeParse(readJson(manifestPath));
      if (!parsed.success) {
        for (const err of parsed.error.issues) {
          issues.push({
            file: manifestPath,
            message: `${err.path.join(".")}: ${err.message}`,
            severity: "error",
          });
        }
        continue;
      }

      const manifest: FirstPartyManifest = parsed.data;
      if (manifest.slug !== entry.name) {
        issues.push({
          file: manifestPath,
          message: `slug "${manifest.slug}" must match folder name "${entry.name}"`,
          severity: "error",
        });
      }

      if (manifest.artifacts.skill) {
        const skillMd = path.join(dir, manifest.artifacts.skill.dir, "SKILL.md");
        issues.push(
          ...validateFrontmatter(skillMd, manifest.artifacts.skill.name),
        );
      }
      if (manifest.artifacts.subagent) {
        const agentFile = path.join(dir, manifest.artifacts.subagent.file);
        issues.push(
          ...validateFrontmatter(agentFile, manifest.artifacts.subagent.name),
        );
      }
      if (manifest.artifacts.hook) {
        const hookFile = path.join(dir, manifest.artifacts.hook.config);
        if (!fs.existsSync(hookFile)) {
          issues.push({
            file: hookFile,
            message: "Missing hooks config",
            severity: "error",
          });
        } else {
          try {
            JSON.parse(fs.readFileSync(hookFile, "utf8"));
          } catch {
            issues.push({
              file: hookFile,
              message: "hooks.json is not valid JSON",
              severity: "error",
            });
          }
        }
      }

      for (const file of walkFiles(dir)) {
        const content = fs.readFileSync(file, "utf8");
        issues.push(...checkUserPaths(file, content));
        secrets.push(...scanForSecrets(file, content));
      }

      items.push({
        ...manifest,
        sourceType: "first-party",
        path: path.relative(registryRoot, dir),
      });
    }
  }

  if (fs.existsSync(catalogRoot)) {
    for (const file of fs.readdirSync(catalogRoot)) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(catalogRoot, file);
      const parsed = catalogEntrySchema.safeParse(readJson(filePath));
      if (!parsed.success) {
        for (const err of parsed.error.issues) {
          issues.push({
            file: filePath,
            message: `${err.path.join(".")}: ${err.message}`,
            severity: "error",
          });
        }
        continue;
      }
      const entry: CatalogEntry = parsed.data;
      const content = fs.readFileSync(filePath, "utf8");
      secrets.push(...scanForSecrets(filePath, content));
      items.push({
        ...entry,
        sourceType: "catalog",
        path: path.relative(registryRoot, filePath),
      });
    }
  }

  for (const finding of secrets) {
    issues.push({
      file: finding.file,
      message: `Possible secret (${finding.pattern}): ${finding.snippet}`,
      severity: "error",
    });
  }

  items.sort((a, b) => a.slug.localeCompare(b.slug));
  return { items, issues, secrets };
}

export function findRepoRoot(from = process.cwd()): string {
  let current = path.resolve(from);
  for (;;) {
    if (
      fs.existsSync(path.join(current, "registry")) &&
      fs.existsSync(path.join(current, "package.json"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Could not find ted-craft repo root");
    }
    current = parent;
  }
}
