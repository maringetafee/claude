# Sema-Dur

Rediseño completo + catálogo online de **Talleres Sema-Dur, S.L.** (marca *Diacort*),
fabricante de herramientas de corte para madera y metal en Humanes de Madrid.

Sustituye al WordPress/Elementor de `sema-dur.com`. Conserva todo el contenido y las
fotografías reales del sitio anterior, presentados en una arquitectura preparada para
vender online mediante catálogo → carrito → checkout → pedidos.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), export estático (`output: "export"`) |
| UI | React 19, Tailwind CSS v4, TypeScript |
| Hosting | Netlify (`publish = "out"`) |
| Formularios | **Netlify Forms** (sin backend propio) |
| Pagos | **Stripe** — arquitectura lista, inactiva (ver abajo) |

Mismo patrón que `../toldos-getafe` y `../sbs-telecom`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # genera out/
npm run assets     # reoptimiza las fotos de _src-assets/ a public/images/
npm run lint
```

## Modelo de negocio: *quote-first*

El sector trabaja con herramienta a medida, así que **ningún producto lleva precio**.
El catálogo es real (26 productos sobre las 5 familias de sema-dur.com) y el carrito
funciona como **solicitud de presupuesto**:

1. El cliente añade referencias al carrito (persiste en `localStorage`).
2. En `/checkout` rellena sus datos y envía la solicitud.
3. El envío va a **Netlify Forms** (`solicitud-presupuesto`) y se guarda una copia
   local en `localStorage` → visible en `/cuenta/solicitudes`.
4. Se genera una referencia `SD-AAAAMMDD-XXXX` mostrada en `/gracias`.

No se simula ningún pago, stock ni autenticación. Lo pendiente está claramente
marcado en la interfaz.

### Estructura de datos

```
src/data/
  categories.ts   5 familias reales
  products.ts     ~26 productos (todos priceModel implícito = "quote")
  sectors.ts      filtros por sector y material
  services.ts     reafilado + fabricación a medida
  company.ts      hitos, cifras, proveedores
  posts.ts        blog (guías técnicas)
  legal.ts        estructura de páginas legales (sin textos inventados)
  image-manifest.json   generado por scripts/fetch-assets.mjs
src/lib/
  cart.tsx        CartProvider (context + reducer + localStorage)
  orders.ts       tipos de pedido + historial local
  search.ts       índice de búsqueda en cliente
  seo.ts          metadata + JSON-LD (Organization, Product, Breadcrumb…)
```

Para añadir productos: edita `src/data/products.ts`. Para dar precio a uno, añade
`price`/`compareAt`/`stock` al tipo `Product` y extiende `components/ui/Price.tsx`
(los llamadores ya tratan el precio como opcional).

## Activar Stripe (cuando haya productos con precio)

La arquitectura ya está montada y es segura: **la clave secreta nunca llega al
navegador**.

1. `npm i stripe` en este proyecto.
2. En Netlify → Site settings → Environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_…
   STRIPE_WEBHOOK_SECRET=whsec_…
   STRIPE_SUCCESS_URL=https://www.sema-dur.com/gracias/?paid=1
   STRIPE_CANCEL_URL=https://www.sema-dur.com/carrito/
   ```
3. Da a los productos vendibles un `stripePriceId` en `src/data/products.ts` y
   mapea las líneas en `netlify/functions/create-checkout.mjs` (marcado con `TODO`).
4. Configura el webhook de Stripe apuntando a
   `/.netlify/functions/stripe-webhook` y completa el `TODO` de persistencia de
   pedidos (Netlify Blobs, DB o email a `administracion@sema-dur.com`).
5. En `components/commerce/ProductPurchase.tsx`, sustituye el aviso «pago
   próximamente» por una llamada a `/.netlify/functions/create-checkout`.

Mientras `STRIPE_SECRET_KEY` no exista, la función responde `501 { pending: true }`
y la web sigue funcionando en modo presupuesto.

## Formularios (Netlify Forms)

`public/__forms.html` declara los 4 formularios para que Netlify los detecte en el
build: `solicitud-presupuesto`, `contacto`, `pedido`, `empleo`. Los envíos reales
salen de componentes React con `data-netlify="true"` y degradan a POST nativo si el
JS falla.

## Pendiente / fuera de alcance

- Autenticación real de cuenta (hoy: scaffold de UI + datos en `localStorage`).
- Persistencia de pedidos en servidor (necesita el webhook de Stripe + almacén).
- Panel de administración.
- Textos legales definitivos (la estructura está en `src/data/legal.ts`).
- Precios y stock reales.

## Contenido conservado del sitio anterior

Datos de empresa y contacto, historia (1976 / 1994), filosofía, distribuidores
(Freud, Ceratizit), aviso de financiación MINCOTUR (footer), y las fotografías de
`sema-dur.com/wp-content/uploads` (vendidas en `_src-assets/`, optimizadas a
AVIF/WebP responsive).
