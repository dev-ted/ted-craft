---
name: react-security
description: >-
  Secure React and Next.js applications: HttpOnly cookies, CSP, DOM sanitization,
  security headers, environment separation, bot protection, and Snyk code/SCA
  checks. Use when reviewing auth, XSS risk, headers, secrets in the client, or
  hardening a React/Next frontend. Not for ted-craft registry publish checks
  (use security-review for that).
---

# React Security

Defense in depth for React/Next **apps**. Reduce attack surface; never assume the frontend is “just UI.”

**Not this skill:** registry artifact publish checklist → use `security-review`.

**Stacks:** React + Next.js App Router when `next` is present; same principles for Vite/SPA with server-set cookies and reverse-proxy headers.

## Workflow

Copy and track:

```
Security Progress:
- [ ] 1. Threat surface (auth, HTML sinks, headers, env, bots)
- [ ] 2. Auth: no tokens in localStorage; HttpOnly cookies
- [ ] 3. XSS: no unsafe HTML; sanitize or avoid dangerouslySetInnerHTML
- [ ] 4. Headers: CSP + framing/HSTS/nosniff
- [ ] 5. Secrets: only NEXT_PUBLIC_* (or Vite VITE_*) in client
- [ ] 6. Scan: Snyk Code + SCA (if available)
- [ ] 7. Verify: re-scan / manual checklist
```

Deep detail: [references/app-hardening.md](references/app-hardening.md), [references/snyk-workflow.md](references/snyk-workflow.md).

### 1. Auth storage

| Bad | Good |
|-----|------|
| `localStorage.setItem('token', …)` | Server `Set-Cookie` with `HttpOnly; Secure; SameSite=Strict` (or `Lax` if needed) |
| Manual `Authorization: Bearer` from JS-readable storage | Browser sends cookie; CSRF strategy if cookie auth |

XSS that can read `localStorage` steals the session. HttpOnly keeps the token out of script reach. Pair with CSP so XSS is harder to run at all.

### 2. XSS & HTML

- Default React text interpolation is safe — keep user content as text when possible
- Treat `dangerouslySetInnerHTML` as a last resort; sanitize with DOMPurify (or isomorphic sanitizer on server) before render
- Never trust CMS/admin/user HTML just because it “came from the API”
- Audit `href`/`src` for `javascript:` and open redirects

### 3. Headers (Next example)

Set globally (e.g. `next.config` `headers()`, or platform headers):

- `Content-Security-Policy` — start with `script-src 'self'` (tighten iteratively; allowlist needed CDNs)
- `X-Frame-Options: DENY` (or CSP `frame-ancestors 'none'`)
- `Strict-Transport-Security: max-age=31536000` (HTTPS only)
- `X-Content-Type-Options: nosniff`

### 4. Environment variables

- Anything in the client bundle is public
- Next: only `NEXT_PUBLIC_*` for browser code; keep `JWT_SECRET`, DB URLs, Stripe secrets server-only
- Vite: only `VITE_*` (or configured prefix) for client
- On Vercel: mark secrets `--sensitive`; never commit `.env` with real values

### 5. Platform extras (Vercel / Next)

- Protect checkout / signup / expensive Server Actions with BotID (`checkBotId`) when available
- Authenticate Server Actions like API routes
- Don’t embed automation bypass secrets in source

### 6. Snyk gates (when MCP available)

1. `snyk_code_scan` on the app path (SAST)
2. `snyk_sca_scan` on the repo root (dependencies)
3. `snyk_package_health_check` before adding a new dependency

Fix Critical/High first. See [references/snyk-workflow.md](references/snyk-workflow.md).

## Review prompts

- Can a script read the session token?
- Is any HTML rendered without sanitization?
- Would an injected script from a third-party origin execute under current CSP?
- Are any non-`PUBLIC` secrets referenced from client components?
- Are sensitive mutations bot-protected and auth-checked server-side?

## Output format

```markdown
## Security pass

**Surface:** [auth / XSS / headers / env / deps]
**Findings:** Critical / Suggestion / Nice-to-have
**Changes:** [what + why]
**Scans:** [Snyk Code/SCA result summary]
**Residual risk:** [accepted or follow-up]
```

## Sources

Synthesized for agents (not a verbatim copy):

- [5 Security Practices Senior Frontend Engineers Use in React/Next.js (Medium)](https://medium.com/@as6210445/5-security-practices-senior-frontend-engineers-use-in-react-next-js-b72aff328bcc)
- [BotID get started](https://vercel.com/docs/botid/get-started)
- [BotID advanced configuration](https://vercel.com/docs/botid/advanced-configuration)
- [Manage environment variables](https://vercel.com/docs/environment-variables/manage-across-environments)
- [NEXTJS_SAFE_NEXT_PUBLIC_ENV_USAGE (Conformance)](https://vercel.com/docs/conformance/rules/NEXTJS_SAFE_NEXT_PUBLIC_ENV_USAGE)
- [Snyk Code (SAST)](https://docs.snyk.io/scan-with-snyk/snyk-code)
- [Snyk Open Source (SCA)](https://docs.snyk.io/scan-with-snyk/snyk-open-source)
