// ─── Controles: teclado + cruceta y botones táctiles ──────────────────────
const DIRS = ['up', 'down', 'left', 'right'];
const DV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };

const Input = {
  held: {}, pending: new Set(), pressed: new Set(), rep: new Set(), holdT: {}, lastDir: null, locked: false,
  map: {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
    KeyZ: 'a', KeyJ: 'a', Enter: 'a', Space: 'a', NumpadEnter: 'a',
    KeyX: 'b', KeyK: 'b', Escape: 'b', Backspace: 'b', ShiftLeft: 'b', ShiftRight: 'b',
    KeyM: 'start', KeyP: 'start', Tab: 'start',
  },
  init() {
    addEventListener('keydown', e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      const k = this.map[e.code];
      if (!k) return;
      e.preventDefault();
      if (!e.repeat) this.press(k);
    });
    addEventListener('keyup', e => { const k = this.map[e.code]; if (k) this.release(k); });
    addEventListener('blur', () => { for (const k in this.held) this.held[k] = false; });
    // Safari en iPhone solo deja activar el sonido al levantar el dedo o con un clic
    for (const ev of ['touchend', 'click']) document.addEventListener(ev, () => Sfx.unlock(), { passive: true });

    document.querySelectorAll('[data-btn]').forEach(el => {
      const k = el.dataset.btn;
      el.addEventListener('pointerdown', e => {
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
        this.press(k); el.classList.add('on');
      });
      const up = () => { this.release(k); el.classList.remove('on'); };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('lostpointercapture', up);
      el.addEventListener('contextmenu', e => e.preventDefault());
    });

    // toques directos en la pantalla del juego (los usa el tablero de ajedrez)
    const scr = document.getElementById('screen');
    if (scr) scr.addEventListener('pointerdown', e => {
      const r = scr.getBoundingClientRect();
      if (!r.width || !r.height) return;
      this.tapPending = { x: (e.clientX - r.left) / r.width * 240, y: (e.clientY - r.top) / r.height * 160 };
      Sfx.unlock();
    });

    const pad = document.getElementById('dpad');
    if (pad) {
      let active = null;
      const setDir = d => {
        if (d === active) return;
        if (active) this.release(active);
        active = d;
        if (d) this.press(d);
        pad.dataset.dir = d || '';
      };
      const fromEvent = e => {
        const r = pad.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < r.width * 0.1) return active;
        return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
      };
      pad.addEventListener('pointerdown', e => {
        e.preventDefault();
        try { pad.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
        setDir(fromEvent(e));
      });
      pad.addEventListener('pointermove', e => { if (active) setDir(fromEvent(e)); });
      const end = () => setDir(null);
      pad.addEventListener('pointerup', end);
      pad.addEventListener('pointercancel', end);
      pad.addEventListener('lostpointercapture', end);
      pad.addEventListener('contextmenu', e => e.preventDefault());
    }
  },
  press(k) {
    if (!this.held[k]) { this.pending.add(k); this.holdT[k] = 0; }
    this.held[k] = true;
    if (DIRS.includes(k)) this.lastDir = k;
    Sfx.unlock();
  },
  release(k) { this.held[k] = false; },
  poll(dt) {
    this.pressed = this.pending;
    this.pending = new Set();
    this.tap = this.locked ? null : this.tapPending || null;
    this.tapPending = null;
    this.rep = new Set(this.pressed);
    for (const k of DIRS) {
      if (!this.held[k]) continue;
      const prev = this.holdT[k] || 0, now = prev + dt;
      this.holdT[k] = now;
      if (prev < 380 && now >= 380) this.rep.add(k);
      else if (now > 380 && Math.floor((now - 380) / 110) > Math.floor((prev - 380) / 110)) this.rep.add(k);
    }
    if (this.locked) { this.pressed = new Set(); this.rep = new Set(); }
  },
  hit(k) { return this.pressed.has(k); },
  repeat(k) { return this.rep.has(k); },
  down(k) { return !this.locked && !!this.held[k]; },
  clear() { this.pressed = new Set(); this.rep = new Set(); this.pending = new Set(); this.tap = null; this.tapPending = null; },
  dir() {
    if (this.locked) return null;
    if (this.lastDir && this.held[this.lastDir]) return this.lastDir;
    for (const k of DIRS) if (this.held[k]) return k;
    return null;
  },
};
