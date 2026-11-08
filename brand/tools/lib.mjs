import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
export const sharp = require('../../node_modules/sharp');
export const SRC = new URL('../source/', import.meta.url).pathname;
export const BRAND = new URL('../', import.meta.url).pathname;
export const P = JSON.parse(fs.readFileSync(SRC + 'paths.json', 'utf8'));
export const PURPLE = '#AA1FA0';
export const S = P.scale; // paths are in 4x pixel space
// tight bounding box of the silhouette in 640px space
export const BB = await (async () => {
  const { data, info } = await sharp(SRC + 'logo-original.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) { const i = (y * info.width + x) * 3; if (data[i + 1] < 200) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
})();
export const g = (d, fill, extra = '') => `<path fill="${fill}" fill-rule="evenodd" ${extra} d="${d}"/>`;
const grp = (inner) => `<g transform="scale(${S})">${inner}</g>`;
export const svg = (vb, inner, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra}>${inner}</svg>\n`;
const pad = 6;
export const BADGE_VB = `${BB.x - pad} ${BB.y - pad} ${BB.w + 2 * pad} ${BB.h + 2 * pad}`;

// ---- badge variants (all coordinates in the 640px space; paths are scaled down from 4x)
export function badge({ number = false, fill = PURPLE, line = '#000', text = '#fff' } = {}) {
  return svg(BADGE_VB, grp(g(P.paths.silhouette, fill) + g(P.paths.line, line) + g(P.paths.name, text) + (number ? g(P.paths.number, text) : '')), 'role="img" aria-label="Manna Kitchen"');
}
// single colour: purple-only art, so the line and the lettering become see-through gaps
export function badgeMono(colour, { number = false } = {}) {
  return svg(BADGE_VB, grp(g(number ? P.paths.artFull : P.paths.artName, colour)), 'role="img" aria-label="Manna Kitchen"');
}

// ---- mark: the cupcake silhouette with the logo's own "M" set inside
const M = P.bbox.m; // in 640px space
const markScale = 3.25;
export function markGroup(colour, { ring = false, ringColour = '#000', letter = '#fff', knockout = false, id = 'm' } = {}) {
  const cx = BB.x + BB.w / 2, cy = BB.y + BB.h * 0.575;
  const mw = (M.x1 - M.x0 + 1), mh = (M.y1 - M.y0 + 1);
  const tx = cx - (M.x0 + mw / 2) * markScale, ty = cy - (M.y0 + mh / 2) * markScale;
  const mPath = `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${markScale}) scale(${P.mScale})">${g(P.paths.m, knockout ? '#000' : letter)}</g>`;
  const sil = `<g transform="scale(${S})">${g(P.paths.silhouette, knockout ? '#fff' : colour)}</g>`;
  const lineEl = ring ? `<g transform="scale(${S})">${g(P.paths.line, knockout ? '#000' : ringColour)}</g>` : '';
  if (!knockout) return sil + lineEl + mPath;
  // knockout: cutouts via a mask, so the colour is one flat fill (for mono marks)
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="${BB.x - 10}" y="${BB.y - 10}" width="${BB.w + 20}" height="${BB.h + 20}">${sil}${lineEl}${mPath}</mask><rect x="${BB.x - 10}" y="${BB.y - 10}" width="${BB.w + 20}" height="${BB.h + 20}" fill="${colour}" mask="url(#${id})"/>`;
}
export const markSVG = (opts = {}, vb = BADGE_VB) => svg(vb, markGroup(opts.fill || PURPLE, opts), 'role="img" aria-label="Manna Kitchen"');

export async function png(svgString, file, w, h, { background } = {}) {
  fs.mkdirSync(file.split('/').slice(0, -1).join('/'), { recursive: true });
  let img = sharp(Buffer.from(svgString), { density: 384 }).resize(w, h, { fit: 'contain', background: background || { r: 0, g: 0, b: 0, alpha: 0 } });
  await img.png().toFile(file);
}
export const w = (rel, data) => { fs.mkdirSync(BRAND + rel.split('/').slice(0, -1).join('/'), { recursive: true }); fs.writeFileSync(BRAND + rel, data); };
