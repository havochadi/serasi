// Copies the public files into _site/ for Cloudflare's static asset upload. wrangler.toml runs this before each deploy.
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUBLIC_FILES } from './site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
let copied = 0;
for (const name of PUBLIC_FILES) {
  if (!existsSync(path.join(root, name))) { console.warn('Skipped missing file: ' + name); continue; }
  copyFileSync(path.join(root, name), path.join(out, name));
  copied++;
}
if (!existsSync(path.join(out, 'index.html'))) throw new Error('index.html is missing');
console.log('Copied ' + copied + ' files to _site/');
