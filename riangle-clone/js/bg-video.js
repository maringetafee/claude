/* =========================================================================
   BACKGROUND VIDEO  —  js/bg-video.js
   -------------------------------------------------------------------------
   Keeps the two background video layers in sync (the first is the master;
   if the second drifts more than 0.12s it's snapped back), and turns the
   whole thing off for reduced motion or narrow viewports instead of
   fighting the CSS gate with a paused-but-still-decoding video.
   ========================================================================= */
(function () {
  var host = document.querySelector(".bg-video");
  if (!host) return;
  var videos = Array.prototype.slice.call(host.querySelectorAll("video"));
  if (!videos.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var narrow = window.matchMedia("(max-width: 900px)").matches;
  if (reduced || narrow) {
    videos.forEach(function (v) {
      v.pause();
      v.removeAttribute("autoplay");
    });
    return;
  }

  var master = videos[0];
  master.addEventListener("timeupdate", function () {
    videos.forEach(function (v) {
      if (v === master) return;
      if (Math.abs(v.currentTime - master.currentTime) > 0.12) {
        v.currentTime = master.currentTime;
      }
    });
  });
})();
