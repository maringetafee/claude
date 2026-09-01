/* Live "Studio time" readout — Europe/Zurich (CET/CEST), updates every second.
   Matches the original's HH:MM:SS + zone-abbreviation format. */
(function () {
  var els = document.querySelectorAll("[data-studio-clock]");
  if (!els.length) return;

  function parts() {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Zurich",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    }).formatToParts(new Date());
    var time = "",
      zone = "CET";
    fmt.forEach(function (p) {
      if (p.type === "hour" || p.type === "minute" || p.type === "second") {
        time += (time && p.type !== "literal" ? "" : "") + p.value;
        if (p.type !== "second") time += ":";
      }
      if (p.type === "timeZoneName") zone = p.value.replace("GMT+2", "CEST").replace("GMT+1", "CET");
    });
    return time + " " + zone;
  }

  function tick() {
    var s = parts();
    els.forEach(function (el) {
      el.textContent = s;
      el.setAttribute("datetime", new Date().toISOString());
    });
  }
  tick();
  setInterval(tick, 1000);
})();
