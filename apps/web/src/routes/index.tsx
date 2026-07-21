import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { KindBadge } from "@/components/KindBadge";
import type { Kind } from "@/components/kind";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { WorkbenchTerminal } from "@/components/WorkbenchTerminal";
import { baseOptions } from "@/lib/layout.shared";
import {
  docsPathForItem,
  hasPublicDocs,
  loadRegistryIndex,
  type RegistryItem,
} from "@/lib/registry";
import { authorDisplay } from "@/lib/shared";

export const Route = createFileRoute("/")({
  loader: async () => {
    const index = await loadRegistryIndex();
    const withDocs = index.items.filter(hasPublicDocs);
    const featured = withDocs.filter((i) => i.cli?.featured).slice(0, 6);
    return {
      featured: featured.length > 0 ? featured : withDocs.slice(0, 6),
      count: index.items.length,
    };
  },
  component: Home,
  head: () => ({
    meta: [
      { title: "ted-craft — skills for your AI agent" },
      {
        name: "description",
        content:
          "Browse skills for Cursor, Claude, and Codex — see what each one does and add it in one command.",
      },
    ],
  }),
});

function Home() {
  const { featured, count } = Route.useLoaderData();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-el]", {
        y: 18,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      });
      gsap.from("[data-feature-card]", {
        y: 16,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        delay: 0.25,
        ease: "power2.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <HomeLayout {...baseOptions()}>
      <div ref={rootRef} className="tc-landing relative flex-1 overflow-hidden">
        <div
          className="tc-grain pointer-events-none absolute inset-0"
          aria-hidden
        />
        <section className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col justify-center px-4 py-16 md:px-8">
          <p
            data-hero-el
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--tc-muted)]"
          >
            Marketplace · {count} skills
          </p>
          <h1
            data-hero-el
            className="tc-display max-w-3xl text-5xl leading-[0.95] tracking-tight text-[color:var(--tc-ink)] md:text-7xl"
          >
            ted-craft
          </h1>
          <p
            data-hero-el
            className="mt-5 max-w-xl text-lg text-[color:var(--tc-muted)] md:text-xl"
          >
            Find skills for Cursor, Claude, and Codex — see what each one does,
            then add it with one command.
          </p>
          <div data-hero-el className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="tc-press rounded-lg bg-[color:var(--tc-ink)] text-[color:var(--tc-paper)] hover:bg-[color:var(--tc-ink)]/90"
              render={<Link to="/browse" />}
            >
              Browse skills
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="tc-press rounded-lg border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] text-[color:var(--tc-ink)] hover:border-[color:var(--tc-brass)]"
              render={
                <Link to="/docs/$" params={{ _splat: "getting-started" }} />
              }
            >
              Docs
            </Button>
          </div>

          <div data-hero-el className="mt-12">
            <WorkbenchTerminal />
          </div>
        </section>

        <section className="relative mx-auto max-w-5xl px-4 pb-24 md:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="tc-display text-2xl text-[color:var(--tc-ink)] md:text-3xl">
              Featured
            </h2>
            <Link
              to="/browse"
              className="text-sm text-[color:var(--tc-muted)] underline decoration-[color:var(--tc-brass)] underline-offset-4 transition-opacity duration-150 ease-out hover:opacity-80"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((item) => (
              <FeatureCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
        <SiteFooter />
      </div>
    </HomeLayout>
  );
}

function FeatureCard({ item }: { item: RegistryItem }) {
  const href = docsPathForItem(item);
  return (
    <a
      data-feature-card
      href={href}
      className="tc-press group block rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-surface)] p-4 transition-[transform,border-color,background-color] duration-150 ease-out hover:border-[color:var(--tc-brass)] hover:bg-[color:var(--tc-panel-hover)]"
    >
      <div className="mb-2 flex items-center gap-2">
        <KindBadge kind={item.kind as Kind} />
        <span className="font-mono text-[10px] uppercase tracking-wide text-[color:var(--tc-muted)]">
          {authorDisplay(item)}
        </span>
      </div>
      <h3 className="text-base font-semibold text-[color:var(--tc-ink)] group-hover:text-[color:var(--tc-ink)]">
        {item.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-[color:var(--tc-muted)]">
        {item.description}
      </p>
    </a>
  );
}
