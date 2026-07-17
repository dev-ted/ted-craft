import { codeToHtml } from "shiki";

const MAX_CACHE_SIZE = 200;
const highlightCache = new Map<string, string>();

function cacheKey(language: string, code: string): string {
  return `${language}:${code.length}:${code.slice(0, 64)}:${code.slice(-64)}`;
}

function getFromCache(key: string) {
  return highlightCache.get(key);
}

function setInCache(key: string, value: string) {
  if (highlightCache.size >= MAX_CACHE_SIZE) {
    const firstKey = highlightCache.keys().next().value;
    if (firstKey) highlightCache.delete(firstKey);
  }
  highlightCache.set(key, value);
}

export async function highlightCode(
  code: string,
  language: string = "markdown",
): Promise<string> {
  const key = cacheKey(language, code);
  const cached = getFromCache(key);
  if (cached) return cached;

  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          node.properties["data-language"] = language;
          node.properties.class =
            "tc-shiki-pre min-w-0 overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed outline-none !bg-transparent m-0";
        },
        code(node) {
          node.properties["data-line-numbers"] = "";
        },
        line(node) {
          node.properties["data-line"] = "";
        },
      },
    ],
  });

  setInCache(key, html);
  return html;
}
