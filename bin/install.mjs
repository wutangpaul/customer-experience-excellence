#!/usr/bin/env node
import { readFileSync, mkdirSync, readdirSync, copyFileSync, rmSync, statSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "customer-experience-excellence";
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Only these ship into the installed skill directory — not package.json or bin/.
const PAYLOAD = ["SKILL.md", "references", "agents", "LICENSE", "README.md"];

const { version } = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));

const args = process.argv.slice(2);
const has = (...flags) => flags.some((f) => args.includes(f));

if (has("-h", "--help")) {
  console.log(`
  ${SKILL_NAME} v${version}

  Installs the Customer Experience Excellence skill for Claude Code.

  Usage
    npx ${SKILL_NAME} [options]

  Options
    -g, --global     Install for every project (~/.claude/skills)
        --dir <path> Install into a specific directory
    -f, --force      Overwrite an existing installation
    -v, --version    Print the version
    -h, --help       Show this message

  By default the skill is installed into ./.claude/skills, so run it from
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

const target = join(skillsRoot, SKILL_NAME);

function copyInto(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) copyInto(join(src, entry), join(dest, entry));
  } else {
    copyFileSync(src, dest);
  }
}

if (existsSync(target)) {
  if (!has("-f", "--force")) {
    console.error(`Error: ${target} already exists.`);
    console.error("Re-run with --force to overwrite it.");
    process.exit(1);
  }
  rmSync(target, { recursive: true, force: true });
}

try {
  mkdirSync(target, { recursive: true });
  for (const item of PAYLOAD) {
    const src = join(PACKAGE_ROOT, item);
    if (existsSync(src)) copyInto(src, join(target, item));
  }
} catch (err) {
  console.error(`Error: could not write to ${target}`);
  console.error(err.message);
  process.exit(1);
}

const scope = has("-g", "--global") ? "every project on this machine" : "this repository";

console.log(`
  Installed ${SKILL_NAME} v${version}
  → ${target}

  Available in ${scope}.

  Next: open Claude Code here and run
    /${SKILL_NAME} Review the checkout flow for mobile friction and accessibility.
`);
