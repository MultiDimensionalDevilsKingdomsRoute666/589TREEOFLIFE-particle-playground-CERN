/**
 * nav.js
 * Navigation: scroll-based active link, sticky header, mobile burger.
 */

(function initNav() {
  const nav      = document.getElementById('nav');
  const links    = document.querySelectorAll('.nav__link[data-section]');
  const burger   = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav__links');

  /* ── Scroll → sticky + active link ──────────────────────────────── */
  const sections = Array.from(document.querySelectorAll('section[id], header[id]')).filter(s => s.id);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      // Sticky
      nav.classList.toggle('scrolled', window.scrollY > 40);

      // Active section
      let current = '';
      sections.forEach(s => {
        const top = s.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.4) current = s.id;
      });

      links.forEach(l => {
        l.classList.toggle('active', l.dataset.section === current);
      });

      ticking = false;
    });
  }, { passive: true });

  /* ── Smooth scroll on click ──────────────────────────────────────── */
  links.forEach(l => {
    l.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(l.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu
      navLinks.classList.remove('open');
    });
  });

  /* ── Mobile burger ───────────────────────────────────────────────── */
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

})();
