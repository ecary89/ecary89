(function () {
  var canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var BG       = '#FAF6EF';
  var RADIUS   = 80;   // scratch brush radius (px)
  var MIN_DIST = 4;    // min px between brush points
  var lastX = null, lastY = null;

  // ── Fill canvas with cream (covers glow blobs) ───────────────
  function fillCream() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ── Erase cream to reveal gradient beneath ───────────────────
  function scratch(x, y) {
    if (lastX !== null) {
      var dx = x - lastX, dy = y - lastY;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) return;
    }
    lastX = x; lastY = y;

    ctx.globalCompositeOperation = 'destination-out';
    var g = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);
    g.addColorStop(0,    'rgba(0,0,0,1)');
    g.addColorStop(0.4,  'rgba(0,0,0,0.95)');
    g.addColorStop(0.72, 'rgba(0,0,0,0.45)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── Reset: cover everything with cream again ─────────────────
  function clearCanvas() {
    fillCream();
    lastX = lastY = null;
  }

  // ── Resize: canvas dimensions reset automatically ────────────
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    fillCream();
  }

  // ── Input handlers ───────────────────────────────────────────
  window.addEventListener('mousemove', function (e) { scratch(e.clientX, e.clientY); });
  window.addEventListener('dblclick',  function ()  { clearCanvas(); });
  window.addEventListener('resize',    resize);

  // ── Init ─────────────────────────────────────────────────────
  document.fonts.ready.then(function () {
    resize();
    canvas.style.opacity = '1';
  });

  window.clearCanvas     = clearCanvas;
  window.redrawParchment = clearCanvas;
}());
