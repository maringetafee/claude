import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import PageCTA from "@/components/ui/PageCTA";
import { toldos } from "@/data/images";

export const metadata: Metadata = {
  title: "Toldos extensibles",
  description:
    "Toldos extensibles o de brazos articulados a medida en Madrid: protección solar adaptable, motorizables, fabricados con materiales de alta calidad.",
};

export default function ExtensiblesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Toldos / Extensibles"
        title="Toldos extensibles"
        subtitle="Los toldos extensibles ofrecen una solución flexible y elegante para proporcionar sombra y protección."
      />

      <div className="px-6 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Prose>
            <p>
              Los toldos extensibles, también conocidos como toldos de
              brazos articulados, son una opción popular y práctica para
              proteger terrazas, balcones y fachadas del sol y la lluvia.
              Estos toldos combinan funcionalidad, durabilidad y estética,
              haciendo que sean una excelente elección tanto para hogares
              como para negocios.
            </p>

            <h2>Características principales</h2>
            <p>
              Los brazos articulados permiten ajustar el ángulo y la
              extensión del toldo, proporcionando una sombra adaptable a
              cualquier momento del día y estación del año. Esta
              flexibilidad te permite controlar la cantidad de sombra y
              proteger tus espacios exteriores según tus necesidades.
            </p>

            <h3>Durabilidad y resistencia</h3>
            <p>
              Fabricados con materiales de alta calidad, como el aluminio,
              los toldos extensibles son ligeros y robustos. Esta
              combinación asegura que soporten las condiciones climáticas
              adversas y mantengan su funcionalidad a lo largo del tiempo.
              Además, su diseño facilita una instalación sencilla y rápida.
            </p>

            <h3>Automatización y comodidad</h3>
            <p>
              Estos toldos pueden motorizarse y automatizarse, permitiendo
              un control cómodo y eficiente mediante mando a distancia o
              sensores automáticos que ajustan el toldo según las
              condiciones climáticas. También están disponibles opciones
              manuales para quienes prefieran una operación tradicional.
            </p>

            <h2>Beneficios de los toldos de brazos articulados</h2>
            <p>
              <strong>Protección y confort:</strong> los toldos extensibles
              protegen tus espacios exteriores del sol, la lluvia y el
              viento, creando un ambiente agradable y fresco. Esta
              protección no solo mejora tu confort, sino que también
              prolonga la vida útil de tus muebles y decoraciones
              exteriores.
            </p>
            <p>
              <strong>Estética y personalización:</strong> disponibles en
              una amplia variedad de colores y estilos, los toldos
              extensibles se integran armoniosamente con la estética de
              cualquier fachada, añadiendo un toque de elegancia y
              modernidad.
            </p>
            <p>
              <strong>Maximización del espacio exterior:</strong> instalar
              un toldo extensible te permite aprovechar al máximo tus
              espacios exteriores durante todo el año, ya sea para un
              desayuno al aire libre, una tarde de lectura en el balcón o
              una reunión con amigos en la terraza.
            </p>
          </Prose>

          <div className="relative aspect-[4/3] w-full self-start overflow-hidden rounded-2xl lg:sticky lg:top-28">
            <Image
              src={toldos.extensible.src}
              alt={toldos.extensible.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <p className="text-sm text-paper/60">
            También disponibles con{" "}
            <Link
              href="/toldos/cofres"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              cofre de protección
            </Link>
            . Consulta también nuestros{" "}
            <Link
              href="/toldos/portada"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              toldos portada
            </Link>{" "}
            y el resto de{" "}
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
