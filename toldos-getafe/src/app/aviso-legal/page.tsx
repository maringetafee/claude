import type { Metadata } from "next";
import Prose from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Aviso legal",
  robots: { index: false, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <main id="main" className="px-6 pb-20 pt-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl">
          Aviso legal
        </h1>
        <Prose>
          <p>
            En cumplimiento de la Ley 34/2002, de 11 de julio, de
            Servicios de la Sociedad de la Información y de Comercio
            Electrónico (LSSICE), se informa de los siguientes datos:
          </p>
          <ul>
            <li>Titular: TOLDOS GETAFE, S.L.</li>
            <li>CIF: B80852478</li>
            <li>Dirección: Calle Batres, 22 – 28904 Getafe (Madrid)</li>
            <li>Teléfono: 916 96 37 34</li>
            <li>Correo electrónico: comercial@toldosgetafe.es</li>
          </ul>

          <h2>Condiciones generales de uso</h2>
          <p>
            El acceso y uso de este sitio web atribuye la condición de
            usuario y supone la aceptación de las condiciones aquí
            establecidas. El usuario se compromete a hacer un uso
            adecuado de los contenidos y servicios que Toldos Getafe
            ofrece a través de su sitio web.
          </p>

          <h2>Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del sitio web, incluyendo textos,
            fotografías, gráficos, imágenes y logotipos, son propiedad de
            TOLDOS GETAFE, S.L. o de terceros que han autorizado su uso, y
            están protegidos por la normativa de propiedad intelectual e
            industrial. Queda prohibida su reproducción total o parcial
            sin autorización expresa.
          </p>

          <h2>Responsabilidad</h2>
          <p>
            TOLDOS GETAFE, S.L. no se hace responsable de los daños y
            perjuicios que pudieran derivarse de interferencias,
            interrupciones, fallos técnicos o desconexiones en el
            funcionamiento del sitio web, ni de la utilización que los
            usuarios hagan de la información contenida en el mismo.
          </p>

          <h2>Enlaces</h2>
          <p>
            En el caso de que el sitio web contenga enlaces a otros
            sitios de terceros, TOLDOS GETAFE, S.L. no ejerce ningún tipo
            de control sobre dichos sitios y contenidos. En ningún caso
            asumirá responsabilidad alguna por los contenidos de un
            enlace perteneciente a un sitio web ajeno.
          </p>

          <h2>Protección de datos personales</h2>
          <p>
            Los datos personales recabados a través de este sitio web se
            tratan conforme a lo establecido en nuestra{" "}
            <a
              href="/politica-de-privacidad/"
              className="underline underline-offset-2 hover:text-accent-soft"
            >
              Política de Privacidad
            </a>
            .
          </p>

          <h2>Ley aplicable y jurisdicción</h2>
          <p>
            Las presentes condiciones se rigen por la legislación
            española. Para cualquier controversia derivada del acceso o
            uso de este sitio web, las partes se someten a los Juzgados y
            Tribunales de Madrid, salvo que la normativa aplicable
            disponga otra cosa.
          </p>
        </Prose>
      </div>
    </main>
  );
}
