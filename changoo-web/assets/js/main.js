(() => {
  'use strict';

  /* ---------- Navegación móvil (overlay) ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  if (toggle && overlay) {
    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      overlay.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Revelado progresivo al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Menú: subrayado de categoría activa ---------- */
  const menuNavLinks = document.querySelectorAll('.menu-nav a');
  const menuSections = Array.from(menuNavLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && menuSections.length) {
    const activate = (id) => {
      menuNavLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    };
    const menuIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activate(entry.target.id);
      });
    }, { rootMargin: '-160px 0px -60% 0px', threshold: 0 });
    menuSections.forEach(sec => menuIo.observe(sec));
  }

  /* ---------- Lightbox de galería ---------- */
  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const imgEl = lightbox.querySelector('img');
    const capEl = lightbox.querySelector('figcaption');
    const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
    let current = 0;

    const show = (index) => {
      current = (index + triggers.length) % triggers.length;
      const t = triggers[current];
      imgEl.src = t.getAttribute('data-lightbox-src');
      imgEl.alt = t.getAttribute('data-lightbox-alt') || '';
      capEl.textContent = t.getAttribute('data-lightbox-caption') || '';
    };

    const open = (index) => {
      show(index);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox-close').focus();
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    triggers.forEach((t, i) => t.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  /* ---------- Año en footer ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Estado horario (abierto ahora / hoy) ---------- */
  const todayRow = document.querySelector(`[data-day="${new Date().getDay()}"]`);
  if (todayRow) todayRow.classList.add('is-today');
})();
