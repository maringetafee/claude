import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import PageCTA from "@/components/ui/PageCTA";
import { toldos } from "@/data/images";

export const metadata: Metadata = {
  title: "Toldos portada",
  description:
    "Toldos portada o de punto recto a medida en Madrid: la solución tradicional para protección solar en ventanas, balcones y puertas.",
};

export default function PortadaPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Toldos / Portada"
        title="Toldos portada"
        subtitle="Los mejores toldos para ventanas."
      />

      <div className="px-6 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Prose>
            <p>
              El toldo portada, también conocido como toldo de punto
              recto, es uno de los sistemas más tradicionales y efectivos
              para la protección solar en ventanas, balcones y puertas. A
              lo largo del tiempo, ha evolucionado en diseño, calidad y
              seguridad, convirtiéndose en una opción preferida tanto en
              entornos residenciales como comerciales.
            </p>

            <h2>Características principales</h2>
            <p>
              <strong>Diseño y longitud de los brazos:</strong> la
              longitud de los brazos es crucial en estos toldos, ya que
              determina su extensión o salida. Los brazos se anclan
              firmemente a la pared, formando un ángulo recto con
              respecto a la vertical. Esta configuración permite una
              protección eficaz contra el sol y proporciona una
              estructura estable.
            </p>
            <p>
              <strong>Cobertura completa:</strong> cuando están abiertos y
              en posición vertical, los toldos portada prácticamente
              cubren por completo la ventana. Esta característica los
              convierte en una opción excelente para maximizar la sombra
              y la privacidad.
            </p>
            <p>
              <strong>Usos comunes:</strong> los toldos de punto recto son
              los más utilizados en ventanas, superando a los toldos
              extensibles en popularidad debido a su simplicidad y
              efectividad. También son una alternativa práctica a las
              capotas, que aunque originales y estéticamente atractivas,
              no siempre ofrecen la misma cobertura y funcionalidad.
            </p>

            <h2>Beneficios adicionales</h2>
            <p>
              <strong>Protección y privacidad:</strong> además de proteger
              contra los rayos solares, estos toldos ofrecen una barrera
              efectiva contra las miradas indiscretas, lo que mejora la
              privacidad en espacios habitacionales y de trabajo.
            </p>
            <p>
              <strong>Calidad y seguridad:</strong> con los avances en
              materiales y mecanismos, los toldos portada actuales son
              más duraderos y seguros. Los tejidos modernos y los
              sistemas de anclaje robustos aseguran una larga vida útil y
              resistencia a las inclemencias del tiempo.
            </p>
            <p>
              <strong>Opciones de personalización:</strong> los toldos
              portada pueden incorporar cofres para proteger la lona
              cuando está recogida, así como sistemas de motorización
              para facilitar su apertura y cierre.
            </p>

            <p>
              En resumen, los toldos portada o de punto recto son una
              solución clásica que ha sabido adaptarse a las exigencias
              modernas. Ofrecen una excelente protección solar,
              privacidad y se adaptan bien a diferentes estilos
              arquitectónicos.
            </p>
          </Prose>

          <div className="relative aspect-square w-full self-start overflow-hidden rounded-2xl lg:sticky lg:top-28">
            <Image
              src={toldos.portadaHero.src}
              alt={toldos.portadaHero.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <p className="text-sm text-paper/60">
            Disponible también con{" "}
            <Link
              href="/toldos/cofres"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              cofre de protección
            </Link>
            . Consulta el resto de{" "}
            <Link
              href="/toldos"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              toldos a medida
            </Link>
            .
          </p>
        </div>
      </div>

      <PageCTA />
    </main>
  );
}
