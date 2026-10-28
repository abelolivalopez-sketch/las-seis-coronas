// Guarda los mapas completos (×2) y los animales (×6) en PNG para revisarlos.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const dir = process.argv[2] || '.';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 800, height: 600 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const shots = await p.evaluate(() => {
  const S = window.__SC;
  const res = {};
  for (const id of Object.keys(S.MAPS)) {
    const def = S.MAPS[id];
    const g = def.build();
    const m = S.renderMap(def, g);
    const c = document.createElement('canvas'); c.width = m.width * 2; c.height = m.height * 2;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.drawImage(m, 0, 0, c.width, c.height);
    res[id] = c.toDataURL();
  }
  const c = document.createElement('canvas'); c.width = 420; c.height = 160;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.fillStyle = '#c6e5a0'; x.fillRect(0, 0, 420, 160);
  x.drawImage(S.Art.boar, 10, 10, 180, 132);
  x.drawImage(S.Art.wolf, 210, 10, 186, 138);
  res.animals = c.toDataURL();
  return res;
});
for (const k in shots) writeFileSync(`${dir}/${k}.png`, Buffer.from(shots[k].split(',')[1], 'base64'));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
