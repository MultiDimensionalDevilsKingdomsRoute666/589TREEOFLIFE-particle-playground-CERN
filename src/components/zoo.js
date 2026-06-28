/**
 * zoo.js
 * Particle Zoo section — renders all Standard Model particles as interactive cards
 * and opens a detailed modal on click.
 */

(function initZoo() {

  const grid    = document.getElementById('zooGrid');
  const modal   = document.getElementById('particleModal');
  const backdrop = document.getElementById('modalBackdrop');
  const card    = document.getElementById('modalCard');

  if (!grid || typeof PARTICLES === 'undefined') return;

  /* ── Category accent colors ──────────────────────────────────────── */
  const CATEGORY_COLORS = {
    quarks:  '#ff6b35',
    leptons: '#00e5ff',
    bosons:  '#ffd740',
  };

  /* ── Force tag styles ────────────────────────────────────────────── */
  const FORCE_STYLES = {
    strong:           { color: '#ff6b35', label: 'Strong' },
    electromagnetic:  { color: '#ffd740', label: 'EM' },
    weak:             { color: '#69ff47', label: 'Weak' },
    gravity:          { color: '#b39ddb', label: 'Gravity' },
  };

  /* ── Render grid ─────────────────────────────────────────────────── */
  function renderGrid(filter = 'all') {
    grid.innerHTML = '';
    Object.entries(PARTICLES).forEach(([key, p]) => {
      if (filter !== 'all' && p.category !== filter) return;
      const accent = CATEGORY_COLORS[p.category] || '#00e5ff';
      const el = document.createElement('div');
      el.className = 'zoo-card reveal';
      el.style.setProperty('--card-accent', accent);
      el.dataset.key = key;
      el.innerHTML = `
        <div class="zoo-card__symbol">${p.symbol}</div>
        <div class="zoo-card__name">${p.name}</div>
        <div class="zoo-card__mass">${p.mass}</div>
        <div class="zoo-card__category">${p.category}</div>
      `;
      el.addEventListener('click', () => openModal(key, p));
      grid.appendChild(el);
    });

    // Trigger reveal animations
    requestAnimationFrame(() => {
      grid.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 40);
      });
    });
  }

  /* ── Filters ─────────────────────────────────────────────────────── */
  document.getElementById('zooFilters').addEventListener('click', e => {
    const btn = e.target.closest('.zoo-filter');
    if (!btn) return;
    document.querySelectorAll('.zoo-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(btn.dataset.filter);
  });

  /* ── Modal ───────────────────────────────────────────────────────── */
  function openModal(key, p) {
    const accent = CATEGORY_COLORS[p.category] || '#00e5ff';

    const forceTags = (p.forces || []).map(f => {
      const s = FORCE_STYLES[f] || { color: '#888', label: f };
      return `<span class="force-tag" style="color:${s.color}; border-color:${s.color}40; background:${s.color}10">${s.label}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="modal-header">
        <div>
          <div class="modal-symbol" style="color:${accent}">${p.symbol}</div>
        </div>
        <div class="modal-meta">
          <div class="modal-name">${p.name}</div>
          <div class="modal-category">${p.category.toUpperCase()}</div>
        </div>
        <button class="modal-close" id="modalClose">✕</button>
      </div>
      <div class="modal-body">
        <div class="modal-props">
          <div class="modal-prop">
            <span class="modal-prop-key">Mass</span>
            <span class="modal-prop-val">${p.mass}</span>
          </div>
          <div class="modal-prop">
            <span class="modal-prop-key">Charge</span>
            <span class="modal-prop-val">${p.charge}</span>
          </div>
          <div class="modal-prop">
            <span class="modal-prop-key">Spin</span>
            <span class="modal-prop-val">${p.spin}</span>
          </div>
          <div class="modal-prop">
            <span class="modal-prop-key">Antiparticle</span>
            <span class="modal-prop-val">${p.antiparticle}</span>
          </div>
          <div class="modal-prop">
            <span class="modal-prop-key">Lifetime</span>
            <span class="modal-prop-val">${p.lifetime}</span>
          </div>
          <div class="modal-prop">
            <span class="modal-prop-key">Discovered</span>
            <span class="modal-prop-val">${p.discovered}</span>
          </div>
        </div>
        <div class="modal-discovery">Discovery location: ${p.discoveredAt}</div>
        <p class="modal-desc">${p.desc}</p>
        <div class="modal-interactions">
          <div class="modal-interactions-title">Interacts via</div>
          <div class="modal-forces">${forceTags}</div>
        </div>
      </div>
    `;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    document.getElementById('modalClose').addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Init ────────────────────────────────────────────────────────── */
  renderGrid();

})();
