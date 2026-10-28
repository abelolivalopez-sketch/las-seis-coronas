// ─── Idiomas: español y francés ──────────────────────────────────────────
// Los textos bilingües se escriben como { es: '...', fr: '...' }.
const LANG_KEY = 'seis-coronas.idioma';
const Lang = {
  cur: 'es',
  load() {
    try { const v = localStorage.getItem(LANG_KEY); if (v === 'es' || v === 'fr') { this.cur = v; return true; } } catch (e) { /* nada */ }
    return false;
  },
  set(l) {
    this.cur = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* nada */ }
    this.applyDom();
  },
  applyDom() {
    document.documentElement.lang = this.cur;
    document.querySelectorAll('[data-es]').forEach(el => {
      const v = el.getAttribute('data-' + this.cur);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-ph-es]').forEach(el => { el.placeholder = el.getAttribute('data-ph-' + this.cur) || ''; });
  },
};
const tr = x => (x == null ? '' : typeof x === 'string' ? x : (x[Lang.cur] ?? x.es));

// Textos de la interfaz
const TXT = {
  // menús
  m_status: { es: 'ESTADO', fr: 'PROFIL' },
  m_items: { es: 'OBJETOS', fr: 'OBJETS' },
  m_walk: { es: 'CAMINATA', fr: 'MARCHE' },
  m_save: { es: 'GUARDAR', fr: 'SAUVER' },
  m_soundOn: { es: 'SONIDO: SÍ', fr: 'SON : OUI' },
  m_soundOff: { es: 'SONIDO: NO', fr: 'SON : NON' },
  m_lang: { es: 'IDIOMA', fr: 'LANGUE' },
  m_close: { es: 'CERRAR', fr: 'FERMER' },
  back: { es: 'VOLVER', fr: 'RETOUR' },
  yes: { es: 'SÍ', fr: 'OUI' },
  no: { es: 'NO', fr: 'NON' },
  use: { es: 'USAR', fr: 'UTILISER' },
  // título
  title1: { es: 'LAS SEIS', fr: 'LES SIX' },
  title2: { es: 'CORONAS', fr: 'COURONNES' },
  pressA: { es: 'Pulsa A para empezar', fr: 'Appuie sur A pour commencer' },
  proto: { es: 'Prototipo v0.3', fr: 'Prototype v0.3' },
  year: { es: 'Año 1415', fr: 'An 1415' },
  cont: { es: 'CONTINUAR', fr: 'CONTINUER' },
  newGame: { es: 'NUEVA PARTIDA', fr: 'NOUVELLE PARTIE' },
  eraseQ: { es: 'Se borrará la partida guardada. ¿Seguro?', fr: 'La partie sauvegardée sera effacée. Tu es sûr ?' },
  // elección de personaje
  choose: { es: 'ELIGE A TU PERSONAJE', fr: 'CHOISIS TON PERSONNAGE' },
  squireM: { es: 'Escudero', fr: 'Écuyer' },
  squireF: { es: 'Escudera', fr: 'Écuyère' },
  skinLight: { es: 'piel clara', fr: 'peau claire' },
  skinDark: { es: 'piel oscura', fr: 'peau foncée' },
  chooseHelp: { es: 'Elige con la cruceta y pulsa A.', fr: 'Choisis avec la croix et appuie sur A.' },
  beM: { es: '¿Quieres ser este escudero?', fr: 'Veux-tu être cet écuyer ?' },
  beF: { es: '¿Quieres ser esta escudera?', fr: 'Veux-tu être cette écuyère ?' },
  welcomeM: { es: '¡Bienvenido, {n}!', fr: 'Bienvenue, {n} !' },
  welcomeF: { es: '¡Bienvenida, {n}!', fr: 'Bienvenue, {n} !' },
  // introducción
  intro1: { es: 'Año 1415.', fr: 'An 1415.' },
  intro2: { es: 'Tras casi un siglo de guerras, las Seis Coronas firmaron una tregua.', fr: 'Après presque un siècle de guerres, les Six Couronnes ont signé une trêve.' },
  intro3: { es: 'Desde entonces, las disputas entre reinos ya no se libran en el campo de batalla...', fr: 'Depuis, les querelles entre royaumes ne se règlent plus sur les champs de bataille...' },
  intro4: { es: '...sino en los coliseos.', fr: '...mais dans les colisées.' },
  intro5: { es: 'En Villaolivo, una aldea de olivares del sur, {n} está a punto de empezar su aventura.', fr: 'À Villaolivo, un village d\'oliveraies du sud, {n} est sur le point de commencer son aventure.' },
  // combate
  b_fight: { es: 'LUCHAR', fr: 'ATTAQUE' },
  b_bag: { es: 'OBJETOS', fr: 'SAC' },
  b_status: { es: 'ESTADO', fr: 'PROFIL' },
  b_run: { es: 'HUIR', fr: 'FUITE' },
  b_what1: { es: '¿Qué hará', fr: 'Que doit faire' },
  b_what2: { es: '{n}?', fr: '{n} ?' },
  b_pp: { es: 'Usos', fr: 'Coups' },
  b_dmg: { es: 'Daño', fr: 'Dégâts' },
  b_buff: { es: 'Mejora', fr: 'Bonus' },
  lv: { es: 'Nv', fr: 'N.' },
  b_challenge: { es: '¡{t} te reta a un duelo!', fr: '{t} te défie en duel !' },
  b_uses: { es: '¡{a} usa {m}!', fr: '{a} utilise {m} !' },
  b_miss: { es: '¡Pero falla!', fr: 'Mais cela échoue !' },
  b_crit: { es: '¡Golpe crítico!', fr: 'Coup critique !' },
  b_noPP: { es: '¡No le quedan usos a esa técnica!', fr: 'Cette technique est épuisée !' },
  b_noMoves: { es: '¡A {n} no le quedan técnicas!', fr: '{n} n\'a plus de techniques !' },
  b_noFlee: { es: '¡No puedes huir de un duelo!', fr: 'Impossible de fuir un duel !' },
  b_fled: { es: '¡Escapas sin problemas!', fr: 'Tu prends la fuite sans problème !' },
  b_fleeFail: { es: '¡No has podido escapar!', fr: 'Impossible de s\'enfuir !' },
  b_useItem: { es: '{n} usa {i}.', fr: '{n} utilise {i}.' },
  b_recover: { es: 'Recupera {v} PV.', fr: 'Récupère {v} PV.' },
  b_yield: { es: '¡{t} se rinde!', fr: '{t} abandonne !' },
  b_banditFlees: { es: '¡El SALTEADOR sale huyendo!', fr: 'Le BRIGAND prend la fuite !' },
  b_defeated: { es: '¡{f} cae derrotado!', fr: '{f} est vaincu !' },
  b_xp: { es: '{n} gana {v} puntos de experiencia.', fr: '{n} gagne {v} points d\'expérience.' },
  b_goldTrainer: { es: 'Recibes {v} ducados.', fr: 'Tu reçois {v} ducats.' },
  b_goldBandit: { es: 'Al huir, se le caen {v} ducados.', fr: 'En fuyant, il laisse tomber {v} ducats.' },
  b_fainted: { es: '¡{n} ha caído!', fr: '{n} est à terre !' },
  b_levelUp: { es: '¡{n} sube al nivel {v}!', fr: '{n} passe au niveau {v} !' },
  b_forget: { es: '{n} olvida {m}...', fr: '{n} oublie {m}...' },
  b_learn: { es: '¡{n} aprende {m}!', fr: '{n} apprend {m} !' },
  b_noItems: { es: 'No llevas objetos.', fr: 'Tu n\'as aucun objet.' },
  b_fullHp: { es: 'Ya tienes todos los PV.', fr: 'Tes PV sont déjà au maximum.' },
  b_statusLine: { es: '{n}  ·  Nivel {l}  ·  PV {h}/{m}', fr: '{n}  ·  Niveau {l}  ·  PV {h}/{m}' },
  b_statsLine: { es: 'ATQ {a}   DEF {d}   VEL {s}', fr: 'ATT {a}   DÉF {d}   VIT {s}' },
  // mundo
  w_useQ: { es: '{t} ¿Usarlo?', fr: '{t} L\'utiliser ?' },
  w_recovered: { es: '{name} recupera {v} PV.', fr: '{name} récupère {v} PV.' },
  w_recoverAll: { es: '{name} recupera todos sus PV.', fr: '{name} récupère tous ses PV.' },
  w_saveQ: { es: '¿Quieres guardar la partida?', fr: 'Veux-tu sauvegarder la partie ?' },
  w_saved: { es: 'Partida guardada.', fr: 'Partie sauvegardée.' },
  w_saveFail: { es: 'No se ha podido guardar en este navegador.', fr: 'Impossible de sauvegarder dans ce navigateur.' },
  w_found: { es: '{name} encuentra {q}.', fr: '{name} trouve {q}.' },
  w_receive: { es: '{name} recibe {q}.', fr: '{name} reçoit {q}.' },
  w_wake: { es: 'Te despiertas en casa. Tu madre te ha curado las heridas.', fr: 'Tu te réveilles chez toi. Ta mère a soigné tes blessures.' },
  w_lostGold: { es: 'Has perdido la mitad de tus ducados por el camino...', fr: 'Tu as perdu la moitié de tes ducats en chemin...' },
  // estado
  s_level: { es: 'Nivel {v}', fr: 'Niveau {v}' },
  s_max: { es: 'máx. {v}', fr: 'max. {v}' },
  s_next: { es: 'Siguiente nivel', fr: 'Niveau suivant' },
  s_gold: { es: 'Ducados {v}', fr: 'Ducats {v}' },
  s_crests: { es: 'Blasones {v}/8', fr: 'Blasons {v}/8' },
  // caminata
  k_title: { es: 'CAMINATA', fr: 'MARCHE' },
  k_tag: { es: 'propuesta inicial', fr: 'proposition' },
  k_walked: { es: 'Has caminado', fr: 'Tu as marché' },
  k_next: { es: 'Próximo: km {v}', fr: 'Prochain : km {v}' },
  k_r1: { es: 'Cada km', fr: 'Chaque km' },
  k_r2: { es: 'Cada {v} km', fr: 'Tous les {v} km' },
  k_perKm: { es: 'Cada km: +{v} ducados', fr: 'Chaque km : +{v} ducats' },
  k_everyBread: { es: 'Cada {v} km: +1 HOGAZA', fr: 'Tous les {v} km : +1 MICHE' },
  k_everySalve: { es: 'Cada {v} km: +1 UNGÜENTO', fr: 'Tous les {v} km : +1 ONGUENT' },
  k_web1: { es: 'En la app de Android se cuentan tus', fr: 'Dans l\'appli Android, tes vrais pas' },
  k_web2: { es: 'pasos reales. Aquí puedes simular 1 km.', fr: 'sont comptés. Ici, tu peux simuler 1 km.' },
  k_simulate: { es: 'A: simular 1 km (prueba)', fr: 'A : simuler 1 km (test)' },
  k_back: { es: 'B: volver', fr: 'B : retour' },
  k_gold: { es: 'Ducados: {v}', fr: 'Ducats : {v}' },
  k_on: { es: 'Contador de pasos activo', fr: 'Compteur de pas actif' },
  k_today: { es: 'Hoy: {a} de {b} km', fr: 'Aujourd\'hui : {a} km sur {b}' },
  k_steps: { es: 'Pasos contados: {v}', fr: 'Pas comptés : {v}' },
  k_refresh: { es: 'A: actualizar', fr: 'A : actualiser' },
  k_noPerm1: { es: 'Falta el permiso de actividad física', fr: 'Il manque l\'autorisation d\'activité' },
  k_noPerm2: { es: 'para contar tus pasos.', fr: 'physique pour compter tes pas.' },
  k_allow: { es: 'A: dar permiso', fr: 'A : autoriser' },
  k_noSensor1: { es: 'Este móvil no tiene contador', fr: 'Ce téléphone n\'a pas de compteur' },
  k_noSensor2: { es: 'de pasos.', fr: 'de pas.' },
  k_reward: { es: '¡Has caminado {v} km desde la última vez!', fr: 'Tu as marché {v} km depuis la dernière fois !' },
  k_ready: { es: 'El contador de pasos está listo. Desde ahora, cada km que camines contará.', fr: 'Le compteur de pas est prêt. À partir de maintenant, chaque km parcouru comptera.' },
  k_cap: { es: 'Has llegado al máximo de hoy ({v} km). ¡Mañana más!', fr: 'Tu as atteint le maximum du jour ({v} km). La suite demain !' },
  k_denied: { es: 'Sin ese permiso no puedo contar tus pasos. Puedes activarlo cuando quieras en CAMINATA.', fr: 'Sans cette autorisation, je ne peux pas compter tes pas. Tu peux l\'activer quand tu veux dans MARCHE.' },
  k_ducats: { es: '+{v} ducados', fr: '+{v} ducats' },
  // idioma
  l_pick: { es: 'ELIGE IDIOMA', fr: 'CHOISIS TA LANGUE' },
  // técnicas nuevas
  b_healed: { es: '{a} recupera {v} PV.', fr: '{a} récupère {v} PV.' },
  b_noHeal: { es: 'Pero ya tenía todos los PV.', fr: 'Mais ses PV étaient déjà au maximum.' },
  b_wantLearn: { es: '{n} quiere aprender {m}, pero ya sabe cuatro técnicas.', fr: '{n} veut apprendre {m}, mais connaît déjà quatre techniques.' },
  b_forgetQ: { es: '¿Qué técnica olvida {n} para aprender {m}?', fr: 'Quelle technique {n} oublie pour apprendre {m} ?' },
  b_dontLearn: { es: 'NO APRENDER', fr: 'NE PAS APPRENDRE' },
  b_notLearned: { es: '{n} no aprende {m}.', fr: '{n} n\'apprend pas {m}.' },
  // posadas, tiendas, premios
  inn_q: { es: '¡Bienvenid{o} a la posada! ¿Quieres descansar? Es gratis para quien lucha en los coliseos.', fr: 'Bienvenue à l\'auberge ! Tu veux te reposer ? C\'est gratuit pour qui combat dans les colisées.' },
  inn_ask: { es: '¿Descansar en la posada?', fr: 'Te reposer à l\'auberge ?' },
  inn_bye: { es: '¡Vuelve cuando quieras!', fr: 'Reviens quand tu veux !' },
  inn_saved: { es: 'Si caes en combate, despertarás en esta posada.', fr: 'Si tu tombes au combat, tu te réveilleras dans cette auberge.' },
  shop_have: { es: 'LLEVAS', fr: 'ÉQUIPÉ' },
  shop_exit: { es: 'SALIR', fr: 'SORTIR' },
  shop_bye: { es: '¡Gracias por tu visita!', fr: 'Merci de ta visite !' },
  shop_poor: { es: 'No te llegan los ducados.', fr: 'Tu n\'as pas assez de ducats.' },
  shop_howMany: { es: '¿Cuántas unidades de {i}? Tienes {d} ducados.', fr: 'Combien de {i} ? Tu as {d} ducats.' },
  shop_bought: { es: 'Compras {q}.', fr: 'Tu achètes {q}.' },
  shop_already: { es: 'Ya lo llevas puesto.', fr: 'Tu l\'as déjà sur toi.' },
  shop_worse: { es: 'Tu {i} es mejor. No te hace falta.', fr: 'Ton {i} est meilleur. Tu n\'en as pas besoin.' },
  shop_atk: { es: '+{v} ATQ', fr: '+{v} ATT' },
  shop_def: { es: '+{v} DEF', fr: '+{v} DÉF' },
  shop_equipQ: { es: '{i} ({x}) por {p} ducados. ¿Lo compras?', fr: '{i} ({x}) pour {p} ducats. Tu l\'achètes ?' },
  shop_equipped: { es: '¡Te pones {i}!', fr: 'Tu t\'équipes de : {i} !' },
  w_gold: { es: 'Recibes {v} ducados.', fr: 'Tu reçois {v} ducats.' },
  w_crest: { es: '¡Consigues el BLASÓN DE {b}!', fr: 'Tu obtiens le BLASON DE {b} !' },
  w_wakeInn: { es: 'Te despiertas en la posada. Te han curado las heridas.', fr: 'Tu te réveilles à l\'auberge. On a soigné tes blessures.' },
  s_more: { es: 'A: equipo', fr: 'A : équipement' },
  s_gear: { es: 'EQUIPO Y BLASONES', fr: 'ÉQUIPEMENT ET BLASONS' },
  s_weapon: { es: 'Arma', fr: 'Arme' },
  s_armor: { es: 'Armadura', fr: 'Armure' },
  s_none: { es: 'Ninguna', fr: 'Aucune' },
};

function t(key, vars) {
  let s = tr(TXT[key]) || key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}
// "de Abel" / "d'Inès"
const deName = n => (Lang.cur === 'fr' && /^[aeiouhàâäéèêëîïôöûüAEIOUHÀÂÉÈÊÎÔÛ]/.test(n) ? "d'" + n : 'de ' + n);
const kmFmt = v => v.toFixed(1).replace('.', ',');
