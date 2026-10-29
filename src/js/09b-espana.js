// ─── España: Sierra Morena, Toledo, La Mancha, costa de Cádiz y Tarifa ────
// Leyenda en 10-world.js. Las filas de cada mapa miden lo mismo.
Object.assign(MAPS, {
  // ── Ruta 2 · Sierra Morena (niveles 6-10) ──
  ruta2: {
    name: { es: 'RUTA 2 · SIERRA MORENA', fr: 'ROUTE 2 · SIERRA MORENA' }, bg: 'sierra', theme: 'verde',
    wild: [{ id: 'jabali', w: 30, lv: [6, 8] }, { id: 'lobo', w: 25, lv: [6, 8] }, { id: 'lince', w: 20, lv: [7, 9] }, { id: 'salteador', w: 25, lv: [7, 9] }],
    build: () => asciiMap([
      'MMMMMMMMMMM==MMMMMMMMMMM',
      'MMMMMMMMMMM==MMMMMMMMMMM',
      'MMMMMM,,,..==..,,,MMMMMM',
      'MMMMM,,,,..==..,,,,.MMMM',
      'MMMM..,,...==...,,..MMMM',
      'MMM....R...==......*.MMM',
      'MMTT.......==.........MM',
      'MMTT...=====..........MM',
      'MM.....=.........,,,,.MM',
      'MM,,...=.....R...,,,,.MM',
      'MM,,,..=.........,,,,.MM',
      'MM,,,..======.........MM',
      'MMM,,.......=.......*MMM',
      'MMMM........=........MMM',
      'MMMMMR......=...TT..MMMM',
      'MMMMM.......=...TT..MMMM',
      'MMMM........=.......MMMM',
      'MMM..,,,,...=........MMM',
      'MM...,,,,...=====....MMM',
      'MM...,,,,.......=....,MM',
      'MMTT............=...,,MM',
      'MMTT....R.......=...,,MM',
      'MM..............=...,,MM',
      'MM.....=========....,,MM',
      'MM.....=.............MMM',
      'MMM....=......*.....MMMM',
      'MMMM...=...........MMMMM',
      'MMMM...=.....,,,,..MMMMM',
      'MMM....=.....,,,,...MMMM',
      'MM.....=.....,,,,....MMM',
      'MM.....=======,,,....MMM',
      'MM...........=.......MMM',
      'MM.R.........=.....R..MM',
      'MM,,,........=........MM',
      'MM,,,,.......=..TT....MM',
      'MM,,,,.......=..TT....MM',
      'MM,,,........=........MM',
      'MMM..........==.......MM',
      'MMMM.....*....=.....MMMM',
      'MMMMM.........=....MMMMM',
      'MMMMMM......===...MMMMMM',
      'MMMMMMM.....==...MMMMMMM',
      'MMMMMMMM....==..MMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMM',
    ]),
    objects: [
      signAt(10, 41, { es: 'RUTA 2 · SIERRA MORENA\nAl norte: TOLEDO, la ciudad del acero.', fr: 'ROUTE 2 · SIERRA MORENA\nAu nord : TOLÈDE, la cité de l\'acier.' }),
      signAt(13, 3, { es: 'TOLEDO → al norte, cruzando el puente sobre el Tajo.', fr: 'TOLÈDE → au nord, après le pont sur le Tage.' }),
    ],
    conn: { up: { map: 'toledo', dx: 4 }, down: { map: 'ruta1', dx: -2 } },
    npcs: [
      trainer({ id: 'r2_tomas', look: 'peregrino', x: 6, y: 9, dir: 'right', range: 3, foe: 'peregrino', level: 7, name: 'Tomás',
        intro: { es: 'Voy a Santiago, pero antes... ¡un poco de ejercicio!', fr: 'Je vais à Compostelle, mais d\'abord... un peu d\'exercice !' },
        lose: { es: 'Mis piernas aguantan más que mis brazos.', fr: 'Mes jambes tiennent mieux que mes bras.' },
        after: { es: 'Los peregrinos dicen que en Toledo forjan espadas que no se rompen nunca.', fr: 'Les pèlerins disent qu\'à Tolède, on forge des épées qui ne cassent jamais.' } }),
      trainer({ id: 'r2_lucia', look: 'viajera', x: 18, y: 21, dir: 'left', range: 3, foe: 'cazador', title: { es: 'CAZADORA', fr: 'CHASSERESSE' }, level: 8, name: 'Lucía',
        intro: { es: 'Llevo toda la mañana detrás de un lince. ¡Tú me servirás de práctica!', fr: 'Je traque un lynx depuis ce matin. Tu me serviras d\'entraînement !' },
        lose: { es: '¡Qué reflejos!', fr: 'Quels réflexes !' },
        after: { es: 'Los linces de la sierra son rapidísimos. Si te ves en apuros, huye.', fr: 'Les lynx de la sierra sont très rapides. Si tu es en difficulté, fuis.' } }),
      trainer({ id: 'r2_cuervo', look: 'cuervo', x: 9, y: 28, dir: 'left', range: 3, foe: 'cuervo', level: 9,
        intro: { es: '¡Eh, tú! Esto es asunto de la COMPAÑÍA DEL CUERVO. ¡Lárgate o te parto en dos!', fr: 'Hé, toi ! Ça regarde la COMPAGNIE DU CORBEAU. Dégage ou je te coupe en deux !' },
        lose: { es: '¡Maldición! ¿Dónde aprende a luchar un mocoso así?', fr: 'Malédiction ! Où un morveux apprend-il à se battre comme ça ?' },
        win: { es: 'Así aprenderás a no meterte con el Cuervo.', fr: 'Ça t\'apprendra à te mêler des affaires du Corbeau.' },
        after: { es: '...', fr: '...' },
        post: async (W, e) => {
          await W.say({ es: 'MERCENARIO: ¡Bah! Quédate con la bolsa del mercader. Nosotros buscamos algo mucho más valioso...', fr: 'MERCENAIRE : Bah ! Garde la bourse du marchand. Nous, on cherche quelque chose de bien plus précieux...' });
          await W.say({ es: 'MERCENARIO: Cuando los SEIS SELLOS sean nuestros, se acabó la tregua. ¡Volverá la guerra, y con ella, nuestro oficio!', fr: 'MERCENAIRE : Quand les SIX SCEAUX seront à nous, finie la trêve. La guerre reviendra, et avec elle, notre métier !' });
          await W.walk(e, 'up', 2);
          await W.fadeNpc(e);
          await W.say({ es: 'El mercenario huye hacia el norte. Se le ha caído una PLUMA NEGRA.', fr: 'Le mercenaire s\'enfuit vers le nord. Il a laissé tomber une PLUME NOIRE.' }, { color: 'blue' });
          W.flag('pluma', true);
        } }),
      talker('r2_victima', 'mercader', 5, 27, 'right', { es: '¡Gracias por espantar a ese mercenario! Llevaba un cuervo negro bordado en el pecho. Dicen que hay más por todos los reinos.', fr: 'Merci d\'avoir chassé ce mercenaire ! Il portait un corbeau noir brodé sur la poitrine. On dit qu\'il y en a d\'autres dans tous les royaumes.' }, {
        talk: async (W, e) => {
          if (!W.flag('tr_r2_cuervo')) { await W.say({ es: '¡Socorro! ¡Ese mercenario quiere mi bolsa!', fr: 'Au secours ! Ce mercenaire veut ma bourse !' }); return; }
          await W.say(e.def.text);
          if (!W.flag('r2_reward')) {
            W.flag('r2_reward', true);
            await W.say({ es: 'Toma, por las molestias.', fr: 'Tiens, pour ta peine.' });
            await W.receive('unguento', 2);
          }
        } }),
      trainer({ id: 'r2_ramiro', look: 'martin', x: 15, y: 33, dir: 'left', range: 3, foe: 'escudero', level: 8, name: 'Ramiro',
        intro: { es: '¡Yo también voy al coliseo de Toledo! Veamos quién llega antes.', fr: 'Moi aussi, je vais au colisée de Tolède ! Voyons qui arrive le premier.' },
        lose: { es: 'Vale, vale... Tú primero.', fr: 'D\'accord, d\'accord... Après toi.' },
        after: { es: 'Don Rodrigo, el maestro de Toledo, es herrero. Pega como un martillo.', fr: 'Don Rodrigo, le maître de Tolède, est forgeron. Il frappe comme un marteau.' } }),
      talker('r2_pastor', 'labrador', 18, 9, 'down', { es: 'En lo alto de la sierra se ve Toledo. La rodea el río Tajo como un foso.', fr: 'Du haut de la sierra, on voit Tolède. Le Tage l\'entoure comme des douves.' }),
    ],
    items: [
      { id: 'r2a', x: 4, y: 4, item: 'hogaza', n: 3 },
      { id: 'r2b', x: 18, y: 25, item: 'unguento', n: 1 },
      { id: 'r2c', x: 20, y: 34, item: 'hogaza', n: 2 },
    ],
  },

  // ── Toledo: ciudad amurallada sobre el Tajo, coliseo 1 ──
  toledo: {
    name: 'TOLEDO', bg: 'ciudad', theme: 'verde',
    build: () => asciiMap([
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W###############################',
      'W###############################',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'WWWWWWWWWWWWWWW##WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW##WWWWWWWWWWWWWWW',
      'MM.R...........==..........R..MM',
      'MM.....*.......==.......*.....MM',
      '~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~BB~~~~~~~~~~~~~~~',
      'MMTT...........==...........TTMM',
      'MMTT....,,.....==.....,,....TTMM',
      'MM......,,.....==.....,,......MM',
      'MMMMMMMMMMMMMMM==MMMMMMMMMMMMMMM',
    ]),
    objects: [
      { type: 'tower', x: 2, y: 1, w: 3, h: 5, o: { stone: STONE.claro }, text: { es: 'EL ALCÁZAR. La fortaleza del rey, donde se guarda el SELLO DE CASTILLA.', fr: 'L\'ALCAZAR. La forteresse du roi, où l\'on garde le SCEAU DE CASTILLE.' } },
      { type: 'tower', x: 6, y: 2, w: 2, h: 4, o: { stone: STONE.claro } },
      { type: 'coliseo', x: 12, y: 1, w: 8, h: 5, o: { color: '#c23a3a', stone: STONE.claro }, door: [3, 4], enter: { map: 'coliseo_toledo', x: 7, y: 13, dir: 'up' } },
      { type: 'banner', x: 10, y: 4, h: 2, o: { color: '#c23a3a' } },
      { type: 'banner', x: 21, y: 4, h: 2, o: { color: '#c23a3a' } },
      { type: 'tower', x: 25, y: 1, w: 2, h: 5, o: { stone: STONE.claro, roof: ['#a8a8b4', '#8a8a98', '#6a6a78'], style: 'campanile' }, text: { es: 'La catedral de Toledo. Dentro huele a cera y a incienso.', fr: 'La cathédrale de Tolède. À l\'intérieur, ça sent la cire et l\'encens.' } },
      { type: 'tower', x: 28, y: 2, w: 2, h: 4, o: { stone: STONE.claro } },
      innHouse(3, 8),
      shopHouse(9, 8, ['hogaza', 'unguento'], GREET.shop),
      { type: 'fountain', x: 15, y: 9, w: 2, h: 2, text: { es: 'La plaza de Zocodover. El agua de la fuente sale del Tajo.', fr: 'La place de Zocodover. L\'eau de la fontaine vient du Tage.' } },
      armoryHouse(20, 8, ['espada_toledana', 'gambeson'], { es: 'Acero de Toledo: el mejor de los seis reinos. ¡Míralo y verás!', fr: 'Acier de Tolède : le meilleur des six royaumes. Regarde, tu verras !' }),
      plainHouse(25, 8, { es: 'Se oye a alguien martillear dentro.', fr: 'On entend quelqu\'un marteler à l\'intérieur.' }, { roof: ['#dc7e58', '#b8583a', '#86381f'] }),
      plainHouse(3, 14, null, { frame: '#a0402e' }),
      plainHouse(9, 14, null, { frame: '#3d8c58' }),
      plainHouse(20, 14, null, { frame: '#3a70c0' }),
      plainHouse(25, 14, null, { frame: '#7a5aa0', roof: ['#dc7e58', '#b8583a', '#86381f'] }),
      { type: 'gate', x: 14, y: 18, w: 4, h: 3, walk: [[1, 0], [2, 0], [1, 1], [2, 1], [1, 2], [2, 2]], o: { color: '#c23a3a', portcullis: true } },
      signAt(18, 17, { es: 'TOLEDO\nCiudad del acero. Coliseo de ACERO: maestro DON RODRIGO.', fr: 'TOLÈDE\nCité de l\'acier. Colisée de l\'ACIER : maître DON RODRIGO.' }),
      signAt(29, 11, { es: 'PUERTA DEL ESTE → RUTA 3 · LA MANCHA', fr: 'PORTE EST → ROUTE 3 · LA MANCHE' }),
    ],
    conn: { down: { map: 'ruta2', dx: -4 }, right: { map: 'ruta3', dy: 0 } },
    npcs: [
      talker('to_guardia', 'guard', 30, 11, 'down', null, { talk: async W => {
        if (!W.flag('toledoOpen')) await W.say({ es: 'Nadie sale hacia La Mancha sin el BLASÓN DE TOLEDO. Hay demasiados salteadores por los caminos.', fr: 'Personne ne part vers la Manche sans le BLASON DE TOLÈDE. Il y a trop de brigands sur les routes.' });
        else await W.say({ es: '¡Ánimo, {name}! Los mercenarios del Cuervo huyeron hacia el sur, hacia Tarifa.', fr: 'Courage, {name} ! Les mercenaires du Corbeau ont fui vers le sud, vers Tarifa.' });
      } }),
      talker('to_herrero', 'herrero', 24, 13, 'down', { es: 'Para templar una espada toledana hace falta agua del Tajo. ¡Por eso son las mejores!', fr: 'Pour tremper une épée de Tolède, il faut l\'eau du Tage. C\'est pour ça qu\'elles sont les meilleures !' }),
      talker('to_dama', 'toledana', 14, 12, 'right', { es: 'Si te hieren, ve a la POSADA. Allí descansas gratis y, si caes en combate, despiertas allí.', fr: 'Si tu es blessé{e}, va à l\'AUBERGE. Tu t\'y reposes gratuitement et, si tu tombes au combat, tu t\'y réveilles.' }),
      talker('to_hombre', 'toledano', 18, 13, 'left', { es: 'En la armería venden ESPADAS TOLEDANAS. Con una buena espada, cada golpe hace más daño.', fr: 'L\'armurerie vend des ÉPÉES DE TOLÈDE. Avec une bonne épée, chaque coup fait plus de dégâts.' }),
      talker('to_nino', 'nino', 10, 6, 'down', { es: '¡Don Rodrigo forjó la espada del rey! Dicen que puede partir un yunque.', fr: 'Don Rodrigo a forgé l\'épée du roi ! On dit qu\'il peut fendre une enclume.' }, { wander: 2 }),
      talker('to_capitan', 'guard', 4, 6, 'down', null, { cond: () => S0().flags.selloRobado, talk: async W => {
        await W.say({ es: 'CAPITÁN: El SELLO DE CASTILLA... Sin él, la tregua de Castilla no vale nada. ¡Encuentra a esos mercenarios, {name}!', fr: 'CAPITAINE : Le SCEAU DE CASTILLE... Sans lui, la trêve de Castille ne vaut rien. Retrouve ces mercenaires, {name} !' });
      } }),
    ],
    triggers: [
      { x: 15, y: 21, cond: () => !S0().flags.rivalToledo, run: W => scriptRivalToledo(W) },
      { x: 16, y: 21, cond: () => !S0().flags.rivalToledo, run: W => scriptRivalToledo(W) },
      { x: 30, y: 12, cond: () => !S0().flags.toledoOpen, run: W => scriptToledoGate(W) },
      { x: 30, y: 13, cond: () => !S0().flags.toledoOpen, run: W => scriptToledoGate(W) },
    ],
    onEnter: async W => { if (W.flag('blason_toledo') && !W.flag('selloRobado')) await scriptSelloCastilla(W); },
  },

  coliseo_toledo: {
    name: { es: 'COLISEO DE TOLEDO', fr: 'COLISÉE DE TOLÈDE' }, bg: 'coliseo', theme: 'arena',
    build: () => asciiMap([
      'WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW',
      'Wsssss###sssssW',
      'Wsssss###sssssW',
      'WsssssssssssssW',
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
      { type: 'stand', x: 0, y: 0, w: 15, h: 2 },
      { type: 'banner', x: 4, y: 2, h: 2, o: { color: '#c23a3a' } },
      { type: 'banner', x: 10, y: 2, h: 2, o: { color: '#c23a3a' } },
      { type: 'dummy', x: 2, y: 6, text: { es: 'Un estafermo lleno de muescas de espada.', fr: 'Une quintaine couverte d\'entailles d\'épée.' } },
      { type: 'dummy', x: 12, y: 9, text: { es: 'Alguien ha grabado: «Acero que no se dobla».', fr: 'Quelqu\'un a gravé : « Acier qui ne plie pas ».' } },
      { type: 'barrel', x: 1, y: 12 },
      { type: 'barrel', x: 13, y: 12 },
    ],
    exits: [exitDown(7, 14, { map: 'toledo', x: 15, y: 6, dir: 'down' })],
    edgeOk: true,
    npcs: [
      trainer({ id: 'ct_gonzalo', look: 'herrero', x: 4, y: 10, dir: 'right', range: 4, foe: 'aprendiz', level: 11, name: 'Gonzalo',
        intro: { es: '¡Para llegar al maestro, antes tienes que pasar por mi yunque!', fr: 'Pour atteindre le maître, il faut d\'abord passer par mon enclume !' },
        lose: { es: '¡Me has abollado el orgullo!', fr: 'Tu as cabossé ma fierté !' },
        after: { es: 'Don Rodrigo sube su fuerza con TEMPLE DE ACERO. ¡No le des tiempo!', fr: 'Don Rodrigo augmente sa force avec TREMPE D\'ACIER. Ne lui laisse pas le temps !' } }),
      trainer({ id: 'ct_elvira', look: 'toledana', x: 10, y: 6, dir: 'left', range: 4, foe: 'aprendiz', title: { es: 'APRENDIZA', fr: 'APPRENTIE' }, level: 12, name: 'Elvira',
        intro: { es: 'Llevo tres años en esta forja. ¡En guardia!', fr: 'Ça fait trois ans que je suis dans cette forge. En garde !' },
        lose: { es: 'Tienes madera de {cab}.', fr: 'Tu as l\'étoffe d\'un{e} {cab}.' },
        after: { es: 'Si vas justo de vida, cura antes de hablar con el maestro.', fr: 'Si tu es à court de PV, soigne-toi avant de parler au maître.' } }),
      { id: 'rodrigo', look: 'rodrigo', x: 7, y: 3, dir: 'down', talk: W => scriptRodrigo(W) },
    ],
  },

  // ── Ruta 3 · La Mancha (niveles 12-14) ──
  ruta3: {
    name: { es: 'RUTA 3 · LA MANCHA', fr: 'ROUTE 3 · LA MANCHE' }, bg: 'mancha', theme: 'seco',
    wild: [{ id: 'toro', w: 25, lv: [12, 14] }, { id: 'vibora', w: 25, lv: [12, 14] }, { id: 'lobo', w: 20, lv: [12, 13] }, { id: 'salteador', w: 30, lv: [12, 14] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MM...........................,,,,,,,,,,,,.MM',
      'MM...........................,,,,,,,,,,,,.MM',
      'MM...........................,,,,,,,,,,,,.MM',
      'MM.................R......................MM',
      'MM.......,,,,,,.........=........R........MM',
      'MM.......,,,,,,.....=================.....MM',
      'MM.......,,,,,,.....=...............=.....MM',
      'MM..........R.......=...............=.....MM',
      'MM..................=....,,,,,,.....=.*...MM',
      'MM..................=....,,,,,,.....=.....MM',
      'MM..................=....,,,,,,.....=.....MM',
      '=====================...............=.....MM',
      '=====================...............=.....MM',
      'MM..................................=.....MM',
      'MM.....,,,,,,...............*.......=.....MM',
      'MM..*..,,,,,,.......................=.....MM',
      'MM.....,,,,,,......R................=.....MM',
      'MM..................................====..MM',
      'MM.....................,,,,,,,,,......==..MM',
      'MM.....................,,,,,,,,,......==..MM',
      'MM.....................,,,,,,,,,......==..MM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM==MMMM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM==MMMM',
    ]),
    objects: [
      { type: 'windmill', x: 3, y: 1, w: 2, h: 3, text: { es: 'Un molino de viento. Sus aspas giran sin parar.', fr: 'Un moulin à vent. Ses ailes tournent sans arrêt.' } },
      { type: 'windmill', x: 7, y: 1, w: 2, h: 3, text: { es: 'Otro molino. Desde lejos, parecen gigantes...', fr: 'Un autre moulin. De loin, on dirait des géants...' } },
      { type: 'windmill', x: 11, y: 1, w: 2, h: 3 },
      { type: 'windmill', x: 15, y: 1, w: 2, h: 3 },
      { type: 'house', x: 22, y: 1, w: 5, h: 4, o: { door: 2, windows: [0, 3.6], frame: '#a0402e', sign: 'bed', plinth: '#c8a050' }, run: W => W.inn({ es: 'VENTERA', fr: 'AUBERGISTE' }) },
      signAt(2, 11, { es: 'RUTA 3 · LA MANCHA\nTierra de molinos. Al sur: costa de Cádiz y TARIFA.', fr: 'ROUTE 3 · LA MANCHE\nTerre de moulins. Au sud : côte de Cadix et TARIFA.' }),
      signAt(25, 5, { es: 'VENTA DEL CAMINO\nCama y comida para el viajero.', fr: 'AUBERGE DU CHEMIN\nLit et repas pour le voyageur.' }),
    ],
    conn: { left: { map: 'toledo', dy: 0 }, down: { map: 'ruta4', dx: -26 } },
    npcs: [
      trainer({ id: 'r3_sancho', look: 'labrador', x: 23, y: 9, dir: 'left', range: 3, foe: 'peregrino', title: { es: 'LABRADOR', fr: 'LABOUREUR' }, level: 12, name: 'Sancho',
        intro: { es: 'Mi señor dice que esos molinos son gigantes. ¡Y me manda a mí a luchar!', fr: 'Mon maître dit que ces moulins sont des géants. Et c\'est moi qu\'il envoie au combat !' },
        lose: { es: 'Mejor me vuelvo a mis gallinas.', fr: 'Je ferais mieux de retourner à mes poules.' },
        after: { es: 'Mi señor ha salido a buscar aventuras montado en un caballo flaquísimo.', fr: 'Mon maître est parti chercher l\'aventure sur un cheval tout maigre.' } }),
      trainer({ id: 'r3_lope', look: 'mercader', x: 30, y: 8, dir: 'up', range: 3, foe: 'mercader', level: 13, name: 'Lope',
        intro: { es: '¡Llevo azafrán de La Mancha! Si lo quieres, tendrás que ganármelo.', fr: 'Je transporte du safran de la Manche ! Si tu le veux, il faudra me battre.' },
        lose: { es: 'Está bien, está bien. ¡Negocio cerrado!', fr: 'Ça va, ça va. Affaire conclue !' },
        after: { es: 'Ayer pasaron mercenarios con un cuervo bordado. Iban hacia el sur a toda prisa.', fr: 'Hier, des mercenaires avec un corbeau brodé sont passés. Ils filaient vers le sud.' } }),
      trainer({ id: 'r3_cuervo', look: 'cuervo', x: 38, y: 14, dir: 'left', range: 2, foe: 'cuervo', level: 14,
        intro: { es: '¡Tú eres quien venció a mi compañero en la sierra! El Cuervo no perdona.', fr: 'C\'est toi qui as battu mon camarade dans la sierra ! Le Corbeau ne pardonne pas.' },
        lose: { es: '¡Grr! Da igual. El sello ya va camino de África.', fr: 'Grr ! Peu importe. Le sceau est déjà en route vers l\'Afrique.' },
        after: { es: '¡Desde Tarifa cruzaremos el Estrecho y nadie nos alcanzará!', fr: 'Depuis Tarifa, on traversera le détroit et personne ne nous rattrapera !' } }),
      trainer({ id: 'r3_ines', look: 'peregrina', x: 15, y: 14, dir: 'up', range: 2, foe: 'peregrino', title: { es: 'PEREGRINA', fr: 'PÈLERINE' }, level: 13, name: 'Inés',
        intro: { es: '¡El camino es largo y yo me aburro! ¿Un duelo?', fr: 'La route est longue et je m\'ennuie ! Un duel ?' },
        lose: { es: '¡Qué bien luchas!', fr: 'Tu te bats bien !' },
        after: { es: 'En la VENTA DEL CAMINO puedes descansar gratis.', fr: 'À l\'AUBERGE DU CHEMIN, tu peux te reposer gratuitement.' } }),
      { id: 'r3_quijote', look: 'quijote', x: 33, y: 3, dir: 'left', talk: W => scriptQuijote(W) },
    ],
    items: [
      { id: 'r3a', x: 40, y: 1, item: 'unguento', n: 2 },
      { id: 'r3b', x: 3, y: 20, item: 'hogaza', n: 3 },
      { id: 'r3c', x: 30, y: 20, item: 'triaca', n: 1 },
    ],
  },

  // ── Ruta 4 · Costa de Cádiz (niveles 14-16) ──
  ruta4: {
    name: { es: 'RUTA 4 · COSTA DE CÁDIZ', fr: 'ROUTE 4 · CÔTE DE CADIX' }, bg: 'costa', theme: 'costa',
    wild: [{ id: 'cangrejo', w: 30, lv: [14, 16] }, { id: 'gaviota', w: 30, lv: [14, 16] }, { id: 'vibora', w: 15, lv: [14, 15] }, { id: 'salteador', w: 25, lv: [14, 16] }],
    build: () => asciiMap([
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
      '~~~~ss.......==.....,,,,MM',
      '~~~~sss......==.....,,,,MM',
      '~~~~sss..P....=.....,,,,MM',
      '~~~~~sss......=.........MM',
      '~~~~~sss......=...R.....MM',
      '~~~~~ssss.....====......MM',
      '~~~~~~sss........=......MM',
      '~~~~~~sss..,,,,..=..P...MM',
      '~~~~~~sss..,,,,..=......MM',
      '~~~~~~ssr..,,,,..=......MM',
      '~~~~~~sss........=......MM',
      '~~~~~~ssss..=====.......MM',
      '~~~~~~~sss..=......,,,,.MM',
      '~~~~~~~sss..=......,,,,.MM',
      '~~~~~~~sssQ.=......,,,,.MM',
      '~~~~~~~sss..=...........MM',
      '~~~~~~~sss..=====.......MM',
      '~~~~~~~ssss.....=...P...MM',
      '~~~~~~~~sss.....=.......MM',
      '~~~~~~~~sss,,,..=.......MM',
      '~~~~~~~~sss,,,..=..,,,,.MM',
      '~~~~~~~~ssr,,,..=..,,,,.MM',
      '~~~~~~~~sss.....=..,,,,.MM',
      '~~~~~~~~sss..====.......MM',
      '~~~~~~~~sssQ.=..........MM',
      '~~~~~~~~sss..=......R...MM',
      '~~~~~~~~ssss.=..........MM',
      '~~~~~~~~~sss.=====......MM',
      '~~~~~~~~~sss.....=......MM',
      '~~~~~~~~~sss.....=..P...MM',
      '~~~~~~~~~ssss....==.....MM',
      '~~~~~~~~~~sss.....==....MM',
      '~~~~~~~~~~sss......==...MM',
      '~~~~~~~~~~ssss......=...MM',
      '~~~~~~~~~~~sss......=...MM',
      '~~~~~~~~~~~ssss.....==..MM',
      '~~~~~~~~~~~~sss......==MMM',
      'MMMMMMMMMMMMMMMMMMMMM==MMM',
    ]),
    objects: [
      signAt(15, 3, { es: 'RUTA 4 · COSTA DE CÁDIZ\nAl sur: TARIFA, el puerto del Estrecho.', fr: 'ROUTE 4 · CÔTE DE CADIX\nAu sud : TARIFA, le port du détroit.' }),
      { type: 'boat', x: 8, y: 21, w: 2, h: 1, text: { es: 'Una barca de pescadores varada en la orilla.', fr: 'Une barque de pêcheurs échouée sur la rive.' } },
    ],
    conn: { up: { map: 'ruta3', dx: 26 }, down: { map: 'tarifa', dx: -7 } },
    npcs: [
      trainer({ id: 'r4_paco', look: 'pescador', x: 9, y: 8, dir: 'right', range: 3, foe: 'marinero', title: { es: 'PESCADOR', fr: 'PÊCHEUR' }, level: 14, name: 'Paco',
        intro: { es: '¡Hoy no pican! A ver si al menos tú me das guerra.', fr: 'Ça ne mord pas aujourd\'hui ! Voyons si toi, au moins, tu me donnes du fil à retordre.' },
        lose: { es: 'Me has dejado como un pez fuera del agua.', fr: 'Tu m\'as laissé comme un poisson hors de l\'eau.' },
        after: { es: 'Los cangrejos de esta playa son enormes. ¡Cuidado con las pinzas!', fr: 'Les crabes de cette plage sont énormes. Attention aux pinces !' } }),
      trainer({ id: 'r4_rocio', look: 'costena', x: 19, y: 17, dir: 'left', range: 3, foe: 'marinero', title: { es: 'MARINERA', fr: 'MARIN' }, level: 15, name: 'Rocío',
        intro: { es: '¡Huele a sal y a pelea! ¡Vamos allá!', fr: 'Ça sent le sel et la bagarre ! Allons-y !' },
        lose: { es: '¡Olé! Qué arte tienes.', fr: 'Olé ! Quel talent !' },
        after: { es: 'Desde Tarifa se ve África. ¡Está a un paso!', fr: 'De Tarifa, on voit l\'Afrique. C\'est tout près !' } }),
      trainer({ id: 'r4_cuervo', look: 'cuerva', x: 12, y: 28, dir: 'right', range: 4, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 16,
        intro: { es: '¡Alto! Mi compañía cruza el Estrecho y nadie va a impedirlo.', fr: 'Halte ! Ma compagnie traverse le détroit et personne ne l\'en empêchera.' },
        lose: { es: 'Llegas tarde. ¡Nuestro barco ya habrá zarpado hacia Tánger!', fr: 'Trop tard. Notre bateau a déjà dû partir pour Tanger !' },
        after: { es: 'El jefe CORVINO lo tiene todo planeado...', fr: 'Le chef CORVINO a tout prévu...' } }),
      trainer({ id: 'r4_manolo', look: 'cazador', x: 22, y: 25, dir: 'left', range: 3, foe: 'cazador', level: 15, name: 'Manolo',
        intro: { es: 'Las gaviotas me roban el almuerzo. ¡Y tú me vas a pagar el pato!', fr: 'Les mouettes me volent mon déjeuner. Et c\'est toi qui vas payer !' },
        lose: { es: 'Hoy no es mi día...', fr: 'Ce n\'est pas mon jour...' },
        after: { es: 'En Tarifa hay POSADA y TIENDA. Prepárate bien antes de cruzar.', fr: 'À Tarifa, il y a une AUBERGE et une BOUTIQUE. Prépare-toi bien avant la traversée.' } }),
      talker('r4_nina', 'nina', 7, 3, 'down', { es: '¡He encontrado una concha con forma de corona!', fr: 'J\'ai trouvé un coquillage en forme de couronne !' }),
    ],
    items: [
      { id: 'r4a', x: 22, y: 2, item: 'unguento', n: 2 },
      { id: 'r4b', x: 9, y: 22, item: 'triaca', n: 1 },
      { id: 'r4c', x: 4, y: 3, item: 'hogaza', n: 4 },
    ],
  },

  // ── Tarifa: puerto del Estrecho ──
  tarifa: {
    name: 'TARIFA', bg: 'costa', theme: 'costa',
    build: () => asciiMap([
      'MMMMMMMMMMMMMM==MMMMMMMMMMMMMM',
      'MM............==............MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM==========================MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM............==............MM',
      'MM==========================MM',
      'MM............==............MM',
      'MM..R.........==.........*..MM',
      'ssssssssssssssssssssssssssssss',
      'ssssssssssssssssssssssssssssss',
      'ssssDDDDssssssssssssssssssssss',
      '~~~~DDDD~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~DDDD~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~DDDD~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      innHouse(4, 2),
      shopHouse(19, 2, ['hogaza', 'unguento', 'triaca'], GREET.shop),
      { type: 'tower', x: 24, y: 1, w: 3, h: 5, o: { stone: STONE.claro, color: '#c23a3a' }, text: { es: 'El castillo de Guzmán el Bueno vigila el Estrecho.', fr: 'Le château de Guzmán el Bueno surveille le détroit.' } },
      plainHouse(3, 7, null, { frame: '#3a70c0' }),
      plainHouse(8, 7, null, { frame: '#3d8c58' }),
      plainHouse(17, 7, null, { frame: '#a0402e' }),
      plainHouse(22, 7, null, { frame: '#7a5aa0' }),
      { type: 'ship', x: 8, y: 18, w: 6, h: 2, o: { color: '#f4ecd8', mark: '#c23a3a' }, text: { es: 'LA GAVIOTA. El barco que cruza el Estrecho.', fr: 'LA MOUETTE. Le bateau qui traverse le détroit.' } },
      signAt(13, 14, { es: 'TARIFA\nPuerto del Estrecho. Barco a TÁNGER.', fr: 'TARIFA\nPort du détroit. Bateau pour TANGER.' }),
      { type: 'barrel', x: 3, y: 16 },
      { type: 'barrel', x: 9, y: 16 },
    ],
    conn: { up: { map: 'ruta4', dx: 7 } },
    edgeOk: true,
    npcs: [
      { id: 'ta_capitana', look: 'capitana', x: 7, y: 17, dir: 'right', talk: W => scriptBarcoTarifa(W) },
      talker('ta_pescador', 'pescador', 24, 15, 'left', { es: 'Con buen tiempo, el Estrecho se cruza en una mañana. ¡Pero ojo con los corsarios!', fr: 'Par beau temps, on traverse le détroit en une matinée. Mais attention aux corsaires !' }),
      talker('ta_moza', 'costena', 12, 13, 'down', { es: 'Ayer zarpó un barco con velas negras. Llevaba hombres con un cuervo bordado.', fr: 'Hier, un bateau aux voiles noires a pris la mer. Il y avait des hommes avec un corbeau brodé.' }),
      talker('ta_vieja', 'anciana', 26, 11, 'left', { es: 'Mi nieto trabaja en el puerto de Tánger. Allí hay un ZOCO enorme.', fr: 'Mon petit-fils travaille au port de Tanger. Il y a un SOUK immense là-bas.' }),
    ],
    entry: [[6, 16]],
  },
});

// ─── Guiones de España ────────────────────────────────────────────────────
async function scriptRivalToledo(W) {
  W.flag('rivalToledo', true);
  const p = W.player;
  p.dir = 'up';
  const r = W.spawn({ id: 'rival_to', look: rivalLook(), x: 15, y: 19, dir: 'down' });
  W.bubble(r); Sfx.play('alert'); await W.wait(700); W.bubble(null);
  await W.say({ es: '{rival}: ¡{name}! Sabía que llegarías tarde.', fr: '{rival} : {name} ! Je savais que tu arriverais en retard.' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: He entrenado toda la semana en la sierra. ¡Esta vez no tienes nada que hacer!', fr: '{rival} : Je me suis entraîné{e} toute la semaine dans la sierra. Cette fois, tu n\'as aucune chance !' });
  const res = await W.battle({ foe: 'rival', level: 10, name: rivalName().toUpperCase(), look: rivalLook(), trainer: rivalName(), canLose: true, canFlee: false,
    defeatText: { es: '¡Otra vez! ¿Cómo lo haces?', fr: 'Encore ! Comment tu fais ?' }, winText: { es: '¡Te lo dije!', fr: 'Je te l\'avais dit !' } });
  if (res === 'win') await W.say({ es: '{rival}: Grr... Vale, entra tú primero en el coliseo. Yo seguiré entrenando.', fr: '{rival} : Grr... D\'accord, entre en premier au colisée. Moi, je continue à m\'entraîner.' });
  else {
    healPlayer();
    await W.say({ es: '{rival}: ¡Ja! Toma, cúrate con esto. No quiero ganarte con ventaja la próxima vez.', fr: '{rival} : Ha ! Tiens, soigne-toi avec ça. Je ne veux pas gagner trop facilement la prochaine fois.' });
  }
  await W.say({ es: '{rival}: Por cierto, mi padre me ha dicho que en el ALCÁZAR guardan el SELLO DE CASTILLA. Uno de los Seis Sellos de la tregua.', fr: '{rival} : Au fait, mon père m\'a dit qu\'à l\'ALCAZAR on garde le SCEAU DE CASTILLE. L\'un des Six Sceaux de la trêve.' });
  await W.walk(r, 'down', 1);
  await W.walkTo(r, 16, 27);
  await W.fadeNpc(r);
}

async function scriptToledoGate(W) {
  const g = W.npc('to_guardia');
  g.dir = 'down';
  W.player.dir = 'up';
  await W.say({ es: '¡Alto! Nadie sale hacia La Mancha sin el BLASÓN DE TOLEDO. Gánalo en el coliseo.', fr: 'Halte ! Personne ne part vers la Manche sans le BLASON DE TOLÈDE. Gagne-le au colisée.' });
  await W.walk(W.player, 'left', 1);
}

async function scriptRodrigo(W) {
  const e = W.npc('rodrigo');
  if (W.flag('blason_toledo')) {
    await W.say({ es: 'DON RODRIGO: El acero de Toledo te acompaña, {name}. Ve a por esos mercenarios.', fr: 'DON RODRIGO : L\'acier de Tolède t\'accompagne, {name}. Va attraper ces mercenaires.' });
    return;
  }
  await W.say({ es: 'DON RODRIGO: Así que tú eres {el} {esc} de Esteban. Llevo cuarenta años forjando espadas en esta ciudad.', fr: 'DON RODRIGO : Alors c\'est toi l\'{esc} d\'Esteban. Je forge des épées dans cette ville depuis quarante ans.' });
  await W.say({ es: 'DON RODRIGO: Una espada se templa con fuego y agua. Un {cab}, con combates. ¡Veamos de qué acero estás hech{o}!', fr: 'DON RODRIGO : Une épée se trempe dans le feu et l\'eau. Un{e} {cab}, dans les combats. Voyons de quel acier tu es fait{e} !' });
  const res = await W.battle({ foe: 'rodrigo', level: 14, look: 'rodrigo', trainer: { es: 'MAESTRO DON RODRIGO', fr: 'MAÎTRE DON RODRIGO' }, canLose: false, canFlee: false,
    defeatText: { es: '¡Ja! ¡Golpeas como un martillo pilón!', fr: 'Ha ! Tu frappes comme un marteau-pilon !' }, winText: { es: 'Vuelve a la forja, {esc}. Aún te falta temple.', fr: 'Retourne à la forge, {esc}. Il te manque encore de la trempe.' } });
  if (res !== 'win') return;
  await W.say({ es: 'DON RODRIGO: Bien luchado. Te has ganado esto.', fr: 'DON RODRIGO : Bien combattu. Tu l\'as mérité.' });
  await W.blason('toledo', CRESTS[0][3]);
  await W.say({ es: 'DON RODRIGO: Y llévate también estos ungüentos. Los vas a necesitar.', fr: 'DON RODRIGO : Et prends aussi ces onguents. Tu vas en avoir besoin.' });
  await W.receive('unguento', 3);
  await W.say({ es: 'DON RODRIGO: El siguiente coliseo está en FEZ, al otro lado del mar. Zaynab y sus jinetes son rápidos como el viento.', fr: 'DON RODRIGO : Le prochain colisée est à FÈS, de l\'autre côté de la mer. Zaynab et ses cavaliers sont rapides comme le vent.' });
  Game.save();
}

async function scriptSelloCastilla(W) {
  W.flag('selloRobado', true);
  W.flag('toledoOpen', true);
  const p = W.player;
  const c = W.spawn({ id: 'cap_run', look: 'guard', x: 4, y: 12, dir: 'right' });
  W.bubble(c); Sfx.play('alert'); await W.wait(600); W.bubble(null);
  await W.say({ es: '¡{name}! ¡{name}! ¡Menos mal que te encuentro!', fr: '{name} ! {name} ! Heureusement que je te trouve !' });
  await W.walkNextTo(c, p);
  W.faceEachOther(c, p);
  await W.say({ es: 'CAPITÁN: ¡Han asaltado el ALCÁZAR mientras todos miraban tu combate! ¡Se han llevado el SELLO DE CASTILLA!', fr: 'CAPITAINE : On a attaqué l\'ALCAZAR pendant que tout le monde regardait ton combat ! Ils ont volé le SCEAU DE CASTILLE !' });
  await W.say({ es: 'CAPITÁN: Eran mercenarios con un CUERVO NEGRO bordado. ¿La pluma que llevas...? ¡Es la misma marca!', fr: 'CAPITAINE : C\'étaient des mercenaires avec un CORBEAU NOIR brodé. La plume que tu portes... ? C\'est la même marque !' });
  await W.say({ es: 'CAPITÁN: Sin el sello, la tregua de Castilla se rompe. Huyeron por la PUERTA DEL ESTE, hacia La Mancha y la costa.', fr: 'CAPITAINE : Sans le sceau, la trêve de Castille est rompue. Ils ont fui par la PORTE EST, vers la Manche et la côte.' });
  await W.say({ es: 'CAPITÁN: Con el BLASÓN DE TOLEDO puedes salir. ¡Te lo ruego, síguelos!', fr: 'CAPITAINE : Avec le BLASON DE TOLÈDE, tu peux sortir. Je t\'en prie, suis-les !' });
  await W.walkTo(c, 4, 6);
  await W.fadeNpc(c);
  Game.save();
}

async function scriptBarcoTarifa(W) {
  if (W.flag('visitTanger')) {
    const r = await W.ask({ es: 'CAPITANA: ¿Cruzamos a TÁNGER?', fr: 'CAPITAINE : On traverse vers TANGER ?' }, [t('yes'), t('no')]);
    if (r === 0) await W.sail({ map: 'tanger', x: 15, y: 4, dir: 'down' }, { es: 'Rumbo a TÁNGER', fr: 'Cap sur TANGER' });
    return;
  }
  await W.say({ es: 'CAPITANA: Soy la capitana de LA GAVIOTA. ¿Quieres cruzar el Estrecho hasta TÁNGER?', fr: 'CAPITAINE : Je suis la capitaine de LA MOUETTE. Tu veux traverser le détroit jusqu\'à TANGER ?' });
  await W.say({ es: 'CAPITANA: ¿Persigues al barco de velas negras? Zarpó ayer. Te llevo, pero en el mar hay corsarios: ve preparad{o}.', fr: 'CAPITAINE : Tu poursuis le bateau aux voiles noires ? Il est parti hier. Je t\'emmène, mais il y a des corsaires en mer : sois prêt{e}.' });
  const r = await W.ask({ es: '¿Subir a bordo de LA GAVIOTA?', fr: 'Monter à bord de LA MOUETTE ?' }, [t('yes'), t('no')]);
  if (r !== 0) return;
  await W.warp({ map: 'ruta5', x: 3, y: 7, dir: 'right' });
}

// ─── Misión secreta: don Quijote y el emblema del Matagigantes ────────────
async function scriptQuijote(W) {
  if (W.flag('quijoteHecho')) {
    await W.say({ es: 'QUIJOTE: ¡Salud, {cab} Matagigantes! Que Dulcinea y Rocinante te acompañen en cada aventura.', fr: 'QUICHOTTE : Salut à toi, {cab} {Tueur} de géants ! Que Dulcinée et Rossinante t\'accompagnent dans chaque aventure.' });
    return;
  }
  if (!W.flag('quijote1')) {
    await W.say({ es: 'QUIJOTE: ¡Atrás, gigantes! ...Ah, perdón. Te había confundido con un molino.', fr: 'QUICHOTTE : Arrière, géants ! ...Ah, pardon. Je t\'avais pris pour un moulin.' });
    await W.say({ es: 'QUIJOTE: Soy don Quijote de la Mancha, {cab} andante. En un lugar de la Mancha, de cuyo nombre no quiero acordarme...', fr: 'QUICHOTTE : Je suis don Quichotte de la Manche, chevalier errant. Dans un village de la Manche, dont je ne veux pas me rappeler le nom...' });
    await W.say({ es: 'QUIJOTE: ¡Ay, qué desdicha! Ahora tampoco me acuerdo del nombre de mi amada, la señora de mis pensamientos. ¿Me ayudas a recordarlo?', fr: 'QUICHOTTE : Hélas, quel malheur ! Je ne me rappelle plus non plus le nom de ma bien-aimée, la dame de mes pensées. Tu m\'aides à m\'en souvenir ?' });
    const r1 = await W.ask({ es: '¿Cómo se llama la amada de don Quijote?', fr: 'Comment s\'appelle la bien-aimée de don Quichotte ?' },
      [{ es: 'MELIBEA', fr: 'MÉLIBÉE' }, { es: 'DULCINEA', fr: 'DULCINÉE' }, { es: 'ISOLDA', fr: 'ISEUT' }, { es: 'BEATRIZ', fr: 'BÉATRICE' }].map(tr));
    if (r1 !== 1) {
      await W.say({ es: 'QUIJOTE: No, no... Ese nombre no me hace suspirar. Vuelve cuando lo recuerdes, {name}.', fr: 'QUICHOTTE : Non, non... Ce nom ne me fait pas soupirer. Reviens quand tu t\'en souviendras, {name}.' });
      return;
    }
    await W.say({ es: 'QUIJOTE: ¡DULCINEA! ¡Dulcinea del Toboso, la más hermosa de todas las damas! ¡Gracias, gracias!', fr: 'QUICHOTTE : DULCINÉE ! Dulcinée du Toboso, la plus belle de toutes les dames ! Merci, merci !' });
    await W.say({ es: 'QUIJOTE: ¿Y mi fiel caballo? ¿Cómo se llama? ¡Lo tengo en la punta de la lengua!', fr: 'QUICHOTTE : Et mon fidèle cheval ? Comment s\'appelle-t-il ? Je l\'ai sur le bout de la langue !' });
    const r2 = await W.ask({ es: '¿Cómo se llama el caballo de don Quijote?', fr: 'Comment s\'appelle le cheval de don Quichotte ?' },
      [{ es: 'BABIECA', fr: 'BABIECA' }, { es: 'BUCÉFALO', fr: 'BUCÉPHALE' }, { es: 'ROCINANTE', fr: 'ROSSINANTE' }, { es: 'CLAVILEÑO', fr: 'CLAVILEÑO' }].map(tr));
    if (r2 !== 2) {
      await W.say({ es: 'QUIJOTE: ¿Ese? ¡No! Ese es el caballo de otro {cab}. Vuelve cuando lo sepas.', fr: 'QUICHOTTE : Celui-là ? Non ! C\'est le cheval d\'un autre chevalier. Reviens quand tu le sauras.' });
      return;
    }
    await W.say({ es: 'QUIJOTE: ¡ROCINANTE! ¡El mejor rocín de la Mancha! Toma, por devolverme la memoria.', fr: 'QUICHOTTE : ROSSINANTE ! La meilleure rosse de la Manche ! Tiens, pour m\'avoir rendu la mémoire.' });
    await W.gold(100);
    await W.receive('unguento', 5);
    W.flag('quijote1', true);
    Game.save();
  } else {
    await W.say({ es: 'QUIJOTE: ¡Ah, mi amig{o}! ¿Vienes a por la pregunta sorpresa?', fr: 'QUICHOTTE : Ah, mon ami{e} ! Tu viens pour la question surprise ?' });
  }
  await W.say({ es: 'QUIJOTE: Y ahora, una pregunta sorpresa. Dicen que algún día un tal Cervantes escribirá un libro con mis aventuras...', fr: 'QUICHOTTE : Et maintenant, une question surprise. On dit qu\'un jour, un certain Cervantès écrira un livre sur mes aventures...' });
  const r3 = await W.ask({ es: '¿Cuántas páginas tiene el libro de don Quijote de la Mancha?', fr: 'Combien de pages compte le livre de don Quichotte de la Manche ?' },
    [{ es: '664', fr: '664' }, { es: '0', fr: '0' }, { es: '1.250', fr: '1 250' }, { es: '312', fr: '312' }].map(tr));
  if (r3 !== 1) {
    await W.say({ es: 'QUIJOTE: ¡Ja, ja! Puede que algún día tenga esas páginas... ¡pero piensa bien en qué año estamos! Vuelve cuando lo tengas claro.', fr: 'QUICHOTTE : Ha, ha ! Un jour, il aura peut-être ces pages... mais réfléchis bien à l\'année où nous sommes ! Reviens quand tu auras compris.' });
    return;
  }
  await W.say({ es: 'QUIJOTE: ¡CERO! ¡Exacto! Estamos en 1415: Cervantes ni siquiera ha nacido. Mi libro no se publicará hasta 1605... ¡dentro de 190 años!', fr: 'QUICHOTTE : ZÉRO ! Exactement ! Nous sommes en 1415 : Cervantès n\'est même pas né. Mon livre ne sera publié qu\'en 1605... dans 190 ans !' });
  await W.say({ es: 'QUIJOTE: Hoy mis aventuras solo existen en mi cabeza. ¡Qué ingenio el tuyo! Te nombro MATAGIGANTES.', fr: 'QUICHOTTE : Aujourd\'hui, mes aventures n\'existent que dans ma tête. Quel esprit tu as ! Je te nomme {TUEUR} DE GÉANTS.' });
  Sfx.play('win');
  W.flag('emblemaMatagigantes', true);
  await W.say({ es: '¡{name} recibe el EMBLEMA DEL MATAGIGANTES!', fr: '{name} reçoit l\'EMBLÈME DU TUEUR DE GÉANTS !' }, { color: 'blue' });
  const up = await W.levelTo(35);
  if (!up) await W.say({ es: 'QUIJOTE: Ya eres más fuerte que cualquier gigante. ¡El emblema te queda de maravilla!', fr: 'QUICHOTTE : Tu es déjà plus fort{e} que n\'importe quel géant. L\'emblème te va à merveille !' });
  await W.say({ es: 'QUIJOTE: Y toma mi ESPADA MATAGIGANTES. Con ella vencí a cien gigantes... bueno, a cien molinos.', fr: 'QUICHOTTE : Et prends mon ÉPÉE TUE-GÉANTS. Avec elle, j\'ai vaincu cent géants... enfin, cent moulins.' });
  Sfx.play('item');
  W.giveEquip('matagigantes', true);
  await W.say({ es: '¡{name} recibe la ESPADA MATAGIGANTES (+25 ATQ)!', fr: '{name} reçoit l\'ÉPÉE TUE-GÉANTS (+25 ATT) !' }, { color: 'blue' });
  W.flag('quijoteHecho', true);
  Game.save();
}
