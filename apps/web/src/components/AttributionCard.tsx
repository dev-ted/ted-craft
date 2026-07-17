type Props = {
  author: string;
  repo: string;
  license: string;
  catalogUrl: string;
};

export function AttributionCard({ author, repo, license, catalogUrl }: Props) {
  return (
    <aside className="not-prose my-6 rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-panel)] p-4">
      <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--tc-muted)] mb-2">
        Attribution
      </p>
      <p className="text-sm text-[color:var(--tc-ink)]">
        By <span className="font-medium">{author}</span> ·{' '}
        <a
          href={`https://github.com/${repo}`}
          className="underline decoration-[color:var(--tc-brass)] underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          {repo}
        </a>
      </p>
      <p className="mt-1 text-xs text-[color:var(--tc-muted)]">
        License: {license} · Catalog:{' '}
        <a
          href={catalogUrl}
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          {catalogUrl.replace(/^https?:\/\//, '')}
        </a>
      </p>
    </aside>
  );
}
