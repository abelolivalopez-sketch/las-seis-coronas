// ─── Arte: suelo, árboles, casas, objetos, animales, interfaz ─────────────
const PAL = {
  grass: '#93cd68', grassD: '#6fae4b', grassL: '#b6e388', grassS: '#7cb956',
  tall: '#4c9a3a', tallD: '#33792a', tallM: '#68ba4a', tallL: '#a6df7a',
  dirt: { b: '#e6c88f', d: '#cda872', l: '#f6e0b2', e: '#bc945c' },
  sand: { b: '#f2e0b2', d: '#dbc390', l: '#fcf2d4', e: '#c8aa72' },
  water: '#5b9be2', waterD: '#2f5f9a', waterL: '#93c4f6', foam: '#cfe5fb',
};
// Paleta del suelo del mapa actual (cambia por región: ver THEMES en 04b)
let GP = PAL;
const DIRT = c => c === '=' || c === 's';
const GRASSY = c => '.,*TCFRPHYV'.includes(c);

function grassBase(ctx, ox, oy, tx, ty) {
  rect(ctx, ox, oy, 16, 16, GP.grass);
  for (let k = 0; k < 3; k++) {
    if (hash2(tx, ty, k) > 0.62) continue;
    const x = ox + 2 + Math.floor(hash2(tx, ty, k + 11) * 11);
    const y = oy + 3 + Math.floor(hash2(tx, ty, k + 21) * 10);
    px(ctx, x, y, GP.grassD); px(ctx, x + 1, y + 1, GP.grassD); px(ctx, x + 2, y, GP.grassD);
    px(ctx, x + 1, y - 1, GP.grassL);
  }
  if (hash2(tx, ty, 40) < 0.5) px(ctx, ox + Math.floor(hash2(tx, ty, 41) * 16), oy + Math.floor(hash2(tx, ty, 42) * 16), GP.grassL);
}

function tallGrass(ctx, ox, oy, onlyFront = false) {
  if (!onlyFront) rect(ctx, ox, oy, 16, 16, GP.tall);
  const rows = onlyFront ? [15] : [7, 15];
  rows.forEach((base, ri) => {
    for (let x = 0; x < 16; x++) {
      const hgt = [2, 5, 7, 5][(x + ri * 2) % 4];
      for (let i = 0; i < hgt; i++) {
        const y = base - i;
        const c = i === hgt - 1 ? GP.tallL : i === hgt - 2 ? GP.tallM : (x % 4 === 3 ? GP.tallD : GP.tall);
        px(ctx, ox + x, oy + y, c);
      }
    }
  });
}

function dirtTile(ctx, ox, oy, tx, ty, nb, col) {
  rect(ctx, ox, oy, 16, 16, col.b);
  for (let k = 0; k < 6; k++) {
    if (hash2(tx, ty, k + 50) > 0.55) continue;
    px(ctx, ox + Math.floor(hash2(tx, ty, k + 60) * 16), oy + Math.floor(hash2(tx, ty, k + 70) * 16), k % 2 ? col.d : col.l);
  }
  const G = GP.grass;
  const tooth = (i, s) => (hash2(tx * 17 + i, ty * 13 + s, 9) < 0.35 ? 2 : 1);
  if (nb.n) for (let x = 0; x < 16; x++) { const d = tooth(x, 1); rect(ctx, ox + x, oy, 1, d, G); px(ctx, ox + x, oy + d, col.e); }
  if (nb.s) for (let x = 0; x < 16; x++) { const d = tooth(x, 2); rect(ctx, ox + x, oy + 16 - d, 1, d, G); px(ctx, ox + x, oy + 15 - d, col.e); }
  if (nb.w) for (let y = 0; y < 16; y++) { const d = tooth(y, 3); rect(ctx, ox, oy + y, d, 1, G); px(ctx, ox + d, oy + y, col.e); }
  if (nb.e) for (let y = 0; y < 16; y++) { const d = tooth(y, 4); rect(ctx, ox + 16 - d, oy + y, d, 1, G); px(ctx, ox + 15 - d, oy + y, col.e); }
  if (nb.n && nb.w) { rect(ctx, ox, oy, 4, 3, G); rect(ctx, ox, oy, 3, 4, G); px(ctx, ox + 3, oy + 3, col.e); px(ctx, ox + 4, oy + 3, col.e); px(ctx, ox + 3, oy + 4, col.e); }
  if (nb.n && nb.e) { rect(ctx, ox + 12, oy, 4, 3, G); rect(ctx, ox + 13, oy, 3, 4, G); px(ctx, ox + 12, oy + 3, col.e); px(ctx, ox + 11, oy + 3, col.e); px(ctx, ox + 12, oy + 4, col.e); }
  if (nb.s && nb.w) { rect(ctx, ox, oy + 13, 4, 3, G); rect(ctx, ox, oy + 12, 3, 4, G); px(ctx, ox + 3, oy + 12, col.e); px(ctx, ox + 4, oy + 12, col.e); px(ctx, ox + 3, oy + 11, col.e); }
  if (nb.s && nb.e) { rect(ctx, ox + 12, oy + 13, 4, 3, G); rect(ctx, ox + 13, oy + 12, 3, 4, G); px(ctx, ox + 12, oy + 12, col.e); px(ctx, ox + 11, oy + 12, col.e); px(ctx, ox + 12, oy + 11, col.e); }
  if (!nb.n && !nb.w && nb.nw) { rect(ctx, ox, oy, 2, 1, G); px(ctx, ox, oy + 1, G); px(ctx, ox + 1, oy + 1, col.e); }
  if (!nb.n && !nb.e && nb.ne) { rect(ctx, ox + 14, oy, 2, 1, G); px(ctx, ox + 15, oy + 1, G); px(ctx, ox + 14, oy + 1, col.e); }
  if (!nb.s && !nb.w && nb.sw) { rect(ctx, ox, oy + 15, 2, 1, G); px(ctx, ox, oy + 14, G); px(ctx, ox + 1, oy + 14, col.e); }
  if (!nb.s && !nb.e && nb.se) { rect(ctx, ox + 14, oy + 15, 2, 1, G); px(ctx, ox + 15, oy + 14, G); px(ctx, ox + 14, oy + 14, col.e); }
}

function waterTile(ctx, ox, oy, tx, ty, nb, t = 0) {
  // nb.n/s/w/e: color de la orilla en ese lado (o false si sigue el agua)
  rect(ctx, ox, oy, 16, 16, GP.water);
  for (let k = 0; k < 3; k++) {
    const x = Math.floor(hash2(tx, ty, k + 80) * 11), y = 3 + Math.floor(hash2(tx, ty, k + 90) * 10);
    const sh = (Math.floor(t / 500) + k) % 2;
    rect(ctx, ox + x + sh, oy + y, 4, 1, GP.waterL);
  }
  const col = v => (typeof v === 'string' ? v : GP.grass);
  if (nb.n) { rect(ctx, ox, oy, 16, 2, col(nb.n)); rect(ctx, ox, oy + 2, 16, 1, GP.waterD); rect(ctx, ox, oy + 3, 16, 1, GP.foam); }
  if (nb.s) { rect(ctx, ox, oy + 14, 16, 2, col(nb.s)); rect(ctx, ox, oy + 13, 16, 1, GP.waterD); }
  if (nb.w) { rect(ctx, ox, oy, 2, 16, col(nb.w)); rect(ctx, ox + 2, oy, 1, 16, GP.waterD); }
  if (nb.e) { rect(ctx, ox + 14, oy, 2, 16, col(nb.e)); rect(ctx, ox + 13, oy, 1, 16, GP.waterD); }
  if (nb.n && nb.w) { rect(ctx, ox, oy, 4, 4, col(nb.n)); px(ctx, ox + 3, oy + 3, GP.waterD); }
  if (nb.n && nb.e) { rect(ctx, ox + 12, oy, 4, 4, col(nb.n)); px(ctx, ox + 12, oy + 3, GP.waterD); }
  if (nb.s && nb.w) { rect(ctx, ox, oy + 12, 4, 4, col(nb.s)); px(ctx, ox + 3, oy + 12, GP.waterD); }
  if (nb.s && nb.e) { rect(ctx, ox + 12, oy + 12, 4, 4, col(nb.s)); px(ctx, ox + 12, oy + 12, GP.waterD); }
}

function flowers(ctx, ox, oy, tx, ty) {
  grassBase(ctx, ox, oy, tx, ty);
  const sets = [['#f05a5a', '#ffd8d0'], ['#ffffff', '#f8e070'], ['#b070e0', '#f8e070'], ['#f8c838', '#ffffff']];
  const spots = [[3, 4], [10, 9], [5, 12]];
  spots.forEach(([x, y], i) => {
    if (i === 2 && hash2(tx, ty, 99) < 0.5) return;
    const [pet, mid] = sets[Math.floor(hash2(tx, ty, 100 + i) * sets.length)];
    const X = ox + x, Y = oy + y;
    px(ctx, X, Y - 1, pet); px(ctx, X - 1, Y, pet); px(ctx, X + 1, Y, pet); px(ctx, X, Y + 1, pet);
    px(ctx, X, Y, mid); px(ctx, X + 1, Y + 2, GP.grassD);
  });
}

// Silueta con sombreado automático (para árboles, animales…)
function shapeArt(w, h, regions, outline, detail) {
  const [c, x] = mkCanvas(w, h);
  const id = new Int16Array(w * h).fill(-1);
  const inside = (r, X, Y) => {
    if (r.e) { const [cx, cy, rx, ry] = r.e; return ((X - cx) / rx) ** 2 + ((Y - cy) / ry) ** 2 <= 1; }
    if (r.r) { const [x0, y0, x1, y1] = r.r; return X >= x0 && X <= x1 && Y >= y0 && Y <= y1; }
    if (r.p) {
      let ins = false; const P = r.p;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
        if ((P[i][1] > Y) !== (P[j][1] > Y) && X < (P[j][0] - P[i][0]) * (Y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) ins = !ins;
      }
      return ins;
    }
    return false;
  };
  const center = r => r.e ? [r.e[0], r.e[1], r.e[2], r.e[3]] : r.r ? [(r.r[0] + r.r[2]) / 2, (r.r[1] + r.r[3]) / 2, (r.r[2] - r.r[0]) / 2 + 0.5, (r.r[3] - r.r[1]) / 2 + 0.5]
    : (() => { const xs = r.p.map(p => p[0]), ys = r.p.map(p => p[1]); return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, (Math.max(...xs) - Math.min(...xs)) / 2 + 0.5, (Math.max(...ys) - Math.min(...ys)) / 2 + 0.5]; })();
  regions.forEach((r, i) => {
    for (let Y = 0; Y < h; Y++) for (let X = 0; X < w; X++) if (inside(r, X + 0.5, Y + 0.5)) id[Y * w + X] = i;
  });
  const at = (X, Y) => (X < 0 || Y < 0 || X >= w || Y >= h ? -1 : id[Y * w + X]);
  for (let Y = 0; Y < h; Y++) for (let X = 0; X < w; X++) {
    const i = at(X, Y);
    if (i < 0) {
      if (outline && (at(X - 1, Y) >= 0 || at(X + 1, Y) >= 0 || at(X, Y - 1) >= 0 || at(X, Y + 1) >= 0)) px(x, X, Y, outline);
      continue;
    }
    const r = regions[i], [cx, cy, rx, ry] = center(r);
    const v = -(((X + 0.5 - cx) / rx) * 0.55 + ((Y + 0.5 - cy) / ry) * 0.85);
    let shade = v > (r.lt ?? 0.42) ? 0 : v > (r.dk ?? -0.38) ? 1 : 2;
    if (r.noise && hash2(X, Y, r.noise) < 0.18) shade = Math.max(0, shade - 1);
    if (r.noise && hash2(X, Y, r.noise + 1) < 0.12) shade = Math.min(2, shade + 1);
    px(x, X, Y, r.c[shade]);
    if (r.inner && (at(X, Y - 1) !== i && at(X, Y - 1) >= 0)) px(x, X, Y, r.inner);
  }
  if (detail) detail(x);
  return c;
}

function drawOlive(ctx, ox, oy, seed = 0) {
  // sombra
  for (let y = 26; y < 32; y++) for (let x = 3; x < 30; x++) {
    if (((x - 16) / 13) ** 2 + ((y - 29) / 3.2) ** 2 <= 1) px(ctx, ox + x, oy + y, GP.grassS);
  }
  const s = (k) => hash2(seed, k, 5);
  const canopy = [
    { e: [9.5 + s(1), 12, 8.5, 7.5], c: ['#b4cb8e', '#86a667', '#5c7e49'], noise: 3 + seed },
    { e: [22 - s(2), 11.5, 8.5, 7.5], c: ['#b4cb8e', '#86a667', '#5c7e49'], noise: 5 + seed },
    { e: [16, 6.5, 8, 6.5], c: ['#bfd49a', '#8fae6e', '#62844d'], noise: 7 + seed },
    { e: [15.5, 15, 8, 6], c: ['#a8c184', '#7d9e60', '#557645'], noise: 9 + seed },
  ];
  const trunk = [{ p: [[13, 19], [18, 19], [17.5, 24], [19.5, 30], [12, 30], [14.5, 24]], c: ['#b5a48d', '#8c7a66', '#5e4e40'] }];
  const tc = shapeArt(32, 32, trunk, '#3a2e26');
  ctx.drawImage(tc, ox, oy);
  const cc = shapeArt(32, 24, canopy, '#2f4529', x => {
    for (let k = 0; k < 14; k++) {
      const X = 4 + Math.floor(hash2(seed, k, 31) * 24), Y = 2 + Math.floor(hash2(seed, k, 32) * 14);
      const d = x.getImageData(X, Y, 1, 1).data;
      if (d[3] && d[1] > 150) px(x, X, Y, '#dce6c6');
    }
  });
  ctx.drawImage(cc, ox, oy);
}

function drawCypress(ctx, ox, oy) {
  for (let y = 27; y < 32; y++) for (let x = 2; x < 14; x++) if (((x - 8) / 6) ** 2 + ((y - 29.5) / 2) ** 2 <= 1) px(ctx, ox + x, oy + y, GP.grassS);
  rect(ctx, ox + 7, oy + 25, 2, 5, '#6e5440'); px(ctx, ox + 6, oy + 29, '#3a2e26');
  const reg = [{ p: [[8, 0], [12.5, 9], [13.5, 18], [11.5, 26.5], [4.5, 26.5], [2.5, 18], [3.5, 9]], c: ['#5f924f', '#3f6d3c', '#2b4f2d'], noise: 13, lt: 0.2, dk: -0.25 }];
  ctx.drawImage(shapeArt(16, 28, reg, '#1c3220'), ox, oy);
}

function drawRock(ctx, ox, oy) {
  ctx.drawImage(shapeArt(16, 16, [{ e: [8, 9.5, 6.8, 5.2], c: ['#d6d2c8', '#a8a296', '#787268'], noise: 21 }], '#3e3a36'), ox, oy);
}

function drawHouse(ctx, ox, oy, wc, hc, o) {
  const Wd = wc * 16, Ht = hc * 16;
  const roofH = 26, wallY = 29;
  const R = o.roof || ['#e98c62', '#c9623e', '#94422a'];
  const OL = '#3e2a22';
  // tejado (de tejas o plano con almenas, al estilo de Marruecos)
  if (o.flat) {
    const F = o.flat === true ? ['#f2cfa0', '#ddb07c', '#b8885a'] : o.flat;
    rect(ctx, ox, oy, Wd, roofH, F[1]);
    for (let k = 0; k < Wd; k += 3) px(ctx, ox + k + (k % 2), oy + 6 + Math.floor(hash2(k, oy, 9) * 16), F[0]);
    rect(ctx, ox, oy + 3, Wd, 2, F[2]);
    for (let x = 1; x < Wd - 3; x += 6) { rect(ctx, ox + x, oy, 4, 3, F[0]); rect(ctx, ox + x, oy - 1, 4, 1, OL); }
    rect(ctx, ox, oy, 1, roofH, OL); rect(ctx, ox + Wd - 1, oy, 1, roofH, OL);
    rect(ctx, ox, oy + roofH, Wd, 2, F[2]); rect(ctx, ox, oy + roofH + 2, Wd, 1, OL);
  } else {
    rect(ctx, ox, oy, Wd, roofH, R[1]);
    for (let y = 3; y < roofH; y++) {
      const course = Math.floor((y - 3) / 5), r = (y - 3) % 5;
      for (let x = 1; x < Wd - 1; x++) {
        let c = R[1];
        if (r === 4) c = R[2];
        else { const ph = (x + (course % 2) * 2) % 4; c = ph === 0 ? R[2] : ph === 1 ? R[0] : R[1]; }
        px(ctx, ox + x, oy + y, c);
      }
    }
    rect(ctx, ox, oy, Wd, 3, R[2]);
    rect(ctx, ox + 1, oy + 1, Wd - 2, 1, R[3] || '#7a3422');
    rect(ctx, ox, oy, Wd, 1, OL); rect(ctx, ox, oy, 1, roofH, OL); rect(ctx, ox + Wd - 1, oy, 1, roofH, OL);
    rect(ctx, ox, oy + roofH, Wd, 2, R[3] || '#6a2c1c'); rect(ctx, ox, oy + roofH + 2, Wd, 1, OL);
  }
  if (o.chimney) {
    const cx = ox + o.chimney * 16 + 4;
    rect(ctx, cx, oy - 2, 7, 9, '#efe8dc'); rect(ctx, cx, oy - 2, 7, 1, OL); rect(ctx, cx, oy - 2, 1, 9, OL); rect(ctx, cx + 6, oy - 2, 1, 9, OL);
    rect(ctx, cx + 1, oy - 1, 5, 1, '#b8ac9c');
  }
  // fachada (encalada por defecto)
  const WL = o.wall || ['#f6f2ea', '#d6cdbf', '#e8e1d4'];
  rect(ctx, ox, oy + wallY, Wd, Ht - wallY, WL[0]);
  rect(ctx, ox, oy + wallY, Wd, 2, WL[1]);
  for (let k = 0; k < Wd; k++) if (hash2(k, oy, 3) < 0.25) px(ctx, ox + k, oy + wallY + 3 + Math.floor(hash2(k, ox, 4) * 22), WL[2]);
  rect(ctx, ox, oy + wallY, 1, Ht - wallY, OL); rect(ctx, ox + Wd - 1, oy + wallY, 1, Ht - wallY, OL);
  rect(ctx, ox + Wd - 2, oy + wallY, 1, Ht - wallY, WL[1]);
  // zócalo
  const zy = oy + Ht - 8;
  rect(ctx, ox + 1, zy, Wd - 2, 8, o.plinth || '#d9a94a');
  rect(ctx, ox + 1, zy, Wd - 2, 1, '#a87c2c');
  rect(ctx, ox, oy + Ht - 1, Wd, 1, OL);
  // ventanas con reja y geranios
  (o.windows || []).forEach(col => {
    const wx = ox + col * 16 + 3, wy = oy + 34;
    rect(ctx, wx - 1, wy - 1, 12, 12, OL);
    rect(ctx, wx, wy, 10, 10, o.frame || '#3a70c0');
    rect(ctx, wx + 1, wy + 1, 8, 8, '#2e3c5c');
    rect(ctx, wx + 1, wy + 1, 3, 3, '#4a5c86');
    for (const bx of [3, 6]) rect(ctx, wx + bx, wy + 1, 1, 8, '#191922');
    rect(ctx, wx + 1, wy + 5, 8, 1, '#191922');
    rect(ctx, wx - 2, wy + 10, 14, 2, '#e9e2d4'); rect(ctx, wx - 2, wy + 12, 14, 1, '#b8ae9e');
    rect(ctx, wx + 2, wy + 12, 6, 3, '#c4622e'); rect(ctx, wx + 2, wy + 14, 6, 1, '#8a3e1c');
    const fl = [[wx + 1, wy + 9], [wx + 4, wy + 8], [wx + 7, wy + 9], [wx + 2, wy + 7], [wx + 6, wy + 7]];
    fl.forEach(([X, Y], i) => { px(ctx, X, Y, i % 2 ? '#3a8c3a' : '#e83848'); px(ctx, X + 1, Y, '#3a8c3a'); px(ctx, X, Y + 1, '#2a6a2a'); });
    px(ctx, wx + 4, wy + 7, '#f8607a');
  });
  // puerta en arco
  const dx = ox + o.door * 16 + 2, dy = oy + Ht - 23;
  rect(ctx, dx - 1, dy - 1, 14, 24, '#e2d8c6');
  rect(ctx, dx, dy + 2, 12, 21, OL);
  rect(ctx, dx + 2, dy, 8, 2, OL); rect(ctx, dx + 1, dy + 1, 10, 2, OL);
  const D = o.doorCol || ['#a06a3c', '#8c5a32', '#5f3c20'];
  rect(ctx, dx + 1, dy + 3, 10, 20, D[1]);
  rect(ctx, dx + 3, dy + 1, 6, 2, D[1]); rect(ctx, dx + 2, dy + 2, 8, 1, D[1]);
  for (const lx of [3, 6, 9]) rect(ctx, dx + lx, dy + 3, 1, 20, D[2]);
  rect(ctx, dx + 1, dy + 3, 1, 20, D[0]);
  for (const [sx, sy] of [[2, 8], [5, 8], [8, 8], [2, 16], [5, 16], [8, 16]]) px(ctx, dx + sx, dy + sy, '#e8c860');
  px(ctx, dx + 9, dy + 12, '#f2d870');
  rect(ctx, dx - 1, oy + Ht - 2, 14, 2, '#a8a098');
  if (o.shield) {
    const sx = dx + 1, sy = oy + wallY + 3;
    rect(ctx, sx, sy, 10, 1, OL);
    const rows = ['kyyyyyyyyk', 'kyrrrryyyk', 'kyrrryyrrk', 'kyryyrrrrk', 'kyyrrrrryk', '.kyrrrryk.', '..kyrryk..', '...kyyk...', '....kk....'];
    paintRows(ctx, rows, { k: OL, y: '#f2ca52', r: '#c23a3a' }, sx, sy + 1);
  }
  if (o.sign) drawHangSign(ctx, dx + 13, oy + wallY + 2, o.sign);
}

function drawFence(ctx, ox, oy, nb) {
  const OL = '#4a2e18', Wd = '#b07a46', D = '#704622', L = '#d8a468';
  const rails = (x0, x1) => {
    for (const y of [4, 9]) {
      rect(ctx, ox + x0, oy + y - 1, x1 - x0 + 1, 1, OL);
      rect(ctx, ox + x0, oy + y, x1 - x0 + 1, 1, L);
      rect(ctx, ox + x0, oy + y + 1, x1 - x0 + 1, 1, Wd);
      rect(ctx, ox + x0, oy + y + 2, x1 - x0 + 1, 1, OL);
    }
  };
  if (nb.w || nb.e) rails(nb.w ? 0 : 6, nb.e ? 15 : 9);
  if (nb.n) { rect(ctx, ox + 6, oy, 4, 6, OL); rect(ctx, ox + 7, oy, 2, 6, Wd); px(ctx, ox + 7, oy, L); }
  if (nb.s) { rect(ctx, ox + 6, oy + 10, 4, 6, OL); rect(ctx, ox + 7, oy + 10, 2, 6, Wd); }
  rect(ctx, ox + 5, oy + 1, 6, 13, OL);
  rect(ctx, ox + 6, oy + 2, 4, 11, Wd);
  rect(ctx, ox + 6, oy + 2, 1, 11, L); rect(ctx, ox + 9, oy + 2, 1, 11, D);
  rect(ctx, ox + 6, oy + 2, 4, 1, L);
  rect(ctx, ox + 5, oy + 14, 6, 1, 'rgba(40,60,20,0.35)');
}

function drawWell(ctx, ox, oy) {
  ctx.drawImage(shapeArt(16, 16, [
    { e: [8, 9, 7.4, 6.6], c: ['#dcd8d0', '#aaa49a', '#7a7468'], noise: 41 },
    { e: [8, 8.6, 4.2, 3.6], c: ['#4f7ab0', '#2c4c7a', '#1a3050'], lt: 0.75 },
  ], '#3a3632', x => { px(x, 6, 7, '#b8d8f8'); px(x, 7, 7, '#8ab4e4'); for (const [a, b] of [[2, 6], [12, 6], [4, 13], [11, 13], [8, 15]]) px(x, a, b, '#8a8478'); }), ox, oy);
}
function drawSign(ctx, ox, oy) {
  rect(ctx, ox + 7, oy + 9, 2, 6, '#7a5030'); rect(ctx, ox + 6, oy + 9, 1, 6, '#3c2414'); rect(ctx, ox + 9, oy + 9, 1, 6, '#3c2414');
  rect(ctx, ox + 1, oy + 1, 14, 10, '#3c2414');
  rect(ctx, ox + 2, oy + 2, 12, 8, '#c89058');
  rect(ctx, ox + 2, oy + 2, 12, 1, '#e4b07a');
  rect(ctx, ox + 4, oy + 4, 8, 1, '#7a5030'); rect(ctx, ox + 4, oy + 6, 6, 1, '#7a5030');
  rect(ctx, ox + 2, oy + 9, 12, 1, '#9a6a3c');
  rect(ctx, ox + 5, oy + 15, 6, 1, 'rgba(40,60,20,0.35)');
}
function drawDummy(ctx, ox, oy) {
  const OL = '#3c2414';
  rect(ctx, ox + 6, oy + 4, 4, 12, OL); rect(ctx, ox + 7, oy + 5, 2, 11, '#9a6a3c');
  rect(ctx, ox + 1, oy + 6, 14, 4, OL); rect(ctx, ox + 2, oy + 7, 12, 2, '#b07a46');
  rect(ctx, ox + 5, oy + 0, 6, 6, OL); rect(ctx, ox + 6, oy + 1, 4, 4, '#e2c890'); px(ctx, ox + 7, oy + 2, '#7a5a30'); px(ctx, ox + 9, oy + 2, '#7a5a30');
  paintRows(ctx, ['kkkkkk', 'kwrrwk', 'kwrrwk', 'kwrrwk', '.kwwk.', '..kk..'], { k: OL, w: '#f2ecdc', r: '#c23a3a' }, ox + 0, oy + 8);
  rect(ctx, ox + 4, oy + 15, 8, 1, 'rgba(40,40,20,0.3)');
}
function drawBarrel(ctx, ox, oy) {
  ctx.drawImage(shapeArt(16, 16, [{ e: [8, 8.5, 6, 7], c: ['#c08a52', '#9a6838', '#6c4626'], noise: 61, lt: 0.5 }], '#3a2414', x => {
    for (const y of [4, 12]) for (let X = 2; X < 14; X++) { const d = x.getImageData(X, y, 1, 1).data; if (d[3] && !(d[0] === 58 && d[1] === 36)) px(x, X, y, '#4c4a52'); }
    for (let X = 4; X < 12; X++) px(x, X, 2, '#d8a468');
  }), ox, oy);
}
function drawBarricade(ctx, ox, oy) {
  const OL = '#2e1e12';
  for (const x of [2, 12]) { rect(ctx, ox + x - 1, oy + 4, 4, 12, OL); rect(ctx, ox + x, oy + 5, 2, 11, '#8c5a32'); }
  rect(ctx, ox, oy + 4, 16, 7, OL);
  for (let x = 1; x < 15; x++) for (let y = 5; y < 10; y++) px(ctx, ox + x, oy + y, Math.floor((x + y) / 3) % 2 ? '#d83a32' : '#f4ece0');
}
function drawSack(ctx, ox, oy) {
  ctx.drawImage(shapeArt(16, 16, [
    { e: [8, 10.5, 5.5, 4.5], c: ['#ecd49a', '#cfae6c', '#a08048'], noise: 71 },
    { p: [[6, 4.5], [10, 4.5], [9, 6.5], [7, 6.5]], c: ['#ecd49a', '#cfae6c', '#a08048'] },
  ], '#4a3418', x => { rect(x, 6, 6, 4, 1, '#c23a3a'); px(x, 5, 9, '#f6ecc6'); }), ox, oy);
}

// ─── Animales (para combates; se dibujan a ×2) ───────────────────────────
function drawBoar() {
  const br = ['#a87c56', '#7c5638', '#573a22'];
  return shapeArt(30, 22, [
    { r: [7, 15, 9.6, 21.5], c: ['#6e4a30', '#55381f', '#3e2814'] },
    { r: [21, 15, 23.6, 21.5], c: ['#6e4a30', '#55381f', '#3e2814'] },
    { e: [18, 10.5, 10.5, 7], c: br, noise: 3 },
    { e: [17, 4.6, 9, 2.6], c: ['#5c3c26', '#43291a', '#2e1a0e'], noise: 4 },
    { r: [11, 16, 13.6, 21.5], c: ['#8a6040', '#6a4628', '#4c3018'] },
    { r: [25, 15.5, 27.4, 21], c: ['#8a6040', '#6a4628', '#4c3018'] },
    { e: [7.5, 11.5, 6, 5.5], c: br, noise: 6 },
    { p: [[7, 2.5], [11.5, 6], [6.5, 7.5]], c: ['#7c5638', '#5c3c26', '#43291a'] },
    { r: [0.5, 11.5, 4, 15.5], c: ['#d8a892', '#b8887a', '#8c6458'] },
  ], '#24160e', x => {
    px(x, 6, 9, '#14090a'); px(x, 5, 9, '#f4eadc');
    px(x, 1, 13, '#4a2a22'); px(x, 3, 13, '#4a2a22');
    px(x, 3, 16, '#fbf4e4'); px(x, 2, 17, '#fbf4e4'); px(x, 4, 16, '#d8ccb4');
    px(x, 29, 8, '#43291a'); px(x, 29, 9, '#24160e');
  });
}
function drawWolf() { return drawCanid({ g: ['#c6cad6', '#8e94a4', '#5e6474'], leg: ['#7a8090', '#5e6474', '#454a58'], legL: ['#a0a6b4', '#7a8090', '#5e6474'], ear: ['#9aa0ae', '#6e7484', '#4c5262'], belly: ['#eef0f4', '#d2d6de', '#aab0bc'], snout: ['#dcdfe6', '#b4b9c4', '#8a909e'], ol: '#22242c' }); }
function drawCanid(c) {
  const g = c.g;
  return shapeArt(31, 23, [
    { e: [27, 9, 3.5, 2.4], c: g, noise: 9 },
    { r: [21, 14, 23.4, 22], c: c.leg },
    { r: [7, 15, 9.5, 22], c: c.leg },
    { e: [18, 11.5, 9, 5], c: g, noise: 10 },
    { e: [15, 15, 6, 1.8], c: c.belly },
    { r: [24.5, 14.5, 26.5, 22], c: c.legL },
    { r: [11, 15.5, 13, 22], c: c.legL },
    { e: [9.5, 11, 5, 6], c: g, noise: 11 },
    { p: [[3.5, c.bigEars ? -1 : 0.5], [7.5, 3], [3.5, 4]], c: c.ear },
    { p: [[8, c.bigEars ? -1 : 0.5], [11, 4], [7, 3.5]], c: c.ear },
    { e: [7, 6.5, 5, 4.2], c: g, noise: 12 },
    { r: [0.5, 6.5, 4, 9.5], c: c.snout },
    { e: [9, 12.5, 2.6, 3.4], c: c.belly },
  ], c.ol, x => {
    px(x, 5, 5, '#f4c838'); px(x, 6, 5, '#1a1a1e');
    px(x, 0, 6, '#16161a'); px(x, 1, 6, '#16161a');
    rect(x, 1, 9, 3, 1, '#3a3c46'); px(x, 2, 10, '#f4f0ea');
  });
}

// ─── Iconos e interfaz ───────────────────────────────────────────────────
const UIPAL = { o: '#3b2414', g: '#c99a46', b: '#7a4d26', f: '#fbf4e0', f2: '#efe1bd' };
function drawBox(ctx, x, y, w, h, style = 'parch') {
  const o = UIPAL.o;
  rect(ctx, x + 2, y, w - 4, h, o); rect(ctx, x, y + 2, w, h - 4, o); rect(ctx, x + 1, y + 1, w - 2, h - 2, o);
  if (style === 'dark') {
    rect(ctx, x + 2, y + 1, w - 4, h - 2, '#6a5a7e'); rect(ctx, x + 1, y + 2, w - 2, h - 4, '#6a5a7e');
    rect(ctx, x + 2, y + 2, w - 4, h - 4, '#463b5c');
    return;
  }
  rect(ctx, x + 2, y + 1, w - 4, h - 2, UIPAL.g); rect(ctx, x + 1, y + 2, w - 2, h - 4, UIPAL.g);
  rect(ctx, x + 2, y + 2, w - 4, h - 4, UIPAL.b);
  rect(ctx, x + 3, y + 3, w - 6, h - 6, UIPAL.f);
  rect(ctx, x + 3, y + h - 5, w - 6, 2, UIPAL.f2);
}
function drawCursor(ctx, x, y, col = '#3c3434') {
  for (let i = 0; i < 4; i++) rect(ctx, x + i, y + i, 1, 7 - i * 2, col);
}
function drawDownArrow(ctx, x, y, col = '#c23a3a') {
  for (let i = 0; i < 4; i++) rect(ctx, x + i, y + i, 7 - i * 2, 1, col);
}
function drawBubble(ctx, x, y) {
  paintRows(ctx, [
    '.kkkkkk.', 'kwwwwwwk', 'kwwrrwwk', 'kwwrrwwk', 'kwwrrwwk', 'kwwwwwwk', 'kwwrrwwk', 'kwwwwwwk', '.kkkkkk.', '...kk...', '...k....',
  ], { k: '#2a2131', w: '#ffffff', r: '#d83030' }, x, y);
}
function drawCrown(ctx, x, y, s = 1) {
  const rows = [
    '.k......k......k.', 'kyk....kyk....kyk', 'kyyk..kyyyk..kyyk', 'kyyykkyyyyykkyyyk', 'kyyyyyyyyyyyyyyyk',
    'kyrryyyybyyyyrryk', 'kyyyyyyyyyyyyyyyk', 'kkkkkkkkkkkkkkkkk',
  ];
  const [c, x2] = mkCanvas(17, 8);
  paintRows(x2, rows, { k: '#3a1c08', y: '#f2c94c', r: '#d83a32', b: '#3a70c0' });
  ctx.drawImage(c, x, y, 17 * s, 8 * s);
}

// Barra de vida
function drawHpBar(ctx, x, y, w, ratio) {
  rect(ctx, x - 1, y - 1, w + 2, 5, '#3a2a2a');
  rect(ctx, x, y, w, 3, '#6a6260');
  const fw = Math.max(0, Math.round(w * clamp(ratio, 0, 1)));
  const col = ratio > 0.5 ? ['#68d860', '#38a838'] : ratio > 0.2 ? ['#f8d038', '#c89818'] : ['#f05038', '#b02818'];
  if (fw > 0) { rect(ctx, x, y, fw, 3, col[0]); rect(ctx, x, y + 2, fw, 1, col[1]); }
}
