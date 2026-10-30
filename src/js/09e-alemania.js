// ─── Capítulo II · Alemania: Dolomitas, Brennero, Baviera, Núremberg, Turingia, Luneburgo y Lübeck ───
const DOLOMITAS_ARRIVAL = { map: 'ruta17', x: 14, y: 40, dir: 'up' };

// Fondos de combate de Alemania
Object.assign(BG, {
  alpes: { sky: ['#9ccaee', '#b6d8f2', '#cfe6f6', '#e6f2fa'], far: ['#c8c2b4', 'mount'], hill: ['#8cc070', '#78ac5c', '#689c50'], ground: ['#b4d494', '#a8ca88'], plat: ['#c6e2a8', '#a8ca88', '#76985a', '#8eb470'], deco: 'fir' },
  bosque: { sky: ['#a2cdea', '#b8d8ee', '#cee4f2', '#e2eef6'], far: ['#4e7a54', 'mount'], hill: ['#4e8a44', '#3e7a38', '#336a30'], ground: ['#9cc47e', '#90b872'], plat: ['#b0d492', '#94bc76', '#5e8446', '#7aa45e'], deco: 'fir' },
  brezal: { sky: ['#a8d0ee', '#bedcf2', '#d4e8f6', '#e8f2f8'], hill: ['#b08ab0', '#9a6c9c', '#86588a'], ground: ['#cccc8e', '#c0c082'], plat: ['#dada9e', '#c2c284', '#8a8a54', '#a6a66a'], deco: 'cypress' },
  franconia: { sky: ['#9cd2f2', '#b6def5', '#cde9f6', '#e2f2f8'], far: ['#d49a7e', 'walls'], hill: null, ground: ['#dcbcaa', '#d0ae9c'], plat: ['#eed6c8', '#dcbcaa', '#9a7666', '#bc9682'], deco: null },
  hansa: { sky: ['#a6c6e2', '#bcd4ea', '#d2e2f0', '#e6eef6'], far: ['#b8604a', 'walls'], hill: null, ground: ['#c8c4bc', '#bcb8b0'], plat: ['#dedad2', '#c8c4bc', '#86827a', '#a6a29a'], deco: null },
});

Object.assign(MAPS, {
  // ── Ruta 17 · Dolomitas (niveles 51-54) ──
  ruta17: {
    name: { es: 'RUTA 17 · DOLOMITAS', fr: 'ROUTE 17 · DOLOMITES' }, bg: 'alpes', theme: 'alpes',
    wild: [{ id: 'marmota', w: 30, lv: [51, 53] }, { id: 'cabra', w: 20, lv: [51, 53] }, { id: 'aguila', w: 25, lv: [52, 53] }, { id: 'lobo', w: 25, lv: [51, 53] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMM==MMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMM==MMMMMMMMMMMMMM',
      'MMMMMMMM....Y.==....MMMMMMMMMM',
      'MMMMMMMMssss..==ssssMMMMMMMMMM',
      'MMMMMMMMssss..==ssssMMMMMMMMMM',
      'MMMMMMMM......==ssssMMMMMMMMMM',
      'MM............==....MMMMMMMMMM',
      'MM.,,,,,......==.sss........MM',
      'MM.,,,,,Y.....==.sssR.......MM',
      'MM.,,,,,......==...........YMM',
      'MM.,,,,,.=======.,,,,,,.....MM',
      'MM.......======..,,,,,,.....MM',
      'MMMMMMY..==......,,,,,,.MMMMMM',
      'MMMMMM.Y.==.MMMMM,,,,,,.MMMMMM',
      'MMMMMM...==.MMMMM,,,,,,.MMMMMM',
      'MMMMMM...==.MMMMM.......MMMMMM',
      'MMY...Y..==.............Y...MM',
      'MM.Y.R.Y.==...............YYMM',
      'MM.......=============......MM',
      'MM.......=============......MM',
      'MMMMM...............==..MMMMMM',
      'MMMMM...R..MMMMMM...==,,MMMMMM',
      'MMMMM...,,,MMMMMM...==,,MMMMMM',
      'MMMMM...,,,MMMMMMY..==,,MMMMMM',
      'MMY.....,,,.........==,,...YMM',
      'MM......,,,.........==......MM',
      'MM....================......MM',
      'MM....===============......YMM',
      'MMMMM.==...................RMM',
      'MMMMM.==............Y.~~~~Y.MM',
      'MMMMM.==..MMMM....YRR~~~~~~.MM',
      'MMMMM.==..MMMMR......~~~~~~.MM',
      'MM....==..........Y...~~~~Y.MM',
      'MMY...==.........,,,,,......MM',
      'MMY.Y.==========.,,,,,......MM',
      'MM.Y..==========.,,,,,..MMMMMM',
      'MM.......,,,,,==........MMMMMM',
      'MM....Y..,,,,,==........MMMMMM',
      'MM....Y.R,,,,,==..YY....Y...MM',
      'MM..YY........==......Y...Y.MM',
      '~~~~~~~~~~~~~~DD~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~DD~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      { type: 'boat', x: 12, y: 41, w: 2, h: 1, text: { es: 'La barca del barquero. Lleva de vuelta a VENECIA.', fr: 'La barque du passeur. Elle ramène à VENISE.' } },
      signAt(16, 37, { es: 'RUTA 17 · DOLOMITAS\nMontañas pálidas, prados y neveros. Al norte: el paso del BRENNERO.', fr: 'ROUTE 17 · DOLOMITES\nMontagnes pâles, prairies et névés. Au nord : le col du BRENNER.' }),
      signAt(20, 32, { es: 'LAGO DE BRAIES. Dicen que sus aguas guardan una puerta a un reino escondido.', fr: 'LAC DE BRAIES. On dit que ses eaux cachent la porte d\'un royaume secret.' }),
    ],
    conn: { up: { map: 'ruta18', dx: 0 } },
    entry: [[14, 40]],
    npcs: [
      { id: 'r17_barquero', look: 'gondolero', x: 16, y: 39, dir: 'left', talk: W => scriptBarqueroDolomitas(W) },
      talker('r17_ermitano', 'anciano', 4, 25, 'down', { es: '¿Ves esas montañas pálidas? Al atardecer se vuelven rosas, como brasas. Aquí lo llamamos ENROSADIRA.', fr: 'Tu vois ces montagnes pâles ? Au coucher du soleil, elles deviennent roses comme des braises. Ici, on appelle ça l\'ENROSADIRA.' }),
      talker('r17_pastora', 'tirolesa', 25, 9, 'down', { es: 'En verano subimos las vacas a los prados altos. ¡Cuidado con las MARMOTAS, silban y muerden!', fr: 'En été, nous montons les vaches aux alpages. Attention aux MARMOTTES, elles sifflent et elles mordent !' }),
      trainer({ id: 'r17_hansi', look: 'tiroles', x: 8, y: 33, dir: 'left', range: 2, foe: 'cazador', title: { es: 'CAZADOR', fr: 'CHASSEUR' }, level: 52, name: 'Hansi',
        intro: { es: '¡Grüß Gott! En estas montañas solo sobrevive quien sabe apuntar.', fr: 'Grüß Gott ! Dans ces montagnes, seuls ceux qui savent viser survivent.' },
        lose: { es: '¡Vaya puntería la tuya!', fr: 'Quelle précision !' },
        after: { es: 'Las ÁGUILAS REALES anidan en las cumbres. Atacan desde muy alto.', fr: 'Les AIGLES ROYAUX nichent sur les sommets. Ils attaquent de très haut.' } }),
      trainer({ id: 'r17_sepp', look: 'lenador', x: 12, y: 24, dir: 'down', range: 2, foe: 'lenador', level: 52, name: 'Sepp',
        intro: { es: 'Tumbo un abeto de tres hachazos. ¿Cuántos necesitaré contigo?', fr: 'J\'abats un sapin en trois coups de hache. Combien m\'en faudra-t-il pour toi ?' },
        lose: { es: 'Más de tres, está claro.', fr: 'Plus de trois, c\'est sûr.' },
        after: { es: 'La madera de estos bosques acaba en los barcos de Venecia.', fr: 'Le bois de ces forêts finit dans les navires de Venise.' } }),
      trainer({ id: 'r17_toni', look: 'minero', x: 18, y: 16, dir: 'down', range: 2, foe: 'minero', level: 53, name: 'Toni',
        intro: { es: '¡Bajo la montaña hay plata! Y no pienso compartirla.', fr: 'Sous la montagne, il y a de l\'argent ! Et je ne le partagerai pas.' },
        lose: { es: 'Me vuelvo a la mina...', fr: 'Je retourne à la mine...' },
        after: { es: 'Unos hombres de negro compraron todo nuestro hierro. Pagaron muy bien.', fr: 'Des hommes en noir ont acheté tout notre fer. Ils ont très bien payé.' } }),
      trainer({ id: 'r17_paolo', look: 'peregrino', x: 11, y: 12, dir: 'left', range: 1, foe: 'peregrino', level: 53, name: 'Paolo',
        intro: { es: 'Bajo de los Alpes hacia Roma. ¡Un combate para calentar las piernas!', fr: 'Je descends des Alpes vers Rome. Un combat pour me dégourdir les jambes !' },
        lose: { es: 'Ya tengo las piernas calientes... y doloridas.', fr: 'J\'ai les jambes échauffées... et douloureuses.' },
        after: { es: 'En el BRENNERO hay un hospicio donde descansar gratis.', fr: 'Au BRENNER, il y a un hospice où se reposer gratuitement.' } }),
      trainer({ id: 'r17_cuervo', look: 'cuervo', x: 16, y: 8, dir: 'left', range: 1, foe: 'cuervo', level: 54,
        intro: { es: '¡Alto! ¡El barón no quiere curiosos en el camino del norte!', fr: 'Halte ! Le baron ne veut pas de curieux sur la route du nord !' },
        lose: { es: '¿El barón? ¡Yo no he dicho nada de ningún barón!', fr: 'Le baron ? Je n\'ai parlé d\'aucun baron !' },
        after: { es: '...', fr: '...' } }),
    ],
    items: [
      { id: 'r17a', x: 3, y: 8, item: 'elixir', n: 1 },
      { id: 'r17b', x: 26, y: 10, item: 'triaca', n: 2 },
      { id: 'r17c', x: 4, y: 17, item: 'unguento', n: 3 },
      { id: 'r17d', x: 25, y: 38, item: 'triaca', n: 1 },
    ],
  },

  // ── Ruta 18 · Paso del Brennero (niveles 53-56) ──
  ruta18: {
    name: { es: 'RUTA 18 · PASO DEL BRENNERO', fr: 'ROUTE 18 · COL DU BRENNER' }, bg: 'alpes', theme: 'alpes',
    wild: [{ id: 'marmota', w: 20, lv: [53, 55] }, { id: 'aguila', w: 25, lv: [53, 55] }, { id: 'oso', w: 20, lv: [54, 55] }, { id: 'cabra', w: 15, lv: [53, 54] }, { id: 'salteador', w: 20, lv: [53, 55] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMM==MMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMM==MMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMM....==...MMMMMMMMMMM',
      'MMMMMMMMMMMMMM....==...MMMMMMMMMMM',
      'MMMMMMMMMMMMMM..R.==..YMM......MMM',
      'MMMMMMMM......R...==...MM......MMM',
      'MMMMMMMM...sssss..==...MM......MMM',
      'MM...R.....sssss..==...MM......MMM',
      'MM.........sssss..==.Y.MM......MMM',
      'MMssssss..........==...........MMM',
      'MMssssssY.........==.Y.MM......MMM',
      'MMssssss...Y....Y.==...MM......MMM',
      'MM................==.Y.MMMMMMMMMMM',
      'MM........==========...MMMMMMMMMMM',
      'MM....Y...=========..........Y..MM',
      'MM...MMM..==........,,,.....ssssMM',
      'MM.YYMMM..==........,,,....RssssMM',
      'MM...MMM..==........,,,.....ssssMM',
      'MM...MMM..==......Y.,,,..Y..ssssMM',
      'MM.,,,,,..==........,,,....R....MM',
      'MM.,,,,,..==........Y....Y......MM',
      'MM.,,,,,..==...............Y....MM',
      'MM.,,,,,..================.MMMMMMM',
      'MM.Y......================.MMMMMMM',
      'MM......................==.MMMMMMM',
      'MM.........Y,,,.MMMMY...==.MMMMMMM',
      'MMMMMMM...YY,,,YMMMM....==......MM',
      'MMMMMMM...Y.,,,.MMMM....==,,,,,.MM',
      'MMMMMMMY......Y.MMMMY...==,,,,,.MM',
      'MMMMMMM.................==,,,,,.MM',
      'MMMMMMM..Y..............==,,,,,.MM',
      'MM............============.Y....MM',
      'MM............===========.......MM',
      'MM...Y......,,==,..........MMMMMMM',
      'MMMMMMM.....,,==,MMMMMM.Y..MMMMMMM',
      'MMMMMMM.....,,==,MMMMMM....MMMMMMM',
      'MMMMMMM.....,,==,MMMMMM....MMMMMMM',
      'MMMMMMM.......==.MMMMMM....MMMMMMM',
      'MMMMMMMMMMMMMM==MMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMM==MMMMMMMMMMMMMMMMMM',
    ]),
    objects: [
      signAt(16, 37, { es: 'RUTA 18 · PASO DEL BRENNERO\nEl paso más bajo de los Alpes. Al norte: BAVIERA.', fr: 'ROUTE 18 · COL DU BRENNER\nLe col le plus bas des Alpes. Au nord : la BAVIÈRE.' }),
      innHouse(12, 15, { wall: TIMBER_WALL, timber: true, roof: ['#8a8a98', '#6a6a78', '#4a4a58'] }),
      signAt(12, 20, { es: 'HOSPICIO DEL BRENNERO. Desde aquí, al norte, se habla alemán.', fr: 'HOSPICE DU BRENNER. À partir d\'ici, vers le nord, on parle allemand.' }),
      { type: 'tent', x: 25, y: 4, w: 2, h: 2, o: { color: '#2a5aa0' }, text: { es: 'Una tienda de lana azul, con alfombras de Fez.', fr: 'Une tente de laine bleue, avec des tapis de Fès.' } },
      { type: 'chesstable', x: 28, y: 8, text: { es: 'Un tablero de ajedrez de marfil y ébano.', fr: 'Un échiquier d\'ivoire et d\'ébène.' } },
    ],
    conn: { down: { map: 'ruta17', dx: 0 }, up: { map: 'ruta19', dx: 0 } },
    npcs: [
      { id: 'r18_sabio', look: 'sabio_fez', x: 27, y: 8, dir: 'down', talk: W => scriptSabioFez(W) },
      talker('r18_aduanero', 'guardia_al', 21, 24, 'down', { es: 'Soy el aduanero del Brennero. Los mercaderes pagan peaje... ¡pero los coliseos te dan paso libre!', fr: 'Je suis le douanier du Brenner. Les marchands paient un péage... mais les colisées te donnent libre passage !' }),
      trainer({ id: 'r18_greta', look: 'peregrina', x: 8, y: 14, dir: 'right', range: 2, foe: 'peregrino', title: { es: 'PEREGRINA', fr: 'PÈLERINE' }, level: 54, name: 'Greta',
        intro: { es: 'Vengo de Roma y vuelvo a casa. ¡Aún me quedan fuerzas para un combate!', fr: 'Je reviens de Rome et je rentre chez moi. Il me reste des forces pour un combat !' },
        lose: { es: 'Bueno... ya no me quedan.', fr: 'Bon... maintenant, il ne m\'en reste plus.' },
        after: { es: 'He visto a un sabio con turbante entre las rocas del este. ¡Qué tranquilo parecía!', fr: 'J\'ai vu un sage avec un turban entre les rochers de l\'est. Il avait l\'air si tranquille !' } }),
      trainer({ id: 'r18_liesl', look: 'tirolesa', x: 16, y: 10, dir: 'right', range: 2, foe: 'cazador', title: { es: 'CAZADORA', fr: 'CHASSERESSE' }, level: 55, name: 'Liesl',
        intro: { es: 'Mi flecha nunca falla. ¿Y tu escudo?', fr: 'Ma flèche ne rate jamais. Et ton bouclier ?' },
        lose: { es: 'Tu escudo sí que no falla.', fr: 'Ton bouclier, lui, ne faiblit jamais.' },
        after: { es: 'Más allá del paso empiezan los bosques de Baviera.', fr: 'Au-delà du col commencent les forêts de Bavière.' } }),
      trainer({ id: 'r18_jakob', look: 'minero', x: 12, y: 24, dir: 'up', range: 1, foe: 'minero', level: 55, name: 'Jakob',
        intro: { es: '¡Llevo un mes picando roca! Necesito pelear con algo que se mueva.', fr: 'Ça fait un mois que je pique la roche ! J\'ai besoin de me battre contre quelque chose qui bouge.' },
        lose: { es: 'La roca era más fácil.', fr: 'La roche, c\'était plus facile.' },
        after: { es: 'En el hospicio dan sopa caliente y cama gratis.', fr: 'À l\'hospice, on donne une soupe chaude et un lit gratuit.' } }),
      trainer({ id: 'r18_c1', look: 'cuerva', x: 26, y: 30, dir: 'left', range: 2, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 56,
        intro: { es: '¡Nadie cruza el Brennero sin pagar el peaje del Cuervo!', fr: 'Personne ne passe le Brenner sans payer le péage du Corbeau !' },
        lose: { es: '¡Peaje... perdonado!', fr: 'Péage... offert !' },
        after: { es: 'El barón nos paga en oro de Venecia.', fr: 'Le baron nous paie en or de Venise.' } }),
      trainer({ id: 'r18_c2', look: 'cuervo', x: 20, y: 4, dir: 'left', range: 1, foe: 'cuervo', level: 56,
        intro: { es: '¡Has llegado lejos! Pero Corvino ya está a salvo en el norte.', fr: 'Tu es allé{e} loin ! Mais Corvino est déjà à l\'abri dans le nord.' },
        lose: { es: 'Corvino... está en NÚREMBERG... ¡Ups!', fr: 'Corvino... est à NUREMBERG... Oups !' },
        after: { es: '...', fr: '...' } }),
    ],
    items: [
      { id: 'r18a', x: 3, y: 10, item: 'elixir', n: 1 },
      { id: 'r18b', x: 30, y: 17, item: 'triaca', n: 2 },
      { id: 'r18c', x: 29, y: 29, item: 'unguento', n: 3 },
      { id: 'r18d', x: 30, y: 10, item: 'triaca', n: 1 },
    ],
  },

  // ── Ruta 19 · Bosques de Baviera y el Danubio (niveles 55-58) ──
  ruta19: {
    name: { es: 'RUTA 19 · BOSQUES DE BAVIERA', fr: 'ROUTE 19 · FORÊTS DE BAVIÈRE' }, bg: 'bosque', theme: 'bosque',
    wild: [{ id: 'ciervo', w: 30, lv: [55, 57] }, { id: 'jabali', w: 25, lv: [55, 57] }, { id: 'lobo', w: 25, lv: [55, 57] }, { id: 'oso', w: 20, lv: [56, 57] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMMMM==MMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMMMM==MMMMMMMMMMMMMMMMMM',
      'MM......Y.Y..Y..Y...==...Y............MM',
      'MMY..YY.....Y...Y.Y.==.Y....Y....,,,,.MM',
      'MM.......Y.....Y..Y.==.......Y..Y,,,,.MM',
      'MM.......Y..........==..YY..Y.YYY,,,,.MM',
      'MM........YY.....Y..==..Y.....YY.,,,,YMM',
      'MM.Y..Y..YY.........==................MM',
      'MM.......YY.....Y...==============..Y.MM',
      'MM.Y.Y........Y.....==============.YY.MM',
      'MM...............Y..............==.Y..MM',
      'MM..Y.........YY......,,,,,.....==....MM',
      'MM..,,,,,,,,.R..Y.Y...,,,,,.YY..==...YMM',
      'MM..,,,,,,,,.....Y....,,,,,.....==....MM',
      'MMY.,,,,,,,,....Y..Y..,,,,,.....==....MM',
      'MM.Y,,,,,,,,Y.....Y....Y........==....MM',
      'MM..,,,,,,,,.....R.RY.....========....MM',
      'MM..,,,,,,,,......Y...Y...=======.....MM',
      'MM..YY...Y....R....Y..Y...==..........MM',
      'MMY...............Y.YY....==.Y..Y.Y...MM',
      'MM~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~MM',
      'MM~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~MM',
      'MM~~~~~~~~~~~~~~~~~~~~~~~~BB~~~~~~~~~~MM',
      'MM...Y....................==.Y........MM',
      'MM.....Y.....Y.Y......Y.Y.==......Y...MM',
      'MM.YY..Y..................==.......Y..MM',
      'MM......====================.,,,,,,...MM',
      'MM...Y..===================.Y,,,,,,...MM',
      'MM......==..,,,,,..........Y.,,,,,,...MM',
      'MM......==..,,,,,.Y..R.R.Y...,,,,,,...MM',
      'MM.Y....==.Y,,,,,......Y....Y.........MM',
      'MMY.....==...........................YMM',
      'MM...Y..============.......Y.......YY.MM',
      'MM..Y...============..,,,,,,Y....Y....MM',
      'MM.,,,,,..........==..,,,,,,......Y...MM',
      'MMY,,,,,..........==..,,,,,,.YY.......MM',
      'MMY,,,,,...Y......==.Y,,,,,,..Y.......MM',
      'MM.,,,,,..........==.......Y......YY.YMM',
      'MMMMMMMMMMMMMMMMMM==MMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMM==MMMMMMMMMMMMMMMMMMMM',
    ]),
    objects: [
      signAt(16, 37, { es: 'RUTA 19 · BOSQUES DE BAVIERA\nAl norte, tras el DANUBIO: NÚREMBERG.', fr: 'ROUTE 19 · FORÊTS DE BAVIÈRE\nAu nord, après le DANUBE : NUREMBERG.' }),
      signAt(23, 23, { es: 'EL DANUBIO. Nace en la Selva Negra y llega hasta el mar Negro.', fr: 'LE DANUBE. Il naît en Forêt-Noire et va jusqu\'à la mer Noire.' }),
    ],
    conn: { down: { map: 'ruta18', dx: 0 }, up: { map: 'nuremberg', dx: -3 } },
    npcs: [
      talker('r19_pescador', 'pescador', 30, 23, 'down', { es: 'En el Danubio pescamos lucios enormes. Y en invierno el río se hiela entero.', fr: 'Dans le Danube, on pêche des brochets énormes. Et en hiver, le fleuve gèle entièrement.' }),
      trainer({ id: 'r19_wolfgang', look: 'lenador', x: 10, y: 31, dir: 'down', range: 1, foe: 'lenador', level: 56, name: 'Wolfgang',
        intro: { es: 'En este bosque mando yo. ¡Y mi hacha!', fr: 'Dans cette forêt, c\'est moi qui commande. Et ma hache !' },
        lose: { es: 'Mi hacha te cede el paso.', fr: 'Ma hache te cède le passage.' },
        after: { es: 'Los CIERVOS de Baviera tienen cuernas como ramas de roble.', fr: 'Les CERFS de Bavière ont des bois comme des branches de chêne.' } }),
      trainer({ id: 'r19_ulrich', look: 'cazador', x: 4, y: 28, dir: 'right', range: 3, foe: 'cazador', level: 56, name: 'Ulrich',
        intro: { es: '¡Llevo tres días siguiendo a un oso! Tú me servirás de práctica.', fr: 'Ça fait trois jours que je suis un ours ! Tu me serviras d\'entraînement.' },
        lose: { es: 'Mejor sigo con el oso.', fr: 'Je ferais mieux de suivre l\'ours.' },
        after: { es: 'Ten cuidado con los osos: son lentos, pero pegan muy fuerte.', fr: 'Méfie-toi des ours : ils sont lents, mais ils frappent très fort.' } }),
      trainer({ id: 'r19_dietrich', look: 'caballero_al', x: 20, y: 25, dir: 'down', range: 1, foe: 'caballero', level: 57, name: 'Dietrich',
        intro: { es: 'Soy caballero del duque de Baviera. ¡Muéstrame tu valor!', fr: 'Je suis chevalier du duc de Bavière. Montre-moi ta valeur !' },
        lose: { es: 'Tienes el valor de un león.', fr: 'Tu as le courage d\'un lion.' },
        after: { es: 'En Núremberg está el mejor armero del Imperio: Meister KONRAD.', fr: 'À Nuremberg vit le meilleur armurier de l\'Empire : Meister KONRAD.' } }),
      trainer({ id: 'r19_cuervo', look: 'cuervo', x: 30, y: 18, dir: 'up', range: 1, foe: 'cuervo', level: 57,
        intro: { es: '¡No cruzarás el Danubio! ¡Órdenes del barón!', fr: 'Tu ne traverseras pas le Danube ! Ordres du baron !' },
        lose: { es: '¡Me rindo! ¡Me rindo!', fr: 'Je me rends ! Je me rends !' },
        after: { es: 'El barón tiene un castillo en una roca... la «piedra del cuervo».', fr: 'Le baron a un château sur un rocher... la « pierre du corbeau ».' } }),
      trainer({ id: 'r19_adelheid', look: 'dama_al', x: 24, y: 10, dir: 'up', range: 1, foe: 'caballero', title: { es: 'CABALLERA', fr: 'CHEVALIÈRE' }, level: 58, name: 'Adelheid',
        intro: { es: 'Mi armadura es de Núremberg. ¡A ver si la abollas!', fr: 'Mon armure vient de Nuremberg. Voyons si tu la cabosses !' },
        lose: { es: '¡Me la has abollado!', fr: 'Tu l\'as cabossée !' },
        after: { es: 'Meister Konrad usa MEDIA ESPADA: baja tu defensa y luego remata.', fr: 'Meister Konrad utilise DEMI-ÉPÉE : il baisse ta défense, puis il achève.' } }),
      trainer({ id: 'r19_anselm', look: 'fraile', x: 17, y: 5, dir: 'right', range: 3, foe: 'fraile', level: 57, name: 'Anselm',
        intro: { es: 'Copio libros en el monasterio. Hoy me apetece algo más movido.', fr: 'Je copie des livres au monastère. Aujourd\'hui, j\'ai envie de quelque chose de plus mouvementé.' },
        lose: { es: 'Volveré a mis libros.', fr: 'Je retourne à mes livres.' },
        after: { es: 'Copiar un libro a mano lleva meses. ¡Ojalá alguien inventara una máquina para hacerlo!', fr: 'Copier un livre à la main prend des mois. Si seulement quelqu\'un inventait une machine pour ça !' } }),
    ],
    items: [
      { id: 'r19a', x: 34, y: 4, item: 'elixir', n: 1 },
      { id: 'r19b', x: 5, y: 14, item: 'triaca', n: 2 },
      { id: 'r19c', x: 36, y: 35, item: 'unguento', n: 3 },
    ],
  },

  // ── Núremberg: ciudad libre del Imperio, coliseo 5 ──
  nuremberg: {
    name: { es: 'NÚREMBERG', fr: 'NUREMBERG' }, bg: 'franconia', theme: 'franconia',
    build: () => asciiMap([
      'WWWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWWW',
      'WMMMMMMMMM#########################W',
      'WMMMMMMMMM#########################W',
      'WMMMMMMMMM#########################W',
      'WMMMMMMMMM#########################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W~~~~~~~BB~~~~~~~BB~~~~~~~BB~~~~~~~W',
      'W~~~~~~~BB~~~~~~~BB~~~~~~~BB~~~~~~~W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'W##################################W',
      'WWWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWWW',
    ]),
    objects: [
      { type: 'tower', x: 2, y: 1, w: 2, h: 4, o: { stone: STONE.rojo, roof: ['#8a8a98', '#6a6a78', '#4a4a58'] } },
      { type: 'tower', x: 6, y: 0, w: 3, h: 5, o: { stone: STONE.rojo, roof: ['#8a8a98', '#6a6a78', '#4a4a58'], color: '#f2ca52' } },
      signAt(5, 6, { es: 'EL CASTILLO DEL EMPERADOR. Aquí se alojan los emperadores cuando visitan la ciudad.', fr: 'LE CHÂTEAU DE L\'EMPEREUR. Les empereurs y logent quand ils visitent la ville.' }),
      innHouse(11, 3, { wall: TIMBER_WALL, timber: true }),
      { type: 'tower', x: 21, y: 2, w: 2, h: 5, o: { stone: STONE.rojo, spire: 32, roof: ['#8a8a98', '#6a6a78', '#4a4a58'] }, text: { es: 'La iglesia de SAN SEBALDO, patrón de Núremberg.', fr: 'L\'église SAINT-SEBALD, patron de Nuremberg.' } },
      { type: 'tower', x: 24, y: 2, w: 2, h: 5, o: { stone: STONE.rojo, spire: 32, roof: ['#8a8a98', '#6a6a78', '#4a4a58'] }, text: { es: 'Las torres de San Sebaldo. Se ven desde todo el valle.', fr: 'Les tours de Saint-Sebald. On les voit de toute la vallée.' } },
      plainHouse(27, 3, null, { wall: TIMBER_WALL, timber: true, frame: '#3d8c58' }),
      plainHouse(2, 8, null, { wall: TIMBER_WALL, timber: true, frame: '#a0402e' }),
      plainHouse(9, 8, null, { wall: TIMBER_WALL, timber: '#7a3a2a', frame: '#3a70c0' }),
      { type: 'stall', x: 19, y: 9, w: 2, h: 2, o: { color: '#2a2a30', goods: ['#c8803a', '#8a4a2a', '#e8b860', '#a0602a'] }, text: { es: 'Un puesto de especias venecianas: canela, clavo y jengibre.', fr: 'Un étal d\'épices vénitiennes : cannelle, clou de girofle et gingembre.' } },
      { type: 'brunnen', x: 23, y: 9, w: 2, h: 2, text: { es: 'La FUENTE HERMOSA: cuarenta figuras de piedra pintadas y doradas. ¡Recién terminada!', fr: 'La BELLE FONTAINE : quarante statues de pierre peintes et dorées. Toute neuve !' } },
      shopHouse(27, 8, ['hogaza', 'unguento', 'triaca', 'lebkuchen', 'elixir'], { es: '¡Grüß Gott! Pruebe nuestro LEBKUCHEN: miel, almendras y especias de Venecia.', fr: 'Grüß Gott ! Goûtez notre LEBKUCHEN : miel, amandes et épices de Venise.' }, { wall: TIMBER_WALL, timber: true }),
      { type: 'coliseo', x: 3, y: 18, w: 8, h: 5, o: { color: '#2a2a30', stone: STONE.rojo }, door: [3, 4], enter: { map: 'coliseo_nuremberg', x: 7, y: 13, dir: 'up' } },
      armoryHouse(12, 18, ['espada_larga', 'arnes_nuremberg'], { es: 'Armaduras de Núremberg: las mejores del Imperio. ¡Y espadas largas para luchar a dos manos!', fr: 'Armures de Nuremberg : les meilleures de l\'Empire. Et des épées longues pour combattre à deux mains !' }, { wall: TIMBER_WALL, timber: true }),
      { type: 'tower', x: 22, y: 18, w: 2, h: 5, o: { stone: STONE.rojo, spire: 34, roof: ['#7aa88a', '#5a8a6a', '#3a6a4a'] }, text: { es: 'La iglesia de SAN LORENZO, de arenisca roja.', fr: 'L\'église SAINT-LAURENT, en grès rouge.' } },
      { type: 'tower', x: 25, y: 18, w: 2, h: 5, o: { stone: STONE.rojo, spire: 34, roof: ['#7aa88a', '#5a8a6a', '#3a6a4a'] }, text: { es: 'Desde lo alto de San Lorenzo, los vigías avisan de los incendios.', fr: 'Du haut de Saint-Laurent, les guetteurs signalent les incendies.' } },
      plainHouse(29, 18, null, { wall: TIMBER_WALL, timber: true, frame: '#a0402e' }),
      plainHouse(3, 24, null, { wall: TIMBER_WALL, timber: '#7a3a2a', frame: '#3d8c58' }),
      plainHouse(24, 24, { es: 'TALLER DE ARMADURAS. Se oyen martillazos día y noche.', fr: 'ATELIER D\'ARMURES. On entend des coups de marteau jour et nuit.' }, { wall: TIMBER_WALL, timber: true, shield: true }),
      plainHouse(29, 24, null, { wall: TIMBER_WALL, timber: true, frame: '#3a70c0' }),
      signAt(15, 28, { es: 'NÚREMBERG\nCiudad libre del Imperio. Coliseo de ARMADURA: Meister KONRAD.', fr: 'NUREMBERG\nVille libre d\'Empire. Colisée de l\'ARMURE : Meister KONRAD.' }),
      signAt(19, 2, { es: 'PUERTA NORTE → RUTA 20 · BOSQUE DE TURINGIA', fr: 'PORTE NORD → ROUTE 20 · FORÊT DE THURINGE' }),
    ],
    conn: { down: { map: 'ruta19', dx: 3 }, up: { map: 'ruta20', dx: 0 } },
    npcs: [
      talker('nu_guardia', 'guardia_al', 16, 2, 'right', null, { talk: async W => {
        if (!W.flag('nurembergOpen')) await W.say({ es: 'La puerta norte solo se abre a quien tenga el BLASÓN DE NÚREMBERG.', fr: 'La porte nord ne s\'ouvre que pour qui possède le BLASON DE NUREMBERG.' });
        else await W.say({ es: 'Sigue el camino del bosque de Turingia. LÜBECK está muy al norte, junto al mar.', fr: 'Suis la route de la forêt de Thuringe. LÜBECK est très au nord, au bord de la mer.' });
      } }),
      talker('nu_pintor', 'anciano', 12, 13, 'down', { es: 'Tengo la extraña sensación de que, dentro de cien años, un pintor de esta ciudad dibujará un rinoceronte... ¡sin haber visto ninguno!', fr: 'J\'ai l\'étrange impression que, dans cent ans, un peintre de cette ville dessinera un rhinocéros... sans en avoir jamais vu !' }),
      talker('nu_burgues', 'aleman', 20, 13, 'down', { es: '¡Gran noticia! Nuestro burgrave, Federico de Hohenzollern, acaba de ser nombrado príncipe elector de Brandeburgo.', fr: 'Grande nouvelle ! Notre burgrave, Frédéric de Hohenzollern, vient d\'être nommé prince-électeur de Brandebourg.' }),
      talker('nu_panadera', 'alemana', 26, 13, 'down', { es: 'El LEBKUCHEN cura más que un ungüento... ¡y sabe mucho mejor!', fr: 'Le LEBKUCHEN soigne mieux qu\'un onguent... et il a bien meilleur goût !' }),
      talker('nu_esgrimista', 'aleman', 9, 23, 'down', { es: 'Mi maestro copió en un libro los secretos del gran LIECHTENAUER: la MEDIA ESPADA y los GOLPES MAESTROS.', fr: 'Mon maître a copié dans un livre les secrets du grand LIECHTENAUER : la DEMI-ÉPÉE et les COUPS DE MAÎTRE.' }),
      talker('nu_dama', 'dama_al', 14, 23, 'down', { es: 'Meister KONRAD usa TEMPLE DE ACERO para subir ataque y defensa. ¡No le dejes prepararse!', fr: 'Meister KONRAD utilise TREMPE D\'ACIER pour monter son attaque et sa défense. Ne le laisse pas se préparer !' }),
      talker('nu_nino', 'nino', 20, 26, 'down', { es: '¡De mayor seré armero, como Meister Konrad!', fr: 'Quand je serai grand, je serai armurier, comme Meister Konrad !' }, { wander: 2 }),
    ],
    triggers: [
      { x: 17, y: 2, cond: () => !S0().flags.nurembergOpen, run: W => scriptCityGate(W, 'nu_guardia', 'down', { es: '¡Alto! Sin el BLASÓN DE NÚREMBERG no puedes salir hacia el norte.', fr: 'Halte ! Sans le BLASON DE NUREMBERG, tu ne peux pas partir vers le nord.' }) },
      { x: 18, y: 2, cond: () => !S0().flags.nurembergOpen, run: W => scriptCityGate(W, 'nu_guardia', 'down', { es: '¡Alto! Sin el BLASÓN DE NÚREMBERG no puedes salir hacia el norte.', fr: 'Halte ! Sans le BLASON DE NUREMBERG, tu ne peux pas partir vers le nord.' }) },
      { x: 17, y: 29, cond: () => !S0().flags.rivalNuremberg, run: W => scriptRivalNuremberg(W) },
      { x: 18, y: 29, cond: () => !S0().flags.rivalNuremberg, run: W => scriptRivalNuremberg(W) },
    ],
  },

  coliseo_nuremberg: {
    name: { es: 'COLISEO DE NÚREMBERG', fr: 'COLISÉE DE NUREMBERG' }, bg: 'coliseo', theme: 'franconia', edgeOk: true,
    build: () => asciiMap([
      'WWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWW',
      'W#####sss#####W',
      'W#####sss#####W',
      'W#############W',
      'W##X#######X##W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W#############W',
      'W##X#######X##W',
      'W#############W',
      'W#############W',
      'W#############W',
      'WWWWWWW#WWWWWWW',
    ]),
    objects: [
      { type: 'stand', x: 0, y: 0, w: 15, h: 2, o: { stone: STONE.rojo } },
      { type: 'banner', x: 4, y: 2, h: 2, o: { color: '#f2ca52', mark: '#2a2a30' } },
      { type: 'banner', x: 10, y: 2, h: 2, o: { color: '#f2ca52', mark: '#2a2a30' } },
      { type: 'dummy', x: 2, y: 12, text: { es: 'Un muñeco con una armadura vieja. Tiene cien abolladuras.', fr: 'Un mannequin avec une vieille armure. Il a cent bosses.' } },
      { type: 'dummy', x: 12, y: 12 },
    ],
    exits: [exitDown(7, 14, { map: 'nuremberg', x: 6, y: 23, dir: 'down' })],
    npcs: [
      trainer({ id: 'cnu_hans', look: 'armero', x: 5, y: 9, dir: 'right', range: 4, foe: 'armero', level: 58, name: 'Hans',
        intro: { es: 'Yo forjo las armaduras... ¡y también sé usarlas!', fr: 'Je forge les armures... et je sais aussi m\'en servir !' },
        lose: { es: 'Tendré que forjarme otra.', fr: 'Il va falloir que je m\'en forge une autre.' },
        after: { es: 'El maestro usa GOLPE MAESTRO cuando está herido. ¡Acaba rápido!', fr: 'Le maître utilise COUP DE MAÎTRE quand il est blessé. Finis vite !' } }),
      trainer({ id: 'cnu_kunigunde', look: 'dama_al', x: 10, y: 6, dir: 'left', range: 4, foe: 'caballero', title: { es: 'CABALLERA', fr: 'CHEVALIÈRE' }, level: 59, name: 'Kunigunde',
        intro: { es: 'Llevo veinte kilos de acero encima. ¡Y aún así soy más rápida que tú!', fr: 'Je porte vingt kilos d\'acier. Et je suis quand même plus rapide que toi !' },
        lose: { es: 'Bueno... quizá no tan rápida.', fr: 'Bon... peut-être pas si rapide.' },
        after: { es: 'Suerte con el maestro.', fr: 'Bonne chance avec le maître.' } }),
      { id: 'konrad', look: 'konrad', x: 7, y: 3, dir: 'down', talk: W => scriptKonrad(W) },
    ],
  },

  // ── Ruta 20 · Bosque de Turingia (niveles 59-62) ──
  ruta20: {
    name: { es: 'RUTA 20 · BOSQUE DE TURINGIA', fr: 'ROUTE 20 · FORÊT DE THURINGE' }, bg: 'bosque', theme: 'bosque',
    wild: [{ id: 'ciervo', w: 25, lv: [59, 61] }, { id: 'lobo', w: 25, lv: [59, 61] }, { id: 'oso', w: 25, lv: [60, 61] }, { id: 'lince', w: 25, lv: [59, 61] }],
    build: () => asciiMap([
      'MMMMMMMMMMMM==MMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMMMMMM',
      'MMMMMMMMMY..==.Y..YY..MMMMMMMM',
      'MMMMMMMMM.Y.==.Y......MMMMMMMM',
      'MMMMMMMMM...==..Y....YMMMMMMMM',
      'MM.Y.YYY..Y.==..............MM',
      'MMY.Y....Y..==========.....YMM',
      'MM.......Y..==========......MM',
      'MM.,,,,YYYY....,,,,.==.....YMM',
      'MMY,,,,......Y.,,,,.==......MM',
      'MM.,,,,Y..YY...,,,,.==.....YMM',
      'MM.Y..Y.............==..YYY.MM',
      'MM......==============..YY.YMM',
      'MM.Y..Y.=============...Y..YMM',
      'MMY.Y.Y.==..............MMMMMM',
      'MMY.....==..MMMMY.......MMMMMM',
      'MMY.....==..MMMM.Y...Y..MMMMMM',
      'MM...Y..==..MMMM..R...YYMMMMMM',
      'MM......==..Y......Y..YY....MM',
      'MM.Y.Y..==..................MM',
      'MM.YY...================..Y.MM',
      'MMY.....================.Y..MM',
      'MM..Y.Y...,,,,,,......==.Y..MM',
      'MMMMM...YY,,,,,,YY....==.Y..MM',
      'MMMMM.....,,,,,,......==....MM',
      'MMMMM.YY.Y,,,,,,.YYY..==....MM',
      'MMMMM.Y...........Y...==..Y.MM',
      'MM....................==....MM',
      'MMY...==================..YYMM',
      'MM.R..=================.....MM',
      'MM.Y..==................,,,,MM',
      'MM....==....MMMMM.Y.....,,,,MM',
      'MM....==....MMMMMY..Y.YY,,,,MM',
      'MM....==.Y.YMMMMMY......,,,,MM',
      'MM....==.....Y...Y..Y...,,,,MM',
      'MM.R..==............YY.Y..R.MM',
      'MM.Y..=============...Y.....MM',
      'MM....=============......YY.MM',
      'MMY,,,,,,........==,,,,.MMMMMM',
      'MM.,,,,,,.YYY....==,,,,.MMMMMM',
      'MMY,,,,,,......Y.==,,,,.MMMMMM',
      'MM.........Y.....==.Y.R.MMMMMM',
      'MMMMMMMMMMMMMMMMM==MMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMM==MMMMMMMMMMM',
    ]),
    objects: [
      signAt(19, 41, { es: 'RUTA 20 · BOSQUE DE TURINGIA\nAbetos, colinas y carboneros. Al norte: los BREZALES.', fr: 'ROUTE 20 · FORÊT DE THURINGE\nSapins, collines et charbonniers. Au nord : les LANDES.' }),
      signAt(3, 27, { es: 'Al oeste, sobre la colina: el castillo de WARTBURG.', fr: 'À l\'ouest, sur la colline : le château de la WARTBURG.' }),
    ],
    conn: { down: { map: 'nuremberg', dx: 0 }, up: { map: 'ruta21', dx: 0 } },
    npcs: [
      talker('r20_carbonera', 'anciana', 24, 24, 'down', { es: 'Hago carbón para las herrerías de Núremberg. Con tantas armaduras negras, ¡este año no paro!', fr: 'Je fais du charbon pour les forges de Nuremberg. Avec toutes ces armures noires, cette année je n\'arrête pas !' }),
      trainer({ id: 'r20_bernd', look: 'lenador', x: 10, y: 35, dir: 'down', range: 1, foe: 'lenador', level: 60, name: 'Bernd',
        intro: { es: '¡Cuidado, que cae! ...Ah, no era un árbol. ¡Era un desafío!', fr: 'Attention, ça tombe ! ...Ah non, ce n\'était pas un arbre. C\'était un défi !' },
        lose: { es: 'El que ha caído soy yo.', fr: 'C\'est moi qui suis tombé.' },
        after: { es: 'Este bosque es tan espeso que a mediodía parece de noche.', fr: 'Cette forêt est si épaisse qu\'à midi on se croirait la nuit.' } }),
      trainer({ id: 'r20_gottfried', look: 'teuton', x: 8, y: 27, dir: 'down', range: 1, foe: 'teuton', level: 61, name: 'Gottfried',
        intro: { es: 'Soy caballero de la Orden Teutónica. Vuelvo de Prusia. ¡Prepárate!', fr: 'Je suis chevalier de l\'Ordre Teutonique. Je reviens de Prusse. Prépare-toi !' },
        lose: { es: 'Luchas como diez caballeros.', fr: 'Tu te bats comme dix chevaliers.' },
        after: { es: 'En LÜBECK hay muchos caballeros como yo. Allí embarcamos hacia el este.', fr: 'À LÜBECK, il y a beaucoup de chevaliers comme moi. C\'est là qu\'on embarque vers l\'est.' } }),
      trainer({ id: 'r20_karl', look: 'herrero', x: 15, y: 19, dir: 'down', range: 1, foe: 'lenador', title: { es: 'CARBONERO', fr: 'CHARBONNIER' }, level: 60, name: 'Karl',
        intro: { es: 'Tengo la cara negra de carbón... ¡y los puños duros!', fr: 'J\'ai le visage noir de charbon... et les poings durs !' },
        lose: { es: 'Ahora tengo la cara negra y morada.', fr: 'Maintenant, j\'ai le visage noir et violet.' },
        after: { es: 'Los hombres del barón compran todo mi carbón para sus herrerías.', fr: 'Les hommes du baron achètent tout mon charbon pour leurs forges.' } }),
      trainer({ id: 'r20_cuerva', look: 'cuerva', x: 6, y: 16, dir: 'right', range: 2, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 61,
        intro: { es: '¡Mira mi armadura negra! ¡Recién salida de Núremberg!', fr: 'Regarde mon armure noire ! Toute neuve, de Nuremberg !' },
        lose: { es: '¡Me la has rayado!', fr: 'Tu l\'as rayée !' },
        after: { es: 'LA CORNEJA zarpa pronto de Lübeck...', fr: 'LA CORNEILLE part bientôt de Lübeck...' } }),
      trainer({ id: 'r20_heinrich', look: 'caballero_al', x: 21, y: 5, dir: 'down', range: 1, foe: 'caballero', level: 62, name: 'Heinrich',
        intro: { es: 'Soy Heinrich, de Turingia. Ningún viajero pasa sin cruzar espadas conmigo.', fr: 'Je suis Heinrich, de Thuringe. Aucun voyageur ne passe sans croiser le fer avec moi.' },
        lose: { es: 'Pasa, pasa. Con honor.', fr: 'Passe, passe. Avec honneur.' },
        after: { es: 'Al norte empiezan los BREZALES DE LUNEBURGO. Todo se vuelve morado.', fr: 'Au nord commencent les LANDES DE LUNEBOURG. Tout devient violet.' } }),
      trainer({ id: 'r20_fraile', look: 'fraile', x: 14, y: 10, dir: 'down', range: 2, foe: 'fraile', level: 60, name: 'Martín',
        intro: { es: 'Tengo el presentimiento de que en ese castillo alguien traducirá un libro muy importante... ¡Pero antes, un combate!', fr: 'J\'ai le pressentiment que dans ce château, quelqu\'un traduira un livre très important... Mais d\'abord, un combat !' },
        lose: { es: 'Vuelvo a mis presentimientos.', fr: 'Je retourne à mes pressentiments.' },
        after: { es: 'Dentro de cien años... ya verás.', fr: 'Dans cent ans... tu verras.' } }),
    ],
    items: [
      { id: 'r20a', x: 3, y: 9, item: 'triaca', n: 2 },
      { id: 'r20b', x: 25, y: 32, item: 'elixir', n: 1 },
      { id: 'r20c', x: 26, y: 8, item: 'unguento', n: 3 },
    ],
  },

  // ── Ruta 21 · Brezales de Luneburgo (niveles 61-64) ──
  ruta21: {
    name: { es: 'RUTA 21 · BREZALES DE LUNEBURGO', fr: 'ROUTE 21 · LANDES DE LUNEBOURG' }, bg: 'brezal', theme: 'brezal',
    wild: [{ id: 'vibora', w: 25, lv: [61, 63] }, { id: 'jabali', w: 25, lv: [61, 63] }, { id: 'ciervo', w: 25, lv: [61, 63] }, { id: 'salteador', w: 25, lv: [61, 63] }],
    build: () => asciiMap([
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MM..C............C........................MM',
      'MM.,,,,,,...........Y..,,,,,,....C.....Y..MM',
      'MM.,,,,,,......C.......,,,,,,......C..C...MM',
      'MM.,,,,,,..............,,,,,,.............MM',
      'MM.,,,,,,.Y.........C..,,,,,,.............MM',
      'MM..Y.....................................MM',
      'MM.R....========================..C.========',
      'MM......========================.C..========',
      'MM...C..==.,,,,,,,,,..........==..C.==....MM',
      'MMC.Y.Y.==.,,,,,,,,,..........==..R.==....MM',
      'MM......==.,,,,,,,,,......C...==....==...CMM',
      'MM......==.,,,,,,,,,..........==....==....MM',
      'MM......==...............R....========....MM',
      'MM......================......=======.....MM',
      'MM..Y...================.............C....MM',
      'MM.,,,................==.........,,,,,,C..MM',
      'MM.,,,................==.,,,,,,,,,,,,,,...MM',
      'MM.,,,................==.,,,,,,,,,,,,,,...MM',
      'MM.............C......==.,,,,,,,,,,,,,,R..MM',
      'MM........C...........==.,,,,,,,,,,,,FFFFFMM',
      'MMC.........============.,,,,,,,,,,,,F...FMM',
      'MM....C.C...===========..,,,,,,,,.C..F...FMM',
      'MM.,,,,,,,..==.,,,,,,................FFFFFMM',
      'MM.,,,,,,,..==.,,,,,,...C..............C.CMM',
      'MM.,,,,,,,Y.==.,,,,,,C.C..................MM',
      'MM.,,,,,,,..==.,,,,,,.................C...MM',
      'MMMMMMMMMMMM==MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      'MMMMMMMMMMMM==MMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    ]),
    objects: [
      signAt(14, 27, { es: 'RUTA 21 · BREZALES DE LUNEBURGO\nBrezo, enebros y ovejas. Al este: LÜBECK y el mar.', fr: 'ROUTE 21 · LANDES DE LUNEBOURG\nBruyère, genévriers et moutons. À l\'est : LÜBECK et la mer.' }),
    ],
    conn: { down: { map: 'ruta20', dx: 0 }, right: { map: 'lubeck', dy: 5 } },
    npcs: [
      talker('r21_pastora', 'pastora', 36, 23, 'down', { es: 'Mis ovejas comen brezo todo el día. Tienen los cuernos retorcidos y la lana gris.', fr: 'Mes moutons mangent de la bruyère toute la journée. Ils ont les cornes tordues et la laine grise.' }),
      talker('r21_apicultor', 'anciano', 21, 6, 'down', { es: 'La miel de brezo es oscura y fuerte. ¡La mejor de todo el Imperio!', fr: 'Le miel de bruyère est sombre et corsé. Le meilleur de tout l\'Empire !' }),
      talker('r21_salinero', 'mercader', 33, 10, 'down', { es: 'Llevo SAL de Luneburgo a Lübeck. Desde allí viaja por todos los mares del norte.', fr: 'Je porte du SEL de Lunebourg à Lübeck. De là, il voyage sur toutes les mers du nord.' }),
      trainer({ id: 'r21_fritz', look: 'pastor', x: 14, y: 21, dir: 'down', range: 1, foe: 'pastor', level: 62, name: 'Fritz',
        intro: { es: '¡Con mi honda espanto lobos! ¿Y a ti?', fr: 'Avec ma fronde, je fais fuir les loups ! Et toi ?' },
        lose: { es: 'A ti no hay quien te espante.', fr: 'Toi, rien ne te fait peur.' },
        after: { es: 'Las VÍBORAS se esconden entre el brezo. ¡Mira dónde pisas!', fr: 'Les VIPÈRES se cachent dans la bruyère. Regarde où tu marches !' } }),
      trainer({ id: 'r21_otto', look: 'teuton', x: 24, y: 18, dir: 'left', range: 1, foe: 'teuton', level: 63, name: 'Otto',
        intro: { es: 'Voy a Lübeck a embarcar hacia Prusia. ¡Un último combate en tierra!', fr: 'Je vais à Lübeck pour embarquer vers la Prusse. Un dernier combat sur la terre ferme !' },
        lose: { es: 'Mejor me voy a Prusia.', fr: 'Je ferais mieux de partir en Prusse.' },
        after: { es: 'En el puerto de Lübeck hay un barco de velas negras. Nadie sabe de quién es.', fr: 'Au port de Lübeck, il y a un navire aux voiles noires. Personne ne sait à qui il est.' } }),
      trainer({ id: 'r21_cuervo', look: 'cuervo', x: 6, y: 13, dir: 'right', range: 2, foe: 'cuervo', level: 62,
        intro: { es: '¡Vigilo el camino de la sal! ¡Nadie llega a Lübeck!', fr: 'Je surveille la route du sel ! Personne n\'arrive à Lübeck !' },
        lose: { es: 'Bueno... alguien sí llega.', fr: 'Bon... quelqu\'un arrive quand même.' },
        after: { es: '...', fr: '...' } }),
      trainer({ id: 'r21_mechthild', look: 'dama_al', x: 20, y: 7, dir: 'down', range: 1, foe: 'caballero', title: { es: 'CABALLERA', fr: 'CHEVALIÈRE' }, level: 63, name: 'Mechthild',
        intro: { es: 'Protejo a los viajeros de este brezal. ¡Demuéstrame que no eres un bandido!', fr: 'Je protège les voyageurs de cette lande. Prouve-moi que tu n\'es pas un bandit !' },
        lose: { es: 'Está claro que no lo eres.', fr: 'C\'est clair, tu n\'en es pas un.' },
        after: { es: 'Buen viaje hasta Lübeck.', fr: 'Bon voyage jusqu\'à Lübeck.' } }),
      trainer({ id: 'r21_cuerva', look: 'cuerva', x: 38, y: 12, dir: 'left', range: 1, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 64,
        intro: { es: '¡El barón zarpa mañana! ¡No llegarás a tiempo!', fr: 'Le baron lève l\'ancre demain ! Tu n\'arriveras pas à temps !' },
        lose: { es: '¡Corre, si quieres alcanzarlo!', fr: 'Cours, si tu veux le rattraper !' },
        after: { es: 'El barco del barón se llama LA CORNEJA.', fr: 'Le navire du baron s\'appelle LA CORNEILLE.' } }),
      trainer({ id: 'r21_hanseata', look: 'hanseata', x: 32, y: 13, dir: 'left', range: 1, foe: 'mercader', title: { es: 'MERCADER', fr: 'MARCHAND' }, level: 62, name: 'Lambert',
        intro: { es: 'Soy mercader de la HANSA. ¡Hasta los mercaderes sabemos defendernos!', fr: 'Je suis marchand de la HANSE. Même les marchands savent se défendre !' },
        lose: { es: 'Mejor me dedico a vender.', fr: 'Je ferais mieux de vendre.' },
        after: { es: 'La HANSA une más de cien ciudades: Lübeck, Hamburgo, Brujas, Londres...', fr: 'La HANSE unit plus de cent villes : Lübeck, Hambourg, Bruges, Londres...' } }),
    ],
    items: [
      { id: 'r21a', x: 4, y: 4, item: 'elixir', n: 1 },
      { id: 'r21b', x: 16, y: 25, item: 'triaca', n: 2 },
      { id: 'r21c', x: 40, y: 16, item: 'unguento', n: 3 },
    ],
  },

  // ── Lübeck: la reina de la Hansa ──
  lubeck: {
    name: { es: 'LÜBECK', fr: 'LÜBECK' }, bg: 'hansa', theme: 'hansa', edgeOk: true,
    build: () => asciiMap([
      '~~~WWWWWWWWWWWWWWWWWWWWWWWWWWW~~~~~~',
      '~~~WWWWWWWWWWWWWWWWWWWWWWWWWWW~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      'BBB########################DDD~~~~~~',
      'BBB########################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDDDDD~~~',
      '~~~W#######################DDDDDD~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~W#######################DDD~~~~~~',
      '~~~WWWWWWWWWWWWWWWWWWWWWWWWWWW~~~~~~',
      '~~~WWWWWWWWWWWWWWWWWWWWWWWWWWW~~~~~~',
    ]),
    objects: [
      innHouse(5, 3, { wall: BRICK, brick: true, roof: ['#5a6a78', '#465664', '#33424e'] }),
      { type: 'tower', x: 12, y: 2, w: 2, h: 6, o: { stone: STONE.rojo, spire: 36, roof: ['#7aa88a', '#5a8a6a', '#3a6a4a'] }, text: { es: 'La iglesia de SANTA MARÍA, toda de ladrillo. ¡Sus torres miden más de cien metros!', fr: 'L\'église SAINTE-MARIE, toute en brique. Ses tours mesurent plus de cent mètres !' } },
      { type: 'tower', x: 16, y: 2, w: 2, h: 6, o: { stone: STONE.rojo, spire: 36, roof: ['#7aa88a', '#5a8a6a', '#3a6a4a'] }, text: { es: 'Las torres gemelas de Santa María. Los marineros las ven desde el mar.', fr: 'Les tours jumelles de Sainte-Marie. Les marins les voient depuis la mer.' } },
      plainHouse(20, 3, { es: 'AYUNTAMIENTO DE LÜBECK. Aquí se reúnen las ciudades de la HANSA.', fr: 'HÔTEL DE VILLE DE LÜBECK. Les villes de la HANSE s\'y réunissent.' }, { wall: BRICK, brick: true, shield: true, roof: ['#5a6a78', '#465664', '#33424e'] }),
      plainHouse(5, 9, null, { wall: TIMBER_WALL, timber: true, frame: '#3a70c0' }),
      plainHouse(12, 10, { es: 'ALMACÉN DE SAL. Huele a mar.', fr: 'ENTREPÔT DE SEL. Ça sent la mer.' }, { wall: BRICK, brick: true }),
      plainHouse(19, 10, null, { wall: BRICK, brick: true, frame: '#3d8c58', roof: ['#5a6a78', '#465664', '#33424e'] }),
      shopHouse(5, 17, ['hogaza', 'unguento', 'triaca', 'lebkuchen', 'elixir'], { es: 'Arenque, pan y remedios para la travesía. ¡Todo lo que un marinero necesita!', fr: 'Hareng, pain et remèdes pour la traversée. Tout ce qu\'il faut à un marin !' }, { wall: BRICK, brick: true }),
      armoryHouse(5, 22, ['espada_larga', 'arnes_nuremberg'], { es: 'Acero de Núremberg, traído por el camino de la sal.', fr: 'Acier de Nuremberg, apporté par la route du sel.' }, { wall: BRICK, brick: true }),
      plainHouse(12, 22, null, { wall: BRICK, brick: true, frame: '#a0402e' }),
      plainHouse(19, 22, null, { wall: TIMBER_WALL, timber: true, frame: '#3d8c58' }),
      signAt(6, 15, { es: 'LÜBECK, reina de la HANSA\nPuerto del mar Báltico. Barcos a todo el norte.', fr: 'LÜBECK, reine de la HANSE\nPort de la mer Baltique. Navires vers tout le nord.' }),
      { type: 'barrel', x: 29, y: 9 },
      { type: 'barrel', x: 27, y: 15 },
      { type: 'barrel', x: 29, y: 27 },
      { type: 'ship', x: 30, y: 4, w: 4, h: 2, o: { color: '#f4ecd8', mark: '#c23a3a', flag: '#c23a3a' }, text: { es: 'La SANTA GERTRUDIS, una coca de la Hansa con rumbo a LONDRES.', fr: 'La SAINTE-GERTRUDE, une cogue de la Hanse en route pour LONDRES.' } },
      { type: 'ship', x: 33, y: 20, w: 3, h: 2, o: { color: '#3a3440', mark: '#c23a3a', flag: '#1a161e' } },
      { type: 'plank', x: 32, y: 22, side: 'right', door: 0, enter: { map: 'kogge', x: 2, y: 7, dir: 'right' },
        locked: () => !(S0().flags.tr_lu_g1 && S0().flags.tr_lu_g2), lockedText: { es: 'Dos mercenarios del Cuervo vigilan la pasarela de LA CORNEJA.', fr: 'Deux mercenaires du Corbeau gardent la passerelle de LA CORNEILLE.' } },
    ],
    conn: { left: { map: 'ruta21', dy: -5 } },
    npcs: [
      { id: 'lu_burgo', look: 'burgomaestre', x: 24, y: 8, dir: 'down', talk: W => scriptBurgomaestre(W) },
      { id: 'lu_capitan', look: 'hanseata', x: 29, y: 6, dir: 'right', talk: W => scriptCapitanLondres(W) },
      talker('lu_hanseata', 'hanseata', 14, 15, 'down', { es: 'La HANSA une más de cien ciudades. Nuestras cocas llevan sal, arenque, paño y ámbar.', fr: 'La HANSE unit plus de cent villes. Nos cogues transportent du sel, du hareng, du drap et de l\'ambre.' }),
      talker('lu_pescadera', 'hanseata_f', 20, 15, 'down', { es: '¡Arenque! ¡Arenque fresco! ¡Arenque salado! ¡Arenque ahumado!', fr: 'Hareng ! Hareng frais ! Hareng salé ! Hareng fumé !' }),
      talker('lu_nina', 'nina', 10, 19, 'down', { es: 'He visto hombres de negro subir cajas muy pesadas a LA CORNEJA, el barco de velas negras.', fr: 'J\'ai vu des hommes en noir monter des caisses très lourdes sur LA CORNEILLE, le navire aux voiles noires.' }, { wander: 2 }),
      talker('lu_teuton', 'teuton', 24, 26, 'left', { es: 'Espero un barco hacia Prusia. Mientras tanto, rezo en Santa María.', fr: 'J\'attends un navire pour la Prusse. En attendant, je prie à Sainte-Marie.' }),
      trainer({ id: 'lu_g1', look: 'cuervo', x: 28, y: 18, dir: 'down', range: 3, foe: 'cuervo', level: 64,
        intro: { es: '¡Nadie sube a LA CORNEJA sin permiso del barón!', fr: 'Personne ne monte sur LA CORNEILLE sans la permission du baron !' },
        lose: { es: '¡Mi compañera te parará!', fr: 'Ma camarade va t\'arrêter !' }, after: { es: '...', fr: '...' } }),
      trainer({ id: 'lu_g2', look: 'cuerva', x: 28, y: 25, dir: 'up', range: 3, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 65,
        intro: { es: 'El barón zarpa al amanecer. ¡No lo estropearás!', fr: 'Le baron part à l\'aube. Tu ne gâcheras pas tout !' },
        lose: { es: 'La pasarela... está libre...', fr: 'La passerelle... est libre...' }, after: { es: '...', fr: '...' } }),
    ],
    triggers: [
      { x: 4, y: 13, cond: () => !S0().flags.rivalLubeck, run: W => scriptRivalLubeck(W) },
      { x: 4, y: 14, cond: () => !S0().flags.rivalLubeck, run: W => scriptRivalLubeck(W) },
    ],
  },

  // ── LA CORNEJA: la coca del Cuervo ──
  kogge: {
    name: { es: 'LA CORNEJA', fr: 'LA CORNEILLE' }, bg: 'barco', theme: 'madera', edgeOk: true,
    build: () => asciiMap([
      '~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~KKKKKKKKKKKKKKKKKKKK~~',
      '~~KDDXXDDDDDDDDDDDDXDK~~',
      '~~KDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDDDDDDDDDDDDDDDDDK~~',
      'DDDDDDDDDDDDDDDDDDDDDK~~',
      'DDDDDDDDDDDDDDDDDDDDDK~~',
      '~~KDDDDDDDDDDDDDDXXDDK~~',
      '~~KKKKKKKKKKKKKKKKKKKK~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~~~~~',
    ]),
    objects: [
      { type: 'banner', x: 9, y: 3, h: 2, o: { color: '#3a3440', mark: '#c23a3a' } },
      { type: 'banner', x: 14, y: 3, h: 2, o: { color: '#3a3440', mark: '#c23a3a' } },
      { type: 'barrel', x: 4, y: 8 },
      { type: 'barrel', x: 20, y: 6 },
    ],
    exits: [{ x: 0, y: 6, dir: 'left', to: { map: 'lubeck', x: 31, y: 22, dir: 'left' } }, { x: 0, y: 7, dir: 'left', to: { map: 'lubeck', x: 31, y: 22, dir: 'left' } }],
    npcs: [
      trainer({ id: 'ko_c1', look: 'cuerva', x: 7, y: 4, dir: 'down', range: 3, foe: 'cuervo', title: { es: 'MERCENARIA', fr: 'MERCENAIRE' }, level: 64,
        intro: { es: '¡Abordaje! ¡A las armas!', fr: 'Abordage ! Aux armes !' }, lose: { es: '¡Al agua!', fr: 'À l\'eau !' }, after: { es: '...', fr: '...' } }),
      trainer({ id: 'ko_c2', look: 'cuervo', x: 11, y: 8, dir: 'up', range: 3, foe: 'cuervo', level: 65,
        intro: { es: '¡Las armaduras negras son del barón! ¡Fuera de aquí!', fr: 'Les armures noires sont au baron ! Hors d\'ici !' }, lose: { es: 'Corvino... ¡te toca!', fr: 'Corvino... à toi !' }, after: { es: '...', fr: '...' } }),
      { id: 'corvino2', look: 'corvino', x: 16, y: 6, dir: 'left', cond: () => !S0().flags.corvino2Done, talk: W => scriptCorvinoLubeck(W) },
      { id: 'baron', look: 'baron', x: 19, y: 6, dir: 'left', cond: () => !S0().flags.baronDone, talk: W => (S0().flags.corvino2Done ? scriptBaron(W) : scriptCorvinoLubeck(W)) },
    ],
  },
});

// ─── Guiones del capítulo II ──────────────────────────────────────────────
async function scriptBarqueroVenecia(W) {
  if (!W.flag('finCapitulo1')) {
    await W.say({ es: 'BARQUERO: Llevo viajeros a tierra firme, al pie de los DOLOMITAS. Pero antes el DUX quiere hablar contigo. Su palacio está al este.', fr: 'PASSEUR : J\'emmène les voyageurs sur la terre ferme, au pied des DOLOMITES. Mais d\'abord, le DOGE veut te parler. Son palais est à l\'est.' });
    return;
  }
  const r = await W.ask({ es: 'BARQUERO: ¿Cruzamos la laguna? Desde tierra firme sale el camino de los DOLOMITAS hacia ALEMANIA.', fr: 'PASSEUR : On traverse la lagune ? De la terre ferme part la route des DOLOMITES vers l\'ALLEMAGNE.' }, [t('yes'), t('no')]);
  if (r === 0) await W.sail(DOLOMITAS_ARRIVAL, { es: 'Rumbo a TIERRA FIRME', fr: 'Cap sur la TERRE FERME' });
}
async function scriptBarqueroDolomitas(W) {
  const r = await W.ask({ es: 'BARQUERO: ¿Volvemos a VENECIA?', fr: 'PASSEUR : On retourne à VENISE ?' }, [t('yes'), t('no')]);
  if (r === 0) await W.sail({ map: 'venecia', x: 15, y: 2, dir: 'down' }, { es: 'Rumbo a VENECIA', fr: 'Cap sur VENISE' });
}

// ─── Misión especial: la batalla silenciosa de Ibrahim, el sabio de Fez ──
async function scriptSabioFez(W) {
  if (W.flag('ajedrezGanado')) {
    await W.say({ es: 'IBRAHIM: La calma también es una armadura. Que la TORRE INEXPUGNABLE te proteja, {name}.', fr: 'IBRAHIM : Le calme aussi est une armure. Que la TOUR IMPRENABLE te protège, {name}.' });
    return;
  }
  if (W.flag('ajedrezCerrado') || W.flag('ajedrezIntentado')) {
    W.flag('ajedrezCerrado', true);
    await W.say({ es: 'IBRAHIM: Una batalla silenciosa solo se juega una vez. Pero siempre puedes sentarte a mirar las montañas conmigo.', fr: 'IBRAHIM : Une bataille silencieuse ne se joue qu\'une fois. Mais tu peux toujours t\'asseoir avec moi pour regarder les montagnes.' });
    return;
  }
  if (!W.flag('ajedrezVisto')) {
    W.flag('ajedrezVisto', true);
    await W.say({ es: 'IBRAHIM: As-salamu alaykum, viajer{o}. Soy Ibrahim al-Fasi, librero de FEZ. Llevo papel y manuscritos a los mercados de Alemania.', fr: 'IBRAHIM : As-salamu alaykum, mon ami{e}. Je suis Ibrahim al-Fasi, libraire de FÈS. J\'apporte du papier et des manuscrits aux marchés d\'Allemagne.' });
    await W.say({ es: 'IBRAHIM: Tu camino está lleno de gritos y espadas. ¿Me concedes un momento de calma... y una batalla silenciosa?', fr: 'IBRAHIM : Ton chemin est plein de cris et d\'épées. M\'accordes-tu un moment de calme... et une bataille silencieuse ?' });
  } else {
    await W.say({ es: 'IBRAHIM: Has vuelto. ¿Te apetece ahora esa batalla silenciosa?', fr: 'IBRAHIM : Te revoilà. As-tu envie, maintenant, de cette bataille silencieuse ?' });
  }
  const r = await W.ask({ es: '¿Aceptas la batalla silenciosa de Ibrahim?', fr: 'Acceptes-tu la bataille silencieuse d\'Ibrahim ?' }, [t('yes'), t('no')]);
  if (r !== 0) { await W.say({ es: 'IBRAHIM: Sin prisa. La paciencia es la reina de las virtudes. Aquí estaré.', fr: 'IBRAHIM : Rien ne presse. La patience est la reine des vertus. Je serai là.' }); return; }
  await W.say({ es: 'IBRAHIM: Es un problema de AJEDREZ. Juegas con BLANCAS y tienes que dar JAQUE MATE en 4 JUGADAS.', fr: 'IBRAHIM : C\'est un problème d\'ÉCHECS. Tu joues les BLANCS et tu dois faire ÉCHEC ET MAT en 4 COUPS.' });
  await W.say({ es: 'IBRAHIM: Tendrás 20 SEGUNDOS. El reloj de arena solo corre cuando te toca mover a ti.', fr: 'IBRAHIM : Tu auras 20 SECONDES. Le sablier ne s\'écoule que lorsque c\'est à toi de jouer.' });
  await W.say({ es: 'IBRAHIM: Toca una pieza y después la casilla adonde va. También puedes usar la cruceta y el botón A.', fr: 'IBRAHIM : Touche une pièce, puis la case où elle va. Tu peux aussi utiliser la croix et le bouton A.' });
  await W.say({ es: 'IBRAHIM: Un detalle: hoy, en 1415, nuestra alferza solo da un pasito en diagonal. Pero sueño con una DAMA que cruzará el tablero entero... Jugaremos así, con las reglas del futuro.', fr: 'IBRAHIM : Un détail : aujourd\'hui, en 1415, notre vizir ne fait qu\'un petit pas en diagonale. Mais je rêve d\'une DAME qui traversera tout l\'échiquier... Nous jouerons ainsi, avec les règles du futur.' });
  await W.say({ es: 'IBRAHIM: Y escucha bien: SOLO TENDRÁS UNA OPORTUNIDAD. Si fallas, el tablero se guardará para siempre.', fr: 'IBRAHIM : Et écoute bien : TU N\'AURAS QU\'UNE SEULE CHANCE. Si tu échoues, l\'échiquier sera rangé pour toujours.' });
  const go = await W.ask({ es: '¿Empezamos?', fr: 'On commence ?' }, [{ es: '¡EMPEZAMOS!', fr: 'ON COMMENCE !' }, { es: 'TODAVÍA NO', fr: 'PAS ENCORE' }].map(tr));
  if (go !== 0) { await W.say({ es: 'IBRAHIM: Tómate tu tiempo. El tablero te esperará.', fr: 'IBRAHIM : Prends ton temps. L\'échiquier t\'attendra.' }); return; }
  W.flag('ajedrezIntentado', true);
  Game.save();
  const res = await playChessPuzzle(W);
  if (res === 'win') {
    W.flag('ajedrezGanado', true);
    await W.say({ es: 'IBRAHIM: ¡Jaque mate! El caballo ha ahogado al rey dentro de su propio castillo.', fr: 'IBRAHIM : Échec et mat ! Le cavalier a étouffé le roi dans son propre château.' });
    await W.say({ es: 'IBRAHIM: Dicen que dentro de ochenta años un castellano llamado LUCENA escribirá este mismo mate en un libro... ¡y tú ya lo conoces!', fr: 'IBRAHIM : On dit que dans quatre-vingts ans, un Castillan nommé LUCENA écrira ce même mat dans un livre... et toi, tu le connais déjà !' });
    W.heal();
    Sfx.play('heal');
    await W.say({ es: '¡Los PV de {name} se recuperan por completo!', fr: 'Les PV de {name} sont entièrement restaurés !' }, { color: 'blue' });
    await W.say({ es: 'IBRAHIM: Toma la ARMADURA DE LA TORRE INEXPUGNABLE. La forjaron en Fez para un visir que jamás perdió una partida.', fr: 'IBRAHIM : Prends l\'ARMURE DE LA TOUR IMPRENABLE. On l\'a forgée à Fès pour un vizir qui n\'a jamais perdu une partie.' });
    W.giveEquip('torre', true);
    Sfx.play('item');
    await W.say({ es: '¡{name} se pone la ARMADURA DE LA TORRE INEXPUGNABLE! DEFENSA +40', fr: '{name} revêt l\'ARMURE DE LA TOUR IMPRENABLE ! DÉFENSE +40' }, { color: 'blue' });
    Game.save();
    return;
  }
  if (res === 'time') await W.say({ es: 'IBRAHIM: El reloj de arena se ha vaciado...', fr: 'IBRAHIM : Le sablier s\'est vidé...' });
  else await W.say({ es: 'IBRAHIM: Ah... Con esa jugada, mi rey encuentra una salida.', fr: 'IBRAHIM : Ah... Avec ce coup, mon roi trouve une issue.' });
  await W.say({ es: 'IBRAHIM: No te apenes: perder con calma también enseña. Pero una batalla silenciosa solo se juega una vez.', fr: 'IBRAHIM : Ne sois pas triste : perdre avec calme, ça aussi, ça enseigne. Mais une bataille silencieuse ne se joue qu\'une fois.' });
  await closeSpecialQuest(W, 'ajedrezCerrado');
}

async function scriptRivalNuremberg(W) {
  W.flag('rivalNuremberg', true);
  const p = W.player;
  const r = W.spawn({ id: 'rival_nu', look: rivalLook(), x: p.x, y: 25, dir: 'down' });
  W.bubble(r); Sfx.play('alert'); await W.wait(700); W.bubble(null);
  await W.say({ es: '{rival}: ¡{name}! ¡Por fin! He cruzado los Alpes siguiendo a Corvino.', fr: '{rival} : {name} ! Enfin ! J\'ai traversé les Alpes en suivant Corvino.' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: Pero antes... ¡quiero ver cuánto has crecido desde Venecia! ¡En guardia!', fr: '{rival} : Mais d\'abord... je veux voir combien tu as grandi depuis Venise ! En garde !' });
  const res = await W.battle({ foe: 'rival', level: 58, name: rivalName().toUpperCase(), look: rivalLook(), trainer: rivalName(), canLose: true, canFlee: false,
    defeatText: { es: '¡Otra vez! Eres imparable, {name}.', fr: 'Encore ! Tu es inarrêtable, {name}.' }, winText: { es: '¡Esta vez gano yo!', fr: 'Cette fois, c\'est moi qui gagne !' } });
  if (res !== 'win') healPlayer();
  await W.say({ es: '{rival}: Corvino pasó por aquí con carros llenos de ARMADURAS NEGRAS. Trabaja para un tal BARÓN DE RABENSTEIN.', fr: '{rival} : Corvino est passé par ici avec des chariots pleins d\'ARMURES NOIRES. Il travaille pour un certain BARON DE RABENSTEIN.' });
  await W.say({ es: '{rival}: Iban hacia el norte, a LÜBECK, el gran puerto de la HANSA. Pero la puerta norte solo se abre a quien venza a Meister KONRAD.', fr: '{rival} : Ils allaient vers le nord, à LÜBECK, le grand port de la HANSE. Mais la porte nord ne s\'ouvre qu\'à qui bat Meister KONRAD.' });
  await W.say({ es: '{rival}: Yo me adelanto a Lübeck. ¡Nos vemos en el puerto!', fr: '{rival} : Je pars devant à Lübeck. On se retrouve au port !' });
  await W.walk(r, 'up', 2);
  await W.fadeNpc(r);
  Game.save();
}

async function scriptKonrad(W) {
  if (W.flag('blason_nuremberg')) {
    await W.say({ es: 'KONRAD: La puerta norte está abierta. Busca a ese barón en LÜBECK... y no bajes nunca la guardia.', fr: 'KONRAD : La porte nord est ouverte. Cherche ce baron à LÜBECK... et ne baisse jamais ta garde.' });
    return;
  }
  await W.say({ es: 'KONRAD: Willkommen! Soy Konrad, maestro armero de Núremberg. En mi coliseo se lucha con ARMADURA y ESPADA LARGA.', fr: 'KONRAD : Willkommen ! Je suis Konrad, maître armurier de Nuremberg. Dans mon colisée, on se bat en ARMURE et à l\'ÉPÉE LONGUE.' });
  await W.say({ es: 'KONRAD: Mi escuela sigue al gran maestro LIECHTENAUER: la MEDIA ESPADA y el GOLPE MAESTRO. ¡Veamos si tu acero aguanta el mío!', fr: 'KONRAD : Mon école suit le grand maître LIECHTENAUER : la DEMI-ÉPÉE et le COUP DE MAÎTRE. Voyons si ton acier résiste au mien !' });
  const res = await W.battle({ foe: 'konrad', level: 60, look: 'konrad', trainer: { es: 'MEISTER KONRAD', fr: 'MEISTER KONRAD' }, canLose: false, canFlee: false,
    defeatText: { es: 'Wunderbar! Hacía años que nadie atravesaba mi guardia.', fr: 'Wunderbar ! Ça faisait des années que personne ne perçait ma garde.' }, winText: { es: 'Tu armadura tiene grietas. Vuelve cuando la hayas templado.', fr: 'Ton armure a des fissures. Reviens quand tu l\'auras trempée.' } });
  if (res !== 'win') return;
  await W.say({ es: 'KONRAD: Has luchado como un maestro. El blasón del águila negra es tuyo.', fr: 'KONRAD : Tu t\'es battu{e} comme un maître. Le blason à l\'aigle noir est à toi.' });
  await W.blason('nuremberg', CRESTS[4][3]);
  await W.receive('elixir', 2);
  W.flag('nurembergOpen', true);
  await W.say({ es: 'KONRAD: Te contaré algo. Hace un mes un noble me encargó cincuenta ARMADURAS NEGRAS. Se hacía llamar BARÓN DE RABENSTEIN.', fr: 'KONRAD : Je vais te dire une chose. Il y a un mois, un noble m\'a commandé cinquante ARMURES NOIRES. Il se faisait appeler BARON DE RABENSTEIN.' });
  await W.say({ es: 'KONRAD: Rabenstein... «la piedra del cuervo». Pagó con oro de Venecia y se lo llevó todo a LÜBECK. ¡Ve tras él!', fr: 'KONRAD : Rabenstein... « la pierre du corbeau ». Il a payé avec de l\'or de Venise et il a tout emporté à LÜBECK. Va le rattraper !' });
  Game.save();
}

async function scriptRivalLubeck(W) {
  W.flag('rivalLubeck', true);
  const p = W.player;
  const r = W.spawn({ id: 'rival_lu', look: rivalLook(), x: 8, y: p.y, dir: 'left' });
  W.bubble(r); Sfx.play('alert'); await W.wait(700); W.bubble(null);
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: ¡{name}! ¿Ves ese barco de velas negras en el puerto? Es LA CORNEJA, el barco del Cuervo.', fr: '{rival} : {name} ! Tu vois ce navire aux voiles noires dans le port ? C\'est LA CORNEILLE, le navire du Corbeau.' });
  await W.say({ es: '{rival}: Corvino y el BARÓN están a bordo. Dos mercenarios vigilan la pasarela. Descansa en la POSADA antes de subir.', fr: '{rival} : Corvino et le BARON sont à bord. Deux mercenaires gardent la passerelle. Repose-toi à l\'AUBERGE avant de monter.' });
  await W.say({ es: '{rival}: Yo voy a avisar al BURGOMAESTRE. ¡Suerte!', fr: '{rival} : Je vais prévenir le BOURGMESTRE. Bonne chance !' });
  await W.walk(r, 'right', 2);
  await W.fadeNpc(r);
  Game.save();
}

async function scriptCorvinoLubeck(W) {
  const c = W.npc('corvino2');
  if (!c || W.flag('corvino2Done')) return;
  W.faceEachOther(c, W.player);
  await W.say({ es: 'CORVINO: ¡Otra vez tú! ¿Es que no vas a dejarme en paz nunca?', fr: 'CORVINO : Encore toi ! Tu ne vas jamais me laisser tranquille ?' });
  await W.say({ es: 'CORVINO: Esta vez llevo una ARMADURA NEGRA de Núremberg. ¡Veremos quién ríe el último!', fr: 'CORVINO : Cette fois, je porte une ARMURE NOIRE de Nuremberg. On verra bien qui rira le dernier !' });
  const res = await W.battle({ foe: 'corvino', level: 64, look: 'corvino', trainer: { es: 'CORVINO, CAPITÁN DEL CUERVO', fr: 'CORVINO, CAPITAINE DU CORBEAU' }, canLose: false, canFlee: false, bg: 'barco',
    defeatText: { es: '¡Otra vez no! ¡Mi armadura nueva!', fr: 'Pas encore ! Mon armure toute neuve !' }, winText: { es: '¡Ja! ¡La venganza es dulce!', fr: 'Ha ! La vengeance est douce !' } });
  if (res !== 'win') return;
  await W.say({ es: 'CORVINO: ¡No puede ser! ¡Barón! ¡BARÓN, AYÚDAME!', fr: 'CORVINO : Ce n\'est pas possible ! Baron ! BARON, AIDE-MOI !' });
  Sfx.play('door');
  await W.fadeNpc(c);
  W.flag('corvino2Done', true);
  await W.say({ es: 'Corvino se esconde en la bodega del barco...', fr: 'Corvino se cache dans la cale du navire...' }, { color: 'blue' });
  const b = W.npc('baron');
  if (b) b.dir = W.dirTo(b, W.player);
  await W.say({ es: 'BARÓN: ¡Corvino, inútil! ...Así que tú eres {el} {esc} de Villaolivo. Ve a curarte si quieres: te espero en la proa.', fr: 'BARON : Corvino, incapable ! ...C\'est donc toi, l\'{esc} de Villaolivo. Va te soigner si tu veux : je t\'attends à la proue.' });
  Game.save();
}

async function scriptBaron(W) {
  const b = W.npc('baron');
  if (!b || W.flag('baronDone')) return;
  W.faceEachOther(b, W.player);
  await W.say({ es: 'BARÓN: Así que tú eres {el} {esc} que estropeó mis planes en Venecia. Soy el BARÓN DE RABENSTEIN: el verdadero jefe del CUERVO.', fr: 'BARON : C\'est donc toi, l\'{esc} qui a ruiné mes plans à Venise. Je suis le BARON DE RABENSTEIN : le vrai chef du CORBEAU.' });
  await W.say({ es: 'BARÓN: Con la tregua, los señores de la guerra como yo nos morimos de hambre. ¡Sin los Seis Sellos, la guerra volverá... y con ella, mi oro!', fr: 'BARON : Avec la trêve, les seigneurs de guerre comme moi meurent de faim. Sans les Six Sceaux, la guerre reviendra... et avec elle, mon or !' });
  const res = await W.battle({ foe: 'baron', level: 66, look: 'baron', trainer: { es: 'BARÓN DE RABENSTEIN', fr: 'BARON DE RABENSTEIN' }, canLose: false, canFlee: false, bg: 'barco',
    defeatText: { es: 'Impresionante... Me has vencido... por ahora.', fr: 'Impressionnant... Tu m\'as vaincu... pour l\'instant.' }, winText: { es: 'Los cuervos siempre vuelven.', fr: 'Les corbeaux reviennent toujours.' } });
  if (res !== 'win') return;
  await W.say({ es: 'BARÓN: Quédate con los sellos de ITALIA y del IMPERIO. ¡Los de INGLATERRA y FRANCIA ya navegan hacia LONDRES!', fr: 'BARON : Garde les sceaux d\'ITALIE et de l\'EMPIRE. Ceux d\'ANGLETERRE et de FRANCE voguent déjà vers LONDRES !' });
  await W.say({ es: 'BARÓN: Nos veremos al otro lado del mar. Lebewohl!', fr: 'BARON : Nous nous reverrons de l\'autre côté de la mer. Lebewohl !' });
  Sfx.play('door');
  await W.fadeNpc(b);
  W.flag('baronDone', true);
  await W.say({ es: 'El Barón salta a una barca y rema hacia un barco que zarpa hacia el oeste...', fr: 'Le baron saute dans une barque et rame vers un navire qui part vers l\'ouest...' }, { color: 'blue' });
  Sfx.play('win');
  W.flag('sellosLubeck', true);
  await W.say({ es: '¡{name} recupera el SELLO DE ITALIA y el SELLO DEL IMPERIO!', fr: '{name} récupère le SCEAU D\'ITALIE et le SCEAU DE L\'EMPIRE !' }, { color: 'blue' });
  const p = W.player;
  const r = W.spawn({ id: 'rival_ko', look: rivalLook(), x: 2, y: 7, dir: 'right' });
  await W.walkNextTo(r, p);
  W.faceEachOther(r, p);
  await W.say({ es: '{rival}: ¡{name}! ¡Lo has conseguido! Ya tenemos cuatro de los seis sellos.', fr: '{rival} : {name} ! Tu as réussi ! Nous avons déjà quatre des six sceaux.' });
  await W.say({ es: '{rival}: El BURGOMAESTRE nos espera delante del AYUNTAMIENTO. ¡Vamos!', fr: '{rival} : Le BOURGMESTRE nous attend devant l\'HÔTEL DE VILLE. Allons-y !' });
  await W.fadeNpc(r);
  Game.save();
}

async function scriptBurgomaestre(W) {
  if (!W.flag('baronDone')) {
    await W.say({ es: 'BURGOMAESTRE: Bienvenid{o} a Lübeck, reina de la HANSA. Ese barco de velas negras me da muy mala espina...', fr: 'BOURGMESTRE : Bienvenue à Lübeck, reine de la HANSE. Ce navire aux voiles noires ne me dit rien qui vaille...' });
    return;
  }
  if (W.flag('finCapitulo2')) {
    await W.say({ es: 'BURGOMAESTRE: Lübeck te debe mucho, {name}. Cuando los vientos lo permitan, un barco de la Hansa te llevará a LONDRES.', fr: 'BOURGMESTRE : Lübeck te doit beaucoup, {name}. Quand les vents le permettront, un navire de la Hanse t\'emmènera à LONDRES.' });
    return;
  }
  W.flag('finCapitulo2', true);
  await W.say({ es: 'BURGOMAESTRE: ¡Has expulsado al Cuervo de nuestro puerto y has recuperado dos sellos! La HANSA nunca olvida a sus amigos.', fr: 'BOURGMESTRE : Tu as chassé le Corbeau de notre port et récupéré deux sceaux ! La HANSE n\'oublie jamais ses amis.' });
  await W.gold(5000);
  await W.receive('elixir', 3);
  await W.say({ es: 'BURGOMAESTRE: Enviaré los sellos de Italia y del Imperio a sus señores. El Barón ha huido a INGLATERRA con los dos últimos...', fr: 'BOURGMESTRE : J\'enverrai les sceaux d\'Italie et de l\'Empire à leurs seigneurs. Le baron s\'est enfui en ANGLETERRE avec les deux derniers...' });
  await W.say({ es: 'BURGOMAESTRE: Nuestros barcos comercian con LONDRES. Cuando estés list{o}, uno de ellos te llevará.', fr: 'BOURGMESTRE : Nos navires commercent avec LONDRES. Quand tu seras prêt{e}, l\'un d\'eux t\'emmènera.' });
  Sfx.play('win');
  await W.say({ es: '— FIN DEL CAPÍTULO II —', fr: '— FIN DU CHAPITRE II —' }, { color: 'blue' });
  await W.say({ es: '¡Gracias por jugar al prototipo de LAS SEIS CORONAS! El viaje a INGLATERRA llegará en la próxima versión. Puedes seguir entrenando y explorando.', fr: 'Merci d\'avoir joué au prototype des SIX COURONNES ! Le voyage en ANGLETERRE arrivera dans la prochaine version. Tu peux continuer à t\'entraîner et à explorer.' });
  Game.save();
}

async function scriptCapitanLondres(W) {
  if (!W.flag('finCapitulo2')) {
    await W.say({ es: 'CAPITÁN: La SANTA GERTRUDIS zarpa hacia LONDRES en cuanto cambie el viento. Llevamos paño, ámbar y arenque.', fr: 'CAPITAINE : La SAINTE-GERTRUDE part pour LONDRES dès que le vent tourne. Nous transportons du drap, de l\'ambre et du hareng.' });
    return;
  }
  await W.say({ es: 'CAPITÁN: ¡Así que tú eres quien ha echado al Cuervo! Te llevaré a LONDRES encantado... en cuanto el viento lo permita. (Próximamente)', fr: 'CAPITAINE : C\'est donc toi qui as chassé le Corbeau ! Je t\'emmènerai à LONDRES avec plaisir... dès que le vent le permettra. (Prochainement)' });
}
