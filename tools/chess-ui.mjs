// Prueba el tablero de ajedrez con toques reales en la pantalla: solución, jugada mala y tiempo agotado.
// Uso: node tools/build.mjs && node tools/chess-ui.mjs <carpeta> [es|fr]
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const lang = process.argv[3] || 'es';
const b = await chromium.launch();
const p = await (await b.newContext(process.env.MOBILE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } : { viewport: { width: 1000, height: 760 } })).newPage();
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + String(e)));
await p.addInitScript(l => { try { localStorage.setItem('seis-coronas.idioma', l); } catch (e) {} }, lang);
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const sleep = ms => p.waitForTimeout(ms);
await p.evaluate(() => { const S = window.__SC; const st = S.newState('Abel', 'm', 'light'); st.flags = { introDone: true }; S.Game.state = st; S.startWorld(st, false); });
await sleep(600);
const box = await p.locator('#screen').boundingBox();
// toca la casilla (p. ej. 'g5') de la pantalla interna de 240×160
async function tapSq(s) {
  const f = s.charCodeAt(0) - 97, r = +s[1] - 1;
  const gx = 8 + f * 16 + 8, gy = 19 + (7 - r) * 16 + 8;
  const X = box.x + gx / 240 * box.width, Y = box.y + gy / 160 * box.height;
  if (process.env.MOBILE) await p.touchscreen.tap(X, Y); else await p.mouse.click(X, Y);
  await sleep(120);
}
async function run(name, moves, waitEnd) {
  await p.evaluate(() => { const w = window.__SC.Game.scene; window.__res = undefined; w.runScript(async W => { window.__res = await window.__SC.playChessPuzzle(W); }); });
  await sleep(1300); await p.locator('#screen').screenshot({ path: `${dir}/${name}_0_tapado.png` });
  await sleep(1700);
  let i = 0;
  for (const m of moves) {
    await tapSq(m.slice(0, 2));
    if (i === 0) await p.locator('#screen').screenshot({ path: `${dir}/${name}_1_seleccion.png` });
    await tapSq(m.slice(2, 4));
    i++;
    await sleep(1100);
    if (i === 2) await p.locator('#screen').screenshot({ path: `${dir}/${name}_2_jugada${i}.png` });
  }
  if (waitEnd) await sleep(waitEnd);
  await sleep(400); await p.locator('#screen').screenshot({ path: `${dir}/${name}_3_final.png` });
  for (let k = 0; k < 60; k++) { const r = await p.evaluate(() => window.__res); if (r) return r; await sleep(100); }
  return 'sin resultado';
}
const r1 = await run('solucion', ['g5f7', 'f7h6', 'e6g8', 'h6f7']);
const r2 = await run('mala', ['e6e8']);
const r3 = await run('tiempo', ['g5f7'], 21000);
console.log('solución →', r1, '· jugada mala →', r2, '· tiempo →', r3);
console.log('errores:', errs.length ? errs : 'ninguno');
await b.close();
if (r1 !== 'win' || r2 !== 'wrong' || r3 !== 'time') process.exit(1);
