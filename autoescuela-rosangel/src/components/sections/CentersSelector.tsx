"use client";

import { useState } from "react";
import { type Center, centers, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

function CenterDetails({ center }: { center: Center }) {
  return (
    <div className="flex h-full flex-col justify-between p-6 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          {center.zoneLabel}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold">{center.fullName}</h3>

        <div className="mt-5 space-y-3 text-sm text-ink-soft">
          <p className="flex items-start gap-2.5">
            <PinIcon className="mt-0.5 shrink-0 text-stone" />
            {center.addressLine}
          </p>
          <div className="flex items-start gap-2.5">
            <ClockIcon className="mt-0.5 shrink-0 text-stone" />
            <ul>
              {center.hours.map((h) => (
                <li key={h.label}>
                  <span className="text-ink">{h.label}:</span> {h.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-line pt-6">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.mapsQuery)}`}
          target="_blank"
          rel="noreferrer"
          className="col-span-2 inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
        >
          Cómo llegar
        </a>
        <a
          href={center.phone.href}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <PhoneIcon className="h-4 w-4" /> Llamar
        </a>
        <a
          href={whatsappHref(whatsappMessages.centerPrefix(center.zoneLabel), center.whatsapp.number)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function CentersSelector() {
  const [activeSlug, setActiveSlug] = useState(centers[0].slug);
  const active = centers.find((c) => c.slug === activeSlug) ?? centers[0];

  return (
    <div className="grid gap-0 overflow-hidden rounded-sm border border-line lg:grid-cols-[320px_1fr]">
      <div
        role="tablist"
        aria-label="Elige tu centro"
        className="flex overflow-x-auto border-b border-line bg-paper-soft lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
      >
        {centers.map((center) => {
          const isActive = center.slug === activeSlug;
          return (
            <button
              key={center.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSlug(center.slug)}
              className={`flex shrink-0 flex-col gap-0.5 border-b border-line px-5 py-4 text-left transition-colors last:border-b-0 lg:shrink last:lg:border-b lg:border-r-0 ${
                isActive ? "bg-paper" : "hover:bg-paper/60"
              }`}
              style={isActive ? { boxShadow: "inset 3px 0 0 var(--color-signal)" } : undefined}
            >
              <span className={`text-sm font-semibold ${isActive ? "text-ink" : "text-ink-soft"}`}>
                {center.zoneLabel}
              </span>
              <span className="text-xs text-stone">{center.street}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr]">
        <CenterDetails center={active} />
        <div className="min-h-[280px] border-t border-line lg:border-l lg:border-t-0">
          <iframe
            key={active.slug}
            title={`Mapa — ${active.fullName}`}
            src={active.mapEmbedUrl}
            loading="lazy"
            className="h-full min-h-[280px] w-full grayscale-[15%]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
