/* Theme toggle — mirrors riangle.com behaviour (class/attr + persisted choice).
   The original stores it in a `theme` cookie read by the Next.js server;
   here we use localStorage. The inline <head> script sets the initial value
   before first paint to avoid a flash. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#07080B" : "#F43333";
  }

  apply(current());
  btn.addEventListener("click", function () {
    apply(current() === "dark" ? "light" : "dark");
  });

  // follow the OS if the user never made an explicit choice
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener &&
    mq.addEventListener("change", function (e) {
      var stored;
      try { stored = localStorage.getItem("theme"); } catch (err) {}
      if (!stored) apply(e.matches ? "dark" : "light");
    });
})();
