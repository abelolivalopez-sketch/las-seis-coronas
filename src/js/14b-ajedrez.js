// ─── Misión especial: la batalla silenciosa (problema de ajedrez del sabio de Fez) ───
// Blancas juegan y dan mate en 4. Árbol comprobado con tools/chess-solve.mjs:
// cada jugada ganadora de las blancas lleva la mejor defensa de las negras ('#' = mate).
const PUZZLE = {
  fen: 'r3r2k/pp4pp/2p1Q3/2q3N1/8/8/PP4PP/7K w',
  moves: 4,
  seconds: 20,
  tree: { g5f7: { r: 'h8g8', n: { f7h6: { r: 'g8h8', n: { e6g8: { r: 'e8g8', n: { h6f7: '#' } } } } } } },
};

const PIECE_ART = {
  p: ['............', '............', '.....kk.....', '....kwwk....', '....kwsk....', '.....kk.....', '....kwwk....', '....kwsk....', '...kwwwsk...', '...kwwwsk...', '..kwwwwwsk..', '..kkkkkkkk..'],
  r: ['............', '.kk.kkkk.kk.', '.kwkkwwkkwk.', '.kwwwwwwwsk.', '..kwwwwwsk..', '...kwwwsk...', '...kwwwsk...', '...kwwwsk...', '...kwwwsk...', '..kwwwwwsk..', '.kwwwwwwwsk.', '.kkkkkkkkkk.'],
  n: ['............', '....kk.k....', '...kwwkwk...', '..kwwwwwwk..', '.kwkwwwwwsk.', 'kwwwwwwwwsk.', 'kwwkkkwwwsk.', '.kk..kwwwsk.', '....kwwwsk..', '...kwwwwsk..', '..kwwwwwwsk.', '..kkkkkkkkk.'],
  b: ['............', '.....kk.....', '....kwwk....', '...kwwkwk...', '...kwkwwk...', '...kwwwsk...', '....kwsk....', '....kwsk....', '...kwwwsk...', '..kwwwwwsk..', '.kwwwwwwwsk.', '.kkkkkkkkkk.'],
  q: ['............', '............', 'k..k.kk.k..k', 'kk.kkwwkk.kk', 'kwkwwwwwwkwk', '.kwwwwwwwwk.', '..kwwwwwsk..', '...kwwwsk...', '...kwwwsk...', '..kwwwwwsk..', '.kwwwwwwwsk.', '.kkkkkkkkkk.'],
  k: ['.....kk.....', '....kwwk....', '.....kk.....', '..kk.kk.kk..', '.kwwkwwkwwk.', '.kwwwwwwwsk.', '..kwwwwwsk..', '...kwwwsk...', '...kwwwsk...', '..kwwwwwsk..', '.kwwwwwwwsk.', '.kkkkkkkkkk.'],
};
const PIECE_PAL = {
  white: { k: '#2a2131', w: '#fbf6ea', s: '#c9bca2' },
  black: { k: '#0e0a12', w: '#544c5e', s: '#2c2634' },
};
function drawPiece(ctx, p, x, y) {
  paintRows(ctx, PIECE_ART[p.toLowerCase()], Chess.isWhite(p) ? PIECE_PAL.white : PIECE_PAL.black, Math.round(x) + 2, Math.round(y) + 2);
}

const CHESS_BX = 8, CHESS_BY = 19;
class ChessPuzzle {
  constructor(spec = PUZZLE) {
    this.spec = spec;
    this.pos = Chess.parse(spec.fen);
    this.node = spec.tree;
    this.moveNo = 1;
    this.left = spec.seconds * 1000;
    this.state = 'cover'; this.t = 0;
    this.cur = { f: 3, r: 3 }; this.sel = null; this.targets = [];
    this.anim = null; this.last = null; this.queue = [];
    this.msg = null; this.result = null; this.lastSec = spec.seconds;
  }
  sqXY(sq) { return [CHESS_BX + (sq % 8) * 16, CHESS_BY + (7 - Math.floor(sq / 8)) * 16]; }
  select(sq) {
    const p = this.pos.b[sq];
    if (this.sel !== null && this.targets.includes(sq)) { this.playerMove({ from: this.sel, to: sq }); return; }
    if (p && Chess.isWhite(p)) {
      const ms = Chess.legal(this.pos).filter(m => m.from === sq);
      if (ms.length) { this.sel = sq; this.targets = ms.map(m => m.to); Sfx.play('blip'); return; }
    }
    if (this.sel !== null) Sfx.play('back');
    this.sel = null; this.targets = [];
  }
  startAnim(m, then) {
    const piece = this.pos.b[m.from];
    this.pos = Chess.play(this.pos, m);
    this.anim = { from: m.from, to: m.to, piece, t: 0, then };
    this.last = m;
    Sfx.play(Chess.inCheck(this.pos) ? 'alert' : 'select');
  }
  playerMove(m) {
    const u = Chess.uci(m), next = this.node[u];
    this.sel = null; this.targets = [];
    this.state = 'anim';
    this.startAnim(m, () => {
      if (next === '#') { this.finish('win', { es: '¡JAQUE MATE!', fr: 'ÉCHEC ET MAT !' }); return; }
      if (!next) { this.finish('wrong', { es: 'El rey negro se escapa...', fr: 'Le roi noir s\'échappe...' }); return; }
      this.msg = Chess.inCheck(this.pos) ? { es: '¡JAQUE!', fr: 'ÉCHEC !' } : null;
      this.state = 'reply'; this.t = 0;
      this.pending = next;
    });
  }
  finish(res, text) {
    this.state = 'end'; this.t = 0; this.result = res; this.msg = text;
    Sfx.play(res === 'win' ? 'win' : 'bump');
  }
  step(dt) {
    this.t += dt;
    if (this.anim) {
      this.anim.t += dt;
      if (this.anim.t >= 200) { const a = this.anim; this.anim = null; if (a.then) a.then(); }
      return undefined;
    }
    if (this.state === 'cover') { if (this.t >= 2400) { this.state = 'play'; this.t = 0; Sfx.play('encounter'); } return undefined; }
    if (this.state === 'reply') {
      if (this.t < 520) return undefined;
      const nx = this.pending, r = nx.r;
      this.startAnim({ from: Chess.sqIndex(r.slice(0, 2)), to: Chess.sqIndex(r.slice(2, 4)) }, () => {
        this.node = nx.n; this.moveNo++; this.msg = null; this.state = 'play'; this.t = 0;
      });
      return undefined;
    }
    if (this.state === 'end') return this.t >= 1900 ? this.result : undefined;
    // turno del jugador: corre el reloj
    this.left -= dt;
    const sec = Math.ceil(this.left / 1000);
    if (sec < this.lastSec) { this.lastSec = sec; if (sec <= 5 && sec > 0) Sfx.play('blip'); }
    if (this.left <= 0) { this.left = 0; this.finish('time', { es: '¡Se acabó el tiempo!', fr: 'Le temps est écoulé !' }); return undefined; }
    for (const d of DIRS) if (Input.repeat(d)) {
      const [dx, dy] = DV[d];
      this.cur.f = clamp(this.cur.f + dx, 0, 7); this.cur.r = clamp(this.cur.r - dy, 0, 7);
    }
    if (Input.hit('a')) this.select(this.cur.r * 8 + this.cur.f);
    else if (Input.hit('b')) { if (this.sel !== null) Sfx.play('back'); this.sel = null; this.targets = []; }
    const tp = Input.tap;
    if (tp) {
      const f = Math.floor((tp.x - CHESS_BX) / 16), r = 7 - Math.floor((tp.y - CHESS_BY) / 16);
      if (f >= 0 && f < 8 && r >= 0 && r < 8) { this.cur = { f, r }; this.select(r * 8 + f); }
    }
    return undefined;
  }
  draw(ctx) {
    const BX = CHESS_BX, BY = CHESS_BY;
    rect(ctx, 0, 0, W, H, '#2a1e18');
    for (let y = 0; y < H; y += 4) rect(ctx, 0, y, W, 1, '#32241c');
    // título
    drawBox(ctx, 0, 0, W, 17);
    Font.draw(ctx, tr({ es: 'BATALLA SILENCIOSA', fr: 'BATAILLE SILENCIEUSE' }), 10, 3, 'dark');
    Font.drawRight(ctx, 'IBRAHIM', 230, 3, 'grey');
    // tablero
    rect(ctx, BX - 3, BY - 3, 134, 134, '#5a3a22'); rect(ctx, BX - 2, BY - 2, 132, 132, '#8a5a32'); rect(ctx, BX - 1, BY - 1, 130, 130, '#3a2414');
    const checkK = Chess.inCheck(this.pos) ? Chess.kingSq(this.pos.b, this.pos.w) : -1;
    for (let sq = 0; sq < 64; sq++) {
      const [x, y] = this.sqXY(sq), f = sq % 8, r = Math.floor(sq / 8);
      rect(ctx, x, y, 16, 16, (f + r) % 2 ? '#f0dcb4' : '#b4865a');
      if (this.last && (sq === this.last.from || sq === this.last.to)) rect(ctx, x, y, 16, 16, 'rgba(240,210,80,0.38)');
      if (sq === this.sel) rect(ctx, x, y, 16, 16, 'rgba(80,170,90,0.55)');
      if (sq === checkK) rect(ctx, x, y, 16, 16, 'rgba(220,50,40,0.55)');
    }
    for (let sq = 0; sq < 64; sq++) {
      const p = this.pos.b[sq];
      if (!p || (this.anim && sq === this.anim.to)) continue;
      const [x, y] = this.sqXY(sq);
      drawPiece(ctx, p, x, y);
    }
    for (const sq of this.targets) {
      const [x, y] = this.sqXY(sq);
      if (this.pos.b[sq]) { rect(ctx, x, y, 16, 2, '#3c8c48'); rect(ctx, x, y + 14, 16, 2, '#3c8c48'); rect(ctx, x, y, 2, 16, '#3c8c48'); rect(ctx, x + 14, y, 2, 16, '#3c8c48'); }
      else { rect(ctx, x + 6, y + 6, 4, 4, '#3c8c48'); rect(ctx, x + 7, y + 5, 2, 6, '#3c8c48'); rect(ctx, x + 5, y + 7, 6, 2, '#3c8c48'); }
    }
    if (this.anim) {
      const a = this.anim, k = Ease.out(Math.min(1, a.t / 200));
      const [x0, y0] = this.sqXY(a.from), [x1, y1] = this.sqXY(a.to);
      drawPiece(ctx, a.piece, x0 + (x1 - x0) * k, y0 + (y1 - y0) * k);
    }
    if (this.state === 'play' && Math.floor(Clock.t / 250) % 2 === 0) {
      const x = BX + this.cur.f * 16, y = BY + (7 - this.cur.r) * 16;
      rect(ctx, x, y, 16, 1, '#c23a3a'); rect(ctx, x, y + 15, 16, 1, '#c23a3a'); rect(ctx, x, y, 1, 16, '#c23a3a'); rect(ctx, x + 15, y, 1, 16, '#c23a3a');
    }
    for (let i = 0; i < 8; i++) {
      Font.draw(ctx, String(8 - i), 1, BY + i * 16 + 4, 'grey');
      Font.draw(ctx, 'abcdefgh'[i], BX + i * 16 + 5, BY + 129, 'grey');
    }
    // paño que tapa el tablero antes de empezar
    if (this.state === 'cover') {
      rect(ctx, BX, BY, 128, 128, '#7a2a30');
      for (let y = BY; y < BY + 128; y += 8) for (let x = BX + ((y / 8) % 2) * 4; x < BX + 128; x += 8) rect(ctx, x, y, 2, 2, '#9a3a40');
      rect(ctx, BX, BY + 60, 128, 8, '#d8a840');
      const n = 3 - Math.floor(this.t / 800);
      drawBox(ctx, BX + 44, BY + 44, 40, 40);
      Font.drawCenter(ctx, String(Math.max(1, n)), BX + 64, BY + 54, 'dark', 2);
    }
    // panel lateral
    const PX = 142, PY = 19, PW = 96;
    drawBox(ctx, PX, PY, PW, 128);
    Font.drawCenter(ctx, tr({ es: 'MATE EN 4', fr: 'MAT EN 4' }), PX + PW / 2, PY + 7, 'red');
    Font.drawCenter(ctx, tr({ es: 'Juegan blancas', fr: 'Les blancs jouent' }), PX + PW / 2, PY + 21, 'grey');
    Font.drawCenter(ctx, tr({ es: 'JUGADA', fr: 'COUP' }) + ' ' + Math.min(this.moveNo, this.spec.moves) + '/' + this.spec.moves, PX + PW / 2, PY + 37, 'dark');
    const secs = Math.ceil(this.left / 1000), danger = secs <= 5;
    Font.drawCenter(ctx, String(secs), PX + PW / 2, PY + 53, danger ? 'red' : 'dark', 2);
    const bw = PW - 20, k = this.left / (this.spec.seconds * 1000);
    rect(ctx, PX + 10, PY + 75, bw, 6, '#5a4a3a');
    rect(ctx, PX + 11, PY + 76, Math.round((bw - 2) * k), 4, danger ? '#d83a32' : k < 0.5 ? '#e0a830' : '#4aa050');
    if (this.msg) {
      const lines = Font.wrap(tr(this.msg), PW - 14);
      lines.slice(0, 3).forEach((ln, i) => Font.drawCenter(ctx, ln, PX + PW / 2, PY + 88 + i * 12, this.result === 'win' || !this.result ? 'blue' : 'red'));
    } else if (this.state === 'play') {
      const hint = this.sel === null ? { es: 'Toca una pieza', fr: 'Touche une pièce' } : { es: 'Toca su destino', fr: 'Touche sa case' };
      Font.drawCenter(ctx, tr(hint), PX + PW / 2, PY + 92, 'grey');
    } else if (this.state === 'reply') Font.drawCenter(ctx, tr({ es: 'Piensa...', fr: 'Il réfléchit...' }), PX + PW / 2, PY + 92, 'grey');
    else if (this.state === 'cover') Font.drawCenter(ctx, tr({ es: '¡Prepárate!', fr: 'Prépare-toi !' }), PX + PW / 2, PY + 92, 'grey');
  }
}

// Abre el tablero y espera el resultado: 'win', 'wrong' (jugada que no gana) o 'time'
async function playChessPuzzle(W) {
  const cp = new ChessPuzzle(PUZZLE);
  Input.clear();
  await Game.fadeOut(250);
  const res = W.ui.panel(ctx => cp.draw(ctx), dt => cp.step(dt));
  await Game.fadeIn(250);
  const r = await res;
  await Game.fadeOut(250);
  await Game.fadeIn(250);
  return r;
}
