// Recorre la historia completa (hasta Lübeck) con la interfaz real y guarda capturas.
// Uso: node tools/build.mjs && node tools/playthrough.mjs <carpeta> [es|fr] [nivel]
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const lang = process.argv[3] || 'es';
const LV = Number(process.argv[4] || 75);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1000, height: 760 } })).newPage();
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + String(e)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts/.test(m.text())) errs.push(m.text()); });
await p.addInitScript(l => { try { localStorage.setItem('seis-coronas.idioma', l); } catch (e) {} }, lang);
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const sleep = ms => p.waitForTimeout(ms);
let shotN = 0;
const shot = async name => { await p.locator('#screen').screenshot({ path: `${dir}/${String(++shotN).padStart(2, '0')}_${name}.png` }); };
const sc = () => p.evaluate(() => { const s = window.__SC.Game.scene; return s && s.constructor.name; });
const busy = () => p.evaluate(() => { const s = window.__SC.Game.scene; return !!(s && (s.busy || (s.ui && s.ui.busy))) || !(s instanceof window.__SC.WorldScene); });
const where = () => p.evaluate(() => { const s = window.__SC.Game.scene; return s.mapId ? `${s.mapId} (${s.player.x},${s.player.y})` : s.constructor.name; });
const flag = k => p.evaluate(k => !!window.__SC.S0().flags[k], k);
// avanza diálogos, menús y combates pulsando A hasta que el mundo quede libre
async function settle(max = 400, shootBattle) {
  let battles = 0, inBattle = false;
  for (let i = 0; i < max; i++) {
    const s = await sc();
    if (s === 'BattleScene' && !inBattle) { inBattle = true; battles++; await sleep(900); if (shootBattle) await shot(shootBattle + '_combate'); }
    if (s !== 'BattleScene') inBattle = false;
    else await p.evaluate(() => { for (const m of window.__SC.P().moves) m.pp = Math.max(m.pp, 3); });
    if (!(await busy())) { await sleep(250); if (!(await busy())) return battles; }
    const shopMenu = await p.evaluate(() => { const s = window.__SC.Game.scene; const t = s.ui && s.ui.stack[s.ui.stack.length - 1]; return !!(t && t.opts && t.opts.some(o => o === 'SALIR' || o === 'SORTIR')); });
    await p.keyboard.press(shopMenu ? 'KeyX' : 'KeyZ');
    await sleep(140);
  }
  const info = await p.evaluate(() => { const s = window.__SC.Game.scene; const t = s.ui && s.ui.stack[s.ui.stack.length - 1]; return { busy: s.busy, n: s.ui && s.ui.stack.length, top: t && t.constructor.name, txt: t && (t.lines ? t.lines.join(' ') : t.opts ? t.opts.join('|') : '') }; });
  throw new Error('no termina en ' + (await where()) + ' ' + JSON.stringify(info));
}
const top = () => p.evaluate(() => { const s = window.__SC.Game.scene; const t = s.ui && s.ui.stack[s.ui.stack.length - 1]; return t ? t.constructor.name : null; });
async function untilChoice(max = 40) {
  await sleep(450);
  for (let i = 0; i < max; i++) { await sleep(160); if ((await top()) === 'ChoiceWidget') return; await p.keyboard.press('KeyZ'); }
  throw new Error('no aparece el menú en ' + (await where()));
}
async function tp(map, x, y, d = 'down') {
  await p.evaluate(([map, x, y, d]) => { const w = window.__SC.Game.scene; if (w.mapId !== map) w.load(map, x, y, d); const pl = w.player; pl.x = x; pl.y = y; pl.px = x * 16; pl.py = y * 16; pl.dir = d; pl.moving = false; w.snapCam(); }, [map, x, y, d]);
  await sleep(150);
}
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
async function go(d, n = 1) { for (let i = 0; i < n; i++) { await p.keyboard.down(KEY[d]); await sleep(260); await p.keyboard.up(KEY[d]); await sleep(120); } }
async function talk() { await p.keyboard.press('KeyZ'); await sleep(200); }
async function expectMap(m) { const w = await where(); if (!w.startsWith(m)) throw new Error(`esperaba ${m} y estoy en ${w}`); }

// partida nueva, ya con el prólogo hecho y nivel alto para avanzar rápido
await p.evaluate(LV => {
  const S = window.__SC;
  const st = S.newState('Abel', 'm', 'light');
  st.flags = { introDone: true, rivalDone: true, canLeave: true };
  st.items = { hogaza: 5, unguento: 5, triaca: 3 };
  S.Game.state = st;
  S.startWorld(st, false);
  S.gainXp(S.xpFor(LV) - st.player.xp);
  st.player.moves = ['carga', 'tajo_cruzado', 'mandoble', 'aliento'].map(id => ({ id, pp: S.MOVES[id].pp }));
  st.equip = { arma: 'florentina', armadura: 'arnes' };
  S.healPlayer();
}, LV);
await sleep(800);
const log = [];
const FROM = process.env.FROM || '';
let skipping = !!FROM;
const step = async (name, fn) => {
  if (skipping && !name.startsWith(FROM)) return;
  if (skipping) {
    skipping = false;
    await p.evaluate(() => { const f = window.__SC.S0().flags; for (const k of ['rivalToledo', 'selloRobado', 'toledoOpen', 'blason_toledo', 'visitTanger', 'rivalTanger', 'blason_fez', 'selloFez', 'salvoconducto', 'abordaje', 'abordajeHecho', 'visitGenova', 'blason_genova', 'genovaOpen', 'rivalFlorencia', 'blason_florencia', 'florenciaOpen', 'rivalVenecia', 'corvinoDone', 'sellosRecuperados', 'finCapitulo1']) f[k] = true; window.__SC.S0().blasones = 4; });
  }
  await p.evaluate(() => window.__SC.healPlayer());   // es una prueba del recorrido, no de la dificultad
  try { await fn(); } catch (e) {
    const info = await p.evaluate(() => ({ flags: Object.keys(window.__SC.S0().flags).join(','), scene: window.__SC.Game.scene.constructor.name }));
    console.log(log.join('\n')); console.log('FALLO en', name, String(e), JSON.stringify(info)); console.log('errores:', errs); await b.close(); process.exit(1);
  }
  log.push(`✓ ${name} → ${await where()}`);
};

await step('Ruta 1 → Ruta 2', async () => { await tp('ruta1', 10, 0, 'up'); await go('up'); await settle(); await expectMap('ruta2'); await shot('ruta2'); });
await step('Ruta 2 → Toledo', async () => { await tp('ruta2', 11, 0, 'up'); await go('up'); await settle(); await expectMap('toledo'); });
await step('Rival en Toledo', async () => { await tp('toledo', 15, 22, 'up'); await go('up'); const n = await settle(600, 'rival_toledo'); if (!n) throw new Error('sin combate'); });
await step('Puerta este cerrada', async () => { await tp('toledo', 29, 12, 'right'); await go('right'); await settle(); await expectMap('toledo'); });
await step('Posada de Toledo', async () => { await tp('toledo', 5, 12, 'up'); await talk(); await settle(); const r = await p.evaluate(() => window.__SC.S0().respawn); if (!r || r.map !== 'toledo') throw new Error('sin punto de reaparición'); });
await step('Armería de Toledo', async () => {
  await p.evaluate(() => { window.__SC.S0().ducados = 5000; window.__SC.S0().equip.arma = 'espada_corta'; });
  await tp('toledo', 22, 12, 'up'); await talk();
  await untilChoice(); await shot('armeria'); await p.keyboard.press('KeyZ');
  await untilChoice(); await p.keyboard.press('KeyZ');
  await settle();
  const e = await p.evaluate(() => window.__SC.S0().equip.arma); if (e !== 'espada_toledana') throw new Error('no compró: ' + e);
  await p.evaluate(() => { window.__SC.S0().equip.arma = 'florentina'; });
});
await step('Coliseo de Toledo y Don Rodrigo', async () => {
  await tp('toledo', 15, 6, 'up'); await go('up'); await settle(); await expectMap('coliseo_toledo'); await shot('coliseo_toledo');
  await tp('coliseo_toledo', 7, 4, 'up'); await talk(); await settle(600, 'rodrigo');
  if (!(await flag('blason_toledo'))) throw new Error('sin blasón');
  await tp('coliseo_toledo', 7, 14, 'down'); await go('down'); await settle(600); await expectMap('toledo');
  if (!(await flag('selloRobado'))) throw new Error('sin escena del sello');
});
await step('Toledo → Ruta 3 → Ruta 4 → Tarifa', async () => {
  await tp('toledo', 30, 12, 'right'); await go('right'); await settle(); await expectMap('ruta3'); await shot('ruta3');
  await tp('ruta3', 38, 23, 'down'); await go('down'); await settle(); await expectMap('ruta4');
  await tp('ruta4', 21, 39, 'down'); await go('down'); await settle(); await expectMap('tarifa'); await shot('tarifa');
});
await step('Barco a Tánger (Ruta 5)', async () => {
  await tp('tarifa', 8, 17, 'left'); await talk(); await settle(); await expectMap('ruta5'); await shot('ruta5');
  await tp('ruta5', 22, 6, 'right'); await talk(); await settle(600, 'corsario');
  await tp('ruta5', 25, 5, 'right'); await talk(); await sleep(400); await shot('cubierta'); await settle(800, 'rival_tanger'); await expectMap('tanger');
  if (!(await flag('rivalTanger'))) throw new Error('sin rival en Tánger');
  await shot('tanger');
});
await step('Tánger → Rif → Sebú → Fez', async () => {
  await tp('tanger', 16, 27, 'down'); await go('down'); await settle(); await expectMap('ruta6'); await shot('ruta6');
  await tp('ruta6', 12, 43, 'down'); await go('down'); await settle(); await expectMap('ruta7');
  await tp('ruta7', 36, 23, 'down'); await go('down'); await settle(); await expectMap('fez'); await shot('fez');
});
await step('Coliseo de Fez y Zaynab', async () => {
  await tp('fez', 15, 23, 'up'); await go('up'); await settle(); await expectMap('coliseo_fez');
  await tp('coliseo_fez', 7, 4, 'up'); await talk(); await settle(600, 'zaynab');
  if (!(await flag('blason_fez'))) throw new Error('sin blasón de Fez');
  await tp('coliseo_fez', 7, 14, 'down'); await go('down'); await settle(800); await expectMap('tanger');
  if (!(await flag('salvoconducto'))) throw new Error('sin salvoconducto');
});
await step('LA ESPERANZA: Alborán, Baleares, Cerdeña', async () => {
  await tp('tanger', 14, 4, 'up'); await talk(); await settle(); await expectMap('ruta9');
  await tp('ruta9', 24, 6, 'right'); await talk(); await settle(600);
  await tp('ruta9', 28, 5, 'right'); await talk(); await sleep(1200); await shot('travesia'); await settle(800); await expectMap('ruta10'); await shot('baleares');
  await tp('ruta10', 33, 12, 'right'); await talk(); await settle(800); await expectMap('ruta11'); await shot('cerdena');
  await tp('ruta11', 34, 7, 'right'); await talk(); await settle(800); await expectMap('ruta12');
  if (!(await flag('abordaje'))) throw new Error('sin abordaje');
  await shot('abordaje');
});
await step('Barbarroja y llegada a Génova', async () => {
  await tp('ruta12', 22, 6, 'right'); await talk(); await settle(800, 'barbarroja');
  if (!(await flag('abordajeHecho'))) throw new Error('Barbarroja sigue');
  await tp('ruta12', 25, 5, 'right'); await talk(); await settle(800); await expectMap('genova'); await shot('genova');
});
await step('Coliseo de Génova y Bianca', async () => {
  await tp('genova', 16, 4, 'up'); await go('up'); await settle(); await expectMap('genova');
  await tp('genova', 6, 10, 'up'); await go('up'); await settle(); await expectMap('coliseo_genova');
  await tp('coliseo_genova', 7, 4, 'up'); await talk(); await settle(600, 'bianca');
  if (!(await flag('blason_genova'))) throw new Error('sin blasón de Génova');
  await tp('coliseo_genova', 7, 14, 'down'); await go('down'); await settle(); await expectMap('genova');
});
await step('Apeninos → Toscana → Florencia (rival)', async () => {
  await tp('genova', 16, 0, 'up'); await go('up'); await settle(); await expectMap('ruta13'); await shot('apeninos');
  await tp('ruta13', 12, 0, 'up'); await go('up'); await settle(); await expectMap('ruta14'); await shot('toscana');
  await tp('ruta14', 43, 11, 'right'); await go('right'); await settle(); await expectMap('florencia');
  await go('right'); await settle(600, 'rival_florencia');
  if (!(await flag('rivalFlorencia'))) throw new Error('sin rival en Florencia');
  await shot('florencia');
});
await step('Coliseo de Florencia y Guido', async () => {
  await tp('florencia', 32, 4, 'right'); await sleep(100); await go('left'); await settle();
  await tp('florencia', 16, 26, 'up'); await go('up'); await settle(); await expectMap('coliseo_florencia');
  await tp('coliseo_florencia', 7, 4, 'up'); await talk(); await settle(600, 'guido');
  if (!(await flag('blason_florencia'))) throw new Error('sin blasón de Florencia');
  await tp('coliseo_florencia', 7, 14, 'down'); await go('down'); await settle(); await expectMap('florencia');
});
await step('Po → laguna → Venecia (rival)', async () => {
  await tp('florencia', 33, 4, 'right'); await go('right'); await settle(); await expectMap('ruta15'); await shot('po');
  await tp('ruta15', 43, 15, 'right'); await go('right'); await settle(); await expectMap('ruta16'); await shot('laguna');
  await tp('ruta16', 33, 14, 'right'); await go('right'); await settle(800); await expectMap('venecia');
  if (!(await flag('rivalVenecia'))) throw new Error('sin rival en Venecia');
  await shot('venecia');
});
await step('Guardias y Arsenal', async () => {
  await tp('venecia', 29, 27, 'up'); await go('up'); await settle(); await expectMap('venecia');
  await tp('venecia', 28, 28, 'left'); await talk(); await settle(600);
  await tp('venecia', 31, 28, 'right'); await talk(); await settle(600);
  await tp('venecia', 29, 27, 'up'); await go('up'); await settle(); await expectMap('arsenal'); await shot('arsenal');
});
await step('Corvino, los sellos y el Dux', async () => {
  await tp('arsenal', 13, 5, 'up'); await talk(); await settle(800, 'corvino');
  if (!(await flag('corvinoDone'))) throw new Error('Corvino no huye');
  await tp('arsenal', 15, 3, 'up'); await talk(); await settle(600);
  if (!(await flag('sellosRecuperados'))) throw new Error('sin sellos');
  await tp('arsenal', 13, 21, 'down'); await go('down'); await settle(); await expectMap('venecia');
  await tp('venecia', 31, 16, 'up'); await talk(); await settle(600);
  if (!(await flag('finCapitulo1'))) throw new Error('sin final');
});
await step('Barquero de Venecia → Dolomitas', async () => {
  await tp('venecia', 14, 3, 'up'); await talk(); await settle(); await expectMap('ruta17'); await shot('dolomitas');
});
await step('Dolomitas → Brennero (hospicio)', async () => {
  await tp('ruta17', 14, 0, 'up'); await go('up'); await settle(); await expectMap('ruta18'); await shot('brennero');
  await tp('ruta18', 14, 19, 'up'); await talk(); await settle();
  const r = await p.evaluate(() => window.__SC.S0().respawn); if (!r || r.map !== 'ruta18') throw new Error('sin punto de reaparición en el hospicio');
});
await step('Brennero → Baviera → Núremberg (rival)', async () => {
  await tp('ruta18', 18, 0, 'up'); await go('up'); await settle(); await expectMap('ruta19'); await shot('baviera');
  await tp('ruta19', 20, 0, 'up'); await go('up'); await settle(); await expectMap('nuremberg');
  await go('up', 2); await settle(800, 'rival_nuremberg');
  if (!(await flag('rivalNuremberg'))) throw new Error('sin rival en Núremberg');
  await shot('nuremberg');
});
await step('Puerta norte de Núremberg cerrada', async () => {
  await tp('nuremberg', 17, 3, 'up'); await go('up'); await settle(); await expectMap('nuremberg');
  const y = await p.evaluate(() => window.__SC.Game.scene.player.y); if (y < 3) throw new Error('la puerta norte no detiene');
});
await step('Coliseo de Núremberg y Meister Konrad', async () => {
  await tp('nuremberg', 6, 23, 'up'); await go('up'); await settle(); await expectMap('coliseo_nuremberg'); await shot('coliseo_nuremberg');
  await tp('coliseo_nuremberg', 7, 4, 'up'); await talk(); await settle(800, 'konrad');
  if (!(await flag('blason_nuremberg'))) throw new Error('sin blasón de Núremberg');
  await tp('coliseo_nuremberg', 7, 14, 'down'); await go('down'); await settle(); await expectMap('nuremberg');
});
await step('Turingia → Luneburgo → Lübeck (rival)', async () => {
  await tp('nuremberg', 17, 0, 'up'); await go('up'); await settle(); await expectMap('ruta20'); await shot('turingia');
  await tp('ruta20', 12, 0, 'up'); await go('up'); await settle(); await expectMap('ruta21'); await shot('luneburgo');
  await tp('ruta21', 43, 8, 'right'); await go('right'); await settle(); await expectMap('lubeck');
  await go('right', 4); await settle(800);
  if (!(await flag('rivalLubeck'))) throw new Error('sin rival en Lübeck');
  await shot('lubeck');
});
await step('Guardias de LA CORNEJA', async () => {
  await tp('lubeck', 31, 22, 'right'); await go('right'); await settle(); await expectMap('lubeck');
  await tp('lubeck', 28, 17, 'down'); await talk(); await settle(600);
  await tp('lubeck', 28, 24, 'down'); await talk(); await settle(600);
  await tp('lubeck', 31, 22, 'right'); await go('right'); await settle(); await expectMap('kogge'); await shot('corneja');
});
await step('Corvino y el Barón de Rabenstein', async () => {
  await tp('kogge', 15, 6, 'right'); await talk(); await settle(800, 'corvino2');
  await p.evaluate(() => window.__SC.healPlayer());
  await tp('kogge', 18, 6, 'right'); await talk(); await settle(1000, 'baron');
  for (const f of ['corvino2Done', 'baronDone', 'sellosLubeck']) if (!(await flag(f))) throw new Error('falta ' + f);
});
await step('Burgomaestre y fin del capítulo II', async () => {
  await tp('kogge', 1, 6, 'left'); await go('left', 2); await settle(); await expectMap('lubeck');
  await tp('lubeck', 24, 9, 'up'); await talk(); await settle(800);
  if (!(await flag('finCapitulo2'))) throw new Error('sin final del capítulo II');
  await shot('fin_capitulo2');
});
await step('Barquero de vuelta a Venecia', async () => {
  await tp('ruta17', 15, 39, 'right'); await talk(); await settle(); await expectMap('venecia');
});
await step('Estado: página de equipo y blasones', async () => {
  await p.keyboard.press('KeyM'); await sleep(400); await talk(); await sleep(400); await talk(); await sleep(300);
  await shot('equipo'); await p.keyboard.press('KeyX'); await sleep(300); await p.keyboard.press('KeyX'); await sleep(300); await settle();
});
await step('Volver en barco de Génova a Tánger', async () => {
  await tp('genova', 15, 23, 'down'); await talk(); await settle(); await expectMap('tanger');
  await tp('tanger', 11, 3, 'up'); await talk(); await settle(); await expectMap('tarifa');
});
const st = await p.evaluate(() => { const s = window.__SC.S0(); return { lv: s.player.level, bl: s.blasones, d: s.ducados, eq: s.equip, moves: s.player.moves.map(m => m.id) }; });
console.log(log.join('\n'));
console.log('estado final', JSON.stringify(st));
console.log('errores:', errs.length ? errs : 'ninguno');
await b.close();
