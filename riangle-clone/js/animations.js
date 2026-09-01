/* =========================================================================
   Motion layer — scroll reveals, hero-logo intro/parallax, counters,
   parallax layers, magnetic button.
   Hover micro-interactions are pure CSS (components.css); this is the
   JS-driven, scroll-driven half. Gated by `html.js-anim` (set in <head>).
   ========================================================================= */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains("js-anim")) return; // reduced-motion → skip

  /* ---------- 1. scroll reveals ------------------------------------------ */
  // media frames: swap the generic reveal for the clip-path media reveal
  document.querySelectorAll(".media-frame, .studio-panel__plate").forEach(function (f) {
    f.removeAttribute("data-reveal");
    f.classList.add("reveal-media");
  });

  // stagger elements that share a parent
  var seen = new Map();
  var pending = [];
  document.querySelectorAll("[data-reveal], [data-reveal-heading], .reveal-media").forEach(function (el) {
    var p = el.parentElement;
    var n = seen.get(p) || 0;
    el.style.setProperty("--reveal-delay", Math.min(n * 70, 320) + "ms");
    seen.set(p, n + 1);
    pending.push(el);
  });

  // hero headline: index each line for the staggered wipe
  var heading = document.querySelector("[data-reveal-heading]");
  if (heading) {
    heading.querySelectorAll(":scope > span").forEach(function (s, i) {
      s.style.setProperty("--i", i);
    });
  }

  // Scroll-position sweep — robust against fast scrolling / jumps where an
  // IntersectionObserver callback can be skipped.
  function sweepReveals() {
    if (!pending.length) return;
    var trigger = window.innerHeight * 0.92;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("is-in");
        return false;
      }
      return true;
    });
  }

  /* ---------- 2. hero intro -------------------------------------------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add("is-in");
      });
    });
  }

  /* ---------- 3. counters --------------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-count-suffix") || "";
    var dur = 1500;
    var t0 = performance.now();
    (function frame(now) {
      var t = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    })(t0);
  }
  var stats = document.querySelector(".studio-panel__stats");
  var countsDone = false;
  function maybeCount() {
    if (countsDone || !stats) return;
    var r = stats.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
      countsDone = true;
      stats.querySelectorAll(".stat__value[data-count]").forEach(countUp);
    }
  }

  /* ---------- 4. parallax on scroll ---------------------------------- */
  var layers = [].slice
    .call(document.querySelectorAll(".parallax-layer"))
    .map(function (el) {
      return { el: el, factor: el.closest(".work-row__media") ? -0.06 : 0.03 };
    });
  var heroLogo = document.querySelector(".hero__logo");
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var vh = window.innerHeight;
      sweepReveals();
      maybeCount();
      layers.forEach(function (l) {
        var r = l.el.getBoundingClientRect();
        var mid = r.top + r.height / 2 - vh / 2;
        var y = Math.max(-38, Math.min(38, mid * l.factor));
        l.el.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
      });
      if (heroLogo) {
        var p = Math.min(window.scrollY / (vh * 0.9), 1);
        heroLogo.style.opacity = (1 - p * 0.85).toFixed(3);
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- 5. hero logo pointer parallax -------------------------- */
  if (heroLogo && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener(
      "mousemove",
      function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;
        heroLogo.style.setProperty("--px", x.toFixed(3));
        heroLogo.style.setProperty("--py", y.toFixed(3));
      },
      { passive: true }
    );
  }

  /* ---------- 6. magnetic button ------------------------------------ */
  document.querySelectorAll(".magnetic").forEach(function (wrap) {
    var vis = wrap.querySelector(".magnetic__visual") || wrap;
    vis.style.transition = "transform .35s cubic-bezier(0.16,1,0.3,1)";
    wrap.addEventListener("mousemove", function (e) {
      var r = wrap.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      vis.style.transform =
        "translate(" + (dx * 0.3).toFixed(1) + "px," + (dy * 0.3).toFixed(1) + "px)";
    });
    wrap.addEventListener("mouseleave", function () {
      vis.style.transform = "";
    });
  });
})();
