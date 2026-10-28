// Copia el juego construido a app/www y añade el puente de Capacitor.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'app', 'www');
mkdirSync(www, { recursive: true });
let html = readFileSync(join(root, 'dist', 'index.html'), 'utf8');
// La app funciona sin internet: quitamos la fuente de Google (los botones usan una de reserva)
html = html.replace(/<link rel="preconnect"[^>]*>\n?/g, '').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, '');
const core = join(root, 'app', 'node_modules', '@capacitor', 'core', 'dist', 'capacitor.js');
if (existsSync(core)) {
  copyFileSync(core, join(www, 'capacitor.js'));
  html = html.replace('<script>', '<script src="capacitor.js"></script>\n<script>');
  console.log('· capacitor.js incluido');
} else {
  console.log('· capacitor.js no encontrado: se usará el puente nativo directamente');
}
writeFileSync(join(www, 'index.html'), html);
console.log('OK · app/www/index.html');
