#!/usr/bin/env node

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';

const [command, target = '.', ...rawArgs] = process.argv.slice(2);
const root = resolve(target);
const stateDirectory = resolve(root, '.ai/memory');
const statePath = resolve(stateDirectory, 'state.json');
const architecturePath = resolve(stateDirectory, 'ARCHITECTURE.md');
const worklogPath = resolve(stateDirectory, 'WORKLOG.md');

function fail(message) {
  process.stderr.write(`memory: ${message}\n`);
  process.exit(1);
}

function git(args) {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  } catch {
    fail(`'${root}' must be a Git working tree.`);
  }
}

function head() {
  return git(['rev-parse', 'HEAD']);
}

function state() {
  if (!existsSync(statePath)) return null;
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    fail(`cannot parse ${relative(root, statePath)}.`);
  }
}

function writeState(value) {
  writeFileSync(statePath, `${JSON.stringify(value, null, 2)}\n`);
}

function pathsSince(previousHead) {
  const committed = previousHead && previousHead !== head()
    ? git(['diff', '--name-only', `${previousHead}..${head()}`]).split('\n').filter(Boolean)
    : [];
  const working = git(['status', '--porcelain=v1', '--untracked-files=all']).split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3).split(' -> ').at(-1));
  return [...new Set([...committed, ...working])]
    .filter((file) => !file.startsWith('.ai/memory/'))
    .sort();
}

function flags(args) {
  const result = {};
  for (let index = 0; index < args.length; index += 2) {
    const [name, value] = [args[index], args[index + 1]];
    if (!name?.startsWith('--') || !value) fail(`expected --name value, received '${name ?? ''}'.`);
    result[name.slice(2)] = value;
  }
  return result;
}

function init() {
  if (existsSync(statePath)) fail(`${relative(root, statePath)} already exists.`);
  mkdirSync(stateDirectory, { recursive: true });
  const currentHead = head();
  writeState({ version: 1, repository: basename(root), lastVerifiedHead: currentHead, lastCheckpointAt: new Date().toISOString() });
  writeFileSync(architecturePath, '# Architecture facts\n\nAdd only facts verified from source code. Cite file/symbol and commit.\n');
  writeFileSync(worklogPath, `# Work log\n\n## Initialized\n\n- Baseline commit: \`${currentHead}\`\n- Architecture has not yet been explored; do not infer it from this file.\n`);
  process.stdout.write(`initialized ${relative(root, stateDirectory)} at ${currentHead}\n`);
}

function status() {
  const previous = state();
  if (!previous) return process.stdout.write('uninitialized\n');
  const paths = pathsSince(previous.lastVerifiedHead);
  if (!paths.length) return process.stdout.write(`current\nbase: ${previous.lastVerifiedHead}\n`);
  process.stdout.write(`changed\nbase: ${previous.lastVerifiedHead}\npaths:\n${paths.map((path) => `- ${path}`).join('\n')}\n`);
}

function checkpoint() {
  const previous = state();
  if (!previous) fail('run init before checkpoint.');
  const input = flags(rawArgs);
  for (const name of ['task', 'summary', 'next', 'files']) if (!input[name]) fail(`--${name} is required.`);
  const now = new Date().toISOString();
  const currentHead = head();
  const files = input.files.split(',').map((file) => file.trim()).filter(Boolean);
  appendFileSync(worklogPath, `\n## ${input.task} — ${now}\n\n- Summary: ${input.summary}\n- Files: ${files.map((file) => '`' + file + '`').join(', ') || 'none'}\n- Next: ${input.next}\n- Verified against: \`${currentHead}\`\n`);
  writeState({ ...previous, lastVerifiedHead: currentHead, lastCheckpointAt: now, lastTask: input.task, lastFiles: files });
  process.stdout.write(`checkpointed ${input.task} at ${currentHead}\n`);
}

if (!['init', 'status', 'checkpoint'].includes(command)) fail('usage: memory.mjs <init|status|checkpoint> [repository] [--task value --summary value --next value --files value]');
if (command === 'init') init();
if (command === 'status') status();
if (command === 'checkpoint') checkpoint();
