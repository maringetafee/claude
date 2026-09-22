import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/shop/PageHero";
import { getCurrentCustomer, safeNext } from "@/lib/customer";
import { AuthPanel } from "../AuthForms";

export const metadata: Metadata = {
  title: "Mi cuenta · Acceso",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string; modo?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const { next, modo } = await searchParams;
  const target = safeNext(next);
  if (await getCurrentCustomer()) redirect(target);

  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/", label: "Inicio" }, { label: "Mi cuenta" }]} title="Mi cuenta" />
      <section className="shop account">
        <div className="container">
          <div className="auth-card">
            <AuthPanel mode={modo === "registro" ? "registro" : "entrar"} next={target} />
          </div>
        </div>
      </section>
    </main>
  );
}
