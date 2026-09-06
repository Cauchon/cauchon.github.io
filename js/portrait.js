/* Progressive enhancement: the original portrait remains visible without JS. */
(() => {
  const portrait = document.querySelector('.portrait');
  if (!portrait) return;
  const button = portrait.querySelector('button');
  const cutout = portrait.querySelector('.portrait__cutout');
  const greeting = portrait.querySelector('.portrait__greeting');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let wobble;
  const reset = () => {
    ['rx', 'ry', 'x', 'y'].forEach(axis => portrait.style.removeProperty(`--portrait-${axis}`));
  };
  button.disabled = false;
  portrait.classList.add('is-ready');
  button.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType !== 'mouse') return;
    const rect = button.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    portrait.style.setProperty('--portrait-rx', `${-y * 3}deg`);
    portrait.style.setProperty('--portrait-ry', `${x * 3}deg`);
    portrait.style.setProperty('--portrait-x', `${x * 14}px`);
    portrait.style.setProperty('--portrait-y', `${y * 14}px`);
  });
  button.addEventListener('pointerleave', reset);
  button.addEventListener('pointercancel', reset);
  button.addEventListener('blur', reset);
  button.addEventListener('click', () => {
    clearTimeout(timer);
    if (wobble) wobble.cancel();
    greeting.textContent = 'hey, I’m Justin.';
    portrait.classList.add('is-greeting');
    if (!motion.matches) {
      wobble = cutout.animate([
        { transform: 'rotate(-3deg)' },
        { transform: 'rotate(3deg)', offset: 0.3 },
        { transform: 'rotate(-5deg)', offset: 0.65 },
        { transform: 'rotate(-3deg)' }
      ], { duration: 600, easing: 'ease-in-out' });
    }
    timer = setTimeout(() => {
      portrait.classList.remove('is-greeting');
      greeting.textContent = '';
    }, 3000);
  });
  motion.addEventListener('change', () => { reset(); if (wobble) wobble.cancel(); });
})();
