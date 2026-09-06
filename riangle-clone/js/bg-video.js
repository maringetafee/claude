/* =========================================================================
   BACKGROUND VIDEO  —  js/bg-video.js
   -------------------------------------------------------------------------
   Each <video> carries its real source(s) in data-src-desktop / data-src-mobile
   instead of `src`, so nothing loads until this script decides which file
   fits the viewport — a narrow screen never fetches the ~8MB desktop clip,
   and desktop never fetches the downscaled mobile one. The lift layer has
   no mobile source at all: below 900px it's skipped entirely (CSS also
   hides it) so a phone only ever decodes one lightweight video, not two.

   Reduced motion turns the whole thing off before any source is ever set.
   The two layers (desktop only) are kept in sync — the first is the master;
   if the second drifts more than 0.12s it's snapped back.
   ========================================================================= */
(function () {
  var host = document.querySelector(".bg-video");
  if (!host) return;
  var videos = Array.prototype.slice.call(host.querySelectorAll("video"));
  if (!videos.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var narrowQuery = window.matchMedia("(max-width: 900px)");

  function wantedSrc(video) {
    return narrowQuery.matches
      ? video.dataset.srcMobile || ""
      : video.dataset.srcDesktop || "";
  }

  function sync() {
    videos.forEach(function (v) {
      var wanted = wantedSrc(v);
      if (!wanted) {
        v.pause();
        v.removeAttribute("src");
        v.load();
        return;
      }
      if (v.getAttribute("src") !== wanted) {
        v.src = wanted;
        v.load();
      }
      v.play().catch(function () {});
    });
  }

  sync();
  narrowQuery.addEventListener("change", sync);

  var master = videos[0];
  master.addEventListener("timeupdate", function () {
    videos.forEach(function (v) {
      if (v === master || v.readyState < 2) return;
      if (Math.abs(v.currentTime - master.currentTime) > 0.12) {
        v.currentTime = master.currentTime;
      }
    });
  });
})();
