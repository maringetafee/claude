/* =========================================================================
   ¿Qué tipo de negocio tienes?  —  js/business-picker.js
   -------------------------------------------------------------------------
   The panel swap itself is pure CSS (:has() on the checked radio, see
   components.css). This only copies the chosen radio's data-biz-for /
   -spec / -cta into the summary card's [data-biz-out] slots and, when the
   CTA is clicked, pre-fills the contact form's message so the lead arrives
   already saying what they want — without ever overwriting text the
   visitor typed themselves.
   ========================================================================= */
(function () {
  var root = document.querySelector("[data-biz]");
  if (!root) return;

  var elFor = root.querySelector('[data-biz-out="for"]');
  var elSpec = root.querySelector('[data-biz-out="spec"]');
  var cta = root.querySelector('[data-biz-out="cta"]');
  var message = document.querySelector('#contacto textarea[name="message"]');
  var lastPrefill = "";

  function current() {
    return root.querySelector('input[name="biz"]:checked');
  }

  function render() {
    var r = current();
    if (!r) return;
    if (elFor) elFor.textContent = r.dataset.bizFor;
    if (elSpec) elSpec.textContent = r.dataset.bizSpec;
    if (cta) cta.textContent = r.dataset.bizCta;
  }

  root.addEventListener("change", render);

  if (cta && message) {
    cta.addEventListener("click", function () {
      var r = current();
      if (!r) return;
      var typed = message.value.trim();
      if (typed && message.value !== lastPrefill) return;
      message.value = lastPrefill = r.dataset.bizMsg;
    });
  }

  render();
})();
