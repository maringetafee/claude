import { siteConfig } from "@/lib/site-config";
import { reviews } from "@/data/reviews";
import Reveal from "@/components/ui/Reveal";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex text-accent-soft"
      aria-label={`${rating.toLocaleString("es-ES")} de 5 estrellas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.8 6.2 20.8l1.1-6.4L2.6 9.8l6.5-.9L12 3z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsSection() {
  const { rating, reviewCount, profileUrl } = siteConfig.google;

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center p-5 text-paper sm:p-8 lg:h-[82vh] lg:min-h-0 lg:p-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="[text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
            Opiniones
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
            Lo que dicen nuestros clientes.
          </h2>
        </div>

        <Reveal>
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-4 rounded-2xl border border-white/15 bg-ink/45 px-5 py-4 backdrop-blur-md transition-colors hover:border-accent-soft"
          >
            <span className="font-display text-3xl leading-none">
              {rating.toLocaleString("es-ES")}
            </span>
            <span>
              <Stars rating={rating} />
              <span className="mt-1 block text-xs text-paper/70">
                {reviewCount} reseñas en Google
              </span>
            </span>
            <span className="ml-2 text-sm text-accent-soft">Ver perfil →</span>
          </a>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal key={`${r.author}-${i}`} delay={i * 80} as="div">
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink/40 p-5 backdrop-blur-md">
                <Stars rating={r.rating} />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-paper/85">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4 text-xs text-paper/60">
                  <span className="font-medium text-paper/80">{r.author}</span>
                  <br />
                  {r.context}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-paper/50">
          Selección de opiniones publicadas en nuestro perfil de Google.
        </p>
      </div>
    </div>
  );
}
