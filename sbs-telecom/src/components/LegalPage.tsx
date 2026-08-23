import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Footer } from "./Footer";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-bone-100/10 px-6 py-6 lg:px-10">
        <Link href="/" className="inline-flex text-bone-100">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-20 lg:px-0">
        <h1 className="font-display text-4xl font-bold tracking-tight text-bone-100">{title}</h1>
        <div className="prose-legal mt-10 space-y-5 text-bone-400">{children}</div>
      </main>
      <Footer />
    </>
  );
}
