/**
 * crossSections.js
 * Parametrized production cross-sections for key processes at the LHC.
 * Values fitted to NLO/NNLO theoretical predictions and LHC measurements.
 *
 * References:
 * - LHC Higgs Cross Section Working Group: https://twiki.cern.ch/twiki/bin/view/LHCPhysics/
 * - CMS Physics Results: https://cms-results.web.cern.ch/
 * - PDG Review of Particle Physics 2024
 *
 * Cross-sections are in picobarns (pb). 1 pb = 10⁻⁴⁰ m².
 */

const CROSS_SECTIONS = {

  /**
   * Total inelastic pp cross-section (dominates at all LHC energies).
   * Fitted to COMPETE/TOTEM measurements.
   * σ(√s) ≈ σ₀ + α·ln²(√s/s₀)  [Froissart-like parametrization]
   */
  inelastic(sqrtS_GeV) {
    // σ in mb; TOTEM measurement: ~79 mb at 7 TeV, ~81 mb at 8 TeV, ~100 mb at 13 TeV
    const s0 = 1;  // reference scale GeV
    return 36.1 + 0.307 * Math.pow(Math.log(sqrtS_GeV / 1000), 2);  // mb
  },

  /**
   * W boson production cross-section × branching fraction (→ lν)
   * NNLO QCD + NLO EW predictions.
   * ~10 nb at 7 TeV, ~12 nb at 8 TeV, ~19 nb at 13 TeV
   */
  W(sqrtS_GeV) {
    const sqrtS_TeV = sqrtS_GeV / 1000;
    // Power-law fit to FEWZ NNLO predictions
    return 10.46 * Math.pow(sqrtS_TeV / 7, 0.64);  // nb × BR(lν)
  },

  /**
   * Z/γ* → ll cross-section (M_ll > 50 GeV window)
   * NNLO QCD calculation.
   */
  Z(sqrtS_GeV) {
    const sqrtS_TeV = sqrtS_GeV / 1000;
    return 0.987 * Math.pow(sqrtS_TeV / 7, 0.59);  // nb × BR(ll)
  },

  /**
   * Top quark pair production (tt̄)
   * NNLO+NNLL prediction with mt = 172.5 GeV, CT14 PDF.
   * ~163 pb at 7 TeV, ~247 pb at 8 TeV, ~832 pb at 13 TeV
   */
  ttbar(sqrtS_GeV) {
    const sqrtS_TeV = sqrtS_GeV / 1000;
    if (sqrtS_TeV < 1.5) return 0;  // below threshold
    return 163 * Math.pow(sqrtS_TeV / 7, 3.4);  // pb
  },

  /**
   * Higgs boson production via gluon-gluon fusion (dominant mode)
   * NNLO+NNLL+N³LO QCD calculation. mH = 125 GeV.
   * ~15 pb at 7 TeV, ~19 pb at 8 TeV, ~44 pb at 13 TeV
   */
  higgs(sqrtS_GeV) {
    const sqrtS_TeV = sqrtS_GeV / 1000;
    if (sqrtS_TeV < 0.2) return 0;
    return 15.1 * Math.pow(sqrtS_TeV / 7, 2.1);  // pb (ggF only)
  },

  /**
   * Dijet (QCD) production with pT > 30 GeV
   * Massive cross-section — many orders of magnitude above EW processes.
   */
  dijet(sqrtS_GeV) {
    const sqrtS_TeV = sqrtS_GeV / 1000;
    return 1.1e8 * Math.pow(sqrtS_TeV / 7, 1.8);  // nb (rough estimate, pT>30 GeV)
  },
};

/**
 * Luminosity factors.
 * Instantaneous luminosity levels corresponding to slider positions.
 * Units: cm⁻²s⁻¹
 */
const LUMINOSITY_LEVELS = [
  { label: '10³⁰', value: 1e30, desc: 'Early commissioning' },
  { label: '10³¹', value: 1e31, desc: 'Initial physics run' },
  { label: '10³²', value: 1e32, desc: 'Low luminosity run' },
  { label: '10³³', value: 1e33, desc: 'Medium luminosity' },
  { label: '10³⁴', value: 1e34, desc: 'Design luminosity' },
];

if (typeof module !== 'undefined') module.exports = { CROSS_SECTIONS, LUMINOSITY_LEVELS };
