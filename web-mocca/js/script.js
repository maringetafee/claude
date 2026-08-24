(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const catNav = document.getElementById('catNav');

  /* ---------- Sticky header shrink + --header-h sync ---------- */
  const syncHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  syncHeaderHeight();
  window.addEventListener('scroll', onScroll, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', syncHeaderHeight);
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  const closeNav = () => {
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openNav = () => {
    navMobile.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  navToggle.addEventListener('click', () => {
    navMobile.classList.contains('is-open') ? closeNav() : openNav();
  });
  navMobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Hero + generic reveal ---------- */
  requestAnimationFrame(() => {
    document.querySelector('.hero').classList.add('is-revealed');
  });

  const revealTargets = document.querySelectorAll('.reveal, .section-split');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Category scrollspy ---------- */
  const catLinks = document.querySelectorAll('.cat-nav__link');
  const catSections = Array.from(catLinks)
    .map((link) => document.getElementById(link.dataset.cat))
    .filter(Boolean);

  if ('IntersectionObserver' in window && catSections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          catLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.cat === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    catSections.forEach((section) => spy.observe(section));
  }

  /* ---------- Allergen filter ---------- */
  const allergenChips = document.querySelectorAll('.allergen-chip');
  const menuItems = document.querySelectorAll('.menu-item[data-allergens], .spotlight[data-allergens]');
  const filterNote = document.getElementById('filterNote');
  const excluded = new Set();

  function applyFilter() {
    let visibleFilterable = 0;
    let totalFilterable = 0;
    menuItems.forEach((item) => {
      const allergens = item.dataset.allergens.split(',').filter(Boolean);
      totalFilterable++;
      const hasExcluded = allergens.some((a) => excluded.has(a));
      item.classList.toggle('is-filtered', hasExcluded);
      if (!hasExcluded) visibleFilterable++;
    });
    filterNote.classList.toggle('is-visible', excluded.size > 0 && visibleFilterable === 0 && totalFilterable > 0);
  }

  allergenChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const code = chip.dataset.code;
      const active = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!active));
      active ? excluded.delete(code) : excluded.add(code);
      applyFilter();
    });
  });
})();
