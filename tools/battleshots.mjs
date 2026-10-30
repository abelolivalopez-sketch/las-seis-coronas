// Capturas del inicio de combate contra varios enemigos (para revisar el arte).
// Uso: node tools/battleshots.mjs <carpeta> foe:fondo[:look] ...
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const list = process.argv.slice(3);
const b = await chromium.launch();
const errs = [];
for (const spec of list) {
  const [foe, bg, look] = spec.split(':');
  const p = await (await b.newContext({ viewport: { width: 1000, height: 760 } })).newPage();
  p.on('pageerror', e => errs.push(foe + ': ' + String(e)));
  await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
  await p.waitForFunction(() => window.__SC);
  await p.evaluate(([foe, bg, look]) => {
    const S = window.__SC; const st = S.newState('Abel', 'm', 'light'); st.flags = { introDone: true }; S.Game.state = st; S.startWorld(st, false);
    S.gainXp(S.xpFor(60) - st.player.xp); S.healPlayer();
    const w = S.Game.scene;
    w.runScript(W => W.battle({ foe, level: 60, bg, look: look || undefined, trainer: look ? 'TEST' : undefined, canLose: true }));
  }, [foe, bg, look]);
  await p.waitForTimeout(3600);
  await p.locator('#screen').screenshot({ path: `${dir}/b_${foe}_${bg}.png` });
  await p.close();
}
console.log('errores:', errs.length ? errs : 'ninguno');
await b.close();
