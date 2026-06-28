/**
 * heroCanvas.js
 * Animated particle field for the hero section.
 * Renders a network of drifting nodes connected by proximity edges,
 * mimicking the visual language of a particle detector event display.
 */

(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, animId;
  const NODE_COUNT = 80;
  const CONNECT_DIST = 140;
  const SPEED = 0.35;

  // Color palette matching the CSS design system
  const COLORS = ['#00e5ff', '#ff4081', '#ffd740', '#69ff47', '#e040fb'];

  class Node {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.r  = Math.random() * 2 + 0.8;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      // Wrap around edges
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
      // Pulsating radius
      this.currentR = this.r + Math.sin(t * 0.002 + this.pulsePhase) * 0.5;
    }

    draw(t) {
      const alpha = this.alpha + Math.sin(t * 0.003 + this.pulsePhase) * 0.1;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      // Glow
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.currentR * 4);
      grd.addColorStop(0, this.color);
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentR * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.globalAlpha = alpha * 0.3;
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentR, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.restore();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: NODE_COUNT }, () => new Node());
  }

  function drawEdges(t) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = nodes[i].color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  let t0 = null;
  function animate(ts) {
    if (!t0) t0 = ts;
    const t = ts - t0;
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => { n.update(t); n.draw(t); });
    drawEdges(t);
    animId = requestAnimationFrame(animate);
  }

  const ro = new ResizeObserver(() => { resize(); });
  ro.observe(canvas.parentElement);
  resize();
  animId = requestAnimationFrame(animate);

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animId = requestAnimationFrame(animate);
  });
})();
