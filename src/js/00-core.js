'use strict';
// ─── Núcleo: constantes, utilidades, reloj de juego, sonido ───────────────
const W = 240, H = 160, T = 16;            // resolución interna estilo GBA y tamaño de casilla
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function mkCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return [c, x];
}

function hash2(x, y, s = 0) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul((s | 0) + 7, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function px(ctx, x, y, c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
function rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

// Pinta un dibujo hecho con letras (cada letra es un color de la paleta)
function paintRows(ctx, rows, pal, ox = 0, oy = 0, flip = false) {
  for (let y = 0; y < rows.length; y++) {
    const r = rows[y], n = r.length;
    for (let x = 0; x < n; x++) {
      const ch = r[x];
      if (ch === '.' || ch === ' ') continue;
      const c = pal[ch];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(ox + (flip ? n - 1 - x : x), oy + y, 1, 1);
    }
  }
}

// ─── Reloj del juego: esperas y animaciones (tweens) ──────────────────────
const Clock = {
  t: 0, timers: [], tweens: [],
  update(dt) {
    this.t += dt;
    for (let i = this.timers.length - 1; i >= 0; i--) {
      const tm = this.timers[i];
      tm.left -= dt;
      if (tm.left <= 0) { this.timers.splice(i, 1); tm.fn(); }
    }
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i];
      tw.e += dt;
      const k = Math.min(1, tw.e / tw.d), v = tw.ease(k);
      for (const p in tw.to) tw.o[p] = tw.from[p] + (tw.to[p] - tw.from[p]) * v;
      if (k >= 1) { this.tweens.splice(i, 1); tw.done(); }
    }
  },
};
function wait(ms) { return new Promise(r => Clock.timers.push({ left: ms, fn: r })); }
const Ease = {
  lin: k => k,
  out: k => 1 - (1 - k) * (1 - k),
  in: k => k * k,
  io: k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
};
function tween(o, to, d, ease = Ease.out) {
  return new Promise(r => {
    const from = {};
    for (const p in to) from[p] = o[p];
    Clock.tweens.push({ o, to, from, d: Math.max(1, d), e: 0, ease, done: r });
  });
}

// ─── Sonido: pitidos sintetizados (sin archivos) ──────────────────────────
const Sfx = {
  ctx: null, on: true,
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; }
  },
  tone(f, d, type = 'square', vol = 0.05, slide = 0, delay = 0) {
    const c = this.ctx;
    if (!c || !this.on) return;
    try {
      const t0 = c.currentTime + delay;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t0);
      if (slide) o.frequency.linearRampToValueAtTime(Math.max(30, f + slide), t0 + d);
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g).connect(c.destination);
      o.start(t0); o.stop(t0 + d + 0.03);
    } catch (e) { /* sin sonido */ }
  },
  noise(d, vol = 0.08, delay = 0) {
    const c = this.ctx;
    if (!c || !this.on) return;
    try {
      const len = Math.floor(c.sampleRate * d);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = c.createBufferSource(), g = c.createGain();
      s.buffer = buf; g.gain.value = vol;
      s.connect(g).connect(c.destination);
      s.start(c.currentTime + delay);
    } catch (e) { /* sin sonido */ }
  },
  play(n) {
    switch (n) {
      case 'blip': this.tone(1046, 0.04, 'square', 0.035); break;
      case 'select': this.tone(784, 0.05, 'square', 0.04); this.tone(1175, 0.07, 'square', 0.04, 0, 0.05); break;
      case 'back': this.tone(523, 0.06, 'square', 0.04, -120); break;
      case 'bump': this.tone(98, 0.09, 'square', 0.05); break;
      case 'hit': this.noise(0.14, 0.12); this.tone(220, 0.12, 'sawtooth', 0.04, -160); break;
      case 'crit': this.noise(0.22, 0.16); this.tone(330, 0.2, 'sawtooth', 0.05, -260); break;
      case 'miss': this.tone(440, 0.12, 'triangle', 0.05, -200); break;
      case 'buff': [523, 659, 784].forEach((f, i) => this.tone(f, 0.08, 'triangle', 0.06, 0, i * 0.06)); break;
      case 'debuff': [784, 659, 523].forEach((f, i) => this.tone(f, 0.08, 'triangle', 0.06, 0, i * 0.06)); break;
      case 'faint': this.tone(392, 0.5, 'square', 0.045, -300); break;
      case 'heal': [659, 784, 988, 1319].forEach((f, i) => this.tone(f, 0.1, 'triangle', 0.06, 0, i * 0.08)); break;
      case 'item': [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.09, 'square', 0.035, 0, i * 0.07)); break;
      case 'level': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.11, 'square', 0.04, 0, i * 0.09)); break;
      case 'encounter': [196, 233, 262, 311, 349, 392].forEach((f, i) => this.tone(f, 0.07, 'sawtooth', 0.035, 0, i * 0.05)); break;
      case 'alert': this.tone(1568, 0.06, 'square', 0.05); this.tone(2093, 0.12, 'square', 0.05, 0, 0.07); break;
      case 'coin': this.tone(1319, 0.05, 'square', 0.04); this.tone(1976, 0.12, 'square', 0.04, 0, 0.05); break;
      case 'win': [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'square', 0.04, 0, i * 0.11)); break;
      case 'door': this.noise(0.08, 0.05); break;
    }
  },
};
