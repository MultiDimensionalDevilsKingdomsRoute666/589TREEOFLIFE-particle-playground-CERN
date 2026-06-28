/**
 * collider.js
 * Interactive collider UI component.
 *
 * Handles:
 *  - Parameter controls (energy, beam type, luminosity, channel)
 *  - Physics predictions panel (cross-section ratios)
 *  - Collision animation on the canvas
 *  - Particle detail panel on click
 */

(function initCollider() {

  /* ── Element references ──────────────────────────────────────────── */
  const canvas         = document.getElementById('colliderCanvas');
  const ctx            = canvas ? canvas.getContext('2d') : null;
  const overlay        = document.getElementById('colliderOverlay');
  const resultEl       = document.getElementById('colliderResult');
  const predList       = document.getElementById('predictionList');
  const energySlider   = document.getElementById('energySlider');
  const energyDisplay  = document.getElementById('energyDisplay');
  const energyFill     = document.getElementById('energyFill');
  const lumiSlider     = document.getElementById('lumiSlider');
  const lumiDisplay    = document.getElementById('lumiDisplay');
  const lumiFill       = document.getElementById('lumiFill');
  const focusChannel   = document.getElementById('focusChannel');
  const collideBtn     = document.getElementById('collideBtn');
  const collideBtnEn   = document.getElementById('collideBtnEnergy');
  const hudEnergy      = document.getElementById('hudEnergy');
  const hudEvents      = document.getElementById('hudEvents');
  const hudParticles   = document.getElementById('hudParticles');
  const detailEmpty    = document.querySelector('.particle-detail__empty');
  const detailContent  = document.getElementById('particleDetailContent');

  if (!canvas || !ctx) return;

  /* ── State ───────────────────────────────────────────────────────── */
  let currentEnergy  = 7000;
  let currentBeam    = 'pp';
  let currentChannel = 'all';
  let totalEvents    = 0;
  let totalParticles = 0;
  let lastResult     = null;
  let animTracks     = [];
  let selectedTrack  = null;
  let animId         = null;
  let W, H;

  const LUMI_LABELS = ['10³⁰', '10³¹', '10³²', '10³³', '10³⁴'];

  /* ── Resize canvas ───────────────────────────────────────────────── */
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width  || 600;
    H = canvas.height = rect.height || 500;
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  /* ── Energy slider ───────────────────────────────────────────────── */
  function formatEnergy(val) {
    return val >= 1000
      ? `${(val / 1000).toFixed(1)} TeV`
      : `${val} GeV`;
  }

  function updateSliderFill(slider, fill) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    fill.style.width = `${pct}%`;
  }

  energySlider.addEventListener('input', () => {
    currentEnergy = +energySlider.value;
    energyDisplay.textContent = formatEnergy(currentEnergy);
    collideBtnEn.textContent = formatEnergy(currentEnergy);
    updateSliderFill(energySlider, energyFill);
    updatePredictions();
  });
  updateSliderFill(energySlider, energyFill);

  lumiSlider.addEventListener('input', () => {
    lumiDisplay.textContent = LUMI_LABELS[+lumiSlider.value - 1];
    updateSliderFill(lumiSlider, lumiFill);
  });
  updateSliderFill(lumiSlider, lumiFill);

  /* ── Beam buttons ────────────────────────────────────────────────── */
  document.getElementById('beamSelector').addEventListener('click', e => {
    const btn = e.target.closest('.beam-btn');
    if (!btn) return;
    document.querySelectorAll('.beam-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentBeam = btn.dataset.beam;
    updatePredictions();
  });

  /* ── Channel select ──────────────────────────────────────────────── */
  focusChannel.addEventListener('change', () => {
    currentChannel = focusChannel.value;
    updatePredictions();
  });

  /* ── Predictions panel ───────────────────────────────────────────── */
  function updatePredictions() {
    if (typeof CollisionEngine === 'undefined') return;
    const preds = CollisionEngine.predict(currentEnergy, currentBeam, currentChannel);
    predList.innerHTML = '';
    preds.forEach((p, i) => {
      const pct = (p.prob * 100).toFixed(p.prob > 0.01 ? 1 : 3);
      const item = document.createElement('div');
      item.className = 'prediction-item';
      item.innerHTML = `
        <span class="prediction-name">${p.symbol}</span>
        <div class="prediction-bar-wrap">
          <div class="prediction-bar" style="width:0%; background:${p.color}"></div>
        </div>
        <span class="prediction-pct">${pct}%</span>
      `;
      predList.appendChild(item);
      // Animate bar
      setTimeout(() => {
        item.querySelector('.prediction-bar').style.width = `${Math.min(p.prob * 100, 100)}%`;
      }, i * 60 + 50);
    });
  }
  updatePredictions();

  /* ── Collide button ──────────────────────────────────────────────── */
  collideBtn.addEventListener('click', () => {
    if (typeof CollisionEngine === 'undefined') return;
    collideBtn.classList.add('firing');
    setTimeout(() => collideBtn.classList.remove('firing'), 450);

    // Play collision sound
    if (typeof window.playCollisionSound === 'function') {
      window.playCollisionSound(currentEnergy);
    }

    const result = CollisionEngine.collide(currentEnergy, currentBeam, currentChannel);
    lastResult = result;
    totalEvents++;
    totalParticles += result.products.length;

    // Update HUD
    hudEnergy.textContent    = formatEnergy(currentEnergy);
    hudEvents.textContent    = totalEvents.toLocaleString();
    hudParticles.textContent = totalParticles.toLocaleString();

    // Hide overlay, show result tags
    overlay.hidden = true;
    renderResultTags(result);

    // Animate tracks on canvas
    animateTracks(result);

    // Feed result to histogram
    if (typeof window.histogramFill === 'function') {
      window.histogramFill(result);
    }

    // Draw Feynman diagram for this process
    if (typeof window.feynmanDraw === 'function') {
      window.feynmanDraw(result.process.key);
    }
  });

  /* ── Result tags ─────────────────────────────────────────────────── */
  function renderResultTags(result) {
    resultEl.hidden = false;
    resultEl.innerHTML = result.products.map((p, i) => `
      <div class="result-particle" 
           style="color:${p.color}; border-color:${p.color}20; background:${p.color}12;
                  animation-delay:${i * 80}ms"
           data-index="${i}">
        ${p.symbol}${p.bTagged ? ' <small>b</small>' : ''}
      </div>
    `).join('');

    resultEl.querySelectorAll('.result-particle').forEach(el => {
      el.addEventListener('click', () => {
        const idx = +el.dataset.index;
        showParticleDetail(result.products[idx], idx);
        // Highlight track
        selectedTrack = idx;
      });
    });
  }

  /* ── Particle detail panel ───────────────────────────────────────── */
  function showParticleDetail(particle, idx) {
    detailEmpty.hidden = true;
    detailContent.hidden = false;

    // Find full particle data from the database
    const db = typeof PARTICLES !== 'undefined' ? PARTICLES : {};
    let dbEntry = null;
    const sym = particle.symbol.replace(/[⁺⁻]/g,'').replace('μ','mu').replace('γ','photon')
      .replace('ν','nu_e').replace('e','e').replace('H','higgs').replace('g','gluon')
      .replace('W','W').replace('Z','Z');
    // Simple lookup
    for (const key in db) {
      if (db[key].name.toLowerCase().includes(particle.name.toLowerCase().split(' ')[0])) {
        dbEntry = db[key]; break;
      }
    }

    detailContent.innerHTML = `
      <div class="detail-symbol" style="color:${particle.color}">${particle.symbol}</div>
      <div class="detail-name">${particle.name}</div>
      <div class="detail-category">${dbEntry ? dbEntry.category : 'Final-state particle'}</div>
      <div class="detail-props">
        <div class="detail-prop">
          <span class="detail-prop-key">pT</span>
          <span class="detail-prop-val">${particle.pT.toFixed(1)} GeV</span>
        </div>
        <div class="detail-prop">
          <span class="detail-prop-key">η (eta)</span>
          <span class="detail-prop-val">${particle.eta.toFixed(3)}</span>
        </div>
        <div class="detail-prop">
          <span class="detail-prop-key">φ (phi)</span>
          <span class="detail-prop-val">${particle.phi.toFixed(3)} rad</span>
        </div>
        <div class="detail-prop">
          <span class="detail-prop-key">Charge</span>
          <span class="detail-prop-val">${particle.charge > 0 ? '+' : ''}${particle.charge} e</span>
        </div>
        ${dbEntry ? `
        <div class="detail-prop">
          <span class="detail-prop-key">Mass</span>
          <span class="detail-prop-val">${dbEntry.mass}</span>
        </div>
        <div class="detail-prop">
          <span class="detail-prop-key">Spin</span>
          <span class="detail-prop-val">${dbEntry.spin}</span>
        </div>
        ` : ''}
        ${particle.bTagged ? `
        <div class="detail-prop">
          <span class="detail-prop-key">b-tagged</span>
          <span class="detail-prop-val" style="color:#ff6b35">✓ Yes</span>
        </div>
        ` : ''}
      </div>
      ${dbEntry ? `<p class="detail-desc">${dbEntry.desc.substring(0, 200)}…</p>` : ''}
    `;
  }

  /* ── Canvas track animation ──────────────────────────────────────── */
  class Track {
    constructor(particle, idx, totalTracks) {
      this.particle = particle;
      this.idx = idx;
      // Start at canvas center
      this.x0 = W / 2;
      this.y0 = H / 2;
      // Direction from phi
      const angle = particle.phi + Math.PI / 2;
      const speed = particle.isMET ? 1.5 : (particle.isJet ? 3.5 : 4.5);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      // Current position
      this.x = this.x0;
      this.y = this.y0;
      // Track history for trail
      this.trail = [{ x: this.x0, y: this.y0 }];
      this.progress = 0;
      this.maxLen = particle.isJet ? 80 : particle.isMET ? 50 : 110;
      this.done = false;
      this.color = particle.color;
      this.alpha = 1;
    }

    update() {
      if (this.progress >= this.maxLen) { this.done = true; return; }
      this.x += this.vx;
      this.y += this.vy;
      // Magnetic field curvature for charged particles
      if (this.particle.charge !== 0 && !this.particle.isJet) {
        const sign = this.particle.charge > 0 ? 1 : -1;
        const tmp = this.vx;
        this.vx += sign * this.vy * 0.018;
        this.vy -= sign * tmp * 0.018;
      }
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 60) this.trail.shift();
      this.progress++;
    }

    draw(ctx, selected) {
      if (this.trail.length < 2) return;
      const isSelected = selected === this.idx;
      ctx.save();
      ctx.globalAlpha = isSelected ? 1 : 0.65;
      ctx.lineWidth = isSelected ? (this.particle.isJet ? 4 : 2.5) : (this.particle.isJet ? 2 : 1.5);
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = isSelected ? 18 : 6;

      if (this.particle.isJet) {
        // Jets: cone shape
        this.drawJetCone(ctx);
      } else if (this.particle.isMET) {
        // MET: dashed
        ctx.setLineDash([6, 6]);
        this.drawLine(ctx);
        ctx.setLineDash([]);
      } else {
        // Charged tracks: curved line
        this.drawLine(ctx);
        // Endpoint dot
        const last = this.trail[this.trail.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, isSelected ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      ctx.restore();
    }

    drawLine(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.stroke();
    }

    drawJetCone(ctx) {
      const last = this.trail[this.trail.length - 1];
      const dx = last.x - this.x0;
      const dy = last.y - this.y0;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / len, ny = dy / len;
      const spread = 20 + (this.particle.particle?.pT || 50) / 20;

      // Draw 5 sub-jets in a cone
      for (let k = -2; k <= 2; k++) {
        const jitter = k * (spread / 4) / (this.maxLen * 0.8);
        ctx.globalAlpha = 0.3 - Math.abs(k) * 0.06;
        ctx.beginPath();
        ctx.moveTo(this.x0, this.y0);
        let cx = this.x0, cy = this.y0;
        for (const pt of this.trail) {
          const perp = { x: -ny * jitter * this.progress, y: nx * jitter * this.progress };
          cx = pt.x + perp.x;
          cy = pt.y + perp.y;
        }
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }
    }
  }

  function animateTracks(result) {
    cancelAnimationFrame(animId);
    animTracks = result.products.map((p, i) => new Track(p, i, result.products.length));

    // Beam animation first (protons rushing in)
    let beamFrame = 0;
    const beamDuration = 20;

    function loop() {
      ctx.clearRect(0, 0, W, H);

      // Background grid
      drawDetectorGrid();

      if (beamFrame < beamDuration) {
        drawBeams(beamFrame / beamDuration);
        beamFrame++;
      } else {
        // Draw collision flash
        if (beamFrame === beamDuration) {
          drawCollisionFlash();
          beamFrame++;
        }
        // Update and draw tracks
        let allDone = true;
        for (const t of animTracks) {
          t.update();
          t.draw(ctx, selectedTrack);
          if (!t.done) allDone = false;
        }
        // If all done, keep drawing static
        if (allDone) {
          for (const t of animTracks) t.draw(ctx, selectedTrack);
          // Still loop for interactivity
        }
      }

      animId = requestAnimationFrame(loop);
    }
    loop();
  }

  function drawDetectorGrid() {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 0.5;
    // Concentric circles (detector layers)
    [60, 110, 170, 230, 290].forEach(r => {
      ctx.beginPath();
      ctx.arc(W/2, H/2, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    // Radial lines
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(W/2, H/2);
      ctx.lineTo(W/2 + Math.cos(a) * 300, H/2 + Math.sin(a) * 300);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBeams(progress) {
    const ease = 1 - Math.pow(1 - progress, 3);
    const cx = W / 2, cy = H / 2;
    ctx.save();
    // Left beam
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(cx * ease, cy);
    ctx.stroke();
    // Right beam
    ctx.strokeStyle = '#ff0080';
    ctx.shadowColor = '#ff0080';
    ctx.beginPath();
    ctx.moveTo(W, cy);
    ctx.lineTo(W - cx * ease, cy);
    ctx.stroke();
    ctx.restore();
  }

  function drawCollisionFlash() {
    const cx = W/2, cy = H/2;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
    grd.addColorStop(0,   'rgba(255,255,255,0.9)');
    grd.addColorStop(0.3, 'rgba(0,229,255,0.4)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  }

  // Click on canvas to select track
  canvas.addEventListener('click', e => {
    if (!animTracks.length) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);

    let closest = null, minDist = 20;
    animTracks.forEach((t, i) => {
      for (const pt of t.trail) {
        const d = Math.hypot(pt.x - mx, pt.y - my);
        if (d < minDist) { minDist = d; closest = i; }
      }
    });

    if (closest !== null && lastResult) {
      selectedTrack = closest;
      showParticleDetail(lastResult.products[closest], closest);
    }
  });

})();
