"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

function TeamCard({ name, role, image, index }: { name: string; role: string; image: string; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[700ms] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-4">
        <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover grayscale" />
      </div>
      <p className="font-display text-lg" style={{ color: "var(--color-primary)" }}>
        {name}
      </p>
      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        {role}
      </p>
    </div>
  );
}

export function Team({ team }: { team: TeamConfig }) {
  return (
    <section id="team" className="py-[var(--space-xl)]" style={{ background: "var(--color-surface)" }}>
      <Container>
        <SectionHeading eyebrow={team.eyebrow} title={team.title} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-14">
          {team.members.map((member, i) => (
            <TeamCard key={member.name} {...member} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
