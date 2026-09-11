# Autoescuela Rosangel — web

Next.js (App Router, export estático) + Tailwind v4 + GSAP.

## Desarrollo

```bash
npm install
npm run dev
```

## Build (export estático para Netlify)

```bash
npm run build
```

Genera `out/`. Publicar ese directorio (ver `netlify.toml`).

## Contenido y datos

Todo el contenido editable vive en `src/data/*.ts` — no hay textos de negocio
hardcodeados dentro de los componentes. Antes de publicar, revisa
[`CONTENT_NEEDED.md`](./CONTENT_NEEDED.md): lista lo que falta por confirmar
con el cliente (logo en alta resolución, fotos, precios, WhatsApp oficial…).

## Formulario de contacto

Usa Netlify Forms (`data-netlify="true"`), sin backend propio. Las
notificaciones por email se configuran en el panel de Netlify del sitio
(Site configuration → Forms → Form notifications) — no requiere claves en el
frontend.
