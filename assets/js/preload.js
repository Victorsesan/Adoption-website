/* ═══════════════════════════════════════════════════════════
   Pet Center — Preload Page Detection & Fade-Out
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var MIN_DISPLAY = 1800;
  var start = Date.now();

  function hidePreload() {
    var overlay = document.getElementById('pc-preload');
    if (!overlay) return;
    var elapsed = Date.now() - start;
    var delay = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(function () {
      overlay.classList.add('fade-out');
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 750);
    }, delay);
  }

  if (document.readyState === 'complete') {
    hidePreload();
  } else {
    window.addEventListener('load', hidePreload);
    setTimeout(hidePreload, 5000);
  }
})();
