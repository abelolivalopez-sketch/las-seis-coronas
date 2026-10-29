// ─── Estado de la partida y guardado local ────────────────────────────────
const SAVE_KEY = 'seis-coronas.partida.v1';
const Save = {
  exists() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } },
  read() { try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
  write(st) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(st)); return true; } catch (e) { return false; } },
  clear() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nada */ } },
};

function newState(name, gender, skin) {
  const L = 3;
  const p = { name, gender, skin, level: L, xp: xpFor(L), ...calcStats(PLAYER_BASE, L), moves: [] };
  p.hp = p.maxHp;
  for (const lv in LEARN) if (Number(lv) <= L) for (const m of LEARN[lv]) p.moves.push({ id: m, pp: MOVES[m].pp });
  return {
    v: 1, player: p, ducados: 100, items: { hogaza: 0, unguento: 0 }, flags: {},
    map: 'villaolivo', x: 5, y: 17, dir: 'down',
    km: 0, kmClaimed: 0, steps: 0, blasones: 0, wins: 0,
    walk: { boot: 0, last: -1, total: 0, day: '', dayKm: 0 },
    equip: { arma: 'espada_corta', armadura: null },
    respawn: null,
  };
}
// Partidas guardadas con versiones anteriores
function migrateState(s) {
  if (!s.walk) s.walk = { boot: 0, last: -1, total: 0, day: '', dayKm: 0 };
  if (!s.equip) s.equip = { arma: 'espada_corta', armadura: null };
  if (s.respawn === undefined) s.respawn = null;
  if (!s.items) s.items = {};
  if (s.blasones === undefined) s.blasones = 0;
  if (s.map && !MAPS[s.map]) { s.map = 'villaolivo'; s.x = 5; s.y = 17; s.dir = 'down'; }
  return s;
}

const S0 = () => Game.state;
const P = () => Game.state.player;
const isF = () => Game.state && Game.state.player.gender === 'f';
const rivalName = () => (isF() ? 'Diego' : 'Leonor');
const rivalLook = () => (isF() ? 'rival_m' : 'rival_f');
const playerLook = () => `player_${P().gender}_${P().skin}`;
const motherLook = () => `mother_${P().skin}`;

const TOKENS = {
  es: { esc: ['escudero', 'escudera'], Esc: ['Escudero', 'Escudera'], ESC: ['ESCUDERO', 'ESCUDERA'], o: ['o', 'a'], e: ['', ''], cab: ['caballero', 'caballero'], el: ['el', 'la'], El: ['El', 'La'], un: ['un', 'una'], CAB: ['CABALLERO', 'CABALLERA'], Cab: ['Caballero', 'Caballera'], TUEUR: ['MATAGIGANTES', 'MATAGIGANTES'], Tueur: ['Matagigantes', 'Matagigantes'] },
  fr: { esc: ['écuyer', 'écuyère'], Esc: ['Écuyer', 'Écuyère'], ESC: ['ÉCUYER', 'ÉCUYÈRE'], o: ['', 'e'], e: ['', 'e'], cab: ['chevalier', 'chevalière'], el: ['le', 'la'], El: ['Le', 'La'], un: ['un', 'une'], CAB: ['CHEVALIER', 'CHEVALIÈRE'], Cab: ['Chevalier', 'Chevalière'], TUEUR: ['TUEUR', 'TUEUSE'], Tueur: ['Tueur', 'Tueuse'] },
};
function fmt(text) {
  let s = tr(text);
  const st = Game.state;
  if (!st) return s;
  const p = st.player, g = p.gender === 'f' ? 1 : 0;
  const tok = TOKENS[Lang.cur] || TOKENS.es;
  s = s.replace(/\{name\}/g, p.name).replace(/\{NAME\}/g, p.name.toUpperCase())
    .replace(/\{rival\}/g, rivalName()).replace(/\{RIVAL\}/g, rivalName().toUpperCase());
  for (const k in tok) s = s.split('{' + k + '}').join(tok[k][g]);
  return s;
}

function healPlayer() {
  const p = P();
  p.hp = p.maxHp;
  for (const m of p.moves) m.pp = MOVES[m.id].pp;
}

// Sube de nivel y devuelve los cambios (para mostrarlos)
function gainXp(amount) {
  const p = P();
  const events = [];
  if (p.level >= MAX_LV) return events;
  p.xp += amount;
  while (p.level < MAX_LV && p.xp >= xpFor(p.level + 1)) {
    const before = { maxHp: p.maxHp, atk: p.atk, def: p.def, spd: p.spd };
    p.level++;
    const st = calcStats(PLAYER_BASE, p.level);
    p.hp += st.maxHp - p.maxHp;
    Object.assign(p, st);
    const learned = [];
    for (const m of LEARN[p.level] || []) {
      if (p.moves.find(x => x.id === m)) continue;
      if (p.moves.length < 4) { p.moves.push({ id: m, pp: MOVES[m].pp }); learned.push({ m }); }
      else learned.push({ m, full: true });     // el combate pregunta qué técnica olvidar
    }
    events.push({ level: p.level, gains: { maxHp: p.maxHp - before.maxHp, atk: p.atk - before.atk, def: p.def - before.def, spd: p.spd - before.spd }, learned });
  }
  if (p.level >= MAX_LV) p.xp = xpFor(MAX_LV);
  return events;
}
