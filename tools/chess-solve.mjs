// Comprueba un problema de ajedrez (mate en N) con las mismas reglas del juego
// y genera el árbol de jugadas ganadoras con la mejor defensa del rival.
// Uso: node tools/chess-solve.mjs "<fen>" <n> [jugadas preferidas del rival, separadas por comas]
import fs from 'fs';
const src = fs.readFileSync(new URL('../src/js/14a-ajedrez-reglas.js', import.meta.url), 'utf8');
const Chess = new Function(src + '; return Chess;')();
const fen = process.argv[2], N = Number(process.argv[3] || 4);
const prefer = (process.argv[4] || '').split(',').filter(Boolean);
const memo = new Map();
let nodes = 0;
function order(pos, ms) {
  // primero los jaques y las capturas: así se encuentra antes el mate
  return ms.map(m => { const q = Chess.play(pos, m); return { m, q, c: Chess.inCheck(q) ? 0 : pos.b[m.to] ? 1 : 2 }; }).sort((a, b) => a.c - b.c);
}
// ¿pueden las blancas (que mueven) dar mate en n jugadas o menos?
function mateIn(pos, n) {
  const key = Chess.fen(pos) + n;
  if (memo.has(key)) return memo.get(key);
  nodes++;
  let res = false;
  for (const { q } of order(pos, Chess.legal(pos))) {
    const replies = Chess.legal(q);
    if (!replies.length) { if (Chess.inCheck(q)) { res = true; break; } continue; }
    if (n === 1) continue;
    if (replies.every(r => mateIn(Chess.play(q, r), n - 1))) { res = true; break; }
  }
  memo.set(key, res);
  return res;
}
const depth = (pos, max) => { for (let k = 1; k <= max; k++) if (mateIn(pos, k)) return k; return Infinity; };
function tree(pos, n) {
  const node = {};
  for (const m of Chess.legal(pos)) {
    const q = Chess.play(pos, m), replies = Chess.legal(q);
    if (!replies.length) { if (Chess.inCheck(q)) node[Chess.uci(m)] = '#'; continue; }
    if (n === 1 || !replies.every(r => mateIn(Chess.play(q, r), n - 1))) continue;
    // la mejor defensa: la que más tarda en recibir el mate
    let best = null, bestD = -1;
    for (const r of replies) {
      const d = depth(Chess.play(q, r), n - 1);
      const u = Chess.uci(r);
      if (d > bestD || (d === bestD && prefer.includes(u))) { best = r; bestD = d; }
    }
    node[Chess.uci(m)] = { r: Chess.uci(best), d: bestD, n: tree(Chess.play(q, best), n - 1) };
  }
  return node;
}
const pos = Chess.parse(fen);
const t0 = Date.now();
const shortest = depth(pos, N);
console.log('mate más corto:', shortest, 'jugadas · nodos', nodes, '·', Date.now() - t0, 'ms');
if (shortest > N) process.exit(1);
const T = tree(pos, N);
const count = o => (typeof o === 'string' ? 1 : Object.values(o).reduce((a, v) => a + (v === '#' ? 1 : 1 + count(v.n)), 0));
console.log('jugadas ganadoras en la raíz:', Object.keys(T).join(' '), '· tamaño del árbol', count(T));
const line = (node, s = '') => { const ks = Object.keys(node); if (!ks.length) return s; const k = ks[0], v = node[k]; return v === '#' ? s + k + '#' : line(v.n, s + k + ' ' + v.r + ' | '); };
for (const k of Object.keys(T)) console.log(' ', line({ [k]: T[k] }));
const strip = o => { const r = {}; for (const k in o) r[k] = o[k] === '#' ? '#' : { r: o[k].r, n: strip(o[k].n) }; return r; };
fs.writeFileSync(process.env.OUT || '/dev/null', JSON.stringify(strip(T)));
