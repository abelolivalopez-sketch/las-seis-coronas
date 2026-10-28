# Las Seis Coronas · prototipo v0.2

RPG medieval por turnos en pixel art, ambientado en 1415. Se juega en español o en francés.

## Qué incluye

- Elección de idioma al empezar (español o francés), que se puede cambiar desde el menú.
- Pantalla de título, elección de personaje (escudero o escudera, piel clara u oscura) y nombre.
- Villaolivo y la Ruta 1, con personajes, carteles, objetos y la historia inicial.
- Combate por turnos con técnicas, objetos, huida, golpes críticos y mejoras de atributos.
- Experiencia y niveles hasta el 150.
- **Contador de kilómetros real** en la app de Android: los pasos del móvil se convierten en ducados y objetos.
- Guardado automático y controles táctiles.

## Instalar en Android (para tus amigos)

1. Abre en el móvil: https://github.com/abelolivalopez-sketch/las-seis-coronas/releases/latest
2. Descarga **las-seis-coronas.apk**.
3. Ábrelo. Si Android avisa de que es de un origen desconocido, toca **Ajustes** y activa **Permitir de esta fuente** para el navegador (o para WhatsApp, si te lo pasaron por ahí). Vuelve atrás y toca **Instalar**.
4. Si aparece Google Play Protect, toca **Más detalles** → **Instalar de todos modos**. Sale porque la app no viene de la tienda.
5. Abre el juego. Cuando Maese Esteban hable de caminar, acepta el permiso de **actividad física**: sin él no se cuentan los pasos.

Para actualizar, se descarga el APK nuevo y se instala encima. La partida se conserva.

## Jugar en iPhone

Los iPhone no pueden instalar archivos APK. Se juega desde la web:

**https://abelolivalopez-sketch.github.io/las-seis-coronas/**

1. Abre el enlace en **Safari**.
2. Toca el botón **Compartir** (el cuadrado con la flecha) → **Añadir a pantalla de inicio** → **Añadir**.
3. Abre siempre el juego desde ese icono: se ve a pantalla completa, como una app. La partida se guarda en el icono. Safari guarda otra distinta.

En iPhone no se cuentan los pasos todavía. En CAMINATA hay un botón para simular 1 km. Para tener la app de verdad en iPhone hace falta un Mac, una cuenta de Apple Developer (99 $ al año) y repartirla con TestFlight.

La web se actualiza sola cada vez que se sube un cambio a `main` (`.github/workflows/web.yml`, rama `gh-pages`).

## Cómo funciona el contador de pasos

- El móvil cuenta los pasos con su propio sensor, aunque el juego esté cerrado.
- Al abrir el juego (y cada minuto mientras juegas) se suman los pasos nuevos: **1.350 pasos = 1 km**.
- Recompensas (propuesta inicial, en `WALK` dentro de `src/js/05-data.js`): 50 ducados por km, 1 hogaza cada 2 km y 1 ungüento cada 5 km.
- Tope de **15 km al día**, para evitar trampas.
- En la mayoría de móviles el sensor cuenta siempre. En algunos solo cuenta mientras alguna app lo está usando. Si a alguien no se le suman los km con el juego cerrado, que lo pruebe dejándolo abierto mientras camina.
- La primera vez solo se marca el punto de partida: cuentan los pasos dados desde ese momento.

En el navegador no se pueden leer los pasos, así que en CAMINATA hay un botón para simular 1 km.

## Compilar el APK

### Automático, en GitHub

Cada vez que se sube un cambio a la rama `main`, GitHub Actions construye el APK (unos 5–8 minutos) y lo publica en **Releases**. El proceso está en `.github/workflows/android.yml`. También se puede lanzar a mano desde la pestaña **Actions** → **APK de Android** → **Run workflow**.

### En tu ordenador

Necesitas [Node.js](https://nodejs.org) y [Android Studio](https://developer.android.com/studio).

```bash
cd app
npm install
npm run android          # crea el proyecto Android con el juego, el plugin de pasos y el icono
npx cap open android     # lo abre en Android Studio
```

En Android Studio: **Build → Build App Bundle(s) / APK(s) → Build APK(s)**. Para probarlo en tu móvil conectado por USB, pulsa el botón verde de **Run**.

Después de cambiar el juego: `npm run actualizar` y vuelve a compilar.

## Estructura del código

Todo es JavaScript sin librerías y el arte se dibuja con código.

| Archivo | Qué contiene |
| --- | --- |
| `src/js/00-core.js` | Constantes, utilidades, reloj del juego y sonidos |
| `src/js/01-input.js` | Teclado, cruceta y botones táctiles |
| `src/js/02-font.js` | Fuente pixel propia con tildes, ñ, ç, ¿ y ¡ |
| `src/js/02b-lang.js` | Idiomas y textos de la interfaz (español y francés) |
| `src/js/03-art-chars.js` | Personajes |
| `src/js/04-art-world.js` | Suelo, olivos, casas, objetos, animales e interfaz |
| `src/js/05-data.js` | Técnicas, enemigos, objetos, niveles y recompensas por caminar |
| `src/js/06-state.js` | Partida, guardado y subida de nivel |
| `src/js/07-ui.js` | Cuadros de texto y menús |
| `src/js/08-game.js` | Escenas, fundidos y fondos |
| `src/js/09-maps.js` | Mapas y guiones de la historia (textos en los dos idiomas) |
| `src/js/10-world.js` | Movimiento, personajes y menú de pausa |
| `src/js/11-battle.js` | Combate |
| `src/js/12-scenes.js` | Idioma, título, elección de personaje e introducción |
| `src/js/13-pasos.js` | Contador de pasos y recompensas por km |
| `src/js/99-main.js` | Arranque y bucle principal |
| `src/page.html` | La consola: pantalla, botones y estilos |
| `app/` | App de Android (Capacitor): configuración, plugin de pasos en Java e icono |
| `web/` | Icono y manifiesto de la versión web (para añadirla a la pantalla de inicio) |
| `tools/` | Construcción, preparación de la app y pruebas automáticas |

Los textos bilingües se escriben así: `{ es: 'Hola', fr: 'Bonjour' }`.

## Construir la versión web

```bash
node tools/build.mjs
```

Genera `dist/index.html`, que se puede abrir en cualquier navegador, y `dist/web/`, la versión que se publica para iPhone.
