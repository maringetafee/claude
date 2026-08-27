"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingConfig } from "@/lib/types";
import { TableMap } from "@/components/sections/TableMap";

const DEMO_TIMES = ["13:00", "13:30", "14:00", "20:00", "20:30", "21:00", "21:30"];
const DEMO_PEOPLE = [1, 2, 3, 4, 5, 6];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="px-4 py-2 text-sm font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]"
      style={{
        borderRadius: "var(--radius-sm)",
        border: `1.5px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
        background: active ? "var(--color-accent)" : "transparent",
        color: active ? "var(--color-background)" : "var(--color-primary)",
      }}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.25em] mb-3" style={{ color: "var(--color-muted)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  borderRadius: "var(--radius-sm)",
  border: "1.5px solid var(--color-border)",
  background: "var(--color-background)",
  color: "var(--color-primary)",
};

export function Booking({ booking }: { booking: BookingConfig }) {
  const [service, setService] = useState<string | null>(null);
  const [professional, setProfessional] = useState<string | null>(null);
  const [table, setTable] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [people, setPeople] = useState(2);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  const step = (n: number) => (
    <span
      className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium mr-3"
      style={{ borderRadius: "999px", background: "var(--color-primary)", color: "var(--color-background)" }}
    >
      {n}
    </span>
  );

  let stepCount = 0;

  return (
    <section id="booking" className="py-[var(--space-xl)]">
      <Container>
        <SectionHeading eyebrow={booking.eyebrow} title={booking.title} />
        <p className="mt-5 max-w-lg text-base" style={{ color: "var(--color-secondary)" }}>
          {booking.subtitle}
        </p>

        <div
          className="mt-12 p-6 md:p-10 max-w-3xl"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {submitted ? (
            <div className="py-10 text-center">
              <p className="font-display text-3xl mb-3" style={{ color: "var(--color-primary)" }}>
                Reserva confirmada
              </p>
              <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--color-muted)" }}>
                Esto es una demostración — aquí se conectaría con vuestro sistema de reservas real
                (propio, API, o un proveedor externo).
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm underline underline-offset-4"
                style={{ color: "var(--color-accent)" }}
              >
                Hacer otra reserva (demo)
              </button>
            </div>
          ) : (
            <form
              className="space-y-10"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              {booking.flow.includes("service") && booking.services && (
                <div>
                  <p className="mb-4 text-sm font-medium">{step(++stepCount)}Servicio</p>
                  <div className="flex flex-wrap gap-3 pl-9">
                    {booking.services.map((s) => (
                      <Chip key={s} label={s} active={service === s} onClick={() => setService(s)} />
                    ))}
                  </div>
                </div>
              )}

              {booking.flow.includes("professional") && booking.professionals && (
                <div>
                  <p className="mb-4 text-sm font-medium">{step(++stepCount)}Profesional</p>
                  <div className="flex flex-wrap gap-3 pl-9">
                    {booking.professionals.map((p) => (
                      <Chip key={p} label={p} active={professional === p} onClick={() => setProfessional(p)} />
                    ))}
                  </div>
                </div>
              )}

              {booking.flow.includes("people") && (
                <div>
                  <p className="mb-4 text-sm font-medium">{step(++stepCount)}Personas</p>
                  <div className="flex flex-wrap gap-3 pl-9">
                    {DEMO_PEOPLE.map((n) => (
                      <Chip key={n} label={String(n)} active={people === n} onClick={() => setPeople(n)} />
                    ))}
                  </div>
                </div>
              )}

              {booking.flow.includes("table") && booking.showTableMap && (
                <div>
                  <p className="mb-4 text-sm font-medium">{step(++stepCount)}Mesa</p>
                  <div className="pl-9">
                    <TableMap selected={table} onSelect={(id) => setTable(id)} />
                  </div>
                </div>
              )}

              {(booking.flow.includes("date") || booking.flow.includes("time")) && (
                <div>
                  <p className="mb-4 text-sm font-medium">{step(++stepCount)}Fecha y hora</p>
                  <div className="pl-9 space-y-5">
                    {booking.flow.includes("date") && (
                      <Field label="Fecha">
                        <input type="date" className="w-full px-4 py-3 text-sm" style={inputStyle} />
                      </Field>
                    )}
                    {booking.flow.includes("time") && (
                      <div className="flex flex-wrap gap-3">
                        {DEMO_TIMES.map((t) => (
                          <Chip key={t} label={t} active={time === t} onClick={() => setTime(t)} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {booking.flow.includes("customer") && (
                <div>
                  <p className="mb-4 text-sm font-medium">{step(++stepCount)}Tus datos</p>
                  <div className="pl-9 grid sm:grid-cols-2 gap-5">
                    <Field label="Nombre">
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 text-sm"
                        style={inputStyle}
                      />
                    </Field>
                    <Field label="Teléfono">
                      <input required type="tel" className="w-full px-4 py-3 text-sm" style={inputStyle} />
                    </Field>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 text-sm font-medium transition-transform duration-[var(--duration-normal)] hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-background)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Confirmar reserva (demo)
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
