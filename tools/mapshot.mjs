// Guarda los mapas (con personajes y objetos) en PNG para revisarlos.
// Uso: node tools/mapshot.mjs <carpeta> [mapa1 mapa2 ...]
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const dir = process.argv[2] || '.';
const only = process.argv.slice(3);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 800, height: 600 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const shots = await p.evaluate((only) => {
  const S = window.__SC;
  S.Game.state = S.newState('Abel', 'm', 'light');
  const res = {};
  for (const id of Object.keys(S.MAPS)) {
    if (only.length && !only.includes(id)) continue;
    const def = S.MAPS[id];
    const g = def.build();
    const m = S.renderMap(def, g);
    const c = document.createElement('canvas'); c.width = m.width; c.height = m.height + 8;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.drawImage(m, 0, 8);
    for (const o of def.objects || []) if (o.cond) { /* dinámicos */ }
    for (const it of def.items || []) { x.fillStyle = '#e8c860'; x.fillRect(it.x * 16 + 4, it.y * 16 + 12, 8, 8); }
    for (const n of def.npcs || []) {
      const look = typeof n.look === 'function' ? 'rival_f' : n.look;
      const row = { down: 0, up: 3, left: 6, right: 9 }[n.dir || 'down'];
      S.drawChar(x, look, row, n.x * 16, n.y * 16, 1);
      if (n.trainer) { x.fillStyle = '#d83030'; x.fillRect(n.x * 16 + 6, n.y * 16 - 2, 4, 4); }
    }
    res[id] = c.toDataURL();
  }
  return res;
}, only);
for (const k in shots) writeFileSync(`${dir}/map_${k}.png`, Buffer.from(shots[k].split(',')[1], 'base64'));
console.log(Object.keys(shots).join(' '));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
