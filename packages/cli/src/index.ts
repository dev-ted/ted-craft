#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import {
  registryIndexSchema,
  type RegistryIndex,
  type RegistryItem,
} from "./schema.js";

type AgentTarget = "cursor" | "claude" | "codex" | "vscode";

const GITHUB_REPO = "dev-ted/ted-craft";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;
const INDEX_URL = `${RAW_BASE}/registry/index.json`;
const PACK_PATH = "registry/first-party/ai-delivery/pack.json";
const AGENTS_TEMPLATE_PATH =
  "registry/first-party/ai-delivery/skill/references/agents-md.md";
const HARD_STOP_IGNORE = ".ai-delivery/hard-stop.json";

function findRepoRoot(from = process.cwd()): string {
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

function printHelp(): void {
  console.log(`ted-craft — agent artifact marketplace CLI

Usage:
  ted-craft start [--category <name>]
  ted-craft list [--category <name>] [--kind <kind>]
  ted-craft search <query>
  ted-craft get <slug>
  ted-craft add <slug> [-a cursor|claude|codex|vscode] [-g] [-y]
  ted-craft setup ai-delivery [-a cursor|claude|codex|vscode] [--preset small|standard] [--ui] [-g]
  ted-craft help

Examples:
  npx ted-craft start
  npx ted-craft add click-up-maintainer -a cursor -g -y
  npx ted-craft setup ai-delivery -a cursor --preset small
  npx ted-craft search clickup
`);
}

async function loadIndex(): Promise<RegistryIndex> {
  try {
    const root = findRepoRoot();
    const local = path.join(root, "registry", "index.json");
    if (fs.existsSync(local)) {
      return registryIndexSchema.parse(
        JSON.parse(fs.readFileSync(local, "utf8")),
      );
    }
  } catch {
    // fall through to remote
  }

  const res = await fetch(INDEX_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to load registry index (${res.status}). Run from the ted-craft repo or ensure ${INDEX_URL} is published.`,
    );
  }
  return registryIndexSchema.parse(await res.json());
}

function findItem(index: RegistryIndex, slug: string): RegistryItem {
  const item = index.items.find((i) => i.slug === slug);
  if (!item) {
    throw new Error(
      `Unknown slug "${slug}". Run \`ted-craft list\` or \`ted-craft search\`.`,
    );
  }
  return item;
}

function agentHome(agent: AgentTarget): string {
  const home = os.homedir();
  switch (agent) {
    case "cursor":
      return path.join(home, ".cursor");
    case "claude":
      return path.join(home, ".claude");
    case "codex":
      return path.join(home, ".codex");
    case "vscode":
      return path.join(home, ".copilot");
    default: {
      const _exhaustive: never = agent;
      return _exhaustive;
    }
  }
}

function agentProjectDir(agent: AgentTarget): string {
  switch (agent) {
    case "cursor":
      return ".cursor";
    case "claude":
      return ".claude";
    case "codex":
      return ".codex";
    case "vscode":
      return ".agents";
    default: {
      const _exhaustive: never = agent;
      return _exhaustive;
    }
  }
}

function skillsAgentFlag(agent: AgentTarget): string {
  switch (agent) {
    case "cursor":
      return "cursor";
    case "claude":
      return "claude-code";
    case "codex":
      return "codex";
    case "vscode":
      return "github-copilot";
    default: {
      const _exhaustive: never = agent;
      return _exhaustive;
    }
  }
}

function runCommand(cmd: string, args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

type HookEntry = {
  command?: string;
  matcher?: string;
  [key: string]: unknown;
};

type HooksConfig = {
  version?: number;
  hooks?: Record<string, HookEntry[]>;
};

/** Merge incoming hooks into an existing hooks.json without dropping user entries. */
function mergeHooksConfig(existingRaw: string | null, incomingRaw: string): {
  json: string;
  merged: boolean;
} {
  const incoming = JSON.parse(incomingRaw) as HooksConfig;
  if (!existingRaw) {
    return {
      json: `${JSON.stringify(incoming, null, 2)}\n`,
      merged: false,
    };
  }

  let existing: HooksConfig;
  try {
    existing = JSON.parse(existingRaw) as HooksConfig;
  } catch {
    return {
      json: `${JSON.stringify(incoming, null, 2)}\n`,
      merged: false,
    };
  }

  const merged: HooksConfig = {
    version: existing.version ?? incoming.version ?? 1,
    hooks: { ...(existing.hooks ?? {}) },
  };

  for (const [event, entries] of Object.entries(incoming.hooks ?? {})) {
    const current = [...(merged.hooks?.[event] ?? [])];
    const commands = new Set(
      current
        .map((e) => (typeof e.command === "string" ? e.command : ""))
        .filter(Boolean),
    );
    for (const entry of entries) {
      if (typeof entry.command !== "string" || !entry.command) continue;
      if (commands.has(entry.command)) continue;
      current.push(entry);
      commands.add(entry.command);
    }
    merged.hooks = merged.hooks ?? {};
    merged.hooks[event] = current;
  }

  return {
    json: `${JSON.stringify(merged, null, 2)}\n`,
    merged: true,
  };
}

async function installFirstParty(
  item: RegistryItem & { sourceType: "first-party" },
  agent: AgentTarget,
  global: boolean,
  options?: { hookInProject?: boolean },
): Promise<void> {
  let repoRoot: string | null = null;
  try {
    repoRoot = findRepoRoot();
  } catch {
    repoRoot = null;
  }

  const projectBase = path.join(process.cwd(), agentProjectDir(agent));
  const destBase = global ? agentHome(agent) : projectBase;
  const hookBase = options?.hookInProject ? projectBase : destBase;

  if (item.artifacts.skill) {
    const skillName = item.artifacts.skill.name;
    if (repoRoot) {
      const src = path.join(
        repoRoot,
        "registry",
        item.path,
        item.artifacts.skill.dir,
      );
      const dest = path.join(destBase, "skills", skillName);
      fs.rmSync(dest, { recursive: true, force: true });
      copyDir(src, dest);
      console.log(`Installed skill → ${dest}`);
    } else {
      const treeUrl = `https://github.com/${GITHUB_REPO}/tree/main/registry/first-party/${item.slug}/skill`;
      const code = await runCommand("npx", [
        "skills",
        "add",
        treeUrl,
        "--skill",
        skillName,
        "-a",
        skillsAgentFlag(agent),
        ...(global ? ["-g"] : []),
        "-y",
      ]);
      if (code !== 0) {
        throw new Error(`skills add failed with exit ${code}`);
      }
    }
  }

  if (item.artifacts.subagent) {
    if (!repoRoot) {
      console.warn(
        "Subagent install from remote not yet supported without a local clone; skill installed via skills CLI only.",
      );
    } else {
      const src = path.join(
        repoRoot,
        "registry",
        item.path,
        item.artifacts.subagent.file,
      );
      const agentsDir = path.join(destBase, "agents");
      fs.mkdirSync(agentsDir, { recursive: true });
      const dest = path.join(agentsDir, path.basename(src));
      fs.copyFileSync(src, dest);
      console.log(`Installed subagent → ${dest}`);
    }
  }

  if (item.artifacts.rule) {
    if (!repoRoot) {
      throw new Error("Rule install requires a local ted-craft checkout for now.");
    }
    const src = path.join(
      repoRoot,
      "registry",
      item.path,
      item.artifacts.rule.file,
    );
    const rulesDir = path.join(destBase, "rules");
    fs.mkdirSync(rulesDir, { recursive: true });
    const dest = path.join(rulesDir, path.basename(src));
    fs.copyFileSync(src, dest);
    console.log(`Installed rule → ${dest}`);
  }

  if (item.artifacts.hook) {
    if (!repoRoot) {
      throw new Error("Hook install requires a local ted-craft checkout for now.");
    }
    const srcConfig = path.join(
      repoRoot,
      "registry",
      item.path,
      item.artifacts.hook.config,
    );
    const hooksDest = path.join(hookBase, "hooks.json");
    const incomingRaw = fs.readFileSync(srcConfig, "utf8");
    const existingRaw = fs.existsSync(hooksDest)
      ? fs.readFileSync(hooksDest, "utf8")
      : null;
    const { json, merged } = mergeHooksConfig(existingRaw, incomingRaw);
    fs.mkdirSync(hookBase, { recursive: true });
    fs.writeFileSync(hooksDest, json, "utf8");
    if (item.artifacts.hook.scriptsDir) {
      const srcScripts = path.join(
        repoRoot,
        "registry",
        item.path,
        item.artifacts.hook.scriptsDir,
      );
      const destScripts = path.join(hookBase, "hooks");
      // Non-destructive: copy/overwrite packaged scripts only; keep user scripts.
      copyDir(srcScripts, destScripts);
      console.log(`Installed hook scripts → ${destScripts}`);
    }
    console.log(
      merged
        ? `Merged hooks → ${hooksDest}`
        : `Installed hooks → ${hooksDest}`,
    );
  }
}

async function installCatalog(
  item: RegistryItem & { sourceType: "catalog" },
  agent: AgentTarget,
): Promise<void> {
  let command: string;
  switch (agent) {
    case "cursor":
      command = item.install.cursor ?? item.install.default;
      break;
    case "claude":
      command = item.install.claude ?? item.install.default;
      break;
    case "codex":
      command = item.install.codex ?? item.install.default;
      break;
    case "vscode":
      command =
        item.install.vscode ??
        (item.install.cursor ?? item.install.default).replace(
          /-a\s+\S+/,
          "-a github-copilot",
        );
      if (!/-a\s+/.test(command)) {
        command = command.replace(/\s-g\s+-y\s*$/, " -a github-copilot -g -y");
      }
      break;
    default: {
      const _exhaustive: never = agent;
      command = _exhaustive;
    }
  }

  console.log(`Running: ${command}`);
  const code = await new Promise<number>((resolve, reject) => {
    const child = spawn(command, {
      stdio: "inherit",
      shell: true,
    });
    child.on("error", reject);
    child.on("close", (c) => resolve(c ?? 1));
  });
  if (code !== 0) {
    throw new Error(`Install command failed with exit ${code}`);
  }
}

type GhContent = {
  name: string;
  path: string;
  type: string;
  download_url: string | null;
};

const ghHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ted-craft",
};

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status})`);
  }
  return res.text();
}

async function downloadGithubDir(repoPath: string, destDir: string): Promise<void> {
  const api = `https://api.github.com/repos/${GITHUB_REPO}/contents/${repoPath}?ref=main`;
  const res = await fetch(api, { headers: ghHeaders });
  if (!res.ok) {
    throw new Error(`Failed to list ${repoPath} (${res.status})`);
  }
  const entries = (await res.json()) as GhContent[] | { message?: string };
  if (!Array.isArray(entries)) {
    throw new Error(`Unexpected listing for ${repoPath}`);
  }
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of entries) {
    if (entry.type === "dir") {
      await downloadGithubDir(entry.path, path.join(destDir, entry.name));
      continue;
    }
    if (entry.type !== "file" || !entry.download_url) continue;
    const body = await fetchText(entry.download_url);
    fs.writeFileSync(path.join(destDir, entry.name), body, "utf8");
  }
}

async function installFirstPartyRemote(
  item: RegistryItem & { sourceType: "first-party" },
  agent: AgentTarget,
  global: boolean,
  options?: { hookInProject?: boolean },
): Promise<void> {
  const projectBase = path.join(process.cwd(), agentProjectDir(agent));
  const destBase = global ? agentHome(agent) : projectBase;
  const hookBase = options?.hookInProject ? projectBase : destBase;
  const root = `registry/${item.path}`;

  if (item.artifacts.skill) {
    const dest = path.join(destBase, "skills", item.artifacts.skill.name);
    fs.rmSync(dest, { recursive: true, force: true });
    await downloadGithubDir(`${root}/${item.artifacts.skill.dir}`, dest);
    console.log(`Installed skill → ${dest}`);
  }

  if (item.artifacts.subagent) {
    const destDir = path.join(destBase, "agents");
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, path.basename(item.artifacts.subagent.file));
    const body = await fetchText(`${RAW_BASE}/${root}/${item.artifacts.subagent.file}`);
    fs.writeFileSync(dest, body, "utf8");
    console.log(`Installed subagent → ${dest}`);
  }

  if (item.artifacts.rule) {
    const destDir = path.join(destBase, "rules");
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, path.basename(item.artifacts.rule.file));
    const body = await fetchText(`${RAW_BASE}/${root}/${item.artifacts.rule.file}`);
    fs.writeFileSync(dest, body, "utf8");
    console.log(`Installed rule → ${dest}`);
  }

  if (item.artifacts.hook) {
    const incomingRaw = await fetchText(
      `${RAW_BASE}/${root}/${item.artifacts.hook.config}`,
    );
    const hooksDest = path.join(hookBase, "hooks.json");
    const existingRaw = fs.existsSync(hooksDest)
      ? fs.readFileSync(hooksDest, "utf8")
      : null;
    const { json, merged } = mergeHooksConfig(existingRaw, incomingRaw);
    fs.mkdirSync(hookBase, { recursive: true });
    fs.writeFileSync(hooksDest, json, "utf8");
    if (item.artifacts.hook.scriptsDir) {
      const destScripts = path.join(hookBase, "hooks");
      await downloadGithubDir(
        `${root}/${item.artifacts.hook.scriptsDir}`,
        destScripts,
      );
      console.log(`Installed hook scripts → ${destScripts}`);
    }
    console.log(
      merged ? `Merged hooks → ${hooksDest}` : `Installed hooks → ${hooksDest}`,
    );
  }
}

type DeliveryPack = {
  small: string[];
  standard: string[];
  ui: string[];
};

function tryRepoRoot(): string | null {
  try {
    return findRepoRoot();
  } catch {
    return null;
  }
}

async function loadDeliveryPack(): Promise<{ pack: DeliveryPack; localRoot: string | null }> {
  const localRoot = tryRepoRoot();
  if (localRoot) {
    const file = path.join(localRoot, PACK_PATH);
    if (fs.existsSync(file)) {
      return {
        pack: JSON.parse(fs.readFileSync(file, "utf8")) as DeliveryPack,
        localRoot,
      };
    }
  }
  const raw = await fetchText(`${RAW_BASE}/${PACK_PATH}`);
  return { pack: JSON.parse(raw) as DeliveryPack, localRoot: null };
}

function writeAgentsTemplate(localRoot: string | null, template: string | null): void {
  const dest = path.join(process.cwd(), "AGENTS.md");
  if (fs.existsSync(dest)) {
    console.log(`Left existing file → ${dest}`);
    return;
  }
  let body = template;
  if (!body && localRoot) {
    const src = path.join(localRoot, AGENTS_TEMPLATE_PATH);
    if (fs.existsSync(src)) body = fs.readFileSync(src, "utf8");
  }
  if (!body) {
    console.log("AGENTS.md template was not found. Run ai-delivery-setup to write it.");
    return;
  }
  if (!body.endsWith("\n")) body += "\n";
  fs.writeFileSync(dest, body, "utf8");
  console.log(`Wrote ${dest}`);
}

function ensureHardStopGitignore(): void {
  const dest = path.join(process.cwd(), ".gitignore");
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, `${HARD_STOP_IGNORE}\n`, "utf8");
    console.log(`Created ${dest}`);
    return;
  }
  const text = fs.readFileSync(dest, "utf8");
  const present = text.split("\n").some((line) => line.trim() === HARD_STOP_IGNORE);
  if (present) {
    console.log(`.gitignore already ignores ${HARD_STOP_IGNORE}`);
    return;
  }
  const suffix = text.endsWith("\n") || text.length === 0 ? "" : "\n";
  fs.appendFileSync(dest, `${suffix}${HARD_STOP_IGNORE}\n`, "utf8");
  console.log(`Updated ${dest}`);
}

function parseAgent(flags: Record<string, string | boolean>): AgentTarget {
  const agentRaw = (flags.agent as string | undefined) ?? "cursor";
  if (
    agentRaw !== "cursor" &&
    agentRaw !== "claude" &&
    agentRaw !== "codex" &&
    agentRaw !== "vscode"
  ) {
    throw new Error(
      `Unsupported agent "${agentRaw}". Use cursor|claude|codex|vscode.`,
    );
  }
  return agentRaw;
}

function parseArgs(argv: string[]): {
  command: string;
  positional: string[];
  flags: Record<string, string | boolean>;
} {
  const [command = "help", ...rest] = argv;
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (!arg) continue;
    if (arg === "-g" || arg === "--global") {
      flags.global = true;
      continue;
    }
    if (arg === "-y" || arg === "--yes") {
      flags.yes = true;
      continue;
    }
    if (arg === "-a" || arg === "--agent") {
      flags.agent = rest[++i] ?? "cursor";
      continue;
    }
    if (arg === "--category") {
      flags.category = rest[++i] ?? "";
      continue;
    }
    if (arg === "--kind") {
      flags.kind = rest[++i] ?? "";
      continue;
    }
    if (arg === "--preset") {
      flags.preset = rest[++i] ?? "";
      continue;
    }
    if (arg === "--ui") {
      flags.ui = true;
      continue;
    }
    if (arg.startsWith("-")) {
      flags[arg.replace(/^--?/, "")] = true;
      continue;
    }
    positional.push(arg);
  }
  return { command, positional, flags };
}

export async function run(argv: string[]): Promise<void> {
  const { command, positional, flags } = parseArgs(argv);

  switch (command) {
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return;

    case "list": {
      const index = await loadIndex();
      let items = index.items;
      if (typeof flags.category === "string" && flags.category) {
        items = items.filter((i) => i.category === flags.category);
      }
      if (typeof flags.kind === "string" && flags.kind) {
        items = items.filter((i) => i.kind === flags.kind);
      }
      for (const item of items) {
        const featured = item.cli?.featured ? " ★" : "";
        console.log(
          `${item.slug.padEnd(28)} ${item.kind.padEnd(10)} ${item.sourceType.padEnd(12)} ${item.name}${featured}`,
        );
      }
      console.log(`\n${items.length} item(s)`);
      return;
    }

    case "search": {
      const query = positional.join(" ").toLowerCase();
      if (!query) throw new Error("Usage: ted-craft search <query>");
      const index = await loadIndex();
      const hits = index.items.filter((i) => {
        const hay = [i.slug, i.name, i.description, i.category, ...i.tags]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
      if (hits.length === 0) {
        console.log("No matches.");
        return;
      }
      for (const item of hits) {
        console.log(`${item.slug}\n  ${item.description}\n`);
      }
      return;
    }

    case "get": {
      const slug = positional[0];
      if (!slug) throw new Error("Usage: ted-craft get <slug>");
      const index = await loadIndex();
      const item = findItem(index, slug);

      if (item.sourceType === "catalog") {
        console.log(`# ${item.name}\n\n${item.description}\n`);
        console.log(
          `Attribution: ${item.attribution.author} (${item.attribution.repo})`,
        );
        console.log(`Install: ${item.install.default}`);
        return;
      }

      try {
        const root = findRepoRoot();
        if (item.artifacts.skill) {
          const skillMd = path.join(
            root,
            "registry",
            item.path,
            item.artifacts.skill.dir,
            "SKILL.md",
          );
          console.log(fs.readFileSync(skillMd, "utf8"));
          return;
        }
        if (item.artifacts.subagent) {
          const file = path.join(
            root,
            "registry",
            item.path,
            item.artifacts.subagent.file,
          );
          console.log(fs.readFileSync(file, "utf8"));
          return;
        }
      } catch {
        // remote fallback
      }
      console.log(JSON.stringify(item, null, 2));
      return;
    }

    case "start": {
      const index = await loadIndex();
      const category =
        typeof flags.category === "string" && flags.category
          ? flags.category
          : null;
      const featured = index.items.filter((i) => i.cli?.featured);
      const pool = category
        ? index.items.filter((i) => i.category === category)
        : featured.length > 0
          ? featured
          : index.items;

      console.log(`# ted-craft-root

You are routing through the ted-craft marketplace.

## Protocol
1. Identify the user's goal.
2. Pick the **smallest useful** artifact from the list below (prefer featured / matching category).
3. Tell the user to run: \`npx ted-craft add <slug> -a cursor -g -y\` (or claude/codex).
4. Or run \`npx ted-craft get <slug>\` to load instructions into context.
5. Do not invent slugs outside this registry.

## Available (${pool.length})
`);
      for (const item of pool) {
        console.log(
          `- **${item.slug}** (${item.kind}, ${item.sourceType}): ${item.description}`,
        );
      }
      console.log(`
## Commands
- \`npx ted-craft list\`
- \`npx ted-craft search <query>\`
- \`npx ted-craft get <slug>\`
- \`npx ted-craft add <slug> -a cursor -g -y\`
`);
      return;
    }

    case "add": {
      const slug = positional[0];
      if (!slug) {
        throw new Error(
          "Usage: ted-craft add <slug> [-a cursor|claude|codex|vscode]",
        );
      }
      const agent = parseAgent(flags);
      const index = await loadIndex();
      const item = findItem(index, slug);
      // Skills historically default to global; hooks use project-relative
      // command paths (e.g. `.cursor/hooks/...`) so they default to local.
      const global =
        item.kind === "hook"
          ? Boolean(flags.global)
          : Boolean(flags.global ?? true);

      if (item.sourceType === "catalog") {
        await installCatalog(item, agent);
      } else {
        await installFirstParty(item, agent, global);
      }
      return;
    }

    case "setup": {
      const packName = positional[0];
      if (packName !== "ai-delivery") {
        throw new Error(
          "Usage: ted-craft setup ai-delivery [-a cursor|claude|codex|vscode] [--preset small|standard] [--ui] [-g]",
        );
      }
      const presetRaw = (flags.preset as string | undefined) || "small";
      if (presetRaw !== "small" && presetRaw !== "standard") {
        throw new Error('Preset must be "small" or "standard".');
      }
      const agent = parseAgent(flags);
      const global = Boolean(flags.global);
      const { pack, localRoot } = await loadDeliveryPack();
      const slugs = [...pack[presetRaw]];
      if (flags.ui) slugs.push(...pack.ui);

      const index = await loadIndex();
      for (const slug of slugs) {
        const item = findItem(index, slug);
        if (item.sourceType !== "first-party") {
          throw new Error(`Pack slug "${slug}" is not a first-party artifact.`);
        }
        if (localRoot) {
          await installFirstParty(item, agent, global, { hookInProject: true });
        } else {
          await installFirstPartyRemote(item, agent, global, {
            hookInProject: true,
          });
        }
      }

      let template: string | null = null;
      if (!localRoot) {
        try {
          template = await fetchText(`${RAW_BASE}/${AGENTS_TEMPLATE_PATH}`);
        } catch {
          template = null;
        }
      }
      writeAgentsTemplate(localRoot, template);
      ensureHardStopGitignore();

      const where = global
        ? `${agentHome(agent)} (hook stays in ${agentProjectDir(agent)})`
        : agentProjectDir(agent);
      console.log(`
AI Delivery (${presetRaw}${flags.ui ? ", ui" : ""}) installed into ${where}.

Next: open your agent in this repo and run ai-delivery-setup.
Confirm the project profile before any feature code.
`);
      return;
    }

    default:
      printHelp();
      throw new Error(`Unknown command: ${command}`);
  }
}
