/* Mobile menu overlay open/close. Purely functional — the original also
   animates the sheet in (glass fade + item stagger); that belongs in
   animations.stub.js. */
(function () {
  var burger = document.querySelector(".burger");
  var overlay = document.getElementById("site-menu");
  if (!burger || !overlay) return;

  function setOpen(open) {
    overlay.toggleAttribute("data-open", open);
    overlay.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.toggleAttribute("data-menu-open", open);
  }

  burger.addEventListener("click", function () {
    setOpen(!overlay.hasAttribute("data-open"));
  });
  overlay.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
