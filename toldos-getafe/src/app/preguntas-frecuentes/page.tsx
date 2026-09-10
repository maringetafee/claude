import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PageCTA from "@/components/ui/PageCTA";
import { faq } from "@/data/faq";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Dudas habituales sobre toldos y pérgolas a medida: permisos de comunidad, mantenimiento, garantía de la lona, motorización, ayudas a la eficiencia energética y zona de instalación en Madrid Sur.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.pregunta,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.respuesta,
    },
  })),
};

export default function PreguntasFrecuentesPage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Todo lo que sueles preguntarnos antes de encargar"
        subtitle="Permisos, mantenimiento, garantía, motorización y zona de instalación."
      />

      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {faq.map((item) => (
            <details
              key={item.pregunta}
              name="faq"
              className="group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-display text-lg text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] marker:content-none">
                {item.pregunta}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-accent-soft transition-transform duration-300 group-open:rotate-45"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="pb-6 text-sm leading-relaxed text-paper/80 sm:text-base">
                {item.respuesta}
              </p>
            </details>
          ))}
        </div>
      </div>

      <PageCTA
        title="¿Tienes otra duda? Cuéntanosla."
        ctaLabel="Solicitar presupuesto"
      />
    </main>
  );
}
