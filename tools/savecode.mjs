// Prueba el código de partida: exportar desde el menú, borrar e importar desde el título.
import { chromium } from 'playwright';
const dir = process.argv[2] || '.';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1000, height: 760 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.addInitScript(() => { if (!sessionStorage.getItem('init')) { localStorage.setItem('seis-coronas.idioma', 'es'); sessionStorage.setItem('init', '1'); } });
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const sleep = ms => p.waitForTimeout(ms);
await p.evaluate(() => { const S = window.__SC; const st = S.newState('Inés', 'f', 'dark'); st.flags = { introDone: true, rivalDone: true, canLeave: true, blason_toledo: true, blason_fez: true }; st.blasones = 2; st.ducados = 4321; S.Game.state = st; S.startWorld(st, false); S.gainXp(S.xpFor(47) - st.player.xp); st.equip = { arma: 'florentina', armadura: 'brigantina' }; S.Game.scene.load('florencia', 16, 16, 'down'); S.Game.save(); });
await sleep(700);
const orig = await p.evaluate(() => JSON.stringify(window.__SC.S0()));
// MENÚ → CÓDIGO (5.ª opción)
await p.keyboard.press('KeyM'); await sleep(400);
for (let i = 0; i < 4; i++) { await p.keyboard.press('ArrowDown'); await sleep(120); }
await p.keyboard.press('KeyZ'); await sleep(600);
const vis = await p.evaluate(() => !document.getElementById('codeDlg').hidden);
await p.screenshot({ path: dir + '/code_export.png' });
const code = await p.inputValue('#codeText');
await p.click('#codeCopy'); await sleep(300);
const help = await p.textContent('#codeHelp');
await p.click('#codeOk'); await sleep(300);
console.log('ventana visible:', vis, '· código:', code.slice(0, 24) + '… (' + code.length + ' letras) · tras copiar:', help);
// borrar la partida y recargar
await p.evaluate(() => localStorage.removeItem('seis-coronas.partida.v1'));
await p.reload(); await p.waitForFunction(() => window.__SC); await sleep(700);
await p.keyboard.press('KeyZ'); await sleep(500);
const opts = await p.evaluate(() => { const s = window.__SC.Game.scene; const t = s.ui.stack[s.ui.stack.length - 1]; return t && t.opts; });
console.log('menú del título:', opts && opts.join(' | '));
const imp = opts.findIndex(o => /IMPORTAR/.test(o));
for (let i = 0; i < imp; i++) { await p.keyboard.press('ArrowDown'); await sleep(120); }
await p.keyboard.press('KeyZ'); await sleep(500);
// primero un código malo
await p.fill('#codeText', 'hola'); await p.click('#codeOk'); await sleep(500);
const bad = await p.evaluate(() => { const s = window.__SC.Game.scene; const t = s.ui.stack[s.ui.stack.length - 1]; return t && t.lines ? t.lines.join(' ') : ''; });
console.log('código malo →', bad);
for (let i = 0; i < 10; i++) { const busy = await p.evaluate(() => window.__SC.Game.scene.ui.busy); if (!busy) break; await p.keyboard.press('KeyZ'); await sleep(300); }
await sleep(300); await p.keyboard.press('KeyZ'); await sleep(500);
for (let i = 0; i < imp; i++) { await p.keyboard.press('ArrowDown'); await sleep(120); }
await p.keyboard.press('KeyZ'); await sleep(500);
await p.fill('#codeText', '  ' + code + '\n'); await p.screenshot({ path: dir + '/code_import.png' });
await p.click('#codeOk'); await sleep(600);
for (let i = 0; i < 6; i++) { await p.keyboard.press('KeyZ'); await sleep(300); }
await sleep(800);
const back = await p.evaluate(() => { const s = window.__SC.Game.scene; return { scene: s.constructor.name, map: s.mapId, st: window.__SC.S0() && JSON.stringify(window.__SC.S0()) }; });
const a = JSON.parse(orig), c = JSON.parse(back.st || '{}');
const same = ['ducados', 'blasones', 'map'].every(k => JSON.stringify(a[k]) === JSON.stringify(c[k])) && a.player.level === c.player.level && a.player.name === c.player.name && JSON.stringify(a.equip) === JSON.stringify(c.equip);
console.log('importada:', back.scene, back.map, '· nivel', c.player && c.player.level, '· ducados', c.ducados, '· igual que la original:', same);
console.log('errores:', errs.length ? errs : 'ninguno');
await b.close();
