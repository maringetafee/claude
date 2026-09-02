/* =========================================================================
   Presupuesto orientativo — precios.html
   Modelo transparente en euros. Cifras de referencia; el presupuesto
   final se confirma tras hablar con el cliente (mismo criterio que
   makemyweb.es, que muestra "Consultar").
   No toca ninguna animación: sólo lee inputs y escribe texto.
   ========================================================================= */
(function () {
  var root = document.querySelector("[data-calc]");
  if (!root) return;

  var BASE = { full: 690, design: 450, dev: 490 };
  var PER_EXTRA_PAGE = 120;
  var EXTRAS = { content: 150, seo: 180, anim: 350 };
  var SPEED = { d1: 200, d2: 120, normal: 0 };

  var MODE_LABEL = {
    full: "Diseño + desarrollo",
    design: "Solo diseño",
    dev: "Solo desarrollo"
  };
  var EXTRA_LABEL = {
    content: "ayuda con los contenidos",
    seo: "optimización SEO",
    anim: "página animada 3D"
  };
  var SPEED_LABEL = { d1: "en 24 h", d2: "en 48 h", normal: "a ritmo normal" };

  var euro = function (n) {
    // manual es-ES grouping (Intl locale data isn't guaranteed everywhere)
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
  };

  var elTotal = root.querySelector("[data-calc-total]");
  var elSpec = root.querySelector("[data-calc-spec]");
  var elPages = root.querySelector("[data-calc-pages-value]");
  var elAgency = root.querySelector("[data-calc-agency]");
  var elFree = root.querySelector("[data-calc-free]");

  function readMode() {
    var c = root.querySelector('input[name="mode"]:checked');
    return c ? c.value : "full";
  }
  function readSpeed() {
    var c = root.querySelector('input[name="speed"]:checked');
    return c ? c.value : "normal";
  }
  function readPages() {
    var r = root.querySelector('input[name="pages"]');
    return r ? parseInt(r.value, 10) || 1 : 1;
  }
  function readExtras() {
    return Array.prototype.filter.call(
      root.querySelectorAll('input[name="extra"]:checked'),
      function () { return true; }
    ).map(function (i) { return i.value; });
  }

  function recompute() {
    var mode = readMode();
    var pages = readPages();
    var speed = readSpeed();
    var extras = readExtras();

    var total = BASE[mode];
    total += Math.max(0, pages - 1) * PER_EXTRA_PAGE;
    extras.forEach(function (k) { total += EXTRAS[k] || 0; });
    total += SPEED[speed] || 0;

    if (elPages) elPages.textContent = pages + (pages === 1 ? " página" : " páginas");

    if (elSpec) {
      var bits = [MODE_LABEL[mode], pages + (pages === 1 ? " página" : " páginas")];
      if (extras.length) {
        bits.push(extras.map(function (k) { return EXTRA_LABEL[k]; }).join(", "));
      }
      bits.push(SPEED_LABEL[speed]);
      elSpec.textContent = bits.join(" · ");
    }

    if (elTotal) {
      elTotal.innerHTML = '<span>desde</span> ' + euro(total);
    }
    if (elAgency) elAgency.textContent = "≈ " + euro(Math.round((total * 3) / 50) * 50) + "+";
    if (elFree) elFree.textContent = "≈ " + euro(Math.round((total * 1.6) / 50) * 50) + "+";
  }

  root.addEventListener("input", recompute);
  root.addEventListener("change", recompute);
  recompute();
})();
