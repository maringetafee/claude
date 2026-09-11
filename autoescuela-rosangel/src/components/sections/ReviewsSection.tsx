import { siteConfig } from "@/lib/site-config";
import { StarIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

export default function ReviewsSection() {
  return (
    <section id="opiniones" className="border-b border-line bg-ink py-20 text-paper sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <Eyebrow tone="amber">Opiniones</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Lo que opinan quienes ya han pasado por aquí
            </h2>

            <div className="mt-8 flex items-center gap-4">
              <span className="font-display text-5xl font-bold">
                {siteConfig.rating.value.toFixed(1)}
              </span>
              <div>
                <div className="flex gap-0.5 text-amber" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className={i < Math.round(siteConfig.rating.value) ? "" : "opacity-25"} />
                  ))}
                </div>
                <p className="mt-1 text-sm text-paper/60">
                  Valoración media en directorios públicos · {siteConfig.rating.count} opiniones
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xs text-paper/40">
              Dato agregado de perfiles públicos (Google y directorios locales), pendiente de
              verificación en vivo — puede haber variado desde entonces.
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
            <div className="rounded-sm border border-paper/15 bg-paper/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-paper/40">
                Patrón repetido en las opiniones
              </p>
              <p className="mt-3 text-lg font-medium">
                Trato cercano y mucha paciencia con el alumnado.
              </p>
            </div>
            <div className="rounded-sm border border-paper/15 bg-paper/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-paper/40">
                Patrón repetido en las opiniones
              </p>
              <p className="mt-3 text-lg font-medium">
                Clases prácticas que intentan adaptarse a tu horario.
              </p>
            </div>
            <div className="rounded-sm border border-dashed border-paper/20 p-6 sm:col-span-2">
              <p className="text-sm text-paper/50">
                Próximamente: reseñas reales de nuestros alumnos, citadas con su permiso. Si eres
                alumno/a de Rosangel y quieres compartir tu experiencia, escríbenos por WhatsApp.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
