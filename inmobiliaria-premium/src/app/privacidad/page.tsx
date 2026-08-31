import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        {siteConfig.name} es responsable del tratamiento de los datos
        personales que nos facilites a través de los formularios de este
        sitio web, con la única finalidad de gestionar tu solicitud de
        información sobre nuestras propiedades y servicios.
      </p>
      <p>
        No cederemos tus datos a terceros salvo obligación legal. Puedes
        ejercer tus derechos de acceso, rectificación, supresión y
        oposición escribiendo a {siteConfig.email}.
      </p>
      <p>
        Conservaremos tus datos mientras exista una relación comercial
        activa o durante los plazos legalmente exigibles, de acuerdo con el
        Reglamento General de Protección de Datos (RGPD).
      </p>
    </LegalPage>
  );
}
