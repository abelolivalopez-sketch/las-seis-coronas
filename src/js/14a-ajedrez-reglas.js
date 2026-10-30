// ─── Ajedrez: reglas del tablero (sin enroque ni captura al paso: no hacen falta en el problema) ───
// Casillas 0-63: índice = fila * 8 + columna (a1 = 0, h8 = 63). Piezas: PNBRQK blancas, pnbrqk negras.
const Chess = {
  parse(fen) {
    const [placement, side] = fen.split(' ');
    const b = new Array(64).fill(null);
    placement.split('/').forEach((row, i) => {
      let f = 0;
      for (const ch of row) { if (ch >= '1' && ch <= '8') f += +ch; else { b[(7 - i) * 8 + f] = ch; f++; } }
    });
    return { b, w: side !== 'b' };
  },
  fen(pos) {
    const rows = [];
    for (let r = 7; r >= 0; r--) {
      let s = '', e = 0;
      for (let f = 0; f < 8; f++) { const p = pos.b[r * 8 + f]; if (!p) e++; else { if (e) s += e; e = 0; s += p; } }
      rows.push(s + (e || ''));
    }
    return rows.join('/') + (pos.w ? ' w' : ' b');
  },
  isWhite: p => !!p && p === p.toUpperCase(),
  sqName: i => 'abcdefgh'[i % 8] + (Math.floor(i / 8) + 1),
  sqIndex: s => (s.charCodeAt(1) - 49) * 8 + (s.charCodeAt(0) - 97),
  uci: m => Chess.sqName(m.from) + Chess.sqName(m.to),
  KN: [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]],
  KG: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
  // ¿está la casilla sq atacada por el bando byWhite?
  attacked(b, sq, byWhite) {
    const f = sq % 8, r = Math.floor(sq / 8);
    const own = p => p && Chess.isWhite(p) === byWhite;
    const at = (ff, rr) => (ff < 0 || ff > 7 || rr < 0 || rr > 7 ? undefined : b[rr * 8 + ff]);
    const dir = byWhite ? -1 : 1;                       // los peones blancos atacan hacia arriba
    for (const df of [-1, 1]) { const p = at(f + df, r + dir); if (own(p) && p.toLowerCase() === 'p') return true; }
    for (const [df, dr] of Chess.KN) { const p = at(f + df, r + dr); if (own(p) && p.toLowerCase() === 'n') return true; }
    for (const [df, dr] of Chess.KG) { const p = at(f + df, r + dr); if (own(p) && p.toLowerCase() === 'k') return true; }
    for (const [df, dr] of Chess.KG) {
      const diag = df !== 0 && dr !== 0;
      for (let k = 1; k < 8; k++) {
        const p = at(f + df * k, r + dr * k);
        if (p === undefined) break;
        if (!p) continue;
        if (own(p)) { const t = p.toLowerCase(); if (t === 'q' || (diag ? t === 'b' : t === 'r')) return true; }
        break;
      }
    }
    return false;
  },
  kingSq(b, white) { const k = white ? 'K' : 'k'; return b.indexOf(k); },
  inCheck(pos) { const k = Chess.kingSq(pos.b, pos.w); return k >= 0 && Chess.attacked(pos.b, k, !pos.w); },
  pseudo(pos) {
    const { b, w } = pos, out = [];
    const mine = p => p && Chess.isWhite(p) === w, theirs = p => p && Chess.isWhite(p) !== w;
    for (let sq = 0; sq < 64; sq++) {
      const p = b[sq];
      if (!mine(p)) continue;
      const t = p.toLowerCase(), f = sq % 8, r = Math.floor(sq / 8);
      const add = (ff, rr) => { const to = rr * 8 + ff; out.push({ from: sq, to }); };
      const inside = (ff, rr) => ff >= 0 && ff < 8 && rr >= 0 && rr < 8;
      if (t === 'p') {
        const d = w ? 1 : -1, start = w ? 1 : 6;
        if (inside(f, r + d) && !b[(r + d) * 8 + f]) {
          add(f, r + d);
          if (r === start && !b[(r + 2 * d) * 8 + f]) add(f, r + 2 * d);
        }
        for (const df of [-1, 1]) if (inside(f + df, r + d) && theirs(b[(r + d) * 8 + f + df])) add(f + df, r + d);
      } else if (t === 'n' || t === 'k') {
        for (const [df, dr] of t === 'n' ? Chess.KN : Chess.KG) if (inside(f + df, r + dr) && !mine(b[(r + dr) * 8 + f + df])) add(f + df, r + dr);
      } else {
        for (const [df, dr] of Chess.KG) {
          const diag = df !== 0 && dr !== 0;
          if (t === 'b' && !diag) continue;
          if (t === 'r' && diag) continue;
          for (let k = 1; k < 8; k++) {
            const ff = f + df * k, rr = r + dr * k;
            if (!inside(ff, rr)) break;
            const q = b[rr * 8 + ff];
            if (mine(q)) break;
            add(ff, rr);
            if (q) break;
          }
        }
      }
    }
    return out;
  },
  play(pos, m) {
    const b = pos.b.slice();
    let p = b[m.from];
    const r = Math.floor(m.to / 8);
    if (p === 'P' && r === 7) p = 'Q';
    if (p === 'p' && r === 0) p = 'q';
    b[m.to] = p; b[m.from] = null;
    return { b, w: !pos.w };
  },
  legal(pos) {
    return Chess.pseudo(pos).filter(m => {
      const q = Chess.play(pos, m);
      const k = Chess.kingSq(q.b, pos.w);
      return k >= 0 && !Chess.attacked(q.b, k, !pos.w);
    });
  },
  isMate(pos) { return Chess.inCheck(pos) && Chess.legal(pos).length === 0; },
};
