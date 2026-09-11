import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "ink" }) {
  return (
    <nav aria-label="Migas de pan">
      <ol className={`crumbs${tone === "ink" ? " crumbs--ink" : ""}`}>
        {items.map((c, i) => (
          <li key={i}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  compact,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  compact?: boolean;
}) {
  return (
    <section className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <div className="container">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  );
}
