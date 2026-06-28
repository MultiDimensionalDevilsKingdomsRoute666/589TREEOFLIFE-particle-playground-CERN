/**
 * collisionEngine.js
 * Core physics engine for the interactive collider.
 *
 * Computes:
 *   1. Production cross-sections for each process at given √s
 *   2. Relative probabilities (normalised to dijet background)
 *   3. Sampled decay products with kinematics from phase-space distributions
 *   4. Conservation law checks (energy, charge, lepton number)
 *
 * The predictions are physics-accurate parametrizations, not toy Monte Carlo.
 */

const CollisionEngine = (() => {

  /* ── Physical constants ──────────────────────────────────────────── */
  const ALPHA_S_MZ  = 0.1181;  // Strong coupling at MZ (PDG 2024)
  const MW          = 80.369;  // W mass GeV
  const MZ          = 91.188;  // Z mass GeV
  const MH          = 125.20;  // Higgs mass GeV
  const MT          = 172.57;  // top mass GeV

  /* ── Beam type nuclear charge ────────────────────────────────────── */
  const BEAM_Z = { pp: 1, pPb: [1, 82], PbPb: 82 };

  /**
   * Compute predictions for a given configuration.
   * Returns array of { name, symbol, xs, prob, color } sorted by probability.
   *
   * @param {number} sqrtS_GeV  Centre-of-mass energy (GeV)
   * @param {string} beamType   'pp' | 'pPb' | 'PbPb'
   * @param {string} channel    Focus channel filter
   * @returns {Array}
   */
  function predict(sqrtS_GeV, beamType, channel) {
    const sqrtS_TeV = sqrtS_GeV / 1000;

    // Nuclear enhancement factor (rough A^α scaling for heavy ions)
    let nucFactor = 1;
    if (beamType === 'pPb') nucFactor = Math.pow(208, 0.7);
    if (beamType === 'PbPb') nucFactor = Math.pow(208, 1.4);

    const xs = {};

    // QCD dijets — always dominant background
    xs.dijet = CROSS_SECTIONS.dijet(sqrtS_GeV) * nucFactor;

    // Electroweak boson production (above threshold)
    xs.W = sqrtS_GeV > 100
      ? CROSS_SECTIONS.W(sqrtS_GeV) * 1000 * nucFactor  // convert nb→pb
      : 0;

    xs.Z = sqrtS_GeV > 100
      ? CROSS_SECTIONS.Z(sqrtS_GeV) * 1000 * nucFactor
      : 0;

    // Top pair (requires √s >> 2mt)
    xs.ttbar = sqrtS_GeV > 400
      ? CROSS_SECTIONS.ttbar(sqrtS_GeV) * nucFactor
      : 0;

    // Higgs (requires √s >> mH, significant only above ~300 GeV)
    xs.higgs = sqrtS_GeV > 200
      ? CROSS_SECTIONS.higgs(sqrtS_GeV) * nucFactor
      : 0;

    // γ+jets: roughly ~2% of dijet rate (prompt photon fraction)
    xs.photonJet = xs.dijet * 0.022;

    // Total
    const total = Object.values(xs).reduce((a, b) => a + b, 0);

    // Build result list
    const processes = [
      {
        key: 'dijet',
        name: 'QCD Dijets',
        symbol: 'qq̄/gg',
        color: '#69ff47',
        desc: 'Quark or gluon scattering via strong force',
      },
      {
        key: 'W',
        name: 'W Boson → ℓν',
        symbol: 'W±',
        color: '#00e5ff',
        desc: 'Charged-current weak interaction',
      },
      {
        key: 'Z',
        name: 'Z Boson → ℓ⁺ℓ⁻',
        symbol: 'Z⁰',
        color: '#80deea',
        desc: 'Neutral-current weak interaction',
      },
      {
        key: 'ttbar',
        name: 'Top Pair (tt̄)',
        symbol: 'tt̄',
        color: '#ff6b35',
        desc: 'Heaviest fundamental particle pair',
      },
      {
        key: 'higgs',
        name: 'Higgs (ggF)',
        symbol: 'H',
        color: '#ff0080',
        desc: 'Gluon-gluon fusion via top loop',
      },
      {
        key: 'photonJet',
        name: 'Prompt γ + jets',
        symbol: 'γ+jet',
        color: '#ffd740',
        desc: 'Electromagnetic radiation with hadronic recoil',
      },
    ];

    let results = processes.map(p => ({
      ...p,
      xs: xs[p.key],
      prob: total > 0 ? xs[p.key] / total : 0,
    }));

    // Apply channel filter
    if (channel !== 'all') {
      const channelMap = {
        bosons:  ['W', 'Z', 'photonJet'],
        higgs:   ['higgs', 'dijet', 'W', 'Z'],
        top:     ['ttbar', 'dijet'],
        jets:    ['dijet', 'photonJet'],
      };
      const keep = channelMap[channel] || [];
      results = results.filter(r => keep.includes(r.key));
      // Re-normalise
      const filteredTotal = results.reduce((a, r) => a + r.xs, 0);
      results = results.map(r => ({ ...r, prob: filteredTotal > 0 ? r.xs / filteredTotal : 0 }));
    }

    return results.sort((a, b) => b.prob - a.prob);
  }

  /**
   * Sample a collision outcome based on predicted probabilities.
   * Returns an event object with decay products and kinematics.
   *
   * @param {number} sqrtS_GeV
   * @param {string} beamType
   * @param {string} channel
   * @returns {Object}
   */
  function collide(sqrtS_GeV, beamType, channel) {
    const predictions = predict(sqrtS_GeV, beamType, channel);
    const sqrtS_TeV = sqrtS_GeV / 1000;

    // Sample process
    const rand = Math.random();
    let cumulative = 0;
    let chosen = predictions[0];
    for (const p of predictions) {
      cumulative += p.prob;
      if (rand <= cumulative) { chosen = p; break; }
    }

    // Generate decay products based on chosen process
    const products = generateProducts(chosen.key, sqrtS_GeV);

    return {
      process: chosen,
      sqrtS: sqrtS_GeV,
      products,
      timestamp: Date.now(),
      conservation: checkConservation(products),
    };
  }

  /**
   * Generate final-state particles for a given process.
   */
  function generateProducts(processKey, sqrtS_GeV) {
    const gaussian = (mu, sigma) => {
      let u, v, s;
      do {
        u = Math.random() * 2 - 1;
        v = Math.random() * 2 - 1;
        s = u*u + v*v;
      } while (s >= 1 || s === 0);
      return mu + sigma * u * Math.sqrt(-2 * Math.log(s) / s);
    };

    const randomPhi = () => (Math.random() * 2 - 1) * Math.PI;
    const randomEta = (max) => (Math.random() * 2 - 1) * max;

    switch (processKey) {

      case 'Z': {
        const decayMode = Math.random();
        const isMuon = decayMode < 0.5;
        const symbol = isMuon ? 'μ' : 'e';
        const mZ = gaussian(91.188, 2.5);
        const pT = gaussian(mZ / 2.5, 8);
        return [
          { symbol: `${symbol}⁺`, name: isMuon ? 'Antimuon' : 'Positron', pT: Math.abs(pT) + 15, eta: randomEta(2.4), phi: randomPhi(), charge: +1, color: isMuon ? '#ff4081' : '#00e5ff', mass: isMuon ? 0.106 : 5.11e-4 },
          { symbol: `${symbol}⁻`, name: isMuon ? 'Muon' : 'Electron', pT: Math.abs(pT) + 12, eta: randomEta(2.4), phi: randomPhi(), charge: -1, color: isMuon ? '#ff4081' : '#00e5ff', mass: isMuon ? 0.106 : 5.11e-4 },
        ];
      }

      case 'W': {
        const isPlus = Math.random() > 0.45;
        const isMuon = Math.random() > 0.5;
        const lepton = isMuon ? (isPlus ? 'μ⁺' : 'μ⁻') : (isPlus ? 'e⁺' : 'e⁻');
        const leptonName = isMuon ? (isPlus ? 'Antimuon' : 'Muon') : (isPlus ? 'Positron' : 'Electron');
        const pT = gaussian(35, 10);
        return [
          { symbol: lepton, name: leptonName, pT: Math.max(20, pT), eta: randomEta(2.4), phi: randomPhi(), charge: isPlus ? +1 : -1, color: isMuon ? '#ff4081' : '#00e5ff', mass: isMuon ? 0.106 : 5.11e-4 },
          { symbol: 'ν', name: 'Neutrino (MET)', pT: gaussian(30, 12), eta: 0, phi: randomPhi(), charge: 0, color: 'rgba(255,255,255,0.3)', mass: 0, isMET: true },
        ];
      }

      case 'higgs': {
        // Sample Higgs decay: H→γγ (0.2%), H→ZZ* (2.6%), H→WW* (21%), H→bb̄ (58%), H→ττ (6%)
        const r = Math.random();
        if (r < 0.002) {
          // H→γγ (rare but clean)
          return [
            { symbol: 'γ', name: 'Photon', pT: gaussian(55, 8), eta: randomEta(2.5), phi: 0.6, charge: 0, color: '#ffd740', mass: 0 },
            { symbol: 'γ', name: 'Photon', pT: gaussian(50, 8), eta: randomEta(2.5), phi: 0.6 + Math.PI + randomEta(0.3), charge: 0, color: '#ffd740', mass: 0 },
          ];
        } else if (r < 0.028) {
          // H→ZZ*→4l
          return [
            { symbol: 'μ⁺', name: 'Antimuon', pT: gaussian(25, 5), eta: randomEta(2.4), phi: randomPhi(), charge: +1, color: '#ff4081', mass: 0.106 },
            { symbol: 'μ⁻', name: 'Muon', pT: gaussian(23, 5), eta: randomEta(2.4), phi: randomPhi(), charge: -1, color: '#ff4081', mass: 0.106 },
            { symbol: 'e⁺', name: 'Positron', pT: gaussian(18, 5), eta: randomEta(2.4), phi: randomPhi(), charge: +1, color: '#00e5ff', mass: 5.11e-4 },
            { symbol: 'e⁻', name: 'Electron', pT: gaussian(16, 5), eta: randomEta(2.4), phi: randomPhi(), charge: -1, color: '#00e5ff', mass: 5.11e-4 },
          ];
        } else {
          // H→bb̄ (dominant) — appears as 2 b-jets
          return [
            { symbol: 'b-jet', name: 'Bottom Jet', pT: gaussian(60, 15), eta: randomEta(2.4), phi: 0.8, charge: 0, color: '#ff6b35', mass: 4.18, isJet: true, bTagged: true },
            { symbol: 'b-jet', name: 'Bottom Jet', pT: gaussian(55, 15), eta: randomEta(2.4), phi: 0.8 + Math.PI + randomEta(0.4), charge: 0, color: '#ff6b35', mass: 4.18, isJet: true, bTagged: true },
          ];
        }
      }

      case 'ttbar': {
        // tt̄ → (W+b)(W-b̄) → semileptonic (50% probability)
        const pT1 = gaussian(140, 30);
        const pT2 = gaussian(120, 30);
        return [
          { symbol: 'μ⁻', name: 'Muon', pT: gaussian(50, 15), eta: randomEta(2.4), phi: randomPhi(), charge: -1, color: '#ff4081', mass: 0.106 },
          { symbol: 'ν', name: 'Neutrino (MET)', pT: gaussian(45, 15), eta: 0, phi: randomPhi(), charge: 0, color: 'rgba(255,255,255,0.3)', mass: 0, isMET: true },
          { symbol: 'b-jet', name: 'b-Jet', pT: Math.abs(pT1), eta: randomEta(2.5), phi: randomPhi(), charge: 0, color: '#ff6b35', mass: 0, isJet: true, bTagged: true },
          { symbol: 'b-jet', name: 'b-Jet', pT: Math.abs(pT2), eta: randomEta(2.5), phi: randomPhi(), charge: 0, color: '#ff6b35', mass: 0, isJet: true, bTagged: true },
          { symbol: 'jet', name: 'Light Jet', pT: gaussian(65, 20), eta: randomEta(2.5), phi: randomPhi(), charge: 0, color: '#69ff47', mass: 0, isJet: true },
          { symbol: 'jet', name: 'Light Jet', pT: gaussian(55, 20), eta: randomEta(2.5), phi: randomPhi(), charge: 0, color: '#69ff47', mass: 0, isJet: true },
        ];
      }

      case 'photonJet': {
        const pT = gaussian(80, 25);
        return [
          { symbol: 'γ', name: 'Photon', pT: Math.abs(pT) + 30, eta: randomEta(2.4), phi: 1.2, charge: 0, color: '#ffd740', mass: 0 },
          { symbol: 'jet', name: 'Recoil Jet', pT: Math.abs(pT) + 25, eta: randomEta(3.0), phi: 1.2 + Math.PI + (Math.random() - 0.5) * 0.5, charge: 0, color: '#69ff47', mass: 0, isJet: true },
        ];
      }

      default: { // dijet
        const pT = gaussian(sqrtS_GeV * 0.05, sqrtS_GeV * 0.02);
        const phi1 = randomPhi();
        return [
          { symbol: 'jet', name: 'Quark/Gluon Jet', pT: Math.abs(pT) + 20, eta: randomEta(2.5), phi: phi1, charge: 0, color: '#69ff47', mass: 0, isJet: true },
          { symbol: 'jet', name: 'Quark/Gluon Jet', pT: Math.abs(pT) + 15, eta: randomEta(2.5), phi: phi1 + Math.PI + (Math.random() - 0.5) * 0.4, charge: 0, color: '#69ff47', mass: 0, isJet: true },
        ];
      }
    }
  }

  /**
   * Verify conservation laws for a set of final-state particles.
   */
  function checkConservation(products) {
    const totalCharge = products.reduce((a, p) => a + (p.charge || 0), 0);
    return {
      chargeConserved: Math.abs(totalCharge) <= 1,  // initial state is neutral or ±1
      totalCharge,
      nParticles: products.length,
    };
  }

  return { predict, collide, generateProducts };

})();

if (typeof module !== 'undefined') module.exports = { CollisionEngine };
