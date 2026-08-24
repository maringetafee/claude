(() => {
  'use strict';

  /* ---------- Sticky header shrink ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Keep the category nav pinned right under the header, even while its
     height animates on scroll (avoids a gap revealing content underneath). */
  const syncHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  syncHeaderHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(syncHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', syncHeaderHeight);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-child, .reveal-line');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Category scrollspy ---------- */
  const catChips = document.querySelectorAll('.cat-chip');
  const catSections = Array.from(catChips)
    .map((chip) => document.getElementById(chip.dataset.cat))
    .filter(Boolean);

  if ('IntersectionObserver' in window && catSections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          catChips.forEach((chip) => chip.classList.toggle('is-active', chip.dataset.cat === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    catSections.forEach((section) => spy.observe(section));
  }

  /* ---------- Allergen filter ---------- */
  const allergenChips = document.querySelectorAll('.allergen-chip');
  const menuItems = document.querySelectorAll('.menu-item[data-allergens], .poke-spotlight[data-allergens]');
  const filterEmpty = document.getElementById('filterEmpty');
  const excluded = new Set();

  function applyFilter() {
    let visibleCount = 0;
    let totalFilterable = 0;
    menuItems.forEach((item) => {
      const allergens = item.dataset.allergens.split(',').filter(Boolean);
      totalFilterable++;
      const hasExcluded = allergens.some((a) => excluded.has(a));
      item.classList.toggle('is-hidden', hasExcluded);
      if (!hasExcluded) visibleCount++;
    });
    filterEmpty.hidden = !(excluded.size > 0 && visibleCount === 0 && totalFilterable > 0);
  }

  allergenChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const code = chip.dataset.code;
      if (excluded.has(code)) {
        excluded.delete(code);
        chip.classList.remove('is-on');
        chip.setAttribute('aria-pressed', 'false');
      } else {
        excluded.add(code);
        chip.classList.add('is-on');
        chip.setAttribute('aria-pressed', 'true');
      }
      applyFilter();
    });
    chip.setAttribute('aria-pressed', 'false');
  });
})();
