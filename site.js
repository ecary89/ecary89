// erikacary.com — interactions for the editorial about page.
// Two behaviors: a wave hover across the hero name, and a fade-in compact
// header bar once the visitor scrolls past the hero.

(function () {
    'use strict';

    // --- Current year in the footer ---
    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Wave hover on the hero name ---
    // Render "Erika Cary" as per-letter spans. The wave center tracks the
    // cursor's X position *continuously* (a fractional index), so gliding
    // across letters slides the peak smoothly instead of snapping letter to
    // letter. Each letter j lifts by t = max(0, 1 - |j - center| / FALLOFF),
    // with the rose tint blended by t rather than switched at a threshold.
    var NAME = 'Erika Cary';
    var LIFT = 12;      // px
    var FALLOFF = 3.5;  // wider = more neighbors ride along
    var INK = [43, 33, 48];     // #2B2130
    var ROSE = [180, 84, 126];  // #B4547E

    var nameEl = document.getElementById('hero-name');
    var letters = [];

    if (nameEl) {
        NAME.split(' ').forEach(function (word) {
            var wordEl = document.createElement('span');
            wordEl.className = 'word';
            wordEl.setAttribute('aria-hidden', 'true');

            word.split('').forEach(function (chr) {
                var span = document.createElement('span');
                span.className = 'letter';
                span.textContent = chr;
                wordEl.appendChild(span);
                letters.push(span);
            });

            nameEl.appendChild(wordEl);
        });

        // Track the pointer over the whole name; only reset when it leaves
        // the name entirely, so crossing letter boundaries never interrupts
        // the in-flight transition (the source of the previous jerkiness).
        var pending = false;
        nameEl.addEventListener('pointermove', function (e) {
            if (e.pointerType === 'touch') return; // decorative; skip on touch
            var x = e.clientX;
            if (pending) return;
            pending = true;
            requestAnimationFrame(function () {
                pending = false;
                applyWave(centerFromX(x));
            });
        });
        nameEl.addEventListener('pointerleave', resetWave);
    }

    // Map a viewport X coordinate to a fractional letter index by
    // interpolating between letter centers.
    function centerFromX(x) {
        if (!letters.length) return 0;
        var last = letters.length - 1;
        var firstC = letterCenter(0);
        if (x <= firstC) return 0;
        var lastC = letterCenter(last);
        if (x >= lastC) return last;
        for (var i = 0; i < last; i++) {
            var a = letterCenter(i);
            var b = letterCenter(i + 1);
            if (x >= a && x <= b) return i + (x - a) / (b - a);
        }
        return 0;
    }

    function letterCenter(i) {
        var r = letters[i].getBoundingClientRect();
        return r.left + r.width / 2;
    }

    function applyWave(center) {
        for (var j = 0; j < letters.length; j++) {
            var t = Math.max(0, 1 - Math.abs(j - center) / FALLOFF);
            letters[j].style.transform = t > 0 ? 'translateY(' + (-LIFT * t).toFixed(2) + 'px)' : 'none';
            letters[j].style.color = mixColor(t);
        }
    }

    function resetWave() {
        for (var j = 0; j < letters.length; j++) {
            letters[j].style.transform = 'none';
            letters[j].style.color = rgb(INK);
        }
    }

    // Blend ink -> rose. smoothstep keeps distant letters ink and ramps the
    // tint in only near the peak, but without the hard threshold snap.
    function mixColor(t) {
        var m = smoothstep(0.35, 1, t);
        return rgb([
            INK[0] + (ROSE[0] - INK[0]) * m,
            INK[1] + (ROSE[1] - INK[1]) * m,
            INK[2] + (ROSE[2] - INK[2]) * m
        ]);
    }

    function smoothstep(e0, e1, x) {
        var u = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
        return u * u * (3 - 2 * u);
    }

    function rgb(c) {
        return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')';
    }

    // --- Fade-in compact header bar ---
    // Fades in (never a shrink animation) once scrolled past the hero.
    var bar = document.getElementById('header-bar');
    var SHOW_AT = 380;
    var visible = false;

    function onScroll() {
        var shouldShow = window.scrollY > SHOW_AT;
        if (shouldShow === visible) return;
        visible = shouldShow;
        if (bar) bar.classList.toggle('is-visible', visible);
    }

    if (bar) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
})();
