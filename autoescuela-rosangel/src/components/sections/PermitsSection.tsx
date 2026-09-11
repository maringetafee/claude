import Image from "next/image";
import Link from "next/link";
import { permits } from "@/data/permits";
import { whatsappHref, whatsappMessages } from "@/lib/site-config";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

const messageByCode = {
  B: whatsappMessages.permitB,
  A2: whatsappMessages.permitA2,
};

export default function PermitsSection() {
  return (
    <section id="permisos" className="border-b border-line bg-paper py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>Permisos</Eyebrow>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            ¿Qué carnet quieres sacarte?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {permits.map((permit, i) => (
            <Reveal key={permit.slug} delay={i * 100}>
              <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-paper transition-colors hover:border-ink/30">
                <div className="relative aspect-[16/9] overflow-hidden bg-paper-soft">
                  <Image
                    src={permit.image.src}
                    alt={permit.image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-8 sm:p-10">
                  <div>
                    <span
                      className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                        permit.code === "B"
                          ? "bg-signal-soft text-signal-dark"
                          : "bg-amber-soft text-amber-dark"
                      }`}
                    >
                      Permiso {permit.code}
                    </span>
                    <h3 className="mt-5 font-display text-3xl font-bold">
                      {permit.name}
                    </h3>
                    <p className="mt-2 text-ink-soft">{permit.subtitle}</p>

                    <ul className="mt-6 space-y-2.5">
                      {permit.canDrive.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                          <CheckIcon
                            className={`mt-0.5 shrink-0 ${
                              permit.code === "B" ? "text-signal" : "text-amber"
                            }`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                    <Link
                      href={`/permisos/${permit.slug}/`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-signal"
                    >
                      Ver el proceso completo
                      <ArrowIcon />
                    </Link>
                    <a
                      href={whatsappHref(messageByCode[permit.code])}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto inline-flex items-center rounded-sm border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
                    >
                      Quiero información
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
