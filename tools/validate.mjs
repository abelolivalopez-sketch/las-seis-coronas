// Revisa todos los mapas: conexiones, puertas, personajes alcanzables, entrenadores y objetos.
// Uso: node tools/build.mjs && node tools/validate.mjs
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + process.cwd() + '/dist/index.html?debug');
await p.waitForFunction(() => window.__SC);
const report = await p.evaluate(() => {
  const S = window.__SC, M = S.MAPS, out = [];
  const grids = {};
  for (const id in M) { try { grids[id] = M[id].build(); } catch (e) { out.push(`${id}: build falla: ${e}`); } }
  const DV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const objMap = (def) => {
    const m = {};
    for (const o of def.objects || []) {
      const free = new Set((o.walk || []).map(([a, b]) => a + ',' + b));
      for (let j = 0; j < (o.h || 1); j++) for (let i = 0; i < (o.w || 1); i++) if (!free.has(i + ',' + j)) m[(o.x + i) + ',' + (o.y + j)] = o;
    }
    return m;
  };
  // entradas a cada mapa desde otros mapas
  const entries = {};
  const addE = (m, x, y, why) => { (entries[m] = entries[m] || []).push([x, y, why]); };
  for (const id in M) {
    const def = M[id];
    for (const o of def.objects || []) if (o.enter) addE(o.enter.map, o.enter.x, o.enter.y, 'puerta de ' + id);
    for (const e of def.exits || []) addE(e.to.map, e.to.x, e.to.y, 'salida de ' + id);
    for (const [x, y] of def.entry || []) addE(id, x, y, 'entrada');
  }
  for (const id in M) {
    const def = M[id], g = grids[id];
    if (!g) continue;
    const h = g.length, w = g[0].length;
    if (g.ragged && g.ragged.length) out.push(`${id}: filas con otro ancho: ${g.ragged.join(', ')}`);
    const objs = objMap(def);
    const npcAt = {};
    for (const n of def.npcs || []) npcAt[n.x + ',' + n.y] = n;
    const tile = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? null : g[y][x]);
    const walk = (x, y) => { const c = tile(x, y); return c !== null && !S.BLOCK.includes(c) && !objs[x + ',' + y]; };
    const free = (x, y) => walk(x, y) && !npcAt[x + ',' + y] && !(def.items || []).some(it => it.x === x && it.y === y);
    // anchos de fila
    // conexiones por los bordes
    const starts = [];
    for (const d in def.conn || {}) {
      const c = def.conn[d], tg = grids[c.map];
      if (!M[c.map]) { out.push(`${id}: conn ${d} a mapa inexistente ${c.map}`); continue; }
      const th = tg.length, tw = tg[0].length;
      const tdef = M[c.map], tobjs = objMap(tdef);
      const twalk = (x, y) => x >= 0 && y >= 0 && x < tw && y < th && !S.BLOCK.includes(tg[y][x]) && !tobjs[x + ',' + y];
      let any = false;
      if (d === 'up' || d === 'down') {
        const y = d === 'up' ? 0 : h - 1, ty = d === 'up' ? th - 1 : 0;
        for (let x = 0; x < w; x++) if (walk(x, y)) {
          any = true; starts.push([x, y]);
          const tx = x + (c.dx || 0);
          if (!twalk(tx, ty)) out.push(`${id}: borde ${d} en x=${x} lleva a ${c.map} (${tx},${ty}) que está bloqueado`);
        }
      } else {
        const x = d === 'left' ? 0 : w - 1, tx = d === 'left' ? tw - 1 : 0;
        for (let y = 0; y < h; y++) if (walk(x, y)) {
          any = true; starts.push([x, y]);
          const ty = y + (c.dy || 0);
          if (!twalk(tx, ty)) out.push(`${id}: borde ${d} en y=${y} lleva a ${c.map} (${tx},${ty}) que está bloqueado`);
        }
      }
      if (!any) out.push(`${id}: conn ${d} sin casillas abiertas en el borde`);
      // vuelta
      const back = { up: 'down', down: 'up', left: 'right', right: 'left' }[d];
      if (!(tdef.conn && tdef.conn[back] && tdef.conn[back].map === id)) out.push(`${id}: conn ${d} → ${c.map} sin conexión de vuelta (${back})`);
    }
    // bordes abiertos sin conexión
    for (const [d, test] of [['up', (x) => walk(x, 0)], ['down', (x) => walk(x, h - 1)]]) {
      if (def.conn && def.conn[d]) continue;
      for (let x = 0; x < w; x++) if (test(x) && !(def.edgeOk)) { out.push(`${id}: borde ${d} abierto en x=${x} sin conexión`); break; }
    }
    for (const [d, test] of [['left', (y) => walk(0, y)], ['right', (y) => walk(w - 1, y)]]) {
      if (def.conn && def.conn[d]) continue;
      for (let y = 0; y < h; y++) if (test(y) && !(def.edgeOk)) { out.push(`${id}: borde ${d} abierto en y=${y} sin conexión`); break; }
    }
    for (const [x, y, why] of entries[id] || []) {
      if (!walk(x, y)) out.push(`${id}: entrada (${x},${y}) [${why}] bloqueada`);
      starts.push([x, y]);
    }
    if (id === 'villaolivo') starts.push([5, 17]);
    // alcance
    const seen = new Set();
    const q = starts.filter(([x, y]) => walk(x, y)).map(a => a.slice());
    for (const [x, y] of q) seen.add(x + ',' + y);
    while (q.length) {
      const [x, y] = q.shift();
      for (const d in DV) {
        const nx = x + DV[d][0], ny = y + DV[d][1], k = nx + ',' + ny;
        if (seen.has(k) || !free(nx, ny)) continue;
        seen.add(k); q.push([nx, ny]);
      }
    }
    const near = (x, y) => Object.values(DV).some(([dx, dy]) => seen.has((x + dx) + ',' + (y + dy)));
    if (!starts.length) out.push(`${id}: sin entradas`);
    for (const n of def.npcs || []) {
      if (!walk(n.x, n.y)) out.push(`${id}: NPC ${n.id} en casilla bloqueada (${n.x},${n.y}) '${tile(n.x, n.y)}'`);
      if (typeof n.look === 'string' && !S.LOOKS[n.look]) out.push(`${id}: NPC ${n.id} con aspecto inexistente ${n.look}`);
      if (!near(n.x, n.y) && !n.noReach) out.push(`${id}: NPC ${n.id} (${n.x},${n.y}) inalcanzable`);
    }
    for (const it of def.items || []) {
      if (!walk(it.x, it.y)) out.push(`${id}: objeto ${it.id} en casilla bloqueada`);
      if (!S.ITEMS[it.item]) out.push(`${id}: objeto ${it.id} desconocido ${it.item}`);
      if (!near(it.x, it.y)) out.push(`${id}: objeto ${it.id} (${it.x},${it.y}) inalcanzable`);
    }
    for (const o of def.objects || []) {
      if (o.x < 0 || o.y < 0 || o.x + (o.w || 1) > w || o.y + (o.h || 1) > h) out.push(`${id}: objeto ${o.type} fuera del mapa`);
      const dc = S.doorCols(o);
      if (dc.length && (o.run || o.enter || o.doorText)) {
        const dx = o.x + dc[0], dy = o.y + (o.h || 1);
        if (!seen.has(dx + ',' + dy)) out.push(`${id}: puerta de ${o.type} en (${o.x},${o.y}) sin acceso por (${dx},${dy})`);
      } else if (o.text || o.run) {
        let ok = false;
        for (let j = 0; j < (o.h || 1); j++) for (let i = 0; i < (o.w || 1); i++) if (near(o.x + i, o.y + j)) ok = true;
        if (!ok) out.push(`${id}: ${o.type} en (${o.x},${o.y}) inalcanzable`);
      }
      if (o.enter && !M[o.enter.map]) out.push(`${id}: puerta a mapa inexistente ${o.enter.map}`);
    }
    for (const e of def.exits || []) {
      if (!seen.has(e.x + ',' + e.y)) out.push(`${id}: salida (${e.x},${e.y}) inalcanzable`);
      if (!M[e.to.map]) out.push(`${id}: salida a mapa inexistente ${e.to.map}`);
    }
    for (const t of def.triggers || []) if (!seen.has(t.x + ',' + t.y)) out.push(`${id}: disparador (${t.x},${t.y}) inalcanzable`);
    for (const wd of def.wild || []) if (!S.FOES[wd.id]) out.push(`${id}: salvaje desconocido ${wd.id}`);
    if (def.wild && !g.some(r => r.some(c => (def.wildOn || ',').includes(c)))) out.push(`${id}: tiene salvajes pero no casillas donde salgan`);
    for (const n of def.npcs || []) if (n.trainer) {
      // el entrenador debe poder ver al menos una casilla libre
      const [dx, dy] = DV[n.dir || 'down'];
      if (!free(n.x + dx, n.y + dy) && !walk(n.x + dx, n.y + dy)) out.push(`${id}: entrenador ${n.id} mira a una pared`);
    }
  }
  return { out, count: Object.keys(M).length };
});
console.log(`${report.count} mapas revisados`);
console.log(report.out.length ? report.out.join('\n') : 'Todo correcto');
console.log('errores de la página:', errs.length ? errs : 'ninguno');
await b.close();
