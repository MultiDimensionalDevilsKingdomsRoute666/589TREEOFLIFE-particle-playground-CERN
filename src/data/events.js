/**
 * events.js
 * Representative collision event data in the style of CMS Open Data.
 * These events are based on real CMS Run 2010B data format and physics,
 * reproduced here in a simplified educational format.
 *
 * Data reference:
 * CMS Collaboration (2014). CMS primary datasets in AOD format from RunB of 2010.
 * CERN Open Data Portal. DOI: 10.7483/OPENDATA.CMS.A342.9982
 * https://opendata.cern.ch/record/545
 */

const CMS_EVENTS = [
  {
    id: 'CMS-Run2010B-00001',
    run: 149291,
    lumiSection: 42,
    event: 3862023,
    sqrtS: 7000, // GeV
    type: 'Z → μ⁺μ⁻ Candidate',
    classification: 'electroweak',
    description: 'A Z boson decaying into two high-energy muons. The invariant mass of the muon pair ' +
                 'peaks at ≈91 GeV, the Z pole. This is one of the cleanest signals at the LHC, used ' +
                 'as a standard candle for detector calibration.',
    muons: [
      { pt: 41.3, eta: 0.82, phi: 1.24, charge: +1, color: '#ff4081' },
      { pt: 39.8, eta: -0.67, phi: -1.93, charge: -1, color: '#ff4081' },
    ],
    electrons: [],
    jets: [],
    photons: [],
    met: 3.2,
    invariantMass: 91.4,
    tags: ['Z boson', 'dimuon', '91 GeV'],
  },
  {
    id: 'CMS-Run2010B-00002',
    run: 149291,
    lumiSection: 87,
    event: 7124093,
    sqrtS: 7000,
    type: 'Z → e⁺e⁻ Candidate',
    classification: 'electroweak',
    description: 'A Z boson decaying into an electron–positron pair. The two electromagnetic energy deposits ' +
                 'in the ECAL have no associated hadronic activity and reconstruct to the Z mass within experimental resolution.',
    muons: [],
    electrons: [
      { pt: 38.6, eta: 1.12, phi: 0.45, charge: +1, color: '#00e5ff' },
      { pt: 44.2, eta: -0.38, phi: -2.71, charge: -1, color: '#00e5ff' },
    ],
    jets: [],
    photons: [],
    met: 5.1,
    invariantMass: 90.8,
    tags: ['Z boson', 'dielectron', '91 GeV'],
  },
  {
    id: 'CMS-Run2010B-00003',
    run: 149442,
    lumiSection: 19,
    event: 1038472,
    sqrtS: 7000,
    type: 'W → μν Candidate',
    classification: 'electroweak',
    description: 'A W boson decaying to a muon and neutrino. The high-pT isolated muon and substantial ' +
                 'missing transverse energy (from the undetected neutrino) are the hallmark signature. ' +
                 'Transverse mass reconstructs to ~80 GeV.',
    muons: [
      { pt: 52.1, eta: 0.31, phi: 2.08, charge: -1, color: '#ff4081' },
    ],
    electrons: [],
    jets: [
      { pt: 18.4, eta: 2.1, phi: -0.84, color: '#69ff47' },
    ],
    photons: [],
    met: 48.7,
    invariantMass: null,
    tags: ['W boson', 'muon', 'missing ET'],
  },
  {
    id: 'CMS-Run2010B-00004',
    run: 149553,
    lumiSection: 203,
    event: 20318844,
    sqrtS: 7000,
    type: 'Dijet QCD Event',
    classification: 'qcd',
    description: 'A high-energy QCD event with two back-to-back jets produced by quark–gluon scattering. ' +
                 'The jets are roughly balanced in pT as expected from momentum conservation. ' +
                 'QCD dijet events are the most abundant process at the LHC.',
    muons: [],
    electrons: [],
    jets: [
      { pt: 187.3, eta: 0.18, phi: 0.92, color: '#69ff47' },
      { pt: 174.6, eta: -0.24, phi: -2.19, color: '#69ff47' },
      { pt: 28.1,  eta: 1.83, phi: 1.47, color: '#69ff47' },
    ],
    photons: [],
    met: 21.3,
    invariantMass: null,
    tags: ['QCD', 'dijets', 'strong force'],
  },
  {
    id: 'CMS-Run2010B-00005',
    run: 149611,
    lumiSection: 55,
    event: 4872031,
    sqrtS: 7000,
    type: 'γ + jets Event',
    classification: 'electroweak',
    description: 'A prompt photon produced in association with hadronic jets. ' +
                 'The isolated high-pT photon is reconstructed in the ECAL with no associated charged track. ' +
                 'Photon+jets events are important backgrounds for Higgs searches and new physics.',
    muons: [],
    electrons: [],
    jets: [
      { pt: 72.4, eta: 0.61, phi: -2.14, color: '#69ff47' },
      { pt: 41.2, eta: -1.22, phi: 0.88, color: '#69ff47' },
    ],
    photons: [
      { pt: 98.7, eta: 0.04, phi: 1.08, color: '#ffd740' },
    ],
    met: 14.6,
    invariantMass: null,
    tags: ['photon', 'jets', 'prompt γ'],
  },
  {
    id: 'CMS-Run2010B-00006',
    run: 149753,
    lumiSection: 312,
    event: 31204716,
    sqrtS: 7000,
    type: 'tt̄ Candidate (semileptonic)',
    classification: 'top',
    description: 'A top quark pair event in the semileptonic decay channel: one top decays to W→μν, ' +
                 'the other to W→qq̄. The signature is one isolated muon, missing ET from the neutrino, ' +
                 'and four energetic jets (two of which come from b quarks).',
    muons: [
      { pt: 63.8, eta: -0.55, phi: 2.89, charge: -1, color: '#ff4081' },
    ],
    electrons: [],
    jets: [
      { pt: 142.1, eta: 0.34, phi: -0.31, color: '#69ff47', bTagged: true },
      { pt: 108.7, eta: -0.87, phi: 2.12, color: '#69ff47', bTagged: true },
      { pt: 67.3,  eta: 1.14, phi: -1.84, color: '#69ff47' },
      { pt: 54.9,  eta: -1.68, phi: 0.71, color: '#69ff47' },
    ],
    photons: [],
    met: 71.2,
    invariantMass: null,
    tags: ['top quark', 'b-jets', 'semileptonic'],
  },
  {
    id: 'CMS-Run2010B-00007',
    run: 149182,
    lumiSection: 174,
    event: 17438201,
    sqrtS: 7000,
    type: 'Multijet Event',
    classification: 'qcd',
    description: 'A complex multi-parton QCD scattering event producing five jets. ' +
                 'Events like this dominate the LHC trigger bandwidth and form the primary background ' +
                 'for many new physics searches. The jet multiplicity and angular distributions test QCD predictions.',
    muons: [],
    electrons: [],
    jets: [
      { pt: 231.0, eta: 0.09,  phi: 0.17,  color: '#69ff47' },
      { pt: 189.4, eta: -0.44, phi: -3.01, color: '#69ff47' },
      { pt: 88.6,  eta: 1.71,  phi: 1.53,  color: '#69ff47' },
      { pt: 63.1,  eta: -2.02, phi: -0.81, color: '#69ff47' },
      { pt: 41.7,  eta: 0.88,  phi: 2.61,  color: '#69ff47' },
    ],
    photons: [],
    met: 38.4,
    invariantMass: null,
    tags: ['QCD', 'multijet', '5 jets'],
  },
  {
    id: 'CMS-Run2010B-00008',
    run: 149291,
    lumiSection: 291,
    event: 29104455,
    sqrtS: 7000,
    type: 'Z → μ⁺μ⁻ + Jets',
    classification: 'electroweak',
    description: 'A Z boson produced in association with two energetic jets (Z+jets process). ' +
                 'This process is an important test of perturbative QCD and a major background to many ' +
                 'Higgs analyses. The dimuon invariant mass reconstructs cleanly to the Z mass.',
    muons: [
      { pt: 47.2, eta: 0.61,  phi: 1.81,  charge: +1, color: '#ff4081' },
      { pt: 43.9, eta: -0.74, phi: -1.34, charge: -1, color: '#ff4081' },
    ],
    electrons: [],
    jets: [
      { pt: 84.3, eta: 0.92, phi: -0.97, color: '#69ff47' },
      { pt: 61.7, eta: -1.48, phi: 2.24, color: '#69ff47' },
    ],
    photons: [],
    met: 9.8,
    invariantMass: 91.1,
    tags: ['Z boson', 'Z+jets', 'dimuon'],
  },
];

if (typeof module !== 'undefined') module.exports = { CMS_EVENTS };
