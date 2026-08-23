# S.B.S Telecomunicaciones — sitio corporativo

Web corporativa de S.B.S Telecomunicaciones S.L., construida a partir del contenido real
de [sbstelec.com](https://www.sbstelec.com) con una nueva dirección de arte ("infraestructura
invisible"): estética oscura, arquitectónica y técnica.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** (tokens definidos en `src/app/globals.css`)
- **GSAP + ScrollTrigger** para el sistema de motion

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/lib/content.ts` — todo el contenido real de la empresa (servicios, contacto, cifras).
  No hay datos inventados: todo procede de la auditoría de la web original.
- `src/components/` — una sección por componente (`Hero`, `Services`, `Process`, `Team`,
  `Fleet`, `MadridNetwork`, `Emergency`, `CTASection`, `Contact`, `Footer`).
- `src/lib/gsap.ts` — registro de plugins y helper `prefersReducedMotion()`, usado por
  cada componente animado para respetar la preferencia de movimiento reducido (las
  animaciones de GSAP no responden a la media query CSS por sí solas).
- `public/images/` — fotografías reales de S.B.S, recortadas y tratadas para la nueva
  identidad visual.

## Formulario de contacto

No hay backend. El formulario valida en cliente y, al enviarse correctamente, abre el
cliente de correo del usuario con un `mailto:` prerellenado — nunca simula un envío que
no ha ocurrido.

## Comandos

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run lint     # ESLint
```
