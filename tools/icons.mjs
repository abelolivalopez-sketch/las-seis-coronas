// Genera el icono de la app (corona pixel art) en todos los tamaños de Android.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = join(root, 'app', 'res');
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const b = await chromium.launch();
const p = await b.newPage();
const out = await p.evaluate((dens) => {
  const rows = [
    '.k......k......k.', 'kyk....kyk....kyk', 'kyyk..kyyyk..kyyk', 'kyyykkyyyyykkyyyk', 'kyyyyyyyyyyyyyyyk',
    'kyrryyyybyyyyrryk', 'kyyyyyyyyyyyyyyyk', 'kkkkkkkkkkkkkkkkk',
  ];
  const pal = { k: '#3a1c08', y: '#f2c94c', r: '#d83a32', b: '#3a70c0' };
  const crown = (ctx, cx, cy, s) => {
    const w = 17 * s, h = 8 * s, x0 = Math.round(cx - w / 2), y0 = Math.round(cy - h / 2);
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (pal[c]) { ctx.fillStyle = pal[c]; ctx.fillRect(x0 + x * s, y0 + y * s, s, s); } }));
  };
  const make = (size, kind) => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    if (kind !== 'fg') {
      x.fillStyle = '#2a2140';
      if (kind === 'round') { x.beginPath(); x.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); x.fill(); }
      else { const r = size * 0.18; x.beginPath(); x.roundRect(0, 0, size, size, r); x.fill(); }
      x.strokeStyle = '#e5b44f'; x.lineWidth = Math.max(2, size / 24);
      if (kind === 'round') { x.beginPath(); x.arc(size / 2, size / 2, size / 2 - x.lineWidth, 0, Math.PI * 2); x.stroke(); }
      else { const i = x.lineWidth; x.beginPath(); x.roundRect(i, i, size - 2 * i, size - 2 * i, size * 0.15); x.stroke(); }
    }
    const area = kind === 'fg' ? size * 0.55 : size * 0.72;
    const s = Math.max(1, Math.floor(area / 17));
    crown(x, size / 2, size / 2, s);
    return c.toDataURL();
  };
  const outp = {};
  for (const [d, k] of Object.entries(dens)) {
    outp[`mipmap-${d}/ic_launcher.png`] = make(Math.round(48 * k), 'square');
    outp[`mipmap-${d}/ic_launcher_round.png`] = make(Math.round(48 * k), 'round');
    outp[`mipmap-${d}/ic_launcher_foreground.png`] = make(Math.round(108 * k), 'fg');
  }
  outp['preview.png'] = make(192, 'square');
  return outp;
}, dens);
for (const [path, url] of Object.entries(out)) {
  if (path === 'preview.png') { writeFileSync(join(root, 'app', 'icon-preview.png'), Buffer.from(url.split(',')[1], 'base64')); continue; }
  const f = join(res, path);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, Buffer.from(url.split(',')[1], 'base64'));
}
mkdirSync(join(res, 'values'), { recursive: true });
writeFileSync(join(res, 'values', 'ic_launcher_background.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#2A2140</color>\n</resources>\n');
console.log('OK · iconos en app/res');
await b.close();
