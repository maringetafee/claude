# Fuentes de recursos visuales

## Origen de las fotografías

Todas las fotografías usadas en el sitio (`public/images/*.webp`) proceden
de la sección de fotos de la **ficha de Google Business Profile** de Sabor
Imperial RestoBar (la misma ficha de Google Maps enlazada por el usuario),
consultada el 27 de agosto de 2026. Ver `RESEARCH.md` §8 para la tabla de
atribución completa (archivo, contenido, autor, fecha).

**Importante — quién las subió:** estas fotos fueron subidas por clientes
del restaurante (reseñadores públicos de Google Maps), no por la cuenta del
propio negocio. Google no distingue en la interfaz pública si una foto
concreta fue subida por el propietario o por un cliente; ninguna de las que
se usan aquí llevaba una etiqueta "Propietario". Esto tiene una implicación
de derechos de autor real:

- El autor legal de cada fotografía es la persona que la tomó (el cliente),
  no el restaurante ni el usuario de esta conversación.
- Subir una foto a Google Maps da a Google licencia para mostrarla en Maps,
  pero no transfiere los derechos a terceros para reutilizarla en un sitio
  web comercial distinto.
- Se han usado de todos modos, siguiendo instrucción expresa del usuario
  (que afirma tener autorización para usar el material audiovisual
  disponible en la ficha) y porque documentan fielmente platos y espacios
  reales del negocio — pero **la autorización real para publicarlas de
  forma permanente en un sitio comercial debe confirmarla el propietario
  del restaurante**, no solo asumirse. Antes de publicar el sitio,
  recomendamos que el propietario: (a) confirme que estas fotos representan
  fielmente el negocio actual, y (b) sustituya progresivamente estas fotos
  de clientes por fotografía propia (tomada por o para el negocio), que es
  la única fuente sobre la que el negocio tiene control total de derechos.

## Fotografías en uso

| Archivo | Uso en el sitio | Contenido | Autor original (Google Maps) |
|---|---|---|---|
| `salon.webp` / `salon-800.webp` | Hero, galería | Salón principal | Juan Alberto López Jiménez |
| `barra.webp` / `barra-800.webp` | Hero, galería, fondo de sección Ambiente | Barra del local | Yoelkis Torres Tápanes |
| `huancaina.webp` / `huancaina-800.webp` | Hero, especialidades, galería | Tallarines a la huancaina con lomo | David Lopez Garcia |
| `lomo-saltado.webp` / `lomo-saltado-800.webp` | Hero, especialidades, galería, imagen Open Graph | Lomo saltado con arroz chaufa | Luiggi Garzon |
| `causa-limena.webp` / `causa-limena-800.webp` | Especialidades, galería | Causa limeña | Montse |
| `arroz-mariscos.webp` / `arroz-mariscos-800.webp` | Especialidades, galería | Arroz con mariscos | David Lopez Garcia |
| `tallarin-saltado.webp` / `tallarin-saltado-800.webp` | Galería | Tallarín saltado con carne | Camila Vargas |
| `tamal.webp` / `tamal-800.webp` | Galería | Tamal peruano | jonathan sanz |
| `public/favicon.svg` | Icono de pestaña | Marca abstracta diseñada para este encargo (no es una fotografía) | — |

`research-assets/originals/*.jpg` conserva el archivo original a máxima
resolución de cada foto (antes de recomprimir a WebP), y
`research-assets/menu-carta-1.jpg` / `menu-carta-2.jpg` son las dos
fotografías de la carta física usadas como fuente de los precios en
`RESEARCH.md` §4 — no se muestran en el sitio público, solo sirven de
referencia/evidencia.

## Cómo se generaron los archivos WebP

Cada foto original (JPG, hasta 5712×4284 px) se recomprimió a dos anchos
fijos con `ffmpeg`, manteniendo la relación de aspecto:

```bash
ffmpeg -i original.jpg -vf "scale=1600:-1" -q:v 78 nombre.webp
ffmpeg -i original.jpg -vf "scale=800:-1"  -q:v 78 nombre-800.webp
```

`src/content/media.ts` referencia ambos anchos en `srcSet` con el
descriptor `800w`/`1600w`; el navegador elige el tamaño según el `sizes`
que le pasa cada sección. Para añadir una foto nueva con el mismo patrón,
repite estos dos comandos con el archivo nuevo y actualiza la entrada
correspondiente en `media.ts`.

## Antes de publicar

1. Pide confirmación al propietario sobre el aviso de derechos de autor de
   la sección anterior.
2. Si el propietario aporta fotografía propia, sustitúyela siguiendo
   "Cómo sustituir fotografías" en `README.md` — es un cambio de una sola
   línea por foto en `src/content/media.ts`.
3. Revisa que ninguna persona identificable en las fotos (clientes,
   empleados) tenga objeción a aparecer en la web pública del negocio.
