/* =========================================================================
   MOUSE GLOW
   -------------------------------------------------------------------------
   A soft red ambient light that trails the cursor across the page. It is
   painted as the BACKGROUND of each .hero / .section / .site-footer (see
   animations.css — z-index: -1 inside that element's own stacking context),
   so real content always renders on top of it: the glow only ever shows
   through empty background, never over text, cards, images or buttons.

   Perf: expensive work (measuring where each section sits on the page) only
   happens on load/resize/FAQ-toggle. Every animation frame just does cheap
   arithmetic (easing + a CSS custom-property write) — no layout reads.
   Separate from the small dot/ring in cursor.js. Fine pointers only; off
   entirely for reduced motion.
   ========================================================================= */
(function () {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var root = document.documentElement;
  var hosts = [];

  function collect() {
    hosts = Array.prototype.slice.call(document.querySelectorAll(".hero, .section, .site-footer"));
  }

  function measure() {
    hosts.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--gx", (r.left + window.scrollX).toFixed(1) + "px");
      el.style.setProperty("--gy", (r.top + window.scrollY).toFixed(1) + "px");
    });
  }

  collect();
  measure();
  addEventListener("load", measure);
  addEventListener("resize", measure, { passive: true });
  document.addEventListener("toggle", measure, true); // FAQ accordion open/close reflows later sections

  var mx = innerWidth / 2 + window.scrollX,
    my = innerHeight / 2 + window.scrollY;
  var gx = mx,
    gy = my; // eased position, trails the real pointer

  addEventListener(
    "mousemove",
    function (e) {
      mx = e.clientX + window.scrollX;
      my = e.clientY + window.scrollY;
      root.classList.add("js-mouse-glow");
    },
    { passive: true }
  );

  addEventListener("mouseleave", function () {
    root.classList.remove("js-mouse-glow");
  });

  (function loop() {
    gx += (mx - gx) * 0.13;
    gy += (my - gy) * 0.13;
    root.style.setProperty("--glow-x", gx.toFixed(1) + "px");
    root.style.setProperty("--glow-y", gy.toFixed(1) + "px");
    requestAnimationFrame(loop);
  })();
})();
