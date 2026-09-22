import type { Metadata } from "next";
import { PageHero } from "@/components/shop/PageHero";
import { RecoverForm } from "../AuthForms";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecoverPage() {
  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/cuenta/entrar", label: "Mi cuenta" }, { label: "Recuperar contraseña" }]} title="Recuperar contraseña" />
      <section className="shop account">
        <div className="container">
          <div className="auth-card">
            <p className="auth__intro">Escribe el email con el que te registraste y te enviaremos un enlace para elegir una contraseña nueva.</p>
            <RecoverForm />
          </div>
        </div>
      </section>
    </main>
  );
}
