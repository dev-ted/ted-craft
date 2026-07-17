import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import {
  docsPathForItem,
  installCommands,
  loadRegistryIndex,
  type RegistryItem,
} from '@/lib/registry';
import { KindBadge } from '@/components/KindBadge';
import type { Kind } from '@/components/kind';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';

type Search = {
  q?: string;
  kind?: string;
  category?: string;
  source?: string;
};

export const Route = createFileRoute('/browse')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === 'string' ? search.q : undefined,
    kind: typeof search.kind === 'string' ? search.kind : undefined,
    category: typeof search.category === 'string' ? search.category : undefined,
    source: typeof search.source === 'string' ? search.source : undefined,
  }),
  loader: async () => {
    const index = await loadRegistryIndex();
    const categories = [...new Set(index.items.map((i) => i.category))].sort();
    const kinds = [...new Set(index.items.map((i) => i.kind))].sort();
    return { items: index.items, categories, kinds };
  },
  component: BrowsePage,
  head: () => ({
    meta: [{ title: 'Browse — ted-craft' }],
  }),
});

function BrowsePage() {
  const { items, categories, kinds } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.q?.toLowerCase().trim();
    return items.filter((item) => {
      if (search.kind && item.kind !== search.kind) return false;
      if (search.category && item.category !== search.category) return false;
      if (search.source && item.sourceType !== search.source) return false;
      if (!q) return true;
      const hay = [item.slug, item.name, item.description, item.category, ...item.tags]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  function update(partial: Search) {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...partial };
        for (const key of Object.keys(next) as (keyof Search)[]) {
          if (!next[key]) delete next[key];
        }
        return next;
      },
    });
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
            Filter first-party craft and attributed catalog skills. Copy an install
            command or open the docs page.
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Input
            type="search"
            placeholder="Search slug, name, tags…"
            value={search.q ?? ''}
            onChange={(e) => update({ q: e.target.value || undefined })}
            className="w-full border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] sm:max-w-xs"
          />
          <NativeSelect
            value={search.kind ?? ''}
            onChange={(e) => update({ kind: e.target.value || undefined })}
          >
            <NativeSelectOption value="">All kinds</NativeSelectOption>
            {kinds.map((k) => (
              <NativeSelectOption key={k} value={k}>
                {k}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            value={search.category ?? ''}
            onChange={(e) => update({ category: e.target.value || undefined })}
          >
            <NativeSelectOption value="">All categories</NativeSelectOption>
            {categories.map((c) => (
              <NativeSelectOption key={c} value={c}>
                {c}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            value={search.source ?? ''}
            onChange={(e) => update({ source: e.target.value || undefined })}
          >
            <NativeSelectOption value="">All sources</NativeSelectOption>
            <NativeSelectOption value="first-party">first-party</NativeSelectOption>
            <NativeSelectOption value="catalog">catalog</NativeSelectOption>
          </NativeSelect>
        </div>

        <p className="mb-4 font-mono text-xs text-[color:var(--tc-muted)]">
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
        </p>

        <ul className="flex flex-col gap-3">
          {filtered.map((item) => (
            <li
              key={item.slug}
              className="rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <KindBadge kind={item.kind as Kind} />
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[color:var(--tc-muted)]">
                      {item.category} · {item.sourceType}
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
                    {copied === item.slug ? 'Copied' : 'Copy install'}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="tc-press bg-[color:var(--tc-ink)] text-[color:var(--tc-paper)] hover:bg-[color:var(--tc-ink)]/90"
                    render={
                      <Link
                        to="/docs/$"
                        params={{
                          _splat: `registry/${item.category}/${item.slug.replace(/\//g, '--')}`,
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
      </div>
    </HomeLayout>
  );
}
