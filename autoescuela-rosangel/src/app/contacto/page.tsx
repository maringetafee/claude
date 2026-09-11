import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con Autoescuela Rosangel en Getafe: WhatsApp, teléfono o formulario. Te informamos sobre el permiso B y A2 sin compromiso.",
  alternates: { canonical: "/contacto/" },
};

export default function ContactoPage() {
  return (
    <main id="main">
      <div className="border-b border-line bg-paper pb-4 pt-28 sm:pt-32">
        <Container className="max-w-2xl">
          <Eyebrow>Contacto</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
            Cuéntanos qué necesitas
          </h1>
        </Container>
      </div>
      <ContactSection />
    </main>
  );
}
