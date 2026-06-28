/**
 * particles.js
 * Complete Standard Model particle database.
 * All values sourced from Particle Data Group (PDG) 2024 Review.
 * https://pdg.lbl.gov
 */

const PARTICLES = {

  /* ── QUARKS ──────────────────────────────────────────────────────── */
  u: {
    symbol: 'u',
    name: 'Up Quark',
    category: 'quarks',
    mass: '2.16 MeV/c²',
    massVal: 2.16e-3,   // GeV
    charge: '+2/3 e',
    spin: '1/2',
    color: '#ff6b35',
    lifetime: 'Stable (confined)',
    discovered: 1968,
    discoveredAt: 'SLAC / MIT',
    forces: ['strong', 'electromagnetic', 'weak'],
    antiparticle: 'ū',
    desc: 'The lightest quark, a building block of protons (uud) and neutrons (udd). ' +
          'Up quarks are never found in isolation — they are permanently confined inside hadrons by the strong force. ' +
          'Together with the down quark, they form the first generation of matter.',
  },
  d: {
    symbol: 'd',
    name: 'Down Quark',
    category: 'quarks',
    mass: '4.67 MeV/c²',
    massVal: 4.67e-3,
    charge: '−1/3 e',
    spin: '1/2',
    color: '#ff6b35',
    lifetime: 'Stable (confined)',
    discovered: 1968,
    discoveredAt: 'SLAC / MIT',
    forces: ['strong', 'electromagnetic', 'weak'],
    antiparticle: 'd̄',
    desc: 'The second-lightest quark, present in protons and neutrons. ' +
          'In free form, a down quark can decay into an up quark via the weak interaction (β⁻ decay). ' +
          'Confinement ensures it is always found within a hadron.',
  },
  s: {
    symbol: 's',
    name: 'Strange Quark',
    category: 'quarks',
    mass: '93.4 MeV/c²',
    massVal: 0.0934,
    charge: '−1/3 e',
    spin: '1/2',
    color: '#ff6b35',
    lifetime: '~10⁻⁸ s (in hadrons)',
    discovered: 1947,
    discoveredAt: 'Manchester / Rochester',
    forces: ['strong', 'electromagnetic', 'weak'],
    antiparticle: 's̄',
    desc: 'The strange quark gives "strangeness" to kaons and other strange hadrons — particles that seemed anomalously long-lived ' +
          'when discovered in cosmic rays. Strangeness is conserved by the strong and EM forces but violated by the weak interaction.',
  },
  c: {
    symbol: 'c',
    name: 'Charm Quark',
    category: 'quarks',
    mass: '1.274 GeV/c²',
    massVal: 1.274,
    charge: '+2/3 e',
    spin: '1/2',
    color: '#ff6b35',
    lifetime: '~10⁻¹² s (in hadrons)',
    discovered: 1974,
    discoveredAt: 'SLAC / BNL (J/ψ)',
    forces: ['strong', 'electromagnetic', 'weak'],
    antiparticle: 'c̄',
    desc: 'Predicted by the GIM mechanism and discovered simultaneously at SLAC and BNL via the J/ψ meson — ' +
          'the "November Revolution" of 1974. The charm quark\'s discovery confirmed the quark model and the Standard Model framework.',
  },
  b: {
    symbol: 'b',
    name: 'Bottom Quark',
    category: 'quarks',
    mass: '4.183 GeV/c²',
    massVal: 4.183,
    charge: '−1/3 e',
    spin: '1/2',
    color: '#ff6b35',
    lifetime: '~10⁻¹² s',
    discovered: 1977,
    discoveredAt: 'Fermilab (Υ meson)',
    forces: ['strong', 'electromagnetic', 'weak'],
    antiparticle: 'b̄',
    desc: 'Also called the "beauty" quark. Discovered at Fermilab via the Υ (upsilon) meson. ' +
          'B physics — the study of bottom-quark hadrons — is a rich field for testing CP violation and CKM matrix elements, ' +
          'with experiments like BaBar, Belle, and LHCb dedicated to it.',
  },
  t: {
    symbol: 't',
    name: 'Top Quark',
    category: 'quarks',
    mass: '172.57 GeV/c²',
    massVal: 172.57,
    charge: '+2/3 e',
    spin: '1/2',
    color: '#ff6b35',
    lifetime: '~5×10⁻²⁵ s',
    discovered: 1995,
    discoveredAt: 'Fermilab (CDF / DØ)',
    forces: ['strong', 'electromagnetic', 'weak'],
    antiparticle: 't̄',
    desc: 'The heaviest known fundamental particle — as massive as an atom of tungsten. ' +
          'The top quark decays so quickly (faster than hadronization timescale) that it never forms bound states, ' +
          'making it a unique "bare quark" laboratory. The LHC produces thousands of top-pair events per day.',
  },

  /* ── LEPTONS ─────────────────────────────────────────────────────── */
  e: {
    symbol: 'e⁻',
    name: 'Electron',
    category: 'leptons',
    mass: '0.511 MeV/c²',
    massVal: 5.11e-4,
    charge: '−1 e',
    spin: '1/2',
    color: '#00e5ff',
    lifetime: 'Stable (>6.6×10²⁸ yr)',
    discovered: 1897,
    discoveredAt: 'Cambridge (J.J. Thomson)',
    forces: ['electromagnetic', 'weak'],
    antiparticle: 'e⁺ (positron)',
    desc: 'The first elementary particle ever identified. Electrons are responsible for all chemistry and electromagnetic phenomena. ' +
          'In particle detectors like CMS, electrons leave characteristic narrow energy deposits in the electromagnetic calorimeter (ECAL). ' +
          'The positron — its antiparticle — was the first antimatter particle discovered (1932, Carl Anderson).',
  },
  mu: {
    symbol: 'μ⁻',
    name: 'Muon',
    category: 'leptons',
    mass: '105.66 MeV/c²',
    massVal: 0.10566,
    charge: '−1 e',
    spin: '1/2',
    color: '#ff4081',
    lifetime: '2.197 μs',
    discovered: 1936,
    discoveredAt: 'Caltech (Anderson & Neddermeyer)',
    forces: ['electromagnetic', 'weak'],
    antiparticle: 'μ⁺',
    desc: 'Often described as a "heavy electron" — 207 times heavier but with no internal structure detected. ' +
          'Muons penetrate matter far more deeply than electrons, which is why CMS and ATLAS have dedicated outer muon systems. ' +
          'The anomalous magnetic moment of the muon (g−2) is one of the most precise tests of the Standard Model.',
  },
  tau: {
    symbol: 'τ⁻',
    name: 'Tau Lepton',
    category: 'leptons',
    mass: '1776.86 MeV/c²',
    massVal: 1.77686,
    charge: '−1 e',
    spin: '1/2',
    color: '#e040fb',
    lifetime: '290.3×10⁻¹⁵ s',
    discovered: 1975,
    discoveredAt: 'SLAC (Martin Perl)',
    forces: ['electromagnetic', 'weak'],
    antiparticle: 'τ⁺',
    desc: 'The heaviest lepton, nearly twice the mass of a proton. The tau decays so quickly it never reaches a detector directly — ' +
          'it is reconstructed from its decay products. Tau identification is crucial for Higgs boson measurements (H→ττ is a key channel).',
  },
  nu_e: {
    symbol: 'νₑ',
    name: 'Electron Neutrino',
    category: 'leptons',
    mass: '<1.1 eV/c²',
    massVal: 1.1e-9,
    charge: '0',
    spin: '1/2',
    color: '#80deea',
    lifetime: 'Stable',
    discovered: 1956,
    discoveredAt: 'Savannah River (Cowan & Reines)',
    forces: ['weak'],
    antiparticle: 'ν̄ₑ',
    desc: 'Predicted by Pauli in 1930 to save energy conservation in beta decay, detected 26 years later. ' +
          'Neutrinos interact only via the weak force, making them nearly impossible to detect directly. ' +
          'Neutrino oscillations prove they have mass — the only confirmed physics beyond the minimal Standard Model.',
  },
  nu_mu: {
    symbol: 'νᵤ',
    name: 'Muon Neutrino',
    category: 'leptons',
    mass: '<0.19 MeV/c²',
    massVal: 1e-7,
    charge: '0',
    spin: '1/2',
    color: '#80deea',
    lifetime: 'Stable',
    discovered: 1962,
    discoveredAt: 'BNL (Lederman, Schwartz, Steinberger)',
    forces: ['weak'],
    antiparticle: 'ν̄ᵤ',
    desc: 'The discovery that the muon neutrino is distinct from the electron neutrino (1962, Nobel Prize 1988) established ' +
          'the concept of lepton number and lepton family conservation. In collider events, neutrinos appear as missing transverse energy.',
  },
  nu_tau: {
    symbol: 'ντ',
    name: 'Tau Neutrino',
    category: 'leptons',
    mass: '<18.2 MeV/c²',
    massVal: 1e-5,
    charge: '0',
    spin: '1/2',
    color: '#80deea',
    lifetime: 'Stable',
    discovered: 2000,
    discoveredAt: 'Fermilab (DONUT)',
    forces: ['weak'],
    antiparticle: 'ν̄τ',
    desc: 'The last of the three known neutrino flavors, directly detected by the DONUT experiment at Fermilab in 2000 ' +
          'using a sophisticated emulsion detector. Its existence had been implied since the tau lepton\'s discovery in 1975.',
  },

  /* ── BOSONS ──────────────────────────────────────────────────────── */
  photon: {
    symbol: 'γ',
    name: 'Photon',
    category: 'bosons',
    mass: '< 10⁻¹⁸ eV/c²',
    massVal: 0,
    charge: '0',
    spin: '1',
    color: '#ffd740',
    lifetime: 'Stable',
    discovered: 1905,
    discoveredAt: 'Theory (Einstein)',
    forces: ['electromagnetic'],
    antiparticle: 'Self',
    desc: 'The quantum of the electromagnetic field — the carrier of light, radio waves, X-rays, and all electromagnetic radiation. ' +
          'Massless and always travelling at c. In detectors, photons produce narrow clusters in the ECAL without leaving a charged track.',
  },
  W: {
    symbol: 'W±',
    name: 'W Boson',
    category: 'bosons',
    mass: '80.369 GeV/c²',
    massVal: 80.369,
    charge: '±1 e',
    spin: '1',
    color: '#69ff47',
    lifetime: '3.16×10⁻²⁵ s',
    discovered: 1983,
    discoveredAt: 'CERN SPS (UA1/UA2)',
    forces: ['weak'],
    antiparticle: 'W∓',
    desc: 'The mediator of the charged-current weak interaction — responsible for beta decay and all flavor-changing processes. ' +
          'Its discovery at CERN in 1983 by Carlo Rubbia and Simon van der Meer won the Nobel Prize. ' +
          'The W boson mass is a precision test of the Standard Model; a recent Fermilab measurement showed a 7σ tension.',
  },
  Z: {
    symbol: 'Z⁰',
    name: 'Z Boson',
    category: 'bosons',
    mass: '91.1876 GeV/c²',
    massVal: 91.1876,
    charge: '0',
    spin: '1',
    color: '#69ff47',
    lifetime: '2.64×10⁻²⁵ s',
    discovered: 1983,
    discoveredAt: 'CERN SPS (UA1/UA2)',
    forces: ['weak'],
    antiparticle: 'Self',
    desc: 'The mediator of the neutral-current weak interaction. The Z pole at √s ≈ 91 GeV was used at LEP to perform ' +
          'electroweak precision measurements. The "Z peak" is also the calibration signal used in LHC experiments — ' +
          'millions of Z→ℓ⁺ℓ⁻ events serve as a standard candle.',
  },
  gluon: {
    symbol: 'g',
    name: 'Gluon',
    category: 'bosons',
    mass: '0',
    massVal: 0,
    charge: '0',
    spin: '1',
    color: '#ff6b35',
    lifetime: 'Stable (confined)',
    discovered: 1979,
    discoveredAt: 'DESY (PETRA collider)',
    forces: ['strong'],
    antiparticle: 'Self',
    desc: 'The carrier of the strong nuclear force. Unlike photons, gluons carry color charge and interact with each other, ' +
          'leading to confinement and asymptotic freedom. In collider events, gluons produce hadronic jets. ' +
          'At LHC energies, gluon-gluon fusion is the dominant Higgs production mechanism.',
  },
  higgs: {
    symbol: 'H',
    name: 'Higgs Boson',
    category: 'bosons',
    mass: '125.20 GeV/c²',
    massVal: 125.20,
    charge: '0',
    spin: '0',
    color: '#ff0080',
    lifetime: '1.6×10⁻²² s',
    discovered: 2012,
    discoveredAt: 'CERN LHC (ATLAS & CMS)',
    forces: ['weak', 'electromagnetic'],
    antiparticle: 'Self',
    desc: 'The last piece of the Standard Model, discovered at CERN on 4 July 2012 by ATLAS and CMS collaborations — ' +
          'one of the greatest scientific achievements of the 21st century. ' +
          'The Higgs boson is the quantum excitation of the Higgs field, which gives mass to all fundamental particles. ' +
          'Its properties continue to be measured with increasing precision at the LHC Run 3.',
  },
};

// Export for module environments (ignored in plain <script> tags)
if (typeof module !== 'undefined') module.exports = { PARTICLES };
