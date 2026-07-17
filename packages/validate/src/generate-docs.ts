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

  const skillName = item.artifacts.skill?.name ?? item.slug;
  const skillPath = `registry/first-party/${item.slug}/skill`;
  const base = `npx skills add dev-ted/ted-craft --skill ${skillName} --path ${skillPath}`;
  return {
    cursor: `${base} -a cursor -g -y`,
    claude: `${base} -a claude-code -g -y`,
    codex: `${base} -a codex -g -y`,
  };
}

function skillBody(repoRoot: string, item: RegistryItem): string {
  if (item.sourceType !== "first-party" || !item.artifacts.skill) {
    return "";
  }
  const skillMd = path.join(
    repoRoot,
    "registry",
    item.path,
    item.artifacts.skill.dir,
    "SKILL.md",
  );
  if (!fs.existsSync(skillMd)) return "";
  const raw = fs.readFileSync(skillMd, "utf8");
  // Strip YAML frontmatter for docs body
  return raw.replace(/^---[\s\S]*?---\s*/, "").trim();
}

function safeSlug(slug: string): string {
  return slug.replace(/\//g, "--");
}

function renderPage(repoRoot: string, item: RegistryItem): string {
  const cmds = installCommands(item);
  const pageSlug = safeSlug(item.slug);
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

  const body =
    item.sourceType === "first-party"
      ? skillBody(repoRoot, item)
      : item.description;

  return `---
title: ${JSON.stringify(item.name)}
description: ${JSON.stringify(item.description)}
---

<div className="not-prose mb-6 flex flex-wrap items-center gap-3">
  <KindBadge kind="${item.kind}" />
  <span className="text-sm text-fd-muted-foreground">${item.category} · ${item.sourceType}</span>
</div>

<InstallPanel
  slug="${pageSlug}"
  cursorCommand={${JSON.stringify(cmds.cursor)}}
  claudeCommand={${JSON.stringify(cmds.claude)}}
  codexCommand={${JSON.stringify(cmds.codex)}}
  ${item.sourceType === "catalog" ? `attributionLabel="${escapeMdx(item.attribution.repo)}"` : ""}
/>

${attribution}

${item.sourceType === "first-party" && item.cli?.promptExample ? `<CliCommand>${escapeMdx(item.cli.promptExample)}</CliCommand>\n` : ""}

${body}
`;
}

export function generateDocs(repoRoot?: string): void {
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

  // Clean generated registry docs (keep index.mdx at docs root)
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
      fs.writeFileSync(file, renderPage(root, item));
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
  generateDocs();
}
