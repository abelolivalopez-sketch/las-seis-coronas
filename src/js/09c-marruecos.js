// ─── Marruecos y el mar: el Estrecho, Tánger, el Rif, Fez y la travesía a Génova ───
Object.assign(MAPS, {
  // ── Ruta 5 · el Estrecho, a bordo de LA GAVIOTA (niveles 15-17) ──
  ruta5: {
    name: { es: 'RUTA 5 · EL ESTRECHO', fr: 'ROUTE 5 · LE DÉTROIT' }, bg: 'barco', theme: 'madera', edgeOk: true,
    wild: [{ id: 'gaviota', w: 100, lv: [15, 17] }], wildOn: 'D', wildRate: 0.04,
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~KKKKKKKKKKKKKKKKKKKKKKK~~~~~',
      '~~KDDXXDDDDDDDDDDDDDDDDDKK~~~~',
      '~~KDDXDDDDDDDDDDDDDDDDDDDDK~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDK~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDK~',
      '~~KDDDDDDDDDDDDDDDDDDDXDDDDK~~',
      '~~KDDDDDDDDDDDDDDDDDDXXDDDK~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDKK~~~~',
      '~~KKKKKKKKKKKKKKKKKKKKKKK~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      { type: 'mast', x: 10, y: 5, o: { color: '#f4ecd8', mark: '#c23a3a' }, text: { es: 'El palo mayor de LA GAVIOTA.', fr: 'Le grand mât de LA MOUETTE.' } },
      { type: 'mast', x: 19, y: 5, o: { color: '#f4ecd8' } },
      { type: 'barrel', x: 14, y: 2, text: { es: 'Agua dulce para la travesía.', fr: 'De l\'eau douce pour la traversée.' } },
      { type: 'barrel', x: 15, y: 9 },
    ],
    npcs: [
      trainer({ id: 'r5_joaquin', look: 'marinero', x: 8, y: 3, dir: 'down', range: 3, foe: 'marinero', level: 15, name: 'Joaquín',
        intro: { es: '¡Un poco de movimiento para no marearnos!', fr: 'Un peu d\'exercice pour ne pas avoir le mal de mer !' },
        lose: { es: '¡Me has mandado a la bodega!', fr: 'Tu m\'as envoyé à fond de cale !' },
        after: { es: 'Si te mareas, mira al horizonte.', fr: 'Si tu as le mal de mer, regarde l\'horizon.' } }),
      trainer({ id: 'r5_carmen', look: 'marinera', x: 15, y: 8, dir: 'up', range: 2, foe: 'marinero', title: { es: 'MARINERA', fr: 'MARIN' }, level: 16, name: 'Carmen',
        intro: { es: '¡En mi cubierta mando yo!', fr: 'Sur mon pont, c\'est moi qui commande !' },
        lose: { es: 'Bueno, hoy mandas tú.', fr: 'Bon, aujourd\'hui c\'est toi qui commandes.' },
        after: { es: 'Las gaviotas roban pescado de la cubierta. ¡Y a veces atacan!', fr: 'Les mouettes volent le poisson sur le pont. Et parfois, elles attaquent !' } }),
      trainer({ id: 'r5_corsario', look: 'corsario', x: 23, y: 6, dir: 'left', range: 5, foe: 'corsario', level: 17,
        intro: { es: '¡Ja! ¡Me colé a bordo en Tarifa! El Cuervo me paga bien por retrasar a quien le siga.', fr: 'Ha ! Je me suis glissé à bord à Tarifa ! Le Corbeau me paie bien pour retarder ceux qui le suivent.' },
        lose: { es: '¡Al agua! ¡Me voy nadando!', fr: 'À l\'eau ! Je repars à la nage !' },
        after: { es: '...', fr: '...' },
        post: async (W, e) => {
          await W.say({ es: 'CORSARIO: El barco de velas negras ya está en Tánger. ¡No los alcanzarás!', fr: 'CORSAIRE : Le bateau aux voiles noires est déjà à Tanger. Tu ne les rattraperas pas !' });
          Sfx.play('miss');
          await W.fadeNpc(e);
          await W.say({ es: '¡El corsario se tira al agua y se aleja nadando!', fr: 'Le corsaire saute à l\'eau et s\'éloigne à la nage !' }, { color: 'blue' });
        } }),
      talker('r5_pasajero', 'peregrino', 12, 4, 'down', { es: 'Voy en peregrinación a Fez. Dicen que su medina es un laberinto de mil calles.', fr: 'Je vais en pèlerinage à Fès. On dit que sa médina est un labyrinthe de mille ruelles.' }),
      { id: 'r5_capitana', look: 'capitana', x: 26, y: 5, dir: 'left', talk: W => scriptCapitanaR5(W) },
    ],
    entry: [[4, 6]],
  },

  // ── Tánger: puerto y gran zoco ──
  tanger: {
    name: { es: 'TÁNGER', fr: 'TANGER' }, bg: 'medina', theme: 'rif', edgeOk: true,
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~DD~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~DD~~~~~~~~~~~~~~~~~~~~~',
      'ssssssssssssssssssssssssssssssssss',
      'ssssssssssssssssssssssssssssssssss',
      'WWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWW',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W########P###############P#######W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W############P######P############W',
      'W################################W',
      'W################################W',
      'W################################W',
      'W################################W',
      'WWWWWWWWWWWWWWWW==WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW==WWWWWWWWWWWWWWWW',
    ]),
    objects: [
      { type: 'ship', x: 4, y: 1, w: 6, h: 2, o: { color: '#f4ecd8', mark: '#c23a3a' }, text: { es: 'LA GAVIOTA, el barco de Tarifa.', fr: 'LA MOUETTE, le bateau de Tarifa.' } },
      { type: 'ship', x: 24, y: 1, w: 6, h: 2, o: { color: '#eef4e6', mark: '#2e8a5a', flag: '#2e8a5a' }, text: { es: 'LA ESPERANZA. Va a Génova, pasando por las islas.', fr: 'L\'ESPÉRANCE. Elle va à Gênes, en passant par les îles.' } },
      { type: 'gate', x: 15, y: 4, w: 4, h: 3, walk: [[1, 0], [2, 0], [1, 1], [2, 1], [1, 2], [2, 2]], o: { stone: STONE.ocre, color: '#2e8a5a' } },
      innHouse(2, 8, { flat: true }),
      shopHouse(8, 8, ['hogaza', 'unguento', 'triaca'], GREET.shop, { flat: true }),
      plainHouse(21, 8, null, { flat: true, frame: '#2e8a5a' }),
      { type: 'tower', x: 27, y: 7, w: 3, h: 5, o: { stone: STONE.ocre, color: '#2e8a5a' }, text: { es: 'La kasba de Tánger, la fortaleza que vigila el puerto.', fr: 'La kasbah de Tanger, la forteresse qui surveille le port.' } },
      { type: 'stall', x: 11, y: 14, w: 2, h: 2, o: { color: '#d29c3a', goods: ['#e8a030', '#c23a3a', '#f2d060'] }, run: W => W.shop(['hogaza', 'unguento', 'triaca'], { es: '¡Especias, pan y remedios! ¡Lo mejor del zoco!', fr: 'Épices, pain et remèdes ! Le meilleur du souk !' }) },
      { type: 'stall', x: 14, y: 14, w: 2, h: 2, o: { color: '#2e8a5a', goods: ['#7ab040', '#f2d060', '#e8a030'] }, text: { es: 'Un puesto de dátiles, higos y almendras.', fr: 'Un étal de dattes, de figues et d\'amandes.' } },
      { type: 'stall', x: 19, y: 14, w: 2, h: 2, o: { color: '#3a70c0', goods: ['#3a70c0', '#c23a3a', '#e8e4dc'] }, text: { es: 'Alfombras de todos los colores. ¡Hasta de Persia!', fr: 'Des tapis de toutes les couleurs. Même de Perse !' } },
      { type: 'stall', x: 22, y: 14, w: 2, h: 2, o: { color: '#8a8a98', goods: ['#c8ccd4', '#8a909c', '#f2ca52'] }, run: W => W.shop(['gambeson', 'cota'], { es: 'Cotas de malla de Damasco. ¡Ligeras como la seda!', fr: 'Des cottes de mailles de Damas. Légères comme la soie !' }) },
      { type: 'fountain', x: 16, y: 18, w: 2, h: 2, o: { stone: STONE.ocre }, text: { es: 'Una fuente de azulejos verdes.', fr: 'Une fontaine aux carreaux verts.' } },
      plainHouse(2, 16, null, { flat: true, frame: '#3a70c0' }),
      plainHouse(2, 21, null, { flat: true, frame: '#a0402e' }),
      plainHouse(27, 16, null, { flat: true, frame: '#3a70c0' }),
      plainHouse(27, 21, null, { flat: true, frame: '#2e8a5a' }),
      { type: 'tower', x: 9, y: 21, w: 2, h: 5, o: { stone: STONE.ocre, color: '#2e8a5a' }, text: { es: 'El alminar de la mezquita.', fr: 'Le minaret de la mosquée.' } },
      signAt(14, 7, { es: 'TÁNGER\nPuerta de África. Zoco, puerto y kasba.', fr: 'TANGER\nPorte de l\'Afrique. Souk, port et kasbah.' }),
      signAt(19, 25, { es: 'Al sur: RUTA 6 · MONTAÑAS DEL RIF. Más allá: FEZ.', fr: 'Au sud : ROUTE 6 · MONTAGNES DU RIF. Plus loin : FÈS.' }),
    ],
    conn: { down: { map: 'ruta6', dx: 0 } },
    npcs: [
      { id: 'tg_gaviota', look: 'capitana', x: 11, y: 2, dir: 'down', talk: W => scriptBarcoTanger(W) },
      { id: 'tg_ahmed', look: 'marinero', x: 14, y: 3, dir: 'down', talk: W => scriptAhmedTanger(W) },
      talker('tg_guardia', 'guardia_moro', 15, 7, 'down', { es: 'Bienvenid{o} a Tánger. Si buscas el coliseo, está en FEZ, al sur, pasado el Rif.', fr: 'Bienvenue à Tanger. Si tu cherches le colisée, il est à FÈS, au sud, après le Rif.' }),
      talker('tg_mercader', 'mercader', 17, 12, 'down', { es: 'En el zoco se vende de todo: especias, alfombras... ¡y cotas de malla!', fr: 'Au souk, on vend de tout : épices, tapis... et cottes de mailles !' }),
      talker('tg_mujer', 'tangerina', 8, 13, 'right', { es: 'Fez es la ciudad de los jinetes. Su maestra, ZAYNAB, nunca ha caído del caballo.', fr: 'Fès est la cité des cavaliers. Sa maîtresse, ZAYNAB, n\'est jamais tombée de cheval.' }),
      talker('tg_nina', 'nina', 20, 19, 'down', { es: '¡Ayer vi un barco con velas negras! Los marineros llevaban un pájaro negro bordado.', fr: 'Hier, j\'ai vu un bateau aux voiles noires ! Les marins avaient un oiseau noir brodé.' }, { wander: 2 }),
      talker('tg_anciano', 'anciano', 24, 24, 'left', { es: 'Los mercenarios del Cuervo compraron caballos y salieron hacia FEZ. ¿Qué buscarán allí?', fr: 'Les mercenaires du Corbeau ont acheté des chevaux et sont partis vers FÈS. Que cherchent-ils là-bas ?' }),
    ],
    entry: [[12, 3]],
    onEnter: async W => { W.flag('visitTanger', true); if (!W.flag('rivalTanger')) await scriptRivalTanger(W); },
  },

  // ── Ruta 6 · montañas del Rif (niveles 17-20) ──
  ruta6: {
    name: { es: 'RUTA 6 · MONTAÑAS DEL RIF', fr: 'ROUTE 6 · MONTAGNES DU RIF' }, bg: 'rif', theme: 'rif',
    wild: [{ id: 'macaco', w: 30, lv: [17, 19] }, { id: 'cabra', w: 25, lv: [17, 20] }, { id: 'chacal', w: 25, lv: [17, 19] }, { id: 'salteador', w: 20, lv: [18, 20] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMM==MMMMMMMM',
      'MMMMMMMMMMMMMMMM==MMMMMMMM',
      'MMMMMM....,,,,,.==..MMMMMM',
      'MMMMMM....,,,,..==..MMMMMM',
      'MMMMMM....,,,,,.==..MMMMMM',
      'MM..Y..Y........==..MMMMMM',
      'MM....Y.==========..MMMMMM',
      'MM......=========.Y.MMMMMM',
      'MM..Y...==..............MM',
      'MMMMM...==.,,,,,,.......MM',
      'MMMMMY..==..,,,,,.....MMMM',
      'MMMMM...==.,,,,,,....YMMMM',
      'MMMMMY..==.,,,,,,.....MMMM',
      'MM.,,,,.==..........R.MMMM',
      'MM.,,,,.============..MMMM',
      'MM.,,,,.============..MMMM',
      'MM................==..MMMM',
      'MMMMR......MMMM...==..MMMM',
      'MMMMY......MM.M...==.Y..MM',
      'MMMM.......MMMM...==,...MM',
      'MMMM.......MMMM...==,,..MM',
      'MMMMYY........R.R.==,,..MM',
      'MM....Y...........==,,..MM',
      'MM................==....MM',
      'MM....==============.Y.RMM',
      'MMY...=============.....MM',
      'MM....==.,,,,,,....Y....MM',
      'MMY,,.==.,.,,,,.......MMMM',
      'MM.,,.==.,,,,,,MMMMM..MMMM',
      'MMY,,.==.,,,,,,MMMMM.RMMMM',
      'MM.,..==....Y...Y.....MMMM',
      'MM....==......Y.......MMMM',
      'MM....========...R....MMMM',
      'MM.Y..========........Y.MM',
      'MM..........==..........MM',
      'MM..........==..........MM',
      'MMMMM.......==.....MMMMMMM',
      'MMMMM.......==.....MMMMMMM',
      'MMMMM.....Y.==.,,,,MMMMMMM',
      'MMMMM.Y.....==.,,,,MMMMMMM',
      'MMMMMY......==.,,,,M.MMMMM',
      'MMMMM....R..==.....MMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMM',
    ]),
    objects: [
      signAt(14, 3, { es: 'RUTA 6 · MONTAÑAS DEL RIF\nCedros, monos y cabras. Al sur: valle del Sebú y FEZ.', fr: 'ROUTE 6 · MONTAGNES DU RIF\nCèdres, singes et chèvres. Au sud : vallée du Sebou et FÈS.' }),
    ],
    conn: { up: { map: 'tanger', dx: 0 }, down: { map: 'ruta7', dx: 0 } },
    npcs: [
      trainer({ id: 'r6_karim', look: 'jinete', x: 11, y: 10, dir: 'left', range: 2, foe: 'jinete', level: 18, name: 'Karim',
        intro: { es: '¡Mi caballo descansa, pero yo no! ¡En guardia!', fr: 'Mon cheval se repose, mais pas moi ! En garde !' },
        lose: { es: '¡Eres más rápid{o} que mi yegua!', fr: 'Tu es plus rapide que ma jument !' },
        after: { es: 'Los jinetes de Fez cargan con lanza. Su técnica GALOPE les sube mucho la velocidad.', fr: 'Les cavaliers de Fès chargent à la lance. Leur technique GALOP augmente beaucoup leur vitesse.' } }),
      trainer({ id: 'r6_driss', look: 'cazador', x: 21, y: 19, dir: 'left', range: 2, foe: 'cazador', level: 18, name: 'Driss',
        intro: { es: 'Los macacos me han robado las flechas... ¡pero aún tengo puños!', fr: 'Les macaques m\'ont volé mes flèches... mais il me reste les poings !' },
        lose: { es: 'Hoy no es mi día de caza.', fr: 'Ce n\'est pas mon jour de chasse.' },
        after: { es: 'Los macacos del Rif son listísimos. ¡Te tiran piedras!', fr: 'Les macaques du Rif sont très malins. Ils te lancent des pierres !' } }),
      trainer({ id: 'r6_cuervo', look: 'cuervo', x: 10, y: 27, dir: 'left', range: 3, foe: 'cuervo', level: 19,
        intro: { es: '¡Tú otra vez! El jefe dijo que te pararíamos aquí, en el Rif.', fr: 'Encore toi ! Le chef a dit qu\'on t\'arrêterait ici, dans le Rif.' },
        lose: { es: 'Da igual... Mis compañeros ya están en Fez.', fr: 'Peu importe... Mes camarades sont déjà à Fès.' },
        after: { es: 'El SELLO DE FEZ será el segundo. ¡Ja, ja!', fr: 'Le SCEAU DE FÈS sera le deuxième. Ha, ha !' } }),
      trainer({ id: 'r6_amina', look: 'jineta', x: 15, y: 36, dir: 'left', range: 2, foe: 'jinete', title: { es: 'JINETE', fr: 'CAVALIÈRE' }, level: 19, name: 'Amina',
        intro: { es: 'Entreno para entrar en el coliseo de Zaynab. ¡Tú serás mi prueba!', fr: 'Je m\'entraîne pour entrer au colisée de Zaynab. Tu seras mon épreuve !' },
        lose: { es: 'Aún me queda mucho que aprender.', fr: 'J\'ai encore beaucoup à apprendre.' },
        after: { es: 'Zaynab es la mejor amazona de Marruecos. Llévate muchos ungüentos.', fr: 'Zaynab est la meilleure cavalière du Maroc. Prends beaucoup d\'onguents.' } }),
    ],
    items: [
      { id: 'r6a', x: 4, y: 30, item: 'triaca', n: 1 },
      { id: 'r6b', x: 16, y: 40, item: 'unguento', n: 2 },
      { id: 'r6c', x: 8, y: 19, item: 'hogaza', n: 4 },
    ],
  },

  // ── Ruta 7 · valle del Sebú (niveles 19-21) ──
  ruta7: {
    name: { es: 'RUTA 7 · VALLE DEL SEBÚ', fr: 'ROUTE 7 · VALLÉE DU SEBOU' }, bg: 'valle', theme: 'verde',
    wild: [{ id: 'escorpion', w: 30, lv: [19, 21] }, { id: 'vibora', w: 25, lv: [19, 21] }, { id: 'chacal', w: 25, lv: [19, 21] }, { id: 'jabali', w: 20, lv: [19, 20] }],
    build: () => asciiMap([
      'MMMMMMMMMMMM==MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MM..........==............................MM',
      'MM..P...P...==...P....P.....P....P....P...MM',
      'MM~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~MM',
      'MM~~~~~~~~~~BB~~~~~~~~~~~~~~~~~~~~~~~~~~~~MM',
      'MM...P......==.....P......P.,,,,,,,P,,..P.MM',
      'MM.,,,,,,,..==..............,,,,,,,,,,....MM',
      'MM.,,,,,,,..==..............,,,,,,,,,,....MM',
      'MM.,,,,,,,..==============..,,,,,,,,,,..R.MM',
      'MM.,,,,,,,..==============.............PP.MM',
      'MMP.....................==................MM',
      'MM........P..R..,,,,,,..==........RP......MM',
      'MM.P............,,,,,,..==................MM',
      'MMR.............,,,,,,..==.............R..MM',
      'MM.,,,,,,,,,....,,,,,,P.==................MM',
      'MM.,,,,,,,,,....,,,,,,..==============....MM',
      'MM.,,,,,,,,,....,,,,,,..==============....MM',
      'MM.,,,,,,,,,........................==..R.MM',
      'MM.,,,,,,,,,...............,,,,,,,..==...PMM',
      'MM.,,,,,,,,,...............,,,,,,,..==....MM',
      'MM.........................,,,,,,,..==....MM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM==MMMMMM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM==MMMMMM',
    ]),
    objects: [
      signAt(14, 7, { es: 'RUTA 7 · VALLE DEL SEBÚ\nAl sureste: FEZ.', fr: 'ROUTE 7 · VALLÉE DU SEBOU\nAu sud-est : FÈS.' }),
    ],
    conn: { up: { map: 'ruta6', dx: 0 }, down: { map: 'fez', dx: -21 } },
    npcs: [
      trainer({ id: 'r7_youssef', look: 'mercader', x: 18, y: 11, dir: 'up', range: 1, foe: 'mercader', level: 19, name: 'Youssef',
        intro: { es: '¡Llevo azafrán y seda a Fez! Si me ganas, te hago descuento.', fr: 'J\'apporte du safran et de la soie à Fès ! Si tu gagnes, je te fais un prix.' },
        lose: { es: 'Trato hecho, trato hecho.', fr: 'Marché conclu, marché conclu.' },
        after: { es: 'En Fez venden CIMITARRAS. Cortan como el viento del desierto.', fr: 'À Fès, on vend des CIMETERRES. Ils coupent comme le vent du désert.' } }),
      trainer({ id: 'r7_tariq', look: 'jinete', x: 22, y: 13, dir: 'right', range: 2, foe: 'jinete', level: 20, name: 'Tariq',
        intro: { es: '¡Ningún extranjero pasa sin un duelo!', fr: 'Aucun étranger ne passe sans un duel !' },
        lose: { es: 'Bien, bien. Puedes pasar.', fr: 'Bien, bien. Tu peux passer.' },
        after: { es: 'El valle del Sebú es el granero de Fez. ¡Cuidado con los escorpiones!', fr: 'La vallée du Sebou est le grenier de Fès. Attention aux scorpions !' } }),
      trainer({ id: 'r7_layla', look: 'jineta', x: 33, y: 14, dir: 'down', range: 2, foe: 'jinete', title: { es: 'JINETE', fr: 'CAVALIÈRE' }, level: 20, name: 'Layla',
        intro: { es: '¡Mi lanza no falla nunca!', fr: 'Ma lance ne rate jamais !' },
        lose: { es: 'Hoy ha fallado...', fr: 'Aujourd\'hui, elle a raté...' },
        after: { es: 'Zaynab espera a los retadores en el coliseo, al sur de la medina.', fr: 'Zaynab attend les challengers au colisée, au sud de la médina.' } }),
      trainer({ id: 'r7_cuervo', look: 'cuerva', x: 38, y: 18, dir: 'left', range: 1, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 21,
        intro: { es: '¡Nadie entra en Fez mientras nosotros trabajamos!', fr: 'Personne n\'entre à Fès pendant que nous travaillons !' },
        lose: { es: '¡Bah! Que lo intenten dentro.', fr: 'Bah ! Qu\'ils essaient à l\'intérieur.' },
        after: { es: 'El sultán guarda su sello en el palacio. Pero los guardias estarán mirando el coliseo...', fr: 'Le sultan garde son sceau au palais. Mais les gardes regarderont le colisée...' } }),
      talker('r7_campesino', 'labrador', 8, 13, 'down', { es: 'El río Sebú riega todo el valle. Hay trigo, olivos y palmeras.', fr: 'Le Sebou irrigue toute la vallée. Il y a du blé, des oliviers et des palmiers.' }),
    ],
    items: [
      { id: 'r7a', x: 5, y: 19, item: 'triaca', n: 1 },
      { id: 'r7b', x: 30, y: 7, item: 'unguento', n: 2 },
    ],
  },

  // ── Fez: medina y coliseo 2 ──
  fez: {
    name: { es: 'FEZ', fr: 'FÈS' }, bg: 'medina', theme: 'rif',
    build: () => asciiMap([
      'MMMMMMMMMMMMMMM==MMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMM==MMMMMMMMMMMMMMM',
      'WWWWWWWWWWWWWWW##WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW##WWWWWWWWWWWWWWW',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W####P####################P####W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W#########P##########P#########W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'W##############################W',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    ]),
    objects: [
      { type: 'gate', x: 14, y: 1, w: 4, h: 3, walk: [[1, 0], [2, 0], [1, 1], [2, 1], [1, 2], [2, 2]], o: { stone: STONE.ocre, color: '#2a6ad0', portcullis: false } },
      { type: 'tower', x: 2, y: 5, w: 3, h: 5, o: { stone: STONE.ocre, color: '#2e8a5a' }, text: { es: 'El palacio del sultán. Aquí se guarda el SELLO DE FEZ.', fr: 'Le palais du sultan. C\'est ici qu\'on garde le SCEAU DE FÈS.' } },
      innHouse(6, 5, { flat: true }),
      shopHouse(20, 5, ['hogaza', 'unguento', 'triaca'], GREET.shop, { flat: true }),
      armoryHouse(25, 5, ['cimitarra', 'cota'], { es: 'Cimitarras de Fez: curvas, ligeras y mortales.', fr: 'Cimeterres de Fès : courbes, légers et mortels.' }, { flat: true }),
      { type: 'fountain', x: 15, y: 10, w: 2, h: 2, o: { stone: STONE.ocre }, text: { es: 'La fuente de Nejjarine, cubierta de azulejos.', fr: 'La fontaine Nejjarine, couverte de zelliges.' } },
      plainHouse(2, 13, null, { flat: true, frame: '#2a6ad0' }),
      plainHouse(25, 13, null, { flat: true, frame: '#2e8a5a' }),
      { type: 'coliseo', x: 12, y: 18, w: 8, h: 5, o: { color: '#2e8a5a', stone: STONE.ocre }, door: [3, 4], enter: { map: 'coliseo_fez', x: 7, y: 13, dir: 'up' } },
      { type: 'banner', x: 10, y: 20, h: 2, o: { color: '#2e8a5a' } },
      { type: 'banner', x: 21, y: 20, h: 2, o: { color: '#2e8a5a' } },
      { type: 'tower', x: 27, y: 19, w: 2, h: 5, o: { stone: STONE.ocre, color: '#2e8a5a' }, text: { es: 'El alminar de la madrasa.', fr: 'Le minaret de la médersa.' } },
      signAt(13, 4, { es: 'FEZ\nCiudad de los jinetes. Coliseo de JINETES: maestra ZAYNAB.', fr: 'FÈS\nCité des cavaliers. Colisée des CAVALIERS : maîtresse ZAYNAB.' }),
      signAt(3, 21, { es: 'CURTIDURÍAS\nAquí se tiñen las pieles de mil colores. ¡Huele fuerte!', fr: 'TANNERIES\nIci, on teint les peaux de mille couleurs. Ça sent fort !' }),
    ],
    conn: { up: { map: 'ruta7', dx: 21 } },
    npcs: [
      talker('fz_guardia', 'guardia_moro', 17, 4, 'down', null, { talk: async W => {
        if (!W.flag('blason_fez')) await W.say({ es: 'Bienvenid{o} a Fez. El coliseo de ZAYNAB está al sur de la medina.', fr: 'Bienvenue à Fès. Le colisée de ZAYNAB est au sud de la médina.' });
        else await W.say({ es: 'Los ladrones del sello galoparon hacia Tánger. ¡Corre al puerto!', fr: 'Les voleurs du sceau ont galopé vers Tanger. Cours au port !' });
      } }),
      talker('fz_sabio', 'anciano', 10, 12, 'down', { es: 'La medina de Fez tiene más de mil años. Aquí está la universidad más antigua del mundo.', fr: 'La médina de Fès a plus de mille ans. Ici se trouve la plus ancienne université du monde.' }),
      talker('fz_mujer', 'tangerina', 21, 12, 'left', { es: 'Los jinetes de Zaynab son rapidísimos. Sube tu DEFENSA o te arrollarán.', fr: 'Les cavaliers de Zaynab sont très rapides. Augmente ta DÉFENSE ou ils te renverseront.' }),
      talker('fz_curtidor', 'herrero', 5, 22, 'right', { es: 'Teñimos el cuero con amapola, índigo y azafrán. ¡El rojo de Fez es famoso!', fr: 'On teint le cuir avec du coquelicot, de l\'indigo et du safran. Le rouge de Fès est célèbre !' }),
      talker('fz_nino', 'nino', 14, 15, 'down', { es: '¡Algún día seré jinete como Zaynab!', fr: 'Un jour, je serai cavalier comme Zaynab !' }, { wander: 2 }),
      talker('fz_jinete', 'jinete', 12, 5, 'down', null, { cond: () => S0().flags.selloFez, talk: async W => {
        const r = await W.ask({ es: 'JINETE: Zaynab me ha pedido que te lleve a TÁNGER cuando quieras. ¿Vamos?', fr: 'CAVALIER : Zaynab m\'a demandé de t\'emmener à TANGER quand tu veux. On y va ?' }, [t('yes'), t('no')]);
        if (r === 0) await W.sail({ map: 'tanger', x: 14, y: 4, dir: 'up' }, { es: 'Al galope hacia TÁNGER', fr: 'Au galop vers TANGER' });
      } }),
      talker('fz_guardia2', 'guardia_moro', 5, 10, 'down', null, { cond: () => S0().flags.selloFez, talk: async W => {
        await W.say({ es: 'Sin el SELLO DE FEZ, el sultán no puede renovar la tregua. ¡Qué deshonra!', fr: 'Sans le SCEAU DE FÈS, le sultan ne peut pas renouveler la trêve. Quel déshonneur !' });
      } }),
    ],
    onEnter: async W => { if (W.flag('blason_fez') && !W.flag('selloFez')) await scriptSelloFez(W); },
  },

  coliseo_fez: {
    name: { es: 'COLISEO DE FEZ', fr: 'COLISÉE DE FÈS' }, bg: 'coliseo', theme: 'arena', edgeOk: true,
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
      { type: 'stand', x: 0, y: 0, w: 15, h: 2, o: { stone: STONE.ocre } },
      { type: 'banner', x: 4, y: 2, h: 2, o: { color: '#2e8a5a' } },
      { type: 'banner', x: 10, y: 2, h: 2, o: { color: '#2e8a5a' } },
      { type: 'tent', x: 1, y: 7, w: 2, h: 2, o: { color: '#2e8a5a' }, text: { es: 'La tienda donde descansan los jinetes.', fr: 'La tente où se reposent les cavaliers.' } },
      { type: 'tent', x: 12, y: 10, w: 2, h: 2, o: { color: '#a82848' } },
      { type: 'barrel', x: 1, y: 12 },
      { type: 'barrel', x: 13, y: 4 },
    ],
    exits: [exitDown(7, 14, { map: 'fez', x: 15, y: 23, dir: 'down' })],
    npcs: [
      trainer({ id: 'cf_hamid', look: 'jinete', x: 4, y: 10, dir: 'right', range: 4, foe: 'jinete', level: 24, name: 'Hamid',
        intro: { es: '¡Para llegar a Zaynab, primero tendrás que esquivar mi lanza!', fr: 'Pour atteindre Zaynab, il faudra d\'abord esquiver ma lance !' },
        lose: { es: '¡Me has desmontado!', fr: 'Tu m\'as désarçonné !' },
        after: { es: 'Zaynab usa GALOPE y luego CARGA A CABALLO. ¡Prepárate!', fr: 'Zaynab utilise GALOP puis CHARGE À CHEVAL. Prépare-toi !' } }),
      trainer({ id: 'cf_salma', look: 'jineta', x: 10, y: 6, dir: 'left', range: 4, foe: 'jinete', title: { es: 'JINETE', fr: 'CAVALIÈRE' }, level: 25, name: 'Salma',
        intro: { es: 'Zaynab me enseñó a montar. ¡Y a luchar!', fr: 'Zaynab m\'a appris à monter. Et à combattre !' },
        lose: { es: 'Eres digno rival para la maestra.', fr: 'Tu es un adversaire digne de la maîtresse.' },
        after: { es: 'Si te quedas sin vida, usa una TRIACA. Cura mucho.', fr: 'Si tu manques de PV, utilise une THÉRIAQUE. Elle soigne beaucoup.' } }),
      { id: 'zaynab', look: 'zaynab', x: 7, y: 3, dir: 'down', talk: W => scriptZaynab(W) },
    ],
  },

  // ── Ruta 9 · mar de Alborán, a bordo de LA ESPERANZA (niveles 22-25) ──
  ruta9: {
    name: { es: 'RUTA 9 · MAR DE ALBORÁN', fr: 'ROUTE 9 · MER D\'ALBORAN' }, bg: 'barco', theme: 'madera', edgeOk: true,
    wild: [{ id: 'gaviota', w: 100, lv: [22, 24] }], wildOn: 'D', wildRate: 0.04,
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~KKKKKKKKKKKKKKKKKKKKKKKKKKK~~~~~',
      '~~KDDXXDDDDDDDDDDDDDDDDDDXXDKK~~~~',
      '~~KDDXDDDDDDDDDDDDDDDDDDDDDDDDK~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDDDDDK~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDDDDDK~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDDDDDDDDDDDDDXXDDDDDDDDDDDK~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDKK~~~~',
      '~~KKKKKKKKKKKKKKKKKKKKKKKKKKK~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      { type: 'mast', x: 10, y: 5, o: { color: '#eef4e6', mark: '#2e8a5a', flag: '#2e8a5a' } },
      { type: 'mast', x: 21, y: 5, o: { color: '#eef4e6', flag: '#2e8a5a' } },
      { type: 'barrel', x: 14, y: 2 },
      { type: 'barrel', x: 15, y: 9 },
    ],
    npcs: [
      trainer({ id: 'r9_bartolo', look: 'marinero', x: 8, y: 3, dir: 'down', range: 3, foe: 'marinero', level: 23, name: 'Bartolo',
        intro: { es: '¡Grumete nuevo a bordo! Te toca fregar... ¡o luchar!', fr: 'Nouveau mousse à bord ! Tu dois laver le pont... ou te battre !' },
        lose: { es: 'Vale, friego yo.', fr: 'D\'accord, je lave le pont.' },
        after: { es: 'Primera escala: las islas BALEARES.', fr: 'Première escale : les îles BALÉARES.' } }),
      trainer({ id: 'r9_lola', look: 'marinera', x: 14, y: 8, dir: 'up', range: 2, foe: 'marinero', title: { es: 'MARINERA', fr: 'MARIN' }, level: 24, name: 'Lola',
        intro: { es: '¡Llevo diez años en el mar y nadie me tumba!', fr: 'Dix ans en mer et personne ne m\'a jamais mise à terre !' },
        lose: { es: 'Hasta hoy...', fr: 'Jusqu\'à aujourd\'hui...' },
        after: { es: 'En el mar de Alborán hay delfines. ¡Y piratas!', fr: 'Dans la mer d\'Alboran, il y a des dauphins. Et des pirates !' } }),
      trainer({ id: 'r9_corsario', look: 'corsario', x: 25, y: 6, dir: 'left', range: 4, foe: 'corsario', level: 25,
        intro: { es: '¡Este barco es nuestro! ¡Al abordaje!', fr: 'Ce navire est à nous ! À l\'abordage !' },
        lose: { es: '¡Retirada! ¡Retirada!', fr: 'Retraite ! Retraite !' },
        after: { es: '...', fr: '...' },
        post: async (W, e) => { await W.fadeNpc(e); await W.say({ es: 'El corsario salta a su barca y huye remando.', fr: 'Le corsaire saute dans sa barque et s\'enfuit à la rame.' }, { color: 'blue' }); } }),
      talker('r9_cocinero', 'herrero', 5, 8, 'right', { es: 'Hoy hay pescado frito. ¡Mañana también! ¡Y pasado!', fr: 'Aujourd\'hui, il y a du poisson frit. Demain aussi ! Et après-demain !' }),
      { id: 'r9_ahmed', look: 'marinero', x: 29, y: 5, dir: 'left', talk: W => scriptAhmedViaje(W, 'tr_r9_corsario', { map: 'ruta10', x: 3, y: 10, dir: 'right' }, { es: 'Rumbo a las BALEARES', fr: 'Cap sur les BALÉARES' }, { es: 'AHMED: ¡Tierra! Las islas BALEARES. Cruza la isla: te espero en el muelle del otro lado.', fr: 'AHMED : Terre ! Les îles BALÉARES. Traverse l\'île : je t\'attends au quai de l\'autre côté.' }) },
    ],
    entry: [[4, 6]],
  },

  // ── Ruta 10 · islas Baleares (niveles 24-27) ──
  ruta10: {
    name: { es: 'RUTA 10 · ISLAS BALEARES', fr: 'ROUTE 10 · ÎLES BALÉARES' }, bg: 'isla', theme: 'costa', edgeOk: true,
    wild: [{ id: 'cabra', w: 30, lv: [24, 26] }, { id: 'gaviota', w: 35, lv: [24, 26] }, { id: 'cangrejo', w: 35, lv: [25, 27] }],
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~ssssssssssssssssssssssssssssss~~~~',
      '~~~~ss..TTY.....................ss~~~~',
      '~~~~rsY.TT..============........ss~~~~',
      '~~~~ss......============.,,,,,,.ss~~~~',
      '~~~~ss......==........==.,,,,,,.ss~~~~',
      '~~~~ss......==......Y.==.,,,,,,.ss~~~~',
      '~~DD==========.,,,,,..==.,,,,,,Yss~~~~',
      '~~DD=========.Y,,,,,..==........ss~~~~',
      '~~~~ss.........,,,,,..==......====DD~~',
      '~~~~ss.,,,,,Y..,,,,,..==......====DD~~',
      '~~~~ss.,,,,,...,,,,,..==......==ss~~~~',
      '~~~~ss.,,,,,.Y..YYY...====TT====ss~~~~',
      '~~~~ss.,,,,,....,,,,,.====TT===.ss~~~~',
      '~~~~rs.....Y....,,,,,...........ss~~~~',
      '~~~~rs..............Y...Y.Y..Y..ss~~~~',
      '~~~~sssssssssssssssssssrrrssssssss~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      signAt(6, 8, { es: 'RUTA 10 · ISLAS BALEARES\nCruza la isla hasta el muelle del este.', fr: 'ROUTE 10 · ÎLES BALÉARES\nTraverse l\'île jusqu\'au quai est.' }),
      { type: 'ship', x: 32, y: 19, w: 6, h: 2, o: { color: '#eef4e6', mark: '#2e8a5a', flag: '#2e8a5a' } },
    ],
    npcs: [
      trainer({ id: 'r10_biel', look: 'pescador', x: 10, y: 6, dir: 'right', range: 2, foe: 'marinero', title: { es: 'PESCADOR', fr: 'PÊCHEUR' }, level: 25, name: 'Biel',
        intro: { es: '¡Una sobrasada y un duelo! ¡Así se recibe en Mallorca!', fr: 'Une sobrasada et un duel ! C\'est comme ça qu\'on accueille à Majorque !' },
        lose: { es: '¡Ostres! Qué fuerza.', fr: 'Ostres ! Quelle force.' },
        after: { es: 'Los honderos de las Baleares eran los mejores del mundo. Tiraban piedras con honda.', fr: 'Les frondeurs des Baléares étaient les meilleurs du monde. Ils lançaient des pierres à la fronde.' } }),
      trainer({ id: 'r10_pastor', look: 'labrador', x: 19, y: 7, dir: 'up', range: 1, foe: 'peregrino', title: { es: 'PASTOR', fr: 'BERGER' }, level: 25, name: 'Toni',
        intro: { es: '¡Has asustado a mis cabras! ¡Ahora me asustas a mí!', fr: 'Tu as effrayé mes chèvres ! Maintenant, c\'est moi que tu effraies !' },
        lose: { es: 'Me rindo, me rindo.', fr: 'Je me rends, je me rends.' },
        after: { es: 'Las cabras de la isla trepan por las rocas como si nada.', fr: 'Les chèvres de l\'île grimpent sur les rochers comme si de rien n\'était.' } }),
      trainer({ id: 'r10_margalida', look: 'marinera', x: 24, y: 9, dir: 'left', range: 1, foe: 'marinero', title: { es: 'MARINERA', fr: 'MARIN' }, level: 26, name: 'Margalida',
        intro: { es: '¿Vas a Génova? ¡Antes tendrás que vencerme!', fr: 'Tu vas à Gênes ? Il faudra d\'abord me battre !' },
        lose: { es: 'Buen viaje, {esc}.', fr: 'Bon voyage, {esc}.' },
        after: { es: 'En Cerdeña hay muflones. Tienen los cuernos enroscados como caracolas.', fr: 'En Sardaigne, il y a des mouflons. Leurs cornes sont enroulées comme des coquillages.' } }),
      trainer({ id: 'r10_cuervo', look: 'cuervo', x: 28, y: 16, dir: 'up', range: 1, foe: 'cuervo', level: 26,
        intro: { es: '¡El Cuervo tiene ojos en todas las islas!', fr: 'Le Corbeau a des yeux sur toutes les îles !' },
        lose: { es: 'Corvino se enterará de esto...', fr: 'Corvino va l\'apprendre...' },
        after: { es: 'Los sellos van camino de VENECIA. ¡Allí no podrás entrar!', fr: 'Les sceaux sont en route pour VENISE. Là-bas, tu ne pourras pas entrer !' } }),
      talker('r10_viajera', 'viajera', 14, 11, 'down', { es: 'Las calas de esta isla tienen el agua más clara del mar. ¡Qué maravilla!', fr: 'Les criques de cette île ont l\'eau la plus claire de la mer. Quelle merveille !' }),
      { id: 'r10_ahmed', look: 'marinero', x: 34, y: 12, dir: 'left', talk: W => scriptAhmedViaje(W, null, { map: 'ruta11', x: 2, y: 12, dir: 'right' }, { es: 'Rumbo a CERDEÑA', fr: 'Cap sur la SARDAIGNE' }, { es: 'AHMED: ¡Tierra! CERDEÑA. Igual que antes: cruza la isla y te espero en el muelle.', fr: 'AHMED : Terre ! La SARDAIGNE. Comme avant : traverse l\'île, je t\'attends au quai.' }) },
    ],
    items: [
      { id: 'r10a', x: 7, y: 14, item: 'triaca', n: 2 },
      { id: 'r10b', x: 25, y: 7, item: 'unguento', n: 3 },
    ],
    entry: [[3, 10]],
  },

  // ── Ruta 11 · Cerdeña (niveles 27-29) ──
  ruta11: {
    name: { es: 'RUTA 11 · CERDEÑA', fr: 'ROUTE 11 · SARDAIGNE' }, bg: 'isla', theme: 'seco', edgeOk: true,
    wild: [{ id: 'muflon', w: 35, lv: [27, 29] }, { id: 'jabali', w: 25, lv: [27, 29] }, { id: 'vibora', w: 20, lv: [27, 28] }, { id: 'gaviota', w: 20, lv: [27, 28] }],
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~ssssssssssssssssssssssssssssssss~~~',
      '~~~ss....MMMMMM......R.C...,,,,,,ss~~~',
      '~~~ss....MMMMMM.....R......,,,,,,ss~~~',
      '~~~ss..C.MMMMMM...R......C.......ss~~~',
      '~~~ss,,,,.....................=====DD~',
      '~~~ss,,,,.....................=====DD~',
      '~~~ss,,,,...C.....R.============.ss~~~',
      '~~~ss,,,,....,,,,,..===========..ss~~~',
      '~~~ss........,,,,,..==.,,,,,,....ss~~~',
      '~DD=========.,,,,,..==.,,,,,,....ss~~~',
      '~DD=========.,,,,,..==.,,,,,,....ss~~~',
      '~~~ss.....==........==.,,,,,,....ss~~~',
      '~~~ss.....==........==........R..ss~~~',
      '~~~ssC....============..MMMMMMM..ss~~~',
      '~~~ssMMM..===========...MMMMMMM.Rss~~~',
      '~~~ssMMM......,,,,,,,,.RMMMMMMM..ss~~~',
      '~~~ssMMM..R...,,,,,,,,..MMMMMMM..ss~~~',
      '~~~ss.........,,,,,,,,.......R...ss~~~',
      '~~~ss........C..................Rss~~~',
      '~~~ssssssssssssssssssssssssssssssss~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      signAt(5, 13, { es: 'RUTA 11 · CERDEÑA\nIsla de muflones y torres de piedra.', fr: 'ROUTE 11 · SARDAIGNE\nÎle des mouflons et des tours de pierre.' }),
      { type: 'tower', x: 12, y: 6, w: 2, h: 3, o: { stone: STONE.gris }, text: { es: 'Un NURAGUE: una torre de piedra que construyeron hace miles de años.', fr: 'Un NURAGHE : une tour de pierre construite il y a des milliers d\'années.' } },
    ],
    npcs: [
      trainer({ id: 'r11_efisio', look: 'cazador', x: 8, y: 13, dir: 'right', range: 2, foe: 'cazador', level: 27, name: 'Efisio',
        intro: { es: 'Busco muflones, pero me conformo contigo.', fr: 'Je cherche des mouflons, mais je me contenterai de toi.' },
        lose: { es: '¡Más rápid{o} que un muflón!', fr: 'Plus rapide qu\'un mouflon !' },
        after: { es: 'Los muflones bajan a beber al amanecer.', fr: 'Les mouflons descendent boire à l\'aube.' } }),
      trainer({ id: 'r11_grazia', look: 'peregrina', x: 16, y: 13, dir: 'down', range: 2, foe: 'peregrino', title: { es: 'PASTORA', fr: 'BERGÈRE' }, level: 28, name: 'Grazia',
        intro: { es: '¡Nadie pisa mis pastos sin pelear!', fr: 'Personne ne foule mes pâturages sans se battre !' },
        lose: { es: 'Está bien, pasa.', fr: 'C\'est bon, passe.' },
        after: { es: 'El queso de oveja de Cerdeña es el mejor del mundo.', fr: 'Le fromage de brebis de Sardaigne est le meilleur du monde.' } }),
      trainer({ id: 'r11_cuervo', look: 'cuervo', x: 22, y: 13, dir: 'left', range: 1, foe: 'cuervo', level: 28,
        intro: { es: '¡Corvino ha pagado a los corsarios para hundir tu barco!', fr: 'Corvino a payé les corsaires pour couler ton bateau !' },
        lose: { es: '¡Que se encarguen ellos de ti!', fr: 'Qu\'ils s\'occupent de toi !' },
        after: { es: 'En el mar de Liguria te esperan. ¡Ja!', fr: 'Dans la mer Ligure, on t\'attend. Ha !' } }),
      trainer({ id: 'r11_corsaria', look: 'cuerva', x: 26, y: 5, dir: 'down', range: 3, foe: 'corsario', title: { es: 'CORSARIA', fr: 'CORSAIRE' }, level: 29, name: 'Nadia',
        intro: { es: '¡Llevo tres días esperando a alguien a quien desplumar!', fr: 'J\'attends depuis trois jours quelqu\'un à plumer !' },
        lose: { es: '¡Me has desplumado tú a mí!', fr: 'C\'est toi qui m\'as plumée !' },
        after: { es: 'El capitán BARBARROJA ronda estas aguas. ¡Ojo con él!', fr: 'Le capitaine BARBEROUSSE rôde dans ces eaux. Méfie-toi de lui !' } }),
      { id: 'r11_ahmed', look: 'marinero', x: 35, y: 7, dir: 'left', talk: W => scriptAhmedViaje(W, null, { map: 'ruta12', x: 4, y: 6, dir: 'right' }, { es: 'Rumbo a GÉNOVA', fr: 'Cap sur GÊNES' }, null) },
    ],
    items: [
      { id: 'r11a', x: 18, y: 6, item: 'triaca', n: 2 },
      { id: 'r11b', x: 6, y: 7, item: 'unguento', n: 3 },
    ],
    entry: [[2, 12]],
  },

  // ── Ruta 12 · mar de Liguria: abordaje de los corsarios (niveles 29-31) ──
  ruta12: {
    name: { es: 'RUTA 12 · MAR DE LIGURIA', fr: 'ROUTE 12 · MER LIGURE' }, bg: 'barco', theme: 'madera', edgeOk: true,
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~KKKKKKKKKKKKKKKKKKKKKKK~~~~~',
      '~~KDDDDDDDDDDDXXDDDDDDDDKK~~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDK~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDK~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDDK~',
      '~~KDDDDDDDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDXXDDDDDDDDDDDDDDDDDDDK~~~',
      '~~KDDDDDDDDDDDDDDDDDDDDDKK~~~~',
      '~~KKKKKKKKKKKKKKKKKKKKKKK~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      { type: 'mast', x: 10, y: 5, o: { color: '#eef4e6', mark: '#2e8a5a', flag: '#2e8a5a' } },
      { type: 'mast', x: 19, y: 5, o: { color: '#eef4e6', flag: '#2e8a5a' } },
      { type: 'barrel', x: 21, y: 2 },
    ],
    npcs: [
      trainer({ id: 'r12_mustafa', look: 'corsario', x: 13, y: 3, dir: 'down', range: 3, foe: 'corsario', level: 29, name: 'Mustafá', cond: () => S0().flags.abordaje && !S0().flags.abordajeHecho,
        intro: { es: '¡Al abordaje! ¡Por Barbarroja!', fr: 'À l\'abordage ! Pour Barberousse !' },
        lose: { es: '¡Ay! ¡Me rindo!', fr: 'Aïe ! Je me rends !' },
        after: { es: 'El capitán no perdona a los cobardes...', fr: 'Le capitaine ne pardonne pas aux lâches...' } }),
      trainer({ id: 'r12_zora', look: 'cuerva', x: 16, y: 8, dir: 'up', range: 2, foe: 'corsario', title: { es: 'CORSARIA', fr: 'CORSAIRE' }, level: 30, name: 'Zora', cond: () => S0().flags.abordaje && !S0().flags.abordajeHecho,
        intro: { es: '¡Tu barco es nuestro, y tus ducados también!', fr: 'Ton bateau est à nous, et tes ducats aussi !' },
        lose: { es: '¡Qué {esc} tan terrible!', fr: 'Quel{e} terrible {esc} !' },
        after: { es: '...', fr: '...' } }),
      trainer({ id: 'r12_barbarroja', look: 'capitan', x: 23, y: 6, dir: 'left', range: 3, foe: 'capitan', title: { es: 'CAPITÁN', fr: 'CAPITAINE' }, level: 31, name: 'Barbarroja', cond: () => S0().flags.abordaje && !S0().flags.abordajeHecho,
        intro: { es: '¡Así que tú eres quien persigue al Cuervo! Corvino me ha pagado bien por tu cabeza...', fr: 'Alors c\'est toi qui poursuis le Corbeau ! Corvino m\'a bien payé pour ta tête...' },
        lose: { es: '¡Por las barbas de Neptuno! ¡Nunca había perdido en mi propia cubierta!', fr: 'Par la barbe de Neptune ! Je n\'avais jamais perdu sur mon propre pont !' },
        win: { es: '¡Al agua con {el} {esc}!', fr: 'À l\'eau, l\'{esc} !' },
        after: { es: '...', fr: '...' },
        post: async (W, e) => {
          await W.say({ es: 'BARBARROJA: Está bien, está bien... Te lo diré. CORVINO, el jefe del Cuervo, tiene su guarida en el ARSENAL de VENECIA.', fr: 'BARBEROUSSE : Bon, bon... Je vais te le dire. CORVINO, le chef du Corbeau, a son repaire à l\'ARSENAL de VENISE.' });
          await W.say({ es: 'BARBARROJA: Allí esconde los sellos robados. ¡Y yo me largo antes de que me hundas el barco!', fr: 'BARBEROUSSE : C\'est là qu\'il cache les sceaux volés. Et moi, je file avant que tu ne coules mon navire !' });
          for (const id of ['r12_barbarroja', 'r12_mustafa', 'r12_zora']) { const n = W.npc(id); if (n && !n.gone) await W.fadeNpc(n); }
          W.flag('abordajeHecho', true);
          await W.say({ es: 'Los corsarios saltan a su barco y huyen a toda vela.', fr: 'Les corsaires sautent sur leur navire et s\'enfuient toutes voiles dehors.' }, { color: 'blue' });
        } }),
      { id: 'r12_ahmed', look: 'marinero', x: 26, y: 5, dir: 'left', talk: W => scriptAhmedViaje(W, 'tr_r12_barbarroja', GENOVA_ARRIVAL, { es: 'Rumbo a GÉNOVA', fr: 'Cap sur GÊNES' }, { es: 'AHMED: ¡GÉNOVA a la vista! Gracias por salvar mi barco, {name}. Cuando quieras volver a Tánger, búscame en el puerto.', fr: 'AHMED : GÊNES en vue ! Merci d\'avoir sauvé mon navire, {name}. Quand tu voudras retourner à Tanger, cherche-moi au port.' }) },
    ],
    entry: [[4, 6]],
    onEnter: async W => { if (!W.flag('abordaje')) await scriptAbordaje(W); },
  },
});

// ─── Guiones de Marruecos y del mar ───────────────────────────────────────
async function scriptCapitanaR5(W) {
  if (!W.flag('tr_r5_corsario')) {
    await W.say({ es: 'CAPITANA: ¡Hay un polizón en mi barco! ¡Allí, junto al mástil! Échame una mano, {name}.', fr: 'CAPITAINE : Il y a un passager clandestin à bord ! Là, près du mât ! Donne-moi un coup de main, {name}.' });
    return;
  }
  await W.say({ es: 'CAPITANA: ¡Tierra a la vista! Ya se ve TÁNGER.', fr: 'CAPITAINE : Terre en vue ! On voit déjà TANGER.' });
  const r = await W.ask({ es: '¿Desembarcar en TÁNGER?', fr: 'Débarquer à TANGER ?' }, [t('yes'), t('no')]);
  if (r !== 0) return;
  await W.sail({ map: 'tanger', x: 12, y: 3, dir: 'down' }, { es: 'Rumbo a TÁNGER', fr: 'Cap sur TANGER' });
}

async function scriptBarcoTanger(W) {
  const r = await W.ask({ es: 'CAPITANA: ¿Volvemos a TARIFA?', fr: 'CAPITAINE : On retourne à TARIFA ?' }, [t('yes'), t('no')]);
  if (r === 0) await W.sail({ map: 'tarifa', x: 6, y: 16, dir: 'down' }, { es: 'Rumbo a TARIFA', fr: 'Cap sur TARIFA' });
}

async function scriptRivalTanger(W) {
  W.flag('rivalTanger', true);
  const p = W.player;
  const r = W.spawn({ id: 'rival_tg', look: rivalLook(), x: 16, y: 7, dir: 'up' });
  W.bubble(r); Sfx.play('alert'); await W.wait(700); W.bubble(null);
  await W.say({ es: '{rival}: ¡{name}! ¡Yo también he cruzado el Estrecho! Vine en un barco de pescadores.', fr: '{rival} : {name} ! Moi aussi, j\'ai traversé le détroit ! Je suis venu{e} sur un bateau de pêcheurs.' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: Los del Cuervo han ido hacia FEZ. Allí guardan el SELLO DE FEZ. ¡Pero antes, veamos cuánto has mejorado!', fr: '{rival} : Ceux du Corbeau sont partis vers FÈS. On y garde le SCEAU DE FÈS. Mais d\'abord, voyons tes progrès !' });
  const res = await W.battle({ foe: 'rival', level: 18, name: rivalName().toUpperCase(), look: rivalLook(), trainer: rivalName(), canLose: true, canFlee: false,
    defeatText: { es: '¡Grr! ¡Siempre un paso por delante!', fr: 'Grr ! Toujours un pas d\'avance !' }, winText: { es: '¡Esta vez gano yo!', fr: 'Cette fois, c\'est moi qui gagne !' } });
  if (res !== 'win') healPlayer();
  await W.say({ es: '{rival}: Yo iré a avisar al sultán. ¡Tú gana a Zaynab en el coliseo! Nos vemos, {name}.', fr: '{rival} : Je vais prévenir le sultan. Toi, bats Zaynab au colisée ! À plus, {name}.' });
  await W.walkTo(r, 16, 8);
  await W.fadeNpc(r);
  Game.save();
}

async function scriptZaynab(W) {
  if (W.flag('blason_fez')) {
    await W.say({ es: 'ZAYNAB: Los ladrones galoparon hacia Tánger. ¡Que el viento te lleve, {name}!', fr: 'ZAYNAB : Les voleurs ont galopé vers Tanger. Que le vent te porte, {name} !' });
    return;
  }
  await W.say({ es: 'ZAYNAB: Mis jinetes dicen que llegas desde Toledo. Hay que ser valiente para cruzar el mar.', fr: 'ZAYNAB : Mes cavaliers disent que tu viens de Tolède. Il faut du courage pour traverser la mer.' });
  await W.say({ es: 'ZAYNAB: En el desierto, quien duda, cae. ¡A galope tendido!', fr: 'ZAYNAB : Dans le désert, qui hésite tombe. Au grand galop !' });
  const res = await W.battle({ foe: 'zaynab', level: 26, look: 'zaynab', trainer: { es: 'MAESTRA ZAYNAB', fr: 'MAÎTRESSE ZAYNAB' }, canLose: false, canFlee: false,
    defeatText: { es: 'Nadie me había seguido el paso así.', fr: 'Personne ne m\'avait suivie comme ça.' }, winText: { es: 'Vuelve cuando sepas cabalgar el viento.', fr: 'Reviens quand tu sauras chevaucher le vent.' } });
  if (res !== 'win') return;
  await W.say({ es: 'ZAYNAB: Has luchado como un jinete zeneta. Este blasón es tuyo.', fr: 'ZAYNAB : Tu t\'es battu{e} comme un cavalier zénète. Ce blason est à toi.' });
  await W.blason('fez', CRESTS[1][3]);
  await W.receive('triaca', 2);
  await W.say({ es: 'ZAYNAB: El siguiente coliseo está en GÉNOVA, en Italia. Bianca y sus ballesteros no fallan un tiro.', fr: 'ZAYNAB : Le prochain colisée est à GÊNES, en Italie. Bianca et ses arbalétriers ne ratent jamais leur cible.' });
  Game.save();
}

async function scriptSelloFez(W) {
  W.flag('selloFez', true);
  const p = W.player;
  const z = W.spawn({ id: 'zaynab_out', look: 'zaynab', x: 15, y: 13, dir: 'down' });
  const r = W.spawn({ id: 'rival_fz', look: rivalLook(), x: 2, y: 11, dir: 'right' });
  Sfx.play('alert');
  await W.say({ es: '{rival}: ¡{name}! ¡Han robado el SELLO DE FEZ del palacio mientras todos mirábamos tu combate!', fr: '{rival} : {name} ! On a volé le SCEAU DE FÈS au palais pendant qu\'on regardait tous ton combat !' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.walkNextTo(z, p);
  z.dir = W.dirTo(z, p);
  await W.say({ es: 'ZAYNAB: Igual que en Toledo... Mis jinetes los han visto galopar hacia TÁNGER. Allí les esperaba un barco de velas negras, rumbo a Italia.', fr: 'ZAYNAB : Comme à Tolède... Mes cavaliers les ont vus galoper vers TANGER. Un bateau aux voiles noires les y attendait, cap sur l\'Italie.' });
  await W.say({ es: 'ZAYNAB: Toma este SALVOCONDUCTO. Con él, el capitán AHMED te llevará a GÉNOVA en LA ESPERANZA.', fr: 'ZAYNAB : Prends ce SAUF-CONDUIT. Avec lui, le capitaine AHMED t\'emmènera à GÊNES sur L\'ESPÉRANCE.' });
  Sfx.play('item');
  await W.say({ es: '{name} recibe el SALVOCONDUCTO.', fr: '{name} reçoit le SAUF-CONDUIT.' }, { color: 'blue' });
  W.flag('salvoconducto', true);
  await W.say({ es: '{rival}: Yo me quedo a ayudar a los guardias del sultán. ¡Tú atrapa a esos ladrones!', fr: '{rival} : Je reste aider les gardes du sultan. Toi, attrape ces voleurs !' });
  const q = await W.ask({ es: 'ZAYNAB: ¿Quieres que uno de mis jinetes te lleve a TÁNGER al galope?', fr: 'ZAYNAB : Tu veux qu\'un de mes cavaliers t\'emmène à TANGER au galop ?' }, [t('yes'), t('no')]);
  await W.fadeNpc(r);
  if (q === 0) { await W.sail({ map: 'tanger', x: 14, y: 4, dir: 'up' }, { es: 'Al galope hacia TÁNGER', fr: 'Au galop vers TANGER' }); return; }
  await W.say({ es: 'ZAYNAB: Como quieras. Mis jinetes te esperarán en la puerta de la ciudad.', fr: 'ZAYNAB : Comme tu veux. Mes cavaliers t\'attendront à la porte de la ville.' });
  await W.fadeNpc(z);
  Game.save();
}

async function scriptAhmedTanger(W) {
  if (!W.flag('salvoconducto')) {
    await W.say({ es: 'AHMED: Soy el capitán de LA ESPERANZA. Voy a Génova, pero el viaje es peligroso: solo llevo a quien tenga un salvoconducto de Fez.', fr: 'AHMED : Je suis le capitaine de L\'ESPÉRANCE. Je vais à Gênes, mais le voyage est dangereux : je n\'emmène que ceux qui ont un sauf-conduit de Fès.' });
    return;
  }
  if (W.flag('visitGenova')) {
    const r = await W.ask({ es: 'AHMED: ¿Zarpamos directos a GÉNOVA?', fr: 'AHMED : On part directement pour GÊNES ?' }, [t('yes'), t('no')]);
    if (r === 0) await W.sail(GENOVA_ARRIVAL, { es: 'Rumbo a GÉNOVA', fr: 'Cap sur GÊNES' });
    return;
  }
  await W.say({ es: 'AHMED: ¡Un salvoconducto de Zaynab! Entonces subes a bordo. Haremos escala en las BALEARES y en CERDEÑA.', fr: 'AHMED : Un sauf-conduit de Zaynab ! Alors tu montes à bord. Nous ferons escale aux BALÉARES et en SARDAIGNE.' });
  const r = await W.ask({ es: '¿Subir a bordo de LA ESPERANZA?', fr: 'Monter à bord de L\'ESPÉRANCE ?' }, [t('yes'), t('no')]);
  if (r !== 0) return;
  await W.warp({ map: 'ruta9', x: 4, y: 6, dir: 'right' });
}

// Ahmed en cada etapa del viaje: needFlag = entrenador que hay que vencer antes
async function scriptAhmedViaje(W, needFlag, to, label, arrive) {
  if (needFlag && !W.flag(needFlag)) {
    await W.say({ es: 'AHMED: ¡Hay corsarios a bordo! No podemos seguir hasta que nos libremos de ellos.', fr: 'AHMED : Il y a des corsaires à bord ! Impossible de continuer tant qu\'on ne s\'en est pas débarrassés.' });
    return;
  }
  const r = await W.ask({ es: 'AHMED: ¿Seguimos el viaje? ' + tr(label) + '.', fr: 'AHMED : On continue le voyage ? ' + tr(label) + '.' }, [t('yes'), t('no')]);
  if (r !== 0) return;
  await W.sail(to, label);
  if (arrive) await W.say(arrive);
}

async function scriptAbordaje(W) {
  W.flag('abordaje', true);
  await W.wait(400);
  Sfx.play('alert');
  await W.say({ es: 'AHMED: ¡Barco de velas negras a babor! ¡Son los corsarios de BARBARROJA!', fr: 'AHMED : Navire aux voiles noires à bâbord ! Ce sont les corsaires de BARBEROUSSE !' });
  await Game.fadeOut(200);
  for (const id of ['r12_mustafa', 'r12_zora', 'r12_barbarroja']) {
    const def = MAPS.ruta12.npcs.find(n => n.id === id);
    if (def && !W.npc(id)) W.spawn(def);
  }
  Sfx.play('hit');
  await Game.fadeIn(200);
  await W.say({ es: '¡Los corsarios abordan LA ESPERANZA!', fr: 'Les corsaires abordent L\'ESPÉRANCE !' }, { color: 'blue' });
  await W.say({ es: 'AHMED: ¡{name}, ayúdanos! ¡Su capitán está en la proa!', fr: 'AHMED : {name}, aide-nous ! Leur capitaine est à la proue !' });
}
