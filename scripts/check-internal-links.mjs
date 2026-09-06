import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const siteRoot = path.resolve('_site');

if (!existsSync(siteRoot)) {
  console.error('Missing _site directory. Run the Jekyll build first.');
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function targetExists(sourceFile, rawUrl) {
  if (
    !rawUrl ||
    rawUrl.startsWith('#') ||
    rawUrl.startsWith('&') ||
    rawUrl.startsWith('//') ||
    /^[a-z][a-z\d+.-]*:/i.test(rawUrl)
  ) {
    return true;
  }

  const withoutQuery = rawUrl.split(/[?#]/, 1)[0];
  if (!withoutQuery) return true;

  let decoded;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    return false;
  }

  const target = decoded.startsWith('/')
    ? path.join(siteRoot, decoded.replace(/^\/+/, ''))
    : path.resolve(path.dirname(sourceFile), decoded);

  const relativeTarget = path.relative(siteRoot, target);
  if (relativeTarget.startsWith('..') || path.isAbsolute(relativeTarget)) return false;

  const candidates = [target];
  if (decoded.endsWith('/')) {
    candidates.push(path.join(target, 'index.html'));
  } else if (!path.extname(target)) {
    candidates.push(`${target}.html`, path.join(target, 'index.html'));
  }

  return candidates.some(existsSync);
}

const requiredPages = [
  'index.html',
  'posts/index.html',
  '404.html',
  'special-projects/pronouns/index.html'
];

const failures = requiredPages
  .filter((page) => !existsSync(path.join(siteRoot, page)))
  .map((page) => `required page missing: /${page}`);

const htmlFiles = walk(siteRoot).filter((file) => file.endsWith('.html'));
const attributePattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(attributePattern)) {
    const url = match[2].trim();
    if (!targetExists(file, url)) {
      failures.push(`${path.relative(siteRoot, file)} -> ${url}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Broken internal links or assets:\n');
  for (const failure of [...new Set(failures)].sort()) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Checked internal links and assets in ${htmlFiles.length} generated HTML files.`);
