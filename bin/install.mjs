#!/usr/bin/env node
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  rmSync,
  statSync,
  existsSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import { join, dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "customer-experience-excellence";
const COMMAND_NAMESPACE = "cex";
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Records what this installer wrote, so an upgrade can tell your edits from ours.
const MANIFEST_NAME = ".cex-manifest.json";

// Only these ship into the installed skill directory — not package.json, bin/, or the npm README.
const PAYLOAD = ["SKILL.md", "references", "agents", "LICENSE"];

const { version } = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));

const args = process.argv.slice(2);
const has = (...flags) => flags.some((f) => args.includes(f));

if (has("-h", "--help")) {
  console.log(`
  ${SKILL_NAME} v${version}

  Installs the Customer Experience Excellence skill for Claude Code,
  along with its /${COMMAND_NAMESPACE}: slash commands.

  Usage
    npx ${SKILL_NAME} [options]

  Options
    -g, --global     Install for every project (~/.claude)
        --dir <path> Install the skill into a specific skills directory
                     (commands go to its sibling ../commands/${COMMAND_NAMESPACE})
        --skill-only Install the skill without the /${COMMAND_NAMESPACE}: commands
    -f, --force      Overwrite an existing installation (how you upgrade)
        --uninstall  Remove an installed skill and its commands
    -y, --yes        Skip the confirmation prompt when local edits would be lost
    -v, --version    Print the version
    -h, --help       Show this message

  By default everything is installed into ./.claude, so run it from
  the root of the repository you want the skill available in.

  Upgrading keeps your edits safe: --force lists any file you changed
  and asks before overwriting it.
`);
  process.exit(0);
}

if (has("-v", "--version")) {
  console.log(version);
  process.exit(0);
}

const dirFlag = args.indexOf("--dir");
if (dirFlag !== -1 && !args[dirFlag + 1]) {
  console.error("Error: --dir requires a path.");
  process.exit(1);
}

const skillsRoot =
  dirFlag !== -1
    ? resolve(args[dirFlag + 1])
    : has("-g", "--global")
      ? join(homedir(), ".claude", "skills")
      : join(process.cwd(), ".claude", "skills");

// Commands live beside the skills directory: .claude/skills -> .claude/commands/cex
const commandsRoot = join(dirname(skillsRoot), "commands");

const skillTarget = join(skillsRoot, SKILL_NAME);
const commandTarget = join(commandsRoot, COMMAND_NAMESPACE);
const commandSource = join(PACKAGE_ROOT, "commands", COMMAND_NAMESPACE);
const manifestPath = join(skillTarget, MANIFEST_NAME);

const uninstalling = has("--uninstall");
const withCommands = !has("--skill-only") && existsSync(commandSource);

// Claude Code only discovers slash commands under a .claude directory.
const commandsDiscoverable = commandsRoot.split(sep).includes(".claude");

function copyInto(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) copyInto(join(src, entry), join(dest, entry));
  } else {
    copyFileSync(src, dest);
  }
}

function walk(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(relative(base, full).split(sep).join("/"));
  }
  return out;
}

const hashFile = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

// Manifest keys are prefixed so one file covers both install locations.
const pathForKey = (key) =>
  key.startsWith("skill/")
    ? join(skillTarget, key.slice("skill/".length))
    : join(commandTarget, key.slice("commands/".length));

function installedFiles() {
  const keys = [];
  for (const [dir, prefix] of [
    [skillTarget, "skill"],
    [commandTarget, "commands"],
  ]) {
    if (!existsSync(dir)) continue;
    for (const rel of walk(dir)) {
      if (prefix === "skill" && rel === MANIFEST_NAME) continue;
      keys.push(`${prefix}/${rel}`);
    }
  }
  return keys;
}

// Which installed files has the user changed since we wrote them?
function inspectExisting() {
  const present = installedFiles();
  if (!existsSync(manifestPath)) return { tracked: false, modified: [], added: [] };

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return { tracked: false, modified: [], added: [] };
  }

  const recorded = manifest.files ?? {};
  const modified = [];
  const added = [];
  for (const key of present) {
    if (!recorded[key]) added.push(key);
    else if (hashFile(pathForKey(key)) !== recorded[key]) modified.push(key);
  }
  return { tracked: true, version: manifest.version, modified, added };
}

async function confirm(question) {
  if (has("-y", "--yes")) return true;
  if (!process.stdin.isTTY) {
    console.error("\n  Refusing to discard local changes in a non-interactive shell.");
    console.error("  Re-run with --yes if that is what you want.\n");
    return false;
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((res) => rl.question(`  ${question} [y/N] `, res));
  rl.close();
  return /^y(es)?$/i.test(answer.trim());
}

// Nothing here is reversible, so say exactly what is at risk before doing it.
async function clearedToReplace(verb) {
  const state = inspectExisting();

  if (!state.tracked) {
    console.log(`
  This installation has no manifest, so there is no way to tell which files
  you have edited. ${verb === "remove" ? "Removing" : "Overwriting"} it will discard any local changes.

    ${skillTarget}${withCommands && existsSync(commandTarget) ? `\n    ${commandTarget}` : ""}
`);
    return confirm(`${verb === "remove" ? "Remove" : "Overwrite"} anyway?`);
  }

  const changed = [...state.modified, ...state.added];
  if (!changed.length) return true;

  console.log(`
  These files differ from the v${state.version ?? "?"} installation:
`);
  for (const key of state.modified) console.log(`    edited   ${pathForKey(key)}`);
  for (const key of state.added) console.log(`    added    ${pathForKey(key)}`);
  console.log(`
  ${verb === "remove" ? "Uninstalling" : "Upgrading"} overwrites them. Copy anything you want to keep first:

    cp -R "${skillTarget}" ~/cex-backup
`);
  return confirm(`${verb === "remove" ? "Remove" : "Overwrite"} ${changed.length} changed file${changed.length === 1 ? "" : "s"}?`);
}

const existing = [skillTarget, withCommands ? commandTarget : null].filter(
  (p) => p && existsSync(p),
);

if (uninstalling) {
  if (!existing.length) {
    console.error(`Error: no installation found at ${skillTarget}.`);
    process.exit(1);
  }
  if (!(await clearedToReplace("remove"))) process.exit(1);
  try {
    for (const path of existing) rmSync(path, { recursive: true, force: true });
  } catch (err) {
    console.error("Error: could not complete the uninstall.");
    console.error(err.message);
    process.exit(1);
  }
  console.log(`
  Removed ${SKILL_NAME}
${existing.map((p) => `  → ${p}`).join("\n")}
`);
  process.exit(0);
}

if (existing.length && !has("-f", "--force")) {
  for (const path of existing) console.error(`Error: ${path} already exists.`);
  console.error("Re-run with --force to upgrade (it will list anything you have edited first).");
  process.exit(1);
}

if (existing.length && !(await clearedToReplace("overwrite"))) process.exit(1);

try {
  for (const path of existing) rmSync(path, { recursive: true, force: true });

  mkdirSync(skillTarget, { recursive: true });
  for (const item of PAYLOAD) {
    const src = join(PACKAGE_ROOT, item);
    if (existsSync(src)) copyInto(src, join(skillTarget, item));
  }

  if (withCommands) copyInto(commandSource, commandTarget);

  const files = {};
  for (const key of installedFiles()) files[key] = hashFile(pathForKey(key));
  writeFileSync(
    manifestPath,
    `${JSON.stringify({ name: SKILL_NAME, version, installedAt: new Date().toISOString(), files }, null, 2)}\n`,
  );
} catch (err) {
  console.error("Error: could not complete the installation.");
  console.error(err.message);
  process.exit(1);
}

const scope = has("-g", "--global") ? "every project on this machine" : "this repository";
const commands = withCommands
  ? readdirSync(commandTarget)
      .filter((f) => f.endsWith(".md"))
      .map((f) => `/${COMMAND_NAMESPACE}:${f.replace(/\.md$/, "")}`)
      .join("  ")
  : null;

console.log(`
  Installed ${SKILL_NAME} v${version}
  → ${skillTarget}${withCommands ? `\n  → ${commandTarget}` : ""}

  Available in ${scope}.
${commands ? `\n  Commands\n    ${commands}\n` : ""}
  Next: open Claude Code here and run
    ${withCommands ? `/${COMMAND_NAMESPACE}:help` : `/${SKILL_NAME}`}
`);

if (withCommands && !commandsDiscoverable) {
  console.log(`  Warning: Claude Code only finds slash commands under a .claude directory.
  These went to ${commandTarget}, so the /${COMMAND_NAMESPACE}: commands will not load.
  Move them to .claude/commands/${COMMAND_NAMESPACE}, or re-run without --dir.
`);
}
