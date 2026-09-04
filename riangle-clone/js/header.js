/* Header scroll behaviour:
   - data-scrolled="true" once the page is scrolled (fades in the frosted scrim)
   The header stays fixed and visible at all times regardless of scroll
   direction. The original also flips a data-over-dark flag when the bar
   sits over a dark section so the logo/nav invert; wire that up the same
   way if you add it. */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var ticking = false;

  function update() {
    var y = window.scrollY;
    header.setAttribute("data-scrolled", String(y > 8));
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
})();
