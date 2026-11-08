import { w, png, badge, badgeMono, markSVG, BADGE_VB, BB, PURPLE, sharp, BRAND } from './lib.mjs';
const out = {};
out['svg/logo-badge-phone.svg'] = badge({ number: true });
out['svg/logo-badge.svg'] = badge();
out['svg/logo-badge-purple.svg'] = badgeMono(PURPLE);
out['svg/logo-badge-black.svg'] = badgeMono('#000');
out['svg/logo-badge-white.svg'] = badgeMono('#fff');
out['svg/logo-mark.svg'] = markSVG();
out['svg/logo-mark-ring.svg'] = markSVG({ ring: true });
out['svg/logo-mark-black.svg'] = markSVG({ knockout: true, fill: '#000', id: 'mk' });
out['svg/logo-mark-white.svg'] = markSVG({ knockout: true, fill: '#fff', id: 'mw' });
for (const [k, v] of Object.entries(out)) w(k, v);
// quick preview renders
const bw = Math.round(BB.w + 12), bh = Math.round(BB.h + 12);
await png(out['svg/logo-badge-phone.svg'], BRAND + '_preview-badge-phone.png', 900, 900, { background: '#fff' });
await png(out['svg/logo-mark.svg'], BRAND + '_preview-mark.png', 600, 600, { background: '#fff' });
await png(out['svg/logo-badge-black.svg'], BRAND + '_preview-black.png', 600, 600, { background: '#fff' });
console.log('bbox', BB);
