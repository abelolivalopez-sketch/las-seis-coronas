// ─── Arte: regiones, casillas nuevas y edificios grandes ──────────────────
// Cada mapa elige un tema (theme) que cambia los colores del suelo.
const BASE_GP = {
  stone: { b: '#d2c6ae', d: '#b0a288', l: '#e8decb', m: '#8f8268' },
  wall: { top: '#ddd0b4', b: '#c4b290', d: '#9e8c6a', l: '#ebdcbc', ol: '#4a3e30' },
  rock: ['#c2b49e', '#968874', '#6c6052', '#3a3230'],
  wood: { b: '#b07a46', d: '#7a5030', l: '#d0a06a', ol: '#3c2414' },
};
const THEMES = {
  verde: Object.assign({}, PAL, BASE_GP),
  seco: Object.assign({}, PAL, BASE_GP, {
    grass: '#bfc46c', grassD: '#9fa250', grassL: '#d8da8e', grassS: '#a6aa58',
    tall: '#d2a63e', tallD: '#a6802a', tallM: '#e4c058', tallL: '#f4de8e',
    dirt: { b: '#e2c08a', d: '#c8a06a', l: '#f2d8a8', e: '#b08a54' },
    rock: ['#c8b8a0', '#9c8c76', '#6e6252', '#3c3230'],
  }),
  costa: Object.assign({}, PAL, BASE_GP, {
    grass: '#a2d070', grassD: '#7eb24e', grassL: '#c4e690', grassS: '#8abc5a',
    tall: '#6aa848', tallD: '#4a8432', tallM: '#88c060', tallL: '#bce08a',
    water: '#4a94dc', waterD: '#2a5a96', waterL: '#8ac0f4',
  }),
  rif: Object.assign({}, PAL, BASE_GP, {
    grass: '#cbb470', grassD: '#ae9450', grassL: '#e2cf92', grassS: '#b49c5c',
    tall: '#94a044', tallD: '#707c2e', tallM: '#b0b85c', tallL: '#d8dc90',
    dirt: { b: '#dca26a', d: '#c0824c', l: '#eebc88', e: '#a86a3c' },
    stone: { b: '#e2b484', d: '#c69462', l: '#f2cc9e', m: '#a8784a' },
    wall: { top: '#ebb87e', b: '#d49a62', d: '#b47a46', l: '#f2c892', ol: '#5a3418' },
    rock: ['#d4a070', '#b07a4c', '#865634', '#4a2a18'],
  }),
  toscana: Object.assign({}, PAL, BASE_GP, {
    grass: '#8cc46a', grassD: '#68a24c', grassL: '#b0dc8c', grassS: '#76ae58',
    tall: '#4e8c3c', tallD: '#366a2a', tallM: '#6aa850', tallL: '#a2d07c',
    stone: { b: '#c4beb2', d: '#a29c90', l: '#dcd6ca', m: '#827c72' },
    wall: { top: '#d4cab6', b: '#b8ac92', d: '#968a72', l: '#e2d6be', ol: '#463c30' },
    rock: ['#bcb6ac', '#928c82', '#6a645c', '#36322e'],
  }),
  laguna: Object.assign({}, PAL, BASE_GP, {
    grass: '#9cc878', grassD: '#78a858', grassL: '#bcdc98', grassS: '#86b464',
    tall: '#8a9c4c', tallD: '#667636', tallM: '#a6b664', tallL: '#d0da96',
    water: '#4f8fae', waterD: '#2c5a74', waterL: '#86bcd4', foam: '#c6e2ee',
    stone: { b: '#d6cab4', d: '#b4a68e', l: '#ece2ce', m: '#948670' },
    wall: { top: '#e4c8a8', b: '#c89c78', d: '#a87a58', l: '#f0d8bc', ol: '#4c3020' },
  }),
  arena: Object.assign({}, PAL, BASE_GP, {
    grass: '#c9b48a', grassD: '#ae9870', grassL: '#e0cea4', grassS: '#b49e76',
    wall: { top: '#b49c7c', b: '#9c8264', d: '#7a634a', l: '#c8b292', ol: '#3a2c20' },
  }),
  madera: Object.assign({}, PAL, BASE_GP, {
    water: '#3f7fb8', waterD: '#244e7c', waterL: '#78aee2',
  }),
};
function setTheme(k) { GP = THEMES[k] || THEMES.verde; }

// Color de suelo de una casilla (para las orillas del agua)
function groundCol(ch) {
  if (ch === 's' || ch === 'Q' || ch === 'r') return GP.sand.b;
  if (ch === '=') return GP.dirt.b;
  if (ch === '#') return GP.stone.b;
  if (ch === 'D' || ch === 'X' || ch === 'K') return GP.wood.b;
  if (ch === 'W') return GP.wall.top;
  if (ch === 'M') return GP.rock[1];
  return GP.grass;
}

// Empedrado de calles y plazas
function cobbleTile(ctx, ox, oy, tx, ty) {
  const S = GP.stone;
  rect(ctx, ox, oy, 16, 16, S.m);
  for (let r = 0; r < 4; r++) {
    const gy = ty * 4 + r, off = (gy % 2) * 4, y = oy + r * 4;
    for (let c = -1; c < 3; c++) {
      const lx = c * 8 + off, x0 = Math.max(0, lx), x1 = Math.min(16, lx + 7);
      if (x1 <= x0) continue;
      const id = Math.floor((tx * 16 + lx - off) / 8);
      const v = hash2(id, gy, 3);
      rect(ctx, ox + x0, y, x1 - x0, 3, v < 0.28 ? S.d : v < 0.85 ? S.b : S.l);
      rect(ctx, ox + x0, y, x1 - x0, 1, S.l);
    }
  }
}

// Muralla: las filas de abajo enseñan la cara de piedra; las de arriba, el adarve
function wallTile(ctx, ox, oy, tx, ty, nb) {
  const Wc = GP.wall;
  if (nb.s) {
    rect(ctx, ox, oy, 16, 16, Wc.b);
    for (let r = 0; r < 3; r++) {
      const y = oy + 1 + r * 5, off = ((ty * 3 + r) % 2) * 4;
      rect(ctx, ox, y + 4, 16, 1, Wc.d);
      for (let x = off; x < 16; x += 8) rect(ctx, ox + x, y, 1, 4, Wc.d);
      rect(ctx, ox, y, 16, 1, Wc.l);
    }
    rect(ctx, ox, oy + 15, 16, 1, Wc.ol);
    if (nb.n) {
      rect(ctx, ox, oy, 16, 1, Wc.ol);
      for (let x = 0; x < 16; x += 8) { rect(ctx, ox + x + 1, oy - 3, 5, 3, Wc.l); rect(ctx, ox + x, oy - 4, 7, 1, Wc.ol); rect(ctx, ox + x, oy - 3, 1, 3, Wc.ol); rect(ctx, ox + x + 6, oy - 3, 1, 3, Wc.ol); }
    }
  } else {
    rect(ctx, ox, oy, 16, 16, Wc.top);
    for (let k = 0; k < 5; k++) px(ctx, ox + Math.floor(hash2(tx, ty, k + 300) * 16), oy + Math.floor(hash2(tx, ty, k + 310) * 16), Wc.b);
    if (nb.n) {
      rect(ctx, ox, oy, 16, 1, Wc.ol);
      for (let x = 0; x < 16; x += 8) { rect(ctx, ox + x + 1, oy + 1, 5, 3, Wc.l); rect(ctx, ox + x + 1, oy + 4, 5, 1, Wc.d); }
    }
  }
  if (nb.w) rect(ctx, ox, oy, 1, 16, Wc.ol);
  if (nb.e) rect(ctx, ox + 15, oy, 1, 16, Wc.ol);
}

// Roca de montaña (no se puede pasar)
function cliffTile(ctx, ox, oy, tx, ty, nb) {
  const R = GP.rock;
  rect(ctx, ox, oy, 16, 16, R[1]);
  for (let k = 0; k < 9; k++) {
    const x = ox + Math.floor(hash2(tx, ty, k + 400) * 13), y = oy + Math.floor(hash2(tx, ty, k + 410) * 13);
    const c = hash2(tx, ty, k + 420) < 0.5 ? R[0] : R[2];
    rect(ctx, x, y, 3, 2, c); px(ctx, x + 1, y + 2, R[2]);
  }
  if (nb.s) {
    rect(ctx, ox, oy + 9, 16, 7, R[2]);
    for (let x = 1; x < 16; x += 4) rect(ctx, ox + x + Math.floor(hash2(tx, x, 7) * 2), oy + 10, 1, 5, R[3]);
    rect(ctx, ox, oy + 9, 16, 1, R[0]);
    rect(ctx, ox, oy + 15, 16, 1, R[3]);
  }
  if (nb.n) { rect(ctx, ox, oy, 16, 1, R[3]); rect(ctx, ox, oy + 1, 16, 1, R[0]); }
  if (nb.w) rect(ctx, ox, oy, 1, 16, R[3]);
  if (nb.e) rect(ctx, ox + 15, oy, 1, 16, R[3]);
}

// Tablones de cubierta (barco, muelle, interiores)
function deckTile(ctx, ox, oy, tx, ty) {
  const Wd = GP.wood;
  rect(ctx, ox, oy, 16, 16, Wd.b);
  for (let r = 0; r < 4; r++) {
    const y = oy + r * 4;
    rect(ctx, ox, y + 3, 16, 1, Wd.d);
    rect(ctx, ox, y, 16, 1, Wd.l);
    const j = Math.floor(hash2(tx, ty * 4 + r, 5) * 12) + 2;
    rect(ctx, ox + j, y, 1, 3, Wd.d);
    px(ctx, ox + j + 2, y + 1, Wd.ol); px(ctx, ox + j - 2, y + 1, Wd.ol);
  }
}

// Puente de madera sobre el agua
function bridgeTile(ctx, ox, oy, tx, ty, nb) {
  const Wd = GP.wood;
  rect(ctx, ox, oy, 16, 16, GP.water);
  const vertical = nb.w || nb.e;
  if (vertical) {
    rect(ctx, ox + 1, oy, 14, 16, Wd.b);
    for (let y = 0; y < 16; y += 4) { rect(ctx, ox + 1, oy + y + 3, 14, 1, Wd.d); rect(ctx, ox + 1, oy + y, 14, 1, Wd.l); }
    if (nb.w) { rect(ctx, ox, oy, 2, 16, Wd.ol); rect(ctx, ox + 1, oy, 1, 16, Wd.d); }
    if (nb.e) { rect(ctx, ox + 14, oy, 2, 16, Wd.ol); rect(ctx, ox + 14, oy, 1, 16, Wd.d); }
  } else {
    rect(ctx, ox, oy + 1, 16, 14, Wd.b);
    for (let x = 0; x < 16; x += 4) { rect(ctx, ox + x + 3, oy + 1, 1, 14, Wd.d); rect(ctx, ox + x, oy + 1, 1, 14, Wd.l); }
    if (nb.n) { rect(ctx, ox, oy, 16, 2, Wd.ol); }
    if (nb.s) { rect(ctx, ox, oy + 14, 16, 2, Wd.ol); }
  }
}

function drawCrate(ctx, ox, oy) {
  const OL = '#3a2414';
  rect(ctx, ox + 1, oy + 1, 14, 14, OL);
  rect(ctx, ox + 2, oy + 2, 12, 12, '#c69456');
  rect(ctx, ox + 2, oy + 2, 12, 1, '#e0b47a');
  rect(ctx, ox + 2, oy + 7, 12, 2, '#8a5a30');
  for (let i = 0; i < 10; i++) px(ctx, ox + 3 + i, oy + 3 + i, '#8a5a30');
  rect(ctx, ox + 2, oy + 13, 12, 1, '#7a4c28');
}

function drawPalm(ctx, ox, oy, seed = 0) {
  const lean = hash2(seed, 1, 3) < 0.5 ? -1 : 1;
  for (let y = 27; y < 32; y++) for (let x = 6; x < 26; x++) if (((x - 16) / 9) ** 2 + ((y - 29.5) / 2) ** 2 <= 1) px(ctx, ox - 8 + x, oy - 16 + y, 'rgba(40,40,10,0.22)');
  const leaf = ['#6cb850', '#4a9038', '#2f6a2a'];
  const tx = 16 + lean * 2;
  const art = shapeArt(32, 32, [
    { p: [[15, 30], [18, 30], [17 + lean * 2, 8], [15 + lean * 2, 8]], c: ['#c09868', '#94704a', '#6a4e34'], lt: 0.1 },
    { p: [[tx, 8], [tx - 13, 9], [tx - 15, 13], [tx - 6, 10]], c: leaf },
    { p: [[tx, 8], [tx + 13, 9], [tx + 15, 13], [tx + 6, 10]], c: leaf },
    { p: [[tx, 7], [tx - 10, 1], [tx - 13, 3], [tx - 3, 9]], c: leaf },
    { p: [[tx, 7], [tx + 10, 1], [tx + 13, 3], [tx + 3, 9]], c: leaf },
    { p: [[tx, 7], [tx - 2, 0], [tx + 2, 0], [tx + 1, 8]], c: leaf },
    { e: [tx - 1, 10, 1.6, 1.6], c: ['#8c6a3a', '#6a4c26', '#4a3218'] },
    { e: [tx + 2, 10.5, 1.6, 1.6], c: ['#8c6a3a', '#6a4c26', '#4a3218'] },
  ], '#203018', x => { for (let y = 12; y < 30; y += 3) rect(x, 15 + Math.round(lean * (30 - y) / 11), y, 3, 1, '#6a4e34'); });
  ctx.drawImage(art, ox - 8, oy - 16);
}

// ─── Edificios y objetos grandes ──────────────────────────────────────────
const STONE = {
  claro: ['#ece0c6', '#cdbb96', '#a28c66'],
  gris: ['#d8d4cc', '#b0aaa0', '#847e74'],
  ocre: ['#f0c896', '#d4a06c', '#a8744a'],
  rojo: ['#e09a76', '#c0704e', '#8c4a32'],
};
const OLB = '#3e3026';

function drawColiseo(ctx, ox, oy, wc, hc, o) {
  const Wd = wc * 16, Ht = hc * 16, S = o.stone || STONE.claro, col = o.color || '#c23a3a';
  // cuerpo con laterales más oscuros (parece curvo)
  rect(ctx, ox, oy + 8, Wd, Ht - 8, S[1]);
  for (let x = 0; x < Wd; x++) {
    const k = Math.abs(x - Wd / 2) / (Wd / 2);
    if (k > 0.78) rect(ctx, ox + x, oy + 8, 1, Ht - 8, S[2]);
    else if (k < 0.45) rect(ctx, ox + x, oy + 10, 1, Ht - 12, S[0]);
  }
  rect(ctx, ox, oy + 8, Wd, 1, OLB); rect(ctx, ox, oy + 8, 1, Ht - 8, OLB); rect(ctx, ox + Wd - 1, oy + 8, 1, Ht - 8, OLB);
  rect(ctx, ox + 1, oy + 9, Wd - 2, 3, S[0]); rect(ctx, ox + 1, oy + 12, Wd - 2, 1, S[2]);
  // estandartes en lo alto
  for (let x = 10; x < Wd - 6; x += 22) {
    rect(ctx, ox + x, oy - 4, 1, 13, OLB);
    paintRows(ctx, ['ccccc', 'cccc.', 'ccc..', 'cc...'], { c: col }, ox + x + 1, oy - 4);
  }
  // dos pisos de arcos
  const arches = (y, aw, ah, step) => {
    for (let x = 6; x + aw < Wd - 4; x += step) {
      rect(ctx, ox + x - 1, oy + y - 1, aw + 2, ah + 2, S[2]);
      rect(ctx, ox + x, oy + y + 3, aw, ah - 3, '#3a2e3e');
      rect(ctx, ox + x + 1, oy + y + 1, aw - 2, 2, '#3a2e3e'); rect(ctx, ox + x + 2, oy + y, aw - 4, 1, '#3a2e3e');
      rect(ctx, ox + x, oy + y + ah - 1, aw, 1, S[2]);
    }
  };
  arches(15, 8, 11, 14);
  rect(ctx, ox + 1, oy + 29, Wd - 2, 2, S[2]); rect(ctx, ox + 1, oy + 28, Wd - 2, 1, S[0]);
  arches(34, 10, 14, 16);
  // puerta principal
  const gx = ox + Wd / 2 - 13, gy = oy + Ht - 30;
  rect(ctx, gx - 2, gy - 2, 30, 32, S[2]);
  rect(ctx, gx, gy + 4, 26, 26, '#241a26');
  rect(ctx, gx + 3, gy, 20, 4, '#241a26'); rect(ctx, gx + 1, gy + 2, 24, 2, '#241a26');
  for (let x = 4; x < 26; x += 5) rect(ctx, gx + x, gy + 3, 1, 27, '#6a6470');
  for (let y = 9; y < 30; y += 6) rect(ctx, gx + 1, gy + y, 24, 1, '#6a6470');
  paintRows(ctx, ['kkkkkkkkk', 'kcccccccck', 'kccyyycck', 'kcccycccck', '.kcccccck.', '..kccck..', '...kck...'].map(r => r.slice(0, 9)), { k: OLB, c: col, y: '#f2ca52' }, gx + 8, gy - 12);
  rect(ctx, ox, oy + Ht - 4, Wd, 4, S[2]); rect(ctx, ox, oy + Ht - 1, Wd, 1, OLB);
}

function drawGate(ctx, ox, oy, wc, hc, o) {
  const Wd = wc * 16, Ht = hc * 16, S = o.stone || STONE.claro;
  const tower = (x, w) => {
    rect(ctx, ox + x, oy + 4, w, Ht - 4, S[1]);
    rect(ctx, ox + x, oy + 4, w, 1, OLB); rect(ctx, ox + x, oy + 4, 1, Ht - 4, OLB); rect(ctx, ox + x + w - 1, oy + 4, 1, Ht - 4, OLB);
    for (let cx = x; cx < x + w - 2; cx += 5) { rect(ctx, ox + cx, oy, 4, 4, S[0]); rect(ctx, ox + cx, oy - 1, 4, 1, OLB); }
    for (let y = 10; y < Ht - 4; y += 6) rect(ctx, ox + x + 1, oy + y, w - 2, 1, S[2]);
    rect(ctx, ox + x + w / 2 - 1, oy + 14, 2, 6, '#2a2230');
    rect(ctx, ox + x + 1, oy + 5, 1, Ht - 6, S[0]);
  };
  rect(ctx, ox + 12, oy + 14, Wd - 24, Ht - 14, S[1]);
  rect(ctx, ox + 12, oy + 14, Wd - 24, 1, OLB);
  for (let cx = 14; cx < Wd - 14; cx += 6) { rect(ctx, ox + cx, oy + 10, 4, 4, S[0]); rect(ctx, ox + cx, oy + 9, 4, 1, OLB); }
  for (let y = 20; y < Ht - 2; y += 6) rect(ctx, ox + 13, oy + y, Wd - 26, 1, S[2]);
  tower(0, 18); tower(Wd - 18, 18);
  const dw = 20, dx = ox + Wd / 2 - dw / 2, dy = oy + Ht - 26;
  rect(ctx, dx - 2, dy - 2, dw + 4, 28, S[2]);
  rect(ctx, dx, dy + 4, dw, 22, '#241a26'); rect(ctx, dx + 3, dy, dw - 6, 4, '#241a26'); rect(ctx, dx + 1, dy + 2, dw - 2, 2, '#241a26');
  if (o.portcullis) for (let x = 3; x < dw; x += 4) rect(ctx, dx + x, dy + 2, 1, 14, '#6a6470');
  if (o.color) { rect(ctx, ox + 5, oy + 22, 8, 12, o.color); rect(ctx, ox + Wd - 13, oy + 22, 8, 12, o.color); }
  rect(ctx, ox, oy + Ht - 1, Wd, 1, OLB);
}

function drawShip(ctx, ox, oy, wc, hc, o) {
  const Wd = wc * 16, sail = o.color || '#f4ecd8', flip = !!o.flip;
  const [c, x] = mkCanvas(Wd, hc * 16 + 40);
  const by = 40;
  // casco
  const hull = [[4, by + 10], [Wd - 16, by + 10], [Wd - 2, by + 4], [Wd - 10, by + 30], [12, by + 30], [2, by + 18]];
  const art = shapeArt(Wd, hc * 16 + 40, [
    { p: hull, c: ['#a86c3c', '#7c4c28', '#56331a'], lt: 0.6 },
    { r: [6, by + 2, 22, by + 11], c: ['#b87c48', '#8c5a32', '#643e20'] },
  ], '#2a1a10');
  x.drawImage(art, 0, 0);
  rect(x, 6, by + 15, Wd - 18, 2, '#e2b84a'); rect(x, 8, by + 21, Wd - 22, 1, '#56331a');
  for (let k = 20; k < Wd - 20; k += 12) rect(x, k, by + 17, 3, 3, '#2a1a10');
  // mástil y vela
  const mx = Math.floor(Wd / 2);
  rect(x, mx - 1, 2, 3, by + 9, '#4a2e18'); rect(x, mx, 2, 1, by + 9, '#8c5a32');
  rect(x, mx - 18, 8, 36, 1, '#4a2e18');
  rect(x, mx - 16, 9, 32, 24, '#3a2a20');
  rect(x, mx - 15, 9, 30, 23, sail);
  rect(x, mx - 15, 9, 30, 2, '#ffffff');
  for (let y = 14; y < 32; y += 6) rect(x, mx - 15, y, 30, 1, 'rgba(0,0,0,0.08)');
  if (o.mark) { rect(x, mx - 2, 13, 4, 16, o.mark); rect(x, mx - 8, 19, 16, 4, o.mark); }
  paintRows(x, ['kfff', 'kff.', 'kf..'], { k: '#4a2e18', f: o.flag || '#c23a3a' }, mx, 0);
  // espuma en la línea de flotación
  for (let k = 4; k < Wd - 4; k += 3) px(x, k, by + 31, '#e6f2fc');
  ctx.save();
  if (flip) { ctx.translate(ox * 2 + Wd, 0); ctx.scale(-1, 1); }
  ctx.drawImage(c, ox, oy - 40);
  ctx.restore();
}

function drawStall(ctx, ox, oy, o) {
  const col = o.color || '#c23a3a', OL = '#3a2414';
  rect(ctx, ox + 2, oy + 8, 2, 22, OL); rect(ctx, ox + 28, oy + 8, 2, 22, OL);
  for (let x = 0; x < 32; x++) {
    const c = Math.floor(x / 4) % 2 ? '#f6eedc' : col;
    rect(ctx, ox + x, oy + 2, 1, 9, c);
    if ((x % 4) < 2) px(ctx, ox + x, oy + 11, c);
  }
  rect(ctx, ox, oy + 1, 32, 1, OL); rect(ctx, ox, oy + 2, 1, 9, OL); rect(ctx, ox + 31, oy + 2, 1, 9, OL);
  rect(ctx, ox + 1, oy + 18, 30, 11, OL);
  rect(ctx, ox + 2, oy + 19, 28, 9, '#b07a46'); rect(ctx, ox + 2, oy + 19, 28, 2, '#d0a06a');
  const goods = o.goods || ['#e8a030', '#c23a3a', '#7ab040', '#f2d060'];
  for (let i = 0; i < 6; i++) {
    const gx = ox + 4 + i * 4 + (i % 2), gc = goods[i % goods.length];
    rect(ctx, gx, oy + 15, 4, 4, OL); rect(ctx, gx + 1, oy + 15, 2, 3, gc); px(ctx, gx + 1, oy + 15, '#ffffff');
  }
  rect(ctx, ox + 2, oy + 30, 28, 2, 'rgba(40,30,10,0.25)');
}

function drawWindmill(ctx, ox, oy) {
  const OL = '#3a3030';
  for (let y = 18; y < 46; y++) {
    const half = 6 + Math.floor((y - 18) / 7);
    rect(ctx, ox + 16 - half, oy + y, half * 2, 1, y % 9 === 0 ? '#e2dcd2' : '#f6f2ea');
    px(ctx, ox + 16 - half, oy + y, OL); px(ctx, ox + 16 + half - 1, oy + y, OL);
    px(ctx, ox + 16 + half - 2, oy + y, '#d6cec0');
  }
  rect(ctx, ox + 6, oy + 46, 20, 1, OL);
  rect(ctx, ox + 13, oy + 36, 6, 10, '#6a4428'); rect(ctx, ox + 13, oy + 35, 6, 1, OL);
  rect(ctx, ox + 15, oy + 25, 3, 4, '#2e2a3a');
  for (let y = 8; y < 19; y++) { const half = Math.max(1, Math.floor((y - 7) * 0.75) + 1); rect(ctx, ox + 16 - half, oy + y, half * 2, 1, y < 12 ? '#8a5040' : '#6a3a2e'); }
  rect(ctx, ox + 8, oy + 18, 16, 1, OL);
  const cx = ox + 16, cy = oy + 14;
  for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    for (let i = 2; i < 15; i++) {
      px(ctx, cx + dx * i, cy + dy * i, '#5a4030');
      if (i > 4) { px(ctx, cx + dx * i + dx, cy + dy * i, '#efe4cc'); px(ctx, cx + dx * i, cy + dy * i + dy, '#d8ccb2'); }
    }
  }
  rect(ctx, cx - 1, cy - 1, 3, 3, '#3a2a20');
}

function drawFountain(ctx, ox, oy, o = {}) {
  const S = o.stone || STONE.gris;
  ctx.drawImage(shapeArt(32, 32, [
    { e: [16, 18, 14.5, 11], c: S, noise: 81 },
    { e: [16, 17.5, 11.5, 8], c: [GP.waterL, GP.water, GP.waterD], lt: 0.6 },
    { r: [14, 6, 18, 18], c: S },
    { e: [16, 6, 4, 2.4], c: S },
  ], '#3a3632', x => { px(x, 15, 3, '#cfe5fb'); px(x, 16, 2, '#ffffff'); px(x, 17, 3, '#cfe5fb'); for (const [a, b] of [[10, 16], [21, 19], [13, 21]]) px(x, a, b, '#cfe5fb'); }), ox, oy);
}

function drawTower(ctx, ox, oy, wc, hc, o) {
  const Wd = wc * 16, Ht = hc * 16, S = o.stone || STONE.claro;
  const top = o.roof || o.spire ? 12 : 4;
  rect(ctx, ox + 2, oy + top, Wd - 4, Ht - top, S[1]);
  rect(ctx, ox + 2, oy + top, 3, Ht - top, S[0]); rect(ctx, ox + Wd - 6, oy + top, 4, Ht - top, S[2]);
  rect(ctx, ox + 2, oy + top, 1, Ht - top, OLB); rect(ctx, ox + Wd - 3, oy + top, 1, Ht - top, OLB);
  for (let y = top + 8; y < Ht - 2; y += 8) rect(ctx, ox + 3, oy + y, Wd - 6, 1, S[2]);
  if (o.spire) {
    const sh = o.spire, R = o.roof || ['#7aa88a', '#5a8a6a', '#3a6a4a'];
    for (let y = 0; y < sh; y++) {
      const half = Math.max(1, Math.floor((y + 1) * (Wd / 2 - 3) / sh));
      rect(ctx, ox + Wd / 2 - half, oy + 12 - sh + y, half * 2, 1, y % 4 === 3 ? R[2] : R[1]);
      px(ctx, ox + Wd / 2 - half, oy + 12 - sh + y, OLB); px(ctx, ox + Wd / 2 + half - 1, oy + 12 - sh + y, OLB);
      if (y % 4 === 1) px(ctx, ox + Wd / 2 - half + 1, oy + 12 - sh + y, R[0]);
    }
    rect(ctx, ox + 1, oy + 12, Wd - 2, 1, OLB);
    rect(ctx, ox + Wd / 2 - 1, oy + 12 - sh - 4, 2, 4, '#e8c050');
  } else if (o.roof) {
    for (let y = 0; y < 13; y++) { const half = Math.floor(y * (Wd / 2) / 13) + 1; rect(ctx, ox + Wd / 2 - half, oy + y, half * 2, 1, y % 3 ? o.roof[1] : o.roof[2]); }
    rect(ctx, ox + 1, oy + 12, Wd - 2, 1, OLB);
  } else {
    for (let cx = 2; cx < Wd - 3; cx += 6) { rect(ctx, ox + cx, oy, 4, 4, S[0]); rect(ctx, ox + cx, oy - 1, 4, 1, OLB); rect(ctx, ox + cx, oy, 1, 4, OLB); }
  }
  const win = (y, big) => {
    const w = big ? 8 : 3, h = big ? 10 : 6, x = ox + Wd / 2 - w / 2;
    rect(ctx, x, oy + y + 2, w, h - 2, '#2a2230'); rect(ctx, x + 1, oy + y, w - 2, 2, '#2a2230');
  };
  if (o.style === 'campanile') { win(top + 4, true); win(top + 22, false); win(top + 36, false); }
  else { win(top + 6, false); win(top + 20, false); if (Ht > 56) win(top + 36, false); }
  if (o.color) { rect(ctx, ox + Wd / 2 - 1, oy - 10 + (o.roof ? 0 : 0), 1, 10, OLB); paintRows(ctx, ['cccc', 'ccc.', 'cc..'], { c: o.color }, ox + Wd / 2, oy - 10); }
  rect(ctx, ox + 2, oy + Ht - 1, Wd - 4, 1, OLB);
}

function drawDome(ctx, ox, oy) {
  // la cúpula de la catedral de Florencia
  const Wd = 64;
  rect(ctx, ox + 4, oy + 40, Wd - 8, 24, '#f2ece0');
  for (let x = 4; x < Wd - 4; x += 6) rect(ctx, ox + x, oy + 40, 2, 24, '#5e8a6a');
  rect(ctx, ox + 4, oy + 48, Wd - 8, 2, '#c87a5a');
  rect(ctx, ox + 4, oy + 40, Wd - 8, 1, OLB); rect(ctx, ox + 4, oy + 40, 1, 24, OLB); rect(ctx, ox + Wd - 5, oy + 40, 1, 24, OLB);
  for (let x = 10; x < Wd - 10; x += 10) { rect(ctx, ox + x, oy + 53, 5, 8, '#2a2230'); rect(ctx, ox + x + 1, oy + 52, 3, 1, '#2a2230'); }
  ctx.drawImage(shapeArt(Wd, 44, [{ e: [32, 42, 24, 32], c: ['#e48a62', '#c0603e', '#8c4028'], noise: 91 }], '#4a2216', x => {
    for (const k of [-16, -8, 0, 8, 16]) for (let y = 12; y < 42; y++) { const w = Math.sqrt(Math.max(0, 1 - ((y - 42) / 32) ** 2)) * 24; const X = Math.round(32 + k * w / 24); px(x, X, y, '#f6f0e4'); }
    rect(x, 8, 41, 48, 3, '#f6f0e4');
  }), ox, oy);
  rect(ctx, ox + 27, oy + 2, 10, 10, '#f6f0e4'); rect(ctx, ox + 27, oy + 2, 10, 1, OLB);
  rect(ctx, ox + 29, oy + 4, 2, 6, '#2a2230'); rect(ctx, ox + 33, oy + 4, 2, 6, '#2a2230');
  rect(ctx, ox + 30, oy - 4, 4, 6, '#f6f0e4'); rect(ctx, ox + 31, oy - 8, 2, 4, '#d8b04a');
}

function drawBanner(ctx, ox, oy, o = {}) {
  const col = o.color || '#c23a3a';
  rect(ctx, ox + 7, oy, 2, 32, OLB); rect(ctx, ox + 7, oy, 1, 32, '#8c6a4a');
  rect(ctx, ox + 2, oy + 2, 12, 1, OLB);
  paintRows(ctx, ['kccccccccck', 'kccccccccck', 'kccyyyyyccck', 'kccyccccyck', 'kccyyyyyccck', 'kccccccccck', 'kccccccccck', 'kccccccccck', '.kcccccccck', '..kcccccck', '...kccccck', '....kcck'].map(r => r.slice(0, 11)), { k: OLB, c: col, y: o.mark || '#f2ca52' }, ox + 2, oy + 3);
  rect(ctx, ox + 5, oy + 31, 6, 1, 'rgba(40,30,10,0.3)');
}

function drawTent(ctx, ox, oy, o = {}) {
  const col = o.color || '#6a3a2e';
  ctx.drawImage(shapeArt(32, 32, [
    { p: [[16, 4], [31, 26], [1, 26]], c: [col, '#4a2a20', '#2e1a14'], lt: 0.3 },
    { p: [[16, 8], [21, 26], [11, 26]], c: ['#2a1a14', '#1a100c', '#100806'] },
  ], '#1a0e0a', x => { for (let y = 10; y < 26; y += 4) for (let X = 2; X < 30; X++) { const d = x.getImageData(X, y, 1, 1).data; if (d[3] && d[0] > 60) px(x, X, y, '#e2b84a'); } }), ox, oy);
  rect(ctx, ox + 2, oy + 27, 28, 2, 'rgba(40,30,10,0.25)');
}

function drawGondola(ctx, ox, oy) {
  const OL = '#101014';
  for (let x = 2; x < 46; x++) {
    const t = (x - 24) / 22, h = Math.round(5 - t * t * 4), lift = Math.round(t * t * t * t * 6);
    rect(ctx, ox + x, oy + 6 - lift, 1, h + 2, '#1c1c24');
    px(ctx, ox + x, oy + 6 - lift, '#4a4a58');
  }
  rect(ctx, ox + 18, oy + 3, 10, 3, '#6a2a3a'); rect(ctx, ox + 18, oy + 2, 10, 1, OL);
  rect(ctx, ox + 44, oy - 4, 2, 6, '#c8c8d4');
  rect(ctx, ox + 3, oy + 14, 40, 1, 'rgba(255,255,255,0.35)');
}

// Letrero colgante sobre la puerta (posada, tienda, armero, puerto)
function drawHangSign(ctx, x, y, icon) {
  const OL = '#3c2414';
  rect(ctx, x, y, 12, 1, OL); rect(ctx, x + 11, y, 1, 3, OL);
  rect(ctx, x + 1, y + 3, 12, 10, OL); rect(ctx, x + 2, y + 4, 10, 8, '#e8c88a');
  const icons = {
    bed: ['..........', '.w........', '.wbbbbbbb.', '.wbbbbbbb.', '.wwwwwwwww', '.w.......w'],
    bag: ['...kk.....', '....k.....', '..yyyy....', '.yyyyyy...', '.yyyyyy...', '..yyyy....'],
    sword: ['......s...', '.....s....', '....s.....', '.k.s......', '..k.......', '.k.k......'],
    anchor: ['....k.....', '...kkk....', '....k.....', '.k..k..k..', '..kkkkk...', '..........'],
  };
  paintRows(ctx, icons[icon] || icons.bag, { w: '#6a4428', b: '#c23a3a', k: '#3a3a44', y: '#d8a020', s: '#e4e8f0' }, x + 3, y + 5);
}

// ─── Más casillas: abeto y viñedo ─────────────────────────────────────────
function drawFir(ctx, ox, oy, seed = 0) {
  for (let y = 27; y < 32; y++) for (let x = 1; x < 15; x++) if (((x - 8) / 7) ** 2 + ((y - 29.5) / 2) ** 2 <= 1) px(ctx, ox + x, oy - 16 + y + 0, 'rgba(20,40,20,0.25)');
  const g = ['#4f8a52', '#346a3e', '#22482c'];
  const art = shapeArt(16, 32, [
    { r: [7, 24, 8.6, 30], c: ['#8a6448', '#6a4a34', '#4a3424'] },
    { p: [[8, 13], [15.5, 25], [0.5, 25]], c: g, noise: 17 + seed, lt: 0.3 },
    { p: [[8, 6], [14, 18], [2, 18]], c: g, noise: 19 + seed, lt: 0.3 },
    { p: [[8, 0], [12.5, 11], [3.5, 11]], c: g, noise: 23 + seed, lt: 0.3 },
  ], '#16301c');
  ctx.drawImage(art, ox, oy - 16);
}
function drawVine(ctx, ox, oy, tx, ty) {
  const OL = '#3a2a14';
  rect(ctx, ox, oy + 12, 16, 3, 'rgba(60,50,20,0.25)');
  for (const x of [1, 14]) { rect(ctx, ox + x, oy + 1, 2, 13, OL); rect(ctx, ox + x, oy + 1, 1, 13, '#8a6a40'); }
  rect(ctx, ox, oy + 4, 16, 1, '#6a5030');
  for (let k = 0; k < 5; k++) {
    const x = ox + 1 + k * 3, y = oy + 3 + (k % 2);
    ctx.drawImage(shapeArt(6, 7, [{ e: [3, 3.5, 2.8, 3.2], c: ['#86b448', '#5e8c34', '#3e6624'], noise: 5 + k }], '#24401a'), x - 1, y);
  }
  for (let k = 0; k < 3; k++) {
    if (hash2(tx, ty, k + 500) < 0.35) continue;
    const x = ox + 3 + k * 4, y = oy + 9;
    rect(ctx, x, y, 3, 2, '#6a2a6a'); px(ctx, x + 1, y + 2, '#4a1a4a'); px(ctx, x, y, '#a85aa8');
  }
}

// ─── Más objetos: mástil, gradas, trono, cofre, barca ─────────────────────
function drawMast(ctx, ox, oy, o = {}) {
  const OL = '#2e1c10';
  rect(ctx, ox + 6, oy - 52, 4, 66, OL); rect(ctx, ox + 7, oy - 52, 2, 66, '#8c5a32'); rect(ctx, ox + 7, oy - 52, 1, 66, '#b07a46');
  rect(ctx, ox - 14, oy - 44, 44, 2, OL);
  const sail = o.color || '#f4ecd8';
  rect(ctx, ox - 12, oy - 42, 40, 22, OL); rect(ctx, ox - 11, oy - 42, 38, 21, sail);
  rect(ctx, ox - 11, oy - 42, 38, 2, '#ffffff');
  for (let y = -36; y < -21; y += 5) rect(ctx, ox - 11, oy + y, 38, 1, 'rgba(0,0,0,0.08)');
  if (o.mark) { rect(ctx, ox + 6, oy - 39, 4, 15, o.mark); rect(ctx, ox, oy - 34, 16, 4, o.mark); }
  paintRows(ctx, ['kfff', 'kff.', 'kf..'], { k: OL, f: o.flag || '#c23a3a' }, ox + 9, oy - 58);
  for (let i = 0; i < 6; i++) { px(ctx, ox - 12 + i * 3, oy - 20 + i * 5, '#5a4030'); px(ctx, ox + 28 - i * 3, oy - 20 + i * 5, '#5a4030'); }
  rect(ctx, ox + 3, oy + 12, 10, 3, 'rgba(40,20,10,0.3)');
}
function drawStand(ctx, ox, oy, wc, o = {}) {
  // gradas con público (2 filas de alto)
  const Wd = wc * 16, S = o.stone || STONE.claro;
  rect(ctx, ox, oy, Wd, 32, S[2]);
  for (let r = 0; r < 3; r++) {
    const y = oy + 2 + r * 10;
    rect(ctx, ox, y + 7, Wd, 3, S[0]); rect(ctx, ox, y + 9, Wd, 1, S[2]);
    for (let x = 2; x < Wd - 3; x += 5) {
      if (hash2(x, r, ox) < 0.25) continue;
      const shirt = ['#c23a3a', '#3a70c0', '#3c9c72', '#d29c3a', '#8c5ca2', '#e8e4dc'][Math.floor(hash2(x, r, oy) * 6)];
      const skin = ['#f8d2aa', '#dba678', '#9a6240'][Math.floor(hash2(x, r + 9, oy) * 3)];
      const hair = ['#342a36', '#6c4528', '#e6be5c', '#b8b8c4'][Math.floor(hash2(x, r + 5, oy) * 4)];
      rect(ctx, x + ox, y + 3, 4, 4, shirt);
      rect(ctx, x + ox + 1, y, 2, 3, skin); rect(ctx, x + ox + 1, y - 1, 2, 1, hair);
    }
  }
  rect(ctx, ox, oy + 31, Wd, 1, OLB);
}
function drawThrone(ctx, ox, oy, o = {}) {
  const col = o.color || '#c23a3a', OL = '#3a2414';
  rect(ctx, ox + 2, oy - 10, 12, 24, OL);
  rect(ctx, ox + 3, oy - 9, 10, 22, '#c69456'); rect(ctx, ox + 4, oy - 8, 8, 12, col);
  rect(ctx, ox + 4, oy - 8, 8, 1, '#f2ca52');
  rect(ctx, ox + 1, oy + 5, 14, 3, OL); rect(ctx, ox + 2, oy + 5, 12, 2, col);
  rect(ctx, ox + 3, oy + 8, 2, 7, OL); rect(ctx, ox + 11, oy + 8, 2, 7, OL);
  rect(ctx, ox + 6, oy - 13, 4, 3, '#f2ca52');
}
function drawChest(ctx, ox, oy, o = {}) {
  const OL = '#2e1a0e';
  rect(ctx, ox + 1, oy + 4, 14, 11, OL);
  rect(ctx, ox + 2, oy + 5, 12, 9, o.color || '#8c5a32');
  rect(ctx, ox + 2, oy + 5, 12, 3, '#b07a46');
  rect(ctx, ox + 2, oy + 8, 12, 1, OL);
  for (const x of [4, 11]) rect(ctx, ox + x, oy + 5, 1, 9, '#c8a050');
  rect(ctx, ox + 7, oy + 8, 2, 3, '#f2ca52');
  rect(ctx, ox + 2, oy + 15, 12, 1, 'rgba(30,20,10,0.3)');
}
function drawBoat(ctx, ox, oy) {
  const OL = '#2e1c10';
  for (let x = 1; x < 31; x++) {
    const t = (x - 16) / 15, h = Math.round(6 - t * t * 4);
    rect(ctx, ox + x, oy + 6, 1, h, '#8c5a32');
    px(ctx, ox + x, oy + 6, '#b07a46'); px(ctx, ox + x, oy + 6 + h, OL);
  }
  rect(ctx, ox + 8, oy + 8, 1, 3, OL); rect(ctx, ox + 22, oy + 8, 1, 3, OL);
  rect(ctx, ox + 12, oy + 4, 9, 1, '#6a4428'); rect(ctx, ox + 3, oy + 13, 26, 1, 'rgba(255,255,255,0.35)');
}

// Borda del barco (casco de madera alrededor de la cubierta)
function hullTile(ctx, ox, oy, tx, ty, wat) {
  const Wd = GP.wood;
  rect(ctx, ox, oy, 16, 16, Wd.d);
  for (let y = 5; y < 16; y += 4) rect(ctx, ox, oy + y, 16, 1, Wd.ol);
  for (let x = 3; x < 16; x += 8) rect(ctx, ox + x, oy + 3, 2, 13, Wd.b);
  rect(ctx, ox, oy, 16, 3, Wd.l); rect(ctx, ox, oy + 3, 16, 1, Wd.ol);
  if (wat.n) rect(ctx, ox, oy, 16, 1, Wd.ol);
  if (wat.s) { rect(ctx, ox, oy + 14, 16, 2, Wd.ol); for (let x = 1; x < 16; x += 3) px(ctx, ox + x, oy + 15, '#e6f2fc'); }
  if (wat.w) rect(ctx, ox, oy, 1, 16, Wd.ol);
  if (wat.e) rect(ctx, ox + 15, oy, 1, 16, Wd.ol);
}
