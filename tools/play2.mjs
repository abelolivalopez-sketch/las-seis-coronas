// Prueba 2: entrenador Martín, objetos, derrota y continuar partida.
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1000, height: 800 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + String(e)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts/.test(m.text())) errs.push(m.text()); });
const url = 'file://' + process.cwd() + '/dist/index.html?debug';
await p.goto(url);
await p.waitForFunction(() => window.__SC);
const sleep = ms => p.waitForTimeout(ms);
const key = async (k, n = 1, gap = 300) => { for (let i = 0; i < n; i++) { await p.keyboard.press(k); await sleep(gap); } };
const shot = async name => { await p.locator('#screen').screenshot({ path: `${dir}/${name}.png` }); };
const scene = () => p.evaluate(() => window.__SC.Game.scene.constructor.name);
const busy = () => p.evaluate(() => { const s = window.__SC.Game.scene; return !!(s.busy || (s.ui && s.ui.busy)); });
const info = () => p.evaluate(() => { const S = window.__SC; return { scene: S.Game.scene.constructor.name, map: S.S0().map, x: S.S0().x, y: S.S0().y, lv: S.P().level, hp: S.P().hp, max: S.P().maxHp, d: S.S0().ducados, items: S.S0().items, flags: S.S0().flags, moves: S.P().moves.map(m => m.id) }; });

await p.evaluate(() => {
  const S = window.__SC;
  const st = S.newState('Inés', 'f', 'light');
  st.flags = { introDone: true, rivalDone: true, canLeave: true };
  st.items.hogaza = 3;
  const pl = st.player; pl.level = 4; Object.assign(pl, S.calcStats(S.PLAYER_BASE, 4)); pl.hp = pl.maxHp; pl.xp = 120;
  pl.moves.push({ id: 'estocada', pp: 25 });
  st.map = 'ruta1'; st.x = 6; st.y = 21; st.dir = 'up';
  S.startWorld(st, false);
});
await sleep(900);
await shot('q01_ruta_start');
await p.keyboard.down('ArrowUp'); await sleep(1400); await p.keyboard.up('ArrowUp');
await sleep(500);
await shot('q02_martin_seen');
for (let i = 0; i < 20 && (await scene()) !== 'BattleScene'; i++) await key('KeyZ', 1, 400);
await sleep(1400);
await shot('q03_martin_battle');
let n = 0, lvShot = false;
while ((await scene()) === 'BattleScene' && n < 160) {
  await key('KeyZ', 1, 330); n++;
  const t = await p.evaluate(() => { const s = window.__SC.Game.scene; const top = s.ui.stack[s.ui.stack.length - 1]; return top && top.lines ? top.lines.join(' ') : ''; });
  if (!lvShot && /nivel/.test(t)) { await sleep(700); await shot('q04_levelup'); lvShot = true; }
}
await sleep(600);
for (let i = 0; i < 10 && (await busy()); i++) await key('KeyZ', 1, 400);
console.log('after martin', JSON.stringify(await info()));
// usar hogaza desde el menú
await p.evaluate(() => { window.__SC.P().hp = 5; });
await key('KeyM', 1, 500); await key('ArrowDown', 1, 250); await key('KeyZ', 1, 500);
await shot('q05_items');
await key('KeyZ', 1, 900); await shot('q06_use');
await key('KeyZ', 1, 600); await key('KeyZ', 1, 900);
await shot('q07_healed');
for (let i = 0; i < 6 && (await busy()); i++) await key('KeyX', 1, 350);
console.log('after item', JSON.stringify(await info()));
// derrota
await p.evaluate(() => { const S = window.__SC; S.P().hp = 1; S.startWorld(Object.assign(S.S0(), { map: 'ruta1', x: 3, y: 33, dir: 'up' }), false); });
await sleep(800);
await p.evaluate(() => { const w = window.__SC.Game.scene; w.runScript(W => W.wildBattle()); });
await sleep(2400);
n = 0;
while ((await scene()) === 'BattleScene' && n < 80) { await key('KeyZ', 1, 350); n++; }
await sleep(1500);
await shot('q08_after_lose');
for (let i = 0; i < 6 && (await busy()); i++) await key('KeyZ', 1, 450);
console.log('after lose', JSON.stringify(await info()));
// continuar partida
await p.reload();
await p.waitForFunction(() => window.__SC);
await sleep(700);
if ((await scene()) === 'LangScene') await key('KeyZ', 1, 900);
await key('KeyZ', 1, 700);
await shot('q09_continue_menu');
await key('KeyZ', 1, 1200);
await shot('q10_continued');
console.log('continued', JSON.stringify(await info()));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
