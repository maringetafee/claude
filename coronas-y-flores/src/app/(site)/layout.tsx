import "./site.css";
import type { ReactNode } from "react";
import { CartToast } from "@/components/site/CartToast";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteMotion } from "@/components/site/SiteMotion";
import { getSiteContent } from "@/lib/site-data";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <div aria-hidden="true" className="noise" />
      <div aria-hidden="true" className="scroll-progress" />
      <div aria-hidden="true" className="cursor-ring" />
      <div aria-hidden="true" className="cursor-dot" />
      <Header />
      {children}
      <Footer content={content} />
      <CartToast />
      <SiteMotion />
    </>
  );
}
