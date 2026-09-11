/**
 * Numeración editorial (01, 02, 03…) reutilizada en varias secciones como
 * detalle de dirección de arte — coherente con el motivo de señalización.
 */
export default function SectionNumber({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="font-display text-sm font-semibold tabular-nums text-stone-light"
    >
      {n}
    </span>
  );
}
