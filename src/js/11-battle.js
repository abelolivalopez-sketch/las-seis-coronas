// ─── Combate por turnos ───────────────────────────────────────────────────
const FOE_AT = { x: 176, y: 58 }, ME_AT = { x: 70, y: 124 };
const ART_ST = { es: { atk: 'el', def: 'la', spd: 'la' }, fr: { atk: "L'", def: 'La ', spd: 'La ' } };
const xpFrac = p => (p.level >= MAX_LV ? 1 : (p.xp - xpFor(p.level)) / (xpFor(p.level + 1) - xpFor(p.level)));
const moveLabel = id => { const n = moveName(id); return n.charAt(0) + n.slice(1).toLowerCase(); };

function calcDamage(att, def, mv) {
  const A = att.atk * stageMul(att.st.atk), D = Math.max(1, def.def * stageMul(def.st.def));
  let base = Math.floor(Math.floor(Math.floor(2 * att.level / 5 + 2) * mv.pow * A / D) / 50) + 2;
  const crit = Math.random() < 1 / 16;
  if (crit) base = Math.floor(base * 1.5);
  return { dmg: Math.max(1, Math.floor(base * randInt(85, 100) / 100)), crit };
}

class BattleScene {
  constructor(spec) {
    this.spec = spec;
    this.ui = new UI();
    const f = FOES[spec.foe];
    this.fdef = f;
    this.foe = makeFoe(spec.foe, spec.level);
    if (spec.name) this.foe.name = spec.name;
    this.foeLook = spec.look || (f.art.startsWith('char:') ? f.art.slice(5) : null);
    this.foeImg = this.foeLook ? null : Art[f.art];
    this.me = {
      st: { atk: 0, def: 0, spd: 0 },
      get name() { return P().name; }, get level() { return P().level; },
      get hp() { return P().hp; }, set hp(v) { P().hp = v; },
      get maxHp() { return P().maxHp; }, get atk() { return P().atk; }, get def() { return P().def; }, get spd() { return P().spd; },
    };
    this.disp = { me: P().hp, foe: this.foe.hp, xp: xpFrac(P()) };
    this.dispLevel = P().level;
    this.pos = { foeX: -170, meX: 170, foeBox: -130, meBox: 130, foeSink: 0, meSink: 0, foeL: 0, meL: 0, foeA: 1 };
    this.fx = [];
    this.blink = null;
    this.bg = battleBg(Game.scene && Game.scene.def ? Game.scene.def.bg : 'campo');
    this.done = new Promise(r => (this.finish = r));
    this.lastCmd = 0;
    this.fleeTries = 0;
    this.run();
  }

  // nombres en frases
  ref(side, cap = false) {
    if (side === 'me') return P().name;
    if (this.spec.trainer) return this.foe.name;
    const art = Lang.cur === 'fr' ? (cap ? 'Le ' : 'le ') : (cap ? 'El ' : 'el ');
    return art + this.foe.name + tr(this.fdef.wildTag);
  }
  deRef(side) {
    if (side === 'me' || this.spec.trainer) return deName(this.ref(side));
    return (Lang.cur === 'fr' ? 'du ' : 'del ') + this.foe.name + tr(this.fdef.wildTag);
  }
  statMsg(k, whose, up, limit) {
    const stat = tr(STATNAME[k]);
    if (Lang.cur === 'fr') {
      const a = ART_ST.fr[k];
      if (limit) return `${a}${stat} ${whose} ne peut plus ${up ? 'augmenter' : 'baisser'}.`;
      return `${a}${stat} ${whose} ${up ? 'augmente' : 'baisse'} !`;
    }
    const a = ART_ST.es[k];
    if (limit) return `${a === 'el' ? 'El' : 'La'} ${stat} ${whose} no puede ${up ? 'subir' : 'bajar'} más.`;
    return `${up ? 'Sube' : 'Baja'} ${a} ${stat} ${whose}.`;
  }
  msg(text, auto = 950) { return this.ui.say(text, auto ? { auto } : {}); }

  async run() {
    await wait(120);
    await Promise.all([tween(this.pos, { foeX: 0 }, 650), tween(this.pos, { meX: 0 }, 650)]);
    if (this.spec.trainer) await this.msg(t('b_challenge', { t: tr(this.spec.trainer) }), 0);
    else await this.msg(this.fdef.intro, 0);
    await Promise.all([tween(this.pos, { foeBox: 0 }, 220), tween(this.pos, { meBox: 0 }, 220)]);
    let result = null;
    while (!result) {
      const act = await this.chooseAction();
      result = await this.turn(act);
    }
    this.finish(result);
  }

  async chooseAction() {
    for (;;) {
      const c = await this.commandMenu();
      if (c === 0) {
        const moves = P().moves;
        if (moves.every(m => m.pp <= 0)) { await this.msg(t('b_noMoves', { n: P().name })); return { type: 'move', id: 'forcejeo' }; }
        const m = await this.moveMenu();
        if (m < 0) continue;
        if (moves[m].pp <= 0) { await this.msg(t('b_noPP')); continue; }
        return { type: 'move', id: moves[m].id };
      }
      if (c === 1) { const it = await this.itemMenu(); if (!it) continue; return { type: 'item', id: it }; }
      if (c === 2) { await this.statusPanel(); continue; }
      if (c === 3) return { type: 'run' };
    }
  }

  async turn(act) {
    const me = this.me, foe = this.foe;
    if (act.type === 'run') {
      if (!this.spec.canFlee) { await this.msg(t('b_noFlee')); return null; }
      this.fleeTries++;
      const chance = (me.spd * 32 / Math.max(1, foe.spd) + 30 * this.fleeTries) / 256;
      if (me.spd >= foe.spd || Math.random() < chance) { Sfx.play('back'); await this.msg(t('b_fled')); return 'run'; }
      await this.msg(t('b_fleeFail'));
      await this.useMove('foe', this.foeChoose());
      return this.checkFaint();
    }
    if (act.type === 'item') {
      const p = P(), it = S0().items, item = ITEMS[act.id];
      it[act.id]--;
      const before = p.hp;
      p.hp = Math.min(p.maxHp, p.hp + item.heal);
      await this.msg(t('b_useItem', { n: p.name, i: tr(item.name) }));
      Sfx.play('heal');
      this.sparkle('me', 'up');
      await tween(this.disp, { me: p.hp }, 500, Ease.lin);
      await this.msg(t('b_recover', { v: p.hp - before }));
      await this.useMove('foe', this.foeChoose());
      return this.checkFaint();
    }
    const foeMove = this.foeChoose();
    const sMe = me.spd * stageMul(me.st.spd), sFoe = foe.spd * stageMul(foe.st.spd);
    const meFirst = sMe > sFoe || (sMe === sFoe && Math.random() < 0.5);
    const order = meFirst ? [['me', act.id], ['foe', foeMove]] : [['foe', foeMove], ['me', act.id]];
    for (const [side, id] of order) {
      await this.useMove(side, id);
      const end = await this.checkFaint();
      if (end) return end;
    }
    return null;
  }

  foeChoose() {
    const foe = this.foe, me = this.me;
    const ok = foe.moves.filter(m => m.pp > 0).filter(m => {
      const mv = MOVES[m.id];
      if (mv.self) return Object.keys(mv.self).every(k => foe.st[k] < 2);
      if (mv.foe) return Object.keys(mv.foe).every(k => me.st[k] > -2);
      return true;
    });
    if (!ok.length) return 'forcejeo';
    const bag = [];
    for (const m of ok) { const n = MOVES[m.id].pow > 0 ? 3 : 1; for (let i = 0; i < n; i++) bag.push(m); }
    const m = pick(bag);
    m.pp--;
    return m.id;
  }

  async useMove(side, id) {
    const att = side === 'me' ? this.me : this.foe;
    const other = side === 'me' ? 'foe' : 'me';
    const def = side === 'me' ? this.foe : this.me;
    const mv = MOVES[id];
    if (side === 'me') { const m = P().moves.find(x => x.id === id); if (m) m.pp = Math.max(0, m.pp - 1); }
    await this.msg(t('b_uses', { a: this.ref(side, true), m: moveName(id) }), 650);
    if (mv.pow > 0) {
      if (mv.acc && Math.random() * 100 >= mv.acc) { Sfx.play('miss'); await this.msg(t('b_miss')); return; }
      await this.lunge(side);
      const { dmg, crit } = calcDamage(att, def, mv);
      def.hp = Math.max(0, def.hp - dmg);
      Sfx.play(crit ? 'crit' : 'hit');
      await this.hitAnim(other);
      await tween(this.disp, { [other]: def.hp }, 300 + Math.min(500, dmg * 25), Ease.lin);
      if (crit) await this.msg(t('b_crit'));
      return;
    }
    if (mv.self) {
      for (const k in mv.self) {
        if (att.st[k] >= 6) { await this.msg(this.statMsg(k, this.deRef(side), true, true)); continue; }
        att.st[k] = Math.min(6, att.st[k] + mv.self[k]);
        Sfx.play('buff'); this.sparkle(side, 'up');
        await wait(350);
        await this.msg(this.statMsg(k, this.deRef(side), true, false));
      }
    }
    if (mv.foe) {
      if (mv.acc && Math.random() * 100 >= mv.acc) { Sfx.play('miss'); await this.msg(t('b_miss')); return; }
      for (const k in mv.foe) {
        if (def.st[k] <= -6) { await this.msg(this.statMsg(k, this.deRef(other), false, true)); continue; }
        def.st[k] = Math.max(-6, def.st[k] + mv.foe[k]);
        Sfx.play('debuff'); this.sparkle(other, 'down');
        await wait(350);
        await this.msg(this.statMsg(k, this.deRef(other), false, false));
      }
    }
  }

  async checkFaint() {
    if (this.foe.hp <= 0) return this.victory();
    if (this.me.hp <= 0) return this.defeat();
    return null;
  }

  async victory() {
    Sfx.play('faint');
    await tween(this.pos, { foeSink: 60 }, 420, Ease.in);
    const tr_ = !!this.spec.trainer;
    if (tr_) {
      await this.msg(t('b_yield', { t: this.foe.name }), 0);
      if (this.spec.defeatText) await this.msg(`${this.foe.name}${Lang.cur === 'fr' ? ' :' : ':'} ${fmt(this.spec.defeatText)}`, 0);
    } else if (this.spec.foe === 'salteador') await this.msg(t('b_banditFlees'), 0);
    else await this.msg(t('b_defeated', { f: this.ref('foe', true) }), 0);
    const xp = Math.max(1, Math.floor(this.foe.exp * this.foe.level / 7 * (tr_ ? 1.5 : 1)));
    if (P().level < MAX_LV) {
      await this.msg(t('b_xp', { n: P().name, v: xp }), 0);
      await this.animateXp(xp);
    }
    const g = this.fdef.gold;
    const gold = g ? randInt(g[0], g[1]) : 0;
    if (gold > 0) {
      S0().ducados += gold;
      Sfx.play('coin');
      await this.msg(tr_ ? t('b_goldTrainer', { v: gold }) : t('b_goldBandit', { v: gold }), 0);
    }
    S0().wins = (S0().wins || 0) + 1;
    return 'win';
  }

  async defeat() {
    Sfx.play('faint');
    await tween(this.pos, { meSink: 80 }, 420, Ease.in);
    await this.msg(t('b_fainted', { n: P().name }), 0);
    if (this.spec.trainer && this.spec.winText) await this.msg(`${this.foe.name}${Lang.cur === 'fr' ? ' :' : ':'} ${fmt(this.spec.winText)}`, 0);
    return 'lose';
  }

  async animateXp(amount) {
    const p = P();
    const events = gainXp(amount);
    for (const ev of events) {
      await tween(this.disp, { xp: 1 }, 450, Ease.lin);
      Sfx.play('level');
      this.dispLevel = ev.level;
      this.disp.xp = 0;
      this.disp.me = p.hp;
      await this.msg(t('b_levelUp', { n: p.name, v: ev.level }), 0);
      await this.levelPanel(ev);
      for (const l of ev.learned) {
        if (l.old) await this.msg(t('b_forget', { n: p.name, m: moveName(l.old) }), 0);
        Sfx.play('item');
        await this.msg(t('b_learn', { n: p.name, m: moveName(l.m) }), 0);
      }
    }
    await tween(this.disp, { xp: xpFrac(p) }, 450, Ease.lin);
  }

  levelPanel(ev) {
    const p = P();
    const rows = [['PV', p.maxHp, ev.gains.maxHp], [tr(STATNAME.atk), p.atk, ev.gains.atk], [tr(STATNAME.def), p.def, ev.gains.def], [tr(STATNAME.spd), p.spd, ev.gains.spd]];
    return this.ui.panel(ctx => {
      drawBox(ctx, 120, 34, 116, 66);
      rows.forEach(([n, v, g], i) => {
        const y = 41 + i * 13;
        Font.draw(ctx, n, 129, y, 'dark');
        Font.drawRight(ctx, `+${g}`, 200, y, 'red');
        Font.drawRight(ctx, String(v), 228, y, 'dark');
      });
    });
  }

  // ── menús ──
  commandMenu() {
    const st = { idx: this.lastCmd };
    const opts = [t('b_fight'), t('b_bag'), t('b_status'), t('b_run')];
    return this.ui.panel(ctx => {
      drawBox(ctx, 0, 112, 240, 48);
      Font.draw(ctx, t('b_what1'), 11, 119, 'dark');
      Font.draw(ctx, t('b_what2', { n: P().name }), 11, 133, 'dark');
      drawBox(ctx, 120, 112, 120, 48);
      opts.forEach((o, i) => {
        const x = 138 + (i % 2) * 52, y = 119 + Math.floor(i / 2) * 14;
        Font.draw(ctx, o, x, y, i === 3 && !this.spec.canFlee ? 'grey' : 'dark');
        if (i === st.idx) drawCursor(ctx, x - 8, y + 3);
      });
    }, () => {
      if (Input.repeat('left') || Input.repeat('right')) { st.idx ^= 1; Sfx.play('blip'); }
      if (Input.repeat('up') || Input.repeat('down')) { st.idx ^= 2; Sfx.play('blip'); }
      if (Input.hit('a')) { Sfx.play('select'); this.lastCmd = st.idx; return st.idx; }
      return undefined;
    });
  }

  moveMenu() {
    const moves = P().moves;
    const st = { idx: 0 };
    return this.ui.panel(ctx => {
      drawBox(ctx, 0, 112, 164, 48);
      for (let i = 0; i < 4; i++) {
        const x = 16 + (i % 2) * 74, y = 119 + Math.floor(i / 2) * 14;
        const m = moves[i];
        if (!m) { Font.draw(ctx, '-', x, y, 'grey'); continue; }
        Font.draw(ctx, moveLabel(m.id), x, y, m.pp > 0 ? 'dark' : 'grey');
        if (i === st.idx) drawCursor(ctx, x - 8, y + 3);
      }
      drawBox(ctx, 164, 112, 76, 48);
      const m = moves[st.idx], mv = MOVES[m.id];
      Font.draw(ctx, t('b_pp'), 173, 119, 'dark');
      Font.drawRight(ctx, `${m.pp}/${mv.pp}`, 230, 119, m.pp > 0 ? 'dark' : 'red');
      Font.draw(ctx, mv.pow > 0 ? t('b_dmg') : t('b_buff'), 173, 133, 'grey');
      if (mv.pow > 0) Font.drawRight(ctx, String(mv.pow), 230, 133, 'dark');
    }, () => {
      const n = moves.length;
      const tryIdx = i => { if (i < n && i !== st.idx) { st.idx = i; Sfx.play('blip'); } };
      if (Input.repeat('left') || Input.repeat('right')) tryIdx(st.idx ^ 1);
      if (Input.repeat('up') || Input.repeat('down')) tryIdx(st.idx ^ 2);
      if (Input.hit('a')) { Sfx.play('select'); return st.idx; }
      if (Input.hit('b')) { Sfx.play('back'); return -1; }
      return undefined;
    });
  }

  async itemMenu() {
    const it = S0().items;
    const ids = Object.keys(ITEMS).filter(k => (it[k] || 0) > 0);
    if (!ids.length) { await this.msg(t('b_noItems')); return null; }
    if (P().hp >= P().maxHp) { await this.msg(t('b_fullHp')); return null; }
    const opts = ids.map(k => `${tr(ITEMS[k].name)} ×${it[k]}`).concat([t('back')]);
    const r = await this.ui.choose(opts, { y: 112 - (opts.length * 14 + 12) - 1 });
    if (r === opts.length - 1 || r < 0) return null;
    return ids[r];
  }

  statusPanel() {
    const p = P(), me = this.me;
    const st = k => (me.st[k] ? ` (${me.st[k] > 0 ? '+' : ''}${me.st[k]})` : '');
    return this.ui.panel(ctx => {
      drawBox(ctx, 0, 112, 240, 48);
      Font.draw(ctx, t('b_statusLine', { n: p.name, l: p.level, h: p.hp, m: p.maxHp }), 11, 119, 'dark');
      Font.draw(ctx, t('b_statsLine', { a: p.atk + st('atk'), d: p.def + st('def'), s: p.spd + st('spd') }), 11, 133, 'dark');
    });
  }

  // ── animaciones ──
  async lunge(side) {
    const k = side === 'me' ? 'meL' : 'foeL';
    await tween(this.pos, { [k]: 1 }, 110, Ease.out);
    await tween(this.pos, { [k]: 0 }, 140, Ease.in);
  }
  async hitAnim(side) {
    this.fx.push({ type: 'slash', side, t: 0, d: 260 });
    this.blink = { side, t: 0 };
    await wait(520);
    this.blink = null;
  }
  sparkle(side, dir) { this.fx.push({ type: 'spark', side, dir, t: 0, d: 650 }); }

  update(dt) {
    this.ui.update(dt);
    if (this.blink) this.blink.t += dt;
    for (const f of this.fx) f.t += dt;
    this.fx = this.fx.filter(f => f.t < f.d);
  }

  anchor(side) {
    if (side === 'me') return { x: ME_AT.x + this.pos.meX + this.pos.meL * 12, y: ME_AT.y - this.pos.meL * 6, w: 48, h: 72 };
    const w = this.foeImg ? this.foeImg.width * 2 : 32, h = this.foeImg ? this.foeImg.height * 2 : 48;
    return { x: FOE_AT.x + this.pos.foeX - this.pos.foeL * 12, y: FOE_AT.y + this.pos.foeL * 6, w, h };
  }

  draw(ctx) {
    ctx.drawImage(this.bg, 0, 0);
    const hidden = side => this.blink && this.blink.side === side && Math.floor(this.blink.t / 65) % 2 === 0;
    // rival / enemigo
    const fa = this.anchor('foe');
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, FOE_AT.y + 2); ctx.clip();
    if (!hidden('foe')) {
      if (this.foeImg) ctx.drawImage(this.foeImg, Math.round(fa.x - fa.w / 2), Math.round(fa.y - fa.h + 2 + this.pos.foeSink), fa.w, fa.h);
      else drawChar(ctx, this.foeLook, 0, fa.x - 16, fa.y - 48 + this.pos.foeSink, 2);
    }
    ctx.restore();
    // jugador (de espaldas)
    const ma = this.anchor('me');
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 112); ctx.clip();
    if (!hidden('me')) drawChar(ctx, playerLook(), 3, ma.x - 24, ma.y - 72 + this.pos.meSink, 3);
    ctx.restore();
    // efectos
    for (const f of this.fx) {
      const a = this.anchor(f.side);
      const cx = a.x, cy = a.y - a.h / 2;
      if (f.type === 'slash') {
        const k = f.t / f.d;
        for (let i = 0; i < 3; i++) {
          const len = Math.min(1, k * 3 - i * 0.5);
          if (len <= 0) continue;
          for (let s = 0; s < 22 * len; s++) {
            const x = cx - 14 + i * 7 + s, y = cy - 12 + s;
            rect(ctx, x, y, 2, 1, '#ffffff'); px(ctx, x + 2, y, '#ffe9a0');
          }
        }
      } else if (f.type === 'spark') {
        const k = f.t / f.d;
        for (let i = 0; i < 6; i++) {
          const x = cx - 18 + i * 7 + ((i * 13) % 5);
          const y0 = f.dir === 'up' ? cy + 18 - k * 34 - (i % 3) * 6 : cy - 18 + k * 34 + (i % 3) * 6;
          const col = f.dir === 'up' ? '#ffe36a' : '#7ab0ff';
          rect(ctx, x, Math.round(y0), 2, 2, col); px(ctx, x, Math.round(y0) + (f.dir === 'up' ? 2 : -1), '#ffffff');
        }
      }
    }
    this.drawFoeBox(ctx);
    this.drawMeBox(ctx);
    if (!this.ui.busy) drawBox(ctx, 0, 112, 240, 48);
    this.ui.draw(ctx);
  }

  drawFoeBox(ctx) {
    const x = 6 + Math.round(this.pos.foeBox), y = 8, f = this.foe;
    drawBox(ctx, x, y, 110, 32);
    Font.draw(ctx, f.name, x + 9, y + 4, 'dark');
    Font.drawRight(ctx, `${t('lv')}${f.level}`, x + 102, y + 4, 'dark');
    Font.draw(ctx, 'PV', x + 9, y + 15, 'dark');
    drawHpBar(ctx, x + 25, y + 20, 77, this.disp.foe / f.maxHp);
  }
  drawMeBox(ctx) {
    const x = 124 + Math.round(this.pos.meBox), y = 64, p = P();
    drawBox(ctx, x, y, 112, 46);
    Font.draw(ctx, p.name.toUpperCase(), x + 9, y + 4, 'dark');
    Font.drawRight(ctx, `${t('lv')}${this.dispLevel}`, x + 104, y + 4, 'dark');
    Font.draw(ctx, 'PV', x + 9, y + 15, 'dark');
    drawHpBar(ctx, x + 25, y + 20, 79, this.disp.me / p.maxHp);
    Font.drawRight(ctx, `${Math.max(0, Math.round(this.disp.me))}/${p.maxHp}`, x + 104, y + 23, 'dark');
    Font.draw(ctx, 'EXP', x + 9, y + 30, 'grey');
    rect(ctx, x + 29, y + 34, 76, 4, '#4a4040');
    rect(ctx, x + 30, y + 35, Math.round(74 * clamp(this.disp.xp, 0, 1)), 2, '#48a0f0');
  }
}
