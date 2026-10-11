import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type CoverStyle = CSSProperties & {
  "--tc-cover-a": string;
  "--tc-cover-b": string;
  "--tc-cover-c": string;
  "--tc-cover-ax": string;
  "--tc-cover-ay": string;
  "--tc-cover-bx": string;
  "--tc-cover-by": string;
  "--tc-cover-cx": string;
  "--tc-cover-cy": string;
  "--tc-cover-delay": string;
};

/** Brass, stone, slate, and ink. Every stop stays dark enough for light type. */
const COVER_STOPS: ReadonlyArray<readonly [number, number, number]> = [
  [36, 58, 42],
  [26, 46, 24],
  [44, 52, 52],
  [16, 44, 32],
  [214, 32, 32],
  [206, 38, 46],
  [222, 42, 16],
  [198, 40, 28],
  [32, 36, 20],
  [210, 22, 38],
];

function hashSlug(slug: string): number {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickStop(hash: number, shift: number, taken: Set<number>): number {
  const start = (hash >>> shift) % COVER_STOPS.length;
  for (let step = 0; step < COVER_STOPS.length; step++) {
    const index = (start + step) % COVER_STOPS.length;
    if (!taken.has(index)) return index;
  }
  return start;
}

function hsl(index: number): string {
  const stop = COVER_STOPS[index] ?? COVER_STOPS[0];
  if (!stop) return "hsl(36 48% 64%)";
  return `hsl(${stop[0]} ${stop[1]}% ${stop[2]}%)`;
}

/** Stable, unique wash for a skill. Same slug matches on every page. */
export function coverStyle(slug: string): CoverStyle {
  const hash = hashSlug(slug);
  const taken = new Set<number>();
  const a = pickStop(hash, 3, taken);
  taken.add(a);
  const b = pickStop(hash, 9, taken);
  taken.add(b);
  const c = pickStop(hash, 15, taken);
  const ax = 18 + ((hash >>> 8) % 40);
  const ay = 12 + ((hash >>> 12) % 36);
  const bx = 48 + ((hash >>> 16) % 40);
  const by = 20 + ((hash >>> 20) % 40);
  const cx = 24 + ((hash >>> 24) % 48);
  const cy = 52 + ((hash >>> 4) % 36);

  return {
    "--tc-cover-a": hsl(a),
    "--tc-cover-b": hsl(b),
    "--tc-cover-c": hsl(c),
    "--tc-cover-ax": `${ax}%`,
    "--tc-cover-ay": `${ay}%`,
    "--tc-cover-bx": `${bx}%`,
    "--tc-cover-by": `${by}%`,
    "--tc-cover-cx": `${cx}%`,
    "--tc-cover-cy": `${cy}%`,
    "--tc-cover-delay": `-${hash % 12}s`,
  };
}

export function GradientCover({
  slug,
  title,
  titleLevel = "p",
  className,
  titleClassName,
}: {
  slug: string;
  title?: string;
  titleLevel?: "p" | "h3";
  className?: string;
  titleClassName?: string;
}) {
  const Title = titleLevel;

  return (
    <div className={cn("tc-cover", className)} style={coverStyle(slug)}>
      <div className="tc-cover-mesh" aria-hidden>
        <span className="tc-cover-blob tc-cover-blob-a" />
        <span className="tc-cover-blob tc-cover-blob-b" />
        <span className="tc-cover-blob tc-cover-blob-c" />
      </div>
      {title ? (
        <Title
          className={cn(
            "tc-cover-title tc-display relative z-[2] mt-auto px-4 pt-16 pb-4 text-2xl leading-[1.05] tracking-tight",
            titleClassName,
          )}
        >
          {title}
        </Title>
      ) : null}
    </div>
  );
}
