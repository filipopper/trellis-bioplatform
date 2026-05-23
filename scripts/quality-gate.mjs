import fs from 'fs';
import path from 'path';

const root = process.cwd();
const appRoot = path.join(root, 'client/app');

const jsFiles = walk(appRoot).filter((f) => f.endsWith('.js'));
const rel = (p) => path.relative(root, p).replaceAll('\\', '/');
const graph = new Map();
const importers = new Map();
const errors = [];
const warnings = [];

for (const file of jsFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const imports = [...content.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  const deps = [];

  for (const imp of imports) {
    if (!imp.startsWith('.')) continue;
    const resolved = path.normalize(path.join(path.dirname(file), imp + (imp.endsWith('.js') ? '' : '.js')));
    if (fs.existsSync(resolved)) {
      deps.push(resolved);
      const key = rel(resolved);
      importers.set(key, (importers.get(key) || 0) + 1);
    }
  }
  graph.set(file, deps);
}

// Circular dependency detection
const visiting = new Set();
const visited = new Set();
const stack = [];
function dfs(node) {
  if (visiting.has(node)) {
    const i = stack.indexOf(node);
    errors.push(`Circular dependency: ${stack.slice(i).map(rel).join(' -> ')} -> ${rel(node)}`);
    return;
  }
  if (visited.has(node)) return;
  visiting.add(node);
  stack.push(node);
  for (const dep of graph.get(node) || []) dfs(dep);
  stack.pop();
  visiting.delete(node);
  visited.add(node);
}
for (const file of jsFiles) dfs(file);

// Orphan module detection (exclude entrypoints/config-only leaves)
const allowedOrphans = new Set([
  'client/app/main.js',
  'client/app/core/router/view-registry.js',
  'client/app/core/scripts/header.js',
  'client/app/core/scripts/menu.js',
  'client/app/core/scripts/screenshot.js',
  'client/app/features/contact/model.js',
  'client/app/features/genealogy/tree.js',
  'client/app/shared/utils/escape-html.js',
]);
for (const file of jsFiles.map(rel)) {
  const importedBy = importers.get(file) || 0;
  if (importedBy === 0 && !allowedOrphans.has(file)) {
    warnings.push(`Potential orphan module: ${file}`);
  }
}

// duplicate helper/service names across features/shared
const nameIndex = new Map();
for (const f of jsFiles.map(rel)) {
  const base = path.basename(f);
  nameIndex.set(base, [...(nameIndex.get(base) || []), f]);
}
for (const [name, files] of nameIndex.entries()) {
  if (files.length > 1 && /(service|utils?|helper|storage|config)\.js$/.test(name)) {
    warnings.push(`Potential duplicate utility: ${name} -> ${files.join(', ')}`);
  }
}

if (errors.length) {
  console.error('Quality gate FAILED');
  errors.forEach((e) => console.error(`- ${e}`));
  warnings.forEach((w) => console.warn(`! ${w}`));
  process.exit(1);
}

console.log('Quality gate passed (no blocking errors).');
if (warnings.length) {
  console.warn(`Quality gate warnings (${warnings.length}):`);
  warnings.forEach((w) => console.warn(`! ${w}`));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}
