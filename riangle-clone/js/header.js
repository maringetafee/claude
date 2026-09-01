/* Header scroll behaviour:
   - data-scrolled="true" once the page is scrolled (fades in the frosted scrim)
   - data-hidden="true"  when scrolling DOWN past the hero (slides the bar away),
     back to visible on scroll UP.
   The original also flips a data-over-dark flag when the bar sits over a dark
   section so the logo/nav invert; wire that up the same way if you add it. */
(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var lastY = window.scrollY;
  var ticking = false;

  function update() {
    var y = window.scrollY;
    header.setAttribute("data-scrolled", String(y > 8));

    var goingDown = y > lastY;
    if (y > window.innerHeight * 0.9) {
      header.setAttribute("data-hidden", String(goingDown));
    } else {
      header.setAttribute("data-hidden", "false");
    }
    lastY = y;
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
