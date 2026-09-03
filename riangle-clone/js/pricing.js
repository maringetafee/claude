/* =========================================================================
   Presupuesto orientativo — calculadora de servicios
   -------------------------------------------------------------------------
   Modelo transparente en euros. Base "Diseño + desarrollo" siempre incluida
   (contenidos y SEO dentro). Sólo suman las páginas extra y los add-ons.
   Cifras de referencia; el presupuesto final se confirma tras hablar con
   el cliente. Multi-instancia: cablea cada [data-calc] de la página.
   No toca ninguna animación: sólo lee inputs y escribe texto.
   ========================================================================= */
(function () {
  var roots = document.querySelectorAll("[data-calc]");
  if (!roots.length) return;

  var BASE = 799;              // diseño + desarrollo, 1 página, todo incluido
  var PER_EXTRA_PAGE = 120;    // cada página a partir de la primera
  var EXTRAS = { anim: 279, booking: 179, panel: 249 };

  var euro = function (n) {
    // agrupación es-ES manual (Intl no está garantizado en todos lados)
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
  };

  function wire(root) {
    var elTotal = root.querySelector("[data-calc-total]");
    var elSpec = root.querySelector("[data-calc-spec]");
    var elPages = root.querySelector("[data-calc-pages-value]");

    function readPages() {
      var r = root.querySelector('input[name="pages"]');
      return r ? parseInt(r.value, 10) || 1 : 1;
    }
    function readExtras() {
      return Array.prototype.map.call(
        root.querySelectorAll('input[name="extra"]:checked'),
        function (i) { return i.value; }
      );
    }

    var THUMB = 20; // matches .calc__range thumb width/height in components.css

    function positionPagesBubble() {
      if (!elPages) return;
      var range = root.querySelector('input[name="pages"]');
      if (!range) return;
      var min = parseFloat(range.min) || 0;
      var max = parseFloat(range.max) || 100;
      var val = parseFloat(range.value) || min;
      var pct = max > min ? (val - min) / (max - min) : 0;
      var trackWidth = range.offsetWidth;
      var centerPx = THUMB / 2 + pct * (trackWidth - THUMB);
      elPages.style.left = centerPx + "px";
    }

    function recompute() {
      var pages = readPages();
      var extras = readExtras();

      var total = BASE + Math.max(0, pages - 1) * PER_EXTRA_PAGE;
      extras.forEach(function (k) { total += EXTRAS[k] || 0; });

      if (elPages) elPages.textContent = String(pages);
      positionPagesBubble();

      if (elSpec) {
        var bits = ["Diseño + desarrollo", pages + (pages === 1 ? " página" : " páginas")];
        if (extras.length === 1) bits.push("1 extra");
        else if (extras.length > 1) bits.push(extras.length + " extras");
        elSpec.textContent = bits.join(" · ");
      }

      if (elTotal) elTotal.textContent = euro(total);
    }

    root.addEventListener("input", recompute);
    root.addEventListener("change", recompute);
    window.addEventListener("resize", positionPagesBubble);
    recompute();
  }

  Array.prototype.forEach.call(roots, wire);
})();
