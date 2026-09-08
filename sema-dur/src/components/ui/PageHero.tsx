import type { ReactNode } from "react";
import { Container } from "./Section";
import Breadcrumbs from "./Breadcrumbs";

export default function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  children,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  breadcrumbs?: { name: string; href?: string }[];
  children?: ReactNode;
  align?: "start" | "center";
}) {
  return (
    <div className="border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <Container className="py-10 sm:py-14">
        {breadcrumbs ? (
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
        ) : null}
        <div
          className={
            align === "center"
              ? "mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
              : "flex max-w-3xl flex-col gap-4"
          }
        >
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1 className="font-display text-[2.1rem] font-bold leading-[1.05] sm:text-[3rem]">
            {title}
          </h1>
          {lead ? (
            <p className="text-lg leading-relaxed text-[var(--color-ink-soft)]">
              {lead}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </div>
  );
}
