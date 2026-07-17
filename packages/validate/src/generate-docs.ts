import fs from "node:fs";
import path from "node:path";
import { findRepoRoot } from "./load.js";
import type { RegistryIndex, RegistryItem } from "./schema.js";
import { registryIndexSchema } from "./schema.js";

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function escapeMdx(text: string): string {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Escape `{` / `}` so MDX does not treat them as expressions. */
function escapeMdxBody(text: string): string {
  return escapeMdx(text).replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}

function installCommands(item: RegistryItem): {
  cursor: string;
  claude: string;
  codex: string;
} {
  if (item.sourceType === "catalog") {
    return {
      cursor: item.install.cursor ?? item.install.default,
      claude: item.install.claude ?? item.install.default,
      codex: item.install.codex ?? item.install.default,
    };
  }

  return {
    cursor: `npx ted-craft add ${item.slug} -a cursor -g -y`,
    claude: `npx ted-craft add ${item.slug} -a claude -g -y`,
    codex: `npx ted-craft add ${item.slug} -a codex -g -y`,
  };
}

function githubHandleFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    const handle = pathname.split("/")[0];
    return handle || null;
  } catch {
    return null;
  }
}

function authorDisplay(item: RegistryItem): string {
  if (item.sourceType === "catalog") {
    return item.attribution.author;
  }
  return githubHandleFromUrl(item.author.url) ?? item.author.name;
}

function safeSlug(slug: string): string {
  return slug.replace(/\//g, "--");
}

function readText(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

type InstallCmds = {
  cursor: string;
  claude: string;
  codex: string;
};

/** Full MD in RegistryInstallPreview + escaped prose body below. */
function renderMarkdownArtifact(
  raw: string,
  opts: {
    sectionTitle?: string;
    install?: InstallCmds | false;
  } = {},
): string {
  const parts: string[] = [];

  if (opts.sectionTitle) {
    parts.push(`## ${opts.sectionTitle}\n`);
  }

  const showInstall = opts.install !== false && opts.install != null;
  const installAttrs = showInstall
    ? `
  cursorCommand={${JSON.stringify(opts.install!.cursor)}}
  claudeCommand={${JSON.stringify(opts.install!.claude)}}
  codexCommand={${JSON.stringify(opts.install!.codex)}}
  showInstall={true}`
    : `
  showInstall={false}`;

  parts.push(
    `<RegistryInstallPreview${installAttrs}>{\n${JSON.stringify(raw.trim())}\n}</RegistryInstallPreview>\n`,
  );

  const fmMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---/);
  let body = raw;
  if (fmMatch) {
    body = raw.slice(fmMatch[0].length);
  }

  body = body.trim();
  if (body) {
    parts.push(escapeMdxBody(body));
  }

  return parts.join("\n");
}

function renderCodeArtifact(raw: string, label: string, sectionTitle: string): string {
  return `## ${sectionTitle}\n\n<CodeBlock label=${JSON.stringify(label)}>{\n${JSON.stringify(raw.trim())}\n}</CodeBlock>\n`;
}

function firstPartyBody(
  repoRoot: string,
  item: RegistryItem,
  cmds: InstallCmds,
): string {
  if (item.sourceType !== "first-party") return "";

  const base = path.join(repoRoot, "registry", item.path);
  const sections: string[] = [];
  const artifacts = item.artifacts ?? {};
  const multi =
    [artifacts.skill, artifacts.subagent, artifacts.rule, artifacts.hook].filter(Boolean)
      .length > 1;

  let installAttached = false;

  if (artifacts.skill) {
    const skillDir = path.join(base, artifacts.skill.dir);
    const skillMd = readText(path.join(skillDir, "SKILL.md"));
    if (skillMd) {
      sections.push(
        renderMarkdownArtifact(skillMd, {
          sectionTitle: multi ? "Skill" : undefined,
          install: cmds,
        }),
      );
      installAttached = true;
    }
    if (fs.existsSync(skillDir)) {
      for (const file of fs.readdirSync(skillDir).sort()) {
        if (!file.endsWith(".md") || file === "SKILL.md") continue;
        const extra = readText(path.join(skillDir, file));
        if (!extra) continue;
        const title = file
          .replace(/\.md$/i, "")
          .split(/[-_]/)
          .map((w) => (w.toLowerCase() === "mcp" ? "MCP" : w.charAt(0).toUpperCase() + w.slice(1)))
          .join(" ");
        sections.push(
          renderMarkdownArtifact(extra, {
            sectionTitle: title,
            install: false,
          }),
        );
      }
    }
  }

  if (artifacts.subagent) {
    const sub = readText(path.join(base, artifacts.subagent.file));
    if (sub) {
      sections.push(
        renderMarkdownArtifact(sub, {
          sectionTitle: multi ? "Subagent" : undefined,
          install: installAttached ? false : cmds,
        }),
      );
      installAttached = true;
    }
  }

  if (artifacts.rule) {
    const rule = readText(path.join(base, artifacts.rule.file));
    if (rule) {
      sections.push(
        renderMarkdownArtifact(rule, {
          sectionTitle: multi ? "Rule" : undefined,
          install: installAttached ? false : cmds,
        }),
      );
      installAttached = true;
    }
  }

  if (artifacts.hook) {
    const hook = readText(path.join(base, artifacts.hook.config));
    if (hook) {
      sections.push(renderCodeArtifact(hook, "hooks.json", multi ? "Hook" : "Hook config"));
    }
  }

  if (sections.length === 0) {
    return escapeMdxBody(item.description);
  }

  return sections.join("\n\n");
}

async function fetchCatalogSkill(item: RegistryItem & { sourceType: "catalog" }): Promise<string | null> {
  const repo = item.attribution.repo;
  const skill = item.attribution.skill;
  if (!repo.includes("/") || !skill) return null;

  const candidates = [
    `https://raw.githubusercontent.com/${repo}/main/skills/${skill}/SKILL.md`,
    `https://raw.githubusercontent.com/${repo}/master/skills/${skill}/SKILL.md`,
    `https://raw.githubusercontent.com/${repo}/main/${skill}/SKILL.md`,
    `https://raw.githubusercontent.com/anthropics/skills/main/skills/${skill}/SKILL.md`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      if (!text.trim() || text.startsWith("404")) continue;
      return text;
    } catch {
      // try next candidate
    }
  }

  return null;
}

async function catalogBody(
  repoRoot: string,
  item: RegistryItem & { sourceType: "catalog" },
  cmds: InstallCmds,
): Promise<string> {
  const localOverride = path.join(
    repoRoot,
    "registry",
    "catalog",
    `${safeSlug(item.slug)}.md`,
  );
  const local = readText(localOverride);
  if (local) {
    return renderMarkdownArtifact(local, { install: cmds });
  }

  const remote = await fetchCatalogSkill(item);
  if (remote) {
    return renderMarkdownArtifact(remote, { install: cmds });
  }

  // No MD body — still show install CTAs with description as code fallback
  return renderMarkdownArtifact(item.description, { install: cmds });
}

async function itemBody(
  repoRoot: string,
  item: RegistryItem,
  cmds: InstallCmds,
): Promise<string> {
  if (item.sourceType === "first-party") {
    return firstPartyBody(repoRoot, item, cmds);
  }
  return catalogBody(repoRoot, item, cmds);
}

async function renderPage(repoRoot: string, item: RegistryItem): Promise<string> {
  const cmds = installCommands(item);
  const author = authorDisplay(item);
  const attribution =
    item.sourceType === "catalog"
      ? `
<AttributionCard
  author="${escapeMdx(item.attribution.author)}"
  repo="${escapeMdx(item.attribution.repo)}"
  license="${escapeMdx(item.attribution.license)}"
  catalogUrl="${escapeMdx(item.attribution.catalogUrl)}"
/>
`
      : "";

  const body = await itemBody(repoRoot, item, cmds);

  return `---
title: ${JSON.stringify(item.name)}
description: ${JSON.stringify(item.description)}
---

<div className="not-prose mb-6 flex flex-wrap items-center gap-3">
  <KindBadge kind="${item.kind}" />
  <span className="text-sm text-fd-muted-foreground">${escapeMdx(author)}</span>
</div>

${attribution}

${item.sourceType === "first-party" && item.cli?.promptExample ? `<CliCommand>${escapeMdx(item.cli.promptExample)}</CliCommand>\n` : ""}

${body}
`;
}

export async function generateDocs(repoRoot?: string): Promise<void> {
  const root = repoRoot ?? findRepoRoot();
  const indexPath = path.join(root, "registry", "index.json");
  if (!fs.existsSync(indexPath)) {
    throw new Error("registry/index.json missing — run generate-index first");
  }

  const index = registryIndexSchema.parse(
    JSON.parse(fs.readFileSync(indexPath, "utf8")),
  ) as RegistryIndex;

  const docsRoot = path.join(root, "apps", "web", "content", "docs");
  const generatedRoot = path.join(docsRoot, "registry");

  if (fs.existsSync(generatedRoot)) {
    fs.rmSync(generatedRoot, { recursive: true, force: true });
  }
  ensureDir(generatedRoot);

  const byCategory = new Map<string, RegistryItem[]>();
  for (const item of index.items) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  const categoryMeta: string[] = [];
  for (const [category, items] of [...byCategory.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const catDir = path.join(generatedRoot, category);
    ensureDir(catDir);
    const pages: string[] = [];
    for (const item of items) {
      const file = path.join(catDir, `${safeSlug(item.slug)}.mdx`);
      fs.writeFileSync(file, await renderPage(root, item));
      pages.push(safeSlug(item.slug));
    }
    fs.writeFileSync(
      path.join(catDir, "meta.json"),
      `${JSON.stringify({ title: category, pages }, null, 2)}\n`,
    );
    categoryMeta.push(category);
  }

  fs.writeFileSync(
    path.join(generatedRoot, "meta.json"),
    `${JSON.stringify({ title: "Registry", pages: categoryMeta }, null, 2)}\n`,
  );

  fs.writeFileSync(
    path.join(docsRoot, "meta.json"),
    `${JSON.stringify(
      {
        title: "Docs",
        pages: ["index", "getting-started", "---Registry---", "...registry"],
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `Generated docs for ${index.items.length} items → apps/web/content/docs/registry`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void generateDocs();
}
