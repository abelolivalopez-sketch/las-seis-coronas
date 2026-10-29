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
  // yelmo de acero con nasal
  helm: {
    d: { 0: '......kkkk......', 1: '....kkiiiikk....', 2: '...kiiijiiiik...', 3: '..kiiijjiiiiik..', 4: '..kIiiiiiiiiIk..', 5: '..kkIIIIIIIIkk..', 6: '.......i........', 7: '.......i........' },
    u: { 0: '......kkkk......', 1: '....kkiiiikk....', 2: '...kiiiiiiiik...', 3: '..kiiiiiiiiiik..', 4: '..kIiiiiiiiiIk..', 5: '..kkIIIIIIIIkk..' },
    s: { 0: '.....kkkkk......', 1: '...kkiiiiikk....', 2: '..kiiiijiiiik...', 3: '..kiiijjiiiiik..', 4: '..kIiiiiiiiiIk..', 5: '.kkIIIIIIIIIkk..' },
  },
  // turbante
  turban: {
    d: { 0: '.....kkkkkk.....', 1: '...kkwwwwwwkk...', 2: '..kwwxwwwxwwwk..', 3: '..kwxwwwxwwwxk..', 4: '..kwwwwwwwwwwk..', 5: '..kxxxxxxxxxxk..' },
    u: { 0: '.....kkkkkk.....', 1: '...kkwwwwwwkk...', 2: '..kwwxwwwxwwwk..', 3: '..kwxwwwxwwwxk..', 4: '..kwwwwwwwwwwk..', 5: '..kxxxxxxxxxxk..', 6: '..kwwwwwwwwwwk..' },
    s: { 0: '....kkkkkk......', 1: '..kkwwwwwwkk....', 2: '..kwwxwwwxwwk...', 3: '..kwxwwwxwwwxk..', 4: '..kwwwwwwwwwwk..', 5: '.kxxxxxxxxxxk...' },
  },
  // boina o gorro
  cap: {
    d: { 0: '....kkkkkkk.....', 1: '...kcccccccck...', 2: '..kccccccccccck.', 3: '..kCCCCCCCCCCk..' },
    u: { 0: '....kkkkkkk.....', 1: '...kcccccccck...', 2: '..kccccccccccck.', 3: '..kCCCCCCCCCCk..' },
    s: { 0: '...kkkkkkk......', 1: '..kcccccccck....', 2: '.kcccccccccck...', 3: '..kCCCCCCCCCk...' },
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
  raven: ['#2e2a34', '#1a161e', '#4a4452'],
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
  raven: ['#3a3440', '#221e28', '#c23a3a'],
  white: ['#ece8e0', '#c0b8ac', '#ffffff'],
  navy: ['#34407a', '#222a54', '#5a6ab0'],
  crimson: ['#a82848', '#721a30', '#d2506e'],
  sand: ['#e0c89a', '#b8a070', '#f4e2bc'],
  gold: ['#e8b838', '#b08420', '#f8dc78'],
  olive: ['#7a8a3a', '#56622a', '#a0b25a'],
  sky: ['#6aa8e0', '#3e78b4', '#a2ccf0'],
  black: ['#3a3440', '#221e28', '#5a5262'],
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
  // gente de los caminos
  peregrino: { base: 'm', skin: 'light', hair: 'grey', cloth: 'brown', over: 'hat' },
  peregrina: { base: 'f', skin: 'mid', hair: 'brown', cloth: 'sand' },
  herrero: { base: 'm', skin: 'mid', hair: 'black', cloth: 'grey', over: 'beard', hose: 'dark' },
  cuervo: { base: 'm', skin: 'light', hair: 'raven', cloth: 'raven', over: 'mask', hose: 'dark' },
  cuerva: { base: 'f', skin: 'mid', hair: 'raven', cloth: 'raven', hose: 'dark' },
  marinero: { base: 'm', skin: 'dark', hair: 'black', cloth: 'navy', over: 'cap', capc: 'red' },
  marinera: { base: 'f', skin: 'light', hair: 'blond', cloth: 'navy' },
  corsario: { base: 'm', skin: 'mid', hair: 'black', cloth: 'crimson', over: ['hat', 'beard'], hose: 'dark' },
  jinete: { base: 'm', skin: 'dark', hair: 'black', cloth: 'white', over: 'turban', wrap: 'sand' },
  jineta: { base: 'f', skin: 'dark', hair: 'black', cloth: 'sky', over: 'turban', wrap: 'white' },
  mercader: { base: 'm', skin: 'mid', hair: 'black', cloth: 'gold', over: ['turban', 'beard'], wrap: 'crimson' },
  ballestero: { base: 'm', skin: 'light', hair: 'brown', cloth: 'crimson', over: 'helm', hose: 'dark' },
  ballestera: { base: 'f', skin: 'light', hair: 'auburn', cloth: 'white', over: 'helm' },
  espadachin: { base: 'm', skin: 'light', hair: 'black', cloth: 'purple', over: 'cap', capc: 'black' },
  espadachina: { base: 'f', skin: 'mid', hair: 'brown', cloth: 'crimson', over: 'cap', capc: 'black' },
  condotiero: { base: 'm', skin: 'light', hair: 'brown', cloth: 'grey', over: ['helm', 'beard'], hose: 'dark' },
  fraile: { base: 'm', skin: 'light', hair: 'hood', cloth: 'brown', hose: 'dark' },
  gondolero: { base: 'm', skin: 'light', hair: 'black', cloth: 'white', over: 'cap', capc: 'black' },
  guardia_moro: { base: 'm', skin: 'dark', hair: 'black', cloth: 'white', over: 'turban', wrap: 'red', hose: 'dark' },
  guardia_it: { base: 'm', skin: 'light', hair: 'brown', cloth: 'crimson', over: 'helm', hose: 'dark' },
  // maestros, jefes y personajes de la historia
  rodrigo: { base: 'm', skin: 'mid', hair: 'grey', cloth: 'crimson', over: 'beard', hose: 'dark' },
  zaynab: { base: 'f', skin: 'dark', hair: 'black', cloth: 'sky', over: 'turban', wrap: 'gold' },
  bianca: { base: 'f', skin: 'light', hair: 'blond', cloth: 'white', over: 'cap', capc: 'red' },
  guido: { base: 'm', skin: 'light', hair: 'black', cloth: 'purple', over: ['cap', 'beard'], capc: 'black' },
  capitan: { base: 'm', skin: 'light', hair: 'auburn', cloth: 'black', over: ['hat', 'beard'], hose: 'dark' },
  corvino: { base: 'm', skin: 'light', hair: 'raven', cloth: 'raven', over: 'beard', hose: 'dark' },
  capitana: { base: 'f', skin: 'mid', hair: 'brown', cloth: 'navy', over: 'cap', capc: 'navy' },
  dux: { base: 'm', skin: 'light', hair: 'grey', cloth: 'gold', over: ['cap', 'beard'], capc: 'gold' },
  // gente de las ciudades
  toledano: { base: 'm', skin: 'mid', hair: 'brown', cloth: 'ochre', over: 'hat' },
  toledana: { base: 'f', skin: 'light', hair: 'black', cloth: 'crimson' },
  pescador: { base: 'm', skin: 'dark', hair: 'grey', cloth: 'teal', over: 'hat' },
  costena: { base: 'f', skin: 'mid', hair: 'brown', cloth: 'sky' },
  tangerino: { base: 'm', skin: 'mid', hair: 'black', cloth: 'sand', over: 'turban', wrap: 'white' },
  tangerina: { base: 'f', skin: 'dark', hair: 'black', cloth: 'crimson', over: 'turban', wrap: 'gold' },
  genoves: { base: 'm', skin: 'light', hair: 'blond', cloth: 'navy', over: 'cap', capc: 'red' },
  genovesa: { base: 'f', skin: 'light', hair: 'brown', cloth: 'olive' },
  florentino: { base: 'm', skin: 'light', hair: 'brown', cloth: 'crimson', over: 'cap', capc: 'crimson' },
  florentina: { base: 'f', skin: 'light', hair: 'blond', cloth: 'purple' },
  veneciano: { base: 'm', skin: 'light', hair: 'black', cloth: 'teal', over: 'cap', capc: 'teal' },
  veneciana: { base: 'f', skin: 'light', hair: 'auburn', cloth: 'gold' },
  nina: { base: 'f', skin: 'dark', hair: 'black', cloth: 'ochre' },
  anciano: { base: 'm', skin: 'light', hair: 'grey', cloth: 'grey', over: 'beard' },
  anciana: { base: 'f', skin: 'mid', hair: 'grey', cloth: 'brown' },
  quijote: { base: 'm', skin: 'light', hair: 'grey', cloth: 'grey', over: ['helm', 'beard'], hose: 'dark' },
  dante: { base: 'm', skin: 'light', hair: 'brown', cloth: 'crimson', over: 'cap', capc: 'crimson' },
};

function lookPalette(L) {
  const sk = SKIN[L.skin], hr = HAIR[L.hair], cl = CLOTH[L.cloth], hs = HOSE[L.hose || 'light'];
  const bd = HAIR[L.beard || L.hair];
  const wr = CLOTH[L.wrap || 'white'], cp = CLOTH[L.capc || L.cloth];
  return {
    k: OUTLINE, s: sk[0], S: sk[1], r: sk[2],
    h: hr[0], H: hr[1], l: hr[2],
    t: cl[0], T: cl[1], L: cl[2],
    b: '#6b4426', y: '#f2ca52', p: hs[0], P: hs[1], f: '#4c3426',
    g: bd[0], G: bd[1], m: '#4a4038',
    i: '#c8ccd4', I: '#8a909c', j: '#f4f6fa',
    w: wr[0], x: wr[1], c: cp[0], C: cp[1],
  };
}

function composeRows(base, view, legIdx, overKey) {
  const body = SPR[base][view === 'side' ? 's' : view].slice();
  const legSet = LEGS[base][view === 'side' ? 'side' : 'front'];
  let legs = legSet[legIdx === 0 ? 0 : 1];
  if (legIdx === 2 && view !== 'side') legs = legs.map(r => r.split('').reverse().join(''));
  const rows = body.concat(legs);
  const keys = Array.isArray(overKey) ? overKey : overKey ? [overKey] : [];
  for (const key of keys) {
    const ov = OVER[key][view === 'side' ? 's' : view] || {};
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
