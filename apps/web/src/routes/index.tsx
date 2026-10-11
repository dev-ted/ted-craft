import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { GradientCover } from "@/components/GradientCover";
import { KindBadge } from "@/components/KindBadge";
import { type Kind, kindLabel } from "@/components/kind";
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
        y: 8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
      gsap.from("[data-feature-card]", {
        y: 8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        delay: 0.15,
        ease: "power2.out",
        clearProps: "transform,opacity",
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
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="tc-display text-2xl text-[color:var(--tc-ink)] md:text-3xl">
              Featured
            </h2>
            <Link
              to="/browse"
              className="text-sm text-[color:var(--tc-muted)] underline decoration-[color:var(--tc-brass)] underline-offset-4 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:opacity-80"
            >
              View all
            </Link>
          </div>
          {featured[0] ? <LeadFeature item={featured[0]} /> : null}
          {featured.length > 1 ? (
            <div className="mt-12">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--tc-muted)]">
                More
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {featured.slice(1, 4).map((item) => (
                  <MoreFeature key={item.slug} item={item} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
        <SiteFooter />
      </div>
    </HomeLayout>
  );
}

function LeadFeature({ item }: { item: RegistryItem }) {
  const href = docsPathForItem(item);
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div data-feature-card>
        <div className="mb-3 flex items-center gap-2">
          <KindBadge kind={item.kind as Kind} />
          <span className="font-mono text-[10px] uppercase tracking-wide text-[color:var(--tc-muted)]">
            {authorDisplay(item)}
          </span>
        </div>
        <h3 className="tc-display max-w-md text-4xl leading-[0.95] tracking-tight text-[color:var(--tc-ink)] md:text-5xl">
          {item.name}
        </h3>
        <p className="mt-4 max-w-md text-base text-[color:var(--tc-muted)]">
          {item.description}
        </p>
        <Button
          className="tc-press mt-6 rounded-lg bg-[color:var(--tc-ink)] text-[color:var(--tc-paper)] hover:bg-[color:var(--tc-ink)]/90"
          render={<a href={href} />}
        >
          Read more
        </Button>
      </div>
      <a
        data-feature-card
        href={href}
        className="tc-card block overflow-hidden rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-surface)]"
      >
        <GradientCover
          slug={item.slug}
          title={item.name}
          className="min-h-56 md:min-h-64"
          titleClassName="text-3xl md:text-4xl"
        />
        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-wide text-[color:var(--tc-muted)]">
            {kindLabel(item.kind)} · {authorDisplay(item)}
          </p>
          <p className="mt-2 line-clamp-3 text-sm text-[color:var(--tc-muted)]">
            {item.description}
          </p>
        </div>
      </a>
    </div>
  );
}

function MoreFeature({ item }: { item: RegistryItem }) {
  const href = docsPathForItem(item);
  return (
    <a
      data-feature-card
      href={href}
      className="tc-card block overflow-hidden rounded-xl border border-[color:var(--tc-line)] bg-[color:var(--tc-surface)]"
    >
      <GradientCover
        slug={item.slug}
        title={item.name}
        titleLevel="h3"
        className="min-h-40"
      />
      <div className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-wide text-[color:var(--tc-muted)]">
          {kindLabel(item.kind)} · {authorDisplay(item)}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-[color:var(--tc-muted)]">
          {item.description}
        </p>
      </div>
    </a>
  );
}
