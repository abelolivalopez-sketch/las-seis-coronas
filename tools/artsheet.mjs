// Dibuja todo el arte a ×4 en un PNG para revisarlo.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const out = process.argv[2] || 'art.png';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const data = await p.evaluate(() => {
  const S = window.__SC;
  const c = document.createElement('canvas'); c.width = 300; c.height = 210;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.fillStyle = '#93cd68'; x.fillRect(0, 0, 300, 210);
  let i = 0;
  for (const k in S.LOOKS) {
    const sh = S.Art.chars[k];
    const col = i % 2, row = Math.floor(i / 2);
    x.drawImage(sh, col * 150, row * 25);
    i++;
  }
  x.drawImage(S.Art.boar, 0, 225 - 50);
  x.drawImage(S.Art.wolf, 40, 225 - 50);
  const big = document.createElement('canvas'); big.width = 1200; big.height = 840;
  const bx = big.getContext('2d'); bx.imageSmoothingEnabled = false;
  bx.drawImage(c, 0, 0, 1200, 840);
  return big.toDataURL();
});
writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
