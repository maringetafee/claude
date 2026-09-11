# Contenido pendiente de confirmar con Autoescuela Rosangel

La web funciona completa y publicable tal cual está, con datos investigados
en fuentes públicas (directorios locales, redes sociales, microdatos de la
DGT). Pero varios de esos datos se contradicen entre fuentes o son
insuficientes para una web premium — nada de esto se ha inventado; se ha
dejado marcado y fácil de sustituir en `src/lib/site-config.ts`,
`src/data/*.ts` y en los propios componentes (buscar `TODO` y `PENDIENTE`).

## CRÍTICO — antes de publicar

- **WhatsApp Business oficial.** Se han encontrado varios números distintos
  asociados a Rosangel en directorios públicos (916 82 48 51, 660 36 71 99,
  685 65 95 63, 605 04 63 63, 640 27 40 38). De momento la web usa
  **640 27 40 38** por defecto (`src/lib/site-config.ts`, `siteConfig.whatsapp`).
  Hay que confirmar cuál es el WhatsApp Business real y activo.
- **Teléfono exacto por centro**, especialmente el de Rigoberta Menchú
  (Norte): las fuentes dan 916 82 48 51 (compartido con Titulcia) o un móvil
  distinto (685 65 95 63 / 605 04 63 63).
- **Dirección "Av. del Ingenioso Hidalgo, 7"**: estaba en la lista de partida
  pero ninguna fuente pública la confirma como centro activo de Rosangel. Se
  ha excluido de la web. Confirmar si sigue operativo y, si es así, añadirlo
  en `src/lib/site-config.ts` (`centers`) siguiendo el mismo patrón que los
  otros tres.
- **Logo oficial en alta resolución** (SVG o PNG grande, con fondo
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

- **Fotografías reales**: centros, vehículos de prácticas, equipo. La web
  está diseñada para funcionar perfectamente sin fotos (identidad gráfica
  editorial con motivos de señalización vial), pero fotos reales elevarían
  mucho la sección de Centros y el hero. Estructura ya preparada en
  `public/images/{brand,centers,cars,team,permits,reviews}`.
- **Horario real por centro.** Se usa el mismo patrón horario (L-J 10-13:30 y
  17-21h, V 10-13:30 y 17-20h) en los tres centros porque es el único dato
  verificado (para el centro de Manzana, por dos fuentes independientes).
  Puede no ser exacto para Titulcia y Rigoberta Menchú.
- **Valoración / reseñas.** Las fuentes públicas dan entre 4.0 y 4.8 sobre 5
  con ~31 opiniones. Se usa 4.8 como aproximación
  (`siteConfig.rating`, `verified: false`). Antes de publicar, coger el dato
  en vivo del perfil de Google Business.
- **Reseñas reales citadas textualmente** (3-5, con nombre y permiso, con
  permiso del autor o captura como evidencia) para sustituir el estado
  "próximamente" de la sección de Opiniones (`ReviewsSection.tsx`).
- **Enlace corto del perfil de Google Business** (`siteConfig.google`), para
  el botón "Ver opiniones en Google" y para futuras reseñas embebidas.
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

- Autoescuela Rosangel, código DGT **M-1711**.
- Tres centros: C. Titulcia 23 (28903), Av. Rigoberta Menchú 19 — "Rosangel
  Norte" (28903), C. Manzana 14 (28901). Getafe, Madrid.
- Instagram: [@autoescuelarosangel](https://www.instagram.com/autoescuelarosangel/).
  Facebook: [Autoescuela RoSangeL](https://www.facebook.com/AutoescuelaRoSangel/).
- Estadísticas oficiales de la DGT (microdatos públicos), periodo
  febrero–julio 2026, centro de examen de Móstoles: 39,6% de aptos en el
  examen práctico de B (59/149) y 40,48% en el teórico (68/168), frente a
  una media del centro de examen del 43,66%. Fuente y periodo citados en la
  propia web (`src/data/dgt-stats.ts`).
