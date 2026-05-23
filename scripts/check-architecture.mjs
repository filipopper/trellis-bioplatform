import fs from 'fs';
import path from 'path';

const root = process.cwd();

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const p = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(p, files);
    } else {
      files.push(p);
    }
  }

  return files;
}

function rel(p) {
  return path
    .relative(root, p)
    .replaceAll('\\', '/');
}

const jsFiles = walk(
  path.join(root, 'client/app')
).filter((f) => f.endsWith('.js'));

const errors = [];

for (const file of jsFiles) {
  const content = fs.readFileSync(
    file,
    'utf8'
  );

  const imports = [
    ...content.matchAll(
      /from\s+["']([^"']+)["']/g
    ),
  ].map((m) => m[1]);

  const fileRel = rel(file);

  const m = fileRel.match(
    /^client\/app\/features\/([^/]+)\//
  );

  const currentFeature = m?.[1];

  for (const imp of imports) {
    if (
      imp.startsWith('/client/js') ||
      imp.includes('client/js/')
    ) {
      errors.push(
        `${fileRel} imports forbidden legacy layer: ${imp}`
      );

      continue;
    }

    if (!imp.startsWith('.')) {
      continue;
    }

    const resolved = rel(
      path.normalize(
        path.join(
          path.dirname(file),
          imp
        )
      ) + (imp.endsWith('.js') ? '' : '.js')
    );

    if (
      currentFeature &&
      resolved.startsWith(
        'client/app/features/'
      )
    ) {
      const targetFeature =
        resolved.split('/')[3];

      if (
        targetFeature !== currentFeature
      ) {
        errors.push(
          `${fileRel} imports another feature directly: ${imp} -> ${resolved}`
        );
      }
    }

    if (
      currentFeature &&
      !resolved.includes('/shared/') &&
      !resolved.includes('/state/') &&
      !resolved.includes(
        `/features/${currentFeature}/`
      ) &&
      !resolved.includes('/core/')
    ) {
      errors.push(
        `${fileRel} imports disallowed layer: ${imp} -> ${resolved}`
      );
    }
  }
}


const staleRuntimePaths = [
  ...walk(path.join(root, 'client')).filter((f) =>
    /(\.js|\.mjs|\.html|\.css)$/.test(f)
  ),
].map((f) => ({ file: f, content: fs.readFileSync(f, 'utf8') }));

for (const { file, content } of staleRuntimePaths) {
  if (content.includes('client/app/core/features/')) {
    errors.push(`${rel(file)} contains stale runtime feature root: client/app/core/features/`);
  }
}

const legacyJsFiles = walk(
  path.join(root, 'client/js')
).map(rel);

for (const file of legacyJsFiles) {
  if (
    file !== 'client/app/core/pwa/service-worker.js'
  ) {
    errors.push(
      `legacy file must be moved into app layers: ${file}`
    );
  }
}

if (errors.length) {
  console.error(
    'Architecture boundary check failed:'
  );

  for (const e of errors) {
    console.error(`- ${e}`);
  }

  process.exit(1);
}

console.log(
  'Architecture boundary check passed.'
);