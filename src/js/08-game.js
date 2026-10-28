// ─── Juego: escenas, fundidos, transición de combate, recursos ────────────
const Art = {
  chars: {},
  init() {
    for (const k in LOOKS) this.chars[k] = buildCharSheet(LOOKS[k]);
    this.boar = drawBoar();
    this.wolf = drawWolf();
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

// Fondo de combate: cielo, colinas con olivos y dos tarimas de hierba
function battleBg(kind = 'campo') {
  const [c, x] = mkCanvas(W, H);
  const sky = kind === 'aldea' ? ['#a8d8f4', '#bfe2f6', '#d4ecf7', '#e6f4f8'] : ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'];
  sky.forEach((col, i) => rect(x, 0, i * 12, W, 12, col));
  for (let y = 0; y < 48; y++) for (let X = 0; X < W; X++) {
    if ((X + y) % 2 === 0 && y % 12 === 11) px(x, X, y, sky[Math.min(3, Math.floor(y / 12) + 1)]);
  }
  for (let X = 0; X < W; X++) {
    const h1 = 44 + Math.round(Math.sin(X / 23) * 4 + Math.sin(X / 9) * 1.5);
    rect(x, X, h1, 1, 1, '#b4d890'); rect(x, X, h1 + 1, 1, 60, '#9cc97a');
    const h2 = 52 + Math.round(Math.sin(X / 31 + 2) * 3);
    rect(x, X, h2, 1, 60, '#8ebd6c');
  }
  for (let i = 0; i < 9; i++) {
    const ox = 10 + i * 27 + Math.round(hash2(i, 3, 1) * 8), oy = 46 + Math.round(hash2(i, 4, 1) * 6);
    for (let yy = -4; yy <= 3; yy++) for (let xx = -6; xx <= 6; xx++) if ((xx / 6) ** 2 + (yy / 4) ** 2 <= 1) px(x, ox + xx, oy + yy, yy < -1 ? '#8aae70' : '#76a05e');
    rect(x, ox, oy + 3, 1, 3, '#6a5a48');
  }
  rect(x, 0, 60, W, 52, '#c6e5a0');
  for (let y = 60; y < 112; y += 6) rect(x, 0, y, W, 1, '#bbdd94');
  const plat = (cx, cy, rx, ry) => {
    for (let y = -ry - 2; y <= ry + 2; y++) for (let X = -rx - 2; X <= rx + 2; X++) {
      const d = (X / rx) ** 2 + (y / ry) ** 2;
      if (d <= 1) px(x, cx + X, cy + y, y < -ry * 0.3 ? '#c6eb9e' : '#a8d47c');
      else if ((X / (rx + 2)) ** 2 + (y / (ry + 2)) ** 2 <= 1) px(x, cx + X, cy + y, '#76a84e');
    }
    for (let X = -rx + 6; X < rx - 6; X += 5) px(x, cx + X, cy + Math.round(hash2(X, cy, 2) * ry * 0.6), '#8cc062');
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
