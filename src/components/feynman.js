/**
 * feynman.js
 * Feynman Diagram Renderer
 *
 * Her çarpışmadan sonra o sürecin Feynman diyagramını canvas üzerinde çizer.
 * Animasyonlu — parçacıklar soldan sağa ilerler, köşede etkileşim oluşur.
 *
 * Feynman diyagramlarında:
 *  - Düz çizgiler → fermiyonlar (quark, lepton)
 *  - Dalgalı çizgiler → foton, W/Z bozonu
 *  - Kıvrımlı çizgiler → gluon
 *  - Ok yönü → parçacık akışı (zaman soldan sağa)
 */

(function initFeynman() {

  /* ── Diyagram tanımları ──────────────────────────────────────────── */
  const DIAGRAMS = {

    dijet: {
      title: 'QCD Dijet Production',
      subtitle: 'q + q → q + q (gluon exchange)',
      description: 'Two quarks exchange a virtual gluon — the carrier of the strong force. ' +
                   'The gluon is never observed directly; it exists only as an intermediate state ' +
                   'that transfers momentum between the quarks.',
      color: '#69ff47',
      draw: drawQCDDijet,
    },

    W: {
      title: 'W Boson Production & Decay',
      subtitle: 'q + q̄ → W± → ℓ + ν',
      description: 'A quark and antiquark annihilate to produce a virtual W boson, which then ' +
                   'decays into a lepton and a neutrino. This is the charged-current weak interaction — ' +
                   'responsible for nuclear beta decay.',
      color: '#00e5ff',
      draw: drawWBoson,
    },

    Z: {
      title: 'Z Boson Production & Decay',
      subtitle: 'q + q̄ → Z⁰ → ℓ⁺ + ℓ⁻',
      description: 'A quark-antiquark pair annihilates via the neutral-current weak interaction ' +
                   'to produce a Z boson. The Z then decays into two leptons of opposite charge. ' +
                   'The invariant mass of the lepton pair peaks at 91.2 GeV — the Z pole.',
      color: '#80deea',
      draw: drawZBoson,
    },

    higgs: {
      title: 'Higgs Boson Production (ggF)',
      subtitle: 'g + g → t-loop → H',
      description: 'Two gluons fuse via a virtual top quark loop to produce the Higgs boson. ' +
                   'This is the dominant Higgs production mechanism at the LHC. ' +
                   'The top quark loop is necessary because gluons do not couple to the Higgs directly.',
      color: '#ff0080',
      draw: drawHiggs,
    },

    ttbar: {
      title: 'Top Quark Pair Production',
      subtitle: 'g + g → t + t̄',
      description: 'Two gluons produce a top-antitop quark pair. The top quark is the heaviest ' +
                   'known fundamental particle (172 GeV) and decays almost instantly into a W boson ' +
                   'and a bottom quark before it can hadronize.',
      color: '#ff6b35',
      draw: drawTTbar,
    },

    photonJet: {
      title: 'Prompt Photon + Jet',
      subtitle: 'q + g → q + γ',
      description: 'A quark and a gluon interact via the QCD Compton process to produce a ' +
                   'high-energy photon and a recoiling quark jet. The photon is called "prompt" ' +
                   'because it emerges directly from the hard scatter, not from hadron decay.',
      color: '#ffd740',
      draw: drawPhotonJet,
    },
  };

  /* ── DOM setup ───────────────────────────────────────────────────── */
  // Create the Feynman panel (injected after collider canvas)
  const feynmanSection = document.createElement('div');
  feynmanSection.id = 'feynmanPanel';
  feynmanSection.className = 'feynman-panel';
  feynmanSection.innerHTML = `
    <div class="feynman-panel__header">
      <div class="feynman-panel__titles">
        <span class="feynman-panel__tag">Feynman Diagram</span>
        <span class="feynman-panel__title" id="feynmanTitle">—</span>
        <span class="feynman-panel__subtitle" id="feynmanSubtitle">Press COLLIDE to generate a diagram</span>
      </div>
    </div>
    <div class="feynman-panel__canvas-wrap">
      <canvas id="feynmanCanvas"></canvas>
      <div class="feynman-empty" id="feynmanEmpty">
        <div class="feynman-empty__line"></div>
        <span class="feynman-empty__text">Awaiting collision</span>
        <div class="feynman-empty__line"></div>
      </div>
    </div>
    <div class="feynman-panel__desc" id="feynmanDesc"></div>
  `;

  // Insert after collider section header
  const colliderSection = document.getElementById('collider');
  if (colliderSection) {
    const colliderLab = colliderSection.querySelector('.collider-lab');
    if (colliderLab) colliderLab.after(feynmanSection);
  }

  const canvas  = document.getElementById('feynmanCanvas');
  const ctx     = canvas ? canvas.getContext('2d') : null;
  const emptyEl = document.getElementById('feynmanEmpty');
  const titleEl = document.getElementById('feynmanTitle');
  const subEl   = document.getElementById('feynmanSubtitle');
  const descEl  = document.getElementById('feynmanDesc');

  if (!canvas || !ctx) return;

  let W, H, animId;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width  || 700;
    H = canvas.height = 220;
    canvas.style.height = H + 'px';
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  /* ── Public API: called by collider.js ───────────────────────────── */
  window.feynmanDraw = function(processKey) {
    const key = processKey || 'dijet';
    // Map collider process keys to diagram keys
    const keyMap = {
      dijet: 'dijet',
      W: 'W',
      Z: 'Z',
      higgs: 'higgs',
      ttbar: 'ttbar',
      photonJet: 'photonJet',
    };
    const diagKey = keyMap[key] || 'dijet';
    const diag = DIAGRAMS[diagKey];
    if (!diag) return;

    if (emptyEl) emptyEl.style.display = 'none';
    if (titleEl) titleEl.textContent = diag.title;
    if (subEl)   subEl.textContent   = diag.subtitle;
    if (descEl)  descEl.textContent  = diag.description;

    cancelAnimationFrame(animId);
    let progress = 0;

    function loop() {
      progress = Math.min(1, progress + 0.018);
      ctx.clearRect(0, 0, W, H);
      diag.draw(ctx, W, H, progress, diag.color);
      if (progress < 1) animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
  };

  /* ══════════════════════════════════════════════════════════════════
     DRAWING PRIMITIVES
     ══════════════════════════════════════════════════════════════════ */

  /** Draw a straight fermion line with arrow */
  function drawFermion(ctx, x1, y1, x2, y2, color, label, progress, reverse) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const ex = x1 + dx * progress;
    const ey = y1 + dy * progress;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Arrow at midpoint
    if (progress > 0.5) {
      const mx = x1 + dx * 0.5;
      const my = y1 + dy * 0.5;
      const angle = Math.atan2(dy, dx) + (reverse ? Math.PI : 0);
      const aLen = 8;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - Math.cos(angle - 0.4) * aLen, my - Math.sin(angle - 0.4) * aLen);
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - Math.cos(angle + 0.4) * aLen, my - Math.sin(angle + 0.4) * aLen);
      ctx.stroke();
    }

    // Label
    if (progress > 0.8 && label) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.globalAlpha = (progress - 0.8) / 0.2;
      ctx.font = `italic 13px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 10);
    }
    ctx.restore();
  }

  /** Draw wavy line (photon/W/Z boson) */
  function drawWavy(ctx, x1, y1, x2, y2, color, label, progress) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const steps = Math.floor(len / 6);
    const nx = -dy / len, ny = dx / len; // normal
    const amp = 6;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    const drawLen = len * progress;
    ctx.moveTo(x1, y1);
    for (let i = 1; i <= steps * progress; i++) {
      const t = i / steps;
      const x = x1 + dx * t;
      const y = y1 + dy * t;
      const wave = Math.sin(i * Math.PI) * amp;
      ctx.lineTo(x + nx * wave, y + ny * wave);
    }
    ctx.stroke();

    if (progress > 0.8 && label) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.globalAlpha = (progress - 0.8) / 0.2;
      ctx.font = `italic bold 13px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 14);
    }
    ctx.restore();
  }

  /** Draw curly gluon line */
  function drawGluon(ctx, x1, y1, x2, y2, color, label, progress) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx*dx + dy*dy);
    const nx = -dy / len, ny = dx / len;
    const loops = 5;
    const amp = 7;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const totalSteps = 80;
    for (let i = 1; i <= totalSteps * progress; i++) {
      const t = i / totalSteps;
      const x = x1 + dx * t;
      const y = y1 + dy * t;
      const wave = Math.sin(t * loops * Math.PI * 2) * amp;
      const curl = Math.cos(t * loops * Math.PI * 2) * amp * 0.3;
      ctx.lineTo(x + nx * wave + (dx/len) * curl, y + ny * wave + (dy/len) * curl);
    }
    ctx.stroke();

    if (progress > 0.8 && label) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.globalAlpha = (progress - 0.8) / 0.2;
      ctx.font = `italic bold 13px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(label, (x1 + x2) / 2, (y1 + y2) / 2 - 16);
    }
    ctx.restore();
  }

  /** Vertex dot */
  function drawVertex(ctx, x, y, color, progress, delay = 0) {
    const p = Math.max(0, (progress - delay) / (1 - delay));
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /** Time axis label */
  function drawTimeAxis(ctx, W, H) {
    ctx.save();
    ctx.fillStyle = 'rgba(138,154,181,0.3)';
    ctx.font = `10px 'DM Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('TIME →', W / 2, H - 8);

    ctx.strokeStyle = 'rgba(138,154,181,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(W * 0.1, H / 2);
    ctx.lineTo(W * 0.9, H / 2);
    ctx.stroke();
    ctx.restore();
  }

  /* ══════════════════════════════════════════════════════════════════
     DIAGRAM IMPLEMENTATIONS
     ══════════════════════════════════════════════════════════════════ */

  function drawQCDDijet(ctx, W, H, p, color) {
    drawTimeAxis(ctx, W, H);
    const cx = W / 2, cy = H / 2;
    const x1 = W * 0.12, x2 = W * 0.42, x3 = W * 0.58, x4 = W * 0.88;
    const y1 = cy - 55, y2 = cy + 55;

    // Initial quarks
    drawFermion(ctx, x1, y1, x2, y1, color, 'q', Math.min(1, p / 0.4), false);
    drawFermion(ctx, x1, y2, x2, y2, color, 'q', Math.min(1, p / 0.4), false);

    // Gluon exchange (vertical)
    drawGluon(ctx, x2, y1, x2, y2, '#ff6b35', 'g', Math.max(0, Math.min(1, (p - 0.35) / 0.35)));

    // Vertices
    drawVertex(ctx, x2, y1, color, p, 0.3);
    drawVertex(ctx, x2, y2, color, p, 0.3);

    // Outgoing quarks
    drawFermion(ctx, x2, y1, x4, y1, color, 'q', Math.max(0, Math.min(1, (p - 0.65) / 0.35)), false);
    drawFermion(ctx, x2, y2, x4, y2, color, 'q', Math.max(0, Math.min(1, (p - 0.65) / 0.35)), false);

    // Jet labels
    if (p > 0.88) {
      ctx.save();
      ctx.globalAlpha = (p - 0.88) / 0.12;
      ctx.fillStyle = color;
      ctx.font = `11px 'DM Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('→ jet', x4 + 6, y1 + 4);
      ctx.fillText('→ jet', x4 + 6, y2 + 4);
      ctx.restore();
    }
  }

  function drawWBoson(ctx, W, H, p, color) {
    drawTimeAxis(ctx, W, H);
    const cx = W / 2, cy = H / 2;
    const vx = W * 0.4;

    // Incoming q and q-bar
    drawFermion(ctx, W * 0.1, cy - 50, vx, cy, color, 'q', Math.min(1, p / 0.38), false);
    drawFermion(ctx, W * 0.1, cy + 50, vx, cy, '#ff6b35', 'q̄', Math.min(1, p / 0.38), true);

    drawVertex(ctx, vx, cy, color, p, 0.32);

    // W boson
    drawWavy(ctx, vx, cy, W * 0.62, cy, color, 'W±', Math.max(0, Math.min(1, (p - 0.35) / 0.3)));
    drawVertex(ctx, W * 0.62, cy, color, p, 0.6);

    // Decay products
    drawFermion(ctx, W * 0.62, cy, W * 0.9, cy - 50, '#ff4081', 'ℓ', Math.max(0, Math.min(1, (p - 0.65) / 0.35)), false);
    drawFermion(ctx, W * 0.62, cy, W * 0.9, cy + 50, 'rgba(255,255,255,0.4)', 'ν', Math.max(0, Math.min(1, (p - 0.65) / 0.35)), false);

    if (p > 0.88) {
      ctx.save();
      ctx.globalAlpha = (p - 0.88) / 0.12;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('(undetected)', W * 0.9 + 4, cy + 54);
      ctx.restore();
    }
  }

  function drawZBoson(ctx, W, H, p, color) {
    drawTimeAxis(ctx, W, H);
    const cx = W / 2, cy = H / 2;
    const vx1 = W * 0.38, vx2 = W * 0.62;

    drawFermion(ctx, W * 0.1, cy - 50, vx1, cy, '#ff6b35', 'q', Math.min(1, p / 0.36), false);
    drawFermion(ctx, W * 0.1, cy + 50, vx1, cy, '#ff9b65', 'q̄', Math.min(1, p / 0.36), true);

    drawVertex(ctx, vx1, cy, color, p, 0.3);
    drawWavy(ctx, vx1, cy, vx2, cy, color, 'Z⁰', Math.max(0, Math.min(1, (p - 0.33) / 0.3)));
    drawVertex(ctx, vx2, cy, color, p, 0.58);

    drawFermion(ctx, vx2, cy, W * 0.9, cy - 50, '#ff4081', 'μ⁻', Math.max(0, Math.min(1, (p - 0.62) / 0.38)), false);
    drawFermion(ctx, vx2, cy, W * 0.9, cy + 50, '#ff4081', 'μ⁺', Math.max(0, Math.min(1, (p - 0.62) / 0.38)), true);

    // Invariant mass label
    if (p > 0.9) {
      ctx.save();
      ctx.globalAlpha = (p - 0.9) / 0.1;
      ctx.fillStyle = color;
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('m_inv = 91.2 GeV', W / 2, H - 22);
      ctx.restore();
    }
  }

  function drawHiggs(ctx, W, H, p, color) {
    drawTimeAxis(ctx, W, H);
    const cx = W / 2, cy = H / 2;

    // Two gluons incoming
    drawGluon(ctx, W * 0.1, cy - 45, W * 0.35, cy - 20, '#ff6b35', 'g', Math.min(1, p / 0.35));
    drawGluon(ctx, W * 0.1, cy + 45, W * 0.35, cy + 20, '#ff6b35', 'g', Math.min(1, p / 0.35));

    // Top quark triangle loop
    if (p > 0.3) {
      const lp = Math.min(1, (p - 0.3) / 0.4);
      ctx.save();
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = lp * 0.8;
      ctx.beginPath();
      ctx.moveTo(W * 0.35, cy - 20);
      ctx.lineTo(W * 0.52, cy - 36);
      ctx.lineTo(W * 0.52, cy + 36);
      ctx.lineTo(W * 0.35, cy + 20);
      ctx.lineTo(W * 0.35, cy - 20);
      ctx.stroke();

      // Loop label
      if (lp > 0.6) {
        ctx.globalAlpha = (lp - 0.6) / 0.4;
        ctx.fillStyle = '#ff6b35';
        ctx.font = `italic 11px 'DM Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('t', W * 0.43, cy);
      }
      ctx.restore();
    }

    // Higgs boson
    if (p > 0.65) {
      drawWavy(ctx, W * 0.52, cy, W * 0.9, cy, color, 'H', Math.min(1, (p - 0.65) / 0.35));
    }

    drawVertex(ctx, W * 0.52, cy - 36, '#ff6b35', p, 0.28);
    drawVertex(ctx, W * 0.52, cy + 36, '#ff6b35', p, 0.28);
    drawVertex(ctx, W * 0.52, cy, color, p, 0.62);

    if (p > 0.88) {
      ctx.save();
      ctx.globalAlpha = (p - 0.88) / 0.12;
      ctx.fillStyle = color;
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('m_H = 125.2 GeV', W * 0.75, cy - 18);
      ctx.restore();
    }
  }

  function drawTTbar(ctx, W, H, p, color) {
    drawTimeAxis(ctx, W, H);
    const cy = H / 2;

    drawGluon(ctx, W * 0.1, cy - 40, W * 0.42, cy, '#ff6b35', 'g', Math.min(1, p / 0.36));
    drawGluon(ctx, W * 0.1, cy + 40, W * 0.42, cy, '#ff6b35', 'g', Math.min(1, p / 0.36));
    drawVertex(ctx, W * 0.42, cy, color, p, 0.3);
    drawFermion(ctx, W * 0.42, cy, W * 0.88, cy - 50, color, 't', Math.max(0, Math.min(1, (p - 0.35) / 0.65)), false);
    drawFermion(ctx, W * 0.42, cy, W * 0.88, cy + 50, '#ff9b65', 't̄', Math.max(0, Math.min(1, (p - 0.35) / 0.65)), true);

    if (p > 0.88) {
      ctx.save();
      ctx.globalAlpha = (p - 0.88) / 0.12;
      ctx.fillStyle = color;
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'right';
      ctx.fillText('m_t = 172.6 GeV', W * 0.87, cy - 56);
      ctx.restore();
    }
  }

  function drawPhotonJet(ctx, W, H, p, color) {
    drawTimeAxis(ctx, W, H);
    const cy = H / 2;
    const vx = W * 0.46;

    drawFermion(ctx, W * 0.1, cy - 42, vx, cy, '#69ff47', 'q', Math.min(1, p / 0.38), false);
    drawGluon(ctx, W * 0.1, cy + 42, vx, cy, '#ff6b35', 'g', Math.min(1, p / 0.38));
    drawVertex(ctx, vx, cy, color, p, 0.32);
    drawFermion(ctx, vx, cy, W * 0.88, cy - 42, '#69ff47', 'q', Math.max(0, Math.min(1, (p - 0.38) / 0.62)), false);
    drawWavy(ctx, vx, cy, W * 0.88, cy + 42, color, 'γ', Math.max(0, Math.min(1, (p - 0.42) / 0.58)));
  }

})();
