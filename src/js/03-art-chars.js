// ─── Arte: personajes (16×24 píxeles, 4 direcciones, 3 pasos) ─────────────
// k contorno · s/S piel · r rubor · h/H/l pelo · t/T/L ropa · b cinto · y hebilla
// p/P calzas · f botas · g/G barba · m máscara
const SPR = {
  m: {
    d: [
      '......kkkk......',
      '....kkhhhhkk....',
      '...khhhhhhhhk...',
      '..khhhhhhllhhk..',
      '..khhhhhhhhhhk..',
      '..kHhhhhhhhhHk..',
      '..kHhsssssshHk..',
      '..kHssssssssHk..',
      '..kHskssssksHk..',
      '..kHskssssksHk..',
      '..kSsssSSsssSk..',
      '...kSssssssSk...',
      '..kTtttsstttTk..',
      '..kTttttttttTk..',
      '..kTtLttttLtTk..',
      '..kbbbbyybbbbk..',
      '.ksTttttttttTsk.',
      '..kTttttttttTk..',
      '...kTTttttTTk...',
    ],
    u: [
      '......kkkk......',
      '....kkhhhhkk....',
      '...khhhhhhhhk...',
      '..khhhhhhllhhk..',
      '..khhhhhhhhhhk..',
      '..kHhhhhhhhhHk..',
      '..khhhhhhhhhhk..',
      '..khhhhhhhhhhk..',
      '..khhhhhhhhhhk..',
      '..kHhhhhhhhhHk..',
      '..kHHhhhhhhHHk..',
      '...kSHHHHHHSk...',
      '..kTttttttttTk..',
      '..kTttttttttTk..',
      '..kTtLttttLtTk..',
      '..kbbbbbbbbbbk..',
      '.ksTttttttttTsk.',
      '..kTttttttttTk..',
      '...kTTttttTTk...',
    ],
    s: [
      '.....kkkkk......',
      '...kkhhhhhkk....',
      '..khhhhhhhhhk...',
      '..khhhhhhllhhk..',
      '..khhhhhhhhhhk..',
      '.khhhhhhhhhhHk..',
      '.kssshhhhhhhHk..',
      '.ksssssShhhhHk..',
      '.kskssssShhhHk..',
      'ksskssssShhHk...',
      '.ksssssSShHk....',
      '..kSsssSSk......',
      '...kTttttttTk...',
      '...kTtttTttTk...',
      '...kTtLtTttTk...',
      '...kbbbbbbbbk...',
      '...kTtttsttTk...',
      '...kTttttttTk...',
      '....kTTttTTk....',
    ],
  },
  f: {
    d: [
      '......kkkk......',
      '....kkhhhhkk....',
      '...khhhhhhhhk...',
      '..khhhhhhllhhk..',
      '..khhhhhhhhhhk..',
      '.khHhhhhhhhhHhk.',
      '.khHhhsssshhHhk.',
      '.khHssssssssHhk.',
      '.khHskssssksHhk.',
      '.khHskssssksHhk.',
      '.khSrssSSssrShk.',
      '.khhSssssssShhk.',
      '.khHTttssttTHhk.',
      '..kHTttttttTHk..',
      '..kTtLttttLtTk..',
      '..kbbbbyybbbbk..',
      '.ksTttttttttTsk.',
      '..kTttttttttTk..',
      '.kTttttttttttTk.',
      '.kTTttttttttTTk.',
      '..kkkkkkkkkkkk..',
    ],
    u: [
      '......kkkk......',
      '....kkhhhhkk....',
      '...khhhhhhhhk...',
      '..khhhhhhllhhk..',
      '..khhhhhhhhhhk..',
      '.khHhhhhhhhhHhk.',
      '.khhhhhhhhhhhhk.',
      '.khhhhhhhhhhhhk.',
      '.khhhhhhhhhhhhk.',
      '.khHhhhhhhhhHhk.',
      '.khhhhhhhhhhhhk.',
      '.khhhhhhhhhhhhk.',
      '.khHhhhhhhhhHhk.',
      '..kHhhhhhhhhHk..',
      '..kTtHhhhhHtTk..',
      '..kbbbbbbbbbbk..',
      '.ksTttttttttTsk.',
      '..kTttttttttTk..',
      '.kTttttttttttTk.',
      '.kTTttttttttTTk.',
      '..kkkkkkkkkkkk..',
    ],
    s: [
      '.....kkkkk......',
      '...kkhhhhhkk....',
      '..khhhhhhhhhk...',
      '..khhhhhhllhhk..',
      '..khhhhhhhhhhk..',
      '.khhhhhhhhhhHk..',
      '.kssshhhhhhhHk..',
      '.ksssssShhhhHk..',
      '.kskssssShhhHk..',
      'ksskssrsShhhHk..',
      '.ksssssSShhhHk..',
      '..kSsssShhhhHk..',
      '...kTttthhhHk...',
      '...kTttTthhHk...',
      '...kTtLtTtHHk...',
      '...kbbbbbbbbk...',
      '...kTtttsttTk...',
      '..kTttttttttTk..',
      '..kTttttttttTk..',
      '.kTTttttttttTk..',
      '..kkkkkkkkkkk...',
    ],
  },
};
// Piernas (filas inferiores). front = de frente/espaldas, side = de perfil (mirando a la izquierda)
const LEGS = {
  m: {
    front: [
      ['....kpPkkPpk....', '....kpPkkPpk....', '....kffkkffk....', '...kfffkkfffk...', '....kkk..kkk....'],
      ['....kpPkkPpk....', '....kpPkkffk....', '....kffkkffk....', '...kfffkkkkk....', '....kkk.........'],
    ],
    side: [
      ['.....kpPPk......', '.....kpPPk......', '.....kfffk......', '....kffffk......', '....kkkkkk......'],
      ['....kpPkPPk.....', '...kpPk.kPPk....', '..kffk...kffk...', '.kfffk...kffk...', '.kkkk....kkk....'],
    ],
  },
  f: {
    front: [
      ['....kfk..kfk....', '...kffk..kffk...', '...kkkk..kkkk...'],
      ['....kfk..kfk....', '...kffk..kkk....', '...kkkk.........'],
    ],
    side: [
      ['.....kfk........', '....kffk........', '....kkkk........'],
      ['....kfk.kfk.....', '...kffk.kffk....', '...kkkk.kkkk....'],
    ],
  },
};
// Complementos que se pintan encima (barba, máscara, sombrero)
const OVER = {
  beard: {
    d: { 10: '...gs.gggg.sg...', 11: '....gggggggg....', 12: '.....gGGGGg.....', 13: '......gGGg......' },
    u: {},
    s: { 10: '..ggggg.........', 11: '...gggg.........', 12: '....gG..........' },
  },
  mask: {
    d: { 10: '...mmmmmmmmmm...', 11: '....mmmmmmmm....' },
    u: {},
    s: { 10: '..mmmmm.........', 11: '...mmmm.........' },
  },
  hat: {
    d: { 5: '.kHHHHHHHHHHHHk.' },
    u: { 5: '.kHHHHHHHHHHHHk.' },
    s: { 5: 'kHHHHHHHHHHHHk..' },
  },
};

const OUTLINE = '#2a2131';
const SKIN = {
  light: ['#f8d2aa', '#e0a274', '#f0a08e'],
  mid: ['#dba678', '#b47a4c', '#e48e78'],
  dark: ['#9a6240', '#6c4128', '#b46c58'],
};
const HAIR = {
  brown: ['#6c4528', '#472b16', '#93673f'],
  black: ['#342a36', '#1b151f', '#57495a'],
  auburn: ['#b34c2c', '#7c2f19', '#dc744c'],
  blond: ['#e6be5c', '#b48a2e', '#f8e29a'],
  grey: ['#b8b8c4', '#878898', '#e2e2ea'],
  steel: ['#a9b2bc', '#6e7784', '#e4ecf4'],
  straw: ['#e6c676', '#b49448', '#f8e8b4'],
  hood: ['#5c4c3c', '#3a3026', '#7c6c5a'],
};
const CLOTH = {
  blue: ['#4a7ccc', '#305a9c', '#84abea'],
  green: ['#3c9c72', '#266c4e', '#72caa2'],
  red: ['#c23a3a', '#862428', '#ea7262'],
  brown: ['#8c5c34', '#5f3d21', '#b28250'],
  purple: ['#8c5ca2', '#5f3c76', '#ba92d2'],
  ochre: ['#d29c3a', '#9a6b22', '#f0ca72'],
  grey: ['#6c6662', '#4b4542', '#928c86'],
  teal: ['#3a8c9c', '#25606c', '#70bccc'],
};
const HOSE = { light: ['#8c7c60', '#665840'], dark: ['#4c4652', '#302b36'] };

const LOOKS = {
  player_m_light: { base: 'm', skin: 'light', hair: 'brown', cloth: 'blue' },
  player_m_dark: { base: 'm', skin: 'dark', hair: 'black', cloth: 'blue' },
  player_f_light: { base: 'f', skin: 'light', hair: 'auburn', cloth: 'green' },
  player_f_dark: { base: 'f', skin: 'dark', hair: 'black', cloth: 'green' },
  mother_light: { base: 'f', skin: 'light', hair: 'brown', cloth: 'purple' },
  mother_dark: { base: 'f', skin: 'dark', hair: 'black', cloth: 'purple' },
  esteban: { base: 'm', skin: 'dark', hair: 'grey', cloth: 'brown', over: 'beard' },
  rival_f: { base: 'f', skin: 'dark', hair: 'black', cloth: 'red' },
  rival_m: { base: 'm', skin: 'dark', hair: 'black', cloth: 'red' },
  guard: { base: 'm', skin: 'light', hair: 'steel', cloth: 'red', hose: 'dark' },
  aldeana: { base: 'f', skin: 'light', hair: 'blond', cloth: 'ochre' },
  nino: { base: 'm', skin: 'mid', hair: 'black', cloth: 'green' },
  labrador: { base: 'm', skin: 'mid', hair: 'straw', cloth: 'brown', over: 'hat' },
  viajera: { base: 'f', skin: 'mid', hair: 'auburn', cloth: 'teal' },
  martin: { base: 'm', skin: 'light', hair: 'brown', cloth: 'ochre' },
  cazador: { base: 'm', skin: 'light', hair: 'blond', cloth: 'green', over: 'beard' },
  bandit: { base: 'm', skin: 'mid', hair: 'hood', cloth: 'grey', over: 'mask', hose: 'dark' },
};

function lookPalette(L) {
  const sk = SKIN[L.skin], hr = HAIR[L.hair], cl = CLOTH[L.cloth], hs = HOSE[L.hose || 'light'];
  const bd = HAIR[L.beard || L.hair];
  return {
    k: OUTLINE, s: sk[0], S: sk[1], r: sk[2],
    h: hr[0], H: hr[1], l: hr[2],
    t: cl[0], T: cl[1], L: cl[2],
    b: '#6b4426', y: '#f2ca52', p: hs[0], P: hs[1], f: '#4c3426',
    g: bd[0], G: bd[1], m: '#4a4038',
  };
}

function composeRows(base, view, legIdx, overKey) {
  const body = SPR[base][view === 'side' ? 's' : view].slice();
  const legSet = LEGS[base][view === 'side' ? 'side' : 'front'];
  let legs = legSet[legIdx === 0 ? 0 : 1];
  if (legIdx === 2 && view !== 'side') legs = legs.map(r => r.split('').reverse().join(''));
  const rows = body.concat(legs);
  if (overKey) {
    const ov = OVER[overKey][view === 'side' ? 's' : view] || {};
    for (const ri in ov) {
      const o = ov[ri], r = rows[ri].split('');
      for (let i = 0; i < o.length; i++) if (o[i] !== '.') r[i] = o[i];
      rows[ri] = r.join('');
    }
  }
  return rows;
}

// Hoja de 12 fotogramas: abajo 0-2, arriba 3-5, izquierda 6-8, derecha 9-11
function buildCharSheet(L) {
  const pal = lookPalette(L);
  const [c, x] = mkCanvas(16 * 12, 24);
  const views = [['d', false], ['u', false], ['side', false], ['side', true]];
  views.forEach(([v, flip], vi) => {
    for (let f = 0; f < 3; f++) {
      const rows = composeRows(L.base, v, f, L.over);
      paintRows(x, rows, pal, (vi * 3 + f) * 16, 0, flip);
    }
  });
  return c;
}

const DIR_ROW = { down: 0, up: 3, left: 6, right: 9 };
