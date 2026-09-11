import { centers, siteConfig } from "@/lib/site-config";
import { reviewTopics, testimonials } from "@/data/testimonials";
import { StarIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

const totalReviews = centers.reduce((sum, c) => sum + c.googleRating.count, 0);

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 text-amber ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={i < Math.round(value) ? "" : "opacity-25"} />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="opiniones" className="border-b border-line bg-ink py-20 text-paper sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <Eyebrow tone="amber">Opiniones</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Lo que opinan quienes ya han pasado por aquí
            </h2>

            <div className="mt-8 flex items-center gap-4">
              <span className="font-display text-5xl font-bold">
                {siteConfig.rating.value.toLocaleString("es-ES", { minimumFractionDigits: 1 })}
              </span>
              <div>
                <Stars value={siteConfig.rating.value} />
                <p className="mt-1 text-sm text-paper/60">
                  Valoración media en {siteConfig.rating.source} · {totalReviews} reseñas
                </p>
              </div>
            </div>

            <ul className="mt-8 max-w-sm divide-y divide-paper/10 border-y border-paper/10">
              {centers.map((center) => (
                <li key={center.slug} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-paper/80">{center.zoneLabel}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">
                      {center.googleRating.value.toLocaleString("es-ES", { minimumFractionDigits: 1 })}
                    </span>
                    <StarIcon className="h-3.5 w-3.5 text-amber" />
                    <span className="text-paper/50">({center.googleRating.count})</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-paper/40">
              Lo que más se repite en las reseñas
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {reviewTopics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-paper/20 px-3 py-1 text-sm text-paper/80"
                >
                  {topic}
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-sm text-xs text-paper/40">
              Datos de las fichas de {siteConfig.rating.source} de cada centro, consultados en{" "}
              {siteConfig.rating.checkedAt}.
            </p>
            <a
              href={siteConfig.google.profileSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center rounded-sm border border-paper/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-paper"
            >
              Ver opiniones en Google
            </a>
          </Reveal>

          <Reveal delay={100} className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <figure
                key={t.author}
                className="flex flex-col justify-between rounded-sm border border-paper/15 bg-paper/[0.03] p-6"
              >
                <div>
                  <Stars value={5} />
                  <blockquote className="mt-4 text-base leading-relaxed text-paper/90">
                    “{t.quote}”
                  </blockquote>
                </div>
                <figcaption className="mt-6 border-t border-paper/10 pt-4 text-sm">
                  <span className="font-semibold">{t.author}</span>
                  <span className="text-paper/50">
                    {" "}
                    · {t.center} · Permiso {t.permit}
                  </span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
