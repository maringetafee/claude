# Estructura de imágenes

La web funciona sin ninguna foto (identidad gráfica propia, sin stock
photos). En cuanto el cliente facilite material real, colócalo aquí y
referencíalo desde los componentes correspondientes:

- `brand/` — logo oficial (SVG/PNG alta resolución, fondo transparente).
- `centers/` — fotos de fachada/interior de cada centro (Titulcia, Rigoberta
  Menchú, Manzana).
- `cars/` — vehículos de prácticas.
- `team/` — profesores y personal (con su consentimiento para publicarlas).
- `permits/` — material de apoyo para las páginas de permiso B / A2.
- `reviews/` — capturas de reseñas reales (como evidencia, no para usar
  directamente como imagen en la web salvo que el cliente lo pida así).

`getafe-map.svg` (mapa del hero) se genera con
`node scripts/build-getafe-map.mjs <volcado-overpass.json>` a partir de datos
de OpenStreetMap (ODbL, la atribución se muestra sobre el mapa). La consulta
Overpass está documentada en el propio script.

Excepción (septiembre de 2026, a petición del equipo): `permits/` contiene
dos fotos genéricas de Unsplash (licencia gratuita para uso comercial) para
las tarjetas y páginas de permiso. No son de Rosangel — sustitúyelas por
fotos reales en cuanto las haya (enlaces de origen en `src/data/permits.ts`).
Para el resto de huecos, mejor dejar el diseño gráfico actual que rellenar
con stock.
