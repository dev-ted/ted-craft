export const appName = "ted-craft";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const browseRoute = "/browse";

export const gitConfig = {
  user: "dev-ted",
  repo: "ted-craft",
  branch: "main",
};

export const siteTagline = "Skills for Cursor, Claude, and Codex";

type Authorable = {
  sourceType: "first-party" | "catalog";
  author?: { name: string; url?: string };
  attribution?: { author: string };
};

/** GitHub handle from a profile URL, or null if not parseable. */
export function githubHandleFromUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    const handle = pathname.split("/")[0];
    return handle || null;
  } catch {
    return null;
  }
}

/** Display author for docs/browse/home chrome (e.g. `dev-ted`, `anthropics`). */
export function authorDisplay(item: Authorable): string {
  if (item.sourceType === "catalog") {
    return item.attribution?.author ?? "unknown";
  }
  return (
    githubHandleFromUrl(item.author?.url) ?? item.author?.name ?? "dev-ted"
  );
}
