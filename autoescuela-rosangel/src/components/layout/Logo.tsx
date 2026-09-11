/**
 * No disponemos de un archivo del logo oficial de Rosangel en alta
 * resolución (solo el avatar de Instagram, de baja resolución, no apto para
 * una web). Mientras el cliente no lo facilite, usamos un lockup tipográfico
 * propio inspirado en la placa roja de "L" de aprendizaje — sin inventar un
 * logo nuevo con símbolos que no son suyos. Ver CONTENT_NEEDED.md.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-[4px] border-2 border-signal font-display text-sm font-bold leading-none text-signal"
      >
        L
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Rosangel
      </span>
    </span>
  );
}
