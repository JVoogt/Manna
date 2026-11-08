// Shrinks every SVG in brand/ with svgo (coordinates to 1 decimal). Run last.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { optimize } = await import('svgo');
const root = new URL('../', import.meta.url).pathname;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === 'tools' || e.name === 'source' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.svg') ? [path.join(d, e.name)] : []);
let before = 0, after = 0;
for (const f of walk(root)) {
  const src = fs.readFileSync(f, 'utf8');
  const r = optimize(src, { path: f, multipass: true, floatPrecision: 1, plugins: [{ name: 'preset-default', params: { overrides: { cleanupIds: false, convertPathData: { floatPrecision: 1 } } } }] });
  fs.writeFileSync(f, r.data); before += src.length; after += r.data.length;
}
console.log(`svgo: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
