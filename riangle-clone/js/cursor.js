/* =========================================================================
   Custom cursor — a small solid dot that tracks the pointer 1:1-ish, and a
   red ring (the page red, #F43333) that trails behind it with easing/delay.
   Ring grows over clickable things, shrinks on press. Fine pointers only.
   ========================================================================= */
(function () {
  if (!window.matchMedia("(pointer:fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var root = document.documentElement;
  var dot = document.createElement("div");
  var ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(dot, ring);
  root.classList.add("js-cursor");

  var mx = innerWidth / 2,
    my = innerHeight / 2;
  var dx = mx,
    dy = my; // dot position
  var rx = mx,
    ry = my; // ring position (trails)

  addEventListener(
    "mousemove",
    function (e) {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  // hide when the pointer leaves the window
  addEventListener("mouseleave", function () {
    dot.classList.add("is-hidden");
    ring.classList.add("is-hidden");
  });
  addEventListener("mouseenter", function () {
    dot.classList.remove("is-hidden");
    ring.classList.remove("is-hidden");
  });

  // press feedback
  addEventListener("mousedown", function () {
    ring.classList.add("is-down");
  });
  addEventListener("mouseup", function () {
    ring.classList.remove("is-down");
  });

  // "hot" state over interactive elements
  var HOT =
    'a, button, input, textarea, select, summary, label, [role="button"], .magnetic, .theme-toggle';
  addEventListener("mouseover", function (e) {
    if (e.target.closest && e.target.closest(HOT)) ring.classList.add("is-hot");
  });
  addEventListener("mouseout", function (e) {
    if (e.target.closest && e.target.closest(HOT)) ring.classList.remove("is-hot");
  });

  (function loop() {
    // dot: quick catch-up
    dx += (mx - dx) * 0.4;
    dy += (my - dy) * 0.4;
    // ring: slower → visible lag / delay
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.translate = dx.toFixed(2) + "px " + dy.toFixed(2) + "px";
    ring.style.translate = rx.toFixed(2) + "px " + ry.toFixed(2) + "px";
    requestAnimationFrame(loop);
  })();
})();
