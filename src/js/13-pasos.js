// ─── Pasos reales: contador del móvil (solo en la app de Android) ─────────
// La app nativa trae un plugin "Pasos" que lee el sensor de pasos del teléfono.
// En el navegador no existe, así que se usa el botón de "simular 1 km".
const Pasos = {
  plugin: null, available: false, granted: false, checked: false, lastSync: 0,

  init() {
    const C = window.Capacitor;
    if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
    try {
      if (C.registerPlugin) this.plugin = C.registerPlugin('Pasos');
      else if (C.Plugins && C.Plugins.Pasos) this.plugin = C.Plugins.Pasos;
      else if (C.nativePromise) this.plugin = new Proxy({}, { get: (_, m) => opts => C.nativePromise('Pasos', m, opts || {}) });
    } catch (e) { this.plugin = null; }
    // al volver a la app, contar lo caminado mientras estaba cerrada
    document.addEventListener('visibilitychange', () => { if (!document.hidden) Pasos.onResume(); });
  },
  get native() { return !!this.plugin; },

  async refreshState() {
    if (!this.plugin) return;
    try {
      const r = await this.plugin.estado();
      this.available = !!r.disponible; this.granted = !!r.permiso; this.checked = true;
    } catch (e) { this.available = false; this.checked = true; }
  },
  async askPermission() {
    if (!this.plugin) return false;
    try {
      const r = await this.plugin.pedirPermiso();
      this.available = !!r.disponible; this.granted = !!r.permiso; this.checked = true;
    } catch (e) { this.granted = false; }
    return this.granted;
  },

  // Lee el contador y convierte los pasos nuevos en km y recompensas.
  // Devuelve { first, km, steps, rewards, capped } o null si no se pudo leer.
  async sync() {
    if (!this.plugin || !Game.state) return null;
    if (!this.checked) await this.refreshState();
    if (!this.available || !this.granted) return null;
    let r;
    try { r = await this.plugin.leer(); } catch (e) { return null; }
    if (!r || typeof r.pasos !== 'number' || r.pasos < 0) return null;
    this.lastSync = Date.now();
    const s = Game.state;
    const w = s.walk || (s.walk = { boot: 0, last: -1, total: 0, day: '', dayKm: 0 });
    const sameBoot = w.boot && Math.abs(r.arranque - w.boot) < 10 * 60 * 1000;
    let delta = 0, first = false;
    if (w.last < 0 || !w.boot) first = true;                 // primera lectura: solo fija el punto de partida
    else if (sameBoot && r.pasos >= w.last) delta = r.pasos - w.last;
    else delta = r.pasos;                                     // el móvil se ha reiniciado
    w.boot = r.arranque; w.last = r.pasos;
    if (first || delta <= 0) { Game.save(); return { first, km: 0, steps: 0, rewards: '', capped: false }; }
    w.total += delta;
    const today = localDay();
    if (w.day !== today) { w.day = today; w.dayKm = 0; }
    let km = delta / WALK.stepsPerKm;
    const room = Math.max(0, WALK.maxKmPerDay - w.dayKm);
    const capped = km > room;
    km = Math.min(km, room);
    w.dayKm += km;
    s.km += km;
    const rewards = claimWalkRewards();
    Game.save();
    return { first: false, km, steps: delta, rewards, capped };
  },

  // Se llama al volver a la app; el mundo enseña el mensaje cuando esté libre
  async onResume() {
    if (!this.plugin || !Game.state) return;
    const res = await this.sync();
    if (res) this.pending = res;
  },
};

function localDay() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Entrega las recompensas de cada km completo todavía sin cobrar
function claimWalkRewards() {
  const s = S0();
  const parts = [];
  let gold = 0, bread = 0, salve = 0;
  while (s.kmClaimed + 1 <= s.km + 1e-9) {
    s.kmClaimed++;
    gold += WALK.ducadosPerKm;
    if (s.kmClaimed % WALK.hogazaEvery === 0) bread++;
    if (s.kmClaimed % WALK.unguentoEvery === 0) salve++;
  }
  if (gold) { s.ducados += gold; parts.push(t('k_ducats', { v: gold })); }
  if (bread) { s.items.hogaza = (s.items.hogaza || 0) + bread; parts.push('+' + bread + ' ' + tr(bread > 1 ? ITEMS.hogaza.plural : ITEMS.hogaza.name)); }
  if (salve) { s.items.unguento = (s.items.unguento || 0) + salve; parts.push('+' + salve + ' ' + tr(salve > 1 ? ITEMS.unguento.plural : ITEMS.unguento.name)); }
  return parts.join(' · ');
}
