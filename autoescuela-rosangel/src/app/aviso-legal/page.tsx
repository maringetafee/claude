import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import PendingNotice from "@/components/ui/PendingNotice";
import { siteConfig, centers } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Aviso legal",
  robots: { index: false, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <main id="main" className="px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
      <Container className="max-w-3xl px-0">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Aviso legal</h1>
        <div className="mt-8">
          <PendingNotice />
          <Prose>
            <p>
              En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios
              de la Sociedad de la Información y de Comercio Electrónico
              (LSSICE), se informa de los siguientes datos:
            </p>
            <ul>
              <li>Titular: {siteConfig.legalName} [PENDIENTE — confirmar razón social exacta]</li>
              <li>NIF/CIF: [PENDIENTE]</li>
              <li>Domicilio: {centers[0].addressLine} [PENDIENTE — confirmar domicilio fiscal]</li>
              <li>Teléfono: {siteConfig.phone.display}</li>
              <li>Correo electrónico: [PENDIENTE]</li>
            </ul>

            <h2>Condiciones generales de uso</h2>
            <p>
              El acceso y uso de este sitio web atribuye la condición de
              usuario y supone la aceptación de las condiciones aquí
              establecidas. El usuario se compromete a hacer un uso adecuado
              de los contenidos y servicios que {siteConfig.name} ofrece a
              través de su sitio web.
            </p>

            <h2>Propiedad intelectual e industrial</h2>
            <p>
              Los contenidos propios de este sitio web (textos, diseño y
              estructura) son propiedad de {siteConfig.name} o de terceros
              que han autorizado su uso. Queda prohibida su reproducción
              total o parcial sin autorización expresa.
            </p>

            <h2>Responsabilidad</h2>
            <p>
              {siteConfig.name} no se hace responsable de los daños y
              perjuicios que pudieran derivarse de interferencias,
              interrupciones, fallos técnicos o desconexiones en el
              funcionamiento del sitio web.
            </p>

            <h2>Protección de datos personales</h2>
            <p>
              Los datos personales recabados a través de este sitio web se
              tratan conforme a lo establecido en nuestra{" "}
              <a href="/politica-de-privacidad/" className="underline underline-offset-2 hover:text-signal">
                Política de Privacidad
              </a>
              .
            </p>

            <h2>Ley aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación
              española. Para cualquier controversia, las partes se someten a
              los Juzgados y Tribunales que correspondan según la normativa
              aplicable.
            </p>
          </Prose>
        </div>
      </Container>
    </main>
  );
}
