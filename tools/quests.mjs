// Prueba las misiones especiales: don Quijote (La Mancha), Dante (Florencia) e Ibrahim (ajedrez, Brennero).
// Todas son de una sola oportunidad: si fallas, se cierran para siempre.
// Uso: node tools/build.mjs && node tools/quests.mjs <carpeta> [es|fr]
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const lang = process.argv[3] || 'es';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1000, height: 760 } })).newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.addInitScript(l => { localStorage.setItem('seis-coronas.idioma', l); }, lang);
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const sleep = ms => p.waitForTimeout(ms);
const state = () => p.evaluate(() => { const s = window.__SC.S0(); return { lv: s.player.level, d: s.ducados, ung: s.items.unguento || 0, arma: s.equip.arma, moves: s.player.moves.map(m => m.id), f: Object.keys(s.flags).filter(k => /quijote|emblema|caballero|dante|ajedrez/.test(k)), armor: s.equip.armadura, hp: s.player.hp, max: s.player.maxHp }; });
const top = () => p.evaluate(() => { const s = window.__SC.Game.scene; const t = s.ui && s.ui.stack[s.ui.stack.length - 1]; return t ? { kind: t.constructor.name, opts: t.opts || null, text: t.lines ? t.lines.join(' ') : '' } : null; });
const free = () => p.evaluate(() => { const s = window.__SC.Game.scene; return s instanceof window.__SC.WorldScene && !s.busy && !s.ui.busy; });
let n = 0;
const shot = async name => p.locator('#screen').screenshot({ path: `${dir}/q${String(++n).padStart(2, '0')}_${name}.png` });
// avanza hasta que haya un menú de opciones (o termine el guion)
async function toChoice() {
  for (let i = 0; i < 60; i++) { const t = await top(); if (t && t.kind === 'ChoiceWidget') return t; if (await free()) return null; await p.keyboard.press('KeyZ'); await sleep(170); }
  throw new Error('sin menú');
}
async function pick(idx, label) {
  await sleep(300);
  const t = await toChoice(); if (!t) throw new Error('esperaba la pregunta ' + label);
  if (label) await shot(label);
  for (let i = 0; i < idx; i++) { await p.keyboard.press('ArrowDown'); await sleep(120); }
  await p.keyboard.press('KeyZ'); await sleep(250);
  return t.opts;
}
// termina el guion; en los menús de aprender técnica olvida la primera
let forget = 0;
async function finish() {
  for (let i = 0; i < 120; i++) {
    if (await free()) return;
    const t = await top();
    if (t && t.kind === 'ChoiceWidget' && t.opts.some(o => /APRENDER|APPRENDRE/.test(o))) {
      for (let k = 0; k < forget % 4; k++) { await p.keyboard.press('ArrowDown'); await sleep(100); }
      forget++; await p.keyboard.press('KeyZ'); await sleep(200); continue;
    }
    await p.keyboard.press('KeyZ'); await sleep(170);
  }
  throw new Error('no termina');
}
async function tp(map, x, y, d) { await p.evaluate(([map, x, y, d]) => { const w = window.__SC.Game.scene; w.load(map, x, y, d); }, [map, x, y, d]); await sleep(400); }
const talk = async () => { await p.keyboard.press('KeyZ'); await sleep(250); };
const log = [];
const check = (ok, msg) => { log.push((ok ? '✓ ' : '✗ ') + msg); if (!ok) process.exitCode = 1; };

await p.evaluate(() => { const S = window.__SC; const st = S.newState('Abel', 'f', 'dark'); st.flags = { introDone: true, rivalDone: true, canLeave: true }; S.Game.state = st; S.startWorld(st, false); S.gainXp(S.xpFor(13) - st.player.xp); st.player.moves = ['tajo', 'grito', 'estocada', 'escudo'].map(id => ({ id, pp: S.MOVES[id].pp })); });
await sleep(600);
const s0 = await state();
const unflag = ks => p.evaluate(ks => { const f = window.__SC.S0().flags; for (const k of ks) delete f[k]; }, ks);
// ¿vuelve a preguntar? (sale un menú de opciones antes de terminar el guion)
async function asksAgain() { await talk(); const t = await toChoice(); if (t) { await p.keyboard.press('KeyX'); await sleep(200); } await finish(); return !!t; }
// 1) don Quijote: si falla la amada, la misión se cierra
await tp('ruta3', 32, 3, 'right'); await talk();
await pick(0, 'amada_mal'); await finish();
let s = await state(); check(s.d === s0.d && !s.f.includes('quijote1') && s.f.includes('quijoteCerrado'), 'Quijote, respuesta mala: sin premio y misión cerrada');
check(!(await asksAgain()), 'Quijote cerrado: ya no vuelve a preguntar');
// otra partida: acierta amada y caballo, falla la sorpresa → se queda el premio, pero se cierra
await unflag(['quijoteCerrado']);
await talk(); const o1 = await pick(1, 'amada'); const o2 = await pick(2, 'caballo');
await pick(0, 'paginas_mal'); await finish();
s = await state(); check(s.d === s0.d + 100 && s.ung === s0.ung + 5 && s.f.includes('quijote1') && s.f.includes('quijoteCerrado') && s.lv === 13, `amada y caballo: +100 ducados y +5 ungüentos; sorpresa fallada: cerrada (${o1.join('/')} · ${o2.join('/')})`);
check(!(await asksAgain()), 'sorpresa fallada: ya no hay segunda oportunidad');
// otra partida: lo acierta todo
await unflag(['quijoteCerrado', 'quijote1']);
await talk(); await pick(1); await pick(2); const o3 = await pick(1, 'paginas'); await finish(); await shot('quijote_fin');
s = await state(); check(s.lv === 35 && s.arma === 'matagigantes' && s.f.includes('emblemaMatagigantes'), `todo bien: nivel ${s.lv}, arma ${s.arma} (${o3.join('/')})`);
log.push('  técnicas tras subir: ' + s.moves.join(', '));
await talk(); await finish();
// 2) Dante: un fallo cierra la misión
await tp('florencia', 24, 9, 'up'); await talk();
await pick(0, 'dante_mal'); await finish();
s = await state(); check(!s.f.includes('caballeroInfierno') && s.f.includes('danteCerrado'), 'Dante, respuesta mala: sin título y misión cerrada');
check(!(await asksAgain()), 'Dante cerrado: ya no vuelve a preguntar');
await unflag(['danteCerrado']);
await talk(); const d1 = await pick(1, 'dante_guia'); const d2 = await pick(2, 'dante_circulos'); await finish();
s = await state(); check(s.f.includes('caballeroInfierno') && s.moves.includes('matademonios') && s.moves.includes('beso'), `Dante: título y técnicas (${d1.join('/')} · ${d2.join('/')}) → ${s.moves.join(', ')}`);
await p.keyboard.press('KeyM'); await sleep(400); await talk(); await sleep(400); await talk(); await sleep(300); await shot('titulos');
await p.keyboard.press('KeyX'); await sleep(300); await p.keyboard.press('KeyX'); await sleep(300); await finish();
// 4) Ibrahim, el sabio de Fez: la batalla silenciosa
const box = await p.locator('#screen').boundingBox();
async function tapSq(sq) {
  const f = sq.charCodeAt(0) - 97, r = +sq[1] - 1, gx = 8 + f * 16 + 8, gy = 19 + (7 - r) * 16 + 8;
  await p.mouse.click(box.x + gx / 240 * box.width, box.y + gy / 160 * box.height); await sleep(150);
}
async function chess(moves) {
  for (let i = 0; i < 40; i++) { if (await p.evaluate(() => { const t = window.__SC.Game.scene.ui.stack.slice(-1)[0]; return !!(t && t.constructor.name === 'PanelWidget'); })) break; await sleep(150); }
  await sleep(3000);
  for (const m of moves) { await tapSq(m.slice(0, 2)); await tapSq(m.slice(2, 4)); await sleep(1100); }
}
await p.evaluate(() => { const S = window.__SC; S.P().hp = 20; S.S0().equip.armadura = 'arnes'; });
await tp('ruta18', 27, 9, 'up'); await talk();
await pick(1, 'sabio_no'); await finish();
s = await state(); check(!s.f.includes('ajedrezIntentado') && !s.f.includes('ajedrezCerrado'), 'decir que no: la misión sigue abierta');
await talk(); await pick(0, 'sabio_si'); await pick(0, 'sabio_empezamos');
await chess(['g5f7', 'f7h6', 'e6g8', 'h6f7']); await shot('ajedrez_mate'); await finish();
s = await state(); check(s.f.includes('ajedrezGanado') && s.armor === 'torre' && s.hp === s.max, `ajedrez ganado: PV ${s.hp}/${s.max}, armadura ${s.armor}`);
const def = await p.evaluate(() => window.__SC.effStats().def); log.push('  defensa con la Torre: ' + def);
await p.keyboard.press('KeyM'); await sleep(400); await talk(); await sleep(400); await talk(); await sleep(300); await shot('equipo_torre');
await p.keyboard.press('KeyX'); await sleep(300); await p.keyboard.press('KeyX'); await sleep(300); await finish();
// otra partida: jugada mala → cerrada para siempre
await unflag(['ajedrezGanado', 'ajedrezIntentado', 'ajedrezVisto']);
await p.evaluate(() => { window.__SC.S0().equip.armadura = 'arnes'; });
await talk(); await pick(0); await pick(0);
await chess(['e6e8']); await finish();
s = await state(); check(s.f.includes('ajedrezCerrado') && s.armor === 'arnes', 'ajedrez fallado: sin armadura y misión cerrada');
check(!(await asksAgain()), 'ajedrez cerrado: Ibrahim ya no vuelve a proponerlo');
// 3) combate con las técnicas nuevas
async function fightWith(moveId, foe, lv, label) {
  await p.evaluate(([foe, lv]) => { const S = window.__SC; S.healPlayer(); S.Game.scene.runScript(W => W.battle({ foe, level: lv, canFlee: false, trainer: 'PRUEBA' })); }, [foe, lv]);
  const idx = await p.evaluate(m => window.__SC.P().moves.findIndex(x => x.id === m), moveId);
  let used = false, hpBefore = await p.evaluate(() => window.__SC.P().hp), hpAfter = null, shotTaken = false;
  for (let i = 0; i < 80; i++) {
    const sc = await p.evaluate(() => window.__SC.Game.scene.constructor.name);
    if (sc === 'WorldScene' && await free()) break;
    const t = await top();
    if (sc === 'BattleScene' && t && t.kind === 'PanelWidget' && !used) {
      const which = await p.evaluate(() => { const b = window.__SC.Game.scene; return b.ui.stack.length; });
      // menú de órdenes → LUCHAR → técnica
      await p.keyboard.press('KeyZ'); await sleep(250);
      if (idx & 1) { await p.keyboard.press('ArrowRight'); await sleep(120); }
      if (idx & 2) { await p.keyboard.press('ArrowDown'); await sleep(120); }
      await sleep(200); if (!shotTaken) { shotTaken = true; await shot(label + '_menu'); }
      await p.keyboard.press('KeyZ'); await sleep(250); used = true; continue;
    }
    if (t && /PV por el esfuerzo|PV dans l'effort/.test(t.text) && hpAfter === null) { hpAfter = await p.evaluate(() => window.__SC.P().hp); log.push('  mensaje: ' + t.text); await shot(label + '_coste'); }
    await p.keyboard.press('KeyZ'); await sleep(170);
  }
  const res = await p.evaluate(() => ({ hp: window.__SC.P().hp, max: window.__SC.P().maxHp, wins: window.__SC.S0().wins }));
  return { hpBefore, hpAfter, ...res };
}
const r1 = await fightWith('beso', 'corvino', 54, 'beso');
check(r1.hpAfter !== null && r1.hpAfter > 0 && r1.hpAfter < r1.hpBefore, `BESO DE AMADA vence a Corvino nv54 de un golpe y cuesta la mitad de los PV que quedaban (${r1.hpBefore} → ${r1.hpAfter})`);
const r2 = await fightWith('matademonios', 'oso', 40, 'matademonios');
check(r2.hp > 0, `MATA DEMONIOS contra un oso nv40 (PV ${r2.hp}/${r2.max})`);
console.log(log.join('\n'));
console.log('errores:', errs.length ? errs : 'ninguno');
await b.close();
