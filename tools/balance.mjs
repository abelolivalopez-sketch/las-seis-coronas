// Simula la aventura entera para ajustar niveles, experiencia y dinero.
// Uso: node tools/build.mjs && node tools/balance.mjs [combates salvajes por ruta]
import { chromium } from 'playwright';
const WILD_PER_ROUTE = Number(process.argv[2] || 4);
const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const out = await p.evaluate((WILD) => {
  const S = window.__SC;
  const { MAPS, FOES, MOVES, ITEMS, EQUIP } = S;
  const stageMul = s => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));
  S.Game.state = S.newState('Sim', 'm', 'light');
  const st = S.Game.state, P = () => st.player;
  const log = [];
  // orden de la aventura: mapas con sus entrenadores, salvajes, tiendas y combates de historia
  const ORDER = [
    ['ruta1'], ['story', 'rival', 3], ['trainer', 'martin', 4],
    ['ruta2'], ['story', 'rival', 10], ['toledo'], ['coliseo_toledo'], ['boss', 'rodrigo', 14],
    ['ruta3'], ['ruta4'], ['tarifa'], ['ruta5'], ['tanger'], ['story', 'rival', 18], ['ruta6'], ['ruta7'], ['fez'], ['coliseo_fez'], ['boss', 'zaynab', 26],
    ['ruta9'], ['ruta10'], ['ruta11'], ['ruta12'], ['genova'], ['coliseo_genova'], ['boss', 'bianca', 34],
    ['ruta13'], ['ruta14'], ['story', 'rival', 41], ['florencia'], ['coliseo_florencia'], ['boss', 'guido', 44],
    ['ruta15'], ['ruta16'], ['venecia'], ['arsenal'], ['boss', 'corvino', 54],
    ['ruta17'], ['ruta18'], ['ruta19'], ['story', 'rival', 58], ['nuremberg'], ['coliseo_nuremberg'], ['boss', 'konrad', 60],
    ['ruta20'], ['ruta21'], ['lubeck'], ['kogge'], ['boss', 'corvino', 64], ['boss', 'baron', 66],
  ];
  const SHOPS = { toledo: ['espada_toledana', 'gambeson'], tanger: ['cota'], fez: ['cimitarra', 'cota'], genova: ['estoque', 'brigantina'], florencia: ['florentina', 'brigantina'], venecia: ['florentina', 'arnes'], nuremberg: ['espada_larga', 'arnes_nuremberg'], lubeck: ['espada_larga', 'arnes_nuremberg'] };
  const healItem = () => (P().level >= 40 ? 'triaca' : P().level >= 18 ? 'triaca' : 'unguento');
  let spentItems = 0, goldEarned = 0;
  function moveVal(id) { const m = MOVES[id]; return m.pow > 0 ? m.pow * ((m.acc || 100) / 100) * (m.crit ? 1.15 : 1) : m.heal ? 35 : 30; }
  function learnAll(events) {
    for (const ev of events) for (const l of ev.learned) if (l.full) {
      const mv = P().moves;
      let worst = 0; mv.forEach((m, i) => { if (moveVal(m.id) < moveVal(mv[worst].id)) worst = i; });
      if (moveVal(l.m) > moveVal(mv[worst].id)) mv[worst] = { id: l.m, pp: MOVES[l.m].pp };
    }
  }
  // un combate sin interfaz; items: lista de curas disponibles
  function sim(foeId, level, opts = {}) {
    const foe = S.makeFoe(foeId, level);
    const pl = P(), ef = S.effStats();
    const me = { level: pl.level, hp: opts.fullHp ? pl.maxHp : pl.hp, maxHp: pl.maxHp, atk: ef.atk, def: ef.def, spd: pl.spd, st: { atk: 0, def: 0, spd: 0 }, moves: pl.moves.map(m => ({ ...m })) };
    let bag = (opts.items || []).slice();
    const use = (side, id) => {
      const att = side === 'me' ? me : foe, def = side === 'me' ? foe : me, mv = MOVES[id];
      if (mv.pow > 0) {
        if (mv.acc && Math.random() * 100 >= mv.acc) return;
        def.hp = Math.max(0, def.hp - S.calcDamage(att, def, mv).dmg);
        return;
      }
      if (mv.heal) att.hp = Math.min(att.maxHp, att.hp + Math.ceil(att.maxHp * mv.heal));
      if (mv.self) for (const k in mv.self) att.st[k] = Math.min(6, att.st[k] + mv.self[k]);
      if (mv.foe) { if (mv.acc && Math.random() * 100 >= mv.acc) return; for (const k in mv.foe) def.st[k] = Math.max(-6, def.st[k] + mv.foe[k]); }
    };
    const foeChoose = () => {
      const ok = foe.moves.filter(m => m.pp > 0).filter(m => {
        const mv = MOVES[m.id];
        if (mv.self) return Object.keys(mv.self).every(k => foe.st[k] < 2);
        if (mv.foe) return Object.keys(mv.foe).every(k => me.st[k] > -2);
        return true;
      });
      if (!ok.length) return 'forcejeo';
      const bagm = []; for (const m of ok) { const n = MOVES[m.id].pow > 0 ? 3 : 1; for (let i = 0; i < n; i++) bagm.push(m); }
      const m = bagm[Math.floor(Math.random() * bagm.length)]; m.pp--; return m.id;
    };
    let turns = 0;
    while (me.hp > 0 && foe.hp > 0 && turns < 80) {
      turns++;
      let act;
      if (me.hp < me.maxHp * 0.34 && bag.length) act = { item: bag.pop() };
      else {
        const healM = me.moves.find(m => MOVES[m.id].heal && m.pp > 0);
        if (healM && me.hp < me.maxHp * 0.3) act = { move: healM.id };
        else {
          const dmg = me.moves.filter(m => MOVES[m.id].pow > 0 && m.pp > 0).sort((a, b) => moveVal(b.id) - moveVal(a.id));
          act = { move: dmg.length ? dmg[0].id : 'forcejeo' };
        }
      }
      if (act.move) { const m = me.moves.find(x => x.id === act.move); if (m) m.pp--; }
      const fm = foeChoose();
      if (act.item) { me.hp = Math.min(me.maxHp, me.hp + ITEMS[act.item].heal); use('foe', fm); continue; }
      const sMe = me.spd * stageMul(me.st.spd), sF = foe.spd * stageMul(foe.st.spd);
      const order = sMe > sF || (sMe === sF && Math.random() < 0.5) ? [['me', act.move], ['foe', fm]] : [['foe', fm], ['me', act.move]];
      for (const [side, id] of order) { use(side, id); if (me.hp <= 0 || foe.hp <= 0) break; }
    }
    return { win: foe.hp <= 0 && me.hp > 0, hp: me.hp, used: (opts.items || []).length - bag.length, foe };
  }
  function fight(foeId, level, trainer, label, items) {
    // se cura antes de cada combate importante; en rutas, cura si baja del 50%
    const pl = P();
    if (pl.hp < pl.maxHp * 0.5) S.healPlayer();
    const r = sim(foeId, level, { items: items || [] });
    if (!r.win) {
      // pierde: reintenta tras curarse (como en el juego)
      S.healPlayer();
      const r2 = sim(foeId, level, { items: items || [] });
      if (!r2.win) log.push(`  ✗ pierde 2 veces contra ${label} nv${level} (jugador nv${pl.level})`);
    }
    pl.hp = Math.max(1, r.hp);
    const xp = S.battleXp(r.foe, trainer);
    learnAll(S.gainXp(xp));
    const g = FOES[foeId].gold;
    const gold = !g ? 0 : Array.isArray(g) ? Math.round((g[0] + g[1]) / 2 * Math.max(1, Math.ceil(level / 4))) : g * level;
    st.ducados += gold; goldEarned += gold;
    return r;
  }
  function shopping(city) {
    for (const id of SHOPS[city] || []) {
      const q = EQUIP[id], stat = q.slot === 'arma' ? 'atk' : 'def';
      const cur = st.equip[q.slot];
      if ((cur ? EQUIP[cur][stat] || 0 : 0) < q[stat] && st.ducados >= q.price) { st.ducados -= q.price; st.equip[q.slot] = id; log.push(`  compra ${id} (${q.price})`); }
    }
  }
  function winRate(foeId, level, n, items) {
    let w = 0; const lv = P().level;
    for (let i = 0; i < n; i++) { S.healPlayer(); if (sim(foeId, level, { items }).win) w++; }
    return Math.round(w * 100 / n);
  }
  for (const step of ORDER) {
    const [k, a, lv] = step;
    if (k === 'story' || k === 'trainer') { fight(a, lv, true, a); continue; }
    if (k === 'boss') {
      const pl = P();
      const items = Array(4).fill(healItem());
      const wr0 = winRate(a, lv, 300, []), wr4 = winRate(a, lv, 300, items);
      log.push(`★ ${a} nv${lv}: jugador nv${pl.level} ATQ${S.effStats().atk} DEF${S.effStats().def} · gana ${wr0}% sin objetos, ${wr4}% con 4 ${healItem()} · ducados ${st.ducados} · equipo ${st.equip.arma}/${st.equip.armadura}`);
      S.healPlayer();
      fight(a, lv, true, a, items);
      continue;
    }
    const def = MAPS[k];
    // salvajes
    if (def.wild) {
      const tot = def.wild.reduce((s, w) => s + w.w, 0);
      for (let i = 0; i < WILD; i++) {
        let r = Math.random() * tot, pick = def.wild[0];
        for (const w of def.wild) { if ((r -= w.w) < 0) { pick = w; break; } }
        fight(pick.id, Math.round((pick.lv[0] + pick.lv[1]) / 2), false, pick.id);
      }
    }
    const trs = (def.npcs || []).filter(n => n.spec);
    const before = P().level;
    const hard = [];
    for (const n of trs) {
      const wr = winRate(n.spec.foe, n.spec.level, 60, []);
      if (wr < 75) hard.push(`${n.id} nv${n.spec.level}: ${wr}%`);
      S.healPlayer();
      fight(n.spec.foe, n.spec.level, true, n.id);
    }
    log.push(`${k}: nv ${before} → ${P().level} · ${trs.length} entrenadores${hard.length ? ' · difíciles: ' + hard.join(', ') : ''} · ducados ${st.ducados}`);
    shopping(k);
  }
  log.push(`dinero total ganado en combates: ${goldEarned}`);
  return log;
}, WILD_PER_ROUTE);
console.log(out.join('\n'));
console.log('errores:', errs.length ? errs : 'ninguno');
await b.close();
