(function () {
  var root = document.getElementById('landing');
  var nav = document.getElementById('nav3d');
  var toggle = document.getElementById('themeToggle');
  var words = Array.prototype.slice.call(document.querySelectorAll('.word'));
  if (!root || !nav) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var THEME = {
    black: { bg: [10, 10, 10], fg: [245, 245, 245] },
    white: { bg: [255, 255, 255], fg: [10, 10, 10] }
  };

  var stored = null;
  try { stored = localStorage.getItem('ph-theme'); } catch (e) {}
  var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  var current = stored === 'black' || stored === 'white' ? stored : (prefersLight ? 'white' : 'black');

  function applyTheme(name) {
    current = name;
    root.setAttribute('data-theme', name);
    if (toggle) {
      toggle.setAttribute('aria-checked', name === 'white' ? 'true' : 'false');
      toggle.setAttribute('aria-label', 'Switch background to ' + (name === 'white' ? 'black' : 'white'));
    }
    try { localStorage.setItem('ph-theme', name); } catch (e) {}
  }
  applyTheme(current);

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(current === 'black' ? 'white' : 'black');
    });
  }

  words.forEach(function (w) {
    w.style.opacity = '0';
    w.style.transform = 'translateY(28px)';
  });
  words.forEach(function (w, i) {
    setTimeout(function () {
      w.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
      w.style.opacity = '1';
      w.style.transform = 'translateY(0)';
    }, 60 + i * 110);
  });

  var rx = 0, ry = 0, targetRx = 0, targetRy = 0;
  var hoverBoost = {};
  words.forEach(function (w, i) {
    hoverBoost[i] = 1;
    w.addEventListener('pointerenter', function () { hoverBoost[i] = 1.55; });
    w.addEventListener('pointerleave', function () { hoverBoost[i] = 1; });
  });

  function lerpColor(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];
  }

  function buildShadow(depth, ry, rx) {
    var steps = 9;
    var mag = Math.min(1, Math.sqrt(ry * ry + rx * rx) / 12);
    var t = THEME[current];
    var parts = [];
    for (var i = 1; i <= steps; i++) {
      var f = i / steps;
      var ox = (ry * 0.11) * depth / 16 * f;
      var oy = (-rx * 0.11) * depth / 16 * f;
      var c = lerpColor(t.fg, t.bg, f * (0.55 + mag * 0.4));
      parts.push(ox.toFixed(2) + 'px ' + oy.toFixed(2) + 'px 0 rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',1)');
    }
    return parts.join(',');
  }

  var lastMove = Date.now();
  window.addEventListener('pointermove', function (e) {
    var r = root.getBoundingClientRect();
    var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    nx = Math.max(-1, Math.min(1, nx));
    ny = Math.max(-1, Math.min(1, ny));
    targetRy = nx * 9;
    targetRx = -ny * 7;
    lastMove = Date.now();
  }, { passive: true });

  function frame(t) {
    var idle = (Date.now() - lastMove) > 1400;
    var ax = idle ? Math.sin(t * 0.00042) * 2.4 : 0;
    var ay = idle ? Math.cos(t * 0.00035) * 2.0 : 0;

    if (!reduceMotion) {
      rx += ((targetRx + ax) - rx) * 0.06;
      ry += ((targetRy + ay) - ry) * 0.06;
      nav.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      words.forEach(function (w, i) {
        var depth = parseFloat(w.getAttribute('data-depth')) * (hoverBoost[i] || 1);
        w.style.textShadow = buildShadow(depth, ry, rx);
      });
    } else {
      words.forEach(function (w) {
        var depth = parseFloat(w.getAttribute('data-depth')) * 0.5;
        w.style.textShadow = buildShadow(depth, 0, 0);
      });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
