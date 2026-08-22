import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHeroScrollSequence } from "./scroll-sequence";

gsap.registerPlugin(ScrollTrigger);

initHeroScrollSequence();

/* Nav background on scroll (GSAP ScrollTrigger, not a raw scroll listener). */
const nav = document.querySelector<HTMLElement>("[data-nav]");
if (nav) {
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      if (self.scroll() > 40) nav.setAttribute("data-scrolled", "");
      else nav.removeAttribute("data-scrolled");
    },
  });
}

/* Scroll-reveal for landing content: fires once per element via
   IntersectionObserver, honoring prefers-reduced-motion (handled in CSS). */
const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* Smooth in-page anchor scrolling (respects reduced motion automatically
   via the browser's native smooth-scroll + prefers-reduced-motion). */
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
