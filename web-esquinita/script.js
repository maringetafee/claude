(() => {
  'use strict';

  /* iOS Safari only starts evaluating :active once a touch listener exists
     somewhere on the page — without this, tap feedback on buttons/chips
     never fires on iPhone even though the CSS is correct. */
  document.addEventListener('touchstart', function () {}, { passive: true });

  /* ---------------------------------------------------------------- */
  /* Header scroll state                                               */
  /* ---------------------------------------------------------------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------- */
  /* Mobile menu                                                       */
  /* ---------------------------------------------------------------- */
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  const openMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });
  mobileMenu?.querySelectorAll('[data-menu-link], a').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------------------------------------------------------------- */
  /* Scroll reveal                                                     */
  /* ---------------------------------------------------------------- */
  document.documentElement.classList.add('js-reveal-ready');
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('reveal-visible'));
  }

  /* ---------------------------------------------------------------- */
  /* Carta: category tabs + allergen filtering                         */
  /* ---------------------------------------------------------------- */
  const tabbar = document.querySelector('[data-tabbar]');
  const panels = document.querySelectorAll('[data-panels] .carta-panel');
  const allergenFilter = document.querySelector('[data-allergen-filter]');
  const allergenChips = document.querySelectorAll('[data-allergen-chips] .carta-chip');
  const clearBtn = document.querySelector('[data-allergen-clear]');

  const avoid = new Set();

  function replayStagger(panel) {
    const dishes = panel.querySelectorAll('.dish:not(.is-hidden)');
    dishes.forEach((dish, i) => {
      dish.classList.remove('is-entering');
      dish.style.animationDelay = (i % 10) * 45 + 'ms';
      // force reflow so the animation restarts
      void dish.offsetWidth;
      dish.classList.add('is-entering');
    });
  }

  function applyFilter(panel) {
    const dishes = panel.querySelectorAll('.dish');
    let visible = 0;
    dishes.forEach((dish) => {
      const tags = (dish.dataset.allergens || '').split(' ').filter(Boolean);
      const hidden = tags.some((t) => avoid.has(t));
      dish.classList.toggle('is-hidden', hidden);
      if (!hidden) visible++;
    });
    const total = dishes.length;
    const countEl = panel.querySelector('[data-panel-count]');
    if (countEl) countEl.textContent = `${visible} de ${total} platos`;
    panel.classList.toggle('is-empty', total > 0 && visible === 0);
    replayStagger(panel);
  }

  function applyFilterAll() {
    panels.forEach(applyFilter);
    allergenFilter?.classList.toggle('has-avoid', avoid.size > 0);
  }

  function activateTab(id) {
    tabbar?.querySelectorAll('.carta-tab').forEach((tab) => {
      tab.setAttribute('aria-selected', tab.dataset.tab === id ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const isActive = panel.dataset.panel === id;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
      if (isActive) replayStagger(panel);
    });
  }

  tabbar?.addEventListener('click', (e) => {
    const btn = e.target.closest('.carta-tab');
    if (!btn) return;
    activateTab(btn.dataset.tab);
  });

  allergenChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.allergen;
      const active = avoid.has(id);
      active ? avoid.delete(id) : avoid.add(id);
      chip.setAttribute('aria-pressed', String(!active));
      applyFilterAll();
    });
  });

  clearBtn?.addEventListener('click', () => {
    avoid.clear();
    allergenChips.forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
    applyFilterAll();
  });

  // initialize counts on load
  applyFilterAll();
})();
