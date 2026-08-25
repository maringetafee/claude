import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import PageCTA from "@/components/ui/PageCTA";
import { toldos } from "@/data/images";

export const metadata: Metadata = {
  title: "Toldos con cofre",
  description:
    "Toldos con cofre a medida en Madrid: protegen la lona y la estructura cuando no están en uso, disponibles en versión extensible, portada y vertical.",
};

export default function CofresPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Toldos / Cofre"
        title="Toldos con cofre"
        subtitle="Mantén tu lona en perfecto estado y tu espacio siempre listo para disfrutar."
      />

      <div className="px-6 pb-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <Prose>
            <p>
              Los toldos con cofre son la solución perfecta para quienes
              buscan combinar funcionalidad y estética en sus espacios
              exteriores. Este tipo de toldo se caracteriza por tener un
              cofre que protege la estructura y la lona cuando no están en
              uso, prolongando su vida útil y manteniéndolos en perfectas
              condiciones. Existen varios tipos de toldos que pueden
              incorporar esta tecnología, adaptándose a diversas
              necesidades y gustos.
            </p>

            <h2>Toldos extensibles con cofre</h2>
            <p>
              Estos toldos son ideales para cubrir grandes superficies y
              ofrecer una excelente protección solar. El cofre guarda
              tanto los brazos extensibles como la tela, protegiéndolos de
              las inclemencias del tiempo y del polvo. Esto asegura que el
              toldo se mantenga en óptimas condiciones, evitando el
              desgaste prematuro de los materiales.
            </p>

            <h2>Toldos portada con cofre</h2>
            <p>
              A diferencia de los toldos extensibles, en los toldos
              portada el cofre protege únicamente la lona, dejando los
              brazos expuestos, ya que estos van anclados a la pared.
              Estos toldos son muy comunes en ventanas.
            </p>

            <h2>Toldos verticales con cofre</h2>
            <p>
              Los toldos verticales, al no tener brazos, se caracterizan
              por su capacidad de resguardar la tela dentro del cofre
              cuando el toldo está recogido. Este tipo de toldo es ideal
              para ventanas y balcones, ofreciendo una excelente
              protección contra el sol y mejorando la privacidad sin
              ocupar mucho espacio.
            </p>

            <p>
              En resumen, los toldos con cofre, ya sean extensibles,
              portada o verticales, ofrecen una protección superior y una
              estética cuidada para cualquier espacio exterior. Elegir el
              tipo adecuado dependerá de tus necesidades específicas y del
              estilo de tu hogar.
            </p>
          </Prose>

          <div className="relative aspect-[4/3] w-full self-start overflow-hidden rounded-2xl lg:sticky lg:top-28">
            <Image
              src={toldos.cofreHero.src}
              alt={toldos.cofreHero.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <p className="text-sm text-paper/60">
            Disponible sobre{" "}
            <Link
              href="/toldos/extensibles"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              toldos extensibles
            </Link>{" "}
            y{" "}
            <Link
              href="/toldos/portada"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              toldos portada
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
