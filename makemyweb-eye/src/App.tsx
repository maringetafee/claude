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

function App() {
  return (
    <>
      <IntroExperience />
      <BackgroundField />

      <Header />
      <main>
        <Hero />
        <PriceCalculator />
        <Maintenance />
        <Process />
        <Showcase />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
