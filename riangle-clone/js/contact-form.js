// Wires every [data-cta-form] to the existing Netlify function
// (netlify/functions/notify-lead.js on the makemyweb.es site) that sends
// the client confirmation + internal lead notification via Resend.
(function () {
  var ENDPOINT = "/.netlify/functions/notify-lead";

  document.querySelectorAll("[data-cta-form]").forEach(function (form) {
    var wrap = form.closest("[data-cta-form-wrap]") || form.parentElement;
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');
    var label = button ? button.querySelector("[data-cta-form-label]") : null;
    var note = wrap.querySelector("[data-cta-form-note]");
    var success = wrap.querySelector("[data-cta-form-success]");
    var defaultLabel = label ? label.textContent : "";
    var sending = false;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending || !input.value) return;
      sending = true;
      if (label) label.textContent = "Enviando…";
      if (button) button.disabled = true;

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("request failed");
          form.hidden = true;
          if (note) note.hidden = true;
          if (success) success.hidden = false;
        })
        .catch(function () {
          sending = false;
          if (label) label.textContent = defaultLabel;
          if (button) button.disabled = false;
          if (note) {
            note.textContent = "No se ha podido enviar. Escríbenos a makemyweb.info@gmail.com.";
          }
        });
    });
  });
})();
