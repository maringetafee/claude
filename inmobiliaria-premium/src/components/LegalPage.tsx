import { siteConfig } from "@/lib/config";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-36 pb-section-y md:pt-44">
      <div className="container-edit max-w-3xl">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-ink">
          {title}
        </h1>
        <div className="mt-8 space-y-5 text-[0.98rem] leading-relaxed text-ink-soft">
          {children}
        </div>
        <p className="mt-10 text-[0.85rem] text-stone">
          {siteConfig.name} · {siteConfig.address} · {siteConfig.email}
        </p>
      </div>
    </div>
  );
}
