# React / Next app hardening reference

Practical layers for frontend-heavy apps. Backend authz still required.

## 1. HttpOnly cookies for sessions

**Problem:** Tokens in `localStorage` / `sessionStorage` are readable by any XSS.

**Pattern:**

```http
Set-Cookie: accessToken=…; HttpOnly; Secure; SameSite=Strict; Path=/
```

| Flag | Role |
|------|------|
| `HttpOnly` | Not readable from `document.cookie` |
| `Secure` | HTTPS only |
| `SameSite=Strict` | Strong CSRF mitigation (use `Lax` if cross-site navigations need cookies) |

Frontend stops attaching Bearer tokens from JS storage; cookies go automatically on same-site requests. Plan CSRF (SameSite, tokens, or double-submit) for cookie-based APIs.

## 2. Content-Security-Policy

**Problem:** Injected `<script src="https://evil.com/…">` or inline handlers run in the page origin and can call authenticated APIs (cookies still sent).

**Pattern:** Restrict script (and preferably object/frame/connect) sources.

Next.js sketch:

```js
// next.config — tighten iteratively; 'unsafe-inline' defeats much of CSP
async headers() {
  return [{
    source: '/(.*)',
    headers: [{
      key: 'Content-Security-Policy',
      value: "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    }],
  }];
}
```

Allowlist only trusted CDNs. Prefer nonces/hashes over `'unsafe-inline'` when the stack allows.

CSP blocks many XSS payloads; HttpOnly limits token theft if XSS still occurs.

## 3. DOM sanitization

React escapes text children. Risk is intentional HTML:

```tsx
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

Strip scripts, event handlers (`onerror`, …), dangerous URLs. Sanitize on the server when possible (isomorphic DOMPurify / dedicated HTML sanitizer) so client bundles aren’t the only gate.

Prefer markdown→safe HTML pipelines with a known allowlist over raw CMS HTML.

## 4. Other security headers

| Header | Typical value | Mitigates |
|--------|---------------|-----------|
| `X-Frame-Options` | `DENY` | Clickjacking |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Downgrade / MITM on HTTP |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referrer leakage |
| `Permissions-Policy` | lock down camera/mic/geolocation | Feature abuse |

`frame-ancestors` in CSP can replace `X-Frame-Options` in modern browsers; setting both is fine during migration.

## 5. Environment separation

| Safe in client | Never in client |
|----------------|-----------------|
| Public API base URL | JWT/session secrets |
| Analytics write keys (expect exposure) | Database URLs |
| Feature flag *client* IDs | Stripe secret / webhook secrets |
| | Private keys, OAuth client secrets |

Next.js inlines `NEXT_PUBLIC_*` at build time into the bundle — inspectable by anyone. Rule: if the browser can read it, treat it as public.

Vite: same idea with `import.meta.env.VITE_*`.

## 6. Bot & abuse (Vercel)

For expensive or sensitive POST routes / Server Actions:

- Client: `initBotId` / `BotIdClient` protect list
- Server: `checkBotId()` → 403 when `isBot`
- Config: `withBotId(nextConfig)` when using the BotID integration

Still enforce real auth and rate limits server-side.

## 7. Quick audit grep targets

Search the codebase for:

- `localStorage` / `sessionStorage` + `token` / `jwt` / `accessToken`
- `dangerouslySetInnerHTML`
- `eval(`, `new Function(`, `document.write`
- `process.env.` used in `'use client'` files without `NEXT_PUBLIC_`
- Missing auth checks on Server Actions / route handlers

## Sources

- [5 Security Practices Senior Frontend Engineers Use in React/Next.js (Medium)](https://medium.com/@as6210445/5-security-practices-senior-frontend-engineers-use-in-react-next-js-b72aff328bcc)
- [BotID get started](https://vercel.com/docs/botid/get-started)
- [BotID advanced configuration](https://vercel.com/docs/botid/advanced-configuration)
- [Manage environment variables](https://vercel.com/docs/environment-variables/manage-across-environments)
- [NEXTJS_SAFE_NEXT_PUBLIC_ENV_USAGE (Conformance)](https://vercel.com/docs/conformance/rules/NEXTJS_SAFE_NEXT_PUBLIC_ENV_USAGE)
