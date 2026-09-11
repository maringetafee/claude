# Contenido pendiente de confirmar con Autoescuela Rosangel

La web funciona completa y publicable tal cual está, con datos investigados
en fuentes públicas (directorios locales, redes sociales, microdatos de la
DGT). Pero varios de esos datos se contradicen entre fuentes o son
insuficientes para una web premium — nada de esto se ha inventado; se ha
dejado marcado y fácil de sustituir en `src/lib/site-config.ts`,
`src/data/*.ts` y en los propios componentes (buscar `TODO` y `PENDIENTE`).

## CRÍTICO — antes de publicar

- **Reseñas de ejemplo en la sección de Opiniones.** Las cuatro tarjetas de
  `src/data/testimonials.ts` son textos y nombres INVENTADOS para maquetar
  (`testimonialsAreExamples = true`). Antes de publicar, sustituirlas por
  reseñas reales con permiso del autor o quitarlas: publicar opiniones
  inventadas como si fueran reales es una práctica comercial desleal. La
  valoración (4,8), el número de reseñas por centro y los temas destacados
  sí son reales (Google Maps, septiembre de 2026).- **Logo oficial en alta resolución** (SVG o PNG grande, con fondo
  transparente). Ahora mismo la web usa un lockup tipográfico propio ("L" +
  "Rosangel") porque el único material disponible era el avatar de
  Instagram, de muy baja resolución — no apto para producción. Ver
  `src/components/layout/Logo.tsx`.
- **Email de contacto.** No se ha encontrado ninguno público. Ahora mismo no
  se muestra ningún email en la web (mejor que inventarlo). Si existe, añadir
  en `siteConfig.email`.
- **Razón social, NIF/CIF y domicilio fiscal** para el aviso legal y la
  política de privacidad (`src/app/aviso-legal`, `src/app/politica-de-privacidad`
  — buscar `[PENDIENTE]`).

## IMPORTANTE

- **Fotografías reales**: centros, vehículos de prácticas, equipo. Ahora
  mismo las tarjetas y páginas de permisos usan dos fotos genéricas de
  Unsplash (`public/images/permits/`) que no son de Rosangel. La web
  está diseñada para funcionar perfectamente sin fotos (identidad gráfica
  editorial con motivos de señalización vial), pero fotos reales elevarían
  mucho la sección de Centros y el hero. Estructura ya preparada en
  `public/images/{brand,centers,cars,team,permits,reviews}`.
- **Horario real por centro.** Se usa el mismo patrón horario (L-J 10-13:30 y
  17-21h, V 10-13:30 y 17-20h) en los cuatro centros porque es el único dato
  verificado (para el centro de Manzana, por dos fuentes independientes).
  Puede no ser exacto para Titulcia, Rigoberta Menchú y Los Molinos.
- **Refrescar la valoración de Google** antes de publicar: los datos por
  centro (`centers[].googleRating`) se tomaron en septiembre de 2026.
- **Confirmar permisos ofrecidos.** Varios directorios listan también A1, A,
  B+E y ciclomotor además de B y A2, pero es un listado genérico que
  repiten muchas fichas de autoescuela — no se ha podido verificar de forma
  independiente para Rosangel. Solo se publican B y A2, que sí están
  respaldados por varias fuentes y por los propios datos de exámenes de la
  DGT. Confirmar si se ofrecen más para añadir su propia página en
  `src/data/permits.ts`.
- **Precios, número de clases, disponibilidad de vehículos/motos.** No se
  muestra ningún precio ni promoción (tal y como se pidió). En cuanto el
  cliente los facilite, hay hueco natural para una sección de precios sin
  rediseñar nada.

## OPCIONAL

- Página dedicada por permiso adicional (si se confirma que se imparten).
- Certificaciones, premios o reconocimientos verificables.
- Vídeo corto (no obligatorio; la web no depende de vídeo para funcionar).
- Ampliar la sección "Equipo": ahora mismo se ha evitado a propósito (no hay
  información pública suficiente y verificada sobre cargos concretos), y en
  su lugar se apuesta por un mensaje de trato humano genérico. Si el cliente
  facilita nombres, roles y fotos reales, se puede añadir sin tocar el resto
  del diseño.

## Datos que SÍ están verificados con razonable confianza

- WhatsApp general **640 27 40 38** (confirmado por el equipo, septiembre de 2026).
- Teléfonos por centro según sus fichas de Google Maps: Centro (Manzana)
  640 27 40 38, Juan de la Cierva (Titulcia) 916 82 48 51, Norte
  685 65 95 63, Los Molinos 665 89 27 39. Los Molinos no tiene WhatsApp
  propio confirmado: usa el general.
- Autoescuela Rosangel, código DGT **M-1711**.
- Cuatro centros: C. Manzana 14 — Getafe Centro (28901), C. Titulcia 23 —
  Juan de la Cierva (28903), Av. Rigoberta Menchú 19 — "Rosangel Norte"
  (28903) y Av. del Ingenioso Hidalgo 7 — Los Molinos (28906). Getafe,
  Madrid. Etiquetas de zona confirmadas por el equipo (septiembre de 2026).
- Instagram: [@autoescuelarosangel](https://www.instagram.com/autoescuelarosangel/).
  Facebook: [Autoescuela RoSangeL](https://www.facebook.com/AutoescuelaRoSangel/).
- Estadísticas oficiales de la DGT (microdatos públicos), periodo
  febrero–julio 2026, centro de examen de Móstoles: 39,6% de aptos en el
  examen práctico de B (59/149) y 40,48% en el teórico (68/168), frente a
  una media del centro de examen del 43,66%. Fuente y periodo citados en la
  propia web (`src/data/dgt-stats.ts`).
