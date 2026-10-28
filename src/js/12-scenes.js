// ─── Escenas: idioma, título, elección de personaje, nombre e introducción ─
class LangScene {
  constructor(next) { this.ui = new UI(); this.idx = Lang.cur === 'fr' ? 1 : 0; this.t = 0; this.next = next; this.done = false; }
  update(dt) {
    this.t += dt;
    if (this.done) return;
    if (Input.repeat('up') || Input.repeat('down') || Input.repeat('left') || Input.repeat('right')) { this.idx ^= 1; Sfx.play('blip'); }
    if (Input.hit('a') || Input.hit('start')) {
      this.done = true;
      Sfx.play('select');
      Lang.set(this.idx ? 'fr' : 'es');
      Game.fadeOut(250).then(() => { Game.set(this.next ? this.next() : new TitleScene()); Game.fadeIn(250); });
    }
  }
  draw(ctx) {
    rect(ctx, 0, 0, W, H, '#2a2238');
    for (let y = 0; y < H; y += 8) for (let x = (y / 8) % 2 * 8; x < W; x += 16) rect(ctx, x, y, 8, 8, '#30283f');
    drawCrown(ctx, 103, 10, 2);
    Font.drawCenter(ctx, 'ELIGE IDIOMA', 120, 32, 'gold');
    Font.drawCenter(ctx, 'CHOISIS TA LANGUE', 120, 46, 'light');
    const opts = [['ESPAÑOL', ['#c8202e', '#f6c400', '#c8202e'], [1, 2, 1]], ['FRANÇAIS', ['#1f3f9a', '#ffffff', '#d8283a'], null]];
    opts.forEach(([label, cols, rows], i) => {
      const sel = i === this.idx;
      const x = 22 + i * 102, y = sel ? 70 : 73;
      drawBox(ctx, x, y, 94, 62, sel ? 'parch' : 'dark');
      const fx = x + 27, fy = y + 10, fw = 40, fh = 26;
      rect(ctx, fx - 1, fy - 1, fw + 2, fh + 2, '#2a2131');
      if (rows) { let yy = fy; rows.forEach((r, k) => { const h = Math.round(fh * r / 4); rect(ctx, fx, yy, fw, h, cols[k]); yy += h; }); }
      else cols.forEach((c, k) => rect(ctx, fx + Math.round(k * fw / 3), fy, Math.round(fw / 3) + 1, fh, c));
      Font.drawCenter(ctx, label, x + 47, y + 42, sel ? 'dark' : 'light');
      if (sel) drawDownArrow(ctx, x + 44, y - 6 + (Math.floor(this.t / 300) % 2), '#f8d458');
    });
  }
}

class TitleScene {
  constructor() { this.bg = titleBg(); this.ui = new UI(); this.t = 0; this.phase = 'press'; this.hasSave = Save.exists(); }
  update(dt) {
    this.t += dt;
    this.ui.update(dt);
    if (this.phase === 'press' && this.t > 400 && (Input.hit('a') || Input.hit('start'))) {
      Sfx.play('select');
      this.phase = 'menu';
      this.menu();
    }
  }
  async menu() {
    const opts = [];
    if (this.hasSave) opts.push(['cont', t('cont')]);
    opts.push(['new', t('newGame')], ['lang', t('m_lang')]);
    const r = await this.ui.choose(opts.map(o => o[1]), { x: 70, y: 96, cancel: null });
    const pickK = opts[r][0];
    if (pickK === 'lang') {
      await Game.fadeOut(250);
      Game.set(new LangScene());
      await Game.fadeIn(250);
      return;
    }
    if (pickK === 'cont') {
      const st = Save.read();
      if (st && st.player) { await Game.fadeOut(300); startWorld(st, false); return; }
    }
    if (pickK === 'new' && this.hasSave) {
      const ok = await this.ui.ask(t('eraseQ'), [t('yes'), t('no')]);
      if (ok !== 0) { this.phase = 'press'; return; }
      Save.clear();
    }
    await Game.fadeOut(300);
    Game.set(new SelectScene());
    await Game.fadeIn(300);
  }
  draw(ctx) {
    ctx.drawImage(this.bg, 0, 0);
    for (let i = 0; i < 6; i++) {
      const tw = (Math.sin(this.t / 400 + i * 1.7) + 1) / 2;
      if (tw > 0.7) px(ctx, Math.floor(hash2(i, 7, 9) * W), Math.floor(hash2(i, 8, 9) * 50), '#ffffff');
    }
    drawCrown(ctx, 103, 5, 2);
    const outline = (str, y, s) => {
      const x = Math.round(120 - Font.width(str) * s / 2);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1], [2, 2], [1, 2], [2, 1]]) Font.draw(ctx, str, x + dx * s, y + dy * s, 'ink', s);
      Font.draw(ctx, str, x, y, 'gold', s);
    };
    outline(t('title1'), 20, 2);
    outline(t('title2'), 38, 3);
    if (this.phase === 'press' && Math.floor(this.t / 500) % 2 === 0) {
      const s = t('pressA');
      const w = Font.width(s) + 16;
      rect(ctx, 120 - w / 2, 103, w, 14, 'rgba(20,12,30,0.65)');
      Font.drawCenter(ctx, s, 120, 103, 'light');
    }
    Font.draw(ctx, t('proto'), 6, 146, 'dim');
    Font.drawRight(ctx, t('year'), 234, 146, 'dim');
    this.ui.draw(ctx);
  }
}

class SelectScene {
  constructor() {
    this.ui = new UI(); this.idx = 0; this.t = 0; this.busy = false;
    this.opts = [['m', 'light'], ['m', 'dark'], ['f', 'light'], ['f', 'dark']];
  }
  update(dt) {
    this.t += dt;
    this.ui.update(dt);
    if (this.busy || this.ui.busy) return;
    if (Input.repeat('left')) { this.idx = (this.idx + 3) % 4; Sfx.play('blip'); }
    if (Input.repeat('right')) { this.idx = (this.idx + 1) % 4; Sfx.play('blip'); }
    if (Input.repeat('up') || Input.repeat('down')) { this.idx ^= 1; Sfx.play('blip'); }
    if (Input.hit('a')) this.confirm();
    if (Input.hit('b')) { this.busy = true; Sfx.play('back'); Game.fadeOut(250).then(() => { Game.set(new TitleScene()); Game.fadeIn(250); }); }
  }
  async confirm() {
    this.busy = true;
    Sfx.play('select');
    const [g, s] = this.opts[this.idx];
    const r = await this.ui.ask(t(g === 'f' ? 'beF' : 'beM'), [t('yes'), t('no')]);
    if (r !== 0) { this.busy = false; return; }
    const name = await askName(g);
    Game.state = newState(name, g, s);
    await this.ui.say(t(g === 'f' ? 'welcomeF' : 'welcomeM', { n: name }));
    await Game.fadeOut(400);
    Game.set(new IntroScene());
    await Game.fadeIn(300);
  }
  draw(ctx) {
    rect(ctx, 0, 0, W, H, '#2a2238');
    for (let y = 0; y < H; y += 8) for (let x = (y / 8) % 2 * 8; x < W; x += 16) rect(ctx, x, y, 8, 8, '#30283f');
    Font.drawCenter(ctx, t('choose'), 120, 2, 'gold');
    this.opts.forEach(([g, s], i) => {
      const sel = i === this.idx;
      const x = 8 + i * 57, y = sel ? 21 : 24;
      drawBox(ctx, x, y, 54, 86, sel ? 'parch' : 'dark');
      const look = `player_${g}_${s}`;
      let frame = 0;
      if (sel) frame = [1, 0, 2, 0][Math.floor(this.t / 170) % 4];
      for (let yy = -2; yy <= 2; yy++) for (let xx = -13; xx <= 13; xx++) if ((xx / 13) ** 2 + (yy / 2.5) ** 2 <= 1) px(ctx, x + 27 + xx, y + 60 + yy, sel ? '#d6c39a' : '#3a3050');
      drawChar(ctx, look, frame, x + 11, y + 12, 2);
      Font.drawCenter(ctx, t(g === 'f' ? 'squireF' : 'squireM'), x + 27, y + 66, sel ? 'dark' : 'light');
      if (sel) drawDownArrow(ctx, x + 24, y - 5 + (Math.floor(this.t / 300) % 2), '#f8d458');
    });
    if (!this.ui.busy) {
      drawBox(ctx, 0, 112, 240, 48);
      const [g, s] = this.opts[this.idx];
      Font.draw(ctx, `${t(g === 'f' ? 'squireF' : 'squireM')} · ${t(s === 'light' ? 'skinLight' : 'skinDark')}`, 11, 119, 'dark');
      Font.draw(ctx, t('chooseHelp'), 11, 133, 'grey');
    }
    this.ui.draw(ctx);
  }
}

function askName(gender) {
  return new Promise(res => {
    const dlg = document.getElementById('nameDlg');
    const inp = document.getElementById('nameInput');
    const form = document.getElementById('nameForm');
    const fallback = gender === 'f' ? 'Inés' : 'Rodrigo';
    if (!dlg || !inp || !form) { res(fallback); return; }
    Lang.applyDom();
    dlg.hidden = false;
    inp.value = '';
    inp.placeholder = fallback;
    Input.locked = true;
    setTimeout(() => { try { inp.focus(); } catch (e) { /* ok */ } }, 60);
    const done = e => {
      e.preventDefault();
      let v = Array.from(inp.value.trim()).filter(ch => ch === ' ' || Font.glyphs[ch]).join('').replace(/\s+/g, ' ').slice(0, 10).trim();
      if (!v) v = fallback;
      dlg.hidden = true;
      Input.locked = false;
      Input.clear();
      form.removeEventListener('submit', done);
      try { inp.blur(); } catch (err) { /* ok */ }
      res(v);
    };
    form.addEventListener('submit', done);
  });
}

class IntroScene {
  constructor() { this.ui = new UI(); this.t = 0; this.run(); }
  async run() {
    await wait(300);
    const pages = [t('intro1'), t('intro2'), t('intro3'), t('intro4'), t('intro5', { n: P().name })];
    for (const p of pages) await this.ui.say(p, { x: 10, y: 62, w: 220, h: 56, perPage: 3, style: 'none', color: 'light', center: true });
    await Game.fadeOut(500);
    startWorld(Game.state, true);
  }
  update(dt) { this.t += dt; this.ui.update(dt); }
  draw(ctx) {
    rect(ctx, 0, 0, W, H, '#0e0b16');
    drawCrown(ctx, 103, 30, 2);
    this.ui.draw(ctx);
  }
}

function startWorld(state, isNew) {
  Game.state = migrateState(state);
  const w = new WorldScene();
  w.load(state.map, state.x, state.y, state.dir);
  Game.set(w);
  Game.fadeA = 1;
  Game.fadeIn(400);
  if (isNew && !state.flags.introDone) w.runScript(scriptIntroVillage);
  if (isNew) Game.save();
}
