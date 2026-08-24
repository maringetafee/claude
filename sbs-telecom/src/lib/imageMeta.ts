// Real pixel widths for each photo's two generated variants (`name.jpg` = large,
// `name-sm.jpg` = small). next/image can't build a srcSet here because the site
// runs with `images.unoptimized: true` (required for static export), so
// ResponsivePhoto builds one by hand using these widths.
export const imageWidths: Record<string, { sm: number; lg: number }> = {
  "/images/rooftop-wide.jpg": { sm: 800, lg: 847 },
  "/images/portero-automatico.jpg": { sm: 800, lg: 1600 },
  "/images/tecnico-instalacion.jpg": { sm: 577, lg: 577 },
  "/images/madrid-torre.jpg": { sm: 598, lg: 1196 },
  "/images/antenas-detalle-1.jpg": { sm: 800, lg: 1600 },
  "/images/antenas-detalle-2.jpg": { sm: 598, lg: 1197 },
  "/images/antenas-detalle-3.jpg": { sm: 800, lg: 1600 },
  "/images/atencion-cliente.jpg": { sm: 800, lg: 1600 },
  "/images/flota-1.jpg": { sm: 800, lg: 1600 },
  "/images/flota-2.jpg": { sm: 800, lg: 1600 },
};
