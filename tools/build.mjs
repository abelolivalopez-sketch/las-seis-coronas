// Construye el juego en un único HTML (sin dependencias externas).
// Uso: node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsDir = join(root, 'src', 'js');
const files = readdirSync(jsDir).filter(f => f.endsWith('.js')).sort();
const js = files.map(f => `// ── ${f} ──\n` + readFileSync(join(jsDir, f), 'utf8')).join('\n');
// El código se mete dentro de una función para no ensuciar el ámbito global
const bundle = `(function () {\n${js}\n})();`;
const page = readFileSync(join(root, 'src', 'page.html'), 'utf8').replace('/*GAME*/', () => bundle);

mkdirSync(join(root, 'dist'), { recursive: true });
// 1) versión para publicar (el servidor añade <!doctype>, <head> y <body>)
writeFileSync(join(root, 'dist', 'las-seis-coronas.html'), page);
// 2) versión completa para abrir en cualquier navegador o empaquetar con Capacitor
const full = `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">\n</head>\n<body>\n${page}\n</body>\n</html>\n`;
writeFileSync(join(root, 'dist', 'index.html'), full);
console.log(`OK · ${files.length} archivos · ${(full.length / 1024).toFixed(1)} KB`);
