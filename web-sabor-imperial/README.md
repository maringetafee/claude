# Sabor Imperial RestoBar — sitio web

Web de producción para el restaurante peruano **Sabor Imperial RestoBar**
(C. Capellanes 3, Getafe, Madrid). React + TypeScript + Vite + Tailwind CSS
4 + Framer Motion.

Todos los datos de contacto, horario, carta y reseñas están verificados de
forma independiente — ver [`RESEARCH.md`](./RESEARCH.md) para las fuentes y
[`ASSET_SOURCES.md`](./ASSET_SOURCES.md) para el estado de la fotografía.

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` (o el puerto que indique Vite).

```bash
npm run build     # comprueba tipos (tsc) y genera dist/ para producción
npm run preview   # sirve dist/ localmente para verificar el build
npm run lint      # oxlint
```

## Estructura

```
src/
  content/
    restaurant.ts   ← ÚNICA fuente de verdad: nombre, dirección, teléfono,
                       horario, carta, reseñas, especialidades, galería
    media.ts        ← ÚNICA fuente de verdad: rutas de fotografía
  lib/
    hours.ts        ← calcula abierto/cerrado y el día actual en Europe/Madrid
  components/       ← una sección de la página por archivo
public/images/      ← fotografías en uso (WebP, dos anchos por foto)
research-assets/    ← originales a máxima resolución + fotos de la carta física
                      (no se sirven en el sitio, solo referencia/evidencia)
```

## Cómo editar contenido sin tocar componentes

### Teléfono, dirección, horario, carta, reseñas
Edita **`src/content/restaurant.ts`**. Cada campo tiene un comentario que
indica de dónde sale el dato. Si cambias un horario o el teléfono porque el
negocio los ha actualizado, anota también el cambio (y la fuente) en
`RESEARCH.md` para mantener la trazabilidad.

### Cómo sustituir fotografías
Las fotos actuales son reales pero fueron subidas por clientes a Google Maps,
no por el propio negocio — **lee el aviso de derechos de autor en
`ASSET_SOURCES.md` antes de publicar**. Para sustituir cualquiera por una
foto propia del negocio:

1. Consigue la fotografía real, con permiso claro del propietario para
   usarla en la web.
2. Genera los dos anchos WebP con `ffmpeg` (ver `ASSET_SOURCES.md` → "Cómo
   se generaron los archivos WebP" para los comandos exactos):
   ```bash
   ffmpeg -i original.jpg -vf "scale=1600:-1" -q:v 78 public/images/nombre.webp
   ffmpeg -i original.jpg -vf "scale=800:-1"  -q:v 78 public/images/nombre-800.webp
   ```
3. Abre **`src/content/media.ts`** y llama a `photo('nombre', 'texto alternativo')`
   con el nuevo nombre de archivo (sin extensión) en la entrada
   correspondiente. Es el único archivo que hay que tocar — ningún
   componente necesita cambios.

### Textos de secciones (intro, ambiente, etc.)
Los párrafos descriptivos que no son datos puramente estructurados viven
directamente en el JSX del componente correspondiente (`Intro.tsx`,
`Ambiente.tsx`). Edítalos ahí.

## SEO y datos estructurados

`index.html` incluye metadatos Open Graph/Twitter y un bloque JSON-LD
`Restaurant` con los datos verificados (dirección, teléfono, geolocalización,
valoración media, horario). **Antes de publicar**, sustituye el dominio de
ejemplo `https://sabor-imperial-restobar.example/` por el dominio real en:

- `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD `url`)
- `public/robots.txt` (línea `Sitemap:`)
- `public/sitemap.xml` (`<loc>`)

## Despliegue

El proyecto genera un sitio estático (`npm run build` → carpeta `dist/`).
Sirve para cualquier hosting estático: Netlify, Vercel, GitHub Pages, etc.
En Netlify: build command `npm run build`, publish directory `dist`.

## Verificación realizada

- `npm run build` (TypeScript + Vite): sin errores.
- `npm run lint` (oxlint): sin avisos.
- Probado en navegador real: carrusel del hero (teclado, swip/touch,
  autoplay con pausa, indicadores), menú por categorías, galería con
  lightbox (teclado, cierre, navegación), menú móvil (apertura/cierre,
  bloqueo de scroll, foco), barra de acciones fija en móvil, horario con
  resaltado del día actual (zona horaria Europe/Madrid).
- Comprobado sin scroll horizontal en 320px, 375px y 1440px de ancho.
- Objetivos táctiles móviles verificados ≥ 44×44px.
- `prefers-reduced-motion` respetado globalmente vía
  `<MotionConfig reducedMotion="user">` (Framer Motion) + reglas CSS.
- No se ha podido ejecutar una auditoría Lighthouse automatizada en este
  entorno — antes de publicar, ejecuta Lighthouse (Chrome DevTools o
  `npx lighthouse`) sobre el build de producción servido con
  `npm run preview` y confirma rendimiento/accesibilidad/SEO.

## Pendiente antes de publicar (ver RESEARCH.md y ASSET_SOURCES.md)

1. **Derechos de las fotos**: las fotos actuales las subieron clientes a
   Google Maps, no el negocio — confirma con el propietario antes de
   publicarlas de forma permanente, e idealmente sustitúyelas por
   fotografía propia (ver `ASSET_SOURCES.md`).
2. **Carta secundaria "Para picar"/"Bocadillos"**: esas dos categorías
   proceden de una carta distinta encontrada en Google Maps, con un
   logotipo "La Trampa" y precios de Entrantes que no coinciden con la
   carta principal — confirma con el propietario si esa carta de bar sigue
   vigente junto a la principal (ver `RESEARCH.md` §4). El aviso de
   procedencia ya no se muestra en el sitio (a petición del propietario),
   así que esta confirmación es solo para uso interno.
3. **Dominio real**: `saborimperial.es` (el que figura en Google) no
   resuelve; confirma con el propietario el dominio definitivo y actualízalo
   en los 3 archivos listados arriba en "SEO y datos estructurados".
4. **Redes sociales**: no se localizó ninguna cuenta oficial verificable;
   si el propietario tiene Instagram/Facebook, añádelos al footer y a
   `restaurant.ts`.
5. **Precios ilegibles**: seis combos de la sección "Bocadillos" (los "pan
   con... + café o cebada") se muestran sin precio porque la foto de la
   carta no se leía con claridad ahí — confirma los precios con el
   propietario y añádelos en `restaurant.ts`.
6. Ejecutar Lighthouse y una revisión de accesibilidad con lector de
   pantalla antes de publicar.
