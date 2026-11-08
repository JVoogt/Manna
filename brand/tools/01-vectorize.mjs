// Traces the logo bitmap into clean vector paths (one per layer) and writes ../source/paths.json.
// Layers are separated by colour: the logo has only purple, black and white, so the G and R channels split them.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const sharp = require('../../node_modules/sharp');
const { Potrace } = require('potrace');

const SRC = new URL('../source/logo-original.png', import.meta.url).pathname;
const OUT = new URL('../source/paths.json', import.meta.url).pathname;
const N = 640, UP = 4;

const { data } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

// white-ish: G channel (white 255, purple 31, black 0). dark: R channel (black 0, purple 170, white 255)
const white = new Uint8Array(N * N), dark = new Uint8Array(N * N);
for (let i = 0; i < N * N; i++) { const [r, g] = px(i); white[i] = g > 143 ? 1 : 0; dark[i] = r < 85 && g <= 143 ? 1 : 0; }

// background = white connected to the corner
const bg = new Uint8Array(N * N);
{ const stack = [0]; bg[0] = 1;
  while (stack.length) { const i = stack.pop(); const x = i % N, y = (i / N) | 0;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue; const j = ny * N + nx; if (!bg[j] && white[j]) { bg[j] = 1; stack.push(j); } } } }
const sil = bg.map((v) => 1 - v);
const text = new Uint8Array(N * N), line = new Uint8Array(N * N);
for (let i = 0; i < N * N; i++) { text[i] = sil[i] && white[i] ? 1 : 0; line[i] = sil[i] && dark[i] ? 1 : 0; }

// connected components of the text, to find the letters and split the name from the number
function label(mask) { const lab = new Int32Array(N * N); let n = 0; const comps = [];
  for (let s = 0; s < N * N; s++) { if (!mask[s] || lab[s]) continue; n++; const st = [s]; lab[s] = n; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, cnt = 0;
    while (st.length) { const i = st.pop(); const x = i % N, y = (i / N) | 0; cnt++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue; const j = ny * N + nx; if (mask[j] && !lab[j]) { lab[j] = n; st.push(j); } } }
    comps.push({ id: n, x0, y0, x1, y1, cnt }); }
  return { lab, comps }; }
const { lab, comps } = label(text);
const letters = comps.filter((c) => c.cnt > 150);
const nameComps = letters.filter((c) => c.y1 < 450);
const numComps = letters.filter((c) => c.y0 >= 450);
const mComp = nameComps.filter((c) => c.y1 < 330).sort((a, b) => a.x0 - b.x0)[0]; // first letter of MANNA
console.error('letters', letters.length, 'name', nameComps.length, 'number', numComps.length, 'M', mComp);

const maskOf = (ids) => { const s = new Set(ids); const m = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) if (s.has(lab[i])) m[i] = 1; return m; };
const nameMask = maskOf(nameComps.map((c) => c.id)), numMask = maskOf(numComps.map((c) => c.id)), mMask = maskOf([mComp.id]);
const or = (...ms) => ms[0].map((_, i) => (ms.some((m) => m[i]) ? 1 : 0));
const minus = (a, ...bs) => a.map((v, i) => (v && !bs.some((b) => b[i]) ? 1 : 0));
const textAll = or(nameMask, numMask);
const layers = {
  silhouette: sil, line, name: nameMask, number: numMask, m: mMask,
  artFull: minus(sil, line, textAll),        // purple-only art, name and number knocked out
  artName: minus(sil, line, nameMask),       // purple-only art, name knocked out, no number
  artSimple: sil,                            // outer shape only
};

async function trace(mask, name, { up = UP, blur = 0.55, tol = 0.4 } = {}) {
  // upscale + blur + threshold for smooth curves, then trace the dark (=shape) pixels
  const buf = Buffer.alloc(N * N); for (let i = 0; i < N * N; i++) buf[i] = mask[i] ? 0 : 255;
  const file = `/tmp/manna-mask-${name}.png`;
  await sharp(buf, { raw: { width: N, height: N, channels: 1 } }).resize(N * up, N * up, { kernel: 'cubic' }).blur(up * blur).threshold(128).png().toFile(file);
  return new Promise((res, rej) => { const p = new Potrace({ turdSize: 60, optTolerance: tol, alphaMax: 1.1, blackOnWhite: true });
    p.loadImage(file, (e) => { if (e) return rej(e); const svg = p.getSVG(); const d = /<path d="([^"]+)"/.exec(svg)[1]; res(d); }); });
}
const out = { size: N, scale: 1 / UP, mScale: 1 / 8, bbox: { m: mComp }, paths: {} };
for (const [k, m] of Object.entries(layers)) { const cfg = { m: { up: 8, blur: 1.1 }, silhouette: { blur: 1.15, tol: 1 }, artSimple: { blur: 1.15, tol: 1 }, line: { blur: 0.85, tol: 0.8 }, artFull: { blur: 0.85, tol: 0.8 }, artName: { blur: 0.85, tol: 0.8 }, name: { blur: 0.75, tol: 0.6 }, number: { blur: 0.75, tol: 0.6 } }[k]; out.paths[k] = await trace(m, k, cfg); console.error('traced', k, out.paths[k].length, 'chars'); }
fs.writeFileSync(OUT, JSON.stringify(out));
