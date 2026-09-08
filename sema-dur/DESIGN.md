# Sema-Dur — Design handoff

Sistema visual del rediseño. Los tokens viven en `src/app/globals.css`
(`:root` + `@theme`). No usar valores sueltos en componentes.

## Tokens

### Color

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#0b1b2b` | Texto principal, superficies oscuras |
| `--color-ink-soft` | `#33475b` | Texto secundario / cuerpos |
| `--color-ink-muted` | `#4f647a` | Metadatos, hints |
| `--color-ink-invert` / `-soft` | `#eef3f8` / `#a9bccc` | Texto sobre fondo oscuro |
| `--color-bg` / `-soft` / `-steel` | `#fff` / `#f4f6f8` / `#eef1f4` | Superficies |
| `--color-bg-invert` | `#0b1b2b` | Secciones oscuras, footer |
| `--color-brand` / `-strong` | `#004998` / `#003a7a` | Acción primaria, enlaces |
| `--color-brand-tint` | `#e3edf8` | Fondos de énfasis suave, badges |
| `--color-accent` / `-strong` | `#0098b6` / `#086377` | Detalle (eyebrows, iconos). `-strong` cumple AA en blanco y en `-soft` |
| `--color-line` / `-strong` | `#d7dee5` / `#cbd5dd` | Bordes |
| `--color-success` / `-warning` / `-danger` | `#1b8a5a` / `#b26a00` / `#c23934` | Estados |

Contraste verificado AA: cuerpo 9.6:1, `ink-muted` 6.1:1, `brand` 8.7:1,
`accent-strong` 4.7:1 (blanco) / 4.5:1 (soft), `accent` sobre navy 5.1:1.

### Tipografía

- Display: **Archivo** (500/600/700) — titulares, cifras, precios.
- Texto: **Inter** — cuerpos, UI.
- H1 `clamp` ~2.1–3.4rem · H2 ~1.9–2.6rem · cuerpo 1rem/1.6 · `text-wrap: balance` en títulos, `pretty` en párrafos.
- Eyebrow: `.eyebrow` — 0.72rem, 700, uppercase, tracking 0.18em, con guion decorativo.

### Espaciado y layout

- Escala base 4px (utilidades Tailwind).
- Contenedor: `.container-page` — `max-width 1240px`, gutter `clamp(1rem, 4vw, 2.75rem)`.
- Ritmo de sección: `Section` `space="sm|md|lg"` → `py-12/16` · `py-16/24` · `py-20/32`.
- Radios: `--radius-xs 3` · `sm 6` · `md 10` · `lg 16`.
- Sombras: `--shadow-sm` (reposo de tarjeta) · `-md` (hover) · `-lg` (overlays).

## Componentes clave

| Componente | Estados / variantes |
|---|---|
| `Button` / `ButtonLink` | `solid` `accent` `outline` `ghost` `invert` × `sm` `md` `lg`; hover, active (`translate-y-px`), disabled (opacity 55), focus-visible (outline brand) |
| `ProductCard` | imagen (zoom hover), eyebrow familia, título (stretched link), ref, resumen (2 líneas), `Price`, `AvailabilityBadge`, botón "Añadir". Badge "Servicio" si aplica |
| `AvailabilityBadge` | `consultar` (azul + reloj) · `a-medida` (cian + llave) · `bajo-pedido` (acero + doc) |
| `CategoryCard` | imagen full-bleed + degradado inferior; `featured` ocupa 2 columnas |
| `CartDrawer` | `<dialog class="cart-drawer">` derecha, slide-in 320ms; vacío / con líneas; toast implícito (contador de cabecera con `aria-live`) |
| `MobileMenu` | `<dialog class="menu-dialog">` full-screen slide-in; `<details>` para sub-secciones; CTA fijo abajo |
| `SearchOverlay` | `<dialog class="modal-pop">` superior; autocompletado (debounce implícito por `useMemo`), navegación ↑↓ Enter Esc |
| `QuantitySelector` | −/campo/+, min 1, `inputmode="numeric"`, targets 44px (`md`) |
| Campos (`Input`/`Textarea`/`Select`) | label arriba (+"(opcional)"), hint (`aria-describedby`), error (`aria-invalid` + texto), `:user-invalid` borde rojo |
| `Reveal` | scroll-in (translateY 18px + opacity, 600ms); respeta `prefers-reduced-motion`; oculto solo bajo `@media (scripting: enabled)`; revela lo ya visible al montar |

## Breakpoints (Tailwind)

`sm 640` · `md 768` · `lg 1024` · `xl 1280`.

- Navegación: mega-menú desktop ≥ `lg`; menú full-screen < `lg`.
- Header: barra de utilidades solo ≥ `lg`; se colapsa al hacer scroll (`> 12px`).
- Grids: catálogo 1→2→3 · destacados 1→2→4 · familias 1→2→3.
- Ficha de producto: 1 col < `lg`, 2 col ≥ `lg`; barra sticky "Añadir" solo < `lg` tras pasar el CTA principal.

## Interacciones / motion

- Transiciones de página: View Transitions cross-fade 280ms (cross-document).
- Reveal en scroll, zoom sutil de imagen en hover de tarjeta (`scale 1.04`, 500ms).
- Header: transición de padding + sombra al hacer scroll.
- Diálogos: `@starting-style` + `transition-behavior: allow-discrete` (drawer 320ms, modal 240ms).
- Todo el motion se anula con `prefers-reduced-motion: reduce`.

## Edge cases contemplados

- Carrito vacío (drawer, `/carrito`, `/checkout`): estado dedicado + CTA a catálogo.
- Búsqueda / filtros sin resultados: mensaje + "limpiar" + CTA a contacto.
- `localStorage` no disponible (incógnito): try/catch en todo; el envío por Netlify Forms sigue funcionando.
- JS deshabilitado: formularios hacen POST nativo a `/gracias/`; el contenido con `Reveal` permanece visible.
- Producto sin imagen propia: usa la foto de su familia; sin foto → icono `wrench`.
- Precio inexistente: `Price` → "Consultar precio" (no se inventan importes).
- Stripe sin configurar: botón "Pagar con tarjeta" ausente/《próximamente》; función responde 501.

## Accesibilidad

- Landmarks (`header`/`nav`/`main#contenido`/`footer`), skip-link, un `h1` por página, jerarquía sin saltos.
- Foco visible global (`outline 3px brand`), navegación por teclado en menú, drawer, buscador y checkout (diálogos nativos → focus trap gratis).
- Targets ≥ 44px en controles táctiles; `aria-live` en contador de carrito y confirmaciones.
- `alt` descriptivos; imágenes decorativas `alt=""`; iconos `aria-hidden` salvo los informativos.
