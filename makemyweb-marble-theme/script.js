document.documentElement.classList.remove('no-js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Mobile menu
   -------------------------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
}));

/* --------------------------------------------------------------------------
   Trust strip — infinite marquee of clients, duplicated once for a
   seamless loop (the track animates -50%, i.e. exactly one set width).
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
   Pricing calculator — live comparison against a typical agency and a
   freelancer, same formulas as the brief.
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

  const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
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

    const savings = freelancer - total;
    savingsLabel.textContent = savings > 0
      ? `Ahorras ${fmt(savings)} frente a un freelancer`
      : 'Ahorras tiempo y dolores de cabeza';
  }

  [...serviceInputs, ...timelineInputs, needContent, needSeo, need3D].forEach(i => i.addEventListener('change', calculate));
  pagesSlider.addEventListener('input', calculate);
  calculate();
})();

/* --------------------------------------------------------------------------
   FAQ accordion — height measured then transitioned.
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
   Contact form — lightweight client-side acknowledgement, no backend.
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
   Scroll reveal for content below the hero
   -------------------------------------------------------------------------- */
document.querySelectorAll('.service-grid, .plan-grid, .process-grid, .showcase-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add('reveal');
    child.style.transitionDelay = `${(i % 4) * 0.09}s`;
  });
});

document.querySelectorAll('.calc-group, .calc-result, .faq-item, .contact-form').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 5) * 0.07}s`;
});

document.querySelectorAll('.section .eyebrow, .section h2, .section-subtitle').forEach(el => {
  el.classList.add('reveal');
});

const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ============================================================================
   HERO — scroll-scrubbed statue video.
   The clip plays only as long as the pinned hero is being scrolled through:
   scroll position maps linearly to video.currentTime, eased toward its
   target each frame instead of snapping. The footage fills the stage
   edge-to-edge (object-fit: cover in CSS) on every viewport, cropping in
   from the sides on wide screens rather than showing letterbox bars. Near
   the end of the clip — statue fully shattered, fragments still drifting —
   the caption fades in over its own dark scrim and, right after, the site
   header/menu appears — "empieza el menú" only once the intro is done.
   ============================================================================ */
(function initHero() {
  const heroScene = document.getElementById('heroScene');
  const video = document.getElementById('bustVideo');
  const poster = document.getElementById('heroPoster');
  const caption = document.getElementById('heroCaption');
  const scrollHint = document.getElementById('scrollHint');
  const header = document.getElementById('siteHeader');
  if (!heroScene || !video) return;

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  if (reduceMotion) {
    caption.classList.add('is-interactive');
    header.classList.add('is-visible');
    if (scrollHint) scrollHint.style.display = 'none';
    video.setAttribute('poster', 'assets/video/poster.jpg');
    return;
  }

  let DURATION = 10; // seconds; refined once real metadata loads
  let videoReady = false;

  function markReady() {
    if (videoReady) return;
    videoReady = true;
    DURATION = video.duration || DURATION;
    video.classList.add('is-ready');
    poster.classList.add('is-hidden');
    requestTick();
  }
  video.addEventListener('loadedmetadata', markReady, { once: true });
  video.addEventListener('error', () => {
    // Video failed to load: keep the poster frame, let the caption sit
    // statically over it instead of leaving a broken/blank hero.
    caption.classList.add('is-interactive');
    header.classList.add('is-visible');
  });

  // iOS/Safari need a real play() to unlock frame-accurate seeking; abort it
  // synchronously so it never actually runs free.
  video.load();
  video.play().catch(() => {});
  video.pause();
  setTimeout(() => {
    if (!videoReady) {
      caption.classList.add('is-interactive');
      header.classList.add('is-visible');
    }
  }, 5000);

  function getProgress() {
    const rect = heroScene.getBoundingClientRect();
    const total = heroScene.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
  }

  let desiredTime = 0;
  let rafId = null;
  let dirty = true;
  let headerVisible = false;

  const isMobile = window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches;
  const SMOOTH = isMobile ? 0.5 : 0.28;
  const SEEK_THRESHOLD = isMobile ? 0.03 : 0.008;

  function recomputeFromScroll() {
    const progress = getProgress();
    desiredTime = progress * DURATION;

    const captionT = clamp((progress - 0.7) / 0.26, 0, 1);
    caption.style.opacity = captionT.toFixed(3);
    caption.style.transform = `translateY(${(1 - captionT) * 18}px)`;
    caption.classList.toggle('is-interactive', captionT > 0.6);

    const shouldShowHeader = progress > 0.95;
    if (shouldShowHeader !== headerVisible) {
      headerVisible = shouldShowHeader;
      header.classList.toggle('is-visible', headerVisible);
    }

    if (scrollHint) scrollHint.style.opacity = progress < 0.06 ? '1' : '0';
  }

  function tick() {
    if (dirty) { recomputeFromScroll(); dirty = false; }

    const diff = desiredTime - video.currentTime;
    let smoothing = false;
    if (Math.abs(diff) > SEEK_THRESHOLD && videoReady) {
      smoothing = true;
      // Never issue a new seek while one is still resolving — can stall the
      // decoder indefinitely under rapid scroll input.
      if (!video.seeking) {
        if (!video.paused) video.pause();
        const next = video.currentTime + diff * SMOOTH;
        video.currentTime = clamp(next, 0, DURATION);
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

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  requestTick();
})();

/* ============================================================================
   Marble dust — slow specks drifting across the whole document, anchored to
   document space (not the viewport) so they stay put relative to the page
   while scrolling rather than chasing the reader.
   ============================================================================ */
(function initDustField() {
  const canvas = document.getElementById('dustField');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let vw = 0, vh = 0, docHeight = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    vw = window.innerWidth;
    vh = window.innerHeight;
    docHeight = Math.max(document.documentElement.scrollHeight, vh);
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnMote(docY) {
    return {
      x: Math.random() * vw,
      docY: docY !== undefined ? docY : Math.random() * docHeight,
      size: 0.6 + Math.random() * 1.6,
      speed: 3 + Math.random() * 5,
      swayAmp: 8 + Math.random() * 16,
      swayFreq: 0.15 + Math.random() * 0.25,
      swayPhase: Math.random() * Math.PI * 2,
      opacity: 0.08 + Math.random() * 0.16,
    };
  }

  const count = Math.min(70, Math.max(24, Math.round(docHeight / 160)));
  const motes = Array.from({ length: count }, () => spawnMote());

  let lastTime = performance.now();
  let visible = document.visibilityState === 'visible';
  document.addEventListener('visibilitychange', () => {
    visible = document.visibilityState === 'visible';
    if (visible) lastTime = performance.now();
  });

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const t = now / 1000;
    const scrollY = window.scrollY;

    ctx.clearRect(0, 0, vw, vh);
    motes.forEach((m) => {
      m.docY -= m.speed * dt; // rises gently, like settling dust
      if (m.docY < -20) Object.assign(m, spawnMote(docHeight + 20 + Math.random() * 40));

      const screenY = m.docY - scrollY;
      if (screenY < -10 || screenY > vh + 10) return;
      const x = m.x + Math.sin(t * m.swayFreq + m.swayPhase) * m.swayAmp;

      ctx.beginPath();
      ctx.arc(x, screenY, m.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247, 244, 236, ${m.opacity})`;
      ctx.fill();
    });
  }
  requestAnimationFrame(frame);
})();
