# ⬡ Particle Playground

> **Real CERN open collision data, transformed into an interactive physics laboratory anyone can explore.**

[![License: CC0](https://img.shields.io/badge/Data-CC0%20Public%20Domain-green)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Data: CERN Open Data](https://img.shields.io/badge/Data-CERN%20Open%20Data-blue)](https://opendata.cern.ch)
[![PDG 2024](https://img.shields.io/badge/Properties-PDG%202024-orange)](https://pdg.lbl.gov)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://mahmutpoyraz.github.io/particle-playground)

---

## Overview

Particle Playground is a browser-based interactive physics simulator built on **real collision data from the CMS detector at the Large Hadron Collider (LHC)**. It bridges the gap between frontier particle physics research and public understanding, making the subatomic world fully explorable without any prior physics knowledge.

The project demonstrates how open scientific data can be transformed into rigorous educational experiences — an approach aligned with CERN's own outreach mission.

---

## Features

### Interactive Collider
Configure beam parameters (centre-of-mass energy from 900 GeV to 13.6 TeV, beam type p–p / p–Pb / Pb–Pb, luminosity) and simulate collisions. The physics engine computes production cross-sections using **parametrised fits to NLO/NNLO theoretical predictions** calibrated against published LHC measurements, then samples final-state particle kinematics from physically accurate phase-space distributions.

Simulated processes:
- QCD dijet production (quark–quark and gluon–gluon scattering)
- W and Z boson production via quark–antiquark annihilation
- Higgs boson production via gluon–gluon fusion (top quark loop)
- Top quark pair production
- Prompt photon + jets (QCD Compton process)

### Feynman Diagram Renderer
Every collision automatically generates the corresponding **animated Feynman diagram** — the precise mathematical notation used in Quantum Field Theory. Diagrams are physically correct: gluon propagators rendered as curly lines, electroweak bosons as wavy lines, fermion flow with arrow direction. Covers all five simulated processes including the ggF Higgs top-quark loop.

### Particle Zoo
Every fundamental particle of the Standard Model, with properties sourced directly from the **Particle Data Group (PDG) 2024 Review**. Includes all 6 quarks, 6 leptons, 4 gauge bosons, and the Higgs boson — each with mass, charge, spin, lifetime, discovery year, and force interactions. Interactive modal with physics description for each particle.

### Real Collision Events
Actual CMS detector events rendered in a **transverse (r-φ) event display**, including:
- Charged particle tracks with curvature from B = 3.8 T solenoidal field
- Hadronic jets as filled cones (ΔR ≈ 0.4)
- Photon deposits in the ECAL (no associated track)
- Missing transverse energy arrows (neutrino inference)
- b-jet tagging annotations

Events: Z→μ⁺μ⁻, Z→e⁺e⁻, W→μν, QCD dijets, γ+jets, tt̄ (semileptonic), multijet, Z+jets.

### Invariant Mass Histogram
Accumulates the **invariant mass of particle pairs** across collision events and renders a live histogram. A resonance peak emerges near 91.2 GeV in the dimuon channel after sufficient events — a direct reproduction of the experimental technique used to discover the Z boson in 1983. The formula M² = (E₁+E₂)² − |p⃗₁+p⃗₂|² is computed for each event pair.

### 17-Step Guided Tour
A complete educational walkthrough with animated diagrams at each step, covering: LHC operation and beam types, centre-of-mass energy and E=mc², production cross-sections and luminosity, event display interpretation, Feynman diagram notation, Standard Model particle families, and the invariant mass discovery method.

### Learn System
Context-sensitive inline tooltips and deep-dive explanation panels throughout the interface. Every technical term has an accessible explanation. A "What You Can Learn Here" section provides structured coverage of seven physics topics at lecture depth.

---

## Physics Accuracy

| Component | Source |
|---|---|
| Particle masses, charges, spins, lifetimes | PDG 2024 Review of Particle Physics |
| W/Z production cross-sections | FEWZ NNLO QCD calculation |
| Higgs production cross-section (ggF) | LHC Higgs Cross Section Working Group |
| tt̄ production cross-section | Hathor / Top++ NNLO+NNLL |
| QCD dijet cross-section | NLO parametrisation, calibrated to LHC data |
| CMS solenoidal magnetic field | B = 3.8 T (CMS Run 2 specification) |
| Collision event format | CMS Open Data AOD format, Run 2010B |
| Luminosity levels | 10³⁰ – 10³⁴ cm⁻²s⁻¹ (matching LHC operations 2010–2023) |
| Track curvature | Lorentz force in 3.8 T field, pT-dependent radius |
| Invariant mass | Lorentz-invariant four-momentum calculation |

---

## Data & License

All collision event data is based on:

> **CMS Collaboration** (2014). *CMS primary datasets in AOD format from RunB of 2010
> (/Mu/Run2010B-Apr21ReReco-v1/AOD)*. CERN Open Data Portal.
> DOI: [10.7483/OPENDATA.CMS.A342.9982](https://doi.org/10.7483/OPENDATA.CMS.A342.9982)

The CERN Open Data Portal publishes data under the **Creative Commons CC0 Public Domain Waiver** — freely usable for any purpose without restriction. See [opendata.cern.ch](https://opendata.cern.ch) for full terms.

---

## Project Structure

```
particle-playground/
├── index.html
└── src/
    ├── styles/
    │   ├── main.css          # Design system, global layout, hero, nav, about
    │   ├── collider.css      # Collider section, controls, canvas, particle detail
    │   ├── events.css        # Particle Zoo grid, event display, modal
    │   ├── histogram.css     # Invariant mass histogram layout
    │   ├── feynman.css       # Feynman diagram panel
    │   ├── learn.css         # Tooltip and deep-dive panel system
    │   └── tour.css          # Guided tour, welcome modal, spotlight
    ├── data/
    │   ├── particles.js      # Standard Model database (PDG 2024)
    │   └── events.js         # CMS Run 2010B collision event data
    ├── physics/
    │   ├── crossSections.js  # NLO/NNLO cross-section parametrisations
    │   └── collisionEngine.js # Collision sampling and kinematic generation
    ├── components/
    │   ├── heroCanvas.js     # Animated particle network background
    │   ├── collider.js       # Collider UI, canvas renderer, track animation
    │   ├── zoo.js            # Particle Zoo grid and detail modal
    │   ├── eventDisplay.js   # CMS-style transverse event display
    │   ├── histogram.js      # Invariant mass histogram with peak detection
    │   ├── feynman.js        # Feynman diagram renderer (5 processes)
    │   ├── learn.js          # Tooltip and deep-dive explanation system
    │   ├── tour.js           # 17-step guided tour with animated visuals
    │   └── sound.js          # Web Audio API collision sound synthesis
    └── utils/
        ├── nav.js            # Navigation, scroll tracking, active states
        ├── animations.js     # Intersection observer, counter animations
        └── main.js           # Application entry point
```

---

## Running Locally

No build step, no dependencies, no installation required.

```bash
# Option 1: Python (recommended)
cd particle-playground
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: Node.js
npx serve .

# Option 3: VS Code
# Right-click index.html → Open with Live Server
```

**Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## References

1. Particle Data Group (2024). *Review of Particle Physics*. PTEP 2022, 083C01. https://pdg.lbl.gov
2. CERN Open Data Portal. https://opendata.cern.ch
3. LHC Higgs Cross Section Working Group. https://twiki.cern.ch/twiki/bin/view/LHCPhysics/LHCHXSWG
4. CMS Collaboration (2008). *The CMS experiment at the CERN LHC*. JINST 3, S08004.
5. Gavin, S. et al. (2010). *FEWZ 2.0: A code for hadronic Z production at next-to-next-to-leading order*. arXiv:1011.3540
6. Aliev, M. et al. (2010). *HATHOR: HAdronic Top and Heavy quarks crOss section calculatoR*. arXiv:1007.1327

---

*Built on real science. Open source. Educational use encouraged.*
