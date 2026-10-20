(() => {
  'use strict';
  const viewport = document.getElementById('viewport');
  const overlay = document.getElementById('web-skeleton-overlay');
  const toggle = document.getElementById('web-mode-toggle');
  if (!viewport || !overlay || !toggle) return;
  const ctx = overlay.getContext('2d');
  if (!ctx) { toggle.disabled = true; return; }
  let enabled = false;
  let dpr = 1;

  function silhouettePath() {
    const p = new Path2D();
    p.moveTo(0, -150);
    p.bezierCurveTo(24, -150, 31, -126, 25, -108);
    p.bezierCurveTo(39, -103, 54, -96, 63, -83);
    p.lineTo(77, -31); p.bezierCurveTo(82, -17, 76, -7, 68, -10);
    p.lineTo(48, -63); p.lineTo(40, -27); p.lineTo(36, 20);
    p.lineTo(28, 83); p.lineTo(23, 143);
    p.bezierCurveTo(22, 157, 8, 157, 5, 144); p.lineTo(0, 84);
    p.lineTo(-5, 144); p.bezierCurveTo(-8, 157, -22, 157, -23, 143);
    p.lineTo(-28, 83); p.lineTo(-36, 20); p.lineTo(-40, -27);
    p.lineTo(-48, -63); p.lineTo(-68, -10);
    p.bezierCurveTo(-76, -7, -82, -17, -77, -31); p.lineTo(-63, -83);
    p.bezierCurveTo(-54, -96, -39, -103, -25, -108);
    p.bezierCurveTo(-31, -126, -24, -150, 0, -150); p.closePath();
    return p;
  }

  function resize() {
    const r = viewport.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    overlay.width = Math.max(1, Math.round(r.width * dpr));
    overlay.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (enabled) draw(); else ctx.clearRect(0, 0, r.width, r.height);
  }

  function draw() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    ctx.clearRect(0, 0, w, h);
    if (!enabled || !w || !h) return;
    const scale = Math.min(h * .74 / 307, w * .55 / 164);
    ctx.save(); ctx.translate(w * .5, h * .52); ctx.scale(scale, scale);
    const silhouette = silhouettePath();
    ctx.strokeStyle = 'rgba(95,242,213,.72)'; ctx.lineWidth = 1.1;
    ctx.shadowColor = 'rgba(95,242,213,.24)'; ctx.shadowBlur = 5;
    ctx.stroke(silhouette);
    ctx.save(); ctx.clip(silhouette); ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(180,255,245,.48)'; ctx.lineWidth = .72;
    // Radial strands and curved cross-strands make a spider-web pattern inside the silhouette.
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
      ctx.beginPath(); ctx.moveTo(0, 6);
      ctx.lineTo(Math.cos(angle) * 190, 6 + Math.sin(angle) * 190); ctx.stroke();
    }
    for (let radius = 18; radius <= 180; radius += 18) {
      ctx.beginPath();
      ctx.ellipse(0, 6, radius * .59, radius, -.04, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore(); ctx.restore();
  }

  function setEnabled(next) {
    enabled = Boolean(next);
    viewport.classList.toggle('web-mode', enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.title = enabled ? 'Tắt hiệu ứng màng nhện' : 'Bật hiệu ứng màng nhện';
    toggle.querySelectorAll('span')[1].textContent = enabled ? 'Màng nhện · Bật' : 'Màng nhện';
    draw();
  }
  toggle.addEventListener('click', () => setEnabled(!enabled));
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewport);
  else window.addEventListener('resize', resize, { passive: true });
  resize();
})();
