(() => {
  const emailLink = document.querySelector('[data-analytics-contact="email"]');
  if (!emailLink) return;

  emailLink.addEventListener('click', () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'contact_click', {
        contact_method: 'email',
        contact_location: 'elsewhere'
      });
    }
  });
})();
