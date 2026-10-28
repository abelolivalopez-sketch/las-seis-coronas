// ─── Juego: escenas, fundidos, transición de combate, recursos ────────────
const Art = {
  chars: {},
  init() {
    for (const k in LOOKS) this.chars[k] = buildCharSheet(LOOKS[k]);
    this.boar = drawBoar();
    this.wolf = drawWolf();
    this.jackal = drawJackal();
    this.lynx = drawLynx();
    this.bull = drawBull();
    this.viper = drawViper();
    this.scorpion = drawScorpion();
    this.macaque = drawMacaque();
    this.gull = drawGull();
    this.crab = drawCrab();
    this.goat = drawGoat(false);
    this.mouflon = drawGoat(true);
    this.bear = drawBear();
  },
};
function drawChar(ctx, look, frame, x, y, scale = 1) {
  const sh = Art.chars[look];
  if (!sh) return;
  ctx.drawImage(sh, frame * 16, 0, 16, 24, Math.round(x), Math.round(y), 16 * scale, 24 * scale);
}

const Game = {
  scene: null, state: null, fadeA: 0, flashA: 0, bars: 0,
  set(scene) { this.scene = scene; if (scene.enter) scene.enter(); },
  update(dt) { if (this.scene) this.scene.update(dt); },
  draw(ctx) {
    if (this.scene) this.scene.draw(ctx);
    if (this.bars > 0) {
      ctx.fillStyle = '#0a0810';
      for (let i = 0; i < 8; i++) {
        const w = Math.round(W * this.bars);
        ctx.fillRect(i % 2 ? W - w : 0, i * 20, w, 20);
      }
    }
    if (this.flashA > 0) { ctx.fillStyle = `rgba(255,255,255,${this.flashA})`; ctx.fillRect(0, 0, W, H); }
    if (this.fadeA > 0) { ctx.fillStyle = `rgba(10,8,16,${this.fadeA})`; ctx.fillRect(0, 0, W, H); }
  },
  fadeOut(ms = 250) { return tween(this, { fadeA: 1 }, ms, Ease.lin); },
  fadeIn(ms = 250) { return tween(this, { fadeA: 0 }, ms, Ease.lin); },
  async battleTransition() {
    Sfx.play('encounter');
    for (let i = 0; i < 3; i++) { this.flashA = 0.85; await tween(this, { flashA: 0 }, 110, Ease.lin); await wait(30); }
    this.bars = 0;
    await tween(this, { bars: 1 }, 420, Ease.in);
    this.fadeA = 1; this.bars = 0;
  },
  async battle(spec) {
    await this.battleTransition();
    const prev = this.scene;
    const b = new BattleScene(spec);
    this.set(b);
    await this.fadeIn(220);
    const res = await b.done;
    await this.fadeOut(320);
    this.set(prev);
    if (!(res === 'lose' && !spec.canLose)) await this.fadeIn(300);
    return res;
  },
  save() { if (this.state) return Save.write(this.state); return false; },
};

// Fondo de combate: cielo, paisaje lejano, suelo y dos tarimas. Cambia por región.
const BG = {
  campo: { sky: ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'], hill: ['#b4d890', '#9cc97a', '#8ebd6c'], ground: ['#c6e5a0', '#bbdd94'], plat: ['#c6eb9e', '#a8d47c', '#76a84e', '#8cc062'], deco: 'olive' },
  aldea: { sky: ['#a8d8f4', '#bfe2f6', '#d4ecf7', '#e6f4f8'], hill: ['#b4d890', '#9cc97a', '#8ebd6c'], ground: ['#c6e5a0', '#bbdd94'], plat: ['#c6eb9e', '#a8d47c', '#76a84e', '#8cc062'], deco: 'olive' },
  sierra: { sky: ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'], far: ['#a4a8b8', 'mount'], hill: ['#a8c47c', '#90b066', '#7ea058'], ground: ['#c4d894', '#b8ce86'], plat: ['#d2dc9e', '#b4c47c', '#86964e', '#a0b066'], deco: 'olive' },
  ciudad: { sky: ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'], far: ['#d8ccb2', 'walls'], hill: null, ground: ['#d2c6ae', '#c4b89e'], plat: ['#e8decb', '#d2c6ae', '#8f8268', '#b0a288'], deco: null },
  mancha: { sky: ['#8ccaf0', '#a8d8f4', '#c6e6f6', '#e0f2f8'], hill: ['#e2d088', '#d4bc6c', '#c8ae5a'], ground: ['#ead890', '#e0cc7c'], plat: ['#f2e2a0', '#dcc678', '#a8904a', '#c8b060'], deco: 'mill' },
  costa: { sky: ['#8ccaf0', '#a8d8f4', '#c6e6f6', '#e0f2f8'], far: ['#4a94dc', 'sea'], hill: null, ground: ['#f2e0b2', '#e8d4a0'], plat: ['#fcf2d4', '#f2e0b2', '#c8aa72', '#dbc390'], deco: 'palm' },
  barco: { sky: ['#8ccaf0', '#a8d8f4', '#c6e6f6', '#e0f2f8'], far: ['#3a7cc0', 'sea'], hill: null, ground: ['#b07a46', '#9c6a3c'], plat: ['#d0a06a', '#b07a46', '#5a3a1c', '#8c5a32'], deco: 'deck' },
  medina: { sky: ['#a0d4f2', '#bce0f4', '#d6ecf6', '#eef6f8'], far: ['#ebb87e', 'walls'], hill: null, ground: ['#e8c898', '#dcb884'], plat: ['#f6dcb0', '#e2c08a', '#a87c4a', '#c8a06a'], deco: 'palm' },
  rif: { sky: ['#9ccff0', '#b6dcf4', '#d0e8f6', '#e6f2f8'], far: ['#c08a5c', 'mount'], hill: ['#d2b070', '#c09c5c', '#ae8a4c'], ground: ['#dcc088', '#d0b27a'], plat: ['#ead0a0', '#d4b47a', '#a07a46', '#bc965c'], deco: 'fir' },
  valle: { sky: ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'], far: ['#c8a878', 'mount'], hill: ['#a8c870', '#94b45c', '#84a450'], ground: ['#c8dc94', '#bcd086'], plat: ['#d6e6a4', '#b8cc7c', '#86984e', '#a2b464'], deco: 'palm' },
  isla: { sky: ['#8ccaf0', '#a8d8f4', '#c6e6f6', '#e0f2f8'], far: ['#4a94dc', 'sea'], hill: ['#9cc878', '#86b464', '#78a456'], ground: ['#e6dcae', '#dcd09c'], plat: ['#f2ead0', '#e2d4a6', '#a89a6a', '#c8ba88'], deco: 'fir' },
  montana: { sky: ['#a4cfee', '#bcdaf2', '#d2e6f4', '#e6f0f6'], far: ['#8a96a8', 'mount'], hill: ['#6a9a5c', '#5a8a4e', '#4e7c44'], ground: ['#a8c88a', '#9cbe7e'], plat: ['#bcd8a0', '#9ebe82', '#6a8a52', '#86a66a'], deco: 'fir' },
  toscana: { sky: ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'], hill: ['#a8cc80', '#94bc6c', '#86ae60'], ground: ['#c2e09a', '#b6d68c'], plat: ['#d0e8a8', '#b0d084', '#7e9e56', '#98b86c'], deco: 'cypress' },
  laguna: { sky: ['#a8d4ee', '#bedef0', '#d4e8f2', '#e6f2f6'], far: ['#4f8fae', 'sea'], hill: null, ground: ['#b8cc94', '#aec288'], plat: ['#cadca8', '#b0c48a', '#7e905a', '#98aa72'], deco: 'reed' },
  coliseo: { sky: ['#8ccaf0', '#a8d8f4', '#c6e6f6', '#e0f2f8'], far: ['#c4b290', 'crowd'], hill: null, ground: ['#e6cfa0', '#dcc290'], plat: ['#f2dcb0', '#e2c48e', '#a88a5a', '#c8aa76'], deco: null },
  arsenal: { sky: ['#4a3e46', '#544650', '#5e4e58', '#685662'], far: ['#6a4a32', 'beams'], hill: null, ground: ['#8c6a4a', '#80603e'], plat: ['#a8845e', '#8c6a4a', '#4a3424', '#6e5238'], deco: null },
};
function battleBg(kind = 'campo') {
  const B = BG[kind] || BG.campo;
  const [c, x] = mkCanvas(W, H);
  B.sky.forEach((col, i) => rect(x, 0, i * 12, W, 12, col));
  for (let y = 0; y < 48; y++) for (let X = 0; X < W; X++) if ((X + y) % 2 === 0 && y % 12 === 11) px(x, X, y, B.sky[Math.min(3, Math.floor(y / 12) + 1)]);
  if (B.far) {
    const [fc, type] = B.far;
    if (type === 'mount') {
      for (let X = 0; X < W; X++) {
        const h = 26 + Math.round(Math.abs(Math.sin(X / 29)) * 14 + Math.sin(X / 7) * 2);
        rect(x, X, h, 1, 60 - h, fc);
        if (h < 32) px(x, X, h, '#f4f6fa');
      }
    } else if (type === 'sea') {
      rect(x, 0, 40, W, 22, fc);
      for (let y = 42; y < 60; y += 4) for (let X = (y * 7) % 13; X < W; X += 19) rect(x, X, y, 5, 1, '#b8dcf6');
    } else if (type === 'walls') {
      rect(x, 0, 30, W, 30, fc);
      for (let X = 0; X < W; X += 10) rect(x, X, 26, 6, 4, fc);
      for (let y = 34; y < 60; y += 6) rect(x, 0, y, W, 1, 'rgba(0,0,0,0.08)');
      for (const tx of [30, 120, 200]) { rect(x, tx, 14, 18, 20, fc); for (let X = tx; X < tx + 18; X += 6) rect(x, X, 10, 4, 4, fc); rect(x, tx + 7, 20, 3, 5, 'rgba(0,0,0,0.25)'); }
    } else if (type === 'crowd') {
      rect(x, 0, 24, W, 36, fc);
      for (let r = 0; r < 4; r++) for (let X = 2 + (r % 2) * 3; X < W; X += 6) {
        const col = ['#c23a3a', '#3a70c0', '#3c9c72', '#d29c3a', '#8c5ca2', '#e8e4dc'][Math.floor(hash2(X, r, 3) * 6)];
        rect(x, X, 27 + r * 8, 4, 4, col); rect(x, X + 1, 25 + r * 8, 2, 2, ['#f8d2aa', '#dba678', '#9a6240'][Math.floor(hash2(X, r, 5) * 3)]);
      }
      rect(x, 0, 58, W, 2, '#9e8c6a');
    } else if (type === 'beams') {
      rect(x, 0, 0, W, 60, '#3a2c26');
      for (let X = 10; X < W; X += 40) { rect(x, X, 0, 8, 60, fc); rect(x, X, 0, 2, 60, '#8a6a4a'); }
      rect(x, 0, 12, W, 6, fc);
      for (let X = 30; X < W; X += 70) { rect(x, X, 34, 12, 12, '#6a4a2a'); rect(x, X + 2, 36, 8, 8, '#f2c060'); }
    }
  }
  if (B.hill) {
    for (let X = 0; X < W; X++) {
      const h1 = 44 + Math.round(Math.sin(X / 23) * 4 + Math.sin(X / 9) * 1.5);
      rect(x, X, h1, 1, 1, B.hill[0]); rect(x, X, h1 + 1, 1, 60, B.hill[1]);
      const h2 = 52 + Math.round(Math.sin(X / 31 + 2) * 3);
      rect(x, X, h2, 1, 60, B.hill[2]);
    }
  }
  const deco = (i, ox, oy) => {
    if (B.deco === 'olive') {
      for (let yy = -4; yy <= 3; yy++) for (let xx = -6; xx <= 6; xx++) if ((xx / 6) ** 2 + (yy / 4) ** 2 <= 1) px(x, ox + xx, oy + yy, yy < -1 ? '#8aae70' : '#76a05e');
      rect(x, ox, oy + 3, 1, 3, '#6a5a48');
    } else if (B.deco === 'cypress') {
      for (let yy = -12; yy <= 3; yy++) { const w = Math.round(3 * Math.sin(Math.PI * (yy + 12) / 16)); rect(x, ox - w, oy + yy, w * 2 + 1, 1, yy < -4 ? '#4e7c44' : '#3e6a38'); }
    } else if (B.deco === 'fir') {
      for (let yy = -10; yy <= 3; yy++) { const w = Math.round((yy + 10) / 3); rect(x, ox - w, oy + yy, w * 2 + 1, 1, '#3e6a44'); }
      rect(x, ox, oy + 4, 1, 2, '#5a4030');
    } else if (B.deco === 'palm') {
      rect(x, ox, oy - 8, 1, 14, '#8a6a44');
      for (const [dx, dy] of [[-5, -9], [-3, -10], [3, -10], [5, -9], [-6, -7], [6, -7]]) rect(x, ox + Math.min(0, dx), oy + dy, Math.abs(dx), 1, '#5a9a44');
    } else if (B.deco === 'mill' && i % 4 === 1) {
      rect(x, ox - 3, oy - 10, 6, 14, '#f6f2ea'); rect(x, ox - 3, oy - 12, 6, 2, '#8a5040');
      for (let k = -6; k <= 6; k++) { px(x, ox + k, oy - 11 + k, '#6a5040'); px(x, ox + k, oy - 11 - k, '#6a5040'); }
    } else if (B.deco === 'reed') {
      for (let k = 0; k < 5; k++) rect(x, ox - 4 + k * 2, oy - 6 + (k % 2) * 2, 1, 8, '#8a9a4c');
    }
  };
  if (B.deco && B.deco !== 'deck') for (let i = 0; i < 9; i++) deco(i, 10 + i * 27 + Math.round(hash2(i, 3, 1) * 8), 46 + Math.round(hash2(i, 4, 1) * 6));
  rect(x, 0, 60, W, 52, B.ground[0]);
  for (let y = 60; y < 112; y += 6) rect(x, 0, y, W, 1, B.ground[1]);
  if (B.deco === 'deck') {
    for (let y = 60; y < 112; y += 7) { rect(x, 0, y, W, 1, '#7a4c28'); for (let X = (y * 13) % 40; X < W; X += 40) rect(x, X, y, 1, 7, '#7a4c28'); }
    rect(x, 0, 56, W, 4, '#5a3a1c'); for (let X = 4; X < W; X += 14) rect(x, X, 50, 3, 8, '#5a3a1c');
  }
  const P = B.plat;
  const plat = (cx, cy, rx, ry) => {
    for (let y = -ry - 2; y <= ry + 2; y++) for (let X = -rx - 2; X <= rx + 2; X++) {
      const d = (X / rx) ** 2 + (y / ry) ** 2;
      if (d <= 1) px(x, cx + X, cy + y, y < -ry * 0.3 ? P[0] : P[1]);
      else if ((X / (rx + 2)) ** 2 + (y / (ry + 2)) ** 2 <= 1) px(x, cx + X, cy + y, P[2]);
    }
    for (let X = -rx + 6; X < rx - 6; X += 5) px(x, cx + X, cy + Math.round(hash2(X, cy, 2) * ry * 0.6), P[3]);
  };
  plat(176, 56, 46, 9);
  plat(70, 122, 60, 14);
  return c;
}

// Fondo del título: atardecer, castillo en la colina, olivos
function titleBg() {
  const [c, x] = mkCanvas(W, H);
  const bands = ['#1d1735', '#261d44', '#33245a', '#4a2c66', '#6a366e', '#8e4470', '#b7566c', '#d8705e', '#ec9a5e', '#f6c27a'];
  bands.forEach((col, i) => rect(x, 0, i * 11, W, 11, col));
  rect(x, 0, 110, W, 50, bands[9]);
  for (let i = 0; i < bands.length - 1; i++) for (let X = 0; X < W; X += 2) px(x, X + (i % 2), i * 11 + 10, bands[i + 1]);
  for (let i = 0; i < 70; i++) {
    const sx = Math.floor(hash2(i, 1, 9) * W), sy = Math.floor(hash2(i, 2, 9) * 60);
    px(x, sx, sy, hash2(i, 3, 9) < 0.3 ? '#fff4c8' : '#c8c0e8');
  }
  for (let y = -16; y <= 16; y++) for (let X = -16; X <= 16; X++) if (X * X + y * y <= 256) px(x, 176 + X, 104 + y, y < -6 ? '#fbe08a' : '#f8cf6e');
  for (let X = 0; X < W; X++) {
    const h = 100 + Math.round(Math.sin(X / 37 + 1) * 6 + Math.sin(X / 13) * 2);
    rect(x, X, h, 1, H - h, '#4b2a50');
  }
  // castillo
  const C = '#2b1934';
  const castle = [[34, 70, 14, 34], [48, 80, 40, 24], [88, 66, 14, 38], [60, 74, 14, 10]];
  castle.forEach(([cx, cy, w, h]) => {
    rect(x, cx, cy, w, h, C);
    for (let bx = cx; bx < cx + w; bx += 4) rect(x, bx, cy - 3, 2, 3, C);
  });
  rect(x, 64, 88, 8, 16, '#1a0f22');
  for (const [wx, wy] of [[39, 78], [93, 74], [93, 84], [54, 88], [80, 88]]) rect(x, wx, wy, 2, 4, '#f6c060');
  rect(x, 94, 54, 1, 12, C);
  paintRows(x, ['rrrr', 'rrr.', 'rr..'], { r: '#d83a32' }, 95, 54);
  rect(x, 40, 60, 1, 10, C);
  paintRows(x, ['yyy.', 'yy..'], { y: '#f2c94c' }, 41, 60);
  // primer plano: colina y olivos
  for (let X = 0; X < W; X++) {
    const h = 124 + Math.round(Math.sin(X / 29) * 5 + Math.sin(X / 11 + 3) * 2);
    rect(x, X, h, 1, H - h, '#24152c');
  }
  for (const [ox, oy, s] of [[16, 118, 1], [138, 120, 1.2], [206, 114, 1.1], [226, 122, 0.8]]) {
    for (let yy = -8; yy <= 6; yy++) for (let xx = -12; xx <= 12; xx++) {
      const v = (xx / (11 * s)) ** 2 + (yy / (7 * s)) ** 2 + 0.25 * Math.sin(xx * 1.3) * Math.cos(yy);
      if (v <= 1) px(x, ox + xx, oy + yy, '#24152c');
    }
    rect(x, ox - 1, oy + 5, 3, 10, '#24152c');
  }
  return c;
}
