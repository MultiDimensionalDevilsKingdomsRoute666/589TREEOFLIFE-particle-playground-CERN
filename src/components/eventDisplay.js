/**
 * eventDisplay.js
 * CMS-style event display for real collision events.
 *
 * Renders particles in the transverse (r-φ) plane:
 *  - Tracks: arcs curving in the magnetic field (charged particles)
 *  - Jets: filled cones representing hadronic energy deposits
 *  - Photons: straight dashed lines
 *  - Missing ET: dotted arc showing inferred neutrino direction
 */

(function initEventDisplay() {

  const canvas       = document.getElementById('eventsCanvas');
  const ctx          = canvas ? canvas.getContext('2d') : null;
  const cardsEl      = document.getElementById('eventsCards');
  const shuffleBtn   = document.getElementById('shuffleEvents');

  if (!canvas || !ctx || typeof CMS_EVENTS === 'undefined') return;

  let W, H, CX, CY;
  let activeEvent = null;
  let animId = null;
  let drawProgress = 0;

  /* ── Resize ──────────────────────────────────────────────────────── */
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width  = rect.width  || 600;
    H = canvas.height = Math.max(rect.height, 380);
    canvas.style.height = H + 'px';
    CX = W / 2;
    CY = H / 2;
    if (activeEvent) drawEvent(activeEvent, 1);
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  /* ── Render event cards ──────────────────────────────────────────── */
  function renderCards(events) {
    cardsEl.innerHTML = '';
    events.forEach((ev, i) => {
      const el = document.createElement('div');
      el.className = 'event-card reveal';
      el.dataset.idx = i;
      el.innerHTML = `
        <div class="event-card__id">${ev.id}</div>
        <div class="event-card__type">${ev.type}</div>
        <div class="event-card__particles">
          ${ev.tags.map(t => `<span class="event-tag">${t}</span>`).join('')}
        </div>
      `;
      el.addEventListener('click', () => selectEvent(i, el));
      cardsEl.appendChild(el);

      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }

  /* ── Select event ────────────────────────────────────────────────── */
  function selectEvent(idx, el) {
    document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    activeEvent = CMS_EVENTS[idx];
    animateEvent(activeEvent);
  }

  /* ── Animate event drawing ───────────────────────────────────────── */
  function animateEvent(ev) {
    cancelAnimationFrame(animId);
    drawProgress = 0;

    function loop() {
      drawProgress = Math.min(1, drawProgress + 0.04);
      drawEvent(ev, drawProgress);
      if (drawProgress < 1) animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
  }

  /* ── Main draw routine ───────────────────────────────────────────── */
  function drawEvent(ev, progress) {
    ctx.clearRect(0, 0, W, H);

    const R = Math.min(CX, CY) * 0.85;

    // Background
    drawDetectorLayers(R);

    // All particle types
    (ev.muons     || []).forEach(p => drawTrack(p, R, progress, 2.5));
    (ev.electrons || []).forEach(p => drawTrack(p, R, progress, 2));
    (ev.photons   || []).forEach(p => drawPhoton(p, R, progress));
    (ev.jets      || []).forEach(p => drawJet(p, R, progress));
    if ((ev.met || 0) > 10) drawMET(ev.met, ev, R, progress);

    // Center dot
    const flash = Math.max(0, 1 - progress * 3);
    if (flash > 0) {
      const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, 40);
      grd.addColorStop(0, `rgba(255,255,255,${flash})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(CX - 40, CY - 40, 80, 80);
    }
    ctx.beginPath();
    ctx.arc(CX, CY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Event info overlay
    drawEventInfo(ev, R);
  }

  /* ── Detector layer circles ──────────────────────────────────────── */
  function drawDetectorLayers(R) {
    const layers = [
      { r: R * 0.15, label: 'Beam pipe',   dash: [] },
      { r: R * 0.30, label: 'Pixel',       dash: [4,4] },
      { r: R * 0.55, label: 'Silicon Strip',dash: [4,4] },
      { r: R * 0.75, label: 'ECAL',        dash: [] },
      { r: R * 0.88, label: 'HCAL',        dash: [] },
      { r: R,        label: 'Muon System', dash: [6,3] },
    ];

    layers.forEach(l => {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = l.dash.length ? 0.5 : 1;
      ctx.setLineDash(l.dash);
      ctx.beginPath();
      ctx.arc(CX, CY, l.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Phi gridlines
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + Math.cos(a) * R * 1.05, CY + Math.sin(a) * R * 1.05);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ── Charged track (muon / electron) ────────────────────────────── */
  function drawTrack(particle, R, progress, lineW) {
    const phi = particle.phi;
    const r_end = particle.name === 'muon' || particle.color === '#ff4081' ? R : R * 0.74;
    const reach = r_end * progress;

    // Curvature due to magnetic field (B = 3.8 T in CMS)
    const curvature = (particle.charge || 0) * 0.015;

    ctx.save();
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = lineW;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(CX, CY);

    const steps = 60;
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * reach;
      const angle = phi + curvature * t / R;
      ctx.lineTo(
        CX + Math.cos(angle) * t,
        CY + Math.sin(angle) * t
      );
    }
    ctx.stroke();

    // Endpoint dot
    if (progress > 0.8) {
      const angle = phi + curvature * reach / R;
      const alpha = (progress - 0.8) / 0.2;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(
        CX + Math.cos(angle) * reach,
        CY + Math.sin(angle) * reach,
        3, 0, Math.PI * 2
      );
      ctx.fillStyle = particle.color;
      ctx.fill();
    }
    ctx.restore();
  }

  /* ── Photon ──────────────────────────────────────────────────────── */
  function drawPhoton(particle, R, progress) {
    const phi = particle.phi;
    const reach = R * 0.74 * progress;

    ctx.save();
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 14;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + Math.cos(phi) * reach, CY + Math.sin(phi) * reach);
    ctx.stroke();

    // ECAL hit square
    if (progress > 0.7) {
      const ex = CX + Math.cos(phi) * R * 0.74;
      const ey = CY + Math.sin(phi) * R * 0.74;
      ctx.globalAlpha = (progress - 0.7) / 0.3;
      ctx.setLineDash([]);
      ctx.fillStyle = particle.color;
      ctx.fillRect(ex - 5, ey - 5, 10, 10);
    }
    ctx.restore();
  }

  /* ── Jet cone ────────────────────────────────────────────────────── */
  function drawJet(jet, R, progress) {
    const phi = jet.phi;
    const pTFraction = Math.min(jet.pt / 250, 1);
    const coneAngle = (0.4 + (1 - pTFraction) * 0.3);   // ΔR ≈ 0.4–0.7
    const reach = R * 0.88 * progress;
    const phi1 = phi - coneAngle / 2;
    const phi2 = phi + coneAngle / 2;

    ctx.save();
    ctx.globalAlpha = 0.55;

    // Filled cone
    const grd = ctx.createLinearGradient(CX, CY,
      CX + Math.cos(phi) * reach, CY + Math.sin(phi) * reach);
    grd.addColorStop(0, 'transparent');
    grd.addColorStop(0.6, jet.color + '55');
    grd.addColorStop(1, jet.color + 'aa');

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, reach, phi1, phi2);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    // Outline
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = jet.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = jet.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + Math.cos(phi1) * reach, CY + Math.sin(phi1) * reach);
    ctx.arc(CX, CY, reach, phi1, phi2);
    ctx.lineTo(CX, CY);
    ctx.stroke();

    // pT label
    if (progress > 0.9) {
      const lx = CX + Math.cos(phi) * (reach + 14);
      const ly = CY + Math.sin(phi) * (reach + 14);
      ctx.globalAlpha = (progress - 0.9) / 0.1;
      ctx.fillStyle = jet.color;
      ctx.font = `bold 11px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${jet.pt.toFixed(0)} GeV`, lx, ly);

      if (jet.bTagged) {
        ctx.font = `10px 'DM Mono', monospace`;
        ctx.fillStyle = '#ff6b35';
        ctx.fillText('b', lx, ly - 14);
      }
    }
    ctx.restore();
  }

  /* ── Missing ET arrow ────────────────────────────────────────────── */
  function drawMET(met, ev, R, progress) {
    // MET direction is opposite to the vector sum of all visible particles
    let sumX = 0, sumY = 0;
    const allParticles = [
      ...(ev.muons || []),
      ...(ev.electrons || []),
      ...(ev.photons || []),
      ...(ev.jets || []),
    ];
    allParticles.forEach(p => {
      sumX += Math.cos(p.phi) * p.pt;
      sumY += Math.sin(p.phi) * p.pt;
    });
    const metPhi = Math.atan2(-sumY, -sumX);
    const reach = R * 0.95 * progress;

    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(CX, CY, R * 0.95, metPhi - 0.15, metPhi + 0.15);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow
    const ax = CX + Math.cos(metPhi) * reach;
    const ay = CY + Math.sin(metPhi) * reach;
    const headLen = 12;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.fillStyle   = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(
      ax - headLen * Math.cos(metPhi - 0.4),
      ay - headLen * Math.sin(metPhi - 0.4)
    );
    ctx.lineTo(
      ax - headLen * Math.cos(metPhi + 0.4),
      ay - headLen * Math.sin(metPhi + 0.4)
    );
    ctx.closePath();
    ctx.fill();

    if (progress > 0.85) {
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(`E̸T = ${met.toFixed(0)} GeV`,
        ax + Math.cos(metPhi) * 20,
        ay + Math.sin(metPhi) * 20);
    }
    ctx.restore();
  }

  /* ── Event info overlay ──────────────────────────────────────────── */
  function drawEventInfo(ev, R) {
    ctx.save();
    ctx.font = `500 11px 'DM Mono', monospace`;
    ctx.fillStyle = 'rgba(138, 154, 181, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText(`Run ${ev.run} · LS ${ev.lumiSection} · Event ${ev.event}`, 12, 20);
    ctx.fillText(`√s = ${(ev.sqrtS / 1000).toFixed(0)} TeV · CMS Run 2010`, 12, 34);
    if (ev.invariantMass) {
      ctx.fillStyle = 'rgba(0,229,255,0.8)';
      ctx.fillText(`m_inv ≈ ${ev.invariantMass.toFixed(1)} GeV`, 12, 50);
    }
    ctx.restore();
  }

  /* ── Event description panel ─────────────────────────────────────── */
  function renderDescription(ev) {
    let descEl = document.getElementById('eventDescription');
    if (!descEl) {
      descEl = document.createElement('div');
      descEl.id = 'eventDescription';
      descEl.style.cssText = `
        padding: 1rem 1.25rem;
        border-top: 1px solid var(--border);
        font-size: 0.825rem;
        color: var(--text-secondary);
        line-height: 1.7;
        background: var(--bg-card);
      `;
      cardsEl.parentElement.appendChild(descEl);
    }
    descEl.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;
                  text-transform:uppercase;color:var(--text-muted);margin-bottom:0.4rem">
        Event Description
      </div>
      ${ev.description}
    `;
  }

  /* ── Shuffle ─────────────────────────────────────────────────────── */
  shuffleBtn.addEventListener('click', () => {
    const shuffled = [...CMS_EVENTS].sort(() => Math.random() - 0.5);
    renderCards(shuffled);
    // Auto-select first
    setTimeout(() => {
      const first = cardsEl.querySelector('.event-card');
      if (first) first.click();
    }, 100);
  });

  /* ── Override selectEvent to also render description ─────────────── */
  const origSelect = (idx, el) => {
    document.querySelectorAll('.event-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    activeEvent = CMS_EVENTS[idx];
    animateEvent(activeEvent);
    renderDescription(activeEvent);
  };

  // Re-bind cards after render with description support
  function renderCardsWithDesc(events) {
    cardsEl.innerHTML = '';
    events.forEach((ev, i) => {
      const el = document.createElement('div');
      el.className = 'event-card reveal';
      el.dataset.idx = i;
      el.innerHTML = `
        <div class="event-card__id">${ev.id}</div>
        <div class="event-card__type">${ev.type}</div>
        <div class="event-card__particles">
          ${ev.tags.map(t => `<span class="event-tag">${t}</span>`).join('')}
        </div>
      `;
      el.addEventListener('click', () => origSelect(i, el));
      cardsEl.appendChild(el);
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  renderCardsWithDesc(CMS_EVENTS);

  // Auto-select first event after a short delay
  setTimeout(() => {
    const first = cardsEl.querySelector('.event-card');
    if (first) first.click();
  }, 600);

})();
