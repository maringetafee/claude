import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Aviso legal" };

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y Comercio Electrónico, se informa que este sitio web es
        titularidad de {siteConfig.name}, con domicilio en{" "}
        {siteConfig.address} y correo de contacto {siteConfig.email}.
      </p>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario e
        implica la aceptación de las condiciones aquí establecidas. La
        información sobre propiedades publicada en este sitio tiene carácter
        orientativo y no constituye oferta vinculante.
      </p>
      <p>
        Todos los contenidos del sitio, incluyendo textos, fotografías y
        diseño, son propiedad de {siteConfig.name} o de terceros que han
        autorizado su uso, y están protegidos por la normativa de propiedad
        intelectual e industrial.
      </p>
    </LegalPage>
  );
}
