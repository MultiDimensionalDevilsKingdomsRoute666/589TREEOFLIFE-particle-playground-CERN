/**
 * sound.js — Web Audio API collision sound effect
 * Realistic particle accelerator impact sound using synthesis.
 */
(function initSound() {
  let audioCtx = null;
  let enabled  = true;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playCollision(energy_GeV) {
    if (!enabled) return;
    try {
      const ctx   = getCtx();
      const now   = ctx.currentTime;
      const scale = Math.min(1, energy_GeV / 13600); // 0–1

      // Impact transient — short noise burst
      const bufLen  = ctx.sampleRate * 0.08;
      const buffer  = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data    = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Band-pass filter on noise (makes it sound more physical)
      const bpf = ctx.createBiquadFilter();
      bpf.type            = 'bandpass';
      bpf.frequency.value = 800 + scale * 1200;
      bpf.Q.value         = 0.8;

      // Low thud (sub-bass hit)
      const osc1 = ctx.createOscillator();
      osc1.type            = 'sine';
      osc1.frequency.value = 80 + scale * 60;

      const osc2 = ctx.createOscillator();
      osc2.type            = 'sawtooth';
      osc2.frequency.value = 220 + scale * 180;

      // Gains and envelopes
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35 + scale * 0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.5 + scale * 0.3, now);
      osc1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.12 + scale * 0.1, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      // Crackle layer for high-energy events
      if (scale > 0.4) {
        const crackLen = ctx.sampleRate * 0.18;
        const crackBuf = ctx.createBuffer(1, crackLen, ctx.sampleRate);
        const cd = crackBuf.getChannelData(0);
        for (let i = 0; i < crackLen; i++) {
          cd[i] = Math.random() > 0.92 ? (Math.random() * 2 - 1) * 0.6 : 0;
        }
        const crackSrc = ctx.createBufferSource();
        crackSrc.buffer = crackBuf;
        const crackGain = ctx.createGain();
        crackGain.gain.setValueAtTime((scale - 0.4) * 0.5, now);
        crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        crackSrc.connect(crackGain);
        crackGain.connect(ctx.destination);
        crackSrc.start(now);
        crackSrc.stop(now + 0.2);
      }

      // Master compressor
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value     = 4;

      // Connect graph
      noiseSource.connect(bpf);
      bpf.connect(noiseGain);
      noiseGain.connect(comp);

      osc1.connect(osc1Gain);
      osc1Gain.connect(comp);

      osc2.connect(osc2Gain);
      osc2Gain.connect(comp);

      comp.connect(ctx.destination);

      // Start and stop
      noiseSource.start(now);
      noiseSource.stop(now + 0.15);
      osc1.start(now);
      osc1.stop(now + 0.25);
      osc2.start(now);
      osc2.stop(now + 0.16);

    } catch (e) {
      // Silently fail if audio not supported
    }
  }

  // Expose globally
  window.playCollisionSound = playCollision;

  // Sound toggle button in nav
  const soundBtn = document.createElement('button');
  soundBtn.id        = 'soundToggle';
  soundBtn.className = 'nav__link';
  soundBtn.title     = 'Toggle collision sound';
  soundBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5H4L7 2V12L4 9H2V5Z" fill="currentColor"/>
      <path id="soundWave1" d="M9 4.5C9.8 5.3 9.8 8.7 9 9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      <path id="soundWave2" d="M10.5 3C12 4.5 12 9.5 10.5 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  `;
  soundBtn.style.cssText = 'opacity:0.6;display:flex;align-items:center;padding:0.4rem 0.5rem;';
  soundBtn.addEventListener('click', () => {
    enabled = !enabled;
    soundBtn.style.opacity = enabled ? '0.6' : '0.25';
    soundBtn.title = enabled ? 'Mute collision sound' : 'Unmute collision sound';
  });

  window.addEventListener('load', () => {
    const navLinks = document.querySelector('.nav__links');
    if (navLinks) navLinks.appendChild(soundBtn);
  });

})();
