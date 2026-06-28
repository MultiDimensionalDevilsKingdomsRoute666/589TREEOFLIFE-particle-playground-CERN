/**
 * animations.js
 * Scroll-triggered reveal animations and hero stat counters.
 */

(function initAnimations() {

  /* ── Intersection Observer for .reveal elements ──────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Observe all reveal elements added dynamically too
  function observeReveal() {
    document.querySelectorAll('.reveal:not(.observed)').forEach(el => {
      el.classList.add('observed');
      io.observe(el);
    });
  }
  observeReveal();

  // Re-check on section entry (zoo cards get added dynamically)
  const mutObs = new MutationObserver(observeReveal);
  mutObs.observe(document.body, { childList: true, subtree: true });

  /* ── Hero stat counters ──────────────────────────────────────────── */
  const statValues = document.querySelectorAll('.hero__stat-value[data-count]');

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target = +el.dataset.count;
    const duration = 1800;
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterIO.observe(el));

  /* ── Section headers reveal ──────────────────────────────────────── */
  document.querySelectorAll('.section__header, .section__title, .section__desc').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });

})();
