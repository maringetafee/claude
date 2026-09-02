/* =========================================================================
   SCROLL THREAD  —  js/scroll-thread.js
   -------------------------------------------------------------------------
   One fixed SVG overlay. A path is rebuilt every frame from the live
   positions of the page's points of interest (hero mark, work rows, each
   service row, each process step, plans, FAQ, CTA…). A comet head eases
   toward the point of the path that sits at ~40% of the viewport height, so
   it reads as "following you down the page", taking whatever detour the
   route needs. Behind it trails a fading wake in the current section's band
   colour; each node lights + pulses in its own band colour as the head
   passes. Palette = the same --band-* tokens Servicios uses on hover.

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
    ".hero__logo", ".page-head__title", ".positioning__statement",
    ".work-row", ".cap-row", ".process-step",
    ".calc__form", ".plan-card", ".faq-item",
    ".studio-panel__stats", ".stories__pair", ".cta__middle"
  ];
  var BANDS = ["violet", "indigo", "emerald", "cyan", "amber", "flare", "brand"];
  var SEQ = ["violet", "indigo", "emerald", "cyan", "amber", "flare"];
  var FLOW_ORDER = ["violet", "indigo", "emerald", "cyan", "amber", "flare", "violet"];

  var EASE = 0.12, TRAIL = 230, FOCUS = 0.4, SAMPLES = 72;

  var svg, defs, base, travel, trail, headDot, headGlow, flow, wake, wake0, wake1, nodeLayer;
  var anchors = [], nodes = [];
  var headLen = 0, running = false, built = false;

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
    collect();
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

  function measure() {
    var w = window.innerWidth, h = window.innerHeight;

    var raw = [];
    anchors.forEach(function (a, i) {
      var r = a.el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      raw.push({
        y: r.top + r.height / 2,
        left: r.left,
        wide: r.width > w * 0.55,
        node: nodes[i] || null
      });
    });
    raw.sort(function (p, q) { return p.y - q.y; });

    // the thread lives in the left gutter, left of all content — so it never
    // crosses text. On wide screens the gutter is deep and it can weave; on
    // narrow ones it stays a slim ribbon hugging the edge.
    var guard = 99999;
    raw.forEach(function (p) { if (p.left > 4 && p.left < guard) guard = p.left; });
    if (guard === 99999) guard = 64;
    guard = clamp(guard, 30, 340);
    var railX = clamp(guard * 0.3, 11, 110);
    var reach = clamp(guard * 0.62, 16, 220);
    var xMax = guard - 8;

    var pts = raw.map(function (p, k) {
      var wave = 0.42 + 0.48 * Math.sin(k * 1.15 + 0.6);
      var pull = clamp((p.left - guard) / (w * 0.5), 0, 1);
      var lean = wave * 0.72 + pull * 0.28;
      if (p.wide) lean = Math.max(lean, 0.5);
      var x = clamp(railX + lean * reach, 8, xMax);
      return { x: x, y: p.y, node: p.node };
    });

    for (var m = 1; m < pts.length; m++) {
      if (pts[m].y < pts[m - 1].y + 8) pts[m].y = pts[m - 1].y + 8;
    }
    if (pts.length) {
      pts.unshift({ x: pts[0].x - reach * 0.15, y: pts[0].y - h * 0.6, node: null });
      var last = pts[pts.length - 1];
      pts.push({ x: last.x, y: last.y + h * 0.6, node: null });
    }
    return pts;
  }

  function toPath(pts) {
    var d = "M" + r1(pts[0].x) + "," + r1(pts[0].y);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += "C" + r1(c1x) + "," + r1(c1y) + " " + r1(c2x) + "," + r1(c2y) + " " + r1(p2.x) + "," + r1(p2.y);
    }
    return d;
  }

  function chordTable(pts) {
    var chord = [0], tot = 0;
    for (var c = 1; c < pts.length; c++) {
      tot += Math.hypot(pts[c].x - pts[c - 1].x, pts[c].y - pts[c - 1].y);
      chord.push(tot);
    }
    return { chord: chord, tot: tot || 1 };
  }

  function firePulse(n) {
    n.pulse.setAttribute("stroke", COL[n.band] || COL.brand);
    n.pulse.style.animation = "none";
    n.pulse.getBoundingClientRect();
    n.pulse.style.animation = "threadPulse 0.9s var(--ease-out)";
  }

  function frame() {
    if (!running) return;
    var pts = measure();
    if (pts.length < 3) { requestAnimationFrame(frame); return; }

    var d = toPath(pts);
    base.setAttribute("d", d);
    travel.setAttribute("d", d);
    trail.setAttribute("d", d);

    var LEN = base.getTotalLength();
    if (!LEN || !isFinite(LEN)) { requestAnimationFrame(frame); return; }

    var maxY = -Infinity, samp = [];
    for (var s = 0; s <= SAMPLES; s++) {
      var l = (s / SAMPLES) * LEN;
      var pt = base.getPointAtLength(l);
      if (pt.y < maxY) pt.y = maxY; else maxY = pt.y;
      samp.push({ l: l, y: pt.y });
    }

    var focusY = window.innerHeight * FOCUS;
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

    var head = base.getPointAtLength(headLen);
    var tailL = Math.max(0, headLen - TRAIL);
    var tail = base.getPointAtLength(tailL);

    travel.setAttribute("stroke-dasharray", r1(headLen) + " " + r1(LEN + 10));
    trail.setAttribute("stroke-dasharray", "0 " + r1(tailL) + " " + r1(headLen - tailL) + " " + r1(LEN + 10));

    var ct = chordTable(pts);
    var col = headColour(pts, ct, headLen, LEN);

    wake0.setAttribute("stop-color", col);
    wake1.setAttribute("stop-color", col);
    wake.setAttribute("x1", r1(tail.x)); wake.setAttribute("y1", r1(tail.y));
    wake.setAttribute("x2", r1(head.x)); wake.setAttribute("y2", r1(head.y));

    flow.setAttribute("x1", 0); flow.setAttribute("y1", r1(pts[0].y));
    flow.setAttribute("x2", 0); flow.setAttribute("y2", r1(pts[pts.length - 1].y));

    headDot.setAttribute("cx", r1(head.x)); headDot.setAttribute("cy", r1(head.y));
    headDot.setAttribute("fill", col);
    headGlow.setAttribute("cx", r1(head.x)); headGlow.setAttribute("cy", r1(head.y));
    headGlow.setAttribute("fill", col);

    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i];
      var n = p.node;
      if (!n) continue;
      var alen = (ct.chord[i] / ct.tot) * LEN;
      n.g.setAttribute("transform", "translate(" + r1(p.x) + "," + r1(p.y) + ")");
      var dist = Math.abs(headLen - alen);
      if (dist < 52 && !n.lit) {
        n.lit = true;
        n.ring.setAttribute("fill", COL[n.band] || col);
        n.ring.setAttribute("stroke", COL[n.band] || col);
        n.ring.setAttribute("r", 5);
        if (n.el) n.el.classList.add("thread-lit");
        firePulse(n);
      } else if (n.lit && dist > 108) {
        n.lit = false;
        n.ring.setAttribute("fill", "var(--surface-page)");
        n.ring.setAttribute("stroke", "var(--line-strong)");
        n.ring.setAttribute("r", 3.5);
        if (n.el) n.el.classList.remove("thread-lit");
      }
    }

    requestAnimationFrame(frame);
  }

  function headColour(pts, ct, hl, LEN) {
    for (var i = 1; i < pts.length - 1; i++) {
      var a = (ct.chord[i] / ct.tot) * LEN;
      var b = (ct.chord[i + 1] / ct.tot) * LEN;
      if (hl <= (a + b) / 2) {
        var n = pts[i].node;
        return n && n.band ? COL[n.band] : COL[SEQ[(i - 1 + SEQ.length) % SEQ.length]];
      }
    }
    var lastNode = pts[pts.length - 2].node;
    return lastNode && lastNode.band ? COL[lastNode.band] : COL.flare;
  }

  function start() {
    if (!mq.matches || document.hidden) { stop(); return; }
    if (!built) build();
    if (!svg || running) return;
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

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var onMq = function () { if (mq.matches) start(); else stop(); };
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else if (mq.addListener) mq.addListener(onMq);

  window.addEventListener("load", function () { collect(); });

  var reColl;
  window.addEventListener("resize", function () {
    clearTimeout(reColl);
    reColl = setTimeout(collect, 200);
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
