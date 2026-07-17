type Props = {
  author: string;
  repo: string;
  license: string;
  catalogUrl: string;
};

/** Borderless attribution strip for catalog skills. */
export function AttributionCard({ author, repo, license, catalogUrl }: Props) {
  return (
    <aside className="not-prose my-4 text-sm text-[color:var(--tc-muted)]">
      <p>
        By{" "}
        <span className="font-medium text-[color:var(--tc-ink)]">{author}</span>
        {" · "}
        <a
          href={`https://github.com/${repo}`}
          className="underline decoration-[color:var(--tc-brass)] underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          {repo}
        </a>
      </p>
      <p className="mt-1 text-xs">
        License: {license} · Catalog:{" "}
        <a
          href={catalogUrl}
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          {catalogUrl.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </aside>
  );
}
