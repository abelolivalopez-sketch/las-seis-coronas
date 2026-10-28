// ─── Mapas: Villaolivo y Ruta 1 ───────────────────────────────────────────
// Leyenda: . hierba · , matorral · = camino · s arena · * flores · ~ agua
//          T olivo (bloques de 2×2 en casillas pares) · C ciprés · F valla · R roca
function grid(w, h, f = '.') { return Array.from({ length: h }, () => Array(w).fill(f)); }
function fillG(g, x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i >= 0 && i < g[0].length) g[j][i] = c;
}
function putG(g, pts, c) { for (const [x, y] of pts) if (g[y] && g[y][x] !== undefined) g[y][x] = c; }
function tallG(g, x, y, w, h) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && g[j][i] === '.') g[j][i] = ',';
}

// Frases que se repiten
const L_ = {
  recoverAll: { es: '{name} recupera todos sus PV.', fr: '{name} récupère tous ses PV.' },
  noPermit: { es: 'Sin el permiso de Maese Esteban no puedes salir de la aldea.', fr: 'Sans la permission de Maître Esteban, tu ne peux pas quitter le village.' },
  firstChallenge: { es: 'La Ruta 1 está al norte de la aldea. El coliseo de Toledo es tu primer reto.', fr: 'La Route 1 est au nord du village. Le colisée de Tolède est ton premier défi.' },
};

const MAPS = {
  villaolivo: {
    name: 'VILLAOLIVO', bg: 'aldea',
    build() {
      const g = grid(26, 22);
      fillG(g, 0, 0, 26, 2, 'T'); fillG(g, 0, 20, 26, 2, 'T'); fillG(g, 0, 0, 2, 22, 'T'); fillG(g, 24, 0, 2, 22, 'T');
      fillG(g, 12, 0, 2, 8, '=');          // salida norte y camino
      fillG(g, 9, 8, 7, 5, '=');           // plaza
      fillG(g, 5, 7, 1, 2, '='); fillG(g, 5, 8, 4, 1, '=');       // casa de la vecina
      fillG(g, 19, 7, 1, 2, '='); fillG(g, 16, 8, 4, 1, '=');     // casa de Esteban
      fillG(g, 5, 17, 7, 1, '='); fillG(g, 11, 13, 1, 4, '=');    // tu casa
      // palestra con valla y arena
      fillG(g, 16, 9, 8, 1, 'F'); fillG(g, 16, 14, 8, 1, 'F'); fillG(g, 16, 9, 1, 6, 'F'); fillG(g, 23, 9, 1, 6, 'F');
      fillG(g, 17, 10, 6, 4, 's'); fillG(g, 16, 11, 1, 2, 's');
      putG(g, [[8, 4], [9, 4], [8, 5], [2, 9], [3, 9], [2, 10], [3, 10], [9, 15], [9, 16], [8, 15], [22, 17], [21, 18], [14, 15], [15, 15], [20, 2], [21, 2], [3, 18], [4, 18], [10, 3], [10, 4]], '*');
      putG(g, [[16, 3], [16, 4], [22, 3], [22, 4]], 'C');
      fillG(g, 16, 16, 2, 2, 'T'); fillG(g, 20, 16, 2, 2, 'T'); fillG(g, 18, 18, 2, 2, 'T');
      putG(g, [[13, 18]], 'R');
      return g;
    },
    objects: [
      { type: 'house', x: 3, y: 13, w: 5, h: 4, o: { door: 2, windows: [0, 3.6], frame: '#3a70c0', chimney: 4 },
        doorText: { es: 'Tu casa. Ahora no hay tiempo para descansar: ¡te esperan en la palestra!', fr: 'Ta maison. Pas le temps de te reposer : on t\'attend à la palestre !' } },
      { type: 'house', x: 3, y: 3, w: 5, h: 4, o: { door: 2, windows: [0, 3.6], frame: '#3d8c58', doorCol: ['#4f8a5a', '#3c6c46', '#244a2e'] },
        doorText: { es: 'La casa de la vecina. La puerta está cerrada.', fr: 'La maison de la voisine. La porte est fermée.' } },
      { type: 'house', x: 17, y: 3, w: 5, h: 4, o: { door: 2, windows: [0, 3.6], frame: '#a0402e', shield: true, roof: ['#dc7e58', '#b8583a', '#86381f'], plinth: '#3a70c0' },
        doorText: { es: 'La casa de Maese Esteban. Ahora está en la palestra.', fr: 'La maison de Maître Esteban. Il est à la palestre.' } },
      { type: 'well', x: 12, y: 10, text: { es: 'El pozo de la aldea. El agua sale fresquísima.', fr: 'Le puits du village. L\'eau y est bien fraîche.' } },
      { type: 'sign', x: 14, y: 4, text: { es: 'VILLAOLIVO\nAldea de olivares. Al norte: RUTA 1 y TOLEDO.', fr: 'VILLAOLIVO\nVillage d\'oliveraies. Au nord : ROUTE 1 et TOLÈDE.' } },
      { type: 'sign', x: 15, y: 13, text: { es: 'PALESTRA DE MAESE ESTEBAN\nMaestro de armas de Villaolivo.', fr: 'PALESTRE DE MAÎTRE ESTEBAN\nMaître d\'armes de Villaolivo.' } },
      { type: 'sign', x: 8, y: 16, text: { es: 'CASA DE {NAME}', fr: 'MAISON DE {NAME}' } },
      { type: 'dummy', x: 22, y: 11, text: { es: 'Un estafermo de entrenamiento. La madera está llena de cortes.', fr: 'Une quintaine d\'entraînement. Le bois est couvert d\'entailles.' } },
      { type: 'dummy', x: 22, y: 12, text: { es: 'Otro estafermo. Este tiene un escudo pintado de rojo.', fr: 'Une autre quintaine. Celle-ci porte un bouclier peint en rouge.' } },
      { type: 'barrel', x: 22, y: 7, text: { es: 'Huele a aceite de oliva.', fr: 'Ça sent l\'huile d\'olive.' } },
      { type: 'barrel', x: 23, y: 7, text: { es: 'Está lleno de aceitunas.', fr: 'Il est rempli d\'olives.' } },
    ],
    conn: { up: { map: 'ruta1', dx: -4 } },
    npcs: [
      { id: 'madre', look: () => motherLook(), x: 4, y: 17, dir: 'right', talk: async W => {
        await W.say({ es: '¡Descansa un poco, que te veo con mala cara!', fr: 'Repose-toi un peu, tu as une mine affreuse !' });
        W.heal();
        Sfx.play('heal');
        await W.say(L_.recoverAll);
        if (!W.flag('rivalDone')) await W.say({ es: 'Maese Esteban te espera en la palestra, al este de la plaza.', fr: 'Maître Esteban t\'attend à la palestre, à l\'est de la place.' });
        else await W.say({ es: 'Cuídate mucho por los caminos. ¡Y vuelve a casa siempre que lo necesites!', fr: 'Prends soin de toi sur les routes. Et reviens à la maison dès que tu en as besoin !' });
      } },
      { id: 'esteban', look: 'esteban', x: 18, y: 11, dir: 'left', talk: W => scriptEsteban(W) },
      { id: 'rival', look: () => rivalLook(), x: 21, y: 12, dir: 'right', cond: () => !S0().flags.rivalDone,
        text: { es: '¡Déjame, que estoy entrenando! Habla primero con mi padre.', fr: 'Laisse-moi, je m\'entraîne ! Parle d\'abord à mon père.' } },
      { id: 'guardia', look: 'guard', x: 11, y: 2, dir: 'right', talk: async W => {
        if (!W.flag('canLeave')) await W.say(L_.noPermit);
        else await W.say({ es: 'Buen viaje, {name}. En el matorral de la Ruta 1 hay jabalíes y lobos. ¡Ten cuidado!', fr: 'Bon voyage, {name}. Dans les broussailles de la Route 1, il y a des sangliers et des loups. Sois prudent{e} !' });
      } },
      { id: 'aldeana', look: 'aldeana', x: 8, y: 7, dir: 'down', text: { es: 'Dicen que en Toledo forjan las mejores espadas de los seis reinos.', fr: 'On dit qu\'à Tolède, on forge les meilleures épées des six royaumes.' } },
      { id: 'nino', look: 'nino', x: 10, y: 12, dir: 'down', wander: 2, text: { es: '¡De mayor quiero ser {esc} como tú y luchar en los coliseos!', fr: 'Quand je serai grand, je serai {esc} comme toi et je combattrai dans les colisées !' } },
      { id: 'labrador', look: 'labrador', x: 15, y: 17, dir: 'right', text: { es: 'Este año los olivos vienen cargados. El aceite de Villaolivo llega hasta Venecia.', fr: 'Cette année, les oliviers croulent sous les olives. L\'huile de Villaolivo arrive jusqu\'à Venise.' } },
    ],
    triggers: [
      { x: 12, y: 2, cond: () => !S0().flags.canLeave, run: W => scriptGuardStop(W) },
      { x: 13, y: 2, cond: () => !S0().flags.canLeave, run: W => scriptGuardStop(W) },
    ],
    items: [],
  },

  ruta1: {
    name: { es: 'RUTA 1', fr: 'ROUTE 1' }, bg: 'campo',
    wild: [{ id: 'jabali', w: 40, lv: [2, 4] }, { id: 'lobo', w: 30, lv: [2, 4] }, { id: 'salteador', w: 30, lv: [3, 5] }],
    build() {
      const g = grid(20, 40);
      fillG(g, 0, 0, 20, 2, 'T'); fillG(g, 0, 38, 20, 2, 'T'); fillG(g, 0, 0, 2, 40, 'T'); fillG(g, 18, 0, 2, 40, 'T');
      fillG(g, 8, 30, 2, 10, '=');
      fillG(g, 8, 30, 6, 2, '=');
      fillG(g, 12, 20, 2, 12, '=');
      fillG(g, 6, 20, 8, 2, '=');
      fillG(g, 6, 10, 2, 12, '=');
      fillG(g, 6, 10, 6, 2, '=');
      fillG(g, 10, 0, 2, 12, '=');
      fillG(g, 2, 22, 4, 4, '~');
      putG(g, [[2, 26], [3, 26], [4, 26], [5, 26], [2, 21], [3, 21], [4, 21], [5, 21]], '*');
      fillG(g, 14, 12, 4, 4, 'T'); fillG(g, 2, 2, 6, 2, 'T'); fillG(g, 14, 2, 4, 2, 'T'); fillG(g, 2, 28, 2, 2, 'T');
      fillG(g, 14, 36, 4, 2, 'T');
      tallG(g, 2, 31, 5, 6); tallG(g, 14, 30, 4, 6); tallG(g, 14, 22, 4, 7); tallG(g, 2, 12, 4, 8); tallG(g, 12, 4, 5, 6); tallG(g, 8, 12, 3, 3);
      putG(g, [[9, 25], [16, 17], [4, 8], [15, 19], [3, 10]], 'R');
      putG(g, [[10, 27], [11, 27], [16, 10], [17, 10], [8, 6], [9, 6], [4, 30], [5, 29]], '*');
      return g;
    },
    objects: [
      { type: 'sign', x: 10, y: 36, text: { es: 'RUTA 1\nVillaolivo – Toledo. Cuidado: en el matorral hay animales salvajes.', fr: 'ROUTE 1\nVillaolivo – Tolède. Attention : des bêtes sauvages rôdent dans les broussailles.' } },
      { type: 'sign', x: 9, y: 3, text: { es: 'Al norte: RUTA 2 · SIERRA MORENA y TOLEDO.', fr: 'Au nord : ROUTE 2 · SIERRA MORENA et TOLÈDE.' } },
    ],
    conn: { down: { map: 'villaolivo', dx: 4 }, up: { map: 'ruta2', dx: 2 } },
    npcs: [
      { id: 'viajera', look: 'viajera', x: 7, y: 24, dir: 'left', text: { es: 'Si mantienes pulsado B mientras caminas, correrás. ¡Viene genial en los caminos largos!', fr: 'Si tu maintiens B en marchant, tu cours. Très pratique sur les longues routes !' } },
      { id: 'cazador', look: 'cazador', x: 14, y: 29, dir: 'left', talk: async W => {
        await W.say({ es: 'Cada combate que ganas te da experiencia. Al subir de nivel te haces más fuerte.', fr: 'Chaque combat gagné te donne de l\'expérience. En montant de niveau, tu deviens plus fort{e}.' });
        await W.say({ es: 'Dicen que el nivel máximo es el 150. ¡Yo aún voy por el 9!', fr: 'On dit que le niveau maximum est 150. Moi, je n\'en suis qu\'au 9 !' });
      } },
      { id: 'martin', look: 'martin', x: 8, y: 16, dir: 'left', trainer: { range: 4, flag: 'beatMartin' }, talk: async W => {
        if (!W.flag('beatMartin')) return trainerMartin(W, W.npc('martin'));
        await W.say({ es: 'Sigue así y llegarás lejos. Yo me quedo entrenando aquí un tiempo más.', fr: 'Continue comme ça et tu iras loin. Moi, je reste m\'entraîner ici encore un peu.' });
      } },
    ],
    triggers: [],
    items: [
      { id: 'r1a', x: 16, y: 24, item: 'unguento', n: 1 },
      { id: 'r1b', x: 3, y: 14, item: 'hogaza', n: 2 },
    ],
  },
};

// ─── Guiones de la historia ───────────────────────────────────────────────
async function scriptIntroVillage(W) {
  const m = W.npc('madre');
  W.player.dir = 'left';
  await W.wait(400);
  await W.say({ es: '¡{name}! Por fin te veo.', fr: '{name} ! Enfin te voilà.' });
  await W.say({ es: 'Maese Esteban te espera en la palestra, al este de la plaza. ¡Hoy te toma como {esc}!', fr: 'Maître Esteban t\'attend à la palestre, à l\'est de la place. Aujourd\'hui, il te prend comme {esc} !' });
  await W.say({ es: 'Y ya sabes: si te hacen daño, vuelve a casa y te curo.', fr: 'Et tu sais : si tu es blessé{e}, reviens à la maison et je te soignerai.' });
  m.dir = 'right';
  await W.say({ es: '(Cruceta: moverse · A: hablar · B mantenido: correr · MENÚ: abrir el menú)', fr: '(Croix : se déplacer · A : parler · B maintenu : courir · MENU : ouvrir le menu)' }, { color: 'blue' });
  W.flag('introDone', true);
}

async function scriptGuardStop(W) {
  const gd = W.npc('guardia');
  gd.dir = 'right';
  W.player.dir = 'left';
  await W.say({ es: '¡Alto ahí, {name}!', fr: 'Halte-là, {name} !' });
  await W.say(L_.noPermit);
  await W.walk(W.player, 'down', 1);
}

async function scriptEsteban(W) {
  const e = W.npc('esteban');
  if (W.flag('rivalDone')) {
    if (P().hp < P().maxHp) {
      await W.say({ es: 'Ven, que te curo esas heridas.', fr: 'Viens, je vais soigner ces blessures.' });
      W.heal(); Sfx.play('heal');
      await W.say(L_.recoverAll);
    }
    await W.say(L_.firstChallenge);
    return;
  }
  const r = W.npc('rival');
  await W.say({ es: '¡Ah, {name}! Llegas justo a tiempo.', fr: 'Ah, {name} ! Tu arrives juste à temps.' });
  await W.say({ es: 'Llevas años mirando cómo entreno a otros. Hoy por fin te tomo como {esc}.', fr: 'Depuis des années, tu me regardes entraîner les autres. Aujourd\'hui, je te prends enfin comme {esc}.' });
  await W.say({ es: 'Toma. Esta espada es para ti.', fr: 'Tiens. Cette épée est pour toi.' });
  Sfx.play('item');
  await W.say({ es: '{name} recibe una ESPADA CORTA.', fr: '{name} reçoit une ÉPÉE COURTE.' }, { color: 'blue' });
  await W.say({ es: 'Escucha bien. Desde la tregua, las Seis Coronas resuelven sus disputas en los coliseos.', fr: 'Écoute bien. Depuis la trêve, les Six Couronnes règlent leurs querelles dans les colisées.' });
  await W.say({ es: 'Hay ocho. Quien vence a un maestro de coliseo gana su blasón.', fr: 'Il y en a huit. Qui bat un maître de colisée gagne son blason.' });
  await W.say({ es: 'Con los ocho blasones podrás entrar en la Gran Liga de Alta Corona... y te armarán caballero.', fr: 'Avec les huit blasons, tu pourras entrer dans la Grande Ligue de Haute-Couronne... et tu seras adoubé{e} {cab}.' });
  // aparece el rival
  r.dir = 'left';
  W.bubble(r);
  Sfx.play('alert');
  await W.wait(700);
  W.bubble(null);
  await W.say({ es: '{rival}: ¡Padre! ¿Le das una espada a {name} y a mí no?', fr: '{rival} : Père ! Tu donnes une épée à {name} et pas à moi ?' });
  await W.walkNextTo(r, W.player);
  W.faceEachOther(r, W.player);
  await W.say({ es: '{rival}: ¡Yo llevo más tiempo entrenando! {name}, ¡te reto a un duelo!', fr: '{rival} : Ça fait plus longtemps que je m\'entraîne ! {name}, je te défie en duel !' });
  e.dir = W.dirTo(e, W.player);
  await W.say({ es: 'ESTEBAN: Je... Un duelo amistoso. Adelante, que os vea.', fr: 'ESTEBAN : Hé hé... Un duel amical. Allez-y, montrez-moi.' });
  const winText = { es: '¡Ja! ¡Te falta mucho entrenamiento!', fr: 'Ha ! Tu as encore beaucoup à apprendre !' };
  const res = await W.battle({ foe: 'rival', level: 3, name: rivalName().toUpperCase(), look: rivalLook(), trainer: rivalName(), canLose: true, canFlee: false,
    defeatText: { es: '¿Qué? ¡No puede ser!', fr: 'Quoi ? Impossible !' }, winText });
  if (res === 'win') {
    await W.say({ es: '{rival}: Grr... Ha sido suerte. ¡La próxima vez gano yo!', fr: '{rival} : Grr... C\'était de la chance. La prochaine fois, c\'est moi qui gagne !' });
  } else {
    await W.say({ es: '{rival}: ' + winText.es, fr: '{rival} : ' + winText.fr });
    await W.say({ es: 'ESTEBAN: No pasa nada, {name}. Hasta los mejores caballeros cayeron en su primer duelo.', fr: 'ESTEBAN : Ce n\'est rien, {name}. Même les meilleurs chevaliers ont perdu leur premier duel.' });
  }
  await W.say({ es: 'ESTEBAN: Buen combate. Venid, que os curo esos golpes.', fr: 'ESTEBAN : Beau combat. Venez, je vais soigner ces coups.' });
  W.heal(); Sfx.play('heal');
  await W.say(L_.recoverAll);
  await W.say({ es: 'ESTEBAN: Llévate también estas cinco HOGAZAS para el camino.', fr: 'ESTEBAN : Prends aussi ces cinq MICHES pour la route.' });
  W.give('hogaza', 5);
  Sfx.play('item');
  await W.say(t('w_receive', { q: itemQty('hogaza', 5) }), { color: 'blue' });
  await W.say({ es: 'ESTEBAN: Una cosa más. Cuanto más camines en la vida real, más fuerte te harás.', fr: 'ESTEBAN : Encore une chose. Plus tu marcheras dans la vraie vie, plus tu deviendras fort{e}.' });
  await W.say({ es: 'ESTEBAN: Cada kilómetro que andes te dará ducados y objetos. Míralo en CAMINATA, dentro del MENÚ.', fr: 'ESTEBAN : Chaque kilomètre parcouru te rapportera des ducats et des objets. Regarde dans MARCHE, dans le MENU.' });
  if (Pasos.native) await W.activateSteps();
  await W.say({ es: 'ESTEBAN: Y ahora, al norte por la Ruta 1. El coliseo de Toledo es tu primer reto.', fr: 'ESTEBAN : Et maintenant, cap au nord par la Route 1. Le colisée de Tolède est ton premier défi.' });
  await W.say({ es: '{rival}: ¡Nos vemos en Toledo, {name}! ¡Allí te ganaré yo!', fr: '{rival} : On se retrouve à Tolède, {name} ! Là-bas, c\'est moi qui gagnerai !' });
  await W.walkTo(r, 16, 12);
  r.dir = 'left';
  await W.walk(r, 'left', 1);
  await W.fadeNpc(r);
  W.flag('rivalDone', true);
  W.flag('canLeave', true);
  Game.save();
}

async function trainerMartin(W, n) {
  n.dir = W.dirTo(n, W.player);
  W.player.dir = W.dirTo(W.player, n);
  await W.say({ es: 'MARTÍN: ¡Eh, tú! Tienes pinta de {esc} novat{o}. ¡En guardia!', fr: 'MARTIN : Hé, toi ! Tu as l\'air d\'un{e} {esc} débutant{e}. En garde !' });
  const res = await W.battle({ foe: 'martin', level: 4, look: 'martin', trainer: { es: 'Martín', fr: 'Martin' }, canLose: false, canFlee: false,
    defeatText: { es: '¡Vaya brazo tienes!', fr: 'Quel bras tu as !' }, winText: { es: 'Vuelve cuando hayas entrenado más.', fr: 'Reviens quand tu te seras mieux entraîné{e}.' } });
  if (res === 'win') {
    W.flag('beatMartin', true);
    await W.say({ es: 'MARTÍN: Sigue así y llegarás lejos.', fr: 'MARTIN : Continue comme ça et tu iras loin.' });
  }
  return res;
}
