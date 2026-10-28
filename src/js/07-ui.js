// ─── Interfaz: cuadros de texto, menús de elección, paneles ───────────────
class Widget {
  constructor() { this.done = false; this.result = undefined; this.promise = new Promise(r => (this.resolve = r)); }
  update() {}
  draw() {}
}

class TextWidget extends Widget {
  constructor(text, o = {}) {
    super();
    this.o = Object.assign({ x: 0, y: 112, w: 240, h: 48, perPage: 2, auto: 0, hold: false, color: 'dark', style: 'parch', center: false }, o);
    this.lines = Font.wrap(text, this.o.w - 22);
    this.page = 0; this.shown = 0; this.wait = 0; this.t = 0; this.typedDone = false;
    this.typed = new Promise(r => (this.onTyped = r));
  }
  pageLines() { const n = this.o.perPage; return this.lines.slice(this.page * n, this.page * n + n); }
  isLast() { return (this.page + 1) * this.o.perPage >= this.lines.length; }
  update(dt) {
    this.t += dt;
    const total = this.pageLines().join('').length;
    if (this.shown < total) {
      const fast = Input.down('a') || Input.down('b');
      this.shown = Math.min(total, this.shown + dt * (fast ? 0.16 : 0.05));
      if (Input.hit('a') && this.t > 120) this.shown = total;
      if (this.shown >= total) { this.t = 0; if (this.isLast()) { this.typedDone = true; this.onTyped(); } }
      return;
    }
    if (this.isLast()) {
      if (!this.typedDone) { this.typedDone = true; this.onTyped(); }
      if (this.o.hold) return;
      if (this.o.auto) {
        this.wait += dt;
        if (this.wait >= this.o.auto || Input.hit('a') || Input.hit('b')) this.done = true;
        return;
      }
      if (Input.hit('a') || Input.hit('b')) { Sfx.play('blip'); this.done = true; }
    } else if (Input.hit('a') || Input.hit('b')) {
      Sfx.play('blip'); this.page++; this.shown = 0; this.t = 0;
    }
  }
  draw(ctx) {
    const { x, y, w, h, style, color } = this.o;
    if (style !== 'none') drawBox(ctx, x, y, w, h, style);
    let left = Math.floor(this.shown);
    const lines = this.pageLines();
    lines.forEach((ln, i) => {
      const part = ln.slice(0, Math.max(0, left));
      left -= ln.length;
      const ty = y + 7 + i * Font.LH;
      if (this.o.center) Font.drawCenter(ctx, part, x + w / 2, ty, color);
      else Font.draw(ctx, part, x + 11, ty, color);
    });
    const total = lines.join('').length;
    if (this.shown >= total && !this.o.hold && !this.o.auto && Math.floor(Clock.t / 300) % 2 === 0) {
      drawDownArrow(ctx, x + w - 17, y + h - 12, color === 'light' ? '#f8d458' : '#c23a3a');
    }
  }
}

class ChoiceWidget extends Widget {
  constructor(options, o = {}) {
    super();
    this.opts = options;
    const w = Math.max(...options.map(s => Font.width(s))) + 26;
    const h = options.length * 14 + 12;
    this.o = Object.assign({ w, h, cancel: options.length - 1, idx: 0 }, o);
    if (this.o.x === undefined) this.o.x = 240 - this.o.w - 2;
    if (this.o.y === undefined) this.o.y = 112 - this.o.h - 1;
    this.idx = this.o.idx;
  }
  update() {
    const n = this.opts.length;
    if (Input.repeat('up')) { this.idx = (this.idx + n - 1) % n; Sfx.play('blip'); }
    if (Input.repeat('down')) { this.idx = (this.idx + 1) % n; Sfx.play('blip'); }
    if (Input.hit('a')) { Sfx.play('select'); this.result = this.idx; this.done = true; }
    else if (Input.hit('b') && this.o.cancel !== null) { Sfx.play('back'); this.result = this.o.cancel; this.done = true; }
  }
  draw(ctx) {
    const { x, y, w, h } = this.o;
    drawBox(ctx, x, y, w, h);
    this.opts.forEach((s, i) => {
      const ty = y + 6 + i * 14;
      Font.draw(ctx, s, x + 16, ty, 'dark');
      if (i === this.idx) drawCursor(ctx, x + 8, ty + 3);
    });
  }
}

// Panel libre: draw(ctx) dibuja, step(dt) devuelve un resultado (≠ undefined) para cerrarse
class PanelWidget extends Widget {
  constructor(draw, step) { super(); this.drawFn = draw; this.stepFn = step; }
  update(dt) { const r = this.stepFn ? this.stepFn(dt, this) : ((Input.hit('a') || Input.hit('b')) ? true : undefined); if (r !== undefined) { this.result = r; this.done = true; } }
  draw(ctx) { this.drawFn(ctx, this); }
}

class UI {
  constructor() { this.stack = []; }
  get busy() { return this.stack.length > 0; }
  push(w) { this.stack.push(w); return w.promise; }
  remove(w) { const i = this.stack.indexOf(w); if (i >= 0) this.stack.splice(i, 1); w.resolve(w.result); }
  update(dt) {
    const top = this.stack[this.stack.length - 1];
    if (!top) return;
    top.update(dt);
    if (top.done) { this.stack.splice(this.stack.indexOf(top), 1); top.resolve(top.result); }
  }
  draw(ctx) { for (const w of this.stack) w.draw(ctx); }
  say(text, o) { return this.push(new TextWidget(fmt(text), o)); }
  async sayAll(list, o) { for (const t of list) await this.say(t, o); }
  choose(options, o) { return this.push(new ChoiceWidget(options, o)); }
  async ask(text, options = ['SÍ', 'NO'], o = {}) {
    const tw = new TextWidget(fmt(text), Object.assign({ hold: true }, o.text || {}));
    this.stack.push(tw);
    await tw.typed;
    const r = await this.choose(options, o.choice || {});
    this.remove(tw);
    return r;
  }
  panel(draw, step) { return this.push(new PanelWidget(draw, step)); }
}
