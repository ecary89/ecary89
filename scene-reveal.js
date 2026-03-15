(function () {
  var scenes         = Array.from(document.querySelectorAll('.scene'));
  var canvas         = document.getElementById('scratch-canvas');
  var dots           = Array.from(document.querySelectorAll('.dot'));
  var nameplateLines = Array.from(document.querySelectorAll('.nameplate-line'));
  var current        = 0;

  // Each line becomes visible when its scene is reached:
  //   line 0 (Erika Cary)                   → scene 1
  //   line 1 (Lead Product Designer...)      → scene 2
  //   line 2 (Thinks like a strategist.)     → scene 3
  //   line 3 (Works like a collaborator.)    → scene 4
  //   line 4 (Ships like a builder.)         → scene 5
  var LINE_SCENE = [1, 2, 3, 4, 5];

  function updateNameplate(idx) {
    nameplateLines.forEach(function (line, i) {
      line.style.transitionDelay = '';
      if (idx >= LINE_SCENE[i]) {
        line.classList.add('visible');
      } else {
        line.classList.remove('visible');
      }
    });
  }

  // ── Navigation cooldown (prevents skipping scenes) ──────────────
  var locked = false;
  var COOLDOWN_MS = 750;  // matches scene transition duration

  function go(idx, direction) {
    if (idx < 0 || idx >= scenes.length) return;

    var outgoing = scenes[current];
    var incoming = scenes[idx];

    // Exit outgoing in the correct direction
    outgoing.classList.remove('active');
    outgoing.classList.add(direction >= 0 ? 'is-leaving-up' : 'is-leaving-down');

    // Bring incoming to front so its entrance is visible above the outgoing scene
    incoming.style.zIndex = '2';

    if (direction < 0) {
      // Going backward: snap to above viewport (no transition), then slide down
      incoming.style.transition = 'none';
      incoming.style.transform = 'translateY(-60px)';
      incoming.style.opacity = '0';
      // Double rAF ensures the browser has painted the snapped position
      // before we re-enable the transition and trigger the animation
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          incoming.style.transition = '';
          incoming.style.transform = '';
          incoming.style.opacity = '';
          incoming.classList.add('active');
        });
      });
    } else {
      // Going forward: default CSS translateY(60px) is already the right start
      incoming.classList.add('active');
    }

    // Clean up exit classes and temporary z-index once transition is done
    var leaving = outgoing;
    var entering = incoming;
    setTimeout(function () {
      leaving.classList.remove('is-leaving-up', 'is-leaving-down');
      entering.style.zIndex = '';
    }, 1000);

    if (dots[current]) dots[current].classList.remove('active');
    if (dots[idx])     dots[idx].classList.add('active');

    current = idx;
    updateNameplate(idx);
    document.body.classList.toggle('scene-contact', idx === scenes.length - 1);
  }

  function navigate(idx) {
    if (locked) return;
    go(idx, idx > current ? 1 : -1);
    locked = true;
    setTimeout(function () { locked = false; }, COOLDOWN_MS);
  }

  // Dot click navigation
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = parseInt(dot.dataset.scene, 10);
      go(target, target > current ? 1 : -1);
      locked = true;
      setTimeout(function () { locked = false; }, COOLDOWN_MS);
    });
  });

  // ── Scroll wheel ────────────────────────────────────────────────
  var scrollBuffer = 0;
  var THRESHOLD = 80;

  window.addEventListener('wheel', function (e) {
    if (locked) { scrollBuffer = 0; return; }
    scrollBuffer += e.deltaY;
    if (scrollBuffer > THRESHOLD) {
      navigate(current + 1);
      scrollBuffer = 0;
    } else if (scrollBuffer < -THRESHOLD) {
      navigate(current - 1);
      scrollBuffer = 0;
    }
  }, { passive: true });

  // ── Keyboard ────────────────────────────────────────────────────
  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(current + 1);
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  navigate(current - 1);
  });

  // ── Touch swipe ─────────────────────────────────────────────────
  var touchStartY = null;

  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (touchStartY === null) return;
    var delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) {
      navigate(delta > 0 ? current + 1 : current - 1);
    }
    touchStartY = null;
  }, { passive: true });
}());
