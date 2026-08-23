import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStats } from "@/components/TrustStats";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Team } from "@/components/Team";
import { Fleet } from "@/components/Fleet";
import { MadridNetwork } from "@/components/MadridNetwork";
import { Emergency } from "@/components/Emergency";
import { CTASection } from "@/components/CTASection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStats />
        <Services />
        <Process />
        <Team />
        <Fleet />
        <MadridNetwork />
        <Emergency />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
