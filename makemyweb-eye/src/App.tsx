import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { IntroExperience } from "./components/IntroExperience";
import { BackgroundField } from "./components/BackgroundField";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PriceCalculator } from "./components/PriceCalculator";
import { Maintenance } from "./components/Maintenance";
import { Process } from "./components/Process";
import { Showcase } from "./components/Showcase";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { defaultCalculatorState } from "./lib/pricing";

function App() {
  const [calculatorState, setCalculatorState] = useState(
    defaultCalculatorState
  );

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[60] -translate-y-24 rounded-full bg-marble px-5 py-2.5 text-sm text-charcoal transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      <IntroExperience />
      <BackgroundField />

      <Header />
      <main id="main-content">
        <Hero />
        <Showcase />
        <Process />
        <PriceCalculator state={calculatorState} setState={setCalculatorState} />
        <Maintenance bookingSystem={calculatorState.bookingSystem} />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}

export default App;
