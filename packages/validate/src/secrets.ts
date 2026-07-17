export type SecretFinding = {
  file: string;
  pattern: string;
  snippet: string;
};

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "openai-key", re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  {
    name: "private-key",
    re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: "generic-token",
    re: /\b(?:api[_-]?key|access[_-]?token|secret[_-]?key)\s*[:=]\s*['"][^'"]{12,}['"]/gi,
  },
  {
    name: "env-assignment",
    re: /^(?:export\s+)?[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|API_KEY)[A-Z0-9_]*\s*=\s*.+/gim,
  },
];

export function scanForSecrets(
  file: string,
  content: string,
): SecretFinding[] {
  const findings: SecretFinding[] = [];
  for (const { name, re } of PATTERNS) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(content)) !== null) {
      const snippet = match[0].slice(0, 80);
      findings.push({ file, pattern: name, snippet });
    }
  }
  return findings;
}
