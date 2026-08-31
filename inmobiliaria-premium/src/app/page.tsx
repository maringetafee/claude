import { Hero } from "@/components/sections/Hero";
import { PropertySearch } from "@/components/sections/PropertySearch";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { ExploreMap } from "@/components/sections/ExploreMap";
import { ValueProps } from "@/components/sections/ValueProps";
import { FeaturedShowcase } from "@/components/sections/FeaturedShowcase";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Zones } from "@/components/sections/Zones";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactSection } from "@/components/sections/ContactSection";
import { getShowcaseProperty } from "@/lib/properties";

export default async function Home() {
  const showcaseProperty = await getShowcaseProperty();

  return (
    <>
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <ExploreMap />
      <ValueProps />
      {showcaseProperty && <FeaturedShowcase featuredProperty={showcaseProperty} />}
      <Services />
      <About />
      <Zones />
      <Testimonials />
      <ContactSection />
    </>
  );
}
