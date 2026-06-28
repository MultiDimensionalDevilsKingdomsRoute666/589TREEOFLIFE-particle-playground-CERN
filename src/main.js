/**
 * main.js
 * Application entry point.
 * All components are self-initialising — this file handles
 * global setup and any cross-component coordination.
 */

(function main() {
  'use strict';

  /* ── Document ready ──────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log(
      '%c⬡ Particle Playground%c\nReal CERN Open Data · PDG 2024 · Educational Physics\nhttps://opendata.cern.ch',
      'color:#00e5ff;font-family:monospace;font-size:16px;font-weight:bold',
      'color:#8a9ab5;font-family:monospace;font-size:11px'
    );

    // Log data citation for transparency
    console.log(
      '%cData Citation:%c CMS Collaboration (2014). CMS primary datasets in AOD format from RunB of 2010. ' +
      'CERN Open Data Portal. DOI: 10.7483/OPENDATA.CMS.A342.9982',
      'color:#ffd740;font-family:monospace',
      'color:#8a9ab5;font-family:monospace'
    );
  }

})();
