import { hex2rgb, rgb2oklch, oklch2hex, fit, contrast, css } from './color.mjs';
import { w } from './lib.mjs';
const brand = '#AA1FA0'; const b = rgb2oklch(hex2rgb(brand)); const H = b.h;
console.log('brand oklch', css(b));
const paper = '#F7F1DF', clay = oklch2hex({ L: 0.87, C: 0.045, h: 70 });
const roles = {
  'Manna purple': { hex: brand, use: 'The logo colour. Buttons, links, prices, the cupcake mark.' },
  'Plum': { hex: oklch2hex({ L: 0.24, C: 0.07, h: H }), use: 'Headlines and body text. Deep purple that reads as near-black.' },
  'Plum soft': { hex: oklch2hex({ L: 0.34, C: 0.09, h: H }), use: 'Secondary text and captions.' },
  'Berry hover': { hex: oklch2hex({ L: 0.42, C: 0.17, h: H }), use: 'Hover and pressed state of purple buttons.' },
  'Orchid': { hex: oklch2hex({ L: 0.72, C: 0.14, h: H }), use: 'Accents on dark backgrounds, illustrations.' },
  'Lilac': { hex: oklch2hex({ L: 0.88, C: 0.06, h: H }), use: 'Soft fills, highlights, tags on plum.' },
  'Blush': { hex: oklch2hex({ L: 0.95, C: 0.02, h: H }), use: 'Very light purple tint for panels.' },
  'Oat paper': { hex: paper, use: 'Page background. Keeps the kitchen feeling warm.' },
  'Clay': { hex: clay, use: 'Warm panels behind food photography.' },
  'Logo black': { hex: '#000000', use: 'Only the logo outline. Do not use for text.' },
};
// tonal scale of the brand hue, for UI work
const scale = {}; for (const [k, L] of Object.entries({ 50: 0.97, 100: 0.93, 200: 0.87, 300: 0.79, 400: 0.69, 500: 0.58, 600: 0.5, 700: 0.42, 800: 0.33, 900: 0.25, 950: 0.18 })) scale[k] = oklch2hex({ L, C: L > 0.9 ? 0.03 : L > 0.8 ? 0.08 : 0.17, h: H });
// contrast table for the pairs we use
const pairs = [['Plum', 'Oat paper'], ['Plum soft', 'Oat paper'], ['Manna purple', 'Oat paper'], ['Manna purple', 'Clay'], ['Oat paper', 'Manna purple'], ['Oat paper', 'Plum'], ['Lilac', 'Plum'], ['Orchid', 'Plum'], ['Plum', 'Clay'], ['Plum soft', 'Clay']];
const table = pairs.map(([f, bgn]) => { const c = contrast(roles[f].hex, roles[bgn].hex); return { text: f, on: bgn, ratio: +c.toFixed(2), AA: c >= 4.5 ? 'pass' : c >= 3 ? 'large text only' : 'fail' }; });
console.table(table);
w('palette/palette.json', JSON.stringify({ brandOklch: css(b), roles, scale, contrast: table }, null, 2) + '\n');
w('palette/palette.css', `/* Manna Kitchen colour tokens, derived from the logo purple ${brand} */\n:root {\n${Object.entries(roles).map(([k, v]) => `  --manna-${k.toLowerCase().replace(/ /g, '-')}: ${v.hex};`).join('\n')}\n${Object.entries(scale).map(([k, v]) => `  --manna-purple-${k}: ${v};`).join('\n')}\n}\n`);
console.log(JSON.stringify(Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, v.hex]))));
for (const k of ['Plum', 'Plum soft', 'Berry hover', 'Lilac', 'Blush']) console.log(k, css(rgb2oklch(hex2rgb(roles[k].hex))));
