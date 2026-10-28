// Prueba 3: versión francesa + contador de pasos simulado (como en la app de Android).
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1000, height: 800 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + String(e)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts|ERR_FILE/.test(m.text())) errs.push(m.text()); });
// Simula el plugin nativo "Pasos"
await p.addInitScript(() => {
  window.__steps = 5000;
  window.__boot = Date.now() - 3600e3;
  window.__granted = false;
  const plugin = {
    estado: async () => ({ disponible: true, permiso: window.__granted }),
    pedirPermiso: async () => { window.__granted = true; return { disponible: true, permiso: true }; },
    leer: async () => ({ pasos: window.__steps, arranque: window.__boot }),
  };
  window.Capacitor = { isNativePlatform: () => true, registerPlugin: () => plugin };
});
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const sleep = ms => p.waitForTimeout(ms);
const key = async (k, n = 1, gap = 300) => { for (let i = 0; i < n; i++) { await p.keyboard.press(k); await sleep(gap); } };
const shot = async name => { await p.locator('#screen').screenshot({ path: `${dir}/${name}.png` }); };
const scene = () => p.evaluate(() => window.__SC.Game.scene.constructor.name);
const busy = () => p.evaluate(() => { const s = window.__SC.Game.scene; return !!(s.busy || (s.ui && s.ui.busy)); });
const topText = () => p.evaluate(() => { const s = window.__SC.Game.scene; const top = s.ui && s.ui.stack[s.ui.stack.length - 1]; return top && top.lines ? top.lines.join(' ') : ''; });

await sleep(600);
await key('ArrowRight', 1, 300);
await shot('f01_lang');
await key('KeyZ', 1, 900);
await shot('f02_title');
await key('KeyZ', 1, 800);
await shot('f03_title_menu');
await key('KeyZ', 1, 900);
await key('ArrowRight', 2, 250);
await shot('f04_select');
await key('KeyZ', 1, 800);
await key('KeyZ', 1, 600);
await shot('f05_name');
await p.fill('#nameInput', 'Aliénor');
await p.keyboard.press('Enter');
await sleep(700);
await key('KeyZ', 2, 500);
await sleep(900);
await shot('f06_intro');
for (let i = 0; i < 30 && (await scene()) !== 'WorldScene'; i++) await key('KeyZ', 1, 450);
await sleep(1300);
await shot('f07_world');
for (let i = 0; i < 20 && (await busy()); i++) await key('KeyZ', 1, 450);
// Esteban
await p.evaluate(() => { const w = window.__SC.Game.scene; const pl = w.player; pl.x = 17; pl.y = 11; pl.px = 17 * 16; pl.py = 11 * 16; pl.dir = 'right'; });
await sleep(200);
await key('KeyZ', 1, 700);
await shot('f08_esteban');
for (let i = 0; i < 40 && (await scene()) !== 'BattleScene'; i++) await key('KeyZ', 1, 450);
await sleep(1400);
await key('KeyZ', 1, 900);
await shot('f09_battle_cmd');
await key('KeyZ', 1, 500);
await shot('f10_moves');
let n = 0, shotLv = false;
while ((await scene()) === 'BattleScene' && n < 140) {
  await key('KeyZ', 1, 330); n++;
  if (n === 6) await shot('f11_battle_msg');
  if (!shotLv && /niveau/.test(await topText())) { await sleep(500); await shot('f12_levelup'); shotLv = true; }
}
await sleep(900);
// resto del guion: aquí se pide el permiso de pasos
const seen = [];
for (let i = 0; i < 40 && (await busy()); i++) {
  const t = await topText();
  if (t && seen[seen.length - 1] !== t) seen.push(t);
  if (/compteur/i.test(t)) await shot('f13_steps_ready');
  await key('KeyZ', 1, 450);
}
console.log('dialogs:', seen.slice(-8));
console.log('perm granted:', await p.evaluate(() => window.__granted), ' walk:', JSON.stringify(await p.evaluate(() => window.__SC.S0().walk)));
// caminar 2,7 km (3645 pasos) y volver a la app
await p.evaluate(() => { window.__steps += 3645; document.dispatchEvent(new Event('visibilitychange')); });
await sleep(1500);
await shot('f14_walk_reward');
const seen2 = [];
for (let i = 0; i < 10 && (await busy()); i++) { const t = await topText(); if (t) seen2.push(t); await key('KeyZ', 1, 450); }
console.log('reward dialogs:', seen2);
console.log('state:', JSON.stringify(await p.evaluate(() => { const s = window.__SC.S0(); return { km: s.km, claimed: s.kmClaimed, d: s.ducados, items: s.items, walk: s.walk }; })));
// pantalla MARCHE
await key('KeyM', 1, 600);
await shot('f15_menu');
await key('ArrowDown', 2, 250);
await key('KeyZ', 1, 700);
await shot('f16_marche');
await key('KeyX', 1, 400);
await key('KeyZ', 1, 600);
await key('ArrowUp', 2, 250);
await key('KeyZ', 1, 700);
await shot('f17_profil');
await key('KeyX', 1, 400);
await key('KeyX', 1, 400);
// tope diario: caminar 20 km de golpe
await p.evaluate(() => { window.__steps += 20 * 1350; document.dispatchEvent(new Event('visibilitychange')); });
await sleep(1500);
const seen3 = [];
for (let i = 0; i < 10 && (await busy()); i++) { const t = await topText(); if (t) seen3.push(t); await key('KeyZ', 1, 450); }
console.log('cap dialogs:', seen3);
console.log('state2:', JSON.stringify(await p.evaluate(() => { const s = window.__SC.S0(); return { km: s.km, claimed: s.kmClaimed, d: s.ducados, items: s.items, dayKm: s.walk.dayKm }; })));
// combate salvaje en francés
await p.evaluate(() => { const S = window.__SC; S.startWorld(Object.assign(S.S0(), { map: 'ruta1', x: 3, y: 33, dir: 'up' }), false); });
await sleep(900);
await shot('f18_route');
await p.evaluate(() => { const w = window.__SC.Game.scene; w.runScript(W => W.wildBattle()); });
await sleep(2600);
await shot('f19_wild');
console.log('errors:', errs.length ? errs : 'none');
await b.close();
