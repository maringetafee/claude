import type { Metadata } from "next";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: { index: false, follow: true },
};

export default function PoliticaPrivacidadPage() {
  return (
    <main id="main" className="px-6 pb-20 pt-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl">
          Política de privacidad
        </h1>
        <Prose>
          <p>
            En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley
            Orgánica 3/2018, de Protección de Datos Personales y garantía
            de los derechos digitales (LOPD-GDD), le informamos sobre el
            tratamiento de sus datos personales.
          </p>

          <h2>Responsable del tratamiento</h2>
          <ul>
            <li>Responsable: TOLDOS GETAFE, S.L.</li>
            <li>CIF: B80852478</li>
            <li>Dirección: Calle Batres, 22 – 28904 Getafe (Madrid)</li>
            <li>Teléfono: 916 96 37 34</li>
            <li>Correo electrónico: comercial@toldosgetafe.es</li>
          </ul>

          <h2>Finalidad del tratamiento</h2>
          <p>
            Los datos personales facilitados a través del formulario de
            contacto se utilizan para gestionar, estudiar y responder a
            las consultas y solicitudes de presupuesto recibidas, y, si
            el usuario lo autoriza expresamente, para enviarle
            comunicaciones comerciales por correo electrónico o teléfono.
          </p>

          <h2>Legitimación</h2>
          <p>
            La base legal para el tratamiento de sus datos es el
            consentimiento del interesado, prestado al marcar la casilla
            correspondiente en el formulario de contacto.
          </p>

          <h2>Destinatarios</h2>
          <p>
            No se cederán datos a terceros, salvo obligación legal.
          </p>

          <h2>Conservación de los datos</h2>
          <p>
            Los datos se conservarán mientras no se solicite su supresión
            por el usuario.
          </p>

          <h2>Derechos de los interesados</h2>
          <p>
            Puede ejercer sus derechos de acceso, rectificación,
            supresión, limitación, oposición y portabilidad dirigiéndose
            por escrito a TOLDOS GETAFE, S.L., en la dirección o el
            correo electrónico indicados más arriba. Asimismo, tiene
            derecho a presentar una reclamación ante la Agencia Española
            de Protección de Datos (C/ Jorge Juan, 6 — 28001 Madrid,{" "}
            <a
              href="https://www.aepd.es"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              www.aepd.es
            </a>
            ) si considera que el tratamiento no se ajusta a la normativa
            vigente.
          </p>

          <h2>Decisiones automatizadas</h2>
          <p>
            No se realizan decisiones automatizadas ni elaboración de
            perfiles a partir de los datos facilitados.
          </p>
        </Prose>
      </div>
    </main>
  );
}
