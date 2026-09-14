import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
const cli = fileURLToPath(new URL('../memory.mjs', import.meta.url));
function fixture(t) {
  const root = mkdtempSync(resolve(tmpdir(), 'syrion-memory-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
  const write = (path, text) => { mkdirSync(resolve(root, path, '..'), { recursive: true }); writeFileSync(resolve(root, path), text); };
  const run = (...args) => spawnSync(process.execPath, [cli, args[0], root, ...args.slice(1)], { encoding: 'utf8' });
  const ok = (...args) => { const result = run(...args); assert.equal(result.status, 0, result.stderr); return result.stdout; };
  git('init', '-q'); git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'Test');
  write('src/auth/login.ts', 'original\n'); git('add', '.'); git('commit', '-qm', 'baseline');
  const head = git('rev-parse', 'HEAD');
  const record = (file, { id = file.replace(/\W/g, '-'), status = 'active', paths = [], related = [], verified = head, body = '# Notes\nVerified source facts.' } = {}) => write(`.ai/${file}`, `---\nid: ${id}\nstatus: ${status}\npaths: ${JSON.stringify(paths)}\nrelated: ${JSON.stringify(related)}\nverified_at: ${verified}\n---\n${body}\n`);
  ok('init');
  return { root, git, write, run, ok, head, record };
}
test('idempotent initialization preserves records and legacy data; loading is read-only', t => {
  const f = fixture(t);
  f.write('.ai/memory/WORKLOG.md', 'legacy');
  f.record('context.md', { id: 'repository', body: '# Existing team context' });
  f.ok('init');
  assert.match(readFileSync(resolve(f.root, '.ai/context.md'), 'utf8'), /Existing team context/);
  assert.equal(readFileSync(resolve(f.root, '.ai/memory/WORKLOG.md'), 'utf8'), 'legacy');
  const before = readFileSync(resolve(f.root, '.ai/index.json'), 'utf8');
  assert.match(f.ok('load'), /Legacy/);
  assert.equal(readFileSync(resolve(f.root, '.ai/index.json'), 'utf8'), before);
  f.ok('validate');
});
test('selects task, matching contexts and transitive links while excluding unrelated/complete records', t => {
  const f = fixture(t);
  f.record('tasks/login.md', { id: 'login', paths: ['src/auth/**'], related: ['decisions/storage.md'] });
  f.record('contexts/auth.md', { paths: ['src/auth/**'] });
  f.record('contexts/billing.md', { paths: ['src/billing/**'] });
  f.record('tasks/finished.md', { status: 'complete', paths: ['src/auth/**'] });
  f.record('decisions/storage.md', { related: ['archive/previous.md'] });
  f.record('archive/previous.md', { id: 'previous', status: 'complete', related: ['decisions/storage.md'] });
  const out = f.ok('load', '--task', 'login');
  for (const path of ['tasks/login.md', 'contexts/auth.md', 'decisions/storage.md', 'archive/previous.md']) assert.ok(out.includes(`## .ai/${path}`), path);
  assert.ok(!out.includes('## .ai/contexts/billing.md'));
  assert.ok(!out.includes('tasks/finished.md'));
  assert.match(f.ok('load', '--task', 'previous'), /## .ai\/archive\/previous.md/);
  assert.match(f.run('load', '--task', 'missing').stderr, /unknown task/);
});
test('detects committed, staged, untracked, deleted and renamed associated paths', t => {
  const f = fixture(t);
  f.record('contexts/auth.md', { paths: ['src/auth/**'] });
  f.write('src/auth/login.ts', 'committed\n'); f.git('add', 'src'); f.git('commit', '-qm', 'change');
  assert.match(f.ok('load', '--paths', 'src/auth/login.ts'), /POSSIBLY STALE: src\/auth\/login.ts/);
  f.record('contexts/auth.md', { paths: ['src/auth/**'], verified: f.git('rev-parse', 'HEAD') });
  assert.ok(!f.ok('load', '--paths', 'src/auth/login.ts').includes('POSSIBLY STALE'));
  f.git('mv', 'src/auth/login.ts', 'src/auth/renamed file.ts');
  assert.match(f.ok('load'), /## .ai\/contexts\/auth.md/);
  assert.match(f.ok('load'), /POSSIBLY STALE/);
  f.write('src/auth/new file.ts', 'new');
  assert.match(f.ok('load'), /src\/auth\/new file.ts/);
  f.git('rm', '-f', 'src/auth/renamed file.ts');
  assert.match(f.ok('load'), /src\/auth\/login.ts/);
});
test('missing and divergent verification commits are unknown', t => {
  const f = fixture(t);
  f.record('contexts/auth.md', { paths: ['src/auth/**'], verified: 'a'.repeat(40) });
  assert.match(f.ok('load', '--paths', 'src/auth/login.ts'), /UNKNOWN/);
  f.git('checkout', '-qb', 'side'); f.write('side.txt', 'side'); f.git('add', 'side.txt'); f.git('commit', '-qm', 'side');
  const side = f.git('rev-parse', 'HEAD'); f.git('checkout', '-q', '--detach', f.head);
  f.record('contexts/auth.md', { paths: ['src/auth/**'], verified: side });
  assert.match(f.ok('load', '--paths', 'src/auth/login.ts'), /UNKNOWN/);
});
test('output respects budget and exposes oversized selected records as references', t => {
  const f = fixture(t);
  f.record('tasks/large.md', { id: 'large', body: 'x'.repeat(13000) });
  for (let i = 0; i < 60; i++) f.record(`contexts/area-${i}.md`);
  for (const budget of [1000, 12000]) {
    const output = f.ok('load', '--task', 'large', '--budget', String(budget));
    assert.ok(output.length <= budget, output.length);
    assert.ok(!output.includes('## .ai/tasks/large.md'));
    assert.match(output, /- .ai\/tasks\/large.md/);
    assert.match(output, /reference\(s\) omitted/);
  }
  assert.notEqual(f.run('load', '--budget', 'NaN').status, 0);
});
test('validation rejects stale index, invalid metadata, duplicate IDs, dangling links and oversized records', t => {
  const f = fixture(t);
  f.record('contexts/auth.md', { id: 'auth' });
  assert.match(f.run('validate').stderr, /index is stale/);
  f.ok('index'); f.ok('validate');
  f.record('contexts/auth.md', { id: 'repository' });
  assert.match(f.run('index').stderr, /duplicate id/);
  f.record('contexts/auth.md', { related: ['decisions/missing.md'] });
  assert.match(f.run('validate').stderr, /broken related link/);
  f.record('contexts/auth.md', { status: 'unknown' });
  assert.match(f.run('validate').stderr, /invalid status/);
  f.record('contexts/auth.md', { body: 'x'.repeat(16000) });
  assert.match(f.run('validate').stderr, /exceeds/);
  f.write('.ai/contexts/auth.md', '# No metadata');
  assert.match(f.run('validate').stderr, /missing metadata/);
});
test('supports YAML block lists and glob matching without requiring an up-to-date index', t => {
  const f = fixture(t);
  f.write('.ai/contexts/auth.md', `---\nid: auth\nstatus: active\npaths:\n  - "src/**/log?n.*"\nrelated: []\nverified_at: ${f.head}\n---\n# Auth`);
  assert.match(f.ok('load', '--paths', 'src/auth/login.ts'), /## .ai\/contexts\/auth.md/);
  assert.match(f.ok('load', '--paths', 'src/login.ts'), /## .ai\/contexts\/auth.md/);
  assert.ok(!f.ok('load', '--paths', 'other/login.ts').includes('## .ai/contexts/auth.md'));
});
test('rejects symlinks and traversal in metadata', t => {
  const f = fixture(t);
  f.record('contexts/auth.md', { related: ['../secret.md'] });
  assert.match(f.run('load').stderr, /invalid related/);
  f.record('contexts/auth.md');
  symlinkSync(resolve(f.root, 'src/auth/login.ts'), resolve(f.root, '.ai/contexts/link.md'));
  assert.match(f.run('load').stderr, /symlinks/);
});
