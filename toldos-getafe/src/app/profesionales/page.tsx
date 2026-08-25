import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import PageCTA from "@/components/ui/PageCTA";
import { fabrica } from "@/data/images";

export const metadata: Metadata = {
  title: "Fabricante para profesionales",
  description:
    "Toldos Getafe, fabricante de toldos y pérgolas para instaladores y distribuidores en Madrid: precios competitivos, descuentos por volumen, facilidades de pago y soporte postventa.",
};

const ventajas = [
  {
    titulo: "Calidad garantizada",
    texto:
      "Utilizamos materiales de alta calidad para asegurar la durabilidad y funcionalidad de nuestros productos.",
  },
  {
    titulo: "Personalización",
    texto:
      "Ofrecemos soluciones a medida que se adaptan a las especificaciones y necesidades de cada cliente.",
  },
  {
    titulo: "Innovación",
    texto:
      "Estamos constantemente innovando para ofrecer las últimas tendencias y tecnologías en el mercado de toldos y pérgolas.",
  },
  {
    titulo: "Soporte profesional",
    texto:
      "Proporcionamos soporte técnico y asesoramiento para asegurarnos de que cada instalación sea un éxito.",
  },
];

const servicios = [
  {
    titulo: "Facilidades de pago",
    texto:
      "Contacta con nuestro departamento comercial para informarte sobre las condiciones de venta, pagos y entrega.",
  },
  {
    titulo: "Soporte postventa",
    texto:
      "Asistencia continua para resolver cualquier problema que pueda surgir después de la instalación.",
  },
  {
    titulo: "Descuentos por volumen",
    texto:
      "Precios especiales para pedidos al por mayor, permitiéndote maximizar tus márgenes de ganancia.",
  },
];

export default function ProfesionalesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Profesionales"
        title="Fabricamos toldos por encargo para instaladores profesionales"
        subtitle="Descubre nuestras soluciones para instaladores y distribuidores."
      />

      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Prose>
            <p>
              En Toldos Getafe, somos el fabricante de toldos y pérgolas
              para el profesional que necesitas para ofrecer productos de
              alta calidad a tus clientes. Nuestra misión es proporcionar
              a los instaladores y distribuidores soluciones duraderas y
              estéticamente atractivas que faciliten su trabajo y
              satisfagan las demandas del mercado.
            </p>
            <h2>Fabricante de toldos para instaladores</h2>
            <p>
              Como instalador de toldos, sabes lo importante que es
              contar con productos confiables y de calidad. Fabricamos
              toldos a medida que se ajustan a las especificaciones de
              tus proyectos: toldos retráctiles, de lona, motorizados y
              más, todos diseñados para satisfacer las necesidades de tus
              clientes.
            </p>
            <h2>Pérgolas de alta calidad para distribuidores</h2>
            <p>
              Además de nuestros toldos, ofrecemos una línea completa de
              pérgolas perfectas para cualquier espacio exterior.
              Nuestros productos destacan por su durabilidad y diseño
              innovador, una opción ideal para distribuidores que buscan
              añadir valor a su catálogo.
            </p>
          </Prose>

          <div className="relative aspect-[4/3] w-full self-start overflow-hidden rounded-2xl lg:sticky lg:top-28">
            <Image
              src={fabrica.profesionalesHero.src}
              alt={fabrica.profesionalesHero.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-2xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-3xl">
            Ventajas de elegir Toldos Getafe como tu fabricante en Madrid
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ventajas.map((v) => (
              <div
                key={v.titulo}
                className="rounded-2xl border border-white/10 bg-ink/35 p-6 backdrop-blur-md"
              >
                <h3 className="font-display text-lg text-paper">
                  {v.titulo}
                </h3>
                <p className="mt-2 text-sm text-paper/70">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-2xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-3xl">
            Servicios adicionales para profesionales
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {servicios.map((s) => (
              <div
                key={s.titulo}
                className="rounded-2xl border border-white/10 bg-ink/35 p-6 backdrop-blur-md"
              >
                <h3 className="font-display text-lg text-accent-soft">
                  {s.titulo}
                </h3>
                <p className="mt-2 text-sm text-paper/70">{s.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-2xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-3xl">
            Nuestras instalaciones
          </h2>
          <p className="mt-3 max-w-2xl text-paper/70">
            No somos solo instaladores: fabricamos cada toldo y pérgola en
            nuestro propio taller de Madrid.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fabrica.taller.map((img) => (
              <div
                key={img.src}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageCTA
        title="Contacta con nosotros"
        ctaLabel="Solicitar condiciones"
      />
    </main>
  );
}
