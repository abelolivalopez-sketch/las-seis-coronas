// Ajusta el proyecto Android que genera Capacitor:
// plugin de pasos, permiso de actividad física e icono del juego.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'app');
const cfg = JSON.parse(readFileSync(join(app, 'capacitor.config.json'), 'utf8'));
const pkg = cfg.appId;
const main = join(app, 'android', 'app', 'src', 'main');
if (!existsSync(main)) { console.error('No existe app/android. Ejecuta antes: npx cap add android'); process.exit(1); }

// 1) Código Java: actividad principal y plugin de pasos
const javaDir = join(main, 'java', ...pkg.split('.'));
mkdirSync(javaDir, { recursive: true });
for (const f of ['MainActivity.java', 'PasosPlugin.java']) {
  const src = readFileSync(join(app, 'android-src', f), 'utf8').replace(/__PACKAGE__/g, pkg);
  writeFileSync(join(javaDir, f), src);
}

// 2) Permisos en el manifiesto
const manPath = join(main, 'AndroidManifest.xml');
let man = readFileSync(manPath, 'utf8');
const add = [
  '<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />',
  '<uses-feature android:name="android.hardware.sensor.stepcounter" android:required="false" />',
];
for (const line of add) if (!man.includes(line)) man = man.replace('</manifest>', `    ${line}\n</manifest>`);
writeFileSync(manPath, man);

// 3) Icono
const resSrc = join(app, 'res');
if (existsSync(resSrc)) {
  for (const dir of readdirSync(resSrc)) {
    const to = join(main, 'res', dir);
    mkdirSync(to, { recursive: true });
    for (const f of readdirSync(join(resSrc, dir))) copyFileSync(join(resSrc, dir, f), join(to, f));
  }
}
console.log('OK · proyecto Android ajustado (' + pkg + ')');
