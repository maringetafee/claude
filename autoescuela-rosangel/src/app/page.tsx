import Hero from "@/components/hero/Hero";
import DifferentiatorsSection from "@/components/sections/DifferentiatorsSection";
import PermitsSection from "@/components/sections/PermitsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import DgtStatsSection from "@/components/sections/DgtStatsSection";
import CentersSection from "@/components/sections/CentersSection";
import ToolsSection from "@/components/sections/ToolsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <DifferentiatorsSection />
      <PermitsSection />
      <ProcessSection />
      <DgtStatsSection />
      <CentersSection />
      <ToolsSection />
      <ReviewsSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
