// ─── Arranque y bucle principal (60 pasos por segundo) ────────────────────
function boot(data) {
  Font.init();
  Art.init();
  Input.init();
  Pasos.init();
  const hasLang = Lang.load();
  Lang.applyDom();
  const screen = document.getElementById('screen');
  const sctx = screen.getContext('2d');
  const [buf, bctx] = mkCanvas(W, H);

  const fit = () => {
    const r = screen.getBoundingClientRect();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.max(W, Math.round(r.width * dpr)), h = Math.max(H, Math.round(r.height * dpr));
    if (screen.width !== w || screen.height !== h) { screen.width = w; screen.height = h; }
    sctx.imageSmoothingEnabled = false;
  };
  fit();
  addEventListener('resize', fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(screen);

  // volver a la partida si la página se actualiza mientras juegas
  let restored = false;
  if (data && data.state) {
    try { const st = JSON.parse(data.state); if (st && st.player) { startWorld(st, false); restored = true; } } catch (e) { /* nada */ }
  }
  if (!restored) Game.set(hasLang ? new TitleScene() : new LangScene());
  try {
    if (window.claude && window.claude.hot && window.claude.hot.snapshot) {
      window.claude.hot.snapshot(() => ({ state: Game.state && Game.scene instanceof WorldScene ? JSON.stringify(Game.state) : null }));
    }
  } catch (e) { /* opcional */ }

  const STEP = 1000 / 60;
  let last = performance.now(), acc = 0;
  const frame = now => {
    acc += Math.min(100, now - last);
    last = now;
    while (acc >= STEP) {
      Input.poll(STEP);
      Clock.update(STEP);
      Game.update(STEP);
      acc -= STEP;
    }
    Game.draw(bctx);
    sctx.imageSmoothingEnabled = false;
    sctx.drawImage(buf, 0, 0, screen.width, screen.height);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  document.documentElement.classList.add('ready');
  if (/debug/.test(location.search)) {
    window.__SC = { Game, Input, Art, Font, MAPS, P, S0, WorldScene, BattleScene, startWorld, newState, renderMap, drawChar, LOOKS, Clock, gainXp, calcStats, PLAYER_BASE, xpFor, Lang, Pasos, LangScene, TitleScene };
  }
}

(function start() {
  const hot = window.claude && window.claude.hot;
  const go = d => boot(d || {});
  if (hot && hot.ready) hot.ready(go);
  else go(hot && hot.data ? hot.data : {});
})();
