import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shop/PageHero";
import { ResetForm } from "../AuthForms";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/cuenta/entrar", label: "Mi cuenta" }, { label: "Nueva contraseña" }]} title="Nueva contraseña" />
      <section className="shop account">
        <div className="container">
          <div className="auth-card">
            {token ? (
              <ResetForm token={token} />
            ) : (
              <p className="auth__intro">
                El enlace no es válido. <Link href="/cuenta/recuperar">Pide uno nuevo</Link>.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
