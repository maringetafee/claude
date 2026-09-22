import "./site.css";
import type { ReactNode } from "react";
import { CartToast } from "@/components/site/CartToast";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteMotion } from "@/components/site/SiteMotion";
import { getSaleProducts } from "@/lib/catalog";
import { getSiteContent } from "@/lib/site-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [content, sale] = await Promise.all([getSiteContent(), getSaleProducts()]);
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <div aria-hidden="true" className="noise" />
      <div aria-hidden="true" className="scroll-progress" />
      <div aria-hidden="true" className="cursor-ring" />
      <div aria-hidden="true" className="cursor-dot" />
      <Header hasOffers={sale.length > 0} />
      {children}
      <Footer content={content} />
      <CartToast />
      <SiteMotion />
    </>
  );
}
