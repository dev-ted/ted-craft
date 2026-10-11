#!/usr/bin/env node
/**
 * AI Delivery checks (after-edit and stop hook).
 *
 * Threat model: local-only. Reads stdin JSON from the agent tool. May spawn one
 * allowlisted local check already in the repo. No network, no eval, no remote
 * imports, shell: false.
 *
 * Why child_process: the delivery pack requires check:file / check:change to
 * run even when the agent skips them. This process only invokes those names.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

const MAX_OUTPUT = 8 * 1024;
const FILE_TIMEOUT_MS = 30_000;
const CHANGE_TIMEOUT_MS = 180_000;
const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  "coverage",
  ".next",
  "build",
]);

const RUNNERS = new Set(["bun", "npm", "pnpm", "yarn"]);
const LOCAL_FILE_NAMES = {
  file: ["check-file.mjs"],
  change: ["check-change.mjs"],
};
const LOCAL_DIRS = ["scripts", ".ai-delivery"];

/**
 * @param {unknown} input
 * @returns {string | null}
 */
function workspaceRoot(input) {
  if (!input || typeof input !== "object") return null;
  const roots = /** @type {{ workspace_roots?: unknown }} */ (input).workspace_roots;
  if (Array.isArray(roots) && typeof roots[0] === "string" && roots[0].trim()) {
    return resolve(roots[0]);
  }
  return resolve(process.cwd());
}

/**
 * @param {unknown} input
 * @param {string} root
 * @returns {string | null}
 */
function resolveFilePath(input, root) {
  if (!input || typeof input !== "object") return null;
  const raw = /** @type {{ file_path?: unknown }} */ (input).file_path;
  if (typeof raw !== "string" || !raw.trim()) return null;
  return isAbsolute(raw) ? resolve(raw) : resolve(join(root, raw));
}

/**
 * @param {string} filePath
 * @param {string} root
 */
function isInsideRoot(filePath, root) {
  let realFile;
  let realRoot;
  try {
    realFile = realpathSync(filePath);
  } catch {
    realFile = resolve(filePath);
  }
  try {
    realRoot = realpathSync(root);
  } catch {
    realRoot = resolve(root);
  }
  const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep;
  return realFile === realRoot || realFile.startsWith(prefix);
}

/**
 * @param {string} filePath
 * @param {string} root
 */
function isSkippedPath(filePath, root) {
  const rel = relative(root, filePath);
  if (!rel || rel.startsWith("..")) return true;
  return rel.split(/[\\/]/).some((part) => SKIP_DIR_NAMES.has(part));
}

/**
 * @param {string} root
 */
function packageManager(root) {
  if (existsSync(join(root, "bun.lock")) || existsSync(join(root, "bun.lockb"))) {
    return "bun";
  }
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  return "npm";
}

/**
 * @param {string} root
 * @param {"file" | "change"} kind
 * @returns {string | null}
 */
function packageScript(root, kind) {
  const pkgPath = join(root, "package.json");
  if (!existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const scripts = pkg && typeof pkg === "object" ? pkg.scripts : null;
    if (!scripts || typeof scripts !== "object") return null;
    const name = kind === "file" ? "check:file" : "check:change";
    return typeof scripts[name] === "string" && scripts[name].trim() ? name : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} root
 * @param {"file" | "change"} kind
 * @returns {string | null}
 */
function localScript(root, kind) {
  const names = LOCAL_FILE_NAMES[kind];
  for (const dir of LOCAL_DIRS) {
    for (const name of names) {
      const candidate = join(root, dir, name);
      if (!existsSync(candidate)) continue;
      if (!isInsideRoot(candidate, root)) continue;
      try {
        if (!statSync(candidate).isFile()) continue;
      } catch {
        continue;
      }
      return candidate;
    }
  }
  return null;
}

/**
 * @param {string} text
 */
function lastTwentyLines(text) {
  const lines = text.split(/\r?\n/);
  const slice = lines.slice(-20).join("\n");
  if (slice.length <= MAX_OUTPUT) return slice;
  return slice.slice(-MAX_OUTPUT);
}

/**
 * @param {{ cmd: string, args: string[], cwd: string, timeout: number }} spec
 */
function run(spec) {
  const result = spawnSync(spec.cmd, spec.args, {
    cwd: spec.cwd,
    timeout: spec.timeout,
    encoding: "utf8",
    shell: false,
    env: { ...process.env, AI_DELIVERY_CHECK: "1" },
  });
  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  const stderr = typeof result.stderr === "string" ? result.stderr : "";
  const combined = `${stdout}${stderr}`.trim();
  const timedOut = Boolean(result.error && result.error.message.includes("TIMEDOUT"));
  const hasStatus = typeof result.status === "number";
  return {
    status: hasStatus ? result.status : 1,
    output: lastTwentyLines(combined),
    error: result.error ? result.error.message : "",
    timedOut,
    spawnFailed: result.error != null && !hasStatus && !timedOut,
  };
}

/**
 * @param {string} name
 */
function runnerBin(name) {
  if (!RUNNERS.has(name)) return null;
  if (process.platform === "win32") {
    if (name === "yarn") return "yarn.cmd";
    if (name === "pnpm") return "pnpm.cmd";
    if (name === "npm") return "npm.cmd";
    if (name === "bun") return "bun.exe";
  }
  return name;
}

/**
 * @param {string} root
 * @param {"file" | "change"} kind
 * @param {string | null} filePath
 */
function resolveCommand(root, kind, filePath) {
  const script = packageScript(root, kind);
  if (script) {
    const pm = runnerBin(packageManager(root));
    if (!pm) return null;
    const args = ["run", script];
    if (kind === "file" && filePath) {
      args.push("--", filePath);
    }
    return {
      cmd: pm,
      args,
      cwd: root,
      timeout: kind === "file" ? FILE_TIMEOUT_MS : CHANGE_TIMEOUT_MS,
      label: `${pm} run ${script}`,
    };
  }

  const local = localScript(root, kind);
  if (local) {
    const args = [local];
    if (kind === "file" && filePath) args.push(filePath);
    return {
      cmd: process.execPath,
      args,
      cwd: root,
      timeout: kind === "file" ? FILE_TIMEOUT_MS : CHANGE_TIMEOUT_MS,
      label: `node ${relative(root, local)}`,
    };
  }

  return null;
}

/**
 * Local signal that the agent hit a hard stop and must end the turn.
 * CI still blocks a red merge. A false file breaks the test rule.
 * @param {string} root
 * @returns {{ stop: number, reason: string } | null}
 */
function readHardStop(root) {
  const file = join(root, ".ai-delivery", "hard-stop.json");
  if (!existsSync(file) || !isInsideRoot(file, root)) return null;
  try {
    const st = statSync(file);
    if (!st.isFile() || st.size > 4096) return null;
    const data = JSON.parse(readFileSync(file, "utf8"));
    const stop = data && data.stop;
    const reason = data && data.reason;
    if (!Number.isInteger(stop) || stop < 1 || stop > 7) return null;
    if (typeof reason !== "string") return null;
    const line = reason.trim();
    if (!line || line.includes("\n") || line.length > 240) return null;
    return { stop, reason: line };
  } catch {
    return null;
  }
}

/**
 * @param {Record<string, unknown>} payload
 */
function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function main() {
  const kind = process.argv.includes("--change") ? "change" : "file";

  try {
    const raw = readFileSync(0, "utf8").trim();
    const input = raw ? JSON.parse(raw) : {};
    const root = workspaceRoot(input);
    if (!root) {
      process.exit(0);
      return;
    }

    if (kind === "file") {
      const filePath = resolveFilePath(input, root);
      if (!filePath || !isInsideRoot(filePath, root) || isSkippedPath(filePath, root)) {
        process.exit(0);
        return;
      }
      const spec = resolveCommand(root, "file", filePath);
      if (!spec) {
        emit({
          additional_context:
            "check:file is not wired. Add a package.json script named check:file, or a Node script at scripts/check-file.mjs. Use ai-delivery-setup.",
        });
        process.exit(0);
        return;
      }
      const result = run(spec);
      if (result.status !== 0) {
        const detail = result.output || result.error || "check:file failed";
        emit({
          additional_context: `${spec.label} failed (exit ${result.status}).\n${detail}`,
        });
      }
      process.exit(0);
      return;
    }

    const spec = resolveCommand(root, "change", null);
    if (!spec) {
      emit({
        followup_message:
          "check:change is not wired. Add a package.json script named check:change, or a Node script at scripts/check-change.mjs. Use ai-delivery-setup. Not blocking.",
      });
      process.exit(0);
      return;
    }

    const result = run(spec);
    if (result.spawnFailed) {
      emit({
        followup_message: `${spec.label} could not start (${result.error || "spawn failed"}). Not blocking. Wire check:change with ai-delivery-setup.`,
      });
      process.exit(0);
      return;
    }
    if (result.status === 0 && !result.timedOut) {
      process.exit(0);
      return;
    }

    const detail = result.output || result.error || "check:change failed";
    const hardStop = readHardStop(root);
    if (hardStop) {
      emit({
        followup_message: `Hard stop ${hardStop.stop}: ${hardStop.reason}\n${spec.label} is red (exit ${result.status}). Not blocking this turn. CI still blocks merge.\n${detail}`,
      });
      process.exit(0);
      return;
    }

    emit({
      followup_message: `${spec.label} failed (exit ${result.status}). Fix the failures, then stop again. Do not edit tests, ratchets, or this hook to go green.\n${detail}`,
    });
    process.exit(2);
  } catch {
    process.exit(0);
  }
}

main();
