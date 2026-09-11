import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resolvemos las dudas más habituales sobre sacarte el carnet en Getafe con Autoescuela Rosangel: permisos, teórica, prácticas, horarios y más.",
  alternates: { canonical: "/preguntas-frecuentes/" },
};

export default function FaqPage() {
  return (
    <main id="main">
      <div className="border-b border-line bg-paper pb-4 pt-28 sm:pt-32">
        <Container className="max-w-2xl">
          <Eyebrow>Ayuda</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
            Preguntas frecuentes
          </h1>
        </Container>
      </div>
      <FaqSection />
      <ContactSection />
    </main>
  );
}
