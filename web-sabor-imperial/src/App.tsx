import { MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { Specialties } from './components/Specialties'
import { Menu } from './components/Menu'
import { Gallery } from './components/Gallery'
import { Ambiente } from './components/Ambiente'
import { Reviews } from './components/Reviews'
import { HoursContact } from './components/HoursContact'
import { StickyActionBar } from './components/StickyActionBar'
import { Footer } from './components/Footer'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <Specialties />
        <Menu />
        <Gallery />
        <Ambiente />
        <Reviews />
        <HoursContact />
      </main>
      <Footer />
      <StickyActionBar />
    </MotionConfig>
  )
}

export default App
