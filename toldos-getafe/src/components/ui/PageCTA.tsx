import Link from "next/link";

type PageCTAProps = {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function PageCTA({
  title = "¿Hablamos de tu proyecto?",
  ctaLabel = "Solicitar presupuesto",
  ctaHref = "/contacto",
}: PageCTAProps) {
  return (
    <div className="px-6 py-20 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.55)] sm:px-10 sm:py-28 lg:px-16">
      <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-paper sm:text-4xl">
        {title}
      </h2>
      <Link
        href={ctaHref}
        className="mt-8 inline-flex w-fit items-center gap-3 bg-accent px-8 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-soft"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
