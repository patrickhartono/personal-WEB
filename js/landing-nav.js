(function () {
  var words = Array.prototype.slice.call(document.querySelectorAll('.word'));
  if (!words.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

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
})();
