// ─── Datos de juego: técnicas, enemigos, objetos, niveles ─────────────────
const MAX_LV = 150;
const PLAYER_BASE = { hp: 60, atk: 56, def: 52, spd: 54 };

const MOVES = {
  tajo: { name: { es: 'TAJO', fr: 'ENTAILLE' }, pow: 40, acc: 100, pp: 35 },
  grito: { name: { es: 'GRITO DE GUERRA', fr: 'CRI DE GUERRE' }, pow: 0, acc: 0, pp: 20, self: { atk: 1 } },
  estocada: { name: { es: 'ESTOCADA', fr: 'ESTOCADE' }, pow: 60, acc: 95, pp: 25 },
  escudo: { name: { es: 'ESCUDO EN ALTO', fr: 'BOUCLIER LEVÉ' }, pow: 0, acc: 0, pp: 20, self: { def: 1 } },
  mandoble: { name: { es: 'MANDOBLE', fr: 'FENDANT' }, pow: 80, acc: 90, pp: 15 },
  embestida: { name: { es: 'EMBESTIDA', fr: 'CHARGE' }, pow: 40, acc: 100, pp: 35 },
  colmillazo: { name: { es: 'COLMILLAZO', fr: 'COUP DE BOUTOIR' }, pow: 55, acc: 90, pp: 20 },
  grunido: { name: { es: 'GRUÑIDO', fr: 'GROGNEMENT' }, pow: 0, acc: 100, pp: 30, foe: { atk: -1 } },
  mordisco: { name: { es: 'MORDISCO', fr: 'MORSURE' }, pow: 50, acc: 100, pp: 25 },
  zarpazo: { name: { es: 'ZARPAZO', fr: 'GRIFFURE' }, pow: 40, acc: 100, pp: 35 },
  aullido: { name: { es: 'AULLIDO', fr: 'HURLEMENT' }, pow: 0, acc: 0, pp: 20, self: { atk: 1 } },
  punal: { name: { es: 'PUÑAL', fr: 'DAGUE' }, pow: 40, acc: 100, pp: 35 },
  pedrada: { name: { es: 'PEDRADA', fr: 'JET DE PIERRE' }, pow: 45, acc: 90, pp: 20 },
  empujon: { name: { es: 'EMPUJÓN', fr: 'BOUSCULADE' }, pow: 0, acc: 100, pp: 30, foe: { def: -1 } },
  forcejeo: { name: { es: 'FORCEJEO', fr: 'LUTTE' }, pow: 30, acc: 100, pp: 1 },
};
const moveName = id => tr(MOVES[id].name);
const LEARN = { 1: ['tajo', 'grito'], 4: ['estocada'], 7: ['escudo'], 12: ['mandoble'] };
const STATNAME = {
  atk: { es: 'ATAQUE', fr: 'ATTAQUE' },
  def: { es: 'DEFENSA', fr: 'DÉFENSE' },
  spd: { es: 'VELOCIDAD', fr: 'VITESSE' },
};

const FOES = {
  jabali: { name: { es: 'JABALÍ', fr: 'SANGLIER' }, art: 'boar', base: { hp: 55, atk: 58, def: 46, spd: 40 }, exp: 56, moves: ['embestida', 'colmillazo', 'grunido'], gold: [0, 0], wild: true,
    intro: { es: '¡Un JABALÍ salvaje sale del matorral!', fr: 'Un SANGLIER sauvage surgit des broussailles !' }, wildTag: { es: ' salvaje', fr: ' sauvage' } },
  lobo: { name: { es: 'LOBO', fr: 'LOUP' }, art: 'wolf', base: { hp: 46, atk: 56, def: 40, spd: 68 }, exp: 58, moves: ['mordisco', 'zarpazo', 'aullido'], gold: [0, 0], wild: true,
    intro: { es: '¡Un LOBO salvaje te enseña los dientes!', fr: 'Un LOUP sauvage te montre les crocs !' }, wildTag: { es: ' salvaje', fr: ' sauvage' } },
  salteador: { name: { es: 'SALTEADOR', fr: 'BRIGAND' }, art: 'char:bandit', base: { hp: 50, atk: 52, def: 44, spd: 56 }, exp: 60, moves: ['punal', 'pedrada', 'empujon'], gold: [8, 22], wild: true,
    intro: { es: '¡Un SALTEADOR te corta el paso!', fr: 'Un BRIGAND te barre la route !' }, wildTag: { es: '', fr: '' } },
  rival: { name: 'RIVAL', art: 'rival', base: { hp: 58, atk: 54, def: 52, spd: 52 }, exp: 64, moves: ['tajo', 'grito'], gold: [60, 60] },
  martin: { name: { es: 'MARTÍN', fr: 'MARTIN' }, art: 'char:martin', base: { hp: 56, atk: 54, def: 50, spd: 50 }, exp: 62, moves: ['tajo', 'estocada', 'escudo'], gold: [90, 90] },
};

const ITEMS = {
  hogaza: { name: { es: 'HOGAZA', fr: 'MICHE' }, plural: { es: 'HOGAZAS', fr: 'MICHES' }, art: { es: 'una', fr: 'une' }, heal: 20,
    txt: { es: 'Pan recién hecho. Recupera 20 PV.', fr: 'Pain tout juste sorti du four. Rend 20 PV.' } },
  unguento: { name: { es: 'UNGÜENTO', fr: 'ONGUENT' }, plural: { es: 'UNGÜENTOS', fr: 'ONGUENTS' }, art: { es: 'un', fr: 'un' }, heal: 50,
    txt: { es: 'Bálsamo de hierbas. Recupera 50 PV.', fr: 'Baume aux herbes. Rend 50 PV.' } },
};
const itemQty = (id, n) => (n === 1 ? tr(ITEMS[id].art) + ' ' + tr(ITEMS[id].name) : n + ' ' + tr(ITEMS[id].plural));

// Recompensas por caminar (propuesta inicial, se ajustará tras las pruebas)
const WALK = { ducadosPerKm: 50, hogazaEvery: 2, unguentoEvery: 5, stepsPerKm: 1350, maxKmPerDay: 15 };

const statOf = (base, L) => Math.floor((2 * base + 15) * L / 100) + 5;
const hpOf = (base, L) => Math.floor((2 * base + 15) * L / 100) + L + 10;
const xpFor = L => L * L * L;                      // experiencia total para llegar al nivel L
const stageMul = s => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));

function calcStats(base, L) {
  return { maxHp: hpOf(base.hp, L), atk: statOf(base.atk, L), def: statOf(base.def, L), spd: statOf(base.spd, L) };
}

function makeFoe(id, level, overrides = {}) {
  const f = FOES[id];
  const st = calcStats(f.base, level);
  const moves = f.moves.filter(m => {
    for (const lv in LEARN) if (LEARN[lv].includes(m)) return level >= Number(lv) || m === 'tajo';
    return true;
  }).map(m => ({ id: m, pp: MOVES[m].pp }));
  return Object.assign({ id, name: tr(f.name), art: f.art, level, hp: st.maxHp, ...st, moves, st: { atk: 0, def: 0, spd: 0 }, exp: f.exp, wild: !!f.wild }, overrides);
}
