// ─── Datos de juego: técnicas, enemigos, objetos, equipo, niveles ─────────
const MAX_LV = 150;
const PLAYER_BASE = { hp: 60, atk: 56, def: 52, spd: 54 };
const XP_MULT = 3.0;          // multiplicador de experiencia (ajustado para el prototipo)          // multiplicador de experiencia (ajustado para el prototipo)          // multiplicador de experiencia (ajustado para el prototipo)

// pow: daño · acc: precisión (0 = nunca falla) · pp: usos
// self/foe: cambia atributos · heal: cura (fracción de la vida) · crit: más críticos
const MOVES = {
  // escudero
  tajo: { name: { es: 'TAJO', fr: 'ENTAILLE' }, pow: 40, acc: 100, pp: 35 },
  grito: { name: { es: 'GRITO DE GUERRA', fr: 'CRI DE GUERRE' }, pow: 0, acc: 0, pp: 20, self: { atk: 1 } },
  estocada: { name: { es: 'ESTOCADA', fr: 'ESTOCADE' }, pow: 60, acc: 95, pp: 25 },
  escudo: { name: { es: 'ESCUDO EN ALTO', fr: 'BOUCLIER LEVÉ' }, pow: 0, acc: 0, pp: 20, self: { def: 1 } },
  mandoble: { name: { es: 'MANDOBLE', fr: 'FENDANT' }, pow: 80, acc: 90, pp: 15 },
  aliento: { name: { es: 'SEGUNDO ALIENTO', fr: 'SECOND SOUFFLE' }, pow: 0, acc: 0, pp: 8, heal: 0.5 },
  finta: { name: { es: 'FINTA', fr: 'FEINTE' }, pow: 70, acc: 0, pp: 20 },
  golpe_escudo: { name: { es: 'GOLPE DE ESCUDO', fr: 'COUP DE BOUCLIER' }, pow: 65, acc: 95, pp: 20, foe: { spd: -1 } },
  guardia: { name: { es: 'GUARDIA DE HIERRO', fr: 'GARDE DE FER' }, pow: 0, acc: 0, pp: 15, self: { def: 2 } },
  tajo_cruzado: { name: { es: 'TAJO CRUZADO', fr: 'TAILLE CROISÉE' }, pow: 95, acc: 90, pp: 10, crit: true },
  carga: { name: { es: 'CARGA DEL CABALLERO', fr: 'CHARGE DU CHEVALIER' }, pow: 120, acc: 85, pp: 5 },
  // animales
  embestida: { name: { es: 'EMBESTIDA', fr: 'CHARGE' }, pow: 40, acc: 100, pp: 35 },
  colmillazo: { name: { es: 'COLMILLAZO', fr: 'COUP DE BOUTOIR' }, pow: 55, acc: 90, pp: 20 },
  grunido: { name: { es: 'GRUÑIDO', fr: 'GROGNEMENT' }, pow: 0, acc: 100, pp: 30, foe: { atk: -1 } },
  mordisco: { name: { es: 'MORDISCO', fr: 'MORSURE' }, pow: 50, acc: 100, pp: 25 },
  zarpazo: { name: { es: 'ZARPAZO', fr: 'GRIFFURE' }, pow: 40, acc: 100, pp: 35 },
  aullido: { name: { es: 'AULLIDO', fr: 'HURLEMENT' }, pow: 0, acc: 0, pp: 20, self: { atk: 1 } },
  acecho: { name: { es: 'ACECHO', fr: 'AFFÛT' }, pow: 0, acc: 0, pp: 20, self: { spd: 1 } },
  cornada: { name: { es: 'CORNADA', fr: 'COUP DE CORNE' }, pow: 70, acc: 95, pp: 20 },
  bufido: { name: { es: 'BUFIDO', fr: 'ÉBROUEMENT' }, pow: 0, acc: 100, pp: 25, foe: { atk: -1 } },
  veneno: { name: { es: 'MORDEDURA VENENOSA', fr: 'MORSURE VENIMEUSE' }, pow: 60, acc: 100, pp: 20 },
  enroscarse: { name: { es: 'ENROSCARSE', fr: 'S\'ENROULER' }, pow: 0, acc: 0, pp: 20, self: { def: 1 } },
  aguijon: { name: { es: 'AGUIJÓN', fr: 'DARD' }, pow: 65, acc: 95, pp: 15 },
  pinzas: { name: { es: 'PINZAS', fr: 'PINCES' }, pow: 45, acc: 100, pp: 25 },
  caparazon: { name: { es: 'CAPARAZÓN', fr: 'CARAPACE' }, pow: 0, acc: 0, pp: 20, self: { def: 1 } },
  chillido: { name: { es: 'CHILLIDO', fr: 'CRI STRIDENT' }, pow: 0, acc: 100, pp: 25, foe: { def: -1 } },
  picotazo: { name: { es: 'PICOTAZO', fr: 'COUP DE BEC' }, pow: 40, acc: 0, pp: 30 },
  aletazo: { name: { es: 'ALETAZO', fr: 'COUP D\'AILE' }, pow: 55, acc: 100, pp: 25 },
  graznido: { name: { es: 'GRAZNIDO', fr: 'CRIAILLEMENT' }, pow: 0, acc: 100, pp: 25, foe: { atk: -1 } },
  topetazo: { name: { es: 'TOPETAZO', fr: 'COUP DE TÊTE' }, pow: 60, acc: 100, pp: 20 },
  balido: { name: { es: 'BALIDO', fr: 'BÊLEMENT' }, pow: 0, acc: 100, pp: 25, foe: { def: -1 } },
  zarpazo_feroz: { name: { es: 'ZARPAZO FEROZ', fr: 'GRIFFE FÉROCE' }, pow: 75, acc: 95, pp: 15 },
  abrazo: { name: { es: 'ABRAZO DE OSO', fr: 'ÉTREINTE' }, pow: 60, acc: 100, pp: 20, foe: { spd: -1 } },
  rugido: { name: { es: 'RUGIDO', fr: 'RUGISSEMENT' }, pow: 0, acc: 100, pp: 20, foe: { atk: -1 } },
  // gente
  punal: { name: { es: 'PUÑAL', fr: 'DAGUE' }, pow: 40, acc: 100, pp: 35 },
  pedrada: { name: { es: 'PEDRADA', fr: 'JET DE PIERRE' }, pow: 45, acc: 90, pp: 20 },
  empujon: { name: { es: 'EMPUJÓN', fr: 'BOUSCULADE' }, pow: 0, acc: 100, pp: 30, foe: { def: -1 } },
  bastonazo: { name: { es: 'BASTONAZO', fr: 'COUP DE BÂTON' }, pow: 50, acc: 100, pp: 25 },
  punetazo: { name: { es: 'PUÑETAZO', fr: 'COUP DE POING' }, pow: 40, acc: 100, pp: 35 },
  flecha: { name: { es: 'FLECHA', fr: 'FLÈCHE' }, pow: 55, acc: 0, pp: 25 },
  martillazo: { name: { es: 'MARTILLAZO', fr: 'COUP DE MARTEAU' }, pow: 55, acc: 100, pp: 25 },
  temple: { name: { es: 'TEMPLE DE ACERO', fr: 'TREMPE D\'ACIER' }, pow: 0, acc: 0, pp: 10, self: { atk: 1, def: 1 } },
  golpe_bajo: { name: { es: 'GOLPE BAJO', fr: 'COUP BAS' }, pow: 60, acc: 100, pp: 20, crit: true },
  arena: { name: { es: 'ARENA A LOS OJOS', fr: 'SABLE AUX YEUX' }, pow: 0, acc: 100, pp: 15, foe: { atk: -1 } },
  garfio: { name: { es: 'GARFIO', fr: 'CROCHET' }, pow: 55, acc: 95, pp: 25 },
  sablazo: { name: { es: 'SABLAZO', fr: 'COUP DE SABRE' }, pow: 70, acc: 95, pp: 20 },
  abordaje: { name: { es: 'ABORDAJE', fr: 'ABORDAGE' }, pow: 85, acc: 85, pp: 10 },
  lanzada: { name: { es: 'LANZADA', fr: 'COUP DE LANCE' }, pow: 70, acc: 95, pp: 20 },
  galope: { name: { es: 'GALOPE', fr: 'GALOP' }, pow: 0, acc: 0, pp: 15, self: { spd: 2 } },
  carga_jinete: { name: { es: 'CARGA A CABALLO', fr: 'CHARGE À CHEVAL' }, pow: 90, acc: 85, pp: 10 },
  cimitarra: { name: { es: 'CIMITARRA', fr: 'CIMETERRE' }, pow: 80, acc: 95, pp: 15 },
  virote: { name: { es: 'VIROTE', fr: 'CARREAU' }, pow: 60, acc: 0, pp: 20 },
  tiro: { name: { es: 'TIRO CERTERO', fr: 'TIR PRÉCIS' }, pow: 85, acc: 100, pp: 10 },
  recargar: { name: { es: 'RECARGAR', fr: 'RECHARGER' }, pow: 0, acc: 0, pp: 15, self: { atk: 1 } },
  paves: { name: { es: 'PAVÉS', fr: 'PAVOIS' }, pow: 0, acc: 0, pp: 10, self: { def: 2 } },
  parada: { name: { es: 'PARADA', fr: 'PARADE' }, pow: 0, acc: 0, pp: 15, self: { def: 1, spd: 1 } },
  mazazo: { name: { es: 'MAZAZO', fr: 'COUP DE MASSE' }, pow: 80, acc: 90, pp: 15 },
  remazo: { name: { es: 'REMAZO', fr: 'COUP DE RAME' }, pow: 65, acc: 95, pp: 20 },
  forcejeo: { name: { es: 'FORCEJEO', fr: 'LUTTE' }, pow: 30, acc: 100, pp: 1 },
};
const moveName = id => tr(MOVES[id].name);
const LEARN = { 1: ['tajo', 'grito'], 4: ['estocada'], 7: ['escudo'], 12: ['mandoble'], 17: ['aliento'], 22: ['finta'], 28: ['golpe_escudo'], 34: ['guardia'], 40: ['tajo_cruzado'], 46: ['carga'] };
const STATNAME = {
  atk: { es: 'ATAQUE', fr: 'ATTAQUE' },
  def: { es: 'DEFENSA', fr: 'DÉFENSE' },
  spd: { es: 'VELOCIDAD', fr: 'VITESSE' },
};

// Técnicas por nivel (las 4 últimas aprendidas son las que usa)
const KNIGHT_MOVES = [['tajo', 1], ['grito', 1], ['estocada', 4], ['escudo', 7], ['mandoble', 12], ['aliento', 17], ['finta', 22], ['golpe_escudo', 28], ['guardia', 34], ['tajo_cruzado', 40], ['carga', 46]];
const WILD = { es: ' salvaje', fr: ' sauvage' }, NOTAG = { es: '', fr: '' };
const FOES = {
  // ── animales ──
  jabali: { name: { es: 'JABALÍ', fr: 'SANGLIER' }, art: 'boar', base: { hp: 55, atk: 58, def: 46, spd: 40 }, exp: 56, moves: ['embestida', 'colmillazo', 'grunido'], wild: true,
    intro: { es: '¡Un JABALÍ salvaje sale del matorral!', fr: 'Un SANGLIER sauvage surgit des broussailles !' }, wildTag: WILD },
  lobo: { name: { es: 'LOBO', fr: 'LOUP' }, art: 'wolf', base: { hp: 46, atk: 56, def: 40, spd: 68 }, exp: 58, moves: ['mordisco', 'zarpazo', 'aullido'], wild: true,
    intro: { es: '¡Un LOBO salvaje te enseña los dientes!', fr: 'Un LOUP sauvage te montre les crocs !' }, wildTag: WILD },
  lince: { name: { es: 'LINCE', fr: 'LYNX' }, art: 'lynx', base: { hp: 48, atk: 62, def: 42, spd: 74 }, exp: 64, moves: ['zarpazo', 'mordisco', 'acecho', ['zarpazo_feroz', 20]], wild: true,
    intro: { es: '¡Un LINCE salta desde las rocas!', fr: 'Un LYNX bondit des rochers !' }, wildTag: WILD },
  toro: { name: { es: 'TORO BRAVO', fr: 'TAUREAU' }, art: 'bull', base: { hp: 70, atk: 68, def: 58, spd: 40 }, exp: 72, moves: ['embestida', 'cornada', 'bufido'], wild: true,
    intro: { es: '¡Un TORO BRAVO escarba y te embiste!', fr: 'Un TAUREAU gratte le sol et fonce sur toi !' }, wildTag: NOTAG },
  vibora: { name: { es: 'VÍBORA', fr: 'VIPÈRE' }, art: 'viper', base: { hp: 42, atk: 60, def: 44, spd: 66 }, exp: 60, moves: ['mordisco', 'enroscarse', ['veneno', 10]], wild: true,
    intro: { es: '¡Una VÍBORA sisea entre la hierba!', fr: 'Une VIPÈRE siffle dans l\'herbe !' }, wildTag: NOTAG, fem: true },
  chacal: { name: { es: 'CHACAL', fr: 'CHACAL' }, art: 'jackal', base: { hp: 48, atk: 60, def: 42, spd: 70 }, exp: 62, moves: ['mordisco', 'zarpazo', 'aullido'], wild: true,
    intro: { es: '¡Un CHACAL sale de entre las piedras!', fr: 'Un CHACAL surgit d\'entre les pierres !' }, wildTag: NOTAG },
  escorpion: { name: { es: 'ESCORPIÓN', fr: 'SCORPION' }, art: 'scorpion', base: { hp: 50, atk: 64, def: 66, spd: 44 }, exp: 66, moves: ['pinzas', 'caparazon', 'aguijon'], wild: true,
    intro: { es: '¡Un ESCORPIÓN levanta el aguijón!', fr: 'Un SCORPION dresse son dard !' }, wildTag: NOTAG },
  macaco: { name: { es: 'MACACO', fr: 'MACAQUE' }, art: 'macaque', base: { hp: 56, atk: 58, def: 48, spd: 64 }, exp: 64, moves: ['pedrada', 'mordisco', 'chillido'], wild: true,
    intro: { es: '¡Un MACACO te tira una piña y se lanza a por ti!', fr: 'Un MACAQUE te lance une pomme de pin et te saute dessus !' }, wildTag: NOTAG },
  gaviota: { name: { es: 'GAVIOTA', fr: 'MOUETTE' }, art: 'gull', base: { hp: 46, atk: 56, def: 40, spd: 76 }, exp: 60, moves: ['picotazo', 'graznido', 'aletazo'], wild: true,
    intro: { es: '¡Una GAVIOTA se lanza en picado!', fr: 'Une MOUETTE fond sur toi en piqué !' }, wildTag: NOTAG, fem: true },
  cangrejo: { name: { es: 'CANGREJO', fr: 'CRABE' }, art: 'crab', base: { hp: 50, atk: 66, def: 74, spd: 36 }, exp: 66, moves: ['pinzas', 'caparazon', 'embestida'], wild: true,
    intro: { es: '¡Un CANGREJO enorme sale de la arena!', fr: 'Un énorme CRABE sort du sable !' }, wildTag: NOTAG },
  cabra: { name: { es: 'CABRA MONTÉS', fr: 'BOUQUETIN' }, art: 'goat', base: { hp: 58, atk: 62, def: 56, spd: 58 }, exp: 66, moves: ['embestida', 'balido', 'topetazo'], wild: true,
    intro: { es: '¡Una CABRA MONTÉS baja de un salto!', fr: 'Un BOUQUETIN descend d\'un bond !' }, wildTag: NOTAG, fem: true },
  muflon: { name: { es: 'MUFLÓN', fr: 'MOUFLON' }, art: 'mouflon', base: { hp: 62, atk: 66, def: 58, spd: 56 }, exp: 70, moves: ['topetazo', 'balido', 'cornada'], wild: true,
    intro: { es: '¡Un MUFLÓN agacha los cuernos!', fr: 'Un MOUFLON baisse les cornes !' }, wildTag: NOTAG },
  oso: { name: { es: 'OSO', fr: 'OURS' }, art: 'bear', base: { hp: 80, atk: 76, def: 62, spd: 42 }, exp: 84, moves: ['zarpazo', 'rugido', 'abrazo', 'zarpazo_feroz'], wild: true,
    intro: { es: '¡Un OSO se alza sobre las patas traseras!', fr: 'Un OURS se dresse sur ses pattes arrière !' }, wildTag: NOTAG },
  // ── gente del camino ──
  salteador: { name: { es: 'SALTEADOR', fr: 'BRIGAND' }, art: 'char:bandit', base: { hp: 50, atk: 52, def: 44, spd: 56 }, exp: 60, moves: ['punal', 'pedrada', 'empujon', ['golpe_bajo', 18]], gold: [2, 5], wild: true,
    intro: { es: '¡Un SALTEADOR te corta el paso!', fr: 'Un BRIGAND te barre la route !' }, wildTag: NOTAG },
  // ── entrenadores (gold = ducados por nivel) ──
  rival: { name: 'RIVAL', art: 'rival', base: { hp: 60, atk: 56, def: 54, spd: 54 }, exp: 66, moves: KNIGHT_MOVES, gold: 12 },
  martin: { name: { es: 'MARTÍN', fr: 'MARTIN' }, art: 'char:martin', base: { hp: 56, atk: 54, def: 50, spd: 50 }, exp: 62, moves: ['tajo', 'estocada', 'escudo'], gold: 22 },
  escudero: { name: { es: 'ESCUDERO', fr: 'ÉCUYER' }, art: 'char:martin', base: { hp: 56, atk: 56, def: 54, spd: 52 }, exp: 62, moves: KNIGHT_MOVES, gold: 8 },
  peregrino: { name: { es: 'PEREGRINO', fr: 'PÈLERIN' }, art: 'char:peregrino', base: { hp: 60, atk: 52, def: 54, spd: 50 }, exp: 60, moves: ['bastonazo', 'empujon', 'punetazo', ['aliento', 20]], gold: 6 },
  cazador: { name: { es: 'CAZADOR', fr: 'CHASSEUR' }, art: 'char:cazador', base: { hp: 52, atk: 58, def: 46, spd: 62 }, exp: 62, moves: ['flecha', 'acecho', 'punal'], gold: 8 },
  aprendiz: { name: { es: 'APRENDIZ', fr: 'APPRENTI' }, art: 'char:herrero', base: { hp: 56, atk: 58, def: 54, spd: 48 }, exp: 62, moves: ['martillazo', 'tajo', 'escudo', ['estocada', 8]], gold: 8 },
  cuervo: { name: { es: 'MERCENARIO', fr: 'MERCENAIRE' }, art: 'char:cuervo', base: { hp: 58, atk: 62, def: 50, spd: 58 }, exp: 66, moves: ['tajo', 'arena', 'golpe_bajo', ['sablazo', 20], ['mazazo', 36]], gold: 10 },
  marinero: { name: { es: 'MARINERO', fr: 'MARIN' }, art: 'char:marinero', base: { hp: 60, atk: 58, def: 50, spd: 56 }, exp: 62, moves: ['punetazo', 'empujon', 'garfio', ['sablazo', 25]], gold: 9 },
  corsario: { name: { es: 'CORSARIO', fr: 'CORSAIRE' }, art: 'char:corsario', base: { hp: 58, atk: 66, def: 50, spd: 62 }, exp: 68, moves: ['garfio', 'golpe_bajo', 'sablazo', ['abordaje', 20]], gold: 12 },
  jinete: { name: { es: 'JINETE', fr: 'CAVALIER' }, art: 'char:jinete', base: { hp: 56, atk: 64, def: 50, spd: 70 }, exp: 68, moves: ['lanzada', 'galope', ['carga_jinete', 20]], gold: 10 },
  mercader: { name: { es: 'MERCADER', fr: 'MARCHAND' }, art: 'char:mercader', base: { hp: 58, atk: 54, def: 56, spd: 52 }, exp: 60, moves: ['bastonazo', 'empujon', 'punal'], gold: 16 },
  ballestero: { name: { es: 'BALLESTERO', fr: 'ARBALÉTRIER' }, art: 'char:ballestero', base: { hp: 54, atk: 66, def: 50, spd: 62 }, exp: 68, moves: ['virote', 'recargar', ['tiro', 30], ['paves', 32]], gold: 10 },
  espadachin: { name: { es: 'ESPADACHÍN', fr: 'BRETTEUR' }, art: 'char:espadachin', base: { hp: 56, atk: 66, def: 52, spd: 68 }, exp: 70, moves: ['estocada', 'finta', 'parada', ['tajo_cruzado', 44]], gold: 11 },
  condotiero: { name: { es: 'CONDOTIERO', fr: 'CONDOTTIERE' }, art: 'char:condotiero', base: { hp: 66, atk: 68, def: 62, spd: 50 }, exp: 74, moves: ['mandoble', 'grito', 'mazazo', ['carga', 48]], gold: 12 },
  fraile: { name: { es: 'FRAILE', fr: 'MOINE' }, art: 'char:fraile', base: { hp: 66, atk: 54, def: 62, spd: 48 }, exp: 66, moves: ['bastonazo', 'guardia', 'aliento'], gold: 6 },
  gondolero: { name: { es: 'GONDOLERO', fr: 'GONDOLIER' }, art: 'char:gondolero', base: { hp: 60, atk: 62, def: 56, spd: 56 }, exp: 66, moves: ['remazo', 'empujon', 'punetazo'], gold: 9 },
  guardia: { name: { es: 'GUARDIA', fr: 'GARDE' }, art: 'char:guard', base: { hp: 64, atk: 64, def: 66, spd: 48 }, exp: 70, moves: ['lanzada', 'paves', 'mazazo'], gold: 10 },
  // ── maestros de coliseo y jefe ──
  rodrigo: { name: { es: 'DON RODRIGO', fr: 'DON RODRIGO' }, art: 'char:rodrigo', base: { hp: 74, atk: 70, def: 68, spd: 54 }, exp: 90, moves: ['martillazo', 'temple', 'estocada', 'mandoble'], gold: 30 },
  zaynab: { name: 'ZAYNAB', art: 'char:zaynab', base: { hp: 72, atk: 74, def: 62, spd: 80 }, exp: 95, moves: ['lanzada', 'galope', 'cimitarra', 'carga_jinete'], gold: 30 },
  bianca: { name: 'BIANCA', art: 'char:bianca', base: { hp: 72, atk: 78, def: 66, spd: 72 }, exp: 98, moves: ['virote', 'recargar', 'paves', 'tiro'], gold: 30 },
  guido: { name: 'GUIDO', art: 'char:guido', base: { hp: 76, atk: 82, def: 70, spd: 80 }, exp: 102, moves: ['finta', 'estocada', 'parada', 'tajo_cruzado'], gold: 30 },
  capitan: { name: { es: 'CAPITÁN', fr: 'CAPITAINE' }, art: 'char:capitan', base: { hp: 66, atk: 70, def: 58, spd: 64 }, exp: 80, moves: ['sablazo', 'arena', 'golpe_bajo', 'abordaje'], gold: 20 },
  corvino: { name: 'CORVINO', art: 'char:corvino', base: { hp: 82, atk: 84, def: 72, spd: 74 }, exp: 110, moves: ['sablazo', 'golpe_bajo', 'arena', 'aliento', ['abordaje', 50]], gold: 40 },
};

const ITEMS = {
  hogaza: { name: { es: 'HOGAZA', fr: 'MICHE' }, plural: { es: 'HOGAZAS', fr: 'MICHES' }, art: { es: 'una', fr: 'une' }, heal: 20, price: 30,
    txt: { es: 'Pan recién hecho. Recupera 20 PV.', fr: 'Pain tout juste sorti du four. Rend 20 PV.' } },
  unguento: { name: { es: 'UNGÜENTO', fr: 'ONGUENT' }, plural: { es: 'UNGÜENTOS', fr: 'ONGUENTS' }, art: { es: 'un', fr: 'un' }, heal: 50, price: 90,
    txt: { es: 'Bálsamo de hierbas. Recupera 50 PV.', fr: 'Baume aux herbes. Rend 50 PV.' } },
  triaca: { name: { es: 'TRIACA', fr: 'THÉRIAQUE' }, plural: { es: 'TRIACAS', fr: 'THÉRIAQUES' }, art: { es: 'una', fr: 'une' }, heal: 120, price: 280,
    txt: { es: 'Remedio de boticario. Recupera 120 PV.', fr: 'Remède d\'apothicaire. Rend 120 PV.' } },
  elixir: { name: { es: 'ELIXIR', fr: 'ÉLIXIR' }, plural: { es: 'ELIXIRES', fr: 'ÉLIXIRS' }, art: { es: 'un', fr: 'un' }, heal: 9999, price: 800,
    txt: { es: 'Licor de alquimista. Recupera todos los PV.', fr: 'Liqueur d\'alchimiste. Rend tous les PV.' } },
};
const itemQty = (id, n) => (n === 1 ? tr(ITEMS[id].art) + ' ' + tr(ITEMS[id].name) : n + ' ' + tr(ITEMS[id].plural));

// Equipo: un arma y una armadura. Se equipa al comprarlo.
const EQUIP = {
  espada_corta: { slot: 'arma', atk: 0, name: { es: 'ESPADA CORTA', fr: 'ÉPÉE COURTE' } },
  espada_toledana: { slot: 'arma', atk: 6, price: 600, name: { es: 'ESPADA TOLEDANA', fr: 'ÉPÉE DE TOLÈDE' } },
  cimitarra: { slot: 'arma', atk: 12, price: 1600, name: { es: 'CIMITARRA', fr: 'CIMETERRE' } },
  estoque: { slot: 'arma', atk: 18, price: 3600, name: { es: 'ESTOQUE GENOVÉS', fr: 'ESTOC GÉNOIS' } },
  florentina: { slot: 'arma', atk: 25, price: 6500, name: { es: 'ESPADA FLORENTINA', fr: 'ÉPÉE FLORENTINE' } },
  gambeson: { slot: 'armadura', def: 5, price: 450, name: { es: 'GAMBESÓN', fr: 'GAMBISON' } },
  cota: { slot: 'armadura', def: 11, price: 1500, name: { es: 'COTA DE MALLA', fr: 'COTTE DE MAILLES' } },
  brigantina: { slot: 'armadura', def: 17, price: 3800, name: { es: 'BRIGANTINA', fr: 'BRIGANDINE' } },
  arnes: { slot: 'armadura', def: 24, price: 6800, name: { es: 'ARNÉS MILANÉS', fr: 'ARMURE MILANAISE' } },
};
const equipBonus = (id, k) => (id && EQUIP[id] ? EQUIP[id][k] || 0 : 0);
function effStats() {
  const p = P(), e = S0().equip || {};
  return {
    atk: p.atk + equipBonus(e.arma, 'atk') + equipBonus(e.armadura, 'atk'),
    def: p.def + equipBonus(e.arma, 'def') + equipBonus(e.armadura, 'def'),
    spd: p.spd,
  };
}

// Recompensas por caminar (propuesta inicial, se ajustará tras las pruebas)
const WALK = { ducadosPerKm: 50, hogazaEvery: 2, unguentoEvery: 5, stepsPerKm: 1350, maxKmPerDay: 15 };

const statOf = (base, L) => Math.floor((2 * base + 15) * L / 100) + 5;
const hpOf = (base, L) => Math.floor((2 * base + 15) * L / 100) + L + 10;
const xpFor = L => L * L * L;                      // experiencia total para llegar al nivel L
const stageMul = s => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));

function calcStats(base, L) {
  return { maxHp: hpOf(base.hp, L), atk: statOf(base.atk, L), def: statOf(base.def, L), spd: statOf(base.spd, L) };
}

// Las técnicas del enemigo: las 4 últimas que haya aprendido a su nivel
function foeMoves(list, level) {
  const avail = list.map(m => (Array.isArray(m) ? m : [m, 1])).filter(([, lv]) => lv <= level).map(([id]) => id);
  return avail.slice(-4);
}

function makeFoe(id, level, overrides = {}) {
  const f = FOES[id];
  const st = calcStats(f.base, level);
  const moves = foeMoves(f.moves, level).map(m => ({ id: m, pp: MOVES[m].pp }));
  return Object.assign({ id, name: tr(f.name), art: f.art, level, hp: st.maxHp, ...st, moves, st: { atk: 0, def: 0, spd: 0 }, exp: f.exp, wild: !!f.wild }, overrides);
}
