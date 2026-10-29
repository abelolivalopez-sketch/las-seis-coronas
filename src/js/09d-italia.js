// ─── Italia: Génova, los Apeninos, la Toscana, Florencia, el Po, la laguna y Venecia ───
const GENOVA_ARRIVAL = { map: 'genova', x: 16, y: 23, dir: 'up' };

Object.assign(MAPS, {
  // ── Génova: puerto y coliseo 3 ──
  genova: {
    name: { es: 'GÉNOVA', fr: 'GÊNES' }, bg: 'ciudad', theme: 'toscana', edgeOk: true,
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMM==MMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMM==MMMMMMMMMMMMMMMM',
      'WWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWW',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDDDDDDDDDDDDDMMMMMDD',
      '~~~~~~~~~~~~~~~DDD~~~~~~~~~MMMMM~~',
      '~~~~~~~~~~~~~~~DDD~~~~~~~~~MMMMM~~',
      '~~~~~~~~~~~~~~~DDD~~~~~~~~~MMMMM~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~MMMMM~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      { type: 'gate', x: 15, y: 1, w: 4, h: 3, walk: [[1, 0], [2, 0], [1, 1], [2, 1], [1, 2], [2, 2]], o: { stone: STONE.gris, color: '#c23a3a' } },
      { type: 'coliseo', x: 3, y: 5, w: 8, h: 5, o: { color: '#c23a3a', stone: STONE.gris }, door: [3, 4], enter: { map: 'coliseo_genova', x: 7, y: 13, dir: 'up' } },
      { type: 'tower', x: 13, y: 5, w: 2, h: 5, o: { stone: STONE.gris, roof: ['#8a8a98', '#6a6a78', '#4a4a58'], style: 'campanile' }, text: { es: 'La catedral de San Lorenzo, con sus franjas blancas y negras.', fr: 'La cathédrale San Lorenzo, avec ses rayures blanches et noires.' } },
      armoryHouse(20, 5, ['estoque', 'brigantina'], { es: 'Las mejores armas del Mediterráneo pasan por este puerto.', fr: 'Les meilleures armes de la Méditerranée passent par ce port.' }, { wall: ['#f0c896', '#d4a06c', '#f6d8b0'] }),
      plainHouse(26, 5, null, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'], frame: '#3d8c58' }),
      innHouse(3, 12, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'] }),
      shopHouse(9, 12, ['hogaza', 'unguento', 'triaca'], GREET.shop, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'] }),
      { type: 'fountain', x: 16, y: 13, w: 2, h: 2, o: { stone: STONE.gris }, text: { es: 'La fuente de la plaza De Ferrari.', fr: 'La fontaine de la place De Ferrari.' } },
      plainHouse(20, 12, { es: 'BANCO DE SAN JORGE. Aquí se guarda el oro de media Europa.', fr: 'BANQUE DE SAINT-GEORGES. Ici, on garde l\'or de la moitié de l\'Europe.' }, { wall: ['#e8e4dc', '#c0b8ac', '#f6f4ee'], shield: true }),
      plainHouse(26, 12, null, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'], frame: '#a0402e' }),
      plainHouse(3, 17, null, { wall: ['#f0c896', '#d4a06c', '#f6d8b0'], frame: '#3a70c0' }),
      plainHouse(9, 17, null, { wall: ['#e8e4dc', '#c0b8ac', '#f6f4ee'], frame: '#a0402e' }),
      plainHouse(20, 17, null, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'], frame: '#3a70c0' }),
      plainHouse(26, 17, null, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'], frame: '#3d8c58' }),
      { type: 'tower', x: 28, y: 22, w: 2, h: 5, o: { stone: STONE.claro, roof: ['#e98c62', '#c9623e', '#94422a'], color: '#c23a3a' }, text: { es: 'LA LINTERNA, el faro de Génova. Su luz se ve desde muy lejos.', fr: 'LA LANTERNE, le phare de Gênes. Sa lumière se voit de très loin.' } },
      { type: 'ship', x: 6, y: 24, w: 6, h: 2, o: { color: '#eef4e6', mark: '#2e8a5a', flag: '#2e8a5a' }, text: { es: 'LA ESPERANZA, el barco de Ahmed.', fr: 'L\'ESPÉRANCE, le navire d\'Ahmed.' } },
      signAt(14, 4, { es: 'GÉNOVA\nLa Soberbia. Coliseo de BALLESTA: maestra BIANCA.', fr: 'GÊNES\nLa Superbe. Colisée de l\'ARBALÈTE : maîtresse BIANCA.' }),
      signAt(19, 21, { es: 'Al norte: RUTA 13 · APENINOS. Más allá: FLORENCIA.', fr: 'Au nord : ROUTE 13 · APENNINS. Plus loin : FLORENCE.' }),
    ],
    conn: { up: { map: 'ruta13', dx: -4 } },
    npcs: [
      { id: 'ge_ahmed', look: 'marinero', x: 15, y: 24, dir: 'up', talk: async W => {
        const r = await W.ask({ es: 'AHMED: ¿Volvemos a TÁNGER?', fr: 'AHMED : On retourne à TANGER ?' }, [t('yes'), t('no')]);
        if (r === 0) await W.sail({ map: 'tanger', x: 12, y: 3, dir: 'down' }, { es: 'Rumbo a TÁNGER', fr: 'Cap sur TANGER' });
      } },
      talker('ge_guardia', 'guardia_it', 18, 4, 'down', null, { talk: async W => {
        if (!W.flag('genovaOpen')) await W.say({ es: 'El camino de los Apeninos está lleno de bandidos. Solo dejo pasar a quien tenga el BLASÓN DE GÉNOVA.', fr: 'La route des Apennins est pleine de bandits. Je ne laisse passer que ceux qui ont le BLASON DE GÊNES.' });
        else await W.say({ es: 'Al norte, los Apeninos. Después, las colinas de la Toscana y FLORENCIA.', fr: 'Au nord, les Apennins. Ensuite, les collines de Toscane et FLORENCE.' });
      } }),
      talker('ge_banquero', 'genoves', 24, 16, 'down', null, { talk: async W => {
        if (!W.flag('blason_genova')) await W.say({ es: 'Unos mercenarios con un cuervo bordado compraron cien ballestas... y pagaron con oro de VENECIA.', fr: 'Des mercenaires avec un corbeau brodé ont acheté cent arbalètes... et ils ont payé avec de l\'or de VENISE.' });
        else await W.say({ es: 'El oro del Cuervo sale del ARSENAL de VENECIA. Alguien muy poderoso les ayuda.', fr: 'L\'or du Corbeau vient de l\'ARSENAL de VENISE. Quelqu\'un de très puissant les aide.' });
      } }),
      talker('ge_mujer', 'genovesa', 12, 11, 'down', { es: 'Los ballesteros genoveses son famosos en toda Europa. ¡Hasta el rey de Francia los contrata!', fr: 'Les arbalétriers génois sont célèbres dans toute l\'Europe. Même le roi de France les engage !' }),
      talker('ge_marinero', 'marinero', 24, 22, 'left', { es: 'Del puerto de Génova salen barcos hacia todo el Mediterráneo.', fr: 'Du port de Gênes partent des navires vers toute la Méditerranée.' }),
      talker('ge_nino', 'nino', 10, 21, 'down', { es: 'Mi padre es cartógrafo. Dice que si navegas siempre hacia el oeste... ¡llegas a las Indias!', fr: 'Mon père est cartographe. Il dit que si on navigue toujours vers l\'ouest... on arrive aux Indes !' }, { wander: 2 }),
    ],
    triggers: [
      { x: 16, y: 4, cond: () => !S0().flags.genovaOpen, run: W => scriptCityGate(W, 'ge_guardia', 'down', { es: '¡Alto! Sin el BLASÓN DE GÉNOVA no se sale hacia los Apeninos.', fr: 'Halte ! Sans le BLASON DE GÊNES, on ne part pas vers les Apennins.' }) },
      { x: 17, y: 4, cond: () => !S0().flags.genovaOpen, run: W => scriptCityGate(W, 'ge_guardia', 'down', { es: '¡Alto! Sin el BLASÓN DE GÉNOVA no se sale hacia los Apeninos.', fr: 'Halte ! Sans le BLASON DE GÊNES, on ne part pas vers les Apennins.' }) },
    ],
    entry: [[16, 23]],
    onEnter: async W => {
      if (!W.flag('visitGenova')) {
        W.flag('visitGenova', true);
        await W.say({ es: 'GÉNOVA, la Soberbia. El puerto más rico del Mediterráneo.', fr: 'GÊNES, la Superbe. Le port le plus riche de la Méditerranée.' }, { color: 'blue' });
      }
    },
  },

  coliseo_genova: {
    name: { es: 'COLISEO DE GÉNOVA', fr: 'COLISÉE DE GÊNES' }, bg: 'coliseo', theme: 'toscana', edgeOk: true,
    build: () => asciiMap([
      'WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW',
      'W#####sss#####W',
      'W#####sss#####W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'WWWWWWW#WWWWWWW',
    ]),
    objects: [
      { type: 'stand', x: 0, y: 0, w: 15, h: 2, o: { stone: STONE.gris } },
      { type: 'banner', x: 4, y: 2, h: 2, o: { color: '#f4ece0', mark: '#c23a3a' } },
      { type: 'banner', x: 10, y: 2, h: 2, o: { color: '#f4ece0', mark: '#c23a3a' } },
      { type: 'dummy', x: 2, y: 5, text: { es: 'Una diana para ballesteros. Tiene virotes clavados en el centro.', fr: 'Une cible pour arbalétriers. Des carreaux sont plantés au centre.' } },
      { type: 'dummy', x: 12, y: 5 },
      { type: 'barrel', x: 1, y: 12 },
      { type: 'barrel', x: 13, y: 12 },
    ],
    exits: [exitDown(7, 14, { map: 'genova', x: 7, y: 10, dir: 'down' })],
    npcs: [
      trainer({ id: 'cg_pietro', look: 'ballestero', x: 4, y: 10, dir: 'right', range: 4, foe: 'ballestero', level: 31, name: 'Pietro',
        intro: { es: '¡Un virote no perdona! ¡Prepárate!', fr: 'Un carreau ne pardonne pas ! Prépare-toi !' },
        lose: { es: 'He fallado el tiro...', fr: 'J\'ai raté mon tir...' },
        after: { es: 'Bianca usa PAVÉS para protegerse. ¡Atácala con todo!', fr: 'Bianca utilise PAVOIS pour se protéger. Attaque-la de toutes tes forces !' } }),
      trainer({ id: 'cg_giulia', look: 'ballestera', x: 10, y: 6, dir: 'left', range: 4, foe: 'ballestero', title: { es: 'BALLESTERA', fr: 'ARBALÉTRIÈRE' }, level: 32, name: 'Giulia',
        intro: { es: '¡Desde aquí te veo perfectamente!', fr: 'D\'ici, je te vois parfaitement !' },
        lose: { es: 'Eres demasiado rápid{o} para mi ballesta.', fr: 'Tu es trop rapide pour mon arbalète.' },
        after: { es: 'Bianca nunca falla. ¡Sube tu defensa antes de atacar!', fr: 'Bianca ne rate jamais. Monte ta défense avant d\'attaquer !' } }),
      { id: 'bianca', look: 'bianca', x: 7, y: 3, dir: 'down', talk: W => scriptBianca(W) },
    ],
  },

  // ── Ruta 13 · Apeninos (niveles 35-38) ──
  ruta13: {
    name: { es: 'RUTA 13 · APENINOS', fr: 'ROUTE 13 · APENNINS' }, bg: 'montana', theme: 'verde',
    wild: [{ id: 'oso', w: 25, lv: [35, 37] }, { id: 'lobo', w: 30, lv: [35, 37] }, { id: 'cabra', w: 25, lv: [35, 37] }, { id: 'jabali', w: 20, lv: [35, 36] }],
    build: () => asciiMap([
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
      'MMMMMMM.....==......MMMMMM',
      'MMMMMMM..Y..=......RMMMMMM',
      'MM.Y...R....==......MMMMMM',
      'MM......======.R..Y.MMMMMM',
      'MM....Y.=====.......MMMMMM',
      'MM....Y.==...,,,,,,.MMMMMM',
      'MMMMM...==...,,,,,,.MMMMMM',
      'MMMMM.Y.==...,,,,,,.MMMMMM',
      'MMMMM...==...,,,,,,...Y.MM',
      'MM......==........Y....YMM',
      'MM.Y.Y..==========.....YMM',
      'MM......==========..YMMMMM',
      'MM.,,,,,........==...MMMMM',
      'MM.,,,,,.Y.MMM..==...MMMMM',
      'MM.,,,,,...MMM..==...MMMMM',
      'MM.,,,,,...MMMR.==...MMMMM',
      'MM.Y.......MMM..==...MMMMM',
      'MM...Y..........==.....YMM',
      'MM....============......MM',
      'MM.Y..===========.......MM',
      'MM..Y.==.........Y,,,,..MM',
      'MMMMM.==..........,,,,..MM',
      'MMMMM.==..MMMMMM..,,,,..MM',
      'MMMMM.==..MMMMMMY.,,,,..MM',
      'MMMMM.==.Y....Y.........MM',
      'MM....==................MM',
      'MM....==============....MM',
      'MMY.Y.==============....MM',
      'MM................==.MMMMM',
      'MM..Y..Y,,,,,,....==.MMMMM',
      'MM..Y...,,,,,,....==.MMMMM',
      'MMMMMMMM,,,,,,.Y..==.MMMMM',
      'MMMMMMMM,,,,,,.Y..==.MMMMM',
      'MMMMMMMM..........==.Y..MM',
      'MM...Y...Y..========....MM',
      'MMY......Y..=======.....MM',
      'MMMMMM......==.....Y..YRMM',
      'MMMMMM.Y....==.,,,,.MMMMMM',
      'MMMMMM......==.,,,,.MMMMMM',
      'MMMMMM......==.,,,,YMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
    ]),
    objects: [
      signAt(13, 3, { es: 'RUTA 13 · APENINOS\nAl norte: las colinas de la Toscana.', fr: 'ROUTE 13 · APENNINS\nAu nord : les collines de Toscane.' }),
    ],
    conn: { down: { map: 'genova', dx: 4 }, up: { map: 'ruta14', dx: -8 } },
    npcs: [
      trainer({ id: 'r13_beppe', look: 'labrador', x: 11, y: 9, dir: 'left', range: 2, foe: 'peregrino', title: { es: 'PASTOR', fr: 'BERGER' }, level: 35, name: 'Beppe',
        intro: { es: '¡Los lobos me han espantado las ovejas! ¡Tú pagarás!', fr: 'Les loups ont fait fuir mes moutons ! C\'est toi qui vas payer !' },
        lose: { es: 'Mejor voy a buscar a mis ovejas.', fr: 'Je ferais mieux d\'aller chercher mes moutons.' },
        after: { es: 'En los Apeninos hay osos. Si ves uno, ¡no le des la espalda!', fr: 'Dans les Apennins, il y a des ours. Si tu en vois un, ne lui tourne pas le dos !' } }),
      trainer({ id: 'r13_cuervo', look: 'cuervo', x: 19, y: 16, dir: 'left', range: 2, foe: 'cuervo', level: 37,
        intro: { es: '¡Bianca te ha dejado pasar! ¡Pues aquí te paro yo!', fr: 'Bianca t\'a laissé passer ! Eh bien, c\'est moi qui t\'arrête ici !' },
        lose: { es: '¡Corvino me va a matar!', fr: 'Corvino va me tuer !' },
        after: { es: 'El Arsenal de Venecia es una fortaleza. ¡Nunca entrarás!', fr: 'L\'Arsenal de Venise est une forteresse. Tu n\'y entreras jamais !' } }),
      trainer({ id: 'r13_sforza', look: 'condotiero', x: 9, y: 22, dir: 'up', range: 1, foe: 'condotiero', level: 37, name: 'Sforza',
        intro: { es: 'Soy condotiero: lucho por quien me paga. ¡Hoy lucho por diversión!', fr: 'Je suis condottiere : je me bats pour qui me paie. Aujourd\'hui, je me bats pour le plaisir !' },
        lose: { es: 'Me has costado una fortuna en orgullo.', fr: 'Tu m\'as coûté une fortune en fierté.' },
        after: { es: 'El Cuervo intentó contratarme. ¡Les dije que no! La tregua es buena para todos.', fr: 'Le Corbeau a essayé de m\'engager. Je leur ai dit non ! La trêve est bonne pour tout le monde.' } }),
      trainer({ id: 'r13_matteo', look: 'cazador', x: 16, y: 30, dir: 'up', range: 1, foe: 'cazador', level: 36, name: 'Matteo',
        intro: { es: '¡Sigo el rastro de un oso enorme! ¿O eres tú?', fr: 'Je suis la piste d\'un ours énorme ! Ou c\'est toi ?' },
        lose: { es: 'Definitivamente, no eras el oso.', fr: 'Décidément, tu n\'étais pas l\'ours.' },
        after: { es: 'El oso de los Apeninos usa ABRAZO DE OSO: te frena mucho.', fr: 'L\'ours des Apennins utilise ÉTREINTE : ça te ralentit beaucoup.' } }),
      trainer({ id: 'r13_fra', look: 'fraile', x: 15, y: 38, dir: 'up', range: 1, foe: 'fraile', level: 35, name: 'Angelo',
        intro: { es: 'Paz y bien, hij{o}. Pero antes... ¡un poco de penitencia!', fr: 'Paix et joie, mon enfant. Mais d\'abord... un peu de pénitence !' },
        lose: { es: 'Que Dios te acompañe.', fr: 'Que Dieu t\'accompagne.' },
        after: { es: 'Rezaré por que recuperes los sellos.', fr: 'Je prierai pour que tu récupères les sceaux.' } }),
    ],
    items: [
      { id: 'r13a', x: 4, y: 12, item: 'triaca', n: 2 },
      { id: 'r13b', x: 21, y: 26, item: 'unguento', n: 3 },
    ],
  },

  // ── Ruta 14 · colinas de la Toscana (niveles 38-42) ──
  ruta14: {
    name: { es: 'RUTA 14 · TOSCANA', fr: 'ROUTE 14 · TOSCANE' }, bg: 'toscana', theme: 'toscana',
    wild: [{ id: 'jabali', w: 30, lv: [38, 40] }, { id: 'vibora', w: 25, lv: [38, 41] }, { id: 'lobo', w: 20, lv: [39, 41] }, { id: 'salteador', w: 25, lv: [38, 41] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MM.C..C.CC..C..C..C.CC..C..C..CC.C.CC..C..MM',
      'MM.,,,,,,,,...................VVVVVVVVV...MM',
      'MM.,,,,,,,,.......VVVVVVV...............TTMM',
      'MM.,,,,,,,,...................VVVVVVVVV.TTMM',
      'MM.,,,,,,,,.......VVVVVVV.................MM',
      'MM...........C............................MM',
      'MM............==============..............MM',
      'MM.....,,,,,..==============,,,,,,....C...MM',
      'MM.....,,,,,..==..........==,,,,,,........MM',
      'MM.....,,,,,..==..........==,,,,,,..========',
      'MMC....,,,,,..==....TT....==,,,,,,..========',
      'MM.....,,,,,..==....TT..C.==,,,,,,..==....MM',
      'MM............==..........==........==....MM',
      'MM............==...C......==........==....MM',
      'MM..============..........============....MM',
      'MM..===========...C.......===========..C..MM',
      'MM..==....TT.......C..................,,,,MM',
      'MM..==....TT.....VVVVVVVV....VVVVVVVV.,,,,MM',
      'MM..==.......C......................C.,,,,MM',
      'MM..==...........VVVVVVVV....VVVVVVVV.....MM',
      'MMMM==MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMM==MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    ]),
    objects: [
      signAt(6, 21, { es: 'RUTA 14 · TOSCANA\nViñas, cipreses y olivos. Al este: FLORENCIA.', fr: 'ROUTE 14 · TOSCANE\nVignes, cyprès et oliviers. À l\'est : FLORENCE.' }),
    ],
    conn: { down: { map: 'ruta13', dx: 8 }, right: { map: 'florencia', dy: 0 } },
    npcs: [
      trainer({ id: 'r14_fra', look: 'fraile', x: 11, y: 15, dir: 'down', range: 1, foe: 'fraile', level: 38, name: 'Bernardo',
        intro: { es: '¡Mi abadía hace el mejor vino de la Toscana! Y yo, los mejores combates.', fr: 'Mon abbaye fait le meilleur vin de Toscane ! Et moi, les meilleurs combats.' },
        lose: { es: 'Mejor me vuelvo a la bodega.', fr: 'Je ferais mieux de retourner au cellier.' },
        after: { es: 'Florencia está detrás de esas colinas. Verás su gran cúpula desde lejos.', fr: 'Florence est derrière ces collines. Tu verras sa grande coupole de loin.' } }),
      trainer({ id: 'r14_lorenzo', look: 'espadachin', x: 16, y: 12, dir: 'left', range: 1, foe: 'espadachin', level: 39, name: 'Lorenzo',
        intro: { es: '¡En Florencia se lucha con elegancia! ¿Sabes hacer una FINTA?', fr: 'À Florence, on se bat avec élégance ! Tu sais faire une FEINTE ?' },
        lose: { es: 'Touché. Bravo.', fr: 'Touché. Bravo.' },
        after: { es: 'La FINTA nunca falla. ¡Es la técnica favorita del maestro Guido!', fr: 'La FEINTE ne rate jamais. C\'est la technique préférée de maître Guido !' } }),
      trainer({ id: 'r14_cosimo', look: 'mercader', x: 24, y: 11, dir: 'up', range: 2, foe: 'mercader', level: 39, name: 'Cosimo',
        intro: { es: 'Soy banquero. ¡Y los banqueros también sabemos pelear!', fr: 'Je suis banquier. Et les banquiers savent aussi se battre !' },
        lose: { es: 'Has arruinado mis cuentas.', fr: 'Tu as ruiné mes comptes.' },
        after: { es: 'En Florencia hay bancos que prestan a reyes. ¡Y al Cuervo! Bueno, eso dicen.', fr: 'À Florence, il y a des banques qui prêtent aux rois. Et au Corbeau ! Enfin, c\'est ce qu\'on dit.' } }),
      trainer({ id: 'r14_caterina', look: 'espadachina', x: 30, y: 18, dir: 'up', range: 1, foe: 'espadachin', title: { es: 'ESPADACHINA', fr: 'BRETTEUSE' }, level: 40, name: 'Caterina',
        intro: { es: 'Me llaman la Tigresa de Forlì. ¡Veamos tus garras!', fr: 'On m\'appelle la Tigresse de Forlì. Voyons tes griffes !' },
        lose: { es: 'Tienes garras de verdad.', fr: 'Tu as de vraies griffes.' },
        after: { es: 'En Florencia venden la ESPADA FLORENTINA. ¡Es la mejor que existe!', fr: 'À Florence, on vend l\'ÉPÉE FLORENTINE. C\'est la meilleure qui existe !' } }),
      trainer({ id: 'r14_acuto', look: 'condotiero', x: 38, y: 13, dir: 'left', range: 1, foe: 'condotiero', level: 41, name: 'Acuto',
        intro: { es: 'Vine de Inglaterra a luchar por Florencia. ¡Y aquí sigo!', fr: 'Je suis venu d\'Angleterre pour me battre pour Florence. Et je suis toujours là !' },
        lose: { es: 'Me hago viejo...', fr: 'Je me fais vieux...' },
        after: { es: 'Florencia está ahí mismo. Ve a por el maestro Guido.', fr: 'Florence est juste là. Va affronter maître Guido.' } }),
      talker('r14_vinatera', 'florentina', 34, 14, 'down', { es: '¡Este año la vendimia será estupenda! Las uvas están dulcísimas.', fr: 'Cette année, les vendanges seront superbes ! Les raisins sont très sucrés.' }),
    ],
    items: [
      { id: 'r14a', x: 5, y: 4, item: 'triaca', n: 2 },
      { id: 'r14b', x: 31, y: 10, item: 'unguento', n: 3 },
      { id: 'r14c', x: 39, y: 19, item: 'elixir', n: 1 },
    ],
  },

  // ── Florencia: el Arno, la cúpula y el coliseo 4 ──
  florencia: {
    name: { es: 'FLORENCIA', fr: 'FLORENCE' }, bg: 'ciudad', theme: 'toscana',
    build: () => asciiMap([
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'W################################W',
      'W################################W',
      'W################################W',
      'W#################################',
      'W#################################',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      '#################################W',
      '#################################W',
      'W################################W',
      'W##C##########################C##W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W~~~~~~~BB~~~~~~~~~~~~~BB~~~~~~~~W',
      'W~~~~~~~BB~~~~~~~~~~~~~BB~~~~~~~~W',
      'W################################W',
      'W################################W',
      'W##C##########################C##W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ]),
    objects: [
      innHouse(3, 2, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'] }),
      { type: 'dome', x: 13, y: 2, w: 4, h: 4, text: { es: 'SANTA MARÍA DEL FIORE. ¡Qué cúpula tan enorme!', fr: 'SANTA MARIA DEL FIORE. Quelle immense coupole !' } },
      { type: 'tower', x: 18, y: 2, w: 2, h: 5, o: { stone: STONE.claro, roof: ['#e98c62', '#c9623e', '#94422a'], style: 'campanile' }, text: { es: 'El campanario de Giotto, de mármol blanco, verde y rosa.', fr: 'Le campanile de Giotto, en marbre blanc, vert et rose.' } },
      armoryHouse(21, 2, ['florentina', 'brigantina'], { es: 'Espadas florentinas: ligeras, afiladas y bellas.', fr: 'Épées florentines : légères, affûtées et belles.' }, { wall: ['#f0c896', '#d4a06c', '#f6d8b0'] }),
      shopHouse(3, 7, ['hogaza', 'unguento', 'triaca'], GREET.shop, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'] }),
      { type: 'fountain', x: 16, y: 8, w: 2, h: 2, o: { stone: STONE.claro }, text: { es: 'La fuente de Neptuno.', fr: 'La fontaine de Neptune.' } },
      { type: 'tower', x: 26, y: 6, w: 3, h: 6, o: { stone: STONE.gris, color: '#c23a3a' }, text: { es: 'El PALACIO VIEJO, donde gobierna la Señoría de Florencia.', fr: 'Le PALAIS VIEUX, où gouverne la Seigneurie de Florence.' } },
      plainHouse(8, 12, null, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'], frame: '#3a70c0' }),
      plainHouse(19, 12, null, { wall: ['#f0c896', '#d4a06c', '#f6d8b0'], frame: '#3d8c58' }),
      plainHouse(25, 12, { es: 'BANCO. «Prestamos a reyes, papas y mercaderes.»', fr: 'BANQUE. « Nous prêtons aux rois, aux papes et aux marchands. »' }, { wall: ['#e8e4dc', '#c0b8ac', '#f6f4ee'], shield: true }),
      plainHouse(3, 20, null, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'], frame: '#3a70c0' }),
      { type: 'coliseo', x: 13, y: 21, w: 8, h: 5, o: { color: '#7a3a8a', stone: STONE.claro }, door: [3, 4], enter: { map: 'coliseo_florencia', x: 7, y: 13, dir: 'up' } },
      plainHouse(25, 21, null, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'], frame: '#a0402e' }),
      signAt(2, 13, { es: 'FLORENCIA\nCiudad de las artes. Coliseo de ESGRIMA: maestro GUIDO.', fr: 'FLORENCE\nCité des arts. Colisée de l\'ESCRIME : maître GUIDO.' }),
      signAt(31, 7, { es: 'PUERTA DEL ESTE → RUTA 15 · LLANURA DEL PO', fr: 'PORTE EST → ROUTE 15 · PLAINE DU PÔ' }),
    ],
    conn: { left: { map: 'ruta14', dy: 0 }, right: { map: 'ruta15', dy: 0 } },
    npcs: [
      talker('fl_guardia', 'guardia_it', 31, 3, 'down', null, { talk: async W => {
        if (!W.flag('florenciaOpen')) await W.say({ es: 'La puerta del este solo se abre para quien tenga el BLASÓN DE FLORENCIA.', fr: 'La porte est ne s\'ouvre que pour qui possède le BLASON DE FLORENCE.' });
        else await W.say({ es: 'Sigue hacia el este por la llanura del Po. VENECIA te espera.', fr: 'Continue vers l\'est par la plaine du Pô. VENISE t\'attend.' });
      } }),
      talker('fl_banquero', 'florentino', 29, 16, 'down', null, { talk: async W => {
        if (!W.flag('blason_florencia')) await W.say({ es: 'Un tal CORVINO pidió un préstamo enorme para «barcos y armas». Lo cobra en VENECIA.', fr: 'Un certain CORVINO a demandé un énorme prêt pour « des navires et des armes ». Il l\'encaisse à VENISE.' });
        else await W.say({ es: 'Corvino tiene amigos en el ARSENAL de Venecia, donde se construyen los barcos de guerra.', fr: 'Corvino a des amis à l\'ARSENAL de Venise, là où on construit les navires de guerre.' });
      } }),
      talker('fl_pintor', 'anciano', 12, 7, 'down', { es: 'Llevo veinte años pintando esta ciudad y cada día la veo más bonita.', fr: 'Ça fait vingt ans que je peins cette ville et chaque jour je la trouve plus belle.' }),
      { id: 'fl_dante', look: 'dante', x: 24, y: 8, dir: 'down', talk: W => scriptDante(W) },
      talker('fl_dama', 'florentina', 22, 10, 'left', { es: 'El maestro GUIDO es el mejor espadachín de Italia. Usa PARADA para defenderse y atacar a la vez.', fr: 'Maître GUIDO est le meilleur bretteur d\'Italie. Il utilise PARADE pour se défendre et attaquer à la fois.' }),
      talker('fl_nino', 'nino', 10, 17, 'down', { es: '¡Cruza el PUENTE VIEJO para llegar al coliseo!', fr: 'Traverse le PONT VIEUX pour aller au colisée !' }, { wander: 2 }),
    ],
    triggers: [
      { x: 32, y: 4, cond: () => !S0().flags.florenciaOpen, run: W => scriptCityGate(W, 'fl_guardia', 'left', { es: '¡Alto! Sin el BLASÓN DE FLORENCIA no puedes salir hacia el Po.', fr: 'Halte ! Sans le BLASON DE FLORENCE, tu ne peux pas partir vers le Pô.' }) },
      { x: 32, y: 5, cond: () => !S0().flags.florenciaOpen, run: W => scriptCityGate(W, 'fl_guardia', 'left', { es: '¡Alto! Sin el BLASÓN DE FLORENCIA no puedes salir hacia el Po.', fr: 'Halte ! Sans le BLASON DE FLORENCE, tu ne peux pas partir vers le Pô.' }) },
      { x: 1, y: 11, cond: () => !S0().flags.rivalFlorencia, run: W => scriptRivalFlorencia(W) },
      { x: 1, y: 12, cond: () => !S0().flags.rivalFlorencia, run: W => scriptRivalFlorencia(W) },
    ],
  },

  coliseo_florencia: {
    name: { es: 'COLISEO DE FLORENCIA', fr: 'COLISÉE DE FLORENCE' }, bg: 'coliseo', theme: 'toscana', edgeOk: true,
    build: () => asciiMap([
      'WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW',
      'Wssssss#ssssssW',
      'Wsssss###sssssW',
      'Wssssss#ssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WsssssssssssssW',
      'WWWWWWWsWWWWWWW',
    ]),
    objects: [
      { type: 'stand', x: 0, y: 0, w: 15, h: 2, o: { stone: STONE.claro } },
      { type: 'banner', x: 4, y: 2, h: 2, o: { color: '#7a3a8a' } },
      { type: 'banner', x: 10, y: 2, h: 2, o: { color: '#7a3a8a' } },
      { type: 'dummy', x: 2, y: 8, text: { es: 'Un muñeco de esgrima con un corazón pintado.', fr: 'Un mannequin d\'escrime avec un cœur peint.' } },
      { type: 'dummy', x: 12, y: 8 },
      { type: 'barrel', x: 1, y: 12 },
      { type: 'barrel', x: 13, y: 12 },
    ],
    exits: [exitDown(7, 14, { map: 'florencia', x: 16, y: 26, dir: 'down' })],
    npcs: [
      trainer({ id: 'cfl_niccolo', look: 'espadachin', x: 4, y: 10, dir: 'right', range: 4, foe: 'espadachin', level: 41, name: 'Niccolò',
        intro: { es: 'El fin justifica los medios... ¡y mi fin es ganarte!', fr: 'La fin justifie les moyens... et ma fin, c\'est de te battre !' },
        lose: { es: 'Tendré que escribir un libro sobre esta derrota.', fr: 'Il faudra que j\'écrive un livre sur cette défaite.' },
        after: { es: 'Guido empieza con FINTA, que nunca falla. Ten la vida alta.', fr: 'Guido commence par FEINTE, qui ne rate jamais. Garde tes PV hauts.' } }),
      trainer({ id: 'cfl_lucrezia', look: 'espadachina', x: 10, y: 6, dir: 'left', range: 4, foe: 'espadachin', title: { es: 'ESPADACHINA', fr: 'BRETTEUSE' }, level: 42, name: 'Lucrezia',
        intro: { es: '¡En guardia! Mi espada es más rápida que tu sombra.', fr: 'En garde ! Mon épée est plus rapide que ton ombre.' },
        lose: { es: 'Más rápida que tu sombra... pero no que tú.', fr: 'Plus rapide que ton ombre... mais pas que toi.' },
        after: { es: 'Suerte con el maestro. La vas a necesitar.', fr: 'Bonne chance avec le maître. Tu vas en avoir besoin.' } }),
      { id: 'guido', look: 'guido', x: 7, y: 3, dir: 'down', talk: W => scriptGuido(W) },
    ],
  },

  // ── Ruta 15 · llanura del Po (niveles 47-49) ──
  ruta15: {
    name: { es: 'RUTA 15 · LLANURA DEL PO', fr: 'ROUTE 15 · PLAINE DU PÔ' }, bg: 'campo', theme: 'verde',
    wild: [{ id: 'lobo', w: 25, lv: [45, 47] }, { id: 'jabali', w: 25, lv: [45, 47] }, { id: 'vibora', w: 20, lv: [45, 46] }, { id: 'salteador', w: 30, lv: [45, 47] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MM...............~~...........~~..........MM',
      'MM..........,,,,.~~.........C.~~....,,,,,CMM',
      '============,,,,.~~.,,,.......~~....,,,,,.MM',
      '============,,,,.~~.,,,.......~~....,,,,,.MM',
      'MM........==,,,,.~~.,,,.======BB====,,,,,CMM',
      'MM........==,,,,.~~.,,,.======BB====,,,,,.MM',
      'MM.,,,,,,.==,,,,.~~.,,,.==....~~..==,,,,,.MM',
      'MM.,,,,,,.==,,,,.~~.,,,.==..C.~~..==,,,,,CMM',
      'MM.,,,,,,.==,,,,.~~.,,,.==....~~..==,,,,,.MM',
      'MM.,,,,,,.==.....~~.,,,.==....~~..==,,,,,.MM',
      'MM.,,,,,,.==...C.~~.....==..C.~~..==.....CMM',
      'MM........==.....~~.....==....~~..==......MM',
      'MM........=======BB=======....~~..==......MM',
      'MM........=======BB======...C.~~..==========',
      'MM.,,,,,,,,,.....~~......,,,,.~~..==========',
      'MM.,,,,,,,,,.....~~......,,,,.~~..........MM',
      'MM.,,,,,,,,,...C.~~......,,,,.~~.........CMM',
      'MM.,,,,,,,,,.....~~......,,,,.~~..........MM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    ]),
    objects: [
      signAt(3, 3, { es: 'RUTA 15 · LLANURA DEL PO\nCanales, arrozales y álamos. Al este: la laguna y VENECIA.', fr: 'ROUTE 15 · PLAINE DU PÔ\nCanaux, rizières et peupliers. À l\'est : la lagune et VENISE.' }),
    ],
    conn: { left: { map: 'florencia', dy: 0 }, right: { map: 'ruta16', dy: 0 } },
    npcs: [
      talker('r15_campesina', 'anciana', 8, 6, 'up', { es: 'El Po es el río más largo de Italia. Riega todos estos campos.', fr: 'Le Pô est le plus long fleuve d\'Italie. Il irrigue tous ces champs.' }),
      trainer({ id: 'r15_braccio', look: 'condotiero', x: 13, y: 12, dir: 'down', range: 2, foe: 'condotiero', level: 46, name: 'Braccio',
        intro: { es: '¡Mi compañía controla este puente! Peaje: un combate.', fr: 'Ma compagnie contrôle ce pont ! Péage : un combat.' },
        lose: { es: 'Peaje pagado. Pasa.', fr: 'Péage payé. Passe.' },
        after: { es: 'Los condotieros luchamos por dinero. El Cuervo paga muy bien...', fr: 'Nous, les condottieres, nous battons pour l\'argent. Le Corbeau paie très bien...' } }),
      trainer({ id: 'r15_marco', look: 'mercader', x: 21, y: 13, dir: 'down', range: 1, foe: 'mercader', level: 46, name: 'Marco',
        intro: { es: 'Vengo de China... ¡bueno, mi abuelo! ¿Un duelo?', fr: 'Je reviens de Chine... enfin, mon grand-père ! Un duel ?' },
        lose: { es: 'Mi abuelo luchaba mejor.', fr: 'Mon grand-père se battait mieux.' },
        after: { es: 'Mi abuelo contaba historias de un imperio enorme, muy al este.', fr: 'Mon grand-père racontait des histoires d\'un immense empire, très loin à l\'est.' } }),
      trainer({ id: 'r15_isabella', look: 'espadachina', x: 27, y: 8, dir: 'left', range: 2, foe: 'espadachin', title: { es: 'ESPADACHINA', fr: 'BRETTEUSE' }, level: 47, name: 'Isabella',
        intro: { es: 'Soy de Mantua. ¡Allí las damas también saben usar la espada!', fr: 'Je viens de Mantoue. Là-bas, les dames savent aussi manier l\'épée !' },
        lose: { es: 'Impresionante.', fr: 'Impressionnant.' },
        after: { es: 'Venecia está al otro lado de la laguna.', fr: 'Venise est de l\'autre côté de la lagune.' } }),
      trainer({ id: 'r15_cuervo', look: 'cuervo', x: 36, y: 13, dir: 'left', range: 1, foe: 'cuervo', level: 48,
        intro: { es: '¡Alto! ¡El Arsenal es territorio del Cuervo!', fr: 'Halte ! L\'Arsenal est le territoire du Corbeau !' },
        lose: { es: '¡Avisaré al jefe!', fr: 'Je vais prévenir le chef !' },
        after: { es: 'Corvino tiene a cien mercenarios en el Arsenal...', fr: 'Corvino a cent mercenaires à l\'Arsenal...' } }),
      trainer({ id: 'r15_fra', look: 'fraile', x: 39, y: 17, dir: 'up', range: 1, foe: 'fraile', level: 47, name: 'Tommaso',
        intro: { es: 'Peregrino a Venecia. ¡Pero un poco de combate no hace daño!', fr: 'Pèlerin pour Venise. Mais un peu de combat ne fait pas de mal !' },
        lose: { es: 'Un poco sí que duele...', fr: 'Ça fait un peu mal, quand même...' },
        after: { es: 'Que San Marcos te proteja.', fr: 'Que saint Marc te protège.' } }),
    ],
    items: [
      { id: 'r15a', x: 5, y: 10, item: 'elixir', n: 1 },
      { id: 'r15b', x: 38, y: 5, item: 'triaca', n: 3 },
    ],
  },

  // ── Ruta 16 · orillas de la laguna (niveles 49-51) ──
  ruta16: {
    name: { es: 'RUTA 16 · LAGUNA VÉNETA', fr: 'ROUTE 16 · LAGUNE DE VENISE' }, bg: 'laguna', theme: 'laguna', edgeOk: true,
    wild: [{ id: 'gaviota', w: 35, lv: [47, 49] }, { id: 'cangrejo', w: 35, lv: [47, 49] }, { id: 'vibora', w: 30, lv: [47, 48] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~~',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~~',
      'MM..................~~~~~~~~..C.~~',
      'MM....~~~~~~........~~~~~~~~....~~',
      'MM....~~~~~~........~~~~~~~~....~~',
      'MM....~~~~~~........~~~~~~~~....~~',
      'MM....~~~~~~..............,,,,..~~',
      'MM....~~~~~~..............,,,,..~~',
      'MM..........================....~~',
      'MM.,,,,,,,..================....~~',
      'MM.,,,,,,,..==...~~~~~....==....~~',
      'MM.,,,,,,,..==...~~~~~....==....~~',
      'MM.,,,,,,,..==...~~~~~....==....~~',
      'MM..........==............==....~~',
      'MM..........==............======BB',
      '==============.........C..======BB',
      '=============.,,,,,,,,..........~~',
      'MM............,,,,,,,,........C.~~',
      'MM............,,,,,,,,..~~~~~~~~~~',
      'MM............,,,,,,,,..~~~~~~~~~~',
      'MM..~~~~~~~.............~~~~~~~~~~',
      'MM..~~~~~~~......C......~~~~~~~~~~',
      'MM..~~~~~~~...~~~~~~............~~',
      'MM..~~~~~~~...~~~~~~..,,,,,,....~~',
      'MM..~~~~~~~..C~~~~~~..,,,,,,....~~',
      'MM......C.....~~~~~~..,,,,,,....~~',
      'MM.C,,,,,,....~~~~~~..,,,,,,....~~',
      'MM..,,,,,,....~~~~~~........C...~~',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~~',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM~~',
    ]),
    objects: [
      signAt(3, 14, { es: 'RUTA 16 · LAGUNA VÉNETA\nAl este, sobre el agua: VENECIA.', fr: 'ROUTE 16 · LAGUNE DE VENISE\nÀ l\'est, sur l\'eau : VENISE.' }),
      { type: 'boat', x: 6, y: 8, w: 2, h: 1, text: { es: 'Una barca de pescadores de la laguna.', fr: 'Une barque de pêcheurs de la lagune.' } },
    ],
    conn: { left: { map: 'ruta15', dy: 0 }, right: { map: 'venecia', dy: 0 } },
    npcs: [
      trainer({ id: 'r16_piero', look: 'pescador', x: 10, y: 12, dir: 'right', range: 2, foe: 'marinero', title: { es: 'PESCADOR', fr: 'PÊCHEUR' }, level: 48, name: 'Piero',
        intro: { es: '¡Los cangrejos de la laguna pellizcan fuerte! ¿Y tú?', fr: 'Les crabes de la lagune pincent fort ! Et toi ?' },
        lose: { es: 'Tú pellizcas más.', fr: 'Toi, tu pinces plus fort.' },
        after: { es: 'Venecia está construida sobre millones de troncos clavados en el barro.', fr: 'Venise est construite sur des millions de pieux plantés dans la vase.' } }),
      trainer({ id: 'r16_cuerva', look: 'cuerva', x: 16, y: 11, dir: 'up', range: 2, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 49,
        intro: { es: '¡No llegarás a Venecia! ¡Hundiremos tu barca!', fr: 'Tu n\'atteindras pas Venise ! On coulera ta barque !' },
        lose: { es: '¡Glub!', fr: 'Glouglou !' },
        after: { es: 'Corvino lleva semanas escondido en el Arsenal.', fr: 'Corvino se cache à l\'Arsenal depuis des semaines.' } }),
      trainer({ id: 'r16_marco', look: 'gondolero', x: 23, y: 11, dir: 'up', range: 2, foe: 'gondolero', level: 49, name: 'Marco',
        intro: { es: '¡Con el remo soy un artista! ¡Mira!', fr: 'Avec la rame, je suis un artiste ! Regarde !' },
        lose: { es: '¡Mamma mia!', fr: 'Mamma mia !' },
        after: { es: 'Los gondoleros conocemos todos los canales. ¡Hasta los secretos del Arsenal!', fr: 'Nous, les gondoliers, connaissons tous les canaux. Même les secrets de l\'Arsenal !' } }),
      trainer({ id: 'r16_cuervo', look: 'cuervo', x: 29, y: 12, dir: 'left', range: 2, foe: 'cuervo', level: 50,
        intro: { es: '¡Última guardia antes de Venecia! ¡No pasarás!', fr: 'Dernière garde avant Venise ! Tu ne passeras pas !' },
        lose: { es: '¡He fallado al Cuervo!', fr: 'J\'ai échoué pour le Corbeau !' },
        after: { es: 'La puerta del Arsenal está en el este de Venecia. Está bien vigilada...', fr: 'La porte de l\'Arsenal est à l\'est de Venise. Elle est bien gardée...' } }),
      talker('r16_vieja', 'anciana', 8, 17, 'down', { es: 'Mi marido era gondolero. Decía que en el Arsenal pueden construir un barco en un solo día.', fr: 'Mon mari était gondolier. Il disait qu\'à l\'Arsenal, on peut construire un navire en un seul jour.' }),
    ],
    items: [
      { id: 'r16a', x: 5, y: 26, item: 'triaca', n: 3 },
      { id: 'r16b', x: 27, y: 25, item: 'elixir', n: 1 },
    ],
  },

  // ── Venecia: ciudad sobre el agua ──
  venecia: {
    name: { es: 'VENECIA', fr: 'VENISE' }, bg: 'laguna', theme: 'laguna', edgeOk: true,
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~################~~################~',
      '~################~~################~',
      '~################~~################~',
      '~################BB################~',
      '~################BB################~',
      '~################~~################~',
      '~################~~################~',
      '~~~~~~~~BB~~~~~~~~~~~~~~~~~BB~~~~~~~',
      '~~~~~~~~BB~~~~~~~~~~~~~~~~~BB~~~~~~~',
      '~################~~################~',
      '~################~~################~',
      '~################~~################~',
      '#################~~################~',
      '#################BB################~',
      '~################BB################~',
      '~################~~################~',
      '~################~~################~',
      '~################~~################~',
      '~################~~################~',
      '~~~~~~~~BB~~~~~~~~~~~~~~~~~BB~~~~~~~',
      '~~~~~~~~BB~~~~~~~~~~~~~~~~~BB~~~~~~~',
      '~################~~################~',
      '~################~~################~',
      '~################BB################~',
      '~################BB################~',
      '~################~~################~',
      '~################~~################~',
      '~################~~################~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      armoryHouse(2, 3, ['florentina', 'arnes'], { es: 'Arneses de Milán, los mejores de Europa. ¡Caros, pero te salvarán la vida!', fr: 'Des armures de Milan, les meilleures d\'Europe. Chères, mais elles te sauveront la vie !' }, { wall: ['#f0c896', '#d4a06c', '#f6d8b0'] }),
      plainHouse(9, 3, null, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'], frame: '#3d8c58' }),
      plainHouse(20, 3, null, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'], frame: '#3a70c0' }),
      plainHouse(28, 3, null, { wall: ['#e8e4dc', '#c0b8ac', '#f6f4ee'], frame: '#a0402e' }),
      signAt(14, 7, { es: 'Al norte, tras la laguna: los DOLOMITAS y ALEMANIA. (Próximamente)', fr: 'Au nord, après la lagune : les DOLOMITES et l\'ALLEMAGNE. (Prochainement)' }),
      innHouse(2, 11, { wall: ['#f6e0a0', '#d8bc78', '#fbecc0'] }),
      shopHouse(8, 11, ['hogaza', 'unguento', 'triaca', 'elixir'], GREET.shop, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'] }),
      { type: 'fountain', x: 11, y: 17, w: 2, h: 2, o: { stone: STONE.claro }, text: { es: 'Un pozo de agua de lluvia. En Venecia, el agua dulce vale oro.', fr: 'Un puits d\'eau de pluie. À Venise, l\'eau douce vaut de l\'or.' } },
      { type: 'dome', x: 20, y: 11, w: 4, h: 4, text: { es: 'La BASÍLICA DE SAN MARCOS, cubierta de mosaicos de oro.', fr: 'La BASILIQUE SAINT-MARC, couverte de mosaïques d\'or.' } },
      { type: 'tower', x: 25, y: 11, w: 2, h: 6, o: { stone: STONE.rojo, roof: ['#7aa88a', '#5a8a6a', '#3a6a4a'], style: 'campanile' }, text: { es: 'El campanario de San Marcos.', fr: 'Le campanile de Saint-Marc.' } },
      plainHouse(28, 11, { es: 'El PALACIO DUCAL, donde vive el DUX de Venecia.', fr: 'Le PALAIS DES DOGES, où vit le DOGE de Venise.' }, { wall: ['#f6e8e0', '#e0c8c0', '#fff6f2'], frame: '#a0402e', roof: ['#e98c62', '#c9623e', '#94422a'], shield: true }),
      plainHouse(2, 24, null, { wall: ['#f0c896', '#d4a06c', '#f6d8b0'], frame: '#3a70c0' }),
      plainHouse(9, 24, null, { wall: ['#e8e4dc', '#c0b8ac', '#f6f4ee'], frame: '#3d8c58' }),
      plainHouse(20, 24, null, { wall: ['#f0b4a8', '#d48c80', '#f6ccc0'], frame: '#a0402e' }),
      { type: 'gate', x: 28, y: 24, w: 4, h: 3, o: { stone: STONE.rojo, color: '#c23a3a', portcullis: true }, door: [1, 2], enter: { map: 'arsenal', x: 13, y: 20, dir: 'up' },
        locked: () => !(S0().flags.tr_ve_g1 && S0().flags.tr_ve_g2), lockedText: { es: 'La puerta del ARSENAL está cerrada. La vigilan mercenarios del Cuervo.', fr: 'La porte de l\'ARSENAL est fermée. Des mercenaires du Corbeau la gardent.' } },
      signAt(33, 27, { es: 'EL ARSENAL\nAstillero de la República de Venecia.', fr: 'L\'ARSENAL\nChantier naval de la République de Venise.' }),
      { type: 'gondola', x: 2, y: 9, w: 3, h: 1 },
      { type: 'gondola', x: 22, y: 21, w: 3, h: 1 },
      { type: 'gondola', x: 11, y: 30, w: 3, h: 1 },
    ],
    conn: { left: { map: 'ruta16', dy: 0 } },
    npcs: [
      { id: 've_dux', look: 'dux', x: 31, y: 15, dir: 'down', talk: W => scriptDux(W) },
      talker('ve_gondolero', 'gondolero', 15, 16, 'left', { es: '¡Bienvenid{o} a Venecia! Aquí no hay calles: hay canales y puentes.', fr: 'Bienvenue à Venise ! Ici, pas de rues : des canaux et des ponts.' }),
      talker('ve_veneciana', 'veneciana', 6, 17, 'down', { es: 'Desde que llegó el Cuervo, el Arsenal está cerrado. ¡Ya no se construyen barcos!', fr: 'Depuis l\'arrivée du Corbeau, l\'Arsenal est fermé. On ne construit plus de navires !' }),
      talker('ve_mercader', 'veneciano', 24, 17, 'down', { es: 'Las especias de Oriente llegan a Venecia y de aquí van a toda Europa.', fr: 'Les épices d\'Orient arrivent à Venise et partent d\'ici vers toute l\'Europe.' }),
      talker('ve_nina', 'nina', 15, 28, 'down', { es: '¡He visto a un hombre con capa negra entrar en el Arsenal! Daba miedo.', fr: 'J\'ai vu un homme avec une cape noire entrer dans l\'Arsenal ! Il faisait peur.' }, { wander: 2 }),
      trainer({ id: 've_g1', look: 'cuervo', x: 27, y: 28, dir: 'right', range: 4, foe: 'cuervo', level: 51,
        intro: { es: '¡Nadie entra en el Arsenal! ¡Órdenes de Corvino!', fr: 'Personne n\'entre dans l\'Arsenal ! Ordres de Corvino !' },
        lose: { es: '¡Ugh! ¡Mi compañero te detendrá!', fr: 'Argh ! Mon camarade va t\'arrêter !' },
        after: { es: '...', fr: '...' } }),
      trainer({ id: 've_g2', look: 'cuerva', x: 32, y: 28, dir: 'left', range: 4, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 52,
        intro: { es: '¡Has llegado lejos, pero aquí se acaba tu viaje!', fr: 'Tu es allé{e} loin, mais ton voyage s\'arrête ici !' },
        lose: { es: 'La puerta... ¡está abierta!', fr: 'La porte... est ouverte !' },
        after: { es: '...', fr: '...' } }),
    ],
    entry: [[0, 14]],
    onEnter: async W => { if (!W.flag('rivalVenecia') && W.player.x <= 1) await scriptRivalVenecia(W); },
  },

  // ── El Arsenal: la guarida del Cuervo ──
  arsenal: {
    name: { es: 'EL ARSENAL', fr: 'L\'ARSENAL' }, bg: 'arsenal', theme: 'madera', edgeOk: true,
    build: () => asciiMap([
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WDXXDDDDDDDDDDDDDDDDDDDDXXDW',
      'WDXDDDDDDDDDDDDDDDDDDDDDDXDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WDDDDDXDDDDDDDDDDDDDDXDDDDDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WDDDDDDD~~~~~~~~~~~~DDDDDDDW',
      'WDDDDDDD~~KKKKKKKK~~DDDDDDDW',
      'WDDDDDDD~~KDDDDDDK~~DDDDDDDW',
      'WDDDDDDD~~KDDDDDDK~~DDDDDDDW',
      'WDDDDDDD~~KKKKKKKK~~DDDDDDDW',
      'WDDDDDDD~~~~~~~~~~~~DDDDDDDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WDDDDDXDDDDDDDDDDDDDDXDDDDDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WDXDDDDDDDDDDDDDDDDDDDDDDXDW',
      'WDXXDDDDDDDDDDDDDDDDDDDDXXDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WDDDDDDDDDDDDDDDDDDDDDDDDDDW',
      'WWWWWWWWWWWWWDDWWWWWWWWWWWWW',
    ]),
    objects: [
      { type: 'chest', x: 12, y: 2, text: { es: 'Un cofre vacío. Huele a pólvora.', fr: 'Un coffre vide. Ça sent la poudre.' } },
      { type: 'chest', x: 15, y: 2, o: { color: '#5a2a2a' }, run: W => scriptCofreSellos(W) },
      { type: 'barrel', x: 6, y: 11 },
      { type: 'barrel', x: 21, y: 11 },
      { type: 'banner', x: 9, y: 2, h: 2, o: { color: '#3a3440', mark: '#c23a3a' } },
      { type: 'banner', x: 18, y: 2, h: 2, o: { color: '#3a3440', mark: '#c23a3a' } },
    ],
    exits: [exitDown(13, 21, { map: 'venecia', x: 29, y: 27, dir: 'down' }), exitDown(14, 21, { map: 'venecia', x: 30, y: 27, dir: 'down' })],
    npcs: [
      trainer({ id: 'ar_c1', look: 'cuerva', x: 9, y: 17, dir: 'right', range: 4, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 50,
        intro: { es: '¡Intrus{o}! ¡Dad la alarma!', fr: 'Intrus ! Donnez l\'alerte !' },
        lose: { es: '¡Demasiado fuerte!', fr: 'Trop fort{e} !' }, after: { es: '...', fr: '...' } }),
      trainer({ id: 'ar_c2', look: 'condotiero', x: 18, y: 14, dir: 'left', range: 4, foe: 'condotiero', level: 51, name: 'Ezzelino',
        intro: { es: 'Corvino me paga el triple que Florencia. ¡Nada personal!', fr: 'Corvino me paie le triple de Florence. Rien de personnel !' },
        lose: { es: 'Ni el triple vale esto.', fr: 'Même le triple ne vaut pas ça.' }, after: { es: 'Me largo de aquí.', fr: 'Je m\'en vais d\'ici.' } }),
      trainer({ id: 'ar_c3', look: 'cuervo', x: 5, y: 9, dir: 'right', range: 2, foe: 'cuervo', level: 51,
        intro: { es: '¡Por el Cuervo!', fr: 'Pour le Corbeau !' },
        lose: { es: '¡Jefe, ayuda!', fr: 'Chef, à l\'aide !' }, after: { es: '...', fr: '...' } }),
      trainer({ id: 'ar_c4', look: 'cuervo', x: 22, y: 6, dir: 'left', range: 4, foe: 'cuervo', level: 52,
        intro: { es: '¡No te acercarás a los sellos!', fr: 'Tu ne t\'approcheras pas des sceaux !' },
        lose: { es: 'Corvino... perdóname...', fr: 'Corvino... pardonne-moi...' }, after: { es: '...', fr: '...' } }),
      { id: 'corvino', look: 'corvino', x: 13, y: 4, dir: 'down', cond: () => !S0().flags.corvinoDone, talk: W => scriptCorvino(W) },
    ],
  },
});

// ─── Guiones de Italia ────────────────────────────────────────────────────
async function scriptCityGate(W, guardId, back, text) {
  const g = W.npc(guardId);
  if (g) g.dir = W.dirTo(g, W.player);
  await W.say(text);
  await W.walk(W.player, back, 1);
}

async function scriptBianca(W) {
  if (W.flag('blason_genova')) {
    await W.say({ es: 'BIANCA: El camino a Florencia está abierto. ¡Apunta bien, {name}!', fr: 'BIANCA : La route de Florence est ouverte. Vise bien, {name} !' });
    return;
  }
  await W.say({ es: 'BIANCA: Así que tú eres quien persigue al Cuervo. Esos ladrones compraron cien ballestas en mi ciudad.', fr: 'BIANCA : Alors c\'est toi qui poursuis le Corbeau. Ces voleurs ont acheté cent arbalètes dans ma ville.' });
  await W.say({ es: 'BIANCA: Pero un ballestero genovés no regala nada. ¡Demuéstrame que mereces mi ayuda!', fr: 'BIANCA : Mais un arbalétrier génois ne donne rien. Prouve-moi que tu mérites mon aide !' });
  const res = await W.battle({ foe: 'bianca', level: 34, look: 'bianca', trainer: { es: 'MAESTRA BIANCA', fr: 'MAÎTRESSE BIANCA' }, canLose: false, canFlee: false,
    defeatText: { es: '¡Increíble! ¡Has esquivado todos mis virotes!', fr: 'Incroyable ! Tu as esquivé tous mes carreaux !' }, winText: { es: 'Practica tu puntería y vuelve.', fr: 'Travaille ta précision et reviens.' } });
  if (res !== 'win') return;
  await W.say({ es: 'BIANCA: Te lo has ganado. ¡El blasón de la cruz roja es tuyo!', fr: 'BIANCA : Tu l\'as mérité. Le blason à la croix rouge est à toi !' });
  await W.blason('genova', CRESTS[2][3]);
  await W.receive('triaca', 3);
  W.flag('genovaOpen', true);
  await W.say({ es: 'BIANCA: Los mercenarios del Cuervo se llevaron las ballestas hacia VENECIA. El camino pasa por FLORENCIA, donde está el coliseo del maestro GUIDO.', fr: 'BIANCA : Les mercenaires du Corbeau ont emporté les arbalètes vers VENISE. La route passe par FLORENCE, où se trouve le colisée de maître GUIDO.' });
  await W.say({ es: 'BIANCA: Ya puedes salir por la puerta norte. ¡Buena caza!', fr: 'BIANCA : Tu peux maintenant sortir par la porte nord. Bonne chasse !' });
  Game.save();
}

async function scriptRivalFlorencia(W) {
  W.flag('rivalFlorencia', true);
  const p = W.player;
  const r = W.spawn({ id: 'rival_fl', look: rivalLook(), x: 6, y: 11, dir: 'left' });
  W.bubble(r); Sfx.play('alert'); await W.wait(700); W.bubble(null);
  await W.say({ es: '{rival}: ¡{name}! He venido desde Fez en un barco mercante. ¡Cómo has mejorado!', fr: '{rival} : {name} ! Je suis venu{e} de Fès sur un navire marchand. Tu as tellement progressé !' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: Yo también he entrenado muchísimo. ¡Esta vez va en serio!', fr: '{rival} : Moi aussi, je me suis beaucoup entraîné{e}. Cette fois, c\'est sérieux !' });
  const res = await W.battle({ foe: 'rival', level: 41, name: rivalName().toUpperCase(), look: rivalLook(), trainer: rivalName(), canLose: true, canFlee: false,
    defeatText: { es: 'Increíble... Mi padre estaría orgulloso de ti.', fr: 'Incroyable... Mon père serait fier de toi.' }, winText: { es: '¡Por fin te gano!', fr: 'Enfin je te bats !' } });
  if (res !== 'win') healPlayer();
  await W.say({ es: '{rival}: Iré delante a VENECIA para vigilar el Arsenal. ¡Gana al maestro Guido y alcánzame!', fr: '{rival} : Je pars devant à VENISE pour surveiller l\'Arsenal. Bats maître Guido et rejoins-moi !' });
  await W.walkTo(r, 6, 12);
  await W.fadeNpc(r);
  Game.save();
}

async function scriptGuido(W) {
  if (W.flag('blason_florencia')) {
    await W.say({ es: 'GUIDO: La puerta del este está abierta. Que tu espada sea tan rápida como tu cabeza.', fr: 'GUIDO : La porte est est ouverte. Que ton épée soit aussi vive que ton esprit.' });
    return;
  }
  await W.say({ es: 'GUIDO: La esgrima es como la pintura: cada movimiento debe ser bello... y mortal.', fr: 'GUIDO : L\'escrime, c\'est comme la peinture : chaque mouvement doit être beau... et mortel.' });
  await W.say({ es: 'GUIDO: Dicen que persigues al Cuervo. Para entrar en su guarida necesitarás algo más que valor. ¡En guardia!', fr: 'GUIDO : On dit que tu poursuis le Corbeau. Pour entrer dans son repaire, il te faudra plus que du courage. En garde !' });
  const res = await W.battle({ foe: 'guido', level: 44, look: 'guido', trainer: { es: 'MAESTRO GUIDO', fr: 'MAÎTRE GUIDO' }, canLose: false, canFlee: false,
    defeatText: { es: 'Bellissimo. Un combate digno de un cuadro.', fr: 'Bellissimo. Un combat digne d\'un tableau.' }, winText: { es: 'Te falta elegancia. Vuelve cuando la tengas.', fr: 'Il te manque l\'élégance. Reviens quand tu l\'auras.' } });
  if (res !== 'win') return;
  await W.say({ es: 'GUIDO: Has luchado como un maestro. Toma el blasón del lirio.', fr: 'GUIDO : Tu t\'es battu{e} comme un maître. Prends le blason du lys.' });
  await W.blason('florencia', CRESTS[3][3]);
  await W.receive('elixir', 1);
  W.flag('florenciaOpen', true);
  await W.say({ es: 'GUIDO: CORVINO, el jefe del Cuervo, se esconde en el ARSENAL de VENECIA. Ve al este por la llanura del Po.', fr: 'GUIDO : CORVINO, le chef du Corbeau, se cache à l\'ARSENAL de VENISE. Va vers l\'est par la plaine du Pô.' });
  Game.save();
}

async function scriptRivalVenecia(W) {
  W.flag('rivalVenecia', true);
  const p = W.player;
  const r = W.spawn({ id: 'rival_ve', look: rivalLook(), x: 4, y: 15, dir: 'left' });
  W.bubble(r); Sfx.play('alert'); await W.wait(700); W.bubble(null);
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: ¡Por fin llegas! He vigilado el Arsenal: está en el ESTE de la ciudad. Dos mercenarios guardan la puerta.', fr: '{rival} : Enfin te voilà ! J\'ai surveillé l\'Arsenal : il est à l\'EST de la ville. Deux mercenaires gardent la porte.' });
  await W.say({ es: '{rival}: Dentro está CORVINO con los sellos robados. Descansa en la POSADA y compra lo que necesites. ¡Será duro!', fr: '{rival} : À l\'intérieur, il y a CORVINO avec les sceaux volés. Repose-toi à l\'AUBERGE et achète ce qu\'il te faut. Ce sera dur !' });
  await W.say({ es: '{rival}: Yo avisaré al DUX para que sus guardias rodeen el Arsenal. ¡Suerte, {name}!', fr: '{rival} : Je vais prévenir le DOGE pour que ses gardes encerclent l\'Arsenal. Bonne chance, {name} !' });
  await W.walkTo(r, 4, 16);
  await W.fadeNpc(r);
  Game.save();
}

async function scriptCorvino(W) {
  const c = W.npc('corvino');
  await W.say({ es: 'CORVINO: Vaya, vaya... {El} {esc} de Villaolivo. Has cruzado medio mundo para llegar hasta mí.', fr: 'CORVINO : Tiens, tiens... L\'{esc} de Villaolivo. Tu as traversé la moitié du monde pour arriver jusqu\'à moi.' });
  await W.say({ es: 'CORVINO: ¿Sabes qué hacía yo antes de la tregua? Era capitán de mercenarios. Vivía de la guerra. ¡Y la tregua me lo quitó todo!', fr: 'CORVINO : Tu sais ce que je faisais avant la trêve ? J\'étais capitaine de mercenaires. Je vivais de la guerre. Et la trêve m\'a tout pris !' });
  await W.say({ es: 'CORVINO: Con los Seis Sellos rotos, los reinos volverán a pelear... y me pagarán lo que yo pida. ¡Nadie me lo impedirá!', fr: 'CORVINO : Avec les Six Sceaux brisés, les royaumes se battront à nouveau... et ils me paieront ce que je voudrai. Personne ne m\'en empêchera !' });
  const res = await W.battle({ foe: 'corvino', level: 54, look: 'corvino', trainer: { es: 'CORVINO, JEFE DEL CUERVO', fr: 'CORVINO, CHEF DU CORBEAU' }, canLose: false, canFlee: false, bg: 'arsenal',
    defeatText: { es: '¡Imposible! ¡Derrotado por {un} {esc}!', fr: 'Impossible ! Vaincu par un{e} {esc} !' }, winText: { es: 'La guerra volverá. Y tú no podrás impedirlo.', fr: 'La guerre reviendra. Et tu ne pourras pas l\'empêcher.' } });
  if (res !== 'win') return;
  await W.say({ es: 'CORVINO: Grr... Te has ganado los sellos de Castilla y de Fez. ¡Pero esto no ha terminado!', fr: 'CORVINO : Grr... Tu as gagné les sceaux de Castille et de Fès. Mais ce n\'est pas fini !' });
  await W.say({ es: 'CORVINO: El verdadero jefe del Cuervo te espera en ALEMANIA. ¡Y él no tiene piedad!', fr: 'CORVINO : Le vrai chef du Corbeau t\'attend en ALLEMAGNE. Et lui n\'a aucune pitié !' });
  Sfx.play('door');
  await W.fadeNpc(c);
  W.flag('corvinoDone', true);
  await W.say({ es: 'Corvino escapa por una trampilla secreta hacia los canales...', fr: 'Corvino s\'échappe par une trappe secrète vers les canaux...' }, { color: 'blue' });
  await W.say({ es: 'Detrás de él hay un cofre de terciopelo rojo.', fr: 'Derrière lui, il y a un coffre de velours rouge.' }, { color: 'blue' });
  Game.save();
}

async function scriptCofreSellos(W) {
  if (!W.flag('corvinoDone')) { await W.say({ es: 'Un cofre cerrado con candado. Corvino no te deja acercarte.', fr: 'Un coffre fermé par un cadenas. Corvino ne te laisse pas approcher.' }); return; }
  if (W.flag('sellosRecuperados')) { await W.say({ es: 'El cofre está vacío.', fr: 'Le coffre est vide.' }); return; }
  W.flag('sellosRecuperados', true);
  Sfx.play('win');
  await W.say({ es: '¡{name} recupera el SELLO DE CASTILLA y el SELLO DE FEZ!', fr: '{name} récupère le SCEAU DE CASTILLE et le SCEAU DE FÈS !' }, { color: 'blue' });
  const p = W.player;
  const r = W.spawn({ id: 'rival_ar', look: rivalLook(), x: 13, y: 20, dir: 'up' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: ¡{name}! ¡Los guardias del Dux han tomado el Arsenal! ¿Y Corvino?', fr: '{rival} : {name} ! Les gardes du Doge ont pris l\'Arsenal ! Et Corvino ?' });
  await W.say({ es: '{rival}: ¿Ha huido a Alemania? Entonces la aventura sigue... ¡Pero primero, vamos a ver al DUX!', fr: '{rival} : Il a fui en Allemagne ? Alors l\'aventure continue... Mais d\'abord, allons voir le DOGE !' });
  await W.fadeNpc(r);
  Game.save();
}

async function scriptDux(W) {
  if (!W.flag('sellosRecuperados')) {
    await W.say({ es: 'DUX: Soy el Dux de Venecia. Unos mercenarios se han hecho con mi ARSENAL. ¡Una vergüenza para la República!', fr: 'DOGE : Je suis le Doge de Venise. Des mercenaires se sont emparés de mon ARSENAL. Une honte pour la République !' });
    await W.say({ es: 'DUX: Si los expulsas, Venecia te estará eternamente agradecida.', fr: 'DOGE : Si tu les chasses, Venise te sera éternellement reconnaissante.' });
    return;
  }
  if (W.flag('finCapitulo1')) {
    await W.say({ es: 'DUX: Venecia nunca olvidará lo que hiciste, {name}. Cuando estés list{o}, el camino de los Dolomitas te llevará a Alemania.', fr: 'DOGE : Venise n\'oubliera jamais ce que tu as fait, {name}. Quand tu seras prêt{e}, la route des Dolomites te mènera en Allemagne.' });
    return;
  }
  W.flag('finCapitulo1', true);
  await W.say({ es: 'DUX: ¡Has liberado el Arsenal y recuperado los sellos de Castilla y de Fez! Los enviaré a sus reyes con mi mejor escolta.', fr: 'DOGE : Tu as libéré l\'Arsenal et récupéré les sceaux de Castille et de Fès ! Je les enverrai à leurs rois avec ma meilleure escorte.' });
  await W.say({ es: 'DUX: En nombre de la República de Venecia, acepta esta recompensa.', fr: 'DOGE : Au nom de la République de Venise, accepte cette récompense.' });
  await W.gold(3000);
  await W.receive('elixir', 3);
  await W.say({ es: 'DUX: Corvino ha huido hacia el norte, a ALEMANIA. Allí está el coliseo de NÚREMBERG... y quizá el jefe del Cuervo.', fr: 'DOGE : Corvino a fui vers le nord, en ALLEMAGNE. Là-bas se trouve le colisée de NUREMBERG... et peut-être le chef du Corbeau.' });
  Sfx.play('win');
  await W.say({ es: '— FIN DEL CAPÍTULO I —', fr: '— FIN DU CHAPITRE I —' }, { color: 'blue' });
  await W.say({ es: '¡Gracias por jugar al prototipo de LAS SEIS CORONAS! El viaje a Alemania llegará en la próxima versión. Puedes seguir entrenando y explorando.', fr: 'Merci d\'avoir joué au prototype des SIX COURONNES ! Le voyage en Allemagne arrivera dans la prochaine version. Tu peux continuer à t\'entraîner et à explorer.' });
  Game.save();
}

// ─── Misión secreta: Dante y el título de Caballero del Infierno ──────────
async function scriptDante(W) {
  if (W.flag('caballeroInfierno')) {
    const p = P(), miss = ['matademonios', 'beso'].filter(m => !p.moves.find(x => x.id === m));
    if (!miss.length) { await W.say({ es: 'DANTE: Ve, {cab} del Infierno. Y que el amor que mueve el sol y las estrellas te guíe.', fr: 'DANTE : Va, {cab} de l\'Enfer. Et que l\'amour qui meut le soleil et les étoiles te guide.' }); return; }
    const r = await W.ask({ es: 'DANTE: ¿Has olvidado alguna de mis técnicas? ¿Quieres que te la enseñe otra vez?', fr: 'DANTE : Tu as oublié une de mes techniques ? Veux-tu que je te l\'enseigne de nouveau ?' }, [t('yes'), t('no')]);
    if (r === 0) for (const m of miss) await W.learnMove(m);
    return;
  }
  await W.say({ es: 'DANTE: ¿Me reconoces? Soy Dante Alighieri, poeta de Florencia. ¿Que llevo un siglo muerto? Digamos que he vuelto de un viaje muy largo...', fr: 'DANTE : Tu me reconnais ? Je suis Dante Alighieri, poète de Florence. Mort depuis un siècle, dis-tu ? Disons que je reviens d\'un très long voyage...' });
  await W.say({ es: 'DANTE: En mi DIVINA COMEDIA cuento cómo, perdido en una selva oscura, viajé por el INFIERNO, el PURGATORIO y el PARAÍSO.', fr: 'DANTE : Dans ma DIVINE COMÉDIE, je raconte comment, perdu dans une forêt obscure, j\'ai voyagé à travers l\'ENFER, le PURGATOIRE et le PARADIS.' });
  await W.say({ es: 'DANTE: Un gran poeta de la antigua Roma me guió por el Infierno, círculo a círculo, hasta el fondo, donde Lucifer está atrapado en el hielo.', fr: 'DANTE : Un grand poète de la Rome antique m\'a guidé à travers l\'Enfer, cercle après cercle, jusqu\'au fond, où Lucifer est pris dans la glace.' });
  await W.say({ es: 'DANTE: Después subimos la montaña del Purgatorio, y al final mi amada BEATRIZ me llevó hasta el Paraíso.', fr: 'DANTE : Puis nous avons gravi la montagne du Purgatoire, et à la fin ma bien-aimée BÉATRICE m\'a conduit jusqu\'au Paradis.' });
  await W.say({ es: 'DANTE: ¿Has escuchado bien? Si respondes a mis dos preguntas, te concederé un honor que nadie tiene.', fr: 'DANTE : As-tu bien écouté ? Si tu réponds à mes deux questions, je t\'accorderai un honneur que personne n\'a.' });
  const r1 = await W.ask({ es: '¿Quién guía a Dante por el Infierno y el Purgatorio?', fr: 'Qui guide Dante à travers l\'Enfer et le Purgatoire ?' },
    [{ es: 'HOMERO', fr: 'HOMÈRE' }, { es: 'VIRGILIO', fr: 'VIRGILE' }, { es: 'OVIDIO', fr: 'OVIDE' }, { es: 'ARISTÓTELES', fr: 'ARISTOTE' }].map(tr));
  if (r1 !== 1) { await W.say({ es: 'DANTE: No... Lee mi obra con calma y vuelve a verme.', fr: 'DANTE : Non... Lis mon œuvre tranquillement et reviens me voir.' }); return; }
  await W.say({ es: 'DANTE: ¡VIRGILIO, mi maestro! Bien. Segunda pregunta...', fr: 'DANTE : VIRGILE, mon maître ! Bien. Deuxième question...' });
  const r2 = await W.ask({ es: '¿Cuántos círculos tiene el Infierno de Dante?', fr: 'Combien de cercles compte l\'Enfer de Dante ?' },
    [{ es: 'SIETE', fr: 'SEPT' }, { es: 'TRES', fr: 'TROIS' }, { es: 'NUEVE', fr: 'NEUF' }, { es: 'DOCE', fr: 'DOUZE' }].map(tr));
  if (r2 !== 2) { await W.say({ es: 'DANTE: No... Ese no es el número. Lee mi obra con calma y vuelve a verme.', fr: 'DANTE : Non... Ce n\'est pas le bon nombre. Lis mon œuvre tranquillement et reviens me voir.' }); return; }
  await W.say({ es: 'DANTE: ¡NUEVE círculos! Has bajado conmigo hasta el fondo del Infierno... y has vuelto. Te nombro {CAB} DEL INFIERNO.', fr: 'DANTE : NEUF cercles ! Tu es descendu{e} avec moi jusqu\'au fond de l\'Enfer... et tu en es revenu{e}. Je te nomme {CAB} DE L\'ENFER.' });
  Sfx.play('win');
  W.flag('caballeroInfierno', true);
  await W.say({ es: '¡{name} recibe el título de {CAB} DEL INFIERNO!', fr: '{name} reçoit le titre de {CAB} DE L\'ENFER !' }, { color: 'blue' });
  await W.say({ es: 'DANTE: Te enseño dos técnicas. MATA DEMONIOS, un golpe terrible que solo puedes usar tres veces...', fr: 'DANTE : Je t\'enseigne deux techniques. TUEUR DE DÉMONS, un coup terrible que tu ne peux utiliser que trois fois...' });
  await W.say({ es: 'DANTE: ...y BESO DE AMADA, que vence a cualquiera de un solo golpe. Pero ojo: te arranca la mitad de tus PV.', fr: 'DANTE : ...et BAISER DE L\'AIMÉE, qui vainc n\'importe qui d\'un seul coup. Mais attention : il t\'arrache la moitié de tes PV.' });
  await W.learnMove('matademonios');
  await W.learnMove('beso');
  Game.save();
}
