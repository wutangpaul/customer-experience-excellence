#!/usr/bin/env node
import { readFileSync, mkdirSync, readdirSync, copyFileSync, rmSync, statSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "customer-experience-excellence";
const COMMAND_NAMESPACE = "cex";
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Only these ship into the installed skill directory — not package.json or bin/.
const PAYLOAD = ["SKILL.md", "references", "agents", "LICENSE", "README.md"];

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
    -f, --force      Overwrite an existing installation
    -v, --version    Print the version
    -h, --help       Show this message

  By default everything is installed into ./.claude, so run it from
  the root of the repository you want the skill available in.
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

const withCommands = !has("--skill-only") && existsSync(commandSource);

function copyInto(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) copyInto(join(src, entry), join(dest, entry));
  } else {
    copyFileSync(src, dest);
  }
}

const existing = [skillTarget, withCommands ? commandTarget : null].filter(
  (p) => p && existsSync(p),
);

if (existing.length && !has("-f", "--force")) {
  for (const path of existing) console.error(`Error: ${path} already exists.`);
  console.error("Re-run with --force to overwrite.");
  process.exit(1);
}

try {
  for (const path of existing) rmSync(path, { recursive: true, force: true });

  mkdirSync(skillTarget, { recursive: true });
  for (const item of PAYLOAD) {
    const src = join(PACKAGE_ROOT, item);
    if (existsSync(src)) copyInto(src, join(skillTarget, item));
  }

  if (withCommands) copyInto(commandSource, commandTarget);
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
    ${withCommands ? `/${COMMAND_NAMESPACE}:review` : `/${SKILL_NAME}`} Review the checkout flow for mobile friction and accessibility.
`);
