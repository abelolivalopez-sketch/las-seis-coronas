// ─── Herramientas para los mapas: dibujos de texto, entrenadores, edificios ───
// Mapa dibujado con texto: cada carácter es una casilla (ver la leyenda en 10-world.js)
function asciiMap(rows) {
  const w = Math.max(...rows.map(r => r.length));
  const g = rows.map(r => r.padEnd(w, '.').split(''));
  g.ragged = rows.map((r, i) => (r.length !== w ? i : -1)).filter(i => i >= 0);
  // los olivos ocupan bloques de 2×2 alineados en casillas pares
  for (let j = 0; j < g.length; j++) for (let i = 0; i < w; i++) if (g[j][i] === 'T') {
    const bi = i - (i % 2), bj = j - (j % 2);
    for (const [a, b] of [[bi, bj], [bi + 1, bj], [bi, bj + 1], [bi + 1, bj + 1]]) if (g[b] && g[b][a] !== undefined) g[b][a] = 'T';
  }
  return g;
}

// Título de un enemigo en los dos idiomas ("MARINERO" / "MARIN")
function bothLang(x) { return typeof x === 'string' ? { es: x, fr: x } : x; }

// Entrenador: te ve desde lejos, se acerca y te reta. Una vez vencido, solo habla.
// o: id, look, x, y, dir, range, foe, level, name, title, intro, lose, win, after, post, bg, gold, cond, wander
function trainer(o) {
  const flag = o.flag || 'tr_' + o.id;
  const title = bothLang(o.title || FOES[o.foe].name);
  const full = o.name ? { es: title.es + ' ' + o.name, fr: title.fr + ' ' + o.name } : title;
  return {
    id: o.id, look: o.look, x: o.x, y: o.y, dir: o.dir || 'down', cond: o.cond, spec: o,
    trainer: { range: o.range ?? 4, flag },
    talk: async (W, e) => {
      if (W.flag(flag)) { await W.say(o.after || o.lose); return; }
      e.dir = W.dirTo(e, W.player); W.player.dir = W.dirTo(W.player, e);
      if (o.intro) await W.say(o.intro);
      const res = await W.battle({ foe: o.foe, level: o.level, look: o.look, trainer: full, name: o.name ? o.name.toUpperCase() : undefined,
        canLose: false, canFlee: false, defeatText: o.lose, winText: o.win, bg: o.bg, gold: o.gold });
      if (res === 'win') {
        W.flag(flag, true);
        if (o.post) await o.post(W, e);
      }
    },
  };
}

// Personaje que solo habla
function talker(id, look, x, y, dir, text, extra = {}) {
  return Object.assign({ id, look, x, y, dir, text }, extra);
}

// Edificios con letrero: posada, tienda, armería
function innHouse(x, y, o = {}) {
  return { type: 'house', x, y, w: 5, h: 4, o: Object.assign({ door: 2, windows: [0, 3.6], frame: '#3a70c0', sign: 'bed' }, o), run: W => W.inn() };
}
function shopHouse(x, y, stock, greet, o = {}) {
  return { type: 'house', x, y, w: 5, h: 4, o: Object.assign({ door: 2, windows: [0, 3.6], frame: '#3d8c58', sign: 'bag' }, o), run: W => W.shop(stock, greet) };
}
function armoryHouse(x, y, stock, greet, o = {}) {
  return { type: 'house', x, y, w: 5, h: 4, o: Object.assign({ door: 2, windows: [0, 3.6], frame: '#7a7a8a', sign: 'sword', plinth: '#6a6470' }, o), run: W => W.shop(stock, greet) };
}
function plainHouse(x, y, text, o = {}) {
  return { type: 'house', x, y, w: 5, h: 4, o: Object.assign({ door: 2, windows: [0, 3.6] }, o), doorText: text || { es: 'La puerta está cerrada.', fr: 'La porte est fermée.' } };
}
function signAt(x, y, text) { return { type: 'sign', x, y, text }; }

// Saludos de tienda
const GREET = {
  shop: { es: '¡Bienvenid{o}! Tengo pan, ungüentos y remedios para el camino.', fr: 'Bienvenue ! J\'ai du pain, des onguents et des remèdes pour la route.' },
  armory: { es: '¡Bienvenid{o} a la armería! Un buen acero salva vidas.', fr: 'Bienvenue à l\'armurerie ! Un bon acier sauve des vies.' },
};

// Mensaje genérico para mapas de interior: salida por la puerta de abajo
function exitDown(x, y, to) { return { x, y, dir: 'down', to }; }

// Misiones especiales: una sola oportunidad. Si fallas, se cierran para siempre (pero puedes seguir jugando).
async function closeSpecialQuest(W, flag) {
  W.flag(flag, true);
  Sfx.play('bump');
  await W.say({ es: 'La misión especial se ha cerrado para siempre.', fr: 'La mission spéciale est fermée pour toujours.' }, { color: 'blue' });
  Game.save();
}
