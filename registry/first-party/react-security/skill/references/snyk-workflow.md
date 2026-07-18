# Snyk validation workflow (React / Next apps)

Use when the Snyk MCP plugin is available and authenticated. Skip cleanly if tools are missing — still apply the app-hardening checklist.

## When to run

| Moment | Tool |
|--------|------|
| After auth/XSS/HTML changes | `snyk_code_scan` |
| After dependency bumps or lockfile changes | `snyk_sca_scan` |
| Before adding a new package | `snyk_package_health_check` |
| Security review / pre-release | Code + SCA together |

## Code scan (SAST)

```
snyk_code_scan
  path: <absolute path to app or monorepo package>
  severity_threshold: high   # optional: low | medium | high
```

Focus remediation on:

- XSS / unsafe HTML sinks (`dangerouslySetInnerHTML`, unsanitized markup)
- Path traversal / open redirects in frontend routers or file URLs
- Hardcoded secrets / credentials in source
- Insecure crypto or weak random for security-sensitive tokens (client-side anti-patterns)

Re-scan the same path after fixes. Do not claim “clean” without a re-scan.

## SCA scan (dependencies)

```
snyk_sca_scan
  path: <absolute path to directory with package.json / lockfile>
```

Priority:

1. Critical with known exploit
2. Critical
3. High with known exploit
4. High
5. Medium / Low

Prefer upgrades with a published fix version. For transitive issues, upgrade the parent when possible; use overrides/resolutions only when necessary. Run a breakability check before major bumps when that tool is available.

## Package health (new deps)

Before `npm/bun/pnpm add <pkg>`:

```
snyk_package_health_check
  package: <name>
  version: <optional>
  ecosystem: npm
```

Disqualify candidates with Critical/High vulns, archived/inactive maintenance, or typosquat signals — regardless of popularity.

## Agent behavior

- Fix one vulnerability *type* thoroughly when remediating (all instances in a file for Code)
- Minimal diffs; no drive-by refactors
- Never invent a fix version if SCA reports no upgrade path — document residual risk instead
- Registry-only publish checks remain in the separate `security-review` skill

## Common React findings to expect

| Pattern | Direction |
|---------|-----------|
| Token in `localStorage` | Move to HttpOnly cookie session |
| Raw HTML render | Sanitize or remove sink |
| Missing security headers | Add CSP + framing/HSTS/nosniff |
| Secret in client bundle | Move server-side; drop non-PUBLIC env from client |
| Vulnerable transitive dep | Upgrade parent or constrain to fixed version |

## Sources

- [Snyk Code (SAST)](https://docs.snyk.io/scan-with-snyk/snyk-code)
- [Snyk Open Source (SCA)](https://docs.snyk.io/scan-with-snyk/snyk-open-source)
- [Snyk CLI / MCP scanning](https://docs.snyk.io/developer-tools)
