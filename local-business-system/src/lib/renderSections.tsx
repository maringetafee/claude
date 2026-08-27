import { BusinessConfig, SectionId } from "@/lib/types";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Menu } from "@/components/sections/Menu";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { Team } from "@/components/sections/Team";
import { Gallery } from "@/components/sections/Gallery";
import { Booking } from "@/components/sections/Booking";
import { Location } from "@/components/sections/Location";
import { Contact } from "@/components/sections/Contact";
import { CTA } from "@/components/sections/CTA";

const RENDERERS: Partial<Record<SectionId, (config: BusinessConfig) => React.ReactNode>> = {
  hero: (config) => <Hero hero={config.hero} />,
  about: (config) => (config.about ? <About about={config.about} /> : null),
  features: (config) => (config.features ? <Features features={config.features} /> : null),
  menu: (config) => (config.menu ? <Menu menu={config.menu} /> : null),
  services: (config) => (config.services ? <Services services={config.services} /> : null),
  showcase: (config) => (config.showcase ? <Showcase showcase={config.showcase} /> : null),
  team: (config) => (config.team ? <Team team={config.team} /> : null),
  gallery: (config) => (config.gallery ? <Gallery gallery={config.gallery} /> : null),
  booking: (config) => (config.booking ? <Booking booking={config.booking} whatsapp={config.contact.whatsapp} /> : null),
  location: (config) => <Location location={config.location} />,
  contact: (config) => <Contact contact={config.contact} />,
  cta: (config) => (config.cta ? <CTA cta={config.cta} /> : null),
};

export function renderSections(config: BusinessConfig) {
  return config.sections.map((id) => {
    const render = RENDERERS[id];
    if (!render) return null;
    return <div key={id}>{render(config)}</div>;
  });
}
