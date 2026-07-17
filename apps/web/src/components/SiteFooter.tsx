export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[color:var(--tc-line)]/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-[color:var(--tc-muted)] md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} ted-craft. All rights reserved.</p>
        <p>
          Created by{' '}
          <a
            href="https://frontendted.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--tc-ink)] underline decoration-[color:var(--tc-brass)] underline-offset-4 transition-opacity duration-150 ease-out hover:opacity-80"
          >
            ted.code
          </a>
        </p>
      </div>
    </footer>
  );
}
