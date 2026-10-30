// ─── Mundo: mapa, movimiento por casillas, personajes y menú ─────────────
const BLOCK = 'TCFR~WMPQrXYVK';
const WALK_MS = 240;

// Casillas: . hierba · , matorral · = camino · s arena · * flores · ~ agua · # empedrado
//           T olivo (2×2) · C ciprés · P palmera · Q palmera en la arena · F valla · R roca · r roca en la arena
//           W muralla · M roca de montaña · B puente · D tablones · X caja · Y abeto · V viña · K borda
function renderMap(def, g) {
  setTheme(def.theme);
  const mw = g[0].length, mh = g.length;
  const [c, x] = mkCanvas(mw * T, mh * T);
  const at = (i, j) => (i < 0 || j < 0 || i >= mw || j >= mh ? null : g[j][i]);
  const n4 = (i, j, test) => ({ n: test(at(i, j - 1)), s: test(at(i, j + 1)), w: test(at(i - 1, j)), e: test(at(i + 1, j)) });
  for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
    const ch = g[j][i], ox = i * T, oy = j * T;
    if (DIRT(ch) || ch === 'Q' || ch === 'r') {
      const nb = {};
      for (const [k, dx, dy] of [['n', 0, -1], ['s', 0, 1], ['w', -1, 0], ['e', 1, 0], ['nw', -1, -1], ['ne', 1, -1], ['sw', -1, 1], ['se', 1, 1]]) {
        const v = at(i + dx, j + dy);
        nb[k] = v !== null && GRASSY(v);
      }
      dirtTile(x, ox, oy, i, j, nb, ch === '=' ? GP.dirt : GP.sand);
    } else if (ch === '~') {
      const nb = {};
      for (const [k, dx, dy] of [['n', 0, -1], ['s', 0, 1], ['w', -1, 0], ['e', 1, 0]]) {
        const v = at(i + dx, j + dy);
        nb[k] = v !== null && v !== '~' && v !== 'B' ? groundCol(v) : false;
      }
      waterTile(x, ox, oy, i, j, nb);
    } else if (ch === ',') tallGrass(x, ox, oy);
    else if (ch === '*') flowers(x, ox, oy, i, j);
    else if (ch === '#') cobbleTile(x, ox, oy, i, j);
    else if (ch === 'W') wallTile(x, ox, oy, i, j, n4(i, j, v => v !== 'W'));
    else if (ch === 'M') cliffTile(x, ox, oy, i, j, n4(i, j, v => v !== null && v !== 'M'));
    else if (ch === 'D' || ch === 'X') deckTile(x, ox, oy, i, j);
    else if (ch === 'K') hullTile(x, ox, oy, i, j, n4(i, j, v => v === '~' || v === null));
    else if (ch === 'B') bridgeTile(x, ox, oy, i, j, n4(i, j, v => v === '~'));
    else if (ch === 'V') { grassBase(x, ox, oy, i, j); drawVine(x, ox, oy, i, j); }
    else grassBase(x, ox, oy, i, j);
  }
  for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
    const ch = g[j][i];
    if (ch === 'F') drawFence(x, i * T, j * T, { n: at(i, j - 1) === 'F', s: at(i, j + 1) === 'F', w: at(i - 1, j) === 'F', e: at(i + 1, j) === 'F' });
    if (ch === 'R' || ch === 'r') drawRock(x, i * T, j * T);
    if (ch === 'X') drawCrate(x, i * T, j * T);
  }
  for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
    const ch = g[j][i];
    if (ch === 'T' && i % 2 === 0 && j % 2 === 0) drawOlive(x, i * T, j * T, i * 7 + j * 13);
    if (ch === 'C' && at(i, j - 1) !== 'C') drawCypress(x, i * T, j * T);
    if (ch === 'P' || ch === 'Q') drawPalm(x, i * T, j * T, i * 5 + j * 3);
    if (ch === 'Y') drawFir(x, i * T, j * T, i * 3 + j);
  }
  // los objetos que aparecen o desaparecen (cond) se dibujan aparte, en cada fotograma
  for (const o of def.objects || []) if (!o.cond) drawObj(x, o, o.x * T, o.y * T);
  return c;
}
function drawObj(x, o, ox, oy) {
  if (o.type === 'house') drawHouse(x, ox, oy, o.w, o.h, Object.assign({}, o.o, { door: doorCols(o)[0] ?? 2 }));
  else if (o.type === 'well') drawWell(x, ox, oy);
  else if (o.type === 'sign') drawSign(x, ox, oy);
  else if (o.type === 'dummy') drawDummy(x, ox, oy);
  else if (o.type === 'barrel') drawBarrel(x, ox, oy);
  else if (o.type === 'barricade') drawBarricade(x, ox, oy);
  else if (o.type === 'coliseo') drawColiseo(x, ox, oy, o.w, o.h, o.o || {});
  else if (o.type === 'gate') drawGate(x, ox, oy, o.w, o.h, o.o || {});
  else if (o.type === 'ship') drawShip(x, ox, oy, o.w, o.h, o.o || {});
  else if (o.type === 'stall') drawStall(x, ox, oy, o.o || {});
  else if (o.type === 'windmill') drawWindmill(x, ox, oy);
  else if (o.type === 'fountain') drawFountain(x, ox, oy, o.o || {});
  else if (o.type === 'tower') drawTower(x, ox, oy, o.w, o.h, o.o || {});
  else if (o.type === 'dome') drawDome(x, ox, oy);
  else if (o.type === 'banner') drawBanner(x, ox, oy, o.o || {});
  else if (o.type === 'tent') drawTent(x, ox, oy, o.o || {});
  else if (o.type === 'gondola') drawGondola(x, ox, oy);
  else if (o.type === 'mast') drawMast(x, ox, oy, o.o || {});
  else if (o.type === 'stand') drawStand(x, ox, oy, o.w, o.o || {});
  else if (o.type === 'throne') drawThrone(x, ox, oy, o.o || {});
  else if (o.type === 'chest') drawChest(x, ox, oy, o.o || {});
  else if (o.type === 'boat') drawBoat(x, ox, oy);
  else if (o.type === 'brunnen') drawBrunnen(x, ox, oy);
  else if (o.type === 'plank') drawPlank(x, ox, oy);
  else if (o.type === 'chesstable') drawChessTable(x, ox, oy);
}
// Puerta de un edificio: columna(s) de la puerta en su fila de abajo
function doorCols(o) {
  const d = o.door !== undefined ? o.door : o.o && o.o.door;
  return d === undefined ? [] : Array.isArray(d) ? d : [d];
}
function doorAt(o, x, y) {
  if (!o || y !== o.y + (o.h || 1) - 1) return false;
  const cols = doorCols(o);
  return cols.some(c => x === o.x + c);
}

class Ent {
  constructor(def) {
    this.def = def; this.id = def.id;
    this.x = def.x; this.y = def.y; this.dir = def.dir || 'down';
    this.px = this.x * T; this.py = this.y * T;
    this.moving = false; this.mt = 0; this.step = 0; this.speed = 1;
    this.home = { x: def.x, y: def.y }; this.wt = 1000 + Math.random() * 2000; this.alpha = 1;
  }
  get look() { return typeof this.def.look === 'function' ? this.def.look() : this.def.look; }
  frame() {
    const b = DIR_ROW[this.dir];
    if (this.moving && this.mt < 0.5) return b + (this.step % 2 ? 1 : 2);
    return b;
  }
}

class WorldScene {
  constructor() {
    this.ui = new UI(); this.busy = false; this.ents = []; this.cam = { x: 0, y: 0 };
    this.banner = { y: -30, text: '' }; this.cache = {}; this.turnT = 0; this.bumpT = 0; this.bubbleEnt = null; this.lastTall = false;
  }

  // ── carga del mapa ──
  load(mapId, x, y, dir) {
    const def = MAPS[mapId];
    this.def = def; this.mapId = mapId;
    setTheme(def.theme);
    if (!this.cache[mapId]) { const g = def.build(); this.cache[mapId] = { g, canvas: renderMap(def, g) }; }
    this.grid = this.cache[mapId].g; this.canvas = this.cache[mapId].canvas;
    this.mw = this.grid[0].length; this.mh = this.grid.length;
    this.objs = {};
    for (const o of def.objects || []) {
      if (o.cond && !o.cond()) continue;
      const w = o.w || 1, h = o.h || 1;
      // o.walk: casillas del objeto por las que se puede pasar (el arco de una puerta de la muralla)
      const free = new Set((o.walk || []).map(([a, b]) => a + ',' + b));
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (!free.has(i + ',' + j)) this.objs[(o.x + i) + ',' + (o.y + j)] = o;
    }
    this.player = new Ent({ id: 'player', look: () => playerLook(), x, y, dir });
    this.ents = [this.player];
    for (const n of def.npcs || []) if (!n.cond || n.cond()) this.ents.push(new Ent(n));
    this.items = (def.items || []).filter(it => !S0().flags['item_' + it.id]);
    const s = S0(); s.map = mapId; s.x = x; s.y = y; s.dir = dir;
    this.showBanner(def.name);
    if (Pasos.native) Pasos.onResume();
    this.snapCam();
  }
  showBanner(name) {
    const text = tr(name);
    this.banner.text = text; this.banner.y = -30;
    tween(this.banner, { y: 4 }, 250).then(() => wait(1700)).then(() => { if (this.banner.text === text) tween(this.banner, { y: -30 }, 250); });
  }
  snapCam() {
    const p = this.player;
    this.cam.x = clamp(p.px + 8 - W / 2, 0, Math.max(0, this.mw * T - W));
    this.cam.y = clamp(p.py + 8 - H / 2, 0, Math.max(0, this.mh * T - H));
  }

  // ── consultas ──
  tile(x, y) { return x < 0 || y < 0 || x >= this.mw || y >= this.mh ? null : this.grid[y][x]; }
  objAt(x, y) { return this.objs[x + ',' + y]; }
  itemAt(x, y) { return this.items.find(i => i.x === x && i.y === y); }
  entAt(x, y, ignore) {
    return this.ents.find(e => e !== ignore && !e.gone && ((e.x === x && e.y === y) || (e.moving && e.tx === x && e.ty === y)));
  }
  blocked(x, y, ignore) {
    const c = this.tile(x, y);
    if (c === null || BLOCK.includes(c)) return true;
    if (this.objAt(x, y) || this.itemAt(x, y)) return true;
    return !!this.entAt(x, y, ignore);
  }
  npc(id) { return this.ents.find(e => e.id === id); }
  flag(k, v) { const f = S0().flags; if (v === undefined) return !!f[k]; f[k] = v; return v; }

  // ── movimiento ──
  move(e, dir, speed = 1) {
    const [dx, dy] = DV[dir];
    e.dir = dir; e.tx = e.x + dx; e.ty = e.y + dy; e.moving = true; e.mt = 0; e.speed = speed;
    return new Promise(r => (e.arrive = r));
  }
  updateEnt(e, dt) {
    if (!e.moving) return;
    e.mt += dt * e.speed / WALK_MS;
    const k = Math.min(1, e.mt);
    e.px = (e.x + (e.tx - e.x) * k) * T; e.py = (e.y + (e.ty - e.y) * k) * T;
    if (e.mt >= 1) {
      e.x = e.tx; e.y = e.ty; e.px = e.x * T; e.py = e.y * T; e.moving = false; e.step++;
      if (e === this.player) this.onStep();
      const a = e.arrive; e.arrive = null; if (a) a();
    }
  }

  // ── bucle ──
  update(dt) {
    this.ui.update(dt);
    for (const e of this.ents) this.updateEnt(e, dt);
    if (!this.busy && !this.ui.busy) this.updatePlayer(dt);
    if (!this.busy && !this.ui.busy) for (const e of this.ents) if (e.def.wander) this.wander(e, dt);
    if (Pasos.native) {
      this.syncT = (this.syncT || 0) + dt;
      if (this.syncT > 60000) { this.syncT = 0; Pasos.onResume(); }
      if (Pasos.pending && !this.busy && !this.ui.busy && !this.player.moving) {
        const res = Pasos.pending; Pasos.pending = null;
        this.runScript(W => W.showWalkResult(res));
      }
    }
    if (this.bumpT > 0) this.bumpT -= dt;
    const p = this.player;
    const tx = clamp(p.px + 8 - W / 2, 0, Math.max(0, this.mw * T - W));
    const ty = clamp(p.py + 8 - H / 2, 0, Math.max(0, this.mh * T - H));
    this.cam.x = tx; this.cam.y = ty;
  }
  updatePlayer(dt) {
    const p = this.player;
    if (p.moving) return;
    if (Input.hit('start')) { this.runScript(W => W.openMenu()); return; }
    if (Input.hit('a')) { this.interact(); return; }
    const d = Input.dir();
    if (!d) { this.turnT = 0; return; }
    if (d !== p.dir) { p.dir = d; this.turnT = 70; return; }
    if (this.turnT > 0) { this.turnT -= dt; return; }
    const [dx, dy] = DV[d];
    const nx = p.x + dx, ny = p.y + dy;
    const ex = (this.def.exits || []).find(e => e.x === p.x && e.y === p.y && e.dir === d);
    if (ex) { this.runScript(W => W.warp(ex.to)); return; }
    if (nx < 0 || ny < 0 || nx >= this.mw || ny >= this.mh) {
      const c = this.def.conn && this.def.conn[d];
      if (c) this.runScript(W => W.changeMap(c, d));
      else this.bump();
      return;
    }
    if (this.blocked(nx, ny, p)) {
      const o = this.objAt(nx, ny);
      if ((d === 'up' || (o && o.side === d)) && doorAt(o, nx, ny) && (o.enter || o.run)) { this.runScript(W => W.useDoor(o)); return; }
      this.bump(); return;
    }
    this.move(p, d, Input.down('b') ? 2 : 1);
  }
  bump() { if (this.bumpT <= 0) { Sfx.play('bump'); this.bumpT = 320; } }

  wander(e, dt) {
    if (e.moving) return;
    e.wt -= dt;
    if (e.wt > 0) return;
    e.wt = 1400 + Math.random() * 2600;
    const d = pick(DIRS);
    const [dx, dy] = DV[d];
    const nx = e.x + dx, ny = e.y + dy, r = e.def.wander;
    if (Math.abs(nx - e.home.x) > r || Math.abs(ny - e.home.y) > r) { e.dir = d; return; }
    if (this.blocked(nx, ny, e) || this.tile(nx, ny) === ',') { e.dir = d; return; }
    this.move(e, d, 1);
  }

  onStep() {
    const p = this.player, s = S0();
    s.x = p.x; s.y = p.y; s.dir = p.dir; s.steps++;
    for (const tr of this.def.triggers || []) {
      if (tr.x === p.x && tr.y === p.y && (!tr.cond || tr.cond())) { this.runScript(tr.run); return; }
    }
    if (this.checkTrainers()) return;
    const on = this.def.wildOn || ',';
    if (this.def.wild && on.includes(this.tile(p.x, p.y)) && Math.random() < (this.def.wildRate || 0.1)) this.runScript(W => W.wildBattle());
  }

  checkTrainers() {
    const p = this.player;
    for (const e of this.ents) {
      const tr = e.def.trainer;
      if (!tr || this.flag(tr.flag) || e.gone) continue;
      const [dx, dy] = DV[e.dir];
      for (let i = 1; i <= tr.range; i++) {
        const x = e.x + dx * i, y = e.y + dy * i;
        if (p.x === x && p.y === y) {
          this.runScript(async W => {
            W.bubble(e); Sfx.play('alert');
            await W.wait(800); W.bubble(null);
            await W.walkNextTo(e, p);
            await e.def.talk(W, e);
          });
          return true;
        }
        const c = this.tile(x, y);
        if (c === null || BLOCK.includes(c) || this.objAt(x, y) || this.entAt(x, y, p)) break;
      }
    }
    return false;
  }

  interact() {
    const p = this.player;
    const [dx, dy] = DV[p.dir];
    const x = p.x + dx, y = p.y + dy;
    const e = this.ents.find(n => n !== p && !n.gone && n.x === x && n.y === y && !n.moving);
    if (e) {
      this.runScript(async W => {
        e.dir = OPP[p.dir];
        if (e.def.talk) await e.def.talk(W, e);
        else if (e.def.text) await W.say(e.def.text);
      });
      return;
    }
    const it = this.itemAt(x, y);
    if (it) {
      this.runScript(async W => {
        W.items = W.items.filter(i => i !== it);
        W.flag('item_' + it.id, true);
        W.give(it.item, it.n);
        Sfx.play('item');
        await W.say(t('w_found', { q: itemQty(it.item, it.n) }), { color: 'blue' });
      });
      return;
    }
    const o = this.objAt(x, y);
    if (o) {
      if (doorAt(o, x, y) && (o.enter || o.run)) { this.runScript(W => W.useDoor(o)); return; }
      if (o.run && !doorCols(o).length) { this.runScript(W => o.run(W)); return; }
      let text = null;
      if (o.type === 'house') { if (doorAt(o, x, y)) text = o.doorText || o.door_; }
      else text = typeof o.text === 'function' ? o.text() : o.text;
      if (text) this.runScript(async W => { await W.say(text); });
    }
  }

  async runScript(fn) {
    if (this.busy) return;
    this.busy = true;
    try { await fn(this); } catch (err) { console.error(err); }
    this.busy = false;
  }

  // ── API para guiones ──
  say(t, o) { return this.ui.say(t, o); }
  ask(t, opts, o) { return this.ui.ask(t, opts, o); }
  wait(ms) { return wait(ms); }
  bubble(e) { this.bubbleEnt = e; }
  heal() { healPlayer(); }
  give(item, n = 1) { const it = S0().items; it[item] = (it[item] || 0) + n; }
  dirTo(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }
  faceEachOther(a, b) { a.dir = this.dirTo(a, b); b.dir = this.dirTo(b, a); }
  async walk(e, dir, n = 1) {
    for (let i = 0; i < n; i++) {
      const [dx, dy] = DV[dir];
      if (this.blocked(e.x + dx, e.y + dy, e)) { e.dir = dir; return; }
      await this.move(e, dir, 1);
    }
  }
  path(e, tx, ty) {
    const key = (x, y) => x + ',' + y;
    const prev = new Map([[key(e.x, e.y), null]]);
    const q = [[e.x, e.y]];
    while (q.length) {
      const [x, y] = q.shift();
      if (x === tx && y === ty) break;
      for (const d of DIRS) {
        const [dx, dy] = DV[d], nx = x + dx, ny = y + dy, k = key(nx, ny);
        if (prev.has(k)) continue;
        if (!(nx === tx && ny === ty) && this.blocked(nx, ny, e)) continue;
        if (nx === tx && ny === ty && this.blocked(nx, ny, e)) continue;
        prev.set(k, [x, y, d]); q.push([nx, ny]);
      }
    }
    if (!prev.has(key(tx, ty))) return null;
    const dirs = [];
    let cur = key(tx, ty);
    while (prev.get(cur)) { const [px2, py2, d] = prev.get(cur); dirs.unshift(d); cur = key(px2, py2); }
    return dirs;
  }
  async walkTo(e, tx, ty) {
    const dirs = this.path(e, tx, ty);
    if (!dirs) return;
    for (const d of dirs) await this.move(e, d, 1);
  }
  async walkNextTo(e, target) {
    let best = null;
    for (const d of DIRS) {
      const [dx, dy] = DV[d], x = target.x + dx, y = target.y + dy;
      if (x === e.x && y === e.y) return;
      if (this.blocked(x, y, e)) continue;
      const dirs = this.path(e, x, y);
      if (dirs && (!best || dirs.length < best.length)) best = dirs;
    }
    if (best) for (const d of best) await this.move(e, d, 1);
  }
  async fadeNpc(e) { await tween(e, { alpha: 0 }, 300, Ease.lin); e.gone = true; }
  spawn(def) { const e = new Ent(def); this.ents.push(e); return e; }
  async face(e, dir) { e.dir = dir; await wait(120); }

  // Entrar por una puerta, o pasar de un mapa a otro sin cruzar el borde
  async useDoor(o) {
    if (o.locked && o.locked()) { Sfx.play('bump'); await this.say(typeof o.lockedText === 'function' ? o.lockedText() : o.lockedText); return; }
    if (o.run) { await o.run(this, o); return; }
    if (o.enter) await this.warp(o.enter);
  }
  async warp(to, silent) {
    if (!silent) Sfx.play('door');
    await Game.fadeOut(220);
    this.load(to.map, to.x, to.y, to.dir || 'down');
    Game.save();
    await Game.fadeIn(220);
    await this.runEnter();
  }
  async runEnter() {
    const f = this.def.onEnter;
    if (f) await f(this);
  }

  // Posada: cura y guarda el sitio donde despertarás si caes en combate
  async inn(name) {
    await this.say(name ? { es: name.es + ': ¡Bienvenid{o} a la posada! ¿Quieres descansar? Es gratis para quien lucha en los coliseos.', fr: name.fr + ' : Bienvenue à l\'auberge ! Tu veux te reposer ? C\'est gratuit pour qui combat dans les colisées.' } : t('inn_q'));
    const r = await this.ask(t('inn_ask'), [t('yes'), t('no')]);
    if (r !== 0) { await this.say(t('inn_bye')); return; }
    await Game.fadeOut(300);
    healPlayer();
    Sfx.play('heal');
    await wait(700);
    S0().respawn = { map: this.mapId, x: this.player.x, y: this.player.y, dir: 'down' };
    await Game.fadeIn(300);
    await this.say(t('w_recoverAll'));
    await this.say(t('inn_saved'), { color: 'blue' });
    Game.save();
  }

  // Tienda: objetos de curación y equipo
  async shop(stock, who) {
    if (who) await this.say(who);
    for (;;) {
      const s = S0(), e = s.equip || {};
      const opts = stock.map(id => {
        if (ITEMS[id]) return `${tr(ITEMS[id].name)}  ${ITEMS[id].price}`;
        const q = EQUIP[id], have = e[q.slot] === id;
        return `${tr(q.name)}  ${have ? t('shop_have') : q.price}`;
      }).concat([t('shop_exit')]);
      const r = await this.ui.choose(opts, { y: 4, x: 4, cancel: opts.length - 1 });
      if (r === opts.length - 1) { await this.say(t('shop_bye')); return; }
      const id = stock[r];
      if (ITEMS[id]) {
        const it = ITEMS[id];
        const max = Math.floor(s.ducados / it.price);
        if (max < 1) { Sfx.play('bump'); await this.say(t('shop_poor')); continue; }
        const qs = [1, 5, 10].filter(n => n <= max);
        const k = await this.ask(t('shop_howMany', { i: tr(it.name), d: s.ducados }), qs.map(n => '×' + n + '  ' + n * it.price).concat([t('no')]));
        if (k >= qs.length) continue;
        const n = qs[k];
        s.ducados -= n * it.price;
        s.items[id] = (s.items[id] || 0) + n;
        Sfx.play('coin');
        await this.say(t('shop_bought', { q: itemQty(id, n) }));
      } else {
        const q = EQUIP[id], cur = e[q.slot];
        if (cur === id) { await this.say(t('shop_already')); continue; }
        const stat = q.slot === 'arma' ? 'atk' : 'def';
        const now = equipBonus(cur, stat);
        if (now >= q[stat]) { await this.say(t('shop_worse', { i: tr(EQUIP[cur].name) })); continue; }
        const desc = q.slot === 'arma' ? t('shop_atk', { v: q.atk }) : t('shop_def', { v: q.def });
        const k = await this.ask(t('shop_equipQ', { i: tr(q.name), x: desc, p: q.price }), [t('yes'), t('no')]);
        if (k !== 0) continue;
        if (s.ducados < q.price) { Sfx.play('bump'); await this.say(t('shop_poor')); continue; }
        s.ducados -= q.price;
        s.equip = Object.assign({}, e, { [q.slot]: id });
        Sfx.play('item');
        await this.say(t('shop_equipped', { i: tr(q.name) }), { color: 'blue' });
      }
      Game.save();
    }
  }
  // Sube directamente hasta el nivel L (si aún no lo tiene) y aprende las técnicas por el camino
  async levelTo(L) {
    const p = P();
    if (p.level >= L) return false;
    const events = gainXp(xpFor(L) - p.xp);
    healPlayer();
    Sfx.play('level');
    await this.say(t('w_levelTo', { v: p.level }), { color: 'blue' });
    for (const ev of events) for (const l of ev.learned) {
      if (l.full) await learnWithChoice(this.ui, l.m, txt => this.say(txt));
      else { Sfx.play('item'); await this.say(t('b_learn', { n: p.name, m: moveName(l.m) }), { color: 'blue' }); }
    }
    return true;
  }
  async learnMove(m) {
    const p = P();
    if (p.moves.find(x => x.id === m)) return;
    if (p.moves.length < 4) { p.moves.push({ id: m, pp: MOVES[m].pp }); Sfx.play('item'); await this.say(t('b_learn', { n: p.name, m: moveName(m) }), { color: 'blue' }); return; }
    await learnWithChoice(this.ui, m, txt => this.say(txt));
  }
  giveEquip(id, evenIfEqual) {
    const s = S0(), q = EQUIP[id], e = s.equip || {};
    const stat = q.slot === 'arma' ? 'atk' : 'def', cur = equipBonus(e[q.slot], stat);
    if (cur < q[stat] || (evenIfEqual && cur <= q[stat])) s.equip = Object.assign({}, e, { [q.slot]: id });
  }
  async receive(item, n = 1) {
    this.give(item, n);
    Sfx.play('item');
    await this.say(t('w_receive', { q: itemQty(item, n) }), { color: 'blue' });
  }
  async gold(v) {
    S0().ducados += v;
    Sfx.play('coin');
    await this.say(t('w_gold', { v }), { color: 'blue' });
  }
  async blason(key, name) {
    if (this.flag('blason_' + key)) return;
    this.flag('blason_' + key, true);
    S0().blasones = (S0().blasones || 0) + 1;
    Sfx.play('win');
    await this.say(t('w_crest', { b: tr(name) }), { color: 'blue' });
  }

  // Viaje en barco: pantalla del trayecto y llegada a puerto
  async sail(to, label) {
    Sfx.play('select');
    await Game.fadeOut(300);
    const st = { t: 0 };
    const voyage = this.ui.panel(ctx => drawVoyage(ctx, st, label), dt => { st.t += dt; return st.t > 2600 ? true : undefined; });
    Game.fadeA = 0;
    await voyage;
    await Game.fadeOut(200);
    this.load(to.map, to.x, to.y, to.dir || 'down');
    Game.save();
    await Game.fadeIn(300);
    await this.runEnter();
  }
  async changeMap(c, d) {
    await Game.fadeOut(220);
    const p = this.player;
    let nx = p.x + (c.dx || 0), ny = p.y + (c.dy || 0);
    const target = MAPS[c.map];
    if (!this.cache[c.map]) { const g = target.build(); this.cache[c.map] = { g, canvas: renderMap(target, g) }; }
    const g = this.cache[c.map].g;
    if (d === 'up') ny = g.length - 1;
    if (d === 'down') ny = 0;
    if (d === 'left') nx = g[0].length - 1;
    if (d === 'right') nx = 0;
    this.load(c.map, nx, ny, d);
    Game.save();
    await Game.fadeIn(220);
    await this.runEnter();
  }
  async battle(spec) {
    const res = await Game.battle(spec);
    if (res === 'lose' && !spec.canLose) await this.onLose();
    else Game.save();
    return res;
  }
  async wildBattle() {
    const table = this.def.wild;
    if (!table || !table.length) return;
    let r = Math.random() * table.reduce((a, b) => a + b.w, 0);
    let pickE = table[0];
    for (const t of table) { if ((r -= t.w) < 0) { pickE = t; break; } }
    await this.battle({ foe: pickE.id, level: randInt(pickE.lv[0], pickE.lv[1]), canFlee: true, canLose: false });
  }
  async onLose() {
    const s = S0();
    s.ducados = Math.floor(s.ducados / 2);
    healPlayer();
    const rp = s.respawn;
    if (rp && MAPS[rp.map] && rp.map !== 'villaolivo') {
      this.load(rp.map, rp.x, rp.y, rp.dir || 'down');
      Game.fadeA = 1;
      await Game.fadeIn(500);
      await this.say(t('w_wakeInn'));
    } else {
      this.load('villaolivo', 5, 17, 'down');
      Game.fadeA = 1;
      await Game.fadeIn(500);
      const m = this.npc('madre');
      if (m) { m.dir = 'right'; this.player.dir = 'left'; }
      await this.say(t('w_wake'));
    }
    await this.say(t('w_lostGold'));
    Game.save();
  }

  // ── dibujo ──
  draw(ctx) {
    rect(ctx, 0, 0, W, H, '#0a0810');
    const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y);
    ctx.drawImage(this.canvas, -cx, -cy);
    for (const o of this.def.objects || []) if (o.cond && o.cond()) drawObj(ctx, o, o.x * T - cx, o.y * T - cy);
    for (const it of this.items) drawSack(ctx, it.x * T - cx, it.y * T - cy);
    const list = this.ents.filter(e => !e.gone).sort((a, b) => a.py - b.py || (a === this.player ? 1 : -1));
    for (const e of list) {
      ctx.globalAlpha = e.alpha;
      drawChar(ctx, e.look, e.frame(), e.px - cx, e.py - 8 - cy);
      ctx.globalAlpha = 1;
      const gx = Math.round(e.px / T), gy = Math.round(e.py / T);
      if (this.tile(gx, gy) === ',') tallGrass(ctx, gx * T - cx, gy * T - cy, true);
    }
    if (this.bubbleEnt) drawBubble(ctx, this.bubbleEnt.px - cx + 4, this.bubbleEnt.py - cy - 22);
    if (this.banner.y > -30) {
      const bw = Font.width(this.banner.text) + 24;
      drawBox(ctx, 4, Math.round(this.banner.y), bw, 22);
      Font.draw(ctx, this.banner.text, 16, Math.round(this.banner.y) + 4, 'dark');
    }
    this.ui.draw(ctx);
  }

  // ── menú de pausa ──
  async openMenu() {
    Sfx.play('select');
    let idx = 0;
    for (;;) {
      const opts = [t('m_status'), t('m_items'), t('m_walk'), t('m_save'), t('m_code'), Sfx.on ? t('m_soundOn') : t('m_soundOff'), t('m_lang'), t('m_close')];
      const r = await this.ui.choose(opts, { y: 4, idx, cancel: 7 });
      idx = r;
      if (r === 0) await this.statusScreen();
      else if (r === 1) await this.itemsScreen();
      else if (r === 2) await this.walkScreen();
      else if (r === 3) { if (await this.saveGame()) break; }
      else if (r === 4) { Game.save(); Sfx.play('select'); await codeDialog('export', SaveCode.make(S0())); }
      else if (r === 5) { Sfx.on = !Sfx.on; Sfx.play('select'); }
      else if (r === 6) {
        const l = await this.ui.choose(['ESPAÑOL', 'FRANÇAIS'], { y: 4, idx: Lang.cur === 'fr' ? 1 : 0, cancel: null });
        Lang.set(l === 1 ? 'fr' : 'es');
        this.showBanner(this.def.name);
      }
      else break;
    }
  }

  statusScreen() {
    const st = { page: 0 };
    return this.ui.panel(ctx => (st.page ? drawGear(ctx) : drawStatus(ctx)), () => {
      if (Input.hit('a') || Input.hit('right') || Input.hit('left')) { st.page ^= 1; Sfx.play('blip'); }
      if (Input.hit('b')) { Sfx.play('back'); return true; }
      return undefined;
    });
  }

  async itemsScreen() {
    for (;;) {
      const it = S0().items;
      const ids = Object.keys(ITEMS).filter(k => (it[k] || 0) > 0);
      if (!ids.length) { await this.say(t('b_noItems')); return; }
      const opts = ids.map(k => `${tr(ITEMS[k].name)} ×${it[k]}`).concat([t('back')]);
      const r = await this.ui.choose(opts, { y: 4, cancel: opts.length - 1 });
      if (r === opts.length - 1) return;
      const id = ids[r];
      const ans = await this.ask(t('w_useQ', { t: tr(ITEMS[id].txt) }), [t('use'), t('no')]);
      if (ans !== 0) continue;
      const p = P();
      if (p.hp >= p.maxHp) { await this.say(t('b_fullHp')); continue; }
      const before = p.hp;
      p.hp = Math.min(p.maxHp, p.hp + ITEMS[id].heal);
      it[id]--;
      Sfx.play('heal');
      await this.say(t('w_recovered', { v: p.hp - before }));
    }
  }

  walkScreen() {
    const st = { msg: '', t: 0, busy: false };
    if (Pasos.native) Pasos.refreshState();
    return this.ui.panel(ctx => drawWalk(ctx, st), (dt) => {
      st.t += dt;
      if (st.busy) return undefined;
      if (Input.hit('a')) {
        if (!Pasos.native) {
          S0().km += 1;
          st.msg = claimWalkRewards(); st.t = 0;
          Sfx.play('coin');
        } else if (Pasos.available) {
          st.busy = true;
          (async () => {
            if (!Pasos.granted) await Pasos.askPermission();
            if (Pasos.granted) {
              const res = await Pasos.sync();
              if (res && res.first) st.msg = t('k_on');
              else if (res && res.km > 0) { st.msg = '+' + kmFmt(res.km) + ' km' + (res.rewards ? ' · ' + res.rewards : ''); Sfx.play('coin'); }
              else st.msg = '+0,0 km';
              st.t = 0;
            }
            st.busy = false;
          })();
        }
      }
      if (Input.hit('b')) { Sfx.play('back'); return true; }
      return undefined;
    });
  }

  async activateSteps() {
    await Pasos.refreshState();
    if (!Pasos.available) { await this.say(t('k_noSensor1') + ' ' + t('k_noSensor2')); return; }
    if (!Pasos.granted) await Pasos.askPermission();
    if (!Pasos.granted) { await this.say(t('k_denied')); return; }
    await Pasos.sync();
    Sfx.play('item');
    await this.say(t('k_ready'), { color: 'blue' });
  }

  async showWalkResult(res) {
    if (res.first) { await this.say(t('k_ready'), { color: 'blue' }); return; }
    if (res.km >= 0.05) {
      Sfx.play('coin');
      await this.say(t('k_reward', { v: kmFmt(res.km) }));
      if (res.rewards) await this.say(res.rewards, { color: 'blue' });
    }
    if (res.capped) await this.say(t('k_cap', { v: WALK.maxKmPerDay }));
  }

  async saveGame() {
    const r = await this.ask(t('w_saveQ'), [t('yes'), t('no')]);
    if (r !== 0) return false;
    const ok = Game.save();
    Sfx.play(ok ? 'item' : 'bump');
    await this.say(ok ? t('w_saved') : t('w_saveFail'));
    return ok;
  }
}

function drawStatus(ctx) {
  const p = P(), s = S0();
  drawBox(ctx, 0, 0, W, H);
  rect(ctx, 8, 8, 72, 96, '#efe1bd');
  rect(ctx, 8, 8, 72, 1, '#c99a46'); rect(ctx, 8, 103, 72, 1, '#c99a46');
  for (let y = -3; y <= 3; y++) for (let x = -22; x <= 22; x++) if ((x / 22) ** 2 + (y / 3.5) ** 2 <= 1) px(ctx, 44 + x, 94 + y, '#d6c39a');
  drawChar(ctx, playerLook(), 0, 20, 22, 3);
  Font.draw(ctx, p.name.toUpperCase(), 90, 8, 'dark');
  Font.draw(ctx, t('s_level', { v: p.level }), 90, 21, 'blue');
  Font.drawRight(ctx, t('s_max', { v: MAX_LV }), 230, 21, 'grey');
  Font.draw(ctx, 'PV', 90, 34, 'dark');
  drawHpBar(ctx, 108, 39, 82, p.hp / p.maxHp);
  Font.drawRight(ctx, `${p.hp}/${p.maxHp}`, 230, 34, 'dark');
  const ef = effStats();
  const rows = [[tr(STATNAME.atk), ef.atk, ef.atk - p.atk], [tr(STATNAME.def), ef.def, ef.def - p.def], [tr(STATNAME.spd), ef.spd, 0]];
  rows.forEach(([n, v, b], i) => {
    Font.draw(ctx, n, 90, 47 + i * 12, 'dark');
    Font.drawRight(ctx, String(v), 230, 47 + i * 12, 'dark');
    if (b) Font.drawRight(ctx, `+${b}`, 206, 47 + i * 12, 'blue');
  });
  const next = p.level >= MAX_LV ? 0 : xpFor(p.level + 1) - p.xp;
  Font.draw(ctx, 'EXP', 90, 84, 'dark'); Font.drawRight(ctx, String(p.xp), 230, 84, 'dark');
  Font.draw(ctx, t('s_next'), 90, 96, 'grey'); Font.drawRight(ctx, String(next), 230, 96, 'grey');
  rect(ctx, 8, 110, 224, 1, '#c99a46');
  p.moves.forEach((m, i) => {
    const x = 10 + (i % 2) * 114, y = 113 + Math.floor(i / 2) * 12;
    const mv = MOVES[m.id];
    Font.draw(ctx, moveLabel(m.id), x, y, 'dark');
    Font.drawRight(ctx, `${m.pp}/${mv.pp}`, x + 106, y, 'grey');
  });
  Font.draw(ctx, t('s_gold', { v: s.ducados }), 10, 140, 'dark');
  Font.drawRight(ctx, t('s_more'), 230, 140, 'grey');
}

// Títulos de las misiones secretas
const TITLES = [
  ['emblemaMatagigantes', { es: 'Matagigantes', fr: '{Tueur} de géants' }],
  ['caballeroInfierno', { es: '{Cab} del Infierno', fr: '{Cab} de l\'Enfer' }],
];
// Segunda página del estado: equipo y blasones
const CRESTS = [
  ['toledo', '#c23a3a', '#f2ca52', { es: 'TOLEDO', fr: 'TOLÈDE' }],
  ['fez', '#2e8a5a', '#f2ca52', { es: 'FEZ', fr: 'FÈS' }],
  ['genova', '#f4ece0', '#c23a3a', { es: 'GÉNOVA', fr: 'GÊNES' }],
  ['florencia', '#8a2a3a', '#f4ece0', { es: 'FLORENCIA', fr: 'FLORENCE' }],
  ['nuremberg', '#f2ca52', '#2a2a30', { es: 'NÚREMBERG', fr: 'NUREMBERG' }],
  ['londres', '#2a4aa0', '#f2ca52', '?'],
  ['montsaintmichel', '#4a6a9a', '#f4ece0', '?'],
  ['paris', '#2a3a8a', '#f2ca52', '?'],
];
function drawShield(ctx, x, y, c1, c2, on) {
  const pal = on ? { k: '#3a2414', a: c1, b: c2 } : { k: '#a8987c', a: '#e2d6b8', b: '#e2d6b8' };
  paintRows(ctx, ['kkkkkkkkkkkk', 'kaaaaabaaaak', 'kaaaaabaaaak', 'kaaaaabaaaak', 'kbbbbbbbbbbk', 'kaaaaabaaaak', 'kaaaaabaaaak', '.kaaaabaaak.', '..kaaabaak..', '...kaabak...', '....kkkk....'], pal, x, y);
}
function drawGear(ctx) {
  const s = S0(), e = s.equip || {};
  drawBox(ctx, 0, 0, W, H);
  Font.draw(ctx, t('s_gear'), 12, 7, 'dark');
  rect(ctx, 10, 21, 220, 1, '#c99a46');
  const wpn = EQUIP[e.arma || 'espada_corta'], arm = e.armadura ? EQUIP[e.armadura] : null;
  Font.draw(ctx, t('s_weapon'), 12, 26, 'grey');
  Font.draw(ctx, tr(wpn.name), 12, 38, 'dark');
  if (wpn.atk) Font.drawRight(ctx, t('shop_atk', { v: wpn.atk }), 228, 26, 'blue');
  Font.draw(ctx, t('s_armor'), 12, 52, 'grey');
  Font.draw(ctx, arm ? tr(arm.name) : t('s_none'), 12, 64, arm ? 'dark' : 'grey');
  if (arm) Font.drawRight(ctx, t('shop_def', { v: arm.def }), 228, 52, 'blue');
  rect(ctx, 10, 80, 220, 1, '#c99a46');
  Font.draw(ctx, t('s_crests', { v: s.blasones || 0 }), 12, 84, 'dark');
  CRESTS.forEach(([k, c1, c2], i) => {
    const x = 16 + i * 27, on = !!s.flags['blason_' + k];
    drawShield(ctx, x, 102, c1, c2, on);
  });
  const named = CRESTS.filter(([k]) => s.flags['blason_' + k]).map(c => tr(c[3]));
  let line = named.join(' · ');
  while (named.length > 1 && Font.width(line) > 216) { named.shift(); line = '… ' + named.join(' · '); }
  if (named.length) Font.draw(ctx, line, 12, 118, 'grey');
  const titles = TITLES.filter(([f]) => s.flags[f]).map(([, n]) => fmt(n));
  if (titles.length) Font.draw(ctx, t('s_titles', { v: titles.join(' · ') }), 12, 130, 'blue');
  Font.drawRight(ctx, t('k_back'), 228, 140, 'dark');
}

// Travesía en barco
function drawVoyage(ctx, st, label) {
  const k = clamp(st.t / 2400, 0, 1);
  const sky = ['#8cc8f0', '#a8d6f4', '#c4e4f6', '#dceff8'];
  sky.forEach((c, i) => rect(ctx, 0, i * 14, W, 14, c));
  rect(ctx, 0, 56, W, H - 56, '#3a7cc0');
  for (let y = 60; y < H; y += 7) for (let x = 0; x < W; x += 16) {
    const ox = (x + Math.floor(st.t / 40) + y * 3) % (W + 16) - 8;
    rect(ctx, ox, y, 6, 1, y % 14 ? '#5c9ad8' : '#8ac0f0');
  }
  rect(ctx, 0, 54, W, 2, '#6aa4dc');
  const bob = Math.round(Math.sin(st.t / 220) * 2);
  const sx = Math.round(-60 + k * (W + 40));
  drawShip(ctx, sx, 76 + bob, 4, 2, { color: '#f4ecd8', mark: '#c23a3a' });
  drawBox(ctx, 30, 120, 180, 30);
  Font.drawCenter(ctx, tr(label), 120, 128, 'dark');
}

function drawWalk(ctx, st) {
  const s = S0();
  drawBox(ctx, 0, 0, W, H);
  Font.draw(ctx, t('k_title'), 12, 7, 'dark');
  Font.drawRight(ctx, t('k_tag'), 228, 7, 'grey');
  rect(ctx, 10, 21, 220, 1, '#c99a46');
  Font.draw(ctx, t('k_walked'), 12, 26, 'dark');
  Font.draw(ctx, `${kmFmt(s.km)} km`, 12, 38, 'blue', 2);
  Font.draw(ctx, t('k_next', { v: s.kmClaimed + 1 }), 12, 62, 'grey');
  const rewards = [
    [t('k_r1'), t('k_ducats', { v: WALK.ducadosPerKm })],
    [t('k_r2', { v: WALK.hogazaEvery }), '+1 ' + tr(ITEMS.hogaza.name)],
    [t('k_r2', { v: WALK.unguentoEvery }), '+1 ' + tr(ITEMS.unguento.name)],
  ];
  rect(ctx, 98, 25, 132, 52, '#f3e8cc');
  rewards.forEach(([l, v], i) => { Font.draw(ctx, l, 101, 28 + i * 16, 'dark'); Font.drawRight(ctx, v, 227, 28 + i * 16, 'blue'); });
  rect(ctx, 10, 82, 220, 1, '#c99a46');
  let action = t('k_simulate');
  if (!Pasos.native) {
    Font.draw(ctx, t('k_web1'), 12, 86, 'dark');
    Font.draw(ctx, t('k_web2'), 12, 98, 'dark');
  } else if (!Pasos.checked) {
    Font.draw(ctx, '...', 12, 86, 'grey');
    action = '';
  } else if (!Pasos.available) {
    Font.draw(ctx, t('k_noSensor1'), 12, 86, 'red');
    Font.draw(ctx, t('k_noSensor2'), 12, 98, 'red');
    action = '';
  } else if (!Pasos.granted) {
    Font.draw(ctx, t('k_noPerm1'), 12, 86, 'red');
    Font.draw(ctx, t('k_noPerm2'), 12, 98, 'red');
    action = t('k_allow');
  } else {
    const w = s.walk || {};
    const dayKm = w.day === localDay() ? w.dayKm || 0 : 0;
    Font.draw(ctx, t('k_on'), 12, 86, 'blue');
    Font.draw(ctx, t('k_today', { a: kmFmt(dayKm), b: WALK.maxKmPerDay }), 12, 98, 'dark');
    Font.drawRight(ctx, t('k_steps', { v: w.total || 0 }), 228, 98, 'grey');
    action = t('k_refresh');
  }
  if (st.msg && st.t < 3000) {
    rect(ctx, 10, 113, 220, 14, '#e4f2d0');
    Font.drawCenter(ctx, st.msg, 120, 113, 'blue');
  }
  if (action) Font.draw(ctx, st.busy ? '...' : action, 12, 132, 'dark');
  Font.drawRight(ctx, t('k_back'), 228, 132, 'dark');
  Font.draw(ctx, t('k_gold', { v: s.ducados }), 12, 144, 'grey');
}
