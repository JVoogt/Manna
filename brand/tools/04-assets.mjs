import { createRequire } from 'module';
import fs from 'fs';
import { w, png, svg, badge, badgeMono, markSVG, markGroup, BADGE_VB, BB, PURPLE, sharp, BRAND, P, g } from './lib.mjs';
const require = createRequire(import.meta.url);
const { Potrace } = require('potrace');
const { chromium } = require('/home/jpvoogt/.npm-global/node_modules/playwright');
const PLUM = '#31102E', CREAM = '#F7F1DF', LILAC = '#F0CAEA', BLUSH = '#F7EAF5';
const FONTS = new URL('../../public/fonts/', import.meta.url).pathname;
const browser = await chromium.launch();

// ---------- horizontal lockup: the mark + "Manna Kitchen" in Vollkorn, traced to a real vector
async function traceText(text, size = 400) {
  const page = await browser.newPage({ viewport: { width: 3600, height: 700 } });
  fs.writeFileSync('/tmp/manna-wordmark.html', `<style>@font-face{font-family:V;font-weight:600;src:url(file://${FONTS}vollkorn-600.woff2)}body{margin:0;background:#fff}p{margin:0;padding:60px;font:600 ${size}px/1.2 V;letter-spacing:-0.012em;color:#000;display:inline-block;white-space:nowrap}</style><p id=t>${text}</p>`);
  await page.goto('file:///tmp/manna-wordmark.html');
  await page.evaluate(() => document.fonts.ready);
  const f = '/tmp/manna-wordmark.png'; await (await page.$('#t')).screenshot({ path: f }); await page.close();
  const { data, info } = await sharp(f).removeAlpha().greyscale().raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0; for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[y * info.width + x] < 128) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const crop = '/tmp/manna-wordmark-crop.png'; await sharp(f).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).extend({ top: 2, bottom: 2, left: 2, right: 2, background: '#fff' }).threshold(128).png().toFile(crop);
  const d = await new Promise((res, rej) => { const p = new Potrace({ turdSize: 10, optTolerance: 0.3, blackOnWhite: true }); p.loadImage(crop, (e) => e ? rej(e) : res(/<path d="([^"]+)"/.exec(p.getSVG())[1])); });
  return { d, w: x1 - x0 + 5, h: y1 - y0 + 5, ascentBox: { y0 } };
}
const wm = await traceText('Manna Kitchen');
function lockup(wordColour, markOpts) {
  const H = 640, markH = BB.h + 12; const k = H / markH; // mark rendered at height H
  const mw = (BB.w + 12) * k;
  const wmH = H * 0.30; const s = wmH / wm.h; const wmW = wm.w * s; const gap = H * 0.16;
  const totalW = mw + gap + wmW;
  const markInner = `<g transform="translate(${-(BB.x - 6) * k} ${-(BB.y - 6) * k}) scale(${k})">${markGroup(markOpts.fill ?? PURPLE, markOpts)}</g>`;
  const text = `<g transform="translate(${mw + gap} ${(H - wmH) / 2 + H * 0.02}) scale(${s})">${g(wm.d, wordColour)}</g>`;
  return svg(`0 0 ${(totalW + H * 0.02).toFixed(1)} ${H}`, markInner + text, 'role="img" aria-label="Manna Kitchen"');
}
w('svg/logo-lockup.svg', lockup(PLUM, { ring: false }));
w('svg/logo-lockup-white.svg', lockup('#fff', { knockout: true, fill: '#fff', id: 'lk' }));
w('svg/logo-lockup-mono-black.svg', lockup('#000', { knockout: true, fill: '#000', id: 'lb' }));
const lockupAR = (await sharp(Buffer.from(lockup(PLUM, {})), { density: 96 }).metadata());
console.log('lockup', lockupAR.width, lockupAR.height);

// ---------- app icon: cream cupcake on purple, M cut out
const iconTile = (size, inset) => {
  const bbw = BB.w + 12, bbh = BB.h + 12; const k = (size * (1 - 2 * inset)) / bbw; const ox = (size - bbw * k) / 2, oy = (size - bbh * k) / 2 - size * 0.01;
  return svg(`0 0 ${size} ${size}`, `<rect width="${size}" height="${size}" fill="${PURPLE}"/><g transform="translate(${ox - (BB.x - 6) * k} ${oy - (BB.y - 6) * k}) scale(${k})">${markGroup(CREAM, { knockout: true, id: 'ic' })}</g>`);
};
const tileSvg = iconTile(512, 0.17);
w('favicons/app-icon.svg', tileSvg);
await png(iconTile(512, 0.17), BRAND + 'favicons/apple-touch-icon.png', 180, 180);
await png(iconTile(512, 0.17), BRAND + 'favicons/icon-192.png', 192, 192);
await png(iconTile(512, 0.17), BRAND + 'favicons/icon-512.png', 512, 512);
await png(iconTile(512, 0.30), BRAND + 'favicons/icon-maskable-512.png', 512, 512);
// favicon.svg: the plain mark, transparent, with a dark-mode safe tone
const fav = markSVG({}, BADGE_VB);
w('favicons/favicon.svg', fav);
for (const s of [16, 32, 48, 64]) await png(fav, BRAND + `favicons/favicon-${s}.png`, s, s);
// ICO with PNG entries
const icoSizes = [16, 32, 48]; const pngs = await Promise.all(icoSizes.map((s) => sharp(BRAND + `favicons/favicon-${s}.png`).png().toBuffer()));
const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(icoSizes.length, 4);
let off = 6 + 16 * icoSizes.length; const dir = Buffer.alloc(16 * icoSizes.length);
pngs.forEach((b, i) => { const s = icoSizes[i]; dir.writeUInt8(s, i * 16); dir.writeUInt8(s, i * 16 + 1); dir.writeUInt16LE(1, i * 16 + 4); dir.writeUInt16LE(32, i * 16 + 6); dir.writeUInt32LE(b.length, i * 16 + 8); dir.writeUInt32LE(off, i * 16 + 12); off += b.length; });
fs.writeFileSync(BRAND + 'favicons/favicon.ico', Buffer.concat([head, dir, ...pngs]));
w('favicons/site.webmanifest', JSON.stringify({ name: 'Manna Kitchen', short_name: 'Manna', description: 'Frozen home-cooked meals delivered in Pretoria.', start_url: '/', display: 'standalone', theme_color: PURPLE, background_color: CREAM, icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 2) + '\n');

// ---------- PNG logo exports
const badgeSvg = badge(), badgePhone = badge({ number: true });
for (const [name, s] of [['logo-badge', badgeSvg], ['logo-badge-phone', badgePhone], ['logo-badge-black', badgeMono('#000')], ['logo-badge-white', badgeMono('#fff')], ['logo-badge-purple', badgeMono(PURPLE)], ['logo-mark', markSVG()], ['logo-mark-ring', markSVG({ ring: true })]]) {
  await png(s, BRAND + `png/${name}-1024.png`, 1024, 1024);
  if (['logo-badge', 'logo-mark'].includes(name)) await png(s, BRAND + `png/${name}-2048.png`, 2048, 2048);
}
await png(lockup(PLUM, {}), BRAND + 'png/logo-lockup-1600.png', 1600, Math.round(1600 * (lockupAR.height / lockupAR.width)));

// ---------- social
const pad = 0.1;
const square = (inner, bg) => svg('0 0 1024 1024', `<rect width="1024" height="1024" fill="${bg}"/>${inner}`);
const nested = (svgStr, size, bg) => square(`<svg x="${1024 * pad}" y="${1024 * pad}" width="${1024 * (1 - 2 * pad)}" height="${1024 * (1 - 2 * pad)}" viewBox="${BADGE_VB}">${svgStr.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</svg>`, bg);
await png(nested(badgeSvg), BRAND + 'social/avatar-badge-1024.png', 1024, 1024);
w('social/avatar-badge.svg', nested(badgeSvg));
await png(iconTile(1024, 0.2), BRAND + 'social/avatar-mark-1024.png', 1024, 1024);

// og image + brand sheet rendered from HTML with the site fonts
const fontFace = `@font-face{font-family:Vollkorn;font-weight:600;src:url(file://${FONTS}vollkorn-600.woff2)}@font-face{font-family:Hanken;font-weight:400 600;src:url(file://${FONTS}hanken-grotesk.woff2)}`;
const badgeInline = badgeSvg.replace('<svg ', '<svg style="display:block;width:100%;height:100%" ');
async function shot(html, file, vw, vh) { fs.mkdirSync(file.split('/').slice(0,-1).join('/'),{recursive:true}); const p = await browser.newPage({ viewport: { width: vw, height: vh } }); fs.writeFileSync('/tmp/manna-shot.html', html); await p.goto('file:///tmp/manna-shot.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250); await p.screenshot({ path: file }); await p.close(); }
const og = `<style>${fontFace}*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:${CREAM};font-family:Hanken,sans-serif;color:${PLUM};display:flex;align-items:center;padding:0 90px;gap:70px}.b{width:430px;height:430px;flex:none}h1{font:600 84px/1.02 Vollkorn,serif;letter-spacing:-.012em}p{margin-top:26px;font-size:34px;line-height:1.3;color:#52244d}.u{margin-top:34px;display:inline-block;background:${PURPLE};color:#fff;font-weight:600;font-size:32px;padding:16px 34px;border-radius:999px}</style><div class=b>${badgeInline}</div><div><h1>Frozen <span style="white-space:nowrap">home-cooked</span> meals.</h1><p>From two sisters in Pretoria North, delivered in Pretoria.</p><span class=u>manna.voogt.co.za</span></div>`;
await shot(og, BRAND + 'social/og-image-1200x630.png', 1200, 630);



// pattern tile
const mk = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s}) translate(${-(BB.x + BB.w / 2)} ${-(BB.y + BB.h / 2)})">${markGroup(LILAC, { id: 'pt' + x + y })}</g>`;
w('svg/pattern-tile.svg', svg('0 0 480 480', `<rect width="480" height="480" fill="${BLUSH}"/>${mk(120, 120, -12, 0.13)}${mk(360, 240, 10, 0.13)}${mk(120, 360, 8, 0.1)}${mk(400, 70, -8, 0.09)}`.replace(/id="(pt[^"]+)"/g, 'id="$1"').replace(/<mask id="(pt-?\d+)(-?\d+)"/g, '<mask id="$1_$2"')));
await browser.close();
console.log('assets done');
