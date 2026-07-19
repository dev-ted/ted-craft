import { IconX } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { useMemo, useState } from "react";
import { FacetedFilter } from "@/components/FacetedFilter";
import { KindBadge } from "@/components/KindBadge";
import { type Kind, kindLabel } from "@/components/kind";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { baseOptions } from "@/lib/layout.shared";
import {
  docsPathForItem,
  installCommands,
  loadRegistryIndex,
  type RegistryItem,
} from "@/lib/registry";
import { authorDisplay } from "@/lib/shared";

const PAGE_SIZE = 10;

type Search = {
  q?: string;
  kind?: string[];
  category?: string[];
  source?: string[];
  author?: string[];
  page?: number;
};

function parseList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const list = value.filter(
      (entry): entry is string => typeof entry === "string" && entry.length > 0,
    );
    return list.length > 0 ? list : undefined;
  }
  if (typeof value === "string" && value.length > 0) {
    const list = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    return list.length > 0 ? list : undefined;
  }
  return undefined;
}

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const value = key(item);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function parsePage(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value) && value > 1) {
    return value;
  }
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed) && parsed > 1) return parsed;
  }
  return undefined;
}

/** Compact page list with ellipses for larger result sets. */
function pageList(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current]);
  for (let offset = -1; offset <= 1; offset++) {
    const page = current + offset;
    if (page >= 1 && page <= total) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  for (const page of sorted) {
    const prev = result[result.length - 1];
    if (typeof prev === "number" && page - prev > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }
  return result;
}

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
    kind: parseList(search.kind),
    category: parseList(search.category),
    source: parseList(search.source),
    author: parseList(search.author),
    page: parsePage(search.page),
  }),
  loader: async () => {
    const index = await loadRegistryIndex();
    const categories = [...new Set(index.items.map((i) => i.category))].sort();
    const kinds = [...new Set(index.items.map((i) => i.kind))].sort();
    const authors = [...new Set(index.items.map((i) => authorDisplay(i)))].sort(
      (a, b) => a.localeCompare(b),
    );
    return { items: index.items, categories, kinds, authors };
  },
  component: BrowsePage,
  head: () => ({
    meta: [{ title: "Browse — ted-craft" }],
  }),
});

function BrowsePage() {
  const { items, categories, kinds, authors } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const kindCounts = useMemo(
    () => countBy(items, (item) => item.kind),
    [items],
  );
  const categoryCounts = useMemo(
    () => countBy(items, (item) => item.category),
    [items],
  );
  const sourceCounts = useMemo(
    () => countBy(items, (item) => item.sourceType),
    [items],
  );
  const authorCounts = useMemo(
    () => countBy(items, (item) => authorDisplay(item)),
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.q?.toLowerCase().trim();
    return items.filter((item) => {
      if (search.kind?.length && !search.kind.includes(item.kind)) return false;
      if (search.category?.length && !search.category.includes(item.category)) {
        return false;
      }
      if (search.source?.length && !search.source.includes(item.sourceType)) {
        return false;
      }
      if (
        search.author?.length &&
        !search.author.includes(authorDisplay(item))
      ) {
        return false;
      }
      if (!q) return true;
      const hay = [
        item.slug,
        item.name,
        item.description,
        item.category,
        authorDisplay(item),
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(search.page ?? 1, 1), totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);
  const pages = useMemo(
    () => pageList(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const hasFilters = Boolean(
    search.q ||
      search.kind?.length ||
      search.category?.length ||
      search.source?.length ||
      search.author?.length,
  );

  function update(partial: Search, options?: { resetPage?: boolean }) {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...partial };
        if (options?.resetPage !== false && !("page" in partial)) {
          delete next.page;
        }
        for (const key of Object.keys(next) as (keyof Search)[]) {
          const value = next[key];
          if (
            value == null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0) ||
            (key === "page" && value === 1)
          ) {
            delete next[key];
          }
        }
        return next;
      },
    });
  }

  function goToPage(page: number) {
    const next = Math.min(Math.max(page, 1), totalPages);
    update({ page: next <= 1 ? undefined : next }, { resetPage: false });
  }

  function resetFilters() {
    void navigate({ search: {} });
  }

  async function copyInstall(item: RegistryItem) {
    const cmd = installCommands(item).cursor;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(item.slug);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <HomeLayout {...baseOptions()}>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:px-8">
        <header className="mb-8">
          <h1 className="tc-display text-4xl text-[color:var(--tc-ink)] md:text-5xl">
            Browse
          </h1>
          <p className="mt-2 max-w-2xl text-[color:var(--tc-muted)]">
            Search skills by name or topic. Open a page to see what it does,
            then copy an install command for your agent.
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Input
            type="search"
            placeholder="Filter skills…"
            value={search.q ?? ""}
            onChange={(e) => update({ q: e.target.value || undefined })}
            className="h-8 w-full border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] sm:max-w-xs"
          />
          <FacetedFilter
            title="Kind"
            selected={search.kind ?? []}
            onSelectedChange={(kind) => update({ kind })}
            options={kinds.map((kind) => ({
              label: kindLabel(kind),
              value: kind,
              count: kindCounts.get(kind),
            }))}
          />
          <FacetedFilter
            title="Category"
            selected={search.category ?? []}
            onSelectedChange={(category) => update({ category })}
            options={categories.map((category) => ({
              label: category,
              value: category,
              count: categoryCounts.get(category),
            }))}
          />
          <FacetedFilter
            title="Source"
            selected={search.source ?? []}
            onSelectedChange={(source) => update({ source })}
            options={[
              {
                label: "dev-ted",
                value: "first-party",
                count: sourceCounts.get("first-party"),
              },
              {
                label: "Catalog",
                value: "catalog",
                count: sourceCounts.get("catalog"),
              },
            ]}
          />
          <FacetedFilter
            title="Author"
            selected={search.author ?? []}
            onSelectedChange={(author) => update({ author })}
            options={authors.map((author) => ({
              label: author,
              value: author,
              count: authorCounts.get(author),
            }))}
          />
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-[color:var(--tc-muted)] lg:px-3"
            >
              Reset
              <IconX data-icon="inline-end" className="size-4" />
            </Button>
          ) : null}
        </div>

        <p className="mb-4 font-mono text-xs text-[color:var(--tc-muted)]">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
          {filtered.length > PAGE_SIZE
            ? ` · page ${currentPage} of ${totalPages}`
            : null}
        </p>

        <ul className="flex flex-col gap-3">
          {pageItems.map((item) => (
            <li
              key={item.slug}
              className="rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <KindBadge kind={item.kind as Kind} />
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[color:var(--tc-muted)]">
                      {authorDisplay(item)}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-[color:var(--tc-ink)]">
                    <a
                      href={docsPathForItem(item)}
                      className="hover:underline decoration-[color:var(--tc-brass)] underline-offset-4"
                    >
                      {item.name}
                    </a>
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--tc-muted)]">
                    {item.description}
                  </p>
                  <p className="mt-2 font-mono text-xs text-[color:var(--tc-muted)]">
                    {item.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void copyInstall(item)}
                    className="tc-press border-[color:var(--tc-line)] bg-[color:var(--tc-panel)] hover:border-[color:var(--tc-brass)]"
                  >
                    {copied === item.slug ? "Copied" : "Copy install"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="tc-press bg-[color:var(--tc-ink)] text-[color:var(--tc-paper)] hover:bg-[color:var(--tc-ink)]/90"
                    render={
                      <Link
                        to="/docs/$"
                        params={{
                          _splat: `registry/${item.category}/${item.slug.replace(/\//g, "--")}`,
                        }}
                      />
                    }
                  >
                    Docs
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={currentPage <= 1}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) goToPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {pages.map((page, index) => {
                if (page === "ellipsis") {
                  const prev = pages[index - 1];
                  const key =
                    typeof prev === "number"
                      ? `ellipsis-after-${prev}`
                      : "ellipsis-start";
                  return (
                    <PaginationItem key={key}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        goToPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={currentPage >= totalPages}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) goToPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
      <SiteFooter />
    </HomeLayout>
  );
}
