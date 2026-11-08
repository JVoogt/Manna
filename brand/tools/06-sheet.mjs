import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/jpvoogt/.npm-global/node_modules/playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
await p.goto('file://' + new URL('../brand-sheet.html', import.meta.url).pathname); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
await p.screenshot({ path: new URL('../brand-sheet.png', import.meta.url).pathname, fullPage: true }); await b.close(); console.log('sheet ok');
