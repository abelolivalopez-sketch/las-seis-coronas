// Prueba en móvil: diseño vertical/horizontal y controles táctiles.
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const b = await chromium.launch();
const errs = [];
for (const [name, vp] of [['portrait', { width: 390, height: 844 }], ['landscape', { width: 844, height: 390 }], ['small', { width: 360, height: 640 }]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(name + ': ' + String(e)));
  await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
  await p.waitForFunction(() => window.__SC);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${dir}/m_${name}_title.png` });
  const tapEl = async sel => { const bb = await p.locator(sel).boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(350); };
  await tapEl('[data-btn="a"]');
  await p.waitForTimeout(700);
  const sc1 = await p.evaluate(() => window.__SC.Game.scene.constructor.name);
  const bb = await p.locator('#dpad').boundingBox();
  await p.touchscreen.tap(bb.x + bb.width * 0.85, bb.y + bb.height / 2);
  await p.waitForTimeout(400);
  const idx = await p.evaluate(() => window.__SC.Game.scene.idx);
  const ov = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight }));
  await p.screenshot({ path: `${dir}/m_${name}_select.png` });
  console.log(name, 'scene after A:', sc1, '· idx after right:', idx, '· overflow:', JSON.stringify(ov));
  await ctx.close();
}
console.log('errors:', errs.length ? errs : 'none');
await b.close();
