import HeroSequence from "@/components/hero/HeroSequence";
import PanelSection from "@/components/ui/PanelSection";
import ToldosSection from "@/components/sections/ToldosSection";
import PergolasSection from "@/components/sections/PergolasSection";
import SolucionesSection from "@/components/sections/SolucionesSection";
import ParticularesProfesionalesSection from "@/components/sections/ParticularesProfesionalesSection";
import FabricacionSection from "@/components/sections/FabricacionSection";
import GaleriaSection from "@/components/sections/GaleriaSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main id="main" className="relative">
      <HeroSequence>
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-paper/80">
            Fuenlabrada · Madrid
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-paper sm:text-6xl lg:text-7xl">
            Toldos Getafe
          </h1>
          <p className="mt-4 text-lg text-paper/90 sm:text-xl">
            Protección solar. Diseño. Confort.
          </p>
          <p className="mt-3 max-w-lg text-sm text-paper/70 sm:text-base">
            Fabricamos soluciones a medida para transformar tus espacios
            exteriores.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#soluciones"
              className="rounded-none border border-paper/40 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
            >
              Ver soluciones
            </a>
            <a
              href="/contacto/"
              className="rounded-none bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-soft"
            >
              Solicitar presupuesto
            </a>
          </div>
        </div>
      </HeroSequence>

      <PanelSection from="right">
        <ToldosSection />
      </PanelSection>
      <PanelSection from="left">
        <PergolasSection />
      </PanelSection>
      <PanelSection id="soluciones" from="bottom">
        <SolucionesSection />
      </PanelSection>
      <PanelSection from="top">
        <ParticularesProfesionalesSection />
      </PanelSection>
      <PanelSection from="right">
        <FabricacionSection />
      </PanelSection>
      <PanelSection from="left">
        <GaleriaSection />
      </PanelSection>
      <PanelSection from="bottom">
        <ContactSection />
      </PanelSection>
    </main>
  );
}
