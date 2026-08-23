/* ==========================================================================
   MAKEMYWEB — app.js
   Sections:
     1. Reduced motion / capability detection
     2. Trust-strip client list (marquee)
     3. Mobile menu
     4. Pricing calculator
     5. FAQ accordion
     6. Cinema engine — scroll-scrubbed video + choreographed panels
   ========================================================================== */

document.documentElement.classList.remove('no-js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) document.documentElement.classList.add('reduced-motion');

/* --------------------------------------------------------------------------
   2. TRUST STRIP — same client list as before, duplicated once for the
   seamless marquee loop.
   -------------------------------------------------------------------------- */
(function initTrustStrip() {
  const clients = [
    { name: 'Panadería Trigo y Sal', letter: 'T' },
    { name: 'Taller Ferro', letter: 'F' },
    { name: 'Clínica Vitalis', letter: 'V' },
    { name: 'Estudio Núñez', letter: 'N' },
    { name: 'Ferretería Sarasola', letter: 'S' },
    { name: 'Café Lumen', letter: 'L' },
  ];
  const render = (container) => {
    if (!container) return;
    container.innerHTML = clients.map(c => `
      <span class="trust-chip">
        <span class="trust-chip__mark">${c.letter}</span>
        <span>${c.name}</span>
      </span>
    `).join('');
  };
  render(document.getElementById('marqueeSetA'));
  render(document.getElementById('marqueeSetB'));
})();

/* --------------------------------------------------------------------------
   3. MOBILE MENU
   -------------------------------------------------------------------------- */
(function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.hasAttribute('hidden');
    if (open) mobileMenu.removeAttribute('hidden'); else mobileMenu.setAttribute('hidden', '');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.setAttribute('hidden', '');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
})();

/* --------------------------------------------------------------------------
   4. PRICING CALCULATOR — same rules as the original implementation.
   -------------------------------------------------------------------------- */
(function initCalculator() {
  const serviceInputs = document.querySelectorAll('input[name=service]');
  const timelineInputs = document.querySelectorAll('input[name=timeline]');
  const pagesSlider = document.getElementById('pagesSlider');
  const pagesValue = document.getElementById('pagesValue');
  const needContent = document.getElementById('needContent');
  const needSeo = document.getElementById('needSeo');
  const need3D = document.getElementById('need3D');
  const agencyPrice = document.getElementById('agencyPrice');
  const freelancerPrice = document.getElementById('freelancerPrice');
  const ourPrice = document.getElementById('ourPrice');
  const savingsLabel = document.getElementById('savingsLabel');
  if (!pagesSlider) return;

  const fmt = () => 'Consultar';
  const currentService = () => [...serviceInputs].find(i => i.checked).value;
  const currentTimeline = () => [...timelineInputs].find(i => i.checked).value;

  function calculate() {
    const service = currentService();
    const pages = Number(pagesSlider.value);
    const timeline = currentTimeline();

    const bases = {
      design: { base: 399, perPage: 100 },
      development: { base: 199, perPage: 100 },
      both: { base: 499, perPage: 200 },
    };
    const b = bases[service];
    let total = Math.max(b.base, b.base + (pages - 1) * b.perPage);
    if (needContent.checked) total += pages * 50;
    if (needSeo.checked) total += pages * 50;
    if (need3D.checked) total += 200;
    if (timeline === 'rush') total += pages * 100;
    if (timeline === 'fast') total += pages * 25;

    const isBoth = service === 'both';
    const agency = 8000 + (pages - 1) * (isBoth ? 1000 : 400);
    const freelancer = 3000 + (pages - 1) * (isBoth ? 500 : 200);

    pagesValue.textContent = pages;
    agencyPrice.textContent = fmt(agency);
    freelancerPrice.textContent = fmt(freelancer);
    ourPrice.textContent = fmt(total);

    savingsLabel.textContent = 'Ahorras tiempo y dolores de cabeza';
  }

  [...serviceInputs, ...timelineInputs, needContent, needSeo, need3D].forEach(i => i.addEventListener('change', calculate));
  pagesSlider.addEventListener('input', calculate);
  calculate();
})();

/* --------------------------------------------------------------------------
   5. FAQ ACCORDION — height measured then transitioned (see .faq-panel CSS).
   -------------------------------------------------------------------------- */
(function initFaq() {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    const panel = trigger.nextElementSibling;
    const inner = panel.querySelector('.faq-panel-inner');
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        panel.style.height = inner.offsetHeight + 'px';
        requestAnimationFrame(() => { panel.style.height = '0px'; });
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.height = inner.offsetHeight + 'px';
        panel.addEventListener('transitionend', function onEnd(e) {
          if (e.propertyName === 'height' && trigger.getAttribute('aria-expanded') === 'true') {
            panel.style.height = 'auto';
          }
          panel.removeEventListener('transitionend', onEnd);
        });
      }
    });
  });
})();

/* --------------------------------------------------------------------------
   Contact form — kept as a lightweight client-side acknowledgement, same
   behaviour as the original (no backend wired up here).
   -------------------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Enviado';
    form.reset();
    setTimeout(() => { btn.textContent = original; }, 2200);
  });
})();

/* --------------------------------------------------------------------------
   6. CINEMA ENGINE
   The whole site (hero → final CTA) lives inside #cinema as scroll-scrubbed
   panels over the house-tour video. Design:

   - `scenes[]` is the single source of truth: each entry names a moment in
     the footage (`time`, in video seconds) and how much scroll distance
     (`hold`, in vh) is given to read/interact with its panel before the
     camera is allowed to move on. Between two scenes the camera "travels"
     for a fixed `TRAVEL` distance, during which video time is interpolated
     linearly and the two neighbouring panels cross-fade.
   - `layout()` turns that config into absolute scroll offsets (holdStart /
     holdEnd) once, on load and on resize.
   - A single rAF loop reads scroll position, derives (a) the target video
     time and (b) each panel's opacity from those offsets, and eases the
     video toward the target instead of snapping — this is what makes the
     camera feel driven rather than merely triggered. The loop only runs
     while there is scroll input to process or the video hasn't yet caught
     up to its target, so it costs nothing while idle.
   -------------------------------------------------------------------------- */
(function initCinema() {
  const cinema = document.getElementById('cinema');
  const video = document.getElementById('tourVideo');
  if (!cinema || !video) return;

  const VIDEO_DURATION = 10; // seconds, matches the source footage exactly
  const TRAVEL = 64;         // vh spent moving the camera between two scenes
  const FADE = 46;           // vh over which a panel fades in/out around its hold window

  // One continuous dolly through a marble palace: facade → threshold → the
  // staircase hall → the grand colonnaded room, which the camera lingers
  // in and slowly pushes through for the rest of the walk. key matches the
  // data-scene attribute + the real #id anchor in the DOM.
  const scenes = [
    { key: 'inicio',        time: 0.25, hold: 110, nav: null,          label: 'Fachada'       },
    { key: 'entrada',       time: 1.3,  hold: 36,  nav: null,          label: 'Umbral'        },
    { key: 'servicios',     time: 2.3,  hold: 120, nav: 'servicios',   label: 'Escalinata'    },
    { key: 'presupuesto',   time: 3.4,  hold: 170, nav: 'presupuesto', label: 'Galería'       },
    { key: 'planes',        time: 4.7,  hold: 120, nav: null,          label: 'Arcada'        },
    { key: 'proceso',       time: 5.8,  hold: 120, nav: 'proceso',     label: 'Rotonda'       },
    { key: 'experiencias',  time: 6.9,  hold: 90,  nav: null,          label: 'Salón Dorado'  },
    { key: 'showcase',      time: 7.8,  hold: 130, nav: null,          label: 'Galería Este'  },
    { key: 'faq',           time: 8.7,  hold: 150, nav: 'faq',         label: 'Recepción'     },
    { key: 'contacto',      time: 9.6,  hold: 110, nav: 'contacto',    label: 'Salón de Honor'},
  ];

  // resolve DOM refs for each scene up front
  scenes.forEach(s => {
    s.panel = cinema.querySelector(`.scene-panel[data-scene="${s.key}"]`);
    s.anchor = document.getElementById(s.key);
  });

  const navLinks = document.querySelectorAll('[data-nav]');
  const roomRail = document.getElementById('roomRail');
  const scrollHint = document.getElementById('scrollHint');

  // build the progress rail dots once
  scenes.forEach((s, i) => {
    const dot = document.createElement('button');
    dot.className = 'room-rail__dot';
    dot.type = 'button';
    dot.dataset.label = s.label;
    dot.setAttribute('aria-label', `Ir a ${s.label}`);
    dot.addEventListener('click', () => s.anchor && s.anchor.scrollIntoView({ behavior: 'smooth' }));
    roomRail.appendChild(dot);
    s.dot = dot;
  });

  let pinRange = 0;
  let keyframes = []; // [{vh, t}] flattened hold+travel timeline for interpolating video time

  function layout() {
    let vh = 0;
    keyframes = [];
    scenes.forEach((s, i) => {
      s.holdStart = vh;
      vh += s.hold;
      s.holdEnd = vh;
      keyframes.push({ vh: s.holdStart, t: s.time });
      keyframes.push({ vh: s.holdEnd, t: s.time });
      if (s.anchor) s.anchor.style.top = s.holdStart + 'vh';
      if (i < scenes.length - 1) vh += TRAVEL;
    });
    const totalVh = vh;
    cinema.style.height = `calc(${totalVh}vh + 100dvh)`;
    pinRange = (totalVh / 100) * window.innerHeight;
  }

  function targetVideoTime(posVh) {
    if (posVh <= keyframes[0].vh) return keyframes[0].t;
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i], b = keyframes[i + 1];
      if (posVh <= b.vh) {
        if (b.vh === a.vh) return a.t;
        const f = (posVh - a.vh) / (b.vh - a.vh);
        return a.t + (b.t - a.t) * f;
      }
    }
    return keyframes[keyframes.length - 1].t;
  }

  function panelOpacity(scene, posVh) {
    if (posVh < scene.holdStart - FADE) return 0;
    if (posVh < scene.holdStart) return (posVh - (scene.holdStart - FADE)) / FADE;
    if (posVh <= scene.holdEnd) return 1;
    if (posVh <= scene.holdEnd + FADE) return 1 - (posVh - scene.holdEnd) / FADE;
    return 0;
  }

  let desiredTime = scenes[0].time;
  let rafId = null;
  let dirty = true;
  const isMobile = window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches;
  const SMOOTH = isMobile ? 0.55 : 0.32;
  const SEEK_THRESHOLD = isMobile ? 0.03 : 0.006;

  function recomputeFromScroll() {
    const rect = cinema.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top, 0), pinRange);
    const posVh = window.innerHeight > 0 ? (scrolled / window.innerHeight) * 100 : 0;

    desiredTime = targetVideoTime(posVh);

    let activeScene = null;
    let activeOpacity = 0;
    scenes.forEach(s => {
      const o = panelOpacity(s, posVh);
      if (!s.panel) return;
      s.panel.style.opacity = o.toFixed(3);
      s.panel.style.transform = `translateY(${(1 - o) * 26}px)`;
      s.panel.classList.toggle('is-active', o > 0.6);
      if (o > activeOpacity) { activeOpacity = o; activeScene = s; }
      s.dot.classList.toggle('is-active', o > 0.5);
    });

    navLinks.forEach(a => {
      const isMatch = activeScene && activeScene.nav === a.dataset.nav && activeOpacity > 0.55;
      a.classList.toggle('is-active', !!isMatch);
    });

    if (scrollHint) scrollHint.style.opacity = posVh < 24 ? String(1 - posVh / 24) : '0';
  }

  function tick() {
    if (dirty) { recomputeFromScroll(); dirty = false; }

    const diff = desiredTime - video.currentTime;
    let smoothing = false;
    if (Math.abs(diff) > SEEK_THRESHOLD && videoReady) {
      smoothing = true;
      // Issuing video.currentTime again before the browser has resolved the
      // previous seek interrupts it, which under load can stall the decoder
      // indefinitely (currentTime never advances). Skip this frame's write
      // and simply retry next frame once the pending seek settles.
      if (!video.seeking) {
        if (!video.paused) video.pause(); // scrubbing owns currentTime; the video must never run on its own
        const next = video.currentTime + diff * SMOOTH;
        video.currentTime = Math.min(Math.max(next, 0), VIDEO_DURATION);
      }
    }

    if (dirty || smoothing) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function requestTick() {
    dirty = true;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // --- video readiness / mobile source / iOS scrub priming ---------------
  let videoReady = false;
  const desktopSrc = 'assets/house-tour.mp4';
  const mobileSrc = 'assets/house-tour-mobile.mp4';
  const source = video.querySelector('source');
  if (isMobile) source.src = mobileSrc;
  else source.src = desktopSrc;

  function markReady() {
    if (videoReady) return;
    videoReady = true;
    requestTick();
  }
  video.addEventListener('loadedmetadata', markReady, { once: true });
  video.addEventListener('error', () => cinema.classList.add('cinema--fallback'));

  // iOS/Safari need a real play() to "unlock" frame-accurate seeking. Call
  // it and abort it *synchronously* (not inside the .then callback) so the
  // video never actually runs free — waiting on the promise would let it
  // play in real time until the callback lands, which is unbounded (e.g.
  // fully throttled while the tab is backgrounded).
  video.load();
  video.play().catch(() => { /* autoplay blocked is fine, seeking still works */ });
  video.pause();
  // safety net: if metadata never fires (slow network / blocked request),
  // fall back to the static poster instead of leaving a broken page.
  setTimeout(() => { if (!videoReady) cinema.classList.add('cinema--fallback'); }, 5000);

  // --- wiring ---------------------------------------------------------
  if (!prefersReducedMotion) {
    layout();
    window.addEventListener('scroll', requestTick, { passive: true });
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { layout(); requestTick(); }, 120);
    }, { passive: true });
    requestTick();
  } else {
    // static fallback: no pin math, just make sure the poster is showing
    cinema.classList.add('cinema--fallback');
  }
})();
