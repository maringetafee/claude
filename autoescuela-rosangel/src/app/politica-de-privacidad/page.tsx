import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import PendingNotice from "@/components/ui/PendingNotice";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main id="main" className="px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10">
      <Container className="max-w-3xl px-0">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Política de privacidad</h1>
        <div className="mt-8">
          <PendingNotice />
          <Prose>
            <p>
              Esta política describe cómo {siteConfig.name} trata los datos
              personales que nos facilitas a través del formulario de
              contacto de esta web.
            </p>

            <h2>Responsable del tratamiento</h2>
            <ul>
              <li>Responsable: {siteConfig.legalName} [PENDIENTE — confirmar razón social]</li>
              <li>NIF/CIF: [PENDIENTE]</li>
              <li>Contacto: [PENDIENTE — email o dirección de contacto del responsable]</li>
            </ul>

            <h2>¿Qué datos tratamos?</h2>
            <p>
              Cuando rellenas el formulario de contacto tratamos: nombre,
              teléfono, permiso de interés, centro preferido y el mensaje
              que decidas escribirnos.
            </p>

            <h2>¿Con qué finalidad?</h2>
            <p>
              Gestionar tu solicitud de información sobre nuestros cursos y
              permisos, y contactar contigo para dar respuesta a tu
              consulta.
            </p>

            <h2>¿Cuál es la legitimación?</h2>
            <p>
              El consentimiento que nos das al marcar la casilla del
              formulario y enviarlo voluntariamente.
            </p>

            <h2>¿Durante cuánto tiempo conservamos tus datos?</h2>
            <p>
              Durante el tiempo necesario para atender tu solicitud y, salvo
              que nos pidas lo contrario, mientras exista una relación
              comercial o el interés en ella.
            </p>

            <h2>¿A qué destinatarios se comunicarán tus datos?</h2>
            <p>
              El formulario de esta web se procesa a través de Netlify Forms
              (proveedor de hosting del sitio). No se ceden datos a terceros
              salvo obligación legal.
            </p>

            <h2>¿Cuáles son tus derechos?</h2>
            <p>
              Tienes derecho a acceder, rectificar y suprimir tus datos, así
              como otros derechos reconocidos por el RGPD, escribiendo al
              contacto indicado arriba. [PENDIENTE — completar procedimiento
              exacto de ejercicio de derechos con el cliente]
            </p>
          </Prose>
        </div>
      </Container>
    </main>
  );
}
