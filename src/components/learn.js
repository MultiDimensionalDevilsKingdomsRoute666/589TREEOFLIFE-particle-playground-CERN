/**
 * learn.js
 * Öğretici sistem — ⓘ tooltip'ler ve Deep-Dive paneller.
 *
 * Her kavram için:
 *  - Kısa açıklama: label yanındaki ⓘ butonu (hover tooltip)
 *  - Uzun açıklama: "Learn More" butonu → animasyonlu panel
 */

(function initLearnSystem() {

  /* ══════════════════════════════════════════════════════════════════
     KNOWLEDGE BASE — tüm kavramların içerikleri
     ══════════════════════════════════════════════════════════════════ */
  const KNOWLEDGE = {

    beamType: {
      icon: '⚛️',
      tag: 'Beam Configuration',
      title: 'What is a Beam Type?',
      blocks: [
        {
          label: 'The Simple Explanation',
          text: 'At the LHC, physicists choose <strong>what to smash together</strong>. The three options here represent real choices scientists make depending on what they want to study.',
        },
      ],
      analogy: {
        icon: '🎯',
        text: '<strong>Think of it like choosing ammunition.</strong> Smashing two small, fast bullets (protons) is precise and clean. Smashing two heavy cannonballs (lead ions) creates a giant explosion of thousands of particles at once — briefly recreating conditions like the Big Bang.',
      },
      steps: [
        { title: 'p — p (Proton–Proton)', desc: 'The most common mode. Used to discover the Higgs boson in 2012. Protons are tiny and fast — collisions are "clean" with fewer particles, making rare signals easier to spot.' },
        { title: 'p — Pb (Proton–Lead)', desc: 'A proton hitting a lead nucleus (which contains 208 protons and neutrons). Used to study how nuclear matter affects particle behaviour.' },
        { title: 'Pb — Pb (Lead–Lead)', desc: 'Two heavy lead nuclei colliding. The energy density is so extreme it melts protons and neutrons into a soup called Quark-Gluon Plasma — the state of matter that existed microseconds after the Big Bang.' },
      ],
      facts: [
        { val: '208', label: 'Protons in Lead' },
        { val: '27 km', label: 'LHC Circumference' },
        { val: '99.9999%', label: 'Speed of Light' },
      ],
      diagram: 'beamType',
    },

    energy: {
      icon: '⚡',
      tag: 'Physics Concept',
      title: 'Centre-of-Mass Energy (√s)',
      blocks: [
        {
          label: 'What Does Energy Mean Here?',
          text: 'When two particles collide, the total energy available to create <em>new particles</em> is called the centre-of-mass energy, written as <strong>√s</strong>. The higher the energy, the heavier the particles you can produce — because mass is just frozen energy (E = mc²).',
        },
        {
          label: 'Why Does It Matter?',
          text: 'The Higgs boson weighs 125 GeV. To produce one, you need at least 125 GeV of energy — but in practice much more, because most of the proton\'s energy is carried by individual quarks, not the whole proton. At 7 TeV, quarks can carry enough energy to produce Higgs bosons.',
        },
      ],
      analogy: {
        icon: '💡',
        text: '<strong>Imagine rolling a ball up a hill.</strong> To reach the top (create a heavy particle), you need enough energy. A gentle roll (low energy) gets you nowhere — only a fast, hard throw (high energy) makes it over. The Higgs "hill" is 125 GeV high.',
      },
      facts: [
        { val: '900 GeV', label: 'LHC First Run (2009)' },
        { val: '7 TeV', label: 'Higgs Discovery Run' },
        { val: '13.6 TeV', label: 'Current Record (Run 3)' },
        { val: '125 GeV', label: 'Higgs Boson Mass' },
      ],
      diagram: 'energy',
    },

    luminosity: {
      icon: '💡',
      tag: 'Accelerator Physics',
      title: 'Luminosity',
      blocks: [
        {
          label: 'The Simple Explanation',
          text: 'Luminosity tells you <strong>how many collisions happen per second per unit area</strong>. Higher luminosity means more collisions per second — which means you have a better chance of catching rare events like Higgs boson production.',
        },
        {
          label: 'Why Does It Matter?',
          text: 'The Higgs boson is produced only once in every <em>10 billion</em> proton collisions. To find it, you need an enormous number of collisions. High luminosity is how CERN manages to produce enough Higgs bosons to actually study them.',
        },
      ],
      analogy: {
        icon: '🎣',
        text: '<strong>Think of fishing.</strong> Luminosity is how densely packed the fish are. A sparse pond (low luminosity) means few chances to catch anything. A crowded lake (high luminosity) means you catch something every few seconds — including the rare golden fish (Higgs boson).',
      },
      facts: [
        { val: '10³⁴', label: 'Design Luminosity (cm⁻²s⁻¹)' },
        { val: '10⁹', label: 'Collisions / Second at Peak' },
        { val: '1 in 10¹⁰', label: 'Higgs Production Rate' },
      ],
      diagram: null,
    },

    focusChannel: {
      icon: '🔍',
      tag: 'Detector Physics',
      title: 'Focus Channel',
      blocks: [
        {
          label: 'What is a "Channel"?',
          text: 'Each collision produces many different particles. A <strong>physics channel</strong> is like a filter — it tells the detector to pay attention to a specific type of event and ignore everything else. Without this, the enormous background of common events (QCD jets) would overwhelm the rare signals.',
        },
        {
          label: 'How It Works in Practice',
          text: 'The CMS trigger system makes 40 million decisions per second, keeping only ~1000 events. When looking for the Higgs, it specifically selects events with two high-energy photons or four leptons — the Higgs decay "fingerprints".',
        },
      ],
      analogy: {
        icon: '📻',
        text: '<strong>Think of a radio tuner.</strong> The air is full of thousands of signals at once. Tuning to one frequency (channel) lets you hear only that station clearly. A physics channel "tunes" the detector to one type of particle interaction.',
      },
      steps: [
        { title: 'All Particles', desc: 'No filter — shows everything produced. Dominated by QCD jet events (>97%).' },
        { title: 'Gauge Bosons (W, Z, γ)', desc: 'Select events with high-energy leptons or photons. These are the carriers of the electroweak force.' },
        { title: 'Higgs Boson (H)', desc: 'Focus on gluon-gluon fusion events. Higgs appears rarely — typically H→γγ or H→ZZ*→4ℓ.' },
        { title: 'Top Quark Pair (tt̄)', desc: 'Select events with jets + leptons + missing energy. The top quark is the heaviest known particle.' },
      ],
      diagram: null,
    },

    crossSection: {
      icon: '📊',
      tag: 'Quantum Physics',
      title: 'Physics Prediction & Cross-Sections',
      blocks: [
        {
          label: 'What Are the Percentages?',
          text: 'The percentages you see in the prediction panel are <strong>relative probabilities</strong> — how likely each type of collision outcome is, given your beam energy and type. They are calculated from <em>production cross-sections</em>, a fundamental quantity in quantum field theory.',
        },
        {
          label: 'What is a Cross-Section?',
          text: 'A cross-section (σ) measures how "likely" a specific interaction is. Larger cross-section = more probable. QCD dijet production has a cross-section of ~10⁸ nanobarns at 7 TeV, while Higgs production via gluon fusion is only ~15 picobarns — a factor of 10 billion difference. This is why finding the Higgs took years.',
        },
      ],
      analogy: {
        icon: '🎲',
        text: '<strong>Imagine rolling dice.</strong> Rolling a 6 has a 1/6 probability. Rolling two sixes in a row is 1/36. The Higgs boson is like rolling ten sixes in a row — it happens, but you need to roll the dice billions of times.',
      },
      facts: [
        { val: '~97%', label: 'QCD Jets at 900 GeV' },
        { val: '~0.001%', label: 'Higgs at 7 TeV' },
        { val: '10⁸ nb', label: 'Dijet Cross-Section' },
        { val: '15 pb', label: 'Higgs Cross-Section' },
      ],
      diagram: 'crossSection',
    },

    eventDisplay: {
      icon: '🖥️',
      tag: 'Detector Visualization',
      title: 'How to Read an Event Display',
      blocks: [
        {
          label: 'What Are You Looking At?',
          text: 'An event display shows a <strong>snapshot of a single collision</strong>, viewed from the end of the beam pipe (transverse plane). The centre is where the beams collide. Lines and shapes radiating outward represent different particles detected at that moment.',
        },
        {
          label: 'The Coordinate System',
          text: 'The display uses cylindrical coordinates. <em>φ (phi)</em> is the angle around the beam axis (0 to 360°). <em>η (eta)</em> measures the angle relative to the beam — η=0 is perpendicular, large η is nearly parallel to the beam. <em>pT</em> is the momentum perpendicular to the beam.',
        },
      ],
      steps: [
        { title: 'Curved Lines → Charged Particles', desc: 'Electrons and muons curve in the magnetic field (3.8 Tesla in CMS). The direction of curvature tells you the charge: positive curves one way, negative the other.' },
        { title: 'Filled Cones → Jets', desc: 'Quarks and gluons can\'t exist alone — they immediately produce a spray of hadrons called a "jet". Jets appear as cone-shaped clusters in the hadronic calorimeter (HCAL).' },
        { title: 'Dashed Lines → Photons', desc: 'Photons are electrically neutral, so they don\'t curve. They deposit energy in the electromagnetic calorimeter (ECAL) but leave no track.' },
        { title: 'Arrow → Missing Energy (MET)', desc: 'Neutrinos escape the detector without interacting. Their presence is inferred from momentum imbalance — if all visible particles push "right", the neutrino must have gone "left".' },
      ],
      diagram: 'eventDisplay',
    },

    lhc: {
      icon: '🌍',
      tag: 'The Machine',
      title: 'What is the LHC?',
      blocks: [
        {
          label: 'The World\'s Largest Machine',
          text: 'The <strong>Large Hadron Collider</strong> is a 27-kilometre ring of superconducting magnets buried 100 metres underground at the France-Switzerland border near Geneva. It is the most complex scientific instrument ever built, involving over 10,000 scientists from 100+ countries.',
        },
        {
          label: 'How it Works',
          text: 'Protons are stripped from hydrogen atoms and accelerated through a chain of smaller machines before entering the LHC ring. Inside, two beams travel in opposite directions, guided by 1,232 superconducting dipole magnets cooled to -271°C (colder than outer space). At four points around the ring, the beams are steered to collide inside massive detectors.',
        },
      ],
      facts: [
        { val: '27 km', label: 'Ring Circumference' },
        { val: '-271°C', label: 'Magnet Temperature' },
        { val: '1,232', label: 'Dipole Magnets' },
        { val: '10,000+', label: 'Scientists Involved' },
      ],
      analogy: {
        icon: '🚄',
        text: '<strong>Imagine a circular train track.</strong> Two trains rush around it in opposite directions at 99.9999% the speed of light. When they crash head-on inside a station (detector), the collision is so energetic it briefly creates conditions like those a fraction of a second after the Big Bang.',
      },
      diagram: 'lhc',
    },

    jet: {
      icon: '💥',
      tag: 'QCD Physics',
      title: 'What is a Jet?',
      blocks: [
        {
          label: 'Confinement: Why Quarks Can\'t Fly Free',
          text: 'Quarks are permanently confined inside hadrons by the strong force — a property called <em>confinement</em>. If you try to pull a quark out, the energy you put in creates a new quark-antiquark pair from the vacuum. You never get a free quark.',
        },
        {
          label: 'Hadronization: The Quark Shower',
          text: 'When a high-energy quark or gluon is produced in a collision, it rapidly loses energy by creating more and more particles — a process called <strong>hadronization</strong>. This cascade of particles all travelling in roughly the same direction is what we call a <em>jet</em>.',
        },
      ],
      analogy: {
        icon: '💦',
        text: '<strong>Imagine a water balloon being popped.</strong> You can\'t hold a single drop of water in your hands without it spreading. Similarly, a free quark immediately "pops" into a spray of many particles — the jet.',
      },
      steps: [
        { title: 'Quark/Gluon Produced', desc: 'A high-energy quark or gluon emerges from the collision with enormous momentum.' },
        { title: 'Hadronization', desc: 'The strong force causes rapid production of quark-antiquark pairs from the vacuum, creating dozens of hadrons (pions, kaons, protons...).' },
        { title: 'Jet Cone Formed', desc: 'All resulting particles travel in a narrow cone, detected across the electromagnetic and hadronic calorimeters.' },
        { title: 'b-Tagging', desc: 'Jets from bottom quarks (b-jets) can be identified by a displaced secondary vertex — the b hadron travels ~1mm before decaying. Crucial for finding the Higgs (H→bb̄) and top quarks.' },
      ],
      diagram: null,
    },
  };

  /* ══════════════════════════════════════════════════════════════════
     PANEL ENGINE
     ══════════════════════════════════════════════════════════════════ */

  // Create overlay DOM once
  const overlay = document.createElement('div');
  overlay.className = 'learn-panel-overlay';
  overlay.innerHTML = `
    <div class="learn-panel-backdrop" id="learnBackdrop"></div>
    <div class="learn-panel" id="learnPanel">
      <div class="learn-panel__header" id="learnHeader"></div>
      <div class="learn-panel__body" id="learnBody"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const learnHeader = document.getElementById('learnHeader');
  const learnBody   = document.getElementById('learnBody');
  let diagAnimId    = null;

  document.getElementById('learnBackdrop').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  function openPanel(key) {
    const data = KNOWLEDGE[key];
    if (!data) return;

    // Header
    learnHeader.innerHTML = `
      <div class="learn-panel__icon">${data.icon}</div>
      <div class="learn-panel__titles">
        <div class="learn-panel__tag">${data.tag}</div>
        <div class="learn-panel__title">${data.title}</div>
      </div>
      <button class="learn-panel__close" id="learnClose">✕</button>
    `;
    document.getElementById('learnClose').addEventListener('click', closePanel);

    // Body
    let html = '';

    // Diagram first if exists
    if (data.diagram) {
      html += `
        <div class="learn-diagram" id="learnDiagram">
          <canvas id="learnDiagramCanvas"></canvas>
          <div class="learn-diagram__label">Interactive Diagram</div>
        </div>
      `;
    }

    // Fact chips
    if (data.facts) {
      html += `<div class="learn-facts">
        ${data.facts.map(f => `
          <div class="learn-fact">
            <span class="learn-fact__val">${f.val}</span>
            <span class="learn-fact__label">${f.label}</span>
          </div>
        `).join('')}
      </div>`;
    }

    // Text blocks
    (data.blocks || []).forEach(b => {
      html += `
        <div class="learn-block">
          <div class="learn-block__label">${b.label}</div>
          <div class="learn-block__text">${b.text}</div>
        </div>
      `;
    });

    // Analogy
    if (data.analogy) {
      html += `
        <div class="learn-analogy">
          <div class="learn-analogy__icon">${data.analogy.icon}</div>
          <div class="learn-analogy__text">${data.analogy.text}</div>
        </div>
      `;
    }

    // Steps
    if (data.steps) {
      html += `<div class="learn-steps">
        ${data.steps.map((s, i) => `
          <div class="learn-step">
            <div class="learn-step__num">${i + 1}</div>
            <div class="learn-step__content">
              <div class="learn-step__title">${s.title}</div>
              <div class="learn-step__desc">${s.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
    }

    learnBody.innerHTML = html;

    // Open
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Run diagram animation
    if (data.diagram) {
      setTimeout(() => startDiagram(data.diagram), 100);
    }
  }

  function closePanel() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    cancelAnimationFrame(diagAnimId);
  }

  /* ══════════════════════════════════════════════════════════════════
     DIAGRAM ANIMATIONS
     ══════════════════════════════════════════════════════════════════ */
  function startDiagram(type) {
    const canvas = document.getElementById('learnDiagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  = canvas.offsetWidth  || 640;
    const H = canvas.height = canvas.offsetHeight || 180;
    cancelAnimationFrame(diagAnimId);

    const diagrams = { beamType, energy, crossSection, eventDisplay, lhc };
    if (diagrams[type]) diagrams[type](ctx, W, H);
  }

  /* Beam Type — show three collision types side by side */
  function beamType(ctx, W, H) {
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const spacing = W / 4;

      // Three scenarios
      const scenarios = [
        { label: 'p — p', color: '#00e5ff', r: 5, note: 'Clean' },
        { label: 'p — Pb', color: '#ffd740', r1: 5, r2: 14, note: 'Asymmetric' },
        { label: 'Pb — Pb', color: '#ff4081', r: 14, note: 'Heavy Ion' },
      ];

      scenarios.forEach((s, i) => {
        const x = spacing * (i + 0.9);
        const bounce = Math.sin(t * 0.04 + i) * 3;

        ctx.save();
        ctx.globalAlpha = 0.9;

        if (i === 0) {
          // p-p: two small dots approaching
          const offset = Math.max(0, 30 - t % 80) ;
          drawParticle(ctx, x - offset * 0.4, cy + bounce, s.r, s.color);
          drawParticle(ctx, x + offset * 0.4, cy - bounce, s.r, s.color);
        } else if (i === 1) {
          const offset = Math.max(0, 30 - t % 80);
          drawParticle(ctx, x - offset * 0.4, cy + bounce, 5, '#00e5ff');
          drawParticle(ctx, x + offset * 0.4, cy - bounce, 14, '#ffd740');
        } else {
          const offset = Math.max(0, 30 - t % 80);
          drawParticle(ctx, x - offset * 0.4, cy + bounce, 14, s.color);
          drawParticle(ctx, x + offset * 0.4, cy - bounce, 14, s.color);
        }

        // Label
        ctx.fillStyle = 'rgba(138,154,181,0.8)';
        ctx.font = `500 11px 'DM Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(s.label, x, H - 12);
        ctx.fillStyle = s.color;
        ctx.font = `10px 'DM Mono', monospace`;
        ctx.fillText(s.note, x, H - 26);

        ctx.restore();
      });
      t++;
      diagAnimId = requestAnimationFrame(draw);
    }
    draw();
  }

  /* Energy — show particle masses as hills */
  function energy(ctx, W, H) {
    let t = 0;
    const particles = [
      { name: 'W Boson', mass: 80.4, color: '#00e5ff' },
      { name: 'Z Boson', mass: 91.2, color: '#80deea' },
      { name: 'Higgs', mass: 125.2, color: '#ff0080' },
      { name: 'Top', mass: 172.6, color: '#ff6b35' },
    ];
    const maxMass = 180;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const pad = 50;
      const barW = (W - pad * 2) / particles.length - 8;

      particles.forEach((p, i) => {
        const x = pad + i * ((W - pad * 2) / particles.length);
        const barH = ((p.mass / maxMass) * (H - 50));
        const y = H - 20 - barH;
        const anim = Math.sin(t * 0.03 + i * 0.8) * 2;

        // Bar
        const grd = ctx.createLinearGradient(x, y + anim, x, H - 20);
        grd.addColorStop(0, p.color);
        grd.addColorStop(1, p.color + '22');
        ctx.fillStyle = grd;
        ctx.fillRect(x, y + anim, barW, barH - anim);

        // Mass label
        ctx.fillStyle = p.color;
        ctx.font = `bold 11px 'DM Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`${p.mass} GeV`, x + barW / 2, y + anim - 6);

        // Name
        ctx.fillStyle = 'rgba(138,154,181,0.8)';
        ctx.font = `10px 'DM Sans', sans-serif`;
        ctx.fillText(p.name, x + barW / 2, H - 5);
      });

      // Energy slider line
      const energy7TeV = 0.51; // 7000/13600
      const lineX = pad + energy7TeV * (W - pad * 2);
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,0.5)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, H - 20);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,229,255,0.7)';
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('7 TeV', lineX + 4, 14);
      ctx.restore();

      t++;
      diagAnimId = requestAnimationFrame(draw);
    }
    draw();
  }

  /* Cross-section — log scale bar chart */
  function crossSection(ctx, W, H) {
    let t = 0;
    const procs = [
      { name: 'QCD Jets', xs: 1e8, color: '#69ff47' },
      { name: 'W Boson',  xs: 1e4, color: '#00e5ff' },
      { name: 'Z Boson',  xs: 1e3, color: '#80deea' },
      { name: 'tt̄',       xs: 163, color: '#ff6b35' },
      { name: 'Higgs',    xs: 15,  color: '#ff0080' },
    ];
    const logMax = 9; // log10(1e9)

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const pad = 50;
      const bW = (W - pad * 2) / procs.length - 6;

      procs.forEach((p, i) => {
        const logXS = Math.log10(p.xs);
        const frac = logXS / logMax;
        const bH = frac * (H - 50);
        const x = pad + i * ((W - pad * 2) / procs.length);
        const y = H - 20 - bH;
        const anim = Math.sin(t * 0.025 + i) * 1.5;

        const grd = ctx.createLinearGradient(x, y, x, H - 20);
        grd.addColorStop(0, p.color);
        grd.addColorStop(1, p.color + '22');
        ctx.fillStyle = grd;
        ctx.fillRect(x, y + anim, bW, bH - anim);

        ctx.fillStyle = p.color;
        ctx.font = `bold 9px 'DM Mono', monospace`;
        ctx.textAlign = 'center';
        const label = p.xs >= 1e6 ? `${(p.xs/1e6).toFixed(0)}M` : p.xs >= 1000 ? `${(p.xs/1e3).toFixed(0)}k` : `${p.xs}`;
        ctx.fillText(label + ' pb', x + bW/2, y + anim - 5);

        ctx.fillStyle = 'rgba(138,154,181,0.8)';
        ctx.font = `9px 'DM Sans', sans-serif`;
        ctx.fillText(p.name, x + bW/2, H - 5);
      });

      // Y-axis label
      ctx.save();
      ctx.fillStyle = 'rgba(138,154,181,0.5)';
      ctx.font = `9px 'DM Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.fillText('Cross-section (log scale)', 4, 12);
      ctx.restore();

      t++;
      diagAnimId = requestAnimationFrame(draw);
    }
    draw();
  }

  /* Event Display — mini animated CMS display */
  function eventDisplay(ctx, W, H) {
    let t = 0;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(cx, cy) * 0.85;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Detector rings
      [0.3, 0.55, 0.75, 0.9, 1].forEach(f => {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      const progress = Math.min(1, (t % 120) / 60);

      // Muon track (curved)
      ctx.save();
      ctx.strokeStyle = '#ff4081';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ff4081';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = Math.min(1, progress * 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let i = 0; i <= 50 * progress; i++) {
        const angle = 0.8 + i * 0.015;
        ctx.lineTo(cx + Math.cos(angle) * (i * R / 50), cy + Math.sin(angle) * (i * R / 50));
      }
      ctx.stroke();
      ctx.restore();

      // Jet cone
      ctx.save();
      ctx.globalAlpha = Math.min(0.6, progress * 1.2);
      ctx.fillStyle = '#69ff47';
      ctx.strokeStyle = '#69ff47';
      ctx.shadowColor = '#69ff47';
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.5;
      const jetR = R * progress;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, jetR, -2.4, -1.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Photon dashed
      ctx.save();
      ctx.strokeStyle = '#ffd740';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.globalAlpha = Math.min(1, progress * 1.5);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(2.2) * R * progress, cy + Math.sin(2.2) * R * progress);
      ctx.stroke();
      ctx.restore();

      // Labels
      if (progress > 0.7) {
        const alpha = (progress - 0.7) / 0.3;
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        ctx.font = `10px 'DM Mono', monospace`;
        ctx.fillStyle = '#ff4081';
        ctx.fillText('μ⁻ track', cx + 30, cy - 30);
        ctx.fillStyle = '#69ff47';
        ctx.fillText('jet', cx - 70, cy + 50);
        ctx.fillStyle = '#ffd740';
        ctx.fillText('γ photon', cx + 20, cy + 60);
        ctx.restore();
      }

      // Center
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1;
      ctx.fill();

      t++;
      diagAnimId = requestAnimationFrame(draw);
    }
    draw();
  }

  /* LHC diagram — circular tunnel */
  function lhc(ctx, W, H) {
    let t = 0;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(cx, cy) * 0.75;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Tunnel
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,0.15)';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Beam 1 (clockwise)
      const angle1 = (t * 0.02) % (Math.PI * 2);
      const bx1 = cx + Math.cos(angle1) * R;
      const by1 = cy + Math.sin(angle1) * R;
      drawBeamParticle(ctx, bx1, by1, '#00e5ff');

      // Beam 2 (counter-clockwise)
      const angle2 = -(t * 0.02) % (Math.PI * 2);
      const bx2 = cx + Math.cos(angle2) * R;
      const by2 = cy + Math.sin(angle2) * R;
      drawBeamParticle(ctx, bx2, by2, '#ff0080');

      // Detectors (4 points)
      const detectors = [
        { angle: 0,           name: 'ATLAS' },
        { angle: Math.PI/2,   name: 'CMS' },
        { angle: Math.PI,     name: 'ALICE' },
        { angle: 3*Math.PI/2, name: 'LHCb' },
      ];
      detectors.forEach(d => {
        const dx = cx + Math.cos(d.angle) * R;
        const dy = cy + Math.sin(d.angle) * R;
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ffd740';
        ctx.beginPath();
        ctx.arc(dx, dy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,215,64,0.8)';
        ctx.font = `bold 9px 'DM Mono', monospace`;
        ctx.textAlign = 'center';
        const lx = cx + Math.cos(d.angle) * (R + 20);
        const ly = cy + Math.sin(d.angle) * (R + 20);
        ctx.fillText(d.name, lx, ly + 3);
        ctx.restore();
      });

      // Centre label
      ctx.fillStyle = 'rgba(138,154,181,0.5)';
      ctx.font = `10px 'DM Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('27 km ring', cx, cy + 4);

      t++;
      diagAnimId = requestAnimationFrame(draw);
    }
    draw();
  }

  function drawParticle(ctx, x, y, r, color) {
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBeamParticle(ctx, x, y, color) {
    ctx.save();
    const grd = ctx.createRadialGradient(x, y, 0, x, y, 10);
    grd.addColorStop(0, color);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ══════════════════════════════════════════════════════════════════
     DOM INJECTION — add ⓘ and Learn More buttons to the page
     ══════════════════════════════════════════════════════════════════ */
  /* ── Global floating tooltip ────────────────────────────────────── */
  (function setupGlobalTooltip() {
    const tip = document.createElement('div');
    tip.id = 'globalTooltip';
    document.body.appendChild(tip);

    let hideTimer = null;

    document.addEventListener('mouseover', e => {
      const btn = e.target.closest('.info-btn');
      if (!btn) return;
      clearTimeout(hideTimer);
      const text = btn.getAttribute('data-tip');
      if (!text) return;
      tip.textContent = text;
      tip.classList.add('visible');
      positionTip(btn, tip);
    });

    document.addEventListener('mouseout', e => {
      const btn = e.target.closest('.info-btn');
      if (!btn) return;
      hideTimer = setTimeout(() => tip.classList.remove('visible'), 120);
    });

    function positionTip(btn, tip) {
      const rect = btn.getBoundingClientRect();
      const tW   = 250;
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      let left   = rect.left + rect.width / 2 - tW / 2;
      let top    = rect.top - 8;
      let below  = false;

      // If not enough room above, show below
      if (rect.top < 120) {
        top   = rect.bottom + 10;
        below = true;
      } else {
        top = rect.top - (tip.offsetHeight || 80) - 10;
      }

      left = Math.max(8, Math.min(left, vw - tW - 8));
      tip.style.left  = left + 'px';
      tip.style.top   = top + 'px';
      tip.style.width = tW + 'px';
    }
  })();

  function injectButtons() {

    // Helper: create ⓘ button
    function infoBtn(tip, pos = '') {
      const btn = document.createElement('button');
      btn.className = `info-btn ${pos}`;
      btn.setAttribute('data-tip', tip);
      btn.setAttribute('aria-label', 'Quick info');
      btn.textContent = 'i';
      return btn;
    }

    // Helper: create Learn More button
    function learnBtn(key, label = 'Learn More') {
      const btn = document.createElement('button');
      btn.className = 'learn-btn';
      btn.innerHTML = `<span class="learn-btn__icon">📖</span>${label}`;
      btn.addEventListener('click', () => openPanel(key));
      return btn;
    }

    /* ─── Collider section ─────────────────────────────────────────── */

    // Beginner banner
    const colliderHeader = document.querySelector('#collider .section__header');
    if (colliderHeader) {
      const banner = document.createElement('div');
      banner.className = 'beginner-banner';
      banner.innerHTML = `
        <div class="beginner-banner__text">
          <strong>New to particle physics?</strong> Start here — learn how the LHC works, what you're controlling, and how to read the results.
        </div>
        <div class="beginner-banner__actions"></div>
      `;
      banner.querySelector('.beginner-banner__actions').append(
        learnBtn('lhc', '⚛️ What is the LHC?'),
        learnBtn('eventDisplay', '🖥️ How to Read Results'),
      );
      colliderHeader.after(banner);
    }

    // Beam Type label
    const beamLabel = document.querySelector('.collider-controls .control-group:nth-child(1) .control-label');
    if (beamLabel) {
      beamLabel.append(infoBtn('Choose what particles to collide: protons (p) or lead nuclei (Pb). Each gives different physics.'));
      beamLabel.after(learnBtn('beamType'));
    }

    // Energy label
    const energyLabel = document.querySelector('#energyDisplay')?.closest('.control-label');
    if (energyLabel) {
      const title = energyLabel.childNodes[0];
      const btn = infoBtn('Higher energy = heavier particles can be created. E=mc² — energy becomes mass at the collision point.');
      energyLabel.insertBefore(btn, energyLabel.querySelector('.control-value'));
      energyLabel.after(learnBtn('energy'));
    }

    // Luminosity label
    const lumiLabel = document.querySelector('#lumiDisplay')?.closest('.control-label');
    if (lumiLabel) {
      const btn = infoBtn('How many collisions per second. Higher luminosity = better chance of catching rare events like the Higgs boson.');
      lumiLabel.insertBefore(btn, lumiLabel.querySelector('.control-value'));
      lumiLabel.after(learnBtn('luminosity'));
    }

    // Focus Channel label
    const channelGroup = document.querySelector('#focusChannel')?.closest('.control-group');
    if (channelGroup) {
      const label = channelGroup.querySelector('.control-label');
      label.append(infoBtn('Filter the collision output to focus on a specific type of particle. Like tuning a radio to one station.'));
      channelGroup.append(learnBtn('focusChannel'));
    }

    // Physics Prediction panel header
    const predHeader = document.querySelector('.prediction-panel__title');
    if (predHeader) {
      predHeader.append(infoBtn('Relative probability of each process at this energy, calculated from real NLO/NNLO cross-sections. Not random — real physics.', 'tip-down'));
      const predPanel = document.querySelector('.prediction-panel');
      const lb = learnBtn('crossSection', 'What are these numbers?');
      lb.style.margin = '0.5rem';
      lb.style.display = 'flex';
      predPanel.append(lb);
    }

    // HUD labels
    const hudLabels = document.querySelectorAll('.hud-label');
    const hudTips = [
      'Centre-of-mass energy: total energy available to create new particles.',
      'Total number of collision events simulated in this session.',
      'Total final-state particles produced across all events.',
    ];
    hudLabels.forEach((el, i) => {
      if (hudTips[i]) el.append(infoBtn(hudTips[i], 'tip-down'));
    });

    /* ─── Zoo section ──────────────────────────────────────────────── */
    const zooHeader = document.querySelector('#zoo .section__header');
    if (zooHeader) {
      const zooDesc = zooHeader.querySelector('.section__desc');
      if (zooDesc) {
        const lb = learnBtn('jet', '💥 What is a Jet?');
        lb.style.marginTop = '1rem';
        lb.style.display = 'inline-flex';
        zooDesc.after(lb);
      }
    }

    /* ─── Events section ───────────────────────────────────────────── */
    const eventsHeader = document.querySelector('#events .section__header');
    if (eventsHeader) {
      const lb = learnBtn('eventDisplay', '🖥️ How to Read This Display');
      lb.style.marginTop = '1rem';
      lb.style.display = 'inline-flex';
      eventsHeader.querySelector('.section__desc').after(lb);
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButtons);
  } else {
    injectButtons();
  }

})();
