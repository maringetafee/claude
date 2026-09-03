/* =========================================================================
   SCROLL THREAD  —  js/scroll-thread.js
   -------------------------------------------------------------------------
   One absolutely-positioned SVG overlay, as tall as the document, drawn in
   DOCUMENT coordinates so it scrolls natively with the page (no JS involved
   in that part at all). A path is built from the live positions of the
   page's points of interest (hero mark, work rows, service rows, process
   steps, plans, FAQ, CTA…). The horizontal route is an organic meander down
   the CENTRE of the page: a smooth low-frequency function of absolute
   document position (meanderX) — wide Bézier turns, a slow drift left↔right
   through the middle, two wider excursions that slip briefly past a
   viewport edge, resampled between anchors so nothing overshoots. A comet
   head eases toward the point of the path at ~40% of the viewport height,
   so it reads as "following you down the page". Behind it trails a fading
   wake in the current section's band colour; each node lights + pulses in
   its own band colour as the head passes. Solid blocks (work photos, studio
   plate, plan cards) are lifted above the overlay so the line passes behind
   them. Palette = the --band-* tokens Servicios uses on hover.

   PERFORMANCE — this is deliberately split into two tiers:
     1. rebuild(): the expensive part (reads every anchor's position on the
        page, rebuilds the path, resamples it into 91 points). It only runs
        on load, on resize, and when a <details> (FAQ) toggle actually
        changes the page's height — never on scroll, since the anchors'
        DOCUMENT positions don't move when the user scrolls.
     2. frame(): runs every animation frame, but only eases the comet head
        toward its target and looks it up in the already-resampled points
        (plain array math) — no getBoundingClientRect, no getPointAtLength,
        no layout reads of any kind. This is the only part that needs to
        run at 60fps.

   Standalone: does NOT touch animations.js / animations.css / cursor.js.
   Gated by html.js-anim, min-width 901px, and prefers-reduced-motion.
   ========================================================================= */
(function () {
  var docEl = document.documentElement;
  if (!docEl.classList.contains("js-anim")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SVGNS = "http://www.w3.org/2000/svg";
  var mq = window.matchMedia("(min-width: 901px)");

  var SELECTORS = [
    ".hero__logo", ".page-head__title",
    ".work-row", ".cap-row", ".process-step",
    ".calc__form", ".plan-card", ".faq-item",
    ".studio-panel__stats", ".stories__pair", ".cta__middle"
  ];
  var BANDS = ["violet", "indigo", "emerald", "cyan", "amber", "flare", "brand"];
  var SEQ = ["violet", "indigo", "emerald", "cyan", "amber", "flare"];
  var FLOW_ORDER = ["violet", "indigo", "emerald", "cyan", "amber", "flare", "violet"];

  var EASE = 0.1, TRAIL = 260, FOCUS = 0.4, SAMPLES = 90;

  var svg, defs, base, travel, trail, headDot, headGlow, flow, wake, wake0, wake1, nodeLayer;
  var anchors = [], nodes = [];
  var running = false, built = false;

  // structural cache — only touched by rebuild(), read every frame by frame()
  var pts = [], LEN = 0, samp = [], ct = null;
  var headLen = 0;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function r1(n) { return Math.round(n * 10) / 10; }

  function palette() {
    var cs = getComputedStyle(docEl), out = {};
    BANDS.forEach(function (b) {
      var v = cs.getPropertyValue("--band-" + b);
      out[b] = (v && v.trim()) || "#f43333";
    });
    return out;
  }
  var COL = palette();

  function el(name, cls) {
    var n = document.createElementNS(SVGNS, name);
    if (cls) n.setAttribute("class", cls);
    return n;
  }
  function grad(id) {
    var g = el("linearGradient");
    g.setAttribute("id", id);
    g.setAttribute("gradientUnits", "userSpaceOnUse");
    return g;
  }
  function circ(cls, r) {
    var c = el("circle", cls);
    c.setAttribute("r", r);
    return c;
  }

  function build() {
    svg = el("svg", "scroll-thread");
    svg.setAttribute("aria-hidden", "true");

    defs = el("defs");
    flow = grad("thread-flow");
    FLOW_ORDER.forEach(function (b, i) {
      var s = el("stop");
      s.setAttribute("offset", (i / (FLOW_ORDER.length - 1)).toFixed(3));
      s.setAttribute("stop-color", COL[b]);
      flow.appendChild(s);
    });
    wake = grad("thread-wake");
    wake0 = el("stop"); wake0.setAttribute("offset", "0"); wake0.setAttribute("stop-opacity", "0");
    wake1 = el("stop"); wake1.setAttribute("offset", "1"); wake1.setAttribute("stop-opacity", "0.95");
    wake.appendChild(wake0); wake.appendChild(wake1);
    defs.appendChild(flow); defs.appendChild(wake);
    svg.appendChild(defs);

    base = el("path", "scroll-thread__base");
    travel = el("path", "scroll-thread__travel");
    trail = el("path", "scroll-thread__trail");
    nodeLayer = el("g");
    headGlow = circ("scroll-thread__glow", 11);
    headDot = circ("scroll-thread__head", 3.6);
    svg.appendChild(base);
    svg.appendChild(travel);
    svg.appendChild(nodeLayer);
    svg.appendChild(trail);
    svg.appendChild(headGlow);
    svg.appendChild(headDot);

    document.body.appendChild(svg);
    built = true;
  }

  function collect() {
    if (!built) return;
    nodes.forEach(function (n) { if (n.el) n.el.classList.remove("thread-lit"); });
    var seen = [];
    anchors = [];
    SELECTORS.forEach(function (sel) {
      var found;
      try { found = document.querySelectorAll(sel); } catch (e) { return; }
      Array.prototype.forEach.call(found, function (node) {
        if (seen.indexOf(node) !== -1) return;
        seen.push(node);
        var band = node.dataset ? node.dataset.band : null;
        if (BANDS.indexOf(band) === -1) band = null;
        anchors.push({ el: node, band: band });
      });
    });

    nodeLayer.textContent = "";
    nodes = anchors.map(function (a, i) {
      var band = a.band || SEQ[i % SEQ.length];
      var g = el("g");
      var pulse = circ("scroll-thread__pulse", 5);
      var ring = circ("scroll-thread__node", 3.5);
      pulse.setAttribute("stroke", COL[band]);
      g.appendChild(pulse);
      g.appendChild(ring);
      nodeLayer.appendChild(g);
      return { g: g, ring: ring, pulse: pulse, band: band, el: a.el, lit: false };
    });
  }

  // ---- organic centre-line meander -------------------------------------
  // x is a smooth, low-frequency function of the element's ABSOLUTE position
  // down the whole document, so the route is one coherent, designed path
  // (planned for the full page, not the current viewport). Only wide,
  // progressive turns — no repeating ripple, no corners.
  var TAU = Math.PI * 2;
  function bump(p, c, s) { return Math.exp(-Math.pow((p - c) / s, 2)); }
  function meanderX(absY, docH, vw) {
    var p = clamp(absY / Math.max(1, docH), 0, 1);
    // gentle central drift — three detuned low harmonics (a ~1.3-lobe main
    // drift, a slow half-page sway, a small irregular term so it never reads
    // as periodic). Sum ~[-1, 1]; keeps the line loosely around centre.
    var drift = (0.60 * Math.sin(p * TAU * 1.30 + 0.70)
               + 0.30 * Math.sin(p * TAU * 0.52 - 0.90)
               + 0.12 * Math.sin(p * TAU * 2.60 + 2.30)) / 0.95;
    var x = vw / 2 + drift * vw * 0.18;
    // two designed excursions: a wide sweep to the left ~1/3 down and one
    // back to the right ~2/3 down. Each eases the line out past a viewport
    // edge over roughly a screen and eases it back — Gaussian, so the turn
    // is broad with no corner, and the line re-enters on the same path.
    x -= bump(p, 0.300, 0.060) * vw * 0.58;
    x += bump(p, 0.685, 0.062) * vw * 0.50;
    return clamp(x, -vw * 0.16, vw * 1.16);
  }

  // Anchor + resample pass — reads layout (getBoundingClientRect), so it is
  // ONLY called from rebuild(), never from the per-frame loop. Points are in
  // absolute DOCUMENT coordinates (no scroll offset involved).
  function measure(docH, w, h) {
    var raw = [];
    anchors.forEach(function (a, i) {
      var r = a.el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var sy = window.pageYOffset || docEl.scrollTop || 0;
      raw.push({ absY: r.top + sy + r.height / 2, node: nodes[i] || null });
    });
    raw.sort(function (p, q) { return p.absY - q.absY; });
    if (!raw.length) return [];

    // merge anchors that sit almost on the same line
    var anch = [];
    raw.forEach(function (p) {
      var prev = anch[anch.length - 1];
      if (prev && p.absY - prev.absY < 16) {
        if (!prev.node && p.node) prev.node = p.node;
        return;
      }
      anch.push(p);
    });

    // resample the meander between anchors so wide gaps still bend smoothly
    // (Catmull-Rom through sparse points could otherwise overshoot)
    var STEP = 200;
    var out = [];
    var entryY = anch[0].absY - h * 0.62;        // enters from above the top
    out.push({ x: meanderX(entryY, docH, w), y: entryY, node: null });

    for (var i = 0; i < anch.length; i++) {
      if (i > 0) {
        var y0 = anch[i - 1].absY, y1 = anch[i].absY, gap = y1 - y0;
        var n = Math.floor(gap / STEP);
        for (var k = 1; k <= n; k++) {
          var ay = y0 + (gap * k) / (n + 1);
          out.push({ x: meanderX(ay, docH, w), y: ay, node: null });
        }
      }
      out.push({ x: meanderX(anch[i].absY, docH, w), y: anch[i].absY, node: anch[i].node });
    }

    var exitY = anch[anch.length - 1].absY + h * 0.6;
    out.push({ x: meanderX(exitY, docH, w), y: exitY, node: null });

    for (var m = 1; m < out.length; m++) {
      if (out[m].y < out[m - 1].y + 6) out[m].y = out[m - 1].y + 6;
    }
    return out;
  }

  function toPath(points) {
    var d = "M" + r1(points[0].x) + "," + r1(points[0].y);
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += "C" + r1(c1x) + "," + r1(c1y) + " " + r1(c2x) + "," + r1(c2y) + " " + r1(p2.x) + "," + r1(p2.y);
    }
    return d;
  }

  function chordTable(points) {
    var chord = [0], tot = 0;
    for (var c = 1; c < points.length; c++) {
      tot += Math.hypot(points[c].x - points[c - 1].x, points[c].y - points[c - 1].y);
      chord.push(tot);
    }
    return { chord: chord, tot: tot || 1 };
  }

  // Linear interpolation over the cached 91-point sample — replaces calling
  // base.getPointAtLength() from inside the per-frame loop.
  function pointAt(l) {
    l = clamp(l, 0, LEN);
    for (var i = 1; i < samp.length; i++) {
      if (samp[i].l >= l) {
        var a = samp[i - 1], b = samp[i];
        var span = b.l - a.l || 1;
        var t = (l - a.l) / span;
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      }
    }
    var last = samp[samp.length - 1];
    return { x: last.x, y: last.y };
  }

  function firePulse(n) {
    n.pulse.setAttribute("stroke", COL[n.band] || COL.brand);
    n.pulse.style.animation = "none";
    n.pulse.getBoundingClientRect();
    n.pulse.style.animation = "threadPulse 0.9s var(--ease-out)";
  }

  // ---- expensive, infrequent: only on load / resize / content-height change
  function rebuild() {
    if (!built) return;
    var w = window.innerWidth, h = window.innerHeight;
    var docH = Math.max(
      docEl.scrollHeight, docEl.offsetHeight,
      document.body ? document.body.scrollHeight : 0
    );

    pts = measure(docH, w, h);
    if (pts.length < 3) { LEN = 0; return; }

    svg.style.height = docH + "px";

    var d = toPath(pts);
    base.setAttribute("d", d);
    travel.setAttribute("d", d);
    trail.setAttribute("d", d);

    var len = base.getTotalLength();
    if (!len || !isFinite(len)) { LEN = 0; return; }
    LEN = len;

    var maxY = -Infinity;
    samp = [];
    for (var s = 0; s <= SAMPLES; s++) {
      var l = (s / SAMPLES) * LEN;
      var pt = base.getPointAtLength(l);
      if (pt.y < maxY) pt.y = maxY; else maxY = pt.y;
      samp.push({ l: l, x: pt.x, y: pt.y });
    }
    ct = chordTable(pts);

    // node positions are now static document coordinates — set once here,
    // frame() never has to touch node transforms again.
    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i], node = p.node;
      if (!node) continue;
      node.g.setAttribute("transform", "translate(" + r1(p.x) + "," + r1(p.y) + ")");
    }

    flow.setAttribute("x1", 0); flow.setAttribute("y1", r1(pts[0].y));
    flow.setAttribute("x2", 0); flow.setAttribute("y2", r1(pts[pts.length - 1].y));

    headLen = clamp(headLen, 0, LEN);
  }

  function headColour(hl) {
    for (var i = 1; i < pts.length - 1; i++) {
      var a = (ct.chord[i] / ct.tot) * LEN;
      var b = (ct.chord[i + 1] / ct.tot) * LEN;
      if (hl <= (a + b) / 2) {
        var n = pts[i].node;
        return n && n.band ? COL[n.band] : COL[SEQ[(i - 1 + SEQ.length) % SEQ.length]];
      }
    }
    var lastNode = pts[pts.length - 2] && pts[pts.length - 2].node;
    return lastNode && lastNode.band ? COL[lastNode.band] : COL.flare;
  }

  // ---- cheap, every frame: only array math + a handful of attribute writes
  function frame() {
    if (!running) return;
    if (!LEN || pts.length < 3) { requestAnimationFrame(frame); return; }

    var sy = window.pageYOffset || docEl.scrollTop || 0;
    var focusY = sy + window.innerHeight * FOCUS;

    var target;
    if (focusY <= samp[0].y) target = 0;
    else if (focusY >= samp[SAMPLES].y) target = LEN;
    else {
      target = LEN;
      for (var j = 1; j <= SAMPLES; j++) {
        if (samp[j].y >= focusY) {
          var span = samp[j].y - samp[j - 1].y || 1;
          var t = (focusY - samp[j - 1].y) / span;
          target = samp[j - 1].l + t * (samp[j].l - samp[j - 1].l);
          break;
        }
      }
    }

    headLen += (target - headLen) * EASE;
    if (Math.abs(target - headLen) < 0.4) headLen = target;
    headLen = clamp(headLen, 0, LEN);

    var head = pointAt(headLen);
    var tailL = Math.max(0, headLen - TRAIL);
    var tail = pointAt(tailL);

    travel.setAttribute("stroke-dasharray", r1(headLen) + " " + r1(LEN + 10));
    trail.setAttribute("stroke-dasharray", "0 " + r1(tailL) + " " + r1(headLen - tailL) + " " + r1(LEN + 10));

    var col = headColour(headLen);

    wake0.setAttribute("stop-color", col);
    wake1.setAttribute("stop-color", col);
    wake.setAttribute("x1", r1(tail.x)); wake.setAttribute("y1", r1(tail.y));
    wake.setAttribute("x2", r1(head.x)); wake.setAttribute("y2", r1(head.y));

    headDot.setAttribute("cx", r1(head.x)); headDot.setAttribute("cy", r1(head.y));
    headDot.setAttribute("fill", col);
    headGlow.setAttribute("cx", r1(head.x)); headGlow.setAttribute("cy", r1(head.y));
    headGlow.setAttribute("fill", col);

    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i];
      var n = p.node;
      if (!n) continue;
      var alen = (ct.chord[i] / ct.tot) * LEN;
      var dist = Math.abs(headLen - alen);
      if (dist < 60 && !n.lit) {
        n.lit = true;
        n.ring.setAttribute("fill", COL[n.band] || col);
        n.ring.setAttribute("stroke", COL[n.band] || col);
        n.ring.setAttribute("r", 5);
        if (n.el) n.el.classList.add("thread-lit");
        firePulse(n);
      } else if (n.lit && dist > 124) {
        n.lit = false;
        n.ring.setAttribute("fill", "var(--surface-page)");
        n.ring.setAttribute("stroke", "var(--line-strong)");
        n.ring.setAttribute("r", 3.5);
        if (n.el) n.el.classList.remove("thread-lit");
      }
    }

    requestAnimationFrame(frame);
  }

  function start() {
    if (!mq.matches || document.hidden) { stop(); return; }
    if (!built) build();
    if (!svg) return;
    collect();
    rebuild();
    if (running) return;
    running = true;
    requestAnimationFrame(function () {
      svg.classList.add("is-ready");
      requestAnimationFrame(frame);
    });
  }
  function stop() {
    running = false;
    if (svg) svg.classList.remove("is-ready");
  }

  document.addEventListener("animationend", function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains("scroll-thread__pulse")) {
      t.style.animation = "none";
    }
  }, true);

  // FAQ accordions are the one thing on this site that changes document
  // height mid-session — the toggle event doesn't bubble, so listen on the
  // capture phase (same trick already used above for animationend).
  document.addEventListener("toggle", function (e) {
    if (!running || !built) return;
    if (!e.target || e.target.tagName !== "DETAILS") return;
    requestAnimationFrame(rebuild);
  }, true);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var onMq = function () { if (mq.matches) start(); else stop(); };
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else if (mq.addListener) mq.addListener(onMq);

  window.addEventListener("load", function () {
    collect();
    rebuild();
  });

  var reColl;
  window.addEventListener("resize", function () {
    clearTimeout(reColl);
    reColl = setTimeout(function () {
      collect();
      rebuild();
    }, 200);
  });

  try {
    new MutationObserver(function () {
      COL = palette();
      if (flow) {
        Array.prototype.forEach.call(flow.children, function (st, i) {
          st.setAttribute("stop-color", COL[FLOW_ORDER[i]] || COL.brand);
        });
      }
      nodes.forEach(function (n) {
        if (!n.lit) return;
        n.ring.setAttribute("fill", COL[n.band] || COL.brand);
        n.ring.setAttribute("stroke", COL[n.band] || COL.brand);
      });
    }).observe(docEl, { attributes: true, attributeFilter: ["data-theme"] });
  } catch (e) {}

  if (document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
