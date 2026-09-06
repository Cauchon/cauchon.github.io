/* Progressive enhancement: the original portrait remains visible without JS. */
(() => {
  const portrait = document.querySelector('.portrait');
  if (!portrait) return;
  const button = portrait.querySelector('button');
  const avatar = portrait.querySelector('.portrait__habbo');
  const photo = portrait.querySelector('svg');
  const hint = portrait.querySelector('.portrait__hint');
  const greeting = portrait.querySelector('.portrait__greeting');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reset = () => {
    portrait.classList.remove('is-hovering');
    ['rx', 'ry', 'x', 'y'].forEach(axis => portrait.style.removeProperty(`--portrait-${axis}`));
  };
  // Decode before enabling the toggle so a slow connection never reveals a blank image.
  const enable = async () => {
    try {
      await avatar.decode();
      button.disabled = false;
      portrait.classList.add('is-ready');
    } catch {
      // Keep the original photograph if the avatar cannot be loaded.
    }
  };
  enable();
  const updateHover = event => {
    if (button.disabled || motion.matches || portrait.classList.contains('is-habbo') || event.pointerType !== 'mouse') return;
    portrait.classList.add('is-hovering');
    const rect = button.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    portrait.style.setProperty('--portrait-rx', `${-y * 3}deg`);
    portrait.style.setProperty('--portrait-ry', `${x * 3}deg`);
    portrait.style.setProperty('--portrait-x', `${x * 14}px`);
    portrait.style.setProperty('--portrait-y', `${y * 14}px`);
  };
  button.addEventListener('pointerenter', updateHover);
  button.addEventListener('pointermove', updateHover);
  button.addEventListener('pointerleave', reset);
  button.addEventListener('pointercancel', reset);
  button.addEventListener('blur', reset);
  button.addEventListener('click', () => {
    reset();
    const isHabbo = portrait.classList.toggle('is-habbo');
    button.setAttribute('aria-pressed', String(isHabbo));
    photo.setAttribute('aria-hidden', String(isHabbo));
    hint.textContent = isHabbo ? 'back to real life ↗' : 'a little pixel magic ↗';
    greeting.textContent = isHabbo ? 'Justin is now a Habbo character. Press again to return to the photograph.' : 'Justin’s photograph is now showing.';
  });
  motion.addEventListener('change', reset);
})();
