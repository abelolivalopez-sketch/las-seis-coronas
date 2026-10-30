// ─── Arte de Alemania: colores de cada región, objetos nuevos y animales ───
Object.assign(THEMES, {
  // Dolomitas y Brennero: prados alpinos, roca clara y neveros (la 's' es nieve aquí)
  alpes: Object.assign({}, PAL, BASE_GP, {
    grass: '#9ccc78', grassD: '#78ac58', grassL: '#c0e49a', grassS: '#86b864',
    tall: '#5a9a48', tallD: '#3e7a34', tallM: '#76b45a', tallL: '#b0dc8a',
    dirt: { b: '#d6c09a', d: '#bca27a', l: '#e8d6b4', e: '#a08660' },
    sand: { b: '#eef3f8', d: '#d2dce8', l: '#ffffff', e: '#b6c4d4' },
    rock: ['#ece4d4', '#c8bea8', '#9a907c', '#5a5246'],
    water: '#4fa8c0', waterD: '#2a6a84', waterL: '#8ad0e2', foam: '#d2f0f6',
  }),
  // Baviera y Turingia: bosque cerrado
  bosque: Object.assign({}, PAL, BASE_GP, {
    grass: '#78b058', grassD: '#5a9040', grassL: '#9ccc78', grassS: '#66a04a',
    tall: '#3e7a34', tallD: '#2a5a24', tallM: '#56943e', tallL: '#86c060',
    dirt: { b: '#c8a878', d: '#ac8c5e', l: '#dcc29a', e: '#8e7048' },
    rock: ['#a8a49a', '#7e7a70', '#5a564e', '#2e2a26'],
    water: '#4f8ab8', waterD: '#2c5680', waterL: '#86b4dc',
  }),
  // Brezales de Luneburgo: brezo morado y caminos de arena
  brezal: Object.assign({}, PAL, BASE_GP, {
    grass: '#a8b874', grassD: '#889a58', grassL: '#c8d498', grassS: '#96a864',
    tall: '#9a5a9a', tallD: '#6e3a72', tallM: '#b874b4', tallL: '#e0a8dc',
    dirt: { b: '#ecd8a8', d: '#d4bc88', l: '#f8ecc8', e: '#bca070' },
    rock: ['#c2b8a4', '#9a8e78', '#706654', '#3c342a'],
  }),
  // Núremberg: arenisca roja
  franconia: Object.assign({}, PAL, BASE_GP, {
    stone: { b: '#dcbcaa', d: '#bc9682', l: '#eed6c8', m: '#9a7666' },
    wall: { top: '#d49a7e', b: '#c07e62', d: '#9a5e46', l: '#e2b096', ol: '#4a2a1e' },
    rock: ['#d4a088', '#b07a62', '#86584a', '#4a2c22'],
    water: '#5a92c0', waterD: '#335e88', waterL: '#8ebce0',
  }),
  // Lübeck: ladrillo de la Hansa y aguas del norte
  hansa: Object.assign({}, PAL, BASE_GP, {
    stone: { b: '#c8c4bc', d: '#a6a29a', l: '#dedad2', m: '#86827a' },
    wall: { top: '#c0705a', b: '#a8503c', d: '#7e3426', l: '#d08a74', ol: '#3a1a12' },
    water: '#4a7aa8', waterD: '#2a4a74', waterL: '#7aa6d0', foam: '#c4dcf0',
  }),
});
const BRICK = ['#b8583e', '#8a3a28', '#c8705a'];
const TIMBER_WALL = ['#f4ecd8', '#d8ccb0', '#fbf6ea'];

// La Fuente Hermosa (Schöner Brunnen) de Núremberg: pilón y aguja gótica dorada
function drawBrunnen(ctx, ox, oy) {
  drawFountain(ctx, ox, oy, { stone: STONE.claro });
  const OL = '#3a2a14', G = ['#f2ca52', '#c89a2a', '#8a6618'], V = '#3e7a48';
  for (let y = 0; y < 34; y++) {
    const half = Math.max(1, Math.round(5 - y * 0.12));
    const yy = oy + 12 - y;
    rect(ctx, ox + 16 - half, yy, half * 2, 1, y % 6 === 0 ? V : y % 3 ? G[0] : G[1]);
    px(ctx, ox + 16 - half - 1, yy, OL); px(ctx, ox + 16 + half, yy, OL);
  }
  for (const y of [6, 14, 22]) { rect(ctx, ox + 10, oy + 12 - y, 12, 2, G[1]); rect(ctx, ox + 10, oy + 12 - y, 12, 1, OL); }
  rect(ctx, ox + 15, oy - 24, 2, 3, G[0]); px(ctx, ox + 15, oy - 25, OL); px(ctx, ox + 16, oy - 25, OL);
}

// Pasarela de tablones sobre el agua
function drawPlank(ctx, ox, oy) {
  const OL = '#2e1c10';
  rect(ctx, ox, oy + 3, 16, 10, OL);
  rect(ctx, ox, oy + 4, 16, 8, '#a87444');
  for (let x = 3; x < 16; x += 4) rect(ctx, ox + x, oy + 4, 1, 8, '#7a4c28');
  rect(ctx, ox, oy + 4, 16, 1, '#c89060');
  rect(ctx, ox, oy + 1, 16, 1, '#6a4428'); rect(ctx, ox, oy + 14, 16, 1, '#6a4428');
  for (const x of [1, 14]) { rect(ctx, ox + x, oy, 1, 4, OL); rect(ctx, ox + x, oy + 12, 1, 4, OL); }
}

// Mesita baja con un tablero de ajedrez
function drawChessTable(ctx, ox, oy) {
  const OL = '#2a1a10';
  rect(ctx, ox + 1, oy + 5, 14, 2, OL); rect(ctx, ox + 2, oy + 7, 2, 7, OL); rect(ctx, ox + 12, oy + 7, 2, 7, OL);
  rect(ctx, ox + 1, oy + 3, 14, 3, '#8a5a32');
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) px(ctx, ox + 2 + i * 2 + j, oy + 2 + j, (i + j) % 2 ? '#f6ecd4' : '#3a2a20');
  rect(ctx, ox + 2, oy + 1, 12, 1, OL);
  px(ctx, ox + 5, oy, '#f6ecd4'); px(ctx, ox + 10, oy, '#2a2030'); px(ctx, ox + 10, oy - 1, '#2a2030');
  rect(ctx, ox + 1, oy + 14, 14, 2, 'rgba(30,20,10,0.25)');
}

// ─── Animales de los Alpes y de los bosques (miran a la izquierda) ───
function drawMarmot() {
  const f = ['#c89c6a', '#9c7448', '#6e4e2e'], dk = ['#8a6440', '#6a4a2e', '#4a321e'];
  return shapeArt(26, 28, [
    { e: [20.5, 23, 4, 2.6], c: dk },
    { e: [14, 18, 8, 8.5], c: f, noise: 111 },
    { e: [13, 20, 4.5, 5.6], c: ['#ead6b0', '#ccb088', '#a48a60'] },
    { e: [10.5, 8.5, 6, 5.2], c: f, noise: 112 },
    { e: [5.6, 10.2, 2.8, 2.3], c: ['#e2c89a', '#bea070', '#94784c'] },
    { e: [13.5, 4, 1.8, 1.6], c: dk },
    { e: [8.5, 15.5, 2.2, 3], c: f },
    { r: [9, 25, 12.5, 27.5], c: dk },
    { r: [15.5, 25, 19, 27.5], c: dk },
  ], '#2a1a0e', x => {
    px(x, 9, 7, '#140a04'); px(x, 8, 7, '#140a04'); px(x, 9, 6, '#f6eedc');
    px(x, 3, 9, '#2a1a0e'); rect(x, 4, 11, 2, 2, '#f8f4ea');
    for (const X of [7, 8, 9]) px(x, X, 18, '#2a1a0e');
  });
}
function drawEagle() {
  const br = ['#8a5a32', '#5e3c20', '#3e2614'], gold = ['#e2b25a', '#b88838', '#8a6020'], y = ['#f2c838', '#c89a18', '#8a6a10'];
  return shapeArt(38, 30, [
    { p: [[18, 15], [36, 1], [33, 9], [27, 18]], c: br, noise: 121, lt: 0.2 },
    { e: [21, 18, 8, 5.5], c: br, noise: 123 },
    { p: [[25, 21], [35, 27], [33, 29], [24, 24]], c: br },
    { p: [[12, 16], [5, 2], [11, 4], [19, 15]], c: br, noise: 122, lt: 0.2 },
    { e: [11.5, 13, 4.2, 3.8], c: gold, noise: 124 },
    { p: [[8, 12], [3.5, 14], [5.5, 17], [8.5, 15]], c: y },
    { r: [18, 22, 19.4, 27], c: y },
    { r: [22, 22, 23.4, 27], c: y },
  ], '#1e1208', x => {
    px(x, 10, 12, '#1a0a04'); px(x, 10, 11, '#f6eedc'); px(x, 11, 12, '#c89a18');
    for (let k = 0; k < 6; k++) { px(x, 8 + k, 5 + k * 2, '#2e1c0e'); px(x, 30 - k * 2, 5 + k * 2, '#2e1c0e'); }
    for (const X of [17, 19, 21, 23]) px(x, X, 27, '#3a2a10');
  });
}
function drawDeer() {
  const f = ['#c07a44', '#94582c', '#683a1a'], leg = ['#7a4a26', '#5a341a', '#3a2010'];
  return shapeArt(34, 36, [
    { r: [24, 23, 26.4, 35.5], c: leg },
    { r: [12, 23, 14.4, 35.5], c: leg },
    { e: [21, 21, 10, 5.6], c: f, noise: 131 },
    { e: [29, 20.5, 2.6, 3.4], c: ['#f2e6d0', '#d6c6a6', '#a89878'] },
    { r: [27, 23, 29.4, 35.5], c: f },
    { r: [15, 23, 17.4, 35.5], c: f },
    { p: [[10, 19], [8, 11], [13.5, 10], [17, 18]], c: f, noise: 133 },
    { e: [8, 11.5, 4.6, 3.4], c: f, noise: 132 },
    { e: [4.2, 13, 2.6, 2], c: ['#8a5a34', '#6a4224', '#4a2c16'] },
    { e: [12.5, 8.5, 2.2, 1.4], c: f },
  ], '#2a160a', x => {
    const A = '#e2d0aa', D = '#8a7454';
    const ant = pts => { for (const [X, Y] of pts) { px(x, X, Y, A); px(x, X + 1, Y, D); } };
    ant([[9, 7], [9, 6], [8, 5], [8, 4], [7, 3], [6, 2], [5, 1]]); ant([[8, 4], [6, 4], [5, 3]]); ant([[7, 2], [8, 1], [9, 0]]);
    ant([[11, 7], [12, 6], [13, 5], [14, 4], [15, 3], [16, 2], [17, 1]]); ant([[14, 4], [16, 5]]); ant([[15, 2], [14, 1], [14, 0]]);
    px(x, 7, 10, '#1a0a04'); px(x, 2, 13, '#1a0a04');
    for (const X of [12, 13, 15, 16, 24, 25, 27, 28]) px(x, X, 35, '#24120a');
  });
}
